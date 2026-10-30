package com.example.talkme.di

import com.example.talkme.data.repository.TextToSpeechRepositoryImpl
import com.example.talkme.domain.repository.TextToSpeechRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Hilt Dependency Injection Module providing Singleton repository bindings for TalkMe application.
 */
@Module
@InstallIn(SingletonComponent::class)
abstract class AppModule {

    /**
     * Binds native TextToSpeechRepositoryImpl to TextToSpeechRepository.
     */
    @Binds
    @Singleton
    abstract fun bindTextToSpeechRepository(
        impl: TextToSpeechRepositoryImpl,
    ): TextToSpeechRepository
}
