package com.example.talkme.data.processor

import com.example.talkme.domain.model.VoiceCharacter
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Classified English Sentence Types for Prosody Contours.
 */
enum class SentenceType {
    STATEMENT,
    YES_NO_QUESTION,
    WH_QUESTION,
    ALTERNATIVE_QUESTION,
    EXCLAMATION,
    INTRODUCTORY_PHRASE,
    LIST_ENUMERATION
}

/**
 * Prosody Segment with linguistic classification, pitch contour, speech rate, and pause planning metadata.
 */
data class ProsodySegment(
    val segmentIndex: Int,
    val text: String,
    val sentenceType: SentenceType = SentenceType.STATEMENT,
    val plannedPauseMs: Long = 380L,
    val pitchMultiplier: Float = 1.0f,
    val rateMultiplier: Float = 1.0f,
    val detectedEmotion: String = "Neutral",
    val isIntroductory: Boolean = false
)

/**
 * Advanced Natural English Prosody, Intonation & Pacing Analyzer Engine.
 * Classifies English statements, Yes/No questions, WH-questions, exclamations,
 * introductory phrases, and lists to generate human-like prosody contours.
 */
@Singleton
class TextProsodyAnalyzer @Inject constructor() {

    private val introductoryPhrases = setOf(
        "first of all", "before we begin", "most importantly", "however", "furthermore",
        "in conclusion", "for example", "in my opinion", "to be honest", "as a matter of fact",
        "on the other hand", "firstly", "secondly", "finally", "look", "listen"
    )

    private val whQuestionWords = setOf(
        "what", "where", "why", "when", "who", "whom", "whose", "which", "how"
    )

    private val yesNoQuestionStarters = setOf(
        "are", "is", "am", "do", "does", "did", "can", "could", "would", "will",
        "should", "have", "has", "had", "may", "might", "must"
    )

    /**
     * Analyzes English text into prosodic units with calibrated intonation, speed, and pause metadata.
     *
     * @param text Raw English text input.
     * @param character Target VoiceCharacter with individual pause and acoustic profiles.
     * @return List of ProsodySegments with linguistic metadata.
     */
    fun analyzeText(text: String, character: VoiceCharacter): List<ProsodySegment> {
        if (text.isBlank()) return emptyList()

        val rawSentences = text.trim().split(Regex("(?<=[.!?])\\s+|\\n+"))
        val segments = mutableListOf<ProsodySegment>()

        rawSentences.forEachIndexed { index, raw ->
            val cleanSentence = raw.trim()
            if (cleanSentence.isNotBlank()) {
                val lower = cleanSentence.lowercase()

                // 1. Classify Sentence Type
                val isQuestion = cleanSentence.endsWith("?")
                val isExclamation = cleanSentence.endsWith("!")
                val containsOr = lower.contains(" or ") && isQuestion
                val firstWord = lower.split(Regex("\\s+")).firstOrNull()?.replace(Regex("[^a-z]"), "") ?: ""

                val sentenceType = when {
                    containsOr -> SentenceType.ALTERNATIVE_QUESTION
                    isQuestion && whQuestionWords.contains(firstWord) -> SentenceType.WH_QUESTION
                    isQuestion && yesNoQuestionStarters.contains(firstWord) -> SentenceType.YES_NO_QUESTION
                    isQuestion -> SentenceType.YES_NO_QUESTION
                    isExclamation -> SentenceType.EXCLAMATION
                    introductoryPhrases.any { lower.startsWith(it) } -> SentenceType.INTRODUCTORY_PHRASE
                    cleanSentence.contains(",") && cleanSentence.split(",").size > 2 -> SentenceType.LIST_ENUMERATION
                    else -> SentenceType.STATEMENT
                }

                val isIntro = sentenceType == SentenceType.INTRODUCTORY_PHRASE

                // 2. Calibrate Pause Planning
                val pauseMs = when (sentenceType) {
                    SentenceType.STATEMENT -> character.pauseProfile.fullStopPauseMs
                    SentenceType.YES_NO_QUESTION -> character.pauseProfile.questionPauseMs
                    SentenceType.WH_QUESTION -> character.pauseProfile.questionPauseMs
                    SentenceType.ALTERNATIVE_QUESTION -> character.pauseProfile.questionPauseMs + 50L
                    SentenceType.EXCLAMATION -> character.pauseProfile.exclamationPauseMs
                    SentenceType.INTRODUCTORY_PHRASE -> 280L
                    SentenceType.LIST_ENUMERATION -> 220L
                }

                // 3. Calibrate Pitch Contours
                val pitchMultiplier = when (sentenceType) {
                    SentenceType.YES_NO_QUESTION -> 1.15f // Natural rising intonation
                    SentenceType.WH_QUESTION -> 0.95f     // Natural falling intonation for WH-questions
                    SentenceType.ALTERNATIVE_QUESTION -> 1.08f
                    SentenceType.EXCLAMATION -> 1.10f      // Controlled emotional emphasis
                    SentenceType.INTRODUCTORY_PHRASE -> 1.04f
                    SentenceType.LIST_ENUMERATION -> 1.02f
                    SentenceType.STATEMENT -> 0.94f       // Steady falling statement intonation
                }

                // 4. Calibrate Speech Rate Multipliers
                val rateMultiplier = when (sentenceType) {
                    SentenceType.INTRODUCTORY_PHRASE -> 0.88f // Slower pace for clear introduction
                    SentenceType.LIST_ENUMERATION -> 0.92f
                    SentenceType.STATEMENT -> 0.95f
                    else -> 1.00f
                }

                // 5. Emotion Classification
                val emotion = when (sentenceType) {
                    SentenceType.EXCLAMATION -> "Excited"
                    SentenceType.YES_NO_QUESTION -> "Curious"
                    SentenceType.INTRODUCTORY_PHRASE -> "Serious"
                    else -> character.emotionProfile.defaultEmotion
                }

                segments.add(
                    ProsodySegment(
                        segmentIndex = index,
                        text = cleanSentence,
                        sentenceType = sentenceType,
                        plannedPauseMs = pauseMs,
                        pitchMultiplier = pitchMultiplier,
                        rateMultiplier = rateMultiplier,
                        detectedEmotion = emotion,
                        isIntroductory = isIntro
                    )
                )
            }
        }

        return segments
    }
}
