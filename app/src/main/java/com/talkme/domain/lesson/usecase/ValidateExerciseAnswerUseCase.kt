package com.talkme.domain.lesson.usecase

import com.talkme.domain.lesson.model.ExerciseAttempt
import com.talkme.domain.lesson.model.ExerciseType
import com.talkme.domain.lesson.model.LessonExercise
import com.talkme.domain.lesson.model.LessonPlan
import com.talkme.domain.lesson.model.LessonResultSummary
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Domain use case responsible for validating exercise submissions across all 18 supported
 * [ExerciseType] variants and computing the final [LessonResultSummary].
 */
@Singleton
class ValidateExerciseAnswerUseCase @Inject constructor() {

    /**
     * Validates a learner's [userSubmission] against the expected answer for [exercise].
     */
    fun validate(exercise: LessonExercise, userSubmission: String): Boolean {
        return when (exercise.exerciseType) {
            ExerciseType.LETTER_BUILDER,
            ExerciseType.WORD_SCRAMBLE,
            ExerciseType.IMAGE_TO_WORD -> {
                userSubmission.trim().equals(exercise.correctAnswer.trim(), ignoreCase = true)
            }
            ExerciseType.MULTI_SELECT -> {
                val expected = exercise.correctAnswersList.map { it.trim().lowercase() }.sorted()
                val actual = userSubmission
                    .split(",")
                    .map { it.trim().lowercase() }
                    .filter { it.isNotEmpty() }
                    .sorted()
                expected == actual
            }
            ExerciseType.SEQUENCE_BUILDER -> {
                val expected = exercise.correctAnswersList.map { it.trim().lowercase() }
                val actual = userSubmission.split("->").map { it.trim().lowercase() }
                expected == actual
            }
            else -> {
                userSubmission.trim().equals(exercise.correctAnswer.trim(), ignoreCase = true)
            }
        }
    }

    /**
     * Calculates the final [LessonResultSummary] from recorded [attempts].
     */
    fun calculateSummary(
        plan: LessonPlan,
        attempts: List<ExerciseAttempt>,
        learnedWordCount: Int,
        elapsedSeconds: Long
    ): LessonResultSummary {
        val total = attempts.size.coerceAtLeast(1)
        val correct = attempts.count { it.isCorrect }
        val incorrect = total - correct
        val pct = ((correct.toFloat() / total.toFloat()) * 100f).toInt()
        val xp = plan.completionCriteria.xpReward + attempts.sumOf { it.pointsEarned }
        val firstMistake = attempts.firstOrNull { !it.isCorrect }

        return LessonResultSummary(
            lessonId = plan.lessonId,
            lessonTitle = plan.title,
            totalQuestions = total,
            correctCount = correct,
            incorrectCount = incorrect,
            completionPercentage = pct,
            timeSpentSeconds = elapsedSeconds.coerceAtLeast(1L),
            xpEarned = xp,
            weeklyGoalProgress = 0.85f,
            ruleCorrectionTipUz = firstMistake?.explanationUz
                ?: plan.rules.firstOrNull()?.memoryTipUz.orEmpty(),
            examPrepNoteUz = plan.description,
            vocabularyMasteredCount = learnedWordCount,
            vocabularyTotalCount = plan.vocabulary.size,
            isCompleted = pct >= plan.completionCriteria.minPassPercentage,
            attempts = attempts
        )
    }
}
