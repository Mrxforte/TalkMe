package com.example.talkme.data.worker

import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.example.talkme.domain.repository.FsrsRepository
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject

/**
 * WorkManager Background Synchronization Worker for syncing offline FSRS reviews with Django backend.
 */
@HiltWorker
class FsrsSyncWorker @AssistedInject constructor(
    @Assisted appContext: Context,
    @Assisted workerParams: WorkerParameters,
    private val fsrsRepository: FsrsRepository
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        val success = fsrsRepository.syncPendingReviewsWithServer()
        return if (success) {
            Result.success()
        } else {
            Result.retry()
        }
    }
}
