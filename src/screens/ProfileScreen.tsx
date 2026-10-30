import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBottomBar } from '../components/TalkMeBottomBar';
import { TalkMeBadge } from '../components/TalkMeBadge';
import { TalkMeCard } from '../components/TalkMeCard';
import { TalkMeButton } from '../components/TalkMeButton';
import { TalkMeTabRow } from '../components/TalkMeTabRow';
import {
  Flame,
  Volume2,
  Mic,
  Sliders,
  Award,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const {
    userName,
    userLevel,
    xp,
    streakDays,
    voiceSettings,
    updateVoiceSettings,
    navigate,
    goBack,
    playTts,
    isTtsSpeaking,
  } = useApp();

  const [selectedLeaderboardTab, setSelectedLeaderboardTab] = useState<number>(0);

  const leaderboardUsers = [
    { rank: 1, name: 'Madina S.', xp: '1 480 XP', isUser: false },
    { rank: 2, name: 'Jasur K.', xp: '1 320 XP', isUser: false },
    { rank: 3, name: 'Sardor M.', xp: '1 280 XP', isUser: false },
    { rank: 4, name: `${userName} (Siz)`, xp: `${xp.toLocaleString()} XP`, isUser: true },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-24 text-[#1D1B20]">
      <div className="px-5 pt-4 space-y-4 max-w-md mx-auto">
        <TalkMeHeader
          title="Profilim"
          subtitle="O‘rganish yo‘lim va yutuqlar"
          onBackClick={goBack}
        />

        {/* User Info Header Card */}
        <div className="rounded-3xl p-5 bg-[#F1EDFA] border border-[#5E4B8B]/20 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-full bg-white text-[#5E4B8B] font-black text-xl flex items-center justify-center border-2 border-white shadow-xs">
              {userName.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#1D1B20]">{userName}</h2>
              <p className="text-xs text-[#757575]">Toshkent · 2026-yil sentabrdan</p>
            </div>
          </div>

          <TalkMeBadge
            text={userLevel}
            containerColor="bg-white"
            textColor="text-[#5E4B8B]"
          />
        </div>

        {/* XP and Rank Badges */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-white border border-[#F0EFF5] text-center shadow-xs">
            <span className="text-xs text-[#757575] font-semibold">Jami to‘plangan</span>
            <p className="text-xl font-black text-[#5E4B8B] mt-0.5">{xp.toLocaleString()} XP</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#F0EFF5] text-center shadow-xs">
            <span className="text-xs text-[#757575] font-semibold">Haftalik reyting</span>
            <p className="text-xl font-black text-[#27AE60] mt-0.5">4-o‘rin</p>
          </div>
        </div>

        {/* Streak Card */}
        <TalkMeCard>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF4E5] text-[#FF9600] flex items-center justify-center shadow-xs">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#1D1B20]">
                {streakDays} kun ketma-ket! Bugun bajarildi
              </p>
              <p className="text-xs text-[#757575]">O‘rganish odatini mustahkam ushlang</p>
            </div>
          </div>
        </TalkMeCard>

        {/* ==========================================
            SECTION 1: RESULTS & LEADERBOARD
           ========================================== */}
        <div className="pt-2 space-y-3">
          <div>
            <h3 className="text-base font-extrabold text-[#1D1B20]">Reyting</h3>
            <p className="text-xs text-[#757575]">Birga o‘rganamiz, birga o‘samiz</p>
          </div>

          <TalkMeTabRow
            tabs={['Bu hafta', 'Jami']}
            selectedIndex={selectedLeaderboardTab}
            onTabSelected={setSelectedLeaderboardTab}
          />

          {/* Motivational banner */}
          <div className="p-3.5 rounded-2xl bg-[#E8F8EE] border border-[#27AE60]/30 shadow-xs flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-[#27AE60] shrink-0" />
            <p className="text-xs text-[#2E7D32] font-semibold leading-relaxed">
              Kuchli uchlikka yana 40 XP! O‘z sur‘atingizda davom eting, {userName}.
            </p>
          </div>

          {/* Student Rankings List */}
          <TalkMeCard className="p-4 space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#5E4B8B]">
              A2 BILIMDONLARI · 20 O‘QUVCHI
            </span>

            <div className="space-y-2 pt-1 divide-y divide-[#F0EFF5]">
              {leaderboardUsers.map((u) => (
                <div
                  key={u.rank}
                  className={`pt-2 flex items-center justify-between ${
                    u.isUser ? 'bg-[#F1EDFA]/50 -mx-2 px-2 py-1.5 rounded-xl' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-black w-6 ${
                        u.isUser ? 'text-[#5E4B8B]' : 'text-[#757575]'
                      }`}
                    >
                      #{u.rank}
                    </span>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                        u.isUser
                          ? 'bg-[#5E4B8B] text-white'
                          : 'bg-[#F0EFF5] text-[#1D1B20]'
                      }`}
                    >
                      {u.name.charAt(0)}
                    </div>

                    <span
                      className={`text-sm ${
                        u.isUser ? 'font-black text-[#5E4B8B]' : 'font-bold text-[#1D1B20]'
                      }`}
                    >
                      {u.name}
                    </span>
                  </div>

                  <TalkMeBadge
                    text={u.xp}
                    containerColor={u.isUser ? 'bg-[#5E4B8B]' : 'bg-[#F0EFF5]'}
                    textColor={u.isUser ? 'text-white' : 'text-[#757575]'}
                  />
                </div>
              ))}
            </div>
          </TalkMeCard>
        </div>

        {/* ==========================================
            SECTION 2: VOICE AI ENGINE & MODEL CONTROLS
           ========================================== */}
        <div className="pt-2 space-y-3">
          <div>
            <h3 className="text-base font-extrabold text-[#1D1B20]">
              Ovozli AI Engine & Model Sozlamalari
            </h3>
            <p className="text-xs text-[#757575]">
              TTS dvigatellari, modellar va ovoz tezligini boshqarish
            </p>
          </div>

          <div className="rounded-3xl p-5 bg-[#F1EDFA] border border-[#5E4B8B]/20 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-[#5E4B8B]">
                  Aktiv Dvigatel: Sherpa-ONNX Local
                </h4>
                <p className="text-xs text-[#757575]">Oflayn local AI model (Locale.US)</p>
              </div>

              <TalkMeBadge
                text="OFFLINE"
                containerColor="bg-[#E8F8EE]"
                textColor="text-[#27AE60]"
              />
            </div>

            {/* Speed slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1D1B20]">
                  Ovoz tezligi: {voiceSettings.speechSpeed.toFixed(2)}x
                </span>

                <button
                  onClick={() => playTts('Welcome to TalkMe English learning platform!')}
                  type="button"
                  className="px-3 py-1 rounded-full bg-[#5E4B8B] text-white font-bold flex items-center gap-1.5 hover:bg-[#4E3D75] transition-colors cursor-pointer text-xs"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Eshitish</span>
                </button>
              </div>

              <input
                type="range"
                min="0.65"
                max="1.25"
                step="0.05"
                value={voiceSettings.speechSpeed}
                onChange={(e) => updateVoiceSettings({ speechSpeed: parseFloat(e.target.value) })}
                className="w-full accent-[#5E4B8B] cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <TalkMeButton
              text="Voice Studio — Ovoz Sinov Muhiti"
              trailingIcon={<Mic className="w-5 h-5" />}
              onClick={() => navigate('voice_studio')}
            />

            <TalkMeButton
              text="Barcha Voice AI Sozlamalari"
              variant="secondary"
              trailingIcon={<Sliders className="w-5 h-5" />}
              onClick={() => navigate('voice_settings')}
            />
          </div>
        </div>
      </div>

      <TalkMeBottomBar
        selectedTab={3}
        onTabSelected={(idx) => {
          if (idx === 0) navigate('home');
          if (idx === 1) navigate('courses');
          if (idx === 2) navigate('repeat');
          if (idx === 3) navigate('profile');
        }}
      />
    </div>
  );
};
