import { LearningLesson } from '../../types/grammarFrameworkTypes';
import { SubtopicMicroCourse } from '../../../../content/schemas/subtopicSchemas';

/**
 * ENGLISH FUNDAMENTALS — LESSON 1: KIRISH
 * 
 * Target learner: Absolute Beginner (A0) with zero prior knowledge.
 * Language: Pure simple Uzbek.
 * Pedagogical purpose: Friendly, calm introduction to language, English, letters, sounds, words, sentences, and grammar.
 * Strict restrictions: No exercises, no tests, no quizzes, no multiple-choice questions.
 */

export const KIRISH_EXPLANATION_PARAGRAPH_1 =
  'Til — insonlarning bir-biri bilan muloqot qilish, fikr almashish va bir-birini tushunish vositasidir. Ingliz tili ham dunyodagi tillardan biri bo‘lib, undagi gaplar so‘zlardan, so‘zlar esa harflardan tashkil topadi. Harflar yozuvda ko‘rinadi, tovushlar esa talaffuzda eshitiladi. Bularning barchasini TalkMe dasturi orqali birgalikda bosqichma-bosqich o‘rganamiz.';

export const KIRISH_EXPLANATION_PARAGRAPH_2 =
  'Ingliz tilida chiroyli, tushunarli va to‘g‘ri gapirish uchun grammatikani ham bilish kerak. Grammatika — so‘zlarning gap ichida qanday tartibda va qayerda ishlatilishini o‘rgatuvchi qoidalar to‘plamidir. U bizga so‘zlarni to‘g‘ri birlashtirib, mazmunli gaplar tuzishga yordam beradi.';

export const EF_01_KIRISH_SUBTOPIC: SubtopicMicroCourse = {
  schemaVersion: '2.0.0',
  id: 'ef_01_kirish',
  majorTopicId: 'english_fundamentals',
  majorTopicTitleUz: 'English Fundamentals',
  orderIndex: 1,
  title: {
    en: 'Kirish',
    uz: 'Kirish',
  },
  level: 'A0',
  difficultyLabelUz: 'Boshlang‘ich daraja (A0)',
  estimatedMinutes: 3,
  iconEmoji: '📖',
  shortIntroUz:
    'Ingliz tili, til birliklari va grammatika nima ekanligi haqida sodda va tushunarli kirish darsi.',
  whyUsefulUz:
    'Ingliz tilini o‘rganishdan oldin til qanday tuzilgani va grammatika nega kerakligini tushunib olish keyingi barcha darslarni osonlashtiradi.',
  learningObjectivesUz: [
    'Til insonlar muloqot vositasi ekanligini anglash',
    'Ingliz tilida gaplar so‘zlardan, so‘zlar esa harflardan tashkil topishini bilish',
    'Grammatika — so‘zlarni to‘g‘ri birlashtirib gap tuzish qoidalari ekanligini tushunish',
  ],
  knowledgeIds: ['rule_ef_01_kirish'],
  practicePathId: 'practice_ef_01_kirish',
  nextSubtopicId: 'noun_01_what_is_a_noun',
  sections: [
    {
      id: 'sec_ef_01_kirish',
      stageNumber: 1,
      type: 'introduction',
      titleUz: 'Kirish',
      titleEn: 'Kirish',
      blocks: [
        {
          type: 'RuleExplanation',
          id: 'block_ef_01_kirish_text',
          ruleId: 'rule_ef_01_kirish',
          ruleTitleUz: 'Kirish',
          ruleTitleEn: 'Introduction',
          simpleExplanationUz: `${KIRISH_EXPLANATION_PARAGRAPH_1}\n\n${KIRISH_EXPLANATION_PARAGRAPH_2}`,
          questionsAnsweredUz: [
            'Til nima?',
            'Ingliz tilida gaplar nimadan tashkil topadi?',
            'Grammatika nega kerak?',
          ],
          whenToUseUz: 'Ingliz tilini noldan o‘rganishni boshlaganda asosiy tushuncha sifatida.',
          examples: [],
        },
      ],
    },
  ],
};

export const LESSON_01_ENGLISH_FUNDAMENTALS_KIRISH: LearningLesson = {
  id: 'lesson_01_kirish',
  courseId: 'english_fundamentals',
  moduleId: 'mod_1_grammar_fundamentals',
  purpose: 'general_english',
  version: 1,
  status: 'published',
  level: 'A0',
  difficulty: 'beginner',
  estimatedDuration: 3,

  title: {
    en: 'Kirish',
    uz: 'Kirish',
  },
  subtitle: {
    en: 'Introduction',
    uz: 'Ingliz tili asoslariga kirish',
  },
  description: {
    en: 'Introduction to English Fundamentals',
    uz: 'Ingliz tili, so‘zlar, tovushlar va grammatika haqida sodda kirish darsi.',
  },

  objectives: [
    {
      id: 'obj_ef_01_intro',
      description: {
        uz: 'Til, so‘zlar va grammatika nima ekanligini tushunish',
      },
      grammarRuleId: 'rule_ef_01_kirish',
    },
  ],

  grammarRules: [
    {
      id: 'rule_ef_01_kirish',
      nameEn: 'Introduction',
      nameUz: 'Kirish — Til va Grammatika tushunchasi',
      shortSummaryUz:
        'Til muloqot vositasidir. Grammatika — so‘zlarning gap ichida qanday tartibda va qayerda ishlatilishini o‘rgatuvchi qoidalar to‘plamidir.',
      whyRuleExistsUz:
        'Odamlar o‘zaro fikr almashishi va gaplarni tartibli, tushunarli tuzishi uchun grammatika qoidalari xizmat qiladi.',
      formula: 'Harflar → So‘zlar → Gaplar (Grammatika)',
      commonQuestionsAnsweredUz:
        'Til nima? Grammatika nega kerak? Gaplar qanday tuziladi?',
      functionInSentenceUz:
        'So‘zlarni to‘g‘ri ketma-ketlikda birlashtirib, tushunarli mazmun hosil qiladi.',
      relatedExampleIds: [],
      relatedLessonIds: ['lesson_01_kirish', 'ef_01_kirish'],
      difficulty: 'beginner',
    },
  ],

  theorySubtopics: [
    {
      id: 'sub_ef_01_kirish',
      sectionNumber: 1,
      titleEn: 'Introduction',
      titleUz: 'Kirish',
      analogyOrIntroUz:
        'Ingliz tilini o‘rganish — bu dunyo bilan muloqot eshigini ochish demakdir.',
      paragraphsUz: [
        KIRISH_EXPLANATION_PARAGRAPH_1,
        KIRISH_EXPLANATION_PARAGRAPH_2,
      ],
    },
  ],

  vocabulary: [],
  exercises: [],
  examples: [],
  assessment: {
    id: 'assess_ef_01_kirish',
    title: { uz: 'Kirish baholash', en: 'Introduction Assessment' },
    passingPercentage: 70,
    xpReward: 15,
    questions: [],
  },
  wrapUp: {
    title: { uz: 'Dars yakuni', en: 'Lesson Wrap-up' },
    summaryNoteUz: 'Siz til va grammatika haqida ilk tushunchaga ega bo‘ldingiz!',
    nextLessonId: 'noun_01_what_is_a_noun',
    nextLessonTitleEn: 'What is a Noun?',
    nextLessonTitleUz: 'Ot nima?',
    whyNextLessonLogicalUz: 'Endi so‘z turkumlarining asosi bo‘lgan ot bilan tanishamiz.',
  },
  sections: [
    {
      id: 'sec_01_kirish',
      order: 1,
      stage: 'introduction',
      title: { uz: 'Kirish', en: 'Introduction' },
      subtitle: { uz: 'Til va grammatika haqida tushuncha' },
    },
  ],
};
