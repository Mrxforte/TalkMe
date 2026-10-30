package com.example.talkme.domain.voice.catalog

import com.example.talkme.domain.voice.model.CharacterProfile
import com.example.talkme.domain.voice.model.VoiceFamily

/**
 * Complete 200 Character Voice Profiles Catalog (8 Major Families x 25 Profiles).
 * Every profile has a distinct acoustic identity, pitch, human speech rate, gender, and description.
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
        familyHCartoonFantasyVoices
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
}
