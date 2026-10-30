package com.talkme.domain.voice.longtext

import javax.inject.Inject
import javax.inject.Singleton

/**
 * Splits long stories and passages into natural sentence and paragraph chunks
 * while preserving speaker identity and prosodic boundaries.
 */
@Singleton
class LongTextProcessor @Inject constructor() {

    /**
     * Splits a multi-sentence passage into natural synthesis chunks.
     */
    fun splitIntoSentenceChunks(text: String, maxChunkLength: Int = 220): List<String> {
        if (text.isBlank()) return emptyList()
        return text
            .split(Regex("(?<=[.!?])\\s+"))
            .map { it.trim() }
            .filter { it.isNotEmpty() }
            .chunked(2)
            .map { pair ->
                val joined = pair.joinToString(" ")
                if (joined.length <= maxChunkLength) joined else pair.first()
            }
    }
}
