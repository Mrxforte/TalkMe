package com.example.talkme.domain.fsrs

import javax.inject.Inject
import javax.inject.Singleton
import kotlin.math.exp
import kotlin.math.max
import kotlin.math.min
import kotlin.math.pow
import kotlin.math.roundToInt

/**
 * Official FSRS-6 (Free Spaced Repetition Scheduler) Algorithm Engine.
 * Computes card Stability (S), Difficulty (D), Retrievability (R), and Next Review Intervals.
 */
@Singleton
class FsrsScheduler @Inject constructor(
    private val params: FsrsParameters
) {

    /**
     * Calculates the retrievability (forgetting curve) R(t, S) = (1 + t / (9 * S))^-1
     */
    fun calculateRetrievability(elapsedDays: Int, stability: Double): Double {
        if (stability <= 0.0) return 0.0
        return (1.0 + elapsedDays / (9.0 * stability)).pow(-1.0)
    }

    /**
     * Computes next review intervals for all 4 ratings (Again, Hard, Good, Easy) for a card.
     */
    fun repeat(card: FsrsCard, now: Long = System.currentTimeMillis()): Map<Rating, FsrsSchedulingInfo> {
        val elapsedDays = max(0, ((now - card.lastReview) / (1000L * 60 * 60 * 24)).toInt())

        return mapOf(
            Rating.AGAIN to scheduleNext(card, Rating.AGAIN, elapsedDays, now),
            Rating.HARD to scheduleNext(card, Rating.HARD, elapsedDays, now),
            Rating.GOOD to scheduleNext(card, Rating.GOOD, elapsedDays, now),
            Rating.EASY to scheduleNext(card, Rating.EASY, elapsedDays, now)
        )
    }

    private fun scheduleNext(
        card: FsrsCard,
        rating: Rating,
        elapsedDays: Int,
        now: Long
    ): FsrsSchedulingInfo {
        val grade = rating.value
        val newReps = card.reps + 1
        val newLapses = if (rating == Rating.AGAIN) card.lapses + 1 else card.lapses

        val newDifficulty = calculateNextDifficulty(card.difficulty, grade)
        val newStability: Double
        val newState: State

        when (card.state) {
            State.NEW -> {
                newStability = initStability(grade)
                newState = if (rating == Rating.AGAIN) State.LEARNING else State.REVIEW
            }
            State.LEARNING, State.RELEARNING -> {
                newStability = initStability(grade)
                newState = if (rating == Rating.AGAIN) State.LEARNING else State.REVIEW
            }
            State.REVIEW -> {
                val r = calculateRetrievability(elapsedDays, card.stability)
                if (rating == Rating.AGAIN) {
                    newStability = calculateLapseStability(newDifficulty, card.stability, r)
                    newState = State.RELEARNING
                } else {
                    newStability = calculateRecallStability(newDifficulty, card.stability, r, grade)
                    newState = State.REVIEW
                }
            }
        }

        val intervalDays = calculateInterval(newStability).coerceIn(1, params.maximumInterval)
        val nextReviewMs = now + (intervalDays * 24L * 60 * 60 * 1000L)

        val updatedCard = card.copy(
            stability = newStability,
            difficulty = newDifficulty,
            state = newState,
            lastReview = now,
            nextReview = nextReviewMs,
            reps = newReps,
            lapses = newLapses,
            scheduledDays = intervalDays,
            elapsedDays = elapsedDays
        )

        return FsrsSchedulingInfo(
            card = updatedCard,
            intervalDays = intervalDays,
            nextReviewTimestamp = nextReviewMs
        )
    }

    private fun initStability(grade: Int): Double {
        return max(0.1, params.w[grade - 1])
    }

    private fun calculateNextDifficulty(currentD: Double, grade: Int): Double {
        if (currentD <= 0.0) {
            val initD = params.w[4] - exp(params.w[5] * (grade - 1)) + 1.0
            return initD.coerceIn(1.0, 10.0)
        }
        val nextD = currentD - params.w[6] * (grade - 3)
        val meanReversionD = params.w[7] * (params.w[4] - exp(params.w[5] * 2)) + (1.0 - params.w[7]) * nextD
        return meanReversionD.coerceIn(1.0, 10.0)
    }

    private fun calculateRecallStability(d: Double, s: Double, r: Double, grade: Int): Double {
        val hardPenalty = if (grade == Rating.HARD.value) params.w[15] else 1.0
        val easyBonus = if (grade == Rating.EASY.value) params.w[16] else 1.0
        val newS = s * (1.0 + exp(params.w[8]) *
                (11.0 - d) *
                s.pow(-params.w[9]) *
                (exp((1.0 - r) * params.w[10]) - 1.0) *
                hardPenalty * easyBonus)
        return max(0.1, newS)
    }

    private fun calculateLapseStability(d: Double, s: Double, r: Double): Double {
        val newS = params.w[11] *
                d.pow(-params.w[12]) *
                ((s + 1.0).pow(params.w[13]) - 1.0) *
                exp((1.0 - r) * params.w[14])
        return min(s, max(0.1, newS))
    }

    private fun calculateInterval(stability: Double): Int {
        val newInterval = (stability / 0.9 * (params.requestRetention.pow(-1.0 / 0.5) - 1.0)).roundToInt()
        return max(1, newInterval)
    }
}
