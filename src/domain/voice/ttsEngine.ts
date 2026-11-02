import { CharacterProfile, TtsPlaybackStatus, VoiceSettings } from '../../types';
import { getProfileById } from './catalog';

export interface DialogueTurn {
  speaker: 'Alex' | 'Sam';
  text: string;
  style?: string;
}

class TtsEngine {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private currentSourceNode: AudioBufferSourceNode | null = null;
  private audioCtx: AudioContext | null = null;
  private isSpeaking: boolean = false;
  private isLoading: boolean = false;
  private activeAbortController: AbortController | null = null;

  private audioCache: Map<string, string> = new Map();
  private listeners: Set<(speaking: boolean) => void> = new Set();
  private statusListeners: Set<(status: TtsPlaybackStatus) => void> = new Set();

  private status: TtsPlaybackStatus = {
    isSpeaking: false,
    isLoading: false,
    activeEngine: 'gemini-3.8-flash-lite-tts',
    activeVoiceName: 'Charon',
    lastLatencyMs: 0,
    cachedHit: false,
    cacheCount: 0,
  };

  constructor() {
    if (typeof window !== 'undefined') {
      const unlockMobileAudio = () => {
        try {
          const AudioContextClass =
            window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          if (AudioContextClass && !this.audioCtx) {
            this.audioCtx = new AudioContextClass();
          }
          if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume().catch(() => {});
          }
        } catch {
          // Ignore unlock errors
        }
      };

      window.addEventListener('touchstart', unlockMobileAudio, { passive: true, once: true });
      window.addEventListener('click', unlockMobileAudio, { passive: true, once: true });
    }
  }

  public subscribe(listener: (speaking: boolean) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public subscribeStatus(listener: (status: TtsPlaybackStatus) => void) {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => this.statusListeners.delete(listener);
  }

  private updateStatus(partial: Partial<TtsPlaybackStatus>) {
    this.status = {
      ...this.status,
      ...partial,
      isSpeaking: this.isSpeaking,
      isLoading: this.isLoading,
      cacheCount: this.audioCache.size,
    };
    this.listeners.forEach((l) => l(this.isSpeaking || this.isLoading));
    this.statusListeners.forEach((l) => l(this.status));
  }

  public getStatus(): TtsPlaybackStatus {
    return this.status;
  }

  public clearCache() {
    this.audioCache.clear();
    this.updateStatus({ cachedHit: false });
  }

  public stop() {
    if (this.activeAbortController) {
      this.activeAbortController.abort();
      this.activeAbortController = null;
    }

    if (this.currentSourceNode) {
      try {
        this.currentSourceNode.stop();
        this.currentSourceNode.disconnect();
      } catch {
        // Ignore already stopped
      }
      this.currentSourceNode = null;
    }

    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // Ignore
      }
      this.currentAudio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    this.isSpeaking = false;
    this.isLoading = false;
    this.currentUtterance = null;
    this.updateStatus({});
  }

  /**
   * Play base64 WAV audio returned by Gemini 3.8 TTS using mobile-safe Web Audio API
   * with HTMLAudioElement fallback.
   */
  private async playWavBase64(base64Audio: string, playbackRate: number = 1.0): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const binaryString = window.atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // Prefer Web Audio API on mobile for glitch-free instant playback
        const AudioContextClass =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          if (!this.audioCtx) {
            this.audioCtx = new AudioContextClass();
          }
          if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume().catch(() => {});
          }

          // Slice buffer copy because decodeAudioData detaches the ArrayBuffer
          const bufferCopy = bytes.buffer.slice(0);
          this.audioCtx
            .decodeAudioData(bufferCopy)
            .then((audioBuffer) => {
              if (!this.audioCtx) {
                resolve(false);
                return;
              }
              const source = this.audioCtx.createBufferSource();
              source.buffer = audioBuffer;
              // Slight rate adjustment if user requested very slow or fast playback
              const clampedRate = Math.max(0.7, Math.min(1.35, playbackRate));
              source.playbackRate.value = clampedRate;
              source.connect(this.audioCtx.destination);

              this.currentSourceNode = source;
              this.isLoading = false;
              this.isSpeaking = true;
              this.updateStatus({});

              source.onended = () => {
                if (this.currentSourceNode === source) {
                  this.currentSourceNode = null;
                  this.isSpeaking = false;
                  this.updateStatus({});
                }
                resolve(true);
              };

              source.start(0);
            })
            .catch(() => {
              // Fallback to HTML5 Audio element with Blob URL
              this.playWithHtmlAudio(bytes, playbackRate).then(resolve);
            });
          return;
        }

        this.playWithHtmlAudio(bytes, playbackRate).then(resolve);
      } catch (e) {
        console.warn('Error decoding WAV audio:', e);
        this.isLoading = false;
        this.isSpeaking = false;
        this.updateStatus({});
        resolve(false);
      }
    });
  }

  private playWithHtmlAudio(bytes: Uint8Array, playbackRate: number): Promise<boolean> {
    return new Promise((resolve) => {
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.setAttribute('playsinline', 'true');
      audio.playbackRate = Math.max(0.7, Math.min(1.35, playbackRate));
      this.currentAudio = audio;

      audio.onplay = () => {
        this.isLoading = false;
        this.isSpeaking = true;
        this.updateStatus({});
      };

      audio.onended = () => {
        URL.revokeObjectURL(url);
        if (this.currentAudio === audio) {
          this.currentAudio = null;
          this.isSpeaking = false;
          this.updateStatus({});
        }
        resolve(true);
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        if (this.currentAudio === audio) {
          this.currentAudio = null;
          this.isLoading = false;
          this.isSpeaking = false;
          this.updateStatus({});
        }
        resolve(false);
      };

      audio.play().catch(() => {
        URL.revokeObjectURL(url);
        this.isLoading = false;
        this.isSpeaking = false;
        this.updateStatus({});
        resolve(false);
      });
    });
  }

  /**
   * Speak a dual-speaker conversation using Gemini 3.8 Flash TTS
   */
  public async speakDialogue(
    dialogueTurns: DialogueTurn[],
    settings?: Partial<VoiceSettings>
  ): Promise<boolean> {
    this.stop();
    const startTime = performance.now();
    this.isLoading = true;
    this.updateStatus({
      activeEngine: 'gemini-3.8-flash-tts',
      activeVoiceName: 'Puck & Kore',
      cachedHit: false,
    });

    const abortController = new AbortController();
    this.activeAbortController = abortController;

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dialogueTurns,
          model: 'gemini-3.8-flash-tts',
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (!data.audioBase64) {
        throw new Error('Missing audioBase64');
      }

      const latencyMs = Math.round(performance.now() - startTime);
      this.updateStatus({
        activeEngine: 'gemini-3.8-flash-tts',
        activeVoiceName: 'Puck & Kore',
        lastLatencyMs: latencyMs,
      });

      return await this.playWavBase64(data.audioBase64, settings?.speechSpeed ?? 1.0);
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') {
        return false;
      }
      console.warn('Gemini 3.8 Dialogue TTS fallback to Web Speech:', err);
      const combinedText = dialogueTurns.map((t) => t.text.replace(/<[^>]+>|\|[^|]+\|/g, '')).join(' ');
      return this.speakFallbackWebSpeech(combinedText, settings);
    }
  }

  /**
   * Primary speech method: Uses Gemini 3.8 TTS (`gemini-3.8-flash-lite-tts` or `gemini-3.8-flash-tts`)
   * with mobile audio caching and automatic offline fallback.
   */
  public async speak(
    text: string,
    settings?: Partial<VoiceSettings>,
    profileOverride?: CharacterProfile,
    customStylePrompt?: string
  ): Promise<boolean> {
    if (!text || !text.trim()) return false;

    this.stop();

    const profile =
      profileOverride ||
      getProfileById(settings?.selectedCharacterProfile || 'adult_male');

    const engineMode = settings?.engineSelectionMode || 'CLOUD_FIRST';
    if (engineMode === 'OFFLINE_ONLY') {
      return this.speakFallbackWebSpeech(text, settings, profile);
    }

    const speed = settings?.speechSpeed ?? 0.92;
    const requestedModel = settings?.geminiModel || 'gemini-3.8-flash-lite-tts';
    const cacheEnabled = settings?.audioCacheEnabled ?? true;
    const cacheKey = `${profile.id}::${requestedModel}::${speed.toFixed(2)}::${customStylePrompt || ''}::${text.trim()}`;

    if (cacheEnabled && this.audioCache.has(cacheKey)) {
      const cachedBase64 = this.audioCache.get(cacheKey)!;
      this.updateStatus({
        activeEngine: requestedModel,
        activeVoiceName: profile.geminiVoiceName,
        lastLatencyMs: 4,
        cachedHit: true,
      });
      return this.playWavBase64(cachedBase64, 1.0);
    }

    const startTime = performance.now();
    this.isLoading = true;
    this.updateStatus({
      activeEngine: requestedModel,
      activeVoiceName: profile.geminiVoiceName,
      cachedHit: false,
    });

    const abortController = new AbortController();
    this.activeAbortController = abortController;

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          profileId: profile.id,
          voiceName: profile.geminiVoiceName,
          style: customStylePrompt || profile.geminiStylePrompt,
          speed,
          model: requestedModel,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`TTS API returned ${response.status}`);
      }

      const data = await response.json();
      if (!data.audioBase64) {
        throw new Error('No audioBase64 in response');
      }

      if (cacheEnabled) {
        // Keep cache bounded to 60 clips on mobile
        if (this.audioCache.size >= 60) {
          const oldestKey = this.audioCache.keys().next().value;
          if (oldestKey) this.audioCache.delete(oldestKey);
        }
        this.audioCache.set(cacheKey, data.audioBase64);
      }

      const latencyMs = Math.round(performance.now() - startTime);
      this.updateStatus({
        activeEngine: data.model || requestedModel,
        activeVoiceName: data.voiceName || profile.geminiVoiceName,
        lastLatencyMs: latencyMs,
        cachedHit: false,
      });

      return await this.playWavBase64(data.audioBase64, 1.0);
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') {
        return false;
      }
      console.warn('Gemini 3.8 TTS unavailable, falling back to browser SpeechSynthesis:', err);
      return this.speakFallbackWebSpeech(text, settings, profile);
    }
  }

  private speakFallbackWebSpeech(
    text: string,
    settings?: Partial<VoiceSettings>,
    profileOverride?: CharacterProfile
  ): Promise<boolean> {
    return new Promise((resolve) => {
      this.isLoading = false;
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        this.isSpeaking = false;
        this.updateStatus({});
        resolve(false);
        return;
      }

      const profile =
        profileOverride ||
        getProfileById(settings?.selectedCharacterProfile || 'adult_male');

      const cleanText = text.replace(/<[^>]+>|\|[^|]+\|/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';

      const rateMultiplier = settings?.speechSpeed ?? 1.0;
      const pitchMultiplier = settings?.speechPitch ?? 1.0;

      utterance.rate = Math.max(0.5, Math.min(2.0, profile.baseRate * rateMultiplier));
      utterance.pitch = Math.max(0.5, Math.min(2.0, profile.basePitch * pitchMultiplier));

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const matchingVoice =
          voices.find((v) => {
            const isEn = v.lang.startsWith('en');
            const name = v.name.toLowerCase();
            if (profile.preferredGender === 'female') {
              return (
                isEn &&
                (name.includes('female') ||
                  name.includes('samantha') ||
                  name.includes('zira') ||
                  name.includes('victoria') ||
                  name.includes('karen'))
              );
            } else {
              return (
                isEn &&
                (name.includes('male') ||
                  name.includes('david') ||
                  name.includes('george') ||
                  name.includes('daniel') ||
                  name.includes('alex'))
              );
            }
          }) ||
          voices.find((v) => v.lang.startsWith('en')) ||
          voices[0];

        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.updateStatus({
          activeEngine: 'web-speech-fallback',
          activeVoiceName: profile.nameEn,
        });
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        this.updateStatus({});
        resolve(true);
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        this.updateStatus({});
        resolve(false);
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    });
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking || this.isLoading;
  }
}

export const ttsEngine = new TtsEngine();
