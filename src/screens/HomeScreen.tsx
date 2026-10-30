import React from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeBottomBar } from '../components/TalkMeBottomBar';
import { TalkMeBadge } from '../components/TalkMeBadge';
import { TalkMeCard } from '../components/TalkMeCard';
import { TalkMeProgressBar } from '../components/TalkMeProgressBar';
import {
  Flame,
  Mic,
  Headphones,
  BookOpen,
  Edit3,
  Coffee,
  ChevronRight,
  Sparkles,
  Sliders,
  Volume2,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    userName,
    streakDays,
    weeklyCompletedLessons,
    weeklyGoalLessons,
    dailyStats,
    navigate,
    playTts,
    isTtsSpeaking,
  } = useApp();

  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-24 text-[#1D1B20]">
      <div className="px-5 pt-4 space-y-5">
        {/* ==========================================
            1. HOME HEADER (Avatar, Streak, Voice Studio)
           ========================================== */}
        <div className="flex items-center justify-between">
          <div
            onClick={() => navigate('profile')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-[#D2F5DC] text-[#2E7D32] flex items-center justify-center font-extrabold text-lg border-2 border-white shadow-xs group-hover:scale-105 transition-transform">
              {userName.charAt(0)}
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#757575] uppercase tracking-wider">
                Xush kelibsiz
              </span>
              <p className="text-sm font-extrabold text-[#1D1B20] flex items-center gap-1">
                {userName}
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Streak Counter Chip */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF4E5] border border-[#FFE0B2] text-[#FF9600] text-xs font-bold shadow-xs">
              <Flame className="w-4 h-4 fill-[#FF9600] text-[#FF9600]" />
              <span>{streakDays} kun</span>
            </div>

            {/* Voice Studio quick button */}
            <button
              onClick={() => navigate('voice_studio')}
              type="button"
              className="w-10 h-10 rounded-full bg-[#F1EDFA] text-[#5E4B8B] flex items-center justify-center border border-[#5E4B8B]/20 hover:bg-[#5E4B8B] hover:text-white transition-colors cursor-pointer"
              title="Voice Studio"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ==========================================
            2. GREETING HEADER
           ========================================== */}
        <div>
          <h2 className="text-2xl font-extrabold text-[#1D1B20] tracking-tight">
            Salom, {userName}!
          </h2>
          <p className="text-sm text-[#757575] mt-0.5">Kichik qadamlar, katta imkoniyatlar.</p>
        </div>

        {/* ==========================================
            3. CURRENT LESSON CARD (Present Continuous)
           ========================================== */}
        <div className="rounded-3xl p-5 bg-[#F1EDFA] border border-[#5E4B8B]/20 relative overflow-hidden shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TalkMeBadge
                text="A2"
                containerColor="bg-white"
                textColor="text-[#5E4B8B]"
              />
              <span className="text-xs font-extrabold text-[#5E4B8B] tracking-wide">
                GRAMMATIKA
              </span>
            </div>

            <span className="text-xs font-semibold text-[#757575] bg-white/70 px-2.5 py-1 rounded-full">
              8 daqiqa
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-[#1D1B20]">Present continuous</h3>
          <p className="text-xs text-[#5E4B8B] font-semibold mt-0.5">
            Hozir davom etayotgan ish-harakatlar
          </p>

          <p className="text-xs text-[#757575] mt-2 leading-relaxed">
            Tasdiq gaplar tuzilishi: am / is / are + fe’l-ing qoidasi va jonli misollar.
          </p>

          <div className="mt-4 pt-3 border-t border-[#5E4B8B]/15 flex items-center justify-between">
            <button
              onClick={() => navigate('lesson_detail', { levelId: 'present_continuous' })}
              type="button"
              className="w-full py-3 px-4 rounded-xl bg-[#5E4B8B] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#4E3D75] transition-all cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <span>Darsni davom ettirish</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ==========================================
            4. VOCABULARY BANNER CARD (Spaced Repetition)
           ========================================== */}
        <div
          onClick={() => navigate('repeat')}
          className="rounded-2xl p-4.5 bg-[#E8F8EE] border border-[#27AE60]/30 cursor-pointer hover:border-[#27AE60] transition-all shadow-xs flex items-center justify-between group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#27AE60] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#1D1B20]">
                Bugun {dailyStats.dueWordsCount} ta so‘zni eslang
              </p>
              <p className="text-xs text-[#2E7D32] font-semibold mt-0.5">
                FSRS oraliqli takrorlash · ~{dailyStats.estimatedMinutesRemaining} daqiqa
              </p>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-white text-[#27AE60] flex items-center justify-center shadow-xs">
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        {/* ==========================================
            5. SKILLS SECTION (Tinglash, Gapirish, O'qish, Yozish)
           ========================================== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#1D1B20]">
              Har kuni, har bir ko‘nikma
            </h3>
            <span className="text-xs text-[#5E4B8B] font-bold cursor-pointer hover:underline" onClick={() => navigate('courses')}>
              Barchasi
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Listening */}
            <div
              onClick={() => playTts("Hello! Listening practice builds your understanding.")}
              className="p-3.5 rounded-2xl bg-white border border-[#F0EFF5] hover:border-[#5E4B8B]/40 transition-all cursor-pointer shadow-xs group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#F1EDFA] text-[#5E4B8B] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Headphones className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-[#1D1B20]">Tinglash</p>
              <p className="text-xs text-[#757575] mt-0.5">Listening · 8 daq</p>
            </div>

            {/* Speaking */}
            <div
              onClick={() => navigate('voice_studio')}
              className="p-3.5 rounded-2xl bg-white border border-[#F0EFF5] hover:border-[#5E4B8B]/40 transition-all cursor-pointer shadow-xs group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#FFF4E5] text-amber-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Mic className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-[#1D1B20]">Gapirish</p>
              <p className="text-xs text-[#757575] mt-0.5">Speaking · 5 daq</p>
            </div>

            {/* Reading */}
            <div
              onClick={() => navigate('courses')}
              className="p-3.5 rounded-2xl bg-white border border-[#F0EFF5] hover:border-[#5E4B8B]/40 transition-all cursor-pointer shadow-xs group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#E8F8EE] text-[#27AE60] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-[#1D1B20]">O‘qish</p>
              <p className="text-xs text-[#757575] mt-0.5">Reading · 6 daq</p>
            </div>

            {/* Writing */}
            <div
              onClick={() => navigate('quiz')}
              className="p-3.5 rounded-2xl bg-white border border-[#F0EFF5] hover:border-[#5E4B8B]/40 transition-all cursor-pointer shadow-xs group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#E5F6FE] text-[#0284C7] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Edit3 className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-[#1D1B20]">Yozish</p>
              <p className="text-xs text-[#757575] mt-0.5">Writing · 7 daq</p>
            </div>
          </div>
        </div>

        {/* ==========================================
            6. WEEKLY PLAN SECTION
           ========================================== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#1D1B20]">Haftalik reja</h3>
            <span className="text-xs font-bold text-[#27AE60]">
              {weeklyCompletedLessons}/{weeklyGoalLessons} dars
            </span>
          </div>

          <TalkMeCard>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <TalkMeBadge
                  text="A2 o‘quvchi"
                  containerColor="bg-[#F1EDFA]"
                  textColor="text-[#5E4B8B]"
                />
                <span className="text-xs text-[#757575] font-semibold">
                  {Math.round((weeklyCompletedLessons / weeklyGoalLessons) * 100)}% bajarildi
                </span>
              </div>

              <TalkMeProgressBar
                progress={weeklyCompletedLessons / weeklyGoalLessons}
                progressColor="bg-[#27AE60]"
              />

              {/* Real Situation task */}
              <div
                onClick={() => playTts("Could I have some tea, please?")}
                className="mt-3 p-3 rounded-xl bg-[#FAFAFC] border border-[#F0EFF5] flex items-center justify-between cursor-pointer hover:bg-[#F3EFFC]/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1D1B20]">Real vaziyatlar</p>
                    <p className="text-[11px] text-[#757575]">
                      Kafeda buyurtma · “Could I have some tea?”
                    </p>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full bg-white text-[#5E4B8B] flex items-center justify-center shadow-xs">
                  <Volume2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </TalkMeCard>
        </div>
      </div>

      <TalkMeBottomBar selectedTab={0} onTabSelected={(idx) => {
        if (idx === 0) navigate('home');
        if (idx === 1) navigate('courses');
        if (idx === 2) navigate('repeat');
        if (idx === 3) navigate('profile');
      }} />
    </div>
  );
};
