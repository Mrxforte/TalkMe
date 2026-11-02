import {
  LESSON_01_HELLO_A0,
  LESSON_01_GRAMMAR_FUNDAMENTALS,
  LESSON_02_PARTS_OF_SPEECH_INTRO,
} from '../content/lessons/lesson01GrammarFundamentals';
import { GRAMMAR_CURRICULUM_MODULES } from '../content/courses/grammarCurriculumCatalog';
import {
  validateLearningLessonSchema,
  migrateLessonProgressVersion,
} from '../validators/lessonContentValidator';
import {
  evaluateExerciseSubmission,
  validateCrosswordGrid,
} from '../engine/exerciseEngine';
import {
  INITIAL_GLOBAL_TRACKER_STATE,
  recordVocabularyExposure,
  recordGrammarRulePerformance,
  recordLessonExerciseOutcome,
  recordLessonAssessmentOutcome,
  recordLessonSectionProgress,
  computeDynamicWrapUpSummary,
} from '../engine/progressAndMasteryEngine';
import { LearningLesson } from '../types/grammarFrameworkTypes';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

export function runGrammarFrameworkTests(): void {
  console.log('=== Running TalkMe Grammar Learning Framework Test Suite ===');

  // ---------------------------------------------------------------------------
  // 1. SCHEMA VALIDATION TESTS
  // ---------------------------------------------------------------------------
  const lessonHelloA0Schema = validateLearningLessonSchema(LESSON_01_HELLO_A0);
  assert(
    lessonHelloA0Schema.isValid,
    `Lesson 1 — Hello! (A0) schema should be valid, but got errors: ${lessonHelloA0Schema.errors
      .map((e) => e.message)
      .join('; ')}`
  );

  const lesson1Schema = validateLearningLessonSchema(LESSON_01_GRAMMAR_FUNDAMENTALS);
  assert(
    lesson1Schema.isValid,
    `Lesson 1 schema should be valid, but got errors: ${lesson1Schema.errors
      .map((e) => e.message)
      .join('; ')}`
  );

  const lesson2Schema = validateLearningLessonSchema(LESSON_02_PARTS_OF_SPEECH_INTRO);
  assert(
    lesson2Schema.isValid,
    `Lesson 2 schema should be valid, but got errors: ${lesson2Schema.errors
      .map((e) => e.message)
      .join('; ')}`
  );

  assert(
    LESSON_01_GRAMMAR_FUNDAMENTALS.theorySubtopics.length === 8,
    `Lesson 1 must have 8 explanation sections, found ${LESSON_01_GRAMMAR_FUNDAMENTALS.theorySubtopics.length}`
  );

  const targetVocabItems = LESSON_01_GRAMMAR_FUNDAMENTALS.vocabulary.filter(
    (v) => v.isTargetVocabulary
  );
  assert(
    targetVocabItems.length === 8,
    `Lesson 1 must have 8 target vocabulary items, found ${targetVocabItems.length}`
  );

  assert(
    LESSON_01_GRAMMAR_FUNDAMENTALS.exercises.length === 10,
    `Lesson 1 must have 10 interactive exercises, found ${LESSON_01_GRAMMAR_FUNDAMENTALS.exercises.length}`
  );

  assert(
    LESSON_01_GRAMMAR_FUNDAMENTALS.assessment.questions.length === 10,
    `Lesson 1 must have 10 final assessment questions, found ${LESSON_01_GRAMMAR_FUNDAMENTALS.assessment.questions.length}`
  );

  // Verify final stage is 'wrap_up' and Warm-up is rejected
  const invalidWarmupLesson: LearningLesson = {
    ...LESSON_01_GRAMMAR_FUNDAMENTALS,
    sections: LESSON_01_GRAMMAR_FUNDAMENTALS.sections.map((s, idx, arr) =>
      idx === arr.length - 1 ? { ...s, title: { en: 'Warm-up', uz: 'Warm-up' } } : s
    ),
  };
  const warmupCheck = validateLearningLessonSchema(invalidWarmupLesson);
  assert(!warmupCheck.isValid, 'Lesson containing "Warm-up" must be rejected by validator');

  // Verify 9-module curriculum structure
  assert(
    GRAMMAR_CURRICULUM_MODULES.length === 9,
    `Curriculum must have 9 modules, found ${GRAMMAR_CURRICULUM_MODULES.length}`
  );
  assert(
    GRAMMAR_CURRICULUM_MODULES[0].lessons.length === 22,
    `Module 1 (Grammar Fundamentals) must have 22 lessons, found ${GRAMMAR_CURRICULUM_MODULES[0].lessons.length}`
  );

  console.log('✓ 1. Content Schema & 9-Module Curriculum validation passed');

  // ---------------------------------------------------------------------------
  // 2. EXERCISE ENGINE & PLAYABLE CROSSWORD VALIDATION TESTS
  // ---------------------------------------------------------------------------
  // Activity 1: Categorization (Letter or Word?)
  const act1 = LESSON_01_GRAMMAR_FUNDAMENTALS.exercises[0];
  const act1Result = evaluateExerciseSubmission(act1, {
    categorizedMap: {
      item_a: 'LETTER',
      item_cat: 'WORD',
      item_book: 'WORD',
      item_b: 'LETTER',
      item_dog: 'WORD',
    },
  });
  assert(act1Result.isCorrect && act1Result.accuracyRatio === 1, 'Activity 1 should pass 100%');

  // Activity 2: Build a Word (CAT, DOG, SUN, BOOK)
  const act2 = LESSON_01_GRAMMAR_FUNDAMENTALS.exercises[1];
  const act2Result = evaluateExerciseSubmission(act2, {
    builtWordsCompleted: ['CAT', 'DOG', 'SUN', 'BOOK'],
  });
  assert(act2Result.isCorrect, 'Activity 2 (CAT, DOG, SUN, BOOK) should pass');

  // Activity 5: Sentence Builder (I read a book.)
  const act5 = LESSON_01_GRAMMAR_FUNDAMENTALS.exercises[4];
  const act5Result = evaluateExerciseSubmission(act5, {
    orderedTokens: ['I', 'read', 'a book.'],
  });
  assert(act5Result.isCorrect, 'Activity 5 ("I read a book.") should pass');

  // Activity 7: Capitalization and Punctuation ("i am a student" -> "I am a student.")
  const act7 = LESSON_01_GRAMMAR_FUNDAMENTALS.exercises[6];
  const act7WrongCase = evaluateExerciseSubmission(act7, {
    textInput: 'i am a student.',
  });
  assert(
    !act7WrongCase.isCorrect,
    'Activity 7 must reject lowercase "i am a student." when testing capitalization'
  );
  const act7Correct = evaluateExerciseSubmission(act7, {
    textInput: 'I am a student.',
  });
  assert(act7Correct.isCorrect, 'Activity 7 must accept "I am a student."');

  // Activity 9: Playable 2D Crossword validation
  const act9 = LESSON_01_GRAMMAR_FUNDAMENTALS.exercises[8];
  assert(Boolean(act9.crossword), 'Activity 9 must contain crossword payload');
  const perfectGridValues: Record<string, string> = {};
  for (const clue of act9.crossword!.clues) {
    const word = clue.answer.trim().toUpperCase();
    for (let i = 0; i < word.length; i++) {
      const r = clue.direction === 'across' ? clue.row : clue.row + i;
      const c = clue.direction === 'across' ? clue.col + i : clue.col;
      perfectGridValues[`${r}_${c}`] = word[i];
    }
  }
  const cwValidation = validateCrosswordGrid(act9.crossword!, perfectGridValues);
  assert(
    cwValidation.isAllCorrect &&
      cwValidation.correctCellsCount === cwValidation.totalRequiredCells,
    'Crossword should validate 100% when all cells match SENTENCE, STUDENT, TEACHER, WORD'
  );

  console.log('✓ 2. Exercise Engine & 2D Playable Crossword validation passed');

  // ---------------------------------------------------------------------------
  // 3. VOCABULARY COUNTER, GRAMMAR MASTERY & DUPLICATE XP PREVENTION TESTS
  // ---------------------------------------------------------------------------
  let tracker = INITIAL_GLOBAL_TRACKER_STATE;
  const studentVocab = LESSON_01_GRAMMAR_FUNDAMENTALS.vocabulary.find(
    (v) => v.id === 'voc_gf_student'
  )!;
  const phoneticsOnlyVocab = LESSON_01_GRAMMAR_FUNDAMENTALS.vocabulary.find(
    (v) => !v.isTargetVocabulary
  )!;

  // Rule: Opening an explanation does NOT mark vocabulary as learned
  tracker = recordVocabularyExposure(tracker, studentVocab, 'explanation_view');
  assert(
    Object.values(tracker.vocabularyProgress).filter((v) => v.status === 'learned').length === 0,
    'Opening vocabulary explanation must NOT mark word as learned'
  );
  assert(
    tracker.vocabularyProgress[studentVocab.id]?.status === 'learning',
    'Opening vocabulary explanation should set status to learning'
  );

  // Rule: Phonetics-only item (isTargetVocabulary: false) must NEVER inflate unique learned words
  tracker = recordVocabularyExposure(tracker, phoneticsOnlyVocab, 'exercise_correct');
  assert(
    Object.values(tracker.vocabularyProgress).filter((v) => v.status === 'learned').length === 0,
    'Phonetics-only item (isTargetVocabulary: false) must NOT be counted in unique learned vocabulary'
  );

  // Rule: Correct exercise application marks target word as learned, and multiple exposures count it ONLY ONCE
  tracker = recordVocabularyExposure(tracker, studentVocab, 'exercise_correct');
  tracker = recordVocabularyExposure(tracker, studentVocab, 'exercise_correct');
  assert(
    Object.values(tracker.vocabularyProgress).filter((v) => v.status === 'learned').length === 1,
    'Same word ("Student") practiced multiple times must be counted only once'
  );

  // Rule: Opening grammar rule explanation does NOT mark rule as mastered ('learned')
  const rule1 = LESSON_01_GRAMMAR_FUNDAMENTALS.grammarRules[0];
  tracker = recordGrammarRulePerformance(tracker, rule1, {
    type: 'explanation_opened',
  });
  assert(
    Object.values(tracker.grammarRuleProgress).filter((r) => r.status === 'learned').length === 0,
    'Opening grammar rule explanation must NOT mark rule as learned'
  );

  // Rule: Completing an exercise awards XP once and prevents duplicate XP on repeat
  const exOutcome1 = recordLessonExerciseOutcome(
    tracker,
    LESSON_01_GRAMMAR_FUNDAMENTALS,
    act1,
    true
  );
  tracker = exOutcome1.nextState;
  assert(
    exOutcome1.xpJustAwarded === act1.xpReward,
    'First exercise completion must award XP'
  );

  const exOutcomeDuplicate = recordLessonExerciseOutcome(
    tracker,
    LESSON_01_GRAMMAR_FUNDAMENTALS,
    act1,
    true
  );
  tracker = exOutcomeDuplicate.nextState;
  assert(
    exOutcomeDuplicate.xpJustAwarded === 0,
    'Duplicate exercise submission must NOT award duplicate XP'
  );

  // Version migration preserves completion and XP
  const existingProgress = tracker.lessonProgress[LESSON_01_GRAMMAR_FUNDAMENTALS.id];
  const upgradedLesson: LearningLesson = {
    ...LESSON_01_GRAMMAR_FUNDAMENTALS,
    version: 3,
  };
  const migratedProgress = migrateLessonProgressVersion(existingProgress, upgradedLesson);
  assert(
    migratedProgress.completedVersion === 3 &&
      migratedProgress.totalLessonXpEarned === act1.xpReward &&
      Boolean(migratedProgress.exerciseResults[act1.id]?.isCorrect),
    'Version migration must preserve completed exercises and XP'
  );

  // Final Assessment & Dynamic Wrap-up Summary
  const assessmentAnswers: Record<string, string> = {};
  LESSON_01_GRAMMAR_FUNDAMENTALS.assessment.questions.forEach((q, idx) => {
    assessmentAnswers[q.id] = idx < 9 ? q.correctAnswer : 'wrong';
  });
  const assessOutcome = recordLessonAssessmentOutcome(
    tracker,
    LESSON_01_GRAMMAR_FUNDAMENTALS,
    assessmentAnswers
  );
  tracker = assessOutcome.nextState;

  const wrapUp = computeDynamicWrapUpSummary(tracker, LESSON_01_GRAMMAR_FUNDAMENTALS);
  assert(
    wrapUp.assessmentScorePercentage === 90 && wrapUp.assessmentCompleted === true,
    'Wrap-up must reflect real assessment score (90%)'
  );
  assert(
    LESSON_01_GRAMMAR_FUNDAMENTALS.wrapUp.nextLessonId === 'lesson_02_parts_of_speech_intro',
    'Wrap-up must recommend Lesson 2 — Parts of Speech Introduction'
  );

  console.log('✓ 3. Global Counters, Mastery Rules, Version Migration & Wrap-up tests passed');

  // ---------------------------------------------------------------------------
  // 4. LESSON 1 — "HELLO!" (A0 — ABSOLUTE BEGINNER) COMPREHENSIVE TESTS
  // ---------------------------------------------------------------------------
  assert(LESSON_01_HELLO_A0.level === 'A0', 'Lesson 1 — Hello! must be level A0');
  assert(
    LESSON_01_HELLO_A0.title.en === 'Lesson 1 — Hello!',
    'Lesson title must be "Lesson 1 — Hello!"'
  );

  // Verify 7 sections in exact order
  assert(
    LESSON_01_HELLO_A0.sections.length === 7,
    `Lesson 1 — Hello! must have exactly 7 sections, found ${LESSON_01_HELLO_A0.sections.length}`
  );
  const expectedSectionTitles = [
    'Hello! Welcome to TalkMe!',
    "Let's say Hello!",
    'Meet TalkMe!',
    'What is Grammar?',
    'Your First 6 Words',
    "Let's Practice!",
    'Wrap-up',
  ];
  LESSON_01_HELLO_A0.sections.forEach((sec, idx) => {
    assert(
      sec.title.en === expectedSectionTitles[idx],
      `Section ${idx + 1} title must be "${expectedSectionTitles[idx]}", got "${sec.title.en}"`
    );
  });

  // Verify Section 7 is named Wrap-up (NOT Warm-up)
  const finalSec = LESSON_01_HELLO_A0.sections[6];
  assert(
    finalSec.stage === 'wrap_up' &&
      finalSec.title.en === 'Wrap-up' &&
      !finalSec.title.en.toLowerCase().includes('warm-up'),
    'Final section must be named Wrap-up, never Warm-up'
  );

  // Verify Section 4 (What is Grammar?) restrictions:
  // No Noun, Verb, Adjective, Pronoun taught in Section 4 text, and single example "I am happy."
  const sec4 = LESSON_01_HELLO_A0.sections[3].beginnerContent!;
  const sec4CombinedText = [
    sec4.heroTitleEn,
    ...(sec4.bodyParagraphsUz || []),
    sec4.legoAnalogy?.explanationUz,
    sec4.legoAnalogy?.fullSentenceEn,
    sec4.legoAnalogy?.fullSentenceUz,
    sec4.closingCalloutUz,
  ]
    .join(' ')
    .toLowerCase();

  assert(
    sec4.legoAnalogy?.fullSentenceEn === 'I am happy.' &&
      sec4.legoAnalogy?.fullSentenceUz === 'Men xursandman.',
    'Section 4 must show the single example "I am happy." — "Men xursandman."'
  );
  for (const forbidden of ['noun', 'verb', 'adjective', 'pronoun']) {
    assert(
      !sec4CombinedText.includes(forbidden),
      `Section 4 must NOT introduce grammatical classification "${forbidden}"`
    );
  }

  // Verify Section 5: Exactly 6 vocabulary items
  assert(
    LESSON_01_HELLO_A0.vocabulary.length === 6,
    `Lesson 1 — Hello! must have exactly 6 vocabulary items, found ${LESSON_01_HELLO_A0.vocabulary.length}`
  );
  const expectedVocabWords = ['Hello', 'Hi', 'Thank you', 'I am', 'Welcome', 'Goodbye'];
  LESSON_01_HELLO_A0.vocabulary.forEach((v, idx) => {
    assert(
      v.wordEn === expectedVocabWords[idx],
      `Vocabulary item ${idx + 1} must be "${expectedVocabWords[idx]}", found "${v.wordEn}"`
    );
    assert(Boolean(v.visualEmoji), `Vocabulary item "${v.wordEn}" must have a visual emoji/icon`);
  });
  const iAmVocab = LESSON_01_HELLO_A0.vocabulary.find((v) => v.wordEn === 'I am')!;
  assert(
    iAmVocab.exampleEn === 'I am Azamat.' &&
      iAmVocab.exampleUz === 'Men Azamatman.' &&
      iAmVocab.personalizableTemplate?.defaultName === 'Azamat',
    '"I am" vocabulary item must include "I am Azamat." — "Men Azamatman." personalization example'
  );

  // Verify Section 6: All 5 interactive exercises
  assert(
    LESSON_01_HELLO_A0.exercises.length === 5,
    `Lesson 1 — Hello! must have exactly 5 exercises, found ${LESSON_01_HELLO_A0.exercises.length}`
  );

  // Exercise 1 — Translation ("What does Hello mean?" -> "Salom")
  const ex1 = LESSON_01_HELLO_A0.exercises[0];
  assert(
    evaluateExerciseSubmission(ex1, { selectedOption: 'Salom' }).isCorrect === true &&
      evaluateExerciseSubmission(ex1, { selectedOption: 'Rahmat' }).isCorrect === false,
    'Exercise 1 (Translation) must validate "Salom" as correct and "Rahmat" as incorrect'
  );

  // Exercise 2 — Situation ("When do we say Thank you?" -> "B. When we thank someone.")
  const ex2 = LESSON_01_HELLO_A0.exercises[1];
  const ex2Eval = evaluateExerciseSubmission(ex2, {
    selectedOption: 'B. When we thank someone.',
  });
  assert(
    ex2Eval.isCorrect === true && ex2Eval.feedbackExplanationUz.length > 10,
    'Exercise 2 (Situation) must validate option B and provide Uzbek explanation'
  );

  // Exercise 3 — Vocabulary recognition ("Which word means Xayr?" -> "Goodbye")
  const ex3 = LESSON_01_HELLO_A0.exercises[2];
  assert(
    evaluateExerciseSubmission(ex3, { selectedOption: 'Goodbye' }).isCorrect === true &&
      evaluateExerciseSubmission(ex3, { selectedOption: 'Hello' }).isCorrect === false,
    'Exercise 3 (Vocabulary recognition) must validate "Goodbye" as correct'
  );

  // Exercise 4 — Listening ("Thank you")
  const ex4 = LESSON_01_HELLO_A0.exercises[3];
  assert(
    ex4.type === 'listening_choose' &&
      Boolean(ex4.audioText) &&
      evaluateExerciseSubmission(ex4, { selectedOption: 'Thank you' }).isCorrect === true,
    'Exercise 4 (Listening) must play audioText and validate the selected expression'
  );

  // Exercise 5 — Speaking ("Hello!", "I am [your name].", "Goodbye!")
  const ex5 = LESSON_01_HELLO_A0.exercises[4];
  assert(
    ex5.type === 'pronunciation_practice' && ex5.speakingPrompts?.length === 3,
    'Exercise 5 (Speaking) must have 3 speaking prompts'
  );
  const ex5Partial = evaluateExerciseSubmission(ex5, {
    spokenPhrasesCompleted: ['spk_hello_1'],
  });
  assert(!ex5Partial.isCorrect, 'Exercise 5 must require all 3 phrases to be completed');
  const ex5Complete = evaluateExerciseSubmission(ex5, {
    spokenPhrasesCompleted: ['spk_hello_1', 'spk_hello_2', 'spk_hello_3'],
  });
  assert(ex5Complete.isCorrect, 'Exercise 5 must pass when all 3 speaking phrases are completed');

  // Verify Section Progress Persistence & Resume Functionality
  let a0Tracker = INITIAL_GLOBAL_TRACKER_STATE;
  const step1 = recordLessonSectionProgress(a0Tracker, LESSON_01_HELLO_A0, {
    currentSectionIndex: 3,
    completedSectionId: 'sec_01_welcome',
    timeSpentDeltaSeconds: 45,
    personalizedLearnerName: 'Dilshod',
  });
  a0Tracker = step1.nextState;
  const savedA0Progress = a0Tracker.lessonProgress[LESSON_01_HELLO_A0.id];
  assert(
    savedA0Progress.currentSectionIndex === 3 &&
      savedA0Progress.completedSectionIds.includes('sec_01_welcome') &&
      savedA0Progress.timeSpentSeconds === 45 &&
      savedA0Progress.personalizedLearnerName === 'Dilshod',
    'Progress persistence must save currentSectionIndex, completedSectionIds, timeSpentSeconds, and personalizedLearnerName for resume'
  );

  // Completing Lesson 1 — Hello! awards completion XP once and prevents duplicate completion XP
  const finishStep1 = recordLessonSectionProgress(a0Tracker, LESSON_01_HELLO_A0, {
    currentSectionIndex: 6,
    completedSectionId: 'sec_07_wrap_up',
    markLessonCompleted: true,
  });
  a0Tracker = finishStep1.nextState;
  assert(
    finishStep1.xpJustAwarded === 25 &&
      a0Tracker.lessonProgress[LESSON_01_HELLO_A0.id].lessonCompleted === true,
    'Completing Lesson 1 — Hello! must mark lessonCompleted and award completion XP'
  );

  const finishStepDuplicate = recordLessonSectionProgress(a0Tracker, LESSON_01_HELLO_A0, {
    currentSectionIndex: 6,
    completedSectionId: 'sec_07_wrap_up',
    markLessonCompleted: true,
  });
  assert(
    finishStepDuplicate.xpJustAwarded === 0,
    'Duplicate lesson completion must NOT award duplicate XP'
  );

  console.log('✓ 4. Lesson 1 — "Hello!" (A0 — Absolute Beginner) all tests passed');
  console.log('=== ALL TALKME GRAMMAR FRAMEWORK TESTS PASSED SUCCESSFULLY ===');
}

runGrammarFrameworkTests();

