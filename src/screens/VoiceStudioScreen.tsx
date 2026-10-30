import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBadge } from '../components/TalkMeBadge';
import { TalkMeCard } from '../components/TalkMeCard';
import { TalkMeButton } from '../components/TalkMeButton';
import { CHARACTER_VOICE_CATALOG, getProfileById } from '../domain/voice/catalog';
import { GeminiTtsModel } from '../types';
import { Volume2, Square, Sparkles, Users, Zap, Radio } from 'lucide-react';

export const VoiceStudioScreen: React.FC = () => {
  const {
    voiceSettings,
    updateVoiceSettings,
    goBack,
    playTts,
    playDialogueTts,
    stopTts,
    isTtsSpeaking,
    ttsStatus,
  } = useApp();

  const [studioMode, setStudioMode] = useState<'single' | 'dialogue'>('single');
  const [inputText, setInputText] = useState<string>(
    'Welcome to TalkMe! <breath> With Gemini 3.8 Text-to-Speech, every English lesson sounds warm, natural, and crystal clear on your phone.'
  );
  const [customStyle, setCustomStyle] = useState<string>('');
  const [speed, setSpeed] = useState<number>(voiceSettings.speechSpeed);
  const [selectedModel, setSelectedModel] = useState<GeminiTtsModel>(
    voiceSettings.geminiModel || 'gemini-3.8-flash-lite-tts'
  );
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(
    voiceSettings.selectedCharacterProfile
  );

  // Dual-speaker dialogue lines (Alex = Puck, Sam = Kore)
  const [alexLine, setAlexLine] = useState<string>(
    'Welcome back! <breath> Today we are practicing natural English conversation at a coffee shop.'
  );
  const [samLine, setSamLine] = useState<string>(
    "That sounds great! |yeah| Could I get a hot cappuccino and a blueberry muffin, please?"
  );

  const selectedProfile = getProfileById(selectedVoiceId);

  const handleGenerate = () => {
    if (isTtsSpeaking) {
      stopTts();
      return;
    }

    updateVoiceSettings({
      selectedCharacterProfile: selectedVoiceId,
      speechSpeed: speed,
      geminiModel: selectedModel,
    });

    if (studioMode === 'dialogue') {
      playDialogueTts([
        {
          speaker: 'Alex',
          text: alexLine,
          style: 'Enthusiastic, bright English coach',
        },
        {
          speaker: 'Sam',
          text: samLine,
          style: 'Curious, natural conversational co-host',
        },
      ]);
    } else {
      playTts(inputText, selectedVoiceId, customStyle.trim() || undefined);
    }
  };

  const samplePrompts = [
    {
      label: '☕ Kafeda suhbat',
      text: 'Excuse me! <breath> Could I have an iced latte with oat milk, please?',
      model: 'gemini-3.8-flash-tts' as GeminiTtsModel,
    },
    {
      label: '📚 Present Continuous',
      text: 'Right now, she is reading an exciting English novel in the library.',
      model: 'gemini-3.8-flash-lite-tts' as GeminiTtsModel,
    },
    {
      label: '😄 Jonli emotsiya (<laugh>)',
      text: 'Wait, did you really memorize fifty English verbs today? <laugh> That is amazing!',
      model: 'gemini-3.8-flash-tts' as GeminiTtsModel,
    },
    {
      label: '🐢 Sekin talaffuz',
      text: 'Listen carefully and repeat each word after me: Apple, Library, Adventure.',
      model: 'gemini-3.8-flash-lite-tts' as GeminiTtsModel,
    },
  ];

  const insertVocalTag = (tag: string) => {
    setSelectedModel('gemini-3.8-flash-tts');
    setInputText((prev) => `${prev.trim()} ${tag} `);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-16 text-[#1D1B20]">
      <div className="px-5 pt-4 space-y-4 max-w-md mx-auto">
        <TalkMeHeader
          title="Gemini 3.8 Voice Studio"
          subtitle="Tabiiy mobil AI ovozlar va jonli dialog sintezatori"
          onBackClick={goBack}
        />

        {/* Live Gemini 3.8 Status Pill */}
        <div className="rounded-2xl p-3.5 bg-gradient-to-r from-[#5E4B8B] to-[#3B2E5A] text-white shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center ${
                isTtsSpeaking ? 'animate-pulse ring-2 ring-emerald-300' : ''
              }`}
            >
              <Radio className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wide uppercase">
                  {ttsStatus.activeEngine}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-[11px] text-white/80">
                Ovoz: <strong className="text-white">{ttsStatus.activeVoiceName}</strong> · 24kHz WAV
                {ttsStatus.lastLatencyMs > 0 && ` · ${ttsStatus.lastLatencyMs}ms`}
                {ttsStatus.cachedHit && ' · ⚡ Keshdan'}
              </p>
            </div>
          </div>

          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-white/15 border border-white/20">
            Mobile Ready
          </span>
        </div>

        {/* Mode Switcher: Single Speaker vs 2-Speaker Dialogue */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#F0EFF5]">
          <button
            type="button"
            onClick={() => setStudioMode('single')}
            className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              studioMode === 'single'
                ? 'bg-white text-[#5E4B8B] shadow-xs'
                : 'text-[#757575] hover:text-[#1D1B20]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Yakka Ovoz (6 Personaj)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setStudioMode('dialogue');
              setSelectedModel('gemini-3.8-flash-tts');
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              studioMode === 'dialogue'
                ? 'bg-white text-[#5E4B8B] shadow-xs'
                : 'text-[#757575] hover:text-[#1D1B20]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2 Kishi Suhbat (Flash TTS)</span>
          </button>
        </div>

        {studioMode === 'single' ? (
          <>
            {/* Model Tier Selector */}
            <TalkMeCard className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black tracking-wider uppercase text-[#5E4B8B]">
                  Gemini 3.8 TTS Modelini Tanlang
                </span>
                <TalkMeBadge
                  text="24kHz WAV"
                  containerColor="bg-[#E8F8EE]"
                  textColor="text-[#27AE60]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedModel('gemini-3.8-flash-lite-tts')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedModel === 'gemini-3.8-flash-lite-tts'
                      ? 'bg-[#F1EDFA] border-[#5E4B8B]'
                      : 'bg-white border-[#F0EFF5]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#5E4B8B]" />
                    <span className="text-xs font-extrabold text-[#1D1B20]">Flash-Lite 3.8</span>
                  </div>
                  <p className="text-[10px] text-[#757575] mt-0.5">
                    Tezkor mobil javob va kundalik dars talaffuzi
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedModel('gemini-3.8-flash-tts')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedModel === 'gemini-3.8-flash-tts'
                      ? 'bg-[#F1EDFA] border-[#5E4B8B]'
                      : 'bg-white border-[#F0EFF5]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-extrabold text-[#1D1B20]">Flash 3.8 Pro</span>
                  </div>
                  <p className="text-[10px] text-[#757575] mt-0.5">
                    Emotsiya, nafas (&lt;breath&gt;) va kulgi (&lt;laugh&gt;)
                  </p>
                </button>
              </div>
            </TalkMeCard>

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
                placeholder="Generatsiya qilish uchun inglizcha matn kiriting..."
              />

              {/* Expressive Vocal Burst Tag Chips for gemini-3.8-flash-tts */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[10px] font-bold text-[#757575] shrink-0">
                  Jonli effekt qo‘shish:
                </span>
                {['<breath>', '<laugh>', '<gasp>', '|yeah|', '|mhm|'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => insertVocalTag(tag)}
                    className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-[#F1EDFA] text-[#5E4B8B] hover:bg-[#5E4B8B] hover:text-white transition-colors shrink-0 cursor-pointer"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Sample Prompts */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {samplePrompts.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setInputText(item.text);
                    setSelectedModel(item.model);
                  }}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-[#F0EFF5] text-[#5E4B8B] shrink-0 hover:bg-[#F1EDFA] transition-colors cursor-pointer"
                >
                  {item.label}
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
                  text={`Gemini: ${selectedProfile.geminiVoiceName}`}
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
                        <p
                          className={`text-xs font-extrabold truncate ${
                            isSelected ? 'text-[#5E4B8B]' : 'text-[#1D1B20]'
                          }`}
                        >
                          {profile.nameUz}
                        </p>
                        <p className="text-[10px] text-[#757575] truncate">
                          {profile.geminiVoiceName} · AI Voice
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TalkMeCard>

            {/* Custom Voice Style Direction (speechMetadata.style) */}
            <TalkMeCard className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1D1B20]">
                  Ovoz ohangi ko‘rsatmasi (ixtiyoriy)
                </span>
                <span className="text-[10px] font-bold text-[#5E4B8B]">speechMetadata.style</span>
              </div>
              <input
                type="text"
                value={customStyle}
                onChange={(e) => setCustomStyle(e.target.value)}
                placeholder={selectedProfile.geminiStylePrompt}
                className="w-full h-10 px-3 rounded-xl bg-[#FAFAFC] border border-[#F0EFF5] text-xs text-[#1D1B20] placeholder-[#9E9E9E] focus:outline-none focus:border-[#5E4B8B]"
              />
            </TalkMeCard>
          </>
        ) : (
          /* Dual-Speaker Dialogue Studio (gemini-3.8-flash-tts) */
          <TalkMeCard className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black tracking-wider uppercase text-[#5E4B8B]">
                  Jonli Ikki Kishilik Suhbat
                </span>
                <p className="text-[11px] text-[#757575]">
                  Alex (Puck) va Sam (Kore) · gemini-3.8-flash-tts
                </p>
              </div>
              <TalkMeBadge
                text="Multi-Speaker"
                containerColor="bg-[#F1EDFA]"
                textColor="text-[#5E4B8B]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#1D1B20] flex items-center gap-1.5">
                <span>🧑‍🏫 Alex (Ovoz: Puck):</span>
              </label>
              <textarea
                value={alexLine}
                onChange={(e) => setAlexLine(e.target.value)}
                rows={2}
                className="w-full p-3 rounded-xl bg-[#FAFAFC] border border-[#F0EFF5] text-xs text-[#1D1B20] focus:outline-none focus:border-[#5E4B8B] resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#1D1B20] flex items-center gap-1.5">
                <span>👩‍🎓 Sam (Ovoz: Kore):</span>
              </label>
              <textarea
                value={samLine}
                onChange={(e) => setSamLine(e.target.value)}
                rows={2}
                className="w-full p-3 rounded-xl bg-[#FAFAFC] border border-[#F0EFF5] text-xs text-[#1D1B20] focus:outline-none focus:border-[#5E4B8B] resize-none"
              />
            </div>
          </TalkMeCard>
        )}

        {/* Mobile Speed Control Card */}
        <TalkMeCard className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#1D1B20]">Mobil Nutq Tezligi (Speed)</span>
            <span className="font-black text-[#5E4B8B]">{speed.toFixed(2)}x</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: '🐢 Sekin (0.75x)', val: 0.75 },
              { label: '✨ Ravon (0.92x)', val: 0.92 },
              { label: '⚡ Tez (1.10x)', val: 1.1 },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setSpeed(preset.val)}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  Math.abs(speed - preset.val) < 0.04
                    ? 'bg-[#5E4B8B] text-white'
                    : 'bg-[#F0EFF5] text-[#757575]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <input
            type="range"
            min="0.65"
            max="1.25"
            step="0.05"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full accent-[#5E4B8B] cursor-pointer"
          />
        </TalkMeCard>

        {/* Generate / Stop Button */}
        <div className="pt-1">
          <TalkMeButton
            text={
              isTtsSpeaking
                ? 'Nutqni To‘xtatish'
                : studioMode === 'dialogue'
                ? '2 Kishilik Suhbatni Eshitish (Gemini 3.8)'
                : 'Gemini 3.8 Ovozda Tinglash'
            }
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
