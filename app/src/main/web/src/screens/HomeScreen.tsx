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
  Play,
  ArrowRight,
} from 'lucide-react';
import { TOPIC_LEARNING_GROUPS } from '../domain/learning/topicCatalog';
import { NOUNS_18_SUBTOPIC_IDS } from '../content/registry/subtopicsCatalog';
import { subtopicProgressEngine } from '../engines/subtopic-engine/subtopicProgressEngine';

export const HomeScreen: React.FC = () => {
  const {
    userName,
    streakDays,
    dailyStats,
    uniqueLearnedWordsCount,
    masteredGrammarRulesCount,
    completedLevelIds,
    navigate,
    currentUser,
    userPhotoURL,
    setActiveProfileTab,
    selectedCourseId,
  } = useApp();

  const [, setProgressTick] = React.useState<number>(0);
  React.useEffect(() => {
    const unsubscribe = subtopicProgressEngine.subscribe(() => {
      setProgressTick((prev) => prev + 1);
    });
    return () => unsubscribe();
  }, []);

  // Determine whether the user is entering for the first time or has ongoing progress
  const subtopicRecords = NOUNS_18_SUBTOPIC_IDS.map((id) =>
    subtopicProgressEngine.getRecord(id)
  );
  const hasAnySubtopicActivity = subtopicRecords.some(
    (rec) =>
      rec.isCompleted ||
      rec.currentStageNumber > 1 ||
      rec.completedStageNumbers.length > 0 ||
      rec.explanationViewed ||
      rec.examplesViewed ||
      rec.guidedPracticeCompleted ||
      rec.assessmentAttempts > 0
  );

  const hasStartedLearning =
    completedLevelIds.length > 0 ||
    hasAnySubtopicActivity ||
    uniqueLearnedWordsCount > 0 ||
    masteredGrammarRulesCount > 0;

  // Find exact lesson index the user is currently on (0..17)
  const firstUncompletedIndex = NOUNS_18_SUBTOPIC_IDS.findIndex((_id, idx) => {
    const levelId1 = `nouns_level_${idx + 1}`;
    const levelId2 = `nouns_lvl_${idx + 1}`;
    const rec = subtopicRecords[idx];
    const isLevelDone =
      completedLevelIds.includes(levelId1) ||
      completedLevelIds.includes(levelId2) ||
      rec.isCompleted;
    return !isLevelDone;
  });

  const currentLessonIndex =
    firstUncompletedIndex === -1
      ? NOUNS_18_SUBTOPIC_IDS.length - 1
      : firstUncompletedIndex;
  const currentLessonNumber = currentLessonIndex + 1;
  const currentLevelId = `nouns_level_${currentLessonNumber}`;
  const currentSubtopicId = NOUNS_18_SUBTOPIC_IDS[currentLessonIndex];

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

  const handlePlayCurrentLesson = () => {
    if (!hasStartedLearning) {
      navigate('lesson_detail', {
        courseId: 'english_fundamentals',
        levelId: 'ef_lvl_1',
        lessonId: 'ef_01_kirish',
      });
      return;
    }
    navigate('lesson_detail', {
      courseId: selectedCourseId || 'nouns',
      levelId: currentLevelId || 'nouns_level_1',
      lessonId: currentSubtopicId || NOUNS_18_SUBTOPIC_IDS[0],
    });
  };

  const bgImgUrl = 'images/grammar_fundamentals.png';

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-28 text-[#212121]">
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
              title="Ovoz studiyasi"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* 2. PRIMARY METRICS SUMMARY (Learned Words & Mastered Rules with Real BG Illustration Image) */}
        <section>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate('learned_words')}
              className="relative overflow-hidden rounded-xl bg-white border border-[#E0E4EC] p-3.5 sm:p-4 text-left shadow-[0_1px_3px_rgba(0,0,0,0.05)] cursor-pointer hover:border-[#3949AB] transition-all flex items-center justify-between gap-2 group"
            >
              <img
                src={bgImgUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/85 to-white/70 pointer-events-none" />

              <div className="relative z-10 min-w-0">
                <span className="text-xs font-semibold text-[#616161] block truncate">
                  Yodlangan noyob so‘zlar
                </span>
                <p className="text-xl sm:text-2xl font-bold text-[#3949AB] mt-1 tabular-nums">
                  {uniqueLearnedWordsCount} ta so‘z
                </p>
                <span className="text-[11px] sm:text-xs text-[#00897B] font-medium mt-1 inline-block truncate">
                  Ochilgan so‘zlarni ko‘rish
                </span>
              </div>
              <div className="relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#E8EAF6] text-[#3949AB] flex items-center justify-center shrink-0 group-hover:bg-[#3949AB] group-hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate('mastered_rules')}
              className="relative overflow-hidden rounded-xl bg-white border border-[#E0E4EC] p-3.5 sm:p-4 text-left shadow-[0_1px_3px_rgba(0,0,0,0.05)] cursor-pointer hover:border-[#3949AB] transition-all flex items-center justify-between gap-2 group"
            >
              <img
                src={bgImgUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/85 to-white/70 pointer-events-none" />

              <div className="relative z-10 min-w-0">
                <span className="text-xs font-semibold text-[#616161] block truncate">
                  O‘zlashtirilgan qoidalar
                </span>
                <p className="text-xl sm:text-2xl font-bold text-[#00897B] mt-1 tabular-nums">
                  {masteredGrammarRulesCount} ta qoida
                </p>
                <span className="text-[11px] sm:text-xs text-[#3949AB] font-medium mt-1 inline-block truncate">
                  Ochilgan qoidalarni ko‘rish
                </span>
              </div>
              <div className="relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#E0F2F1] text-[#00897B] flex items-center justify-center shrink-0 group-hover:bg-[#00897B] group-hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </button>
          </div>
        </section>

        {/* 3. ROADMAP OVERVIEW HERO CARD WITH REAL BACKGROUND ILLUSTRATION */}
        <section>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4338CA] border border-[#818CF8]/35 p-5 sm:p-6 text-white shadow-lg">
            <img
              src={bgImgUrl}
              alt="Grammar Fundamentals Background"
              className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B]/90 via-[#312E81]/80 to-[#4338CA]/60 pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-[#34D399]/20 border border-[#6EE7B7]/40 text-[#A7F3D0] text-[10px] font-black tracking-wider uppercase">
                    ROADMAP • O‘QUV DASTURI
                  </span>
                  <span className="text-[10px] font-extrabold text-[#C7D2FE]">
                    11 BO‘LIM
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-black/40 text-[#FCD34D] text-[10px] font-bold">
                  86 ta mavzu
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  Ingliz Tili Yo‘l Xaritasi
                </h2>
                <p className="text-xs sm:text-sm font-bold text-[#A7F3D0] mt-0.5">
                  Mening kurslarim sahifasida barcha mavzular ro‘yxati
                </p>
                <p className="text-xs text-[#E0E7FF]/90 leading-relaxed mt-1.5">
                  Duolingo uslubidagi interaktiv xarita, 3D qulflar va bosqichma-bosqich o‘quv rejasi. Darslarni birma-bir o‘rganib boramiz!
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => navigate('courses')}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-[#34D399] to-[#2DD4BF] text-[#020617] font-black text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer shadow-md"
                >
                  <span>Mening kurslarim (Yo‘l xaritasi)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate('lesson_detail', {
                      courseId: 'english_fundamentals',
                      levelId: 'ef_lvl_1',
                      lessonId: 'ef_01_kirish',
                    })
                  }
                  className="w-full h-10 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>1-Bo‘lim: Grammar Fundamentals xaritasiga o‘tish</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ACCUMULATED SKILLS PRACTICE HUB (With Real BG Illustration Cards) */}
        <section className="space-y-3">
          <div>
            <h2 className="text-base font-bold text-[#212121]">
              Ko‘nikmalar amaliyot markazi
            </h2>
            <p className="text-xs text-[#616161] mt-0.5">
              O‘tilgan darslar bo‘yicha tinglash, gapirish, o‘qish va yozish mashqlari
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 items-stretch">
            {[
              {
                skillType: 'listening' as const,
                title: 'Tinglash (Listening)',
                subtitle: 'Mavzular audiosi va talaffuz',
                badge: `${listeningCount} ta mashq`,
                Icon: Headphones,
              },
              {
                skillType: 'speaking' as const,
                title: 'Gapirish (Speaking)',
                subtitle: 'Ovozli takrorlash mashqlari',
                badge: `${speakingCount} ta ibora`,
                Icon: Mic,
              },
              {
                skillType: 'reading' as const,
                title: 'O‘qish (Reading)',
                subtitle: 'Dialoglar va qisqa hikoyalar',
                badge: `${readingCount} ta matn`,
                Icon: BookOpen,
              },
              {
                skillType: 'writing' as const,
                title: 'Yozish (Writing)',
                subtitle: 'S+V+O tartibida gap yig‘ish',
                badge: `${writingCount} ta gap`,
                Icon: Edit3,
              },
            ].map(({ skillType, title, subtitle, badge, Icon }) => (
              <button
                key={skillType}
                type="button"
                onClick={() => navigate('skill_practice', { skillType })}
                className="relative overflow-hidden flex flex-col justify-between h-full min-h-[132px] p-4 rounded-xl bg-white border border-[#E0E4EC] hover:border-[#3949AB] transition-all cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-left group"
              >
                <img
                  src={bgImgUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/88 to-white/75 pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between gap-2 w-full">
                  <div className="w-10 h-10 rounded-lg bg-[#E8EAF6] text-[#3949AB] group-hover:bg-[#3949AB] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-[#F5F6FA] border border-[#E0E4EC] text-xs font-semibold text-[#3949AB] tabular-nums shrink-0">
                    {badge}
                  </span>
                </div>

                <div className="relative z-10 mt-3 space-y-1 w-full min-w-0">
                  <p className="text-sm font-bold text-[#212121] group-hover:text-[#3949AB] transition-colors truncate">
                    {title}
                  </p>
                  <p className="text-xs text-[#616161] leading-snug line-clamp-2">
                    {subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 5. SPACED REPETITION CARD WITH BG ILLUSTRATION */}
        <button
          type="button"
          onClick={() => navigate('repeat')}
          className="relative overflow-hidden w-full rounded-xl p-4 bg-white border border-[#E0E4EC] cursor-pointer hover:border-[#00897B] transition-all shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex items-center justify-between text-left group"
        >
          <img
            src={bgImgUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#E0F2F1]/90 via-white/90 to-white/85 pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3.5">
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

          <div className="relative z-10 w-9 h-9 rounded-lg bg-[#E0F2F1] text-[#00897B] flex items-center justify-center shrink-0">
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* MX Player Style Floating Play FAB Button */}
      <button
        type="button"
        onClick={handlePlayCurrentLesson}
        aria-label="Darsni boshlash yoki davom ettirish"
        className="fixed bottom-20 right-5 z-40 w-14 h-14 rounded-full bg-[#3949AB] hover:bg-[#283593] text-white shadow-[0_4px_14px_rgba(57,73,171,0.45)] flex items-center justify-center cursor-pointer active:scale-95 transition-all"
      >
        <Play className="w-6 h-6 fill-current ml-0.5" />
      </button>

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
