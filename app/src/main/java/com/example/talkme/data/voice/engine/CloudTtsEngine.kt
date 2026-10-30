package com.example.talkme.data.voice.engine

import android.content.Context
import android.util.Log
import com.example.talkme.data.remote.TtsApiService
import com.example.talkme.data.remote.model.CloudTtsSynthesizeRequest
import com.example.talkme.domain.voice.engine.TtsEngine
import com.example.talkme.domain.voice.model.AudioResult
import com.example.talkme.domain.voice.model.TtsCapabilities
import com.example.talkme.domain.voice.model.TtsRequest
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Cloud FastAPI Server TTS Engine Adapter.
 * Communicates with server-side AI models (XTTS-v2, F5-TTS, StyleTTS2) via REST and WebSockets.
 */
@Singleton
class CloudTtsEngine @Inject constructor(
    @param:ApplicationContext private val context: Context,
    private val ttsApiService: TtsApiService,
) : TtsEngine {

    override val engineId: String = "cloud_fastapi_tts"
    private var isInitialized = false

    override suspend fun initialize(): Result<Unit> = withContext(Dispatchers.IO) {
        try {
            isInitialized = true
            Log.d(TAG, "CloudTtsEngine initialized successfully.")
            Result.success(Unit)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to initialize CloudTtsEngine: ${e.localizedMessage}")
            Result.failure(e)
        }
    }

    override suspend fun getCapabilities(): TtsCapabilities = TtsCapabilities(
        supportedLanguages = listOf("en", "uz", "ru"),
        supportsOffline = false,
        supportsStreaming = true,
        supportsSpeakerSelection = true,
        supportsEmotionConditioning = true,
        supportsIntonationConditioning = true,
        supportsSpeedControl = true,
        supportsPitchControl = true,
        supportedAudioFormats = listOf("mp3", "wav"),
        sampleRates = listOf(24000, 44100)
    )

    override suspend fun synthesize(request: TtsRequest): Result<AudioResult> = withContext(Dispatchers.IO) {
        val startTime = System.currentTimeMillis()
        try {
            val apiRequest = CloudTtsSynthesizeRequest(
                text = request.text,
                language = request.language,
                voiceId = request.voiceId,
                speakerId = request.speakerId,
                emotion = request.emotion,
                intonation = request.intonation,
                speed = request.speed,
                pitch = request.pitch,
                volume = request.volume,
                audioFormat = request.audioFormat,
                sampleRate = request.sampleRate,
                isStreaming = request.isStreaming
            )

            val response = ttsApiService.synthesize(apiRequest)
            val body = response.body()
            if (response.isSuccessful && body != null) {
                val audioBytes = body.bytes()
                val cacheFile = File(context.cacheDir, "cloud_tts_${request.requestId}.${request.audioFormat}")
                FileOutputStream(cacheFile).use { fos ->
                    fos.write(audioBytes)
                }

                val latency = System.currentTimeMillis() - startTime
                Result.success(
                    AudioResult(
                        requestId = request.requestId,
                        audioBytes = audioBytes,
                        audioFilePath = cacheFile.absolutePath,
                        sampleRate = request.sampleRate,
                        durationMs = (audioBytes.size * 1000L) / (request.sampleRate * 2),
                        engineId = engineId,
                        latencyMs = latency,
                        isFromCache = false
                    )
                )
            } else {
                val errorMsg = "Cloud TTS server error: ${response.code()} ${response.message()}"
                Log.e(TAG, errorMsg)
                Result.failure(Exception(errorMsg))
            }
        } catch (e: Exception) {
            Log.e(TAG, "Cloud TTS network error: ${e.localizedMessage}")
            Result.failure(e)
        }
    }

    override suspend fun stop() {
        // Cancel active network call
    }

    override suspend fun release() {
        isInitialized = false
    }

    companion object {
        private const val TAG = "CloudTtsEngine"
    }
}
