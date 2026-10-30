package com.example.talkme.domain.model

import com.example.talkme.domain.voice.model.VoiceFamily

/**
 * Acoustic identity parameters defining pitch, rate, gain, and resonance.
 */
data class AcousticProfile(
    val basePitch: Float = 1.0f,
    val pitchRange: Float = 1.0f,
    val baseRate: Float = 1.0f,
    val volumeGain: Float = 1.0f,
    val resonanceType: String = "Resonant", // "Deep", "Resonant", "Bright", "Soft", "Raspy", "Synthetic"
    val preferredGender: String = "male" // "male", "female", "neutral"
)

/**
 * Prosody identity defining sentence rhythm, intonation contour, and emphasis patterns.
 */
data class ProsodyProfile(
    val sentenceEndingBehavior: String = "Falling", // "Falling", "Rising", "Sustained", "DramaticPause"
    val emphasisPattern: String = "KeyTerms", // "KeyTerms", "Rhythmic", "Subtle", "Expressive", "Tactical"
    val intonationContour: String = "Conversational", // "Conversational", "Narrative", "Instructional", "Dramatic", "Monotone"
    val rhythmType: String = "Steady" // "Steady", "Dynamic", "Deliberate", "FastPaced", "Calm"
)

/**
 * Emotional capabilities and default emotion state for the character.
 */
data class EmotionProfile(
    val supportedEmotions: List<String> = listOf("Neutral", "Happy", "Calm", "Serious"),
    val defaultEmotion: String = "Neutral",
    val emotionIntensity: Float = 1.0f
)

/**
 * Contextual pause durations for human-like sentence and paragraph transitions.
 */
data class PauseProfile(
    val commaPauseMs: Long = 180L,
    val semicolonPauseMs: Long = 280L,
    val fullStopPauseMs: Long = 420L,
    val questionPauseMs: Long = 450L,
    val exclamationPauseMs: Long = 380L,
    val paragraphPauseMs: Long = 700L,
    val dramaticPauseMs: Long = 900L
)

/**
 * Pronunciation clarity and articulation settings.
 */
data class PronunciationProfile(
    val clarityLevel: String = "High", // "High", "Standard", "Relaxed", "Synthetic"
    val articulationType: String = "Clear", // "Clear", "Smooth", "Energetic", "Deliberate"
    val accentType: String = "US_English"
)

/**
 * Complete Enterprise Voice Character Entity representing a unique vocal identity.
 */
data class VoiceCharacter(
    val id: String,
    val nameUz: String,
    val nameEn: String,
    val family: VoiceFamily,
    val iconEmoji: String,
    val descriptionUz: String,
    val descriptionEn: String,
    val acousticProfile: AcousticProfile = AcousticProfile(),
    val prosodyProfile: ProsodyProfile = ProsodyProfile(),
    val emotionProfile: EmotionProfile = EmotionProfile(),
    val pauseProfile: PauseProfile = PauseProfile(),
    val pronunciationProfile: PronunciationProfile = PronunciationProfile(),
    val preferredEngineId: String = "sherpa_onnx_tts",
    val fallbackEngineId: String = "android_system_tts",
    val modelId: String? = "vits_piper_en",
    val speakerId: Int? = 0,
    val qualityStatus: String = "ProductionReady" // "ProductionReady", "Validated"
)
