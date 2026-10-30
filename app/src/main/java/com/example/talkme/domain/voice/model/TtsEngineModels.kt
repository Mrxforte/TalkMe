package com.example.talkme.domain.voice.model

/**
 * Supported TTS Engine Execution Modes.
 */
enum class EngineSelectionMode {
    LOCAL_FIRST,
    CLOUD_FIRST,
    OFFLINE_ONLY,
    AUTO
}

/**
 * Capabilities reported by a TTS Engine or Voice Model.
 */
data class TtsCapabilities(
    val supportedLanguages: List<String> = listOf("en", "uz", "ru"),
    val supportsOffline: Boolean = true,
    val supportsStreaming: Boolean = false,
    val supportsSpeakerSelection: Boolean = false,
    val supportsEmotionConditioning: Boolean = false,
    val supportsIntonationConditioning: Boolean = false,
    val supportsSpeedControl: Boolean = true,
    val supportsPitchControl: Boolean = true,
    val supportedAudioFormats: List<String> = listOf("wav", "mp3"),
    val sampleRates: List<Int> = listOf(22050, 24000, 44100)
)

/**
 * Voice Synthesis Request Object.
 */
data class TtsRequest(
    val requestId: String = System.currentTimeMillis().toString(),
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
 * Result payload produced by a TTS Engine.
 */
data class AudioResult(
    val requestId: String,
    val audioBytes: ByteArray? = null,
    val audioFilePath: String? = null,
    val sampleRate: Int = 22050,
    val durationMs: Long = 0L,
    val chunkIndex: Int = 0,
    val isLastChunk: Boolean = true,
    val engineId: String,
    val latencyMs: Long = 0L,
    val isFromCache: Boolean = false
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as AudioResult

        if (requestId != other.requestId) return false
        if (audioBytes != null) {
            if (other.audioBytes == null) return false
            if (!audioBytes.contentEquals(other.audioBytes)) return false
        } else if (other.audioBytes != null) return false
        if (audioFilePath != other.audioFilePath) return false
        if (sampleRate != other.sampleRate) return false
        if (durationMs != other.durationMs) return false
        if (chunkIndex != other.chunkIndex) return false
        if (isLastChunk != other.isLastChunk) return false
        if (engineId != other.engineId) return false
        if (latencyMs != other.latencyMs) return false
        if (isFromCache != other.isFromCache) return false

        return true
    }

    override fun hashCode(): Int {
        var result = requestId.hashCode()
        result = 31 * result + (audioBytes?.contentHashCode() ?: 0)
        result = 31 * result + (audioFilePath?.hashCode() ?: 0)
        result = 31 * result + sampleRate
        result = 31 * result + durationMs.hashCode()
        result = 31 * result + chunkIndex
        result = 31 * result + isLastChunk.hashCode()
        result = 31 * result + engineId.hashCode()
        result = 31 * result + latencyMs.hashCode()
        result = 31 * result + isFromCache.hashCode()
        return result
    }
}

/**
 * Comprehensive Metadata describing an ONNX, VITS, Piper or Cloud Voice AI Model.
 */
data class ModelMetadata(
    val modelId: String,
    val modelName: String,
    val provider: String,
    val engineType: String, // "sherpa_onnx", "piper", "cloud", "android_system"
    val modelVersion: String = "1.0",
    val supportedLanguages: List<String> = listOf("en"),
    val supportedVoiceTypes: List<String> = listOf("Standard"),
    val sampleRate: Int = 22050,
    val supportedAudioFormats: List<String> = listOf("wav"),
    val supportsStreaming: Boolean = false,
    val supportsOffline: Boolean = true,
    val supportsSpeakerSelection: Boolean = false,
    val supportsEmotionConditioning: Boolean = false,
    val supportsIntonationConditioning: Boolean = false,
    val supportsSpeedControl: Boolean = true,
    val supportsPitchControl: Boolean = true,
    val modelSizeMb: Float = 15.0f,
    val license: String = "MIT",
    val modelPath: String? = null,
    val checksum: String = "",
    val isInstalled: Boolean = true
)
