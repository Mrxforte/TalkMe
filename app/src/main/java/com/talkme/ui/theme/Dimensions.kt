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
    val spaceExtraSmall: Dp = 4.dp,
    val spaceSmall: Dp = 8.dp,
    val spaceMedium: Dp = 12.dp,
    val spaceLarge: Dp = 16.dp,
    val spaceExtraLarge: Dp = 20.dp,
    val spaceXXLarge: Dp = 24.dp,

    val radiusSmall: Dp = 10.dp,
    val radiusMedium: Dp = 14.dp,
    val radiusLarge: Dp = 18.dp,
    val radiusExtraLarge: Dp = 24.dp,
    val radiusFull: Dp = 999.dp,

    val borderThin: Dp = 1.dp,
    val borderThick: Dp = 2.dp,

    val iconSmall: Dp = 16.dp,
    val iconMedium: Dp = 20.dp,
    val iconLarge: Dp = 24.dp,

    val buttonHeightStandard: Dp = 52.dp,
    val buttonHeightCompact: Dp = 40.dp,
    val iconButtonSize: Dp = 40.dp,
    val letterTileSize: Dp = 48.dp,
    val progressBarHeight: Dp = 8.dp
)

/**
 * CompositionLocal providing TalkMe Dimensions throughout the Compose hierarchy.
 */
val LocalDimensions = staticCompositionLocalOf { Dimensions() }
