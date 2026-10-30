package com.talkme.domain.localization

/**
 * Supported interface and explanation languages in TalkMe.
 * Adding a new language only requires registering its language pack and localized resources.
 */
enum class InterfaceLanguage(
    val code: String,
    val nameEn: String,
    val nativeName: String,
    val bcp47Locale: String
) {
    UZBEK("uz", "Uzbek", "O‘zbekcha", "uz-UZ"),
    RUSSIAN("ru", "Russian", "Русский", "ru-RU"),
    ENGLISH("en", "English", "English", "en-US"),
    KOREAN("ko", "Korean", "한국어", "ko-KR"),
    KAZAKH("kk", "Kazakh", "Қазақша", "kk-KZ"),
    TURKISH("tr", "Turkish", "Türkçe", "tr-TR");

    companion object {
        /**
         * Resolves an [InterfaceLanguage] from a raw code, defaulting safely to [UZBEK].
         */
        fun fromCode(code: String): InterfaceLanguage {
            return entries.firstOrNull { it.code.equals(code, ignoreCase = true) } ?: UZBEK
        }
    }
}

/**
 * Target learning language separated strictly from [InterfaceLanguage].
 */
enum class LearningLanguage(
    val code: String,
    val displayName: String
) {
    ENGLISH("en", "English")
}

/**
 * Supported English pronunciation variants for TTS audio synthesis.
 */
enum class EnglishPronunciationVariant(
    val localeTag: String,
    val label: String
) {
    US("en-US", "American English"),
    UK("en-GB", "British English")
}

/**
 * Typography and script metadata for a registered language pack.
 */
data class LanguageTypographySpec(
    val lineHeightScale: Float = 1.0f,
    val isRtl: Boolean = false,
    val supportsCjkLineBreak: Boolean = false
)

/**
 * Audio pronunciation metadata attached to target learning-language items.
 * Ensures TTS always speaks the learning language (English) and never reads
 * interface translations with an English voice.
 */
data class TtsPronunciationMeta(
    val audioId: String,
    val learningTextEn: String,
    val phoneticIpa: String,
    val defaultVariant: EnglishPronunciationVariant = EnglishPronunciationVariant.US,
    val normalSpeedRate: Float = 0.94f,
    val slowSpeedRate: Float = 0.68f
)

/**
 * Modular Language Pack containing locale metadata, lesson explanations,
 * vocabulary translations, exercise instructions, and feedback messages.
 */
data class LanguagePack(
    val language: InterfaceLanguage,
    val typographySpec: LanguageTypographySpec = LanguageTypographySpec(),
    val completenessPercentage: Int = 100,
    val uiTranslations: Map<String, String>,
    val localizedLessons: Map<String, LocalizedLessonContent>
)

/**
 * Localized content for a single lesson identified by its stable [lessonId].
 */
data class LocalizedLessonContent(
    val lessonId: String,
    val languageCode: String,
    val localizedTitle: String,
    val localizedSubtitle: String,
    val localizedDescription: String,
    val difficultyLabel: String,
    val learningObjectives: List<String>,
    val vocabularyMeanings: Map<String, String>,
    val stepExplanations: Map<String, String>,
    val exercisePrompts: Map<String, String>,
    val positiveFeedback: Map<String, String>,
    val retryFeedback: Map<String, String>,
    val completionConfidenceQuote: String
)
