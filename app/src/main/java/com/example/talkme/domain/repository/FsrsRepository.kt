package com.example.talkme.domain.repository

import com.example.talkme.domain.fsrs.FsrsCard
import com.example.talkme.domain.fsrs.FsrsDailyStats
import com.example.talkme.domain.fsrs.FsrsVocabularyItem
import com.example.talkme.domain.fsrs.Rating
import kotlinx.coroutines.flow.Flow

/**
 * Domain Repository interface defining FSRS Spaced Repetition vocabulary cards, reviews, and sync.
 */
interface FsrsRepository {
    suspend fun getDueVocabularyItems(userId: String = "user_default", limit: Int = 20): List<FsrsVocabularyItem>
    suspend fun submitReview(card: FsrsCard, rating: Rating, userId: String = "user_default")
    fun getDailyStatsFlow(userId: String = "user_default"): Flow<FsrsDailyStats>
    suspend fun syncPendingReviewsWithServer(userId: String = "user_default"): Boolean
    suspend fun seedSampleVocabulary()
}
