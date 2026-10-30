package com.example.talkme.domain.voice.longtext

import com.example.talkme.domain.voice.model.TtsRequest
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Text Chunk Object for long-text synthesis.
 */
data class TextChunk(
    val chunkIndex: Int,
    val text: String,
    val isLast: Boolean
)

/**
 * Long-Text Processing Engine that splits large articles/stories at natural sentence and paragraph boundaries.
 */
@Singleton
class LongTextProcessor @Inject constructor() {

    /**
     * Splits long text into manageable chunk requests (max ~200 characters per chunk).
     */
    fun splitIntoChunks(request: TtsRequest, maxChunkChars: Int = 200): List<TtsRequest> {
        val rawText = request.text.trim()
        if (rawText.length <= maxChunkChars) {
            return listOf(request)
        }

        val sentences = rawText.split(Regex("(?<=[.!?])\\s+|\\n+"))
        val chunkRequests = mutableListOf<TtsRequest>()
        var currentChunkText = StringBuilder()
        var index = 0

        for (sentence in sentences) {
            if (sentence.isBlank()) continue

            if (currentChunkText.length + sentence.length > maxChunkChars && currentChunkText.isNotEmpty()) {
                chunkRequests.add(
                    request.copy(
                        requestId = "${request.requestId}_chunk_$index",
                        text = currentChunkText.toString().trim()
                    )
                )
                index++
                currentChunkText = StringBuilder()
            }

            currentChunkText.append(sentence).append(" ")
        }

        if (currentChunkText.isNotEmpty()) {
            chunkRequests.add(
                request.copy(
                    requestId = "${request.requestId}_chunk_$index",
                    text = currentChunkText.toString().trim()
                )
            )
        }

        return chunkRequests
    }
}
