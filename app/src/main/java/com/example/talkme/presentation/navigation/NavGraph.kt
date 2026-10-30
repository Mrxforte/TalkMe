package com.example.talkme.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.talkme.presentation.screens.courses.CoursesScreen
import com.example.talkme.presentation.screens.home.HomeScreen
import com.example.talkme.presentation.screens.lesson.LessonDetailScreen
import com.example.talkme.presentation.screens.lesson.LessonDetailViewModel
import com.example.talkme.presentation.screens.lesson.LessonResultScreen
import com.example.talkme.presentation.screens.lesson.LevelUnlockedScreen
import com.example.talkme.presentation.screens.lesson.QuizScreen
import com.example.talkme.presentation.screens.onboarding.OnboardingScreen
import com.example.talkme.presentation.screens.profile.ProfileScreen
import com.example.talkme.presentation.screens.repeat.RepeatScreen
import com.example.talkme.presentation.screens.results.ResultsScreen
import com.example.talkme.presentation.screens.settings.VoiceSettingsScreen
import com.example.talkme.presentation.screens.splash.SplashScreen
import com.example.talkme.presentation.screens.voicestudio.VoiceStudioScreen

/**
 * Main Navigation Graph for the TalkMe application.
 * Manages screen transitions, ViewModels injection, and bottom navigation tab states.
 *
 * Startup Flow:
 * 1. Splash Screen (2 seconds delay)
 * 2. Onboarding Welcome Screen (One-time welcome intro)
 * 3. Home Dashboard Screen (Main app interface)
 *
 * @param modifier Composable layout modifier.
 * @param navController Navigation Controller managing backstack transitions.
 * @param startDestination Initial screen destination route (default: Splash).
 */
@Composable
fun AppNavGraph(
    modifier: Modifier = Modifier,
    navController: NavHostController = rememberNavController(),
    startDestination: String = Screen.Splash.route,
) {
    NavHost(
        navController = navController,
        startDestination = startDestination,
        modifier = modifier,
    ) {
        // 1. Splash Screen (Startup)
        composable(route = Screen.Splash.route) {
            SplashScreen(
                onSplashFinished = {
                    navController.navigate(Screen.Onboarding.route) {
                        popUpTo(Screen.Splash.route) { inclusive = true }
                    }
                },
            )
        }

        // 2. Onboarding Welcome Screen (One-time welcome)
        composable(route = Screen.Onboarding.route) {
            OnboardingScreen(
                onStartClick = {
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.Onboarding.route) { inclusive = true }
                    }
                },
                onLoginClick = {
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.Onboarding.route) { inclusive = true }
                    }
                },
            )
        }

        // 3. Home Dashboard Screen
        composable(route = Screen.Home.route) {
            HomeScreen(
                onTabSelected = { tabIndex ->
                    navigateToTab(navController, tabIndex)
                },
                onAvatarClick = {
                    navController.navigate(Screen.Profile.route)
                },
                onContinueLessonClick = {
                    navController.navigate(Screen.LessonDetail.createRoute("present_continuous"))
                },
                onVocabularyClick = {
                    navController.navigate(Screen.Repeat.route)
                },
                onSkillClick = { skillType ->
                    navController.navigate(Screen.Courses.route)
                },
                onWeeklyTaskClick = {
                    navController.navigate(Screen.Courses.route)
                },
            )
        }

        // 4. Courses & Modules Catalog Screen
        composable(route = Screen.Courses.route) {
            CoursesScreen(
                onTabSelected = { tabIndex ->
                    navigateToTab(navController, tabIndex)
                },
                onBackClick = {
                    navController.popBackStack()
                },
                onSearchClick = {
                    // Open search
                },
                onContinueCatalogClick = {
                    navController.navigate(Screen.LessonDetail.createRoute("grammar_fundamentals"))
                },
            )
        }

        // 5. Spaced Repetition Vocabulary Practice Screen
        composable(route = Screen.Repeat.route) {
            RepeatScreen(
                onTabSelected = { tabIndex ->
                    navigateToTab(navController, tabIndex)
                },
                onStartRepeatClick = {
                    navController.navigate(Screen.Quiz.createRoute("vocab_repeat"))
                },
            )
        }

        // 6. Leaderboard & Results Analytics Screen
        composable(route = Screen.Results.route) {
            ResultsScreen(
                onTabSelected = { tabIndex ->
                    navigateToTab(navController, tabIndex)
                },
            )
        }

        // 7. Lesson Detail Rules Screen with English TextToSpeech Injection
        composable(route = Screen.LessonDetail.route) {
            val viewModel: LessonDetailViewModel = hiltViewModel()

            LessonDetailScreen(
                onBackClick = {
                    navController.popBackStack()
                },
                onStartQuizClick = {
                    navController.navigate(Screen.Quiz.createRoute("present_continuous"))
                },
                onPlayAudioClick = { englishText ->
                    viewModel.speak(englishText)
                },
            )
        }

        // 8. Quiz & Exercises Practice Screen
        composable(route = Screen.Quiz.route) {
            QuizScreen(
                onBackClick = {
                    navController.popBackStack()
                },
                onNextClick = {
                    navController.navigate(Screen.LessonResult.route) {
                        popUpTo(Screen.Quiz.route) { inclusive = true }
                    }
                },
                onReviewRuleClick = {
                    navController.popBackStack()
                },
            )
        }

        // 9. Lesson Result Screen
        composable(route = Screen.LessonResult.route) {
            LessonResultScreen(
                onReturnToCourseClick = {
                    navController.navigate(Screen.LevelUnlocked.route) {
                        popUpTo(Screen.Home.route)
                    }
                },
            )
        }

        // 10. Level Unlocked / Next Stage Screen
        composable(route = Screen.LevelUnlocked.route) {
            LevelUnlockedScreen(
                onStartNextLessonClick = {
                    navController.navigate(Screen.LessonDetail.createRoute("negative_sentences")) {
                        popUpTo(Screen.Courses.route)
                    }
                },
                onReturnToCourseClick = {
                    navController.navigate(Screen.Courses.route) {
                        popUpTo(Screen.Home.route)
                    }
                },
                onBackClick = {
                    navController.popBackStack()
                },
            )
        }

        // 11. User Profile & Results Analytics & Voice AI Settings Screen
        composable(route = Screen.Profile.route) {
            val viewModel: LessonDetailViewModel = hiltViewModel()

            ProfileScreen(
                onTabSelected = { tabIndex ->
                    navigateToTab(navController, tabIndex)
                },
                onOpenVoiceStudioClick = {
                    navController.navigate(Screen.VoiceStudio.route)
                },
                onOpenVoiceSettingsClick = {
                    navController.navigate(Screen.VoiceSettings.route)
                },
                onPlaySampleTtsClick = { text ->
                    viewModel.speak(text)
                },
            )
        }

        // 12. Voice AI Studio Screen
        composable(route = Screen.VoiceStudio.route) {
            val viewModel: LessonDetailViewModel = hiltViewModel()
            VoiceStudioScreen(
                onBackClick = {
                    navController.popBackStack()
                },
                onGenerateClick = { text, _, _ ->
                    viewModel.speak(text)
                },
            )
        }

        // 13. Voice AI Settings & Speech Testing Screen
        composable(route = Screen.VoiceSettings.route) {
            val viewModel: LessonDetailViewModel = hiltViewModel()
            VoiceSettingsScreen(
                onBackClick = {
                    navController.popBackStack()
                },
                onRunQuickTestClick = { text ->
                    viewModel.speak(text)
                },
            )
        }
    }
}

/**
 * Helper function for switching bottom navigation tabs cleanly without creating duplicate backstacks.
 */
private fun navigateToTab(navController: NavHostController, tabIndex: Int) {
    val targetRoute = when (tabIndex) {
        0 -> Screen.Home.route
        1 -> Screen.Courses.route
        2 -> Screen.Repeat.route
        3 -> Screen.Profile.route
        else -> Screen.Home.route
    }

    navController.navigate(targetRoute) {
        popUpTo(Screen.Home.route) {
            saveState = true
        }
        launchSingleTop = true
        restoreState = true
    }
}
