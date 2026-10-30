package com.talkme.data.lesson

enum class LetterGroup {
    VOWEL,
    CONSONANT
}

enum class GameDifficulty {
    EASY,
    MEDIUM,
    HARD
}

data class AlphabetLessonCard(
    val letterUpper: String,
    val letterLower: String,
    val group: LetterGroup,
    val englishWord: String,
    val drawableKey: String,
    val translations: Map<String, String>
)

data class SpellingLessonWord(
    val id: String,
    val orderNumber: Int,
    val word: String,
    val letters: List<String>,
    val drawableKey: String,
    val translations: Map<String, String>
)

object Lessons03And04Catalog {
    const val LESSON_03_ID = "lesson_03_vowels_consonants"
    const val LESSON_04_ID = "lesson_04_phonics_spelling"

    val VOWEL_LETTERS = listOf("A", "E", "I", "O", "U")
    val CONSONANT_LETTERS = listOf(
        "B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N",
        "P", "Q", "R", "S", "T", "V", "W", "X", "Y", "Z"
    )

    val BASKET_SORTING_LETTERS = listOf("A", "B", "E", "G", "I", "K", "O", "T", "U", "M")

    val VOWEL_CARDS = listOf(
        AlphabetLessonCard("A", "a", LetterGroup.VOWEL, "Apple", "ic_lesson_apple", mapOf("uz" to "Olma", "ru" to "Яблоко", "en" to "Apple")),
        AlphabetLessonCard("E", "e", LetterGroup.VOWEL, "Egg", "ic_lesson_egg", mapOf("uz" to "Tuxum", "ru" to "Яйцо", "en" to "Egg")),
        AlphabetLessonCard("I", "i", LetterGroup.VOWEL, "Ice cream", "ic_lesson_ice_cream", mapOf("uz" to "Muzqaymoq", "ru" to "Мороженое", "en" to "Ice cream")),
        AlphabetLessonCard("O", "o", LetterGroup.VOWEL, "Owl", "ic_lesson_owl", mapOf("uz" to "Boyqush", "ru" to "Сова", "en" to "Owl")),
        AlphabetLessonCard("U", "u", LetterGroup.VOWEL, "Umbrella", "ic_lesson_umbrella", mapOf("uz" to "Soyabon", "ru" to "Зонт", "en" to "Umbrella"))
    )

    val CONSONANT_EXAMPLE_CARDS = listOf(
        AlphabetLessonCard("B", "b", LetterGroup.CONSONANT, "Book", "ic_lesson_book", mapOf("uz" to "Kitob", "ru" to "Книга", "en" to "Book")),
        AlphabetLessonCard("C", "c", LetterGroup.CONSONANT, "Cat", "ic_lesson_cat", mapOf("uz" to "Mushuk", "ru" to "Кошка", "en" to "Cat")),
        AlphabetLessonCard("D", "d", LetterGroup.CONSONANT, "Dog", "ic_lesson_dog", mapOf("uz" to "It", "ru" to "Собака", "en" to "Dog")),
        AlphabetLessonCard("F", "f", LetterGroup.CONSONANT, "Fish", "ic_lesson_fish", mapOf("uz" to "Baliq", "ru" to "Рыба", "en" to "Fish"))
    )

    val TEN_SPELLING_WORDS = listOf(
        SpellingLessonWord("word_01_apple", 1, "APPLE", listOf("A", "P", "P", "L", "E"), "ic_lesson_apple", mapOf("uz" to "Olma", "ru" to "Яблоко", "en" to "Apple")),
        SpellingLessonWord("word_02_cat", 2, "CAT", listOf("C", "A", "T"), "ic_lesson_cat", mapOf("uz" to "Mushuk", "ru" to "Кошка", "en" to "Cat")),
        SpellingLessonWord("word_03_dog", 3, "DOG", listOf("D", "O", "G"), "ic_lesson_dog", mapOf("uz" to "It", "ru" to "Собака", "en" to "Dog")),
        SpellingLessonWord("word_04_sun", 4, "SUN", listOf("S", "U", "N"), "ic_lesson_sun", mapOf("uz" to "Quyosh", "ru" to "Солнце", "en" to "Sun")),
        SpellingLessonWord("word_05_car", 5, "CAR", listOf("C", "A", "R"), "ic_lesson_car", mapOf("uz" to "Mashina", "ru" to "Машина", "en" to "Car")),
        SpellingLessonWord("word_06_fish", 6, "FISH", listOf("F", "I", "S", "H"), "ic_lesson_fish", mapOf("uz" to "Baliq", "ru" to "Рыба", "en" to "Fish")),
        SpellingLessonWord("word_07_ball", 7, "BALL", listOf("B", "A", "L", "L"), "ic_lesson_ball", mapOf("uz" to "To‘p", "ru" to "Мяч", "en" to "Ball")),
        SpellingLessonWord("word_08_tree", 8, "TREE", listOf("T", "R", "E", "E"), "ic_lesson_tree", mapOf("uz" to "Daraxt", "ru" to "Дерево", "en" to "Tree")),
        SpellingLessonWord("word_09_cup", 9, "CUP", listOf("C", "U", "P"), "ic_lesson_cup", mapOf("uz" to "Piyola", "ru" to "Чашка", "en" to "Cup")),
        SpellingLessonWord("word_10_book", 10, "BOOK", listOf("B", "O", "O", "K"), "ic_lesson_book", mapOf("uz" to "Kitob", "ru" to "Книга", "en" to "Book"))
    )

    fun isVowel(letter: String): Boolean = VOWEL_LETTERS.contains(letter.trim().uppercase())

    fun isConsonant(letter: String): Boolean = CONSONANT_LETTERS.contains(letter.trim().uppercase())

    fun classifyLetter(letter: String): LetterGroup? {
        val clean = letter.trim().uppercase()
        return when {
            isVowel(clean) -> LetterGroup.VOWEL
            isConsonant(clean) -> LetterGroup.CONSONANT
            else -> null
        }
    }

    fun validateConstructedWord(selectedLetters: List<String>, targetWord: String): Boolean {
        val built = selectedLetters.joinToString("") { it.trim().uppercase() }
        return built == targetWord.trim().uppercase()
    }

    fun formatSpellingSequence(word: String): List<String> {
        return word.trim().uppercase().filter { it in 'A'..'Z' }.map { it.toString() }
    }
}
