import { talkMeDb } from '../../core/db/talkMeDb';
import { getProfileById } from '../../domain/voice/catalog';

export type SubscriptionTier = 'FREE' | 'PREMIUM';

export interface TTSSettings {
  tier: SubscriptionTier;
  preferredVoiceProfileId: string;
  speed: number;
  pitch: number;
  cacheEnabled: boolean;
  highlightWords: boolean;
}

export interface SpeakOptions {
  text: string;
  lang?: 'en-US' | 'en-GB';
  profileId?: string;
  speed?: number;
  style?: string;
  onWordBoundary?: (word: string, charIndex: number, wordIndex: number) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export interface SpeechProvider {
  readonly id: 'gemini-tts' | 'native-web-speech';
  readonly requiresPremium: boolean;
  isAvailable(): boolean;
  speak(options: SpeakOptions): Promise<{
    providerUsed: string;
    voiceName: string;
    latencyMs: number;
    cached: boolean;
  }>;
  stop(): void;
}

// ============================================================================
// 1. SUBSCRIPTION SERVICE (FREEMIUM ENTITLEMENT BOUNDARY)
// ============================================================================

const SUBSCRIPTION_STORAGE_KEY = 'talkme_subscription_tier_v1';

export class SubscriptionService {
  private currentTier: SubscriptionTier = 'PREMIUM';
  private listeners = new Set<(tier: SubscriptionTier) => void>();

  constructor() {
    try {
      const saved = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY) as SubscriptionTier | null;
      if (saved === 'FREE' || saved === 'PREMIUM') {
        this.currentTier = saved;
      }
    } catch {
      // ignore storage errors
    }
  }

  getTier(): SubscriptionTier {
    return this.currentTier;
  }

  isPremiumEntitled(): boolean {
    return this.currentTier === 'PREMIUM';
  }

  async setTier(tier: SubscriptionTier): Promise<SubscriptionTier> {
    this.currentTier = tier;
    try {
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, tier);
      await fetch('/api/subscription/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      }).catch(() => {});
    } catch {
      // ignore offline
    }
    this.listeners.forEach((cb) => cb(this.currentTier));
    return this.currentTier;
  }

  async verifyServerEntitlement(): Promise<boolean> {
    if (this.currentTier !== 'PREMIUM') return false;
    try {
      const res = await fetch('/api/subscription/status', {
        headers: { 'X-TalkMe-Tier': this.currentTier },
      });
      if (!res.ok) return this.currentTier === 'PREMIUM';
      const data = await res.json();
      return Boolean(data.geminiEntitled);
    } catch {
      return this.currentTier === 'PREMIUM';
    }
  }

  subscribe(listener: (tier: SubscriptionTier) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const subscriptionService = new SubscriptionService();

// ============================================================================
// 2. SPEECH CACHE (MEMORY + INDEXEDDB DEXIE PERSISTENCE)
// ============================================================================

export class SpeechCache {
  private memoryMap = new Map<string, string>();

  buildKey(text: string, profileId: string, speed: number): string {
    return `${profileId}__${speed.toFixed(2)}__${text.trim().toLowerCase()}`;
  }

  async get(key: string): Promise<string | null> {
    if (this.memoryMap.has(key)) {
      return this.memoryMap.get(key) || null;
    }
    try {
      const row = await talkMeDb.audioCache.get(key);
      if (row?.audioBase64) {
        this.memoryMap.set(key, row.audioBase64);
        return row.audioBase64;
      }
    } catch {
      // ignore IndexedDB errors in restricted environments
    }
    return null;
  }

  async set(key: string, text: string, voiceName: string, audioBase64: string): Promise<void> {
    this.memoryMap.set(key, audioBase64);
    try {
      await talkMeDb.audioCache.put({
        cacheKey: key,
        text,
        provider: 'gemini',
        voiceName,
        audioBase64,
        mimeType: 'audio/wav',
        createdAt: Date.now(),
      });
    } catch {
      // ignore IndexedDB quota issues
    }
  }

  async clear(): Promise<void> {
    this.memoryMap.clear();
    try {
      await talkMeDb.audioCache.clear();
    } catch {
      // ignore
    }
  }
}

export const speechCache = new SpeechCache();

// ============================================================================
// 3. NATIVE SPEECH PROVIDER (FREE USERS & OFFLINE FALLBACK)
// ============================================================================

export class NativeSpeechProvider implements SpeechProvider {
  readonly id = 'native-web-speech' as const;
  readonly requiresPremium = false;
  private wordTimer: number | null = null;

  isAvailable(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  stop(): void {
    if (this.wordTimer) {
      window.clearInterval(this.wordTimer);
      this.wordTimer = null;
    }
    if (this.isAvailable()) {
      window.speechSynthesis.cancel();
    }
  }

  async speak(options: SpeakOptions): Promise<{
    providerUsed: string;
    voiceName: string;
    latencyMs: number;
    cached: boolean;
  }> {
    this.stop();
    const startTime = performance.now();
    const cleanText = options.text
      .replace(/<breath>|<laugh>|<gasp>|\|yeah\||\|mhm\|/gi, '')
      .trim();

    if (!cleanText) {
      options.onEnd?.();
      return { providerUsed: 'native-web-speech', voiceName: 'Default', latencyMs: 0, cached: false };
    }

    const words = cleanText.split(/\s+/);
    options.onStart?.();

    if (!this.isAvailable()) {
      // Simulated word boundary progression when browser Web Speech API is absent (e.g. headless test runner)
      words.forEach((w, idx) => {
        options.onWordBoundary?.(w, idx * 5, idx);
      });
      await new Promise((r) => setTimeout(r, Math.min(600, words.length * 80)));
      options.onEnd?.();
      return {
        providerUsed: 'native-web-speech-fallback',
        voiceName: 'Browser Fallback',
        latencyMs: Math.round(performance.now() - startTime),
        cached: false,
      };
    }

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = options.lang || 'en-US';
      utterance.rate = Math.max(0.65, Math.min(1.3, options.speed || 0.92));

      const voices = window.speechSynthesis.getVoices();
      const enVoice =
        voices.find((v) => v.lang.startsWith('en-US') && /natural|google|samantha/i.test(v.name)) ||
        voices.find((v) => v.lang.startsWith('en')) ||
        null;

      if (enVoice) {
        utterance.voice = enVoice;
      }

      let wordIdx = 0;
      utterance.onboundary = (event) => {
        if (event.name === 'word' || wordIdx < words.length) {
          const w = words[wordIdx] || '';
          options.onWordBoundary?.(w, event.charIndex || 0, wordIdx);
          wordIdx++;
        }
      };

      // Backup timer for browsers that don't fire onboundary reliably
      const avgWordMs = Math.max(220, Math.round(320 / (options.speed || 0.92)));
      this.wordTimer = window.setInterval(() => {
        if (wordIdx < words.length) {
          options.onWordBoundary?.(words[wordIdx], 0, wordIdx);
          wordIdx++;
        } else if (this.wordTimer) {
          window.clearInterval(this.wordTimer);
          this.wordTimer = null;
        }
      }, avgWordMs);

      const finish = () => {
        if (this.wordTimer) {
          window.clearInterval(this.wordTimer);
          this.wordTimer = null;
        }
        options.onEnd?.();
        resolve({
          providerUsed: 'native-web-speech',
          voiceName: enVoice?.name || 'System English',
          latencyMs: Math.round(performance.now() - startTime),
          cached: false,
        });
      };

      utterance.onend = finish;
      utterance.onerror = finish;
      window.speechSynthesis.speak(utterance);
    });
  }
}

// ============================================================================
// 4. GEMINI SPEECH PROVIDER (PAID PREMIUM USERS WITH CACHE & FALLBACK)
// ============================================================================

export class GeminiSpeechProvider implements SpeechProvider {
  readonly id = 'gemini-tts' as const;
  readonly requiresPremium = true;
  private activeAudio: HTMLAudioElement | null = null;
  private wordTimer: number | null = null;
  private fallbackProvider = new NativeSpeechProvider();

  isAvailable(): boolean {
    return typeof window !== 'undefined' && typeof fetch !== 'undefined';
  }

  stop(): void {
    if (this.wordTimer) {
      window.clearInterval(this.wordTimer);
      this.wordTimer = null;
    }
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio.currentTime = 0;
      this.activeAudio = null;
    }
    this.fallbackProvider.stop();
  }

  async speak(options: SpeakOptions): Promise<{
    providerUsed: string;
    voiceName: string;
    latencyMs: number;
    cached: boolean;
  }> {
    this.stop();
    const startTime = performance.now();
    const profile = getProfileById(options.profileId || 'adult_male');
    const speed = options.speed || 0.92;
    const cacheKey = speechCache.buildKey(options.text, profile.id, speed);

    try {
      const cachedBase64 = await speechCache.get(cacheKey);
      if (cachedBase64) {
        await this.playWavBase64(cachedBase64, options, speed);
        return {
          providerUsed: 'gemini-3.8-flash-lite-tts',
          voiceName: profile.geminiVoiceName,
          latencyMs: Math.round(performance.now() - startTime),
          cached: true,
        };
      }

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-TalkMe-Tier': subscriptionService.getTier(),
        },
        body: JSON.stringify({
          text: options.text,
          profileId: profile.id,
          voiceName: profile.geminiVoiceName,
          style: options.style || profile.geminiStylePrompt,
          speed,
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini TTS HTTP ${response.status}`);
      }

      const data = await response.json();
      if (!data.audioBase64) {
        throw new Error('Missing audioBase64');
      }

      await speechCache.set(cacheKey, options.text, profile.geminiVoiceName, data.audioBase64);
      await this.playWavBase64(data.audioBase64, options, speed);

      return {
        providerUsed: data.model || 'gemini-3.8-flash-lite-tts',
        voiceName: data.voiceName || profile.geminiVoiceName,
        latencyMs: data.latencyMs || Math.round(performance.now() - startTime),
        cached: false,
      };
    } catch {
      // Graceful fallback to NativeSpeechProvider when offline or entitlement/API fails
      return this.fallbackProvider.speak(options);
    }
  }

  private playWavBase64(base64: string, options: SpeakOptions, speed: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(`data:audio/wav;base64,${base64}`);
      audio.playbackRate = Math.max(0.7, Math.min(1.25, speed));
      this.activeAudio = audio;

      const cleanText = options.text
        .replace(/<breath>|<laugh>|<gasp>|\|yeah\||\|mhm\|/gi, '')
        .trim();
      const words = cleanText.split(/\s+/).filter(Boolean);

      audio.onplay = () => {
        options.onStart?.();
        let idx = 0;
        const stepMs = Math.max(200, Math.round(300 / speed));
        if (words.length > 0) {
          options.onWordBoundary?.(words[0], 0, 0);
          idx = 1;
        }
        this.wordTimer = window.setInterval(() => {
          if (idx < words.length) {
            options.onWordBoundary?.(words[idx], idx * 5, idx);
            idx++;
          } else if (this.wordTimer) {
            window.clearInterval(this.wordTimer);
            this.wordTimer = null;
          }
        }, stepMs);
      };

      const cleanup = () => {
        if (this.wordTimer) {
          window.clearInterval(this.wordTimer);
          this.wordTimer = null;
        }
        this.activeAudio = null;
        options.onEnd?.();
      };

      audio.onended = () => {
        cleanup();
        resolve();
      };

      audio.onerror = (err) => {
        cleanup();
        reject(err);
      };

      audio.play().catch((err) => {
        cleanup();
        reject(err);
      });
    });
  }
}

// ============================================================================
// 5. AUDIO QUEUE & UNIFIED SPEECH MANAGER
// ============================================================================

export class SpeechManager {
  private geminiProvider = new GeminiSpeechProvider();
  private nativeProvider = new NativeSpeechProvider();
  private activeText: string | null = null;
  private activeWordIndex: number = -1;
  private stateListeners = new Set<
    (state: { isSpeaking: boolean; activeText: string | null; activeWordIndex: number }) => void
  >();

  getActiveProvider(): SpeechProvider {
    if (subscriptionService.isPremiumEntitled()) {
      return this.geminiProvider;
    }
    return this.nativeProvider;
  }

  async speak(options: SpeakOptions) {
    const provider = this.getActiveProvider();
    this.activeText = options.text;
    this.activeWordIndex = 0;
    this.notify(true);

    return provider.speak({
      ...options,
      onWordBoundary: (word, charIndex, wordIndex) => {
        this.activeWordIndex = wordIndex;
        this.notify(true);
        options.onWordBoundary?.(word, charIndex, wordIndex);
      },
      onEnd: () => {
        this.activeText = null;
        this.activeWordIndex = -1;
        this.notify(false);
        options.onEnd?.();
      },
    });
  }

  async speakEnglish(text: string) {
    if (!text || !text.trim()) return;
    return this.speak({
      text: text.trim(),
      lang: 'en-US',
    });
  }

  async speakQueue(sentences: string[], baseOptions?: Omit<SpeakOptions, 'text'>): Promise<void> {
    for (const sentence of sentences) {
      if (!sentence.trim()) continue;
      await this.speak({
        ...baseOptions,
        text: sentence,
      });
    }
  }

  stop(): void {
    this.geminiProvider.stop();
    this.nativeProvider.stop();
    this.activeText = null;
    this.activeWordIndex = -1;
    this.notify(false);
  }

  subscribe(
    cb: (state: { isSpeaking: boolean; activeText: string | null; activeWordIndex: number }) => void
  ): () => void {
    this.stateListeners.add(cb);
    return () => this.stateListeners.delete(cb);
  }

  private notify(isSpeaking: boolean): void {
    const snapshot = {
      isSpeaking,
      activeText: this.activeText,
      activeWordIndex: this.activeWordIndex,
    };
    this.stateListeners.forEach((cb) => cb(snapshot));
  }
}

export const speechManager = new SpeechManager();
