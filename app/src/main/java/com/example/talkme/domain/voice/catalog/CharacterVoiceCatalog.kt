package com.example.talkme.domain.voice.catalog

import com.example.talkme.domain.voice.model.CharacterProfile
import com.example.talkme.domain.voice.model.VoiceFamily

/**
 * Enterprise 600 Character Voice Profiles Catalog (24 Major Families x 25 Profiles).
 * Every profile has an individual acoustic identity, pitch, human speech rate, gender, and description.
 */
object CharacterVoiceCatalog {

    val allProfiles: List<CharacterProfile> by lazy {
        familyAMaleVoices +
        familyBFemaleVoices +
        familyCYoungBoyVoices +
        familyDYoungGirlVoices +
        familyEMatureElderlyVoices +
        familyFProfessionalEducationalVoices +
        familyGNarrationMediaVoices +
        familyHCartoonFantasyVoices +
        familyIBabyBoyVoices +
        familyJBabyGirlVoices +
        familyKToddlerBoyVoices +
        familyLToddlerGirlVoices +
        familyMYoungTeenMaleVoices +
        familyNYoungTeenFemaleVoices +
        familyOAdultMaleVariations +
        familyPAdultFemaleVariations +
        familyQMatureMaleVariations +
        familyRMatureFemaleVariations +
        familySFantasyMaleCharacters +
        familyTFantasyFemaleCharacters +
        familyUProfessionalMalePresenters +
        familyVProfessionalFemalePresenters +
        familyWInternationalEnglishVoices +
        familyXSpecialExpressiveCharacters
    }

    fun getProfileById(id: String): CharacterProfile {
        return allProfiles.find { it.id == id } ?: familyAMaleVoices.first()
    }

    fun getProfilesByFamily(family: VoiceFamily): List<CharacterProfile> {
        return allProfiles.filter { it.family == family }
    }

    // ==========================================
    // FAMILY A — ADULT MALE VOICES (25)
    // ==========================================
    private val familyAMaleVoices = listOf(
        CharacterProfile("male_warm_baritone", VoiceFamily.ADULT_MALE, "Iliq Bariton Erkak", "Warm Baritone", "👨", "Botiq, iliq va tushunarli erkak bariton ovozi.", 0.92f, 0.85f, "male"),
        CharacterProfile("male_deep_bass", VoiceFamily.ADULT_MALE, "Chuqur Kinematik Bas", "Deep Cinematic Bass", "🎬", "Kinematik, botiq va haybatli erkak bas ovozi.", 0.85f, 0.70f, "male"),
        CharacterProfile("male_clear_tenor", VoiceFamily.ADULT_MALE, "Aniq Tenor Erkak", "Clear Professional Tenor", "🎙️", "Aniq va professional tenor erkak ovozi.", 1.00f, 1.05f, "male"),
        CharacterProfile("male_friendly_conv", VoiceFamily.ADULT_MALE, "Samimiy Suhbatdosh Erkak", "Friendly Conversational Male", "💬", "Tabiiy kunlik muloqot va suhbatdosh ovozi.", 1.00f, 1.00f, "male"),
        CharacterProfile("male_energetic_young", VoiceFamily.ADULT_MALE, "G'ayratli Yosh Erkak", "Energetic Young Adult Male", "⚡", "Jo'shqin va jo'shqin yosh erkak ovozi.", 1.12f, 1.08f, "male"),
        CharacterProfile("male_calm_mature", VoiceFamily.ADULT_MALE, "Bosiq Yoshargan Erkak", "Calm Mature Male", "☕", "Xotirjam va bosiq katta yoshli erkak ovozi.", 0.88f, 0.82f, "male"),
        CharacterProfile("male_confident_presenter", VoiceFamily.ADULT_MALE, "Ishonchli Boshlovchi", "Confident Presenter", "🎤", "Ishonchli va jarangdor boshlovchi erkak ovozi.", 1.02f, 0.95f, "male"),
        CharacterProfile("male_soft_gentle", VoiceFamily.ADULT_MALE, "Yumshoq Erkak Ovoz", "Soft Gentle Male", "🍃", "Muloyim va sokin erkak ovozi.", 0.90f, 0.92f, "male"),
        CharacterProfile("male_authoritative", VoiceFamily.ADULT_MALE, "Salmoqli Nufuzli Erkak", "Authoritative Male", "🛡️", "Salmoqli va rasmiy erkak ovozi.", 0.86f, 0.78f, "male"),
        CharacterProfile("male_natural_everyday", VoiceFamily.ADULT_MALE, "Kundalik Tabiiy Erkak", "Natural Everyday Male", "🧑", "Kundalik standart erkak nutqi.", 1.00f, 0.98f, "male"),
        CharacterProfile("male_expressive_storyteller", VoiceFamily.ADULT_MALE, "Ifodali Hikoyachi Erkak", "Expressive Storyteller", "📖", "Hikoyalarni jonli o'quvchi erkak roviy.", 0.94f, 0.88f, "male"),
        CharacterProfile("male_doc_narrator", VoiceFamily.ADULT_MALE, "Hujjatli Film Roviysi", "Documentary Narrator", "📽️", "Hujjatli filmlar uchun bosiq roviy.", 0.86f, 0.80f, "male"),
        CharacterProfile("male_radio_presenter", VoiceFamily.ADULT_MALE, "Radio Boshlovchi Erkak", "Radio Presenter", "📻", "Radio efirlariga mos jozibali erkak ovozi.", 1.05f, 0.92f, "male"),
        CharacterProfile("male_news_presenter", VoiceFamily.ADULT_MALE, "Yangiliklar Diktor Erkak", "News Presenter", "📰", "Aniq va rasmiy yangiliklar diktori.", 1.04f, 0.96f, "male"),
        CharacterProfile("male_motivational", VoiceFamily.ADULT_MALE, "Ruhlantiruvchi Spiker", "Motivational Speaker", "🔥", "Ruhlantiruvchi va ilhomlantiruvchi spiker.", 1.10f, 1.02f, "male"),
        CharacterProfile("male_dramatic", VoiceFamily.ADULT_MALE, "Dramatik Erkak Ovoz", "Dramatic Male", "🎭", "Dramatik va hayajonli erkak ovozi.", 0.88f, 0.75f, "male"),
        CharacterProfile("male_humorous", VoiceFamily.ADULT_MALE, "Hajviy Samimiy Erkak", "Humorous Male", "😄", "Hazilkash va quvnoq erkak ovozi.", 1.15f, 1.12f, "male"),
        CharacterProfile("male_academic", VoiceFamily.ADULT_MALE, "Akademik Olim Erkak", "Serious Academic Male", "🎓", "Jiddiy akademik va ilmiy ma'ruzachi.", 0.84f, 0.76f, "male"),
        CharacterProfile("male_reassuring", VoiceFamily.ADULT_MALE, "Xotirjam Qiluvchi Erkak", "Reassuring Male", "🤝", "Dalda beruvchi va xotirjam etuvchi ovoz.", 0.90f, 0.90f, "male"),
        CharacterProfile("male_athletic", VoiceFamily.ADULT_MALE, "Sportchi G'ayratli Erkak", "Athletic Energetic Male", "🏆", "Chaqqon va g'ayratli sportchi nutqi.", 1.18f, 1.10f, "male"),
        CharacterProfile("male_mysterious", VoiceFamily.ADULT_MALE, "Sirlilik Botiq Erkak", "Mysterious Male", "🕵️‍♂️", "Sirlilik bilan yo'g'rilgan botiq ovoz.", 0.82f, 0.72f, "male"),
        CharacterProfile("male_elegant_formal", VoiceFamily.ADULT_MALE, "Elegand Rasmiy Erkak", "Elegant Formal Male", "👔", "Klassik rasmiy va shukuhli erkak ovozi.", 0.88f, 0.84f, "male"),
        CharacterProfile("male_relaxed_informal", VoiceFamily.ADULT_MALE, "Erkin Norasmiy Erkak", "Relaxed Informal Male", "🎧", "Erkin va do'stona norasmiy ovoz.", 0.98f, 0.95f, "male"),
        CharacterProfile("male_raspy", VoiceFamily.ADULT_MALE, "Xirillagan Jozibali Erkak", "Distinctive Raspy Male", "🎸", "O'ziga xos xirillagan rock-style ovoz.", 0.92f, 0.74f, "male"),
        CharacterProfile("male_smooth_resonant", VoiceFamily.ADULT_MALE, "Mayin Jarangdor Erkak", "Smooth Resonant Male", "✨", "Silliq va jarangdor erkak baritoni.", 0.90f, 0.82f, "male")
    )

    // ==========================================
    // FAMILY B — ADULT FEMALE VOICES (25)
    // ==========================================
    private val familyBFemaleVoices = listOf(
        CharacterProfile("female_warm_alto", VoiceFamily.ADULT_FEMALE, "Iliq Alt Ayol", "Warm Alto", "👩", "Mayin va iliq alt ayol ovozi.", 0.92f, 0.90f, "female"),
        CharacterProfile("female_bright_soprano", VoiceFamily.ADULT_FEMALE, "Yorqin Soprano Ayol", "Bright Soprano", "✨", "Yorqin va baland soprano ayol ovozi.", 1.05f, 1.25f, "female"),
        CharacterProfile("female_soft_gentle", VoiceFamily.ADULT_FEMALE, "Yumshoq Muloyim Ayol", "Soft Gentle Female", "🌸", "Muloyim va ma'sum ayol nutqi.", 0.88f, 1.05f, "female"),
        CharacterProfile("female_confident_prof", VoiceFamily.ADULT_FEMALE, "Ishonchli Professional Ayol", "Confident Professional Female", "💼", "Professional va ishonchli ayol boshlovchi.", 1.02f, 1.00f, "female"),
        CharacterProfile("female_friendly_conv", VoiceFamily.ADULT_FEMALE, "Samimiy Suhbatdosh Ayol", "Friendly Conversational Female", "💬", "Tabiiy kunlik ayol suhbatdoshi.", 1.00f, 1.08f, "female"),
        CharacterProfile("female_calm_mature", VoiceFamily.ADULT_FEMALE, "Bosiq Katta Ayol", "Calm Mature Female", "☕", "Xotirjam va tajribali ayol ovozi.", 0.86f, 0.92f, "female"),
        CharacterProfile("female_energetic_young", VoiceFamily.ADULT_FEMALE, "G'ayratli Yosh Ayol", "Energetic Young Adult Female", "🌟", "Jo'shqin va yorqin yosh ayol ovozi.", 1.12f, 1.18f, "female"),
        CharacterProfile("female_elegant_narrator", VoiceFamily.ADULT_FEMALE, "Elegand Roviy Ayol", "Elegant Narrator", "📖", "Nfis va nafis kitob o'quvchi ayol.", 0.90f, 0.95f, "female"),
        CharacterProfile("female_doc_narrator", VoiceFamily.ADULT_FEMALE, "Hujjatli Film Roviysi Ayol", "Documentary Female", "🎥", "Hujjatli loyihalar uchun ayol roviy.", 0.86f, 0.88f, "female"),
        CharacterProfile("female_news_presenter", VoiceFamily.ADULT_FEMALE, "Yangiliklar Diktori Ayol", "News Presenter Female", "📰", "Aniq va tushunarli yangiliklar diktori.", 1.04f, 1.02f, "female"),
        CharacterProfile("female_edu_teacher", VoiceFamily.ADULT_FEMALE, "O'qituvchi Ayol", "Educational Teacher Female", "👩‍🏫", "Sabrli va metodik o'qituvchi ayol.", 0.88f, 1.05f, "female"),
        CharacterProfile("female_expressive_storyteller", VoiceFamily.ADULT_FEMALE, "Ifodali Hikoyachi Ayol", "Expressive Storyteller", "📚", "Ertak va hikoyalarni jonli o'quvchi.", 0.94f, 1.00f, "female"),
        CharacterProfile("female_dramatic", VoiceFamily.ADULT_FEMALE, "Dramatik Ayol Ovoz", "Dramatic Female", "🎭", "Dramatik va ta'sirli ayol ovozi.", 0.88f, 0.85f, "female"),
        CharacterProfile("female_reassuring", VoiceFamily.ADULT_FEMALE, "Xotirjam Qiluvchi Ayol", "Reassuring Female", "🌷", "Ko'ngilni ko'taruvchi muloyim ovoz.", 0.90f, 0.98f, "female"),
        CharacterProfile("female_playful", VoiceFamily.ADULT_FEMALE, "Quvnoq O'yinqaroq Ayol", "Playful Female", "🎈", "Quvnoq va sho'x ayol nutqi.", 1.15f, 1.28f, "female"),
        CharacterProfile("female_academic", VoiceFamily.ADULT_FEMALE, "Akademik Оlima Ayol", "Serious Academic Female", "🔬", "Jiddiy olima va ma'ruzachi ayol.", 0.84f, 0.90f, "female"),
        CharacterProfile("female_clear_articulate", VoiceFamily.ADULT_FEMALE, "Aniq Talaffuzli Ayol", "Clear Articulate Female", "📢", "Tiniq va benuqson talaffuzli ayol.", 1.00f, 1.08f, "female"),
        CharacterProfile("female_natural_everyday", VoiceFamily.ADULT_FEMALE, "Kundalik Tabiiy Ayol", "Natural Everyday Female", "👩‍🦰", "Oddiy kundalik ayol ovozi.", 1.00f, 1.02f, "female"),
        CharacterProfile("female_deep_contralto", VoiceFamily.ADULT_FEMALE, "Chuqur Kontralto Ayol", "Deep Contralto", "🎶", "Botiq va noyob kontralto ayol ovozi.", 0.85f, 0.80f, "female"),
        CharacterProfile("female_light_airy", VoiceFamily.ADULT_FEMALE, "Yengil Shaffof Ayol", "Light Airy Female", "☁️", "Yengil va mayin havodor ovoz.", 0.95f, 1.20f, "female"),
        CharacterProfile("female_motivational", VoiceFamily.ADULT_FEMALE, "Ruhlantiruvchi Ayol Spiker", "Motivational Female", "💪", "Ilhomlantiruvchi ayol motivatori.", 1.10f, 1.12f, "female"),
        CharacterProfile("female_mysterious", VoiceFamily.ADULT_FEMALE, "Sirlilik Botiq Ayol", "Mysterious Female", "🌙", "Sirlilik va sehrga boy ayol ovozi.", 0.82f, 0.86f, "female"),
        CharacterProfile("female_formal_presenter", VoiceFamily.ADULT_FEMALE, "Rasmiy Boshlovchi Ayol", "Formal Presenter Female", "🎤", "Rasmiy marosimlar boshlovchisi.", 0.98f, 1.00f, "female"),
        CharacterProfile("female_humorous", VoiceFamily.ADULT_FEMALE, "Hazilkash Samimiy Ayol", "Humorous Female", "😆", "Quvnoq va samimiy ayol nutqi.", 1.14f, 1.22f, "female"),
        CharacterProfile("female_smooth_resonant", VoiceFamily.ADULT_FEMALE, "Mayin Jarangdor Ayol", "Smooth Resonant Female", "🌺", "Silliq va jozibali ayol soprano.", 0.90f, 0.92f, "female")
    )

    // ==========================================
    // FAMILY C — FICTIONAL YOUNG BOY VOICES (25)
    // ==========================================
    private val familyCYoungBoyVoices = (1..25).map { index ->
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
        CharacterProfile("boy_fictional_$index", VoiceFamily.YOUNG_BOY, names[index - 1], namesEn[index - 1], "👦", "Xayoliy yosh o'g'il bola sintetizatsiyalangan ovozi.", rateVal, pitchVal, "male")
    }

    // ==========================================
    // FAMILY D — FICTIONAL YOUNG GIRL VOICES (25)
    // ==========================================
    private val familyDYoungGirlVoices = (1..25).map { index ->
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
        CharacterProfile("girl_fictional_$index", VoiceFamily.YOUNG_GIRL, names[index - 1], namesEn[index - 1], "👧", "Xayoliy yosh qiz bola sintetizatsiyalangan ovozi.", rateVal, pitchVal, "female")
    }

    // ==========================================
    // FAMILY E — MATURE AND ELDERLY VOICES (25)
    // ==========================================
    private val familyEMatureElderlyVoices = (1..25).map { index ->
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
        CharacterProfile("elderly_$index", VoiceFamily.MATURE_ELDERLY, names[index - 1], namesEn[index - 1], "👴", "Nuroniylar va katta yoshli tajribali nutq ovozi.", rateVal, pitchVal, gender)
    }

    // ==========================================
    // FAMILY F — PROFESSIONAL AND EDUCATIONAL (25)
    // ==========================================
    private val familyFProfessionalEducationalVoices = (1..25).map { index ->
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
        CharacterProfile("edu_prof_$index", VoiceFamily.PROFESSIONAL_EDUCATIONAL, names[index - 1], namesEn[index - 1], "👩‍🏫", "Kasbiy va ta'limiy aniq metodik nutq.", rateVal, pitchVal, gender)
    }

    // ==========================================
    // FAMILY G — NARRATION AND MEDIA (25)
    // ==========================================
    private val familyGNarrationMediaVoices = (1..25).map { index ->
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
        CharacterProfile("media_narrator_$index", VoiceFamily.NARRATION_MEDIA, names[index - 1], namesEn[index - 1], "🎙️", "Professional media va roviylik ovoz nutqi.", rateVal, pitchVal, gender)
    }

    // ==========================================
    // FAMILY H — CARTOON, FANTASY & GAME (25)
    // ==========================================
    private val familyHCartoonFantasyVoices = (1..25).map { index ->
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
        CharacterProfile("fantasy_game_$index", VoiceFamily.CARTOON_FANTASY, names[index - 1], namesEn[index - 1], "🧙‍♂️", "Xayoliy, fantaziya va o'yin qahramonlari sintezlangan ovozi.", rateVal, pitchVal, "neutral")
    }

    // ==========================================
    // FAMILY I — BABY BOY VOICES (25)
    // ==========================================
    private val familyIBabyBoyVoices = (1..25).map { index ->
        val names = listOf(
            "Shirin Chaqaloq O'g'il", "Quvnoq Chaqaloq O'g'il", "Qiziquvchan Chaqaloq O'g'il", "Yumshoq Chaqaloq O'g'il", "O'yinqaroq Chaqaloq",
            "Uyquchi Chaqaloq", "Kulimsiragan Chaqaloq", "Hayajonli Chaqaloq O'g'il", "Tortinchoq Chaqaloq", "Bosiq Chaqaloq O'g'il",
            "Kichik Ertakchi Chaqaloq", "Multfilm Chaqaloq O'g'il", "Kichik Izlanuvchi Chaqaloq", "Sarguzashtchi Chaqaloq", "Quvnoq Chaqaloq Roviy",
            "Muloyim Chaqaloq Hamroh", "Hajviy Chaqaloq", "Hayratda Qolgan Chaqaloq", "Do'stona Chaqaloq O'g'il", "Xayoliy Chaqaloq O'g'il",
            "Kichik Fantaziya Qahramoni", "O'yin Chaqaloq Qahramoni", "Shirin Ertak Qahramoni Chaqaloq", "Ifodali Chaqaloq", "Quvnoq Kichik Hamroh"
        )
        val namesEn = listOf(
            "Sweet Baby Boy", "Happy Baby Boy", "Curious Baby Boy", "Gentle Baby Boy", "Playful Baby Boy",
            "Sleepy Baby Boy", "Laughing Baby Boy", "Excited Baby Boy", "Shy Baby Boy", "Calm Baby Boy",
            "Little Story Baby", "Cute Cartoon Baby Boy", "Baby Explorer", "Baby Adventure Character", "Cheerful Baby Narrator",
            "Gentle Baby Companion", "Funny Baby Character", "Surprised Baby Boy", "Friendly Baby Boy", "Dreamy Baby Boy",
            "Little Fantasy Hero", "Baby Game Character", "Sweet Storybook Baby", "Expressive Baby Character", "Happy Little Companion"
        )
        val pitchVal = 1.45f + (index % 5) * 0.04f
        val rateVal = 0.88f + (index % 4) * 0.04f
        CharacterProfile("baby_boy_$index", VoiceFamily.BABY_BOY, names[index - 1], namesEn[index - 1], "👶", "Xayoliy chaqaloq o'g'il bola sintetizatsiyalangan shirin ovozi.", rateVal, pitchVal, "male")
    }

    // ==========================================
    // FAMILY J — BABY GIRL VOICES (25)
    // ==========================================
    private val familyJBabyGirlVoices = (1..25).map { index ->
        val names = listOf(
            "Shirin Chaqaloq Qiz", "Quvnoq Chaqaloq Qiz", "Qiziquvchan Chaqaloq Qiz", "Yumshoq Chaqaloq Qiz", "O'yinqaroq Chaqaloq Qiz",
            "Uyquchi Chaqaloq Qiz", "Kulimsiragan Chaqaloq Qiz", "Hayajonli Chaqaloq Qiz", "Tortinchoq Chaqaloq Qiz", "Bosiq Chaqaloq Qiz",
            "Kichik Ertakchi Chaqaloq Qiz", "Multfilm Chaqaloq Qiz", "Chaqaloq Malika", "Kichik Izlanuvchi Chaqaloq Qiz", "Quvnoq Chaqaloq Roviy Qiz",
            "Muloyim Chaqaloq Hamroh Qiz", "Hajviy Chaqaloq Qiz", "Hayratda Qolgan Chaqaloq Qiz", "Do'stona Chaqaloq Qiz", "Xayoliy Chaqaloq Qiz",
            "Kichik Fantaziya Qahramoni Qiz", "O'yin Chaqaloq Qahramoni Qiz", "Shirin Ertak Chaqaloq Qiz", "Ifodali Chaqaloq Qiz", "Quvnoq Kichik Malika"
        )
        val namesEn = listOf(
            "Sweet Baby Girl", "Happy Baby Girl", "Curious Baby Girl", "Gentle Baby Girl", "Playful Baby Girl",
            "Sleepy Baby Girl", "Laughing Baby Girl", "Excited Baby Girl", "Shy Baby Girl", "Calm Baby Girl",
            "Little Story Baby Girl", "Cute Cartoon Baby Girl", "Baby Princess", "Baby Explorer", "Cheerful Baby Narrator",
            "Gentle Baby Companion", "Funny Baby Girl", "Surprised Baby Girl", "Friendly Baby Girl", "Dreamy Baby Girl",
            "Little Fantasy Heroine", "Baby Game Character", "Sweet Storybook Baby Girl", "Expressive Baby Girl", "Happy Little Princess"
        )
        val pitchVal = 1.50f + (index % 5) * 0.04f
        val rateVal = 0.88f + (index % 4) * 0.04f
        CharacterProfile("baby_girl_$index", VoiceFamily.BABY_GIRL, names[index - 1], namesEn[index - 1], "🍼", "Xayoliy chaqaloq qiz bola sintetizatsiyalangan shirin ovozi.", rateVal, pitchVal, "female")
    }

    // ==========================================
    // FAMILY K — TODDLER BOY VOICES (25)
    // ==========================================
    private val familyKToddlerBoyVoices = (1..25).map { index ->
        val names = listOf(
            "Quvnoq Kichik Bolakay", "Qiziquvchan Kichik Bolakay", "O'yinqaroq Kichik Bolakay", "G'ayratli Kichik Bolakay", "Muloyim Kichik Bolakay",
            "Tortinchoq Kichik Bolakay", "Hazilkash Kichik Bolakay", "Sarguzashtchi Kichik Bolakay", "Baxtiyor Kichik Bolakay", "Bosiq Kichik Bolakay",
            "Kichik Izlanuvchi", "Kichik Ertakchi", "Multfilm Kichik Bolakay", "Do'stona Kichik Bolakay", "Hayajonli Kichik Bolakay",
            "Mulohazali Kichik Bolakay", "Dovyurak Kichik Bolakay", "Uyquchi Kichik Bolakay", "Kichik Olim", "Fantaziya Kichik Qahramoni",
            "O'yin Kichik Qahramoni", "Animatsion Kichik Hamroh", "Shirin Kichik Qahramon", "Ifodali Kichik Bolakay", "Sho'x Kichik Bolakay"
        )
        val namesEn = listOf(
            "Cheerful Toddler Boy", "Curious Toddler Boy", "Playful Toddler Boy", "Energetic Toddler Boy", "Gentle Toddler Boy",
            "Shy Toddler Boy", "Funny Toddler Boy", "Adventurous Toddler Boy", "Happy Toddler Boy", "Calm Toddler Boy",
            "Little Explorer", "Little Storyteller", "Cartoon Toddler Boy", "Friendly Toddler Boy", "Excited Toddler Boy",
            "Thoughtful Toddler Boy", "Brave Toddler Boy", "Sleepy Toddler Boy", "Little Scientist", "Fantasy Toddler Hero",
            "Game Toddler Character", "Animated Toddler Sidekick", "Sweet Toddler Character", "Expressive Toddler Boy", "Mischievous Toddler Boy"
        )
        val pitchVal = 1.35f + (index % 5) * 0.04f
        val rateVal = 0.92f + (index % 4) * 0.04f
        CharacterProfile("toddler_boy_$index", VoiceFamily.TODDLER_BOY, names[index - 1], namesEn[index - 1], "🧸", "Kichik o'g'il bolakay nutq ovozi.", rateVal, pitchVal, "male")
    }

    // ==========================================
    // FAMILY L — TODDLER GIRL VOICES (25)
    // ==========================================
    private val familyLToddlerGirlVoices = (1..25).map { index ->
        val names = listOf(
            "Quvnoq Kichik Qizaloq", "Qiziquvchan Kichik Qizaloq", "O'yinqaroq Kichik Qizaloq", "G'ayratli Kichik Qizaloq", "Muloyim Kichik Qizaloq",
            "Tortinchoq Kichik Qizaloq", "Hazilkash Kichik Qizaloq", "Sarguzashtchi Kichik Qizaloq", "Baxtiyor Kichik Qizaloq", "Bosiq Kichik Qizaloq",
            "Kichik Izlanuvchi Qiz", "Kichik Ertakchi Qiz", "Multfilm Kichik Qizaloq", "Do'stona Kichik Qizaloq", "Hayajonli Kichik Qizaloq",
            "Mulohazali Kichik Qizaloq", "Dovyurak Kichik Qizaloq", "Uyquchi Kichik Qizaloq", "Kichik Olima Qiz", "Fantaziya Kichik Qahramoni Qiz",
            "O'yin Kichik Qahramoni Qiz", "Animatsion Kichik Hamroh Qiz", "Shirin Kichik Qahramon Qiz", "Ifodali Kichik Qizaloq", "Sho'x Kichik Qizaloq"
        )
        val namesEn = listOf(
            "Cheerful Toddler Girl", "Curious Toddler Girl", "Playful Toddler Girl", "Energetic Toddler Girl", "Gentle Toddler Girl",
            "Shy Toddler Girl", "Funny Toddler Girl", "Adventurous Toddler Girl", "Happy Toddler Girl", "Calm Toddler Girl",
            "Little Explorer Girl", "Little Storyteller Girl", "Cartoon Toddler Girl", "Friendly Toddler Girl", "Excited Toddler Girl",
            "Thoughtful Toddler Girl", "Brave Toddler Girl", "Sleepy Toddler Girl", "Little Scientist Girl", "Fantasy Toddler Heroine",
            "Game Toddler Character", "Animated Toddler Sidekick", "Sweet Toddler Character", "Expressive Toddler Girl", "Mischievous Toddler Girl"
        )
        val pitchVal = 1.40f + (index % 5) * 0.04f
        val rateVal = 0.92f + (index % 4) * 0.04f
        CharacterProfile("toddler_girl_$index", VoiceFamily.TODDLER_GIRL, names[index - 1], namesEn[index - 1], "🎀", "Kichik qizaloq nutq ovozi.", rateVal, pitchVal, "female")
    }

    // ==========================================
    // FAMILY M — YOUNG TEEN MALE VOICES (25)
    // ==========================================
    private val familyMYoungTeenMaleVoices = (1..25).map { index ->
        val names = listOf(
            "Do'stona O'smir Yigit", "Ishonchli O'smir Yigit", "Qiziquvchan O'smir Yigit", "G'ayratli O'smir Yigit", "Bosiq O'smir Yigit",
            "Tortinchoq O'smir Yigit", "O'yinqaroq O'smir Yigit", "Jiddiy O'smir Yigit", "Akademik O'smir Yigit", "Gamer O'smir Yigit",
            "Sportchi O'smir Yigit", "Ertakchi O'smir Yigit", "O'smir Izlanuvchi", "O'smir Ilm-Fan Spikeri", "O'smir Ingliz Tili O'rganuvchisi",
            "O'smir Yangiliklar Boshlovchisi", "O'smir Podkast Boshlovchisi", "Ruhlantiruvchi O'smir Spiker", "Dramatik O'smir Qahramon", "Hazilkash O'smir Qahramon",
            "Mulohazali O'smir Yigit", "Sarguzashtchi O'smir Yigit", "Do'stona O'smir Roviy", "Fantaziya O'smir Qahramoni", "Animatsion O'smir Hamroh"
        )
        val namesEn = listOf(
            "Friendly Teen Boy", "Confident Teen Boy", "Curious Teen Boy", "Energetic Teen Boy", "Calm Teen Boy",
            "Shy Teen Boy", "Playful Teen Boy", "Serious Teen Boy", "Academic Teen Boy", "Gamer Teen Boy",
            "Sporty Teen Boy", "Storytelling Teen Boy", "Teen Explorer", "Teen Science Presenter", "Teen English Learner",
            "Teen News Presenter", "Teen Podcast Host", "Motivational Teen Speaker", "Dramatic Teen Character", "Funny Teen Character",
            "Thoughtful Teen Boy", "Adventurous Teen Boy", "Friendly Teen Narrator", "Fantasy Teen Hero", "Animated Teen Sidekick"
        )
        val pitchVal = 1.10f + (index % 5) * 0.03f
        val rateVal = 1.00f + (index % 4) * 0.04f
        CharacterProfile("teen_male_$index", VoiceFamily.YOUNG_TEEN_MALE, names[index - 1], namesEn[index - 1], "🧑‍🎓", "Yosh o'smir yigit nutq ovozi.", rateVal, pitchVal, "male")
    }

    // ==========================================
    // FAMILY N — YOUNG TEEN FEMALE VOICES (25)
    // ==========================================
    private val familyNYoungTeenFemaleVoices = (1..25).map { index ->
        val names = listOf(
            "Do'stona O'smir Qiz", "Ishonchli O'smir Qiz", "Qiziquvchan O'smir Qiz", "G'ayratli O'smir Qiz", "Bosiq O'smir Qiz",
            "Tortinchoq O'smir Qiz", "O'yinqaroq O'smir Qiz", "Jiddiy O'smir Qiz", "Akademik O'smir Qiz", "Gamer O'smir Qiz",
            "Sportchi O'smir Qiz", "Ertakchi O'smir Qiz", "O'smir Izlanuvchi Qiz", "O'smir Ilm-Fan Spikeri Qiz", "O'smir Ingliz Tili O'rganuvchi Qiz",
            "O'smir Yangiliklar Boshlovchi Qiz", "O'smir Podkast Boshlovchi Qiz", "Ruhlantiruvchi O'smir Spiker Qiz", "Dramatik O'smir Qahramon Qiz", "Hazilkash O'smir Qahramon Qiz",
            "Mulohazali O'smir Qiz", "Sarguzashtchi O'smir Qiz", "Do'stona O'smir Roviy Qiz", "Fantaziya O'smir Qahramon Qiz", "Animatsion O'smir Hamroh Qiz"
        )
        val namesEn = listOf(
            "Friendly Teen Girl", "Confident Teen Girl", "Curious Teen Girl", "Energetic Teen Girl", "Calm Teen Girl",
            "Shy Teen Girl", "Playful Teen Girl", "Serious Teen Girl", "Academic Teen Girl", "Gamer Teen Girl",
            "Sporty Teen Girl", "Storytelling Teen Girl", "Teen Explorer", "Teen Science Presenter", "Teen English Learner",
            "Teen News Presenter", "Teen Podcast Host", "Motivational Teen Speaker", "Dramatic Teen Character", "Funny Teen Character",
            "Thoughtful Teen Girl", "Adventurous Teen Girl", "Friendly Teen Narrator", "Fantasy Teen Heroine", "Animated Teen Sidekick"
        )
        val pitchVal = 1.18f + (index % 5) * 0.03f
        val rateVal = 1.00f + (index % 4) * 0.04f
        CharacterProfile("teen_female_$index", VoiceFamily.YOUNG_TEEN_FEMALE, names[index - 1], namesEn[index - 1], "👩‍🎓", "Yosh o'smir qiz nutq ovozi.", rateVal, pitchVal, "female")
    }

    // ==========================================
    // FAMILY O — ADULT MALE PERSONALITY VARIATIONS (25)
    // ==========================================
    private val familyOAdultMaleVariations = (1..25).map { index ->
        val names = listOf(
            "Juda Samimiy Erkak", "Optimist Erkak", "Karismatik Erkak", "Inverttirlangan Bosiq Erkak", "Ekstravert Ochiq Erkak",
            "Analitik Erkak", "Intellektual Erkak", "Romantik Xayoliy Erkak", "Muloyim Hamroh", "Qat'iyatli Erkak",
            "Kamtarin Erkak", "Sarkastik Erkak", "Zukko Erkak", "Falsafiy Erkak", "Ilhomlantiruvchi Erkak",
            "Xushfe'l Erkak", "Sabrli Erkak", "Qiziquvchan Erkak", "Sarguzashtchi Erkak", "Kreativ Erkak",
            "Bosiq Lider Erkak", "Ishonchli Mentor Erkak", "Professional Muloqotchi Erkak", "Erkin Hamroh Erkak", "Ifodali Suhbatdosh Erkak"
        )
        val namesEn = listOf(
            "Extremely Friendly Male", "Optimistic Male", "Charismatic Male", "Introverted Male", "Extroverted Male",
            "Analytical Male", "Intellectual Male", "Romantic Fictional Male", "Gentle Companion", "Assertive Male",
            "Humble Male", "Sarcastic Male", "Witty Male", "Philosophical Male", "Inspirational Male",
            "Empathetic Male", "Patient Male", "Curious Male", "Adventurous Male", "Creative Male",
            "Calm Leader", "Confident Mentor", "Professional Communicator", "Relaxed Companion", "Expressive Conversational Male"
        )
        val pitchVal = 0.85f + (index % 6) * 0.04f
        val rateVal = 0.90f + (index % 5) * 0.05f
        CharacterProfile("male_personality_$index", VoiceFamily.ADULT_MALE_VARIATIONS, names[index - 1], namesEn[index - 1], "👨‍💼", "Katta yoshli erkak xarakter va shaxsiyat variatsiyasi.", rateVal, pitchVal, "male")
    }

    // ==========================================
    // FAMILY P — ADULT FEMALE PERSONALITY VARIATIONS (25)
    // ==========================================
    private val familyPAdultFemaleVariations = (1..25).map { index ->
        val names = listOf(
            "Juda Samimiy Ayol", "Optimist Ayol", "Karismatik Ayol", "Introvert Bosiq Ayol", "Ekstravert Ochiq Ayol",
            "Analitik Ayol", "Intellektual Ayol", "Romantik Xayoliy Ayol", "Muloyim Hamroh Ayol", "Qat'iyatli Ayol",
            "Kamtarin Ayol", "Sarkastik Ayol", "Zukko Ayol", "Falsafiy Ayol", "Ilhomlantiruvchi Ayol",
            "Xushfe'l Ayol", "Sabrli Ayol", "Qiziquvchan Ayol", "Sarguzashtchi Ayol", "Kreativ Ayol",
            "Bosiq Lider Ayol", "Ishonchli Mentor Ayol", "Professional Muloqotchi Ayol", "Erkin Hamroh Ayol", "Ifodali Suhbatdosh Ayol"
        )
        val namesEn = listOf(
            "Extremely Friendly Female", "Optimistic Female", "Charismatic Female", "Introverted Female", "Extroverted Female",
            "Analytical Female", "Intellectual Female", "Romantic Fictional Female", "Gentle Companion", "Assertive Female",
            "Humble Female", "Sarcastic Female", "Witty Female", "Philosophical Female", "Inspirational Female",
            "Empathetic Female", "Patient Female", "Curious Female", "Adventurous Female", "Creative Female",
            "Calm Leader", "Confident Mentor", "Professional Communicator", "Relaxed Companion", "Expressive Conversational Female"
        )
        val pitchVal = 1.05f + (index % 6) * 0.04f
        val rateVal = 0.90f + (index % 5) * 0.05f
        CharacterProfile("female_personality_$index", VoiceFamily.ADULT_FEMALE_VARIATIONS, names[index - 1], namesEn[index - 1], "👩‍💼", "Katta yoshli ayol xarakter va shaxsiyat variatsiyasi.", rateVal, pitchVal, "female")
    }

    // ==========================================
    // FAMILY Q — MATURE MALE PERSONALITY VARIATIONS (25)
    // ==========================================
    private val familyQMatureMaleVariations = (1..25).map { index ->
        val names = listOf(
            "Hurmatli Djentlmen Erkak", "Donishmand Faylasuf Erkak", "An'anaviy Djentlmen", "Tajribali Mentor Erkak", "Katta Yoshli Professor",
            "Elegand Katta Erkak", "Bosiq Maslahatchi", "Mulohazali Spiker", "Chuqur Intellektual Erkak", "Muloyim Otaxon",
            "Salmoqli Mentor", "Sabrli O'qituvchi Erkak", "Katta Yoshli Ertakchi", "Tarixchi Olim Erkak", "Falsafiy Roviy",
            "Iliq Nuroniy Hamroh Erkak", "Professional Katta Yoshli Erkak", "An'anaviy Roviy Erkak", "Tajribali Konsultant Erkak", "Tajribali Radio Boshlovchi",
            "Donishmand Yo'l Ko'rsatuvchi", "Xotirjam Qiluvchi Djentlmen", "Elegand Boshlovchi Erkak", "Mulohazakor Nuroniy Erkak", "Nafis Katta Yoshli Roviy"
        )
        val namesEn = listOf(
            "Distinguished Gentleman", "Wise Philosopher", "Traditional Gentleman", "Experienced Mentor", "Mature Professor",
            "Elegant Gentleman", "Calm Counselor", "Reflective Speaker", "Deep Intellectual", "Gentle Grandfather",
            "Authoritative Mentor", "Patient Teacher", "Mature Storyteller", "Historical Scholar", "Philosophical Narrator",
            "Warm Senior Companion", "Professional Senior", "Traditional Narrator", "Experienced Consultant", "Mature Radio Host",
            "Wise Guide", "Reassuring Gentleman", "Distinguished Presenter", "Thoughtful Elder", "Elegant Mature Narrator"
        )
        val pitchVal = 0.74f + (index % 4) * 0.04f
        val rateVal = 0.80f + (index % 4) * 0.03f
        CharacterProfile("mature_male_personality_$index", VoiceFamily.MATURE_MALE_VARIATIONS, names[index - 1], namesEn[index - 1], "🧔", "Katta yoshli va tajribali erkak xarakter variatsiyasi.", rateVal, pitchVal, "male")
    }

    // ==========================================
    // FAMILY R — MATURE FEMALE PERSONALITY VARIATIONS (25)
    // ==========================================
    private val familyRMatureFemaleVariations = (1..25).map { index ->
        val names = listOf(
            "Hurmatli Asilzoda Ayol", "Donishmand Faylasuf Ayol", "An'anaviy Asilzoda Ayol", "Tajribali Mentor Ayol", "Katta Yoshli Professora Ayol",
            "Elegand Katta Ayol", "Bosiq Maslahatchi Ayol", "Mulohazali Spiker Ayol", "Chuqur Intellektual Ayol", "Muloyim Buvijon",
            "Salmoqli Mentor Ayol", "Sabrli O'qituvchi Ayol", "Katta Yoshli Ertakchi Ayol", "Tarixchi Olima Ayol", "Falsafiy Roviy Ayol",
            "Iliq Nuroniy Hamroh Ayol", "Professional Katta Yoshli Ayol", "An'anaviy Roviy Ayol", "Tajribali Konsultant Ayol", "Tajribali Radio Boshlovchi Ayol",
            "Donishmand Yo'l Ko'rsatuvchi Ayol", "Xotirjam Qiluvchi Asilzoda Ayol", "Elegand Boshlovchi Ayol", "Mulohazakor Nuroniy Ayol", "Nafis Katta Yoshli Roviy Ayol"
        )
        val namesEn = listOf(
            "Distinguished Lady", "Wise Philosopher", "Traditional Lady", "Experienced Mentor", "Mature Professor",
            "Elegant Lady", "Calm Counselor", "Reflective Speaker", "Deep Intellectual", "Gentle Grandmother",
            "Authoritative Mentor", "Patient Teacher", "Mature Storyteller", "Historical Scholar", "Philosophical Narrator",
            "Warm Senior Companion", "Professional Senior", "Traditional Narrator", "Experienced Consultant", "Mature Radio Host",
            "Wise Guide", "Reassuring Lady", "Distinguished Presenter", "Thoughtful Elder", "Elegant Mature Narrator"
        )
        val pitchVal = 0.90f + (index % 4) * 0.04f
        val rateVal = 0.82f + (index % 4) * 0.03f
        CharacterProfile("mature_female_personality_$index", VoiceFamily.MATURE_FEMALE_VARIATIONS, names[index - 1], namesEn[index - 1], "👵", "Katta yoshli va tajribali ayol xarakter variatsiyasi.", rateVal, pitchVal, "female")
    }

    // ==========================================
    // FAMILY S — FANTASY MALE CHARACTERS (25)
    // ==========================================
    private val familySFantasyMaleCharacters = (1..25).map { index ->
        val names = listOf(
            "Qadimiy Sehrgar Jodugar", "Qorong'u Sehrgar", "Jasur Qirol", "Ritsari Dovyurak", "Donishmand Mag",
            "Fantaziya Jangchisi", "Qadimiy Posbon", "Sehrli Payg'ambar", "Koinot Komandiri", "Galaktika Izlanuvchisi",
            "Ajdaho Posboni", "Fantaziya Salbiy Qahramoni", "Jasur Shahzoda", "Sirli Muxbir", "Sehrgar Professor",
            "Afsonaviy Qahramon", "O'rta Asr Savdogari", "Qirollik Maslahatchisi", "Qaroqchilar Kapitani", "Qadimiy Ertakchi",
            "Fantaziya Detektivi", "Afsonaviy Mavjudot", "Sehrli Yo'l Ko'rsatuvchi", "Sehrli Ixtirochi", "Epik Roviy Erkak"
        )
        val namesEn = listOf(
            "Ancient Wizard", "Dark Sorcerer", "Noble King", "Brave Knight", "Wise Mage",
            "Fantasy Warrior", "Ancient Guardian", "Mystical Prophet", "Space Commander", "Galactic Explorer",
            "Dragon Guardian", "Fantasy Villain", "Heroic Prince", "Mysterious Stranger", "Magical Professor",
            "Legendary Hero", "Medieval Merchant", "Royal Advisor", "Pirate Captain", "Ancient Storyteller",
            "Fantasy Detective", "Mythical Creature", "Supernatural Guide", "Magical Inventor", "Epic Narrator"
        )
        val pitchVal = 0.65f + (index % 6) * 0.08f
        val rateVal = 0.78f + (index % 5) * 0.06f
        CharacterProfile("fantasy_male_$index", VoiceFamily.FANTASY_MALE, names[index - 1], namesEn[index - 1], "⚔️", "Fantaziya va ertak o'g'il/erkak qahramoni.", rateVal, pitchVal, "male")
    }

    // ==========================================
    // FAMILY T — FANTASY FEMALE CHARACTERS (25)
    // ==========================================
    private val familyTFantasyFemaleCharacters = (1..25).map { index ->
        val names = listOf(
            "Qadimiy Sehrgar Pari", "Sehrli Qirolicha", "Asilzoda Malika", "Jasur Ayol Jangchi", "Donishmand Mag Ayol",
            "Fantaziya Posboni Ayol", "Sehrli Payg'ambar Ayol", "Koinot Komandiri Ayol", "Galaktika Izlanuvchisi Ayol", "Ajdaho Posboni Ayol",
            "Fantaziya Salbiy Qahramoni Ayol", "Jasur Malika", "Sirli Muxbir Ayol", "Sehrgar Professora", "Afsonaviy Qahramon Ayol",
            "O'rta Asr Savdogar Ayoli", "Qirollik Maslahatchisi Ayol", "Qaroqchilar Kapitani Ayol", "Qadimiy Ertakchi Ayol", "Fantaziya Detektivi Ayol",
            "Afsonaviy Mavjudot Ayol", "Sehrli Yo'l Ko'rsatuvchi Ayol", "Sehrli Ixtirochi Ayol", "Epik Roviy Ayol", "Sehrli Pari Qirolichasi"
        )
        val namesEn = listOf(
            "Ancient Sorceress", "Magical Queen", "Noble Princess", "Brave Warrior", "Wise Mage",
            "Fantasy Guardian", "Mystical Prophetess", "Space Commander", "Galactic Explorer", "Dragon Guardian",
            "Fantasy Villainess", "Heroic Princess", "Mysterious Stranger", "Magical Professor", "Legendary Heroine",
            "Medieval Merchant", "Royal Advisor", "Pirate Captain", "Ancient Storyteller", "Fantasy Detective",
            "Mythical Creature", "Supernatural Guide", "Magical Inventor", "Epic Narrator", "Enchanted Fairy Queen"
        )
        val pitchVal = 1.15f + (index % 6) * 0.08f
        val rateVal = 0.85f + (index % 5) * 0.05f
        CharacterProfile("fantasy_female_$index", VoiceFamily.FANTASY_FEMALE, names[index - 1], namesEn[index - 1], "🧚‍♀️", "Fantaziya va sehrli ayol qahramoni.", rateVal, pitchVal, "female")
    }

    // ==========================================
    // FAMILY U — PROFESSIONAL MALE PRESENTERS (25)
    // ==========================================
    private val familyUProfessionalMalePresenters = (1..25).map { index ->
        val names = listOf(
            "Professional Ingliz Tili Instruktori", "IELTS Speaking Treneri (Erkak)", "TOEFL Instruktori (Erkak)", "Biznes Ingliz Tili O'qituvchisi", "Akademik Ma'ruzachi Erkak",
            "Universitet Professori", "Korporativ Rahbar Erkak", "Professional Intervyuer Erkak", "Konferensiya Spikeri Erkak", "Moliya Taqdimotchisi Erkak",
            "Texnologiya Spikeri Erkak", "Ilm-Fan Ta'limchisi Erkak", "Tarix Ta'limchisi Erkak", "Til Treneri Erkak", "Ta'limiy Podkast Boshlovchisi Erkak",
            "Professional Yangiliklar Diktori", "Hujjatli Film Boshlovchisi Erkak", "Nutq Madaniyati Treneri Erkak", "Professional Konsultant Erkak", "Mijozlarni Qo'llab-Quvvatlash Mutaxassisi",
            "Biznes Mentor Erkak", "Online Kurs Instruktori Erkak", "Texnik Tushuntiruvchi Erkak", "Ruhlantiruvchi Trener Erkak", "Professional Audio-Kitob Ta'limchisi"
        )
        val namesEn = listOf(
            "Professional English Instructor", "IELTS Speaking Coach", "TOEFL Instructor", "Business English Teacher", "Academic Lecturer",
            "University Professor", "Corporate Executive", "Professional Interviewer", "Conference Speaker", "Financial Presenter",
            "Technology Presenter", "Science Educator", "History Educator", "Language Coach", "Educational Podcast Host",
            "Professional News Anchor", "Documentary Host", "Public Speaking Coach", "Professional Consultant", "Customer Support Specialist",
            "Business Mentor", "Course Instructor", "Technical Explainer", "Motivational Trainer", "Professional Audiobook Educator"
        )
        val pitchVal = 0.90f + (index % 4) * 0.04f
        val rateVal = 0.92f + (index % 4) * 0.03f
        CharacterProfile("prof_male_presenter_$index", VoiceFamily.PROFESSIONAL_MALE_PRESENTERS, names[index - 1], namesEn[index - 1], "👔", "Professional ta'limiy va konferensiya spikeri erkak.", rateVal, pitchVal, "male")
    }

    // ==========================================
    // FAMILY V — PROFESSIONAL FEMALE PRESENTERS (25)
    // ==========================================
    private val familyVProfessionalFemalePresenters = (1..25).map { index ->
        val names = listOf(
            "Professional Ingliz Tili Instruktori Ayol", "IELTS Speaking Treneri (Ayol)", "TOEFL Instruktori (Ayol)", "Biznes Ingliz Tili O'qituvchisi Ayol", "Akademik Ma'ruzachi Ayol",
            "Universitet Professora Ayol", "Korporativ Rahbar Ayol", "Professional Intervyuer Ayol", "Konferensiya Spikeri Ayol", "Moliya Taqdimotchisi Ayol",
            "Texnologiya Spikeri Ayol", "Ilm-Fan Ta'limchisi Ayol", "Tarix Ta'limchisi Ayol", "Til Treneri Ayol", "Ta'limiy Podkast Boshlovchisi Ayol",
            "Professional Yangiliklar Diktori Ayol", "Hujjatli Film Boshlovchisi Ayol", "Nutq Madaniyati Treneri Ayol", "Professional Konsultant Ayol", "Mijozlarni Qo'llab-Quvvatlash Mutaxassisi Ayol",
            "Biznes Mentor Ayol", "Online Kurs Instruktori Ayol", "Texnik Tushuntiruvchi Ayol", "Ruhlantiruvchi Trener Ayol", "Professional Audio-Kitob Ta'limchisi Ayol"
        )
        val namesEn = listOf(
            "Professional English Instructor", "IELTS Speaking Coach", "TOEFL Instructor", "Business English Teacher", "Academic Lecturer",
            "University Professor", "Corporate Executive", "Professional Interviewer", "Conference Speaker", "Financial Presenter",
            "Technology Presenter", "Science Educator", "History Educator", "Language Coach", "Educational Podcast Host",
            "Professional News Anchor", "Documentary Host", "Public Speaking Coach", "Professional Consultant", "Customer Support Specialist",
            "Business Mentor", "Course Instructor", "Technical Explainer", "Motivational Trainer", "Professional Audiobook Educator"
        )
        val pitchVal = 1.05f + (index % 4) * 0.04f
        val rateVal = 0.92f + (index % 4) * 0.03f
        CharacterProfile("prof_female_presenter_$index", VoiceFamily.PROFESSIONAL_FEMALE_PRESENTERS, names[index - 1], namesEn[index - 1], "👩‍💼", "Professional ta'limiy va konferensiya spikeri ayol.", rateVal, pitchVal, "female")
    }

    // ==========================================
    // FAMILY W — INTERNATIONAL ENGLISH VOICE STYLES (25)
    // ==========================================
    private val familyWInternationalEnglishVoices = (1..25).map { index ->
        val names = listOf(
            "Amerika Ingliz Tili (Erkak)", "Amerika Ingliz Tili (Ayol)", "Britaniya Ingliz Tili (Erkak)", "Britaniya Ingliz Tili (Ayol)", "Avstraliya Ingliz Tili (Erkak)",
            "Avstraliya Ingliz Tili (Ayol)", "Kanada Ingliz Tili (Erkak)", "Kanada Ingliz Tili (Ayol)", "Irlandiya Ingliz Tili (Erkak)", "Irlandiya Ingliz Tili (Ayol)",
            "Shotlandiya Ingliz Tili (Erkak)", "Shotlandiya Ingliz Tili (Ayol)", "Yangi Zelandiya Ingliz Tili (Erkak)", "Yangi Zelandiya Ingliz Tili (Ayol)", "Janubiy Afrika Ingliz Tili (Erkak)",
            "Janubiy Afrika Ingliz Tili (Ayol)", "Hindiston Ingliz Tili (Erkak)", "Hindiston Ingliz Tili (Ayol)", "Xalqaro Neytral Ingliz Tili (Erkak)", "Xalqaro Neytral Ingliz Tili (Ayol)",
            "Aniq Global Ingliz Tili (Erkak)", "Aniq Global Ingliz Tili (Ayol)", "Neytral Ta'limiy Ingliz Tili (Erkak)", "Neytral Ta me'limiy Ingliz Tili (Ayol)", "Sekin Ta'limiy Ingliz Tili Roviysi"
        )
        val namesEn = listOf(
            "General American Male", "General American Female", "British English Male", "British English Female", "Australian English Male",
            "Australian English Female", "Canadian English Male", "Canadian English Female", "Irish English Male", "Irish English Female",
            "Scottish English Male", "Scottish English Female", "New Zealand English Male", "New Zealand English Female", "South African English Male",
            "South African English Female", "Indian English Male", "Indian English Female", "International English Male", "International English Female",
            "Clear Global English Male", "Clear Global English Female", "Neutral Educational English Male", "Neutral Educational English Female", "Slow Learning English Narrator"
        )
        val pitchVal = 0.95f + (index % 5) * 0.05f
        val rateVal = 0.88f + (index % 4) * 0.04f
        val gender = if (index % 2 == 1) "male" else "female"
        CharacterProfile("intl_english_$index", VoiceFamily.INTERNATIONAL_ENGLISH, names[index - 1], namesEn[index - 1], "🌐", "Xalqaro aktsent va talaffuz uslublari.", rateVal, pitchVal, gender)
    }

    // ==========================================
    // FAMILY X — SPECIAL EXPRESSIVE CHARACTERS (25)
    // ==========================================
    private val familyXSpecialExpressiveCharacters = (1..25).map { index ->
        val names = listOf(
            "Pichirlaydigan Xayoliy Roviy", "Xursand Shodon Qahramon", "Yig'layotgan Xayoliy Qahramon", "Hayajonli Boshlovchi", "Emotsional Ertakchi",
            "Qiziquvchan Detektiv", "Sirlilik Roviysi", "Yumshoq Uyqu Yo'riqchisi", "Dramatik Hikoya Qahramoni", "G'ayratli Sport Spikeri",
            "Quvnoq Multfilm Boshlovchisi", "Do'stona AI Yordamchi", "Aqlli Sun'iy Intelekt", "Tinch Meditatsiya Yo'lchisi", "Dramatik Fantaziya Roviysi",
            "Komedik Samimiy Qahramon", "Jiddiy Detektiv", "Sarguzashtchi Izlanuvchi", "Emotsional Hamroh", "Professional Motivator",
            "Hayajonli O'yin Boshlovchisi", "Yumshoq Hikoya Roviysi", "Quvvatli E'lon Qiluvchi", "Ifodali Audio-Kitob Qahramoni", "Tabiiy Suhbatdosh Hamroh"
        )
        val namesEn = listOf(
            "Whispering Fictional Narrator", "Laughing Character", "Crying Fictional Character", "Excited Announcer", "Emotional Storyteller",
            "Curious Investigator", "Mysterious Narrator", "Gentle Sleep Guide", "Dramatic Story Character", "Energetic Sports Character",
            "Cheerful Cartoon Host", "Friendly AI Assistant", "Intelligent AI Assistant", "Calm Meditation Guide", "Dramatic Fantasy Narrator",
            "Funny Comic Character", "Serious Detective", "Adventurous Explorer", "Emotional Companion", "Professional Motivator",
            "Excited Game Host", "Soft Story Narrator", "Powerful Announcer", "Expressive Audiobook Character", "Natural Conversational Companion"
        )
        val pitchVal = 0.85f + (index % 7) * 0.08f
        val rateVal = 0.82f + (index % 5) * 0.06f
        CharacterProfile("expressive_special_$index", VoiceFamily.SPECIAL_EXPRESSIVE, names[index - 1], namesEn[index - 1], "✨", "Maxsus emotsional va ekspressiv nutq ovozi.", rateVal, pitchVal, "neutral")
    }
}
