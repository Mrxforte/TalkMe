package com.example.talkme.data.processor

import com.example.talkme.domain.model.PauseProfile
import com.example.talkme.domain.model.VoiceCharacter
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Sentence Segment with Prosody & Pause Planning Metadata.
 */
data class ProsodySegment(
    val segmentIndex: Int,
    val text: String,
    val isQuestion: Boolean = false,
    val isExclamation: Boolean = false,
    val isIntroductoryPhrase: Boolean = false,
    val isDialogue: Boolean = false,
    val plannedPauseMs: Long = 300L,
    val pitchMultiplier: Float = 1.0f,
    val rateMultiplier: Float = 1.0f,
    val detectedEmotion: String = "Neutral"
)

/**
 * Text Prosody & Context Analyzer for human-like speech pacing, intonation, and pause planning.
 */
@Singleton
class TextProsodyAnalyzer @Inject constructor() {

    private val introductoryKeywords = setOf(
        "first of all", "before we begin", "most importantly", "however", "furthermore",
        "in conclusion", "for example", "suddenly", "once upon a time", "in fact", "as a result"
    )

    /**
     * Analyzes raw text and produces prosody-annotated segments.
     */
    fun analyzeText(text: String, character: VoiceCharacter): List<ProsodySegment> {
        if (text.isBlank()) return emptyList()

        val rawSentences = text.trim().split(Regex("(?<=[.!?])\\s+|\\n+"))
        val segments = mutableListOf<ProsodySegment>()

        rawSentences.forEachIndexed { index, raw ->
            val cleanSentence = raw.trim()
            if (cleanSentence.isNotBlank()) {
                val isQuestion = cleanSentence.endsWith("?")
                val isExclamation = cleanSentence.endsWith("!")
                val isDialogue = cleanSentence.startsWith("\"") || cleanSentence.startsWith("“")
                val isIntroductory = introductoryKeywords.any { cleanSentence.lowercase().startsWith(it) }

                // Calculate pause duration based on character pause profile
                val pauseMs = when {
                    isQuestion -> character.pauseProfile.questionPauseMs
                    isExclamation -> character.pauseProfile.exclamationPauseMs
                    cleanSentence.endsWith(";") -> character.pauseProfile.semicolonPauseMs
                    cleanSentence.endsWith(":") -> character.pauseProfile.colonPauseMs()
                    raw.contains("\n") -> character.pauseProfile.paragraphPauseMs
                    else -> character.pauseProfile.fullStopPauseMs
                }

                // Adjust pitch contour for questions & exclamations
                val pitchMultiplier = when {
                    isQuestion -> 1.12f // Question intonation rise
                    isExclamation -> 1.08f
                    isIntroductory -> 1.04f
                    else -> 1.00f
                }

                // Adjust speech rate for introductory or dramatic sections
                val rateMultiplier = when {
                    isIntroductory -> 0.92f // Slightly slower for clear introduction
                    isDialogue -> 1.02f
                    else -> 1.00f
                }

                // Simple contextual emotion detection
                val emotion = when {
                    isExclamation -> "Excited"
                    isQuestion -> "Curious"
                    isIntroductory -> "Serious"
                    else -> character.emotionProfile.defaultEmotion
                }

                segments.add(
                    ProsodySegment(
                        segmentIndex = index,
                        text = cleanSentence,
                        isQuestion = isQuestion,
                        isExclamation = isExclamation,
                        isIntroductoryPhrase = isIntroductory,
                        isDialogue = isDialogue,
                        plannedPauseMs = pauseMs,
                        pitchMultiplier = pitchMultiplier,
                        rateMultiplier = rateMultiplier,
                        detectedEmotion = emotion
                    )
                )
            }
        }

        return segments
    }

    private fun PauseProfile.colonPauseMs(): Long = 250L
}
