import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Target,
  Sparkles,
  CheckCircle2,
  Volume2,
  Square,
  ArrowRight,
  ArrowLeft,
  Brain,
  Compass,
  Trophy,
  GraduationCap,
  ChevronRight,
  ListChecks,
  ShieldCheck,
} from 'lucide-react';
import {
  LearningLesson,
  StandardLessonLifecycleStage,
  Exercise,
  LearningMasteryState,
  VocabularyItem,
  GrammarRule,
} from '../types/grammarFrameworkTypes';
import {
  GlobalLearningTrackerState,
  computeDynamicWrapUpSummary,
} from '../engine/progressAndMasteryEngine';
import { ExerciseEvaluationOutput } from '../engine/exerciseEngine';
import { GRAMMAR_CURRICULUM_MODULES } from '../content/courses/grammarCurriculumCatalog';
import { InteractiveExerciseRenderer } from './InteractiveExerciseRenderer';
import { BeginnerLessonA0Renderer } from './BeginnerLessonA0Renderer';
import { validateLearningLessonSchema } from '../validators/lessonContentValidator';

interface GrammarLessonFrameworkViewProps {
  lesson: LearningLesson;
  availableLessons: LearningLesson[];
  onSelectLesson: (lessonId: string) => void;
  globalTrackerState: GlobalLearningTrackerState;
  onRecordRuleOpened: (rule: GrammarRule) => void;
  onRecordVocabExposure: (
    vocabItem: VocabularyItem,
    interactionType:
      | 'explanation_view'
      | 'audio_practice'
      | 'exercise_correct'
      | 'exercise_incorrect'
  ) => void;
  onRecordExerciseEvaluated: (
    lesson: LearningLesson,
    exercise: Exercise,
    result: ExerciseEvaluationOutput
  ) => void;
  onRecordAssessmentSubmitted: (
    lesson: LearningLesson,
    answersByQuestionId: Record<string, string>
  ) => void;
  onRecordSectionProgress?: (
    lesson: LearningLesson,
    options: {
      currentSectionIndex: number;
      completedSectionId?: string;
      markLessonCompleted?: boolean;
      timeSpentDeltaSeconds?: number;
      personalizedLearnerName?: string;
    }
  ) => void;
  onSyncLessonVocabToFsrs?: (lesson: LearningLesson) => void;
  onPlayAudio: (text: string, slow?: boolean) => void;
  onStopAudio: () => void;
  isPlayingAudio: boolean;
}

const STAGE_LABELS: Record<
  StandardLessonLifecycleStage,
  { number: number; shortUz: string; titleUz: string }
> = {
  introduction: {
    number: 1,
    shortUz: '1. Kirish',
    titleUz: '1-Bosqich: Darsga kirish (Lesson Introduction)',
  },
  objectives: {
    number: 2,
    shortUz: '2. Maqsadlar',
    titleUz: '2-Bosqich: O‘quv maqsadlari (Learning Objectives)',
  },
  explanation: {
    number: 3,
    shortUz: '3. Asosiy Qoidalar',
    titleUz: '3-Bosqich: Asosiy grammatik tushuntirish (8 ta Bo‘lim)',
  },
  detailed_examples: {
    number: 4,
    shortUz: '4. Misollar',
    titleUz: '4-Bosqich: Batafsil misollar va tahlil (Detailed Examples)',
  },
  new_vocabulary: {
    number: 5,
    shortUz: '5. Yangi So‘zlar',
    titleUz: '5-Bosqich: Yangi lug‘at (New Vocabulary)',
  },
  interactive_activities: {
    number: 6,
    shortUz: '6. Interaktiv (1-5)',
    titleUz: '6-Bosqich: Interaktiv o‘rganish mashqlari (Activities 1–5)',
  },
  practice_exercises: {
    number: 7,
    shortUz: '7. Amaliyot va Krossvord',
    titleUz: '7-Bosqich: Amaliy mashqlar va 2D Krossvord (Activities 6–9)',
  },
  knowledge_challenge: {
    number: 8,
    shortUz: '8. Challenge (10)',
    titleUz: '8-Bosqich: Grammatik sinov (Activity 10 Challenge)',
  },
  final_assessment: {
    number: 9,
    shortUz: '9. Yakuniy Test',
    titleUz: '9-Bosqich: Yakuniy nazorat testi (Final Assessment)',
  },
  wrap_up: {
    number: 10,
    shortUz: '10. Wrap-up',
    titleUz: '10-Bosqich: Wrap-up (Dars yakuni va haqiqiy natijalar)',
  },
};

export const GrammarLessonFrameworkView: React.FC<GrammarLessonFrameworkViewProps> = ({
  lesson,
  availableLessons,
  onSelectLesson,
  globalTrackerState,
  onRecordRuleOpened,
  onRecordVocabExposure,
  onRecordExerciseEvaluated,
  onRecordAssessmentSubmitted,
  onRecordSectionProgress,
  onSyncLessonVocabToFsrs,
  onPlayAudio,
  onStopAudio,
  isPlayingAudio,
}) => {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(() => {
    const savedIdx = globalTrackerState.lessonProgress[lesson.id]?.currentSectionIndex ?? 0;
    return savedIdx >= 0 && savedIdx < lesson.sections.length ? savedIdx : 0;
  });
  const [activeSubtopicIndex, setActiveSubtopicIndex] = useState<number>(0);
  const [selectedUnitStepIndex, setSelectedUnitStepIndex] = useState<number>(0);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(2);
  const [showCurriculumModal, setShowCurriculumModal] = useState<boolean>(false);
  const [fsrsSyncedMessage, setFsrsSyncedMessage] = useState<boolean>(false);

  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, string>>({});
  const [assessmentSubmittedResult, setAssessmentSubmittedResult] = useState<{
    scorePercentage: number;
    passed: boolean;
    correctCount: number;
    totalCount: number;
  } | null>(null);

  const schemaValidation = useMemo(() => validateLearningLessonSchema(lesson), [lesson]);

  const activeSection = lesson.sections[activeStageIndex] || lesson.sections[0];
  const activeStage = activeSection.stage;

  useEffect(() => {
    const savedIdx = globalTrackerState.lessonProgress[lesson.id]?.currentSectionIndex ?? 0;
    setActiveStageIndex(savedIdx >= 0 && savedIdx < lesson.sections.length ? savedIdx : 0);
    setActiveSubtopicIndex(0);
    setAssessmentAnswers({});
    setAssessmentSubmittedResult(null);
  }, [lesson.id]);

  // Opening explanation marks rule as 'learning' (never 'learned')
  useEffect(() => {
    if (activeStage === 'explanation') {
      const rule = lesson.grammarRules[activeSubtopicIndex];
      if (rule) {
        onRecordRuleOpened(rule);
      }
    }
  }, [activeStage, activeSubtopicIndex, lesson.grammarRules, onRecordRuleOpened]);

  const lessonProgress = globalTrackerState.lessonProgress[lesson.id];

  const wrapUpSummary = useMemo(
    () => computeDynamicWrapUpSummary(globalTrackerState, lesson),
    [globalTrackerState, lesson]
  );

  const interactiveActivities = useMemo(
    () =>
      lesson.exercises.filter((ex) =>
        activeSection.exerciseIds?.includes(ex.id)
      ),
    [lesson.exercises, activeSection]
  );

  const activeSubtopic =
    lesson.theorySubtopics[activeSubtopicIndex] || lesson.theorySubtopics[0];

  const getMasteryBadge = (status: LearningMasteryState) => {
    switch (status) {
      case 'learned':
        return {
          labelUz: 'O‘zlashtirildi (Learned)',
          cls: 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300',
        };
      case 'practiced':
        return {
          labelUz: 'Mashq qilindi (Practiced)',
          cls: 'bg-indigo-500/20 border-indigo-400/50 text-indigo-300',
        };
      case 'learning':
        return {
          labelUz: 'O‘rganilmoqda (Learning)',
          cls: 'bg-sky-500/20 border-sky-400/50 text-sky-300',
        };
      case 'needs_review':
        return {
          labelUz: 'Takrorlash kerak (Needs Review)',
          cls: 'bg-amber-500/20 border-amber-400/50 text-amber-300',
        };
      default:
        return {
          labelUz: 'Yangi (Not Started)',
          cls: 'bg-slate-800 border-slate-700 text-slate-400',
        };
    }
  };

  const handleAssessmentSubmit = () => {
    const questions = lesson.assessment.questions;
    let correctCount = 0;
    for (const q of questions) {
      const selected = (assessmentAnswers[q.id] || '').trim().toLowerCase();
      if (selected === q.correctAnswer.trim().toLowerCase()) {
        correctCount++;
      }
    }
    const scorePercentage =
      questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const passed = scorePercentage >= lesson.assessment.passingPercentage;

    setAssessmentSubmittedResult({
      scorePercentage,
      passed,
      correctCount,
      totalCount: questions.length,
    });

    onRecordAssessmentSubmitted(lesson, assessmentAnswers);
  };

  if (lesson.level === 'A0' || Boolean(lesson.sections[0]?.beginnerContent)) {
    return (
      <BeginnerLessonA0Renderer
        lesson={lesson}
        availableLessons={availableLessons}
        onSelectLesson={onSelectLesson}
        globalTrackerState={globalTrackerState}
        onRecordVocabExposure={onRecordVocabExposure}
        onRecordExerciseEvaluated={onRecordExerciseEvaluated}
        onRecordSectionProgress={onRecordSectionProgress}
        onSyncLessonVocabToFsrs={onSyncLessonVocabToFsrs}
        onPlayAudio={onPlayAudio}
        onStopAudio={onStopAudio}
        isPlayingAudio={isPlayingAudio}
      />
    );
  }

  return (
    <div className="space-y-5 pb-16">
      {/* Global Counter & Curriculum Bar */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950/90 via-slate-900 to-emerald-950/80 border border-indigo-500/30 p-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-black text-base">
              {lesson.level}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-300">
                  1-Modul • v{lesson.version}
                </span>
                {schemaValidation.isValid && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-300">
                    <ShieldCheck className="w-3 h-3" /> Data-Driven Schema OK
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-xl font-black text-white leading-tight">
                {lesson.title.uz}
              </h2>
            </div>
          </div>

          {/* Independent Global Counters + 9-Module Curriculum Button */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-xs">
              <span className="text-slate-400 mr-1">Yodlangan so‘zlar:</span>
              <strong className="font-black text-emerald-300">
                {wrapUpSummary.globalUniqueLearnedVocabularyCount} ta
              </strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-indigo-500/15 border border-indigo-400/30 text-xs">
              <span className="text-slate-400 mr-1">O‘zlashtirilgan qoidalar:</span>
              <strong className="font-black text-indigo-300">
                {wrapUpSummary.globalMasteredGrammarRulesCount} ta
              </strong>
            </div>
            <button
              type="button"
              onClick={() => setShowCurriculumModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-extrabold text-amber-300 transition"
            >
              <Compass className="w-4 h-4" />
              9-Modul O‘quv Dasturi (76 Dars)
            </button>
          </div>
        </div>

        {/* Lesson Switcher Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-800/80">
          <span className="text-xs font-bold text-slate-400">Faol darslar:</span>
          {availableLessons.map((item, idx) => {
            const active = item.id === lesson.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectLesson(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                  active
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                    : 'bg-slate-900/70 border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                {idx + 1}-Dars: {item.title.en || item.title.uz}
              </button>
            );
          })}
          {isPlayingAudio && (
            <button
              type="button"
              onClick={onStopAudio}
              className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-extrabold"
            >
              <Square className="w-3.5 h-3.5 fill-current" /> Audioni to‘xtatish
            </button>
          )}
        </div>
      </div>

      {/* 10-Stage Lesson Lifecycle Stepper */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-2.5 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {lesson.sections.map((sec, idx) => {
            const meta = STAGE_LABELS[sec.stage];
            const isCurrent = idx === activeStageIndex;
            const isWrapUp = sec.stage === 'wrap_up';

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveStageIndex(idx)}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold border transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? isWrapUp
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-300 text-white shadow-lg'
                      : 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{meta.shortUz}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================== STAGE 1: LESSON INTRODUCTION ==================== */}
      {activeStage === 'introduction' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-extrabold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              {STAGE_LABELS.introduction.titleUz}
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-white">{lesson.title.uz}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{lesson.description.uz}</p>

            {lesson.theorySubtopics[0] && (
              <div className="space-y-4 pt-2">
                <div className="rounded-2xl bg-indigo-950/40 border border-indigo-500/40 p-4">
                  <div className="text-xs font-extrabold text-indigo-300 uppercase mb-1">
                    Hayotiy o‘xshatish (Analogy):
                  </div>
                  <p className="text-sm font-bold text-white">
                    {lesson.theorySubtopics[0].analogyOrIntroUz}
                  </p>
                </div>

                {lesson.theorySubtopics[0].paragraphsUz.map((para, i) => (
                  <p
                    key={i}
                    className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4"
                  >
                    {para}
                  </p>
                ))}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-rose-950/30 border border-rose-500/40 p-4">
                    <span className="text-xs font-black uppercase text-rose-300">
                      ❌ Noto‘g‘ri tartib (Incorrect)
                    </span>
                    <p className="text-lg font-black text-rose-200 mt-1">I student am.</p>
                    <p className="text-xs text-rose-300/80 mt-1">
                      So‘zlar tartibsiz joylashgani uchun ingliz tilida tabiiy eshitilmaydi.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-950/30 border border-emerald-500/40 p-4 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-black uppercase text-emerald-300">
                        ✅ To‘g‘ri tartib (Correct)
                      </span>
                      <p className="text-lg font-black text-emerald-200 mt-1">I am a student.</p>
                      <p className="text-xs text-emerald-300/80 mt-1">
                        Men o‘quvchiman. (Ega + Fe’l + Artikl + Ot)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onPlayAudio('I am a student.')}
                      className="mt-3 self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold hover:bg-emerald-500/30 transition"
                    >
                      <Volume2 className="w-4 h-4" /> "I am a student." eshitish
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== STAGE 2: LEARNING OBJECTIVES ==================== */}
      {activeStage === 'objectives' && (
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-extrabold uppercase tracking-wider">
            <Target className="w-4 h-4" />
            {STAGE_LABELS.objectives.titleUz}
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            Ushbu dars yakunida siz quyidagi grammatik ko‘nikmalarni amalda qo‘llay olasiz:
          </p>

          <div className="grid grid-cols-1 gap-3">
            {lesson.objectives.map((obj, idx) => (
              <div
                key={obj.id}
                className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 flex items-start gap-3.5"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-black text-sm flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-extrabold text-white">{obj.description.uz}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Darsdagi Grammatik Qoidalar ({lesson.grammarRules.length} ta):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {lesson.grammarRules.map((rule) => {
                const record = globalTrackerState.grammarRuleProgress[rule.id];
                const badge = getMasteryBadge(record?.status || 'not_started');
                return (
                  <div
                    key={rule.id}
                    className="rounded-2xl bg-slate-950/60 border border-slate-800 p-3.5 flex flex-col justify-between gap-2"
                  >
                    <div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border mb-1.5 ${badge.cls}`}
                      >
                        {badge.labelUz}
                      </span>
                      <h5 className="text-xs sm:text-sm font-extrabold text-white">
                        {rule.nameUz}
                      </h5>
                    </div>
                    {rule.formula && (
                      <div className="text-[11px] font-mono text-amber-300 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800">
                        {rule.formula}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================== STAGE 3: MAIN EXPLANATION (ALL 8 SECTIONS) ==================== */}
      {activeStage === 'explanation' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3">
            <div className="text-xs font-extrabold text-slate-400 mb-2">
              Nazariy bo‘limni tanlang (1–{lesson.theorySubtopics.length} bo‘limlar):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {lesson.theorySubtopics.map((sub, idx) => {
                const active = idx === activeSubtopicIndex;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setActiveSubtopicIndex(idx)}
                    className={`text-left p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      active
                        ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-md'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-indigo-300 font-black block text-[10px] uppercase">
                      {sub.sectionNumber}-Bo‘lim
                    </span>
                    <span className="line-clamp-1">
                      {sub.titleUz.replace(/^\d+-Bo‘lim:\s*/, '')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {activeSubtopic && (
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 space-y-5 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-400">
                    {activeSubtopic.titleEn}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                    {activeSubtopic.titleUz}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-xl bg-slate-800 text-xs font-bold text-slate-300">
                  {activeSubtopicIndex + 1} / {lesson.theorySubtopics.length}
                </span>
              </div>

              <div className="rounded-2xl bg-gradient-to-r from-indigo-950/80 to-slate-900 border border-indigo-500/40 p-4">
                <div className="text-[11px] font-black uppercase tracking-wider text-amber-300 mb-1">
                  📌 Kirish va Asosiy Ma’no:
                </div>
                <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                  {activeSubtopic.analogyOrIntroUz}
                </p>
              </div>

              <div className="space-y-3">
                {activeSubtopic.paragraphsUz.map((para, i) => (
                  <p
                    key={i}
                    className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5"
                  >
                    {para}
                  </p>
                ))}
              </div>

              {/* Interactive Visual Flow: Letter -> Word -> Phrase -> Clause -> Sentence (Section 4) */}
              {activeSubtopic.hierarchyFlow && (
                <div className="rounded-2xl bg-slate-950/90 border border-indigo-500/30 p-4 space-y-4">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-300">
                    🔍 Interaktiv Kichikdan Kattaga O‘sish Zanjiri (Bosib ko‘ring):
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {activeSubtopic.hierarchyFlow.map((step, idx) => {
                      const active = idx === selectedUnitStepIndex;
                      return (
                        <React.Fragment key={step.levelNameEn}>
                          <button
                            type="button"
                            onClick={() => setSelectedUnitStepIndex(idx)}
                            className={`px-3.5 py-2 rounded-xl border text-xs font-extrabold transition-all ${
                              active
                                ? 'bg-amber-500/25 border-amber-400 text-amber-200 scale-105'
                                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-indigo-400'
                            }`}
                          >
                            {idx + 1}. {step.levelNameUz}
                          </button>
                          {idx < activeSubtopic.hierarchyFlow!.length - 1 && (
                            <ArrowRight className="w-4 h-4 text-slate-500" />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {activeSubtopic.hierarchyFlow[selectedUnitStepIndex] && (
                    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-amber-300">
                          {activeSubtopic.hierarchyFlow[selectedUnitStepIndex].levelNameEn} —{' '}
                          {activeSubtopic.hierarchyFlow[selectedUnitStepIndex].whyUz}
                        </div>
                        <div className="text-base sm:text-lg font-black text-white">
                          Misol: "{activeSubtopic.hierarchyFlow[selectedUnitStepIndex].sampleEn}"
                        </div>
                        <div className="text-xs text-slate-400">
                          Ma’nosi: {activeSubtopic.hierarchyFlow[selectedUnitStepIndex].sampleUz}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          onPlayAudio(
                            activeSubtopic.hierarchyFlow![selectedUnitStepIndex].sampleEn
                          )
                        }
                        className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 text-xs font-bold"
                      >
                        <Volume2 className="w-4 h-4" /> Eshitish
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Interactive Sentence Breakdown: "The young student reads an interesting book." (Section 5) */}
              {activeSubtopic.sentenceBreakdown && (
                <div className="rounded-2xl bg-slate-950/90 border border-emerald-500/30 p-4 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                        🧬 Gapni so‘zma-so‘z anatomik tahlil qiling (So‘z ustiga bosing):
                      </span>
                      <p className="text-xs text-slate-400 mt-0.5">
                        "{activeSubtopic.sentenceBreakdown.sentenceEn}" —{' '}
                        {activeSubtopic.sentenceBreakdown.sentenceUz}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onPlayAudio(activeSubtopic.sentenceBreakdown!.sentenceEn)
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold"
                    >
                      <Volume2 className="w-4 h-4" /> To‘liq gapni eshitish
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {activeSubtopic.sentenceBreakdown.tokens.map((tok, idx) => {
                      const active = idx === selectedTokenIndex;
                      return (
                        <button
                          key={`${tok.token}-${idx}`}
                          type="button"
                          onClick={() => {
                            setSelectedTokenIndex(idx);
                            onPlayAudio(tok.token);
                          }}
                          className={`px-3.5 py-2.5 rounded-xl border text-left transition-all ${
                            active
                              ? 'bg-emerald-500/25 border-emerald-400 text-white scale-105 shadow-lg'
                              : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-emerald-400/60'
                          }`}
                        >
                          <div className="text-sm sm:text-base font-black">{tok.token}</div>
                          <div className="text-[10px] font-bold text-emerald-300">
                            {tok.partOfSpeechUz}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {activeSubtopic.sentenceBreakdown.tokens[selectedTokenIndex] && (
                    <div className="rounded-2xl bg-slate-900 border border-emerald-500/30 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          So‘z va Turkum
                        </span>
                        <p className="text-sm font-black text-emerald-300 mt-0.5">
                          "{activeSubtopic.sentenceBreakdown.tokens[selectedTokenIndex].token}" —{' '}
                          {
                            activeSubtopic.sentenceBreakdown.tokens[selectedTokenIndex]
                              .partOfSpeechEn
                          }{' '}
                          (
                          {
                            activeSubtopic.sentenceBreakdown.tokens[selectedTokenIndex]
                              .partOfSpeechUz
                          }
                          )
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          Gapdagi vazifasi va So‘rog‘i
                        </span>
                        <p className="text-xs font-bold text-white mt-0.5">
                          {
                            activeSubtopic.sentenceBreakdown.tokens[selectedTokenIndex]
                              .grammaticalRoleUz
                          }{' '}
                          •{' '}
                          <span className="text-amber-300">
                            {
                              activeSubtopic.sentenceBreakdown.tokens[selectedTokenIndex]
                                .questionAnsweredUz
                            }
                          </span>
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          Grammatik izoh
                        </span>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {
                            activeSubtopic.sentenceBreakdown.tokens[selectedTokenIndex]
                              .explanationUz
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Comparison Cards */}
              {activeSubtopic.comparisonCards && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeSubtopic.comparisonCards.map((cc, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-slate-950/90 border border-slate-800 p-4 space-y-2"
                    >
                      <div className="text-xs font-bold text-rose-300 line-through">
                        ❌ {cc.wrongEn}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-black text-emerald-300">
                          ✅ {cc.rightEn}
                        </span>
                        <button
                          type="button"
                          onClick={() => onPlayAudio(cc.rightEn)}
                          className="p-1.5 rounded-lg bg-slate-800 text-indigo-300 hover:bg-indigo-500/20"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-white font-semibold">{cc.meaningUz}</p>
                      <p className="text-[11px] text-slate-400">{cc.whyUz}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Concept Cards Grid */}
              {activeSubtopic.conceptCards && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {activeSubtopic.conceptCards.map((card, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="text-sm font-black text-indigo-300">{card.termEn}</div>
                        <div className="text-xs font-bold text-white">{card.termUz}</div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {card.definitionUz}
                        </p>
                        {card.questionsAnsweredUz && (
                          <p className="text-[11px] text-amber-300 font-semibold">
                            ❓ So‘rog‘i: {card.questionsAnsweredUz}
                          </p>
                        )}
                        {card.functionInSentenceUz && (
                          <p className="text-[11px] text-emerald-300 font-semibold">
                            ⚙️ Vazifasi: {card.functionInSentenceUz}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                        {card.examples.map((ex, exIdx) => (
                          <div
                            key={exIdx}
                            className="rounded-xl bg-slate-900/90 border border-slate-800 px-3 py-2 flex items-center justify-between gap-2"
                          >
                            <div>
                              <div className="text-xs font-extrabold text-white">{ex.en}</div>
                              <div className="text-[11px] text-slate-400">{ex.uz}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => onPlayAudio(ex.en.split('→')[0].trim())}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-500/30 text-indigo-300 transition shrink-0"
                              title="Talaffuzni eshitish"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  disabled={activeSubtopicIndex === 0}
                  onClick={() => setActiveSubtopicIndex(Math.max(0, activeSubtopicIndex - 1))}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 disabled:opacity-40 text-xs font-bold text-slate-200"
                >
                  <ArrowLeft className="w-4 h-4" /> Oldingi bo‘lim
                </button>
                <span className="text-xs text-slate-400 font-bold">
                  {activeSubtopicIndex + 1} / {lesson.theorySubtopics.length} bo‘lim
                </span>
                {activeSubtopicIndex < lesson.theorySubtopics.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setActiveSubtopicIndex(activeSubtopicIndex + 1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-xs font-extrabold text-white"
                  >
                    Keyingi bo‘lim <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveStageIndex(activeStageIndex + 1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-xs font-extrabold text-white"
                  >
                    4-Bosqich: Misollarga o‘tish <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== STAGE 4: DETAILED EXAMPLES ==================== */}
      {activeStage === 'detailed_examples' && (
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              {STAGE_LABELS.detailed_examples.titleUz}
            </div>
            <span className="text-xs text-slate-400">{lesson.examples.length} ta tahliliy misol</span>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {lesson.examples.map((ex) => (
              <div
                key={ex.id}
                className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-black text-emerald-300">
                        ✅ {ex.englishSentence}
                      </span>
                      {ex.highlightedSegment && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-400/30 text-[11px] font-bold text-indigo-300">
                          Kalit: {ex.highlightedSegment}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-white">{ex.uzbekTranslation}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onPlayAudio(ex.englishSentence, false)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-xs font-bold transition"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => onPlayAudio(ex.englishSentence, true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold transition"
                    >
                      🐢 Sekin
                    </button>
                  </div>
                </div>

                {ex.incorrectSentence && (
                  <div className="rounded-xl bg-rose-950/30 border border-rose-500/30 px-3 py-2 text-xs text-rose-200">
                    <strong>❌ Xato shakl:</strong>{' '}
                    <span className="line-through font-bold">{ex.incorrectSentence}</span> —{' '}
                    {ex.whyIncorrectUz}
                  </div>
                )}

                <p className="text-xs text-slate-300 border-t border-slate-800/80 pt-2">
                  💡 <strong>Grammatik izoh:</strong> {ex.explanationUz}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== STAGE 5: NEW VOCABULARY ==================== */}
      {activeStage === 'new_vocabulary' && (
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" />
                {STAGE_LABELS.new_vocabulary.titleUz}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Maqsadli lug‘at: 8 ta asosiy so‘z. Eslatma: So‘z faqat mashqlarda to‘g‘ri qo‘llanganda "Learned" (Yodlangan) deb hisoblanadi.
              </p>
            </div>

            {onSyncLessonVocabToFsrs && (
              <button
                type="button"
                onClick={() => {
                  onSyncLessonVocabToFsrs(lesson);
                  setFsrsSyncedMessage(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg transition"
              >
                <Brain className="w-4 h-4" /> FSRS Xotira tizimiga qo‘shish
              </button>
            )}
          </div>

          {fsrsSyncedMessage && (
            <div className="rounded-xl bg-emerald-950/50 border border-emerald-500/40 px-3.5 py-2.5 text-xs text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              1-darsning barcha 8 ta maqsadli so‘zi FSRS-6 aqlli takrorlash kartochkalariga muvaffaqiyatli ulandi!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {lesson.vocabulary.map((voc) => {
              const record = globalTrackerState.vocabularyProgress[voc.id];
              const badge = getMasteryBadge(record?.status || 'not_started');

              return (
                <div
                  key={voc.id}
                  className={`rounded-2xl p-4 border space-y-2.5 flex flex-col justify-between ${
                    voc.isTargetVocabulary
                      ? 'bg-slate-950/80 border-slate-800'
                      : 'bg-slate-950/40 border-dashed border-slate-800/70'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base sm:text-lg font-black text-white">
                            {voc.wordEn}
                          </h4>
                        </div>
                        <p className="text-sm font-extrabold text-emerald-300">
                          {voc.translationUz} ({voc.partOfSpeech})
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onPlayAudio(`${voc.wordEn}. ${voc.exampleEn}`);
                          onRecordVocabExposure(voc, 'explanation_view');
                        }}
                        className="p-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 transition"
                        title="So‘z va misolni eshitish"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <div className="rounded-xl bg-slate-900 px-3 py-2">
                      <p className="text-xs font-bold text-white">"{voc.exampleEn}"</p>
                      <p className="text-[11px] text-slate-400">{voc.exampleUz}</p>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      {voc.isTargetVocabulary ? (
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${badge.cls}`}
                        >
                          {badge.labelUz}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-900 border border-slate-700 text-slate-400">
                          Fonetik namuna (Hisoblagichga qo‘shilmaydi)
                        </span>
                      )}

                      {voc.isTargetVocabulary && (
                        <button
                          type="button"
                          onClick={() => onRecordVocabExposure(voc, 'audio_practice')}
                          className="text-[11px] font-bold text-indigo-300 hover:text-indigo-200 underline"
                        >
                          Mashq qildim deb belgilash
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== STAGES 6, 7, 8: INTERACTIVE ACTIVITIES, PRACTICE & CHALLENGE ==================== */}
      {(activeStage === 'interactive_activities' ||
        activeStage === 'practice_exercises' ||
        activeStage === 'knowledge_challenge') && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-300">
                {STAGE_LABELS[activeStage].titleUz}
              </div>
              {activeSection.subtitle?.uz && (
                <p className="text-xs text-slate-300 mt-0.5">{activeSection.subtitle.uz}</p>
              )}
            </div>
            <span className="px-3 py-1 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-xs font-extrabold text-indigo-200">
              {interactiveActivities.length} ta interaktiv topshiriq
            </span>
          </div>

          <div className="space-y-5">
            {interactiveActivities.map((exercise, idx) => (
              <InteractiveExerciseRenderer
                key={exercise.id}
                exercise={exercise}
                exerciseIndex={idx}
                totalExercises={interactiveActivities.length}
                isCompleted={Boolean(lessonProgress?.exerciseResults[exercise.id]?.isCorrect)}
                onPlayAudio={(txt) => onPlayAudio(txt, false)}
                onEvaluated={(ex, result) => onRecordExerciseEvaluated(lesson, ex, result)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ==================== STAGE 9: FINAL ASSESSMENT ==================== */}
      {activeStage === 'final_assessment' && (
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 space-y-5 shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
                <ListChecks className="w-4 h-4" />
                {lesson.assessment.title.uz}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                1-darsda o‘rganilgan barcha 10 ta poydevor mavzu bo‘yicha yakuniy nazorat savollari:
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-xs font-bold text-amber-200">
              O‘tish bali: {lesson.assessment.passingPercentage}% (
              {lesson.assessment.questions.length} ta savol)
            </div>
          </div>

          <div className="space-y-4">
            {lesson.assessment.questions.map((q) => {
              const chosen = assessmentAnswers[q.id] || '';
              const isRight =
                assessmentSubmittedResult &&
                chosen.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl p-4 border space-y-3 ${
                    assessmentSubmittedResult
                      ? isRight
                        ? 'bg-emerald-950/30 border-emerald-500/50'
                        : 'bg-rose-950/30 border-rose-500/50'
                      : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-extrabold text-white">
                      {q.questionUz}
                    </h4>
                    {q.audioText && (
                      <button
                        type="button"
                        onClick={() => onPlayAudio(q.audioText!)}
                        className="p-1.5 rounded-lg bg-slate-800 text-indigo-300 hover:bg-indigo-500/20 shrink-0"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt) => {
                      const selected = chosen === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            setAssessmentAnswers((prev) => ({ ...prev, [q.id]: opt }))
                          }
                          className={`text-left p-3 rounded-xl border text-xs font-bold transition-all ${
                            selected
                              ? 'bg-indigo-600 border-indigo-400 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {assessmentSubmittedResult && (
                    <div className="text-xs pt-2 border-t border-slate-800/80">
                      <span
                        className={`font-extrabold ${
                          isRight ? 'text-emerald-300' : 'text-rose-300'
                        }`}
                      >
                        {isRight ? '✅ To‘g‘ri!' : `❌ To‘g‘ri javob: ${q.correctAnswer}`}
                      </span>
                      <p className="text-slate-300 mt-0.5">{q.explanationUz}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-400">
              Belgilandi: {Object.keys(assessmentAnswers).length} /{' '}
              {lesson.assessment.questions.length}
            </span>

            <button
              type="button"
              onClick={handleAssessmentSubmit}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-emerald-500 text-white text-xs sm:text-sm font-extrabold shadow-xl transition"
            >
              Yakuniy testni tekshirish
            </button>
          </div>

          {assessmentSubmittedResult && (
            <div
              className={`rounded-2xl p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                assessmentSubmittedResult.passed
                  ? 'bg-emerald-950/60 border-emerald-400/50 text-emerald-100'
                  : 'bg-amber-950/60 border-amber-400/50 text-amber-100'
              }`}
            >
              <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-black">
                  {assessmentSubmittedResult.passed
                    ? `🎉 Tabriklaymiz! Test muvaffaqiyatli topshirildi (${assessmentSubmittedResult.scorePercentage}%)`
                    : `Natija: ${assessmentSubmittedResult.scorePercentage}% (${assessmentSubmittedResult.correctCount}/${assessmentSubmittedResult.totalCount})`}
                </h4>
                <p className="text-xs opacity-90">
                  Endi 10-bosqich (Wrap-up) bo‘limiga o‘tib, darsning to‘liq tahliliy natijalarini ko‘ring!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveStageIndex(lesson.sections.length - 1)}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shrink-0"
              >
                10. Wrap-up bo‘limiga o‘tish →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================== STAGE 10: WRAP-UP (MANDATORY FINAL SECTION) ==================== */}
      {activeStage === 'wrap_up' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-500/40 p-5 sm:p-7 space-y-6 shadow-2xl">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider">
                  <Trophy className="w-4 h-4" />
                  10. Wrap-up (Dars Yakuni va Haqiqiy Natijalar)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
                  {lesson.wrapUp.title.uz}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {lesson.wrapUp.summaryNoteUz}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-950/80 border border-amber-400/40 px-4 py-3 text-center">
                <div className="text-[10px] font-bold uppercase text-amber-300">
                  Jami yig‘ilgan XP
                </div>
                <div className="text-2xl font-black text-white">
                  +{wrapUpSummary.totalLessonXpEarned} XP
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* 1. Vocabulary Progress */}
              <div className="rounded-2xl bg-slate-950/80 border border-emerald-500/30 p-4 space-y-2">
                <div className="text-xs font-extrabold uppercase text-emerald-300">
                  📚 Lug‘at (Vocabulary Progress)
                </div>
                <div className="text-2xl font-black text-white">
                  {wrapUpSummary.newUniqueVocabLearned.length} /{' '}
                  {lesson.vocabulary.filter((v) => v.isTargetVocabulary).length}
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <div>
                    • Yodlandi (Learned): {wrapUpSummary.newUniqueVocabLearned.length} ta
                  </div>
                  <div>
                    • Mashq qilindi: {wrapUpSummary.vocabPracticedOrLearning.length} ta
                  </div>
                  <div>
                    • Takrorlash kerak: {wrapUpSummary.vocabNeedingReview.length} ta
                  </div>
                  <div className="text-emerald-300 font-bold pt-1">
                    Global yodlangan so‘zlar: {wrapUpSummary.globalUniqueLearnedVocabularyCount} ta
                  </div>
                </div>
              </div>

              {/* 2. Exercise Results */}
              <div className="rounded-2xl bg-slate-950/80 border border-indigo-500/30 p-4 space-y-2">
                <div className="text-xs font-extrabold uppercase text-indigo-300">
                  🎯 Mashqlar (Exercise Results)
                </div>
                <div className="text-2xl font-black text-white">
                  {wrapUpSummary.accuracyPercentage}% aniqlik
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <div>
                    • Bajarildi: {wrapUpSummary.exercisesCompletedCount} /{' '}
                    {wrapUpSummary.totalExercisesCount}
                  </div>
                  <div>• To‘g‘ri javoblar: {wrapUpSummary.totalCorrectAnswers} ta</div>
                  <div>• Xatolar soni: {wrapUpSummary.totalIncorrectAnswers} ta</div>
                </div>
              </div>

              {/* 3. Grammar Progress */}
              <div className="rounded-2xl bg-slate-950/80 border border-amber-500/30 p-4 space-y-2">
                <div className="text-xs font-extrabold uppercase text-amber-300">
                  📐 Grammatika (Grammar Rules)
                </div>
                <div className="text-2xl font-black text-white">
                  {wrapUpSummary.rulesMastered.length} / {lesson.grammarRules.length}
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <div>• Mukammal (Mastered): {wrapUpSummary.rulesMastered.length} ta</div>
                  <div>• Amalda qo‘llandi: {wrapUpSummary.rulesPracticed.length} ta</div>
                  <div>• Takrorlash zarur: {wrapUpSummary.rulesNeedingReview.length} ta</div>
                  <div className="text-amber-300 font-bold pt-1">
                    Global qoidalar: {wrapUpSummary.globalMasteredGrammarRulesCount} ta
                  </div>
                </div>
              </div>

              {/* 4. Final Assessment */}
              <div className="rounded-2xl bg-slate-950/80 border border-sky-500/30 p-4 space-y-2">
                <div className="text-xs font-extrabold uppercase text-sky-300">
                  🏆 Yakuniy Test (Assessment)
                </div>
                <div className="text-2xl font-black text-white">
                  {wrapUpSummary.assessmentScorePercentage !== null
                    ? `${wrapUpSummary.assessmentScorePercentage}%`
                    : 'Topshirilmagan'}
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <div>
                    • Holati:{' '}
                    {wrapUpSummary.assessmentCompleted
                      ? '✅ Yakuniy test ishlandi'
                      : '⏳ Yakuniy testni ishlang'}
                  </div>
                </div>
              </div>
            </div>

            {/* What You Learned Checklist */}
            <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-4 sm:p-5 space-y-3">
              <h4 className="text-sm font-extrabold text-emerald-300 uppercase tracking-wider">
                ✅ Ushbu darsda o‘rganilgan asosiy mavzular (What You Learned):
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {lesson.objectives.map((obj) => (
                  <div
                    key={obj.id}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 bg-slate-900/80 border border-slate-800/80 rounded-xl p-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{obj.description.uz}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Lesson Recommendation Card */}
            <div className="rounded-2xl bg-gradient-to-r from-indigo-900/70 to-emerald-900/70 border border-indigo-400/50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                  🚀 Keyingi tavsiya etilgan dars (Next Lesson Recommendation):
                </span>
                <h4 className="text-base sm:text-lg font-black text-white">
                  {lesson.wrapUp.nextLessonTitleUz} ({lesson.wrapUp.nextLessonTitleEn})
                </h4>
                <p className="text-xs text-slate-200">{lesson.wrapUp.whyNextLessonLogicalUz}</p>
              </div>

              <button
                type="button"
                onClick={() => onSelectLesson(lesson.wrapUp.nextLessonId)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-950 font-black text-xs sm:text-sm shadow-lg hover:bg-emerald-200 transition shrink-0"
              >
                2-Darsni boshlash <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stage Footer Navigation */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          disabled={activeStageIndex === 0}
          onClick={() => setActiveStageIndex(Math.max(0, activeStageIndex - 1))}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 disabled:opacity-40 text-xs sm:text-sm font-bold text-slate-200 hover:bg-slate-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Oldingi bosqich
        </button>

        <span className="text-xs font-bold text-slate-400">
          Bosqich {activeStageIndex + 1} / {lesson.sections.length}
        </span>

        {activeStageIndex < lesson.sections.length - 1 && (
          <button
            type="button"
            onClick={() => setActiveStageIndex(activeStageIndex + 1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 text-xs sm:text-sm font-extrabold text-white shadow-lg transition"
          >
            Keyingi bosqich: {STAGE_LABELS[lesson.sections[activeStageIndex + 1].stage].shortUz}{' '}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 9-Module Complete Grammar Curriculum Modal */}
      {showCurriculumModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[85vh] rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">
                  TalkMe Scalable Grammar Architecture
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  To‘liq 9-Modulli Ingliz Tili Grammatikasi Dasturi (76 ta Dars)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCurriculumModal(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-extrabold hover:bg-slate-700"
              >
                Yopish ✕
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              {GRAMMAR_CURRICULUM_MODULES.map((mod) => (
                <div
                  key={mod.id}
                  className="rounded-2xl bg-slate-950/90 border border-slate-800 p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-black uppercase text-indigo-400">
                        Module {mod.moduleNumber}
                      </span>
                      <h4 className="text-base font-black text-white">
                        {mod.titleUz} ({mod.titleEn})
                      </h4>
                      <p className="text-xs text-slate-400">{mod.descriptionUz}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-bold text-emerald-300">
                      {mod.lessons.length} ta dars
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {mod.lessons.map((l) => {
                      const playable = availableLessons.some((al) => al.id === l.id);
                      return (
                        <div
                          key={l.id}
                          onClick={() => {
                            if (playable) {
                              onSelectLesson(l.id);
                              setShowCurriculumModal(false);
                            }
                          }}
                          className={`rounded-xl p-2.5 border text-xs transition ${
                            playable
                              ? 'cursor-pointer bg-indigo-950/40 border-indigo-500/50 text-white hover:bg-indigo-900/50'
                              : 'bg-slate-900/50 border-slate-800/80 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 font-extrabold">
                            <span>{l.titleEn}</span>
                            {playable && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                                Ochish
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] opacity-80 mt-0.5">{l.titleUz}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
