package com.example.talkme.domain.voice.registry

import com.example.talkme.data.voice.engine.AndroidSystemTtsEngine
import com.example.talkme.data.voice.engine.CloudTtsEngine
import com.example.talkme.data.voice.engine.SherpaOnnxTtsEngine
import com.example.talkme.domain.voice.engine.TtsEngine
import com.example.talkme.domain.voice.model.AudioResult
import com.example.talkme.domain.voice.model.EngineSelectionMode
import com.example.talkme.domain.voice.model.TtsRequest
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Centralized Engine Registry for discovering and routing synthesis requests to the appropriate TTS Engine.
 */
@Singleton
class EngineRegistry @Inject constructor(
    private val sherpaEngine: SherpaOnnxTtsEngine,
    private val cloudEngine: CloudTtsEngine,
    private val systemEngine: AndroidSystemTtsEngine,
) {

    private val engines = mapOf(
        sherpaEngine.engineId to sherpaEngine,
        cloudEngine.engineId to cloudEngine,
        systemEngine.engineId to systemEngine
    )

    fun getEngine(engineId: String): TtsEngine? = engines[engineId]

    fun getAllEngines(): List<TtsEngine> = engines.values.toList()

    /**
     * Synthesizes request by selecting the best engine according to EngineSelectionMode.
     */
    suspend fun synthesize(
        request: TtsRequest,
        selectionMode: EngineSelectionMode = EngineSelectionMode.LOCAL_FIRST
    ): Result<AudioResult> {
        val targetEngine = when (selectionMode) {
            EngineSelectionMode.LOCAL_FIRST -> sherpaEngine
            EngineSelectionMode.CLOUD_FIRST -> cloudEngine
            EngineSelectionMode.OFFLINE_ONLY -> sherpaEngine
            EngineSelectionMode.AUTO -> if (request.emotion != null || request.intonation != null) cloudEngine else sherpaEngine
        }

        val primaryResult = targetEngine.synthesize(request)
        if (primaryResult.isSuccess) {
            return primaryResult
        }

        // Fallback to system engine if offline / primary fails and not OFFLINE_ONLY
        return if (selectionMode != EngineSelectionMode.OFFLINE_ONLY) {
            systemEngine.synthesize(request)
        } else {
            primaryResult
        }
    }
}
