package com.example.talkme.di

import android.content.Context
import androidx.room.Room
import com.example.talkme.data.db.TalkMeDatabase
import com.example.talkme.data.db.dao.FsrsDao
import com.example.talkme.data.remote.FsrsSyncApi
import com.example.talkme.data.remote.TtsApiService
import com.example.talkme.data.repository.FsrsRepositoryImpl
import com.example.talkme.data.repository.TextToSpeechRepositoryImpl
import com.example.talkme.domain.fsrs.FsrsParameters
import com.example.talkme.domain.repository.FsrsRepository
import com.example.talkme.domain.repository.TextToSpeechRepository
import dagger.Binds
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import javax.inject.Singleton

/**
 * Hilt Dependency Injection Module providing Singleton repository and database bindings for TalkMe application.
 */
@Module
@InstallIn(SingletonComponent::class)
abstract class AppModule {

    @Binds
    @Singleton
    abstract fun bindTextToSpeechRepository(
        impl: TextToSpeechRepositoryImpl,
    ): TextToSpeechRepository

    @Binds
    @Singleton
    abstract fun bindFsrsRepository(
        impl: FsrsRepositoryImpl,
    ): FsrsRepository

    companion object {

        @Provides
        @Singleton
        fun provideTalkMeDatabase(@ApplicationContext context: Context): TalkMeDatabase {
            return Room.databaseBuilder(
                context,
                TalkMeDatabase::class.java,
                "talkme_database.db"
            ).fallbackToDestructiveMigration().build()
        }

        @Provides
        @Singleton
        fun provideFsrsDao(database: TalkMeDatabase): FsrsDao {
            return database.fsrsDao()
        }

        @Provides
        @Singleton
        fun provideRetrofit(): Retrofit {
            return Retrofit.Builder()
                .baseUrl("https://api.talkme.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build()
        }

        @Provides
        @Singleton
        fun provideTtsApiService(retrofit: Retrofit): TtsApiService {
            return retrofit.create(TtsApiService::class.java)
        }

        @Provides
        @Singleton
        fun provideFsrsSyncApi(retrofit: Retrofit): FsrsSyncApi {
            return retrofit.create(FsrsSyncApi::class.java)
        }

        @Provides
        @Singleton
        fun provideFsrsParameters(): FsrsParameters {
            return FsrsParameters()
        }
    }
}
