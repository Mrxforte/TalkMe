package com.example.talkme.presentation.screens.home.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import com.example.talkme.R
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.AvatarGreenBg
import com.example.talkme.ui.theme.AvatarGreenText
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.TalkMeTheme

/**
 * Top Header component displaying the application logo, title, and user profile avatar.
 *
 * @param modifier Composable modifier.
 * @param title App title text retrieved from string resources.
 * @param userInitial First letter of the user's name for the avatar badge.
 * @param onAvatarClick Triggered when the user taps on their profile avatar.
 */
@Composable
fun HomeHeader(
    modifier: Modifier = Modifier,
    title: String = stringResource(id = R.string.splash_title),
    userInitial: String = "A",
    onAvatarClick: () -> Unit = {},
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
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                modifier = Modifier
                    .size(dimensions.avatarSize)
                    .clip(RoundedCornerShape(dimensions.cornerSmall))
                    .background(MaterialTheme.colorScheme.primary),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    painter = painterResource(id = AppIcons.Book),
                    contentDescription = stringResource(id = R.string.splash_logo_content_description),
                    tint = MaterialTheme.colorScheme.onPrimary,
                    modifier = Modifier.size(dimensions.iconMedium),
                )
            }

            Spacer(modifier = Modifier.width(dimensions.paddingSmall))

            Text(
                text = title,
                style = AppTypography.HeaderAppTitle.copy(
                    color = MaterialTheme.colorScheme.onBackground,
                ),
            )
        }

        Box(
            modifier = Modifier
                .size(dimensions.avatarSize)
                .clip(CircleShape)
                .background(AvatarGreenBg)
                .clickable(onClick = onAvatarClick),
            contentAlignment = Alignment.Center,
        ) {
            Text(
                text = userInitial,
                style = AppTypography.AvatarText.copy(
                    color = AvatarGreenText,
                ),
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun HomeHeaderPreview() {
    TalkMeTheme {
        HomeHeader()
    }
}
