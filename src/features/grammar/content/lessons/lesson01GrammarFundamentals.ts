import { LearningLesson } from '../../types/grammarFrameworkTypes';
import { LESSON_01_HELLO_A0 } from './lesson01HelloBeginner';

/**
 * COMPLETE DATA-DRIVEN LESSON 1: GRAMMAR FUNDAMENTALS
 * (Ingliz tili grammatikasi asoslari)
 *
 * Strictly implements:
 * - Sections 1–8 of Part 9 in natural, beginner-friendly Uzbek
 * - 8 Target Vocabulary items (Student, Teacher, Book, School, Read, Write, Learn, Sentence)
 *   + Phonetics-only examples marked isTargetVocabulary: false
 * - 10 Progressive Interactive Activities (Activities 1–10 including Playable 2D Crossword)
 * - 10-Question Final Assessment covering all 10 required foundational concepts
 * - Mandatory final section: Wrap-up (NEVER Warm-up)
 */
export const LESSON_01_GRAMMAR_FUNDAMENTALS: LearningLesson = {
  id: 'lesson_01_grammar_fundamentals',
  courseId: 'grammar_fundamentals',
  moduleId: 'mod_1_grammar_fundamentals',
  purpose: 'grammar',
  version: 2,
  status: 'published',
  level: 'A1',
  difficulty: 'beginner',
  estimatedDuration: 25,

  title: {
    uz: 'Ingliz tili grammatikasi asoslari',
    en: 'Grammar Fundamentals',
  },
  subtitle: {
    uz: 'A1 Foundation · Til elementlari, S+V+O gap tartibi, 8 ta so‘z turkumi va gap turlari',
    en: 'How English language elements are organized and how words form sentences',
  },
  description: {
    uz: 'Ushbu fundamental dars sizga ingliz tili qanday ishlashini, harf va tovushlardan tortib so‘z, ibora, klauza va to‘liq gapgacha bo‘lgan tizimni tushunarli o‘zbek tilida o‘rgatadi.',
    en: 'Complete foundational introduction to English grammar structure for Uzbek learners.',
  },

  objectives: [
    {
      id: 'obj_gf_01_why_grammar',
      description: {
        uz: 'Grammatika nima ekanini va so‘zlarni to‘g‘ri tartibga solish nima uchun muloqotda hal qiluvchi ahamiyatga ega ekanini tushunish ("I student am" vs "I am a student").',
      },
      grammarRuleId: 'rule_gf_01_word_order_meaning',
    },
    {
      id: 'obj_gf_02_letters_sounds_words',
      description: {
        uz: 'Harf (letter), tovush (sound), so‘z (word), imlo (spelling) va talaffuz (pronunciation) farqlarini hamda 5 ta unli (A, E, I, O, U) va 21 ta undosh harfni ajratish.',
      },
      grammarRuleId: 'rule_gf_02_letters_sounds_words',
    },
    {
      id: 'obj_gf_03_hierarchy',
      description: {
        uz: 'Til birliklari zanjirini (Letter → Word → Phrase → Clause → Sentence) farqlash va ibora bilan to‘liq gap o‘rtasidagi chegarani bilish.',
      },
      grammarRuleId: 'rule_gf_03_unit_hierarchy',
    },
    {
      id: 'obj_gf_04_parts_of_speech',
      description: {
        uz: '8 ta an’anaviy so‘z turkumi (Noun, Pronoun, Verb, Adjective, Adverb, Preposition, Conjunction, Interjection) hamda artikllarning gapdagi vazifasini tanish.',
      },
      grammarRuleId: 'rule_gf_04_parts_of_speech',
    },
    {
      id: 'obj_gf_05_svo_structure',
      description: {
        uz: 'Ingliz tilining tayanch Subject + Verb + Object (Ega + Fe’l + To‘ldiruvchi) qolipini o‘zbek tilidagi so‘z tartibi (SOV) bilan qiyoslab qo‘llash.',
      },
      grammarRuleId: 'rule_gf_05_svo_pattern',
    },
    {
      id: 'obj_gf_06_sentence_types_and_mechanics',
      description: {
        uz: '4 xil gap turini (Declarative, Interrogative, Imperative, Exclamatory), bosh harf (Capitalization), tinish belgilari (Punctuation), ko‘plik (-s) va qisqartmalarni (Contractions) amalda qo‘llash.',
      },
      grammarRuleId: 'rule_gf_06_sentence_types',
    },
  ],

  grammarRules: [
    {
      id: 'rule_gf_01_word_order_meaning',
      nameEn: 'Grammar as Word Organization',
      nameUz: '1-Qoida: Grammatika — so‘zlarni ma’noli tartibga solish tizimi',
      shortSummaryUz:
        'Ingliz tilida so‘zlarni shunchaki ketma-ket aytish yetarli emas; ularni to‘g‘ri grammatik tartibda va kerakli yordamchi so‘zlar bilan bog‘lash shart.',
      whyRuleExistsUz:
        'O‘zbek tilida so‘z oxiriga qo‘shiladigan qo‘shimchalar (-man, -ni, -da) ma’noni ko‘rsatadi. Ingliz tilida esa bunday qo‘shimchalar juda kam bo‘lgani uchun so‘zlarning gapdagi O‘RNI ma’noni belgilaydi.',
      formula: 'I am a student. (Ega + bog‘lama fe’l + artikl + ot)',
      commonQuestionsAnsweredUz: 'Gap qanday qilib tushunarli fikrga aylanadi?',
      functionInSentenceUz: 'Tarqoq so‘zlarni mantiqiy va tushunarli muloqot birligiga aylantiradi.',
      relatedExampleIds: ['ex_gf_01_student_am'],
      relatedLessonIds: ['lesson_01_grammar_fundamentals'],
      difficulty: 'beginner',
    },
    {
      id: 'rule_gf_02_letters_sounds_words',
      nameEn: 'Letters, Sounds, Spelling, and Words',
      nameUz: '2-Qoida: Harf (Letter), Tovush (Sound) va So‘z (Word) farqi',
      shortSummaryUz:
        'Ingliz alifbosida 26 ta harf bor (5 ta unli: A, E, I, O, U va 21 ta undosh; Y harfi ba’zan unli tovush beradi). Harf — yozuvdagi belgi, tovush — biz eshitadigan va talaffuz qiladigan ovoz, so‘z esa ma’noga ega birlikdir.',
      whyRuleExistsUz:
        'Ingliz tilida bir harf turli so‘zlarda turlicha o‘qilishi yoki bir nechta harf bitta tovushni berishi mumkin (masalan, "sh" yoki "oo"). Shu sababli yozilishi (spelling) va o‘qilishi (pronunciation) har doim bir xil bo‘lmaydi.',
      formula: 'C + A + T = CAT (Harflar birlashib ma’noli so‘z hosil qiladi)',
      commonQuestionsAnsweredUz: 'Harf bilan so‘zning va yozuv bilan talaffuzning farqi nimada?',
      functionInSentenceUz: 'So‘zlarni to‘g‘ri o‘qish va yozish poydevorini yaratadi.',
      relatedExampleIds: ['ex_gf_02_cat_word'],
      relatedLessonIds: ['lesson_01_grammar_fundamentals'],
      difficulty: 'beginner',
    },
    {
      id: 'rule_gf_03_unit_hierarchy',
      nameEn: 'Letter → Word → Phrase → Clause → Sentence Hierarchy',
      nameUz: '3-Qoida: Til birliklari zanjiri (So‘z → Ibora → Klauza → Gap)',
      shortSummaryUz:
        'Word — bitta ma’noli so‘z (book). Phrase — birgalikda ishlaydigan, lekin tugallangan fikr bildirmaydigan so‘zlar guruhi (a beautiful house). Clause — tarkibida Ega va Fe’l qatnashgan qism (She is reading). Sentence — to‘liq tugallangan fikrni ifodalovchi gap.',
      whyRuleExistsUz:
        'Ko‘پchilik o‘rganuvchilar "in the classroom" yoki "my new book" kabi iboralarni (phrase) to‘liq gap deb o‘ylashadi. Lekin ularda harakat (fe’l) va tugallangan xabar yo‘q.',
      formula: 'Letter → Word → Phrase → Clause → Sentence',
      commonQuestionsAnsweredUz: 'Ibora (phrase) bilan to‘liq gapning (sentence) farqi nimada?',
      functionInSentenceUz: 'Kichik so‘zlardan bosqichma-bosqich to‘liq gap qurishni ta’minlaydi.',
      relatedExampleIds: ['ex_gf_03_phrase_vs_sentence'],
      relatedLessonIds: ['lesson_01_grammar_fundamentals'],
      difficulty: 'beginner',
    },
    {
      id: 'rule_gf_04_parts_of_speech',
      nameEn: 'Eight Parts of Speech and Articles',
      nameUz: '4-Qoida: 8 ta so‘z turkumi (Parts of Speech) va Artikllar',
      shortSummaryUz:
        'Har bir so‘z gapda o‘z vazifasiga ega: Noun (Ot), Pronoun (Olmosh), Verb (Fe’l), Adjective (Sifat), Adverb (Ravish), Preposition (Predlog), Conjunction (Bog‘lovchi), Interjection (Undov) hamda Article/Determiner (Artikl va aniqlovchilar).',
      whyRuleExistsUz:
        'So‘zning qaysi turkumga mansubligini bilish uning gapda qayerda kelishini (masalan, sifat otdan oldin kelishini) tushunishga yordam beradi.',
      formula: 'The (Art) + young (Adj) + student (Noun) + reads (Verb) + an (Art) + interesting (Adj) + book (Noun).',
      commonQuestionsAnsweredUz: 'Kim?/Nima? (Noun), Nima qiladi? (Verb), Qanday? (Adjective), Qay tarzda? (Adverb)',
      functionInSentenceUz: 'Gapdagi har bir so‘zning grammatik rolini belgilaydi.',
      relatedExampleIds: ['ex_gf_04_young_student_breakdown'],
      relatedLessonIds: ['lesson_01_grammar_fundamentals', 'lesson_02_parts_of_speech_intro'],
      difficulty: 'beginner',
    },
    {
      id: 'rule_gf_05_svo_pattern',
      nameEn: 'Basic Subject + Verb + Object (SVO) Order',
      nameUz: '5-Qoida: Ingliz gapining Subject + Verb + Object (S+V+O) tartibi',
      shortSummaryUz:
        'Ingliz tilidagi eng asosiy darak gap qolipida avval Subject (Ega — Kim?), keyin Verb (Fe’l — Nima qiladi?), undan keyin esa Object (To‘ldiruvchi — Nimani?) keladi.',
      whyRuleExistsUz:
        'O‘zbek tilida fe’l gapning eng oxirida keladi ("Men kitob o‘qiyman" — Ega + To‘ldiruvchi + Fe’l). Agar o‘zbekcha tartibda so‘zma-so‘z "I books read" deb tarjima qilsak, ingliz tilida xato gap hosil bo‘ladi.',
      formula: 'Subject (I) + Verb (read) + Object (books)',
      commonQuestionsAnsweredUz: 'Kim? → Nima qiladi? → Nimani / Kimni?',
      functionInSentenceUz: 'Ingliz tilida tabiiy va tushunarli gap tuzishning asosiy qolipi.',
      relatedExampleIds: ['ex_gf_05_svo_examples'],
      relatedLessonIds: ['lesson_01_grammar_fundamentals'],
      difficulty: 'beginner',
    },
    {
      id: 'rule_gf_06_sentence_types',
      nameEn: 'Four Main Sentence Types',
      nameUz: '6-Qoida: 4 xil asosiy gap turlari (Declarative, Interrogative, Imperative, Exclamatory)',
      shortSummaryUz:
        'Declarative — xabar beradi (nuqta bilan tugaydi). Interrogative — savol so‘raydi (so‘roq belgisi bilan). Imperative — buyruq yoki iltimos bildiradi. Exclamatory — kuchli his-hayajonni ifodalaydi (undov belgisi bilan).',
      whyRuleExistsUz:
        'Muloqotda biz faqat ma’lumot bermaymiz, balki savol so‘raymiz, iltimos qilamiz va hayratlanamiz. Har bir maqsad o‘z grammatik tuzilishi va tinish belgisini talab qiladi.',
      formula: 'Declarative (.) | Interrogative (?) | Imperative (. / !) | Exclamatory (!)',
      commonQuestionsAnsweredUz: 'Gap qanday maqsadda aytilgan?',
      functionInSentenceUz: 'Fikr maqsadini va ohangini aniq yetkazadi.',
      relatedExampleIds: ['ex_gf_06_four_sentence_types'],
      relatedLessonIds: ['lesson_01_grammar_fundamentals'],
      difficulty: 'beginner',
    },
    {
      id: 'rule_gf_07_basic_mechanics',
      nameEn: 'Capitalization, Punctuation, Plurals, Contractions, and Demonstratives',
      nameUz: '7-Qoida: Bosh harf, Tinish belgilari, Birlik/Ko‘plik va Qisqartmalar',
      shortSummaryUz:
        'Gap boshi, shaxs/joy nomlari va "I" (Men) olmoshi doim bosh harf bilan yoziladi. Ko‘plikda otlarga odatda "-s" qo‘shiladi (book → books). Og‘zaki va kundalik nutqda qisqartmalar (I am → I’m, Do not → Don’t) hamda There is/are, It/This/That keng qo‘llanadi.',
      whyRuleExistsUz:
        'Yozma va og‘zaki nutqning savodli, aniq va tabiiy bo‘lishini ta’minlaydi.',
      formula: 'I am → I’m | book → books | There is (1) / There are (2+) | This (yaqin) / That (uzoq)',
      commonQuestionsAnsweredUz: 'Gap qanday to‘g‘ri yoziladi va qisqartiriladi?',
      functionInSentenceUz: 'Imlo, son va ko‘rsatish aniqligini beradi.',
      relatedExampleIds: ['ex_gf_07_mechanics_contractions'],
      relatedLessonIds: ['lesson_01_grammar_fundamentals'],
      difficulty: 'beginner',
    },
  ],

  vocabulary: [
    {
      id: 'voc_gf_student',
      wordEn: 'Student',
      translationUz: 'O‘quvchi / Talaba',
      ipa: '/ˈstuː.dənt/',
      partOfSpeech: 'Noun',
      exampleEn: 'I am a student.',
      exampleUz: 'Men o‘quvchiman (talabaman).',
      difficulty: 'beginner',
      audioText: 'Student. I am a student.',
      courseSource: 'grammar',
      isTargetVocabulary: true,
    },
    {
      id: 'voc_gf_teacher',
      wordEn: 'Teacher',
      translationUz: 'O‘qituvchi',
      ipa: '/ˈtiː.tʃər/',
      partOfSpeech: 'Noun',
      exampleEn: 'My new teacher speaks clearly.',
      exampleUz: 'Mening yangi o‘qituvchim aniq gapiradi.',
      difficulty: 'beginner',
      audioText: 'Teacher. My new teacher speaks clearly.',
      courseSource: 'grammar',
      isTargetVocabulary: true,
    },
    {
      id: 'voc_gf_book',
      wordEn: 'Book',
      translationUz: 'Kitob',
      ipa: '/bʊk/',
      partOfSpeech: 'Noun',
      exampleEn: 'The student reads a book.',
      exampleUz: 'O‘quvchi kitob o‘qiydi.',
      difficulty: 'beginner',
      audioText: 'Book. The student reads a book.',
      courseSource: 'grammar',
      isTargetVocabulary: true,
    },
    {
      id: 'voc_gf_school',
      wordEn: 'School',
      translationUz: 'Maktab',
      ipa: '/skuːl/',
      partOfSpeech: 'Noun',
      exampleEn: 'We go to school every day.',
      exampleUz: 'Biz har kuni maktabga boramiz.',
      difficulty: 'beginner',
      audioText: 'School. We go to school every day.',
      courseSource: 'grammar',
      isTargetVocabulary: true,
    },
    {
      id: 'voc_gf_read',
      wordEn: 'Read',
      translationUz: 'O‘qimoq',
      ipa: '/riːd/',
      partOfSpeech: 'Verb',
      exampleEn: 'I read books every evening.',
      exampleUz: 'Men har kuni kechqurun kitoblar o‘qiyman.',
      difficulty: 'beginner',
      audioText: 'Read. I read books every evening.',
      courseSource: 'grammar',
      isTargetVocabulary: true,
    },
    {
      id: 'voc_gf_write',
      wordEn: 'Write',
      translationUz: 'Yozmoq',
      ipa: '/raɪt/',
      partOfSpeech: 'Verb',
      exampleEn: 'Students write sentences in the notebook.',
      exampleUz: 'O‘quvchilar daftarga gaplar yozadilar.',
      difficulty: 'beginner',
      audioText: 'Write. Students write sentences in the notebook.',
      courseSource: 'grammar',
      isTargetVocabulary: true,
    },
    {
      id: 'voc_gf_learn',
      wordEn: 'Learn',
      translationUz: 'O‘rganmoq',
      ipa: '/lɜːrn/',
      partOfSpeech: 'Verb',
      exampleEn: 'We learn English grammar step by step.',
      exampleUz: 'Biz ingliz tili grammatikasini bosqichma-bosqich o‘rganamiz.',
      difficulty: 'beginner',
      audioText: 'Learn. We learn English grammar step by step.',
      courseSource: 'grammar',
      isTargetVocabulary: true,
    },
    {
      id: 'voc_gf_sentence',
      wordEn: 'Sentence',
      translationUz: 'Gap',
      ipa: '/ˈsen.təns/',
      partOfSpeech: 'Noun',
      exampleEn: 'A sentence expresses a complete thought.',
      exampleUz: 'Gap tugallangan fikrni ifodalaydi.',
      difficulty: 'beginner',
      audioText: 'Sentence. A sentence expresses a complete thought.',
      courseSource: 'grammar',
      isTargetVocabulary: true,
    },
    // Phonetics illustration word (Rule 3 of Part 5.1: must NOT count automatically as learned target vocabulary)
    {
      id: 'voc_phonetics_demo_fish',
      wordEn: 'Fish',
      translationUz: 'Baliq (tovush va harf namunasi)',
      ipa: '/fɪʃ/',
      partOfSpeech: 'Noun',
      exampleEn: 'F - I - S - H has four letters and three sounds.',
      exampleUz: 'FISH so‘zida 4 ta harf va 3 ta tovush bor.',
      difficulty: 'beginner',
      audioText: 'Fish.',
      courseSource: 'phonetics',
      isTargetVocabulary: false,
    },
  ],

  theorySubtopics: [
    // ==================== SECTION 1: INTRODUCTION ====================
    {
      id: 'subtopic_01_intro',
      sectionNumber: 1,
      titleEn: 'Section 1 — Introduction to English Grammar',
      titleUz: '1-Bo‘lim: Ingliz tili grammatikasi nima va u bizga nima uchun kerak?',
      analogyOrIntroUz:
        'Tasavvur qiling: sizda g‘ishtlar, deraza va eshik bor. Agar ularni tartibsiz ustma-ust tashlab qo‘ysangiz, uy hosil bo‘lmaydi — faqat g‘isht uyumi bo‘ladi. So‘zlar ham xuddi g‘ishtlarga o‘xshaydi, Grammatika esa ularni chiroyli va mustahkam "gap uyi"ga aylantiradigan qurilish qoidalaridir.',
      paragraphsUz: [
        'Ingliz tili grammatikasi (English Grammar) — bu so‘zlarni to‘g‘ri shaklda va to‘g‘ri tartibda bir-biriga bog‘lab, fikrimizni boshqa insonlarga aniq yetkazish tizimidir.',
        'Agar biz inglizcha so‘zlarni yodlasak-u, lekin ularni to‘g‘ri tartibda joylashtirmasak, tinglovchi bizni tushunmasligi yoki xato tushunishi mumkin.',
        'Ushbu kursda siz eng oddiy tushunchalardan — harf, tovush va so‘zdan boshlab, gap bo‘laklari, so‘z turkumlari va zamonlargacha bosqichma-bosqich, oson o‘zbek tilida o‘rganasiz.',
      ],
      comparisonCards: [
        {
          wrongEn: 'I student am.',
          rightEn: 'I am a student.',
          meaningUz: 'Men o‘quvchiman (talabaman).',
          whyUz:
            'O‘zbek tilida "Men o‘quvchiman" deganimizda "-man" qo‘shimchasi oxirida keladi. Lekin ingliz tilida Ega ("I") dan keyin darhol bog‘lama fe’l ("am"), undan so‘ng birlikdagi sanaladigan ot oldidan "a" artikli va "student" oti kelishi shart.',
        },
        {
          wrongEn: 'Books read I.',
          rightEn: 'I read books.',
          meaningUz: 'Men kitoblar o‘qiyman.',
          whyUz:
            'Ingliz tilida kim harakat qilayotgani (I) birinchi, nima qilayotgani (read) ikkinchi va harakat nimaga qaratilgani (books) uchinchi o‘rinda turadi.',
        },
      ],
    },

    // ==================== SECTION 2: LETTERS, SOUNDS, AND WORDS ====================
    {
      id: 'subtopic_02_letters_sounds_words',
      sectionNumber: 2,
      titleEn: 'Section 2 — Letters, Sounds, and Words',
      titleUz: '2-Bo‘lim: Harflar, Tovushlar, Imlo va So‘zlar',
      analogyOrIntroUz:
        'Harfni ko‘zimiz bilan ko‘ramiz va yozamiz (Letter), tovushni esa qulog‘imiz bilan eshitamiz va talaffuz qilamiz (Sound).',
      paragraphsUz: [
        'Ingliz alifbosida (English Alphabet) jami 26 ta harf mavjud. Ular ikki guruhga bo‘linadi: 5 ta unli harf (Vowels: A, E, I, O, U) va 21 ta undosh harf (Consonants). Eslab qoling: "Y" harfi undosh hisoblansa-da, "happy" yoki "my" kabi so‘zlarda unli tovushni ham ifodalay oladi.',
        'Spelling (Imlo) — so‘zni harflar bilan to‘g‘ri yozishdir. Pronunciation (Talaffuz) esa so‘zni tovushlar bilan to‘g‘ri aytishdir. Ingliz tilida yozilishi va o‘qilishi har doim ham bir-biriga 100% teng bo‘lmaydi: bitta harf turli so‘zlarda turlicha o‘qilishi (masalan, "A" harfi "Apple" va "Name" so‘zlarida ikki xil tovush beradi) yoki bir nechta harf bitta tovushni berishi ("Book" so‘zidagi ikkita "oo" yoki "Fish" so‘zidagi "sh") mumkin.',
        'Bitta harfning o‘zi ko‘p hollarda shunchaki belgi bo‘ladi, lekin harflar birlashib ma’noli SO‘Z (Word) hosil qiladi: C + A + T = CAT (Mushuk). (Batafsil fonetika va IPA tovushlar maxsus darslarda o‘rgatiladi.)',
      ],
      conceptCards: [
        {
          termEn: '5 Vowels & Special Y',
          termUz: '5 ta Unli harf: A, E, I, O, U (va Y)',
          definitionUz:
            'Unli tovushlar og‘iz bo‘shlig‘ida to‘siqsiz aytiladi va har bir inglizcha so‘zda bo‘g‘in hosil qiladi.',
          examples: [
            { en: 'Apple — /ˈæp.əl/', uz: 'Olma (A harfi bilan boshlanadi)', highlight: 'A' },
            { en: 'Egg — /eɡ/', uz: 'Tuxum (E harfi bilan boshlanadi)', highlight: 'E' },
          ],
        },
        {
          termEn: '21 Consonants & Word Building',
          termUz: '21 ta Undosh harf va So‘z yasalishi',
          definitionUz:
            'Undosh va unli harflar bir-biriga ulanib, aniq ma’noga ega so‘zlarni yaratadi (C + A + T = CAT).',
          examples: [
            { en: 'Book — B + O + O + K', uz: 'Kitob (4 ta harf, 3 ta tovush)', highlight: 'Book' },
            { en: 'Cat — C + A + T', uz: 'Mushuk (3 ta harf birlashib so‘z bo‘ldi)', highlight: 'Cat' },
            { en: 'Dog — D + O + G', uz: 'It (D, O, G harflaridan yasalgan so‘z)', highlight: 'Dog' },
            { en: 'Fish — F + I + S + H', uz: 'Baliq ("sh" birikmasi bitta /ʃ/ tovushini beradi)', highlight: 'Fish' },
          ],
        },
      ],
    },

    // ==================== SECTION 3: WHAT IS A WORD? ====================
    {
      id: 'subtopic_03_what_is_a_word',
      sectionNumber: 3,
      titleEn: 'Section 3 — What Is a Word?',
      titleUz: '3-Bo‘lim: So‘z (Word) nima va u gapda qanday ishlaydi?',
      analogyOrIntroUz:
        'So‘z (Word) — bu shaxs, narsa-buyum, harakat, belgi-xususiyat yoki munosabatni ifodalovchi eng kichik ma’noli til birligidir.',
      paragraphsUz: [
        'Har bir so‘z o‘z lug‘aviy ma’nosiga ega bo‘lishi bilan birga, gap ichida ma’lum bir grammatik vazifani (function) bajaradi.',
        'Masalan, "The student reads a book" (O‘quvchi kitob o‘qiydi) gapiga qaraylik: bu yerda "student" — harakatni bajaruvchi shaxs (person), "reads" — bajarilayotgan harakat (action), "book" esa o‘qilayotgan narsa-buyum (object) vazifasini bajarmoqda.',
      ],
      conceptCards: [
        {
          termEn: 'Words and Their Meanings & Roles',
          termUz: 'So‘zlar va ularning ma’no turlari',
          definitionUz:
            'So‘zlar nimani bildirishiga qarab narsa, shaxs, harakat yoki belgini ko‘rsatadi:',
          examples: [
            { en: 'Book — Kitob', uz: 'Narsa-buyum nomi (Object / Thing)', highlight: 'Book' },
            { en: 'Student — O‘quvchi', uz: 'Shaxs nomi (Person)', highlight: 'Student' },
            { en: 'Read — O‘qimoq', uz: 'Harakat (Action)', highlight: 'Read' },
            { en: 'Beautiful — Chiroyli', uz: 'Belgi va sifat (Quality)', highlight: 'Beautiful' },
            { en: 'Quickly — Tez', uz: 'Harakatning bajarilish tarzi (Manner)', highlight: 'Quickly' },
          ],
        },
      ],
    },

    // ==================== SECTION 4: WORD, PHRASE, CLAUSE, AND SENTENCE ====================
    {
      id: 'subtopic_04_hierarchy',
      sectionNumber: 4,
      titleEn: 'Section 4 — Word, Phrase, Clause, and Sentence',
      titleUz: '4-Bo‘lim: So‘z (Word), Ibora (Phrase), Klauza (Clause) va Gap (Sentence)',
      analogyOrIntroUz:
        'Bu bo‘lim ingliz tili grammatikasining eng muhim ustunidir: kichik birliklar qanday qilib bosqichma-bosqich katta va tugallangan fikrga aylanishini ko‘rib chiqamiz.',
      paragraphsUz: [
        '1. Word (So‘z): Bitta ma’noli birlik (masalan: "book" — kitob).',
        '2. Phrase (Ibora / So‘z birikmasi): Birgalikda ma’no beradigan so‘zlar guruhi, LEKIN unda Ega+Kesim birligi va tugallangan fikr bo‘lmaydi. Masalan: "a beautiful house" (chiroyli uy), "my new book" (mening yangi kitobim), "in the classroom" (sinfxonada). Agar kimsaga "in the classroom" desangiz, u "Xo‘sh, sinfxonada nima bo‘pti?" deb so‘raydi — chunki fikr tugallanmagan!',
        '3. Clause (Klauza / Gap qismi): Tarkibida Ega (Subject) va Fe’l (Verb) qatnashgan so‘zlar guruhi. Klauza ikki xil bo‘ladi: Independent clause (Mustaqil klauza — o‘zi alohida gap bo‘la oladi, masalan: "She is reading") va Dependent clause (Ergash klauza — Ega va fe’li bor, lekin "because he was tired" kabi bog‘lovchi sababli yolg‘iz o‘zi tugallangan gap bo‘la olmaydi).',
        '4. Sentence (Gap): To‘liq tugallangan fikrni ifodalovchi, bosh harf bilan boshlanib nuqta, so‘roq yoki undov belgisi bilan tugaydigan birlik (masalan: "I read books.", "She is happy.", "They play football.").',
      ],
      hierarchyFlow: [
        {
          levelNameEn: '1. Letter',
          levelNameUz: 'Harf',
          sampleEn: 'B, O, O, K',
          sampleUz: 'Yozuv belgilari',
          whyUz: 'Hali so‘z emas, alifbo harflari.',
        },
        {
          levelNameEn: '2. Word',
          levelNameUz: 'So‘z',
          sampleEn: 'book',
          sampleUz: 'kitob',
          whyUz: 'Bitta ma’noli til birligi.',
        },
        {
          levelNameEn: '3. Phrase',
          levelNameUz: 'Ibora (So‘z birikmasi)',
          sampleEn: 'my new book / a beautiful house / in the classroom',
          sampleUz: 'mening yangi kitobim / chiroyli uy / sinfxonada',
          whyUz: 'So‘zlar bog‘langan, lekin fe’l va tugallangan xabar yo‘q.',
        },
        {
          levelNameEn: '4. Clause',
          levelNameUz: 'Klauza (Ega + Fe’l birligi)',
          sampleEn: 'She is reading (Mustaqil) | because he was tired (Ergash)',
          sampleUz: 'U o‘qiyapti | chunki u charchagan edi',
          whyUz: 'Tarkibida Subject (Ega) va Verb (Fe’l) mavjud.',
        },
        {
          levelNameEn: '5. Sentence',
          levelNameUz: 'Gap (To‘liq fikr)',
          sampleEn: 'I read books. / She is happy. / They play football.',
          sampleUz: 'Men kitoblar o‘qiyman. / U xursand. / Ular futbol o‘ynaydilar.',
          whyUz: 'To‘liq va mustaqil tugallangan fikrni ifodalaydi.',
        },
      ],
    },

    // ==================== SECTION 5: INTRODUCTION TO PARTS OF SPEECH ====================
    {
      id: 'subtopic_05_parts_of_speech',
      sectionNumber: 5,
      titleEn: 'Section 5 — Introduction to Parts of Speech',
      titleUz: '5-Bo‘lim: So‘z turkumlari (Parts of Speech) bilan tanishuv',
      analogyOrIntroUz:
        'Futbol jamoasida har bir o‘yinchining o‘z vazifasi bor: darvozabon, himoyachi, hujumchi. Gapda ham so‘zlar 8 ta asosiy turkumga (va artikl/aniqlovchilarga) bo‘linib, har biri o‘z rolini bajaradi.',
      paragraphsUz: [
        'An’anaviy ingliz grammatikasida 8 ta asosiy so‘z turkumi (Eight Parts of Speech) ajratiladi. Shuningdek, Articles & Determiners (Artikllar: a, an, the va aniqlovchilar) ot oldidan kelib, uni aniqlashtiruvchi juda muhim grammatik element hisoblanadi (ayrim zamonaviy tasniflarda ular sifatlar yoki alohida Determiners guruhi tarkibida o‘rganiladi).',
        'Muhim eslatma: Savol so‘zlari so‘zning ma’nosini topishga yordam beradi, lekin so‘z gapda turli grammatik vazifalarni bajarishi mumkin. Masalan, Noun (Ot) shaxs, joy, narsa yoki g‘oyani nomlaydi va gapda fe’ldan oldin kelsa Subject (Ega — Kim?/Nima?), fe’ldan keyin kelsa Object (To‘ldiruvchi — Kimni?/Nimani?) bo‘lib keladi.',
      ],
      conceptCards: [
        {
          termEn: '1. Noun (Ot)',
          termUz: 'Ot — shaxs, joy, narsa-buyum yoki tushuncha nomi',
          definitionUz: 'Insonlar, joylar, buyumlar va g‘oyalarni nomlaydi.',
          questionsAnsweredUz: 'Ko‘pincha: Who? (Kim?), What? (Nima? / Nimani?)',
          functionInSentenceUz: 'Gapda Subject (Ega), Object (To‘ldiruvchi) yoki predlogdan keyingi bo‘lak bo‘ladi.',
          examples: [
            { en: 'student, teacher, book, school', uz: 'o‘quvchi, o‘qituvchi, kitob, maktab', highlight: 'student' },
          ],
        },
        {
          termEn: '2. Pronoun (Olmosh)',
          termUz: 'Olmosh — ot o‘rnida ishlatiladigan so‘z',
          definitionUz: 'Otni qayta-qayta takrorlamaslik uchun uning o‘rnini bosadi.',
          questionsAnsweredUz: 'Who? (Kim?), Whom? (Kimni?), Whose? (Kimning?)',
          functionInSentenceUz: 'Ot kabi Ega (I, she, they) yoki To‘ldiruvchi (me, her, them) bo‘lib keladi.',
          examples: [
            { en: 'I, you, he, she, it, we, they', uz: 'Men, siz, u, biz, ular', highlight: 'She' },
          ],
        },
        {
          termEn: '3. Verb (Fe’l)',
          termUz: 'Fe’l — harakat yoki holatni bildiruvchi so‘z',
          definitionUz: 'Eganing nima qilayotganini (action) yoki qanday holatda ekanini (state) ko‘rsatadi.',
          questionsAnsweredUz: 'What does the subject do? (Nima qiladi?), What is the state? (Nima bo‘ladi?)',
          functionInSentenceUz: 'Gapning kesimi (Predicate / Verb) bo‘lib keladi.',
          examples: [
            { en: 'read, write, learn, am/is/are', uz: 'o‘qimoq, yozmoq, o‘rganmoq, bo‘lmoq', highlight: 'reads' },
          ],
        },
        {
          termEn: '4. Adjective (Sifat)',
          termUz: 'Sifat — otning belgi va xususiyatini bildiruvchi so‘z',
          definitionUz: 'Otni ta’riflaydi va aniqlashtiradi.',
          questionsAnsweredUz: 'What kind of? (Qanday?), Which? (Qaysi?)',
          functionInSentenceUz: 'Otdan oldin (young student) yoki bog‘lama fe’ldan keyin (is happy) keladi.',
          examples: [
            { en: 'young, interesting, beautiful, new', uz: 'yosh, qiziqarli, chiroyli, yangi', highlight: 'interesting' },
          ],
        },
        {
          termEn: '5. Adverb (Ravish)',
          termUz: 'Ravish — harakatning qay tarzda, qachon yoki qayerda bajarilishini bildiradi',
          definitionUz: 'Asosan fe’lga, sifatga yoki boshqa ravishga ma’no qo‘shadi.',
          questionsAnsweredUz: 'How? (Qanday qilib?), When? (Qachon?), Where? (Qayerda?)',
          functionInSentenceUz: 'Fe’lni aniqlab, hol (Modifier / Adverbial) vazifasida keladi.',
          examples: [
            { en: 'quickly, clearly, today, very', uz: 'tez, aniq, bugun, juda', highlight: 'quickly' },
          ],
        },
        {
          termEn: '6. Preposition (Predlog)',
          termUz: 'Predlog — so‘zlar o‘rtasidagi o‘rin, vaqt va yo‘nalish munosabatini ko‘rsatadi',
          definitionUz: 'Ot yoki olmosh oldidan kelib, uni gapning boshqa qismiga bog‘laydi.',
          questionsAnsweredUz: 'Where? (Qayerda? — in the classroom), When? (Qachon? — at 8 o’clock)',
          functionInSentenceUz: 'Ot bilan birikib Prepositional Phrase (in the school, on the table) hosil qiladi.',
          examples: [
            { en: 'in, on, at, to, from, with', uz: '-da, ustida, -ga, -dan, bilan', highlight: 'in' },
          ],
        },
        {
          termEn: '7. Conjunction (Bog‘lovchi)',
          termUz: 'Bog‘lovchi — so‘zlarni, iboralarni yoki klauzalarni bir-biriga bog‘laydi',
          definitionUz: 'Gap qismlari o‘rtasida mantiqiy ko‘prik vazifasini bajaradi.',
          questionsAnsweredUz: 'Qanday mantiqiy bog‘lanish bor? (qo‘shish, zidlik, sabab)',
          functionInSentenceUz: 'Bog‘lovchi (Connector) vazifasida keladi.',
          examples: [
            { en: 'and, but, because, or', uz: 'va, lekin, chunki, yoki', highlight: 'and' },
          ],
        },
        {
          termEn: '8. Interjection (Undov) + Articles (a, an, the)',
          termUz: 'Undov so‘zlar va Artikllar (Aniqlovchilar)',
          definitionUz:
            'Interjection kuchli his-hayajon yoki salomlashishni bildiradi (Wow!, Oh!, Hello!). Article (a, an, the) esa ot oldidan kelib, u aniq yoki noaniq ekanini ko‘rsatadi.',
          questionsAnsweredUz: 'Article: Aniqmi (the) yoki bitta noaniqmi (a/an)?',
          functionInSentenceUz: 'Undov gap boshida mustaqil keladi; Artikl esa doim ot guruhi boshida turadi.',
          examples: [
            { en: 'Wow! The student reads a book.', uz: 'Qoyil! O‘quvchi kitob o‘qiydi.', highlight: 'The / a' },
          ],
        },
      ],
      sentenceBreakdown: {
        sentenceEn: 'The young student reads an interesting book.',
        sentenceUz: 'Yosh o‘quvchi qiziqarli kitob o‘qiydi.',
        tokens: [
          {
            token: 'The',
            partOfSpeechEn: 'Article (Determiner)',
            partOfSpeechUz: 'Aniq artikl',
            grammaticalRoleUz: 'Ot aniqlovchisi',
            questionAnsweredUz: 'Qaysi aniq?',
            explanationUz: 'Tinglovchiga ma’lum bo‘lgan o‘quvchini ("student") aniqlab kelmoqda.',
          },
          {
            token: 'young',
            partOfSpeechEn: 'Adjective',
            partOfSpeechUz: 'Sifat',
            grammaticalRoleUz: 'Aniqlovchi (Modifier)',
            questionAnsweredUz: 'Qanday? (What kind of?)',
            explanationUz: '"student" otidan oldin kelib, uning yoshini ta’riflayapti.',
          },
          {
            token: 'student',
            partOfSpeechEn: 'Noun',
            partOfSpeechUz: 'Ot',
            grammaticalRoleUz: 'Ega (Subject)',
            questionAnsweredUz: 'Kim? (Who?)',
            explanationUz: 'Gapda o‘qish harakatini bajarayotgan asosiy shaxs.',
          },
          {
            token: 'reads',
            partOfSpeechEn: 'Verb',
            partOfSpeechUz: 'Fe’l',
            grammaticalRoleUz: 'Kesim (Verb / Predicate)',
            questionAnsweredUz: 'Nima qiladi? (What does he/she do?)',
            explanationUz: 'Eganing bajarayotgan ish-harakatini bildiradi.',
          },
          {
            token: 'an',
            partOfSpeechEn: 'Article (Determiner)',
            partOfSpeechUz: 'Noaniq artikl',
            grammaticalRoleUz: 'Ot aniqlovchisi',
            questionAnsweredUz: 'Bitta qanday?',
            explanationUz: '"interesting" so‘zi unli tovush (/ɪ/) bilan boshlangani uchun "a" emas, "an" qo‘yilgan.',
          },
          {
            token: 'interesting',
            partOfSpeechEn: 'Adjective',
            partOfSpeechUz: 'Sifat',
            grammaticalRoleUz: 'Aniqlovchi (Modifier)',
            questionAnsweredUz: 'Qanday? (What kind of?)',
            explanationUz: '"book" otining qanday ekanini (qiziqarli) bildiradi.',
          },
          {
            token: 'book',
            partOfSpeechEn: 'Noun',
            partOfSpeechUz: 'Ot',
            grammaticalRoleUz: 'To‘ldiruvchi (Object)',
            questionAnsweredUz: 'Nimani? (What?)',
            explanationUz: 'O‘qish harakati bevosita qaratilgan narsa-buyum.',
          },
        ],
      },
    },

    // ==================== SECTION 6: HOW ENGLISH SENTENCES WORK ====================
    {
      id: 'subtopic_06_svo_structure',
      sectionNumber: 6,
      titleEn: 'Section 6 — How English Sentences Work (S + V + O)',
      titleUz: '6-Bo‘lim: Ingliz gaplari qanday ishlaydi? (Subject + Verb + Object)',
      analogyOrIntroUz:
        'O‘zbek tili va ingliz tilining eng katta farqi — gapda Fe’l (Verb) va To‘ldiruvchining (Object) joylashuvidadir!',
      paragraphsUz: [
        'Ingliz tilidagi eng keng tarqalgan tayanch darak gap qolipi: Subject (Ega — Kim?) + Verb (Fe’l — Nima qiladi?) + Object (To‘ldiruvchi — Nimani?). (Albatta, ingliz tilida faqat S+V yoki S+V+Adjective kabi boshqa qoliplar ham bor, lekin S+V+O eng muhim poydevordir.)',
        'Masalan: "I read books." Bu yerda: I — Subject (Kim? Men), read — Verb (Nima qilaman? O‘qiyman), books — Object (Nimani? Kitoblarni).',
        'O‘zbek tilida esa tartib boshqacha (S + O + V): "Men (Ega) kitoblar (To‘ldiruvchi) o‘qiyman (Fe’l)." Shu sababli o‘zbekchadan so‘zma-so‘z tarjima qilib "I books read" yoki "She water drinks" deyish xato hisoblanadi.',
      ],
      comparisonCards: [
        {
          wrongEn: 'She water drinks.',
          rightEn: 'She drinks water.',
          meaningUz: 'U suv ichadi.',
          whyUz: 'Ingliz tilida Ega (She) dan keyin darhol Fe’l (drinks), undan keyin To‘ldiruvchi (water) keladi.',
        },
        {
          wrongEn: 'They football play.',
          rightEn: 'They play football.',
          meaningUz: 'Ular futbol o‘ynaydilar.',
          whyUz: 'They (Subject) + play (Verb) + football (Object).',
        },
        {
          wrongEn: 'My brother music likes.',
          rightEn: 'My brother likes music.',
          meaningUz: 'Mening akam (ukam) musiqani yaxshi ko‘radi.',
          whyUz: 'My brother (Subject) + likes (Verb) + music (Object).',
        },
      ],
    },

    // ==================== SECTION 7: SENTENCE TYPES ====================
    {
      id: 'subtopic_07_sentence_types',
      sectionNumber: 7,
      titleEn: 'Section 7 — Four Main Sentence Types',
      titleUz: '7-Bo‘lim: Gapning 4 ta asosiy turi (Sentence Types)',
      analogyOrIntroUz:
        'Har bir gapning aytilish maqsadi va oxiriga qo‘yiladigan o‘z tinish belgisi bor.',
      paragraphsUz: [
        '1. Declarative sentence (Darak gap): Ma’lumot yoki xabar beradi, oxiriga nuqta (.) qo‘yiladi.',
        '2. Interrogative sentence (So‘roq gap): Savol so‘raydi, oxiriga so‘roq belgisi (?) qo‘yiladi.',
        '3. Imperative sentence (Buyruq / Iltimos gap): Ko‘rsatma, iltimos yoki buyruqni bildiradi (odatda fe’lning o‘zi bilan boshlanadi), oxiriga nuqta (.) yoki undov (!) qo‘yiladi.',
        '4. Exclamatory sentence (His-hayajon / Undov gap): Kuchli quvonch, hayrat yoki his-hayajonni bildiradi, oxiriga undov belgisi (!) qo‘yiladi.',
      ],
      conceptCards: [
        {
          termEn: '1. Declarative Sentence',
          termUz: 'Darak gap — ma’lumot beradi (.)',
          definitionUz: 'Biror voqea, fakt yoki holat haqida xabar beradi.',
          examples: [{ en: 'I am a student.', uz: 'Men o‘quvchiman.', highlight: '.' }],
        },
        {
          termEn: '2. Interrogative Sentence',
          termUz: 'So‘roq gap — savol so‘raydi (?)',
          definitionUz: 'Suhbatdoshdan ma’lumot olish uchun beriladigan savol.',
          examples: [{ en: 'Are you ready?', uz: 'Siz tayyormisiz?', highlight: '?' }],
        },
        {
          termEn: '3. Imperative Sentence',
          termUz: 'Buyruq / Iltimos gap — ko‘rsatma beradi (.)',
          definitionUz: 'Tinglovchini biror harakatni bajarishga undaydi.',
          examples: [{ en: 'Open the book.', uz: 'Kitobni oching.', highlight: 'Open' }],
        },
        {
          termEn: '4. Exclamatory Sentence',
          termUz: 'His-hayajon gap — kuchli tuyg‘uni ifodalaydi (!)',
          definitionUz: 'Hayrat va kuchli emotsiyani bildiradi.',
          examples: [{ en: 'What a beautiful day!', uz: 'Qanday go‘zal kun!', highlight: '!' }],
        },
      ],
    },

    // ==================== SECTION 8: BASIC GRAMMAR ELEMENTS ====================
    {
      id: 'subtopic_08_basic_elements',
      sectionNumber: 8,
      titleEn: 'Section 8 — Basic Grammar Elements',
      titleUz: '8-Bo‘lim: Boshlang‘ich grammatik elementlar (Ko‘plik, Bosh harf, Qisqartmalar, There is/are, This/That)',
      analogyOrIntroUz:
        'Endi kundalik ingliz tilida har qadamda uchraydigan 6 ta muhim grammatik vositani bilib olamiz.',
      paragraphsUz: [
        '1. Singular and Plural (Birlik va Ko‘plik): Bitta narsa Singular (book, student, apple), ikkita va undan ortiq narsa esa Plural deyiladi va odatda ot oxiriga "-s" qo‘shiladi (books, students, apples). (Istisno ko‘plik shakllari alohida darsda o‘tiladi.)',
        '2. Capitalization (Bosh harf qoidalari): Ingliz tilida 4 ta holatda BOSH HARF yozish shart: 1) Har bir gapning birinchi harfi; 2) Inson ismlari (Aziz, Malika); 3) Davlat va shahar nomlari (Uzbekistan, Tashkent, London); 4) "I" (Men) olmoshi gapning qayerida kelishidan qat’i nazar DOIM katta "I" bilan yoziladi!',
        '3. Punctuation (Tinish belgilari): Full stop (.) — darak gap oxirida; Question mark (?) — savol oxirida; Exclamation mark (!) — hayajon/kuchli buyruq oxirida; Comma (,) — gap ichidagi qisqa pauza va sanashda.',
        '4. Contractions (Qisqartma shakllar): Kundalik nutqda ikkita so‘z apostrof (’) yordamida qisqartiriladi: I am → I’m, You are → You’re, It is → It’s, Do not → Don’t, Cannot → Can’t.',
        '5. There is / There are (Borlikni ifodalash): Biror joyda bitta narsa bor bo‘lsa "There is a book on the table", ko‘plikda bo‘lsa "There are three students in the classroom" deyiladi.',
        '6. It, This, and That: "It" — u (jonsiz narsa yoki hayvon uchun: It is a book); "This" — bu (yaqindagi bitta narsa: This is my book); "That" — ana u (uzoqdagi bitta narsa: That is a school).',
      ],
      conceptCards: [
        {
          termEn: 'Singular vs Plural & Capitalization',
          termUz: 'Birlik / Ko‘plik (-s) va Bosh harf ("I")',
          definitionUz: 'book → books | student → students | apple → apples. "I" (Men) doim bosh harfda!',
          examples: [
            { en: 'one book → two books', uz: 'bitta kitob → ikkita kitob', highlight: 'books' },
            { en: 'I am from Uzbekistan.', uz: 'Men O‘zbekistondanman ("I" va "Uzbekistan" bosh harfda).', highlight: 'I / Uzbekistan' },
          ],
        },
        {
          termEn: 'Contractions & Existence (There is / There are)',
          termUz: 'Qisqartmalar va There is / There are',
          definitionUz: "I am → I'm | You are → You're | It is → It's | Do not → Don't | Cannot → Can't",
          examples: [
            { en: 'There is a book on the table.', uz: 'Stol ustida (bitta) kitob bor.', highlight: 'There is' },
            { en: 'There are three students in the classroom.', uz: 'Sinfxonada uchta o‘quvchi bor.', highlight: 'There are' },
          ],
        },
        {
          termEn: 'It, This, and That',
          termUz: 'It (u), This (bu — yaqin), That (ana u — uzoq)',
          definitionUz: 'Narsalarni ko‘rsatish va qayta nomlash uchun ishlatiladi.',
          examples: [
            { en: 'This is a new book. It is interesting.', uz: 'Bu — yangi kitob. U qiziqarli.', highlight: 'This / It' },
            { en: 'That is our school.', uz: 'Ana u — bizning maktabimiz.', highlight: 'That' },
          ],
        },
      ],
    },
  ],

  examples: [
    {
      id: 'ex_gf_01_student_am',
      grammarRuleId: 'rule_gf_01_word_order_meaning',
      englishSentence: 'I am a student.',
      uzbekTranslation: 'Men o‘quvchiman (talabaman).',
      incorrectSentence: 'I student am.',
      whyIncorrectUz: 'Ingliz tilida Ega ("I") dan keyin bog‘lama fe’l ("am"), so‘ngra "a student" keladi.',
      highlightedSegment: 'I am a',
      explanationUz: 'Grammatika so‘zlarni boshqalar tushunadigan aniq tartibga soladi.',
    },
    {
      id: 'ex_gf_02_cat_word',
      grammarRuleId: 'rule_gf_02_letters_sounds_words',
      englishSentence: 'The student reads a book.',
      uzbekTranslation: 'O‘quvchi kitob o‘qiydi.',
      highlightedSegment: 'student reads a book',
      explanationUz: 'Harflar so‘zlarni, so‘zlar esa o‘zaro bog‘lanib gapni hosil qiladi (student — shaxs, reads — harakat, book — buyum).',
    },
    {
      id: 'ex_gf_03_phrase_vs_sentence',
      grammarRuleId: 'rule_gf_03_unit_hierarchy',
      englishSentence: 'She is reading a book in the classroom.',
      uzbekTranslation: 'U sinfxonada kitob o‘qiyapti.',
      incorrectSentence: 'In the classroom. (To‘liq gap sifatida xato)',
      whyIncorrectUz: '"in the classroom" — bu faqat ibora (phrase), unda kim va nima qilayotgani yo‘q.',
      highlightedSegment: 'She is reading',
      explanationUz: '"She is reading" — mustaqil klauza va to‘liq fikr bildiruvchi gap asosi.',
    },
    {
      id: 'ex_gf_04_young_student_breakdown',
      grammarRuleId: 'rule_gf_04_parts_of_speech',
      englishSentence: 'The young student reads an interesting book.',
      uzbekTranslation: 'Yosh o‘quvchi qiziqarli kitob o‘qiydi.',
      highlightedSegment: 'young student reads an interesting book',
      explanationUz: 'Bitta gapda Artikl (The, an), Sifat (young, interesting), Ot (student, book) va Fe’l (reads) uyg‘un ishlaydi.',
    },
    {
      id: 'ex_gf_05_svo_examples',
      grammarRuleId: 'rule_gf_05_svo_pattern',
      englishSentence: 'My brother likes music.',
      uzbekTranslation: 'Mening akam (ukam) musiqani yaxshi ko‘radi.',
      incorrectSentence: 'My brother music likes.',
      whyIncorrectUz: 'O‘zbekcha tartibda to‘ldiruvchini fe’ldan oldinga qo‘yib bo‘lmaydi; S + V + O qoidasiga ko‘ra "likes music" bo‘lishi shart.',
      highlightedSegment: 'likes music',
      explanationUz: 'My brother (Subject) + likes (Verb) + music (Object).',
    },
    {
      id: 'ex_gf_06_four_sentence_types',
      grammarRuleId: 'rule_gf_06_sentence_types',
      englishSentence: 'Are you ready? Open the book. What a beautiful day!',
      uzbekTranslation: 'Tayyormisiz? Kitobni oching. Qanday chiroyli kun!',
      highlightedSegment: 'Are you ready?',
      explanationUz: 'So‘roq (?), Buyruq (.) va His-hayajon (!) gaplar ohang hamda tinish belgisi bilan farqlanadi.',
    },
    {
      id: 'ex_gf_07_mechanics_contractions',
      grammarRuleId: 'rule_gf_07_basic_mechanics',
      englishSentence: "I'm a student. There are three books on this table.",
      uzbekTranslation: 'Men o‘quvchiman. Bu stol ustida uchta kitob bor.',
      highlightedSegment: "I'm / There are / books",
      explanationUz: "I am → I'm qisqartmasi, ko‘plikdagi 'There are' va '-s' qo‘shimchasi ('books').",
    },
  ],

  exercises: [
    // ==================== ACTIVITY 1: LETTER OR WORD? ====================
    {
      id: 'ex_act_01_letter_or_word',
      version: 1,
      type: 'categorization',
      progressionStage: 'recognition',
      titleUz: '1-Mashq (Activity 1): Harfmi yoki So‘z? (Letter or Word?)',
      instructionsUz:
        'Quyidagi 5 ta elementni diqqat bilan ko‘rib chiqing: ularнинг har birini "Harf (Letter)" yoki "So‘z (Word)" savatchasiga ajrating.',
      audioText: 'A, CAT, BOOK, B, DOG',
      categories: [
        { id: 'LETTER', labelUz: '🔤 Harf (Single Letter)', labelEn: 'Letter' },
        { id: 'WORD', labelUz: '📘 So‘z (Complete Word)', labelEn: 'Word' },
      ],
      categorizationItems: [
        {
          id: 'item_a',
          label: 'A',
          sublabelUz: 'Alifboning 1-harfi',
          correctCategory: 'LETTER',
          explanationUz: '"A" — alifbodagi bitta unli harf belgisi.',
          audioText: 'A',
        },
        {
          id: 'item_cat',
          label: 'CAT',
          sublabelUz: 'Mushuk',
          correctCategory: 'WORD',
          explanationUz: 'C + A + T harflari qo‘shilib, ma’noli "CAT" (mushuk) so‘zini hosil qilgan.',
          audioText: 'Cat',
        },
        {
          id: 'item_book',
          label: 'BOOK',
          sublabelUz: 'Kitob',
          correctCategory: 'WORD',
          explanationUz: '"BOOK" — 4 ta harfdan iborat to‘liq ma’noli so‘z.',
          audioText: 'Book',
        },
        {
          id: 'item_b',
          label: 'B',
          sublabelUz: 'Alifboning 2-harfi',
          correctCategory: 'LETTER',
          explanationUz: '"B" — yozuvdagi bitta undosh harf.',
          audioText: 'B',
        },
        {
          id: 'item_dog',
          label: 'DOG',
          sublabelUz: 'It',
          correctCategory: 'WORD',
          explanationUz: '"DOG" — 3 ta harfdan tashkil topgan ma’noli so‘z.',
          audioText: 'Dog',
        },
      ],
      acceptedAnswers: ['ALL_SORTED'],
      explanationUz:
        'Harf (A, B) — yozuvdagi bitta belgi. Harflar birlashib, ma’no anglatuvchi So‘zni (CAT, BOOK, DOG) hosil qiladi.',
      hintUz: 'Bitta belgidan iboratlarini "Harf", hayvon yoki buyum ma’nosini beruvchilarini "So‘z" guruhiga joylang.',
      difficulty: 'beginner',
      xpReward: 15,
      relatedVocabularyIds: ['voc_gf_book'],
      relatedGrammarRuleIds: ['rule_gf_02_letters_sounds_words'],
      requiresApplication: false,
    },

    // ==================== ACTIVITY 2: BUILD A WORD ====================
    {
      id: 'ex_act_02_build_a_word',
      version: 1,
      type: 'word_ordering',
      progressionStage: 'identification',
      titleUz: '2-Mashq (Activity 2): Harflardan so‘z yasang (Build a Word)',
      instructionsUz:
        'Harflarni to‘g‘ri ketma-ketlikda bosib, 4 ta inglizcha so‘zni yasang: CAT, DOG, SUN, BOOK.',
      audioText: 'Cat, Dog, Sun, Book',
      wordBuildItems: [
        {
          id: 'wb_cat',
          targetWord: 'CAT',
          meaningUz: 'Mushuk',
          scrambledLetters: ['T', 'C', 'A'],
          explanationUz: 'C + A + T = CAT (/kæt/ — Mushuk).',
        },
        {
          id: 'wb_dog',
          targetWord: 'DOG',
          meaningUz: 'It',
          scrambledLetters: ['G', 'D', 'O'],
          explanationUz: 'D + O + G = DOG (/dɒɡ/ — It).',
        },
        {
          id: 'wb_sun',
          targetWord: 'SUN',
          meaningUz: 'Quyosh',
          scrambledLetters: ['N', 'S', 'U'],
          explanationUz: 'S + U + N = SUN (/sʌn/ — Quyosh).',
        },
        {
          id: 'wb_book',
          targetWord: 'BOOK',
          meaningUz: 'Kitob',
          scrambledLetters: ['K', 'B', 'O', 'O'],
          explanationUz: 'B + O + O + K = BOOK (/bʊk/ — Kitob).',
        },
      ],
      acceptedAnswers: ['CAT, DOG, SUN, BOOK'],
      explanationUz:
        'Undosh va unli harflar to‘g‘ri tartibda (Spelling) joylashgandagina ma’noli inglizcha so‘z hosil bo‘ladi.',
      hintUz: 'Avval birinchi undosh harfni, keyin o‘rtadagi unli harfni, so‘ng oxirgi undoshni bosing.',
      difficulty: 'beginner',
      xpReward: 20,
      relatedVocabularyIds: ['voc_gf_book'],
      relatedGrammarRuleIds: ['rule_gf_02_letters_sounds_words'],
      requiresApplication: true,
    },

    // ==================== ACTIVITY 3: WORD, PHRASE, OR SENTENCE? ====================
    {
      id: 'ex_act_03_word_phrase_sentence',
      version: 1,
      type: 'categorization',
      progressionStage: 'classification',
      titleUz: '3-Mashq (Activity 3): So‘zmi, Iborami yoki Gap? (Word, Phrase, or Sentence?)',
      instructionsUz:
        'Quyidagi 6 ta birlikni tahlil qiling va har birini mos guruhga (Word, Phrase yoki Sentence) ajrating.',
      audioText: 'Book. A beautiful house. She reads books. In the classroom. My new teacher. They are happy.',
      categories: [
        { id: 'WORD', labelUz: '1️⃣ So‘z (Word)', labelEn: 'Word' },
        { id: 'PHRASE', labelUz: '2️⃣ Ibora (Phrase)', labelEn: 'Phrase' },
        { id: 'SENTENCE', labelUz: '3️⃣ To‘liq Gap (Sentence)', labelEn: 'Sentence' },
      ],
      categorizationItems: [
        {
          id: 'wps_1',
          label: 'Book',
          sublabelUz: 'Kitob',
          correctCategory: 'WORD',
          explanationUz: '"Book" — yakka o‘zi kelgan bitta ma’noli so‘z (Word).',
          audioText: 'Book',
        },
        {
          id: 'wps_2',
          label: 'A beautiful house',
          sublabelUz: 'Chiroyli uy',
          correctCategory: 'PHRASE',
          explanationUz: '"A beautiful house" — so‘zlar guruhi (Phrase), lekin unda fe’l (harakat) va tugallangan xabar yo‘q.',
          audioText: 'A beautiful house',
        },
        {
          id: 'wps_3',
          label: 'She reads books.',
          sublabelUz: 'U kitoblar o‘qiydi.',
          correctCategory: 'SENTENCE',
          explanationUz: '"She reads books." — Ega (She), Fe’l (reads) va To‘ldiruvchiga (books) ega to‘liq gap (Sentence).',
          audioText: 'She reads books.',
        },
        {
          id: 'wps_4',
          label: 'In the classroom',
          sublabelUz: 'Sinfxonada',
          correctCategory: 'PHRASE',
          explanationUz: '"In the classroom" — predlogli ibora (Phrase); sinfxonada nima bo‘lgani aytilmagan.',
          audioText: 'In the classroom',
        },
        {
          id: 'wps_5',
          label: 'My new teacher',
          sublabelUz: 'Mening yangi o‘qituvchim',
          correctCategory: 'PHRASE',
          explanationUz: '"My new teacher" — otli birikma (Phrase); o‘qituvchi nima qilgani haqida fe’l yo‘q.',
          audioText: 'My new teacher',
        },
        {
          id: 'wps_6',
          label: 'They are happy.',
          sublabelUz: 'Ular xursandlar.',
          correctCategory: 'SENTENCE',
          explanationUz: '"They are happy." — Ega (They) va bog‘lama kesimga (are happy) ega to‘liq gap (Sentence).',
          audioText: 'They are happy.',
        },
      ],
      acceptedAnswers: ['ALL_SORTED'],
      explanationUz:
        'Yakka birlik — Word; fe’lsiz va tugallanmagan birikma — Phrase; Ega+Fe’l va tugallangan fikr — Sentence.',
      hintUz: 'Nuqta bilan tugagan va tarkibida fe’l (reads, are) bor birliklar — Sentence!',
      difficulty: 'beginner',
      xpReward: 20,
      relatedVocabularyIds: ['voc_gf_book', 'voc_gf_teacher', 'voc_gf_read', 'voc_gf_sentence'],
      relatedGrammarRuleIds: ['rule_gf_03_unit_hierarchy'],
      requiresApplication: true,
    },

    // ==================== ACTIVITY 4: PARTS OF SPEECH MATCHING ====================
    {
      id: 'ex_act_04_pos_matching',
      version: 1,
      type: 'matching_pairs',
      progressionStage: 'matching',
      titleUz: '4-Mashq (Activity 4): So‘z turkumlarini moslashtiring (Parts of Speech Matching)',
      instructionsUz:
        'Chap ustundagi inglizcha so‘zni bosing, so‘ngra o‘ng ustundan uning to‘g‘ri so‘z turkumini (Noun, Verb, Adjective, Adverb) tanlang.',
      audioText: 'Student, Read, Beautiful, Quickly',
      matchingPairs: [
        {
          id: 'pair_student',
          leftText: 'Student',
          leftSubtext: 'O‘quvchi (Kim?)',
          rightText: 'Noun (Ot)',
          rightSubtext: 'Shaxs yoki narsa nomi',
          explanationUz: '"Student" shaxsni nomlagani uchun Noun (Ot) hisoblanadi.',
          audioText: 'Student',
        },
        {
          id: 'pair_read',
          leftText: 'Read',
          leftSubtext: 'O‘qimoq (Nima qilmoq?)',
          rightText: 'Verb (Fe’l)',
          rightSubtext: 'Ish-harakat bildiruvchi so‘z',
          explanationUz: '"Read" o‘qish harakatini bildirgani uchun Verb (Fe’l) hisoblanadi.',
          audioText: 'Read',
        },
        {
          id: 'pair_beautiful',
          leftText: 'Beautiful',
          leftSubtext: 'Chiroyli (Qanday?)',
          rightText: 'Adjective (Sifat)',
          rightSubtext: 'Otning belgisini bildiradi',
          explanationUz: '"Beautiful" narsa yoki shaxsning qandayligini ta’riflovchi Adjective (Sifat).',
          audioText: 'Beautiful',
        },
        {
          id: 'pair_quickly',
          leftText: 'Quickly',
          leftSubtext: 'Tez (Qay tarzda?)',
          rightText: 'Adverb (Ravish)',
          rightSubtext: 'Harakat tarzini bildiradi (-ly)',
          explanationUz: '"Quickly" harakatning qanday (tez) bajarilishini bildiruvchi Adverb (Ravish).',
          audioText: 'Quickly',
        },
      ],
      acceptedAnswers: ['ALL_MATCHED'],
      explanationUz:
        'Student → Noun (Ot), Read → Verb (Fe’l), Beautiful → Adjective (Sifat), Quickly → Adverb (Ravish).',
      hintUz: 'Kim?/Nima? — Noun; Nima qilmoq? — Verb; Qanday? — Adjective; Qay tarzda (-ly)? — Adverb.',
      difficulty: 'beginner',
      xpReward: 20,
      relatedVocabularyIds: ['voc_gf_student', 'voc_gf_read'],
      relatedGrammarRuleIds: ['rule_gf_04_parts_of_speech'],
      requiresApplication: true,
    },

    // ==================== ACTIVITY 5: SENTENCE BUILDER ====================
    {
      id: 'ex_act_05_sentence_builder',
      version: 1,
      type: 'sentence_builder',
      progressionStage: 'sentence_construction',
      titleUz: '5-Mashq (Activity 5): Gap tuzish (Sentence Builder: S + V + O)',
      instructionsUz:
        'Aralashtirilgan so‘z bo‘laklarini ingliz tilining Subject + Verb + Object qoidasiga ko‘ra to‘g‘ri tartibda joylashtirib, "Men kitob o‘qiyman" gapini tuzing.',
      audioText: 'I read a book.',
      sentenceBuilder: {
        targetSentence: 'I read a book.',
        meaningUz: 'Men kitob o‘qiyman.',
        shuffledTiles: ['a book.', 'read', 'I'],
        roleBreakdown: [
          {
            part: 'I',
            roleNameEn: 'Subject',
            roleNameUz: 'Ega (Subject)',
            questionUz: 'Kim? (Who?)',
          },
          {
            part: 'read',
            roleNameEn: 'Verb',
            roleNameUz: 'Kesim / Fe’l (Verb)',
            questionUz: 'Nima qiladi? (What does the subject do?)',
          },
          {
            part: 'a book.',
            roleNameEn: 'Object',
            roleNameUz: 'To‘ldiruvchi (Object)',
            questionUz: 'Nimani? (What?)',
          },
        ],
      },
      acceptedAnswers: ['I read a book.', 'I read a book'],
      explanationUz:
        'To‘g‘ri tartib: I (Subject — Ega) + read (Verb — Fe’l) + a book (Object — To‘ldiruvchi).',
      hintUz: 'Birinchi o‘ringa harakatni bajaruvchi Ega ("I"), ikkinchi o‘ringa Fe’l ("read"), uchinchi o‘ringa esa To‘ldiruvchi ("a book.") keladi.',
      difficulty: 'beginner',
      xpReward: 25,
      relatedVocabularyIds: ['voc_gf_read', 'voc_gf_book', 'voc_gf_sentence'],
      relatedGrammarRuleIds: ['rule_gf_05_svo_pattern'],
      requiresApplication: true,
    },

    // ==================== ACTIVITY 6: SENTENCE TYPE CLASSIFICATION ====================
    {
      id: 'ex_act_06_sentence_types',
      version: 1,
      type: 'categorization',
      progressionStage: 'classification',
      titleUz: '6-Mashq (Activity 6): Gap turlarini aniqlang (Sentence Type Classification)',
      instructionsUz:
        'Quyidagi 4 ta gapning maqsadi va tinish belgisiga qarab, ularni Declarative, Interrogative, Imperative yoki Exclamatory turiga ajrating.',
      audioText: 'I am happy. Are you ready? Open the door. What a wonderful day!',
      categories: [
        { id: 'DECLARATIVE', labelUz: '📘 Declarative (Darak .)' },
        { id: 'INTERROGATIVE', labelUz: '❓ Interrogative (So‘roq ?)' },
        { id: 'IMPERATIVE', labelUz: '👉 Imperative (Buyruq)' },
        { id: 'EXCLAMATORY', labelUz: '🎉 Exclamatory (Undov !)' },
      ],
      categorizationItems: [
        {
          id: 'stype_1',
          label: 'I am happy.',
          sublabelUz: 'Men xursandman.',
          correctCategory: 'DECLARATIVE',
          explanationUz: 'Ma’lumot beruvchi darak gap (Declarative), nuqta bilan tugagan.',
          audioText: 'I am happy.',
        },
        {
          id: 'stype_2',
          label: 'Are you ready?',
          sublabelUz: 'Tayyormisiz?',
          correctCategory: 'INTERROGATIVE',
          explanationUz: 'Savol so‘rovchi gap (Interrogative), so‘roq belgisi (?) bilan tugagan.',
          audioText: 'Are you ready?',
        },
        {
          id: 'stype_3',
          label: 'Open the door.',
          sublabelUz: 'Eshikni oching.',
          correctCategory: 'IMPERATIVE',
          explanationUz: 'Fe’l bilan boshlanib, iltimos yoki buyruq bildiruvchi gap (Imperative).',
          audioText: 'Open the door.',
        },
        {
          id: 'stype_4',
          label: 'What a wonderful day!',
          sublabelUz: 'Qanday ajoyib kun!',
          correctCategory: 'EXCLAMATORY',
          explanationUz: 'Kuchli hayrat va his-hayajonni bildiruvchi gap (Exclamatory), undov belgisi (!) bilan tugagan.',
          audioText: 'What a wonderful day!',
        },
      ],
      acceptedAnswers: ['ALL_SORTED'],
      explanationUz:
        'Declarative xabar beradi (.), Interrogative savol so‘raydi (?), Imperative buyruq/iltimos bildiradi, Exclamatory kuchli his-hayajonni ifodalaydi (!).',
      hintUz: 'Gapning ma’nosiga va oxiridagi tinish belgisiga (. / ? / !) qarang.',
      difficulty: 'beginner',
      xpReward: 20,
      relatedVocabularyIds: ['voc_gf_sentence'],
      relatedGrammarRuleIds: ['rule_gf_06_sentence_types'],
      requiresApplication: true,
    },

    // ==================== ACTIVITY 7: CAPITALIZATION AND PUNCTUATION ====================
    {
      id: 'ex_act_07_capitalization_punctuation',
      version: 1,
      type: 'error_correction',
      progressionStage: 'error_correction',
      titleUz: '7-Mashq (Activity 7): Bosh harf va Tinish belgisini tuzating',
      instructionsUz:
        'Quyidagi gapda bosh harf (Capitalization) va tinish belgisi (Punctuation) xatosi bor. Uni to‘g‘rilab yozing yoki to‘g‘ri variantni tanlang:',
      promptEn: 'i am a student',
      promptUz: 'Xato yozilgan gap: "i am a student"',
      audioText: 'I am a student.',
      options: [
        'I am a student.',
        'i am a student.',
        'I am a student',
        'I Am A Student?',
      ],
      acceptedAnswers: ['I am a student.'],
      explanationUz:
        '1) Gap har doim bosh harf bilan boshlanadi va "I" (Men) olmoshi doim katta "I" bilan yoziladi. 2) Darak gap oxiriga albatta nuqta (.) qo‘yiladi: "I am a student."',
      hintUz: '"i" harfini katta "I" ga aylantiring va gap oxiriga nuqta (.) qo‘ying.',
      difficulty: 'beginner',
      xpReward: 20,
      relatedVocabularyIds: ['voc_gf_student', 'voc_gf_write'],
      relatedGrammarRuleIds: ['rule_gf_07_basic_mechanics'],
      requiresApplication: true,
    },

    // ==================== ACTIVITY 8: FIND THE MISTAKE ====================
    {
      id: 'ex_act_08_find_the_mistake',
      version: 1,
      type: 'error_correction',
      progressionStage: 'error_correction',
      titleUz: '8-Mashq (Activity 8): Xatoni toping va tuzating (Find the Mistake)',
      instructionsUz:
        '"She student is." gapida so‘z tartibi va artikl xatosi mavjud. Ingliz tili qoidasiga ko‘ra to‘g‘ri tuzilgan gapni tanlang yoki yozing:',
      promptEn: 'She student is.',
      promptUz: 'Noto‘g‘ri gap: "She student is." (U o‘quvchidir.)',
      audioText: 'She is a student.',
      options: [
        'She is a student.',
        'She a student is.',
        'She is student.',
        'Is she a student.',
      ],
      acceptedAnswers: ['She is a student.'],
      explanationUz:
        '1) Ingliz tilida Ega ("She") dan keyin darhol fe’l ("is") keladi. 2) Birlikdagi sanaladigan "student" oti oldidan noaniq "a" artikli qo‘yilishi shart: "She is a student."',
      hintUz: 'Avval Ega (She), keyin bog‘lama fe’l (is), so‘ngra artikl va ot (a student) keladi.',
      difficulty: 'beginner',
      xpReward: 25,
      relatedVocabularyIds: ['voc_gf_student'],
      relatedGrammarRuleIds: ['rule_gf_01_word_order_meaning', 'rule_gf_05_svo_pattern'],
      requiresApplication: true,
    },

    // ==================== ACTIVITY 9: PLAYABLE 2D CROSSWORD ====================
    {
      id: 'ex_act_09_crossword',
      version: 1,
      type: 'crossword',
      progressionStage: 'contextual_application',
      titleUz: '9-Mashq (Activity 9): Interaktiv Krossvord (Playable Grammar Crossword)',
      instructionsUz:
        '1-darsda o‘rganilgan tayanch so‘zlar va grammatik atamalarni gorizontal (Across) va vertikal (Down) kataklarga harfma-harf kiriting.',
      audioText: 'Teacher, Sentence, Student, Word',
      crossword: {
        rows: 9,
        cols: 10,
        clues: [
          {
            id: 'clue_1_down_sentence',
            number: 1,
            direction: 'down',
            clueUz: 'To‘liq tugallangan fikrni ifodalovchi so‘zlar guruhi (Gap)',
            clueEnHint: 'A group of words expressing a complete thought (8 letters)',
            answer: 'SENTENCE',
            row: 0,
            col: 4,
            vocabularyId: 'voc_gf_sentence',
            grammarRuleId: 'rule_gf_03_unit_hierarchy',
          },
          {
            id: 'clue_2_across_student',
            number: 2,
            direction: 'across',
            clueUz: 'Maktabda yoki kursda bilim o‘rganuvchi inson (O‘quvchi / Talaba)',
            clueEnHint: 'A person who learns (7 letters)',
            answer: 'STUDENT',
            row: 4,
            col: 0,
            vocabularyId: 'voc_gf_student',
          },
          {
            id: 'clue_3_across_teacher',
            number: 3,
            direction: 'across',
            clueUz: 'O‘quvchilarga ta’lim beradigan inson (O‘qituvchi)',
            clueEnHint: 'A person who teaches students (7 letters)',
            answer: 'TEACHER',
            row: 7,
            col: 3,
            vocabularyId: 'voc_gf_teacher',
          },
          {
            id: 'clue_4_down_word',
            number: 4,
            direction: 'down',
            clueUz: 'Harflardan tashkil topgan ma’noli til birligi (So‘z)',
            clueEnHint: 'A meaningful unit of language (4 letters)',
            answer: 'WORD',
            row: 5,
            col: 9,
            grammarRuleId: 'rule_gf_02_letters_sounds_words',
          },
        ],
      },
      acceptedAnswers: ['SENTENCE, STUDENT, TEACHER, WORD'],
      explanationUz:
        'Krossvord javoblari: 1-Vertikal: SENTENCE (Gap), 2-Gorizontal: STUDENT (O‘quvchi), 3-Gorizontal: TEACHER (O‘qituvchi), 4-Vertikal: WORD (So‘z).',
      hintUz: '1-Down: SENTENCE | 2-Across: STUDENT | 3-Across: TEACHER | 4-Down: WORD.',
      difficulty: 'easy',
      xpReward: 35,
      relatedVocabularyIds: ['voc_gf_teacher', 'voc_gf_sentence', 'voc_gf_student', 'voc_gf_learn'],
      relatedGrammarRuleIds: ['rule_gf_02_letters_sounds_words', 'rule_gf_03_unit_hierarchy'],
      requiresApplication: true,
    },

    // ==================== ACTIVITY 10: GRAMMAR FUNDAMENTALS CHALLENGE ====================
    {
      id: 'ex_act_10_fundamentals_challenge',
      version: 1,
      type: 'multiple_choice',
      progressionStage: 'mixed_assessment',
      titleUz: '10-Mashq (Activity 10): Grammar Fundamentals Challenge (Kompleks Sinov)',
      instructionsUz:
        'Diqqat bilan tahlil qiling: "The young student reads an interesting book." gapidagi so‘zlar va ularning grammatik vazifasi haqidagi QAYSI hukm 100% TO‘G‘RI?',
      promptEn: 'The young student reads an interesting book.',
      audioText: 'The young student reads an interesting book.',
      options: [
        '"student" — Ega (Subject, Noun), "reads" — Kesim (Verb), "interesting" — Sifat (Adjective), "book" — To‘ldiruvchi (Object, Noun)',
        '"young" — Fe’l (Verb), "reads" — Ot (Noun), "book" — Gapning egasi (Subject)',
        'Bu birikmada fe’l yo‘q, shuning uchun u to‘liq gap (Sentence) emas, balki oddiy ibora (Phrase)',
        '"an" artikli undosh tovush oldidan qo‘yilgan va gap so‘roq gap (Interrogative) hisoblanadi',
      ],
      acceptedAnswers: [
        '"student" — Ega (Subject, Noun), "reads" — Kesim (Verb), "interesting" — Sifat (Adjective), "book" — To‘ldiruvchi (Object, Noun)',
      ],
      explanationUz:
        'Bu gapda S + V + O tartibi va so‘z turkumlari mukammal ishlagan: The (Article) + young (Adjective) + student (Subject/Noun) + reads (Verb) + an (Article) + interesting (Adjective) + book (Object/Noun).',
      hintUz: 'Kim o‘qiydi? — student (Subject/Noun). Nima qiladi? — reads (Verb). Qanday kitob? — interesting (Adjective) book (Object/Noun).',
      difficulty: 'medium',
      xpReward: 30,
      relatedVocabularyIds: [
        'voc_gf_student',
        'voc_gf_read',
        'voc_gf_book',
        'voc_gf_school',
        'voc_gf_write',
        'voc_gf_learn',
      ],
      relatedGrammarRuleIds: [
        'rule_gf_04_parts_of_speech',
        'rule_gf_05_svo_pattern',
      ],
      requiresApplication: true,
    },
  ],

  // ==================== PART 13: 10-QUESTION FINAL ASSESSMENT ====================
  assessment: {
    id: 'assessment_lesson_01_fundamentals',
    title: {
      uz: 'Yakuniy Bilim Sinovi (Final Assessment — 10 ta savol)',
      en: 'Grammar Fundamentals Final Assessment',
    },
    passingPercentage: 70,
    xpReward: 50,
    questions: [
      {
        id: 'q_assess_01_letter_vs_sound',
        conceptAssessed: '1. Difference between letter and sound',
        grammarRuleId: 'rule_gf_02_letters_sounds_words',
        questionUz: '1. Ingliz tilida Harf (Letter) va Tovush (Sound) o‘rtasidagi asosiy farq nimada?',
        options: [
          'Harf — yozuvdagi ko‘rinadigan belgi (26 ta), Tovush esa biz talaffuz qiladigan va eshitadigan ovozdir',
          'Harf va tovush mutlaqo bir xil narsa, har bir harf faqat bitta tovushni beradi',
          'Ingliz tilida 5 ta harf va 26 ta unli tovush bor',
          'Harflar faqat og‘zaki nutqda, tovushlar esa faqat yozuvda ishlatiladi',
        ],
        correctAnswer:
          'Harf — yozuvdagi ko‘rinadigan belgi (26 ta), Tovush esa biz talaffuz qiladigan va eshitadigan ovozdir',
        explanationUz:
          'Ingliz alifbosida 26 ta yozma harf bor, lekin ular so‘z ichida turli tovushlarni ifodalaydi.',
      },
      {
        id: 'q_assess_02_letter_vs_word',
        conceptAssessed: '2. Difference between letter and word',
        grammarRuleId: 'rule_gf_02_letters_sounds_words',
        vocabularyId: 'voc_gf_book',
        questionUz: '2. Quyidagilardan qaysi biri alohida HARF emas, balki ma’noga ega to‘liq SO‘Z (Word) hisoblanadi?',
        options: ['BOOK (Kitob)', 'B', 'C', 'U'],
        correctAnswer: 'BOOK (Kitob)',
        explanationUz:
          'B, C, U — alifbo harflari. B + O + O + K harflari birlashib, ma’noli "BOOK" (kitob) so‘zini hosil qiladi.',
      },
      {
        id: 'q_assess_03_word_vs_phrase',
        conceptAssessed: '3. Difference between word and phrase',
        grammarRuleId: 'rule_gf_03_unit_hierarchy',
        vocabularyId: 'voc_gf_teacher',
        questionUz: '3. "My new teacher" (Mening yangi o‘qituvchim) qanday til birligi hisoblanadi?',
        options: [
          'Phrase (Ibora / So‘z birikmasi) — bir nechta so‘z bog‘langan, lekin fe’l va tugallangan hukm yo‘q',
          'Single Letter (Bitta harf)',
          'Interrogative Sentence (To‘liq so‘roq gap)',
          'Verb (Fe’l so‘z turkumi)',
        ],
        correctAnswer:
          'Phrase (Ibora / So‘z birikmasi) — bir nechta so‘z bog‘langan, lekin fe’l va tugallangan hukm yo‘q',
        explanationUz:
          '"My new teacher" uchta so‘zdan iborat ma’noli birikma (phrase), ammo unda harakat (fe’l) bo‘lmagani uchun to‘liq gap emas.',
      },
      {
        id: 'q_assess_04_phrase_vs_sentence',
        conceptAssessed: '4. Difference between phrase and sentence',
        grammarRuleId: 'rule_gf_03_unit_hierarchy',
        vocabularyId: 'voc_gf_sentence',
        questionUz: '4. Quyidagilardan qaysi biri Phrase (ibora) emas, balki to‘liq tugallangan SENTENCE (Gap)?',
        options: [
          'They play football.',
          'in the classroom',
          'a beautiful house',
          'my new book',
        ],
        correctAnswer: 'They play football.',
        explanationUz:
          '"They play football." gapida Ega (They), Fe’l (play) va To‘ldiruvchi (football) bor hamda fikr to‘liq tugallangan.',
      },
      {
        id: 'q_assess_05_parts_of_speech',
        conceptAssessed: '5. Basic parts of speech recognition',
        grammarRuleId: 'rule_gf_04_parts_of_speech',
        vocabularyId: 'voc_gf_write',
        questionUz: '5. "Students write sentences quickly." gapida "write" (yozmoq) so‘zi qaysi so‘z turkumiga kiradi?',
        options: [
          'Verb (Fe’l — harakatni bildiradi)',
          'Noun (Ot — narsa nomini bildiradi)',
          'Preposition (Predlog)',
          'Article (Artikl)',
        ],
        correctAnswer: 'Verb (Fe’l — harakatni bildiradi)',
        explanationUz:
          '"Write" (yozmoq) o‘quvchilarning nima qilayotganini (harakatni) bildirgani uchun Verb (Fe’l) hisoblanadi.',
      },
      {
        id: 'q_assess_06_svo_order',
        conceptAssessed: '6. Subject, Verb, Object',
        grammarRuleId: 'rule_gf_05_svo_pattern',
        vocabularyId: 'voc_gf_read',
        questionUz: '6. Ingliz tilining S + V + O (Subject + Verb + Object) qoidasiga ko‘ra qaysi gap TO‘G‘RI tuzilgan?',
        options: [
          'She drinks water.',
          'She water drinks.',
          'Drinks she water.',
          'Water she drinks.',
        ],
        correctAnswer: 'She drinks water.',
        explanationUz:
          'Ingliz tilida darak gap tartibi: Subject (She) + Verb (drinks) + Object (water).',
      },
      {
        id: 'q_assess_07_sentence_types',
        conceptAssessed: '7. Sentence types',
        grammarRuleId: 'rule_gf_06_sentence_types',
        questionUz: '7. "Open the book." (Kitobni oching.) gapi qaysi gap turiga mansub?',
        options: [
          'Imperative sentence (Buyruq yoki iltimos gap)',
          'Interrogative sentence (So‘roq gap)',
          'Declarative sentence (Darak gap)',
          'Phrase (Fe’lsiz ibora)',
        ],
        correctAnswer: 'Imperative sentence (Buyruq yoki iltimos gap)',
        explanationUz:
          'Tinglovchiga ko‘rsatma, buyruq yoki iltimos bildiruvchi gap Imperative sentence deyiladi.',
      },
      {
        id: 'q_assess_08_capitalization_punctuation',
        conceptAssessed: '8. Capitalization and punctuation',
        grammarRuleId: 'rule_gf_07_basic_mechanics',
        vocabularyId: 'voc_gf_school',
        questionUz: '8. Bosh harf (Capitalization) va tinish belgilari qoidasiga ko‘ra qaysi gap xatosiz yozilgan?',
        options: [
          'Are you a student in Tashkent?',
          'are you a student in tashkent.',
          'Are you a student in tashkent',
          'i am a student in Tashkent.',
        ],
        correctAnswer: 'Are you a student in Tashkent?',
        explanationUz:
          'Gap boshi ("Are") va shahar nomi ("Tashkent") bosh harf bilan yoziladi, savol oxiriga esa so‘roq belgisi (?) qo‘yiladi.',
      },
      {
        id: 'q_assess_09_singular_plural',
        conceptAssessed: '9. Basic singular and plural recognition',
        grammarRuleId: 'rule_gf_07_basic_mechanics',
        vocabularyId: 'voc_gf_student',
        questionUz: '9. Ko‘plik (Plural) va "There is / There are" qoidasiga ko‘ra qaysi gap to‘g‘ri?',
        options: [
          'There are three students in the classroom.',
          'There is three student in the classroom.',
          'There are one student in the classroom.',
          'There is books on the table.',
        ],
        correctAnswer: 'There are three students in the classroom.',
        explanationUz:
          'Birdan ortiq narsa yoki shaxs (three students) uchun "There are" va ko‘plikdagi "-s" qo‘shimchasi ishlatiladi.',
      },
      {
        id: 'q_assess_10_sentence_construction',
        conceptAssessed: '10. Simple sentence construction',
        grammarRuleId: 'rule_gf_01_word_order_meaning',
        vocabularyId: 'voc_gf_learn',
        questionUz: '10. "Biz maktabda ingliz tilini o‘rganamiz" fikrini ifodalovchi to‘g‘ri inglizcha gapni toping:',
        options: [
          'We learn English at school.',
          'We English learn at school.',
          'Learn we English school.',
          'At school English learn we.',
        ],
        correctAnswer: 'We learn English at school.',
        explanationUz:
          'We (Subject) + learn (Verb) + English (Object) + at school (Place phrase).',
      },
    ],
  },

  // ==================== PART 14: MANDATORY WRAP-UP CONFIGURATION ====================
  wrapUp: {
    title: {
      uz: 'Wrap-up — Dars yakuni va natijalar tahlili',
      en: 'Wrap-up',
    },
    summaryNoteUz:
      'Siz ingliz tili grammatikasining eng muhim poydevorini — harf va tovushdan tortib, so‘z, ibora, klauza, 8 ta so‘z turkumi va Subject + Verb + Object gap qurilishigacha muvaffaqiyatli o‘rgandingiz!',
    nextLessonId: 'lesson_02_parts_of_speech_intro',
    nextLessonTitleEn: 'Lesson 2 — Parts of Speech Introduction',
    nextLessonTitleUz: '2-Dars: So‘z turkumlariga kirish (Parts of Speech Introduction)',
    whyNextLessonLogicalUz:
      '1-darsda siz so‘zlar birlashib gap hosil qilishini va har bir so‘zning o‘z roli borligini bildingiz. Endi 2-darsda ("Parts of Speech Introduction") ushbu 8 ta so‘z turkumining har birini gap ichida qanday tanib olish va bir-biri bilan qanday bog‘lashni chuqurroq o‘rganamiz.',
  },

  // ==================== 10-STAGE STANDARD LESSON LIFECYCLE ====================
  sections: [
    {
      id: 'sec_01_intro',
      order: 1,
      stage: 'introduction',
      title: { uz: '1. Kirish (Lesson Introduction)', en: 'Lesson Introduction' },
      subtitle: { uz: 'Grammatika nima va u muloqotda qanday yordam beradi?' },
      theorySubtopics: [],
    },
    {
      id: 'sec_02_objectives',
      order: 2,
      stage: 'objectives',
      title: { uz: '2. O‘quv maqsadlari (Learning Objectives)', en: 'Learning Objectives' },
      subtitle: { uz: 'Ushbu fundamental darsda nimalarni o‘rganasiz?' },
    },
    {
      id: 'sec_03_explanation',
      order: 3,
      stage: 'explanation',
      title: { uz: '3. Asosiy tushuntirish (Sections 1–8)', en: 'Main Explanation' },
      subtitle: { uz: 'Harf, So‘z, Ibora, Klauza, Gap, 8 ta So‘z turkumi va S+V+O' },
    },
    {
      id: 'sec_04_examples',
      order: 4,
      stage: 'detailed_examples',
      title: { uz: '4. Batafsil misollar (Detailed Examples)', en: 'Detailed Examples' },
      subtitle: { uz: 'To‘g‘ri va noto‘g‘ri gaplar qiyosi hamda audio talaffuz' },
    },
    {
      id: 'sec_05_vocabulary',
      order: 5,
      stage: 'new_vocabulary',
      title: { uz: '5. Yangi lug‘at (New Vocabulary — 8 so‘z)', en: 'New Vocabulary' },
      subtitle: { uz: 'Student, Teacher, Book, School, Read, Write, Learn, Sentence' },
    },
    {
      id: 'sec_06_interactive_activities',
      order: 6,
      stage: 'interactive_activities',
      title: { uz: '6. Interaktiv o‘quv topshiriqlari (Activities 1–5)', en: 'Interactive Learning Activities' },
      subtitle: { uz: 'Tanib olish, so‘z yasash, tasniflash va S+V+O gap qurish' },
      exerciseIds: [
        'ex_act_01_letter_or_word',
        'ex_act_02_build_a_word',
        'ex_act_03_word_phrase_sentence',
        'ex_act_04_pos_matching',
        'ex_act_05_sentence_builder',
      ],
    },
    {
      id: 'sec_07_practice_exercises',
      order: 7,
      stage: 'practice_exercises',
      title: { uz: '7. Amaliy mashqlar va Krossvord (Activities 6–9)', en: 'Practice Exercises' },
      subtitle: { uz: 'Gap turlari, xatoni tuzatish va interaktiv 2D Krossvord' },
      exerciseIds: [
        'ex_act_06_sentence_types',
        'ex_act_07_capitalization_punctuation',
        'ex_act_08_find_the_mistake',
        'ex_act_09_crossword',
      ],
    },
    {
      id: 'sec_08_challenge',
      order: 8,
      stage: 'knowledge_challenge',
      title: { uz: '8. Bilim sinovi (Activity 10 — Grammar Challenge)', en: 'Grammar Challenge' },
      subtitle: { uz: 'Gapdagi barcha so‘z turkumlarini kompleks tahlil qilish' },
      exerciseIds: ['ex_act_10_fundamentals_challenge'],
    },
    {
      id: 'sec_09_final_assessment',
      order: 9,
      stage: 'final_assessment',
      title: { uz: '9. Yakuniy imtihon (Final Assessment — 10 savol)', en: 'Final Assessment' },
      subtitle: { uz: '10 ta fundamental tushuncha bo‘yicha yakuniy baholash' },
    },
    {
      id: 'sec_10_wrap_up',
      order: 10,
      stage: 'wrap_up',
      title: { uz: '10. Wrap-up (Dars yakuni va Tahlil)', en: 'Wrap-up' },
      subtitle: { uz: 'O‘zlashtirilgan qoidalar, noyob so‘zlar, aniqlik va keyingi dars' },
    },
  ],
};

/**
 * Lesson 2 Preview Content Contract so learners can immediately see the
 * scalable framework rendering multiple lessons without changing UI code.
 */
export const LESSON_02_PARTS_OF_SPEECH_INTRO: LearningLesson = {
  ...LESSON_01_GRAMMAR_FUNDAMENTALS,
  id: 'lesson_02_parts_of_speech_intro',
  version: 1,
  title: {
    uz: 'So‘z turkumlariga kirish (Parts of Speech Introduction)',
    en: 'Parts of Speech Introduction',
  },
  subtitle: {
    uz: 'A1 Foundation · 8 ta so‘z turkumi va gapdagi o‘zaro bog‘liqligi',
    en: 'Deep dive into how the 8 parts of speech interact inside sentences',
  },
};

export { LESSON_01_HELLO_A0 };

export const GRAMMAR_LESSONS_REGISTRY: Record<string, LearningLesson> = {
  [LESSON_01_HELLO_A0.id]: LESSON_01_HELLO_A0,
  [LESSON_01_GRAMMAR_FUNDAMENTALS.id]: LESSON_01_GRAMMAR_FUNDAMENTALS,
  [LESSON_02_PARTS_OF_SPEECH_INTRO.id]: LESSON_02_PARTS_OF_SPEECH_INTRO,
  lvl_1: LESSON_01_HELLO_A0,
  grammar_fundamentals_lvl_1: LESSON_01_HELLO_A0,
  grammar_fundamentals_lvl_2: LESSON_01_GRAMMAR_FUNDAMENTALS,
  grammar_fundamentals_lvl_3: LESSON_02_PARTS_OF_SPEECH_INTRO,
};
