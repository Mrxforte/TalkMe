package com.example.talkme.domain.usecase

import com.example.talkme.domain.repository.TextToSpeechRepository
import javax.inject.Inject

/**
 * Isolated Domain Use Case for pronouncing English sentences and phrases via TTS.
 *
 * @param ttsRepository Injected TextToSpeechRepository instance.
 */
class SpeakTextUseCase @Inject constructor(
    private val ttsRepository: TextToSpeechRepository,
) {
    /**
     * Pronounces the given English text.
     *
     * @param text English phrase to pronounce.
     */
    operator fun invoke(text: String) {
        if (text.isNotBlank()) {
            ttsRepository.speak(text)
        }
    }

    /**
     * Stops active speech narration.
     */
    fun stop() {
        ttsRepository.stop()
    }
}
