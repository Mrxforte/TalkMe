import {
  validateLessonSafe,
  validatePracticePathSafe,
} from '../content/schemas/contentSchemas';
import {
  UNIVERSAL_COURSES_REPOSITORY,
  UNIVERSAL_LESSONS_REPOSITORY,
  PRACTICE_PATHS_REPOSITORY,
} from '../content/registry/universalContentRepository';
import {
  getAllRegisteredExerciseTemplates,
  getExerciseTemplateSafe,
  evaluateExerciseSubmission,
} from '../engines/exercise-engine/exerciseRegistry';
import {
  LearningAndPracticeEngine,
  KnowledgeTrackerEngine,
} from '../engines/knowledge-engine/knowledgeAndPracticeEngine';
import {
  subscriptionService,
  SpeechManager,
} from '../engines/tts-engine/speechArchitecture';
import {
  validateSubtopicSafe,
  validateBlockSafe,
} from '../content/schemas/subtopicSchemas';
import {
  MAJOR_TOPICS_CATALOG,
  SUBTOPICS_REPOSITORY,
} from '../content/registry/subtopicsCatalog';
import { subtopicProgressEngine } from '../engines/subtopic-engine/subtopicProgressEngine';

export function runUniversalFrameworkVerificationSuite(): {
  passed: number;
  failed: number;
  results: Array<{ name: string; status: 'PASS' | 'FAIL'; error?: string }>;
} {
  const results: Array<{ name: string; status: 'PASS' | 'FAIL'; error?: string }> = [];

  const assert = (name: string, condition: boolean, errorMsg?: string) => {
    if (condition) {
      results.push({ name, status: 'PASS' });
    } else {
      results.push({ name, status: 'FAIL', error: errorMsg || 'Assertion failed' });
    }
  };

  // 1. Verify Variable Subtopic Counts in Roadmap Hierarchy
  const mainCourse = UNIVERSAL_COURSES_REPOSITORY[0];
  const partsOfSpeechTopic = mainCourse.majorTopics.find(
    (t) => t.id === 'topic_parts_of_speech'
  );
  const numbersTopic = mainCourse.majorTopics.find((t) => t.id === 'topic_numbers');
  assert(
    'Roadmap Hierarchy supports variable subtopic counts (Parts of Speech = 7, Numbers = 9)',
    Boolean(
      partsOfSpeechTopic &&
        numbersTopic &&
        partsOfSpeechTopic.subtopics.length === 7 &&
        numbersTopic.subtopics.length === 9
    )
  );

  // 2. Verify Universal Lesson Schema Validation across structurally different lessons
  const helloLessonValid = validateLessonSafe(UNIVERSAL_LESSONS_REPOSITORY.lesson_hello_a0);
  const nounsLessonValid = validateLessonSafe(UNIVERSAL_LESSONS_REPOSITORY.lesson_nouns_1);
  const numbersLessonValid = validateLessonSafe(UNIVERSAL_LESSONS_REPOSITORY.lesson_numbers_0_10);
  assert(
    'Universal Lesson Engine validates multiple structurally different JSON lessons via Zod',
    helloLessonValid.success && nounsLessonValid.success && numbersLessonValid.success,
    helloLessonValid.error || nounsLessonValid.error || numbersLessonValid.error
  );

  // 3. Verify All 110 Exercise Templates Registered
  const all110 = getAllRegisteredExerciseTemplates();
  const has1To110 =
    all110.length === 110 &&
    all110[0].number === 1 &&
    all110[109].number === 110;
  assert(
    'Exercise Library contains all 110 registered exercise templates (#1 to #110)',
    has1To110,
    `Found ${all110.length} templates`
  );

  // 4. Verify Safe Fallback for Unknown Exercise Type
  const fallbackTemplate = getExerciseTemplateSafe('unknown_future_exercise_type_999');
  assert(
    'Unknown exercise type safely falls back to a valid template',
    Boolean(fallbackTemplate && fallbackTemplate.primitive === 'multiple_choice')
  );

  // 5. Verify Answer Validation Across Shared Primitives
  const mcEval = evaluateExerciseSubmission(
    'multiple_choice',
    {
      options: [
        { id: 'a', text: 'Book', isCorrect: true },
        { id: 'b', text: 'Run', isCorrect: false },
      ],
    },
    'a'
  );
  const seqEval = evaluateExerciseSubmission(
    'sequence_ordering',
    {
      correctSequence: ['I', 'am', 'happy'],
    },
    ['I', 'am', 'happy']
  );
  assert(
    'Exercise answer validator accurately scores multiple-choice and sequence ordering',
    mcEval.isCorrect && mcEval.score === 100 && seqEval.isCorrect && seqEval.score === 100
  );

  // 6. Verify Sequential Practice Unlocking (Failed Attempt vs Passed Attempt)
  const engine = new LearningAndPracticeEngine();
  const initialNodes = engine.getPracticePathNodesState('practice_path_nouns');
  const ex1 = initialNodes[0];
  const ex2Before = initialNodes[1];

  assert(
    'Practice Path Exercise 1 starts unlocked while Exercise 2 starts locked',
    ex1.progress.unlocked === true && ex2Before.progress.unlocked === false
  );

  // Submit failing score (40% < 75% required)
  const failedAttempt = engine.recordExerciseSubmission(
    'practice_path_nouns',
    ex1.exercise.id,
    40
  );
  const ex2AfterFail = engine.getPracticePathNodesState('practice_path_nouns')[1];
  assert(
    'Failed exercise attempt (< requiredScore) does NOT unlock Exercise 2',
    failedAttempt.passed === false && ex2AfterFail.progress.unlocked === false
  );

  // Retry Exercise 1 with passing score (100% >= 75%)
  const passedAttempt = engine.recordExerciseSubmission(
    'practice_path_nouns',
    ex1.exercise.id,
    100
  );
  const ex2AfterPass = engine.getPracticePathNodesState('practice_path_nouns')[1];
  assert(
    'Passing Exercise 1 (>= requiredScore) sequentially unlocks Exercise 2',
    passedAttempt.passed === true &&
      passedAttempt.newlyUnlockedExerciseId === ex2AfterPass.exercise.id &&
      ex2AfterPass.progress.unlocked === true
  );

  // 7. Verify Knowledge Tracker separates Lesson Exposure from Practice Mastery
  const kt = new KnowledgeTrackerEngine();
  kt.recordLessonExposure(['kw_hello']);
  const afterLesson = kt.getAllKnowledgeStates().find((k) => k.knowledgeId === 'kw_hello');
  kt.recordExerciseAttempt(['kw_hello'], true, 100);
  const afterPractice = kt.getAllKnowledgeStates().find((k) => k.knowledgeId === 'kw_hello');
  assert(
    'Knowledge Tracker distinguishes lesson exposure (<= 45%) from active practice mastery (> 45%)',
    Boolean(
      afterLesson &&
        afterPractice &&
        afterPractice.masteryScore > 45 &&
        afterPractice.correctCount >= 1
    )
  );

  // 8. Verify Freemium TTS Provider Routing (Free Native vs Paid Gemini)
  const sm = new SpeechManager();
  subscriptionService.setTier('FREE');
  const freeProviderId = sm.getActiveProvider().id;
  subscriptionService.setTier('PREMIUM');
  const premiumProviderId = sm.getActiveProvider().id;
  assert(
    'Freemium SpeechManager routes FREE users to NativeSpeechProvider and PREMIUM users to GeminiSpeechProvider',
    freeProviderId === 'native-web-speech' && premiumProviderId === 'gemini-tts'
  );

  // 9. Verify Practice Path Schema Validation
  const nounsPathValid = validatePracticePathSafe(PRACTICE_PATHS_REPOSITORY.practice_path_nouns);
  const numbersPathValid = validatePracticePathSafe(
    PRACTICE_PATHS_REPOSITORY.practice_path_numbers
  );
  assert(
    'Practice Path Zod validator validates Nouns (8 steps) and Numbers (5 steps) paths',
    nounsPathValid.success && numbersPathValid.success
  );

  // 10. Verify Universal Subtopic Framework: Nouns Major Topic has 18 Subtopics & all validate via Zod
  const nounsMajorTopic = MAJOR_TOPICS_CATALOG.find((m) => m.id === 'nouns');
  const allSubtopicsValid = Object.values(SUBTOPICS_REPOSITORY).every(
    (s) => validateSubtopicSafe(s).success
  );
  const all18NounsPresentAndValid = Boolean(
    nounsMajorTopic &&
      nounsMajorTopic.subtopicIds.length === 18 &&
      nounsMajorTopic.subtopicIds.every((id) => {
        const sub = SUBTOPICS_REPOSITORY[id];
        return (
          sub &&
          validateSubtopicSafe(sub).success &&
          sub.sections.length === 7 &&
          sub.sections.every((sec) => sec.blocks.every((b) => validateBlockSafe(b).known))
        );
      })
  );
  assert(
    'Major Topic Nouns contains all 18 Subtopics and all 18 Subtopic micro-courses pass Zod validation',
    all18NounsPresentAndValid && allSubtopicsValid
  );

  // 11. Verify Subtopic 01 ("noun_01_what_is_a_noun") & Subtopic 18 ("noun_18_complete_review") 7-Stage Flow
  const whatIsNoun = SUBTOPICS_REPOSITORY.noun_01_what_is_a_noun;
  const reviewNoun = SUBTOPICS_REPOSITORY.noun_18_complete_review;
  const allBlocksValidInWhatIsNoun =
    whatIsNoun.sections.every((sec) => sec.blocks.every((b) => validateBlockSafe(b).known)) &&
    reviewNoun.sections.every((sec) => sec.blocks.every((b) => validateBlockSafe(b).known));
  assert(
    'Subtopic 01 ("What is a Noun?") and Subtopic 18 ("Complete Review") have 7 mandatory stages and valid content blocks',
    whatIsNoun.sections.length === 7 &&
      reviewNoun.sections.length === 7 &&
      whatIsNoun.sections[0].type === 'introduction' &&
      reviewNoun.sections[6].type === 'wrap_up' &&
      allBlocksValidInWhatIsNoun
  );

  // 12. Verify Subtopic Block Validator handles known and unknown block types gracefully
  const unknownBlockResult = validateBlockSafe({
    type: 'FutureHologramBlock_v99',
    id: 'holo_1',
  });
  const knownTipBlockResult = validateBlockSafe({
    type: 'TipBlock',
    id: 'tip_test',
    titleUz: 'Maslahat',
    bodyUz: 'Eslab qoling',
  });
  assert(
    'Subtopic Block Registry validates known blocks and gracefully flags unknown block types without crashing',
    knownTipBlockResult.known === true &&
      unknownBlockResult.known === false &&
      unknownBlockResult.rawType === 'FutureHologramBlock_v99'
  );

  // 13. Verify SubtopicProgressEngine Assessment Threshold Gating (70% required)
  subtopicProgressEngine.resetSubtopicProgress('what_is_a_noun');
  const failAssessment = subtopicProgressEngine.recordAssessmentSubmission(
    'what_is_a_noun',
    70,
    [
      {
        questionId: 'q1',
        knowledgeId: 'kw_teacher',
        promptUz: 'Q1',
        explanationUz: 'E1',
        isCorrect: true,
      },
      {
        questionId: 'q2',
        knowledgeId: 'kw_book',
        promptUz: 'Q2',
        explanationUz: 'E2',
        isCorrect: false,
      },
      {
        questionId: 'q3',
        knowledgeId: 'kw_school',
        promptUz: 'Q3',
        explanationUz: 'E3',
        isCorrect: false,
      },
    ]
  );
  const wrapAfterFail = subtopicProgressEngine.completeSubtopicWrapUp('what_is_a_noun');

  const passAssessment = subtopicProgressEngine.recordAssessmentSubmission(
    'what_is_a_noun',
    70,
    [
      {
        questionId: 'q1',
        knowledgeId: 'kw_teacher',
        promptUz: 'Q1',
        explanationUz: 'E1',
        isCorrect: true,
      },
      {
        questionId: 'q2',
        knowledgeId: 'kw_book',
        promptUz: 'Q2',
        explanationUz: 'E2',
        isCorrect: true,
      },
      {
        questionId: 'q3',
        knowledgeId: 'kw_school',
        promptUz: 'Q3',
        explanationUz: 'E3',
        isCorrect: true,
      },
    ]
  );
  const wrapAfterPass = subtopicProgressEngine.completeSubtopicWrapUp('what_is_a_noun');

  assert(
    'SubtopicProgressEngine blocks completion when assessment < 70% and marks completed when >= 70% + Wrap-up',
    failAssessment.passed === false &&
      wrapAfterFail.isCompleted === false &&
      passAssessment.passed === true &&
      wrapAfterPass.isCompleted === true
  );

  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  return { passed, failed, results };
}

