package com.example.talkme.domain.usecase

import com.example.talkme.domain.repository.TextToSpeechRepository
import javax.inject.Inject

/**
 * Isolated Domain Use Case for pronouncing English sentences and phrases via TTS
 * with customizable human speech rate, pitch, and character voice profiles.
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
     * @param speed Speech rate multiplier (0.8x to 1.3x).
     * @param pitch Pitch multiplier (0.7x to 1.4x).
     * @param characterProfile Selected character voice profile name.
     */
    operator fun invoke(
        text: String,
        speed: Float = 1.0f,
        pitch: Float = 1.0f,
        characterProfile: String = "Suhbatdosh"
    ) {
        if (text.isNotBlank()) {
            ttsRepository.setSpeechParameters(speed, pitch, characterProfile)
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
