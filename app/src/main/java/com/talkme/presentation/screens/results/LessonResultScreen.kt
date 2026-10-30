package com.talkme.presentation.screens.results

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import com.talkme.R
import com.talkme.domain.lesson.model.LessonResultSummary
import com.talkme.presentation.components.TalkMeHeader
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.LocalDimensions
import com.talkme.ui.theme.TalkMeColors

/**
 * Lesson Result Screen (`LessonResultScreen.kt`) nested inside `presentation/screens/results/`
 * per Section 2 Item 6 & Section 5 Rule 4 of PROJECT_RULES.md.
 *
 * Features:
 * - Share action button (`AppIcons.Share`)
 * - Completion banner card (`TalkMeColors.ContainerPurpleLight`) with "Dars yakunlandi" green chip,
 *   checkmark icon, score percentage, time spent, and XP earned stats row
 * - Weekly plan progress bar (`weekly_plan_title`)
 * - Rule correction tip card ("Bir joyini mustahkamlaymiz" / `rule_correction_tip_title`)
 * - Exam prep card (`exam_prep_card_title`)
 * - Zero hardcoded strings, colors, .sp, or .dp values (Rule 1).
 */
@Composable
fun LessonResultScreen(
    summary: LessonResultSummary,
    onBackClick: () -> Unit,
    onShareClick: () -> Unit,
    onContinueNextLesson: () -> Unit,
    onRetryTest: () -> Unit,
    onRepeatLesson: () -> Unit,
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(horizontal = dims.spaceLarge),
        verticalArrangement = Arrangement.spacedBy(dims.spaceLarge),
        contentPadding = PaddingValues(vertical = dims.spaceLarge)
    ) {
        // 1. Header with Left Back Chevron and Share Action Button
        item {
            TalkMeHeader(
                title = stringResource(R.string.result_screen_title),
                subtitle = summary.lessonTitle,
                onBackClick = onBackClick,
                trailingContent = {
                    IconButton(
                        onClick = onShareClick,
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
                            imageVector = AppIcons.Share,
                            contentDescription = stringResource(R.string.cd_share_result),
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(dims.iconMedium)
                        )
                    }
                }
            )
        }

        // 2. Completion Banner Card (ContainerPurpleLight) with "Dars yakunlandi" Green Chip & Stats Row
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(dims.radiusExtraLarge),
                colors = CardDefaults.cardColors(containerColor = TalkMeColors.ContainerPurpleLight)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(dims.spaceExtraLarge),
                    verticalArrangement = Arrangement.spacedBy(dims.spaceLarge)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(dims.radiusSmall))
                                .background(TalkMeColors.ContainerGreenLight)
                                .padding(
                                    horizontal = dims.spaceMedium,
                                    vertical = dims.spaceExtraSmall
                                )
                        ) {
                            Text(
                                text = stringResource(R.string.chip_lesson_completed),
                                style = AppTypography.LabelMedium,
                                color = TalkMeColors.SuccessGreen
                            )
                        }

                        Box(
                            modifier = Modifier
                                .size(dims.iconButtonSize)
                                .clip(CircleShape)
                                .background(MaterialTheme.colorScheme.surface),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = AppIcons.Check,
                                contentDescription = stringResource(R.string.cd_completed_check),
                                tint = TalkMeColors.SuccessGreen,
                                modifier = Modifier.size(dims.iconMedium)
                            )
                        }
                    }

                    Text(
                        text = stringResource(R.string.result_congrats_title),
                        style = AppTypography.HeadlineMedium,
                        color = MaterialTheme.colorScheme.onBackground
                    )

                    // Stats Row: Score %, Time Spent, XP Earned
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(dims.spaceSmall)
                    ) {
                        ResultStatBox(
                            value = "${summary.completionPercentage}%",
                            label = stringResource(R.string.stat_label_score),
                            modifier = Modifier.weight(1f)
                        )
                        ResultStatBox(
                            value = "${summary.timeSpentSeconds}s",
                            label = stringResource(R.string.stat_label_time),
                            modifier = Modifier.weight(1f)
                        )
                        ResultStatBox(
                            value = "+${summary.xpEarned}",
                            label = stringResource(R.string.stat_label_xp),
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        }

        // 3. Weekly Plan Progress Bar Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(dims.radiusExtraLarge),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(dims.spaceLarge),
                    verticalArrangement = Arrangement.spacedBy(dims.spaceSmall)
                ) {
                    Text(
                        text = stringResource(R.string.weekly_plan_title),
                        style = AppTypography.TitleMedium,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    LinearProgressIndicator(
                        progress = { summary.weeklyGoalProgress },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(dims.progressBarHeight)
                            .clip(RoundedCornerShape(dims.radiusFull)),
                        color = MaterialTheme.colorScheme.secondary,
                        trackColor = MaterialTheme.colorScheme.surfaceVariant
                    )
                }
            }
        }

        // 4. Rule Correction Tip Card ("Bir joyini mustahkamlaymiz")
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(dims.radiusExtraLarge),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(dims.spaceLarge),
                    verticalArrangement = Arrangement.spacedBy(dims.spaceSmall)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(dims.spaceSmall)
                    ) {
                        Icon(
                            imageVector = AppIcons.Lightbulb,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(dims.iconMedium)
                        )
                        Text(
                            text = stringResource(R.string.rule_correction_tip_title),
                            style = AppTypography.TitleMedium,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                    Text(
                        text = summary.ruleCorrectionTipUz,
                        style = AppTypography.BodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }

        // 5. Exam Prep Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(dims.radiusExtraLarge),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(dims.spaceLarge),
                    verticalArrangement = Arrangement.spacedBy(dims.spaceSmall)
                ) {
                    Text(
                        text = stringResource(R.string.exam_prep_card_title),
                        style = AppTypography.TitleMedium,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = summary.examPrepNoteUz,
                        style = AppTypography.BodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }

        // 6. Action Buttons
        item {
            Column(verticalArrangement = Arrangement.spacedBy(dims.spaceSmall)) {
                Button(
                    onClick = onContinueNextLesson,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(dims.buttonHeightStandard),
                    shape = RoundedCornerShape(dims.radiusLarge)
                ) {
                    Text(
                        text = stringResource(R.string.action_continue_next_lesson),
                        style = AppTypography.LabelLarge
                    )
                }

                Row(horizontalArrangement = Arrangement.spacedBy(dims.spaceSmall)) {
                    OutlinedButton(
                        onClick = onRetryTest,
                        modifier = Modifier
                            .weight(1f)
                            .height(dims.buttonHeightStandard),
                        shape = RoundedCornerShape(dims.radiusLarge)
                    ) {
                        Text(
                            text = stringResource(R.string.action_retry_test),
                            style = AppTypography.LabelMedium
                        )
                    }

                    OutlinedButton(
                        onClick = onRepeatLesson,
                        modifier = Modifier
                            .weight(1f)
                            .height(dims.buttonHeightStandard),
                        shape = RoundedCornerShape(dims.radiusLarge)
                    ) {
                        Text(
                            text = stringResource(R.string.action_repeat_lesson),
                            style = AppTypography.LabelMedium
                        )
                    }
                }
            }
        }
    }
}

/**
 * Reusable stat box inside the completion banner on [LessonResultScreen].
 */
@Composable
private fun ResultStatBox(
    value: String,
    label: String,
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current

    Column(
        modifier = modifier
            .clip(RoundedCornerShape(dims.radiusMedium))
            .background(MaterialTheme.colorScheme.surface)
            .padding(dims.spaceMedium),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = value,
            style = AppTypography.HeadlineMedium,
            color = MaterialTheme.colorScheme.primary
        )
        Text(
            text = label,
            style = AppTypography.LabelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}
