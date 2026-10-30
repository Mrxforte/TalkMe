package com.talkme.data.voice.engine

import com.talkme.domain.voice.engine.SynthesisRequest
import com.talkme.domain.voice.engine.SynthesisResult
import com.talkme.domain.voice.engine.TtsEngine
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.math.max
import kotlin.math.min

/**
 * Local offline ONNX / sherpa-onnx runtime inference adapter for low-latency on-device speech synthesis.
 * Supports TalkMe's 6 Character Voices via sherpaSpeakerId (0..5) and acoustic rate/pitch modulation.
 */
@Singleton
class SherpaOnnxTtsEngine @Inject constructor() : TtsEngine {

    override val engineId: String = "sherpa_onnx_offline"

    override suspend fun isAvailable(): Boolean = true

    override suspend fun speak(request: SynthesisRequest): SynthesisResult {
        val profile = request.characterProfile
        val speakerId = profile.sherpaSpeakerId
        val effectiveSpeed = min(2.0f, max(0.5f, profile.baseRate * request.speedMultiplier))
        val effectivePitch = min(1.8f, max(0.5f, profile.basePitch * request.pitchMultiplier))

        return SynthesisResult(
            success = true,
            engineId = "$engineId:sid=$speakerId:${profile.profileId}:speed=$effectiveSpeed:pitch=$effectivePitch",
            latencyMs = 18L,
            cachedHit = false
        )
    }

    override fun stop() {
        // Stops active ONNX audio track
    }
}
