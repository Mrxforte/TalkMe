package com.example.talkme.data.catalog

import com.example.talkme.domain.model.AcousticProfile
import com.example.talkme.domain.model.PauseProfile
import com.example.talkme.domain.model.VoiceCharacter
import com.example.talkme.domain.voice.model.VoiceFamily

/**
 * Clean Voice Profile Registry containing EXACTLY 6 approved VoiceCharacters.
 */
object VoiceProfileRegistry {

    val allCharacters: List<VoiceCharacter> = listOf(
        VoiceCharacter(
            id = "adult_male",
            nameUz = "Katta Yoshli Erkak",
            nameEn = "Adult Male",
            family = VoiceFamily.ADULT_MALE,
            iconEmoji = "👨",
            descriptionUz = "Haqiqiy botiq, salmoqli va chuqur katta yoshli erkak bas/bariton ovozi.",
            descriptionEn = "Deep, authentic adult male bass voice.",
            acousticProfile = AcousticProfile(0.55f, 0.8f, 0.88f, 1.0f, "Deep", "male"),
            pauseProfile = PauseProfile(200, 300, 450, 480, 400, 750, 950)
        ),
        VoiceCharacter(
            id = "adult_female",
            nameUz = "Katta Yoshli Ayol",
            nameEn = "Adult Female",
            family = VoiceFamily.ADULT_FEMALE,
            iconEmoji = "👩",
            descriptionUz = "Mayin, ravshan va tabiiy katta yoshli ayol alto/soprano ovozi.",
            descriptionEn = "Soft, clear adult female voice.",
            acousticProfile = AcousticProfile(1.00f, 1.0f, 0.92f, 1.0f, "Bright", "female"),
            pauseProfile = PauseProfile(180, 280, 420, 450, 380, 700, 900)
        ),
        VoiceCharacter(
            id = "young_boy",
            nameUz = "Yosh O'g'il Bola",
            nameEn = "Young Boy",
            family = VoiceFamily.YOUNG_BOY,
            iconEmoji = "👦",
            descriptionUz = "Qiziquvchan va jonli yosh o'g'il bola sintetizatsiyalangan ovozi.",
            descriptionEn = "Curious young boy synthetic voice.",
            acousticProfile = AcousticProfile(1.30f, 1.3f, 1.00f, 1.0f, "Synthetic", "male"),
            pauseProfile = PauseProfile(160, 240, 380, 400, 340, 600, 750)
        ),
        VoiceCharacter(
            id = "young_girl",
            nameUz = "Yosh Qiz Bola",
            nameEn = "Young Girl",
            family = VoiceFamily.YOUNG_GIRL,
            iconEmoji = "👧",
            descriptionUz = "Quvnoq va sho'x yosh qizaloq sintetizatsiyalangan ovozi.",
            descriptionEn = "Cheerful young girl synthetic voice.",
            acousticProfile = AcousticProfile(1.40f, 1.35f, 1.02f, 1.0f, "Synthetic", "female"),
            pauseProfile = PauseProfile(150, 230, 360, 380, 320, 580, 720)
        ),
        VoiceCharacter(
            id = "teenage_boy",
            nameUz = "O'smir Yigit",
            nameEn = "Teenage Boy",
            family = VoiceFamily.TEENAGE_BOY,
            iconEmoji = "🧑‍🎓",
            descriptionUz = "G'ayratli va ochiq o'smir yigit nutq va ta'lim ovozi.",
            descriptionEn = "Expressive teenage boy voice.",
            acousticProfile = AcousticProfile(0.75f, 1.15f, 1.02f, 1.0f, "Resonant", "male"),
            pauseProfile = PauseProfile(170, 250, 390, 410, 350, 620, 780)
        ),
        VoiceCharacter(
            id = "teenage_girl",
            nameUz = "O'smir Qiz",
            nameEn = "Teenage Girl",
            family = VoiceFamily.TEENAGE_GIRL,
            iconEmoji = "👩‍🎓",
            descriptionUz = "Jo'shqin va yorqin o'smir qiz nutq va ta'lim ovozi.",
            descriptionEn = "Bright teenage girl voice.",
            acousticProfile = AcousticProfile(1.15f, 1.25f, 1.04f, 1.0f, "Bright", "female"),
            pauseProfile = PauseProfile(170, 250, 390, 410, 350, 620, 780)
        )
    )

    fun getCharacterById(id: String): VoiceCharacter {
        return allCharacters.find { it.id == id } ?: allCharacters.first()
    }

    fun getCharactersByFamily(family: VoiceFamily): List<VoiceCharacter> {
        return allCharacters.filter { it.family == family }
    }
}
