package com.example.talkme.presentation.screens.courses

/**
 * Centralized String & Numerical UI Constants for Courses and Levels Path Screens.
 *
 * Prevents magic strings and literal text hardcoding across Composables.
 */
object CourseConstants {

    /** Default Section Unit Banner Label */
    const val SECTION_UNIT_BANNER_LABEL: String = "SECTION 2, UNIT 2"

    /** Default Streak Counter Value */
    const val DEFAULT_STREAK_COUNT: String = "2520"

    /** Default Gem Balance Value */
    const val DEFAULT_GEM_COUNT: String = "26032"

    /** Action Button Label: Start Lesson */
    const val BTN_START_LABEL: String = "BOSHLASH"

    /** Action Button Label: Close Modal */
    const val BTN_CLOSE_LABEL: String = "YOPISH"

    /** Badge Status Text: Completed Stage */
    const val BADGE_COMPLETED_TEXT: String = "YAKUNLANGAN (3/3 ⭐)"

    /** Badge Status Text: Active Stage */
    const val BADGE_CURRENT_TEXT: String = "HOZIRGI BO'LIM"

    /** Badge Status Text: Locked Stage */
    const val BADGE_LOCKED_TEXT: String = "YOPILGAN BOSQICH"

    /** Course Title ID: Nouns / Grammar Fundamentals */
    const val COURSE_ID_NOUNS: String = "nouns"

    /** Course Title ID: Adjectives */
    const val COURSE_ID_ADJECTIVES: String = "adjectives"

    /** Course Title ID: Numerals */
    const val COURSE_ID_NUMERALS: String = "numerals"

    /** Course Title ID: Verbs */
    const val COURSE_ID_VERBS: String = "verbs"

    /** Course Title ID: Pronouns */
    const val COURSE_ID_PRONOUNS: String = "pronouns"

    /** Course Title ID: Prepositions */
    const val COURSE_ID_PREPOSITIONS: String = "prepositions"

    /**
     * Resolves human-readable course title from course ID.
     */
    fun resolveCourseTitle(courseId: String): String {
        return when (courseId.lowercase()) {
            COURSE_ID_NOUNS -> "Grammar Fundamentals"
            COURSE_ID_ADJECTIVES -> "Sifat (Adjectives)"
            COURSE_ID_NUMERALS -> "Son (Numerals)"
            COURSE_ID_VERBS -> "Fe'l va Zamonlar"
            COURSE_ID_PRONOUNS -> "Olmosh (Pronouns)"
            COURSE_ID_PREPOSITIONS -> "Predloglar"
            else -> "Express travel needs"
        }
    }
}
