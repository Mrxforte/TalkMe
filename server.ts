import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Map TalkMe character profile IDs to Gemini 3.8 TTS prebuilt voices and natural style prompts
const PROFILE_VOICE_MAP: Record<
  string,
  {
    voiceName: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr';
    defaultStyle: string;
  }
> = {
  adult_male: {
    voiceName: 'Charon',
    defaultStyle:
      'Warm, resonant, articulate adult male English teacher with clear pronunciation and natural conversational cadence',
  },
  adult_female: {
    voiceName: 'Kore',
    defaultStyle:
      'Friendly, warm, crystal-clear adult female English tutor with encouraging, natural intonation',
  },
  young_boy: {
    voiceName: 'Puck',
    defaultStyle:
      'Bright, curious, energetic young boy voice with lively, friendly pronunciation',
  },
  young_girl: {
    voiceName: 'Zephyr',
    defaultStyle:
      'Cheerful, expressive, clear young girl voice with upbeat, natural storytelling rhythm',
  },
  teenage_boy: {
    voiceName: 'Fenrir',
    defaultStyle:
      'Confident, enthusiastic teenage student voice with modern, clear American English articulation',
  },
  teenage_girl: {
    voiceName: 'Zephyr',
    defaultStyle:
      'Vibrant, articulate, friendly teenage girl voice with natural conversational prosody',
  },
};

function getAiClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: { 'User-Agent': 'aistudio-build' },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '2mb' }));

  // Health check endpoint
  app.get('/api/tts/health', (_req, res) => {
    res.json({
      status: 'ok',
      engine: 'Gemini 3.8 TTS',
      models: ['gemini-3.8-flash-lite-tts', 'gemini-3.8-flash-tts'],
      configured: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Single-speaker & Multi-speaker Gemini 3.8 TTS endpoint
  app.post('/api/tts', async (req, res) => {
    const startTime = Date.now();
    try {
      const {
        text,
        profileId = 'adult_male',
        voiceName: customVoiceName,
        style: customStyle,
        speed = 1.0,
        model: requestedModel,
        dialogueTurns,
      } = req.body || {};

      if (!process.env.GEMINI_API_KEY) {
        res.status(503).json({
          error: 'GEMINI_API_KEY is not configured on the server.',
        });
        return;
      }

      const ai = getAiClient();

      // Multi-speaker dialogue mode (uses gemini-3.8-flash-tts with 2 speakers)
      if (Array.isArray(dialogueTurns) && dialogueTurns.length > 0) {
        const parts = dialogueTurns.map(
          (turn: { speaker: string; text: string; style?: string }) => ({
            text: `${turn.speaker}: ${turn.text}`,
            speechMetadata: {
              speaker: turn.speaker,
              style:
                turn.style ||
                (turn.speaker === 'Alex'
                  ? 'Enthusiastic, encouraging English tutor'
                  : 'Curious, articulate language learner'),
            },
          })
        );

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-tts',
          contents: [
            {
              role: 'user',
              parts,
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: [
                  {
                    speaker: 'Alex',
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Puck' },
                    },
                  },
                  {
                    speaker: 'Sam',
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                  },
                ],
              },
            },
          },
        });

        const base64Audio =
          response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!base64Audio) {
          res.status(500).json({ error: 'No audio returned from Gemini 3.8 Flash TTS.' });
          return;
        }

        res.json({
          audioBase64: base64Audio,
          mimeType: 'audio/wav',
          model: 'gemini-3.8-flash-tts',
          voiceName: 'Puck & Kore',
          latencyMs: Date.now() - startTime,
        });
        return;
      }

      // Single-speaker standard or expressive TTS
      if (!text || typeof text !== 'string' || !text.trim()) {
        res.status(400).json({ error: 'Text is required for TTS generation.' });
        return;
      }

      const mapped = PROFILE_VOICE_MAP[profileId] || PROFILE_VOICE_MAP.adult_male;
      const selectedVoiceName = customVoiceName || mapped.voiceName;

      // Build speed-aware natural style instruction
      let pacingHint = '';
      if (speed <= 0.78) {
        pacingHint = ', speaking slowly, patiently, and deliberately for a beginner language learner';
      } else if (speed <= 0.88) {
        pacingHint = ', speaking at a clear, measured, easy-to-follow pace';
      } else if (speed >= 1.08) {
        pacingHint = ', speaking at a lively, brisk native conversational pace';
      }

      const stylePrompt = `${customStyle || mapped.defaultStyle}${pacingHint}`;

      // Choose gemini-3.8-flash-tts if vocal bursts (<breath>, <laugh>, <gasp>, |yeah|, |mhm|) are present or explicitly requested
      const hasVocalBursts = /<breath>|<laugh>|<gasp>|\|yeah\||\|mhm\|/i.test(text);
      const modelToUse =
        requestedModel === 'gemini-3.8-flash-tts' || hasVocalBursts
          ? 'gemini-3.8-flash-tts'
          : 'gemini-3.8-flash-lite-tts';

      const response = await ai.models.generateContent({
        model: modelToUse,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text.trim(),
                speechMetadata: {
                  style: stylePrompt,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoiceName },
            },
          },
        },
      });

      // Unary default: complete WAV file (audio/wav, RIFF header, 24kHz mono 16-bit)
      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (!base64Audio) {
        res.status(500).json({ error: 'Empty audio data from Gemini 3.8 TTS.' });
        return;
      }

      res.json({
        audioBase64: base64Audio,
        mimeType: 'audio/wav',
        model: modelToUse,
        voiceName: selectedVoiceName,
        style: stylePrompt,
        latencyMs: Date.now() - startTime,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown TTS error';
      console.error('Gemini 3.8 TTS Error:', message);
      res.status(500).json({
        error: message,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TalkMe server with Gemini 3.8 TTS running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
