package com.talkme.di

import com.talkme.data.lesson.LessonRepositoryImpl
import com.talkme.domain.lesson.repository.LessonRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Hilt Dependency Injection module binding [LessonRepositoryImpl] to [LessonRepository]
 * per PROJECT_RULES.md Section 3.
 */
@Module
@InstallIn(SingletonComponent::class)
abstract class LessonModule {

    /**
     * Binds [LessonRepositoryImpl] as the singleton [LessonRepository] implementation.
     */
    @Binds
    @Singleton
    abstract fun bindLessonRepository(
        impl: LessonRepositoryImpl
    ): LessonRepository
}
