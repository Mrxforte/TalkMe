package com.example.talkme.data.remote.model

/**
 * DTO representing an FSRS Review Event Log for Django API synchronization.
 */
data class FsrsReviewLogDto(
    val logId: String,
    val cardId: String,
    val userId: String,
    val rating: Int,
    val reviewTimestamp: Long,
    val scheduledDays: Int,
    val elapsedDays: Int,
    val stability: Double,
    val difficulty: Double,
    val state: Int
)

/**
 * DTO for Bulk FSRS Sync Request with Django Backend.
 */
data class FsrsBulkSyncRequest(
    val userId: String,
    val reviewLogs: List<FsrsReviewLogDto>,
    val lastSyncTimestamp: Long
)

/**
 * DTO for Django Bulk Sync Response.
 */
data class FsrsBulkSyncResponse(
    val syncedLogIds: List<String>,
    val serverTimestamp: Long,
    val updatedCardsCount: Int
)
