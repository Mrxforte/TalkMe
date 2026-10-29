package com.example.talkme.presentation.components

import androidx.annotation.DrawableRes
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions

/**
 * Universal Selectable List & Option Card Component used across Quiz choices,
 * Course Module lists, and Leaderboard user rows.
 *
 * @param title Primary heading text.
 * @param modifier Composable layout modifier.
 * @param subtitle Optional description text.
 * @param isSelected Selection highlight state.
 * @param leadingIconRes Optional leading drawable icon ID.
 * @param leadingText Optional leading rank or prefix text (e.g., "1", "A").
 * @param trailingBadgeText Optional trailing badge text (e.g., "360 XP").
 * @param onClick Click callback.
 */
@Composable
fun TalkMeOptionCard(
    title: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    isSelected: Boolean = false,
    @DrawableRes leadingIconRes: Int? = null,
    leadingText: String? = null,
    trailingBadgeText: String? = null,
    onClick: () -> Unit = {},
) {
    val dimensions = LocalDimensions.current

    val containerColor = if (isSelected) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surface
    val borderColor = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline
    val titleColor = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onBackground

    TalkMeCard(
        modifier = modifier,
        containerColor = containerColor,
        borderColor = borderColor,
        onClick = onClick,
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Row(
                modifier = Modifier.weight(1f),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                if (leadingText != null) {
                    Text(
                        text = leadingText,
                        style = AppTypography.CardTitle.copy(
                            color = MaterialTheme.colorScheme.primary,
                            fontWeight = FontWeight.Bold,
                        ),
                    )

                    Spacer(modifier = Modifier.width(dimensions.paddingSmall))
                }

                if (leadingIconRes != null) {
                    Icon(
                        painter = painterResource(id = leadingIconRes),
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(dimensions.iconMedium),
                    )

                    Spacer(modifier = Modifier.width(dimensions.paddingMedium))
                }

                Column {
                    Text(
                        text = title,
                        style = AppTypography.CardTitle.copy(
                            color = titleColor,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                        ),
                    )

                    if (subtitle != null) {
                        Spacer(modifier = Modifier.height(dimensions.paddingMicro))

                        Text(
                            text = subtitle,
                            style = AppTypography.CardSubtitle.copy(
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            ),
                        )
                    }
                }
            }

            if (trailingBadgeText != null) {
                TalkMeBadge(
                    text = trailingBadgeText,
                    iconRes = AppIcons.Fire,
                    containerColor = MaterialTheme.colorScheme.surfaceVariant,
                    textColor = MaterialTheme.colorScheme.primary,
                )
            } else {
                Icon(
                    painter = painterResource(id = AppIcons.ChevronRight),
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.size(dimensions.iconMedium),
                )
            }
        }
    }
}
