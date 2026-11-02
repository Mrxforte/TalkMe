import { GlobalKnowledgeTracker } from '../knowledge/domain/services/GlobalKnowledgeTracker';
import { LocalKnowledgeRepository } from '../knowledge/data/local/LocalKnowledgeRepository';
import { KnowledgeMasteryEngine } from '../knowledge/domain/services/KnowledgeMasteryEngine';
import { globalKnowledgeCatalog } from '../knowledge/domain/services/GlobalKnowledgeCatalog';
import {
  normalizeVocabularyTerm,
  buildStableVocabularyId,
} from '../knowledge/domain/entities/VocabularyKnowledge';
import { normalizeGrammarRuleKey } from '../knowledge/domain/entities/GrammarKnowledge';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${message}`);
  }
}

function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(
      `ASSERTION FAILED: ${message}\n  Expected: ${JSON.stringify(expected)}\n  Actual:   ${JSON.stringify(actual)}`
    );
  }
}

export function runGlobalKnowledgeTrackerTests(): {
  passed: number;
  total: number;
  results: string[];
} {
  const results: string[] = [];
  let passed = 0;
  let total = 0;

  const runTest = (name: string, fn: () => void) => {
    total += 1;
    fn();
    passed += 1;
    results.push(`PASS [${total}]: ${name}`);
  };

  // Helper to create an isolated tracker instance backed by fresh repository
  const createIsolatedTracker = () => {
    const repo = new LocalKnowledgeRepository();
    repo.clearAll();
    const engine = new KnowledgeMasteryEngine();
    const tracker = new GlobalKnowledgeTracker(repo, engine);
    tracker.resetAllKnowledge();
    return { tracker, repo, engine };
  };

  // ============================================================================
  // TEST 1: Unique vocabulary counting & Merely viewing does NOT mark learned
  // ============================================================================
  runTest('1. Unique vocabulary counting (discovered vs learned separation)', () => {
    const { tracker } = createIsolatedTracker();

    // Merely viewing 3 words in a lesson
    tracker.emitEvent({
      eventType: 'VOCABULARY_DISCOVERED',
      knowledgeId: 'word_apple_test',
      metadata: { word: 'apple', translation: 'olma' },
    });
    tracker.emitEvent({
      eventType: 'VOCABULARY_DISCOVERED',
      knowledgeId: 'word_book_test',
      metadata: { word: 'book', translation: 'kitob' },
    });

    const statsAfterDiscovery = tracker.getGlobalStatistics();
    assertEqual(
      statsAfterDiscovery.uniqueLearnedWordsCount,
      0,
      'Discovered words must NOT be counted as learned'
    );
    assertEqual(
      statsAfterDiscovery.vocabularyCounts.discovered,
      2,
      'Two words should be in discovered state'
    );

    // Practice 'apple' once (still learning, not yet learned)
    tracker.emitEvent({
      eventType: 'VOCABULARY_PRACTICED',
      knowledgeId: 'word_apple_test',
      metadata: { word: 'apple', translation: 'olma' },
      dedupeWindowKey: 'p1',
    });
    assertEqual(
      tracker.getVocabularyRecord('word_apple_test')?.status,
      'learning',
      'Word with 1 practice and 0 correct answers should be learning'
    );
    assertEqual(tracker.getGlobalStatistics().uniqueLearnedWordsCount, 0, 'Still 0 learned words');

    // Answer 'apple' correctly twice -> transitions to learned
    tracker.emitEvent({
      eventType: 'VOCABULARY_ANSWER_CORRECT',
      knowledgeId: 'word_apple_test',
      metadata: { word: 'apple', translation: 'olma' },
      dedupeWindowKey: 'c1',
    });
    tracker.emitEvent({
      eventType: 'VOCABULARY_ANSWER_CORRECT',
      knowledgeId: 'word_apple_test',
      metadata: { word: 'apple', translation: 'olma' },
      dedupeWindowKey: 'c2',
    });

    assertEqual(
      tracker.getVocabularyRecord('word_apple_test')?.status,
      'learned',
      'Word with 2 correct answers should transition to learned'
    );
    assertEqual(
      tracker.getGlobalStatistics().uniqueLearnedWordsCount,
      1,
      'Main card counter should now be 1'
    );
  });

  // ============================================================================
  // TEST 2: Duplicate word prevention across lessons
  // ============================================================================
  runTest('2. Duplicate word prevention across multiple lessons and courses', () => {
    const { tracker } = createIsolatedTracker();

    // Learn "teacher" in Course A, Lesson 1
    tracker.emitEvent({
      eventType: 'VOCABULARY_ANSWER_CORRECT',
      knowledgeId: 'voc_teacher',
      source: { courseId: 'course_a', levelId: 'A1', lessonId: 'lesson_1' },
      metadata: { word: 'teacher', translation: 'o‘qituvchi', passedAssessment: true },
      dedupeWindowKey: 'ca_l1',
    });

    assertEqual(tracker.getGlobalStatistics().uniqueLearnedWordsCount, 1, '1 unique word learned');

    // Same word "teacher" appears in Course B, Lesson 5 under another source ID
    tracker.emitEvent({
      eventType: 'VOCABULARY_ANSWER_CORRECT',
      knowledgeId: 'sub01_w1', // alias for 'teacher' in subtopic 01
      source: { courseId: 'course_b', levelId: 'A2', lessonId: 'lesson_5' },
      metadata: { word: 'teacher', translation: 'o‘qituvchi', passedAssessment: true },
      dedupeWindowKey: 'cb_l5',
    });

    assertEqual(
      tracker.getGlobalStatistics().uniqueLearnedWordsCount,
      1,
      'Same word across different lessons and aliases must still count once globally'
    );

    const record = tracker.getVocabularyRecord('voc_teacher');
    assert(Boolean(record), 'Canonical record for teacher should exist');
    assert(
      record!.courseIds.includes('course_a') && record!.courseIds.includes('course_b'),
      'Canonical record should track both courseIds'
    );
  });

  // ============================================================================
  // TEST 3: Stable vocabulary identity (homographs & inflected forms go/goes/went/gone)
  // ============================================================================
  runTest('3. Stable vocabulary identity (distinct senses & inflected word forms)', () => {
    const { tracker } = createIsolatedTracker();

    // Inflected forms of 'go' map to canonical lemma unless registered as separate entries
    const goBp = globalKnowledgeCatalog.resolveVocabularyBlueprint('go', {
      word: 'go',
      translation: 'bormoq',
    });
    const goesBp = globalKnowledgeCatalog.resolveVocabularyBlueprint('goes', {
      word: 'goes',
    });
    const wentBp = globalKnowledgeCatalog.resolveVocabularyBlueprint('went', {
      word: 'went',
    });
    const goneBp = globalKnowledgeCatalog.resolveVocabularyBlueprint('gone', {
      word: 'gone',
    });

    assertEqual(goBp.id, goesBp.id, 'goes resolves to go lemma entry');
    assertEqual(goBp.id, wentBp.id, 'went resolves to go lemma entry');
    assertEqual(goBp.id, goneBp.id, 'gone resolves to go lemma entry');

    // Homographs with different distinctSenseKey should NOT be merged blindly
    const idBankFinance = buildStableVocabularyId({
      word: 'bank',
      language: 'en',
      senseKey: 'moliya_bank',
    });
    const idBankRiver = buildStableVocabularyId({
      word: 'bank',
      language: 'en',
      senseKey: 'daryo_qirgogi',
    });
    assert(
      idBankFinance !== idBankRiver,
      'Two dictionary entries with different meanings must have distinct stable IDs'
    );

    tracker.emitEvent({
      eventType: 'VOCABULARY_ANSWER_CORRECT',
      knowledgeId: idBankFinance,
      metadata: {
        word: 'bank',
        translation: 'bank (moliya muassasasi)',
        distinctSenseKey: 'moliya_bank',
        passedAssessment: true,
      },
      dedupeWindowKey: 'bank_1',
    });
    tracker.emitEvent({
      eventType: 'VOCABULARY_ANSWER_CORRECT',
      knowledgeId: idBankRiver,
      metadata: {
        word: 'bank',
        translation: 'daryo qirg‘og‘i',
        distinctSenseKey: 'daryo_qirgogi',
        passedAssessment: true,
      },
      dedupeWindowKey: 'bank_2',
    });

    assertEqual(
      tracker.getGlobalStatistics().uniqueLearnedWordsCount,
      2,
      'Two distinct dictionary meanings of homograph must count as 2 separate entries'
    );
  });

  // ============================================================================
  // TEST 4: Grammar rule deduplication & ruleKey stability
  // ============================================================================
  runTest('4. Grammar rule deduplication across levels and reviews', () => {
    const { tracker } = createIsolatedTracker();

    // Merely opening/introducing a rule does NOT count as learned
    tracker.emitEvent({
      eventType: 'GRAMMAR_RULE_INTRODUCED',
      knowledgeId: 'noun.definition',
      source: { courseId: 'nouns', levelId: 'A0-A1', subtopicId: 'noun_01_what_is_a_noun' },
    });
    assertEqual(
      tracker.getGlobalStatistics().masteredGrammarRulesCount,
      0,
      'Merely introduced grammar rule must NOT count as learned'
    );

    // Learn rule in Level A1
    tracker.emitEvent({
      eventType: 'GRAMMAR_RULE_LEARNED',
      knowledgeId: 'noun.definition',
      source: { courseId: 'nouns', levelId: 'A0-A1', subtopicId: 'noun_01_what_is_a_noun' },
      dedupeWindowKey: 'learn_lvl1',
    });
    assertEqual(
      tracker.getGlobalStatistics().masteredGrammarRulesCount,
      1,
      'Rule should be counted once when learned'
    );

    // Repeat same rule via alias 'kw_noun_concept' in Level A2 review
    tracker.emitEvent({
      eventType: 'GRAMMAR_RULE_LEARNED',
      knowledgeId: 'kw_noun_concept',
      source: { courseId: 'nouns', levelId: 'A2', subtopicId: 'noun_02_common_and_proper_nouns' },
      dedupeWindowKey: 'learn_lvl2_review',
    });
    assertEqual(
      tracker.getGlobalStatistics().masteredGrammarRulesCount,
      1,
      'Repeated grammar rule in another level must still count once'
    );

    // Genuinely different rule with similar title gets its own ID
    tracker.emitEvent({
      eventType: 'GRAMMAR_RULE_LEARNED',
      knowledgeId: 'noun.singular_plural',
      source: { courseId: 'nouns', levelId: 'A0-A1', subtopicId: 'noun_05_singular_and_plural_nouns' },
      dedupeWindowKey: 'learn_plurals',
    });
    assertEqual(
      tracker.getGlobalStatistics().masteredGrammarRulesCount,
      2,
      'Genuinely different grammar rule increments counter to 2'
    );
  });

  // ============================================================================
  // TEST 5: Idempotent event processing (Duplicate event ID protection)
  // ============================================================================
  runTest('5. Duplicate event processing is idempotent', () => {
    const { tracker } = createIsolatedTracker();

    const first = tracker.emitEvent({
      eventId: 'evt_fixed_12345',
      eventType: 'VOCABULARY_ANSWER_CORRECT',
      knowledgeId: 'voc_hello',
    });
    const second = tracker.emitEvent({
      eventId: 'evt_fixed_12345',
      eventType: 'VOCABULARY_ANSWER_CORRECT',
      knowledgeId: 'voc_hello',
    });

    assertEqual(first.processed, true, 'First event should be processed');
    assertEqual(first.duplicate, false, 'First event is not duplicate');
    assertEqual(second.processed, false, 'Second event with same eventId must be skipped');
    assertEqual(second.duplicate, true, 'Second event must be flagged as duplicate');

    const record = tracker.getVocabularyRecord('voc_hello');
    assertEqual(
      record?.correctCount,
      1,
      'Duplicate event must not increment correctCount a second time'
    );
  });

  // ============================================================================
  // TEST 6 & 7: Learning status transitions & Mastery criteria (including FSRS)
  // ============================================================================
  runTest('6 & 7. Status transitions (discovered -> learning -> learned -> mastered) & FSRS', () => {
    const { tracker } = createIsolatedTracker();

    // 1. Discovered
    tracker.emitEvent({
      eventType: 'VOCABULARY_DISCOVERED',
      knowledgeId: 'voc_student',
      dedupeWindowKey: 'step1',
    });
    assertEqual(tracker.getVocabularyRecord('voc_student')?.status, 'discovered', 'Step 1: discovered');

    // 2. Learning
    tracker.emitEvent({
      eventType: 'VOCABULARY_PRACTICED',
      knowledgeId: 'voc_student',
      dedupeWindowKey: 'step2',
    });
    assertEqual(tracker.getVocabularyRecord('voc_student')?.status, 'learning', 'Step 2: learning');

    // 3. Learned (2 correct answers)
    tracker.emitEvent({
      eventType: 'VOCABULARY_ANSWER_CORRECT',
      knowledgeId: 'voc_student',
      dedupeWindowKey: 'step3a',
    });
    tracker.emitEvent({
      eventType: 'VOCABULARY_ANSWER_CORRECT',
      knowledgeId: 'voc_student',
      dedupeWindowKey: 'step3b',
    });
    assertEqual(tracker.getVocabularyRecord('voc_student')?.status, 'learned', 'Step 3: learned');

    // 4. Mastered via FSRS spaced repetition review with high stability & reps
    tracker.emitEvent({
      eventType: 'VOCABULARY_REVIEW_COMPLETED',
      knowledgeId: 'voc_student',
      metadata: {
        fsrsRating: 4,
        fsrsReps: 3,
        fsrsStabilityDays: 7,
      },
      dedupeWindowKey: 'step4_fsrs',
    });
    assertEqual(
      tracker.getVocabularyRecord('voc_student')?.status,
      'mastered',
      'Step 4: mastered after FSRS review'
    );
  });

  // ============================================================================
  // TEST 8 & 14: Persistence after app restart & Offline operation
  // ============================================================================
  runTest('8 & 14. Offline local persistence and survival across app restart', () => {
    const { tracker } = createIsolatedTracker();

    tracker.emitEvent({
      eventType: 'VOCABULARY_ANSWER_CORRECT',
      knowledgeId: 'voc_water',
      metadata: { passedAssessment: true },
      dedupeWindowKey: 'persist_w1',
    });
    tracker.emitEvent({
      eventType: 'GRAMMAR_RULE_LEARNED',
      knowledgeId: 'noun.countable_uncountable',
      dedupeWindowKey: 'persist_r1',
    });

    assertEqual(tracker.getGlobalStatistics().uniqueLearnedWordsCount, 1, 'Before restart: 1 word');
    assertEqual(tracker.getGlobalStatistics().masteredGrammarRulesCount, 1, 'Before restart: 1 rule');

    // Simulate app restart
    tracker.simulateAppRestart();

    assertEqual(
      tracker.getGlobalStatistics().uniqueLearnedWordsCount,
      1,
      'After restart: 1 learned word preserved'
    );
    assertEqual(
      tracker.getGlobalStatistics().masteredGrammarRulesCount,
      1,
      'After restart: 1 learned grammar rule preserved'
    );
  });

  // ============================================================================
  // TEST 9, 10, 11, 12, 13 & REQUIRED 16-STEP END-TO-END SCENARIO
  // ============================================================================
  runTest('9-13 & 16-Step Required End-to-End Global Knowledge Scenario', () => {
    const { tracker } = createIsolatedTracker();

    let subscriberNotificationCount = 0;
    const unsubscribe = tracker.subscribe(() => {
      subscriberNotificationCount += 1;
    });

    // 1. User starts with 0 learned words and 0 learned grammar rules.
    assertEqual(
      tracker.getGlobalStatistics().uniqueLearnedWordsCount,
      0,
      'Step 1: Initial learned words count must be 0'
    );
    assertEqual(
      tracker.getGlobalStatistics().masteredGrammarRulesCount,
      0,
      'Step 1: Initial learned grammar rules count must be 0'
    );

    // 2. User completes a lesson in Course A, Level 1, learning 5 words and 2 grammar rules.
    const courseAWords = [
      { id: 'w_ca_1', word: 'one', translation: 'bir' },
      { id: 'w_ca_2', word: 'two', translation: 'ikki' },
      { id: 'w_ca_3', word: 'three', translation: 'uch' },
      { id: 'w_ca_4', word: 'four', translation: 'to‘rt' },
      { id: 'w_ca_5', word: 'five', translation: 'besh' },
    ];
    for (const w of courseAWords) {
      tracker.emitEvent({
        eventType: 'VOCABULARY_ANSWER_CORRECT',
        knowledgeId: w.id,
        source: {
          courseId: 'course_a',
          levelId: 'A1',
          topicId: 'topic_numbers_a1',
          lessonId: 'lesson_a1_numbers',
        },
        metadata: {
          word: w.word,
          translation: w.translation,
          partOfSpeech: 'Son (Numeral)',
          passedAssessment: true,
        },
        dedupeWindowKey: `ca_learn_${w.id}`,
      });
    }

    const courseARules = [
      {
        id: 'rule_ca_1',
        ruleKey: 'noun.definition',
        titleEn: 'What is a Noun?',
        titleUz: 'Ot nima?',
        description: 'Shaxs va narsa nomini bildiruvchi so‘z turkumi.',
      },
      {
        id: 'rule_ca_2',
        ruleKey: 'noun.singular_plural',
        titleEn: 'Singular and Plural Nouns',
        titleUz: 'Birlik va ko‘plik otlar',
        description: '-s va -es qo‘shimchalari yordamida ko‘plik yasash.',
      },
    ];
    for (const r of courseARules) {
      tracker.emitEvent({
        eventType: 'GRAMMAR_RULE_LEARNED',
        knowledgeId: r.id,
        source: {
          courseId: 'course_a',
          levelId: 'A1',
          topicId: 'topic_nouns_a1',
          lessonId: 'lesson_a1_nouns',
        },
        metadata: {
          ruleKey: r.ruleKey,
          titleEn: r.titleEn,
          titleUz: r.titleUz,
          description: r.description,
        },
        dedupeWindowKey: `ca_rule_${r.id}`,
      });
    }

    // 3. Card 1 shows 5 ta so‘z.
    const statsAfterCourseA = tracker.getGlobalStatistics();
    assertEqual(
      `${statsAfterCourseA.uniqueLearnedWordsCount} ta so‘z`,
      '5 ta so‘z',
      'Step 3: Card 1 must show "5 ta so‘z"'
    );

    // 4. Card 2 shows 2 ta qoida.
    assertEqual(
      `${statsAfterCourseA.masteredGrammarRulesCount} ta qoida`,
      '2 ta qoida',
      'Step 4: Card 2 must show "2 ta qoida"'
    );

    // 5. User completes another lesson in Course B, Level 2, learning 4 new words,
    //    2 repeated words from Course A, and 1 new grammar rule.
    const courseBNewWords = [
      { id: 'w_cb_1', word: 'bread', translation: 'non' },
      { id: 'w_cb_2', word: 'milk', translation: 'sut' },
      { id: 'w_cb_3', word: 'cheese', translation: 'pishloq' },
      { id: 'w_cb_4', word: 'butter', translation: 'sariyog‘' },
    ];
    const courseBRepeatedWords = [
      { id: 'w_ca_1_repeated_alias', word: 'one', translation: 'bir' },
      { id: 'w_ca_2_repeated_alias', word: 'two', translation: 'ikki' },
    ];

    for (const w of [...courseBNewWords, ...courseBRepeatedWords]) {
      tracker.emitEvent({
        eventType: 'VOCABULARY_ANSWER_CORRECT',
        knowledgeId: w.id,
        source: {
          courseId: 'course_b',
          levelId: 'A2',
          topicId: 'topic_food_a2',
          lessonId: 'lesson_a2_food',
        },
        metadata: {
          word: w.word,
          translation: w.translation,
          partOfSpeech: 'Ot (Noun)',
          passedAssessment: true,
        },
        dedupeWindowKey: `cb_learn_${w.id}`,
      });
    }

    // Also repeat 1 grammar rule from Course A + learn 1 new grammar rule in Course B
    tracker.emitEvent({
      eventType: 'GRAMMAR_RULE_LEARNED',
      knowledgeId: 'noun.definition', // repeated from Course A
      source: {
        courseId: 'course_b',
        levelId: 'A2',
        topicId: 'topic_food_a2',
        lessonId: 'lesson_a2_food',
      },
      dedupeWindowKey: 'cb_rule_repeat',
    });

    tracker.emitEvent({
      eventType: 'GRAMMAR_RULE_LEARNED',
      knowledgeId: 'noun.countable_uncountable', // 1 new grammar rule
      source: {
        courseId: 'course_b',
        levelId: 'A2',
        topicId: 'topic_food_a2',
        lessonId: 'lesson_a2_food',
      },
      metadata: {
        ruleKey: 'noun.countable_uncountable',
        titleEn: 'Countable and Uncountable Nouns',
        titleUz: 'Sanaladigan va sanalmaydigan otlar',
        description: 'Sanaladigan va sanalmaydigan otlarning farqi.',
      },
      dedupeWindowKey: 'cb_rule_new',
    });

    // 6. Card 1 updates to 9 ta so‘z (not 11).
    const statsAfterCourseB = tracker.getGlobalStatistics();
    assertEqual(
      `${statsAfterCourseB.uniqueLearnedWordsCount} ta so‘z`,
      '9 ta so‘z',
      'Step 6: Card 1 must update to "9 ta so‘z" (not 11)'
    );

    // 7. Card 2 updates to 3 ta qoida.
    assertEqual(
      `${statsAfterCourseB.masteredGrammarRulesCount} ta qoida`,
      '3 ta qoida',
      'Step 7: Card 2 must update to "3 ta qoida"'
    );

    // 8 & 9. User opens "Ochilgan so‘zlarni ko‘rish": All 9 unique learned words are displayed with their translations, status, and lesson sources.
    const learnedWordsLibrary = tracker.getVocabularyLibrary({ status: 'learned_or_mastered' });
    assertEqual(
      learnedWordsLibrary.length,
      9,
      'Step 9: Vocabulary library must contain all 9 unique learned words'
    );
    for (const item of learnedWordsLibrary) {
      assert(item.translation.length > 0, `Word ${item.displayWord} must have translation`);
      assert(
        item.status === 'learned' || item.status === 'mastered',
        `Word ${item.displayWord} must have learned/mastered status`
      );
      assert(
        item.lessonIds.length > 0,
        `Word ${item.displayWord} must have lessonIds source provenance`
      );
    }

    // 10. User searches and filters words by level and topic.
    const a2FoodWords = tracker.getVocabularyLibrary({
      levelId: 'A2',
      courseOrTopicId: 'topic_food_a2',
    });
    assertEqual(
      a2FoodWords.length,
      6,
      'Step 10: A2 Food topic filter returns 6 words (4 new + 2 shared with Course A)'
    );
    const searchBread = tracker.getVocabularyLibrary({ searchQuery: 'bread' });
    assertEqual(searchBread.length, 1, 'Step 10: Searching "bread" returns 1 matching word');

    // 11 & 12. User opens "Ochilgan qoidalarni ko‘rish": All 3 unique grammar rules are displayed with explanation, examples, and lesson links.
    const learnedRulesLibrary = tracker.getGrammarLibrary({ status: 'learned_or_mastered' });
    assertEqual(
      learnedRulesLibrary.length,
      3,
      'Step 12: Grammar library must contain all 3 unique learned grammar rules'
    );
    for (const rule of learnedRulesLibrary) {
      assert(rule.description.length > 0, `Rule ${rule.ruleKey} must have explanation`);
      assert(rule.lessonIds.length > 0, `Rule ${rule.ruleKey} must have lesson links`);
    }

    // 13. User completes a Practice Center session that masters 1 additional vocabulary word and 1 grammar rule.
    tracker.emitEvent({
      eventType: 'VOCABULARY_MASTERED',
      knowledgeId: 'w_practice_center_new',
      source: {
        courseId: 'practice_center',
        levelId: 'B1',
        topicId: 'topic_practice_center',
        lessonId: 'practice_session_01',
        activityType: 'practice_center',
      },
      metadata: {
        word: 'knowledge',
        translation: 'bilim',
        partOfSpeech: 'Ot (Noun)',
      },
      dedupeWindowKey: 'pc_master_word_1',
    });

    tracker.emitEvent({
      eventType: 'GRAMMAR_RULE_MASTERED',
      knowledgeId: 'noun.possessive_case',
      source: {
        courseId: 'practice_center',
        levelId: 'B1',
        topicId: 'topic_practice_center',
        lessonId: 'practice_session_01',
        activityType: 'practice_center',
      },
      metadata: {
        ruleKey: 'noun.possessive_case',
        titleEn: 'Possessive Case',
        titleUz: 'Qaratqich kelishigi (-’s)',
        description: 'Egalik ma’nosini ifodalovchi -’s va of-phrase qoidasi.',
      },
      dedupeWindowKey: 'pc_master_rule_1',
    });

    // 14. Card 1 updates to 10 ta so‘z.
    const statsAfterPracticeCenter = tracker.getGlobalStatistics();
    assertEqual(
      `${statsAfterPracticeCenter.uniqueLearnedWordsCount} ta so‘z`,
      '10 ta so‘z',
      'Step 14: Card 1 must update to "10 ta so‘z"'
    );

    // 15. Card 2 updates to 4 ta qoida.
    assertEqual(
      `${statsAfterPracticeCenter.masteredGrammarRulesCount} ta qoida`,
      '4 ta qoida',
      'Step 15: Card 2 must update to "4 ta qoida"'
    );

    // 16. User reloads the app and all counts and library items remain intact.
    tracker.simulateAppRestart();
    const statsAfterReload = tracker.getGlobalStatistics();
    assertEqual(
      statsAfterReload.uniqueLearnedWordsCount,
      10,
      'Step 16: After app reload, uniqueLearnedWordsCount remains 10'
    );
    assertEqual(
      statsAfterReload.masteredGrammarRulesCount,
      4,
      'Step 16: After app reload, masteredGrammarRulesCount remains 4'
    );
    assertEqual(
      tracker.getVocabularyLibrary({ status: 'learned_or_mastered' }).length,
      10,
      'Step 16: All 10 vocabulary library items remain intact after reload'
    );
    assertEqual(
      tracker.getGrammarLibrary({ status: 'learned_or_mastered' }).length,
      4,
      'Step 16: All 4 grammar library items remain intact after reload'
    );

    assert(subscriberNotificationCount > 0, 'Global reactive listeners must be notified on updates');
    unsubscribe();
  });

  // Validate utility normalizers
  assertEqual(
    normalizeVocabularyTerm('  Apple! '),
    'en:apple',
    'Normalizes whitespace, case, and punctuation'
  );
  assertEqual(
    normalizeGrammarRuleKey('  Noun.Singular_Plural '),
    'noun.singular_plural',
    'Normalizes grammar ruleKey'
  );

  return { passed, total, results };
}

// Execute when run directly via tsx
const summary = runGlobalKnowledgeTrackerTests();
console.log('====================================================');
console.log(`GLOBAL KNOWLEDGE TRACKER TEST SUITE: ${summary.passed}/${summary.total} PASSED`);
summary.results.forEach((line) => console.log(`  ✓ ${line}`));
console.log('====================================================');
