package com.example.talkme.domain.usecase

import com.example.talkme.domain.fsrs.FsrsCard
import com.example.talkme.domain.fsrs.Rating
import com.example.talkme.domain.repository.FsrsRepository
import javax.inject.Inject

/**
 * Domain Use Case for submitting user FSRS review ratings (Again, Hard, Good, Easy).
 */
class SubmitFsrsReviewUseCase @Inject constructor(
    private val fsrsRepository: FsrsRepository
) {
    suspend operator fun invoke(card: FsrsCard, rating: Rating, userId: String = "user_default") {
        fsrsRepository.submitReview(card, rating, userId)
    }
}
