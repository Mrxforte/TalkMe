package com.talkme.presentation.screens.results

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import com.talkme.R
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.LocalDimensions

/**
 * Next stage level unlocked celebration screen (`LevelUnlockedScreen.kt`)
 * per Section 2 Item 7 of PROJECT_RULES.md.
 */
@Composable
fun LevelUnlockedScreen(
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(dims.spaceLarge)
    ) {
        Text(
            text = stringResource(R.string.result_congrats_title),
            style = AppTypography.HeadlineMedium,
            color = MaterialTheme.colorScheme.onBackground
        )
    }
}
