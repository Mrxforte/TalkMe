package com.example.talkme.domain.fsrs

import javax.inject.Inject

/**
 * FSRS Card Memory State.
 */
enum class State(val value: Int) {
    NEW(0),
    LEARNING(1),
    REVIEW(2),
    RELEARNING(3);

    companion object {
        fun fromValue(value: Int): State = entries.firstOrNull { it.value == value } ?: NEW
    }
}

/**
 * User Recall Rating on Flashcard Review.
 */
enum class Rating(val value: Int) {
    AGAIN(1),
    HARD(2),
    GOOD(3),
    EASY(4);

    companion object {
        fun fromValue(value: Int): Rating = entries.firstOrNull { it.value == value } ?: AGAIN
    }
}

/**
 * Official FSRS-6 Default Weights & Parameters.
 */
data class FsrsParameters @Inject constructor(
    val w: DoubleArray = doubleArrayOf(
        0.40255, 1.18385, 3.173, 15.69105, 7.1949,
        0.5345, 1.4604, 0.0046, 1.5457, 0.1192,
        1.0192, 1.9395, 0.11, 0.29605, 2.2698,
        0.2315, 2.9898, 0.51655, 0.6621
    ),
    val requestRetention: Double = 0.90,
    val maximumInterval: Int = 36500
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as FsrsParameters

        if (!w.contentEquals(other.w)) return false
        if (requestRetention != other.requestRetention) return false
        if (maximumInterval != other.maximumInterval) return false

        return true
    }

    override fun hashCode(): Int {
        var result = w.contentHashCode()
        result = 31 * result + requestRetention.hashCode()
        result = 31 * result + maximumInterval
        return result
    }
}

/**
 * FSRS Memory State Card Entity.
 */
data class FsrsCard(
    val cardId: String,
    val wordId: String,
    val userId: String = "user_default",
    val stability: Double = 0.0,
    val difficulty: Double = 0.0,
    val state: State = State.NEW,
    val lastReview: Long = System.currentTimeMillis(),
    val nextReview: Long = System.currentTimeMillis(),
    val reps: Int = 0,
    val lapses: Int = 0,
    val scheduledDays: Int = 0,
    val elapsedDays: Int = 0,
    val schedulerVersion: String = "FSRS-6"
)

/**
 * Complete Vocabulary Item with FSRS Card & Lexical Data.
 */
data class FsrsVocabularyItem(
    val card: FsrsCard,
    val word: String,
    val phonetic: String,
    val translation: String,
    val exampleEn: String,
    val exampleUz: String,
    val category: String = "General"
)

/**
 * Next Interval Scheduling Calculation Result.
 */
data class FsrsSchedulingInfo(
    val card: FsrsCard,
    val intervalDays: Int,
    val nextReviewTimestamp: Long
)

/**
 * Daily Spaced Repetition Dashboard Analytics.
 */
data class FsrsDailyStats(
    val newWordsCount: Int = 0,
    val dueWordsCount: Int = 0,
    val learningWordsCount: Int = 0,
    val completedTodayCount: Int = 0,
    val totalLearnedCount: Int = 0,
    val retentionPercentage: Int = 92,
    val dailyStreakDays: Int = 7,
    val estimatedMinutesRemaining: Int = 4
)
