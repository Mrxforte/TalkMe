package com.example.talkme.presentation.screens.lesson

import androidx.lifecycle.ViewModel
import com.example.talkme.domain.usecase.SpeakTextUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

/**
 * ViewModel for LessonDetailScreen handling English Text-To-Speech audio pronunciation.
 *
 * @param speakTextUseCase Injected SpeakTextUseCase for English audio narration.
 */
@HiltViewModel
class LessonDetailViewModel @Inject constructor(
    private val speakTextUseCase: SpeakTextUseCase,
) : ViewModel() {

    /**
     * Speaks the given English phrase aloud via native Android Text-To-Speech engine.
     *
     * @param text English phrase to pronounce.
     */
    fun speak(text: String) {
        speakTextUseCase(text)
    }

    override fun onCleared() {
        super.onCleared()
        speakTextUseCase.stop()
    }
}
