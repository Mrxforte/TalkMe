package com.example.talkme.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions

/**
 * Universal Clickable Subtopic Card Component displaying an individual topic item
 * with a prominent surface background, soft border, and rounded purple indicator dot.
 *
 * @param text Subtopic description text.
 * @param onClick Callback invoked when user taps on the subtopic card.
 * @param modifier Composable layout modifier.
 * @param dotColor Color of the rounded left indicator dot (default: Primary Purple).
 * @param containerColor Background color of the card container.
 * @param borderColor Stroke border color.
 */
@Composable
fun TalkMeSubtopicCard(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    dotColor: Color = MaterialTheme.colorScheme.primary,
    containerColor: Color = MaterialTheme.colorScheme.surface,
    borderColor: Color = MaterialTheme.colorScheme.outline,
) {
    val dimensions = LocalDimensions.current

    Box(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(dimensions.cornerMedium))
            .background(containerColor)
            .border(1.dp, borderColor, RoundedCornerShape(dimensions.cornerMedium))
            .clickable(onClick = onClick)
            .padding(dimensions.paddingMedium),
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.Top,
        ) {
            Box(
                modifier = Modifier
                    .padding(top = dimensions.paddingExtraSmall)
                    .size(dimensions.paddingSmall)
                    .clip(CircleShape)
                    .background(dotColor),
            )

            Spacer(modifier = Modifier.width(dimensions.paddingMedium))

            Text(
                text = text,
                style = AppTypography.CardSubtitle.copy(
                    color = MaterialTheme.colorScheme.onBackground,
                ),
            )
        }
    }
}
