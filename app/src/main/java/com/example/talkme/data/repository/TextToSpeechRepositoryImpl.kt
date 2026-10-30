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
 * Strictly configured for English pronunciation (Locale.US) with automatic resource management.
 *
 * @param context Injected Application Context.
 */
@Singleton
class TextToSpeechRepositoryImpl @Inject constructor(
    @param:ApplicationContext private val context: Context,
) : TextToSpeechRepository, TextToSpeech.OnInitListener {

    private var tts: TextToSpeech? = null
    private var isInitialized = false

    init {
        initializeTts()
    }

    /**
     * Initializes the Android TextToSpeech engine.
     */
    private fun initializeTts() {
        tts = TextToSpeech(context, this)
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val result = tts?.setLanguage(Locale.US)
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                Log.e(TAG, "English US language is not supported or missing data on this device.")
            } else {
                isInitialized = true
                tts?.setSpeechRate(0.9f) // Slightly slower speech rate for optimal learning clarity
                Log.d(TAG, "English TextToSpeech engine initialized successfully.")
            }
        } else {
            Log.e(TAG, "Failed to initialize TextToSpeech engine. Status: $status")
        }
    }

    override fun speak(text: String) {
        if (isInitialized) {
            tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "TalkMe_TTS_${System.currentTimeMillis()}")
        } else {
            Log.w(TAG, "TTS not initialized yet. Re-initializing and queued text: $text")
            initializeTts()
        }
    }

    override fun stop() {
        if (isInitialized) {
            tts?.stop()
        }
    }

    override fun shutdown() {
        if (tts != null) {
            tts?.stop()
            tts?.shutdown()
            tts = null
            isInitialized = false
        }
    }

    companion object {
        private const val TAG = "TalkMe_TTS"
    }
}
