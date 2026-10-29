package com.example.talkme.presentation.screens.profile

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import com.example.talkme.R
import com.example.talkme.presentation.components.TalkMeBadge
import com.example.talkme.presentation.components.TalkMeBottomBar
import com.example.talkme.presentation.components.TalkMeCard
import com.example.talkme.presentation.components.TalkMeHeader
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.TalkMeTheme

/**
 * User Profile Screen displaying user learning progress, streak stats, XP totals, and achievements.
 * Reuses TalkMeHeader, TalkMeBadge, TalkMeCard, and TalkMeBottomBar.
 *
 * @param onTabSelected Bottom navigation tab selection handler.
 * @param modifier Composable layout modifier.
 */
@Composable
fun ProfileScreen(
    onTabSelected: (Int) -> Unit,
    modifier: Modifier = Modifier,
) {
    val dimensions = LocalDimensions.current

    Scaffold(
        modifier = modifier.fillMaxSize(),
        bottomBar = {
            TalkMeBottomBar(
                selectedTab = 0,
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
                title = stringResource(id = R.string.profile_title),
                subtitle = stringResource(id = R.string.profile_subtitle),
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // User Info Header Card
            TalkMeCard(
                containerColor = MaterialTheme.colorScheme.primaryContainer,
                borderColor = MaterialTheme.colorScheme.primaryContainer,
                cornerRadius = dimensions.cornerExtraLarge,
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Column {
                        Text(
                            text = stringResource(id = R.string.profile_user_name),
                            style = AppTypography.GreetingTitle.copy(
                                color = MaterialTheme.colorScheme.primary,
                            ),
                        )

                        Spacer(modifier = Modifier.height(dimensions.paddingMicro))

                        Text(
                            text = stringResource(id = R.string.profile_user_info),
                            style = AppTypography.CardSubtitle.copy(
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            ),
                        )
                    }

                    TalkMeBadge(
                        text = stringResource(id = R.string.profile_user_level),
                        containerColor = MaterialTheme.colorScheme.surfaceVariant,
                        textColor = MaterialTheme.colorScheme.primary,
                    )
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // XP and Leaderboard Stat Badges
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(dimensions.paddingSmall),
            ) {
                TalkMeBadge(
                    text = stringResource(id = R.string.profile_total_xp),
                    containerColor = MaterialTheme.colorScheme.surfaceVariant,
                    textColor = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.weight(1f),
                )

                TalkMeBadge(
                    text = stringResource(id = R.string.profile_weekly_xp),
                    containerColor = MaterialTheme.colorScheme.secondaryContainer,
                    textColor = MaterialTheme.colorScheme.onSecondaryContainer,
                    modifier = Modifier.weight(1f),
                )
            }

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // Streak Card
            TalkMeCard {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    TalkMeBadge(
                        text = stringResource(id = R.string.streak_count),
                        iconRes = AppIcons.Fire,
                        containerColor = MaterialTheme.colorScheme.surfaceVariant,
                        textColor = MaterialTheme.colorScheme.primary,
                    )

                    Spacer(modifier = Modifier.padding(dimensions.paddingSmall))

                    Text(
                        text = stringResource(id = R.string.profile_streak_text),
                        style = AppTypography.CardSubtitle.copy(
                            color = MaterialTheme.colorScheme.onBackground,
                            fontWeight = FontWeight.Bold,
                        ),
                    )
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // Achievements Section
            Text(
                text = stringResource(id = R.string.profile_achievements_title),
                style = AppTypography.SectionTitle.copy(
                    color = MaterialTheme.colorScheme.onBackground,
                ),
            )

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            TalkMeCard {
                Column {
                    Text(
                        text = stringResource(id = R.string.achievement_1_title),
                        style = AppTypography.CardTitle.copy(
                            color = MaterialTheme.colorScheme.onBackground,
                        ),
                    )
                    Spacer(modifier = Modifier.height(dimensions.paddingMicro))
                    Text(
                        text = stringResource(id = R.string.achievement_1_desc),
                        style = AppTypography.CardSubtitle.copy(
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        ),
                    )
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            TalkMeCard {
                Column {
                    Text(
                        text = stringResource(id = R.string.achievement_2_title),
                        style = AppTypography.CardTitle.copy(
                            color = MaterialTheme.colorScheme.onBackground,
                        ),
                    )
                    Spacer(modifier = Modifier.height(dimensions.paddingMicro))
                    Text(
                        text = stringResource(id = R.string.achievement_2_desc),
                        style = AppTypography.CardSubtitle.copy(
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        ),
                    )
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ProfileScreenPreview() {
    TalkMeTheme {
        ProfileScreen(onTabSelected = {})
    }
}
