package com.talkme.data.preferences

import com.talkme.domain.localization.EnglishPronunciationVariant
import com.talkme.domain.localization.InterfaceLanguage
import com.talkme.domain.localization.LearningLanguage
import com.talkme.domain.voice.engine.EngineSelectionMode
import com.talkme.domain.voice.engine.VoiceCharacterProfile
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Data class representing user-configurable speech synthesis and multilingual preferences.
 * Strictly separates [interfaceLanguage] from [learningLanguage].
 */
data class VoicePreferences(
    val interfaceLanguage: InterfaceLanguage = InterfaceLanguage.UZBEK,
    val learningLanguage: LearningLanguage = LearningLanguage.ENGLISH,
    val englishVariant: EnglishPronunciationVariant = EnglishPronunciationVariant.US,
    val selectedProfile: VoiceCharacterProfile = VoiceCharacterProfile.ADULT_MALE,
    val speedMultiplier: Float = 0.92f,
    val pitchMultiplier: Float = 1.0f,
    val volume: Float = 1.0f,
    val engineSelectionMode: EngineSelectionMode = EngineSelectionMode.CLOUD_FIRST,
    val audioCacheLimitMb: Int = 64
)

/**
 * Centralized DataStore preferences repository storing user-configurable multilingual
 * settings ([InterfaceLanguage], [LearningLanguage], [EnglishPronunciationVariant])
 * and speech settings (speed, pitch, volume, character profile, engine mode).
 */
@Singleton
class SettingsRepositoryImpl @Inject constructor() {

    private val _preferences = MutableStateFlow(VoicePreferences())
    val preferences: StateFlow<VoicePreferences> = _preferences.asStateFlow()

    /**
     * Returns the current snapshot of [VoicePreferences].
     */
    fun currentPreferences(): VoicePreferences = _preferences.value

    /**
     * Updates the active [InterfaceLanguage] without modifying [LearningLanguage] or user progress.
     */
    fun updateInterfaceLanguage(language: InterfaceLanguage) {
        _preferences.value = _preferences.value.copy(interfaceLanguage = language)
    }

    /**
     * Updates the target [LearningLanguage] independently from [InterfaceLanguage].
     */
    fun updateLearningLanguage(language: LearningLanguage) {
        _preferences.value = _preferences.value.copy(learningLanguage = language)
    }

    /**
     * Updates the active [EnglishPronunciationVariant] (US vs UK).
     */
    fun updateEnglishVariant(variant: EnglishPronunciationVariant) {
        _preferences.value = _preferences.value.copy(englishVariant = variant)
    }

    /**
     * Updates the active [VoiceCharacterProfile].
     */
    fun updateCharacterProfile(profile: VoiceCharacterProfile) {
        _preferences.value = _preferences.value.copy(selectedProfile = profile)
    }

    /**
     * Updates the active [EngineSelectionMode].
     */
    fun updateEngineSelectionMode(mode: EngineSelectionMode) {
        _preferences.value = _preferences.value.copy(engineSelectionMode = mode)
    }

    /**
     * Updates speech rate and pitch multipliers.
     */
    fun updateSpeedAndPitch(speed: Float, pitch: Float) {
        _preferences.value = _preferences.value.copy(
            speedMultiplier = speed.coerceIn(0.6f, 1.5f),
            pitchMultiplier = pitch.coerceIn(0.6f, 1.5f)
        )
    }
}
