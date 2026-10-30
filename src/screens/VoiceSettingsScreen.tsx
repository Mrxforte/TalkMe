import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBadge } from '../components/TalkMeBadge';
import { TalkMeCard } from '../components/TalkMeCard';
import { TalkMeButton } from '../components/TalkMeButton';
import { CHARACTER_VOICE_CATALOG, getProfileById } from '../domain/voice/catalog';
import { PROSODY_BENCHMARK_TEST_TEXT, SAMPLE_STORY_FULL_TEXT } from '../domain/voice/sampleStory';
import {
  Volume2,
  Search,
  RotateCcw,
  Square,
  Sparkles,
  Check,
  CheckCircle2,
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
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [testReport, setTestReport] = useState<string>('');
  const [activeStoryMode, setActiveStoryMode] = useState<'prosody' | 'library'>('prosody');

  const currentProfile = getProfileById(voiceSettings.selectedCharacterProfile);

  const speedPresets = [
    { label: 'Boshlang‘ich (0.75x)', val: 0.75 },
    { label: 'Sekin (0.80x)', val: 0.8 },
    { label: 'O‘rtacha (0.88x)', val: 0.88 },
    { label: 'Jonli (0.95x)', val: 0.95 },
  ];

  const filteredProfiles = CHARACTER_VOICE_CATALOG.filter(
    (p) =>
      p.nameUz.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.descriptionUz.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRunTest = (text: string) => {
    if (isTtsSpeaking) {
      stopTts();
      setTestReport('Nutq to‘xtatildi.');
    } else {
      const startTime = performance.now();
      playTts(text, currentProfile.id).then(() => {
        const latency = Math.round(performance.now() - startTime);
        setTestReport(
          `Test Report: Personaj: ${currentProfile.nameUz} | Speed: ${voiceSettings.speechSpeed.toFixed(2)}x | Latency: ${latency}ms | Status: SUCCESS`
        );
      });
      setTestReport(`Ijro etilmoqda... [Model: ${currentProfile.nameEn}]`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-16 text-[#1D1B20]">
      <div className="px-5 pt-4 space-y-4 max-w-md mx-auto">
        <TalkMeHeader
          title="Voice AI Sozlamalari"
          subtitle="Dvigatel, nutq uslubi, kesh va nutq sinov muhiti"
          onBackClick={goBack}
        />

        {/* ==========================================
            1. GENERAL & ENGINE ROUTING SETTINGS
           ========================================== */}
        <TalkMeCard className="space-y-3">
          <span className="text-xs font-black tracking-wider uppercase text-[#5E4B8B]">
            Asosiy Dvigatel Sozlamalari
          </span>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#1D1B20]">Lokal (Oflayn) Rejim</p>
              <p className="text-xs text-[#757575]">Sherpa-ONNX oflayn modelidan foydalanish</p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={voiceSettings.engineSelectionMode === 'LOCAL_FIRST'}
                onChange={(e) =>
                  updateVoiceSettings({
                    engineSelectionMode: e.target.checked ? 'LOCAL_FIRST' : 'CLOUD_FIRST',
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5E4B8B]" />
            </label>
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
                <p className="text-xs text-[#757575]">{currentProfile.nameEn}</p>
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
            text="Aktiv Ovozni Sinab Ko‘rish"
            trailingIcon={<Volume2 className="w-4 h-4" />}
            onClick={() =>
              handleRunTest(`Hello! I am ${currentProfile.nameEn}, your AI speech character.`)
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
              placeholder="Ovoz nomi bo‘yicha izlash..."
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
                        {profile.nameEn} · {profile.baseRate.toFixed(2)}x rate
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateVoiceSettings({ selectedCharacterProfile: profile.id });
                      handleRunTest(`Hello! This is ${profile.nameEn}.`);
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
              Nutq Tezligi (Human Presets)
            </span>
            <span className="text-xs font-extrabold text-[#1D1B20]">
              {voiceSettings.speechSpeed.toFixed(2)}x (Sekin va Tushunarli)
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
            max="1.15"
            step="0.05"
            value={voiceSettings.speechSpeed}
            onChange={(e) => updateVoiceSettings({ speechSpeed: parseFloat(e.target.value) })}
            className="w-full accent-[#5E4B8B] cursor-pointer"
          />

          <div className="pt-2 border-t border-[#F0EFF5] space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#1D1B20]">Nutq balandligi (Pitch)</span>
              <span className="font-extrabold text-[#5E4B8B]">
                {voiceSettings.speechPitch.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.5"
              step="0.05"
              value={voiceSettings.speechPitch}
              onChange={(e) => updateVoiceSettings({ speechPitch: parseFloat(e.target.value) })}
              className="w-full accent-[#5E4B8B] cursor-pointer"
            />
          </div>
        </TalkMeCard>

        {/* ==========================================
            5. AUDIO CACHE
           ========================================== */}
        <TalkMeCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#1D1B20]">Audio Kesh (Audio Cache)</p>
              <p className="text-xs text-[#757575]">
                Generatsiya qilingan audiolarni xotirada saqlash (Max 200 MB)
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
        </TalkMeCard>

        {/* ==========================================
            6. EXACT PROSODY BENCHMARK SPEECH TEST
           ========================================== */}
        <div className="rounded-3xl p-5 bg-[#F1EDFA] border border-[#5E4B8B]/20 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-[#5E4B8B]">
              Prosodiya va Intonatsiya Sinovi
            </h4>
            <TalkMeBadge
              text="Benchmark Test"
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
            text={isTtsSpeaking ? 'Nutqni To‘xtatish' : 'Intonatsiya va Prosodiyani Sinash'}
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
                  : SAMPLE_STORY_FULL_TEXT.slice(0, 500)
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
              setTestReport('Barcha sozlamalar dastlabki holatga qaytarildi.');
            }}
          />
        </div>
      </div>
    </div>
  );
};
