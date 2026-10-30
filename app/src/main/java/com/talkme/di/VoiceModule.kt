package com.talkme.di

import com.talkme.data.preferences.SettingsRepositoryImpl
import com.talkme.data.voice.engine.AndroidSystemTtsEngine
import com.talkme.data.voice.engine.CloudTtsEngine
import com.talkme.data.voice.engine.SherpaOnnxTtsEngine
import com.talkme.domain.voice.normalization.TextNormalizationPipeline
import com.talkme.domain.voice.registry.EngineRegistry
import com.talkme.domain.voice.usecase.SpeakTextUseCase
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Hilt Dependency Injection module provisioning the Voice AI Character Platform
 * (`EngineRegistry`, `SpeakTextUseCase`, `SherpaOnnxTtsEngine`, `CloudTtsEngine`,
 * `AndroidSystemTtsEngine`, and `SettingsRepositoryImpl`) per PROJECT_RULES.md Section 1 & 3.
 */
@Module
@InstallIn(SingletonComponent::class)
object VoiceModule {

    /**
     * Provides the centralized [EngineRegistry] routing synthesis across local and cloud adapters.
     */
    @Provides
    @Singleton
    fun provideEngineRegistry(
        sherpaOnnxTtsEngine: SherpaOnnxTtsEngine,
        cloudTtsEngine: CloudTtsEngine,
        androidSystemTtsEngine: AndroidSystemTtsEngine
    ): EngineRegistry {
        return EngineRegistry(
            sherpaOnnxEngine = sherpaOnnxTtsEngine,
            cloudTtsEngine = cloudTtsEngine,
            androidSystemEngine = androidSystemTtsEngine
        )
    }

    /**
     * Provides the primary [SpeakTextUseCase] entry point for all speech synthesis requests.
     */
    @Provides
    @Singleton
    fun provideSpeakTextUseCase(
        engineRegistry: EngineRegistry,
        normalizationPipeline: TextNormalizationPipeline,
        settingsRepository: SettingsRepositoryImpl
    ): SpeakTextUseCase {
        return SpeakTextUseCase(
            engineRegistry = engineRegistry,
            normalizationPipeline = normalizationPipeline,
            settingsRepository = settingsRepository
        )
    }
}
