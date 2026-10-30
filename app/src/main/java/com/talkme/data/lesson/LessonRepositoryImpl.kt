package com.talkme.data.lesson

import com.talkme.domain.lesson.model.*
import com.talkme.domain.lesson.repository.LessonRepository
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Production implementation of [LessonRepository] providing structured, versioned
 * TalkMe curriculum lessons including the flagship "Numbers and Counting (0–100)" lesson.
 */
@Singleton
class LessonRepositoryImpl @Inject constructor() : LessonRepository {

    private val numbersLessonPlan = LessonPlan(
        schemaVersion = 1,
        lessonId = "numerals_lvl_1",
        courseId = "numerals",
        title = "Numbers and Counting (0–100)",
        description = "Kundalik ingliz tilida 0 dan 100 gacha sonlarni sanash, o‘qish, yozish va gaplarda to‘g‘ri ishlatishni o‘rganing.",
        level = CefrLevel.A0,
        estimatedDurationMinutes = 12,
        difficultyLabel = "Boshlang‘ich (A0–A1)",
        learningObjectives = listOf(
            "0 dan 100 gacha bo‘lgan sonlarni tanish va talaffuz qilish",
            "13–19 (-teen) va 20–90 (-ty) sonlar imlosini farqlash",
            "Qo‘shma sonlarni (21 -> twenty-one) chiziqcha bilan yozish",
            "Miqdor va yosh haqida savol berish hamda javob qaytarish"
        ),
        heroVisual = VisualSpec(
            scene = VisualSceneType.NUMBER_GRID,
            count = 10,
            primaryLabel = "1 One · 2 Two · 3 Three · 10 Ten · 100 Hundred"
        ),
        rules = listOf(
            LessonRule(
                ruleId = "num_rule_1",
                orderNumber = 1,
                title = "Rule 1: Basic Numbers (0–10)",
                subtitleUz = "Asosiy sonlar va sanash qoidasi",
                explanationUz = "Sonlar odamlar, buyumlar, yosh va miqdorni sanash uchun ishlatiladi. 1 bo‘lsa ot birlikda (one apple), 2 va undan ko‘p bo‘lsa otga -s qo‘shiladi (three apples).",
                explanationEn = "Numbers are used to count people, objects, money, and age.",
                whenToUseUz = "Buyumlar sonini yoki yoshni aytganda.",
                formula = "Subject + have / has + Number + Plural Noun (-s)",
                pronounGrid = listOf(
                    PronounRuleCell("I / You / We / They", "have", "three apples"),
                    PronounRuleCell("He / She / It", "has", "five books"),
                    PronounRuleCell("I", "am", "twenty years old"),
                    PronounRuleCell("He / She", "is", "fifteen years old")
                ),
                tableRows = listOf(
                    RuleTableRow("1", "One", "/wʌn/", "One apple"),
                    RuleTableRow("2", "Two", "/tuː/", "Two books"),
                    RuleTableRow("3", "Three", "/θriː/", "Three apples"),
                    RuleTableRow("4", "Four", "/fɔːr/", "Four chairs"),
                    RuleTableRow("5", "Five", "/faɪv/", "Five bananas"),
                    RuleTableRow("10", "Ten", "/ten/", "Ten fingers")
                ),
                examples = listOf(
                    RuleExample("I have three books.", "Menda uchta kitob bor.", "three"),
                    RuleExample("There are five apples.", "Bu yerda beshta olma bor.", "five")
                ),
                commonMistakes = listOf(
                    CommonMistake(
                        incorrect = "I have three apple.",
                        correct = "I have three apples.",
                        explanationUz = "2 va undan katta sonlardan keyin sanaladigan ot ko‘plik (-s) qo‘shimchasini oladi."
                    )
                ),
                memoryTipUz = "1 = birlik (one book), 2+ = ko‘plik + s (two books).",
                additionalDetailsUz = "Zero (0) telefon raqamlarida ko‘pincha 'oh' (/oʊ/) deb ham o‘qiladi.",
                visualAsset = VisualSpec(VisualSceneType.COUNTING_APPLES, count = 3)
            ),
            LessonRule(
                ruleId = "num_rule_2",
                orderNumber = 2,
                title = "Rule 2: Numbers from 13 to 19 (-teen)",
                subtitleUz = "13 dan 19 gacha bo‘lgan sonlar (-teen)",
                explanationUz = "13 dan 19 gacha bo‘lgan sonlar '-teen' qo‘shimchasi bilan tugaydi. Urgent urg‘u '-TEEN' qismiga tushadi.",
                explanationEn = "Numbers from 13 to 19 end with -teen.",
                whenToUseUz = "13–19 orasidagi miqdor va o‘smirlik yoshini aytganda.",
                formula = "Root Number + TEEN (Thirteen, Fourteen, Fifteen...)",
                pronounGrid = listOf(
                    PronounRuleCell("13", "Thirteen", "three -> thir + teen"),
                    PronounRuleCell("14", "Fourteen", "four + teen"),
                    PronounRuleCell("15", "Fifteen", "five -> fif + teen"),
                    PronounRuleCell("18", "Eighteen", "eight + een (bitta t)")
                ),
                examples = listOf(
                    RuleExample("She is fifteen years old.", "U o‘n besh yoshda.", "fifteen")
                ),
                commonMistakes = listOf(
                    CommonMistake(
                        incorrect = "Fiveteen",
                        correct = "Fifteen",
                        explanationUz = "15 sonida 'five' o‘zagi 'fif-' shakliga o‘zgaradi."
                    )
                ),
                memoryTipUz = "Thirteen (13), Fifteen (15), Eighteen (18) imlosiga alohida e’tibor bering!",
                additionalDetailsUz = "Teenager (o‘smir) so‘zi aynan 13–19 (-teen) yosh oralig‘idan kelib chiqqan.",
                visualAsset = VisualSpec(VisualSceneType.NUMBER_GRID, count = 15)
            ),
            LessonRule(
                ruleId = "num_rule_3",
                orderNumber = 3,
                title = "Rule 3 & 4: Tens (-ty) & Compound Numbers",
                subtitleUz = "O‘nliklar (20–90) va qo‘shma sonlar (21–99)",
                explanationUz = "O‘nlik sonlar '-ty' bilan tugaydi (twenty, thirty, forty, fifty). Qo‘shma sonlarda esa o‘nlik va birlik orasiga chiziqcha (-) qo‘yiladi: 21 = twenty-one.",
                explanationEn = "Tens end with -ty. Compound numbers use a hyphen: twenty-one.",
                whenToUseUz = "20 dan 100 gacha bo‘lgan sonlar, narxlar va yoshni ifodalaganda.",
                formula = "Tens (-ty) + '-' + Unit (Twenty-one, Thirty-five)",
                pronounGrid = listOf(
                    PronounRuleCell("20 / 21", "Twenty", "Twenty-one"),
                    PronounRuleCell("30 / 35", "Thirty", "Thirty-five"),
                    PronounRuleCell("40", "Forty", "u harfisiz yoziladi!"),
                    PronounRuleCell("99 / 100", "Ninety-nine", "One hundred")
                ),
                examples = listOf(
                    RuleExample("She is twenty years old.", "U yigirma yoshda.", "twenty"),
                    RuleExample("There are twenty-one students.", "21 nafar o‘quvchi bor.", "twenty-one")
                ),
                commonMistakes = listOf(
                    CommonMistake(
                        incorrect = "Fourty",
                        correct = "Forty",
                        explanationUz = "40 soni 'Forty' deb yoziladi ('u' harfi tushib qoladi)."
                    )
                ),
                memoryTipUz = "Four (4) -> Fourteen (14) -> ammo Forty (40)!",
                additionalDetailsUz = "Yoshni aytishda hech qachon 'I have 20 years' demang, 'I am twenty years old' deb ayting.",
                visualAsset = VisualSpec(VisualSceneType.NUMBER_GRID, count = 40)
            )
        ),
        examples = listOf(
            AnimatedExample(
                exampleId = "ex_anim_1",
                sentenceEn = "I have three apples.",
                segments = listOf(
                    SentenceSegment("I have", false, "Ega + Fe’l"),
                    SentenceSegment("three", true, "Son (3)"),
                    SentenceSegment("apples.", false, "Ko‘plik ot (-s)")
                ),
                translationUz = "Menda uchta olma bor.",
                grammarNoteUz = "Three (3) ko‘plik bo‘lgani uchun 'apple' so‘ziga '-s' qo‘shildi.",
                visualSpec = VisualSpec(VisualSceneType.COUNTING_APPLES, count = 3)
            ),
            AnimatedExample(
                exampleId = "ex_anim_2",
                sentenceEn = "She has five books.",
                segments = listOf(
                    SentenceSegment("She has", false, "3-shaxs birlik"),
                    SentenceSegment("five", true, "Son (5)"),
                    SentenceSegment("books.", false, "Ko‘plik ot (-s)")
                ),
                translationUz = "Unda beshta kitob bor.",
                grammarNoteUz = "She/He/It bilan 'have' o‘rniga 'has' ishlatiladi.",
                visualSpec = VisualSpec(VisualSceneType.COUNTING_BOOKS, count = 5)
            )
        ),
        vocabulary = listOf(
            LessonVocabularyItem("voc_1", "One", "Bir (1)", "/wʌn/", "I have one brother.", "Mening bitta akam bor.", VisualSpec(VisualSceneType.COUNTING_APPLES, 1)),
            LessonVocabularyItem("voc_2", "Two", "Ikki (2)", "/tuː/", "Two cups of tea.", "Ikki piyola choy.", VisualSpec(VisualSceneType.COUNTING_BOOKS, 2)),
            LessonVocabularyItem("voc_3", "Three", "Uch (3)", "/θriː/", "I have three apples.", "Menda uchta olma bor.", VisualSpec(VisualSceneType.COUNTING_APPLES, 3)),
            LessonVocabularyItem("voc_4", "Four", "To‘rt (4)", "/fɔːr/", "There are four chairs.", "To‘rtta stul bor.", VisualSpec(VisualSceneType.COUNTING_PENCILS, 4)),
            LessonVocabularyItem("voc_5", "Five", "Besh (5)", "/faɪv/", "She has five books.", "Unda beshta kitob bor.", VisualSpec(VisualSceneType.COUNTING_BANANAS, 5)),
            LessonVocabularyItem("voc_10", "Ten", "O‘n (10)", "/ten/", "Count from one to ten.", "Birdan o‘ngacha sanang.", VisualSpec(VisualSceneType.NUMBER_GRID, 10)),
            LessonVocabularyItem("voc_100", "Hundred", "Yuz (100)", "/ˈhʌndrəd/", "One hundred percent.", "Yuz foiz.", VisualSpec(VisualSceneType.NUMBER_GRID, 100))
        ),
        exercises = listOf(
            LessonExercise(
                exerciseId = "fb_1",
                section = LessonSection.FILL_BLANKS,
                exerciseType = ExerciseType.FILL_BLANK,
                question = "Rasmda nechta olma bor? Bo‘sh joyni to‘ldiring:",
                instructions = "To‘g‘ri sonni tanlang",
                sentenceWithBlank = "I have ___ apples.",
                options = listOf("three", "five", "ten", "twenty"),
                correctAnswer = "three",
                explanationUz = "Rasmda 3 ta qizil olma bor: 3 = three.",
                imageAsset = VisualSpec(VisualSceneType.COUNTING_APPLES, count = 3)
            ),
            LessonExercise(
                exerciseId = "wb_1",
                section = LessonSection.WORD_BUILDER,
                exerciseType = ExerciseType.LETTER_BUILDER,
                question = "Harf kartochkalaridan '3 (Uch)' sonining inglizcha nomini tering:",
                instructions = "Harflarni ketma-ket bosing",
                correctAnswer = "THREE",
                distractorLetters = listOf('T', 'H', 'R', 'E', 'A', 'O', 'E'),
                explanationUz = "3 soni ingliz tilida T-H-R-E-E deb yoziladi.",
                imageAsset = VisualSpec(VisualSceneType.COUNTING_APPLES, count = 3)
            ),
            LessonExercise(
                exerciseId = "gr_1",
                section = LessonSection.GRAMMAR_PRACTICE,
                exerciseType = ExerciseType.SENTENCE_BUILDER,
                question = "So‘zlarni to‘g‘ri tartibda joylashtirib gap tuzing:",
                instructions = "Menda uchta kitob bor",
                scrambledWords = listOf("books", "three", "have", "I"),
                correctAnswer = "I have three books",
                explanationUz = "Ingliz tilida gap tartibi: Ega (I) + Fe’l (have) + Son (three) + Ot (books)."
            ),
            LessonExercise(
                exerciseId = "ls_1",
                section = LessonSection.LISTENING,
                exerciseType = ExerciseType.AUDIO_CHOICE,
                question = "Audioni tinglang: So‘zlovchida nechta qalam bor?",
                instructions = "Audioni tinglab javobni belgilang",
                options = listOf("Five", "Seven", "Ten", "Twelve"),
                correctAnswer = "Seven",
                audioAsset = "I have seven pencils.",
                explanationUz = "Audioda 'I have seven pencils' (7 ta qalam) deyildi."
            )
        ),
        assessment = listOf(
            LessonExercise(
                exerciseId = "test_1",
                section = LessonSection.FINAL_ASSESSMENT,
                exerciseType = ExerciseType.FILL_BLANK,
                question = "1-savol: 'There are ___ apples on the table.' (3 ta olma)",
                instructions = "To‘g‘ri javobni tanlang",
                sentenceWithBlank = "There are ___ apples on the table.",
                options = listOf("three", "thirteen", "thirty", "tree"),
                correctAnswer = "three",
                explanationUz = "3 = three."
            ),
            LessonExercise(
                exerciseId = "test_2",
                section = LessonSection.FINAL_ASSESSMENT,
                exerciseType = ExerciseType.LETTER_BUILDER,
                question = "2-savol: '5 (Besh)' sonini harflardan tering:",
                instructions = "Harflarni tanlang",
                correctAnswer = "FIVE",
                distractorLetters = listOf('F', 'I', 'V', 'E', 'A', 'O'),
                explanationUz = "5 = FIVE."
            )
        ),
        completionCriteria = CompletionCriteria(
            minPassPercentage = 70,
            xpReward = 35,
            diamondsReward = 15
        )
    )

    override fun getLessonPlan(courseId: String, lessonId: String): LessonPlan {
        if (courseId == FirstBeginnerLessonCatalog.COURSE_ID ||
            lessonId == FirstBeginnerLessonCatalog.LESSON_ID
        ) {
            return FirstBeginnerLessonCatalog.buildLessonPlan(
                com.talkme.domain.localization.InterfaceLanguage.UZBEK
            )
        }
        return numbersLessonPlan
    }

    override fun getAllLessons(): List<LessonPlan> {
        return listOf(
            FirstBeginnerLessonCatalog.buildLessonPlan(
                com.talkme.domain.localization.InterfaceLanguage.UZBEK
            ),
            numbersLessonPlan
        )
    }
}
