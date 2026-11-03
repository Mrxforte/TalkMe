import {
  LearningLesson,
  LearnerLessonProgress,
} from '../types/grammarFrameworkTypes';

export interface LessonValidationError {
  code:
    | 'DUPLICATE_ID'
    | 'MISSING_UZBEK_TRANSLATION'
    | 'WARM_UP_FORBIDDEN'
    | 'MISSING_WRAP_UP_FINAL_STAGE'
    | 'INVALID_EXERCISE_REFERENCE'
    | 'INVALID_VOCABULARY_REFERENCE'
    | 'MISSING_ACCEPTED_ANSWERS'
    | 'INVALID_CROSSWORD_GEOMETRY';
  targetId: string;
  message: string;
}

export interface LessonValidationReport {
  isValid: boolean;
  lessonId: string;
  version: number;
  errors: LessonValidationError[];
}

/**
 * Validates any structured LearningLesson against TalkMe's strict pedagogical
 * and architectural rules:
 * 1. Teaching language must be Uzbek (no empty Uzbek strings).
 * 2. Final stage must be Wrap-up ('wrap_up') and NEVER Warm-up.
 * 3. Stable unique IDs for all objectives, rules, vocabulary, examples, and exercises.
 * 4. Every exercise must have valid accepted answers or structured payload.
 * 5. Crossword clues must fit inside grid bounds and intersect consistently.
 */
export function validateLearningLessonSchema(
  lesson: LearningLesson
): LessonValidationReport {
  const errors: LessonValidationError[] = [];
  const seenIds = new Set<string>();

  const registerId = (id: string, context: string) => {
    if (!id || !id.trim()) {
      errors.push({
        code: 'DUPLICATE_ID',
        targetId: context,
        message: `Empty ID found in ${context}`,
      });
      return;
    }
    if (seenIds.has(id)) {
      errors.push({
        code: 'DUPLICATE_ID',
        targetId: id,
        message: `Duplicate stable ID detected: "${id}" in ${context}`,
      });
    }
    seenIds.add(id);
  };

  registerId(lesson.id, 'lesson.id');

  if (!lesson.title.uz?.trim() || !lesson.description.uz?.trim()) {
    errors.push({
      code: 'MISSING_UZBEK_TRANSLATION',
      targetId: lesson.id,
      message: 'Lesson title.uz and description.uz are mandatory.',
    });
  }

  // Enforce Wrap-up as final section & ban Warm-up
  if (!lesson.sections || lesson.sections.length === 0) {
    errors.push({
      code: 'MISSING_WRAP_UP_FINAL_STAGE',
      targetId: lesson.id,
      message: 'Lesson must contain sections ending with Wrap-up.',
    });
  } else {
    for (const sec of lesson.sections) {
      registerId(sec.id, `section:${sec.id}`);
      const lowerTitle = `${sec.title.uz} ${sec.title.en || ''}`.toLowerCase();
      if (lowerTitle.includes('warm-up') || lowerTitle.includes('warmup')) {
        errors.push({
          code: 'WARM_UP_FORBIDDEN',
          targetId: sec.id,
          message: 'Warm-up section is strictly forbidden. Use Wrap-up for the final section.',
        });
      }
    }

    const finalSection = lesson.sections[lesson.sections.length - 1];
    if (
      finalSection.stage !== 'wrap_up' ||
      !finalSection.title.uz.toLowerCase().includes('wrap-up')
    ) {
      errors.push({
        code: 'MISSING_WRAP_UP_FINAL_STAGE',
        targetId: finalSection.id,
        message: 'The final lesson section must have stage="wrap_up" and be titled Wrap-up.',
      });
    }
  }

  // Validate Vocabulary
  const vocabIdSet = new Set<string>();
  for (const v of lesson.vocabulary) {
    registerId(v.id, `vocabulary:${v.id}`);
    vocabIdSet.add(v.id);
    if (!v.translationUz?.trim() || !v.wordEn?.trim()) {
      errors.push({
        code: 'MISSING_UZBEK_TRANSLATION',
        targetId: v.id,
        message: `Vocabulary item "${v.id}" is missing wordEn or translationUz.`,
      });
    }
  }

  // Validate Grammar Rules
  const ruleIdSet = new Set<string>();
  for (const r of lesson.grammarRules) {
    registerId(r.id, `rule:${r.id}`);
    ruleIdSet.add(r.id);
    if (!r.nameUz?.trim() || !r.shortSummaryUz?.trim() || !r.whyRuleExistsUz?.trim()) {
      errors.push({
        code: 'MISSING_UZBEK_TRANSLATION',
        targetId: r.id,
        message: `GrammarRule "${r.id}" must explain what and why in Uzbek.`,
      });
    }
  }

  // Validate Examples
  for (const ex of lesson.examples) {
    registerId(ex.id, `example:${ex.id}`);
    if (!ex.uzbekTranslation?.trim() || !ex.explanationUz?.trim()) {
      errors.push({
        code: 'MISSING_UZBEK_TRANSLATION',
        targetId: ex.id,
        message: `Example "${ex.id}" is missing Uzbek translation or explanation.`,
      });
    }
  }

  // Validate Exercises & Crossword geometry
  const exerciseIdSet = new Set<string>();
  for (const ex of lesson.exercises) {
    registerId(ex.id, `exercise:${ex.id}`);
    exerciseIdSet.add(ex.id);

    if (!ex.instructionsUz?.trim() || !ex.explanationUz?.trim()) {
      errors.push({
        code: 'MISSING_UZBEK_TRANSLATION',
        targetId: ex.id,
        message: `Exercise "${ex.id}" must have instructionsUz and explanationUz.`,
      });
    }

    if (!ex.acceptedAnswers || ex.acceptedAnswers.length === 0) {
      errors.push({
        code: 'MISSING_ACCEPTED_ANSWERS',
        targetId: ex.id,
        message: `Exercise "${ex.id}" must specify at least one accepted answer.`,
      });
    }

    for (const vId of ex.relatedVocabularyIds) {
      if (!vocabIdSet.has(vId)) {
        errors.push({
          code: 'INVALID_VOCABULARY_REFERENCE',
          targetId: ex.id,
          message: `Exercise "${ex.id}" references unknown vocabularyId "${vId}".`,
        });
      }
    }

    if (ex.type === 'crossword' && ex.crossword) {
      const { rows, cols, clues } = ex.crossword;
      const cellMap = new Map<string, string>();
      for (const clue of clues) {
        const cleanWord = clue.answer.trim().toUpperCase();
        for (let i = 0; i < cleanWord.length; i++) {
          const r = clue.direction === 'across' ? clue.row : clue.row + i;
          const c = clue.direction === 'across' ? clue.col + i : clue.col;
          if (r < 0 || r >= rows || c < 0 || c >= cols) {
            errors.push({
              code: 'INVALID_CROSSWORD_GEOMETRY',
              targetId: clue.id,
              message: `Crossword clue "${clue.id}" (${cleanWord}) overflows grid bounds (${rows}x${cols}) at (${r},${c}).`,
            });
          }
          const key = `${r}_${c}`;
          const existing = cellMap.get(key);
          if (existing && existing !== cleanWord[i]) {
            errors.push({
              code: 'INVALID_CROSSWORD_GEOMETRY',
              targetId: clue.id,
              message: `Crossword conflict at cell (${r},${c}): "${existing}" vs "${cleanWord[i]}".`,
            });
          }
          cellMap.set(key, cleanWord[i]);
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    lessonId: lesson.id,
    version: lesson.version,
    errors,
  };
}

/**
 * Safe Content Versioning Migration:
 * When a lesson's version is updated by an administrator or curriculum author:
 * - Preserves existing completion records and awardedRewardKeys (no duplicate XP)
 * - Detects exercises whose version changed and marks only those as needing re-practice if desired
 * - Never wipes vocabulary or grammar mastery history.
 */
export function migrateLessonProgressVersion(
  existingProgress: LearnerLessonProgress | undefined,
  lesson: LearningLesson
): LearnerLessonProgress {
  if (!existingProgress) {
    return {
      lessonId: lesson.id,
      completedVersion: lesson.version,
      status: 'not_started',
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
  }

  if (existingProgress.completedVersion === lesson.version) {
    return existingProgress;
  }

  // Migrate exercise results safely while keeping valid completed exercises & reward keys intact
  const migratedExerciseResults = { ...existingProgress.exerciseResults };
  for (const ex of lesson.exercises) {
    const prevAttempt = migratedExerciseResults[ex.id];
    if (prevAttempt && prevAttempt.exerciseVersion !== ex.version) {
      // Keep historical counts and XP, update version marker
      migratedExerciseResults[ex.id] = {
        ...prevAttempt,
        exerciseVersion: ex.version,
      };
    }
  }

  return {
    ...existingProgress,
    completedVersion: lesson.version,
    exerciseResults: migratedExerciseResults,
    lastUpdatedAt: Date.now(),
  };
}
