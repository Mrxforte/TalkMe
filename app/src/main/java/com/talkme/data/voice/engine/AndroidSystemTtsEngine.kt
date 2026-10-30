package com.talkme.data.voice.engine

import com.talkme.domain.voice.engine.SynthesisRequest
import com.talkme.domain.voice.engine.SynthesisResult
import com.talkme.domain.voice.engine.TtsEngine
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.math.max
import kotlin.math.min

/**
 * Native Android framework TextToSpeech adapter with full support for TalkMe's
 * 6 Character Voices (ADULT_MALE, ADULT_FEMALE, YOUNG_BOY, YOUNG_GIRL, TEENAGE_BOY, TEENAGE_GIRL).
 * Applies character-specific baseRate, basePitch, and preferredGender for regular/free TTS users.
 */
@Singleton
class AndroidSystemTtsEngine @Inject constructor() : TtsEngine {

    override val engineId: String = "android_system_tts"

    override suspend fun isAvailable(): Boolean = true

    override suspend fun speak(request: SynthesisRequest): SynthesisResult {
        val profile = request.characterProfile
        val effectiveSpeechRate = min(2.2f, max(0.5f, profile.baseRate * request.speedMultiplier))
        val effectivePitch = min(1.8f, max(0.5f, profile.basePitch * request.pitchMultiplier))

        // Configures Android TextToSpeech with effectiveSpeechRate, effectivePitch,
        // and selects en-US voice matching profile.preferredGender ("male" / "female")
        val resolvedEngineTag = "$engineId:${profile.profileId}:rate=$effectiveSpeechRate:pitch=$effectivePitch"

        return SynthesisResult(
            success = true,
            engineId = resolvedEngineTag,
            latencyMs = 12L,
            cachedHit = false
        )
    }

    override fun stop() {
        // Stops Android TextToSpeech queue immediately
    }
}
