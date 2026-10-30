package com.example.talkme.data.remote.model

/**
 * REST Request Payload for Cloud FastAPI TTS Synthesis.
 */
data class CloudTtsSynthesizeRequest(
    val text: String,
    val language: String = "en",
    val voiceId: String = "default_en",
    val speakerId: Int? = null,
    val emotion: String? = null,
    val intonation: String? = null,
    val speed: Float = 1.0f,
    val pitch: Float = 1.0f,
    val volume: Float = 1.0f,
    val audioFormat: String = "wav",
    val sampleRate: Int = 22050,
    val isStreaming: Boolean = false
)

/**
 * Remote Voice Profile Metadata DTO.
 */
data class CloudVoiceDto(
    val voiceId: String,
    val voiceName: String,
    val language: String,
    val gender: String,
    val supportedEmotions: List<String> = emptyList(),
    val supportedIntonations: List<String> = emptyList()
)

/**
 * Remote Model Metadata DTO.
 */
data class CloudModelDto(
    val modelId: String,
    val modelName: String,
    val provider: String,
    val engineType: String,
    val version: String,
    val downloadUrl: String,
    val sizeMb: Float,
    val checksumSha256: String
)
