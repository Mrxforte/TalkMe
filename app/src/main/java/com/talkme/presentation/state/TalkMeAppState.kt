package com.talkme.presentation.state

import androidx.compose.runtime.Composable
import androidx.compose.runtime.Stable
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.graphics.Color
import com.talkme.domain.voice.engine.EngineSelectionMode
import com.talkme.domain.voice.engine.VoiceCharacterProfile
import kotlin.math.max
import kotlin.math.min
import kotlin.math.pow

/**
 * Grammar Category metadata matching `src/screens/CoursesScreen.tsx`.
 */
data class GrammarCategoryUiModel(
    val id: String,
    val title: String,
    val subtitle: String,
    val topicsCount: String,
    val illustrationId: String,
    val accentColor: Color,
    val bgTint: Color
)

/**
 * Node types for `CourseLevelsScreen` matching `src/types/index.ts`.
 */
enum class LevelNodeType {
    MASCOT_INTRO,
    STAR,
    READING,
    MIC,
    PRACTICE,
    CAMERA,
    HEADPHONES,
    CHEST
}

/**
 * Level node status on the Duolingo-style course path.
 */
enum class LevelNodeStatus {
    COMPLETED,
    CURRENT,
    LOCKED
}

/**
 * Individual level node on `CourseLevelsScreen` matching `src/screens/CourseLevelsScreen.tsx`.
 */
data class CourseLevelNodeUiModel(
    val id: String,
    val index: Int,
    val title: String,
    val subtitle: String,
    val nodeType: LevelNodeType,
    val xpReward: Int,
    val status: LevelNodeStatus,
    val linkedLessonId: String
)

/**
 * Course curriculum definition matching `COURSE_CURRICULA` in `CourseLevelsScreen.tsx`.
 */
data class CourseCurriculumUiModel(
    val courseId: String,
    val title: String,
    val subtitle: String,
    val sectionLabel: String,
    val topics: List<CourseLevelNodeUiModel>
)

/**
 * FSRS-6 Flashcard state and rating enum matching `src/domain/fsrs/defaultVocab.ts`.
 */
enum class FsrsRating(val grade: Int, val labelUz: String, val intervalHint: String) {
    AGAIN(1, "Qayta", "<10m"),
    HARD(2, "Qiyin", "1 kun"),
    GOOD(3, "Yaxshi", "3 kun"),
    EASY(4, "Oson", "7 kun")
}

data class FsrsFlashcardUiModel(
    val cardId: String,
    val word: String,
    val phonetic: String,
    val translation: String,
    val exampleEn: String,
    val exampleUz: String,
    val category: String,
    val stability: Float,
    val difficulty: Float,
    val reps: Int,
    val lapses: Int,
    val scheduledDays: Int
)

/**
 * Leaderboard row model matching `src/screens/ProfileScreen.tsx`.
 */
data class LeaderboardStudentUiModel(
    val rank: Int,
    val name: String,
    val xp: Int,
    val isCurrentUser: Boolean,
    val avatarInitials: String
)

/**
 * Central reactive application state for TalkMe Jetpack Compose,
 * mirroring `src/context/AppContext.tsx` pixel-for-pixel and interaction-for-interaction.
 */
@Stable
class TalkMeAppState(
    val onSpeakText: (text: String, slow: Boolean) -> Unit = { _, _ -> }
) {
    // Gamification & User Profile State
    var userName by mutableStateOf("Aziz")
    var userLevel by mutableStateOf("A2 o‘quvchi")
    var xp by mutableIntStateOf(1240)
    var diamonds by mutableIntStateOf(26032)
    var streakDays by mutableIntStateOf(7)
    var weeklyCompletedLessons by mutableIntStateOf(3)
    val weeklyGoalLessons: Int = 5

    // Selected Course / Level / Lesson
    var selectedCourseId by mutableStateOf("grammar_fundamentals")
    var selectedLevelId by mutableStateOf("lvl_1")
    var selectedFrameworkLessonId by mutableStateOf("lesson_01_hello_a0")

    // Completed & Unlocked Levels
    val completedLevelIds = mutableStateListOf("lvl_1", "lvl_2", "lvl_3", "lvl_chest_1")
    var recentlyCompletedLevelId by mutableStateOf<String?>(null)

    // Bookmarked Lessons
    val bookmarkedLessons = mutableStateListOf(
        "lesson_01_hello_a0",
        "lesson_01_grammar_fundamentals",
        "lesson_present_continuous"
    )

    // Lesson 1 — "Hello!" (A0) State
    var lesson01CurrentSectionIndex by mutableIntStateOf(0)
    val lesson01CompletedSections = mutableStateListOf<String>()
    var personalizedLearnerName by mutableStateOf("Azamat")
    val lesson01PlayedAudioIds = mutableStateListOf<String>()
    val lesson01ExerciseAnswers = mutableStateMapOf<String, String>()
    val lesson01CorrectExerciseIds = mutableStateListOf<String>()
    var lesson01IsCompleted by mutableStateOf(false)

    // Grammar Fundamentals 10-Stage Framework State
    var frameworkCurrentStageIndex by mutableIntStateOf(0)
    val frameworkCompletedStageIds = mutableStateListOf<String>()
    val frameworkExerciseCorrectIds = mutableStateListOf<String>()
    val frameworkMasteredRuleIds = mutableStateListOf<String>("rule_parts_of_speech")
    val frameworkLearnedVocabWords = mutableStateListOf<String>(
        "Hello", "Hi", "Thank you", "I am", "Welcome", "Goodbye"
    )

    // Classic Lesson (Present Continuous) Completed Tabs
    val classicCompletedTabs = mutableStateListOf<Int>(0)

    // Quiz State
    var lastQuizCorrectCount by mutableIntStateOf(3)
    var lastQuizTotalCount by mutableIntStateOf(3)

    // Voice AI Settings State
    var engineMode by mutableStateOf(EngineSelectionMode.CLOUD_FIRST)
    var selectedVoiceProfile by mutableStateOf(VoiceCharacterProfile.ADULT_MALE)
    var secondSpeakerVoiceProfile by mutableStateOf(VoiceCharacterProfile.ADULT_FEMALE)
    var speechSpeed by mutableFloatStateOf(0.92f)
    var speechPitch by mutableFloatStateOf(1.0f)
    var audioCacheEnabled by mutableStateOf(true)
    var geminiModel by mutableStateOf("gemini-3.8-flash-lite-tts")
    var isTtsSpeaking by mutableStateOf(false)
    var lastSpokenText by mutableStateOf("")

    // FSRS Vocabulary Cards
    val fsrsCards = mutableStateListOf<FsrsFlashcardUiModel>().apply {
        addAll(defaultFsrsCards())
    }

    val uniqueLearnedWordsCount: Int
        get() = frameworkLearnedVocabWords.size

    val masteredGrammarRulesCount: Int
        get() = frameworkMasteredRuleIds.size

    val averageRetentionPercent: Int
        get() {
            if (fsrsCards.isEmpty()) return 92
            val avgR = fsrsCards.map { card ->
                val s = max(0.2f, card.stability)
                (1f + 1f / (9f * s)).pow(-1f)
            }.average()
            return (avgR * 100.0).toInt().coerceIn(72, 99)
        }

    fun speak(text: String, slow: Boolean = false) {
        if (text.isBlank()) return
        lastSpokenText = text
        isTtsSpeaking = true
        onSpeakText(text, slow)
    }

    fun toggleBookmark(lessonId: String) {
        if (bookmarkedLessons.contains(lessonId)) {
            bookmarkedLessons.remove(lessonId)
        } else {
            bookmarkedLessons.add(lessonId)
        }
    }

    fun isBookmarked(lessonId: String): Boolean = bookmarkedLessons.contains(lessonId)

    fun awardXpAndDiamonds(xpBonus: Int, diamondsBonus: Int, levelId: String? = null) {
        xp += xpBonus
        diamonds += diamondsBonus
        if (levelId != null && !completedLevelIds.contains(levelId)) {
            completedLevelIds.add(levelId)
            recentlyCompletedLevelId = levelId
            weeklyCompletedLessons = min(weeklyGoalLessons, weeklyCompletedLessons + 1)
        }
    }

    fun recordVocabLearned(wordEn: String) {
        val clean = wordEn.trim()
        if (clean.isNotEmpty() && !frameworkLearnedVocabWords.contains(clean)) {
            frameworkLearnedVocabWords.add(clean)
        }
    }

    fun recordRuleMastered(ruleId: String) {
        if (ruleId.isNotEmpty() && !frameworkMasteredRuleIds.contains(ruleId)) {
            frameworkMasteredRuleIds.add(ruleId)
        }
    }

    fun syncLesson01VocabToFsrs() {
        val lesson1Words = listOf(
            FsrsFlashcardUiModel(
                cardId = "card_voc_hello",
                word = "Hello",
                phonetic = "/həˈləʊ/",
                translation = "Salom",
                exampleEn = "Hello! Welcome to TalkMe!",
                exampleUz = "Salom! TalkMe-ga xush kelibsiz!",
                category = "A0 • Greeting",
                stability = 1.4f,
                difficulty = 3.5f,
                reps = 1,
                lapses = 0,
                scheduledDays = 2
            ),
            FsrsFlashcardUiModel(
                cardId = "card_voc_thank_you",
                word = "Thank you",
                phonetic = "/ˈθæŋk juː/",
                translation = "Rahmat",
                exampleEn = "Thank you!",
                exampleUz = "Rahmat!",
                category = "A0 • Expression",
                stability = 1.2f,
                difficulty = 3.8f,
                reps = 1,
                lapses = 0,
                scheduledDays = 1
            ),
            FsrsFlashcardUiModel(
                cardId = "card_voc_welcome",
                word = "Welcome",
                phonetic = "/ˈwel.kəm/",
                translation = "Xush kelibsiz",
                exampleEn = "Welcome to TalkMe!",
                exampleUz = "TalkMe-ga xush kelibsiz!",
                category = "A0 • Greeting",
                stability = 1.1f,
                difficulty = 4.0f,
                reps = 1,
                lapses = 0,
                scheduledDays = 1
            ),
            FsrsFlashcardUiModel(
                cardId = "card_voc_goodbye",
                word = "Goodbye",
                phonetic = "/ˌɡʊdˈbaɪ/",
                translation = "Xayr",
                exampleEn = "Goodbye!",
                exampleUz = "Xayr!",
                category = "A0 • Greeting",
                stability = 1.3f,
                difficulty = 3.6f,
                reps = 1,
                lapses = 0,
                scheduledDays = 2
            )
        )
        lesson1Words.forEach { newCard ->
            if (fsrsCards.none { it.word.equals(newCard.word, ignoreCase = true) }) {
                fsrsCards.add(0, newCard)
            }
        }
    }

    fun submitFsrsReview(cardId: String, rating: FsrsRating) {
        val index = fsrsCards.indexOfFirst { it.cardId == cardId }
        if (index >= 0) {
            val current = fsrsCards[index]
            val nextStability = when (rating) {
                FsrsRating.AGAIN -> max(0.3f, current.stability * 0.55f)
                FsrsRating.HARD -> current.stability * 1.15f + 0.4f
                FsrsRating.GOOD -> current.stability * 2.1f + 0.9f
                FsrsRating.EASY -> current.stability * 3.2f + 1.8f
            }
            val nextDifficulty = when (rating) {
                FsrsRating.AGAIN -> min(10f, current.difficulty + 0.8f)
                FsrsRating.HARD -> min(10f, current.difficulty + 0.3f)
                FsrsRating.GOOD -> max(1f, current.difficulty - 0.15f)
                FsrsRating.EASY -> max(1f, current.difficulty - 0.45f)
            }
            val nextScheduledDays = when (rating) {
                FsrsRating.AGAIN -> 0
                FsrsRating.HARD -> 1
                FsrsRating.GOOD -> max(1, nextStability.toInt())
                FsrsRating.EASY -> max(3, (nextStability * 1.5f).toInt())
            }
            fsrsCards[index] = current.copy(
                stability = nextStability,
                difficulty = nextDifficulty,
                reps = current.reps + 1,
                lapses = if (rating == FsrsRating.AGAIN) current.lapses + 1 else current.lapses,
                scheduledDays = nextScheduledDays
            )
            xp += 5
        }
    }

    fun resetFsrsVocab() {
        fsrsCards.clear()
        fsrsCards.addAll(defaultFsrsCards())
    }

    companion object {
        fun defaultFsrsCards(): List<FsrsFlashcardUiModel> = listOf(
            FsrsFlashcardUiModel(
                cardId = "card_word_1",
                word = "continuous",
                phonetic = "/kənˈtɪn.ju.əs/",
                translation = "davomiylik, uzluksiz",
                exampleEn = "It is raining continuously today.",
                exampleUz = "Bugun yomg‘ir uzluksiz yog‘moqda.",
                category = "Grammar",
                stability = 0.40f,
                difficulty = 5.0f,
                reps = 0,
                lapses = 0,
                scheduledDays = 0
            ),
            FsrsFlashcardUiModel(
                cardId = "card_word_2",
                word = "fundamental",
                phonetic = "/ˌfʌn.dəˈmen.təl/",
                translation = "asosiy, poydevor",
                exampleEn = "Grammar is a fundamental part of language.",
                exampleUz = "Grammatika tilning poydevor qismidir.",
                category = "Grammar",
                stability = 1.18f,
                difficulty = 4.8f,
                reps = 1,
                lapses = 0,
                scheduledDays = 1
            ),
            FsrsFlashcardUiModel(
                cardId = "card_word_3",
                word = "retrievability",
                phonetic = "/rɪˌtriː.vəˈbɪl.ə.ti/",
                translation = "eslab qolish darajasi",
                exampleEn = "FSRS measures memory retrievability over time.",
                exampleUz = "FSRS vaqt o‘tishi bilan xotirada eslab qolish darajasini o‘lchaydi.",
                category = "Memory",
                stability = 3.17f,
                difficulty = 5.2f,
                reps = 2,
                lapses = 0,
                scheduledDays = 2
            ),
            FsrsFlashcardUiModel(
                cardId = "card_word_4",
                word = "repetition",
                phonetic = "/ˌrep.əˈtɪʃ.ən/",
                translation = "takrorlash, qaytarish",
                exampleEn = "Spaced repetition improves long-term memory.",
                exampleUz = "Oraliq takrorlash uzoq muddatli xotirani yaxshilaydi.",
                category = "Memory",
                stability = 0.40f,
                difficulty = 5.0f,
                reps = 0,
                lapses = 0,
                scheduledDays = 0
            ),
            FsrsFlashcardUiModel(
                cardId = "card_word_5",
                word = "pronunciation",
                phonetic = "/prəˌnʌn.siˈeɪ.ʃən/",
                translation = "talaffuz",
                exampleEn = "Good pronunciation improves understanding.",
                exampleUz = "Yaxshi talaffuz tushunishni osonlashtiradi.",
                category = "Speaking",
                stability = 1.18f,
                difficulty = 4.5f,
                reps = 1,
                lapses = 0,
                scheduledDays = 1
            ),
            FsrsFlashcardUiModel(
                cardId = "card_word_6",
                word = "affirmative",
                phonetic = "/əˈfɜː.mə.tɪv/",
                translation = "tasdiq (gap shakli)",
                exampleEn = "We practice affirmative sentence structures.",
                exampleUz = "Biz tasdiq gap tuzilishlarini mashq qilamiz.",
                category = "Grammar",
                stability = 0.40f,
                difficulty = 5.0f,
                reps = 0,
                lapses = 0,
                scheduledDays = 0
            )
        )

        val grammarCategories: List<GrammarCategoryUiModel> = listOf(
            GrammarCategoryUiModel(
                id = "grammar_fundamentals",
                title = "Grammar fundamentals",
                subtitle = "Asosiy qoidalar va so‘z tuzilishi",
                topicsCount = "8 ta mavzu",
                illustrationId = "cat-1",
                accentColor = Color(0xFF5E4B8B),
                bgTint = Color(0xFFF1EDFA)
            ),
            GrammarCategoryUiModel(
                id = "nouns",
                title = "Ot (Nouns)",
                subtitle = "Shaxs, narsa va joy nomlari",
                topicsCount = "9 ta mavzu",
                illustrationId = "cat-6",
                accentColor = Color(0xFF4338CA),
                bgTint = Color(0xFFEEF2FF)
            ),
            GrammarCategoryUiModel(
                id = "verbs",
                title = "Fe‘l va Zamonlar",
                subtitle = "Harakatlar: Present, Past, Future",
                topicsCount = "12 ta mavzu",
                illustrationId = "cat-2",
                accentColor = Color(0xFFEA580C),
                bgTint = Color(0xFFFFEDD5)
            ),
            GrammarCategoryUiModel(
                id = "adjectives",
                title = "Sifat (Adjectives)",
                subtitle = "Belgi, xususiyat va darajalar",
                topicsCount = "7 ta mavzu",
                illustrationId = "cat-7",
                accentColor = Color(0xFF0284C7),
                bgTint = Color(0xFFE0F2FE)
            ),
            GrammarCategoryUiModel(
                id = "numerals",
                title = "Son (Numerals)",
                subtitle = "Sanoq va tartib sonlar",
                topicsCount = "6 ta mavzu",
                illustrationId = "cat-3",
                accentColor = Color(0xFF16A34A),
                bgTint = Color(0xFFE8F8EE)
            ),
            GrammarCategoryUiModel(
                id = "pronouns",
                title = "Olmosh (Pronouns)",
                subtitle = "Kishilik va egalik olmoshlari",
                topicsCount = "8 ta mavzu",
                illustrationId = "cat-4",
                accentColor = Color(0xFF7C3AED),
                bgTint = Color(0xFFEDE9FE)
            ),
            GrammarCategoryUiModel(
                id = "adverbs",
                title = "Ravish (Adverbs)",
                subtitle = "Harakat tarzi, daraja va tezlik",
                topicsCount = "7 ta mavzu",
                illustrationId = "cat-8",
                accentColor = Color(0xFF4F46E5),
                bgTint = Color(0xFFEEF2FF)
            ),
            GrammarCategoryUiModel(
                id = "prepositions",
                title = "Predloglar (Prepositions)",
                subtitle = "O‘rin, payt va yo‘nalish (in, on, at)",
                topicsCount = "10 ta mavzu",
                illustrationId = "cat-8",
                accentColor = Color(0xFF0D9488),
                bgTint = Color(0xFFCCFBF1)
            ),
            GrammarCategoryUiModel(
                id = "sentences",
                title = "Gap (Sentences)",
                subtitle = "Ega, kesim, to‘ldiruvchi (S+V+O)",
                topicsCount = "9 ta mavzu",
                illustrationId = "cat-9",
                accentColor = Color(0xFF9333EA),
                bgTint = Color(0xFFF3E8FF)
            ),
            GrammarCategoryUiModel(
                id = "adverbials",
                title = "Hol (Adverbials)",
                subtitle = "Payt, o‘rin, sabab va maqsad",
                topicsCount = "7 ta mavzu",
                illustrationId = "cat-10",
                accentColor = Color(0xFF059669),
                bgTint = Color(0xFFD1FAE5)
            ),
            GrammarCategoryUiModel(
                id = "articles",
                title = "Artikl (Articles: A, An, The)",
                subtitle = "Aniq va noaniq artikl qoidalari",
                topicsCount = "5 ta mavzu",
                illustrationId = "cat-5",
                accentColor = Color(0xFFD97706),
                bgTint = Color(0xFFFEF3C7)
            )
        )

        fun getCurriculumForCourse(
            courseId: String,
            completedIds: List<String>
        ): CourseCurriculumUiModel {
            val category = grammarCategories.find { it.id == courseId } ?: grammarCategories.first()
            val rawTopics: List<Triple<String, String, LevelNodeType>> = when (courseId) {
                "grammar_fundamentals" -> listOf(
                    Triple(
                        "Lesson 1 — Hello! (A0)",
                        "A0 Absolute Beginner • Salomlashish, 6 ta so‘z va 5 mashq",
                        LevelNodeType.MASCOT_INTRO
                    ),
                    Triple(
                        "2-Dars: Grammar Fundamentals",
                        "Ingliz tili grammatikasi asoslari (8 bo‘lim, 10 mashq, Krossvord)",
                        LevelNodeType.STAR
                    ),
                    Triple(
                        "3-Dars: Parts of Speech Introduction",
                        "So‘z turkumlariga kirish va gapdagi vazifalar",
                        LevelNodeType.READING
                    ),
                    Triple(
                        "Bonus Sandiqcha",
                        "Qo‘shimcha olmoslar va XP mukofoti",
                        LevelNodeType.CHEST
                    ),
                    Triple(
                        "4-Dars: To Be fe’li (Am, Is, Are)",
                        "Darak va sodda iboralar tuzish",
                        LevelNodeType.MIC
                    ),
                    Triple(
                        "5-Dars: So‘roq va inkor gaplar",
                        "Do va Does yordamchi fe’llari bilan savol berish",
                        LevelNodeType.PRACTICE
                    ),
                    Triple(
                        "6-Dars: Ko‘rsatish olmoshlari",
                        "This, That, These, Those qo‘llanishi",
                        LevelNodeType.CAMERA
                    ),
                    Triple(
                        "7-Dars: Sanaladigan va Sanalmaydigan",
                        "Much, Many, A lot of farqlari",
                        LevelNodeType.HEADPHONES
                    ),
                    Triple(
                        "8-Dars: Katta Sinov Imtihoni",
                        "Barcha 8 ta fundamental mavzu bo‘yicha yakuniy test",
                        LevelNodeType.STAR
                    )
                )
                "verbs" -> listOf(
                    Triple("1-Dars: Fe’l turlari va Asoslari", "Asosiy va yordamchi fe’llar", LevelNodeType.MASCOT_INTRO),
                    Triple("2-Dars: Present Simple", "Kundalik odatlar va doimiy holatlar", LevelNodeType.STAR),
                    Triple("3-Dars: Present Continuous", "Ayni daqiqada sodir bo‘layotgan ish-harakatlar", LevelNodeType.MIC),
                    Triple("Bonus Sandiqcha", "Qo‘shimcha XP mukofoti", LevelNodeType.CHEST),
                    Triple("4-Dars: Simple vs Continuous", "Stative fe’llar (know, understand, love)", LevelNodeType.PRACTICE),
                    Triple("5-Dars: Past Simple", "-ed qo‘shimchasi va talaffuz qoidalari", LevelNodeType.READING),
                    Triple("6-Dars: Future Simple (Will)", "Kelajak rejalari va qarorlar", LevelNodeType.HEADPHONES)
                )
                else -> listOf(
                    Triple("1-Dars: ${category.title} — Kirish", category.subtitle, LevelNodeType.MASCOT_INTRO),
                    Triple("2-Dars: Asosiy Qoidalar", "Misollar va gap tuzilishi", LevelNodeType.STAR),
                    Triple("3-Dars: Jonli Talaffuz va Nutq", "Audio mashqlar va dialoglar", LevelNodeType.MIC),
                    Triple("Bonus Sandiqcha", "Maxsus olmos mukofoti", LevelNodeType.CHEST),
                    Triple("4-Dars: Mustahkamlash Mashqlari", "Interaktiv savol-javoblar", LevelNodeType.PRACTICE),
                    Triple("5-Dars: Yakuniy Sinov", "${category.title} bo‘yicha yakuniy test", LevelNodeType.STAR)
                )
            }

            var foundCurrent = false
            val nodes = rawTopics.mapIndexed { idx, (title, subtitle, nodeType) ->
                val nodeId = if (nodeType == LevelNodeType.CHEST) "lvl_chest_1" else "lvl_${idx + 1}"
                val isDone = completedIds.contains(nodeId)
                val status = when {
                    isDone -> LevelNodeStatus.COMPLETED
                    !foundCurrent -> {
                        foundCurrent = true
                        LevelNodeStatus.CURRENT
                    }
                    else -> LevelNodeStatus.LOCKED
                }
                val linkedLessonId = when {
                    courseId == "grammar_fundamentals" && idx == 0 -> "lesson_01_hello_a0"
                    courseId == "grammar_fundamentals" && idx == 1 -> "lesson_01_grammar_fundamentals"
                    courseId == "verbs" && idx == 2 -> "lesson_present_continuous"
                    idx == 0 -> "lesson_01_hello_a0"
                    idx == 1 -> "lesson_01_grammar_fundamentals"
                    else -> "lesson_present_continuous"
                }
                CourseLevelNodeUiModel(
                    id = nodeId,
                    index = idx + 1,
                    title = title,
                    subtitle = subtitle,
                    nodeType = nodeType,
                    xpReward = if (idx == 0) 50 else 25,
                    status = status,
                    linkedLessonId = linkedLessonId
                )
            }

            return CourseCurriculumUiModel(
                courseId = courseId,
                title = category.title,
                subtitle = category.subtitle,
                sectionLabel = "BO‘LIM 1, UNIT 1",
                topics = nodes
            )
        }
    }
}

val LocalTalkMeAppState = compositionLocalOf<TalkMeAppState> {
    TalkMeAppState()
}

@Composable
fun rememberTalkMeAppState(
    onSpeakText: (text: String, slow: Boolean) -> Unit = { _, _ -> }
): TalkMeAppState {
    return remember { TalkMeAppState(onSpeakText = onSpeakText) }
}
