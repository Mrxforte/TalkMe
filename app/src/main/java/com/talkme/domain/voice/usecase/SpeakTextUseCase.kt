package com.talkme.domain.voice.usecase

import com.talkme.data.preferences.SettingsRepositoryImpl
import com.talkme.domain.voice.engine.SynthesisRequest
import com.talkme.domain.voice.engine.SynthesisResult
import com.talkme.domain.voice.normalization.TextNormalizationPipeline
import com.talkme.domain.voice.registry.EngineRegistry
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Strict guard mirroring `src/domain/voice/ttsEngine.ts` (`isUzbekLanguageText`): TalkMe is an
 * English learning platform, so speaker TTS must ONLY pronounce English. Uzbek explanations,
 * definitions, and translations must never be voiced by TTS.
 */
private val UZBEK_APOSTROPHE_LETTER_REGEX = Regex("[oOgG][\u2018'`\u02bc]")
private val UZBEK_WORDS_REGEX = Regex(
    "\\b(va|bilan|uchun|haqida|hamda|kerak|emas|bo\u2018lib|bo'lib|bo\u2018ladi|bo'ladi|birlari|" +
        "tushuncha|o\u2018rganamiz|o'rganamiz|so\u2018zlar|so'zlar|gaplar|harflar|dars|daraja|" +
        "dasturi|muloqot|insonlarning|yordam|beradi|til|o\u2018quvchi|o'quvchi|kitob|maktab|" +
        "yozing|tanlang|mashq|qoida|qoidalar|lug\u2018at|lug'at|tarjima)\\b",
    RegexOption.IGNORE_CASE
)

fun isUzbekLanguageText(text: String): Boolean {
    if (text.isBlank()) return false
    if (UZBEK_APOSTROPHE_LETTER_REGEX.containsMatchIn(text)) return true
    return UZBEK_WORDS_REGEX.containsMatchIn(text)
}

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
        // Strict guard: Uzbek text must never be voiced by speaker TTS across the application.
        if (isUzbekLanguageText(text)) {
            return SynthesisResult(success = false, engineId = "guard-skipped-uzbek", latencyMs = 0)
        }

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
