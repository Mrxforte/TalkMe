package com.example.talkme.domain.repository

/**
 * Domain Repository interface defining Text-To-Speech (TTS) audio narration contract.
 * Pure Kotlin interface independent of Android framework classes.
 */
interface TextToSpeechRepository {
    /**
     * Speaks the given English text aloud using Text-To-Speech engine.
     *
     * @param text English string phrase to pronounce.
     */
    fun speak(text: String)

    /**
     * Configures speech parameters (human natural speech rate, pitch, and character voice profile).
     *
     * @param speed Speech rate multiplier (human natural range: 0.8x to 1.3x).
     * @param pitch Voice pitch multiplier (human range: 0.7x to 1.4x).
     * @param characterProfile Character profile name (e.g. Ustoz, Hikoyachi, Suhbatdosh, Akademik, Kichik O'quvchi).
     */
    fun setSpeechParameters(speed: Float, pitch: Float, characterProfile: String = "Suhbatdosh")

    /**
     * Stops any currently ongoing speech playback.
     */
    fun stop()

    /**
     * Shuts down the TTS engine and releases resources.
     */
    fun shutdown()
}
