package com.example.talkme.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import com.example.talkme.ui.theme.LocalDimensions

/**
 * Universal Smooth Progress Bar Component.
 *
 * @param progress Progress fraction between 0.0f and 1.0f.
 * @param modifier Layout modifier.
 * @param trackColor Inactive track background color.
 * @param progressColor Active progress fill color.
 */
@Composable
fun TalkMeProgressBar(
    progress: Float,
    modifier: Modifier = Modifier,
    trackColor: Color = MaterialTheme.colorScheme.surfaceVariant,
    progressColor: Color = MaterialTheme.colorScheme.primary,
) {
    val dimensions = LocalDimensions.current

    val safeProgress = progress.coerceIn(0f, 1f)

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(dimensions.paddingSmall)
            .clip(RoundedCornerShape(dimensions.cornerCircle))
            .background(trackColor),
    ) {
        Box(
            modifier = Modifier
                .fillMaxHeight()
                .fillMaxWidth(safeProgress)
                .clip(RoundedCornerShape(dimensions.cornerCircle))
                .background(progressColor),
        )
    }
}
