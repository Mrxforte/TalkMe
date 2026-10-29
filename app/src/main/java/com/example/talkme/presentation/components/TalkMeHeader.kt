package com.example.talkme.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import com.example.talkme.R
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions

/**
 * Universal Top Navigation Header Component for screens and sub-pages.
 * Displays page title, subtitle, circular back arrow button, and optional trailing content.
 *
 * @param title Main page title text.
 * @param modifier Composable layout modifier.
 * @param subtitle Optional page subtitle or category path.
 * @param onBackClick Optional back arrow click callback. Displays circular back button when provided.
 * @param trailingContent Optional trailing composable slot for action badges or search icons.
 */
@Composable
fun TalkMeHeader(
    title: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    onBackClick: (() -> Unit)? = null,
    trailingContent: (@Composable () -> Unit)? = null,
) {
    val dimensions = LocalDimensions.current

    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = dimensions.paddingMedium),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Row(
            modifier = Modifier.weight(1f),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            if (onBackClick != null) {
                Box(
                    modifier = Modifier
                        .size(dimensions.avatarSize)
                        .clip(CircleShape)
                        .background(MaterialTheme.colorScheme.surface)
                        .border(dimensions.borderThin, MaterialTheme.colorScheme.outline, CircleShape)
                        .clickable(onClick = onBackClick),
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(
                        painter = painterResource(id = AppIcons.ChevronLeft),
                        contentDescription = stringResource(id = R.string.back),
                        tint = MaterialTheme.colorScheme.onBackground,
                        modifier = Modifier.size(dimensions.iconMedium),
                    )
                }

                Spacer(modifier = Modifier.width(dimensions.paddingSmall))
            }

            Column {
                Text(
                    text = title,
                    style = AppTypography.GreetingTitle.copy(
                        color = MaterialTheme.colorScheme.onBackground,
                    ),
                )

                if (subtitle != null) {
                    Spacer(modifier = Modifier.height(dimensions.paddingMicro))

                    Text(
                        text = subtitle,
                        style = AppTypography.GreetingSubtitle.copy(
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        ),
                    )
                }
            }
        }

        if (trailingContent != null) {
            trailingContent()
        }
    }
}
