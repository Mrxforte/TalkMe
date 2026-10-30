package com.example.talkme.data.db.entity

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

/**
 * Room Entity storing FSRS Spaced Repetition Memory Card States.
 */
@Entity(
    tableName = "fsrs_cards",
    indices = [
        Index(value = ["userId", "nextReview"]),
        Index(value = ["wordId"], unique = true),
        Index(value = ["syncStatus"])
    ]
)
data class FsrsCardEntity(
    @PrimaryKey val cardId: String,
    val wordId: String,
    val userId: String = "user_default",
    val stability: Double = 0.0,
    val difficulty: Double = 0.0,
    val state: Int = 0, // 0=NEW, 1=LEARNING, 2=REVIEW, 3=RELEARNING
    val lastReview: Long = System.currentTimeMillis(),
    val nextReview: Long = System.currentTimeMillis(),
    val reps: Int = 0,
    val lapses: Int = 0,
    val scheduledDays: Int = 0,
    val elapsedDays: Int = 0,
    val schedulerVersion: String = "FSRS-6",
    val syncStatus: Int = 0 // 0=Synced, 1=Pending Sync
)

/**
 * Room Entity storing Vocabulary Lexical Content.
 */
@Entity(
    tableName = "fsrs_vocabulary",
    indices = [
        Index(value = ["word"]),
        Index(value = ["category"])
    ]
)
data class FsrsVocabularyEntity(
    @PrimaryKey val wordId: String,
    val word: String,
    val phonetic: String,
    val translation: String,
    val exampleEn: String,
    val exampleUz: String,
    val category: String = "General"
)

/**
 * Room Entity storing Immutable FSRS Review Event Logs for Offline-First Synchronization.
 */
@Entity(
    tableName = "fsrs_review_logs",
    indices = [
        Index(value = ["cardId"]),
        Index(value = ["reviewTimestamp"]),
        Index(value = ["syncStatus"])
    ]
)
data class FsrsReviewLogEntity(
    @PrimaryKey val logId: String,
    val cardId: String,
    val userId: String,
    val rating: Int, // 1=AGAIN, 2=HARD, 3=GOOD, 4=EASY
    val reviewTimestamp: Long = System.currentTimeMillis(),
    val scheduledDays: Int,
    val elapsedDays: Int,
    val stability: Double,
    val difficulty: Double,
    val state: Int,
    val syncStatus: Int = 1 // 1=Pending Sync, 0=Synced
)
