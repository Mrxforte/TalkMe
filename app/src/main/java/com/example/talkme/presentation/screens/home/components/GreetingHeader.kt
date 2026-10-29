package com.example.talkme.presentation.screens.home.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import com.example.talkme.R
import com.example.talkme.presentation.components.TalkMeBadge
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.TalkMeTheme

/**
 * Greeting section displaying personal user welcome text, motivational tagline, and streak counter badge.
 *
 * @param modifier Composable modifier.
 * @param greeting Main personalized greeting title.
 * @param subtitle Subtitle description or slogan.
 * @param streakCount Current consecutive active learning streak count.
 */
@Composable
fun GreetingHeader(
    modifier: Modifier = Modifier,
    greeting: String = stringResource(id = R.string.greeting_title),
    subtitle: String = stringResource(id = R.string.greeting_subtitle),
    streakCount: String = stringResource(id = R.string.streak_count),
) {
    val dimensions = LocalDimensions.current

    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = dimensions.paddingSmall),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.Top,
    ) {
        Column(
            modifier = Modifier.weight(1f),
        ) {
            Text(
                text = greeting,
                style = AppTypography.GreetingTitle.copy(
                    color = MaterialTheme.colorScheme.onBackground,
                ),
            )

            Spacer(modifier = Modifier.height(dimensions.paddingExtraSmall))

            Text(
                text = subtitle,
                style = AppTypography.GreetingSubtitle.copy(
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                ),
            )
        }

        TalkMeBadge(
            text = streakCount,
            iconRes = AppIcons.Fire,
            containerColor = MaterialTheme.colorScheme.surfaceVariant,
            textColor = MaterialTheme.colorScheme.primary,
        )
    }
}

@Preview(showBackground = true)
@Composable
fun GreetingHeaderPreview() {
    TalkMeTheme {
        GreetingHeader()
    }
}
