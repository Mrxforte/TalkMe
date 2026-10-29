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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions

/**
 * Universal Feature & Practice Banner Card component.
 *
 * @param title Primary heading text.
 * @param modifier Composable layout modifier.
 * @param subtitle Subtitle description text.
 * @param leadingIconRes Optional leading icon resource ID.
 * @param containerColor Background color of the banner container.
 * @param iconTint Tint color for the leading and trailing icons.
 * @param onClick Optional click handler.
 */
@Composable
fun TalkMeBannerCard(
    title: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    @DrawableRes leadingIconRes: Int? = null,
    containerColor: Color = MaterialTheme.colorScheme.secondaryContainer,
    iconTint: Color = MaterialTheme.colorScheme.secondary,
    onClick: (() -> Unit)? = null,
) {
    val dimensions = LocalDimensions.current

    TalkMeCard(
        modifier = modifier,
        containerColor = containerColor,
        borderColor = containerColor,
        cornerRadius = dimensions.cornerLarge,
        onClick = onClick,
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Row(
                modifier = Modifier.weight(1f),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                if (leadingIconRes != null) {
                    Icon(
                        painter = painterResource(id = leadingIconRes),
                        contentDescription = null,
                        tint = iconTint,
                        modifier = Modifier.size(dimensions.iconLarge),
                    )

                    Spacer(modifier = Modifier.width(dimensions.paddingMedium))
                }

                Column {
                    Text(
                        text = title,
                        style = AppTypography.BannerTitle.copy(
                            color = MaterialTheme.colorScheme.onBackground,
                        ),
                    )

                    if (subtitle != null) {
                        Spacer(modifier = Modifier.height(dimensions.paddingMicro))

                        Text(
                            text = subtitle,
                            style = AppTypography.BannerSubtitle.copy(
                                color = MaterialTheme.colorScheme.onSecondaryContainer,
                            ),
                        )
                    }
                }
            }

            if (onClick != null) {
                Icon(
                    painter = painterResource(id = AppIcons.ArrowUpRight),
                    contentDescription = null,
                    tint = iconTint,
                    modifier = Modifier.size(dimensions.iconMedium),
                )
            }
        }
    }
}
