package com.example.talkme.domain.voice.normalization

import javax.inject.Inject
import javax.inject.Singleton

/**
 * Pronunciation rule entity for user-defined or dictionary phonetic mapping.
 */
data class PronunciationRule(
    val originalWord: String,
    val replacement: String,
    val language: String = "uz",
    val phoneticRepresentation: String = ""
)

/**
 * Text Normalization Pipeline for Uzbek (Latin/Cyrillic), Russian, and English text processing.
 */
@Singleton
class TextNormalizationPipeline @Inject constructor() {

    private val userDictionary = mutableMapOf(
        "projectni" to "proyektni",
        "meetingga" to "mitingga",
        "update" to "apdeyt",
        "download" to "daunlod",
        "serverdan" to "serverdan",
        "applicationni" to "applikatsiyani"
    )

    /**
     * Normalizes text input into model-ready phonetic speech text.
     *
     * @param rawText Original user input text.
     * @param targetLanguage Target language code (en, uz, ru).
     * @return Normalized string ready for synthesis.
     */
    fun normalize(rawText: String, targetLanguage: String = "uz"): String {
        if (rawText.isBlank()) return ""

        var text = rawText.trim()

        // 1. Convert Uzbek Cyrillic to Latin if needed
        if (targetLanguage == "uz" && isCyrillic(text)) {
            text = convertCyrillicToLatin(text)
        }

        // 2. Expand numbers to spoken words
        text = expandNumbers(text, targetLanguage)

        // 3. User & Morphological Pronunciation Dictionary Replacement
        userDictionary.forEach { (word, replacement) ->
            text = text.replace(Regex("\\b$word\\b", RegexOption.IGNORE_CASE), replacement)
        }

        // 4. Clean extra punctuation whitespace
        text = text.replace(Regex("\\s+"), " ")

        return text
    }

    private fun isCyrillic(text: String): Boolean {
        return text.any { it in '\u0400'..'\u04FF' }
    }

    private fun convertCyrillicToLatin(text: String): String {
        val map = mapOf(
            'а' to "a", 'б' to "b", 'в' to "v", 'г' to "g", 'д' to "d",
            'е' to "e", 'ё' to "yo", 'ж' to "jh", 'з' to "z", 'и' to "i",
            'й' to "y", 'к' to "k", 'л' to "l", 'м' to "m", 'н' to "n",
            'о' to "o", 'п' to "p", 'р' to "r", 'с' to "s", 'т' to "t",
            'у' to "u", 'ф' to "f", 'х' to "x", 'ц' to "ts", 'ч' to "ch",
            'ш' to "sh", 'ъ' to "'", 'ь' to "", 'э' to "e", 'ю' to "yu", 'я' to "ya",
            'Ў' to "O'", 'ў' to "o'", 'Қ' to "Q", 'қ' to "q", 'Ғ' to "G'", 'ғ' to "g'", 'Ҳ' to "H", 'ҳ' to "h"
        )
        val sb = StringBuilder()
        for (char in text) {
            sb.append(map[char] ?: char.toString())
        }
        return sb.toString()
    }

    private fun expandNumbers(text: String, language: String): String {
        return text.replace(Regex("\\b\\d+\\b")) { match ->
            val num = match.value.toIntOrNull() ?: return@replace match.value
            when (language) {
                "uz" -> numToUzbekString(num)
                "ru" -> numToRussianString(num)
                else -> numToEnglishString(num)
            }
        }
    }

    private fun numToUzbekString(n: Int): String {
        if (n == 0) return "nol"
        val units = arrayOf("", "bir", "ikki", "uch", "to'rt", "besh", "oltida", "yetti", "sakkiz", "to'qqiz")
        val tens = arrayOf("", "o'n", "yigirma", "o'ttiz", "qirq", "ellik", "oltmiš", "yetmish", "sakson", "to'qson")
        return when {
            n < 10 -> units[n]
            n < 100 -> "${tens[n / 10]} ${units[n % 10]}".trim()
            n < 1000 -> "${units[n / 100]} yuz ${numToUzbekString(n % 100)}".trim()
            else -> n.toString()
        }
    }

    private fun numToRussianString(n: Int): String {
        if (n == 0) return "ноль"
        val units = arrayOf("", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять")
        return when {
            n < 10 -> units[n]
            else -> n.toString()
        }
    }

    private fun numToEnglishString(n: Int): String {
        if (n == 0) return "zero"
        val units = arrayOf("", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine")
        val tens = arrayOf("", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety")
        return when {
            n < 10 -> units[n]
            n < 100 -> "${tens[n / 10]} ${units[n % 10]}".trim()
            else -> n.toString()
        }
    }
}
