package com.example.talkme.data.remote

import com.example.talkme.data.remote.model.FsrsBulkSyncRequest
import com.example.talkme.data.remote.model.FsrsBulkSyncResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

/**
 * Retrofit REST API interface for Django Backend FSRS Spaced Repetition Synchronization.
 */
interface FsrsSyncApi {

    @POST("api/v1/fsrs/sync/bulk/")
    suspend fun syncBulkReviews(@Body request: FsrsBulkSyncRequest): Response<FsrsBulkSyncResponse>
}
