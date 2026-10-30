package com.example.talkme.data.repository

import android.content.Context
import android.speech.tts.TextToSpeech
import android.speech.tts.Voice
import android.util.Log
import com.example.talkme.domain.repository.TextToSpeechRepository
import com.example.talkme.domain.voice.catalog.CharacterVoiceCatalog
import dagger.hilt.android.qualifiers.ApplicationContext
import java.util.Locale
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Android Framework Implementation of TextToSpeechRepository using native android.speech.tts.TextToSpeech.
 * Features robust male/female voice selection, pitch modulation, long-text sentence chunking, and reliable speech.
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

    private var currentSpeed: Float = 1.0f
    private var currentPitch: Float = 1.0f
    private var currentCharacterProfile: String = "adult_male"

    init {
        initializeTts()
    }

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
                applyCharacterVoiceProfile(currentCharacterProfile, currentSpeed, currentPitch)
                Log.d(TAG, "TextToSpeech engine initialized successfully.")

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

    override fun setSpeechParameters(speed: Float, pitch: Float, characterProfile: String) {
        this.currentSpeed = speed
        this.currentPitch = pitch
        this.currentCharacterProfile = characterProfile

        if (isInitialized) {
            applyCharacterVoiceProfile(characterProfile, speed, pitch)
        }
    }

    /**
     * Applies distinct Android Voice object, pitch, and speed parameters according to character profile.
     */
    private fun applyCharacterVoiceProfile(characterIdentifier: String, userSpeed: Float, userPitch: Float) {
        val profile = CharacterVoiceCatalog.allProfiles.find {
            it.id == characterIdentifier || it.nameUz == characterIdentifier || it.nameEn == characterIdentifier
        } ?: CharacterVoiceCatalog.allProfiles.first()

        val effectiveSpeed = (profile.baseRate * userSpeed).coerceIn(0.5f, 2.0f)
        val effectivePitch = (profile.basePitch * userPitch).coerceIn(0.4f, 2.0f)

        tts?.setSpeechRate(effectiveSpeed)
        tts?.setPitch(effectivePitch)

        // Select distinct Android Voice matching preferred gender if available
        val availableVoices = tts?.voices ?: emptySet()
        val englishVoices = availableVoices.filter { it.locale.language == "en" && !it.isNetworkConnectionRequired }.toList()

        if (englishVoices.isNotEmpty()) {
            val genderKey = profile.preferredGender.lowercase()
            val matchedVoice: Voice = when (genderKey) {
                "male" -> {
                    // Search for male voice markers or pick distinct male voice index
                    englishVoices.firstOrNull {
                        it.name.contains("iom", ignoreCase = true) ||
                        it.name.contains("tpf", ignoreCase = true) ||
                        it.name.contains("male", ignoreCase = true)
                    } ?: englishVoices.elementAtOrNull(1) ?: englishVoices.first()
                }
                "female" -> {
                    // Search for female voice markers or pick distinct female voice index
                    englishVoices.firstOrNull {
                        it.name.contains("sfg", ignoreCase = true) ||
                        it.name.contains("iol", ignoreCase = true) ||
                        it.name.contains("female", ignoreCase = true)
                    } ?: englishVoices.first()
                }
                else -> englishVoices.first()
            }

            tts?.voice = matchedVoice
            Log.d(TAG, "Applied voice '${matchedVoice.name}' [Gender: $genderKey, Rate: $effectiveSpeed, Pitch: $effectivePitch] for profile '${profile.nameEn}' [${profile.id}]")
        }
    }

    override fun speak(text: String) {
        if (text.isBlank()) return

        synchronized(pendingTextQueue) {
            if (isInitialized) {
                applyCharacterVoiceProfile(currentCharacterProfile, currentSpeed, currentPitch)
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
        tts?.stop()

        if (text.length > 300) {
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
