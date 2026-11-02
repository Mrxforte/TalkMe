import React, { useState } from 'react';
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
  Layers,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { TOPIC_LEARNING_GROUPS, TopicLearningGroup } from '../domain/learning/topicCatalog';
import { TopicDetailsModal } from '../components/TopicDetailsModal';
import { SkillPracticeModal } from '../components/SkillPracticeModal';

export const HomeScreen: React.FC = () => {
  const {
    userName,
    streakDays,
    weeklyCompletedLessons,
    weeklyGoalLessons,
    dailyStats,
    uniqueLearnedWordsCount,
    masteredGrammarRulesCount,
    navigate,
    playTts,
    currentUser,
    userPhotoURL,
    setActiveProfileTab,
    cloudSyncStatus,
    userLearnedWords,
    userMasteredRules,
  } = useApp();

  // Modals state
  const [selectedTopicForModal, setSelectedTopicForModal] = useState<TopicLearningGroup | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<'listening' | 'speaking' | 'reading' | 'writing' | null>(null);

  // Skill badge calculation
  const listeningCount = TOPIC_LEARNING_GROUPS.reduce(
    (sum, t) => sum + (t.skillItems.listening?.length || 0),
    0
  );
  const speakingCount = TOPIC_LEARNING_GROUPS.reduce(
    (sum, t) => sum + (t.skillItems.speaking?.length || 0),
    0
  );
  const readingCount = TOPIC_LEARNING_GROUPS.reduce(
    (sum, t) => sum + (t.skillItems.reading?.length || 0),
    0
  );
  const writingCount = TOPIC_LEARNING_GROUPS.reduce(
    (sum, t) => sum + (t.skillItems.writing?.length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-24 text-[#1D1B20]">
      <div className="px-5 pt-4 space-y-5 max-w-md mx-auto">
        {/* ==========================================
            1. HOME HEADER (Avatar, Streak, Voice Studio)
           ========================================== */}
        <div className="flex items-center justify-between">
          <div
            onClick={() => {
              setActiveProfileTab(currentUser ? 0 : 2);
              navigate('profile');
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {userPhotoURL ? (
              <img
                src={userPhotoURL}
                alt={userName}
                className="w-11 h-11 rounded-full object-cover border-2 border-emerald-400 shadow-xs group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#D2F5DC] text-[#2E7D32] flex items-center justify-center font-extrabold text-lg border-2 border-white shadow-xs group-hover:scale-105 transition-transform">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <span className="text-[11px] font-bold text-[#757575] uppercase tracking-wider flex items-center gap-1">
                {currentUser ? (
                  <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Google hisob
                  </span>
                ) : (
                  'Xush kelibsiz'
                )}
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
            2. GREETING HEADER & GLOBAL COUNTERS
           ========================================== */}
        <div>
          <h2 className="text-2xl font-extrabold text-[#1D1B20] tracking-tight">
            Salom, {userName}!
          </h2>
          <p className="text-sm text-[#757575] mt-0.5">Kichik qadamlar, katta imkoniyatlar.</p>

          <div className="grid grid-cols-2 gap-2.5 mt-3">
            <div
              onClick={() => {
                setActiveProfileTab(0);
                navigate('profile');
              }}
              className="rounded-2xl bg-white border border-[#E8F8EE] p-3 shadow-xs cursor-pointer hover:border-emerald-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#27AE60]">
                  Yodlangan Noyob So‘zlar
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#27AE60] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-lg font-black text-[#1D1B20] mt-0.5">
                {uniqueLearnedWordsCount} ta so‘z
              </p>
              <span className="text-[11px] text-[#757575] flex items-center gap-1">
                Ro‘yxatni ko‘rish →
              </span>
            </div>

            <div
              onClick={() => {
                setActiveProfileTab(1);
                navigate('profile');
              }}
              className="rounded-2xl bg-white border border-[#F1EDFA] p-3 shadow-xs cursor-pointer hover:border-indigo-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5E4B8B]">
                  O‘zlashtirilgan Qoidalar
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#5E4B8B] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-lg font-black text-[#1D1B20] mt-0.5">
                {masteredGrammarRulesCount} ta qoida
              </p>
              <span className="text-[11px] text-[#757575] flex items-center gap-1">
                Qoidalarni ko‘rish →
              </span>
            </div>
          </div>
        </div>

        {/* ==========================================
            3. ROADMAP OVERVIEW CARD (MENING KURSLARIM)
           ========================================== */}
        <div className="rounded-3xl p-5 bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white border border-indigo-400/30 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-400/20 border border-emerald-300/40 text-emerald-200 text-xs font-black">
                ROADMAP • O‘QUV DASTURI
              </span>
              <span className="text-xs font-extrabold text-indigo-200 tracking-wide">
                11 BO‘LIM
              </span>
            </div>

            <span className="text-xs font-bold text-amber-300 bg-black/30 px-2.5 py-1 rounded-full">
              86 ta mavzu
            </span>
          </div>

          <h3 className="text-xl font-black text-white">Ingliz Tili Yo‘l Xaritasi</h3>
          <p className="text-xs text-indigo-200 font-bold mt-0.5">
            Mening kurslarim sahifasida barcha mavzular ro‘yxati
          </p>

          <p className="text-xs text-indigo-100/90 mt-2 leading-relaxed">
            Duolingo uslubidagi interaktiv xarita, 3D qulflar va bosqichma-bosqich o‘quv rejasi.
          </p>

          <div className="mt-4 pt-3 border-t border-white/15 space-y-2">
            <button
              onClick={() => navigate('courses')}
              type="button"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer shadow-md active:scale-[0.99]"
            >
              <span>Mening kurslarim (Yo‘l xaritasi)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ==========================================
            4. TOPIC-BASED WORDS & RULES HUB (Katta mavzular)
           ========================================== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#1D1B20]">
                Mavzular Bo‘yicha So‘z va Qoidalar
              </h3>
              <p className="text-xs text-[#757575]">
                Katta mavzuni tanlang — o‘rganiladigan so‘zlar to‘liq ochiladi
              </p>
            </div>
            <span
              onClick={() => {
                setActiveProfileTab(0);
                navigate('profile');
              }}
              className="text-xs text-[#5E4B8B] font-bold cursor-pointer hover:underline"
            >
              Barchasi
            </span>
          </div>

          <div className="space-y-2.5">
            {TOPIC_LEARNING_GROUPS.map((topic) => {
              const liveWords = topic.words.map((tw) => {
                const found = userLearnedWords.find((w) => w.id === tw.id);
                return found ? { ...tw, status: found.status } : tw;
              });
              const learnedInTopic = liveWords.filter((w) => w.status === 'learned').length;
              const wordsSample = topic.words.slice(0, 4).map((w) => w.word).join(', ');

              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopicForModal(topic)}
                  className="p-4 rounded-3xl bg-white border border-[#EBE8F3] shadow-xs cursor-pointer hover:border-[#5E4B8B] hover:shadow-sm transition-all group active:scale-[0.99]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="w-11 h-11 rounded-2xl bg-[#F7F6FB] text-2xl flex items-center justify-center shrink-0 border border-[#EBE8F3] group-hover:scale-105 transition-transform">
                        {topic.iconEmoji}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#5E4B8B] bg-[#F1EDFA] px-2 py-0.5 rounded-md">
                            {topic.section}
                          </span>
                          <span className="text-[10px] font-bold text-[#757575]">
                            {topic.level}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-[#1D1B20] mt-1 leading-snug truncate">
                          {topic.title}
                        </h4>
                        <p className="text-xs text-[#757575] mt-0.5 line-clamp-1">
                          {topic.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-[#F7F6FB] group-hover:bg-[#5E4B8B] group-hover:text-white flex items-center justify-center text-[#757575] transition-colors shrink-0">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Badges row & words preview */}
                  <div className="mt-3 pt-2.5 border-t border-[#F0EFF5] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md font-extrabold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {learnedInTopic}/{topic.words.length} so‘z
                      </span>
                      <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {topic.rules.length} ta qoida
                      </span>
                    </div>

                    <span className="text-[11px] text-[#757575] italic truncate max-w-[170px]">
                      {wordsSample}...
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==========================================
            5. SKILLS HUB (Reading, Listening, Speaking, Writing)
           ========================================== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#1D1B20]">
                O‘tilgan Darslar Amaliyot Markazi
              </h3>
              <p className="text-xs text-[#757575]">
                Har bir ko‘nikma o‘tilgan mavzular bo‘yicha yig‘ilib boradi
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Interaktiv Badge
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Listening */}
            <div
              onClick={() => setSelectedSkill('listening')}
              className="p-3.5 rounded-2xl bg-white border border-[#F0EFF5] hover:border-[#5E4B8B]/40 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#F1EDFA] text-[#5E4B8B] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Headphones className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#F1EDFA] text-[#5E4B8B] border border-[#5E4B8B]/20">
                  {listeningCount} ta audio
                </span>
              </div>
              <p className="text-sm font-black text-[#1D1B20]">Tinglash</p>
              <p className="text-xs text-[#757575] mt-0.5">Listening · Mavzular audiosi</p>
              <div className="mt-2 text-[10px] font-bold text-[#5E4B8B] flex items-center gap-1 group-hover:underline">
                <span>Mashq qilish</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>

            {/* Speaking */}
            <div
              onClick={() => setSelectedSkill('speaking')}
              className="p-3.5 rounded-2xl bg-white border border-[#F0EFF5] hover:border-[#5E4B8B]/40 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#FFF4E5] text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Mic className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#FFF4E5] text-amber-700 border border-[#FFE0B2]">
                  {speakingCount} ta ibora
                </span>
              </div>
              <p className="text-sm font-black text-[#1D1B20]">Gapirish</p>
              <p className="text-xs text-[#757575] mt-0.5">Speaking · Gemini 3.8 TTS</p>
              <div className="mt-2 text-[10px] font-bold text-amber-600 flex items-center gap-1 group-hover:underline">
                <span>Talaffuz sinovi</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>

            {/* Reading */}
            <div
              onClick={() => setSelectedSkill('reading')}
              className="p-3.5 rounded-2xl bg-white border border-[#F0EFF5] hover:border-[#5E4B8B]/40 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#E8F8EE] text-[#27AE60] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#E8F8EE] text-[#27AE60] border border-[#27AE60]/30">
                  {readingCount} ta matn
                </span>
              </div>
              <p className="text-sm font-black text-[#1D1B20]">O‘qish</p>
              <p className="text-xs text-[#757575] mt-0.5">Reading · Muloqotlar</p>
              <div className="mt-2 text-[10px] font-bold text-[#27AE60] flex items-center gap-1 group-hover:underline">
                <span>O‘qish va tushunish</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>

            {/* Writing */}
            <div
              onClick={() => setSelectedSkill('writing')}
              className="p-3.5 rounded-2xl bg-white border border-[#F0EFF5] hover:border-[#5E4B8B]/40 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#E5F6FE] text-[#0284C7] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Edit3 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#E5F6FE] text-[#0284C7] border border-[#BAE6FD]">
                  {writingCount} ta LEGO gap
                </span>
              </div>
              <p className="text-sm font-black text-[#1D1B20]">Yozish</p>
              <p className="text-xs text-[#757575] mt-0.5">Writing · S+V+O tuzish</p>
              <div className="mt-2 text-[10px] font-bold text-[#0284C7] flex items-center gap-1 group-hover:underline">
                <span>Gap yig‘ish</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            6. VOCABULARY BANNER CARD (Spaced Repetition)
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
                Bugun {dailyStats.dueWordsCount} ta so‘zni takrorlang
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
      </div>

      {/* ==========================================
          MODALS: TOPIC DETAILS & SKILL PRACTICE
         ========================================== */}
      <TopicDetailsModal
        topic={selectedTopicForModal}
        onClose={() => setSelectedTopicForModal(null)}
        onStartPractice={() => {
          setSelectedSkill('listening');
        }}
      />

      <SkillPracticeModal
        skillType={selectedSkill}
        onClose={() => setSelectedSkill(null)}
      />

      <TalkMeBottomBar
        selectedTab={0}
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
