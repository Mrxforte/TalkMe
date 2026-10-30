package com.example.talkme.data.db.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Transaction
import com.example.talkme.data.db.entity.FsrsCardEntity
import com.example.talkme.data.db.entity.FsrsReviewLogEntity
import com.example.talkme.data.db.entity.FsrsVocabularyEntity
import kotlinx.coroutines.flow.Flow

/**
 * Room Data Access Object for FSRS Spaced Repetition Cards, Vocabulary & Sync Logs.
 */
@Dao
interface FsrsDao {

    @Query("SELECT * FROM fsrs_cards WHERE userId = :userId AND nextReview <= :now ORDER BY nextReview ASC LIMIT :limit")
    suspend fun getDueCards(userId: String, now: Long, limit: Int = 50): List<FsrsCardEntity>

    @Query("SELECT * FROM fsrs_vocabulary WHERE wordId = :wordId")
    suspend fun getVocabularyById(wordId: String): FsrsVocabularyEntity?

    @Query("SELECT * FROM fsrs_vocabulary")
    fun getAllVocabularyFlow(): Flow<List<FsrsVocabularyEntity>>

    @Query("SELECT COUNT(*) FROM fsrs_cards WHERE userId = :userId AND nextReview <= :now")
    fun getDueCardsCountFlow(userId: String, now: Long): Flow<Int>

    @Query("SELECT COUNT(*) FROM fsrs_cards WHERE userId = :userId AND state = 0")
    fun getNewCardsCountFlow(userId: String): Flow<Int>

    @Query("SELECT COUNT(*) FROM fsrs_cards WHERE userId = :userId AND state = 2")
    fun getLearnedCardsCountFlow(userId: String): Flow<Int>

    @Query("SELECT COUNT(*) FROM fsrs_review_logs WHERE userId = :userId AND reviewTimestamp >= :startOfDay")
    fun getCompletedTodayCountFlow(userId: String, startOfDay: Long): Flow<Int>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateCard(card: FsrsCardEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdateVocabulary(vocabulary: FsrsVocabularyEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertVocabularyList(vocabularyList: List<FsrsVocabularyEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertReviewLog(log: FsrsReviewLogEntity)

    @Query("SELECT * FROM fsrs_review_logs WHERE syncStatus = 1")
    suspend fun getPendingSyncLogs(): List<FsrsReviewLogEntity>

    @Query("UPDATE fsrs_review_logs SET syncStatus = 0 WHERE logId IN (:logIds)")
    suspend fun markLogsSynced(logIds: List<String>)

    @Transaction
    suspend fun submitReviewTransaction(card: FsrsCardEntity, log: FsrsReviewLogEntity) {
        insertOrUpdateCard(card)
        insertReviewLog(log)
    }
}
