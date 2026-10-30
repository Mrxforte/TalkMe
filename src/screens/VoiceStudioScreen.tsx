import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBadge } from '../components/TalkMeBadge';
import { TalkMeCard } from '../components/TalkMeCard';
import { TalkMeButton } from '../components/TalkMeButton';
import { CHARACTER_VOICE_CATALOG, getProfileById } from '../domain/voice/catalog';
import { Volume2, Play, Square, Sparkles, RefreshCw } from 'lucide-react';

export const VoiceStudioScreen: React.FC = () => {
  const {
    voiceSettings,
    updateVoiceSettings,
    goBack,
    playTts,
    stopTts,
    isTtsSpeaking,
  } = useApp();

  const [inputText, setInputText] = useState<string>(
    'Welcome to TalkMe Voice AI Engine. Enjoy natural speech generation and authentic character voices!'
  );
  const [speed, setSpeed] = useState<number>(voiceSettings.speechSpeed);
  const [pitch, setPitch] = useState<number>(voiceSettings.speechPitch);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(
    voiceSettings.selectedCharacterProfile
  );

  const selectedProfile = getProfileById(selectedVoiceId);

  const handleGenerate = () => {
    if (isTtsSpeaking) {
      stopTts();
    } else {
      updateVoiceSettings({
        selectedCharacterProfile: selectedVoiceId,
        speechSpeed: speed,
        speechPitch: pitch,
      });
      playTts(inputText, selectedVoiceId);
    }
  };

  const samplePrompts = [
    'How do you do? Nice to meet you in English class!',
    'Where is the library located?',
    'She is reading a wonderful book right now.',
    'Spaced repetition strengthens memory retention.',
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-16 text-[#1D1B20]">
      <div className="px-5 pt-4 space-y-4 max-w-md mx-auto">
        <TalkMeHeader
          title="Voice Studio"
          subtitle="Interactive Voice AI Studio & Speech Controls"
          onBackClick={goBack}
        />

        {/* Text Input Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#757575] flex items-center justify-between">
            <span>Nutq Matni (Speech Text Input)</span>
            <span className="text-[11px] text-[#5E4B8B]">{inputText.length} belgi</span>
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
            className="w-full p-4 rounded-2xl bg-white border border-[#F0EFF5] text-sm text-[#1D1B20] placeholder-[#9E9E9E] focus:outline-none focus:border-[#5E4B8B] shadow-2xs resize-none"
            placeholder="Generatsiya qilish uchun matn kiriting..."
          />
        </div>

        {/* Quick Sample Prompts */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setInputText(prompt)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-[#F0EFF5] text-[#5E4B8B] shrink-0 hover:bg-[#F1EDFA] transition-colors cursor-pointer"
            >
              “{prompt.slice(0, 24)}...”
            </button>
          ))}
        </div>

        {/* Character Voice Selector */}
        <TalkMeCard className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-wider uppercase text-[#5E4B8B]">
              Personaj Ovozini Tanlang
            </span>
            <TalkMeBadge
              text="6 ta tasdiqlangan"
              containerColor="bg-[#F1EDFA]"
              textColor="text-[#5E4B8B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {CHARACTER_VOICE_CATALOG.map((profile) => {
              const isSelected = selectedVoiceId === profile.id;

              return (
                <div
                  key={profile.id}
                  onClick={() => setSelectedVoiceId(profile.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-[#F1EDFA] border-[#5E4B8B] shadow-xs'
                      : 'bg-white border-[#F0EFF5] hover:border-[#5E4B8B]/40'
                  }`}
                >
                  <span className="text-2xl">{profile.iconEmoji}</span>
                  <div className="min-w-0">
                    <p className={`text-xs font-extrabold truncate ${isSelected ? 'text-[#5E4B8B]' : 'text-[#1D1B20]'}`}>
                      {profile.nameUz}
                    </p>
                    <p className="text-[10px] text-[#757575] truncate">{profile.nameEn}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </TalkMeCard>

        {/* Engine & Active Profile Details */}
        <div className="rounded-2xl p-4 bg-[#F8F9FA] border border-[#F0EFF5] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1D1B20]">
              Tanlangan: {selectedProfile.iconEmoji} {selectedProfile.nameUz} ({selectedProfile.nameEn})
            </span>
            <TalkMeBadge
              text="English (US)"
              containerColor="bg-white"
              textColor="text-[#5E4B8B]"
            />
          </div>
          <p className="text-xs text-[#757575] leading-relaxed">
            {selectedProfile.descriptionUz}
          </p>
        </div>

        {/* Speech Parameter Sliders (Speed & Pitch) */}
        <TalkMeCard className="space-y-4">
          {/* Speed */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#1D1B20]">Nutq tezligi (Speed)</span>
              <span className="font-black text-[#5E4B8B]">{speed.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full accent-[#5E4B8B] cursor-pointer"
            />
          </div>

          {/* Pitch */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#1D1B20]">Nutq balandligi (Pitch)</span>
              <span className="font-black text-[#5E4B8B]">{pitch.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.5"
              step="0.05"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full accent-[#5E4B8B] cursor-pointer"
            />
          </div>
        </TalkMeCard>

        {/* Generate / Stop Button */}
        <div className="pt-2">
          <TalkMeButton
            text={isTtsSpeaking ? 'Nutqni To‘xtatish' : 'Generate Speech'}
            trailingIcon={
              isTtsSpeaking ? (
                <Square className="w-5 h-5 fill-current" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )
            }
            onClick={handleGenerate}
            className={isTtsSpeaking ? 'bg-rose-500 hover:bg-rose-600' : ''}
          />
        </div>
      </div>
    </div>
  );
};
