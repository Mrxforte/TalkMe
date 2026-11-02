import React from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeBottomBar } from '../components/TalkMeBottomBar';
import {
  Flame,
  Mic,
  Headphones,
  BookOpen,
  Edit3,
  ChevronRight,
  Layers,
  Check,
} from 'lucide-react';
import { TOPIC_LEARNING_GROUPS } from '../domain/learning/topicCatalog';

export const HomeScreen: React.FC = () => {
  const {
    userName,
    streakDays,
    dailyStats,
    uniqueLearnedWordsCount,
    masteredGrammarRulesCount,
    navigate,
    currentUser,
    userPhotoURL,
    setActiveProfileTab,
    userLearnedWords,
  } = useApp();

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
    <div className="min-h-screen bg-[#F5F6FA] pb-24 text-[#212121]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 space-y-6">
        {/* 1. MATERIAL 2 TOP APP BAR */}
        <header className="flex items-center justify-between py-2.5 border-b border-[#E0E4EC]">
          <button
            type="button"
            onClick={() => {
              setActiveProfileTab(currentUser ? 0 : 2);
              navigate('profile');
            }}
            className="flex items-center gap-3 cursor-pointer text-left group"
          >
            {userPhotoURL ? (
              <img
                src={userPhotoURL}
                alt={userName}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full object-cover border border-[#E0E4EC]"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#3949AB] text-white flex items-center justify-center font-bold text-base">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <span className="text-xs font-medium text-[#616161] block">
                {currentUser ? 'Google hisob ulangan' : 'Xush kelibsiz'}
              </span>
              <span className="text-base font-bold text-[#212121] group-hover:text-[#3949AB] transition-colors">
                {userName}
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="min-h-[40px] px-3 py-1.5 rounded-lg bg-white border border-[#E0E4EC] text-[#212121] text-xs font-semibold flex items-center gap-1.5 tabular-nums">
              <Flame className="w-4 h-4 text-[#3949AB]" />
              <span>{streakDays} kun</span>
            </div>

            <button
              onClick={() => navigate('voice_studio')}
              type="button"
              className="w-11 h-11 rounded-lg bg-white border border-[#E0E4EC] text-[#3949AB] flex items-center justify-center hover:bg-[#E8EAF6] transition-colors cursor-pointer"
              title="Voice Studio"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* 2. PRIMARY METRICS SUMMARY (Learned Words & Mastered Rules) */}
        <section className="space-y-3">
          <div>
            <h1 className="text-xl font-bold text-[#212121] tracking-tight">
              O‘quv ko‘rsatkichlari
            </h1>
            <p className="text-xs text-[#616161] mt-0.5">
              O‘zlashtirilgan so‘zlar va grammatika qoidalari hisoboti
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveProfileTab(0);
                navigate('profile');
              }}
              className="rounded-xl bg-white border border-[#E0E4EC] p-4 text-left shadow-[0_1px_3px_rgba(0,0,0,0.05)] cursor-pointer hover:border-[#3949AB] transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-semibold text-[#616161]">
                  Yodlangan noyob so‘zlar
                </span>
                <p className="text-2xl font-bold text-[#3949AB] mt-1 tabular-nums">
                  {uniqueLearnedWordsCount} ta so‘z
                </p>
                <span className="text-xs text-[#00897B] font-medium mt-1 inline-block">
                  Mavzular bo‘yicha ko‘rish
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#E8EAF6] text-[#3949AB] flex items-center justify-center group-hover:bg-[#3949AB] group-hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveProfileTab(1);
                navigate('profile');
              }}
              className="rounded-xl bg-white border border-[#E0E4EC] p-4 text-left shadow-[0_1px_3px_rgba(0,0,0,0.05)] cursor-pointer hover:border-[#3949AB] transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-semibold text-[#616161]">
                  O‘zlashtirilgan qoidalar
                </span>
                <p className="text-2xl font-bold text-[#00897B] mt-1 tabular-nums">
                  {masteredGrammarRulesCount} ta qoida
                </p>
                <span className="text-xs text-[#3949AB] font-medium mt-1 inline-block">
                  Qoidalar ro‘yxatini ko‘rish
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#E0F2F1] text-[#00897B] flex items-center justify-center group-hover:bg-[#00897B] group-hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        </section>

        {/* 3. PRIMARY CURRICULUM ROADMAP BANNER */}
        <section className="rounded-xl p-5 bg-[#3949AB] text-white shadow-[0_2px_6px_rgba(57,73,171,0.2)] space-y-4">
          <div className="flex items-center justify-between text-xs text-white/80 font-medium">
            <div className="flex items-center gap-2">
              <span>O‘QUV DASTURI</span>
              <span aria-hidden="true">·</span>
              <span>11 BO‘LIM</span>
            </div>
            <span className="tabular-nums">86 ta mavzu</span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">
              Ingliz Tili O‘quv Yo‘l Xaritasi
            </h2>
            <p className="text-xs text-white/85 mt-1 leading-relaxed">
              Bosqichma-bosqich tuzilgan grammatika va muloqot kurslari. Har bir mavzuni ketma-ket o‘rganib boring.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() =>
                navigate('lesson_detail', {
                  lessonId: 'lesson_hello_a0',
                })
              }
              type="button"
              className="flex-1 min-h-[44px] py-2.5 px-4 rounded-lg bg-white text-[#3949AB] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#E8EAF6] transition-colors cursor-pointer"
            >
              <span>1-Dars: Hello! (A0 Universal Player)</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('practice_center')}
              type="button"
              className="flex-1 min-h-[44px] py-2.5 px-4 rounded-lg bg-[#00897B] text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#00695C] transition-colors cursor-pointer"
            >
              <span>Practice Center (110 Mashq)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* 4. TOPIC-BASED VOCABULARY & GRAMMAR RULES HUB (Opens Dedicated Full Screen) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#212121]">
                Mavzular bo‘yicha so‘zlar va qoidalar
              </h2>
              <p className="text-xs text-[#616161] mt-0.5">
                Mavzuni tanlang — o‘rganiladigan so‘zlar va qoidalar alohida sahifada ochiladi
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveProfileTab(0);
                navigate('profile');
              }}
              className="text-xs text-[#3949AB] font-semibold hover:underline cursor-pointer whitespace-nowrap"
            >
              Barchasi
            </button>
          </div>

          <div className="space-y-2.5">
            {TOPIC_LEARNING_GROUPS.map((topic) => {
              const liveWords = topic.words.map((tw) => {
                const found = userLearnedWords.find((w) => w.id === tw.id);
                return found ? { ...tw, status: found.status } : tw;
              });
              const learnedInTopic = liveWords.filter((w) => w.status === 'learned').length;
              const wordsSample = topic.words
                .slice(0, 4)
                .map((w) => w.word)
                .join(', ');

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => navigate('topic_detail', { topicId: topic.id })}
                  className="w-full text-left p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-[0_1px_3px_rgba(0,0,0,0.05)] cursor-pointer hover:border-[#3949AB] transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-lg bg-[#E8EAF6] text-[#3949AB] flex items-center justify-center shrink-0">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs text-[#616161] font-medium">
                          <span className="text-[#3949AB] font-semibold">{topic.section}</span>
                          <span aria-hidden="true">·</span>
                          <span>Daraja {topic.level}</span>
                        </div>
                        <h3 className="text-sm font-bold text-[#212121] mt-0.5 truncate group-hover:text-[#3949AB] transition-colors">
                          {topic.title}
                        </h3>
                        <p className="text-xs text-[#616161] mt-0.5 line-clamp-1">
                          {topic.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="w-9 h-9 rounded-lg bg-[#F5F6FA] group-hover:bg-[#3949AB] group-hover:text-white flex items-center justify-center text-[#616161] transition-colors shrink-0">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#E0E4EC] flex flex-wrap items-center justify-between gap-2 text-xs text-[#616161]">
                    <div className="flex items-center gap-2 font-medium tabular-nums">
                      <span className="text-[#00897B] font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        {learnedInTopic}/{topic.words.length} so‘z
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{topic.rules.length} ta qoida</span>
                    </div>

                    <span className="text-xs text-[#616161] truncate max-w-[200px]">
                      So‘zlar: {wordsSample}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. ACCUMULATED SKILLS PRACTICE HUB (Opens Dedicated Full Screen) */}
        <section className="space-y-3">
          <div>
            <h2 className="text-base font-bold text-[#212121]">
              Ko‘nikmalar amaliyot markazi
            </h2>
            <p className="text-xs text-[#616161] mt-0.5">
              O‘tilgan darslar bo‘yicha tinglash, gapirish, o‘qish va yozish mashqlari
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Listening */}
            <button
              type="button"
              onClick={() => navigate('skill_practice', { skillType: 'listening' })}
              className="p-4 rounded-xl bg-white border border-[#E0E4EC] hover:border-[#3949AB] transition-all cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-left group"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-10 h-10 rounded-lg bg-[#E8EAF6] text-[#3949AB] flex items-center justify-center">
                  <Headphones className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#3949AB] tabular-nums">
                  {listeningCount} ta mashq
                </span>
              </div>
              <p className="text-sm font-bold text-[#212121] group-hover:text-[#3949AB] transition-colors">
                Tinglash (Listening)
              </p>
              <p className="text-xs text-[#616161] mt-0.5">
                Mavzular audiosi va talaffuz
              </p>
            </button>

            {/* Speaking */}
            <button
              type="button"
              onClick={() => navigate('skill_practice', { skillType: 'speaking' })}
              className="p-4 rounded-xl bg-white border border-[#E0E4EC] hover:border-[#3949AB] transition-all cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-left group"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-10 h-10 rounded-lg bg-[#E0F2F1] text-[#00897B] flex items-center justify-center">
                  <Mic className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#00897B] tabular-nums">
                  {speakingCount} ta ibora
                </span>
              </div>
              <p className="text-sm font-bold text-[#212121] group-hover:text-[#00897B] transition-colors">
                Gapirish (Speaking)
              </p>
              <p className="text-xs text-[#616161] mt-0.5">
                Ovozli takrorlash mashqlari
              </p>
            </button>

            {/* Reading */}
            <button
              type="button"
              onClick={() => navigate('skill_practice', { skillType: 'reading' })}
              className="p-4 rounded-xl bg-white border border-[#E0E4EC] hover:border-[#3949AB] transition-all cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-left group"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-10 h-10 rounded-lg bg-[#E8EAF6] text-[#3949AB] flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#3949AB] tabular-nums">
                  {readingCount} ta matn
                </span>
              </div>
              <p className="text-sm font-bold text-[#212121] group-hover:text-[#3949AB] transition-colors">
                O‘qish (Reading)
              </p>
              <p className="text-xs text-[#616161] mt-0.5">
                Dialoglar va qisqa hikoyalar
              </p>
            </button>

            {/* Writing */}
            <button
              type="button"
              onClick={() => navigate('skill_practice', { skillType: 'writing' })}
              className="p-4 rounded-xl bg-white border border-[#E0E4EC] hover:border-[#3949AB] transition-all cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-left group"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-10 h-10 rounded-lg bg-[#E0F2F1] text-[#00897B] flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[#00897B] tabular-nums">
                  {writingCount} ta gap
                </span>
              </div>
              <p className="text-sm font-bold text-[#212121] group-hover:text-[#00897B] transition-colors">
                Yozish (Writing)
              </p>
              <p className="text-xs text-[#616161] mt-0.5">
                S+V+O tartibida gap yig‘ish
              </p>
            </button>
          </div>
        </section>

        {/* 6. SPACED REPETITION CARD */}
        <button
          type="button"
          onClick={() => navigate('repeat')}
          className="w-full rounded-xl p-4 bg-white border border-[#E0E4EC] cursor-pointer hover:border-[#00897B] transition-all shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-[#00897B] text-white flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#212121] group-hover:text-[#00897B] transition-colors">
                Bugun {dailyStats.dueWordsCount} ta so‘zni takrorlang
              </p>
              <p className="text-xs text-[#616161] mt-0.5">
                FSRS xotira algoritmi · ~{dailyStats.estimatedMinutesRemaining} daqiqa
              </p>
            </div>
          </div>

          <div className="w-9 h-9 rounded-lg bg-[#E0F2F1] text-[#00897B] flex items-center justify-center shrink-0">
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>

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
