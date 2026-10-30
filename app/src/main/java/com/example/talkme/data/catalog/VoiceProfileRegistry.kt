package com.example.talkme.data.catalog

import com.example.talkme.domain.model.AcousticProfile
import com.example.talkme.domain.model.PauseProfile
import com.example.talkme.domain.model.VoiceCharacter
import com.example.talkme.domain.voice.model.VoiceFamily

/**
 * Curated Voice Profile Registry containing genuinely distinct VoiceCharacters across 6 approved groups.
 */
object VoiceProfileRegistry {

    val allCharacters: List<VoiceCharacter> by lazy {
        adultMaleCharacters +
        adultFemaleCharacters +
        youngBoyCharacters +
        youngGirlCharacters +
        teenageBoyCharacters +
        teenageGirlCharacters
    }

    fun getCharacterById(id: String): VoiceCharacter {
        return allCharacters.find { it.id == id } ?: adultMaleCharacters.first()
    }

    fun getCharactersByFamily(family: VoiceFamily): List<VoiceCharacter> {
        return allCharacters.filter { it.family == family }
    }

    // 1. ADULT MALE VOICES
    private val adultMaleCharacters = listOf(
        VoiceCharacter("male_baritone", "Iliq Bariton", "Warm Baritone", VoiceFamily.ADULT_MALE, "👨", "Botiq, iliq va tushunarli erkak bariton ovozi.", "Warm, rounded vocal texture with relaxed conversational pacing.", AcousticProfile(0.85f, 1.0f, 0.92f, 1.0f, "Resonant", "male"), pauseProfile = PauseProfile(180, 280, 420, 450, 380, 700, 900)),
        VoiceCharacter("male_bass", "Chuqur Bas", "Deep Bass", VoiceFamily.ADULT_MALE, "🎬", "Kinematik, botiq va haybatli erkak bas ovozi.", "Naturally deep vocal character with strong resonance and cinematic emphasis.", AcousticProfile(0.70f, 0.8f, 0.85f, 1.1f, "Deep", "male"), pauseProfile = PauseProfile(220, 320, 500, 520, 450, 850, 1100)),
        VoiceCharacter("male_tenor", "Aniq Tenor", "Clear Tenor", VoiceFamily.ADULT_MALE, "🎙️", "Aniq va professional tenor erkak ovozi.", "Clear articulation with bright vocal presence and consistent professional delivery.", AcousticProfile(1.05f, 1.1f, 1.00f, 1.0f, "Bright", "male"), pauseProfile = PauseProfile(160, 250, 380, 400, 350, 650, 800)),
        VoiceCharacter("male_presenter", "Rasmiy Diktori", "Broadcast Presenter", VoiceFamily.ADULT_MALE, "📰", "Aniq va rasmiy yangiliklar diktori.", "Clear, precise broadcast news presenter.", AcousticProfile(0.96f, 1.0f, 1.04f, 1.0f, "Bright", "male"))
    )

    // 2. ADULT FEMALE VOICES
    private val adultFemaleCharacters = listOf(
        VoiceCharacter("female_alto", "Iliq Alt Ayol", "Warm Alto", VoiceFamily.ADULT_FEMALE, "👩", "Mayin va iliq alt ayol ovozi.", "Warm, resonant alto female tone.", AcousticProfile(0.90f, 0.95f, 0.92f, 1.0f, "Resonant", "female")),
        VoiceCharacter("female_soprano", "Yorqin Soprano", "Bright Soprano", VoiceFamily.ADULT_FEMALE, "✨", "Yorqin va baland soprano ayol ovozi.", "Bright, high soprano female voice.", AcousticProfile(1.25f, 1.30f, 1.05f, 1.0f, "Bright", "female")),
        VoiceCharacter("female_presenter", "Rasmiy Boshlovchi", "Broadcast Anchor", VoiceFamily.ADULT_FEMALE, "💼", "Professional va ishonchli ayol boshlovchi.", "Confident corporate female presenter.", AcousticProfile(1.00f, 1.05f, 1.02f, 1.0f, "Bright", "female")),
        VoiceCharacter("female_gentle", "Muloyim Ayol", "Soft Gentle Female", VoiceFamily.ADULT_FEMALE, "🌸", "Muloyim va ma'sum ayol nutqi.", "Soft, gentle female voice.", AcousticProfile(1.05f, 1.10f, 0.88f, 0.95f, "Soft", "female"))
    )

    // 3. YOUNG BOY VOICES
    private val youngBoyCharacters = listOf(
        VoiceCharacter("boy_curious", "Qiziquvchan O'g'il Bola", "Curious Boy", VoiceFamily.YOUNG_BOY, "👦", "Qiziquvchan va jonli yosh o'g'il bola sintetizatsiyalangan ovozi.", "Curious synthetic young boy voice.", AcousticProfile(1.35f, 1.30f, 1.00f, 1.0f, "Synthetic", "male")),
        VoiceCharacter("boy_cheerful", "Quvnoq O'g'il Bola", "Cheerful Boy", VoiceFamily.YOUNG_BOY, "🎈", "Quvnoq va sho'x yosh o'g'il bola ovozi.", "Cheerful synthetic young boy voice.", AcousticProfile(1.40f, 1.35f, 1.08f, 1.0f, "Synthetic", "male"))
    )

    // 4. YOUNG GIRL VOICES
    private val youngGirlCharacters = listOf(
        VoiceCharacter("girl_cheerful", "Quvnoq Qizaloq", "Cheerful Girl", VoiceFamily.YOUNG_GIRL, "👧", "Quvnoq va sho'x yosh qizaloq sintetizatsiyalangan ovozi.", "Cheerful synthetic young girl voice.", AcousticProfile(1.45f, 1.35f, 1.05f, 1.0f, "Synthetic", "female")),
        VoiceCharacter("girl_gentle", "Muloyim Qizaloq", "Gentle Girl", VoiceFamily.YOUNG_GIRL, "🌸", "Muloyim va ma'sum yosh qizaloq ovozi.", "Gentle synthetic young girl voice.", AcousticProfile(1.38f, 1.30f, 0.92f, 0.95f, "Soft", "female"))
    )

    // 5. TEENAGE BOY VOICES
    private val teenageBoyCharacters = listOf(
        VoiceCharacter("teen_boy_student", "O'quvchi Yigit", "Student Teen Boy", VoiceFamily.TEENAGE_BOY, "🧑‍🎓", "Yosh o'smir yigit nutq va ta'lim ovozi.", "Student teen boy voice.", AcousticProfile(1.10f, 1.15f, 1.00f, 1.0f, "Resonant", "male")),
        VoiceCharacter("teen_boy_expressive", "G'ayratli O'smir Yigit", "Expressive Teen Boy", VoiceFamily.TEENAGE_BOY, "⚡", "Jo'shqin va yorqin o'smir yigit ovozi.", "Expressive teen boy voice.", AcousticProfile(1.15f, 1.20f, 1.12f, 1.0f, "Bright", "male"))
    )

    // 6. TEENAGE GIRL VOICES
    private val teenageGirlCharacters = listOf(
        VoiceCharacter("teen_girl_student", "O'quvchi Qiz", "Student Teen Girl", VoiceFamily.TEENAGE_GIRL, "👩‍🎓", "Yosh o'smir qiz nutq va ta'lim ovozi.", "Student teen girl voice.", AcousticProfile(1.18f, 1.20f, 1.00f, 1.0f, "Resonant", "female")),
        VoiceCharacter("teen_girl_expressive", "G'ayratli O'smir Qiz", "Expressive Teen Girl", VoiceFamily.TEENAGE_GIRL, "🌟", "Jo'shqin va yorqin o'smir qiz ovozi.", "Expressive teen girl voice.", AcousticProfile(1.22f, 1.25f, 1.12f, 1.0f, "Bright", "female"))
    )
}
