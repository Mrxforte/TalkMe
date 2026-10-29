package com.example.talkme.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.example.talkme.ui.theme.LocalDimensions

/**
 * Universal Card Container Component providing standardized borders, clipping, and background colors.
 *
 * @param modifier Composable modifier for layout configuration.
 * @param containerColor Surface background color.
 * @param borderColor Border stroke color.
 * @param cornerRadius Rounded corner size.
 * @param onClick Optional click handler.
 * @param content Inner composable content slot.
 */
@Composable
fun TalkMeCard(
    modifier: Modifier = Modifier,
    containerColor: Color = MaterialTheme.colorScheme.surface,
    borderColor: Color = MaterialTheme.colorScheme.outline,
    cornerRadius: Dp = LocalDimensions.current.cornerMedium,
    onClick: (() -> Unit)? = null,
    content: @Composable BoxScope.() -> Unit,
) {
    val dimensions = LocalDimensions.current

    val cardModifier = modifier
        .fillMaxWidth()
        .clip(RoundedCornerShape(cornerRadius))
        .background(containerColor)
        .border(1.dp, borderColor, RoundedCornerShape(cornerRadius))
        .run {
            if (onClick != null) clickable(onClick = onClick) else this
        }
        .padding(dimensions.paddingMedium)

    Box(
        modifier = cardModifier,
        content = content,
    )
}
