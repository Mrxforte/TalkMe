package com.example.talkme.data.repository

import android.util.Log
import com.example.talkme.data.db.dao.FsrsDao
import com.example.talkme.data.db.entity.FsrsCardEntity
import com.example.talkme.data.db.entity.FsrsReviewLogEntity
import com.example.talkme.data.db.entity.FsrsVocabularyEntity
import com.example.talkme.data.remote.FsrsSyncApi
import com.example.talkme.data.remote.model.FsrsBulkSyncRequest
import com.example.talkme.data.remote.model.FsrsReviewLogDto
import com.example.talkme.domain.fsrs.FsrsCard
import com.example.talkme.domain.fsrs.FsrsDailyStats
import com.example.talkme.domain.fsrs.FsrsScheduler
import com.example.talkme.domain.fsrs.FsrsVocabularyItem
import com.example.talkme.domain.fsrs.Rating
import com.example.talkme.domain.fsrs.State
import com.example.talkme.domain.repository.FsrsRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.withContext
import java.util.Calendar
import java.util.UUID
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Offline-first Implementation of FsrsRepository backed by Room SQLite and Django Sync API.
 */
@Singleton
class FsrsRepositoryImpl @Inject constructor(
    private val fsrsDao: FsrsDao,
    private val scheduler: FsrsScheduler,
    private val fsrsSyncApi: FsrsSyncApi,
) : FsrsRepository {

    override suspend fun getDueVocabularyItems(
        userId: String,
        limit: Int
    ): List<FsrsVocabularyItem> = withContext(Dispatchers.IO) {
        seedSampleVocabulary()

        val now = System.currentTimeMillis()
        val dueCards = fsrsDao.getDueCards(userId, now, limit)

        dueCards.mapNotNull { cardEntity ->
            val vocabEntity = fsrsDao.getVocabularyById(cardEntity.wordId)
            if (vocabEntity != null) {
                FsrsVocabularyItem(
                    card = cardEntity.toDomainModel(),
                    word = vocabEntity.word,
                    phonetic = vocabEntity.phonetic,
                    translation = vocabEntity.translation,
                    exampleEn = vocabEntity.exampleEn,
                    exampleUz = vocabEntity.exampleUz,
                    category = vocabEntity.category
                )
            } else null
        }
    }

    override suspend fun submitReview(
        card: FsrsCard,
        rating: Rating,
        userId: String
    ) = withContext(Dispatchers.IO) {
        val now = System.currentTimeMillis()
        val scheduledMap = scheduler.repeat(card, now)
        val schedulingInfo = scheduledMap[rating] ?: return@withContext

        val newCard = schedulingInfo.card
        val cardEntity = newCard.toEntity(userId)

        val logId = UUID.randomUUID().toString()
        val logEntity = FsrsReviewLogEntity(
            logId = logId,
            cardId = card.cardId,
            userId = userId,
            rating = rating.value,
            reviewTimestamp = now,
            scheduledDays = schedulingInfo.intervalDays,
            elapsedDays = newCard.elapsedDays,
            stability = newCard.stability,
            difficulty = newCard.difficulty,
            state = newCard.state.value,
            syncStatus = 1 // Pending sync
        )

        fsrsDao.submitReviewTransaction(cardEntity, logEntity)
        Log.d(TAG, "Submitted FSRS review for card '${card.cardId}' with rating ${rating.name}. Next review in ${schedulingInfo.intervalDays} days.")
    }

    override fun getDailyStatsFlow(userId: String): Flow<FsrsDailyStats> {
        val now = System.currentTimeMillis()
        val cal = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }
        val startOfDay = cal.timeInMillis

        return combine(
            fsrsDao.getDueCardsCountFlow(userId, now),
            fsrsDao.getNewCardsCountFlow(userId),
            fsrsDao.getLearnedCardsCountFlow(userId),
            fsrsDao.getCompletedTodayCountFlow(userId, startOfDay)
        ) { dueCount, newCount, learnedCount, completedToday ->
            FsrsDailyStats(
                newWordsCount = newCount,
                dueWordsCount = dueCount,
                learningWordsCount = maxOf(0, dueCount - newCount),
                completedTodayCount = completedToday,
                totalLearnedCount = learnedCount,
                retentionPercentage = 94,
                dailyStreakDays = 7,
                estimatedMinutesRemaining = maxOf(1, (dueCount * 0.5).toInt())
            )
        }.flowOn(Dispatchers.IO)
    }

    override suspend fun syncPendingReviewsWithServer(userId: String): Boolean = withContext(Dispatchers.IO) {
        try {
            val pendingLogs = fsrsDao.getPendingSyncLogs()
            if (pendingLogs.isEmpty()) return@withContext true

            val logDtos = pendingLogs.map { log ->
                FsrsReviewLogDto(
                    logId = log.logId,
                    cardId = log.cardId,
                    userId = log.userId,
                    rating = log.rating,
                    reviewTimestamp = log.reviewTimestamp,
                    scheduledDays = log.scheduledDays,
                    elapsedDays = log.elapsedDays,
                    stability = log.stability,
                    difficulty = log.difficulty,
                    state = log.state
                )
            }

            val syncRequest = FsrsBulkSyncRequest(
                userId = userId,
                reviewLogs = logDtos,
                lastSyncTimestamp = System.currentTimeMillis()
            )

            val response = fsrsSyncApi.syncBulkReviews(syncRequest)
            if (response.isSuccessful && response.body() != null) {
                val syncedIds = response.body()!!.syncedLogIds
                if (syncedIds.isNotEmpty()) {
                    fsrsDao.markLogsSynced(syncedIds)
                    Log.d(TAG, "Successfully synced ${syncedIds.size} FSRS review logs with Django backend.")
                }
                true
            } else {
                Log.w(TAG, "Django FSRS sync server response error: ${response.code()}")
                false
            }
        } catch (e: Exception) {
            Log.e(TAG, "Offline mode - FSRS background sync error: ${e.localizedMessage}")
            false
        }
    }

    override suspend fun seedSampleVocabulary() = withContext(Dispatchers.IO) {
        val sampleVocab = listOf(
            FsrsVocabularyEntity("word_1", "continuous", "/kənˈtɪn.ju.əs/", "davomiylik, uzluksiz", "It is raining continuously today.", "Bugun yomg'ir uzluksiz yog'moqda.", "Grammar"),
            FsrsVocabularyEntity("word_2", "fundamental", "/ˌfʌn.dəˈmen.təl/", "asosiy, poydevor", "Grammar is a fundamental part of language.", "Grammatika tilning poydevor qismidir.", "Grammar"),
            FsrsVocabularyEntity("word_3", "retrievability", "/rɪˌtriː.vəˈbɪl.ə.ti/", "eslab qolish darajasi", "FSRS measures memory retrievability.", "FSRS xotirada eslab qolish darajasini o'lchaydi.", "Memory"),
            FsrsVocabularyEntity("word_4", "repetition", "/ˌrep.əˈtɪʃ.ən/", "takrorlash", "Spaced repetition improves long-term memory.", "Oraliq takrorlash uzoq muddatli xotirani yaxshilaydi.", "Memory"),
            FsrsVocabularyEntity("word_5", "pronunciation", "/prəˌnʌn.siˈeɪ.ʃən/", "talaffuz", "Good pronunciation improves understanding.", "Yaxshi talaffuz tushunishni osonlashtiradi.", "Speaking")
        )

        fsrsDao.insertVocabularyList(sampleVocab)

        sampleVocab.forEach { vocab ->
            val cardEntity = FsrsCardEntity(
                cardId = "card_${vocab.wordId}",
                wordId = vocab.wordId,
                userId = "user_default",
                stability = 0.40255,
                difficulty = 5.0,
                state = 0,
                lastReview = System.currentTimeMillis() - (24L * 60 * 60 * 1000L),
                nextReview = System.currentTimeMillis() - 1000L,
                reps = 0,
                lapses = 0
            )
            fsrsDao.insertOrUpdateCard(cardEntity)
        }
    }

    private fun FsrsCardEntity.toDomainModel() = FsrsCard(
        cardId = cardId,
        wordId = wordId,
        userId = userId,
        stability = stability,
        difficulty = difficulty,
        state = State.fromValue(state),
        lastReview = lastReview,
        nextReview = nextReview,
        reps = reps,
        lapses = lapses,
        scheduledDays = scheduledDays,
        elapsedDays = elapsedDays,
        schedulerVersion = schedulerVersion
    )

    private fun FsrsCard.toEntity(userId: String) = FsrsCardEntity(
        cardId = cardId,
        wordId = wordId,
        userId = userId,
        stability = stability,
        difficulty = difficulty,
        state = state.value,
        lastReview = lastReview,
        nextReview = nextReview,
        reps = reps,
        lapses = lapses,
        scheduledDays = scheduledDays,
        elapsedDays = elapsedDays,
        schedulerVersion = schedulerVersion,
        syncStatus = 1
    )

    companion object {
        private const val TAG = "FsrsRepositoryImpl"
    }
}
