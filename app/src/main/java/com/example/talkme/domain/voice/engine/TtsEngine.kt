package com.example.talkme.domain.voice.engine

import com.example.talkme.domain.voice.model.AudioResult
import com.example.talkme.domain.voice.model.TtsCapabilities
import com.example.talkme.domain.voice.model.TtsRequest

/**
 * Common Abstraction Contract for all Text-To-Speech Engines (Local ONNX, Cloud, System TTS).
 */
interface TtsEngine {
    val engineId: String

    /**
     * Initializes the TTS Engine resources asynchronously.
     */
    suspend fun initialize(): Result<Unit>

    /**
     * Queries the actual supported capabilities of the engine/model.
     */
    suspend fun getCapabilities(): TtsCapabilities

    /**
     * Synthesizes audio from the provided request.
     */
    suspend fun synthesize(request: TtsRequest): Result<AudioResult>

    /**
     * Stops active synthesis.
     */
    suspend fun stop()

    /**
     * Releases native memory and network resources.
     */
    suspend fun release()
}
