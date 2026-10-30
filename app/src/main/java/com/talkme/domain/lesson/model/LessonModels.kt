package com.talkme.domain.lesson.model

/**
 * CEFR proficiency levels supported by the TalkMe Adaptive Lesson System (A0 to C2).
 */
enum class CefrLevel {
    A0, A1, A2, B1, B2, C1, C2
}

/**
 * Top-level segment tabs displayed on LessonDetailScreen (Qoida / Misol / Mashq)
 * per Section 2 Item 5 of PROJECT_RULES.md.
 */
enum class LessonSegmentTab {
    RULE,
    EXAMPLE,
    EXERCISE
}

/**
 * The 10 Universal Sections of every TalkMe lesson following the 7-phase pedagogical flow:
 * Understand -> See -> Practice -> Remember -> Listen -> Test -> Master.
 */
enum class LessonSection(
    val stepNumber: Int,
    val segmentTab: LessonSegmentTab
) {
    INTRO(1, LessonSegmentTab.RULE),
    RULES(2, LessonSegmentTab.RULE),
    ANIMATED_EXAMPLES(3, LessonSegmentTab.EXAMPLE),
    FILL_BLANKS(4, LessonSegmentTab.EXERCISE),
    WORD_BUILDER(5, LessonSegmentTab.EXERCISE),
    VOCABULARY(6, LessonSegmentTab.EXERCISE),
    GRAMMAR_PRACTICE(7, LessonSegmentTab.EXERCISE),
    LISTENING(8, LessonSegmentTab.EXERCISE),
    MIXED_PRACTICE(9, LessonSegmentTab.EXERCISE),
    FINAL_ASSESSMENT(10, LessonSegmentTab.EXERCISE)
}

/**
 * All 18 reusable, beginner-friendly exercise types supported by the TalkMe Exercise Engine.
 */
enum class ExerciseType {
    MULTIPLE_CHOICE,
    MULTI_SELECT,
    FILL_BLANK,
    LETTER_BUILDER,
    WORD_SCRAMBLE,
    SENTENCE_BUILDER,
    MATCHING_PAIRS,
    IMAGE_CHOICE,
    IMAGE_TO_WORD,
    AUDIO_CHOICE,
    TRANSLATION_MATCH,
    ERROR_CORRECTION,
    TRUE_FALSE,
    CATEGORIZATION,
    FLASHCARDS,
    MISSING_LETTERS,
    CONVERSATION_COMPLETION,
    SEQUENCE_BUILDER
}

/**
 * Educationally relevant visual scene types rendered with Jetpack Compose Canvas & animations.
 */
enum class VisualSceneType {
    COUNTING_APPLES,
    COUNTING_BOOKS,
    COUNTING_PENCILS,
    COUNTING_BANANAS,
    NUMBER_GRID,
    COLOR_PALETTE,
    PREPOSITION_BOX
}

/**
 * Specification for rendering an educational illustration in a lesson section or exercise.
 */
data class VisualSpec(
    val scene: VisualSceneType,
    val count: Int = 3,
    val primaryLabel: String = "",
    val secondaryLabel: String = "",
    val position: String = "on"
)

/**
 * Pronoun or grammar structure column item displayed inside the formula structure box
 * (`PronounColumnItem`) per Section 2 Item 5 of PROJECT_RULES.md.
 */
data class PronounRuleCell(
    val subjectPronoun: String,
    val auxiliaryOrForm: String,
    val exampleFragment: String
)

/**
 * Table row used inside interactive step-by-step rule explanations (e.g., 1 -> One).
 */
data class RuleTableRow(
    val left: String,
    val right: String,
    val phonetic: String = "",
    val example: String = ""
)

/**
 * Common learner mistake and its corrected form.
 */
data class CommonMistake(
    val incorrect: String,
    val correct: String,
    val explanationUz: String
)

/**
 * Highlighted example sentence inside a rule explanation card.
 */
data class RuleExample(
    val sentenceEn: String,
    val translationUz: String,
    val highlightedWord: String
)

/**
 * Step-by-step interactive rule model for Section 2 (Rule Explanation).
 */
data class LessonRule(
    val ruleId: String,
    val orderNumber: Int,
    val title: String,
    val subtitleUz: String,
    val explanationUz: String,
    val explanationEn: String,
    val whenToUseUz: String,
    val formula: String?,
    val pronounGrid: List<PronounRuleCell> = emptyList(),
    val tableRows: List<RuleTableRow> = emptyList(),
    val examples: List<RuleExample> = emptyList(),
    val commonMistakes: List<CommonMistake> = emptyList(),
    val memoryTipUz: String,
    val additionalDetailsUz: String,
    val visualAsset: VisualSpec
)

/**
 * Highlighted segment of an animated example sentence.
 */
data class SentenceSegment(
    val text: String,
    val isHighlighted: Boolean = false,
    val roleLabel: String = ""
)

/**
 * Animated Example model for Section 3 (`ExampleAudioCard`).
 */
data class AnimatedExample(
    val exampleId: String,
    val sentenceEn: String,
    val segments: List<SentenceSegment>,
    val translationUz: String,
    val grammarNoteUz: String,
    val visualSpec: VisualSpec
)

/**
 * Topic Vocabulary Card model for Section 6 (Vocabulary Learning & Memory).
 */
data class LessonVocabularyItem(
    val wordId: String,
    val wordEn: String,
    val translationUz: String,
    val phonetic: String,
    val exampleEn: String,
    val exampleUz: String,
    val visualSpec: VisualSpec
)

/**
 * Matching pair item for vocabulary and translation matching exercises.
 */
data class MatchingPair(
    val id: String,
    val leftText: String,
    val rightText: String
)

/**
 * Category bucket group for categorization exercises.
 */
data class CategoryGroup(
    val categoryId: String,
    val title: String,
    val items: List<String>
)

/**
 * Dialogue turn item for conversation completion exercises.
 */
data class DialogueTurnItem(
    val speakerName: String,
    val text: String,
    val isBlank: Boolean = false
)

/**
 * Versioned, API-compatible exercise schema supporting all 18 exercise types.
 */
data class LessonExercise(
    val exerciseId: String,
    val section: LessonSection,
    val exerciseType: ExerciseType,
    val question: String,
    val instructions: String,
    val sentenceWithBlank: String? = null,
    val options: List<String> = emptyList(),
    val correctAnswer: String,
    val correctAnswersList: List<String> = emptyList(),
    val distractorLetters: List<Char> = emptyList(),
    val scrambledWords: List<String> = emptyList(),
    val matchingPairs: List<MatchingPair> = emptyList(),
    val categories: List<CategoryGroup> = emptyList(),
    val dialogueTurns: List<DialogueTurnItem> = emptyList(),
    val explanationUz: String,
    val hint: String = "",
    val imageAsset: VisualSpec? = null,
    val audioAsset: String? = null,
    val difficulty: Int = 1,
    val points: Int = 10
)

/**
 * Completion criteria and rewards for a lesson.
 */
data class CompletionCriteria(
    val minPassPercentage: Int = 70,
    val xpReward: Int = 30,
    val diamondsReward: Int = 10
)

/**
 * Complete Universal Lesson Plan data structure.
 */
data class LessonPlan(
    val schemaVersion: Int = 1,
    val lessonId: String,
    val courseId: String,
    val title: String,
    val description: String,
    val level: CefrLevel,
    val estimatedDurationMinutes: Int,
    val difficultyLabel: String,
    val learningObjectives: List<String>,
    val heroVisual: VisualSpec,
    val rules: List<LessonRule>,
    val examples: List<AnimatedExample>,
    val vocabulary: List<LessonVocabularyItem>,
    val exercises: List<LessonExercise>,
    val assessment: List<LessonExercise>,
    val completionCriteria: CompletionCriteria
)

/**
 * Record of a learner's attempt on a single exercise or test question.
 */
data class ExerciseAttempt(
    val exerciseId: String,
    val question: String,
    val userAnswer: String,
    val correctAnswer: String,
    val isCorrect: Boolean,
    val explanationUz: String,
    val pointsEarned: Int
)

/**
 * Final lesson & test mastery summary displayed on LessonResultScreen.
 */
data class LessonResultSummary(
    val lessonId: String,
    val lessonTitle: String,
    val totalQuestions: Int,
    val correctCount: Int,
    val incorrectCount: Int,
    val completionPercentage: Int,
    val timeSpentSeconds: Long,
    val xpEarned: Int,
    val weeklyGoalProgress: Float = 0.85f,
    val ruleCorrectionTipUz: String,
    val examPrepNoteUz: String,
    val vocabularyMasteredCount: Int,
    val vocabularyTotalCount: Int,
    val isCompleted: Boolean,
    val attempts: List<ExerciseAttempt>
)
