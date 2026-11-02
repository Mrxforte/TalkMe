package com.talkme.ui.theme

import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.graphics.Color

/**
 * Centralized semantic color tokens for the TalkMe Design System.
 * Extracted pixel-for-pixel from the React + TypeScript reference implementation
 * and aligned with Rule 1 of PROJECT_RULES.md.
 */
object TalkMeColors {
    // Brand Purple Palette (#5E4B8B, #7C4DFF, #43326B, #F1EDFA, #F3EFFC)
    val BrandPurple = Color(0xFF5E4B8B)
    val BrandPurpleDark = Color(0xFF4A3973)
    val BrandPurpleDeep = Color(0xFF43326B)
    val BrandPurpleHover = Color(0xFF4E3D75)
    val BrandPurpleBright = Color(0xFF7C4DFF)
    val ContainerPurpleLight = Color(0xFFF1EDFA)
    val BadgePurpleBg = Color(0xFFF3EFFC)
    val ChipPurpleSubtle = Color(0xFFF4F1FA)

    // Emerald & Success Green Palette (#27AE60, #2E7D32, #059669, #E8F8EE, #D2F5DC)
    val SuccessGreen = Color(0xFF27AE60)
    val SuccessGreenDark = Color(0xFF2E7D32)
    val ContainerGreenLight = Color(0xFFE8F8EE)
    val AvatarGreenBg = Color(0xFFD2F5DC)
    val AvatarGreenText = Color(0xFF2E7D32)
    val Emerald600 = Color(0xFF059669)
    val Emerald700 = Color(0xFF047857)
    val Emerald800 = Color(0xFF065F46)
    val Emerald950 = Color(0xFF022C22)
    val Emerald50 = Color(0xFFECFDF5)
    val Emerald100 = Color(0xFFD1FAE5)
    val Emerald200 = Color(0xFFA7F3D0)
    val Emerald300 = Color(0xFF6EE7B7)
    val Emerald400 = Color(0xFF34D399)
    val Teal400 = Color(0xFF2DD4BF)

    // Indigo & Slate Framework Palette (#4F46E5, #1E1B4B, #312E81, #064E3B)
    val Indigo600 = Color(0xFF4F46E5)
    val Indigo700 = Color(0xFF4338CA)
    val Indigo800 = Color(0xFF3730A3)
    val Indigo950 = Color(0xFF1E1B4B)
    val IndigoMid = Color(0xFF312E81)
    val EmeraldDeep = Color(0xFF064E3B)
    val Indigo50 = Color(0xFFEEF2FF)
    val Indigo100 = Color(0xFFE0E7FF)
    val Indigo200 = Color(0xFFC7D2FE)
    val Indigo300 = Color(0xFFA5B4FC)

    // Amber, Streak & Warning Palette (#FF9600, #F59E0B, #FFF4E5, #FFE0B2)
    val StreakOrange = Color(0xFFFF9600)
    val WarningAmber = Color(0xFFF59E0B)
    val Amber600 = Color(0xFFD97706)
    val Amber700 = Color(0xFFB45309)
    val Amber800 = Color(0xFF92400E)
    val Amber950 = Color(0xFF451A03)
    val Amber300 = Color(0xFFFCD34D)
    val Amber400 = Color(0xFFFBBF24)
    val ContainerAmberLight = Color(0xFFFFF4E5)
    val BorderAmberLight = Color(0xFFFFE0B2)
    val Amber50 = Color(0xFFFFFBEB)
    val Amber100 = Color(0xFFFEF3C7)
    val Amber200 = Color(0xFFFDE68A)

    // Sky, Teal & Category Accent Colors
    val Sky500 = Color(0xFF0EA5E9)
    val Sky600 = Color(0xFF0284C7)
    val Sky50 = Color(0xFFF0F9FF)
    val Sky100 = Color(0xFFE0F2FE)
    val Orange600 = Color(0xFFEA580C)
    val Orange100 = Color(0xFFFFEDD5)
    val Violet600 = Color(0xFF7C3AED)
    val Violet100 = Color(0xFFEDE9FE)
    val Teal600 = Color(0xFF0D9488)
    val Teal100 = Color(0xFFCCFBF1)
    val Purple600 = Color(0xFF9333EA)
    val Purple100 = Color(0xFFF3E8FF)

    // Error & Rose Palette (#E11D48, #FFF1F2)
    val ErrorRose = Color(0xFFE11D48)
    val Rose500 = Color(0xFFF43F5E)
    val Rose600 = Color(0xFFE11D48)
    val Rose700 = Color(0xFFBE123C)
    val ContainerRoseLight = Color(0xFFFFF1F2)
    val Rose200 = Color(0xFFFECDD3)

    // Surface, Background & Border Tokens (#FAFAFC, #FFFFFF, #F0EFF5, #EBE8F3)
    val SurfaceBackground = Color(0xFFFAFAFC)
    val SurfaceCard = Color(0xFFFFFFFF)
    val SurfaceSubtle = Color(0xFFF8F7FC)
    val SurfaceSlate50 = Color(0xFFF8FAFC)
    val SurfaceSlate100 = Color(0xFFF1F5F9)
    val SurfaceSlate900 = Color(0xFF0F172A)
    val SurfaceSlate950 = Color(0xFF020617)
    val ProductImageBg = Color(0xFFF7F6FB)
    val BorderLight = Color(0xFFF0EFF5)
    val BorderCard = Color(0xFFEBE8F3)
    val BorderSubtle = Color(0xFFF2F1F6)
    val BorderSlate200 = Color(0xFFE2E8F0)
    val BorderAccent = Color(0xFFD8D4EA)

    // Text Hierarchy Tokens (#1D1B20, #757575, #9E9E9E)
    val TextPrimary = Color(0xFF1D1B20)
    val TextSlate900 = Color(0xFF0F172A)
    val TextSlate800 = Color(0xFF1E293B)
    val TextSlate700 = Color(0xFF334155)
    val TextSlate600 = Color(0xFF475569)
    val TextSecondary = Color(0xFF757575)
    val TextMuted = Color(0xFF9E9E9E)
    val TextOnBrand = Color(0xFFFFFFFF)

    // 3D Duolingo Nature Landscape & Node Tokens
    val LandscapeSkyTop = Color(0xFFBAE6FD)
    val LandscapeSkyBottom = Color(0xFFE0F2FE)
    val LandscapeMeadowLight = Color(0xFF86EFAC)
    val LandscapeMeadowMid = Color(0xFF4ADE80)
    val LandscapeMeadowDark = Color(0xFF22C55E)
    val LandscapeForestDark = Color(0xFF15803D)
    val LandscapeRiverBlue = Color(0xFF38BDF8)
    val LandscapeRiverDeep = Color(0xFF0284C7)
    val LandscapePathStone = Color(0xFFE2E8F0)
    val LandscapePathShadow = Color(0xFFCBD5E1)
    val NodeLockedTop = Color(0xFFE2E8F0)
    val NodeLockedBottom = Color(0xFF94A3B8)
    val NodeGoldTop = Color(0xFFFBBF24)
    val NodeGoldBottom = Color(0xFFD97706)
    val NodeGreenTop = Color(0xFF58CC02)
    val NodeGreenBottom = Color(0xFF46A302)
    val NodePurpleTop = Color(0xFF7C4DFF)
    val NodePurpleBottom = Color(0xFF5E4B8B)
}

// Top-level semantic aliases for full compatibility across all screens
val PrimaryPurple = TalkMeColors.BrandPurple
val PrimaryPurpleLight = TalkMeColors.ContainerPurpleLight
val SuccessGreen = TalkMeColors.SuccessGreen
val SuccessGreenBg = TalkMeColors.ContainerGreenLight
val BrandBlue500 = TalkMeColors.Sky500
val BrandBlue600 = TalkMeColors.Sky600
val ContainerPurpleLight = TalkMeColors.ContainerPurpleLight
val ContainerGreenLight = TalkMeColors.ContainerGreenLight
val AvatarGreenBg = TalkMeColors.AvatarGreenBg
val AvatarGreenText = TalkMeColors.AvatarGreenText

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
    onSecondaryContainer = TalkMeColors.SuccessGreenDark,
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
