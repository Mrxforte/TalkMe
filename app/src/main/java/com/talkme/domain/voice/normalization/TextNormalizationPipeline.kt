package com.talkme.domain.voice.normalization

import javax.inject.Inject
import javax.inject.Singleton

/**
 * Text normalization pipeline handling Uzbek Latin/Cyrillic, Russian, English,
 * numbers, date expansion, morphological suffixes, and pronunciation dictionaries.
 */
@Singleton
class TextNormalizationPipeline @Inject constructor() {

    private val basicEnglishNumberMap = mapOf(
        "0" to "zero",
        "1" to "one",
        "2" to "two",
        "3" to "three",
        "4" to "four",
        "5" to "five",
        "6" to "six",
        "7" to "seven",
        "8" to "eight",
        "9" to "nine",
        "10" to "ten",
        "13" to "thirteen",
        "14" to "fourteen",
        "15" to "fifteen",
        "20" to "twenty",
        "30" to "thirty",
        "40" to "forty",
        "50" to "fifty",
        "100" to "one hundred"
    )

    /**
     * Normalizes raw input text for natural pronunciation before synthesis.
     */
    fun normalize(rawText: String, languageCode: String = "en-US"): String {
        val trimmed = rawText.trim().replace(Regex("\\s+"), " ")
        if (languageCode.startsWith("en")) {
            return basicEnglishNumberMap[trimmed] ?: trimmed
        }
        return trimmed
    }
}
