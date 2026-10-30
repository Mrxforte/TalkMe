package com.talkme.domain.localization

/**
 * Severity level of a validation finding discovered by [LanguagePackValidator].
 */
enum class ValidationSeverity {
    ERROR,
    WARNING
}

/**
 * Single validation issue reported during language pack verification.
 */
data class ValidationIssue(
    val severity: ValidationSeverity,
    val code: String,
    val languageCode: String,
    val targetKeyOrId: String,
    val message: String
)

/**
 * Aggregated validation report returned by [LanguagePackValidator].
 */
data class ValidationReport(
    val isValid: Boolean,
    val checkedLanguages: List<String>,
    val totalItemsChecked: Int,
    val issues: List<ValidationIssue>
)

/**
 * Translation Quality and Validation Engine (Section 12).
 * Detects missing keys, empty values, broken placeholders, missing lesson sections,
 * missing exercise instructions, and invalid TTS audio locales.
 */
object LanguagePackValidator {

    private val bcp47Regex = Regex("^[a-z]{2,3}(-[A-Z]{2})?$")
    private val placeholderRegex = Regex("\\{[a-zA-Z0-9_]+\\}")

    /**
     * Validates a collection of [LanguagePack] instances against required keys,
     * vocabulary IDs, step IDs, and exercise IDs.
     */
    fun validatePacks(
        packs: List<LanguagePack>,
        requiredUiKeys: Set<String>,
        requiredLessonId: String,
        requiredVocabIds: Set<String>,
        requiredStepIds: Set<String>,
        requiredExerciseIds: Set<String>,
        ttsItems: List<TtsPronunciationMeta>
    ): ValidationReport {
        val issues = mutableListOf<ValidationIssue>()
        val seenCodes = mutableSetOf<String>()
        var totalChecked = 0

        val referencePack = packs.firstOrNull { it.language == InterfaceLanguage.UZBEK } ?: packs.firstOrNull()

        // 1. Validate TTS Audio Metadata
        ttsItems.forEach { tts ->
            totalChecked++
            if (tts.learningTextEn.isBlank()) {
                issues.add(
                    ValidationIssue(
                        severity = ValidationSeverity.ERROR,
                        code = "MISSING_TTS_METADATA",
                        languageCode = "en",
                        targetKeyOrId = tts.audioId,
                        message = "Empty English learning text for TTS item ${tts.audioId}"
                    )
                )
            }
            if (!tts.defaultVariant.localeTag.startsWith("en-")) {
                issues.add(
                    ValidationIssue(
                        severity = ValidationSeverity.ERROR,
                        code = "UNSUPPORTED_AUDIO_LOCALE",
                        languageCode = "en",
                        targetKeyOrId = tts.audioId,
                        message = "Unsupported non-English TTS locale ${tts.defaultVariant.localeTag}"
                    )
                )
            }
        }

        // 2. Validate each Language Pack
        packs.forEach { pack ->
            val langCode = pack.language.code
            if (!seenCodes.add(langCode)) {
                issues.add(
                    ValidationIssue(
                        severity = ValidationSeverity.ERROR,
                        code = "DUPLICATE_ID",
                        languageCode = langCode,
                        targetKeyOrId = langCode,
                        message = "Duplicate language pack code: $langCode"
                    )
                )
            }

            if (!bcp47Regex.matches(pack.language.bcp47Locale)) {
                issues.add(
                    ValidationIssue(
                        severity = ValidationSeverity.ERROR,
                        code = "INVALID_LANGUAGE_CODE",
                        languageCode = langCode,
                        targetKeyOrId = pack.language.bcp47Locale,
                        message = "Invalid BCP-47 locale tag: ${pack.language.bcp47Locale}"
                    )
                )
            }

            // Check UI Keys & Placeholders
            requiredUiKeys.forEach { key ->
                totalChecked++
                val value = pack.uiTranslations[key]
                if (value == null) {
                    issues.add(
                        ValidationIssue(
                            severity = ValidationSeverity.ERROR,
                            code = "MISSING_UI_KEY",
                            languageCode = langCode,
                            targetKeyOrId = key,
                            message = "Missing UI translation key '$key' in '$langCode'"
                        )
                    )
                } else if (value.isBlank()) {
                    issues.add(
                        ValidationIssue(
                            severity = ValidationSeverity.ERROR,
                            code = "EMPTY_TRANSLATION_VALUE",
                            languageCode = langCode,
                            targetKeyOrId = key,
                            message = "Blank UI translation value for '$key' in '$langCode'"
                        )
                    )
                } else if (referencePack != null) {
                    val refVal = referencePack.uiTranslations[key].orEmpty()
                    val expectedPlaceholders = placeholderRegex.findAll(refVal).map { it.value }.toSet()
                    val actualPlaceholders = placeholderRegex.findAll(value).map { it.value }.toSet()
                    if (expectedPlaceholders != actualPlaceholders) {
                        issues.add(
                            ValidationIssue(
                                severity = ValidationSeverity.ERROR,
                                code = "BROKEN_PLACEHOLDER",
                                languageCode = langCode,
                                targetKeyOrId = key,
                                message = "Broken placeholders in '$key' for '$langCode'"
                            )
                        )
                    }
                }
            }

            // Check Lesson Content
            val lesson = pack.localizedLessons[requiredLessonId]
            if (lesson == null) {
                issues.add(
                    ValidationIssue(
                        severity = ValidationSeverity.ERROR,
                        code = "MISSING_LESSON_SECTION",
                        languageCode = langCode,
                        targetKeyOrId = requiredLessonId,
                        message = "Missing lesson '$requiredLessonId' in '$langCode'"
                    )
                )
            } else {
                requiredVocabIds.forEach { vocabId ->
                    totalChecked++
                    if (lesson.vocabularyMeanings[vocabId].isNullOrBlank()) {
                        issues.add(
                            ValidationIssue(
                                severity = ValidationSeverity.ERROR,
                                code = "MISMATCHED_VOCAB_REFERENCE",
                                languageCode = langCode,
                                targetKeyOrId = vocabId,
                                message = "Missing vocabulary translation for '$vocabId' in '$langCode'"
                            )
                        )
                    }
                }

                requiredStepIds.forEach { stepId ->
                    totalChecked++
                    if (lesson.stepExplanations[stepId].isNullOrBlank()) {
                        issues.add(
                            ValidationIssue(
                                severity = ValidationSeverity.ERROR,
                                code = "MISSING_LESSON_SECTION",
                                languageCode = langCode,
                                targetKeyOrId = stepId,
                                message = "Missing step explanation '$stepId' in '$langCode'"
                            )
                        )
                    }
                }

                requiredExerciseIds.forEach { exId ->
                    totalChecked++
                    if (lesson.exercisePrompts[exId].isNullOrBlank() ||
                        lesson.positiveFeedback[exId].isNullOrBlank()
                    ) {
                        issues.add(
                            ValidationIssue(
                                severity = ValidationSeverity.ERROR,
                                code = "MISSING_EXERCISE_INSTRUCTION",
                                languageCode = langCode,
                                targetKeyOrId = exId,
                                message = "Missing exercise prompt or feedback for '$exId' in '$langCode'"
                            )
                        )
                    }
                }
            }
        }

        val hasErrors = issues.any { it.severity == ValidationSeverity.ERROR }
        return ValidationReport(
            isValid = !hasErrors,
            checkedLanguages = packs.map { it.language.code },
            totalItemsChecked = totalChecked,
            issues = issues
        )
    }
}
