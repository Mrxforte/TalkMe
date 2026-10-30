package com.example.talkme.domain.settings

import com.example.talkme.domain.voice.model.EngineSelectionMode

/**
 * Data Model for User Configurable Voice AI Engine Preferences.
 */
data class VoiceSettings(
    val engineSelectionMode: EngineSelectionMode = EngineSelectionMode.LOCAL_FIRST,
    val defaultEngineId: String = "sherpa_onnx_tts",
    val defaultLanguage: String = "en",
    val defaultVoiceId: String = "default_en",
    val defaultSpeakerId: Int = 0,
    val speechSpeed: Float = 1.0f,
    val speechPitch: Float = 1.0f,
    val speechVolume: Float = 1.0f,
    val selectedEmotion: String = "Neutral",
    val selectedIntonation: String = "Neutral",
    val selectedCharacterProfile: String = "Standard",
    val sentencePauseMs: Int = 300,
    val paragraphPauseMs: Int = 600,
    val audioCacheEnabled: Boolean = true,
    val maxCacheSizeMb: Int = 200,
    val downloadWifiOnly: Boolean = true,
    val diagnosticLoggingEnabled: Boolean = true
)
