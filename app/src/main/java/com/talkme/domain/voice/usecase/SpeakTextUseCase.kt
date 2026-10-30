package com.talkme.domain.voice.usecase

import com.talkme.data.preferences.SettingsRepositoryImpl
import com.talkme.domain.voice.engine.SynthesisRequest
import com.talkme.domain.voice.engine.SynthesisResult
import com.talkme.domain.voice.normalization.TextNormalizationPipeline
import com.talkme.domain.voice.registry.EngineRegistry
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Primary entry point for executing speech synthesis requests across the TalkMe application.
 * Enforces Rule 3 of PROJECT_RULES.md: All speech synthesis requests MUST route through
 * EngineRegistry and SpeakTextUseCase.
 */
@Singleton
class SpeakTextUseCase @Inject constructor(
    private val engineRegistry: EngineRegistry,
    private val normalizationPipeline: TextNormalizationPipeline,
    private val settingsRepository: SettingsRepositoryImpl
) {
    /**
     * Normalizes the provided [text] and routes synthesis through [EngineRegistry]
     * using the user's persisted [SettingsRepositoryImpl] voice preferences.
     */
    suspend operator fun invoke(
        text: String,
        slowArticulation: Boolean = false
    ): SynthesisResult {
        val prefs = settingsRepository.currentPreferences()
        val normalized = normalizationPipeline.normalize(text)
        val effectiveSpeed = if (slowArticulation) {
            (prefs.speedMultiplier * 0.78f).coerceAtLeast(0.65f)
        } else {
            prefs.speedMultiplier
        }

        val request = SynthesisRequest(
            text = normalized,
            characterProfile = prefs.selectedProfile,
            speedMultiplier = effectiveSpeed,
            pitchMultiplier = prefs.pitchMultiplier,
            slowArticulation = slowArticulation
        )

        return engineRegistry.routeSynthesis(
            request = request,
            mode = prefs.engineSelectionMode
        )
    }

    /**
     * Stops any currently playing TTS narration.
     */
    fun stop() {
        engineRegistry.stopAll()
    }
}
