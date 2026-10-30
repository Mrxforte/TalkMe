package com.example.talkme.presentation.screens.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Slider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import com.example.talkme.R
import com.example.talkme.presentation.components.TalkMeBadge
import com.example.talkme.presentation.components.TalkMeBottomBar
import com.example.talkme.presentation.components.TalkMeButton
import com.example.talkme.presentation.components.TalkMeCard
import com.example.talkme.presentation.components.TalkMeHeader
import com.example.talkme.presentation.components.TalkMeTabRow
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.ContainerGreenLight
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.SuccessGreen
import com.example.talkme.ui.theme.TalkMeTheme

/**
 * User Profile, Results Analytics, Leaderboard and Voice AI Engine Model Manager Screen.
 * Integrates learning progress, streak stats, student rankings, and Voice AI TTS controls.
 *
 * @param onTabSelected Bottom navigation tab selection handler.
 * @param modifier Composable layout modifier.
 * @param onOpenVoiceStudioClick Navigation handler to open Voice Studio.
 * @param onOpenVoiceSettingsClick Navigation handler to open Voice AI Settings.
 * @param onPlaySampleTtsClick Speech test playback callback handler.
 */
@Composable
fun ProfileScreen(
    onTabSelected: (Int) -> Unit,
    modifier: Modifier = Modifier,
    onOpenVoiceStudioClick: () -> Unit = {},
    onOpenVoiceSettingsClick: () -> Unit = {},
    onPlaySampleTtsClick: (String) -> Unit = {},
) {
    val dimensions = LocalDimensions.current

    var selectedLeaderboardTab by remember { mutableIntStateOf(0) }
    var speechSpeed by remember { mutableFloatStateOf(0.9f) }

    val leaderboardTabs = listOf(
        stringResource(id = R.string.tab_this_week),
        stringResource(id = R.string.tab_all_time),
    )

    Scaffold(
        modifier = modifier.fillMaxSize(),
        bottomBar = {
            TalkMeBottomBar(
                selectedTab = 3, // Results / Profile Tab
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

            // XP and Leaderboard Rank Badges
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
                    text = stringResource(id = R.string.profile_rank),
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

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))

            // ==========================================
            // SECTION 1: RESULTS & LEADERBOARD (NATIJALAR)
            // ==========================================
            Text(
                text = stringResource(id = R.string.leaderboard_title),
                style = AppTypography.SectionTitle.copy(
                    color = MaterialTheme.colorScheme.onBackground,
                ),
            )

            Spacer(modifier = Modifier.height(dimensions.paddingMicro))

            Text(
                text = stringResource(id = R.string.leaderboard_subtitle),
                style = AppTypography.CardSubtitle.copy(
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                ),
            )

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // Timeframe Segment Tabs (Bu hafta / Jami)
            TalkMeTabRow(
                tabs = leaderboardTabs,
                selectedIndex = selectedLeaderboardTab,
                onTabSelected = { selectedLeaderboardTab = it },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // Motivational Ranking Banner
            TalkMeCard(
                containerColor = ContainerGreenLight,
                borderColor = ContainerGreenLight,
            ) {
                Text(
                    text = stringResource(id = R.string.leaderboard_motivation),
                    style = AppTypography.CardTitle.copy(
                        color = SuccessGreen,
                    ),
                )
            }

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // Student Rankings List
            TalkMeCard {
                Column {
                    Text(
                        text = stringResource(id = R.string.leaderboard_header_note),
                        style = AppTypography.LessonTag.copy(
                            color = MaterialTheme.colorScheme.primary,
                        ),
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingMedium))

                    LeaderboardUserRow(rank = 1, name = "Madina S.", xp = "1 480 XP", isUser = false)
                    HorizontalDivider(modifier = Modifier.padding(vertical = dimensions.paddingSmall))

                    LeaderboardUserRow(rank = 2, name = "Jasur K.", xp = "1 320 XP", isUser = false)
                    HorizontalDivider(modifier = Modifier.padding(vertical = dimensions.paddingSmall))

                    LeaderboardUserRow(rank = 3, name = "Sardor M.", xp = "1 280 XP", isUser = false)
                    HorizontalDivider(modifier = Modifier.padding(vertical = dimensions.paddingSmall))

                    LeaderboardUserRow(rank = 4, name = "Aziz (Siz)", xp = "1 240 XP", isUser = true)
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))

            // ==========================================
            // SECTION 2: VOICE AI ENGINE & MODEL MANAGER
            // ==========================================
            Text(
                text = "Ovozli AI Engine & Model Sozlamalari",
                style = AppTypography.SectionTitle.copy(
                    color = MaterialTheme.colorScheme.onBackground,
                ),
            )

            Spacer(modifier = Modifier.height(dimensions.paddingMicro))

            Text(
                text = "TTS dvigatellari, modellar va ovoz tezligini boshqarish",
                style = AppTypography.CardSubtitle.copy(
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                ),
            )

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // Active Voice AI Engine Card
            TalkMeCard(
                containerColor = MaterialTheme.colorScheme.primaryContainer,
                borderColor = MaterialTheme.colorScheme.primary,
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Column {
                            Text(
                                text = "Aktiv Dvigatel: Sherpa-ONNX",
                                style = AppTypography.CardTitle.copy(
                                    color = MaterialTheme.colorScheme.primary,
                                ),
                            )
                            Text(
                                text = "Oflayn local AI model (Locale.US)",
                                style = AppTypography.CardSubtitle,
                            )
                        }

                        TalkMeBadge(
                            text = "OFFLINE",
                            containerColor = ContainerGreenLight,
                            textColor = SuccessGreen,
                        )
                    }

                    Spacer(modifier = Modifier.height(dimensions.paddingMedium))

                    // Speech Speed Control
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(
                            text = "Ovoz tezligi: ${"%.1f".format(speechSpeed)}x",
                            style = AppTypography.CardSubtitle.copy(
                                color = MaterialTheme.colorScheme.onBackground,
                                fontWeight = FontWeight.Bold,
                            ),
                        )

                        // Sample Test Audio Speaker Button
                        TalkMeButton(
                            text = "Ovozni eshitish",
                            trailingIconRes = AppIcons.Volume,
                            onClick = { onPlaySampleTtsClick("Welcome to TalkMe English learning platform!") },
                        )
                    }

                    Slider(
                        value = speechSpeed,
                        onValueChange = { speechSpeed = it },
                        valueRange = 0.6f..1.5f,
                        modifier = Modifier.fillMaxWidth(),
                    )
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // Navigation Buttons to Voice Studio and Settings
            TalkMeButton(
                text = "Voice Studio — Ovoz Sinov Muhiti",
                trailingIconRes = AppIcons.ChevronRight,
                onClick = onOpenVoiceStudioClick,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            TalkMeButton(
                text = "Barcha Voice AI Sozlamalari",
                onClick = onOpenVoiceSettingsClick,
                containerColor = MaterialTheme.colorScheme.surfaceVariant,
                contentColor = MaterialTheme.colorScheme.primary,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))
        }
    }
}

/**
 * Reusable Row Component for Leaderboard Student Rankings.
 */
@Composable
fun LeaderboardUserRow(
    rank: Int,
    name: String,
    xp: String,
    isUser: Boolean,
    modifier: Modifier = Modifier,
) {
    val dimensions = LocalDimensions.current

    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = "#$rank",
                style = AppTypography.CardTitle.copy(
                    color = if (isUser) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant,
                    fontWeight = FontWeight.Bold,
                ),
            )

            Spacer(modifier = Modifier.width(dimensions.paddingMedium))

            Box(
                modifier = Modifier
                    .size(dimensions.avatarSize)
                    .clip(CircleShape)
                    .background(if (isUser) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    text = name.take(1),
                    style = AppTypography.CardTitle.copy(
                        color = if (isUser) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant,
                        fontWeight = FontWeight.Bold,
                    ),
                )
            }

            Spacer(modifier = Modifier.width(dimensions.paddingSmall))

            Text(
                text = name,
                style = AppTypography.CardTitle.copy(
                    color = MaterialTheme.colorScheme.onBackground,
                    fontWeight = if (isUser) FontWeight.Bold else FontWeight.Normal,
                ),
            )
        }

        TalkMeBadge(
            text = xp,
            containerColor = if (isUser) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surfaceVariant,
            textColor = if (isUser) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

@Preview(showBackground = true)
@Composable
fun ProfileScreenPreview() {
    TalkMeTheme {
        ProfileScreen(onTabSelected = {})
    }
}
