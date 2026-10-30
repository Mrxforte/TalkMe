package com.example.talkme.data.catalog

import com.example.talkme.domain.model.AcousticProfile
import com.example.talkme.domain.model.PauseProfile
import com.example.talkme.domain.model.VoiceCharacter
import com.example.talkme.domain.voice.model.VoiceFamily

/**
 * Enterprise Voice Profile Registry containing 200 distinct VoiceCharacters.
 * Every profile has an individual acoustic identity, prosody profile, pause strategy, emotion mapping, and gender preference.
 */
object VoiceProfileRegistry {

    val allCharacters: List<VoiceCharacter> by lazy {
        familyAMaleCharacters +
        familyBFemaleCharacters +
        familyCYoungBoyCharacters +
        familyDYoungGirlCharacters +
        familyEMatureElderlyCharacters +
        familyFProfessionalEducationalCharacters +
        familyGNarrationMediaCharacters +
        familyHCartoonFantasyCharacters
    }

    fun getCharacterById(id: String): VoiceCharacter {
        return allCharacters.find { it.id == id } ?: familyAMaleCharacters.first()
    }

    fun getCharactersByFamily(family: VoiceFamily): List<VoiceCharacter> {
        return allCharacters.filter { it.family == family }
    }

    // ==========================================
    // FAMILY A — ADULT MALE VOICES (25)
    // ==========================================
    private val familyAMaleCharacters = listOf(
        VoiceCharacter("male_warm_baritone", "Iliq Bariton Erkak", "Warm Baritone", VoiceFamily.ADULT_MALE, "👨", "Botiq, iliq va tushunarli erkak bariton ovozi.", "Warm, rounded vocal texture with relaxed conversational pacing.", AcousticProfile(0.85f, 1.0f, 0.92f, 1.0f, "Resonant", "male"), pauseProfile = PauseProfile(180, 280, 420, 450, 380, 700, 900)),
        VoiceCharacter("male_deep_bass", "Chuqur Kinematik Bas", "Deep Cinematic Bass", VoiceFamily.ADULT_MALE, "🎬", "Kinematik, botiq va haybatli erkak bas ovozi.", "Naturally deep vocal character with strong resonance and cinematic emphasis.", AcousticProfile(0.70f, 0.8f, 0.85f, 1.1f, "Deep", "male"), pauseProfile = PauseProfile(220, 320, 500, 520, 450, 850, 1100)),
        VoiceCharacter("male_clear_tenor", "Aniq Tenor Erkak", "Clear Professional Tenor", VoiceFamily.ADULT_MALE, "🎙️", "Aniq va professional tenor erkak ovozi.", "Clear articulation with bright vocal presence and consistent professional delivery.", AcousticProfile(1.05f, 1.1f, 1.00f, 1.0f, "Bright", "male"), pauseProfile = PauseProfile(160, 250, 380, 400, 350, 650, 800)),
        VoiceCharacter("male_friendly_conv", "Samimiy Suhbatdosh Erkak", "Friendly Conversational Male", VoiceFamily.ADULT_MALE, "💬", "Tabiiy kunlik muloqot va suhbatdosh ovozi.", "Natural everyday conversational tone with comfortable pacing.", AcousticProfile(0.98f, 1.0f, 1.00f, 1.0f, "Resonant", "male")),
        VoiceCharacter("male_energetic_young", "G'ayratli Yosh Erkak", "Energetic Young Adult Male", VoiceFamily.ADULT_MALE, "⚡", "Jo'shqin va jo'shqin yosh erkak ovozi.", "Upbeat, energetic young adult male voice.", AcousticProfile(1.08f, 1.2f, 1.12f, 1.0f, "Bright", "male")),
        VoiceCharacter("male_calm_mature", "Bosiq Yoshargan Erkak", "Calm Mature Male", VoiceFamily.ADULT_MALE, "☕", "Xotirjam va bosiq katta yoshli erkak ovozi.", "Calm, mature male voice with relaxed delivery.", AcousticProfile(0.82f, 0.9f, 0.88f, 1.0f, "Resonant", "male")),
        VoiceCharacter("male_confident_presenter", "Ishonchli Boshlovchi", "Confident Presenter", VoiceFamily.ADULT_MALE, "🎤", "Ishonchli va jarangdor boshlovchi erkak ovozi.", "Confident presenter voice for announcements and events.", AcousticProfile(0.95f, 1.0f, 1.02f, 1.05f, "Resonant", "male")),
        VoiceCharacter("male_soft_gentle", "Yumshoq Erkak Ovoz", "Soft Gentle Male", VoiceFamily.ADULT_MALE, "🍃", "Muloyim va sokin erkak ovozi.", "Soft, gentle male voice with peaceful delivery.", AcousticProfile(0.92f, 0.95f, 0.90f, 0.95f, "Soft", "male")),
        VoiceCharacter("male_authoritative", "Salmoqli Nufuzli Erkak", "Authoritative Male", VoiceFamily.ADULT_MALE, "🛡️", "Salmoqli va rasmiy erkak ovozi.", "Strong, authoritative formal tone.", AcousticProfile(0.78f, 0.85f, 0.86f, 1.1f, "Deep", "male")),
        VoiceCharacter("male_natural_everyday", "Kundalik Tabiiy Erkak", "Natural Everyday Male", VoiceFamily.ADULT_MALE, "🧑", "Kundalik standart erkak nutqi.", "Standard natural everyday male speech.", AcousticProfile(0.98f, 1.0f, 1.00f, 1.0f, "Resonant", "male")),
        VoiceCharacter("male_expressive_storyteller", "Ifodali Hikoyachi Erkak", "Expressive Storyteller", VoiceFamily.ADULT_MALE, "📖", "Hikoyalarni jonli o'quvchi erkak roviy.", "Dynamic expressive narrator for storytelling.", AcousticProfile(0.88f, 1.1f, 0.94f, 1.0f, "Resonant", "male")),
        VoiceCharacter("male_doc_narrator", "Hujjatli Film Roviysi", "Documentary Narrator", VoiceFamily.ADULT_MALE, "📽️", "Hujjatli filmlar uchun bosiq roviy.", "Observational documentary narrator.", AcousticProfile(0.80f, 0.85f, 0.86f, 1.0f, "Deep", "male")),
        VoiceCharacter("male_radio_presenter", "Radio Boshlovchi Erkak", "Radio Presenter", VoiceFamily.ADULT_MALE, "📻", "Radio efirlariga mos jozibali erkak ovozi.", "Vibrant radio host personality.", AcousticProfile(0.92f, 1.05f, 1.05f, 1.05f, "Resonant", "male")),
        VoiceCharacter("male_news_presenter", "Yangiliklar Diktor Erkak", "News Presenter", VoiceFamily.ADULT_MALE, "📰", "Aniq va rasmiy yangiliklar diktori.", "Clear, precise broadcast news presenter.", AcousticProfile(0.96f, 1.0f, 1.04f, 1.0f, "Bright", "male")),
        VoiceCharacter("male_motivational", "Ruhlantiruvchi Spiker", "Motivational Speaker", VoiceFamily.ADULT_MALE, "🔥", "Ruhlantiruvchi va ilhomlantiruvchi spiker.", "High-energy inspirational speaker.", AcousticProfile(1.02f, 1.15f, 1.10f, 1.1f, "Bright", "male")),
        VoiceCharacter("male_dramatic", "Dramatik Erkak Ovoz", "Dramatic Male", VoiceFamily.ADULT_MALE, "🎭", "Dramatik va hayajonli erkak ovozi.", "Intense dramatic male voice.", AcousticProfile(0.75f, 0.9f, 0.88f, 1.05f, "Deep", "male")),
        VoiceCharacter("male_humorous", "Hajviy Samimiy Erkak", "Humorous Male", VoiceFamily.ADULT_MALE, "😄", "Hazilkash va quvnoq erkak ovozi.", "Witty, cheerful male character.", AcousticProfile(1.12f, 1.2f, 1.15f, 1.0f, "Bright", "male")),
        VoiceCharacter("male_academic", "Akademik Olim Erkak", "Serious Academic Male", VoiceFamily.ADULT_MALE, "🎓", "Jiddiy akademik va ilmiy ma'ruzachi.", "Deliberate professor and academic speaker.", AcousticProfile(0.76f, 0.8f, 0.84f, 1.0f, "Deep", "male")),
        VoiceCharacter("male_reassuring", "Xotirjam Qiluvchi Erkak", "Reassuring Male", VoiceFamily.ADULT_MALE, "🤝", "Dalda beruvchi va xotirjam etuvchi ovoz.", "Warm, reassuring male voice.", AcousticProfile(0.90f, 0.95f, 0.90f, 1.0f, "Soft", "male")),
        VoiceCharacter("male_athletic", "Sportchi G'ayratli Erkak", "Athletic Energetic Male", VoiceFamily.ADULT_MALE, "🏆", "Chaqqon va g'ayratli sportchi nutqi.", "Upbeat athletic sports commentator.", AcousticProfile(1.10f, 1.15f, 1.18f, 1.1f, "Bright", "male")),
        VoiceCharacter("male_mysterious", "Sirlilik Botiq Erkak", "Mysterious Male", VoiceFamily.ADULT_MALE, "🕵️‍♂️", "Sirlilik bilan yo'g'rilgan botiq ovoz.", "Low, mysterious intonation.", AcousticProfile(0.72f, 0.8f, 0.82f, 0.95f, "Deep", "male")),
        VoiceCharacter("male_elegant_formal", "Elegand Rasmiy Erkak", "Elegant Formal Male", VoiceFamily.ADULT_MALE, "👔", "Klassik rasmiy va shukuhli erkak ovozi.", "Elegant formal voice for ceremonies.", AcousticProfile(0.84f, 0.9f, 0.88f, 1.0f, "Resonant", "male")),
        VoiceCharacter("male_relaxed_informal", "Erkin Norasmiy Erkak", "Relaxed Informal Male", VoiceFamily.ADULT_MALE, "🎧", "Erkin va do'stona norasmiy ovoz.", "Casual relaxed informal male voice.", AcousticProfile(0.95f, 1.0f, 0.98f, 1.0f, "Resonant", "male")),
        VoiceCharacter("male_raspy", "Xirillagan Jozibali Erkak", "Distinctive Raspy Male", VoiceFamily.ADULT_MALE, "🎸", "O'ziga xos xirillagan rock-style ovoz.", "Textured, distinctive male voice.", AcousticProfile(0.74f, 0.85f, 0.92f, 1.0f, "Raspy", "male")),
        VoiceCharacter("male_smooth_resonant", "Mayin Jarangdor Erkak", "Smooth Resonant Male", VoiceFamily.ADULT_MALE, "✨", "Silliq va jarangdor erkak baritoni.", "Smooth resonant baritone.", AcousticProfile(0.82f, 0.9f, 0.90f, 1.05f, "Resonant", "male"))
    )

    // ==========================================
    // FAMILY B — ADULT FEMALE VOICES (25)
    // ==========================================
    private val familyBFemaleCharacters = listOf(
        VoiceCharacter("female_warm_alto", "Iliq Alt Ayol", "Warm Alto", VoiceFamily.ADULT_FEMALE, "👩", "Mayin va iliq alt ayol ovozi.", "Warm, resonant alto female tone.", AcousticProfile(0.90f, 0.95f, 0.92f, 1.0f, "Resonant", "female")),
        VoiceCharacter("female_bright_soprano", "Yorqin Soprano Ayol", "Bright Soprano", VoiceFamily.ADULT_FEMALE, "✨", "Yorqin va baland soprano ayol ovozi.", "Bright, high soprano female voice.", AcousticProfile(1.25f, 1.30f, 1.05f, 1.0f, "Bright", "female")),
        VoiceCharacter("female_soft_gentle", "Yumshoq Muloyim Ayol", "Soft Gentle Female", VoiceFamily.ADULT_FEMALE, "🌸", "Muloyim va ma'sum ayol nutqi.", "Soft, gentle female voice.", AcousticProfile(1.05f, 1.10f, 0.88f, 0.95f, "Soft", "female")),
        VoiceCharacter("female_confident_prof", "Ishonchli Professional Ayol", "Confident Professional Female", VoiceFamily.ADULT_FEMALE, "💼", "Professional va ishonchli ayol boshlovchi.", "Confident corporate female presenter.", AcousticProfile(1.00f, 1.05f, 1.02f, 1.0f, "Bright", "female")),
        VoiceCharacter("female_friendly_conv", "Samimiy Suhbatdosh Ayol", "Friendly Conversational Female", VoiceFamily.ADULT_FEMALE, "💬", "Tabiiy kunlik ayol suhbatdoshi.", "Friendly, conversational female voice.", AcousticProfile(1.08f, 1.10f, 1.00f, 1.0f, "Resonant", "female")),
        VoiceCharacter("female_calm_mature", "Bosiq Katta Ayol", "Calm Mature Female", VoiceFamily.ADULT_FEMALE, "☕", "Xotirjam va tajribali ayol ovozi.", "Calm, mature female tone.", AcousticProfile(0.92f, 0.95f, 0.86f, 1.0f, "Resonant", "female")),
        VoiceCharacter("female_energetic_young", "G'ayratli Yosh Ayol", "Energetic Young Adult Female", VoiceFamily.ADULT_FEMALE, "🌟", "Jo'shqin va yorqin yosh ayol ovozi.", "Vibrant energetic female voice.", AcousticProfile(1.18f, 1.25f, 1.12f, 1.05f, "Bright", "female")),
        VoiceCharacter("female_elegant_narrator", "Elegand Roviy Ayol", "Elegant Narrator", VoiceFamily.ADULT_FEMALE, "📖", "Nfis va nafis kitob o'quvchi ayol.", "Elegant narrator for audiobooks.", AcousticProfile(0.95f, 1.00f, 0.90f, 1.0f, "Resonant", "female")),
        VoiceCharacter("female_doc_narrator", "Hujjatli Film Roviysi Ayol", "Documentary Female", VoiceFamily.ADULT_FEMALE, "🎥", "Hujjatli loyihalar uchun ayol roviy.", "Documentary narrator tone.", AcousticProfile(0.88f, 0.92f, 0.86f, 1.0f, "Resonant", "female")),
        VoiceCharacter("female_news_presenter", "Yangiliklar Diktori Ayol", "News Presenter Female", VoiceFamily.ADULT_FEMALE, "📰", "Aniq va tushunarli yangiliklar diktori.", "Clear news broadcast anchor.", AcousticProfile(1.02f, 1.08f, 1.04f, 1.0f, "Bright", "female")),
        VoiceCharacter("female_edu_teacher", "O'qituvchi Ayol", "Educational Teacher Female", VoiceFamily.ADULT_FEMALE, "👩‍🏫", "Sabrli va metodik o'qituvchi ayol.", "Patient educational instructor.", AcousticProfile(1.05f, 1.10f, 0.88f, 1.0f, "Bright", "female")),
        VoiceCharacter("female_expressive_storyteller", "Ifodali Hikoyachi Ayol", "Expressive Storyteller", VoiceFamily.ADULT_FEMALE, "📚", "Ertak va hikoyalarni jonli o'quvchi.", "Expressive female storyteller.", AcousticProfile(1.00f, 1.15f, 0.94f, 1.0f, "Resonant", "female")),
        VoiceCharacter("female_dramatic", "Dramatik Ayol Ovoz", "Dramatic Female", VoiceFamily.ADULT_FEMALE, "🎭", "Dramatik va ta'sirli ayol ovozi.", "Dramatic female performer.", AcousticProfile(0.85f, 0.90f, 0.88f, 1.05f, "Deep", "female")),
        VoiceCharacter("female_reassuring", "Xotirjam Qiluvchi Ayol", "Reassuring Female", VoiceFamily.ADULT_FEMALE, "🌷", "Ko'ngilni ko'taruvchi muloyim ovoz.", "Reassuring, calming female voice.", AcousticProfile(0.98f, 1.02f, 0.90f, 1.0f, "Soft", "female")),
        VoiceCharacter("female_playful", "Quvnoq O'yinqaroq Ayol", "Playful Female", VoiceFamily.ADULT_FEMALE, "🎈", "Quvnoq va sho'x ayol nutqi.", "Playful, bright female voice.", AcousticProfile(1.28f, 1.35f, 1.15f, 1.0f, "Bright", "female")),
        VoiceCharacter("female_academic", "Akademik Оlima Ayol", "Serious Academic Female", VoiceFamily.ADULT_FEMALE, "🔬", "Jiddiy olima va ma'ruzachi ayol.", "Serious academic professor female.", AcousticProfile(0.90f, 0.95f, 0.84f, 1.0f, "Resonant", "female")),
        VoiceCharacter("female_clear_articulate", "Aniq Talaffuzli Ayol", "Clear Articulate Female", VoiceFamily.ADULT_FEMALE, "📢", "Tiniq va benuqson talaffuzli ayol.", "Highly articulate female presenter.", AcousticProfile(1.08f, 1.12f, 1.00f, 1.0f, "Bright", "female")),
        VoiceCharacter("female_natural_everyday", "Kundalik Tabiiy Ayol", "Natural Everyday Female", VoiceFamily.ADULT_FEMALE, "👩‍🦰", "Oddiy kundalik ayol ovozi.", "Natural everyday female voice.", AcousticProfile(1.02f, 1.05f, 1.00f, 1.0f, "Resonant", "female")),
        VoiceCharacter("female_deep_contralto", "Chuqur Kontralto Ayol", "Deep Contralto", VoiceFamily.ADULT_FEMALE, "🎶", "Botiq va noyob kontralto ayol ovozi.", "Deep contralto female tone.", AcousticProfile(0.80f, 0.85f, 0.85f, 1.05f, "Deep", "female")),
        VoiceCharacter("female_light_airy", "Yengil Shaffof Ayol", "Light Airy Female", VoiceFamily.ADULT_FEMALE, "☁️", "Yengil va mayin havodor ovoz.", "Light, airy female tone.", AcousticProfile(1.20f, 1.25f, 0.95f, 0.95f, "Soft", "female")),
        VoiceCharacter("female_motivational", "Ruhlantiruvchi Ayol Spiker", "Motivational Female", VoiceFamily.ADULT_FEMALE, "💪", "Ilhomlantiruvchi ayol motivatori.", "Inspirational female speaker.", AcousticProfile(1.12f, 1.18f, 1.10f, 1.1f, "Bright", "female")),
        VoiceCharacter("female_mysterious", "Sirlilik Botiq Ayol", "Mysterious Female", VoiceFamily.ADULT_FEMALE, "🌙", "Sirlilik va sehrga boy ayol ovozi.", "Mysterious, dark female tone.", AcousticProfile(0.86f, 0.90f, 0.82f, 0.95f, "Deep", "female")),
        VoiceCharacter("female_formal_presenter", "Rasmiy Boshlovchi Ayol", "Formal Presenter Female", VoiceFamily.ADULT_FEMALE, "🎤", "Rasmiy marosimlar boshlovchisi.", "Formal presenter female.", AcousticProfile(1.00f, 1.05f, 0.98f, 1.0f, "Resonant", "female")),
        VoiceCharacter("female_humorous", "Hazilkash Samimiy Ayol", "Humorous Female", VoiceFamily.ADULT_FEMALE, "😆", "Quvnoq va samimiy ayol nutqi.", "Humorous female speaker.", AcousticProfile(1.22f, 1.28f, 1.14f, 1.0f, "Bright", "female")),
        VoiceCharacter("female_smooth_resonant", "Mayin Jarangdor Ayol", "Smooth Resonant Female", VoiceFamily.ADULT_FEMALE, "🌺", "Silliq va jozibali ayol soprano.", "Smooth resonant soprano.", AcousticProfile(0.92f, 0.98f, 0.90f, 1.05f, "Resonant", "female"))
    )

    // ==========================================
    // FAMILY C — FICTIONAL YOUNG BOY VOICES (25)
    // ==========================================
    private val familyCYoungBoyCharacters = (1..25).map { index ->
        val names = listOf(
            "Qiziquvchan O'g'il", "Quvnoq Bolakay", "Tortinchoq O'g'il", "O'yinqaroq Bolakay", "Sarguzashtchi O'g'il",
            "Bosiq Bolakay", "Ertakchi O'g'il", "Multfilm Qahramoni Bolakay", "Alochi O'quvchi", "G'ayratli O'g'il",
            "Muloyim Bolakay", "Hazilkash O'g'il", "Dovyurak Bolakay", "Mulohazali O'g'il", "Hayajonli Bolakay",
            "Sirlilik Qahramoni", "Do'stona Bolakay", "Fantaziya Qahramoni", "Yosh Roviy O'g'il", "Yosh Izlanuvchi",
            "Geniy O'quvchi", "Sehrli Ertak Qahramoni", "O'yin Qahramoni Bolakay", "Multfilm Hamrohi", "Muloyim Ertakchi O'g'il"
        )
        val namesEn = listOf(
            "Curious Boy", "Cheerful Boy", "Shy Boy", "Playful Boy", "Adventurous Boy",
            "Calm Boy", "Storytelling Boy", "Cartoon Boy", "Educational Boy", "Energetic Boy",
            "Gentle Boy", "Funny Boy", "Brave Boy", "Thoughtful Boy", "Excited Boy",
            "Mysterious Boy", "Friendly Boy", "Fantasy Hero Boy", "Young Narrator", "Curious Explorer",
            "Science Student", "Fairytale Character", "Game Character", "Animated Sidekick", "Gentle Story Character"
        )
        val pitchVal = 1.25f + (index % 5) * 0.05f
        val rateVal = 0.95f + (index % 4) * 0.06f
        VoiceCharacter("boy_fictional_$index", "Xayoliy Qahramon: ${names[index - 1]}", namesEn[index - 1], VoiceFamily.YOUNG_BOY, "👦", "Xayoliy yosh o'g'il bola sintetizatsiyalangan ovozi.", "Fictional synthetic young boy voice profile.", AcousticProfile(pitchVal, 1.3f, rateVal, 1.0f, "Synthetic", "male"), pauseProfile = PauseProfile(160, 240, 380, 400, 340, 600, 750))
    }

    // ==========================================
    // FAMILY D — FICTIONAL YOUNG GIRL VOICES (25)
    // ==========================================
    private val familyDYoungGirlCharacters = (1..25).map { index ->
        val names = listOf(
            "Quvnoq Qizaloq", "Qiziquvchan Qiz", "Muloyim Qizaloq", "O'yinqaroq Qiz", "Sarguzashtchi Qiz",
            "Tortinchoq Qizaloq", "G'ayratli Qiz", "Ertakchi Qizaloq", "Multfilm Qahramoni Qiz", "Alochi Qiz",
            "Do'stona Qizaloq", "Mulohazali Qiz", "Hazilkash Qizaloq", "Dovyurak Qiz", "Hayajonli Qiz",
            "Sehrli Qahramon Qiz", "Yosh Roviy Qiz", "Yosh Tadqiqotchi Qiz", "Ertak Malikasi", "O'yin Qahramoni Qiz",
            "Multfilm Hamrohi Qiz", "Sirlilik Qizaloq", "Bosiq Qizaloq", "Iliq Ertakchi Qiz", "Ifodali Qizaloq"
        )
        val namesEn = listOf(
            "Cheerful Girl", "Curious Girl", "Gentle Girl", "Playful Girl", "Adventurous Girl",
            "Shy Girl", "Energetic Girl", "Storytelling Girl", "Cartoon Girl", "Educational Girl",
            "Friendly Girl", "Thoughtful Girl", "Funny Girl", "Brave Girl", "Excited Girl",
            "Fantasy Heroine", "Young Narrator", "Science Explorer", "Fairytale Character", "Game Character",
            "Animated Sidekick", "Mysterious Girl", "Calm Girl", "Warm Story Character", "Expressive Character"
        )
        val pitchVal = 1.30f + (index % 5) * 0.05f
        val rateVal = 0.95f + (index % 4) * 0.05f
        VoiceCharacter("girl_fictional_$index", "Xayoliy Qahramon: ${names[index - 1]}", namesEn[index - 1], VoiceFamily.YOUNG_GIRL, "👧", "Xayoliy yosh qiz bola sintetizatsiyalangan ovozi.", "Fictional synthetic young girl voice profile.", AcousticProfile(pitchVal, 1.35f, rateVal, 1.0f, "Synthetic", "female"), pauseProfile = PauseProfile(150, 230, 360, 380, 320, 580, 720))
    }

    // ==========================================
    // FAMILY E — MATURE AND ELDERLY VOICES (25)
    // ==========================================
    private val familyEMatureElderlyCharacters = (1..25).map { index ->
        val names = listOf(
            "Donishmand Otaxon", "Donishmand Onaxon", "Buva Ertakchi", "Buvi Ertakchi", "Tajribali Ustoz",
            "Katta Ilmiy Xodim", "Tajribali Roviy", "Bosiq Otaxon", "Muloyim Nuroniy", "Salmoqli Otaxon",
            "An'anaviy Ertakchi", "Falsafiy Nutq Sohibi", "Tarixchi Otaxon", "Chuqur Yoshargan Erkak", "Iliq Nuroniy Onaxon",
            "Mulohazakor Nuroniy", "Katta Boshlovchi", "Samimiy Buvijon", "Hujjatli Film Nuroniysi", "Dramatik Otaxon",
            "Sabrli Ustoz Nuroniy", "Xotirjam Etuvchi Otaxon", "Donishmand Yo'lchi", "Xalq Ertakchisi", "Elegand Nuroniy Ovoz"
        )
        val namesEn = listOf(
            "Wise Elderly Male", "Wise Elderly Female", "Grandfather Storyteller", "Grandmother Storyteller", "Mature Teacher",
            "Senior Academic", "Experienced Narrator", "Calm Elder", "Gentle Elder", "Authoritative Elder",
            "Traditional Storyteller", "Philosophical Speaker", "Historical Narrator", "Deep Mature Male", "Warm Mature Female",
            "Reflective Elder", "Formal Senior Presenter", "Friendly Grandparent", "Documentary Elder", "Dramatic Elder",
            "Patient Mentor", "Reassuring Elder", "Wise Guide", "Traditional Narrator", "Elegant Mature Voice"
        )
        val pitchVal = 0.72f + (index % 4) * 0.04f
        val rateVal = 0.78f + (index % 4) * 0.03f
        val gender = if (index % 2 == 1) "male" else "female"
        VoiceCharacter("elderly_$index", names[index - 1], namesEn[index - 1], VoiceFamily.MATURE_ELDERLY, "👴", "Nuroniylar va katta yoshli tajribali nutq ovozi.", "Mature and elderly storytelling voice profile.", AcousticProfile(pitchVal, 0.85f, rateVal, 1.0f, "Deep", gender), pauseProfile = PauseProfile(240, 360, 520, 550, 480, 900, 1200))
    }

    // ==========================================
    // FAMILY F — PROFESSIONAL AND EDUCATIONAL (25)
    // ==========================================
    private val familyFProfessionalEducationalCharacters = (1..25).map { index ->
        val names = listOf(
            "Boshlang'ich Sinf O'qituvchisi", "Til O'qituvchisi", "Ingliz Tili Ustoz", "Tarix O'qituvchisi", "Tabiiy Fanlar Ustozi",
            "Universitet Ma'ruzachisi", "Professional Repetitor", "Sabrli Yo'riqchi", "Ruhlantiruvchi Trener", "Texnik Instruktor",
            "Korporativ Trener", "Intervyu Boshlovchisi", "Podkast Boshlovchisi", "Televideniye Diktori", "Biznes Boshlovchi",
            "Natijali Spiker", "Mijozlar Yordamchisi", "Virtual Yordamchi", "Professional Konsultant", "Ta'limiy Roviy",
            "Imtihon Instruktori", "Audio-Kitob O'qituvchisi", "Kurs Boshlovchisi", "Do'stona Mentor", "Akademik Tushuntiruvchi"
        )
        val namesEn = listOf(
            "Primary School Teacher", "Language Teacher", "English Teacher", "History Teacher", "Science Teacher",
            "University Lecturer", "Professional Tutor", "Patient Instructor", "Motivational Coach", "Technical Instructor",
            "Corporate Trainer", "Interview Host", "Podcast Host", "News Anchor", "Business Presenter",
            "Public Speaker", "Customer Assistant", "Virtual Assistant", "Professional Consultant", "Educational Narrator",
            "Exam Instructor", "Audiobook Educator", "Course Presenter", "Friendly Mentor", "Academic Explainer"
        )
        val pitchVal = 0.90f + (index % 5) * 0.05f
        val rateVal = 0.88f + (index % 4) * 0.04f
        val gender = if (index % 2 == 1) "female" else "male"
        VoiceCharacter("edu_prof_$index", names[index - 1], namesEn[index - 1], VoiceFamily.PROFESSIONAL_EDUCATIONAL, "👩‍🏫", "Kasbiy va ta'limiy aniq metodik nutq.", "Professional educational presenter voice profile.", AcousticProfile(pitchVal, 1.0f, rateVal, 1.0f, "Bright", gender), pauseProfile = PauseProfile(190, 290, 440, 460, 400, 720, 850))
    }

    // ==========================================
    // FAMILY G — NARRATION AND MEDIA (25)
    // ==========================================
    private val familyGNarrationMediaCharacters = (1..25).map { index ->
        val names = listOf(
            "Kinematik Bosh Roviy", "Tabiat Hujjatli Film Roviysi", "Tarixiy Hujjatli Film Roviysi", "Ilmiy Hujjatli Film Roviysi", "Audio-Kitob Roviysi",
            "Yangiliklar Muxbiri", "Radio Boshlovchi", "Podkast Roviysi", "Reklama Boshlovchisi", "Mahsulot Taqdimotchisi",
            "Sayohat Roviysi", "Sport Sharhlovchisi", "O'yin Roviysi", "Treyler Boshlovchisi", "Sirli Hikoyalar Roviysi",
            "Fantaziya Roviysi", "Sarguzasht Roviysi", "Ertak Kitob Roviysi", "Meditatsiya Yo'lchisi", "Tushuntiruvchi Roviy",
            "Hujjatli Film Boshlovchisi", "Dramatik E'lon Qiluvchi", "Jamoat E'lonlari Ovoz Sohibi", "Professional Ovoz Aktyori", "Suhbatdosh Podkaster"
        )
        val namesEn = listOf(
            "Cinematic Narrator", "Nature Documentary Narrator", "Historical Documentary Narrator", "Science Documentary Narrator", "Audiobook Narrator",
            "News Reporter", "Radio Host", "Podcast Narrator", "Commercial Advertiser", "Product Presenter",
            "Travel Narrator", "Sports Commentator", "Game Narrator", "Trailer Narrator", "Mystery Narrator",
            "Fantasy Narrator", "Adventure Narrator", "Storybook Narrator", "Meditation Guide", "Explainer Narrator",
            "Documentary Presenter", "Dramatic Announcer", "Public Announcement Voice", "Professional Voice-over", "Conversational Podcast Voice"
        )
        val pitchVal = 0.80f + (index % 6) * 0.05f
        val rateVal = 0.85f + (index % 5) * 0.05f
        val gender = if (index % 3 == 0) "female" else "male"
        VoiceCharacter("media_narrator_$index", names[index - 1], namesEn[index - 1], VoiceFamily.NARRATION_MEDIA, "🎙️", "Professional media va roviylik ovoz nutqi.", "Narration and broadcasting voice profile.", AcousticProfile(pitchVal, 0.95f, rateVal, 1.0f, "Resonant", gender), pauseProfile = PauseProfile(200, 300, 460, 480, 420, 750, 950))
    }

    // ==========================================
    // FAMILY H — CARTOON, FANTASY & GAME (25)
    // ==========================================
    private val familyHCartoonFantasyCharacters = (1..25).map { index ->
        val names = listOf(
            "Quvnoq Multfilm Qahramoni", "Do'stona Robot AI", "Aqlli Sun'iy Intelekt Robot", "Sehrgar Jodugar", "Fantaziya Yo'l ko'rsatuvchisi",
            "Multfilm Salbiy Qahramoni", "Multfilm Qahramoni", "Sehrli Mavjudot", "Koinot Sarguzashtchisi", "O'yin Komandiri",
            "O'yin Hamrohi AI", "Sarguzashtchi Qahramon", "Sirli Mavjudot", "Xayoliy Maxluq", "Do'stona O'zga Sayyoralik",
            "Fantaziya Malikasi", "Fantaziya Ritsari", "Animatsion Roviy", "Komedik Hamroh", "Superqahramon", "Detektiv Qahramon",
            "Qaroqchi Kapitan", "Sehrgar Pari", "Sehrli Mavjudot AI", "Original Xayoliy Yordamchi"
        )
        val namesEn = listOf(
            "Funny Cartoon Character", "Friendly Robot", "Intelligent Robot", "Fantasy Wizard", "Fantasy Guide",
            "Cartoon Villain", "Cartoon Hero", "Magical Character", "Space Explorer", "Game Commander",
            "Game Companion", "Adventure Character", "Mysterious Creature", "Fictional Monster", "Friendly Alien",
            "Fantasy Princess", "Fantasy Knight", "Animated Narrator", "Comic Sidekick", "Superhero Character", "Detective Character",
            "Pirate Character", "Fairy Character", "Magical Creature", "Original Fictional Assistant"
        )
        val pitchVal = 0.65f + (index % 8) * 0.12f
        val rateVal = 0.75f + (index % 6) * 0.08f
        VoiceCharacter("fantasy_game_$index", names[index - 1], namesEn[index - 1], VoiceFamily.CARTOON_FANTASY, "🧙‍♂️", "Xayoliy, fantaziya va o'yin qahramonlari sintezlangan ovozi.", "Fictional cartoon, fantasy and gaming voice profile.", AcousticProfile(pitchVal, 1.2f, rateVal, 1.0f, "Synthetic", "neutral"), pauseProfile = PauseProfile(170, 260, 400, 420, 360, 650, 800))
    }
}
