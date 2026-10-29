package com.example.talkme.presentation.components

import androidx.annotation.DrawableRes
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions

/**
 * Reusable Badge / Chip Component used for level indicators, categories, and streak counts.
 *
 * @param text Label text displayed inside the badge.
 * @param modifier Composable modifier.
 * @param iconRes Optional icon drawable resource ID displayed before the text.
 * @param containerColor Background color of the badge chip.
 * @param textColor Text and icon tint color.
 */
@Composable
fun TalkMeBadge(
    text: String,
    modifier: Modifier = Modifier,
    @DrawableRes iconRes: Int? = null,
    containerColor: Color = MaterialTheme.colorScheme.surfaceVariant,
    textColor: Color = MaterialTheme.colorScheme.primary,
) {
    val dimensions = LocalDimensions.current

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(dimensions.cornerSmall))
            .background(containerColor)
            .padding(horizontal = dimensions.paddingSmall, vertical = dimensions.paddingExtraSmall),
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
        ) {
            if (iconRes != null) {
                Icon(
                    painter = painterResource(id = iconRes),
                    contentDescription = null,
                    tint = textColor,
                    modifier = Modifier.size(dimensions.iconSmall),
                )

                Spacer(modifier = Modifier.width(dimensions.paddingExtraSmall))
            }

            Text(
                text = text,
                style = AppTypography.BadgeText.copy(
                    color = textColor,
                ),
            )
        }
    }
}
