package com.talkme.data.lesson

import com.talkme.domain.lesson.model.*
import com.talkme.domain.localization.*

/**
 * Language-independent catalog and localized language packs for the first
 * Absolute Beginner (A0) English Fundamentals lesson:
 * `lesson_id: "grammar_fundamentals_001"` — "Hello! Welcome to TalkMe!".
 *
 * Strictly uses only the 6 core beginner expressions:
 * 1. Hello
 * 2. Hi
 * 3. Thank you
 * 4. I am
 * 5. Welcome
 * 6. Goodbye
 */
object FirstBeginnerLessonCatalog {

    const val LESSON_ID = "grammar_fundamentals_001"
    const val COURSE_ID = "grammar_fundamentals"

    val strictSixVocabularyIds = setOf(
        "voc_a0_hello",
        "voc_a0_hi",
        "voc_a0_thank_you",
        "voc_a0_i_am",
        "voc_a0_welcome",
        "voc_a0_goodbye"
    )

    val tenBeginnerStepIds = setOf(
        "step_1_welcome",
        "step_2_greeting",
        "step_3_how_talkme_works",
        "step_4_discover_today",
        "step_5_vocabulary",
        "step_6_simple_grammar",
        "step_7_everyday_examples",
        "step_8_interactive_exercises",
        "step_9_listening_pronunciation",
        "step_10_completion"
    )

    val sixExerciseIds = setOf(
        "ex_a0_01_choose_translation",
        "ex_a0_02_match_words",
        "ex_a0_03_complete_conversation",
        "ex_a0_04_listen_identify",
        "ex_a0_05_repeat_tts",
        "ex_a0_06_speaking_mic"
    )

    val ttsPronunciationCatalog = listOf(
        TtsPronunciationMeta("tts_hello", "Hello", "/həˈloʊ/"),
        TtsPronunciationMeta("tts_hi", "Hi", "/haɪ/"),
        TtsPronunciationMeta("tts_thank_you", "Thank you", "/ˈθæŋk juː/"),
        TtsPronunciationMeta("tts_i_am", "I am", "/aɪ æm/"),
        TtsPronunciationMeta("tts_welcome", "Welcome", "/ˈwel.kəm/"),
        TtsPronunciationMeta("tts_goodbye", "Goodbye", "/ˌɡʊdˈbaɪ/")
    )

    /**
     * Builds the localized [LessonPlan] for `grammar_fundamentals_001` in the active [InterfaceLanguage].
     */
    fun buildLessonPlan(language: InterfaceLanguage): LessonPlan {
        val pack = getLanguagePack(language).localizedLessons[LESSON_ID]
            ?: getLanguagePack(InterfaceLanguage.UZBEK).localizedLessons.getValue(LESSON_ID)

        return LessonPlan(
            schemaVersion = 2,
            lessonId = LESSON_ID,
            courseId = COURSE_ID,
            title = pack.localizedTitle,
            description = pack.localizedDescription,
            level = CefrLevel.A0,
            estimatedDurationMinutes = 8,
            difficultyLabel = pack.difficultyLabel,
            learningObjectives = pack.learningObjectives,
            heroVisual = VisualSpec(
                scene = VisualSceneType.COUNTING_BOOKS,
                count = 6,
                primaryLabel = "Hello! · Hi! · Thank you! · I am · Welcome! · Goodbye!"
            ),
            rules = listOf(
                LessonRule(
                    ruleId = "a0_rule_grammar_blocks",
                    orderNumber = 1,
                    title = "Grammar = Putting Words Together",
                    subtitleUz = pack.localizedSubtitle,
                    explanationUz = pack.stepExplanations["step_6_simple_grammar"].orEmpty(),
                    explanationEn = "Grammar is how we put words together to make sentences.",
                    whenToUseUz = pack.stepExplanations["step_2_greeting"].orEmpty(),
                    formula = "I am + [Name] -> I am Aziz.",
                    pronounGrid = listOf(
                        PronounRuleCell("Hello!", "Welcome!", "Hello! Welcome!"),
                        PronounRuleCell("I am", "Aziz", "I am Aziz."),
                        PronounRuleCell("Thank you!", "Goodbye!", "Thank you! Goodbye!")
                    ),
                    tableRows = listOf(
                        RuleTableRow("1", "Hello", "/həˈloʊ/", pack.vocabularyMeanings["voc_a0_hello"].orEmpty()),
                        RuleTableRow("2", "Hi", "/haɪ/", pack.vocabularyMeanings["voc_a0_hi"].orEmpty()),
                        RuleTableRow("3", "Thank you", "/ˈθæŋk juː/", pack.vocabularyMeanings["voc_a0_thank_you"].orEmpty()),
                        RuleTableRow("4", "I am", "/aɪ æm/", pack.vocabularyMeanings["voc_a0_i_am"].orEmpty()),
                        RuleTableRow("5", "Welcome", "/ˈwel.kəm/", pack.vocabularyMeanings["voc_a0_welcome"].orEmpty()),
                        RuleTableRow("6", "Goodbye", "/ˌɡʊdˈbaɪ/", pack.vocabularyMeanings["voc_a0_goodbye"].orEmpty())
                    ),
                    examples = listOf(
                        RuleExample("Hello! I am Aziz.", pack.vocabularyMeanings["voc_a0_i_am"].orEmpty(), "I am"),
                        RuleExample("Hi! Welcome!", pack.vocabularyMeanings["voc_a0_welcome"].orEmpty(), "Welcome"),
                        RuleExample("Thank you! Goodbye!", pack.vocabularyMeanings["voc_a0_thank_you"].orEmpty(), "Thank you")
                    ),
                    commonMistakes = emptyList(),
                    memoryTipUz = pack.completionConfidenceQuote,
                    additionalDetailsUz = pack.stepExplanations["step_1_welcome"].orEmpty(),
                    visualAsset = VisualSpec(VisualSceneType.COUNTING_BOOKS, count = 6)
                )
            ),
            examples = listOf(
                AnimatedExample(
                    exampleId = "a0_ex_1",
                    sentenceEn = "Hello! I am Aziz.",
                    segments = listOf(
                        SentenceSegment("Hello!", false, "Greeting"),
                        SentenceSegment("I am", true, "Self-Intro"),
                        SentenceSegment("Aziz.", false, "Name")
                    ),
                    translationUz = pack.vocabularyMeanings["voc_a0_i_am"].orEmpty(),
                    grammarNoteUz = pack.stepExplanations["step_6_simple_grammar"].orEmpty(),
                    visualSpec = VisualSpec(VisualSceneType.COUNTING_BOOKS, count = 2)
                ),
                AnimatedExample(
                    exampleId = "a0_ex_2",
                    sentenceEn = "Hi! Welcome!",
                    segments = listOf(
                        SentenceSegment("Hi!", false, "Greeting"),
                        SentenceSegment("Welcome!", true, "Warm Welcome")
                    ),
                    translationUz = pack.vocabularyMeanings["voc_a0_welcome"].orEmpty(),
                    grammarNoteUz = pack.stepExplanations["step_2_greeting"].orEmpty(),
                    visualSpec = VisualSpec(VisualSceneType.COUNTING_APPLES, count = 2)
                ),
                AnimatedExample(
                    exampleId = "a0_ex_3",
                    sentenceEn = "Thank you! Goodbye!",
                    segments = listOf(
                        SentenceSegment("Thank you!", true, "Gratitude"),
                        SentenceSegment("Goodbye!", false, "Farewell")
                    ),
                    translationUz = pack.vocabularyMeanings["voc_a0_thank_you"].orEmpty(),
                    grammarNoteUz = pack.stepExplanations["step_7_everyday_examples"].orEmpty(),
                    visualSpec = VisualSpec(VisualSceneType.COUNTING_BOOKS, count = 2)
                )
            ),
            vocabulary = listOf(
                LessonVocabularyItem("voc_a0_hello", "Hello", pack.vocabularyMeanings["voc_a0_hello"].orEmpty(), "/həˈloʊ/", "Hello! I am Aziz.", pack.vocabularyMeanings["voc_a0_hello"].orEmpty(), VisualSpec(VisualSceneType.COUNTING_BOOKS, 1)),
                LessonVocabularyItem("voc_a0_hi", "Hi", pack.vocabularyMeanings["voc_a0_hi"].orEmpty(), "/haɪ/", "Hi! Welcome!", pack.vocabularyMeanings["voc_a0_hi"].orEmpty(), VisualSpec(VisualSceneType.COUNTING_BOOKS, 1)),
                LessonVocabularyItem("voc_a0_thank_you", "Thank you", pack.vocabularyMeanings["voc_a0_thank_you"].orEmpty(), "/ˈθæŋk juː/", "Thank you! Goodbye!", pack.vocabularyMeanings["voc_a0_thank_you"].orEmpty(), VisualSpec(VisualSceneType.COUNTING_BOOKS, 1)),
                LessonVocabularyItem("voc_a0_i_am", "I am", pack.vocabularyMeanings["voc_a0_i_am"].orEmpty(), "/aɪ æm/", "I am Aziz.", pack.vocabularyMeanings["voc_a0_i_am"].orEmpty(), VisualSpec(VisualSceneType.COUNTING_BOOKS, 1)),
                LessonVocabularyItem("voc_a0_welcome", "Welcome", pack.vocabularyMeanings["voc_a0_welcome"].orEmpty(), "/ˈwel.kəm/", "Hello! Welcome!", pack.vocabularyMeanings["voc_a0_welcome"].orEmpty(), VisualSpec(VisualSceneType.COUNTING_BOOKS, 1)),
                LessonVocabularyItem("voc_a0_goodbye", "Goodbye", pack.vocabularyMeanings["voc_a0_goodbye"].orEmpty(), "/ˌɡʊdˈbaɪ/", "Thank you! Goodbye!", pack.vocabularyMeanings["voc_a0_goodbye"].orEmpty(), VisualSpec(VisualSceneType.COUNTING_BOOKS, 1))
            ),
            exercises = listOf(
                LessonExercise(
                    exerciseId = "ex_a0_01_choose_translation",
                    section = LessonSection.VOCABULARY,
                    exerciseType = ExerciseType.MULTIPLE_CHOICE,
                    question = pack.exercisePrompts["ex_a0_01_choose_translation"].orEmpty(),
                    instructions = pack.localizedSubtitle,
                    options = listOf("Thank you", "Hello", "Goodbye", "Welcome"),
                    correctAnswer = "Thank you",
                    explanationUz = pack.positiveFeedback["ex_a0_01_choose_translation"].orEmpty()
                ),
                LessonExercise(
                    exerciseId = "ex_a0_02_match_words",
                    section = LessonSection.MIXED_PRACTICE,
                    exerciseType = ExerciseType.MATCHING_PAIRS,
                    question = pack.exercisePrompts["ex_a0_02_match_words"].orEmpty(),
                    instructions = pack.localizedSubtitle,
                    matchingPairs = listOf(
                        MatchingPair("p1", "Hello", pack.vocabularyMeanings["voc_a0_hello"].orEmpty()),
                        MatchingPair("p2", "Thank you", pack.vocabularyMeanings["voc_a0_thank_you"].orEmpty()),
                        MatchingPair("p3", "Welcome", pack.vocabularyMeanings["voc_a0_welcome"].orEmpty()),
                        MatchingPair("p4", "Goodbye", pack.vocabularyMeanings["voc_a0_goodbye"].orEmpty())
                    ),
                    correctAnswer = "Hello",
                    explanationUz = pack.positiveFeedback["ex_a0_02_match_words"].orEmpty()
                ),
                LessonExercise(
                    exerciseId = "ex_a0_03_complete_conversation",
                    section = LessonSection.FILL_BLANKS,
                    exerciseType = ExerciseType.CONVERSATION_COMPLETION,
                    question = pack.exercisePrompts["ex_a0_03_complete_conversation"].orEmpty(),
                    instructions = pack.localizedSubtitle,
                    sentenceWithBlank = "Hi! ___ Aziz.",
                    options = listOf("I am", "Goodbye", "Thank you"),
                    correctAnswer = "I am",
                    explanationUz = pack.positiveFeedback["ex_a0_03_complete_conversation"].orEmpty()
                ),
                LessonExercise(
                    exerciseId = "ex_a0_04_listen_identify",
                    section = LessonSection.LISTENING,
                    exerciseType = ExerciseType.AUDIO_CHOICE,
                    question = pack.exercisePrompts["ex_a0_04_listen_identify"].orEmpty(),
                    instructions = pack.localizedSubtitle,
                    options = listOf("Welcome", "Hello", "Goodbye", "Hi"),
                    correctAnswer = "Welcome",
                    audioAsset = "Welcome",
                    explanationUz = pack.positiveFeedback["ex_a0_04_listen_identify"].orEmpty()
                )
            ),
            assessment = listOf(
                LessonExercise(
                    exerciseId = "ex_a0_05_repeat_tts",
                    section = LessonSection.FINAL_ASSESSMENT,
                    exerciseType = ExerciseType.MULTIPLE_CHOICE,
                    question = pack.exercisePrompts["ex_a0_05_repeat_tts"].orEmpty(),
                    instructions = pack.localizedSubtitle,
                    options = listOf("Hello! I am Aziz.", "Thank you! Goodbye!", "Hi! Welcome!"),
                    correctAnswer = "Hello! I am Aziz.",
                    explanationUz = pack.positiveFeedback["ex_a0_05_repeat_tts"].orEmpty()
                )
            ),
            completionCriteria = CompletionCriteria(
                minPassPercentage = 70,
                xpReward = 40,
                diamondsReward = 20
            )
        )
    }

    /**
     * Returns all registered [LanguagePack] instances (`uz`, `ru`, `en`, `ko`).
     */
    fun getAllLanguagePacks(): List<LanguagePack> = listOf(
        uzbekPack,
        russianPack,
        englishPack,
        koreanPack
    )

    /**
     * Returns the [LanguagePack] for [language] with fallback to [uzbekPack].
     */
    fun getLanguagePack(language: InterfaceLanguage): LanguagePack {
        return getAllLanguagePacks().firstOrNull { it.language == language } ?: uzbekPack
    }

    private val uzbekPack = LanguagePack(
        language = InterfaceLanguage.UZBEK,
        uiTranslations = mapOf(
            "greeting" to "Salom, {name}!",
            "start_learning" to "O‘rganishni boshlash"
        ),
        localizedLessons = mapOf(
            LESSON_ID to LocalizedLessonContent(
                lessonId = LESSON_ID,
                languageCode = "uz",
                localizedTitle = "Hello! Welcome to TalkMe!",
                localizedSubtitle = "1-Dars: Salom! TalkMe ilovasiga xush kelibsiz! (A0)",
                localizedDescription = "Ingliz tilini noldan boshlovchilar uchun ilk qadam — 6 ta asosiy so‘z va oson muloqot.",
                difficultyLabel = "A0 · Boshlang‘ich",
                learningObjectives = listOf(
                    "Salomlashish (Hello! / Hi!) va xayrlashish (Goodbye!)",
                    "I am yordamida o‘z ismini aytib tanishtirish",
                    "Rahmat aytish (Thank you!) va kutib olish (Welcome!)"
                ),
                vocabularyMeanings = mapOf(
                    "voc_a0_hello" to "Salom / Assalomu alaykum",
                    "voc_a0_hi" to "Salom (do‘stona)",
                    "voc_a0_thank_you" to "Rahmat / Tashakkur",
                    "voc_a0_i_am" to "Men ...man",
                    "voc_a0_welcome" to "Xush kelibsiz!",
                    "voc_a0_goodbye" to "Xayr / Ko‘rishguncha"
                ),
                stepExplanations = mapOf(
                    "step_1_welcome" to "TalkMe ilovasiga xush kelibsiz! Oldindan ingliz tili bilimi talab qilinmaydi.",
                    "step_2_greeting" to "Hello va Hi yordamida samimiy salomlashamiz.",
                    "step_3_how_talkme_works" to "So‘zlar, tinglash, gapirish va interaktiv mashqlar orqali o‘rganamiz.",
                    "step_4_discover_today" to "Bugun salomlashish, tanishish va rahmat aytishni o‘rganasiz.",
                    "step_5_vocabulary" to "Faqat 6 ta asosiy so‘z: Hello, Hi, Thank you, I am, Welcome, Goodbye.",
                    "step_6_simple_grammar" to "Grammatika — so‘zlarni kubiklar kabi ulab gap tuzishdir. 1-darsda Ot, Fe’l kabi atamalarni yodlash shart emas!",
                    "step_7_everyday_examples" to "Hello! I am Aziz. · Hi! Welcome! · Thank you! Goodbye!",
                    "step_8_interactive_exercises" to "6 ta so‘z yordamida interaktiv mashqlar.",
                    "step_9_listening_pronunciation" to "Normal va sekin tezlikda tinglab qaytaring.",
                    "step_10_completion" to "Bu juda oson ekan. Men buni uddalay olaman!"
                ),
                exercisePrompts = mapOf(
                    "ex_a0_01_choose_translation" to "Thank you iborasining ma’nosi nima?",
                    "ex_a0_02_match_words" to "Inglizcha so‘zlarni ma’nosi bilan juftlang",
                    "ex_a0_03_complete_conversation" to "Suhbatni to‘ldiring: Hi! ___ Aziz.",
                    "ex_a0_04_listen_identify" to "Audioni tinglang va so‘zni toping",
                    "ex_a0_05_repeat_tts" to "TTS orqali tinglang va qaytaring: Hello! I am Aziz.",
                    "ex_a0_06_speaking_mic" to "Mikrofonga ayting: Hi! Welcome!"
                ),
                positiveFeedback = mapOf(
                    "ex_a0_01_choose_translation" to "Barakalla! Thank you = Rahmat.",
                    "ex_a0_02_match_words" to "Ajoyib! Barcha juftliklar to‘g‘ri!",
                    "ex_a0_03_complete_conversation" to "To‘g‘ri! Hi! I am Aziz.",
                    "ex_a0_04_listen_identify" to "Ofarin! Welcome = Xush kelibsiz.",
                    "ex_a0_05_repeat_tts" to "A’lo! Hello! I am Aziz.",
                    "ex_a0_06_speaking_mic" to "Qoyilmaqom talaffuz!"
                ),
                retryFeedback = mapOf(
                    "ex_a0_01_choose_translation" to "Qayta urinib ko‘ring."
                ),
                completionConfidenceQuote = "Bu juda oson ekan. Men buni uddalay olaman!"
            )
        )
    )

    private val russianPack = LanguagePack(
        language = InterfaceLanguage.RUSSIAN,
        uiTranslations = mapOf(
            "greeting" to "Привет, {name}!",
            "start_learning" to "Начать обучение"
        ),
        localizedLessons = mapOf(
            LESSON_ID to LocalizedLessonContent(
                lessonId = LESSON_ID,
                languageCode = "ru",
                localizedTitle = "Hello! Welcome to TalkMe!",
                localizedSubtitle = "Урок 1: Привет! Добро пожаловать в TalkMe! (A0)",
                localizedDescription = "Первый шаг в английском с абсолютного нуля — 6 главных слов и живая практика.",
                difficultyLabel = "A0 · Абсолютный новичок",
                learningObjectives = listOf(
                    "Приветствовать (Hello! / Hi!) и прощаться (Goodbye!)",
                    "Представляться с помощью I am ...",
                    "Благодарить (Thank you!) и встречать гостей (Welcome!)"
                ),
                vocabularyMeanings = mapOf(
                    "voc_a0_hello" to "Здравствуйте / Привет",
                    "voc_a0_hi" to "Привет (дружеское)",
                    "voc_a0_thank_you" to "Спасибо",
                    "voc_a0_i_am" to "Я (есть) ...",
                    "voc_a0_welcome" to "Добро пожаловать!",
                    "voc_a0_goodbye" to "До свидания"
                ),
                stepExplanations = mapOf(
                    "step_1_welcome" to "Добро пожаловать в TalkMe! Предварительные знания не нужны.",
                    "step_2_greeting" to "Здороваемся легко с помощью Hello и Hi.",
                    "step_3_how_talkme_works" to "Учимся через слова, слушание, речь и практику.",
                    "step_4_discover_today" to "Сегодня вы научитесь здороваться, представляться и благодарить.",
                    "step_5_vocabulary" to "Всего 6 слов: Hello, Hi, Thank you, I am, Welcome, Goodbye.",
                    "step_6_simple_grammar" to "Грамматика — это способ складывать слова вместе, как кубики. Сложные термины (Noun, Verb) учить сейчас не нужно!",
                    "step_7_everyday_examples" to "Hello! I am Aziz. · Hi! Welcome! · Thank you! Goodbye!",
                    "step_8_interactive_exercises" to "Интерактивные задания по 6 словам урока.",
                    "step_9_listening_pronunciation" to "Слушайте в обычном и медленном темпе.",
                    "step_10_completion" to "Это легко! У меня всё получается!"
                ),
                exercisePrompts = mapOf(
                    "ex_a0_01_choose_translation" to "Как переводится выражение Thank you?",
                    "ex_a0_02_match_words" to "Соедините английские слова с переводом",
                    "ex_a0_03_complete_conversation" to "Дополните диалог: Hi! ___ Aziz.",
                    "ex_a0_04_listen_identify" to "Прослушайте и выберите слово",
                    "ex_a0_05_repeat_tts" to "Повторите за диктором: Hello! I am Aziz.",
                    "ex_a0_06_speaking_mic" to "Произнесите в микрофон: Hi! Welcome!"
                ),
                positiveFeedback = mapOf(
                    "ex_a0_01_choose_translation" to "Отлично! Thank you = Спасибо.",
                    "ex_a0_02_match_words" to "Превосходно! Все пары верны!",
                    "ex_a0_03_complete_conversation" to "Верно! Hi! I am Aziz.",
                    "ex_a0_04_listen_identify" to "Замечательно! Welcome = Добро пожаловать.",
                    "ex_a0_05_repeat_tts" to "Супер! Hello! I am Aziz.",
                    "ex_a0_06_speaking_mic" to "Отличное произношение!"
                ),
                retryFeedback = mapOf(
                    "ex_a0_01_choose_translation" to "Попробуйте ещё раз."
                ),
                completionConfidenceQuote = "Это легко! У меня всё получается!"
            )
        )
    )

    private val englishPack = LanguagePack(
        language = InterfaceLanguage.ENGLISH,
        uiTranslations = mapOf(
            "greeting" to "Hello, {name}!",
            "start_learning" to "Start Learning"
        ),
        localizedLessons = mapOf(
            LESSON_ID to LocalizedLessonContent(
                lessonId = LESSON_ID,
                languageCode = "en",
                localizedTitle = "Hello! Welcome to TalkMe!",
                localizedSubtitle = "Lesson 1: Your Very First Step in English (A0)",
                localizedDescription = "A warm first lesson for complete beginners with 6 everyday expressions.",
                difficultyLabel = "A0 · Absolute Beginner",
                learningObjectives = listOf(
                    "Greet warmly (Hello! / Hi!) and say goodbye (Goodbye!)",
                    "Introduce yourself with I am ...",
                    "Say Thank you! and Welcome!"
                ),
                vocabularyMeanings = mapOf(
                    "voc_a0_hello" to "Polite greeting",
                    "voc_a0_hi" to "Friendly short greeting",
                    "voc_a0_thank_you" to "Polite gratitude",
                    "voc_a0_i_am" to "Self-introduction starter",
                    "voc_a0_welcome" to "Warm reception",
                    "voc_a0_goodbye" to "Polite farewell"
                ),
                stepExplanations = mapOf(
                    "step_1_welcome" to "Welcome to TalkMe! No prior English knowledge is required.",
                    "step_2_greeting" to "Start any conversation with Hello! or Hi!",
                    "step_3_how_talkme_works" to "Learn through words, listening, speaking, and interactive practice.",
                    "step_4_discover_today" to "Discover how to greet, introduce yourself, and thank people.",
                    "step_5_vocabulary" to "Only 6 core words: Hello, Hi, Thank you, I am, Welcome, Goodbye.",
                    "step_6_simple_grammar" to "Grammar is how we put words together to make sentences. No need to memorize Noun or Verb in Lesson 1!",
                    "step_7_everyday_examples" to "Hello! I am Aziz. · Hi! Welcome! · Thank you! Goodbye!",
                    "step_8_interactive_exercises" to "Practice with your 6 new expressions.",
                    "step_9_listening_pronunciation" to "Listen at normal and slow speeds.",
                    "step_10_completion" to "This is easy. I can do it!"
                ),
                exercisePrompts = mapOf(
                    "ex_a0_01_choose_translation" to "What does Thank you express?",
                    "ex_a0_02_match_words" to "Match each English word with its meaning",
                    "ex_a0_03_complete_conversation" to "Complete the conversation: Hi! ___ Aziz.",
                    "ex_a0_04_listen_identify" to "Listen and select the spoken word",
                    "ex_a0_05_repeat_tts" to "Repeat with TTS: Hello! I am Aziz.",
                    "ex_a0_06_speaking_mic" to "Speak into the microphone: Hi! Welcome!"
                ),
                positiveFeedback = mapOf(
                    "ex_a0_01_choose_translation" to "Great job! Thank you expresses gratitude.",
                    "ex_a0_02_match_words" to "Wonderful! All pairs matched!",
                    "ex_a0_03_complete_conversation" to "Spot on! Hi! I am Aziz.",
                    "ex_a0_04_listen_identify" to "Awesome! Welcome.",
                    "ex_a0_05_repeat_tts" to "Excellent! Hello! I am Aziz.",
                    "ex_a0_06_speaking_mic" to "Fantastic pronunciation!"
                ),
                retryFeedback = mapOf(
                    "ex_a0_01_choose_translation" to "Try again."
                ),
                completionConfidenceQuote = "This is easy. I can do it!"
            )
        )
    )

    private val koreanPack = LanguagePack(
        language = InterfaceLanguage.KOREAN,
        typographySpec = LanguageTypographySpec(lineHeightScale = 1.08f, supportsCjkLineBreak = true),
        uiTranslations = mapOf(
            "greeting" to "안녕하세요, {name}님!",
            "start_learning" to "학습 시작하기"
        ),
        localizedLessons = mapOf(
            LESSON_ID to LocalizedLessonContent(
                lessonId = LESSON_ID,
                languageCode = "ko",
                localizedTitle = "Hello! Welcome to TalkMe!",
                localizedSubtitle = "1강: 안녕하세요! TalkMe에 오신 것을 환영합니다! (A0)",
                localizedDescription = "영어를 처음 시작하는 왕초보를 위한 첫 수업 — 핵심 표현 6개.",
                difficultyLabel = "A0 · 왕초보 입문",
                learningObjectives = listOf(
                    "영어로 반갑게 인사하기 (Hello! / Hi!) 및 작별 인사하기 (Goodbye!)",
                    "I am ...으로 내 이름 소개하기",
                    "감사 표현(Thank you!)과 환영 인사(Welcome!) 익히기"
                ),
                vocabularyMeanings = mapOf(
                    "voc_a0_hello" to "안녕하세요",
                    "voc_a0_hi" to "안녕! (친근한 인사)",
                    "voc_a0_thank_you" to "감사합니다",
                    "voc_a0_i_am" to "나는 ...입니다",
                    "voc_a0_welcome" to "환영합니다!",
                    "voc_a0_goodbye" to "안녕히 가세요"
                ),
                stepExplanations = mapOf(
                    "step_1_welcome" to "TalkMe에 오신 것을 환영합니다! 영어 사전 지식이 전혀 필요 없습니다.",
                    "step_2_greeting" to "Hello와 Hi로 반갑게 인사를 시작해요.",
                    "step_3_how_talkme_works" to "단어, 듣기, 말하기, 쉬운 문법과 연습 문제로 배웁니다.",
                    "step_4_discover_today" to "인사하기, 자기소개, 감사와 작별 인사를 배웁니다.",
                    "step_5_vocabulary" to "딱 6개의 핵심 단어: Hello, Hi, Thank you, I am, Welcome, Goodbye.",
                    "step_6_simple_grammar" to "문법은 단어를 블록처럼 연결해 문장을 만드는 방법입니다. 명사, 동사 같은 어려운 용어는 외울 필요가 없어요!",
                    "step_7_everyday_examples" to "Hello! I am Aziz. · Hi! Welcome! · Thank you! Goodbye!",
                    "step_8_interactive_exercises" to "배운 6개 표현으로 문제를 풀어보세요.",
                    "step_9_listening_pronunciation" to "일반 속도와 느린 속도로 듣고 따라 해보세요.",
                    "step_10_completion" to "생각보다 정말 쉽네요! 저도 할 수 있어요!"
                ),
                exercisePrompts = mapOf(
                    "ex_a0_01_choose_translation" to "Thank you의 올바른 뜻은 무엇인가요?",
                    "ex_a0_02_match_words" to "영어 단어와 한국어 뜻을 연결하세요",
                    "ex_a0_03_complete_conversation" to "대화를 완성하세요: Hi! ___ Aziz.",
                    "ex_a0_04_listen_identify" to "음성을 듣고 알맞은 단어를 고르세요",
                    "ex_a0_05_repeat_tts" to "TTS 발음을 듣고 따라 하세요: Hello! I am Aziz.",
                    "ex_a0_06_speaking_mic" to "마이크에 말해보세요: Hi! Welcome!"
                ),
                positiveFeedback = mapOf(
                    "ex_a0_01_choose_translation" to "정답입니다! Thank you = 감사합니다.",
                    "ex_a0_02_match_words" to "훌륭해요! 모든 단어 짝을 맞혔습니다!",
                    "ex_a0_03_complete_conversation" to "잘했어요! Hi! I am Aziz.",
                    "ex_a0_04_listen_identify" to "정확해요! Welcome = 환영합니다.",
                    "ex_a0_05_repeat_tts" to "멋져요! Hello! I am Aziz.",
                    "ex_a0_06_speaking_mic" to "참 잘했어요! 정확한 발음입니다!"
                ),
                retryFeedback = mapOf(
                    "ex_a0_01_choose_translation" to "다시 한번 시도해 보세요."
                ),
                completionConfidenceQuote = "생각보다 정말 쉽네요! 저도 할 수 있어요!"
            )
        )
    )
}
