package com.example.talkme.domain.settings

import com.example.talkme.domain.voice.model.EngineSelectionMode

/**
 * Learning Speed Presets for English learners.
 */
enum class LearningSpeedPreset(
    val titleUz: String,
    val titleEn: String,
    val speedValue: Float
) {
    BEGINNER("Boshlang'ich", "Beginner (0.75x)", 0.75f),
    SLOW_LEARNING("Sekin O'rganish", "Slow Learning (0.80x)", 0.80f),
    NORMAL_LEARNING("O'rtacha Ta'lim", "Normal Learning (0.85x)", 0.85f),
    NATURAL_CONVERSATION("Tabiiy Suhbat", "Natural Conversation (0.95x)", 0.95f)
}

/**
 * Data Model for User Configurable Voice AI Engine Preferences.
 */
data class VoiceSettings(
    val engineSelectionMode: EngineSelectionMode = EngineSelectionMode.LOCAL_FIRST,
    val defaultEngineId: String = "sherpa_onnx_tts",
    val defaultLanguage: String = "en",
    val defaultVoiceId: String = "default_en",
    val defaultSpeakerId: Int = 0,
    val speechSpeed: Float = 0.85f, // Slower natural English learning default speed
    val speechPitch: Float = 1.0f,
    val speechVolume: Float = 1.0f,
    val selectedEmotion: String = "Neutral",
    val selectedIntonation: String = "Conversational",
    val selectedCharacterProfile: String = "adult_male",
    val sentencePauseMs: Int = 380,
    val paragraphPauseMs: Int = 650,
    val audioCacheEnabled: Boolean = true,
    val maxCacheSizeMb: Int = 200,
    val downloadWifiOnly: Boolean = true,
    val diagnosticLoggingEnabled: Boolean = true
)
