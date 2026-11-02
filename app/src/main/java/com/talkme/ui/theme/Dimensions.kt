package com.talkme.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * Centralized dimension, spacing, corner radius, and icon size tokens for TalkMe.
 * Strictly enforces Rule 1 of PROJECT_RULES.md: Access all .dp dimensions via LocalDimensions.current.
 */
@Immutable
data class Dimensions(
    val spaceXXSmall: Dp = 2.dp,
    val spaceExtraSmall: Dp = 4.dp,
    val spaceSmall: Dp = 8.dp,
    val spaceMediumSmall: Dp = 10.dp,
    val spaceMedium: Dp = 12.dp,
    val spaceMediumLarge: Dp = 14.dp,
    val spaceLarge: Dp = 16.dp,
    val spaceExtraLarge: Dp = 20.dp,
    val spaceXXLarge: Dp = 24.dp,
    val spaceHuge: Dp = 32.dp,
    val bottomBarSafeSpace: Dp = 96.dp,

    val radiusExtraSmall: Dp = 6.dp,
    val radiusSmall: Dp = 10.dp,
    val radiusMedium: Dp = 14.dp,
    val radiusLarge: Dp = 18.dp,
    val radiusExtraLarge: Dp = 24.dp,
    val radius3XL: Dp = 28.dp,
    val radiusFull: Dp = 999.dp,

    val borderThin: Dp = 1.dp,
    val borderThick: Dp = 2.dp,
    val border3D: Dp = 4.dp,

    val iconExtraSmall: Dp = 14.dp,
    val iconSmall: Dp = 16.dp,
    val iconMedium: Dp = 20.dp,
    val iconLarge: Dp = 24.dp,
    val iconExtraLarge: Dp = 32.dp,
    val iconHero: Dp = 48.dp,

    val avatarSizeSmall: Dp = 32.dp,
    val avatarSizeMedium: Dp = 44.dp,
    val avatarSizeLarge: Dp = 56.dp,
    val heroLogoSize: Dp = 96.dp,
    val heroIllustrationHeight: Dp = 220.dp,
    val categoryCardImageHeight: Dp = 168.dp,
    val levelNodeSize: Dp = 74.dp,
    val levelNodeInnerSize: Dp = 62.dp,
    val levelRowHeight: Dp = 132.dp,
    val bottomBarHeight: Dp = 68.dp,

    val buttonHeightStandard: Dp = 52.dp,
    val buttonHeightCompact: Dp = 40.dp,
    val searchInputHeight: Dp = 44.dp,
    val iconButtonSize: Dp = 40.dp,
    val iconButtonSmall: Dp = 32.dp,
    val letterTileSize: Dp = 48.dp,
    val crosswordCellSize: Dp = 38.dp,
    val progressBarHeight: Dp = 8.dp,
    val progressBarThick: Dp = 10.dp,

    // Semantic aliases for screen compatibility
    val screenPaddingHorizontal: Dp = 20.dp,
    val screenHorizontalPadding: Dp = 20.dp,
    val cardPadding: Dp = 16.dp,
    val spacingXs: Dp = 4.dp,
    val spacingSm: Dp = 8.dp,
    val spacingMd: Dp = 12.dp,
    val spacingLg: Dp = 16.dp,
    val cornerSmall: Dp = 10.dp,
    val cornerMd: Dp = 14.dp,
    val cornerMedium: Dp = 14.dp,
    val cornerLarge: Dp = 18.dp,
    val cornerExtraLarge: Dp = 24.dp,
    val strokeThin: Dp = 1.dp,
    val strokeMedium: Dp = 2.dp,
    val iconSizeMd: Dp = 20.dp,
    val iconSizeLg: Dp = 24.dp,
    val spaceTiny: Dp = 4.dp,
    val spaceSection: Dp = 24.dp
)

/**
 * CompositionLocal providing TalkMe Dimensions throughout the Compose hierarchy.
 */
val LocalDimensions = staticCompositionLocalOf { Dimensions() }
