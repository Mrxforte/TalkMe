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
     * Stops any currently ongoing speech playback.
     */
    fun stop()

    /**
     * Shuts down the TTS engine and releases resources.
     */
    fun shutdown()
}
