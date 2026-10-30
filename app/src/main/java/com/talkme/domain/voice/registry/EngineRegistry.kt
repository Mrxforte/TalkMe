package com.talkme.domain.voice.registry

import com.talkme.domain.voice.engine.EngineSelectionMode
import com.talkme.domain.voice.engine.SynthesisRequest
import com.talkme.domain.voice.engine.SynthesisResult
import com.talkme.domain.voice.engine.TtsEngine
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Discovers registered [TtsEngine] adapters and routes speech synthesis requests
 * according to [EngineSelectionMode] (LOCAL_FIRST, CLOUD_FIRST, OFFLINE_ONLY, AUTO).
 */
@Singleton
class EngineRegistry @Inject constructor(
    private val sherpaOnnxEngine: TtsEngine,
    private val cloudTtsEngine: TtsEngine,
    private val androidSystemEngine: TtsEngine
) {
    /**
     * Resolves the ordered chain of [TtsEngine] adapters for the given [mode].
     */
    fun resolveEngineChain(mode: EngineSelectionMode): List<TtsEngine> {
        return when (mode) {
            EngineSelectionMode.LOCAL_FIRST -> listOf(sherpaOnnxEngine, cloudTtsEngine, androidSystemEngine)
            EngineSelectionMode.CLOUD_FIRST -> listOf(cloudTtsEngine, sherpaOnnxEngine, androidSystemEngine)
            EngineSelectionMode.OFFLINE_ONLY -> listOf(sherpaOnnxEngine, androidSystemEngine)
            EngineSelectionMode.AUTO -> listOf(cloudTtsEngine, sherpaOnnxEngine, androidSystemEngine)
        }
    }

    /**
     * Routes the [request] through the first available engine in the resolved chain.
     */
    suspend fun routeSynthesis(
        request: SynthesisRequest,
        mode: EngineSelectionMode = EngineSelectionMode.CLOUD_FIRST
    ): SynthesisResult {
        val candidates = resolveEngineChain(mode)
        for (engine in candidates) {
            if (engine.isAvailable()) {
                val result = engine.speak(request)
                if (result.success) {
                    return result
                }
            }
        }
        return androidSystemEngine.speak(request)
    }

    /**
     * Stops playback across all registered engines.
     */
    fun stopAll() {
        sherpaOnnxEngine.stop()
        cloudTtsEngine.stop()
        androidSystemEngine.stop()
    }
}
