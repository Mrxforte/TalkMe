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
  } = useApp();

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
    const levelId = `nouns_level_${idx + 1}`;
    const rec = subtopicRecords[idx];
    return !completedLevelIds.includes(levelId) && !rec.isCompleted;
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
    navigate('lesson_detail', {
      courseId: 'nouns',
      levelId: hasStartedLearning ? currentLevelId : 'nouns_level_1',
      lessonId: hasStartedLearning
        ? currentSubtopicId
        : NOUNS_18_SUBTOPIC_IDS[0],
    });
  };

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

        {/* 2. PRIMARY METRICS SUMMARY (Learned Words & Mastered Rules in a Single Row) */}
        <section>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate('learned_words')}
              className="rounded-xl bg-white border border-[#E0E4EC] p-3.5 sm:p-4 text-left shadow-[0_1px_3px_rgba(0,0,0,0.05)] cursor-pointer hover:border-[#3949AB] transition-all flex items-center justify-between gap-2 group"
            >
              <div className="min-w-0">
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
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#E8EAF6] text-[#3949AB] flex items-center justify-center shrink-0 group-hover:bg-[#3949AB] group-hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate('mastered_rules')}
              className="rounded-xl bg-white border border-[#E0E4EC] p-3.5 sm:p-4 text-left shadow-[0_1px_3px_rgba(0,0,0,0.05)] cursor-pointer hover:border-[#3949AB] transition-all flex items-center justify-between gap-2 group"
            >
              <div className="min-w-0">
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
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#E0F2F1] text-[#00897B] flex items-center justify-center shrink-0 group-hover:bg-[#00897B] group-hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </button>
          </div>
        </section>

        {/* 3. ACCUMULATED SKILLS PRACTICE HUB (Opens Dedicated Full Screen) */}
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
                className="flex flex-col justify-between h-full min-h-[132px] p-4 rounded-xl bg-white border border-[#E0E4EC] hover:border-[#3949AB] transition-all cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-left group"
              >
                <div className="flex items-center justify-between gap-2 w-full">
                  <div className="w-10 h-10 rounded-lg bg-[#E8EAF6] text-[#3949AB] group-hover:bg-[#3949AB] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-[#F5F6FA] border border-[#E0E4EC] text-xs font-semibold text-[#3949AB] tabular-nums shrink-0">
                    {badge}
                  </span>
                </div>

                <div className="mt-3 space-y-1 w-full min-w-0">
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

        {/* 4. SPACED REPETITION CARD */}
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
