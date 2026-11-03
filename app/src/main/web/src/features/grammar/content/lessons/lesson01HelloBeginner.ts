import { LearningLesson } from '../../types/grammarFrameworkTypes';

/**
 * LESSON 1 — "Hello!" (Level: A0 — Absolute Beginner)
 *
 * Target learner: Zero prior English knowledge.
 * Core pedagogical principle: Every screen makes the learner feel:
 * "This is very easy! I can do this!"
 *
 * Strictly implements the 7 required sections in exact order:
 * 1. Welcome to TalkMe ("Hello! Welcome to TalkMe!")
 * 2. Let's say Hello! ("Hello!" / "Hi!" everyday greeting situation)
 * 3. Meet TalkMe! (4 learning benefits, calm encouragement)
 * 4. What is Grammar? (LEGO analogy + single example "I am happy." — "Men xursandman.", NO grammatical terms)
 * 5. Your First 6 Words (Hello, Hi, Thank you, I am, Welcome, Goodbye + personalized "I am Azamat.")
 * 6. Let's Practice! (5 interactive exercises: Translation, Situation, Vocabulary recognition, Listening, Speaking)
 * 7. Wrap-up ("You did it!" + 4 learned skills + progress summary + celebratory message)
 */
export const LESSON_01_HELLO_A0: LearningLesson = {
  id: 'lesson_01_hello_a0',
  courseId: 'grammar_fundamentals',
  moduleId: 'mod_1_grammar_fundamentals',
  purpose: 'general_english',
  version: 1,
  status: 'published',
  level: 'A0',
  difficulty: 'beginner',
  estimatedDuration: 10,

  title: {
    en: 'Lesson 1 — Hello!',
    uz: 'Lesson 1 — Hello! (Salom!)',
  },
  subtitle: {
    en: 'Level: A0 — Absolute Beginner',
    uz: 'Daraja: A0 — Mutlaqo noldan boshlovchilar uchun',
  },
  description: {
    en: 'Hello! Welcome to TalkMe! Start learning English from scratch in the easiest, friendliest way.',
    uz: 'Biz bilan ingliz tilini o‘rganishni boshlang. Xavotir olmang, ingliz tilini bilishingiz shart emas. Biz hammasini boshidan, juda oson qilib o‘rgatamiz.',
  },

  objectives: [
    {
      id: 'obj_hello_01_greet',
      description: {
        uz: 'Salomlashish (Hello! va Hi!)',
      },
      grammarRuleId: 'rule_hello_01_lego_sentence',
    },
    {
      id: 'obj_hello_02_thank',
      description: {
        uz: 'Rahmat aytish (Thank you)',
      },
    },
    {
      id: 'obj_hello_03_introduce',
      description: {
        uz: 'O‘zini tanishtirish (I am ...)',
      },
      grammarRuleId: 'rule_hello_01_lego_sentence',
    },
    {
      id: 'obj_hello_04_goodbye',
      description: {
        uz: 'Xayrlashish (Goodbye!)',
      },
    },
  ],

  grammarRules: [
    {
      id: 'rule_hello_01_lego_sentence',
      nameEn: 'Grammar',
      nameUz: 'Grammar — gap tuzish qoidalari',
      shortSummaryUz:
        'Grammar — bu gap tuzish qoidalari. Alohida so‘zlarni bilish yaxshi. Lekin ularni birlashtirib, gap tuzishni ham o‘rganamiz.',
      whyRuleExistsUz:
        'Xuddi LEGO bo‘laklaridan chiroyli shakl yasaganimiz kabi, ingliz tilida ham so‘zlardan gap yasaymiz.',
      formula: 'I + am + happy = I am happy.',
      commonQuestionsAnsweredUz: 'So‘zlardan qanday qilib oson gap yasaymiz?',
      functionInSentenceUz: 'Ingliz tilida so‘zlarni birlashtirib gap yasashga yordam beradi.',
      relatedExampleIds: ['ex_hello_01_iam_happy'],
      relatedLessonIds: ['lesson_01_hello_a0'],
      difficulty: 'beginner',
    },
  ],

  theorySubtopics: [
    {
      id: 'sub_hello_01_grammar_lego',
      sectionNumber: 4,
      titleEn: 'What is Grammar?',
      titleUz: 'Grammar nima?',
      analogyOrIntroUz:
        'Grammar — bu gap tuzish qoidalari. Alohida so‘zlarni bilish yaxshi. Lekin ularni birlashtirib, gap tuzishni ham o‘rganamiz.',
      paragraphsUz: [
        'LEGO o‘yinchoqlarini eslang: kichik bo‘laklarni bir-biriga ulab, chiroyli uy yasaymiz.',
        'Ingliz tilida ham so‘zlardan gap yasaymiz.',
        'Don\'t worry! Qoidalarni keyingi darslarda birma-bir o‘rganamiz.',
      ],
    },
  ],

  examples: [
    {
      id: 'ex_hello_01_iam_happy',
      grammarRuleId: 'rule_hello_01_lego_sentence',
      englishSentence: 'I am happy.',
      uzbekTranslation: 'Men xursandman.',
      highlightedSegment: 'I am happy.',
      explanationUz: 'Ingliz tilida ham so‘zlardan gap yasaymiz.',
    },
  ],

  // SECTION 5 — Your First 6 Words (EXACTLY 6 VOCABULARY ITEMS)
  vocabulary: [
    {
      id: 'voc_hello_01_hello',
      wordEn: 'Hello',
      translationUz: 'Salom',
      ipa: '/həˈloʊ/',
      visualEmoji: '👋',
      partOfSpeech: 'Interjection',
      exampleEn: 'Hello!',
      exampleUz: 'Salom!',
      difficulty: 'beginner',
      audioText: 'Hello!',
      courseSource: 'general_english',
      isTargetVocabulary: true,
    },
    {
      id: 'voc_hello_02_hi',
      wordEn: 'Hi',
      translationUz: 'Salom',
      ipa: '/haɪ/',
      visualEmoji: '😊',
      partOfSpeech: 'Interjection',
      exampleEn: 'Hi!',
      exampleUz: 'Salom!',
      difficulty: 'beginner',
      audioText: 'Hi!',
      courseSource: 'general_english',
      isTargetVocabulary: true,
    },
    {
      id: 'voc_hello_03_thank_you',
      wordEn: 'Thank you',
      translationUz: 'Rahmat',
      ipa: '/ˈθæŋk juː/',
      visualEmoji: '❤️',
      partOfSpeech: 'Interjection',
      exampleEn: 'Thank you!',
      exampleUz: 'Rahmat!',
      difficulty: 'beginner',
      audioText: 'Thank you!',
      courseSource: 'general_english',
      isTargetVocabulary: true,
    },
    {
      id: 'voc_hello_04_i_am',
      wordEn: 'I am',
      translationUz: 'Men ...man',
      ipa: '/aɪ æm/',
      visualEmoji: '🙋',
      personalizableTemplate: {
        templateEn: 'I am {name}.',
        templateUz: 'Men {name}man.',
        defaultName: 'Azamat',
      },
      partOfSpeech: 'Pronoun',
      exampleEn: 'I am Azamat.',
      exampleUz: 'Men Azamatman.',
      difficulty: 'beginner',
      audioText: 'I am Azamat.',
      courseSource: 'general_english',
      isTargetVocabulary: true,
    },
    {
      id: 'voc_hello_05_welcome',
      wordEn: 'Welcome',
      translationUz: 'Xush kelibsiz',
      ipa: '/ˈwelkəm/',
      visualEmoji: '🎉',
      partOfSpeech: 'Interjection',
      exampleEn: 'Welcome to TalkMe!',
      exampleUz: 'TalkMe ga xush kelibsiz!',
      difficulty: 'beginner',
      audioText: 'Welcome',
      courseSource: 'general_english',
      isTargetVocabulary: true,
    },
    {
      id: 'voc_hello_06_goodbye',
      wordEn: 'Goodbye',
      translationUz: 'Xayr',
      ipa: '/ˌɡʊdˈbaɪ/',
      visualEmoji: '👋',
      partOfSpeech: 'Interjection',
      exampleEn: 'Goodbye!',
      exampleUz: 'Xayr!',
      difficulty: 'beginner',
      audioText: 'Goodbye!',
      courseSource: 'general_english',
      isTargetVocabulary: true,
    },
  ],

  // SECTION 6 — Let's Practice! (EXACTLY 5 INTERACTIVE EXERCISES)
  exercises: [
    // Exercise 1 — Translation
    {
      id: 'ex_hello_01_translation',
      version: 1,
      type: 'multiple_choice',
      progressionStage: 'recognition',
      titleUz: '1-Mashq: Tarjimani toping (Translation)',
      instructionsUz: 'Savolni o‘qing va to‘g‘ri javobni tanlang:',
      promptEn: 'What does Hello mean?',
      promptUz: '"Hello" so‘zi nimani anglatadi?',
      audioText: 'Hello',
      options: ['Rahmat', 'Salom', 'Xayr'],
      acceptedAnswers: ['Salom'],
      explanationUz: 'Barakalla! "Hello" ingliz tilida "Salom" degan ma’noni bildiradi.',
      hintUz: 'Yangi odam bilan ko‘rishganda aytiladigan so‘zni eslang.',
      difficulty: 'beginner',
      xpReward: 15,
      relatedVocabularyIds: ['voc_hello_01_hello', 'voc_hello_02_hi'],
      relatedGrammarRuleIds: ['rule_hello_01_lego_sentence'],
      requiresApplication: true,
    },

    // Exercise 2 — Situation
    {
      id: 'ex_hello_02_situation',
      version: 1,
      type: 'multiple_choice',
      progressionStage: 'contextual_application',
      titleUz: '2-Mashq: Vaziyat (Situation)',
      instructionsUz: 'Qaysi vaziyatda "Thank you" deymiz?',
      promptEn: 'When do we say Thank you?',
      promptUz: 'Biz qachon "Thank you" deymiz?',
      audioText: 'Thank you',
      options: [
        'A. When we say goodbye.',
        'B. When we thank someone.',
        'C. When we greet someone.',
      ],
      acceptedAnswers: ['B. When we thank someone.', 'B'],
      explanationUz:
        'To‘g‘ri! "Thank you" — "Rahmat" degani. Kimdir bizga yaxshilik qilganda yoki minnatdorchilik bildirganimizda (When we thank someone) aytamiz.',
      hintUz: '"Thank you" — "Rahmat" ma’nosini bildiradi.',
      difficulty: 'beginner',
      xpReward: 15,
      relatedVocabularyIds: ['voc_hello_03_thank_you'],
      relatedGrammarRuleIds: ['rule_hello_01_lego_sentence'],
      requiresApplication: true,
    },

    // Exercise 3 — Vocabulary recognition
    {
      id: 'ex_hello_03_vocab_recognition',
      version: 1,
      type: 'multiple_choice',
      progressionStage: 'identification',
      titleUz: '3-Mashq: So‘zni toping (Vocabulary Recognition)',
      instructionsUz: 'Qaysi inglizcha so‘z "Xayr" ma’nosini bildiradi?',
      promptEn: 'Which word means Xayr?',
      promptUz: 'Qaysi so‘z "Xayr" degani?',
      audioText: 'Goodbye',
      options: ['Hello', 'Goodbye', 'Welcome'],
      acceptedAnswers: ['Goodbye'],
      explanationUz:
        'Ajoyib! "Goodbye" — "Xayr" degani. Ketayotganimizda yoki suhbatni tugatganimizda "Goodbye!" deymiz.',
      hintUz: 'Xayrlashayotganda qo‘l silkitib aytiladigan so‘zni tanlang.',
      difficulty: 'beginner',
      xpReward: 15,
      relatedVocabularyIds: ['voc_hello_06_goodbye', 'voc_hello_05_welcome'],
      relatedGrammarRuleIds: ['rule_hello_01_lego_sentence'],
      requiresApplication: true,
    },

    // Exercise 4 — Listening
    {
      id: 'ex_hello_04_listening',
      version: 1,
      type: 'listening_choose',
      progressionStage: 'recognition',
      titleUz: '4-Mashq: Eshitib toping (Listening)',
      instructionsUz:
        'Ovoz tugmasini bosing, diqqat bilan tinglang va eshitgan so‘zingizni tanlang:',
      promptUz: 'Audioni tinglang va qaysi ibora aytilganini belgilang:',
      audioText: 'Thank you',
      options: ['Hello', 'Thank you', 'Goodbye'],
      acceptedAnswers: ['Thank you'],
      explanationUz:
        'Juda yaxshi eshitdingiz! Audioda "Thank you" (Rahmat) iborasi yangradi.',
      hintUz: 'Ovozni yana bir bor qayta eshitib ko‘ring.',
      difficulty: 'beginner',
      xpReward: 20,
      relatedVocabularyIds: ['voc_hello_03_thank_you', 'voc_hello_01_hello', 'voc_hello_06_goodbye'],
      relatedGrammarRuleIds: ['rule_hello_01_lego_sentence'],
      requiresApplication: true,
    },

    // Exercise 5 — Speaking
    {
      id: 'ex_hello_05_speaking',
      version: 1,
      type: 'pronunciation_practice',
      progressionStage: 'independent_production',
      titleUz: '5-Mashq: Gapirib ko‘ring (Speaking)',
      instructionsUz: 'Endi o‘zingiz aytib ko‘ring!',
      promptEn: 'Hello! · I am [your name]. · Goodbye!',
      promptUz:
        'Har bir iborani avval eshiting, so‘ng mikrofon orqali yoki ovoz chiqarib takrorlang:',
      audioText: 'Hello! I am Azamat. Goodbye!',
      speakingPrompts: [
        {
          id: 'spk_hello_1',
          phraseEn: 'Hello!',
          meaningUz: 'Salom!',
          audioText: 'Hello!',
        },
        {
          id: 'spk_hello_2',
          phraseEn: 'I am Azamat.',
          meaningUz: 'Men Azamatman.',
          isPersonalizedName: true,
          audioText: 'I am Azamat.',
        },
        {
          id: 'spk_hello_3',
          phraseEn: 'Goodbye!',
          meaningUz: 'Xayr!',
          audioText: 'Goodbye!',
        },
      ],
      acceptedAnswers: ['Hello! · I am Azamat. · Goodbye!', 'ALL_SPOKEN'],
      explanationUz:
        'Ofarin! Siz ingliz tilida salomlashishni, o‘zingizni tanishtirishni va xayrlashishni ovoz chiqarib aytdingiz!',
      hintUz: 'Avval "Tinglash" tugmasini bosing, keyin bemalol qaytarib ayting.',
      difficulty: 'beginner',
      xpReward: 25,
      relatedVocabularyIds: ['voc_hello_01_hello', 'voc_hello_04_i_am', 'voc_hello_06_goodbye'],
      relatedGrammarRuleIds: ['rule_hello_01_lego_sentence'],
      requiresApplication: true,
    },
  ],

  assessment: {
    id: 'assess_hello_a0',
    title: {
      en: 'Lesson 1 Quick Check',
      uz: '1-Dars yakuniy tekshiruvi',
    },
    passingPercentage: 80,
    xpReward: 20,
    questions: [
      {
        id: 'q_hello_01',
        conceptAssessed: 'Greeting translation',
        grammarRuleId: 'rule_hello_01_lego_sentence',
        vocabularyId: 'voc_hello_01_hello',
        questionUz: 'What does Hello mean?',
        promptEn: 'Hello!',
        audioText: 'Hello!',
        options: ['Rahmat', 'Salom', 'Xayr'],
        correctAnswer: 'Salom',
        explanationUz: '"Hello!" — "Salom!" degani.',
      },
      {
        id: 'q_hello_02',
        conceptAssessed: 'Thanking situation',
        grammarRuleId: 'rule_hello_01_lego_sentence',
        vocabularyId: 'voc_hello_03_thank_you',
        questionUz: 'When do we say Thank you?',
        promptEn: 'Thank you',
        audioText: 'Thank you',
        options: [
          'A. When we say goodbye.',
          'B. When we thank someone.',
          'C. When we greet someone.',
        ],
        correctAnswer: 'B. When we thank someone.',
        explanationUz: '"Thank you" minnatdorchilik bildirganimizda aytiladi.',
      },
      {
        id: 'q_hello_03',
        conceptAssessed: 'Goodbye recognition',
        grammarRuleId: 'rule_hello_01_lego_sentence',
        vocabularyId: 'voc_hello_06_goodbye',
        questionUz: 'Which word means Xayr?',
        promptEn: 'Goodbye',
        audioText: 'Goodbye',
        options: ['Hello', 'Goodbye', 'Welcome'],
        correctAnswer: 'Goodbye',
        explanationUz: '"Goodbye" — "Xayr" degani.',
      },
    ],
  },

  // SECTION 7 — Wrap-up (MANDATORY: Named Wrap-up, NEVER Warm-up)
  wrapUp: {
    title: {
      en: 'Wrap-up',
      uz: 'Wrap-up',
    },
    celebrationTitleEn: 'You did it!',
    celebrationSubtitleUz: 'Ajoyib! Siz birinchi darsni tugatdingiz.',
    summaryNoteUz: 'Ajoyib! Siz birinchi darsni tugatdingiz.',
    learnedSkillsSummaryUz: [
      'Salomlashish.',
      'Rahmat aytish.',
      'O‘zini tanishtirish.',
      'Xayrlashish.',
    ],
    rememberMessageUz:
      'Remember: Ingliz tilini o‘rganish qiyin bo‘lishi shart emas. Kichik qadamlar bilan katta natijaga erishasiz!',
    nextLessonId: 'lesson_01_grammar_fundamentals',
    nextLessonTitleEn: 'Grammar Fundamentals',
    nextLessonTitleUz: 'Keyingi dars: Ingliz tili grammatikasi asoslari',
    whyNextLessonLogicalUz:
      'Endi siz ilk 6 ta inglizcha so‘zni va salomlashishni bilasiz! Keyingi darsda ingliz tilida gaplar qanday qurilishini yanada qiziqarli misollar bilan davom ettiramiz.',
  },

  // EXACTLY 7 SECTIONS IN REQUIRED ORDER
  sections: [
    // SECTION 1 — Welcome to TalkMe
    {
      id: 'sec_hello_01_welcome',
      order: 1,
      stage: 'introduction',
      title: {
        en: 'Hello! Welcome to TalkMe!',
        uz: '1. Welcome to TalkMe',
      },
      subtitle: {
        en: 'Hello! Welcome to TalkMe!',
        uz: 'Hello! Welcome to TalkMe!',
      },
      beginnerContent: {
        kind: 'welcome',
        badgeUz: 'A0 — Absolute Beginner · 1-Qadam',
        heroTitleEn: 'Hello! Welcome to TalkMe!',
        heroQuoteEn: 'Hello! Welcome to TalkMe!',
        bodyParagraphsUz: [
          'Biz bilan ingliz tilini o‘rganishni boshlang. Xavotir olmang, ingliz tilini bilishingiz shart emas. Biz hammasini boshidan, juda oson qilib o‘rgatamiz.',
          'Har kuni ozgina yangi so‘z o‘rganasiz, eshitasiz va mashq qilasiz.',
        ],
        closingCalloutEn: "Let's start!",
        closingCalloutUz: 'Keling, boshlaymiz!',
      },
    },

    // SECTION 2 — Let's say Hello!
    {
      id: 'sec_hello_02_say_hello',
      order: 2,
      stage: 'detailed_examples',
      title: {
        en: "Let's say Hello!",
        uz: "2. Let's say Hello!",
      },
      subtitle: {
        en: 'Greeting someone in English',
        uz: 'Ingliz tilida salomlashamiz',
      },
      beginnerContent: {
        kind: 'greeting_situation',
        badgeUz: 'Kundalik vaziyat · Salomlashish',
        heroTitleEn: "Let's say Hello!",
        situationPromptUz:
          'Tasavvur qiling, siz yangi odamni uchratdingiz. Unga nima deysiz?',
        bodyParagraphsUz: [
          'Ingliz tilida insonlar bilan ko‘rishganda salomlashish uchun "Hello!" yoki "Hi!" iboralari ishlatiladi. Ikkalasining ham ma’nosi bir xil — "Salom!".',
        ],
        greetingTable: [
          {
            english: 'Hello!',
            uzbek: 'Salom!',
            ipa: '/həˈloʊ/',
            audioText: 'Hello!',
          },
          {
            english: 'Hi!',
            uzbek: 'Salom!',
            ipa: '/haɪ/',
            audioText: 'Hi!',
          },
        ],
        greetingExplanationUz:
          'Ikkala so‘z ham odamlar bilan salomlashish uchun ishlatiladi. "Hello!" — har qanday vaziyatda mos keladi, "Hi!" esa do‘stona va qisqa salomlashishdir.',
        speakingCalloutEn: 'Hello! Hi!',
        speakingCalloutUz: 'Eshiting va ovoz chiqarib qaytarib ayting: "Hello!" · "Hi!"',
      },
    },

    // SECTION 3 — Meet TalkMe!
    {
      id: 'sec_hello_03_meet_talkme',
      order: 3,
      stage: 'objectives',
      title: {
        en: 'Meet TalkMe!',
        uz: '3. Meet TalkMe!',
      },
      subtitle: {
        en: 'Your friendly English-learning assistant',
        uz: 'Sizning ingliz tili o‘rganish yordamchingiz',
      },
      beginnerContent: {
        kind: 'assistant_intro',
        badgeUz: 'Sizning shaxsiy yordamchingiz',
        heroTitleEn: 'Meet TalkMe!',
        bodyParagraphsUz: [
          'TalkMe — sizning ingliz tili o‘rganish yordamchingiz.',
          'Biz sizga yangi so‘zlarni, oddiy gaplarni va inglizcha suhbatlashishni o‘rgatamiz.',
        ],
        benefitBulletsUz: [
          'So‘zlarni eshitasiz.',
          'Rasmlar orqali o‘rganasiz.',
          'Oddiy mashqlar bajarasiz.',
          'O‘rganganlaringiz bilan gap tuzasiz.',
        ],
        closingCalloutUz:
          'Siz shoshilmang. Har bir narsani o‘z vaqtida o‘rganamiz.',
      },
    },

    // SECTION 4 — What is Grammar?
    {
      id: 'sec_hello_04_what_is_grammar',
      order: 4,
      stage: 'explanation',
      title: {
        en: 'What is Grammar?',
        uz: '4. What is Grammar?',
      },
      subtitle: {
        en: 'Grammar',
        uz: 'So‘zlardan oson gap tuzish siri',
      },
      beginnerContent: {
        kind: 'grammar_lego',
        badgeUz: 'Oddiy tushuncha · LEGO usuli',
        heroTitleEn: 'Grammar',
        bodyParagraphsUz: [
          'Grammar — bu gap tuzish qoidalari.',
          'Alohida so‘zlarni bilish yaxshi. Lekin ularni birlashtirib, gap tuzishni ham o‘rganamiz.',
        ],
        legoAnalogy: {
          blocks: ['I', 'am', 'happy.'],
          fullSentenceEn: 'I am happy.',
          fullSentenceUz: 'Men xursandman.',
          explanationUz: 'Ingliz tilida ham so‘zlardan gap yasaymiz.',
        },
        closingCalloutEn: "Don't worry!",
        closingCalloutUz:
          "Don't worry! Qoidalarni keyingi darslarda birma-bir o‘rganamiz.",
      },
    },

    // SECTION 5 — Your First 6 Words
    {
      id: 'sec_hello_05_first_6_words',
      order: 5,
      stage: 'new_vocabulary',
      title: {
        en: 'Your First 6 Words',
        uz: '5. Your First 6 Words',
      },
      subtitle: {
        en: 'Hello · Hi · Thank you · I am · Welcome · Goodbye',
        uz: 'Birinchi 6 ta inglizcha so‘zingizni eshiting va takrorlang',
      },
      vocabularyIds: [
        'voc_hello_01_hello',
        'voc_hello_02_hi',
        'voc_hello_03_thank_you',
        'voc_hello_04_i_am',
        'voc_hello_05_welcome',
        'voc_hello_06_goodbye',
      ],
    },

    // SECTION 6 — Let's Practice!
    {
      id: 'sec_hello_06_lets_practice',
      order: 6,
      stage: 'interactive_activities',
      title: {
        en: "Let's Practice!",
        uz: "6. Let's Practice!",
      },
      subtitle: {
        en: '5 easy interactive exercises',
        uz: 'O‘rgangan 6 ta so‘zimizni 5 ta oson mashqda sinab ko‘ramiz',
      },
      exerciseIds: [
        'ex_hello_01_translation',
        'ex_hello_02_situation',
        'ex_hello_03_vocab_recognition',
        'ex_hello_04_listening',
        'ex_hello_05_speaking',
      ],
    },

    // SECTION 7 — Wrap-up
    {
      id: 'sec_hello_07_wrap_up',
      order: 7,
      stage: 'wrap_up',
      title: {
        en: 'Wrap-up',
        uz: '7. Wrap-up',
      },
      subtitle: {
        en: 'You did it!',
        uz: 'Ajoyib! Siz birinchi darsni tugatdingiz.',
      },
    },
  ],
};
