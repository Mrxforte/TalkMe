package com.example.talkme.domain.voice.model

/**
 * 24 Major Voice Character Families covering 600 total distinct character profiles.
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
    CARTOON_FANTASY("O'yin va Fantaziya", "Cartoon & Fantasy", "🧙‍♂️"),

    // NEW FAMILIES I TO X
    BABY_BOY("Chaqaloq O'g'il Bola", "Baby Boy Voices", "👶"),
    BABY_GIRL("Chaqaloq Qiz Bola", "Baby Girl Voices", "🍼"),
    TODDLER_BOY("Kichik Bolakay (O'g'il)", "Toddler Boy Voices", "🧸"),
    TODDLER_GIRL("Kichik Qizaloq", "Toddler Girl Voices", "🎀"),
    YOUNG_TEEN_MALE("O'smir Yigit", "Young Teen Male", "🧑‍🎓"),
    YOUNG_TEEN_FEMALE("O'smir Qiz", "Young Teen Female", "👩‍🎓"),
    ADULT_MALE_VARIATIONS("Erkak Harakter Variatsiyalari", "Adult Male Personalities", "👨‍💼"),
    ADULT_FEMALE_VARIATIONS("Ayol Harakter Variatsiyalari", "Adult Female Personalities", "👩‍💼"),
    MATURE_MALE_VARIATIONS("Katta Yoshli Erkak Variatsiyalari", "Mature Male Personalities", "🧔"),
    MATURE_FEMALE_VARIATIONS("Katta Yoshli Ayol Variatsiyalari", "Mature Female Personalities", "👵"),
    FANTASY_MALE("Fantaziya Erkak Qahramonlar", "Fantasy Male Characters", "⚔️"),
    FANTASY_FEMALE("Fantaziya Ayol Qahramonlar", "Fantasy Female Characters", "🧚‍♀️"),
    PROFESSIONAL_MALE_PRESENTERS("Professional Erkak Spikerlar", "Professional Male Presenters", "👔"),
    PROFESSIONAL_FEMALE_PRESENTERS("Professional Ayol Spikerlar", "Professional Female Presenters", "👩‍💼"),
    INTERNATIONAL_ENGLISH("Xalqaro Ingliz Tili Aktsentlari", "International English Voices", "🌐"),
    SPECIAL_EXPRESSIVE("Maxsus Ekspressiv Qahramonlar", "Special Expressive Characters", "✨")
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
