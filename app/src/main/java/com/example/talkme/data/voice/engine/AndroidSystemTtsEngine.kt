package com.example.talkme.data.voice.engine

import android.content.Context
import android.speech.tts.TextToSpeech
import com.example.talkme.domain.voice.engine.TtsEngine
import com.example.talkme.domain.voice.model.AudioResult
import com.example.talkme.domain.voice.model.TtsCapabilities
import com.example.talkme.domain.voice.model.TtsRequest
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import java.util.Locale
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.coroutines.resume

/**
 * Adapter wrapping native Android TextToSpeech framework.
 */
@Singleton
class AndroidSystemTtsEngine @Inject constructor(
    @param:ApplicationContext private val context: Context,
) : TtsEngine, TextToSpeech.OnInitListener {

    override val engineId: String = "android_system_tts"
    private var tts: TextToSpeech? = null
    private var isInitialized = false

    override suspend fun initialize(): Result<Unit> = withContext(Dispatchers.IO) {
        if (isInitialized && tts != null) return@withContext Result.success(Unit)

        suspendCancellableCoroutine { continuation ->
            tts = TextToSpeech(context) { status ->
                if (status == TextToSpeech.SUCCESS) {
                    tts?.setLanguage(Locale.US)
                    tts?.setSpeechRate(1.0f)
                    isInitialized = true
                    if (continuation.isActive) continuation.resume(Result.success(Unit))
                } else {
                    if (continuation.isActive) continuation.resume(Result.failure(Exception("System TTS init failed")))
                }
            }
        }
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            isInitialized = true
        }
    }

    override suspend fun getCapabilities(): TtsCapabilities = TtsCapabilities(
        supportedLanguages = listOf("en", "uz", "ru"),
        supportsOffline = true,
        supportsStreaming = false,
        supportsSpeakerSelection = false,
        supportsEmotionConditioning = false,
        supportsIntonationConditioning = false,
        supportsSpeedControl = true,
        supportsPitchControl = true,
        supportedAudioFormats = listOf("system_stream"),
        sampleRates = listOf(22050, 24000)
    )

    override suspend fun synthesize(request: TtsRequest): Result<AudioResult> = withContext(Dispatchers.IO) {
        val startTime = System.currentTimeMillis()
        if (!isInitialized) {
            initialize().getOrElse { return@withContext Result.failure(it) }
        }

        tts?.setPitch(request.pitch)
        tts?.setSpeechRate(request.speed)

        val locale = when (request.language.lowercase()) {
            "uz" -> Locale.forLanguageTag("uz")
            "ru" -> Locale.forLanguageTag("ru")
            else -> Locale.US
        }
        tts?.setLanguage(locale)

        tts?.speak(request.text, TextToSpeech.QUEUE_FLUSH, null, request.requestId)

        val duration = System.currentTimeMillis() - startTime
        Result.success(
            AudioResult(
                requestId = request.requestId,
                audioBytes = null,
                audioFilePath = null,
                sampleRate = request.sampleRate,
                durationMs = duration,
                engineId = engineId,
                latencyMs = duration,
                isFromCache = false
            )
        )
    }

    override suspend fun stop(): Unit = withContext(Dispatchers.IO) {
        tts?.stop()
        Unit
    }

    override suspend fun release(): Unit = withContext(Dispatchers.IO) {
        tts?.stop()
        tts?.shutdown()
        tts = null
        isInitialized = false
        Unit
    }
}
