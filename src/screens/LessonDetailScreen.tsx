import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeBadge } from '../components/TalkMeBadge';
import {
  Bookmark,
  Volume2,
  BookOpen,
  ArrowLeft,
  Layers,
  Award,
  CheckCircle2,
  Target,
  Check,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { COURSE_CURRICULA } from './CourseLevelsScreen';
import { TOPIC_LEARNING_GROUPS } from '../domain/learning/topicCatalog';
import { UniversalLessonPlayer } from '../features/lesson-player/UniversalLessonPlayer';
import { UNIVERSAL_LESSONS_REPOSITORY } from '../content/registry/universalContentRepository';
import { UniversalSubtopicPlayer } from '../features/subtopic-player/UniversalSubtopicPlayer';
import { SUBTOPICS_REPOSITORY } from '../content/registry/subtopicsCatalog';

export interface LessonContentItem {
  id: string;
  title: string;
  component: React.ComponentType;
}

export const LESSON_REGISTRY: Record<string, LessonContentItem> = {};

export const LessonDetailScreen: React.FC = () => {
  const {
    navigate,
    goBack,
    playTts,
    isTtsSpeaking,
    selectedCourseId,
    selectedLevelId,
    selectedFrameworkLessonId,
    completedLevelIds,
    bookmarkedLessons,
    toggleBookmark,
    awardXpAndDiamonds,
    userLearnedWords,
    userMasteredRules,
    toggleWordLearned,
    toggleRuleMastered,
  } = useApp();

  const resolveSubtopicId = (): string => {
    if (selectedFrameworkLessonId && SUBTOPICS_REPOSITORY[selectedFrameworkLessonId]) {
      return selectedFrameworkLessonId;
    }
    if (selectedCourseId === 'nouns') {
      if (selectedLevelId?.includes('2')) return 'common_and_proper_nouns';
      if (selectedLevelId?.includes('3')) return 'singular_and_plural_nouns';
      if (selectedLevelId?.includes('4')) return 'countable_and_uncountable_nouns';
      if (selectedLevelId?.includes('5')) return 'concrete_and_abstract_nouns';
      if (selectedLevelId?.includes('6')) return 'possessive_nouns';
      return 'what_is_a_noun';
    }
    if (selectedCourseId === 'numerals') {
      return 'numbers_0_10_subtopic';
    }
    if (selectedFrameworkLessonId === 'lesson_hello_a0') {
      return 'hello_first_steps';
    }
    return 'what_is_a_noun';
  };

  // Map course/level to universal lesson ID so every lesson runs through UniversalLessonPlayer
  const resolveUniversalLessonId = (): string => {
    if (selectedFrameworkLessonId && UNIVERSAL_LESSONS_REPOSITORY[selectedFrameworkLessonId]) {
      return selectedFrameworkLessonId;
    }
    if (selectedCourseId === 'nouns') {
      return selectedLevelId?.includes('2') ? 'lesson_nouns_2' : 'lesson_nouns_1';
    }
    if (selectedCourseId === 'numerals') {
      return selectedLevelId?.includes('2') ? 'lesson_numbers_11_20' : 'lesson_numbers_0_10';
    }
    if (selectedCourseId === 'pronouns') return 'lesson_pronouns_1';
    if (selectedCourseId === 'verbs') return 'lesson_verbs_1';
    if (selectedCourseId === 'adjectives' || selectedCourseId === 'adverbs') {
      return 'lesson_adjectives_1';
    }
    return 'lesson_hello_a0';
  };

  const [activeSubtopicId] = useState<string>(resolveSubtopicId());
  const [activeUniversalLessonId, setActiveUniversalLessonId] = useState<string>(
    resolveUniversalLessonId()
  );
  const [viewTab, setViewTab] = useState<'subtopic' | 'player' | 'overview'>('subtopic');

  const courseKey = selectedCourseId || 'grammar_fundamentals';
  const curriculum = COURSE_CURRICULA[courseKey] || COURSE_CURRICULA.grammar_fundamentals;

  const nodeIndexMatch = selectedLevelId ? selectedLevelId.match(/\d+/) : null;
  const topicIndex = nodeIndexMatch ? Math.max(0, parseInt(nodeIndexMatch[0], 10) - 1) : 0;
  const currentTopic =
    curriculum.topics[topicIndex] ||
    curriculum.topics[0] || {
      title: '1-Dars — Hello!',
      subtitle: 'Noldan boshlovchilar uchun ilk dars',
      nodeType: 'STAR',
      xpReward: 40,
    };

  const levelIdToComplete = selectedLevelId || `${courseKey}_lvl_${topicIndex + 1}`;
  const isLevelCompleted = completedLevelIds.includes(levelIdToComplete);
  const isBookmarked = bookmarkedLessons.includes(levelIdToComplete);

  const matchedLearningTopic =
    TOPIC_LEARNING_GROUPS[topicIndex % TOPIC_LEARNING_GROUPS.length] || TOPIC_LEARNING_GROUPS[0];

  const handlePlayAudio = () => {
    playTts(`Topic: ${currentTopic.title.replace(/^\d+-Dars:\s*/i, '')}. ${currentTopic.subtitle}`);
  };

  const handleCompleteLessonAndUnlockNext = () => {
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    awardXpAndDiamonds(currentTopic.xpReward, 15, levelIdToComplete);
    navigate('course_levels');
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-20 text-[#212121]">
      <div className="max-w-2xl mx-auto px-4 sm:px-5 pt-4 space-y-4">
        {/* Top Switcher: 7-Stage Subtopic Micro-Course vs Universal Lesson Player vs Topic Vocabulary */}
        <div className="flex items-center justify-between gap-2">
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-white border border-[#E0E4EC] flex-1">
            <button
              type="button"
              onClick={() => setViewTab('subtopic')}
              className={`py-2 px-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                viewTab === 'subtopic'
                  ? 'bg-[#3949AB] text-white'
                  : 'text-[#616161] hover:text-[#212121]'
              }`}
            >
              7-Bosqichli Subtopic
            </button>
            <button
              type="button"
              onClick={() => setViewTab('player')}
              className={`py-2 px-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                viewTab === 'player'
                  ? 'bg-[#3949AB] text-white'
                  : 'text-[#616161] hover:text-[#212121]'
              }`}
            >
              Universal Dars
            </button>
            <button
              type="button"
              onClick={() => setViewTab('overview')}
              className={`py-2 px-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                viewTab === 'overview'
                  ? 'bg-[#3949AB] text-white'
                  : 'text-[#616161] hover:text-[#212121]'
              }`}
            >
              Lug‘at & Qoida
            </button>
          </div>

          <button
            onClick={() => toggleBookmark(levelIdToComplete)}
            type="button"
            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all cursor-pointer shadow-2xs shrink-0 ${
              isBookmarked
                ? 'bg-[#3949AB] text-white border-[#3949AB]'
                : 'bg-white text-[#3949AB] border-[#E0E4EC] hover:bg-[#E8EAF6]'
            }`}
            title={isBookmarked ? 'Saqlangan' : 'Saqlash'}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {viewTab === 'subtopic' ? (
          <UniversalSubtopicPlayer initialSubtopicId={activeSubtopicId} />
        ) : viewTab === 'player' ? (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {Object.values(UNIVERSAL_LESSONS_REPOSITORY).map((les) => (
                <button
                  key={les.id}
                  type="button"
                  onClick={() => {
                    setActiveUniversalLessonId(les.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    activeUniversalLessonId === les.id
                      ? 'bg-[#00897B] text-white'
                      : 'bg-white border border-[#E0E4EC] text-[#616161] hover:text-[#3949AB]'
                  }`}
                >
                  {les.titleEn}
                </button>
              ))}
            </div>
            <UniversalLessonPlayer
              lessonId={activeUniversalLessonId}
              onExit={goBack}
              onOpenPracticeCenter={() => navigate('practice_center')}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Main Lesson Header Card */}
            <div className="rounded-xl p-5 bg-white border border-[#E0E4EC] shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <TalkMeBadge
                  text={isLevelCompleted ? 'TUGALLANGAN DARS' : 'FAOL DARS MAVZUSI'}
                  containerColor={isLevelCompleted ? 'bg-[#E0F2F1]' : 'bg-[#E8EAF6]'}
                  textColor={isLevelCompleted ? 'text-[#00897B]' : 'text-[#3949AB]'}
                />
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#00897B] bg-[#E0F2F1] px-2.5 py-1 rounded-md border border-[#B2DFDB]">
                  <Award className="w-3.5 h-3.5" />
                  <span>+{currentTopic.xpReward} XP · +15 Olmos</span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#212121] leading-snug">
                  {currentTopic.title}
                </h2>
                <p className="text-sm text-[#616161] mt-1.5 leading-relaxed">
                  {currentTopic.subtitle}
                </p>
              </div>

              <div className="pt-1 flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handlePlayAudio}
                  type="button"
                  className={`py-2.5 px-4 rounded-lg flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95 ${
                    isTtsSpeaking
                      ? 'bg-[#00897B] text-white'
                      : 'bg-[#E8EAF6] text-[#3949AB] hover:bg-[#3949AB] hover:text-white'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isTtsSpeaking ? 'O‘qilmoqda...' : 'Mavzu nomini tinglash (TTS)'}</span>
                </button>

                <button
                  onClick={() => navigate('practice_center')}
                  type="button"
                  className="py-2.5 px-4 rounded-lg bg-[#3949AB] text-white hover:bg-[#283593] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Amaliyot Markazi (Practice Center) →</span>
                </button>
              </div>

              <div className="pt-3 border-t border-[#E0E4EC] space-y-2">
                <button
                  type="button"
                  onClick={handleCompleteLessonAndUnlockNext}
                  className="w-full py-3 px-4 rounded-xl bg-[#00897B] hover:bg-[#00695C] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isLevelCompleted
                      ? 'Qayta yakunlash (+XP olish)'
                      : 'Darsni yakunlab keyingi qulfni ochish'}
                  </span>
                </button>
              </div>
            </div>

            {/* Interactive Topic Words Section */}
            <div className="rounded-xl p-5 bg-white border border-[#E0E4EC] shadow-2xs space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00897B]">
                DARS LUG‘ATI ({matchedLearningTopic.words.length} TA SO‘Z)
              </span>
              <div className="space-y-2">
                {matchedLearningTopic.words.map((tw) => {
                  const liveWord = userLearnedWords.find((w) => w.id === tw.id);
                  const isLearned = (liveWord?.status || tw.status) === 'learned';

                  return (
                    <div
                      key={tw.id}
                      className="p-3 rounded-lg bg-[#F5F6FA] border border-[#E0E4EC] flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-9 h-9 rounded-lg bg-white border border-[#E0E4EC] flex items-center justify-center text-lg shrink-0">
                          {tw.emoji}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#212121] truncate">
                            {tw.word}{' '}
                            <span className="font-normal text-[#616161]">{tw.phonetic}</span>
                          </p>
                          <p className="text-xs font-semibold text-[#00897B] truncate">
                            {tw.translation}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => playTts(tw.word)}
                          className="w-8 h-8 rounded-lg bg-[#E8EAF6] text-[#3949AB] flex items-center justify-center hover:bg-[#3949AB] hover:text-white transition-colors cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleWordLearned(tw.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                            isLearned
                              ? 'bg-[#E0F2F1] text-[#00897B] border border-[#B2DFDB]'
                              : 'bg-white text-[#3949AB] border border-[#C5CAE9]'
                          }`}
                        >
                          {isLearned ? (
                            <>
                              <Check className="w-3 h-3 stroke-[2.5]" />
                              <span>Yodlandi</span>
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-3 h-3" />
                              <span>Yodlash</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grammar Rules */}
            <div className="rounded-xl p-5 bg-white border border-[#E0E4EC] shadow-2xs space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3949AB]">
                GRAMMATIKA QOIDASI
              </span>
              <div className="space-y-2.5">
                {matchedLearningTopic.rules.map((tr) => {
                  const liveRule = userMasteredRules.find((r) => r.id === tr.id);
                  const isMastered = (liveRule?.status || tr.status) === 'learned';

                  return (
                    <div
                      key={tr.id}
                      className="p-3.5 rounded-lg bg-[#F5F6FA] border border-[#E0E4EC] space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-[#212121]">{tr.nameUz}</h4>
                        <button
                          type="button"
                          onClick={() => toggleRuleMastered(tr.id)}
                          className={`px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1 shrink-0 cursor-pointer ${
                            isMastered
                              ? 'bg-[#E0F2F1] text-[#00897B]'
                              : 'bg-[#E8EAF6] text-[#3949AB]'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          <span>{isMastered ? 'O‘zlashtirildi' : 'Belgilash'}</span>
                        </button>
                      </div>
                      {tr.formula && (
                        <div className="px-2.5 py-1.5 rounded bg-white border border-[#E0E4EC] text-xs font-mono font-bold text-[#3949AB]">
                          {tr.formula}
                        </div>
                      )}
                      <p className="text-xs text-[#616161] leading-relaxed">{tr.shortSummaryUz}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Back to Roadmap */}
            <button
              type="button"
              onClick={goBack}
              className="w-full py-3 rounded-xl bg-white border border-[#E0E4EC] text-xs font-semibold text-[#212121] flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Yo‘l xaritasiga qaytish</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
