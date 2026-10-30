package com.example.talkme.presentation.screens.settings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.talkme.data.preferences.SettingsRepositoryImpl
import com.example.talkme.domain.settings.VoiceSettings
import com.example.talkme.domain.usecase.SpeakTextUseCase
import com.example.talkme.domain.voice.model.EngineSelectionMode
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel managing reactive DataStore settings persistence, character voice profiles, and speech testing.
 *
 * @param settingsRepository Injected DataStore preferences repository.
 * @param speakTextUseCase Injected speech synthesis use case.
 */
@HiltViewModel
class VoiceSettingsViewModel @Inject constructor(
    private val settingsRepository: SettingsRepositoryImpl,
    private val speakTextUseCase: SpeakTextUseCase,
) : ViewModel() {

    val settingsState: StateFlow<VoiceSettings> = settingsRepository.voiceSettingsFlow.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = VoiceSettings()
    )

    fun updateLocalFirstMode(isLocalFirst: Boolean) {
        viewModelScope.launch {
            val current = settingsState.value
            val newMode = if (isLocalFirst) EngineSelectionMode.LOCAL_FIRST else EngineSelectionMode.CLOUD_FIRST
            settingsRepository.updateSettings(current.copy(engineSelectionMode = newMode))
        }
    }

    fun updateCharacterProfile(profileName: String) {
        viewModelScope.launch {
            val current = settingsState.value
            settingsRepository.updateSettings(current.copy(selectedCharacterProfile = profileName))
        }
    }

    fun updateSpeechSpeed(speed: Float) {
        viewModelScope.launch {
            val current = settingsState.value
            settingsRepository.updateSettings(current.copy(speechSpeed = speed))
        }
    }

    fun updateSpeechPitch(pitch: Float) {
        viewModelScope.launch {
            val current = settingsState.value
            settingsRepository.updateSettings(current.copy(speechPitch = pitch))
        }
    }

    fun updateAudioCacheEnabled(enabled: Boolean) {
        viewModelScope.launch {
            val current = settingsState.value
            settingsRepository.updateSettings(current.copy(audioCacheEnabled = enabled))
        }
    }

    fun resetToDefaults() {
        viewModelScope.launch {
            settingsRepository.resetToDefaults()
        }
    }

    fun runSpeechTest(text: String) {
        if (text.isNotBlank()) {
            val current = settingsState.value
            speakTextUseCase(
                text = text,
                speed = current.speechSpeed,
                pitch = current.speechPitch,
                characterProfile = current.selectedCharacterProfile
            )
        }
    }

    override fun onCleared() {
        super.onCleared()
        speakTextUseCase.stop()
    }
}
