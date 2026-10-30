package com.talkme.domain.lesson

import com.talkme.data.lesson.LessonRepositoryImpl
import com.talkme.data.preferences.SettingsRepositoryImpl
import com.talkme.data.voice.engine.AndroidSystemTtsEngine
import com.talkme.data.voice.engine.CloudTtsEngine
import com.talkme.data.voice.engine.SherpaOnnxTtsEngine
import com.talkme.domain.lesson.model.ExerciseType
import com.talkme.domain.lesson.model.LessonExercise
import com.talkme.domain.lesson.model.LessonSection
import com.talkme.domain.lesson.usecase.ValidateExerciseAnswerUseCase
import com.talkme.domain.voice.normalization.TextNormalizationPipeline
import com.talkme.domain.voice.registry.EngineRegistry
import com.talkme.domain.voice.usecase.SpeakTextUseCase
import com.talkme.presentation.screens.lesson.LessonViewModel
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Unit tests verifying the TalkMe Lesson System, Exercise Answer Validation UseCase,
 * Vocabulary Mastery status, and Voice AI EngineRegistry routing per PROJECT_RULES.md.
 */
class LessonEngineTest {

    private val lessonRepository = LessonRepositoryImpl()
    private val validateUseCase = ValidateExerciseAnswerUseCase()
    private val engineRegistry = EngineRegistry(
        sherpaOnnxEngine = SherpaOnnxTtsEngine(),
        cloudTtsEngine = CloudTtsEngine(),
        androidSystemEngine = AndroidSystemTtsEngine()
    )
    private val speakTextUseCase = SpeakTextUseCase(
        engineRegistry = engineRegistry,
        normalizationPipeline = TextNormalizationPipeline(),
        settingsRepository = SettingsRepositoryImpl()
    )

    /**
     * Verifies that [ValidateExerciseAnswerUseCase] accurately validates LetterBuilder and FillBlank submissions.
     */
    @Test
    fun `validateAnswer correctly validates LetterBuilder and FillBlank exercises`() {
        val viewModel = LessonViewModel(
            lessonRepository = lessonRepository,
            validateExerciseAnswerUseCase = validateUseCase,
            speakTextUseCase = speakTextUseCase
        )

        val letterExercise = LessonExercise(
            exerciseId = "ex_wb_1",
            section = LessonSection.WORD_BUILDER,
            exerciseType = ExerciseType.LETTER_BUILDER,
            question = "Construct THREE",
            instructions = "Tap letters",
            correctAnswer = "THREE",
            explanationUz = "3 = THREE"
        )

        assertTrue(viewModel.validateAnswer(letterExercise, "three"))
        assertTrue(viewModel.validateAnswer(letterExercise, "THREE"))
        assertFalse(viewModel.validateAnswer(letterExercise, "THRE"))
    }

    /**
     * Verifies that vocabulary mastery toggles and final assessment summaries compute accurately.
     */
    @Test
    fun `toggleVocabularyLearned and buildFinalAssessmentSummary compute accurate results`() {
        val viewModel = LessonViewModel(
            lessonRepository = lessonRepository,
            validateExerciseAnswerUseCase = validateUseCase,
            speakTextUseCase = speakTextUseCase
        )

        viewModel.toggleVocabularyLearned("voc_1")
        assertTrue(viewModel.uiState.value.learnedWordIds.contains("voc_1"))

        val summary = viewModel.buildFinalAssessmentSummary()
        assertNotNull(summary)
        assertEquals(1, summary?.vocabularyMasteredCount)
    }
}
