package com.example.talkme.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

/**
 * Custom Typography Hierarchy for the TalkMe Application.
 *
 * Centralizes all font styles, font sizes, line heights, letter spacings, and font weights
 * to prevent hardcoded font styling inside Composable functions.
 */
object AppTypography {
    /** Main branding headline title used on Splash screen (22sp Bold) */
    val SplashTitle = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 22.sp,
        lineHeight = 28.sp,
    )

    /** Subtitle description text used on Splash screen (13sp Normal) */
    val SplashSubtitle = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 13.sp,
        lineHeight = 18.sp,
    )

    /** Small footer legal/note text on Splash screen (11sp Normal, 1.2sp letter spacing) */
    val SplashFooter = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 11.sp,
        lineHeight = 16.sp,
        letterSpacing = 1.2.sp,
    )

    /** Primary user greeting title on Home Dashboard and main page headers (24sp Bold) */
    val GreetingTitle = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 24.sp,
        lineHeight = 30.sp,
    )

    /** Greeting tagline/subtitle on Home Dashboard and main page headers (13sp Normal) */
    val GreetingSubtitle = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 13.sp,
        lineHeight = 18.sp,
    )

    /** Main lesson topic heading inside lesson cards and detail views (20sp Bold) */
    val LessonTitle = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 20.sp,
        lineHeight = 26.sp,
    )

    /** Lesson summary explanation text (13sp Normal) */
    val LessonSubtitle = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 13.sp,
        lineHeight = 18.sp,
    )

    /** Small lesson metadata details such as duration and rule topics (12sp Normal) */
    val LessonDetails = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 12.sp,
        lineHeight = 16.sp,
    )

    /** Uppercase tag category indicator inside structure boxes and formula headers (11sp Bold) */
    val LessonTag = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 11.sp,
        letterSpacing = 1.sp,
    )

    /** Primary heading title for banner cards such as vocabulary repetition (15sp Bold) */
    val BannerTitle = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 15.sp,
        lineHeight = 20.sp,
    )

    /** Subtitle description text for vocabulary and feature banners (12sp Normal) */
    val BannerSubtitle = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 12.sp,
        lineHeight = 16.sp,
    )

    /** Section heading title for list groups (16sp Bold) */
    val SectionTitle = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 16.sp,
        lineHeight = 22.sp,
    )

    /** Action text link for section headers such as 'See All' (13sp Medium) */
    val SectionAction = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Medium,
        fontSize = 13.sp,
    )

    /** Primary title text for list item cards and skill modules (14sp Bold) */
    val CardTitle = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 14.sp,
        lineHeight = 18.sp,
    )

    /** Secondary subtitle text for list item cards and skill modules (11sp Normal) */
    val CardSubtitle = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 11.sp,
        lineHeight = 15.sp,
    )

    /** Chip and badge label text for level indicators and streak counts (11sp SemiBold) */
    val BadgeText = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = 11.sp,
    )

    /** Inactive bottom navigation tab label text (11sp Normal) */
    val BottomNavLabel = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 11.sp,
    )

    /** Active bottom navigation tab label text (11sp SemiBold) */
    val BottomNavLabelActive = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = 11.sp,
    )

    /** Text style for primary action buttons (14sp SemiBold) */
    val ButtonText = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = 14.sp,
    )

    /** Top bar app branding title style (15sp SemiBold) */
    val HeaderAppTitle = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = 15.sp,
    )

    /** Text style for user profile avatar initials (15sp Bold) */
    val AvatarText = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 15.sp,
    )
}

/**
 * Material3 Typography mapping to Custom AppTypography tokens.
 */
val Typography = Typography(
    headlineLarge = AppTypography.GreetingTitle,
    headlineMedium = AppTypography.SplashTitle,
    titleLarge = AppTypography.LessonTitle,
    titleMedium = AppTypography.SectionTitle,
    titleSmall = AppTypography.CardTitle,
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
    ),
    bodyMedium = AppTypography.SplashSubtitle,
    bodySmall = AppTypography.LessonDetails,
    labelLarge = AppTypography.ButtonText,
    labelMedium = AppTypography.SectionAction,
    labelSmall = AppTypography.BadgeText,
)
