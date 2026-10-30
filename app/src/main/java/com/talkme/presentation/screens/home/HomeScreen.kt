package com.talkme.presentation.screens.home

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import com.talkme.R
import com.talkme.presentation.components.TalkMeHeader
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.LocalDimensions

/**
 * Central learning Home Dashboard (`HomeScreen.kt`) with active lesson banner,
 * daily streak/XP metrics, and navigation cards to Courses, Repeat, Voice Studio,
 * Voice Settings, and Profile per Section 2 Item 3 of PROJECT_RULES.md.
 */
@Composable
fun HomeScreen(
    onOpenLessonClick: (courseId: String, lessonId: String) -> Unit = { _, _ -> },
    onOpenCoursesClick: () -> Unit = {},
    onOpenRepeatClick: () -> Unit = {},
    onOpenVoiceStudioClick: () -> Unit = {},
    onOpenVoiceSettingsClick: () -> Unit = {},
    onOpenProfileClick: () -> Unit = {},
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
            title = stringResource(R.string.app_name),
            subtitle = stringResource(R.string.home_greeting_subtitle),
            trailingContent = {
                IconButton(
                    onClick = onOpenVoiceSettingsClick,
                    modifier = Modifier
                        .size(dims.iconButtonSize)
                        .clip(CircleShape)
                        .background(MaterialTheme.colorScheme.surface)
                        .border(
                            width = dims.borderThin,
                            color = MaterialTheme.colorScheme.outline,
                            shape = CircleShape
                        )
                ) {
                    Icon(
                        imageVector = AppIcons.SettingsSliders,
                        contentDescription = stringResource(R.string.cd_voice_settings),
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(dims.iconMedium)
                    )
                }
            }
        )

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(vertical = dims.spaceMedium),
            verticalArrangement = Arrangement.spacedBy(dims.spaceLarge)
        ) {
            // Streak & XP Summary Strip
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(dims.spaceMedium)
                ) {
                    HomeStatChip(
                        icon = AppIcons.StarFilled,
                        label = stringResource(R.string.home_streak_days),
                        modifier = Modifier.weight(1f)
                    )
                    HomeStatChip(
                        icon = AppIcons.CheckCircle,
                        label = stringResource(R.string.home_xp_total),
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            // Active Lesson Hero Card
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(
                            width = dims.borderThick,
                            color = MaterialTheme.colorScheme.outlineVariant,
                            shape = RoundedCornerShape(dims.radiusExtraLarge)
                        ),
                    shape = RoundedCornerShape(dims.radiusExtraLarge),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.primaryContainer
                    )
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(dims.spaceExtraLarge),
                        verticalArrangement = Arrangement.spacedBy(dims.spaceMedium)
                    ) {
                        Text(
                            text = stringResource(R.string.home_current_lesson_badge),
                            style = AppTypography.LabelMedium,
                            color = MaterialTheme.colorScheme.primary
                        )

                        Text(
                            text = stringResource(R.string.home_current_lesson_title),
                            style = AppTypography.HeadlineMedium,
                            color = MaterialTheme.colorScheme.onPrimaryContainer
                        )

                        Text(
                            text = stringResource(R.string.home_current_lesson_desc),
                            style = AppTypography.BodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )

                        LinearProgressIndicator(
                            progress = { 0.4f },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(dims.progressBarHeight)
                                .clip(RoundedCornerShape(dims.radiusFull)),
                            color = MaterialTheme.colorScheme.primary,
                            trackColor = MaterialTheme.colorScheme.surface
                        )

                        Button(
                            onClick = { onOpenLessonClick("course_a0_numbers", "lesson_numbers_1") },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(dims.buttonHeightStandard),
                            shape = RoundedCornerShape(dims.radiusLarge)
                        ) {
                            Icon(
                                imageVector = AppIcons.Play,
                                contentDescription = null,
                                modifier = Modifier.size(dims.iconMedium)
                            )
                            Text(
                                text = stringResource(R.string.action_start_learning),
                                style = AppTypography.LabelLarge,
                                modifier = Modifier.padding(start = dims.spaceSmall)
                            )
                        }
                    }
                }
            }

            // Quick Navigation Modules Section
            item {
                Text(
                    text = stringResource(R.string.home_nav_section_title),
                    style = AppTypography.TitleLarge,
                    color = MaterialTheme.colorScheme.onBackground
                )
            }

            item {
                Column(verticalArrangement = Arrangement.spacedBy(dims.spaceMedium)) {
                    HomeModuleRow(
                        icon = AppIcons.Layers,
                        title = stringResource(R.string.home_nav_courses_title),
                        subtitle = stringResource(R.string.home_nav_courses_sub),
                        onClick = onOpenCoursesClick
                    )
                    HomeModuleRow(
                        icon = AppIcons.Refresh,
                        title = stringResource(R.string.home_nav_repeat_title),
                        subtitle = stringResource(R.string.home_nav_repeat_sub),
                        onClick = onOpenRepeatClick
                    )
                    HomeModuleRow(
                        icon = AppIcons.VolumeUp,
                        title = stringResource(R.string.home_nav_voicestudio_title),
                        subtitle = stringResource(R.string.home_nav_voicestudio_sub),
                        onClick = onOpenVoiceStudioClick
                    )
                    HomeModuleRow(
                        icon = AppIcons.SettingsSliders,
                        title = stringResource(R.string.home_nav_settings_title),
                        subtitle = stringResource(R.string.home_nav_settings_sub),
                        onClick = onOpenVoiceSettingsClick
                    )
                    HomeModuleRow(
                        icon = AppIcons.StarFilled,
                        title = stringResource(R.string.home_nav_profile_title),
                        subtitle = stringResource(R.string.home_nav_profile_sub),
                        onClick = onOpenProfileClick
                    )
                }
            }
        }
    }
}

@Composable
private fun HomeStatChip(
    icon: ImageVector,
    label: String,
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current

    Row(
        modifier = modifier
            .clip(RoundedCornerShape(dims.radiusLarge))
            .background(MaterialTheme.colorScheme.surface)
            .border(
                width = dims.borderThin,
                color = MaterialTheme.colorScheme.outline,
                shape = RoundedCornerShape(dims.radiusLarge)
            )
            .padding(dims.spaceMedium),
        horizontalArrangement = Arrangement.spacedBy(dims.spaceSmall),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(dims.iconMedium)
        )
        Text(
            text = label,
            style = AppTypography.LabelLarge,
            color = MaterialTheme.colorScheme.onSurface
        )
    }
}

@Composable
private fun HomeModuleRow(
    icon: ImageVector,
    title: String,
    subtitle: String,
    onClick: () -> Unit
) {
    val dims = LocalDimensions.current

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(
                width = dims.borderThin,
                color = MaterialTheme.colorScheme.outline,
                shape = RoundedCornerShape(dims.radiusLarge)
            )
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(dims.radiusLarge),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(dims.spaceLarge),
            horizontalArrangement = Arrangement.spacedBy(dims.spaceMedium),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(dims.iconButtonSize)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.primaryContainer),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(dims.iconMedium)
                )
            }

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    style = AppTypography.TitleMedium,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = subtitle,
                    style = AppTypography.BodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}
