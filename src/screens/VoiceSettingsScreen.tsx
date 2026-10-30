import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBadge } from '../components/TalkMeBadge';
import { TalkMeCard } from '../components/TalkMeCard';
import { TalkMeButton } from '../components/TalkMeButton';
import { CHARACTER_VOICE_CATALOG, getProfileById } from '../domain/voice/catalog';
import { PROSODY_BENCHMARK_TEST_TEXT, SAMPLE_STORY_FULL_TEXT } from '../domain/voice/sampleStory';
import { ttsEngine } from '../domain/voice/ttsEngine';
import {
  Volume2,
  Search,
  RotateCcw,
  Square,
  Trash2,
  Radio,
} from 'lucide-react';

export const VoiceSettingsScreen: React.FC = () => {
  const {
    voiceSettings,
    updateVoiceSettings,
    resetVoiceSettings,
    goBack,
    playTts,
    stopTts,
    isTtsSpeaking,
    ttsStatus,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [testReport, setTestReport] = useState<string>('');
  const [activeStoryMode, setActiveStoryMode] = useState<'prosody' | 'library'>('prosody');

  const currentProfile = getProfileById(voiceSettings.selectedCharacterProfile);

  const speedPresets = [
    { label: 'Boshlang‘ich (0.75x)', val: 0.75 },
    { label: 'Sekin (0.82x)', val: 0.82 },
    { label: 'Tabiiy (0.92x)', val: 0.92 },
    { label: 'Jonli (1.05x)', val: 1.05 },
  ];

  const filteredProfiles = CHARACTER_VOICE_CATALOG.filter(
    (p) =>
      p.nameUz.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.geminiVoiceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.descriptionUz.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRunTest = (text: string, profileId?: string) => {
    if (isTtsSpeaking) {
      stopTts();
      setTestReport('Nutq to‘xtatildi.');
    } else {
      const targetProfile = getProfileById(profileId || currentProfile.id);
      const startTime = performance.now();
      setTestReport(
        `Gemini 3.8 TTS generatsiya qilinmoqda... [Ovoz: ${targetProfile.geminiVoiceName}]`
      );
      playTts(text, targetProfile.id).then(() => {
        const totalTime = Math.round(performance.now() - startTime);
        setTestReport(
          `Model: ${ttsStatus.activeEngine} | Ovoz: ${targetProfile.geminiVoiceName} (${targetProfile.nameUz}) | Tezlik: ${voiceSettings.speechSpeed.toFixed(2)}x | Vaqt: ${totalTime}ms`
        );
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-16 text-[#1D1B20]">
      <div className="px-5 pt-4 space-y-4 max-w-md mx-auto">
        <TalkMeHeader
          title="Gemini 3.8 Ovoz Sozlamalari"
          subtitle="Mobil AI TTS dvigateli, kesh va intonatsiya sinov muhiti"
          onBackClick={goBack}
        />

        {/* ==========================================
            1. GENERAL & ENGINE ROUTING SETTINGS
           ========================================== */}
        <TalkMeCard className="space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-wider uppercase text-[#5E4B8B]">
              Asosiy Dvigatel Sozlamalari
            </span>
            <TalkMeBadge
              text={
                voiceSettings.engineSelectionMode === 'OFFLINE_ONLY'
                  ? 'Offline Fallback'
                  : 'Gemini 3.8 Cloud'
              }
              containerColor="bg-[#E8F8EE]"
              textColor="text-[#27AE60]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#1D1B20]">Gemini 3.8 Tabiiy AI Ovoz</p>
              <p className="text-xs text-[#757575]">
                Mobil foydalanuvchilar uchun 24kHz tabiiy nutq sintezi
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={voiceSettings.engineSelectionMode !== 'OFFLINE_ONLY'}
                onChange={(e) =>
                  updateVoiceSettings({
                    engineSelectionMode: e.target.checked ? 'CLOUD_FIRST' : 'OFFLINE_ONLY',
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5E4B8B]" />
            </label>
          </div>

          {/* Model variant selector */}
          <div className="pt-2 border-t border-[#F0EFF5] flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#757575]">Model varianti:</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => updateVoiceSettings({ geminiModel: 'gemini-3.8-flash-lite-tts' })}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold cursor-pointer transition-colors ${
                  (voiceSettings.geminiModel || 'gemini-3.8-flash-lite-tts') ===
                  'gemini-3.8-flash-lite-tts'
                    ? 'bg-[#5E4B8B] text-white'
                    : 'bg-[#F0EFF5] text-[#757575]'
                }`}
              >
                3.8 Flash-Lite
              </button>
              <button
                type="button"
                onClick={() => updateVoiceSettings({ geminiModel: 'gemini-3.8-flash-tts' })}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold cursor-pointer transition-colors ${
                  voiceSettings.geminiModel === 'gemini-3.8-flash-tts'
                    ? 'bg-[#5E4B8B] text-white'
                    : 'bg-[#F0EFF5] text-[#757575]'
                }`}
              >
                3.8 Flash Pro
              </button>
            </div>
          </div>
        </TalkMeCard>

        {/* ==========================================
            2. FEATURED ACTIVE VOICE CARD
           ========================================== */}
        <div className="rounded-3xl p-5 bg-[#F1EDFA] border border-[#5E4B8B]/20 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentProfile.iconEmoji}</span>
              <div>
                <p className="text-base font-extrabold text-[#5E4B8B]">
                  {currentProfile.nameUz}
                </p>
                <p className="text-xs text-[#757575]">
                  Gemini 3.8 Voice: <strong>{currentProfile.geminiVoiceName}</strong>
                </p>
              </div>
            </div>

            <TalkMeBadge
              text="Aktiv Ovoz"
              containerColor="bg-white"
              textColor="text-[#5E4B8B]"
            />
          </div>

          <p className="text-xs text-[#757575] leading-relaxed">
            {currentProfile.descriptionUz}
          </p>

          <TalkMeButton
            text={isTtsSpeaking ? 'Nutqni To‘xtatish' : 'Aktiv Ovozni Sinab Ko‘rish'}
            trailingIcon={
              isTtsSpeaking ? (
                <Square className="w-4 h-4 fill-current" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )
            }
            onClick={() =>
              handleRunTest(
                `Hello! I am your Gemini 3.8 English voice tutor. Let's practice speaking naturally together!`
              )
            }
          />
        </div>

        {/* ==========================================
            3. VOICE CATALOG SEARCH & LIST
           ========================================== */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#1D1B20]">Personaj Ovozlar Listi</h3>
            <TalkMeBadge
              text={`${filteredProfiles.length} ta ovoz`}
              containerColor="bg-[#F1EDFA]"
              textColor="text-[#5E4B8B]"
            />
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ovoz nomi bo‘yicha izlash (Charon, Kore, Puck...)"
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-[#F0EFF5] text-sm text-[#1D1B20] placeholder-[#9E9E9E] focus:outline-none focus:border-[#5E4B8B] shadow-2xs"
            />
            <Search className="w-4 h-4 text-[#9E9E9E] absolute left-3.5 top-3.5" />
          </div>

          {/* Voices list */}
          <TalkMeCard className="p-3 space-y-2">
            {filteredProfiles.map((profile) => {
              const isSelected = profile.id === currentProfile.id;

              return (
                <div
                  key={profile.id}
                  onClick={() => updateVoiceSettings({ selectedCharacterProfile: profile.id })}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#F1EDFA] border-[#5E4B8B]'
                      : 'bg-white border-[#F0EFF5] hover:border-[#5E4B8B]/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{profile.iconEmoji}</span>
                    <div>
                      <p
                        className={`text-xs font-extrabold ${
                          isSelected ? 'text-[#5E4B8B]' : 'text-[#1D1B20]'
                        }`}
                      >
                        {profile.nameUz}
                      </p>
                      <p className="text-[11px] text-[#757575]">
                        Gemini 3.8: <strong>{profile.geminiVoiceName}</strong> · {profile.baseRate.toFixed(2)}x
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateVoiceSettings({ selectedCharacterProfile: profile.id });
                      handleRunTest(
                        `Hi there! I am speaking with the ${profile.geminiVoiceName} voice powered by Gemini 3.8.`,
                        profile.id
                      );
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 ${
                      isSelected
                        ? 'bg-[#5E4B8B] text-white'
                        : 'bg-[#F1EDFA] text-[#5E4B8B] hover:bg-[#5E4B8B] hover:text-white'
                    }`}
                    title="Audition"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </TalkMeCard>
        </div>

        {/* ==========================================
            4. NATURAL SPEECH SPEED PRESETS & SLIDER
           ========================================== */}
        <TalkMeCard className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-wider uppercase text-[#5E4B8B]">
              Nutq Tezligi (Mobile Presets)
            </span>
            <span className="text-xs font-extrabold text-[#1D1B20]">
              {voiceSettings.speechSpeed.toFixed(2)}x
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {speedPresets.map((preset) => {
              const isSelected = Math.abs(voiceSettings.speechSpeed - preset.val) < 0.03;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => updateVoiceSettings({ speechSpeed: preset.val })}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#5E4B8B] text-white shadow-xs'
                      : 'bg-[#F0EFF5] text-[#757575] hover:text-[#1D1B20]'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <input
            type="range"
            min="0.65"
            max="1.20"
            step="0.05"
            value={voiceSettings.speechSpeed}
            onChange={(e) => updateVoiceSettings({ speechSpeed: parseFloat(e.target.value) })}
            className="w-full accent-[#5E4B8B] cursor-pointer"
          />
        </TalkMeCard>

        {/* ==========================================
            5. MOBILE AUDIO CACHE
           ========================================== */}
        <TalkMeCard className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#1D1B20]">Mobil Audio Kesh (Instant Replay)</p>
              <p className="text-xs text-[#757575]">
                Takroriy eshitganda trafik sarflamay 0ms da ijro etish ({ttsStatus.cacheCount} ta audio)
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={voiceSettings.audioCacheEnabled}
                onChange={(e) => updateVoiceSettings({ audioCacheEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#27AE60]" />
            </label>
          </div>

          {ttsStatus.cacheCount > 0 && (
            <button
              type="button"
              onClick={() => ttsEngine.clearCache()}
              className="text-xs font-bold text-rose-600 flex items-center gap-1.5 hover:underline cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Keshlangan audiolarni tozalash ({ttsStatus.cacheCount})</span>
            </button>
          )}
        </TalkMeCard>

        {/* ==========================================
            6. EXACT PROSODY BENCHMARK SPEECH TEST
           ========================================== */}
        <div className="rounded-3xl p-5 bg-[#F1EDFA] border border-[#5E4B8B]/20 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-[#5E4B8B] flex items-center gap-1.5">
              <Radio className="w-4 h-4" />
              <span>Prosodiya va Intonatsiya Sinovi</span>
            </h4>
            <TalkMeBadge
              text="Gemini 3.8"
              containerColor="bg-white"
              textColor="text-[#5E4B8B]"
            />
          </div>

          <p className="text-xs text-[#757575]">
            Intonatsiya: So‘roq (↗), Darak (↘), Kirish so‘zlar va Pauzalar sinovi
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveStoryMode('prosody')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                activeStoryMode === 'prosody'
                  ? 'bg-[#5E4B8B] text-white'
                  : 'bg-white text-[#757575]'
              }`}
            >
              Prosodiya Sinovi
            </button>
            <button
              onClick={() => setActiveStoryMode('library')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                activeStoryMode === 'library'
                  ? 'bg-[#5E4B8B] text-white'
                  : 'bg-white text-[#757575]'
              }`}
            >
              The Last Library (Hikoya)
            </button>
          </div>

          {/* Test text box */}
          <textarea
            readOnly
            value={
              activeStoryMode === 'prosody'
                ? PROSODY_BENCHMARK_TEST_TEXT
                : SAMPLE_STORY_FULL_TEXT
            }
            rows={5}
            className="w-full p-3 rounded-2xl bg-white border border-[#F0EFF5] text-xs text-[#1D1B20] focus:outline-none shadow-2xs resize-none font-mono"
          />

          <TalkMeButton
            text={isTtsSpeaking ? 'Nutqni To‘xtatish' : 'Gemini 3.8 Intonatsiyani Sinash'}
            trailingIcon={
              isTtsSpeaking ? (
                <Square className="w-4 h-4 fill-current" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )
            }
            onClick={() =>
              handleRunTest(
                activeStoryMode === 'prosody'
                  ? PROSODY_BENCHMARK_TEST_TEXT
                  : SAMPLE_STORY_FULL_TEXT.slice(0, 480)
              )
            }
            className={isTtsSpeaking ? 'bg-rose-500 hover:bg-rose-600' : ''}
          />

          {testReport && (
            <div className="p-3 rounded-xl bg-white border border-[#27AE60]/40 text-xs font-bold text-[#27AE60] leading-relaxed animate-fade-in">
              {testReport}
            </div>
          )}
        </div>

        {/* Reset Defaults Button */}
        <div className="pt-2">
          <TalkMeButton
            text="Sozlamalarni Qaytarish"
            variant="secondary"
            trailingIcon={<RotateCcw className="w-4 h-4" />}
            onClick={() => {
              resetVoiceSettings();
              setTestReport('Barcha ovoz sozlamalari dastlabki Gemini 3.8 holatiga qaytarildi.');
            }}
          />
        </div>
      </div>
    </div>
  );
};
