package com.example.talkme.presentation.screens.repeat

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import com.example.talkme.R
import com.example.talkme.presentation.components.TalkMeBottomBar
import com.example.talkme.presentation.components.TalkMeButton
import com.example.talkme.presentation.components.TalkMeCard
import com.example.talkme.presentation.components.TalkMeHeader
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.TalkMeTheme

/**
 * Vocabulary & Spaced Repetition Practice Screen.
 * Reuses TalkMeHeader, TalkMeCard, TalkMeButton, and TalkMeBottomBar.
 *
 * @param onTabSelected Bottom navigation tab selection handler.
 * @param onStartRepeatClick Callback to start vocabulary practice session.
 * @param modifier Composable layout modifier.
 */
@Composable
fun RepeatScreen(
    onTabSelected: (Int) -> Unit,
    modifier: Modifier = Modifier,
    onStartRepeatClick: () -> Unit = {},
) {
    val dimensions = LocalDimensions.current

    Scaffold(
        modifier = modifier.fillMaxSize(),
        bottomBar = {
            TalkMeBottomBar(
                selectedTab = 2,
                onTabSelected = onTabSelected,
            )
        },
        containerColor = MaterialTheme.colorScheme.background,
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = dimensions.paddingExtraLarge),
        ) {
            TalkMeHeader(
                title = stringResource(id = R.string.title_repeat),
                subtitle = stringResource(id = R.string.subtitle_repeat),
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // Active Practice Session Banner
            TalkMeCard(
                containerColor = MaterialTheme.colorScheme.secondaryContainer,
                borderColor = MaterialTheme.colorScheme.secondaryContainer,
                cornerRadius = dimensions.cornerExtraLarge,
            ) {
                Column {
                    Text(
                        text = stringResource(id = R.string.vocab_banner_title),
                        style = AppTypography.GreetingTitle.copy(
                            color = MaterialTheme.colorScheme.onBackground,
                        ),
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                    Text(
                        text = stringResource(id = R.string.vocab_banner_subtitle),
                        style = AppTypography.GreetingSubtitle.copy(
                            color = MaterialTheme.colorScheme.onSecondaryContainer,
                        ),
                    )
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))

            // Start Practice Button
            TalkMeButton(
                text = stringResource(id = R.string.vocab_banner_title),
                trailingIconRes = AppIcons.Repeat,
                onClick = onStartRepeatClick,
                containerColor = MaterialTheme.colorScheme.secondary,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))
        }
    }
}

@Preview(showBackground = true)
@Composable
fun RepeatScreenPreview() {
    TalkMeTheme {
        RepeatScreen(onTabSelected = {})
    }
}
