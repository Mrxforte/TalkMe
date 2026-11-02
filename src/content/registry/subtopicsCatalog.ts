import {
  SubtopicMicroCourse,
  SUBTOPIC_SCHEMA_VERSION,
} from '../schemas/subtopicSchemas';

export interface MajorTopicWithSubtopics {
  id: string;
  courseId: string;
  titleEn: string;
  titleUz: string;
  descriptionUz: string;
  iconEmoji: string;
  cefrLevel: string;
  subtopicIds: string[]; // Variable number of subtopics — never hardcoded
}

export const MAJOR_TOPICS_CATALOG: MajorTopicWithSubtopics[] = [
  {
    id: 'nouns',
    courseId: 'course_general_english',
    titleEn: 'Nouns (People, Places, Things & Ideas)',
    titleUz: 'Nouns — Ot so‘z turkumi (6 ta Ost-Mavzu)',
    descriptionUz:
      'Ot nima ekanligidan boshlab, atoqli va turdosh otlar, birlik-ko‘plik, sanaladigan-sanalmaydigan hamda qaratqich kelishigigacha to‘liq mikro-kurslar.',
    iconEmoji: '🏛️',
    cefrLevel: 'A0–A2',
    subtopicIds: [
      'what_is_a_noun',
      'common_and_proper_nouns',
      'singular_and_plural_nouns',
      'countable_and_uncountable_nouns',
      'concrete_and_abstract_nouns',
      'possessive_nouns',
    ],
  },
  {
    id: 'greetings_and_foundations',
    courseId: 'course_general_english',
    titleEn: 'First Steps & Sentence Building',
    titleUz: 'Ilk Qadamlar va Salomlashish (A0)',
    descriptionUz: 'Noldan boshlovchilar uchun salomlashish va ilk mustaqil gaplar.',
    iconEmoji: '👋',
    cefrLevel: 'A0',
    subtopicIds: ['hello_first_steps'],
  },
  {
    id: 'numbers_and_counting',
    courseId: 'course_general_english',
    titleEn: 'Numbers & Real-Life Counting',
    titleUz: 'Numbers — Raqamlar va Hayotiy Hisob-Kitob',
    descriptionUz: '0 dan 10 gacha va o‘nlik sonlarni eshitish, yozish hamda amalda qo‘llash.',
    iconEmoji: '🔢',
    cefrLevel: 'A0–A1',
    subtopicIds: ['numbers_0_10_subtopic'],
  },
];

// ============================================================================
// SUBTOPICS REPOSITORY (COMPLETE 7-STAGE MICRO-COURSES)
// ============================================================================

export const SUBTOPICS_REPOSITORY: Record<string, SubtopicMicroCourse> = {
  // ==========================================================================
  // 1. REFERENCE IMPLEMENTATION: WHAT IS A NOUN? (OT NIMA?)
  //    Contains all 7 mandatory stages, 10 speakable examples with highlighted
  //    nouns, 4 guided mini-practice activities, real-life dialogue + story,
  //    6-question assessment (70% threshold), and full Wrap-up.
  // ==========================================================================
  what_is_a_noun: {
    schemaVersion: SUBTOPIC_SCHEMA_VERSION,
    id: 'what_is_a_noun',
    majorTopicId: 'nouns',
    majorTopicTitleUz: 'Nouns (Ot so‘z turkumi)',
    orderIndex: 1,
    title: {
      en: 'What is a Noun?',
      uz: 'Ot nima?',
    },
    level: 'A0',
    difficultyLabelUz: 'A0–A1 · Boshlang‘ich (Juda oson)',
    estimatedMinutes: 10,
    iconEmoji: '🏛️',
    shortIntroUz:
      'Bugun ingliz tilidagi otlarni (Nouns) o‘rganamiz. Ot — inson, joy, narsa-buyum, hayvon yoki tushunchaning nomini bildiradi. Masalan: Ali, school, book, cat, happiness.',
    whyUsefulUz:
      'Ingliz tilida har qanday gap tuzish uchun avvalo atrofimizdagi insonlar, joylar va narsalarning nomini bilishimiz kerak. Otlarni bilish — muloqotning poydevori!',
    learningObjectivesUz: [
      'Noun (Ot) nima ekanligini va u qanday savollarga (Kim? Nima? Qayer?) javob berishini tushunasiz.',
      'Inson, joy, buyum, hayvon va mavhum tushuncha otlarini gap ichida ajrata olasiz.',
      '10 dan ortiq kundalik inglizcha otlarni to‘g‘ri talaffuz qilish va gapda qo‘llashni o‘rganasiz.',
    ],
    knowledgeIds: ['kw_noun_concept', 'kw_noun_book', 'kw_noun_city'],
    practicePathId: 'practice_path_nouns',
    nextSubtopicId: 'common_and_proper_nouns',
    sections: [
      // ----------------------------------------------------------------------
      // STAGE 1: INTRODUCTION
      // ----------------------------------------------------------------------
      {
        id: 'introduction',
        stageNumber: 1,
        type: 'introduction',
        titleUz: '1-Bosqich: Kirish — Ot nima?',
        titleEn: 'Stage 1 — Introduction: What is a Noun?',
        blocks: [
          {
            type: 'AnimationBlock',
            id: 'intro_anim_nouns',
            titleUz: 'Atrofimizdagi har bir nom — bu Noun (Ot)!',
            visualSteps: [
              { emoji: '👩‍🏫', labelEn: 'teacher', labelUz: 'Kim? — O‘qituvchi (Inson)' },
              { emoji: '🏫', labelEn: 'school', labelUz: 'Qayer? — Maktab (Joy)' },
              { emoji: '📖', labelEn: 'book', labelUz: 'Nima? — Kitob (Buyum)' },
              { emoji: '🐱', labelEn: 'cat', labelUz: 'Nima? — Mushuk (Hayvon)' },
              { emoji: '💛', labelEn: 'happiness', labelUz: 'Nima? — Baxt (Tushuncha)' },
            ],
            summaryUz:
              'Ko‘rib turganingizdek, o‘zbek tilida "Kim?", "Nima?" yoki "Qayer?" savoliga javob bo‘ladigan so‘zlar ingliz tilida Noun deb ataladi.',
          },
          {
            type: 'TipBlock',
            id: 'intro_tip_1',
            titleUz: 'Nima uchun bu mavzu muhim?',
            bodyUz:
              'Tasavvur qiling, do‘konga kirdingiz yoki yangi do‘st orttirdingiz. O‘zingizni tanishtirish, narsa so‘rash yoki manzilni aytish uchun aynan otlardan (Nouns) foydalanasiz.',
            exampleEn: 'This is a book.',
            exampleUz: 'Bu kitob.',
          },
        ],
      },

      // ----------------------------------------------------------------------
      // STAGE 2: EXPLANATION AND RULES
      // ----------------------------------------------------------------------
      {
        id: 'explanation',
        stageNumber: 2,
        type: 'explanation',
        titleUz: '2-Bosqich: Qoida va Tushuntirish',
        titleEn: 'Stage 2 — Explanation and Rules',
        blocks: [
          {
            type: 'RuleExplanation',
            id: 'rule_what_is_noun',
            ruleId: 'kw_noun_concept',
            ruleTitleUz: 'Qoida 1: Ot (Noun) nima va u qanday savollarga javob beradi?',
            ruleTitleEn: 'Rule 1: Definition of a Noun',
            simpleExplanationUz:
              'Ot (Noun) — inson, joy, narsa-buyum, hayvon yoki his-tuyg‘u va tushunchaning nomini bildiruvchi so‘z turkumidir.',
            questionsAnsweredUz: [
              'Kim? (Who?) — teacher (o‘qituvchi), doctor (shifokor), girl (qiz), Ali',
              'Nima? (What?) — book (kitob), phone (telefon), cat (mushuk), music (musiqa), happiness (baxt)',
              'Qayer? (Where?) — school (maktab), city (shahar), park (bog‘), Tashkent',
            ],
            whenToUseUz:
              'Gapda kim haqida, nima haqida yoki qaysi joy haqida gapirayotganimizni bildirish uchun har doim otdan (Noun) foydalanamiz.',
            formula: '[Ega (Noun)] + [Fe’l (Verb)] + [To‘ldiruvchi (Noun)]',
            examples: [
              {
                text: 'This is a book.',
                language: 'en',
                translation: 'Bu kitob.',
                translationLanguage: 'uz',
                speakable: true,
                highlightedWords: ['book'],
                grammarNoteUz: 'book — buyum nomi (Nima?)',
              },
              {
                text: 'My teacher is kind.',
                language: 'en',
                translation: 'Mening o‘qituvchim mehribon.',
                translationLanguage: 'uz',
                speakable: true,
                highlightedWords: ['teacher'],
                grammarNoteUz: 'teacher — inson / kasb nomi (Kim?)',
              },
              {
                text: 'I love music.',
                language: 'en',
                translation: 'Men musiqani yaxshi ko‘raman.',
                translationLanguage: 'uz',
                speakable: true,
                highlightedWords: ['music'],
                grammarNoteUz: 'music — tushuncha nomi (Nima?)',
              },
              {
                text: 'The cat sleeps on the sofa.',
                language: 'en',
                translation: 'Mushuk divan ustida uxlayapti.',
                translationLanguage: 'uz',
                speakable: true,
                highlightedWords: ['cat', 'sofa'],
                grammarNoteUz: 'cat (hayvon) va sofa (buyum) — ikkalasi ham Noun',
              },
            ],
            progressiveDisclosure: {
              beginnerNoteUz:
                'Boshlang‘ich (A0–A1) eslatma: O‘zbek tilida hayvonlarga "Nima?" deb savol beramiz, ingliz tilida ham hayvonlar (cat, dog) va buyumlar (book, table) Noun hisoblanadi.',
              elementaryNoteUz:
                'A2 daraja uchun: Birlikdagi sanaladigan otlar oldidan odatda "a / an" yoki "the" artikli keladi (masalan: a book, the school).',
              intermediateExceptionsUz:
                'B1–B2 daraja uchun: Ba’zi so‘zlar gapdagi o‘rniga qarab ham ot (a call — qo‘ng‘iroq), ham fe’l (to call — qo‘ng‘iroq qilish) bo‘lishi mumkin.',
              advancedNuanceUz:
                'C1–C2 daraja uchun: Mavhum otlar (happiness, information, knowledge) odatda ko‘plikda ishlatilmaydi va "a/an" olmaydi.',
            },
          },
          {
            type: 'GrammarFormula',
            id: 'formula_noun_positions',
            titleUz: 'Gapda Ot (Noun) qayerda keladi?',
            formulaPattern: 'The [girl (Noun)] reads a [book (Noun)] in the [library (Noun)].',
            partsBreakdown: [
              {
                partLabel: 'girl (Kim?)',
                meaningUz: 'Gapning egasi (harakatni bajaruvchi inson)',
                exampleEn: 'The girl',
              },
              {
                partLabel: 'book (Nimani?)',
                meaningUz: 'To‘ldiruvchi (harakat yo‘nalgan buyum)',
                exampleEn: 'a book',
              },
              {
                partLabel: 'library (Qayerda?)',
                meaningUz: 'Joy nomi (voqea sodir bo‘lgan joy)',
                exampleEn: 'in the library',
              },
            ],
          },
        ],
      },

      // ----------------------------------------------------------------------
      // STAGE 3: GUIDED EXAMPLES (10 CONTEXTUAL EXAMPLES WITH HIGHLIGHTED NOUNS)
      // ----------------------------------------------------------------------
      {
        id: 'examples',
        stageNumber: 3,
        type: 'examples',
        titleUz: '3-Bosqich: Ko‘rgazmali Misollar va Tahlil',
        titleEn: 'Stage 3 — Guided Examples (10 Speakable Examples)',
        blocks: [
          {
            type: 'WordHighlight',
            id: 'wh_girl_book',
            instructionUz:
              'Gapdagi ajratib ko‘rsatilgan otlarga (Nouns) e’tibor bering va har bir so‘zni bosib eshiting:',
            sentenceEn: 'The girl reads a book in the school.',
            sentenceUz: 'Qiz maktabda kitob o‘qiydi.',
            highlightedItems: [
              {
                wordEn: 'girl',
                meaningUz: 'qiz',
                roleExplanationUz: 'Inson nomi (Kim? — Person)',
              },
              {
                wordEn: 'book',
                meaningUz: 'kitob',
                roleExplanationUz: 'Buyum nomi (Nima? — Thing)',
              },
              {
                wordEn: 'school',
                meaningUz: 'maktab',
                roleExplanationUz: 'Joy nomi (Qayer? — Place)',
              },
            ],
          },
          {
            type: 'VocabularyCard',
            id: 'vc_noun_core_words',
            titleUz: 'Asosiy 6 ta Ot (Bosib talaffuzini tinglang)',
            words: [
              {
                id: 'vw_book',
                knowledgeId: 'kw_noun_book',
                wordEn: 'book',
                translationUz: 'kitob',
                phonetic: '/bʊk/',
                categoryUz: 'Nima? (Buyum)',
                emoji: '📖',
                exampleSentenceEn: 'This is a good book.',
                exampleSentenceUz: 'Bu yaxshi kitob.',
              },
              {
                id: 'vw_teacher',
                knowledgeId: 'kw_noun_concept',
                wordEn: 'teacher',
                translationUz: 'o‘qituvchi',
                phonetic: '/ˈtiːtʃər/',
                categoryUz: 'Kim? (Inson)',
                emoji: '👩‍🏫',
                exampleSentenceEn: 'Our teacher speaks English.',
                exampleSentenceUz: 'Bizning o‘qituvchimiz inglizcha gapiradi.',
              },
              {
                id: 'vw_school',
                knowledgeId: 'kw_noun_concept',
                wordEn: 'school',
                translationUz: 'maktab',
                phonetic: '/skuːl/',
                categoryUz: 'Qayer? (Joy)',
                emoji: '🏫',
                exampleSentenceEn: 'The school is near my house.',
                exampleSentenceUz: 'Maktab uyimning yonida.',
              },
              {
                id: 'vw_city',
                knowledgeId: 'kw_noun_city',
                wordEn: 'city',
                translationUz: 'shahar',
                phonetic: '/ˈsɪti/',
                categoryUz: 'Qayer? (Joy)',
                emoji: '🌆',
                exampleSentenceEn: 'Tashkent is a big city.',
                exampleSentenceUz: 'Toshkent — katta shahar.',
              },
              {
                id: 'vw_cat',
                knowledgeId: 'kw_noun_concept',
                wordEn: 'cat',
                translationUz: 'mushuk',
                phonetic: '/kæt/',
                categoryUz: 'Nima? (Hayvon)',
                emoji: '🐱',
                exampleSentenceEn: 'The cat drinks milk.',
                exampleSentenceUz: 'Mushuk sut ichadi.',
              },
              {
                id: 'vw_happiness',
                knowledgeId: 'kw_noun_concept',
                wordEn: 'happiness',
                translationUz: 'baxt',
                phonetic: '/ˈhæpinəs/',
                categoryUz: 'Nima? (Tushuncha)',
                emoji: '✨',
                exampleSentenceEn: 'Family brings happiness.',
                exampleSentenceUz: 'Oila baxt keltiradi.',
              },
            ],
          },
          {
            type: 'ImageExample',
            id: 'img_ex_nouns',
            titleUz: 'Rasmli va Gapli Misollar (8–10 Misollar To‘plami)',
            cards: [
              {
                emoji: '🍎',
                labelEn: 'apple',
                labelUz: 'olma (buyum)',
                sentenceEn: 'I eat an apple every morning.',
                sentenceUz: 'Men har kuni ertalab olma yeyman.',
                highlightedWord: 'apple',
              },
              {
                emoji: '👨‍⚕️',
                labelEn: 'doctor',
                labelUz: 'shifokor (inson)',
                sentenceEn: 'My brother is a doctor at the hospital.',
                sentenceUz: 'Mening akam shifoxonada shifokor.',
                highlightedWord: 'doctor',
              },
              {
                emoji: '🌳',
                labelEn: 'park',
                labelUz: 'istirohat bog‘i (joy)',
                sentenceEn: 'Children play in the green park.',
                sentenceUz: 'Bolalar yashil bog‘da o‘ynaydilar.',
                highlightedWord: 'park',
              },
              {
                emoji: '📱',
                labelEn: 'phone',
                labelUz: 'telefon (buyum)',
                sentenceEn: 'Where is my new phone?',
                sentenceUz: 'Mening yangi telefonim qayerda?',
                highlightedWord: 'phone',
              },
            ],
          },
          {
            type: 'ComparisonBlock',
            id: 'comp_noun_vs_verb',
            titleUz: 'Ot (Noun) va Fe’l (Verb) ni adashtirmang!',
            correctExample: {
              text: 'book (kitob — Nima?), teacher (o‘qituvchi — Kim?) → Bular Noun (Ot).',
              language: 'en',
              translation: 'Shaxs va buyum nomlari Noun hisoblanadi.',
              translationLanguage: 'uz',
              speakable: true,
              highlightedWords: ['book', 'teacher'],
            },
            incorrectExample: {
              text: 'read (o‘qimoq), run (yugurmoq), sleep (uxlamoq) → Bular Noun EMAS!',
              reasonUz:
                '"Read", "run", "sleep" so‘zlari "Nima qilmoq?" savoliga javob beradi va harakatni (Fe’l / Verb) bildiradi.',
            },
            takeawayUz:
              'Eslab qoling: Agar so‘z "Kim?", "Nima?" yoki "Qayer?" savoliga javob bersa — u Noun (Ot)!',
          },
        ],
      },

      // ----------------------------------------------------------------------
      // STAGE 4: GUIDED MINI-PRACTICE (4 TOPIC-AWARE INTERACTIVE ACTIVITIES)
      // ----------------------------------------------------------------------
      {
        id: 'guided_practice',
        stageNumber: 4,
        type: 'practice',
        titleUz: '4-Bosqich: Boshqariluvchi Mini-Mashq (4 ta Mashq)',
        titleEn: 'Stage 4 — Guided Mini-Practice',
        blocks: [
          {
            type: 'ExerciseBlock',
            id: 'ex_block_what_is_noun',
            titleUz: 'Qoidani darhol amalda tekshiramiz!',
            subtitleUz:
              'Keyingi bosqichga o‘tishdan oldin quyidagi 4 ta kichik mashqni bajaring. Har bir javobdan so‘ng o‘zbekcha izoh chiqadi.',
            activities: [
              {
                id: 'act_noun_1_identify',
                exerciseTemplateCode: 'parts_of_speech_identification',
                exerciseTypeLabelUz: '1-Mashq: Gapdan Otni (Noun) toping',
                questionUz: 'Quyidagi inglizcha gapda qaysi so‘z Noun (Ot) hisoblanadi?',
                questionEn: 'The teacher is very kind.',
                interactionMode: 'identify_word',
                options: [
                  {
                    id: 'opt_1',
                    textEn: 'teacher',
                    textUz: 'o‘qituvchi (Kim? — Inson)',
                    isCorrect: true,
                  },
                  {
                    id: 'opt_2',
                    textEn: 'very',
                    textUz: 'juda (Ravish)',
                    isCorrect: false,
                  },
                  {
                    id: 'opt_3',
                    textEn: 'kind',
                    textUz: 'mehribon (Sifat)',
                    isCorrect: false,
                  },
                ],
                explanationUz:
                  'To‘g‘ri! "Teacher" (o‘qituvchi) — "Kim?" savoliga javob beruvchi shaxs oti (Noun).',
                knowledgeId: 'kw_noun_concept',
                allowRetry: true,
              },
              {
                id: 'act_noun_2_match',
                exerciseTemplateCode: 'word_to_translation',
                exerciseTypeLabelUz: '2-Mashq: Inglizcha otlarni o‘zbekcha ma’nosi bilan moslang',
                questionUz: 'Chap ustundagi inglizcha otni bosing va o‘ng ustundan tarjimasini tanlang:',
                interactionMode: 'match_pairs',
                pairs: [
                  { id: 'p1', leftEn: 'book', rightUz: 'kitob (buyum)' },
                  { id: 'p2', leftEn: 'school', rightUz: 'maktab (joy)' },
                  { id: 'p3', leftEn: 'happiness', rightUz: 'baxt (tushuncha)' },
                ],
                explanationUz:
                  'Barakalla! book = kitob, school = maktab, happiness = baxt.',
                knowledgeId: 'kw_noun_book',
                allowRetry: true,
              },
              {
                id: 'act_noun_3_categorize',
                exerciseTemplateCode: 'word_categorization',
                exerciseTypeLabelUz: '3-Mashq: Otlarni 3 guruhga ajrating (Kim? Qayer? Nima?)',
                questionUz: 'Har bir inglizcha otni o‘z guruhiga belgilang:',
                interactionMode: 'categorize',
                categories: [
                  { id: 'person', labelUz: 'Kim? (Person)' },
                  { id: 'place', labelUz: 'Qayer? (Place)' },
                  { id: 'thing', labelUz: 'Nima? (Thing)' },
                ],
                categorizeItems: [
                  { id: 'c1', wordEn: 'Doctor', correctCategoryId: 'person' },
                  { id: 'c2', wordEn: 'City', correctCategoryId: 'place' },
                  { id: 'c3', wordEn: 'Phone', correctCategoryId: 'thing' },
                ],
                explanationUz:
                  'Ajoyib! Doctor — shaxs (Kim?), City — joy (Qayer?), Phone — buyum (Nima?).',
                knowledgeId: 'kw_noun_city',
                allowRetry: true,
              },
              {
                id: 'act_noun_4_fill',
                exerciseTemplateCode: 'sentence_completion',
                exerciseTypeLabelUz: '4-Mashq: Gapni mos Ot (Noun) bilan to‘ldiring',
                questionUz: '“Men har kuni qiziqarli ___ o‘qiyman” gapiga qaysi ot mos keladi?',
                questionEn: 'I read an interesting ___ every day.',
                interactionMode: 'multiple_choice',
                options: [
                  { id: 'f1', textEn: 'book', textUz: 'kitob (Ot)', isCorrect: true },
                  { id: 'f2', textEn: 'sleep', textUz: 'uxlamoq (Fe’l)', isCorrect: false },
                  { id: 'f3', textEn: 'quickly', textUz: 'tez (Ravish)', isCorrect: false },
                ],
                explanationUz:
                  'To‘g‘ri! "Read" (o‘qimoq) fe’lidan keyin "nima?" savoliga javob bo‘luvchi "book" (kitob) oti keladi.',
                knowledgeId: 'kw_noun_book',
                allowRetry: true,
              },
            ],
          },
        ],
      },

      // ----------------------------------------------------------------------
      // STAGE 5: REAL-LIFE APPLICATION (DIALOGUE + MINI STORY + AUDIO SITUATIONS)
      // ----------------------------------------------------------------------
      {
        id: 'real_life',
        stageNumber: 5,
        type: 'application',
        titleUz: '5-Bosqich: Hayotiy Muloqotda Qo‘llash',
        titleEn: 'Stage 5 — Real-Life Application',
        blocks: [
          {
            type: 'DialogueBlock',
            id: 'dlg_noun_real_life',
            titleUz: 'Jonli Suhbat: Sinfxonada (Har bir qatorni bosib tinglang)',
            contextUz:
              'Ali va Madina yangi o‘quv xonasida suhbatlashmoqda. Ajratilgan otlarga (Nouns) e’tibor bering:',
            lines: [
              {
                speaker: 'Ali',
                avatarEmoji: '🧑',
                english: 'Hello Madina! What is this?',
                uzbek: 'Salom Madina! Bu nima?',
                highlightedWords: ['Madina'],
              },
              {
                speaker: 'Madina',
                avatarEmoji: '👩',
                english: 'It is an English book for our class.',
                uzbek: 'Bu darsimiz uchun ingliz tili kitobi.',
                highlightedWords: ['book', 'class'],
              },
              {
                speaker: 'Ali',
                avatarEmoji: '🧑',
                english: 'Where is our teacher right now?',
                uzbek: 'Bizning o‘qituvchimiz hozir qayerda?',
                highlightedWords: ['teacher'],
              },
              {
                speaker: 'Madina',
                avatarEmoji: '👩',
                english: 'The teacher is in the library with a student.',
                uzbek: 'O‘qituvchi kutubxonada bir talaba bilan turibdi.',
                highlightedWords: ['teacher', 'library', 'student'],
              },
            ],
          },
          {
            type: 'StoryBlock',
            id: 'story_noun_life',
            titleEn: 'My Favorite Place in the City',
            titleUz: 'Qisqa Hikoya: Shahardagi sevimli joyim',
            paragraphs: [
              {
                english:
                  'My name is Jasur and I live in Tashkent. Near my house there is a quiet park and a small coffee shop.',
                uzbek:
                  'Mening ismim Jasur va men Toshkentda yashayman. Uyimning yonida tinch bog‘ va kichik qahvaxona bor.',
                highlightedWords: ['name', 'Jasur', 'Tashkent', 'house', 'park', 'shop'],
              },
              {
                english:
                  'Every Saturday I take my book and drink hot tea with my friend.',
                uzbek:
                  'Har shanba men kitobimni olaman va do‘stim bilan issiq choy ichaman.',
                highlightedWords: ['Saturday', 'book', 'tea', 'friend'],
              },
            ],
          },
        ],
      },

      // ----------------------------------------------------------------------
      // STAGE 6: SUBTOPIC ASSESSMENT (6 MIXED QUESTIONS, 70% PASSING THRESHOLD)
      // ----------------------------------------------------------------------
      {
        id: 'assessment',
        stageNumber: 6,
        type: 'assessment',
        titleUz: '6-Bosqich: Yakuniy Nazorat Testi (Assessment)',
        titleEn: 'Stage 6 — Subtopic Assessment (6 Questions)',
        blocks: [
          {
            type: 'AssessmentBlock',
            id: 'assess_what_is_noun',
            titleUz: '“What is a Noun?” Mavzusi Bo‘yicha Bilim Sinovi',
            descriptionUz:
              'Mavzuni muvaffaqiyatli yakunlash va keyingi bosqichni ochish uchun kamida 70% (6 ta savoldan kamida 5 tasi) to‘g‘ri javob bering.',
            passingThresholdPercent: 70,
            allowRetry: true,
            questions: [
              {
                id: 'q1',
                difficulty: 'easy',
                ruleCoveredUz: 'Otning so‘roqlari (Kim? Nima? Qayer?)',
                promptUz: '1-Savol: Ingliz tilida Noun (Ot) qanday ma’noni bildiradi?',
                questionType: 'multiple_choice',
                options: [
                  {
                    id: 'a',
                    textEn: 'Person, Place, Thing, or Idea (Shaxs, joy, buyum yoki tushuncha)',
                    isCorrect: true,
                  },
                  {
                    id: 'b',
                    textEn: 'Only actions like run and jump (Faqat harakatlar)',
                    isCorrect: false,
                  },
                  {
                    id: 'c',
                    textEn: 'Only colors like red and blue (Faqat ranglar)',
                    isCorrect: false,
                  },
                ],
                explanationUz:
                  'Noun (Ot) — inson (person), joy (place), buyum/hayvon (thing) yoki tushuncha (idea) nomini bildiradi.',
                knowledgeId: 'kw_noun_concept',
              },
              {
                id: 'q2',
                difficulty: 'easy',
                ruleCoveredUz: 'Gap ichidan Otni (Noun) ajratib olish',
                promptUz: '2-Savol: “My sister works at a school.” gapida nechta Ot (Noun) bor?',
                promptEn: 'My sister works at a school.',
                questionType: 'multiple_choice',
                options: [
                  {
                    id: 'a',
                    textEn: '2 nouns: sister (Kim?) and school (Qayer?)',
                    isCorrect: true,
                  },
                  {
                    id: 'b',
                    textEn: '1 noun: works',
                    isCorrect: false,
                  },
                  {
                    id: 'c',
                    textEn: 'No nouns in this sentence',
                    isCorrect: false,
                  },
                ],
                explanationUz:
                  'Gapda 2 ta ot bor: "sister" (opa/singil — shaxs) va "school" (maktab — joy). "Works" esa fe’l.',
                knowledgeId: 'kw_noun_concept',
              },
              {
                id: 'q3',
                difficulty: 'medium',
                ruleCoveredUz: 'Ot va boshqa so‘z turkumlarini farqlash',
                promptUz: '3-Savol: Quyidagi so‘zlardan qaysi biri Noun (Ot) EMAS?',
                questionType: 'multiple_choice',
                options: [
                  { id: 'a', textEn: 'city (shahar)', isCorrect: false },
                  { id: 'b', textEn: 'quickly (tezda — Ravish)', isCorrect: true },
                  { id: 'c', textEn: 'teacher (o‘qituvchi)', isCorrect: false },
                ],
                explanationUz:
                  '"Quickly" (tezda) harakatning qanday bajarilishini bildiruvchi ravish (Adverb), ot emas.',
                knowledgeId: 'kw_noun_city',
              },
              {
                id: 'q4',
                difficulty: 'medium',
                ruleCoveredUz: 'Mavhum otlar (Idea / Feeling Nouns)',
                promptUz: '4-Savol: “Family brings happiness.” gapidagi “happiness” (baxt) so‘zi ot bo‘la oladimi?',
                promptEn: 'Family brings happiness.',
                questionType: 'true_false',
                options: [
                  {
                    id: 'true',
                    textEn: 'True — Ha, "happiness" (baxt) mavhum tushuncha oti (Noun)',
                    isCorrect: true,
                  },
                  {
                    id: 'false',
                    textEn: 'False — Yo‘q, faqat qo‘l bilan ushlab bo‘ladigan narsalar ot bo‘ladi',
                    isCorrect: false,
                  },
                ],
                explanationUz:
                  'To‘g‘ri! Baxt (happiness), musiqa (music), vaqt (time) kabi tushunchalar ham "Nima?" savoliga javob beradi va Noun hisoblanadi.',
                knowledgeId: 'kw_noun_concept',
              },
              {
                id: 'q5',
                difficulty: 'medium',
                ruleCoveredUz: 'Yozma mashq: Buyum otini yozish',
                promptUz: '5-Savol: “Bu kitob.” gapini to‘ldirish uchun “kitob” so‘zini ingliz tilida yozing:',
                promptEn: 'This is a ___.',
                questionType: 'fill_blank',
                correctAnswerText: 'book',
                explanationUz: '“Kitob” ingliz tilida “book” deb yoziladi: This is a book.',
                knowledgeId: 'kw_noun_book',
              },
              {
                id: 'q6',
                difficulty: 'hard',
                ruleCoveredUz: 'Otlardan foydalanib to‘g‘ri gap tuzish',
                promptUz: '6-Savol: “O‘qituvchi kitob o‘qiydi” gapini inglizcha so‘zlardan to‘g‘ri tartibda tuzing:',
                questionType: 'sentence_builder',
                sentenceTokens: ['a', 'The', 'reads', 'book', 'teacher'],
                correctAnswerText: 'The teacher reads a book',
                explanationUz:
                  'To‘g‘ri tartib: The teacher (Ega/Noun) + reads (Fe’l) + a book (To‘ldiruvchi/Noun).',
                knowledgeId: 'kw_noun_book',
              },
            ],
          },
        ],
      },

      // ----------------------------------------------------------------------
      // STAGE 7: WRAP-UP (FINAL SECTION)
      // ----------------------------------------------------------------------
      {
        id: 'wrap_up',
        stageNumber: 7,
        type: 'wrap_up',
        titleUz: '7-Bosqich: Yakuniy Xulosa (Wrap-Up)',
        titleEn: 'Stage 7 — Wrap-Up & Next Steps',
        blocks: [
          {
            type: 'SummaryBlock',
            id: 'sum_what_is_noun',
            titleUz: 'Tabriklaymiz! “What is a Noun?” mikro-kursini yakunladingiz!',
            learnedPointsUz: [
              'Noun (Ot) — inson (teacher, girl), joy (school, city, park), buyum/hayvon (book, phone, cat) va tushuncha (happiness, music) nomini bildiradi.',
              'Otlar gapda Kim? (Who?), Nima? (What?) va Qayer? (Where?) savollariga javob beradi.',
              '10 ta jonli inglizcha gap va suhbat orqali otlarning gapdagi o‘rnini o‘zlashtirdingiz.',
            ],
            keyRulesUz: [
              'Qoida: [Person / Place / Thing / Idea] = Noun (Ot)',
              'Formula: The [Noun: Subject] + Verb + a [Noun: Object].',
            ],
            nextStepRecommendationUz:
              'Keyingi qadam: 2-Ost-mavzu — “Common and Proper Nouns” (Turdosh va Atoqli otlar) darsiga o‘ting yoki Amaliyot Markazida (Practice Center) Nouns mashqlarini bajaring!',
            unlockedPracticePathId: 'practice_path_nouns',
            nextSubtopicId: 'common_and_proper_nouns',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 2. SUBTOPIC 2: COMMON AND PROPER NOUNS (TURDOSH VA ATOQLI OTLAR)
  // ==========================================================================
  common_and_proper_nouns: {
    schemaVersion: SUBTOPIC_SCHEMA_VERSION,
    id: 'common_and_proper_nouns',
    majorTopicId: 'nouns',
    majorTopicTitleUz: 'Nouns (Ot so‘z turkumi)',
    orderIndex: 2,
    title: {
      en: 'Common and Proper Nouns',
      uz: 'Turdosh va Atoqli Otlar',
    },
    level: 'A1',
    difficultyLabelUz: 'A1 · Boshlang‘ich',
    estimatedMinutes: 8,
    iconEmoji: '🌍',
    shortIntroUz:
      'Nima uchun "city" kichik harf bilan, "Tashkent" esa katta harf bilan yoziladi? Ushbu darsda umumiy (Common) va xos/atoqli (Proper) otlarning farqini o‘rganamiz.',
    whyUsefulUz:
      'Ismingizni, shahringizni, davlatlar va kun nomlarini ingliz tilida xatosiz (bosh harf bilan) yozish uchun bu qoida juda zarur.',
    learningObjectivesUz: [
      'Common Noun (umumiy nom: city, boy, country) va Proper Noun (atoqli nom: Tashkent, Ali, Uzbekistan) farqini bilib olasiz.',
      'Atoqli otlar doimo katta harf (Capital letter) bilan yozilishini amalda qo‘llaysiz.',
    ],
    knowledgeIds: ['kw_noun_city', 'kw_noun_concept'],
    practicePathId: 'practice_path_nouns',
    nextSubtopicId: 'singular_and_plural_nouns',
    sections: [
      {
        id: 'introduction',
        stageNumber: 1,
        type: 'introduction',
        titleUz: '1-Bosqich: Kirish — Common vs Proper Nouns',
        titleEn: 'Stage 1 — Introduction',
        blocks: [
          {
            type: 'AnimationBlock',
            id: 'anim_common_proper',
            titleUz: 'Umumiy nom va Maxsus (Atoqli) nom farqi',
            visualSteps: [
              { emoji: '🏙️', labelEn: 'city → Tashkent', labelUz: 'shahar (umumiy) → Toshkent (atoqli)' },
              { emoji: '🧑', labelEn: 'student → Ali', labelUz: 'talaba (umumiy) → Ali (atoqli)' },
              { emoji: '📅', labelEn: 'day → Monday', labelUz: 'kun (umumiy) → Dushanba (atoqli)' },
            ],
            summaryUz: 'Atoqli otlar (Proper Nouns) gapning qayerida kelsa ham katta harf bilan yoziladi!',
          },
        ],
      },
      {
        id: 'explanation',
        stageNumber: 2,
        type: 'explanation',
        titleUz: '2-Bosqich: Qoida va Tushuntirish',
        titleEn: 'Stage 2 — Explanation',
        blocks: [
          {
            type: 'RuleExplanation',
            id: 'rule_common_proper',
            ruleId: 'kw_noun_city',
            ruleTitleUz: 'Qoida: Common Noun (kichik harf) va Proper Noun (Bosh harf)',
            simpleExplanationUz:
              'Bir turdagi narsalarning umumiy nomi Common Noun (turdosh ot) deyiladi. Inson, shahar, davlat, hafta kuni yoki oyning maxsus nomi esa Proper Noun (atoqli ot) deyiladi va har doim BOSH HARF bilan yoziladi.',
            questionsAnsweredUz: [
              'Qachon kichik harf? — a city, a teacher, a country',
              'Qachon Bosh harf? — Tashkent, London, Mr. Karimov, Uzbekistan, Friday',
            ],
            whenToUseUz: 'Yozma nutqda va rasmiy xatlarda atoqli otlarni bosh harf bilan yozish majburiy.',
            formula: 'common noun (city) → Proper Noun (Samarkand)',
            examples: [
              {
                text: 'Ali lives in Tashkent.',
                language: 'en',
                translation: 'Ali Toshkentda yashaydi.',
                translationLanguage: 'uz',
                speakable: true,
                highlightedWords: ['Ali', 'Tashkent'],
              },
              {
                text: 'We have an English lesson on Monday.',
                language: 'en',
                translation: 'Dushanba kuni ingliz tili darsimiz bor.',
                translationLanguage: 'uz',
                speakable: true,
                highlightedWords: ['English', 'Monday'],
              },
            ],
          },
        ],
      },
      {
        id: 'examples',
        stageNumber: 3,
        type: 'examples',
        titleUz: '3-Bosqich: Misollar va Taqqoslash',
        titleEn: 'Stage 3 — Guided Examples',
        blocks: [
          {
            type: 'ComparisonBlock',
            id: 'comp_proper_cap',
            titleUz: 'Bosh harf qoidasini solishtiring',
            correctExample: {
              text: 'My friend Madina studies in London on Friday.',
              language: 'en',
              translation: 'Do‘stim Madina juma kuni Londonda o‘qiydi.',
              translationLanguage: 'uz',
              speakable: true,
              highlightedWords: ['Madina', 'London', 'Friday'],
            },
            incorrectExample: {
              text: 'My friend madina studies in london on friday.',
              reasonUz: 'Ism (Madina), shahar (London) va hafta kuni (Friday) kichik harf bilan yozilishi xato!',
            },
            takeawayUz: 'Ingliz tilida hafta kunlari (Monday..Sunday) va tillar (English, Uzbek) ham Proper Noun hisoblanadi.',
          },
        ],
      },
      {
        id: 'guided_practice',
        stageNumber: 4,
        type: 'practice',
        titleUz: '4-Bosqich: Mini-Mashq',
        titleEn: 'Stage 4 — Guided Practice',
        blocks: [
          {
            type: 'ExerciseBlock',
            id: 'ex_common_proper',
            titleUz: 'Turdosh va Atoqli otlarni farqlang',
            subtitleUz: 'Quyidagi mashqlarni bajaring:',
            activities: [
              {
                id: 'cp_act_1',
                exerciseTemplateCode: 'grammar_classification',
                exerciseTypeLabelUz: '1-Mashq: Common yoki Proper Noun?',
                questionUz: 'So‘zlarni Common Noun (umumiy) va Proper Noun (atoqli) guruhiga ajrating:',
                interactionMode: 'categorize',
                categories: [
                  { id: 'common', labelUz: 'Common Noun (kichik harf)' },
                  { id: 'proper', labelUz: 'Proper Noun (Bosh harf)' },
                ],
                categorizeItems: [
                  { id: 'i1', wordEn: 'city', correctCategoryId: 'common' },
                  { id: 'i2', wordEn: 'Samarkand', correctCategoryId: 'proper' },
                  { id: 'i3', wordEn: 'Monday', correctCategoryId: 'proper' },
                ],
                explanationUz: 'Samarkand va Monday — maxsus atoqli nomlar (Proper Nouns).',
                knowledgeId: 'kw_noun_city',
                allowRetry: true,
              },
            ],
          },
        ],
      },
      {
        id: 'real_life',
        stageNumber: 5,
        type: 'application',
        titleUz: '5-Bosqich: Hayotiy Muloqot',
        titleEn: 'Stage 5 — Real-Life Application',
        blocks: [
          {
            type: 'DialogueBlock',
            id: 'dlg_common_proper',
            titleUz: 'Tanishuv suhbati',
            contextUz: 'Yangi tanishuvda ism va shahar nomlari qanday ishlatilishini tinglang:',
            lines: [
              {
                speaker: 'Alex',
                avatarEmoji: '🧑',
                english: 'Hi! My name is Alex. I am from London.',
                uzbek: 'Salom! Mening ismim Aleks. Men Londondanman.',
                highlightedWords: ['Alex', 'London'],
              },
              {
                speaker: 'Dilnoza',
                avatarEmoji: '👩',
                english: 'Welcome Alex! I am Dilnoza from Tashkent.',
                uzbek: 'Xush kelibsiz Aleks! Men Toshkentlik Dilnozaman.',
                highlightedWords: ['Alex', 'Dilnoza', 'Tashkent'],
              },
            ],
          },
        ],
      },
      {
        id: 'assessment',
        stageNumber: 6,
        type: 'assessment',
        titleUz: '6-Bosqich: Nazorat Testi',
        titleEn: 'Stage 6 — Assessment',
        blocks: [
          {
            type: 'AssessmentBlock',
            id: 'assess_common_proper',
            titleUz: 'Common & Proper Nouns Sinovi',
            descriptionUz: 'Kamida 70% to‘g‘ri javob bering:',
            passingThresholdPercent: 70,
            allowRetry: true,
            questions: [
              {
                id: 'cp_q1',
                difficulty: 'easy',
                ruleCoveredUz: 'Proper Noun qoidasi',
                promptUz: 'Qaysi so‘z Proper Noun (atoqli ot) hisoblanadi?',
                questionType: 'multiple_choice',
                options: [
                  { id: 'a', textEn: 'Uzbekistan', isCorrect: true },
                  { id: 'b', textEn: 'country', isCorrect: false },
                  { id: 'c', textEn: 'school', isCorrect: false },
                ],
                explanationUz: '"Uzbekistan" — davlatning maxsus atoqli nomi.',
                knowledgeId: 'kw_noun_city',
              },
              {
                id: 'cp_q2',
                difficulty: 'medium',
                ruleCoveredUz: 'Hafta kunlari imlosi',
                promptUz: 'Qaysi gap imlo jihatdan to‘g‘ri yozilgan?',
                questionType: 'multiple_choice',
                options: [
                  { id: 'a', textEn: 'I visit Samarkand on Sunday.', isCorrect: true },
                  { id: 'b', textEn: 'I visit samarkand on sunday.', isCorrect: false },
                ],
                explanationUz: 'Shahar (Samarkand) va hafta kuni (Sunday) katta harf bilan yoziladi.',
                knowledgeId: 'kw_noun_city',
              },
            ],
          },
        ],
      },
      {
        id: 'wrap_up',
        stageNumber: 7,
        type: 'wrap_up',
        titleUz: '7-Bosqich: Yakuniy Xulosa',
        titleEn: 'Stage 7 — Wrap-Up',
        blocks: [
          {
            type: 'SummaryBlock',
            id: 'sum_common_proper',
            titleUz: 'Common va Proper Nouns mavzusini tugatdingiz!',
            learnedPointsUz: [
              'Common Noun — umumiy nomlar (kichik harf bilan).',
              'Proper Noun — atoqli nomlar (doimo Bosh harf bilan).',
            ],
            keyRulesUz: ['Ism, shahar, davlat, til va hafta kunlari Bosh harf bilan yoziladi.'],
            nextStepRecommendationUz: 'Keyingi ost-mavzu: Singular and Plural Nouns (Birlik va Ko‘plik).',
            unlockedPracticePathId: 'practice_path_nouns',
            nextSubtopicId: 'singular_and_plural_nouns',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 3. SUBTOPIC 3: SINGULAR AND PLURAL NOUNS (BIRLIK VA KO‘PLIKDAGI OTLAR)
  // ==========================================================================
  singular_and_plural_nouns: {
    schemaVersion: SUBTOPIC_SCHEMA_VERSION,
    id: 'singular_and_plural_nouns',
    majorTopicId: 'nouns',
    majorTopicTitleUz: 'Nouns (Ot so‘z turkumi)',
    orderIndex: 3,
    title: {
      en: 'Singular and Plural Nouns',
      uz: 'Birlik va Ko‘plikdagi Otlar (-s / -es)',
    },
    level: 'A1',
    difficultyLabelUz: 'A1 · Boshlang‘ich',
    estimatedMinutes: 9,
    iconEmoji: '📚',
    shortIntroUz:
      'Bitta kitob — "one book", ikkita kitob esa — "two books". Ingliz tilida otlarning ko‘plik shaklini yasash qoidalarini oson o‘rganamiz.',
    whyUsefulUz:
      'Xarid qilayotganda, narsalar sonini aytayotganda birlik va ko‘plik qo‘shimchalarini to‘g‘ri ishlatish juda muhim.',
    learningObjectivesUz: [
      'Oddiy otlarga "-s" qo‘shib ko‘plik yasashni o‘rganasiz.',
      '-s, -sh, -ch, -x bilan tugagan otlarga "-es" qo‘shilishini bilib olasiz.',
    ],
    knowledgeIds: ['kw_noun_plural_s', 'kw_noun_book'],
    practicePathId: 'practice_path_nouns',
    nextSubtopicId: 'countable_and_uncountable_nouns',
    sections: [
      {
        id: 'introduction',
        stageNumber: 1,
        type: 'introduction',
        titleUz: '1-Bosqich: Kirish — Singular & Plural',
        titleEn: 'Stage 1 — Introduction',
        blocks: [
          {
            type: 'AnimationBlock',
            id: 'anim_plural',
            titleUz: 'Bitta va Ko‘p (Singular → Plural)',
            visualSteps: [
              { emoji: '📕', labelEn: 'one book → two books', labelUz: '+s qo‘shimchasi' },
              { emoji: '🚌', labelEn: 'one bus → two buses', labelUz: '+es qo‘shimchasi' },
              { emoji: '🌆', labelEn: 'one city → two cities', labelUz: '-y → -ies o‘zgarishi' },
            ],
            summaryUz: 'O‘zbek tilidagi "-lar" qo‘shimchasi ingliz tilida "-s" yoki "-es" ga teng!',
          },
        ],
      },
      {
        id: 'explanation',
        stageNumber: 2,
        type: 'explanation',
        titleUz: '2-Bosqich: Qoida va Formula',
        titleEn: 'Stage 2 — Explanation',
        blocks: [
          {
            type: 'RuleExplanation',
            id: 'rule_plural_s_es',
            ruleId: 'kw_noun_plural_s',
            ruleTitleUz: 'Qoida: Ko‘plik yasash (-s, -es, -ies)',
            simpleExplanationUz:
              '1) Aksariyat otlarga "-s" qo‘shiladi (book → books).\n2) Agar so‘z -s, -ss, -sh, -ch, -x bilan tugasa, talaffuz oson bo‘lishi uchun "-es" qo‘shiladi (bus → buses, box → boxes).\n3) Undosh + y bilan tugasa, "y" tushib "-ies" qo‘shiladi (city → cities).',
            questionsAnsweredUz: ['Nechta? (How many?) — two books, three buses, five cities'],
            whenToUseUz: 'Narsa yoki shaxslar soni 2 va undan ortiq bo‘lganda doimo ko‘plik shakli ishlatiladi.',
            formula: 'Singular Noun + s / es / ies = Plural Noun',
            examples: [
              {
                text: 'I have two English books.',
                language: 'en',
                translation: 'Menda ikkita inglizcha kitob bor.',
                translationLanguage: 'uz',
                speakable: true,
                highlightedWords: ['books'],
              },
              {
                text: 'Three buses are at the station.',
                language: 'en',
                translation: 'Bekatda uchta avtobus turibdi.',
                translationLanguage: 'uz',
                speakable: true,
                highlightedWords: ['buses'],
              },
            ],
          },
        ],
      },
      {
        id: 'examples',
        stageNumber: 3,
        type: 'examples',
        titleUz: '3-Bosqich: Misollar',
        titleEn: 'Stage 3 — Examples',
        blocks: [
          {
            type: 'ExampleSentence',
            id: 'ex_sent_pl_1',
            categoryLabelUz: '-ies qoidasi',
            sentence: {
              text: 'Tashkent and Samarkand are historic cities.',
              language: 'en',
              translation: 'Toshkent va Samarqand — tarixiy shaharlar.',
              translationLanguage: 'uz',
              speakable: true,
              highlightedWords: ['cities'],
            },
            explanationUz: 'city → cities (undosh "t" + "y" bo‘lgani uchun -ies ga aylanadi).',
          },
        ],
      },
      {
        id: 'guided_practice',
        stageNumber: 4,
        type: 'practice',
        titleUz: '4-Bosqich: Mini-Mashq',
        titleEn: 'Stage 4 — Guided Practice',
        blocks: [
          {
            type: 'ExerciseBlock',
            id: 'ex_blk_plural',
            titleUz: 'Ko‘plik shaklini yozing',
            subtitleUz: 'Qoidani amalda qo‘llang:',
            activities: [
              {
                id: 'pl_act_1',
                exerciseTemplateCode: 'singular_plural_conversion',
                exerciseTypeLabelUz: '1-Mashq: Birlikdan ko‘plikka o‘tkazing',
                questionUz: '“Two ___ (bus)” — “bus” so‘zining ko‘plik shaklini tanlang:',
                questionEn: 'Two ___ are waiting outside.',
                interactionMode: 'multiple_choice',
                options: [
                  { id: 'a', textEn: 'buses', textUz: '-s bilan tugagani uchun +es', isCorrect: true },
                  { id: 'b', textEn: 'buss', textUz: 'Noto‘g‘ri imlo', isCorrect: false },
                ],
                explanationUz: '"Bus" so‘zi -s bilan tugagani uchun "-es" qo‘shiladi: buses.',
                knowledgeId: 'kw_noun_plural_s',
                allowRetry: true,
              },
            ],
          },
        ],
      },
      {
        id: 'real_life',
        stageNumber: 5,
        type: 'application',
        titleUz: '5-Bosqich: Hayotiy Muloqot',
        titleEn: 'Stage 5 — Real-Life Application',
        blocks: [
          {
            type: 'DialogueBlock',
            id: 'dlg_plural_shop',
            titleUz: 'Kitob do‘konida',
            contextUz: 'Sotuvchi va xaridor suhbati:',
            lines: [
              {
                speaker: 'Customer',
                avatarEmoji: '🧑',
                english: 'Hello! I need two notebooks and three pens, please.',
                uzbek: 'Salom! Menga ikkita daftar va uchta ruchka kerak, iltimos.',
                highlightedWords: ['notebooks', 'pens'],
              },
              {
                speaker: 'Seller',
                avatarEmoji: '👩‍💼',
                english: 'Here are your notebooks and pens!',
                uzbek: 'Mana sizning daftarlaringiz va ruchkalaringiz!',
                highlightedWords: ['notebooks', 'pens'],
              },
            ],
          },
        ],
      },
      {
        id: 'assessment',
        stageNumber: 6,
        type: 'assessment',
        titleUz: '6-Bosqich: Nazorat Testi',
        titleEn: 'Stage 6 — Assessment',
        blocks: [
          {
            type: 'AssessmentBlock',
            id: 'assess_plural',
            titleUz: 'Singular & Plural Nouns Sinovi',
            descriptionUz: 'Kamida 70% to‘g‘ri javob bering:',
            passingThresholdPercent: 70,
            allowRetry: true,
            questions: [
              {
                id: 'pl_q1',
                difficulty: 'easy',
                ruleCoveredUz: '-s ko‘plik qo‘shimchasi',
                promptUz: '“Three ___ (book)” bo‘sh joyga to‘g‘ri so‘zni yozing:',
                questionType: 'fill_blank',
                correctAnswerText: 'books',
                explanationUz: 'book + s = books.',
                knowledgeId: 'kw_noun_plural_s',
              },
              {
                id: 'pl_q2',
                difficulty: 'medium',
                ruleCoveredUz: '-ies qoidasi',
                promptUz: '“City” so‘zining ko‘plik shakli qanday yoziladi?',
                questionType: 'multiple_choice',
                options: [
                  { id: 'a', textEn: 'cities', isCorrect: true },
                  { id: 'b', textEn: 'citys', isCorrect: false },
                ],
                explanationUz: 'Undosh + y bilan tugagan otlarda y → ies bo‘ladi: cities.',
                knowledgeId: 'kw_noun_plural_s',
              },
            ],
          },
        ],
      },
      {
        id: 'wrap_up',
        stageNumber: 7,
        type: 'wrap_up',
        titleUz: '7-Bosqich: Yakuniy Xulosa',
        titleEn: 'Stage 7 — Wrap-Up',
        blocks: [
          {
            type: 'SummaryBlock',
            id: 'sum_plural',
            titleUz: 'Singular & Plural Nouns darsini yakunladingiz!',
            learnedPointsUz: ['Birlik va ko‘plik (-s, -es, -ies) qoidalarini o‘zlashtirdingiz.'],
            keyRulesUz: ['book → books | bus → buses | city → cities'],
            nextStepRecommendationUz: 'Keyingi ost-mavzu: Countable and Uncountable Nouns.',
            unlockedPracticePathId: 'practice_path_nouns',
            nextSubtopicId: 'countable_and_uncountable_nouns',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 4. SUBTOPIC 4: COUNTABLE AND UNCOUNTABLE NOUNS
  // ==========================================================================
  countable_and_uncountable_nouns: {
    schemaVersion: SUBTOPIC_SCHEMA_VERSION,
    id: 'countable_and_uncountable_nouns',
    majorTopicId: 'nouns',
    majorTopicTitleUz: 'Nouns (Ot so‘z turkumi)',
    orderIndex: 4,
    title: {
      en: 'Countable and Uncountable Nouns',
      uz: 'Sanaladigan va Sanalmaydigan Otlar',
    },
    level: 'A2',
    difficultyLabelUz: 'A2 · Elementary',
    estimatedMinutes: 10,
    iconEmoji: '🥛',
    shortIntroUz:
      'Olmani donalab sanash mumkin (one apple, two apples), lekin suv (water) yoki shakarni (sugar) donalab sanab bo‘lmaydi. Shu farqni o‘rganamiz!',
    whyUsefulUz: 'Oziq-ovqat xaridi, kafe va restoranda buyurtma berishda how many / how much ni to‘g‘ri ishlatishga yordam beradi.',
    learningObjectivesUz: [
      'Countable (donalab sanaladigan: apple, book) va Uncountable (sanalmaydigan: water, tea, milk, information) otlarni ajratasiz.',
    ],
    knowledgeIds: ['kw_noun_concept'],
    practicePathId: 'practice_path_nouns',
    nextSubtopicId: 'concrete_and_abstract_nouns',
    sections: [
      {
        id: 'introduction',
        stageNumber: 1,
        type: 'introduction',
        titleUz: '1-Bosqich: Kirish',
        titleEn: 'Stage 1 — Introduction',
        blocks: [
          {
            type: 'AnimationBlock',
            id: 'anim_count_uncount',
            titleUz: 'Donalab sanaladimi yoki yo‘q?',
            visualSteps: [
              { emoji: '🍎', labelEn: '1 apple, 2 apples (Countable)', labelUz: 'Sanaladigan otlar' },
              { emoji: '💧', labelEn: 'water, milk, tea (Uncountable)', labelUz: 'Sanalmaydigan otlar (-s olmaydi)' },
            ],
            summaryUz: 'Sanalmaydigan otlar (Uncountable) ko‘plikda "-s" olmaydi va "a / an" artikli bilan kelmaydi.',
          },
        ],
      },
      {
        id: 'explanation',
        stageNumber: 2,
        type: 'explanation',
        titleUz: '2-Bosqich: Qoida',
        titleEn: 'Stage 2 — Explanation',
        blocks: [
          {
            type: 'RuleExplanation',
            id: 'rule_count_uncount',
            ruleId: 'kw_noun_concept',
            ruleTitleUz: 'Qoida: Countable vs Uncountable Nouns',
            simpleExplanationUz:
              'Countable nouns — 1, 2, 3 deb sanash mumkin bo‘lgan otlar. Uncountable nouns — suyuqliklar (water, milk), kukun/mayda moddalar (sugar, rice) va mavhum tushunchalar (money, information).',
            questionsAnsweredUz: ['How many? (Nechta? — Countable) | How much? (Qancha? — Uncountable)'],
            whenToUseUz: 'Miqdor so‘raganda va artikl tanlaganda.',
            formula: 'a book / two books | some water (NOT a water / waters)',
            examples: [
              {
                text: 'I drink water every morning.',
                language: 'en',
                translation: 'Men har kuni ertalab suv ichaman.',
                translationLanguage: 'uz',
                speakable: true,
                highlightedWords: ['water'],
              },
            ],
          },
        ],
      },
      {
        id: 'examples',
        stageNumber: 3,
        type: 'examples',
        titleUz: '3-Bosqich: Misollar',
        titleEn: 'Stage 3 — Examples',
        blocks: [
          {
            type: 'ComparisonBlock',
            id: 'comp_water',
            titleUz: 'Uncountable otlarda xato qilmang',
            correctExample: {
              text: 'I need some information and hot tea.',
              language: 'en',
              translation: 'Menga biroz ma’lumot va issiq choy kerak.',
              translationLanguage: 'uz',
              speakable: true,
              highlightedWords: ['information', 'tea'],
            },
            incorrectExample: {
              text: 'I need an information and two teas.',
              reasonUz: '"Information" va "tea" sanalmaydigan otlar bo‘lgani uchun "an" olmaydi.',
            },
            takeawayUz: 'Water, milk, tea, money, music, information — doimo birlik fe’l bilan keladi.',
          },
        ],
      },
      {
        id: 'guided_practice',
        stageNumber: 4,
        type: 'practice',
        titleUz: '4-Bosqich: Mini-Mashq',
        titleEn: 'Stage 4 — Guided Practice',
        blocks: [
          {
            type: 'ExerciseBlock',
            id: 'ex_count_uncount',
            titleUz: 'Countable yoki Uncountable?',
            subtitleUz: 'So‘zlarni guruhlarga ajrating:',
            activities: [
              {
                id: 'cu_act_1',
                exerciseTemplateCode: 'word_categorization',
                exerciseTypeLabelUz: 'Guruhlarga ajratish',
                questionUz: 'Qaysi ot sanaladigan (Countable), qaysi biri sanalmaydigan (Uncountable)?',
                interactionMode: 'categorize',
                categories: [
                  { id: 'countable', labelUz: 'Countable (1, 2, 3...)' },
                  { id: 'uncountable', labelUz: 'Uncountable (Sanalmaydi)' },
                ],
                categorizeItems: [
                  { id: '1', wordEn: 'Apple', correctCategoryId: 'countable' },
                  { id: '2', wordEn: 'Water', correctCategoryId: 'uncountable' },
                  { id: '3', wordEn: 'Book', correctCategoryId: 'countable' },
                ],
                explanationUz: 'Apple va Book donalab sanaladi; Water esa suyuqlik (sanalmaydi).',
                knowledgeId: 'kw_noun_concept',
                allowRetry: true,
              },
            ],
          },
        ],
      },
      {
        id: 'real_life',
        stageNumber: 5,
        type: 'application',
        titleUz: '5-Bosqich: Hayotiy Muloqot',
        titleEn: 'Stage 5 — Real-Life Application',
        blocks: [
          {
            type: 'DialogueBlock',
            id: 'dlg_cafe_count',
            titleUz: 'Kafeda buyurtma berish',
            contextUz: 'Sanaladigan va sanalmaydigan otlar birga kelgan suhbat:',
            lines: [
              {
                speaker: 'Waiter',
                avatarEmoji: '🧑‍🍳',
                english: 'Would you like some coffee or tea?',
                uzbek: 'Qahva yoki choy xohlaysizmi?',
                highlightedWords: ['coffee', 'tea'],
              },
              {
                speaker: 'Guest',
                avatarEmoji: '🧑',
                english: 'One cup of tea and two sandwiches, please.',
                uzbek: 'Bir finjon choy va ikkita sendvich, iltimos.',
                highlightedWords: ['cup', 'tea', 'sandwiches'],
              },
            ],
          },
        ],
      },
      {
        id: 'assessment',
        stageNumber: 6,
        type: 'assessment',
        titleUz: '6-Bosqich: Nazorat Testi',
        titleEn: 'Stage 6 — Assessment',
        blocks: [
          {
            type: 'AssessmentBlock',
            id: 'assess_count',
            titleUz: 'Countable & Uncountable Sinovi',
            descriptionUz: 'Kamida 70% to‘g‘ri javob bering:',
            passingThresholdPercent: 70,
            allowRetry: true,
            questions: [
              {
                id: 'cu_q1',
                difficulty: 'easy',
                ruleCoveredUz: 'Uncountable nouns',
                promptUz: 'Quyidagi so‘zlardan qaysi biri Uncountable (sanalmaydigan ot)?',
                questionType: 'multiple_choice',
                options: [
                  { id: 'a', textEn: 'water (suv)', isCorrect: true },
                  { id: 'b', textEn: 'book (kitob)', isCorrect: false },
                  { id: 'c', textEn: 'car (mashina)', isCorrect: false },
                ],
                explanationUz: 'Suv (water) suyuqlik bo‘lgani uchun donalab sanalmaydi.',
                knowledgeId: 'kw_noun_concept',
              },
            ],
          },
        ],
      },
      {
        id: 'wrap_up',
        stageNumber: 7,
        type: 'wrap_up',
        titleUz: '7-Bosqich: Yakuniy Xulosa',
        titleEn: 'Stage 7 — Wrap-Up',
        blocks: [
          {
            type: 'SummaryBlock',
            id: 'sum_count',
            titleUz: 'Countable & Uncountable darsini yakunladingiz!',
            learnedPointsUz: ['Donalab sanaladigan va sanalmaydigan otlar farqini bilib oldingiz.'],
            keyRulesUz: ['Countable: a book / books | Uncountable: some water'],
            nextStepRecommendationUz: 'Keyingi ost-mavzu: Concrete and Abstract Nouns.',
            unlockedPracticePathId: 'practice_path_nouns',
            nextSubtopicId: 'concrete_and_abstract_nouns',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 5. SUBTOPIC 5: CONCRETE AND ABSTRACT NOUNS
  // ==========================================================================
  concrete_and_abstract_nouns: {
    schemaVersion: SUBTOPIC_SCHEMA_VERSION,
    id: 'concrete_and_abstract_nouns',
    majorTopicId: 'nouns',
    majorTopicTitleUz: 'Nouns (Ot so‘z turkumi)',
    orderIndex: 5,
    title: {
      en: 'Concrete and Abstract Nouns',
      uz: 'Aniq va Mavhum Otlar',
    },
    level: 'A2',
    difficultyLabelUz: 'A2 · Elementary',
    estimatedMinutes: 8,
    iconEmoji: '💡',
    shortIntroUz:
      'Ko‘z bilan ko‘rib, qo‘l bilan ushlab bo‘ladigan narsalar — Concrete Nouns (book, table). His qilinadigan yoki o‘ylanadigan tushunchalar esa — Abstract Nouns (happiness, love, time).',
    whyUsefulUz: 'Fikrlaringiz, his-tuyg‘ularingiz va maqsadlaringiz haqida ravon gapirishga yordam beradi.',
    learningObjectivesUz: [
      'Concrete (moddiy: phone, flower) va Abstract (mavhum: freedom, happiness, friendship) otlarni farqlaysiz.',
    ],
    knowledgeIds: ['kw_noun_concept'],
    practicePathId: 'practice_path_nouns',
    nextSubtopicId: 'possessive_nouns',
    sections: [
      {
        id: 'introduction',
        stageNumber: 1,
        type: 'introduction',
        titleUz: '1-Bosqich: Kirish',
        titleEn: 'Stage 1 — Introduction',
        blocks: [
          {
            type: 'TipBlock',
            id: 'tip_conc_abs',
            titleUz: '5 ta sezgi qoidasi',
            bodyUz: 'Agar narsani ko‘rish, eshitish, hidlash, tatib ko‘rish yoki ushlash mumkin bo‘lsa — u Concrete Noun. Aks holda — Abstract Noun!',
            exampleEn: 'Health and happiness are important.',
            exampleUz: 'Salomatlik va baxt muhimdir.',
          },
        ],
      },
      {
        id: 'explanation',
        stageNumber: 2,
        type: 'explanation',
        titleUz: '2-Bosqich: Qoida',
        titleEn: 'Stage 2 — Explanation',
        blocks: [
          {
            type: 'RuleExplanation',
            id: 'rule_conc_abs',
            ruleId: 'kw_noun_concept',
            ruleTitleUz: 'Qoida: Aniq (Concrete) va Mavhum (Abstract) otlar',
            simpleExplanationUz: 'Concrete: book, apple, teacher. Abstract: love (sevgi), peace (tinchlik), knowledge (bilim), happiness (baxt).',
            questionsAnsweredUz: ['Nima? (Moddiy buyum yoki mavhum tushuncha)'],
            whenToUseUz: 'Fikr va tuyg‘ularni ifodalashda.',
            examples: [
              {
                text: 'Knowledge is power.',
                language: 'en',
                translation: 'Bilim — kuchdir.',
                translationLanguage: 'uz',
                speakable: true,
                highlightedWords: ['Knowledge', 'power'],
              },
            ],
          },
        ],
      },
      {
        id: 'examples',
        stageNumber: 3,
        type: 'examples',
        titleUz: '3-Bosqich: Misollar',
        titleEn: 'Stage 3 — Examples',
        blocks: [
          {
            type: 'ExampleSentence',
            id: 'ex_abs_1',
            sentence: {
              text: 'True friendship brings great happiness.',
              language: 'en',
              translation: 'Haqiqiy do‘stlik katta baxt keltiradi.',
              translationLanguage: 'uz',
              speakable: true,
              highlightedWords: ['friendship', 'happiness'],
            },
            explanationUz: 'friendship (do‘stlik) va happiness (baxt) — mavhum otlar (Abstract Nouns).',
          },
        ],
      },
      {
        id: 'guided_practice',
        stageNumber: 4,
        type: 'practice',
        titleUz: '4-Bosqich: Mini-Mashq',
        titleEn: 'Stage 4 — Guided Practice',
        blocks: [
          {
            type: 'ExerciseBlock',
            id: 'ex_conc_abs_blk',
            titleUz: 'Mavhum otni toping',
            subtitleUz: 'Savolga javob bering:',
            activities: [
              {
                id: 'ca_act_1',
                exerciseTemplateCode: 'parts_of_speech_identification',
                exerciseTypeLabelUz: 'Abstract Noun ni tanlang',
                questionUz: 'Quyidagi so‘zlardan qaysi biri Abstract Noun (mavhum ot)?',
                interactionMode: 'multiple_choice',
                options: [
                  { id: 'a', textEn: 'happiness (baxt)', isCorrect: true },
                  { id: 'b', textEn: 'table (stol)', isCorrect: false },
                ],
                explanationUz: '"Happiness" (baxt) — ko‘z bilan ko‘rib bo‘lmaydigan mavhum tushuncha.',
                knowledgeId: 'kw_noun_concept',
                allowRetry: true,
              },
            ],
          },
        ],
      },
      {
        id: 'real_life',
        stageNumber: 5,
        type: 'application',
        titleUz: '5-Bosqich: Hayotiy Muloqot',
        titleEn: 'Stage 5 — Real-Life Application',
        blocks: [
          {
            type: 'DialogueBlock',
            id: 'dlg_abs',
            titleUz: 'Kitob haqida fikr',
            contextUz: 'Suhbatni tinglang:',
            lines: [
              {
                speaker: 'Sara',
                avatarEmoji: '👩',
                english: 'This book gives useful knowledge.',
                uzbek: 'Bu kitob foydali bilim beradi.',
                highlightedWords: ['book', 'knowledge'],
              },
            ],
          },
        ],
      },
      {
        id: 'assessment',
        stageNumber: 6,
        type: 'assessment',
        titleUz: '6-Bosqich: Nazorat Testi',
        titleEn: 'Stage 6 — Assessment',
        blocks: [
          {
            type: 'AssessmentBlock',
            id: 'assess_abs',
            titleUz: 'Concrete & Abstract Nouns Sinovi',
            descriptionUz: 'Savolga javob bering:',
            passingThresholdPercent: 70,
            allowRetry: true,
            questions: [
              {
                id: 'abs_q1',
                difficulty: 'easy',
                ruleCoveredUz: 'Concrete vs Abstract',
                promptUz: '“Knowledge is power” gapidagi “knowledge” qanday ot?',
                questionType: 'multiple_choice',
                options: [
                  { id: 'a', textEn: 'Abstract Noun (Mavhum ot)', isCorrect: true },
                  { id: 'b', textEn: 'Concrete Noun (Moddiy buyum)', isCorrect: false },
                ],
                explanationUz: 'Bilim (knowledge) — mavhum ot.',
                knowledgeId: 'kw_noun_concept',
              },
            ],
          },
        ],
      },
      {
        id: 'wrap_up',
        stageNumber: 7,
        type: 'wrap_up',
        titleUz: '7-Bosqich: Yakuniy Xulosa',
        titleEn: 'Stage 7 — Wrap-Up',
        blocks: [
          {
            type: 'SummaryBlock',
            id: 'sum_abs',
            titleUz: 'Concrete & Abstract Nouns darsini tugatdingiz!',
            learnedPointsUz: ['Moddiy va mavhum otlarni farqlashni o‘rgandingiz.'],
            keyRulesUz: ['Concrete: book, table | Abstract: happiness, knowledge'],
            nextStepRecommendationUz: 'Keyingi ost-mavzu: Possessive Nouns (Qaratqich kelishigi).',
            unlockedPracticePathId: 'practice_path_nouns',
            nextSubtopicId: 'possessive_nouns',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 6. SUBTOPIC 6: POSSESSIVE NOUNS (QARATQICH KELISHIGI: 'S)
  // ==========================================================================
  possessive_nouns: {
    schemaVersion: SUBTOPIC_SCHEMA_VERSION,
    id: 'possessive_nouns',
    majorTopicId: 'nouns',
    majorTopicTitleUz: 'Nouns (Ot so‘z turkumi)',
    orderIndex: 6,
    title: {
      en: "Possessive Nouns ('s)",
      uz: 'Qaratqich Kelishigidagi Otlar (’s — ...ning)',
    },
    level: 'A1',
    difficultyLabelUz: 'A1 · Boshlang‘ich',
    estimatedMinutes: 8,
    iconEmoji: '🔑',
    shortIntroUz:
      'O‘zbek tilidagi "-ning" qo‘shimchasini (Alining kitobi) ingliz tilida qanday aytamiz? Otga apostrof va s (’s) qo‘shamiz: Ali’s book!',
    whyUsefulUz: 'Buyum kimga tegishli ekanligini (Whose?) aytish uchun har kuni ishlatiladi.',
    learningObjectivesUz: [
      'Shaxs otlariga "’s" qo‘shib egalik ma’nosini yasashni o‘rganasiz (Ali’s book, my sister’s phone).',
    ],
    knowledgeIds: ['kw_noun_concept', 'kw_noun_book'],
    practicePathId: 'practice_path_nouns',
    sections: [
      {
        id: 'introduction',
        stageNumber: 1,
        type: 'introduction',
        titleUz: '1-Bosqich: Kirish — Kimning buyumi?',
        titleEn: 'Stage 1 — Introduction',
        blocks: [
          {
            type: 'AnimationBlock',
            id: 'anim_poss',
            titleUz: "Owner + 's + Thing (...ning ...si)",
            visualSteps: [
              { emoji: '📖', labelEn: "Ali's book", labelUz: 'Alining kitobi' },
              { emoji: '👩‍🏫', labelEn: "the teacher's desk", labelUz: 'o‘qituvchining stoli' },
            ],
            summaryUz: 'Ega (shaxs) + ’s + buyum = kimga tegishli ekanligini bildiradi.',
          },
        ],
      },
      {
        id: 'explanation',
        stageNumber: 2,
        type: 'explanation',
        titleUz: '2-Bosqich: Qoida',
        titleEn: 'Stage 2 — Explanation',
        blocks: [
          {
            type: 'RuleExplanation',
            id: 'rule_poss',
            ruleId: 'kw_noun_concept',
            ruleTitleUz: "Qoida: Possessive 's (Kimning? — Whose?)",
            simpleExplanationUz: 'Birlikdagi shaxs otiga apostrof va s (’s) qo‘shilsa, o‘zbek tilidagi "-ning" qo‘shimchasi hosil bo‘ladi.',
            questionsAnsweredUz: ["Whose? (Kimning?) — Ali's book, Madina's bag"],
            whenToUseUz: 'Egalik va qarindoshlikni ifodalaganda.',
            formula: "[Person Noun]'s + [Thing Noun]",
            examples: [
              {
                text: "This is Ali's book.",
                language: 'en',
                translation: 'Bu Alining kitobi.',
                translationLanguage: 'uz',
                speakable: true,
                highlightedWords: ["Ali's", 'book'],
              },
            ],
          },
        ],
      },
      {
        id: 'examples',
        stageNumber: 3,
        type: 'examples',
        titleUz: '3-Bosqich: Misollar',
        titleEn: 'Stage 3 — Examples',
        blocks: [
          {
            type: 'ExampleSentence',
            id: 'ex_poss_1',
            sentence: {
              text: "My sister's school is in the city center.",
              language: 'en',
              translation: 'Singlimning maktabi shahar markazida.',
              translationLanguage: 'uz',
              speakable: true,
              highlightedWords: ["sister's", 'school'],
            },
            explanationUz: "sister's school = singlimning maktabi.",
          },
        ],
      },
      {
        id: 'guided_practice',
        stageNumber: 4,
        type: 'practice',
        titleUz: '4-Bosqich: Mini-Mashq',
        titleEn: 'Stage 4 — Guided Practice',
        blocks: [
          {
            type: 'ExerciseBlock',
            id: 'ex_poss_blk',
            titleUz: 'Qaratqich kelishigini tanlang',
            subtitleUz: 'Savolga javob bering:',
            activities: [
              {
                id: 'poss_act_1',
                exerciseTemplateCode: 'grammar_multiple_choice',
                exerciseTypeLabelUz: 'Possessive Noun tanlash',
                questionUz: '“Alining kitobi” ingliz tilida qanday bo‘ladi?',
                interactionMode: 'multiple_choice',
                options: [
                  { id: 'a', textEn: "Ali's book", isCorrect: true },
                  { id: 'b', textEn: 'Ali book', isCorrect: false },
                ],
                explanationUz: "Egalikni bildirish uchun ismdan keyin 's qo‘yiladi: Ali's book.",
                knowledgeId: 'kw_noun_book',
                allowRetry: true,
              },
            ],
          },
        ],
      },
      {
        id: 'real_life',
        stageNumber: 5,
        type: 'application',
        titleUz: '5-Bosqich: Hayotiy Muloqot',
        titleEn: 'Stage 5 — Real-Life Application',
        blocks: [
          {
            type: 'DialogueBlock',
            id: 'dlg_poss',
            titleUz: 'Bu kimning telefoni?',
            contextUz: 'Suhbatni tinglang:',
            lines: [
              {
                speaker: 'Jasur',
                avatarEmoji: '🧑',
                english: 'Whose phone is on the table?',
                uzbek: 'Stol ustidagi telefon kimniki?',
                highlightedWords: ['phone', 'table'],
              },
              {
                speaker: 'Madina',
                avatarEmoji: '👩',
                english: "It is our teacher's phone.",
                uzbek: 'Bu o‘qituvchimizning telefoni.',
                highlightedWords: ["teacher's", 'phone'],
              },
            ],
          },
        ],
      },
      {
        id: 'assessment',
        stageNumber: 6,
        type: 'assessment',
        titleUz: '6-Bosqich: Nazorat Testi',
        titleEn: 'Stage 6 — Assessment',
        blocks: [
          {
            type: 'AssessmentBlock',
            id: 'assess_poss',
            titleUz: "Possessive Nouns ('s) Sinovi",
            descriptionUz: 'Savolga javob bering:',
            passingThresholdPercent: 70,
            allowRetry: true,
            questions: [
              {
                id: 'poss_q1',
                difficulty: 'easy',
                ruleCoveredUz: "Possessive 's",
                promptUz: '“Mening do‘stimning mashinasi” iborasini toping:',
                questionType: 'multiple_choice',
                options: [
                  { id: 'a', textEn: "My friend's car", isCorrect: true },
                  { id: 'b', textEn: 'My friends car', isCorrect: false },
                ],
                explanationUz: "friend + 's = friend's (do‘stimning).",
                knowledgeId: 'kw_noun_concept',
              },
            ],
          },
        ],
      },
      {
        id: 'wrap_up',
        stageNumber: 7,
        type: 'wrap_up',
        titleUz: '7-Bosqich: Yakuniy Xulosa',
        titleEn: 'Stage 7 — Wrap-Up',
        blocks: [
          {
            type: 'SummaryBlock',
            id: 'sum_poss',
            titleUz: 'Tabriklaymiz! Nouns bo‘limining barcha 6 ta ost-mavzusini tugatdingiz!',
            learnedPointsUz: ["Possessive 's (-ning) qoidasini to‘liq o‘zlashtirdingiz."],
            keyRulesUz: ["Owner + 's + Noun = Ali's book"],
            nextStepRecommendationUz: 'Endi Practice Center (Amaliyot Markazi)da Nouns 8 bosqichli mashqlar yo‘lini yakunlang!',
            unlockedPracticePathId: 'practice_path_nouns',
          },
        ],
      },
    ],
  },

  // ==========================================================================
  // 7. HELLO FIRST STEPS (A0) & NUMBERS 0-10 SUBTOPICS
  // ==========================================================================
  hello_first_steps: {
    schemaVersion: SUBTOPIC_SCHEMA_VERSION,
    id: 'hello_first_steps',
    majorTopicId: 'greetings_and_foundations',
    majorTopicTitleUz: 'Ilk Qadamlar (A0)',
    orderIndex: 1,
    title: {
      en: 'Hello! First 6 Words & LEGO Sentences',
      uz: 'Salomlashish va Ilk Gaplar (A0)',
    },
    level: 'A0',
    difficultyLabelUz: 'A0 · Noldan Boshlovchilar',
    estimatedMinutes: 6,
    iconEmoji: '👋',
    shortIntroUz: 'Ingliz tilini noldan, eng kerakli 6 ta so‘z va LEGO usulida gap tuzishdan boshlaymiz.',
    whyUsefulUz: 'Har qanday suhbat salomlashish va o‘zini tanishtirishdan boshlanadi.',
    learningObjectivesUz: ['Hello, Hi, Thank you, I am, Welcome, Goodbye so‘zlarini o‘rganasiz.'],
    knowledgeIds: ['kw_hello', 'kw_hi', 'kw_thank_you', 'kw_i_am', 'kw_welcome', 'kw_goodbye'],
    practicePathId: 'practice_path_hello_a0',
    nextSubtopicId: 'what_is_a_noun',
    sections: [
      {
        id: 'introduction',
        stageNumber: 1,
        type: 'introduction',
        titleUz: '1-Bosqich: Kirish',
        titleEn: 'Stage 1 — Introduction',
        blocks: [
          {
            type: 'TipBlock',
            id: 'tip_hello_1',
            titleUz: 'Welcome to TalkMe!',
            bodyUz: 'Xavotir olmang, ingliz tilini bilishingiz shart emas. Biz hammasini juda oson qilib o‘rgatamiz.',
            exampleEn: 'Hello! Welcome to TalkMe!',
            exampleUz: 'Salom! TalkMe ga xush kelibsiz!',
          },
        ],
      },
      {
        id: 'explanation',
        stageNumber: 2,
        type: 'explanation',
        titleUz: '2-Bosqich: Qoida (LEGO Gap Tuzish)',
        titleEn: 'Stage 2 — Explanation',
        blocks: [
          {
            type: 'RuleExplanation',
            id: 'rule_hello_lego',
            ruleId: 'kw_i_am',
            ruleTitleUz: 'Qoida: So‘zlarni LEGO kabi ulab gap tuzamiz',
            simpleExplanationUz: '"I" (Men) + "am" (...man) + "happy" (xursand) = "I am happy." (Men xursandman.)',
            questionsAnsweredUz: ['Kim? Qanday holatda? — I am happy.'],
            whenToUseUz: 'O‘zingiz haqingizda gapirganda.',
            formula: 'I + am + [ism / holat]',
            examples: [
              {
                text: 'I am happy.',
                language: 'en',
                translation: 'Men xursandman.',
                translationLanguage: 'uz',
                speakable: true,
                highlightedWords: ['I', 'am', 'happy'],
              },
            ],
          },
        ],
      },
      {
        id: 'examples',
        stageNumber: 3,
        type: 'examples',
        titleUz: '3-Bosqich: Ilk 6 ta So‘z',
        titleEn: 'Stage 3 — Examples',
        blocks: [
          {
            type: 'VocabularyCard',
            id: 'vc_hello_6',
            titleUz: 'Ilk 6 ta So‘z (Bosib eshiting)',
            words: [
              {
                id: 'h1',
                knowledgeId: 'kw_hello',
                wordEn: 'Hello',
                translationUz: 'Salom',
                phonetic: '/həˈloʊ/',
                categoryUz: 'Salomlashish',
                emoji: '👋',
                exampleSentenceEn: 'Hello! Welcome!',
                exampleSentenceUz: 'Salom! Xush kelibsiz!',
              },
              {
                id: 'h2',
                knowledgeId: 'kw_thank_you',
                wordEn: 'Thank you',
                translationUz: 'Rahmat',
                phonetic: '/θæŋk juː/',
                categoryUz: 'Minnatdorchilik',
                emoji: '❤️',
                exampleSentenceEn: 'Thank you very much!',
                exampleSentenceUz: 'Katta rahmat!',
              },
            ],
          },
        ],
      },
      {
        id: 'guided_practice',
        stageNumber: 4,
        type: 'practice',
        titleUz: '4-Bosqich: Mini-Mashq',
        titleEn: 'Stage 4 — Guided Practice',
        blocks: [
          {
            type: 'ExerciseBlock',
            id: 'ex_hello_blk',
            titleUz: 'Kichik mashq',
            subtitleUz: 'To‘g‘ri javobni tanlang:',
            activities: [
              {
                id: 'h_act_1',
                exerciseTemplateCode: 'word_to_translation',
                exerciseTypeLabelUz: 'Tarjimani toping',
                questionUz: '“Welcome” so‘zining ma’nosi nima?',
                interactionMode: 'multiple_choice',
                options: [
                  { id: 'a', textEn: 'Xush kelibsiz', isCorrect: true },
                  { id: 'b', textEn: 'Xayr', isCorrect: false },
                ],
                explanationUz: 'Welcome = Xush kelibsiz.',
                knowledgeId: 'kw_welcome',
                allowRetry: true,
              },
            ],
          },
        ],
      },
      {
        id: 'real_life',
        stageNumber: 5,
        type: 'application',
        titleUz: '5-Bosqich: Muloqot',
        titleEn: 'Stage 5 — Real-Life Application',
        blocks: [
          {
            type: 'DialogueBlock',
            id: 'dlg_hello_1',
            titleUz: 'Ilk uchrashuv',
            contextUz: 'Suhbatni tinglang:',
            lines: [
              {
                speaker: 'Alex',
                avatarEmoji: '🧑',
                english: 'Hello! Welcome to TalkMe!',
                uzbek: 'Salom! TalkMe ga xush kelibsiz!',
                highlightedWords: ['Hello', 'Welcome'],
              },
              {
                speaker: 'Student',
                avatarEmoji: '🙋',
                english: 'Hi! Thank you! I am happy.',
                uzbek: 'Salom! Rahmat! Men xursandman.',
                highlightedWords: ['Hi', 'Thank', 'happy'],
              },
            ],
          },
        ],
      },
      {
        id: 'assessment',
        stageNumber: 6,
        type: 'assessment',
        titleUz: '6-Bosqich: Nazorat Testi',
        titleEn: 'Stage 6 — Assessment',
        blocks: [
          {
            type: 'AssessmentBlock',
            id: 'assess_hello_1',
            titleUz: '1-Dars Sinovi',
            descriptionUz: 'Savollarga javob bering:',
            passingThresholdPercent: 70,
            allowRetry: true,
            questions: [
              {
                id: 'hq1',
                difficulty: 'easy',
                ruleCoveredUz: 'LEGO gap tuzish',
                promptUz: '“Men xursandman.” gapini inglizcha so‘zlardan tuzing:',
                questionType: 'sentence_builder',
                sentenceTokens: ['happy', 'I', 'am'],
                correctAnswerText: 'I am happy',
                explanationUz: 'I + am + happy.',
                knowledgeId: 'kw_i_am',
              },
            ],
          },
        ],
      },
      {
        id: 'wrap_up',
        stageNumber: 7,
        type: 'wrap_up',
        titleUz: '7-Bosqich: Yakuniy Xulosa',
        titleEn: 'Stage 7 — Wrap-Up',
        blocks: [
          {
            type: 'SummaryBlock',
            id: 'sum_hello_1',
            titleUz: 'Ilk darsni a’lo yakunladingiz!',
            learnedPointsUz: ['6 ta oltin so‘z va "I am happy" gapini o‘rgandingiz.'],
            keyRulesUz: ['I + am + happy = Men xursandman.'],
            nextStepRecommendationUz: 'Keyingi qadam: Nouns — “What is a Noun?” (Ot nima?) mikro-kursi!',
            unlockedPracticePathId: 'practice_path_hello_a0',
            nextSubtopicId: 'what_is_a_noun',
          },
        ],
      },
    ],
  },

  numbers_0_10_subtopic: {
    schemaVersion: SUBTOPIC_SCHEMA_VERSION,
    id: 'numbers_0_10_subtopic',
    majorTopicId: 'numbers_and_counting',
    majorTopicTitleUz: 'Numbers (Raqamlar)',
    orderIndex: 1,
    title: {
      en: 'Numbers 0–10 in Real Life',
      uz: '0 dan 10 gacha Sonlar',
    },
    level: 'A0',
    difficultyLabelUz: 'A0–A1 · Boshlang‘ich',
    estimatedMinutes: 7,
    iconEmoji: '🔢',
    shortIntroUz: 'Ingliz tilida 0 dan 10 gacha sanashni, telefon raqamlari va narxlarni aytishni o‘rganamiz.',
    whyUsefulUz: 'Vaqt, narx va miqdorni aytish uchun eng kerakli mavzu.',
    learningObjectivesUz: ['Zero dan Ten gacha sonlarni talaffuz qilish va yozishni bilib olasiz.'],
    knowledgeIds: ['kw_num_0_10', 'kw_num_real_life'],
    practicePathId: 'practice_path_numbers',
    sections: [
      {
        id: 'introduction',
        stageNumber: 1,
        type: 'introduction',
        titleUz: '1-Bosqich: Kirish',
        titleEn: 'Stage 1 — Introduction',
        blocks: [
          {
            type: 'AnimationBlock',
            id: 'anim_num_0_10',
            titleUz: '1 dan 10 gacha Sonlar',
            visualSteps: [
              { emoji: '1️⃣', labelEn: 'One, Two, Three', labelUz: '1, 2, 3' },
              { emoji: '5️⃣', labelEn: 'Four, Five, Six', labelUz: '4, 5, 6' },
              { emoji: '🔟', labelEn: 'Seven, Eight, Nine, Ten', labelUz: '7, 8, 9, 10' },
            ],
            summaryUz: 'Sonlar otlardan oldin kelib, ularning miqdorini bildiradi (three books).',
          },
        ],
      },
      {
        id: 'explanation',
        stageNumber: 2,
        type: 'explanation',
        titleUz: '2-Bosqich: Qoida',
        titleEn: 'Stage 2 — Explanation',
        blocks: [
          {
            type: 'RuleExplanation',
            id: 'rule_num_noun',
            ruleId: 'kw_num_0_10',
            ruleTitleUz: 'Qoida: Son + Ot (Number + Plural Noun)',
            simpleExplanationUz: '1 dan katta sonlardan keyin keladigan ot ko‘plikda (-s bilan) bo‘ladi: one book → three books.',
            questionsAnsweredUz: ['How many? (Nechta?) — three apples, seven days'],
            whenToUseUz: 'Miqdorni aytganda.',
            formula: '[Number >= 2] + [Noun + s]',
            examples: [
              {
                text: 'I have three apples and five books.',
                language: 'en',
                translation: 'Menda uchta olma va beshta kitob bor.',
                translationLanguage: 'uz',
                speakable: true,
                highlightedWords: ['three', 'five'],
              },
            ],
          },
        ],
      },
      {
        id: 'examples',
        stageNumber: 3,
        type: 'examples',
        titleUz: '3-Bosqich: Misollar',
        titleEn: 'Stage 3 — Examples',
        blocks: [
          {
            type: 'ExampleSentence',
            id: 'ex_num_s1',
            sentence: {
              text: 'There are seven days in a week.',
              language: 'en',
              translation: 'Bir haftada yetti kun bor.',
              translationLanguage: 'uz',
              speakable: true,
              highlightedWords: ['seven', 'days'],
            },
            explanationUz: 'seven (7) + days (kunlar).',
          },
        ],
      },
      {
        id: 'guided_practice',
        stageNumber: 4,
        type: 'practice',
        titleUz: '4-Bosqich: Mini-Mashq',
        titleEn: 'Stage 4 — Guided Practice',
        blocks: [
          {
            type: 'ExerciseBlock',
            id: 'ex_num_blk',
            titleUz: 'Raqamni toping',
            subtitleUz: 'Savolga javob bering:',
            activities: [
              {
                id: 'num_act_1',
                exerciseTemplateCode: 'number_recognition',
                exerciseTypeLabelUz: 'Raqamni so‘z bilan yozish',
                questionUz: '“7” raqami ingliz tilida qanday yoziladi?',
                interactionMode: 'multiple_choice',
                options: [
                  { id: 'a', textEn: 'seven', isCorrect: true },
                  { id: 'b', textEn: 'three', isCorrect: false },
                ],
                explanationUz: '7 = seven.',
                knowledgeId: 'kw_num_0_10',
                allowRetry: true,
              },
            ],
          },
        ],
      },
      {
        id: 'real_life',
        stageNumber: 5,
        type: 'application',
        titleUz: '5-Bosqich: Hayotiy Muloqot',
        titleEn: 'Stage 5 — Real-Life Application',
        blocks: [
          {
            type: 'DialogueBlock',
            id: 'dlg_num_coffee',
            titleUz: 'Qahvaxonada narx so‘rash',
            contextUz: 'Suhbatni tinglang:',
            lines: [
              {
                speaker: 'Buyer',
                avatarEmoji: '🧑',
                english: 'How much is this coffee?',
                uzbek: 'Bu qahva necha pul turadi?',
                highlightedWords: ['coffee'],
              },
              {
                speaker: 'Barista',
                avatarEmoji: '🧑‍🍳',
                english: 'It is five dollars.',
                uzbek: 'U besh dollar turadi.',
                highlightedWords: ['five', 'dollars'],
              },
            ],
          },
        ],
      },
      {
        id: 'assessment',
        stageNumber: 6,
        type: 'assessment',
        titleUz: '6-Bosqich: Nazorat Testi',
        titleEn: 'Stage 6 — Assessment',
        blocks: [
          {
            type: 'AssessmentBlock',
            id: 'assess_num_0_10',
            titleUz: 'Numbers 0–10 Sinovi',
            descriptionUz: 'Savolga javob bering:',
            passingThresholdPercent: 70,
            allowRetry: true,
            questions: [
              {
                id: 'nq1',
                difficulty: 'easy',
                ruleCoveredUz: 'Numbers 0–10',
                promptUz: '“10” sonini ingliz tilida yozing:',
                questionType: 'fill_blank',
                correctAnswerText: 'ten',
                explanationUz: '10 = ten.',
                knowledgeId: 'kw_num_0_10',
              },
            ],
          },
        ],
      },
      {
        id: 'wrap_up',
        stageNumber: 7,
        type: 'wrap_up',
        titleUz: '7-Bosqich: Yakuniy Xulosa',
        titleEn: 'Stage 7 — Wrap-Up',
        blocks: [
          {
            type: 'SummaryBlock',
            id: 'sum_num_0_10',
            titleUz: 'Numbers 0–10 mikro-kursini yakunladingiz!',
            learnedPointsUz: ['0 dan 10 gacha sonlar va ularni otlar bilan qo‘llashni o‘rgandingiz.'],
            keyRulesUz: ['Number (2..10) + Plural Noun (-s)'],
            nextStepRecommendationUz: 'Practice Center da Numbers 5 bosqichli amaliyot yo‘lini bajaring!',
            unlockedPracticePathId: 'practice_path_numbers',
          },
        ],
      },
    ],
  },
};
