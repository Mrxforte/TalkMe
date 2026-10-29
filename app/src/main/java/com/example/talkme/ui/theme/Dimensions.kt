package com.example.talkme.ui.theme

import androidx.compose.runtime.Composable
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * Centralized Design System Dimensions scale for the TalkMe application.
 *
 * Eliminates hardcoded DP values inside Composable layouts.
 */
data class Dimensions(
    val paddingNone: Dp = 0.dp,
    val borderThin: Dp = 1.dp,
    val paddingMicro: Dp = 2.dp,
    val paddingExtraSmall: Dp = 4.dp,
    val paddingSmall: Dp = 8.dp,
    val paddingMedium: Dp = 12.dp,
    val paddingLarge: Dp = 16.dp,
    val paddingExtraLarge: Dp = 20.dp,
    val paddingHuge: Dp = 24.dp,

    val iconSmall: Dp = 16.dp,
    val iconMedium: Dp = 20.dp,
    val iconNavTab: Dp = 22.dp,
    val iconLarge: Dp = 24.dp,
    val iconExtraLarge: Dp = 38.dp,
    val iconHuge: Dp = 48.dp,

    val cornerSmall: Dp = 10.dp,
    val cornerMedium: Dp = 16.dp,
    val cornerLarge: Dp = 20.dp,
    val cornerExtraLarge: Dp = 24.dp,
    val cornerCircle: Dp = 100.dp,

    val buttonHeight: Dp = 48.dp,
    val avatarSize: Dp = 36.dp,
    val logoSize: Dp = 76.dp,
)

val LocalDimensions = staticCompositionLocalOf { Dimensions() }

val MaterialThemeDimensions: Dimensions
    @Composable
    @ReadOnlyComposable
    get() = LocalDimensions.current
