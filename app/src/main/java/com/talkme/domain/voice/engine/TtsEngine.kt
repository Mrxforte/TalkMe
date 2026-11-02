package com.talkme.domain.voice.engine

/**
 * Supported selection modes for routing speech synthesis requests across local and cloud engines.
 * - LOCAL_FIRST: Uses Free Character TTS (Sherpa-ONNX / Android System TTS with 6 character profiles) first.
 * - OFFLINE_ONLY: 100% Free offline 6-character TTS without network calls.
 * - CLOUD_FIRST: Uses Gemini 3.8 Cloud Neural TTS first, with automatic Free Character TTS fallback.
 * - AUTO: Smart hybrid routing based on connectivity and user tier.
 */
enum class EngineSelectionMode {
    LOCAL_FIRST,
    CLOUD_FIRST,
    OFFLINE_ONLY,
    AUTO
}

/**
 * Approved TalkMe 6 Voice Character Profiles supporting both:
 * 1) Free / Standard Character TTS for regular users (custom baseRate, basePitch, sherpaSpeakerId)
 * 2) Gemini 3.8 Cloud Neural TTS (geminiVoiceName, geminiStylePrompt)
 */
enum class VoiceCharacterProfile(
    val profileId: String,
    val displayNameUz: String,
    val displayNameEn: String,
    val badgeLabelUz: String,
    val descriptionUz: String,
    val freeDescriptionUz: String,
    val sherpaSpeakerId: Int,
    val baseRate: Float,
    val basePitch: Float,
    val isFemale: Boolean,
    val geminiVoiceName: String,
    val geminiStylePrompt: String,
    val tags: List<String>
) {
    ADULT_MALE(
        profileId = "adult_male",
        displayNameUz = "Katta Yoshli Erkak",
        displayNameEn = "Adult Male",
        badgeLabelUz = "Chuqur va ishonchli",
        descriptionUz = "Chuqur, vazmin va tushunarli erkak o‘qituvchi ovozi. Grammatik qoidalar va rasmiy misollar uchun eng mos.",
        freeDescriptionUz = "Oddiy Free TTS: Chuqur bariton tembr (Pitch: 0.88x · Speed: 0.88x · Speaker #0)",
        sherpaSpeakerId = 0,
        baseRate = 0.88f,
        basePitch = 0.88f,
        isFemale = false,
        geminiVoiceName = "Charon",
        geminiStylePrompt = "Warm, calm, articulate adult male English teacher",
        tags = listOf("Warm Baritone", "Academic", "Clear")
    ),
    ADULT_FEMALE(
        profileId = "adult_female",
        displayNameUz = "Katta Yoshli Ayol",
        displayNameEn = "Adult Female",
        badgeLabelUz = "Mayin va tabiiy",
        descriptionUz = "Mehribon, aniq va ravon ayol ustoz ovozi. Kundalik muloqot va hikoyalar tinglash uchun juda qulay.",
        freeDescriptionUz = "Oddiy Free TTS: Tiniq va muvozanatli ayol ovozi (Pitch: 1.00x · Speed: 0.92x · Speaker #1)",
        sherpaSpeakerId = 1,
        baseRate = 0.92f,
        basePitch = 1.00f,
        isFemale = true,
        geminiVoiceName = "Kore",
        geminiStylePrompt = "Friendly, warm, crystal-clear adult female English instructor",
        tags = listOf("Natural", "Friendly", "Storyteller")
    ),
    YOUNG_BOY(
        profileId = "young_boy",
        displayNameUz = "Yosh O‘g‘il Bola",
        displayNameEn = "Young Boy",
        badgeLabelUz = "Quvnoq va jonli",
        descriptionUz = "Qiziquvchan va quvnoq bolakay ovozi. Boshlang‘ich mashqlar va qisqa dialoglar uchun ajoyib.",
        freeDescriptionUz = "Oddiy Free TTS: Baland va quvnoq bolalar tembri (Pitch: 1.30x · Speed: 1.00x · Speaker #2)",
        sherpaSpeakerId = 2,
        baseRate = 1.00f,
        basePitch = 1.30f,
        isFemale = false,
        geminiVoiceName = "Puck",
        geminiStylePrompt = "Cheerful, curious, energetic young boy speaking clear everyday English",
        tags = listOf("Playful", "Bright", "Youth")
    ),
    YOUNG_GIRL(
        profileId = "young_girl",
        displayNameUz = "Yosh Qiz Bola",
        displayNameEn = "Young Girl",
        badgeLabelUz = "Yorqin va sho‘x",
        descriptionUz = "Shirin va jarangdor qizaloq ovozi. Ertaklar, yangi so‘zlar va eslab qolish kartochkalari uchun mos.",
        freeDescriptionUz = "Oddiy Free TTS: Jarangdor va mayin qizaloq tembri (Pitch: 1.40x · Speed: 1.02x · Speaker #3)",
        sherpaSpeakerId = 3,
        baseRate = 1.02f,
        basePitch = 1.40f,
        isFemale = true,
        geminiVoiceName = "Zephyr",
        geminiStylePrompt = "Bright, sweet, expressive young girl voice with cheerful intonation",
        tags = listOf("Cheerful", "Clear", "Expressive")
    ),
    TEENAGE_BOY(
        profileId = "teenage_boy",
        displayNameUz = "O‘smir Yigit",
        displayNameEn = "Teenage Boy",
        badgeLabelUz = "Zamonaviy ohang",
        descriptionUz = "Tabiiy, zamonaviy va faol o‘smir yigit ovozi. Do‘stona suhbatlar va real hayotiy vaziyatlar uchun.",
        freeDescriptionUz = "Oddiy Free TTS: Salobatli o‘smir yigit tembri (Pitch: 0.75x · Speed: 1.02x · Speaker #4)",
        sherpaSpeakerId = 4,
        baseRate = 1.02f,
        basePitch = 0.75f,
        isFemale = false,
        geminiVoiceName = "Fenrir",
        geminiStylePrompt = "Cool, confident, natural teenage boy speaking modern conversational English",
        tags = listOf("Casual", "Modern", "Dynamic")
    ),
    TEENAGE_GIRL(
        profileId = "teenage_girl",
        displayNameUz = "O‘smir Qiz",
        displayNameEn = "Teenage Girl",
        badgeLabelUz = "Ravon va ifodali",
        descriptionUz = "Jonli, ifodali va zamonaviy o‘smir qiz ovozi. Podcast uslubidagi matnlar va dialoglar uchun.",
        freeDescriptionUz = "Oddiy Free TTS: Yorqin va ravon o‘smir qiz tembri (Pitch: 1.15x · Speed: 1.04x · Speaker #5)",
        sherpaSpeakerId = 5,
        baseRate = 1.04f,
        basePitch = 1.15f,
        isFemale = true,
        geminiVoiceName = "Zephyr",
        geminiStylePrompt = "Upbeat, friendly, expressive teenage girl speaking natural conversational English",
        tags = listOf("Expressive", "Conversational", "Youth")
    );

    val freeTtsDescriptionUz: String
        get() = freeDescriptionUz
}

/**
 * Request payload for synthesizing speech via any registered TtsEngine.
 */
data class SynthesisRequest(
    val text: String,
    val languageCode: String = "en-US",
    val characterProfile: VoiceCharacterProfile = VoiceCharacterProfile.ADULT_MALE,
    val speedMultiplier: Float = 1.0f,
    val pitchMultiplier: Float = 1.0f,
    val slowArticulation: Boolean = false
)

/**
 * Result metadata returned from a speech synthesis operation.
 */
data class SynthesisResult(
    val success: Boolean,
    val engineId: String,
    val latencyMs: Long,
    val cachedHit: Boolean = false
)

/**
 * Common abstraction contract for all TalkMe speech synthesis engines
 * (SherpaOnnxTtsEngine, CloudTtsEngine, AndroidSystemTtsEngine).
 */
interface TtsEngine {
    /**
     * Unique identifier for the engine implementation.
     */
    val engineId: String

    /**
     * Returns true if the engine is currently available and ready to synthesize speech.
     */
    suspend fun isAvailable(): Boolean

    /**
     * Synthesizes and plays the provided [SynthesisRequest].
     */
    suspend fun speak(request: SynthesisRequest): SynthesisResult

    /**
     * Immediately stops any active speech playback.
     */
    fun stop()
}
