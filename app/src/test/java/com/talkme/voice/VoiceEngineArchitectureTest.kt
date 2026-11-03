package com.talkme.voice

import com.talkme.data.voice.engine.AndroidSystemTtsEngine
import com.talkme.data.voice.engine.CloudTtsEngine
import com.talkme.data.voice.engine.SherpaOnnxTtsEngine
import com.talkme.domain.voice.engine.EngineSelectionMode
import com.talkme.domain.voice.engine.SynthesisRequest
import com.talkme.domain.voice.engine.VoiceCharacterProfile
import com.talkme.domain.voice.normalization.TextNormalizationPipeline
import com.talkme.domain.voice.registry.EngineRegistry
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Comprehensive Unit Tests for Voice AI Engine Architecture & Text Normalization.
 */
class VoiceEngineArchitectureTest {

    private val cloudEngine = CloudTtsEngine()
    private val sherpaEngine = SherpaOnnxTtsEngine()
    private val androidEngine = AndroidSystemTtsEngine()
    private val registry = EngineRegistry(sherpaEngine, cloudEngine, androidEngine)
    private val pipeline = TextNormalizationPipeline()

    @Test
    fun `cloudEngine returns success for valid Gemini 3_8 Flash TTS request`() = runBlocking {
        val request = SynthesisRequest(
            text = "Hello, welcome to TalkMe!",
            characterProfile = VoiceCharacterProfile.ADULT_FEMALE,
            speedMultiplier = 1.0f
        )
        val result = cloudEngine.speak(request)
        assertTrue(result.success)
        assertNotNull(result.engineId)
    }

    @Test
    fun `engineRegistry resolves correct primary engine for CLOUD_FIRST and LOCAL_FIRST modes`() {
        val cloudChain = registry.resolveEngineChain(EngineSelectionMode.CLOUD_FIRST)
        assertEquals("cloud_gemini_3_8_tts", cloudChain.first().engineId)

        val localChain = registry.resolveEngineChain(EngineSelectionMode.LOCAL_FIRST)
        assertEquals("sherpa_onnx_offline", localChain.first().engineId)
    }

    @Test
    fun `textNormalizationPipeline strips non-speakable formatting and normalizes whitespace`() {
        val rawInput = "  Hello,   world!  \n\n  How are you?  "
        val normalized = pipeline.normalize(rawInput)
        assertEquals("Hello, world! How are you?", normalized)
    }
}
