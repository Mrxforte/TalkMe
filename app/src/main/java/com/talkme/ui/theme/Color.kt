package com.talkme.ui.theme

import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.graphics.Color

/**
 * Centralized semantic color tokens for the TalkMe Design System.
 * Strictly follows Rule 1 of PROJECT_RULES.md: Never hardcode hex colors inside UI screens or components.
 */
object TalkMeColors {
    val BrandPurple = Color(0xFF5E4B8B)
    val BrandPurpleDark = Color(0xFF4A3973)
    val ContainerPurpleLight = Color(0xFFF1EDFA)
    val SurfaceBackground = Color(0xFFFAFAFC)
    val SurfaceCard = Color(0xFFFFFFFF)
    val SurfaceSubtle = Color(0xFFF8F7FC)
    val BorderLight = Color(0xFFECEAF5)
    val BorderAccent = Color(0xFFD8D4EA)

    val TextPrimary = Color(0xFF1D1B20)
    val TextSecondary = Color(0xFF64748B)
    val TextMuted = Color(0xFF94A3B8)
    val TextOnBrand = Color(0xFFFFFFFF)

    val SuccessGreen = Color(0xFF27AE60)
    val ContainerGreenLight = Color(0xFFE8F8EE)
    val WarningAmber = Color(0xFFF59E0B)
    val ContainerAmberLight = Color(0xFFFFF4E5)
    val ErrorRose = Color(0xFFE11D48)
    val ContainerRoseLight = Color(0xFFFFF1F2)
}

/**
 * Material3 Light Color Scheme configured with TalkMe semantic design tokens.
 */
val TalkMeLightColorScheme = lightColorScheme(
    primary = TalkMeColors.BrandPurple,
    onPrimary = TalkMeColors.TextOnBrand,
    primaryContainer = TalkMeColors.ContainerPurpleLight,
    onPrimaryContainer = TalkMeColors.BrandPurpleDark,
    secondary = TalkMeColors.SuccessGreen,
    onSecondary = TalkMeColors.TextOnBrand,
    secondaryContainer = TalkMeColors.ContainerGreenLight,
    onSecondaryContainer = TalkMeColors.SuccessGreen,
    tertiary = TalkMeColors.WarningAmber,
    tertiaryContainer = TalkMeColors.ContainerAmberLight,
    error = TalkMeColors.ErrorRose,
    errorContainer = TalkMeColors.ContainerRoseLight,
    background = TalkMeColors.SurfaceBackground,
    onBackground = TalkMeColors.TextPrimary,
    surface = TalkMeColors.SurfaceCard,
    onSurface = TalkMeColors.TextPrimary,
    surfaceVariant = TalkMeColors.SurfaceSubtle,
    onSurfaceVariant = TalkMeColors.TextSecondary,
    outline = TalkMeColors.BorderLight,
    outlineVariant = TalkMeColors.BorderAccent
)

/**
 * Material3 Dark Color Scheme fallback for TalkMe.
 */
val TalkMeDarkColorScheme = darkColorScheme(
    primary = TalkMeColors.BrandPurple,
    onPrimary = TalkMeColors.TextOnBrand,
    primaryContainer = TalkMeColors.BrandPurpleDark,
    secondary = TalkMeColors.SuccessGreen
)
