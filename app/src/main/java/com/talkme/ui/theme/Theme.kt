package com.talkme.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider

/**
 * Root Compose theme wrapper for the TalkMe application.
 * Supplies MaterialTheme color scheme, typography, and LocalDimensions.
 */
@Composable
fun TalkMeTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dimensions: Dimensions = Dimensions(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) TalkMeDarkColorScheme else TalkMeLightColorScheme

    CompositionLocalProvider(LocalDimensions provides dimensions) {
        MaterialTheme(
            colorScheme = colorScheme,
            typography = TalkMeMaterialTypography,
            content = content
        )
    }
}
