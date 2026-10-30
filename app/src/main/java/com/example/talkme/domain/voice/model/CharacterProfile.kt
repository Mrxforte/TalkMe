package com.example.talkme.domain.voice.model

/**
 * 8 Major Voice Character Families.
 */
enum class VoiceFamily(
    val titleUz: String,
    val titleEn: String,
    val iconEmoji: String
) {
    ADULT_MALE("Kattalar (Erkak)", "Adult Male", "👨"),
    ADULT_FEMALE("Kattalar (Ayol)", "Adult Female", "👩"),
    YOUNG_BOY("Xayoliy O'g'il Bola", "Fictional Young Boy", "👦"),
    YOUNG_GIRL("Xayoliy Qiz Bola", "Fictional Young Girl", "👧"),
    MATURE_ELDERLY("Katta Yoshli va Nuroniylar", "Mature & Elderly", "👴"),
    PROFESSIONAL_EDUCATIONAL("Kasbiy va Ta'lim", "Professional & Educational", "👩‍🏫"),
    NARRATION_MEDIA("Roviylik va OAV", "Narration & Media", "🎙️"),
    CARTOON_FANTASY("O'yin va Fantaziya", "Cartoon & Fantasy", "🧙‍♂️")
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
