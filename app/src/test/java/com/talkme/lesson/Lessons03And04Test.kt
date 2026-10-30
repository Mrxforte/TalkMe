package com.talkme.lesson

import com.talkme.data.lesson.LetterGroup
import com.talkme.data.lesson.Lessons03And04Catalog
import com.talkme.domain.greeting.DynamicGreetingUseCase
import com.talkme.domain.greeting.GreetingTopicContext
import com.talkme.domain.greeting.TimeOfDayPeriod
import org.junit.Assert.*
import org.junit.Test

class Lessons03And04Test {

    private val greetingUseCase = DynamicGreetingUseCase()

    @Test
    fun `vowel and consonant classification is accurate for all 26 English letters`() {
        assertEquals(5, Lessons03And04Catalog.VOWEL_LETTERS.size)
        assertEquals(21, Lessons03And04Catalog.CONSONANT_LETTERS.size)

        listOf("A", "E", "I", "O", "U").forEach { v ->
            assertTrue(Lessons03And04Catalog.isVowel(v))
            assertFalse(Lessons03And04Catalog.isConsonant(v))
            assertEquals(LetterGroup.VOWEL, Lessons03And04Catalog.classifyLetter(v))
        }

        listOf("B", "C", "D", "F", "G", "K", "M", "T", "Z").forEach { c ->
            assertTrue(Lessons03And04Catalog.isConsonant(c))
            assertFalse(Lessons03And04Catalog.isVowel(c))
            assertEquals(LetterGroup.CONSONANT, Lessons03And04Catalog.classifyLetter(c))
        }
    }

    @Test
    fun `dynamic greeting adapts to local time and never hardcodes user name`() {
        val morningWithUser = greetingUseCase.buildGreeting(
            interfaceLanguageCode = "uz",
            profileName = "Azamat",
            localHour = 8,
            topicContext = GreetingTopicContext.LETTERS
        )
        assertEquals(TimeOfDayPeriod.MORNING, morningWithUser.period)
        assertTrue(morningWithUser.usedProfileName)
        assertTrue(morningWithUser.headline.contains("Azamat"))

        val eveningWithoutUser = greetingUseCase.buildGreeting(
            interfaceLanguageCode = "uz",
            profileName = null,
            localHour = 20,
            topicContext = GreetingTopicContext.WORDS_SPELLING
        )
        assertEquals(TimeOfDayPeriod.EVENING, eveningWithoutUser.period)
        assertFalse(eveningWithoutUser.usedProfileName)
        assertFalse(eveningWithoutUser.headline.contains("Azamat"))
    }

    @Test
    fun `lesson 04 contains all 10 everyday spelling words and validates spelling order`() {
        assertEquals(10, Lessons03And04Catalog.TEN_SPELLING_WORDS.size)
        assertTrue(Lessons03And04Catalog.validateConstructedWord(listOf("C", "A", "T"), "CAT"))
        assertFalse(Lessons03And04Catalog.validateConstructedWord(listOf("T", "C", "A"), "CAT"))
        assertEquals(listOf("B", "O", "O", "K"), Lessons03And04Catalog.formatSpellingSequence("Book"))
    }
}
