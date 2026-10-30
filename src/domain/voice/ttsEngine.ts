import { CharacterProfile, VoiceSettings } from '../../types';
import { getProfileById } from './catalog';

class TtsEngine {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private listeners: Set<(speaking: boolean) => void> = new Set();

  public subscribe(listener: (speaking: boolean) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l(this.isSpeaking));
  }

  public stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.notify();
  }

  public speak(
    text: string,
    settings?: Partial<VoiceSettings>,
    profileOverride?: CharacterProfile
  ): Promise<boolean> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported in this browser.');
        resolve(false);
        return;
      }

      this.stop();

      const profile =
        profileOverride ||
        getProfileById(settings?.selectedCharacterProfile || 'adult_male');

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';

      // Authentic pitch and rate computation from TalkMe architecture:
      const rateMultiplier = settings?.speechSpeed ?? 1.0;
      const pitchMultiplier = settings?.speechPitch ?? 1.0;

      utterance.rate = Math.max(0.5, Math.min(2.0, profile.baseRate * rateMultiplier));
      utterance.pitch = Math.max(0.5, Math.min(2.0, profile.basePitch * pitchMultiplier));

      // Attempt to pick gender-appropriate voice
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const matchingVoice = voices.find((v) => {
          const isEn = v.lang.startsWith('en');
          const name = v.name.toLowerCase();
          if (profile.preferredGender === 'female') {
            return isEn && (name.includes('female') || name.includes('samantha') || name.includes('zira') || name.includes('victoria') || name.includes('karen'));
          } else {
            return isEn && (name.includes('male') || name.includes('david') || name.includes('george') || name.includes('daniel') || name.includes('alex'));
          }
        }) || voices.find((v) => v.lang.startsWith('en')) || voices[0];

        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.notify();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        this.notify();
        resolve(true);
      };

      utterance.onerror = (e) => {
        console.warn('TTS playback error', e);
        this.isSpeaking = false;
        this.currentUtterance = null;
        this.notify();
        resolve(false);
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    });
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}

export const ttsEngine = new TtsEngine();
