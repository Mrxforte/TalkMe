import React from 'react';
import { ComingSoonScreen } from '../components/ComingSoonScreen';

/**
 * The web `VoiceStudioScreen` is a full TTS lab (model/voice picker, live
 * waveform, dialogue scripting, latency/A-B testing). Porting it is tracked
 * as follow-up work; `VoiceSettingsScreen` already ports the core
 * voice-selection + test-speak flow using the on-device TTS engine.
 */
export const VoiceStudioScreen: React.FC = () => (
  <ComingSoonScreen
    title="Ovoz studiyasi"
    description="To‘liq Voice AI studiyasi (model tanlash, dialog skript, A/B test) tez orada qo‘shiladi. Hozircha Profil → Ovoz sozlamalaridan ovozni sinab ko‘rishingiz mumkin."
  />
);
