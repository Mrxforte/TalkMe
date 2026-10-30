package com.talkme.presentation.screens.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import com.talkme.R
import com.talkme.presentation.components.TalkMeHeader
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.LocalDimensions

/**
 * Student Profile & Leaderboard Screen (`ProfileScreen.kt`)
 * nested inside `presentation/screens/profile/` per Section 3 of PROJECT_RULES.md.
 */
@Composable
fun ProfileScreen(
    onBackClick: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(horizontal = dims.spaceLarge)
    ) {
        TalkMeHeader(
            title = stringResource(R.string.profile_screen_title),
            subtitle = stringResource(R.string.profile_screen_subtitle),
            onBackClick = onBackClick
        )

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(vertical = dims.spaceMedium),
            verticalArrangement = Arrangement.spacedBy(dims.spaceLarge)
        ) {
            // Student Identity Card
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(
                            width = dims.borderThin,
                            color = MaterialTheme.colorScheme.outline,
                            shape = RoundedCornerShape(dims.radiusExtraLarge)
                        ),
                    shape = RoundedCornerShape(dims.radiusExtraLarge),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(dims.spaceExtraLarge),
                        horizontalArrangement = Arrangement.spacedBy(dims.spaceLarge),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(dims.buttonHeightStandard)
                                .clip(CircleShape)
                                .background(MaterialTheme.colorScheme.primaryContainer),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = AppIcons.StarFilled,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.size(dims.iconLarge)
                            )
                        }

                        Column(verticalArrangement = Arrangement.spacedBy(dims.spaceExtraSmall)) {
                            Text(
                                text = stringResource(R.string.profile_student_name),
                                style = AppTypography.HeadlineMedium,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                text = stringResource(R.string.profile_student_level),
                                style = AppTypography.LabelLarge,
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                    }
                }
            }

            // Mastery Metrics Row
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(dims.spaceSmall)
                ) {
                    ProfileStatBox(
                        title = stringResource(R.string.stat_label_xp),
                        value = stringResource(R.string.home_xp_total),
                        modifier = Modifier.weight(1f)
                    )
                    ProfileStatBox(
                        title = stringResource(R.string.stat_label_vocab),
                        value = stringResource(R.string.profile_stat_words),
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            // Active Voice Engine Status Card
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(dims.radiusLarge),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.primaryContainer
                    )
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(dims.spaceLarge),
                        horizontalArrangement = Arrangement.spacedBy(dims.spaceMedium),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = AppIcons.VolumeUp,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(dims.iconLarge)
                        )
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = stringResource(R.string.profile_voice_card_title),
                                style = AppTypography.TitleMedium,
                                color = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                            Text(
                                text = stringResource(R.string.profile_voice_card_desc),
                                style = AppTypography.BodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }

            // Weekly Leaderboard Section
            item {
                Text(
                    text = stringResource(R.string.profile_leaderboard_title),
                    style = AppTypography.TitleLarge,
                    color = MaterialTheme.colorScheme.onBackground
                )
            }

            item {
                Column(verticalArrangement = Arrangement.spacedBy(dims.spaceSmall)) {
                    LeaderboardRow(
                        name = stringResource(R.string.profile_leader_1_name),
                        xp = stringResource(R.string.profile_leader_1_xp),
                        isCurrentUser = true
                    )
                    LeaderboardRow(
                        name = stringResource(R.string.profile_leader_2_name),
                        xp = stringResource(R.string.profile_leader_2_xp),
                        isCurrentUser = false
                    )
                    LeaderboardRow(
                        name = stringResource(R.string.profile_leader_3_name),
                        xp = stringResource(R.string.profile_leader_3_xp),
                        isCurrentUser = false
                    )
                }
            }
        }
    }
}

@Composable
private fun ProfileStatBox(
    title: String,
    value: String,
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current

    Column(
        modifier = modifier
            .clip(RoundedCornerShape(dims.radiusLarge))
            .background(MaterialTheme.colorScheme.surface)
            .border(
                width = dims.borderThin,
                color = MaterialTheme.colorScheme.outline,
                shape = RoundedCornerShape(dims.radiusLarge)
            )
            .padding(dims.spaceLarge),
        verticalArrangement = Arrangement.spacedBy(dims.spaceExtraSmall)
    ) {
        Text(
            text = title,
            style = AppTypography.LabelMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Text(
            text = value,
            style = AppTypography.HeadlineMedium,
            color = MaterialTheme.colorScheme.primary
        )
    }
}

@Composable
private fun LeaderboardRow(
    name: String,
    xp: String,
    isCurrentUser: Boolean
) {
    val dims = LocalDimensions.current

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(dims.radiusMedium))
            .background(
                if (isCurrentUser) MaterialTheme.colorScheme.secondaryContainer
                else MaterialTheme.colorScheme.surface
            )
            .border(
                width = dims.borderThin,
                color = MaterialTheme.colorScheme.outline,
                shape = RoundedCornerShape(dims.radiusMedium)
            )
            .padding(dims.spaceLarge),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = name,
            style = AppTypography.TitleMedium,
            color = MaterialTheme.colorScheme.onSurface
        )
        Text(
            text = xp,
            style = AppTypography.LabelLarge,
            color = MaterialTheme.colorScheme.primary
        )
    }
}
