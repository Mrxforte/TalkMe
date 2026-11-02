import Tts from 'react-native-tts';

/**
 * Device-native TTS wrapper, replacing the web app's Gemini 3.8 cloud TTS
 * (`src/domain/voice/ttsEngine.ts` + `server.ts`). This speaks text using the
 * Android system TTS engine. Wiring the same Gemini cloud voices used on the
 * web (via the existing Express `/api/tts` endpoint) is a follow-up: point
 * `fetch` at that server's LAN address and stream/play the returned audio
 * instead of calling `Tts.speak`.
 */
let isInitialized = false;
let speaking = false;

async function ensureInit(): Promise<void> {
  if (isInitialized) return;
  try {
    await Tts.getInitStatus();
  } catch {
    // Some Android devices require requesting the TTS data install.
    try {
      await Tts.requestInstallEngine();
    } catch {
      // ignore - will fail gracefully on speak()
    }
  }
  isInitialized = true;
}

export interface DialogueTurn {
  speakerProfileId: string;
  text: string;
}

export const mobileTtsEngine = {
  async speak(text: string, rate = 0.5, pitch = 1.0): Promise<boolean> {
    await ensureInit();
    try {
      await Tts.setDefaultRate(rate);
      await Tts.setDefaultPitch(pitch);
      speaking = true;
      Tts.speak(text);
      return true;
    } catch {
      speaking = false;
      return false;
    }
  },

  async speakDialogue(turns: DialogueTurn[]): Promise<boolean> {
    for (const turn of turns) {
      // eslint-disable-next-line no-await-in-loop
      await this.speak(turn.text);
    }
    return true;
  },

  stop(): void {
    speaking = false;
    Tts.stop();
  },

  isSpeaking(): boolean {
    return speaking;
  },
};
