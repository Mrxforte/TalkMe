package com.talkme.presentation.screens.lesson

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.talkme.domain.lesson.model.ExerciseAttempt
import com.talkme.domain.lesson.model.LessonExercise
import com.talkme.domain.lesson.model.LessonPlan
import com.talkme.domain.lesson.model.LessonResultSummary
import com.talkme.domain.lesson.model.LessonSection
import com.talkme.domain.lesson.model.LessonSegmentTab
import com.talkme.domain.lesson.repository.LessonRepository
import com.talkme.domain.lesson.usecase.ValidateExerciseAnswerUseCase
import com.talkme.domain.voice.usecase.SpeakTextUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * Immutable UI State for [LessonDetailScreen] managing the 10-Section Universal Lesson flow,
 * Qoida/Misol/Mashq segment tabs, bookmark status, vocabulary mastery, and assessment summary.
 */
data class LessonUiState(
    val lesson: LessonPlan? = null,
    val isBookmarked: Boolean = false,
    val activeSegmentTab: LessonSegmentTab = LessonSegmentTab.RULE,
    val currentSection: LessonSection = LessonSection.INTRO,
    val completedSections: Set<LessonSection> = emptySet(),
    val activeRuleIndex: Int = 0,
    val activeExampleIndex: Int = 0,
    val activeExerciseIndex: Int = 0,
    val learnedWordIds: Set<String> = emptySet(),
    val favoriteWordIds: Set<String> = emptySet(),
    val attempts: List<ExerciseAttempt> = emptyList(),
    val finalTestQuestionCount: Int = 10,
    val sessionStartTimestampMs: Long = System.currentTimeMillis(),
    val resultSummary: LessonResultSummary? = null
)

/**
 * Hilt-injected MVVM ViewModel orchestrating [LessonDetailScreen] and routing all TTS audio
 * narration requests through [SpeakTextUseCase] and [com.talkme.domain.voice.registry.EngineRegistry]
 * per PROJECT_RULES.md Rule 3.
 */
@HiltViewModel
class LessonViewModel @Inject constructor(
    private val lessonRepository: LessonRepository,
    private val validateExerciseAnswerUseCase: ValidateExerciseAnswerUseCase,
    private val speakTextUseCase: SpeakTextUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(LessonUiState())
    val uiState: StateFlow<LessonUiState> = _uiState.asStateFlow()

    init {
        loadLesson(courseId = "numerals", lessonId = "numerals_lvl_1")
    }

    /**
     * Loads a structured [LessonPlan] from [LessonRepository].
     */
    fun loadLesson(courseId: String, lessonId: String) {
        val plan = lessonRepository.getLessonPlan(courseId, lessonId)
        _uiState.value = LessonUiState(
            lesson = plan,
            currentSection = LessonSection.INTRO,
            activeSegmentTab = LessonSegmentTab.RULE,
            sessionStartTimestampMs = System.currentTimeMillis()
        )
    }

    /**
     * Toggles the bookmark status of the current lesson.
     */
    fun toggleBookmark() {
        _uiState.update { state ->
            state.copy(isBookmarked = !state.isBookmarked)
        }
    }

    /**
     * Switches between top-level Qoida / Misol / Mashq segment tabs.
     */
    fun selectSegmentTab(tab: LessonSegmentTab) {
        val targetSection = when (tab) {
            LessonSegmentTab.RULE -> LessonSection.RULES
            LessonSegmentTab.EXAMPLE -> LessonSection.ANIMATED_EXAMPLES
            LessonSegmentTab.EXERCISE -> LessonSection.FILL_BLANKS
        }
        selectSection(targetSection)
    }

    /**
     * Navigates directly to any of the 10 universal lesson sections.
     */
    fun selectSection(section: LessonSection) {
        _uiState.update { state ->
            state.copy(
                currentSection = section,
                activeSegmentTab = section.segmentTab,
                activeExerciseIndex = 0
            )
        }
    }

    /**
     * Marks [completed] as finished and transitions to [next].
     */
    fun completeSectionAndAdvance(completed: LessonSection, next: LessonSection) {
        _uiState.update { state ->
            state.copy(
                completedSections = state.completedSections + completed,
                currentSection = next,
                activeSegmentTab = next.segmentTab,
                activeExerciseIndex = 0
            )
        }
    }

    /**
     * Synthesizes English speech via [SpeakTextUseCase] -> [com.talkme.domain.voice.registry.EngineRegistry].
     */
    fun speakText(text: String, slowArticulation: Boolean = false) {
        viewModelScope.launch {
            speakTextUseCase(text = text, slowArticulation = slowArticulation)
        }
    }

    /**
     * Toggles the learned mastery status of a vocabulary item.
     */
    fun toggleVocabularyLearned(wordId: String) {
        _uiState.update { state ->
            val updated = if (state.learnedWordIds.contains(wordId)) {
                state.learnedWordIds - wordId
            } else {
                state.learnedWordIds + wordId
            }
            state.copy(learnedWordIds = updated)
        }
    }

    /**
     * Toggles the favorite status of a vocabulary item.
     */
    fun toggleVocabularyFavorite(wordId: String) {
        _uiState.update { state ->
            val updated = if (state.favoriteWordIds.contains(wordId)) {
                state.favoriteWordIds - wordId
            } else {
                state.favoriteWordIds + wordId
            }
            state.copy(favoriteWordIds = updated)
        }
    }

    /**
     * Validates an exercise answer using [ValidateExerciseAnswerUseCase].
     */
    fun validateAnswer(exercise: LessonExercise, userSubmission: String): Boolean {
        return validateExerciseAnswerUseCase.validate(exercise, userSubmission)
    }

    /**
     * Records an exercise attempt and updates the current state.
     */
    fun submitExerciseAttempt(exercise: LessonExercise, userAnswer: String) {
        val isCorrect = validateAnswer(exercise, userAnswer)
        val attempt = ExerciseAttempt(
            exerciseId = exercise.exerciseId,
            question = exercise.question,
            userAnswer = userAnswer,
            correctAnswer = exercise.correctAnswer,
            isCorrect = isCorrect,
            explanationUz = exercise.explanationUz,
            pointsEarned = if (isCorrect) exercise.points else 0
        )

        _uiState.update { state ->
            val filtered = state.attempts.filterNot { it.exerciseId == exercise.exerciseId }
            state.copy(attempts = filtered + attempt)
        }
    }

    /**
     * Computes and stores the final [LessonResultSummary] when the lesson assessment completes.
     */
    fun buildFinalAssessmentSummary(): LessonResultSummary? {
        val state = _uiState.value
        val plan = state.lesson ?: return null
        val elapsedSec = ((System.currentTimeMillis() - state.sessionStartTimestampMs) / 1000L)
            .coerceAtLeast(1L)

        val summary = validateExerciseAnswerUseCase.calculateSummary(
            plan = plan,
            attempts = state.attempts,
            learnedWordCount = state.learnedWordIds.size,
            elapsedSeconds = elapsedSec
        )

        _uiState.update { it.copy(resultSummary = summary) }
        return summary
    }
}
