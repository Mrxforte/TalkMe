package com.example.talkme.data.repository

import android.content.Context
import android.speech.tts.TextToSpeech
import android.util.Log
import com.example.talkme.domain.repository.TextToSpeechRepository
import dagger.hilt.android.qualifiers.ApplicationContext
import java.util.Locale
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Android Framework Implementation of TextToSpeechRepository using native android.speech.tts.TextToSpeech.
 * Features explicit user-driven playback control, long-text sentence chunking, and character voice profile support.
 *
 * @param context Injected Application Context.
 */
@Singleton
class TextToSpeechRepositoryImpl @Inject constructor(
    @param:ApplicationContext private val context: Context,
) : TextToSpeechRepository, TextToSpeech.OnInitListener {

    private var tts: TextToSpeech? = null
    private var isInitialized = false
    private val pendingTextQueue = mutableListOf<String>()

    init {
        initializeTts()
    }

    /**
     * Initializes the Android TextToSpeech engine.
     */
    private fun initializeTts() {
        if (tts == null) {
            tts = TextToSpeech(context, this)
        }
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            var result = tts?.setLanguage(Locale.US)
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                Log.w(TAG, "Locale.US missing or unsupported, falling back to Locale.ENGLISH.")
                result = tts?.setLanguage(Locale.ENGLISH)
            }

            if (result != TextToSpeech.LANG_MISSING_DATA && result != TextToSpeech.LANG_NOT_SUPPORTED) {
                isInitialized = true
                tts?.setSpeechRate(0.9f)
                Log.d(TAG, "TextToSpeech engine initialized successfully.")

                // Only flush pending text if explicitly queued by user action
                synchronized(pendingTextQueue) {
                    val pendingText = pendingTextQueue.lastOrNull()
                    pendingTextQueue.clear()
                    if (pendingText != null) {
                        speakInternal(pendingText)
                    }
                }
            } else {
                Log.e(TAG, "No supported English TTS language found on device.")
            }
        } else {
            Log.e(TAG, "Failed to initialize TextToSpeech engine. Status: $status")
        }
    }

    override fun speak(text: String) {
        if (text.isBlank()) return

        synchronized(pendingTextQueue) {
            if (isInitialized) {
                speakInternal(text)
            } else {
                Log.d(TAG, "TTS not initialized yet. Queueing text for user action: $text")
                pendingTextQueue.clear()
                pendingTextQueue.add(text)
                initializeTts()
            }
        }
    }

    private fun speakInternal(text: String) {
        tts?.stop() // Ensure any previous audio is stopped before playing new speech

        if (text.length > 300) {
            // Split long text into natural sentence chunks to respect Android TTS character limits
            val sentences = text.split(Regex("(?<=[.!?])\\s+|\\n+"))
            var isFirstChunk = true
            var currentChunk = StringBuilder()

            for (sentence in sentences) {
                if (sentence.isBlank()) continue

                if (currentChunk.length + sentence.length > 250) {
                    val queueMode = if (isFirstChunk) TextToSpeech.QUEUE_FLUSH else TextToSpeech.QUEUE_ADD
                    val chunkText = currentChunk.toString().trim()
                    tts?.speak(chunkText, queueMode, null, "TalkMe_TTS_${System.currentTimeMillis()}")
                    isFirstChunk = false
                    currentChunk = StringBuilder()
                }
                currentChunk.append(sentence).append(" ")
            }

            if (currentChunk.isNotEmpty()) {
                val queueMode = if (isFirstChunk) TextToSpeech.QUEUE_FLUSH else TextToSpeech.QUEUE_ADD
                val chunkText = currentChunk.toString().trim()
                tts?.speak(chunkText, queueMode, null, "TalkMe_TTS_${System.currentTimeMillis()}")
            }
        } else {
            tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "TalkMe_TTS_${System.currentTimeMillis()}")
        }
    }

    override fun stop() {
        synchronized(pendingTextQueue) {
            pendingTextQueue.clear()
            if (isInitialized) {
                tts?.stop()
            }
        }
    }

    override fun shutdown() {
        synchronized(pendingTextQueue) {
            pendingTextQueue.clear()
            if (tts != null) {
                tts?.stop()
                tts?.shutdown()
                tts = null
                isInitialized = false
            }
        }
    }

    companion object {
        private const val TAG = "TalkMe_TTS"
    }
}
