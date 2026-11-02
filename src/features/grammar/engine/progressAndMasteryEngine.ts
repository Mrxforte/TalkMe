import {
  VocabularyItem,
  VocabularyProgressRecord,
  GrammarRule,
  GrammarRuleProgressRecord,
  LearningMasteryState,
  LearnerLessonProgress,
  Exercise,
  LearningLesson,
} from '../types/grammarFrameworkTypes';

export interface GlobalLearningTrackerState {
  vocabularyProgress: Record<string, VocabularyProgressRecord>;
  grammarRuleProgress: Record<string, GrammarRuleProgressRecord>;
  lessonProgress: Record<string, LearnerLessonProgress>;
  awardedGlobalRewardKeys: string[];
}

export const INITIAL_GLOBAL_TRACKER_STATE: GlobalLearningTrackerState = {
  vocabularyProgress: {},
  grammarRuleProgress: {},
  lessonProgress: {},
  awardedGlobalRewardKeys: [],
};

/**
 * Rule 1–4 of Global Vocabulary Counter:
 * - Counts each unique target vocabulary item only once.
 * - Phonetics-only examples (isTargetVocabulary === false) NEVER increment the unique learned counter.
 * - Opening an explanation does NOT mark a word as 'learned' — at most 'learning'.
 * - A vocabulary item reaches 'learned' only after meaningful interactive activity or exercise success.
 */
export function recordVocabularyExposure(
  state: GlobalLearningTrackerState,
  vocabItem: VocabularyItem,
  interactionType: 'explanation_view' | 'audio_practice' | 'exercise_correct' | 'exercise_incorrect'
): GlobalLearningTrackerState {
  if (!vocabItem.isTargetVocabulary) {
    // Phonetics examples do not count toward learned vocabulary
    return state;
  }

  const prev: VocabularyProgressRecord = state.vocabularyProgress[vocabItem.id] || {
    vocabularyId: vocabItem.id,
    status: 'not_started',
    meaningfulInteractionsCount: 0,
    correctExercisesCount: 0,
    incorrectExercisesCount: 0,
  };

  let nextStatus: LearningMasteryState = prev.status;
  let nextInteractions = prev.meaningfulInteractionsCount;
  let nextCorrect = prev.correctExercisesCount;
  let nextIncorrect = prev.incorrectExercisesCount;
  let firstLearnedDate = prev.firstLearnedDate;

  if (interactionType === 'explanation_view') {
    if (nextStatus === 'not_started') {
      nextStatus = 'learning';
    }
  } else if (interactionType === 'audio_practice') {
    nextInteractions += 1;
    if (nextStatus === 'not_started' || nextStatus === 'learning') {
      nextStatus = 'practiced';
    }
    if (nextInteractions >= 2 && nextCorrect >= 1) {
      nextStatus = 'learned';
      if (!firstLearnedDate) firstLearnedDate = Date.now();
    }
  } else if (interactionType === 'exercise_correct') {
    nextInteractions += 1;
    nextCorrect += 1;
    nextStatus = 'learned';
    if (!firstLearnedDate) firstLearnedDate = Date.now();
  } else if (interactionType === 'exercise_incorrect') {
    nextInteractions += 1;
    nextIncorrect += 1;
    nextStatus = nextCorrect > 0 ? 'needs_review' : 'learning';
  }

  return {
    ...state,
    vocabularyProgress: {
      ...state.vocabularyProgress,
      [vocabItem.id]: {
        vocabularyId: vocabItem.id,
        status: nextStatus,
        meaningfulInteractionsCount: nextInteractions,
        correctExercisesCount: nextCorrect,
        incorrectExercisesCount: nextIncorrect,
        firstLearnedDate,
        lastReviewedDate: Date.now(),
      },
    },
  };
}

/**
 * Global Grammar Rules Mastery Engine:
 * - Opening an explanation only transitions 'not_started' -> 'learning' (never 'learned').
 * - Mastery ('learned') requires real exercise performance (attempts >= 1, accuracy >= 75%, and application practiced).
 */
export function recordGrammarRulePerformance(
  state: GlobalLearningTrackerState,
  rule: GrammarRule,
  event: {
    type: 'explanation_opened' | 'exercise_attempt';
    isCorrect?: boolean;
    isApplicationExercise?: boolean;
  }
): GlobalLearningTrackerState {
  const prev: GrammarRuleProgressRecord = state.grammarRuleProgress[rule.id] || {
    ruleId: rule.id,
    status: 'not_started',
    understandingPracticed: false,
    applicationPracticed: false,
    attempts: 0,
    correctCount: 0,
    incorrectCount: 0,
    accuracyPercentage: 0,
  };

  if (event.type === 'explanation_opened') {
    if (prev.status !== 'not_started') return state;
    return {
      ...state,
      grammarRuleProgress: {
        ...state.grammarRuleProgress,
        [rule.id]: {
          ...prev,
          status: 'learning',
          lastPracticedAt: Date.now(),
        },
      },
    };
  }

  const attempts = prev.attempts + 1;
  const correctCount = prev.correctCount + (event.isCorrect ? 1 : 0);
  const incorrectCount = prev.incorrectCount + (event.isCorrect ? 0 : 1);
  const accuracyPercentage = Math.round((correctCount / attempts) * 100);
  const understandingPracticed = prev.understandingPracticed || Boolean(event.isCorrect);
  const applicationPracticed =
    prev.applicationPracticed || Boolean(event.isCorrect && event.isApplicationExercise);

  let nextStatus: LearningMasteryState = 'practiced';
  if (!event.isCorrect && accuracyPercentage < 60) {
    nextStatus = 'needs_review';
  } else if (
    correctCount >= 1 &&
    accuracyPercentage >= 75 &&
    (applicationPracticed || understandingPracticed)
  ) {
    nextStatus = 'learned';
  } else {
    nextStatus = 'practiced';
  }

  return {
    ...state,
    grammarRuleProgress: {
      ...state.grammarRuleProgress,
      [rule.id]: {
        ruleId: rule.id,
        status: nextStatus,
        understandingPracticed,
        applicationPracticed,
        attempts,
        correctCount,
        incorrectCount,
        accuracyPercentage,
        lastPracticedAt: Date.now(),
      },
    },
  };
}

/**
 * Records an exercise submission, updates linked vocabulary and grammar rules,
 * and computes verified XP without ever awarding duplicate XP for the same exercise version.
 */
export function recordLessonExerciseOutcome(
  state: GlobalLearningTrackerState,
  lesson: LearningLesson,
  exercise: Exercise,
  isCorrect: boolean
): {
  nextState: GlobalLearningTrackerState;
  xpJustAwarded: number;
} {
  let workingState = { ...state };
  const rewardKey = `lesson:${lesson.id}:ex:${exercise.id}:v:${exercise.version}`;
  const alreadyAwarded = workingState.awardedGlobalRewardKeys.includes(rewardKey);
  const xpJustAwarded = isCorrect && !alreadyAwarded ? exercise.xpReward : 0;

  if (xpJustAwarded > 0) {
    workingState = {
      ...workingState,
      awardedGlobalRewardKeys: [...workingState.awardedGlobalRewardKeys, rewardKey],
    };
  }

  // Update linked vocabulary items
  for (const vocabId of exercise.relatedVocabularyIds) {
    const vocabObj = lesson.vocabulary.find((v) => v.id === vocabId);
    if (vocabObj) {
      workingState = recordVocabularyExposure(
        workingState,
        vocabObj,
        isCorrect ? 'exercise_correct' : 'exercise_incorrect'
      );
    }
  }

  // Update linked grammar rules
  for (const ruleId of exercise.relatedGrammarRuleIds) {
    const ruleObj = lesson.grammarRules.find((r) => r.id === ruleId);
    if (ruleObj) {
      workingState = recordGrammarRulePerformance(workingState, ruleObj, {
        type: 'exercise_attempt',
        isCorrect,
        isApplicationExercise: exercise.requiresApplication,
      });
    }
  }

  // Update lesson progress record
  const prevLessonProg: LearnerLessonProgress = workingState.lessonProgress[lesson.id] || {
    lessonId: lesson.id,
    completedVersion: lesson.version,
    status: 'learning',
    completedSectionIds: [],
    exerciseResults: {},
    assessmentScorePercentage: null,
    assessmentCorrectCount: 0,
    assessmentTotalCount: lesson.assessment.questions.length,
    assessmentCompleted: false,
    awardedRewardKeys: [],
    totalLessonXpEarned: 0,
    lastUpdatedAt: Date.now(),
  };

  const prevExAttempt = prevLessonProg.exerciseResults[exercise.id];
  const nextExAttempt = {
    exerciseId: exercise.id,
    exerciseVersion: exercise.version,
    isCorrect: prevExAttempt?.isCorrect || isCorrect,
    attemptsCount: (prevExAttempt?.attemptsCount || 0) + 1,
    correctCount: (prevExAttempt?.correctCount || 0) + (isCorrect ? 1 : 0),
    incorrectCount: (prevExAttempt?.incorrectCount || 0) + (isCorrect ? 0 : 1),
    xpAwarded: (prevExAttempt?.xpAwarded || 0) + xpJustAwarded,
    completedAt: Date.now(),
  };

  const nextExerciseResults = {
    ...prevLessonProg.exerciseResults,
    [exercise.id]: nextExAttempt,
  };

  workingState = {
    ...workingState,
    lessonProgress: {
      ...workingState.lessonProgress,
      [lesson.id]: {
        ...prevLessonProg,
        status: 'practiced',
        exerciseResults: nextExerciseResults,
        awardedRewardKeys:
          xpJustAwarded > 0
            ? [...prevLessonProg.awardedRewardKeys, rewardKey]
            : prevLessonProg.awardedRewardKeys,
        totalLessonXpEarned: prevLessonProg.totalLessonXpEarned + xpJustAwarded,
        lastUpdatedAt: Date.now(),
      },
    },
  };

  return {
    nextState: workingState,
    xpJustAwarded,
  };
}

/**
 * Records final assessment outcome and updates only the specific foundational
 * grammar concepts and vocabulary items actually assessed.
 */
export function recordLessonAssessmentOutcome(
  state: GlobalLearningTrackerState,
  lesson: LearningLesson,
  answersByQuestionId: Record<string, string>
): {
  nextState: GlobalLearningTrackerState;
  scorePercentage: number;
  correctCount: number;
  totalCount: number;
  xpJustAwarded: number;
} {
  let workingState = { ...state };
  const questions = lesson.assessment.questions;
  let correctCount = 0;

  for (const q of questions) {
    const userAns = (answersByQuestionId[q.id] || '').trim();
    const isCorrect = userAns.toLowerCase() === q.correctAnswer.trim().toLowerCase();
    if (isCorrect) correctCount++;

    const ruleObj = lesson.grammarRules.find((r) => r.id === q.grammarRuleId);
    if (ruleObj) {
      workingState = recordGrammarRulePerformance(workingState, ruleObj, {
        type: 'exercise_attempt',
        isCorrect,
        isApplicationExercise: true,
      });
    }

    if (q.vocabularyId) {
      const vocabObj = lesson.vocabulary.find((v) => v.id === q.vocabularyId);
      if (vocabObj) {
        workingState = recordVocabularyExposure(
          workingState,
          vocabObj,
          isCorrect ? 'exercise_correct' : 'exercise_incorrect'
        );
      }
    }
  }

  const totalCount = questions.length;
  const scorePercentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const passed = scorePercentage >= lesson.assessment.passingPercentage;

  const rewardKey = `lesson:${lesson.id}:assessment:v:${lesson.version}`;
  const alreadyAwarded = workingState.awardedGlobalRewardKeys.includes(rewardKey);
  const xpJustAwarded = passed && !alreadyAwarded ? lesson.assessment.xpReward : 0;

  if (xpJustAwarded > 0) {
    workingState = {
      ...workingState,
      awardedGlobalRewardKeys: [...workingState.awardedGlobalRewardKeys, rewardKey],
    };
  }

  const prevLessonProg: LearnerLessonProgress = workingState.lessonProgress[lesson.id] || {
    lessonId: lesson.id,
    completedVersion: lesson.version,
    status: 'learning',
    currentSectionIndex: 0,
    completedSectionIds: [],
    exerciseResults: {},
    assessmentScorePercentage: null,
    assessmentCorrectCount: 0,
    assessmentTotalCount: totalCount,
    assessmentCompleted: false,
    lessonCompleted: false,
    timeSpentSeconds: 0,
    awardedRewardKeys: [],
    totalLessonXpEarned: 0,
    lastUpdatedAt: Date.now(),
  };

  workingState = {
    ...workingState,
    lessonProgress: {
      ...workingState.lessonProgress,
      [lesson.id]: {
        ...prevLessonProg,
        status: passed ? 'learned' : 'needs_review',
        assessmentScorePercentage: scorePercentage,
        assessmentCorrectCount: correctCount,
        assessmentTotalCount: totalCount,
        assessmentCompleted: true,
        lessonCompleted: passed || prevLessonProg.lessonCompleted,
        awardedRewardKeys:
          xpJustAwarded > 0
            ? [...prevLessonProg.awardedRewardKeys, rewardKey]
            : prevLessonProg.awardedRewardKeys,
        totalLessonXpEarned: prevLessonProg.totalLessonXpEarned + xpJustAwarded,
        lastUpdatedAt: Date.now(),
      },
    },
  };

  return {
    nextState: workingState,
    scorePercentage,
    correctCount,
    totalCount,
    xpJustAwarded,
  };
}

/**
 * Persists learner section navigation, completed sections, personalized name,
 * elapsed study time, and non-duplicate lesson completion.
 */
export function recordLessonSectionProgress(
  state: GlobalLearningTrackerState,
  lesson: LearningLesson,
  update: {
    currentSectionIndex?: number;
    completedSectionId?: string;
    markLessonCompleted?: boolean;
    deltaTimeSeconds?: number;
    timeSpentDeltaSeconds?: number;
    personalizedLearnerName?: string;
  }
): {
  nextState: GlobalLearningTrackerState;
  xpJustAwarded: number;
} {
  let workingState = { ...state };
  const prevLessonProg: LearnerLessonProgress = workingState.lessonProgress[lesson.id] || {
    lessonId: lesson.id,
    completedVersion: lesson.version,
    status: 'learning',
    currentSectionIndex: 0,
    completedSectionIds: [],
    exerciseResults: {},
    assessmentScorePercentage: null,
    assessmentCorrectCount: 0,
    assessmentTotalCount: lesson.assessment.questions.length,
    assessmentCompleted: false,
    lessonCompleted: false,
    timeSpentSeconds: 0,
    awardedRewardKeys: [],
    totalLessonXpEarned: 0,
    lastUpdatedAt: Date.now(),
  };

  const nextCompletedSections = update.completedSectionId
    ? Array.from(new Set([...prevLessonProg.completedSectionIds, update.completedSectionId]))
    : prevLessonProg.completedSectionIds;

  let xpJustAwarded = 0;
  let nextAwardedGlobalKeys = workingState.awardedGlobalRewardKeys;
  let nextLessonRewardKeys = prevLessonProg.awardedRewardKeys;
  let nextLessonCompleted = Boolean(prevLessonProg.lessonCompleted);
  let nextStatus = prevLessonProg.status === 'not_started' ? 'learning' : prevLessonProg.status;

  if (update.markLessonCompleted) {
    nextLessonCompleted = true;
    nextStatus = 'learned';
    const completionRewardKey = `lesson:${lesson.id}:complete:v:${lesson.version}`;
    if (!nextAwardedGlobalKeys.includes(completionRewardKey)) {
      xpJustAwarded = 25;
      nextAwardedGlobalKeys = [...nextAwardedGlobalKeys, completionRewardKey];
      nextLessonRewardKeys = [...nextLessonRewardKeys, completionRewardKey];
    }
  }

  const addedSeconds = update.deltaTimeSeconds ?? update.timeSpentDeltaSeconds ?? 0;

  workingState = {
    ...workingState,
    awardedGlobalRewardKeys: nextAwardedGlobalKeys,
    lessonProgress: {
      ...workingState.lessonProgress,
      [lesson.id]: {
        ...prevLessonProg,
        status: nextStatus,
        currentSectionIndex:
          update.currentSectionIndex !== undefined
            ? update.currentSectionIndex
            : prevLessonProg.currentSectionIndex ?? 0,
        completedSectionIds: nextCompletedSections,
        lessonCompleted: nextLessonCompleted,
        timeSpentSeconds: (prevLessonProg.timeSpentSeconds || 0) + addedSeconds,
        personalizedLearnerName:
          update.personalizedLearnerName !== undefined
            ? update.personalizedLearnerName
            : prevLessonProg.personalizedLearnerName,
        awardedRewardKeys: nextLessonRewardKeys,
        totalLessonXpEarned: prevLessonProg.totalLessonXpEarned + xpJustAwarded,
        lastUpdatedAt: Date.now(),
      },
    },
  };

  return {
    nextState: workingState,
    xpJustAwarded,
  };
}

/**
 * Computes real, dynamic Wrap-up analytics from actual learner state.
 */
export function computeDynamicWrapUpSummary(
  state: GlobalLearningTrackerState,
  lesson: LearningLesson
) {
  const lessonProg = state.lessonProgress[lesson.id];
  const exerciseAttempts = Object.values(lessonProg?.exerciseResults || {});
  const exercisesCompletedCount = exerciseAttempts.filter((a) => a.isCorrect).length;
  const totalExercisesCount = lesson.exercises.length;

  const totalCorrectAnswers =
    exerciseAttempts.reduce((acc, a) => acc + a.correctCount, 0) +
    (lessonProg?.assessmentCorrectCount || 0);
  const totalIncorrectAnswers =
    exerciseAttempts.reduce((acc, a) => acc + a.incorrectCount, 0) +
    ((lessonProg?.assessmentTotalCount || 0) - (lessonProg?.assessmentCorrectCount || 0));

  const totalDecisions = totalCorrectAnswers + totalIncorrectAnswers;
  const accuracyPercentage =
    totalDecisions > 0 ? Math.round((totalCorrectAnswers / totalDecisions) * 100) : 0;

  // Vocabulary breakdown for this lesson
  const targetVocab = lesson.vocabulary.filter((v) => v.isTargetVocabulary);
  const newUniqueVocabLearned = targetVocab.filter(
    (v) => state.vocabularyProgress[v.id]?.status === 'learned'
  );
  const vocabPracticedOrLearning = targetVocab.filter(
    (v) =>
      state.vocabularyProgress[v.id]?.status === 'practiced' ||
      state.vocabularyProgress[v.id]?.status === 'learning'
  );
  const vocabNeedingReview = targetVocab.filter(
    (v) => state.vocabularyProgress[v.id]?.status === 'needs_review'
  );

  // Global unique learned vocabulary across the entire app
  const globalUniqueLearnedVocabularyCount = Object.values(
    state.vocabularyProgress
  ).filter((v) => v.status === 'learned').length;

  // Grammar rules breakdown for this lesson
  const rulesMastered = lesson.grammarRules.filter(
    (r) => state.grammarRuleProgress[r.id]?.status === 'learned'
  );
  const rulesPracticed = lesson.grammarRules.filter(
    (r) =>
      state.grammarRuleProgress[r.id]?.status === 'practiced' ||
      state.grammarRuleProgress[r.id]?.status === 'learning'
  );
  const rulesNeedingReview = lesson.grammarRules.filter(
    (r) => state.grammarRuleProgress[r.id]?.status === 'needs_review'
  );

  const globalMasteredGrammarRulesCount = Object.values(
    state.grammarRuleProgress
  ).filter((r) => r.status === 'learned').length;

  const completedSectionsCount = lessonProg?.completedSectionIds?.length || 0;
  const totalSectionsCount = lesson.sections.length;
  const isLessonFullyCompleted =
    Boolean(lessonProg?.lessonCompleted) ||
    Boolean(lessonProg?.assessmentCompleted) ||
    (totalExercisesCount > 0 && exercisesCompletedCount === totalExercisesCount);

  return {
    exercisesCompletedCount,
    totalExercisesCount,
    totalCorrectAnswers,
    totalIncorrectAnswers,
    accuracyPercentage,
    newUniqueVocabLearned,
    vocabPracticedOrLearning,
    vocabNeedingReview,
    globalUniqueLearnedVocabularyCount,
    rulesMastered,
    rulesPracticed,
    rulesNeedingReview,
    globalMasteredGrammarRulesCount,
    totalLessonXpEarned: lessonProg?.totalLessonXpEarned || 0,
    assessmentScorePercentage: lessonProg?.assessmentScorePercentage ?? null,
    assessmentCompleted: Boolean(lessonProg?.assessmentCompleted),
    completedSectionsCount,
    totalSectionsCount,
    isLessonFullyCompleted,
    timeSpentSeconds: lessonProg?.timeSpentSeconds || 0,
  };
}
