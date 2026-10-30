package com.example.talkme.domain.voice.catalog

import com.example.talkme.domain.voice.model.CharacterProfile
import com.example.talkme.domain.voice.model.VoiceFamily

/**
 * Clean, Unified Voice Catalog containing EXACTLY 6 approved voices with authentic male, female and youth pitch parameters.
 */
object CharacterVoiceCatalog {

    val allProfiles: List<CharacterProfile> = listOf(
        CharacterProfile(
            id = "adult_male",
            family = VoiceFamily.ADULT_MALE,
            nameUz = "Katta Yoshli Erkak",
            nameEn = "Adult Male",
            iconEmoji = "👨",
            descriptionUz = "Haqiqiy botiq, salmoqli va chuqur katta yoshli erkak bas/bariton ovozi.",
            baseRate = 0.88f,
            basePitch = 0.88f, // Configured pitch 0.88f
            preferredGender = "male"
        ),
        CharacterProfile(
            id = "adult_female",
            family = VoiceFamily.ADULT_FEMALE,
            nameUz = "Katta Yoshli Ayol",
            nameEn = "Adult Female",
            iconEmoji = "👩",
            descriptionUz = "Mayin, ravshan va tabiiy katta yoshli ayol alto/soprano ovozi.",
            baseRate = 0.92f,
            basePitch = 1.00f, // Authentic Natural Adult Female Pitch
            preferredGender = "female"
        ),
        CharacterProfile(
            id = "young_boy",
            family = VoiceFamily.YOUNG_BOY,
            nameUz = "Yosh O'g'il Bola",
            nameEn = "Young Boy",
            iconEmoji = "👦",
            descriptionUz = "Qiziquvchan va jonli yosh o'g'il bola sintetizatsiyalangan ovozi.",
            baseRate = 1.00f,
            basePitch = 1.30f,
            preferredGender = "male"
        ),
        CharacterProfile(
            id = "young_girl",
            family = VoiceFamily.YOUNG_GIRL,
            nameUz = "Yosh Qiz Bola",
            nameEn = "Young Girl",
            iconEmoji = "👧",
            descriptionUz = "Quvnoq va sho'x yosh qizaloq sintetizatsiyalangan ovozi.",
            baseRate = 1.02f,
            basePitch = 1.40f,
            preferredGender = "female"
        ),
        CharacterProfile(
            id = "teenage_boy",
            family = VoiceFamily.TEENAGE_BOY,
            nameUz = "O'smir Yigit",
            nameEn = "Teenage Boy",
            iconEmoji = "🧑‍🎓",
            descriptionUz = "G'ayratli va ochiq o'smir yigit nutq va ta'lim ovozi.",
            baseRate = 1.02f,
            basePitch = 0.75f,
            preferredGender = "male"
        ),
        CharacterProfile(
            id = "teenage_girl",
            family = VoiceFamily.TEENAGE_GIRL,
            nameUz = "O'smir Qiz",
            nameEn = "Teenage Girl",
            iconEmoji = "👩‍🎓",
            descriptionUz = "Jo'shqin va yorqin o'smir qiz nutq va ta'lim ovozi.",
            baseRate = 1.04f,
            basePitch = 1.15f,
            preferredGender = "female"
        )
    )

    fun getProfileById(id: String): CharacterProfile {
        return allProfiles.find { it.id == id } ?: allProfiles.first()
    }

    fun getProfilesByFamily(family: VoiceFamily): List<CharacterProfile> {
        return allProfiles.filter { it.family == family }
    }
}
