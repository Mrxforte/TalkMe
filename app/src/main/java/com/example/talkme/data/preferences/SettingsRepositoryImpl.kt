package com.example.talkme.data.preferences

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.floatPreferencesKey
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.example.talkme.domain.settings.VoiceSettings
import com.example.talkme.domain.voice.model.EngineSelectionMode
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

val Context.voiceDataStore by preferencesDataStore(name = "talkme_voice_settings")

/**
 * DataStore Preferences implementation of Voice AI Settings persistence repository.
 */
@Singleton
class SettingsRepositoryImpl @Inject constructor(
    @param:ApplicationContext private val context: Context,
) {

    val voiceSettingsFlow: Flow<VoiceSettings> = context.voiceDataStore.data.map { prefs ->
        VoiceSettings(
            engineSelectionMode = try {
                EngineSelectionMode.valueOf(prefs[KEY_ENGINE_MODE] ?: EngineSelectionMode.LOCAL_FIRST.name)
            } catch (_: Exception) {
                EngineSelectionMode.LOCAL_FIRST
            },
            defaultEngineId = prefs[KEY_DEFAULT_ENGINE] ?: "sherpa_onnx_tts",
            defaultLanguage = prefs[KEY_DEFAULT_LANG] ?: "en",
            defaultVoiceId = prefs[KEY_DEFAULT_VOICE] ?: "default_en",
            defaultSpeakerId = prefs[KEY_SPEAKER_ID] ?: 0,
            speechSpeed = prefs[KEY_SPEECH_SPEED] ?: 1.0f,
            speechPitch = prefs[KEY_SPEECH_PITCH] ?: 1.0f,
            speechVolume = prefs[KEY_SPEECH_VOLUME] ?: 1.0f,
            selectedEmotion = prefs[KEY_EMOTION] ?: "Neutral",
            selectedIntonation = prefs[KEY_INTONATION] ?: "Neutral",
            selectedCharacterProfile = prefs[KEY_CHARACTER] ?: "Standard",
            sentencePauseMs = prefs[KEY_SENTENCE_PAUSE] ?: 300,
            paragraphPauseMs = prefs[KEY_PARAGRAPH_PAUSE] ?: 600,
            audioCacheEnabled = prefs[KEY_CACHE_ENABLED] ?: true,
            maxCacheSizeMb = prefs[KEY_MAX_CACHE] ?: 200,
            downloadWifiOnly = prefs[KEY_WIFI_ONLY] ?: true,
            diagnosticLoggingEnabled = prefs[KEY_LOGGING] ?: true
        )
    }

    suspend fun updateSettings(settings: VoiceSettings) {
        context.voiceDataStore.edit { prefs ->
            prefs[KEY_ENGINE_MODE] = settings.engineSelectionMode.name
            prefs[KEY_DEFAULT_ENGINE] = settings.defaultEngineId
            prefs[KEY_DEFAULT_LANG] = settings.defaultLanguage
            prefs[KEY_DEFAULT_VOICE] = settings.defaultVoiceId
            prefs[KEY_SPEAKER_ID] = settings.defaultSpeakerId
            prefs[KEY_SPEECH_SPEED] = settings.speechSpeed
            prefs[KEY_SPEECH_PITCH] = settings.speechPitch
            prefs[KEY_SPEECH_VOLUME] = settings.speechVolume
            prefs[KEY_EMOTION] = settings.selectedEmotion
            prefs[KEY_INTONATION] = settings.selectedIntonation
            prefs[KEY_CHARACTER] = settings.selectedCharacterProfile
            prefs[KEY_SENTENCE_PAUSE] = settings.sentencePauseMs
            prefs[KEY_PARAGRAPH_PAUSE] = settings.paragraphPauseMs
            prefs[KEY_CACHE_ENABLED] = settings.audioCacheEnabled
            prefs[KEY_MAX_CACHE] = settings.maxCacheSizeMb
            prefs[KEY_WIFI_ONLY] = settings.downloadWifiOnly
            prefs[KEY_LOGGING] = settings.diagnosticLoggingEnabled
        }
    }

    suspend fun resetToDefaults() {
        updateSettings(VoiceSettings())
    }

    companion object {
        private val KEY_ENGINE_MODE = stringPreferencesKey("engine_mode")
        private val KEY_DEFAULT_ENGINE = stringPreferencesKey("default_engine")
        private val KEY_DEFAULT_LANG = stringPreferencesKey("default_lang")
        private val KEY_DEFAULT_VOICE = stringPreferencesKey("default_voice")
        private val KEY_SPEAKER_ID = intPreferencesKey("speaker_id")
        private val KEY_SPEECH_SPEED = floatPreferencesKey("speech_speed")
        private val KEY_SPEECH_PITCH = floatPreferencesKey("speech_pitch")
        private val KEY_SPEECH_VOLUME = floatPreferencesKey("speech_volume")
        private val KEY_EMOTION = stringPreferencesKey("emotion")
        private val KEY_INTONATION = stringPreferencesKey("intonation")
        private val KEY_CHARACTER = stringPreferencesKey("character")
        private val KEY_SENTENCE_PAUSE = intPreferencesKey("sentence_pause")
        private val KEY_PARAGRAPH_PAUSE = intPreferencesKey("paragraph_pause")
        private val KEY_CACHE_ENABLED = booleanPreferencesKey("cache_enabled")
        private val KEY_MAX_CACHE = intPreferencesKey("max_cache")
        private val KEY_WIFI_ONLY = booleanPreferencesKey("wifi_only")
        private val KEY_LOGGING = booleanPreferencesKey("logging")
    }
}
