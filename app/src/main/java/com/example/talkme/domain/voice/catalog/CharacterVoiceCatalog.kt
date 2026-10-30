package com.example.talkme.domain.voice.catalog

import com.example.talkme.domain.voice.model.CharacterProfile
import com.example.talkme.domain.voice.model.VoiceFamily

/**
 * Curated, High-Quality Voice Character Catalog covering 6 approved character groups.
 * Every profile represents a demonstrably distinct acoustic identity backed by real engine capabilities.
 */
object CharacterVoiceCatalog {

    val allProfiles: List<CharacterProfile> by lazy {
        adultMaleVoices +
        adultFemaleVoices +
        youngBoyVoices +
        youngGirlVoices +
        teenageBoyVoices +
        teenageGirlVoices
    }

    fun getProfileById(id: String): CharacterProfile {
        return allProfiles.find { it.id == id } ?: adultMaleVoices.first()
    }

    fun getProfilesByFamily(family: VoiceFamily): List<CharacterProfile> {
        return allProfiles.filter { it.family == family }
    }

    // ==========================================
    // 1. ADULT MALE VOICES
    // ==========================================
    private val adultMaleVoices = listOf(
        CharacterProfile("male_baritone", VoiceFamily.ADULT_MALE, "Iliq Bariton", "Warm Baritone", "👨", "Botiq, iliq va tushunarli erkak bariton ovozi.", 0.92f, 0.85f, "male"),
        CharacterProfile("male_bass", VoiceFamily.ADULT_MALE, "Chuqur Bas", "Deep Bass", "🎬", "Botiq va haybatli erkak bas ovozi.", 0.85f, 0.70f, "male"),
        CharacterProfile("male_tenor", VoiceFamily.ADULT_MALE, "Aniq Tenor", "Clear Tenor", "🎙️", "Aniq va yorqin tenor erkak ovozi.", 1.00f, 1.05f, "male"),
        CharacterProfile("male_presenter", VoiceFamily.ADULT_MALE, "Rasmiy Diktori", "Broadcast Presenter", "📰", "Aniq va rasmiy yangiliklar diktori.", 1.04f, 0.96f, "male")
    )

    // ==========================================
    // 2. ADULT FEMALE VOICES
    // ==========================================
    private val adultFemaleVoices = listOf(
        CharacterProfile("female_alto", VoiceFamily.ADULT_FEMALE, "Iliq Alt Ayol", "Warm Alto", "👩", "Mayin va iliq alt ayol ovozi.", 0.92f, 0.90f, "female"),
        CharacterProfile("female_soprano", VoiceFamily.ADULT_FEMALE, "Yorqin Soprano", "Bright Soprano", "✨", "Yorqin va baland soprano ayol ovozi.", 1.05f, 1.25f, "female"),
        CharacterProfile("female_presenter", VoiceFamily.ADULT_FEMALE, "Rasmiy Boshlovchi", "Broadcast Anchor", "💼", "Professional va ishonchli ayol boshlovchi.", 1.02f, 1.00f, "female"),
        CharacterProfile("female_gentle", VoiceFamily.ADULT_FEMALE, "Muloyim Ayol", "Soft Gentle Female", "🌸", "Muloyim va ma'sum ayol nutqi.", 0.88f, 1.05f, "female")
    )

    // ==========================================
    // 3. YOUNG BOY VOICES
    // ==========================================
    private val youngBoyVoices = listOf(
        CharacterProfile("boy_curious", VoiceFamily.YOUNG_BOY, "Qiziquvchan O'g'il Bola", "Curious Boy", "👦", "Qiziquvchan va jonli yosh o'g'il bola sintetizatsiyalangan ovozi.", 1.00f, 1.35f, "male"),
        CharacterProfile("boy_cheerful", VoiceFamily.YOUNG_BOY, "Quvnoq O'g'il Bola", "Cheerful Boy", "🎈", "Quvnoq va sho'x yosh o'g'il bola ovozi.", 1.08f, 1.40f, "male")
    )

    // ==========================================
    // 4. YOUNG GIRL VOICES
    // ==========================================
    private val youngGirlVoices = listOf(
        CharacterProfile("girl_cheerful", VoiceFamily.YOUNG_GIRL, "Quvnoq Qizaloq", "Cheerful Girl", "👧", "Quvnoq va sho'x yosh qizaloq sintetizatsiyalangan ovozi.", 1.05f, 1.45f, "female"),
        CharacterProfile("girl_gentle", VoiceFamily.YOUNG_GIRL, "Muloyim Qizaloq", "Gentle Girl", "🌸", "Muloyim va ma'sum yosh qizaloq ovozi.", 0.92f, 1.38f, "female")
    )

    // ==========================================
    // 5. TEENAGE BOY VOICES
    // ==========================================
    private val teenageBoyVoices = listOf(
        CharacterProfile("teen_boy_student", VoiceFamily.TEENAGE_BOY, "O'quvchi Yigit", "Student Teen Boy", "🧑‍🎓", "Yosh o'smir yigit nutq va ta'lim ovozi.", 1.00f, 1.10f, "male"),
        CharacterProfile("teen_boy_expressive", VoiceFamily.TEENAGE_BOY, "G'ayratli O'smir Yigit", "Expressive Teen Boy", "⚡", "Jo'shqin va yorqin o'smir yigit ovozi.", 1.12f, 1.15f, "male")
    )

    // ==========================================
    // 6. TEENAGE GIRL VOICES
    // ==========================================
    private val teenageGirlVoices = listOf(
        CharacterProfile("teen_girl_student", VoiceFamily.TEENAGE_GIRL, "O'quvchi Qiz", "Student Teen Girl", "👩‍🎓", "Yosh o'smir qiz nutq va ta'lim ovozi.", 1.00f, 1.18f, "female"),
        CharacterProfile("teen_girl_expressive", VoiceFamily.TEENAGE_GIRL, "G'ayratli O'smir Qiz", "Expressive Teen Girl", "🌟", "Jo'shqin va yorqin o'smir qiz ovozi.", 1.12f, 1.22f, "female")
    )
}
