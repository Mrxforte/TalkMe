package com.example.talkme.domain.usecase

import com.example.talkme.domain.fsrs.FsrsVocabularyItem
import com.example.talkme.domain.repository.FsrsRepository
import javax.inject.Inject

/**
 * Domain Use Case for fetching due FSRS vocabulary flashcards for review.
 */
class GetDueVocabularyUseCase @Inject constructor(
    private val fsrsRepository: FsrsRepository
) {
    suspend operator fun invoke(userId: String = "user_default", limit: Int = 20): List<FsrsVocabularyItem> {
        return fsrsRepository.getDueVocabularyItems(userId, limit)
    }
}
