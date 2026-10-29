package com.example.talkme.presentation.navigation

/**
 * Sealed class defining type-safe screen routes for the TalkMe application navigation graph.
 */
sealed class Screen(val route: String) {
    /** Splash intro screen route */
    object Splash : Screen("splash")

    /** Onboarding welcome screen route */
    object Onboarding : Screen("onboarding")

    /** Main home dashboard screen route */
    object Home : Screen("home")

    /** Courses and lessons catalog screen route */
    object Courses : Screen("courses")

    /** Vocabulary repetition and spaced practice screen route */
    object Repeat : Screen("repeat")

    /** Leaderboard and learning results screen route */
    object Results : Screen("results")

    /** Detailed lesson rules and examples screen route */
    object LessonDetail : Screen("lesson_detail/{lessonId}") {
        fun createRoute(lessonId: String) = "lesson_detail/$lessonId"
    }

    /** Quiz and interactive exercise screen route */
    object Quiz : Screen("quiz/{lessonId}") {
        fun createRoute(lessonId: String) = "quiz/$lessonId"
    }

    /** Lesson completion summary and score screen route */
    object LessonResult : Screen("lesson_result")

    /** Next stage level unlocked celebration screen route */
    object LevelUnlocked : Screen("level_unlocked")

    /** User profile and achievements screen route */
    object Profile : Screen("profile")
}
