package com.talkme.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.talkme.domain.voice.engine.EngineSelectionMode
import com.talkme.domain.voice.engine.VoiceCharacterProfile
import com.talkme.presentation.screens.courses.CourseLevelsScreen
import com.talkme.presentation.screens.courses.CoursesScreen
import com.talkme.presentation.screens.home.HomeScreen
import com.talkme.presentation.screens.lesson.LessonDetailScreen
import com.talkme.presentation.screens.lesson.QuizScreen
import com.talkme.presentation.screens.onboarding.OnboardingScreen
import com.talkme.presentation.screens.profile.ProfileScreen
import com.talkme.presentation.screens.repeat.RepeatScreen
import com.talkme.presentation.screens.results.LessonResultScreen
import com.talkme.presentation.screens.results.LevelUnlockedScreen
import com.talkme.presentation.screens.settings.VoiceSettingsScreen
import com.talkme.presentation.screens.splash.SplashScreen
import com.talkme.presentation.screens.voicestudio.VoiceStudioScreen

/**
 * Type-safe Navigation Compose route definitions matching the full TalkMe screen hierarchy.
 */
sealed class TalkMeScreenRoute(val route: String) {
    data object Splash : TalkMeScreenRoute("splash")
    data object Onboarding : TalkMeScreenRoute("onboarding")
    data object Home : TalkMeScreenRoute("home")
    data object Courses : TalkMeScreenRoute("courses")
    data object CourseLevels : TalkMeScreenRoute("course_levels/{courseId}") {
        fun createRoute(courseId: String): String = "course_levels/$courseId"
    }
    data object LessonDetail : TalkMeScreenRoute("lesson/{courseId}/{lessonId}") {
        fun createRoute(courseId: String, lessonId: String): String = "lesson/$courseId/$lessonId"
    }
    data object Quiz : TalkMeScreenRoute("quiz")
    data object LessonResult : TalkMeScreenRoute("results/{lessonId}") {
        fun createRoute(lessonId: String): String = "results/$lessonId"
    }
    data object LevelUnlocked : TalkMeScreenRoute("level_unlocked")
    data object Repeat : TalkMeScreenRoute("repeat")
    data object Profile : TalkMeScreenRoute("profile")
    data object VoiceStudio : TalkMeScreenRoute("voicestudio")
    data object VoiceSettings : TalkMeScreenRoute("settings")
}

/**
 * Central Jetpack Compose Navigation Host wiring all TalkMe screens together
 * and synchronizing the global TTS [EngineSelectionMode] (Gemini 3.8 CLOUD_FIRST vs Free TTS LOCAL_FIRST)
 * and 6 [VoiceCharacterProfile] personas across the entire application.
 */
@Composable
fun TalkMeNavGraph(
    navController: NavHostController,
    onPlaySampleVoice: (text: String) -> Unit = {},
    modifier: Modifier = Modifier
) {
    var globalEngineMode by remember { mutableStateOf(EngineSelectionMode.CLOUD_FIRST) }
    var globalCharacterProfile by remember { mutableStateOf(VoiceCharacterProfile.ADULT_MALE) }

    NavHost(
        navController = navController,
        startDestination = TalkMeScreenRoute.Splash.route,
        modifier = modifier
    ) {
        composable(TalkMeScreenRoute.Splash.route) {
            SplashScreen(
                onSplashCompleted = {
                    navController.navigate(TalkMeScreenRoute.Onboarding.route) {
                        popUpTo(TalkMeScreenRoute.Splash.route) { inclusive = true }
                    }
                }
            )
        }

        composable(TalkMeScreenRoute.Onboarding.route) {
            OnboardingScreen(
                onStartLearningClick = {
                    navController.navigate(TalkMeScreenRoute.Home.route) {
                        popUpTo(TalkMeScreenRoute.Onboarding.route) { inclusive = true }
                    }
                }
            )
        }

        composable(TalkMeScreenRoute.Home.route) {
            HomeScreen(
                onOpenLessonClick = { courseId, lessonId ->
                    navController.navigate(TalkMeScreenRoute.LessonDetail.createRoute(courseId, lessonId))
                },
                onOpenCoursesClick = {
                    navController.navigate(TalkMeScreenRoute.Courses.route)
                },
                onOpenRepeatClick = {
                    navController.navigate(TalkMeScreenRoute.Repeat.route)
                },
                onOpenVoiceStudioClick = {
                    navController.navigate(TalkMeScreenRoute.VoiceStudio.route)
                },
                onOpenVoiceSettingsClick = {
                    navController.navigate(TalkMeScreenRoute.VoiceSettings.route)
                },
                onOpenProfileClick = {
                    navController.navigate(TalkMeScreenRoute.Profile.route)
                },
                onOpenQuizClick = {
                    navController.navigate(TalkMeScreenRoute.Quiz.route)
                }
            )
        }

        composable(TalkMeScreenRoute.Courses.route) {
            CoursesScreen(
                onBackClick = { navController.popBackStack() },
                onCourseSelected = { courseId, _ ->
                    navController.navigate(TalkMeScreenRoute.CourseLevels.createRoute(courseId))
                },
                onNavigateHome = {
                    navController.navigate(TalkMeScreenRoute.Home.route) {
                        popUpTo(TalkMeScreenRoute.Home.route) { inclusive = true }
                    }
                },
                onNavigateRepeat = {
                    navController.navigate(TalkMeScreenRoute.Repeat.route)
                },
                onNavigateProfile = {
                    navController.navigate(TalkMeScreenRoute.Profile.route)
                }
            )
        }

        composable(TalkMeScreenRoute.CourseLevels.route) { backStackEntry ->
            val courseId = backStackEntry.arguments?.getString("courseId") ?: "grammar_fundamentals"
            CourseLevelsScreen(
                courseId = courseId,
                onBackClick = { navController.popBackStack() },
                onStartLesson = { cId, lId ->
                    navController.navigate(TalkMeScreenRoute.LessonDetail.createRoute(cId, lId))
                },
                onNavigateHome = {
                    navController.navigate(TalkMeScreenRoute.Home.route) {
                        popUpTo(TalkMeScreenRoute.Home.route) { inclusive = true }
                    }
                },
                onNavigateCourses = {
                    navController.navigate(TalkMeScreenRoute.Courses.route)
                },
                onNavigateRepeat = {
                    navController.navigate(TalkMeScreenRoute.Repeat.route)
                },
                onNavigateProfile = {
                    navController.navigate(TalkMeScreenRoute.Profile.route)
                }
            )
        }

        composable(TalkMeScreenRoute.LessonDetail.route) { backStackEntry ->
            val lessonId = backStackEntry.arguments?.getString("lessonId") ?: "lesson_01_hello_a0"
            LessonDetailScreen(
                initialLessonId = lessonId,
                onBackClick = { navController.popBackStack() },
                onOpenQuiz = {
                    navController.navigate(TalkMeScreenRoute.Quiz.route)
                },
                onCompleteLesson = { completedLessonId ->
                    navController.navigate(TalkMeScreenRoute.LessonResult.createRoute(completedLessonId))
                },
                onOpenVoiceSettings = {
                    navController.navigate(TalkMeScreenRoute.VoiceSettings.route)
                }
            )
        }

        composable(TalkMeScreenRoute.Quiz.route) {
            QuizScreen(
                onBackClick = { navController.popBackStack() },
                onFinishQuiz = {
                    navController.navigate(TalkMeScreenRoute.LessonResult.createRoute("lesson_present_continuous"))
                },
                onReviewRules = {
                    navController.popBackStack()
                }
            )
        }

        composable(TalkMeScreenRoute.LessonResult.route) {
            LessonResultScreen(
                onBackClick = { navController.popBackStack() },
                onShareClick = { /* User share intent */ },
                onOpenCourseLevels = {
                    navController.navigate(TalkMeScreenRoute.CourseLevels.createRoute("grammar_fundamentals"))
                },
                onOpenLevelUnlocked = {
                    navController.navigate(TalkMeScreenRoute.LevelUnlocked.route)
                },
                onOpenCourses = {
                    navController.navigate(TalkMeScreenRoute.Courses.route)
                }
            )
        }

        composable(TalkMeScreenRoute.LevelUnlocked.route) {
            LevelUnlockedScreen(
                onBackClick = { navController.popBackStack() },
                onStartNextLesson = {
                    navController.navigate(TalkMeScreenRoute.LessonDetail.createRoute("grammar_fundamentals", "lesson_present_continuous"))
                },
                onReturnToCourse = {
                    navController.navigate(TalkMeScreenRoute.CourseLevels.createRoute("grammar_fundamentals"))
                }
            )
        }

        composable(TalkMeScreenRoute.Repeat.route) {
            RepeatScreen(
                onBackClick = { navController.popBackStack() },
                onNavigateHome = {
                    navController.navigate(TalkMeScreenRoute.Home.route) {
                        popUpTo(TalkMeScreenRoute.Home.route) { inclusive = true }
                    }
                },
                onNavigateCourses = {
                    navController.navigate(TalkMeScreenRoute.Courses.route)
                },
                onNavigateProfile = {
                    navController.navigate(TalkMeScreenRoute.Profile.route)
                }
            )
        }

        composable(TalkMeScreenRoute.Profile.route) {
            ProfileScreen(
                onBackClick = { navController.popBackStack() },
                onNavigateHome = {
                    navController.navigate(TalkMeScreenRoute.Home.route) {
                        popUpTo(TalkMeScreenRoute.Home.route) { inclusive = true }
                    }
                },
                onNavigateCourses = {
                    navController.navigate(TalkMeScreenRoute.Courses.route)
                },
                onNavigateRepeat = {
                    navController.navigate(TalkMeScreenRoute.Repeat.route)
                },
                onOpenVoiceStudio = {
                    navController.navigate(TalkMeScreenRoute.VoiceStudio.route)
                },
                onOpenVoiceSettings = {
                    navController.navigate(TalkMeScreenRoute.VoiceSettings.route)
                }
            )
        }

        composable(TalkMeScreenRoute.VoiceStudio.route) {
            VoiceStudioScreen(
                selectedMode = globalEngineMode,
                selectedProfile = globalCharacterProfile,
                onSelectMode = { mode -> globalEngineMode = mode },
                onSelectProfile = { profile -> globalCharacterProfile = profile },
                onAuditionVoice = { profile, text ->
                    globalCharacterProfile = profile
                    onPlaySampleVoice(text)
                },
                onBackClick = { navController.popBackStack() }
            )
        }

        composable(TalkMeScreenRoute.VoiceSettings.route) {
            VoiceSettingsScreen(
                initialMode = globalEngineMode,
                initialCharacter = globalCharacterProfile,
                onModeChanged = { mode -> globalEngineMode = mode },
                onCharacterSelected = { profile -> globalCharacterProfile = profile },
                onAuditionCharacter = { profile, mode ->
                    globalCharacterProfile = profile
                    globalEngineMode = mode
                    onPlaySampleVoice(profile.displayNameUz)
                },
                onPlaySampleStory = { storyText, profile, mode ->
                    globalCharacterProfile = profile
                    globalEngineMode = mode
                    onPlaySampleVoice(storyText)
                },
                onBackClick = { navController.popBackStack() }
            )
        }
    }
}

