package com.talkme.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

/**
 * Centralized typography scale for the TalkMe application.
 * Matches Plus Jakarta Sans / SansSerif hierarchy from the React reference implementation.
 * Strictly enforces Rule 1 of PROJECT_RULES.md: Never hardcode .sp or FontWeight in UI components.
 */
object AppTypography {
    val HeroDisplay = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Black,
        fontSize = 30.sp,
        lineHeight = 36.sp,
        letterSpacing = (-0.5).sp
    )

    val DisplayLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Black,
        fontSize = 26.sp,
        lineHeight = 32.sp,
        letterSpacing = (-0.3).sp
    )

    val DisplayMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.ExtraBold,
        fontSize = 24.sp,
        lineHeight = 30.sp,
        letterSpacing = (-0.2).sp
    )

    val HeadlineLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.ExtraBold,
        fontSize = 22.sp,
        lineHeight = 28.sp
    )

    val HeadlineMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.ExtraBold,
        fontSize = 20.sp,
        lineHeight = 26.sp
    )

    val TitleLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.ExtraBold,
        fontSize = 18.sp,
        lineHeight = 24.sp
    )

    val TitleMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Bold,
        fontSize = 16.sp,
        lineHeight = 22.sp
    )

    val TitleSmall = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Bold,
        fontSize = 14.sp,
        lineHeight = 20.sp
    )

    val BodyLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Medium,
        fontSize = 15.sp,
        lineHeight = 22.sp
    )

    val BodyMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 20.sp
    )

    val BodySmall = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Medium,
        fontSize = 12.sp,
        lineHeight = 18.sp
    )

    val LabelLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.ExtraBold,
        fontSize = 14.sp,
        lineHeight = 18.sp
    )

    val LabelMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Bold,
        fontSize = 12.sp,
        lineHeight = 16.sp
    )

    val LabelSmall = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Bold,
        fontSize = 11.sp,
        lineHeight = 14.sp
    )

    val BadgeMicro = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.ExtraBold,
        fontSize = 10.sp,
        lineHeight = 13.sp,
        letterSpacing = 0.6.sp
    )

    val FormulaMono = TextStyle(
        fontFamily = FontFamily.Monospace,
        fontWeight = FontWeight.ExtraBold,
        fontSize = 15.sp,
        lineHeight = 20.sp
    )

    // Semantic aliases used across screens
    val sectionHeader: TextStyle = TitleLarge
    val bodyBold: TextStyle = TitleSmall
    val bodyMedium: TextStyle = BodyMedium
    val captionBold: TextStyle = LabelMedium
    val caption: TextStyle = BodySmall
}

/**
 * Material3 Typography mapped to AppTypography tokens.
 */
val TalkMeMaterialTypography = Typography(
    displayLarge = AppTypography.DisplayLarge,
    displayMedium = AppTypography.DisplayMedium,
    headlineLarge = AppTypography.HeadlineLarge,
    headlineMedium = AppTypography.HeadlineMedium,
    titleLarge = AppTypography.TitleLarge,
    titleMedium = AppTypography.TitleMedium,
    titleSmall = AppTypography.TitleSmall,
    bodyLarge = AppTypography.BodyLarge,
    bodyMedium = AppTypography.BodyMedium,
    bodySmall = AppTypography.BodySmall,
    labelLarge = AppTypography.LabelLarge,
    labelMedium = AppTypography.LabelMedium,
    labelSmall = AppTypography.LabelSmall
)
