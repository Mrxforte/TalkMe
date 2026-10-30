package com.example.talkme.domain.voice.model

/**
 * 6 Final Approved Voice Character Groups.
 */
enum class VoiceFamily(
    val titleUz: String,
    val titleEn: String,
    val iconEmoji: String
) {
    ADULT_MALE("Katta Yoshli Erkak", "Adult Male", "👨"),
    ADULT_FEMALE("Katta Yoshli Ayol", "Adult Female", "👩"),
    YOUNG_BOY("Yosh O'g'il Bola", "Young Boy", "👦"),
    YOUNG_GIRL("Yosh Qiz Bola", "Young Girl", "👧"),
    TEENAGE_BOY("O'smir Yigit", "Teenage Boy", "🧑‍🎓"),
    TEENAGE_GIRL("O'smir Qiz", "Teenage Girl", "👩‍🎓")
}

/**
 * Data Model for Character Voice Profiles with distinct acoustic identity.
 */
data class CharacterProfile(
    val id: String,
    val family: VoiceFamily,
    val nameUz: String,
    val nameEn: String,
    val iconEmoji: String,
    val descriptionUz: String,
    val baseRate: Float = 1.0f,
    val basePitch: Float = 1.0f,
    val preferredGender: String = "male" // "male", "female", "neutral"
)
