package com.talkme.localization

import com.talkme.data.lesson.FirstBeginnerLessonCatalog
import com.talkme.data.preferences.SettingsRepositoryImpl
import com.talkme.domain.localization.*
import org.junit.Assert.*
import org.junit.Test

/**
 * Unit tests verifying the TalkMe Multilingual Lesson System & Beginner-Friendly
 * Learning Architecture (Section 13).
 */
class MultilingualArchitectureTest {

    @Test
    fun `switching interface language uz to ru to en preserves learning language`() {
        val repo = SettingsRepositoryImpl()
        assertEquals(InterfaceLanguage.UZBEK, repo.currentPreferences().interfaceLanguage)
        assertEquals(LearningLanguage.ENGLISH, repo.currentPreferences().learningLanguage)

        repo.updateInterfaceLanguage(InterfaceLanguage.RUSSIAN)
        assertEquals(InterfaceLanguage.RUSSIAN, repo.currentPreferences().interfaceLanguage)
        assertEquals(LearningLanguage.ENGLISH, repo.currentPreferences().learningLanguage)

        repo.updateInterfaceLanguage(InterfaceLanguage.ENGLISH)
        assertEquals(InterfaceLanguage.ENGLISH, repo.currentPreferences().interfaceLanguage)
        assertEquals(LearningLanguage.ENGLISH, repo.currentPreferences().learningLanguage)
    }

    @Test
    fun `first beginner lesson has identical lessonId and strict 6 vocabulary items across languages`() {
        val expectedWords = listOf("Hello", "Hi", "Thank you", "I am", "Welcome", "Goodbye")

        listOf(
            InterfaceLanguage.UZBEK,
            InterfaceLanguage.RUSSIAN,
            InterfaceLanguage.ENGLISH,
            InterfaceLanguage.KOREAN
        ).forEach { lang ->
            val plan = FirstBeginnerLessonCatalog.buildLessonPlan(lang)
            assertEquals("grammar_fundamentals_001", plan.lessonId)
            assertEquals(expectedWords, plan.vocabulary.map { it.wordEn })
        }
    }

    @Test
    fun `language pack validator passes all production packs with zero errors`() {
        val report = LanguagePackValidator.validatePacks(
            packs = FirstBeginnerLessonCatalog.getAllLanguagePacks(),
            requiredUiKeys = setOf("greeting", "start_learning"),
            requiredLessonId = FirstBeginnerLessonCatalog.LESSON_ID,
            requiredVocabIds = FirstBeginnerLessonCatalog.strictSixVocabularyIds,
            requiredStepIds = FirstBeginnerLessonCatalog.tenBeginnerStepIds,
            requiredExerciseIds = FirstBeginnerLessonCatalog.sixExerciseIds,
            ttsItems = FirstBeginnerLessonCatalog.ttsPronunciationCatalog
        )
        assertTrue(report.isValid)
        assertTrue(report.issues.isEmpty())
    }
}
