package com.example.talkme.presentation.screens.lesson

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
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.sp
import com.example.talkme.R
import com.example.talkme.presentation.components.TalkMeBadge
import com.example.talkme.presentation.components.TalkMeButton
import com.example.talkme.presentation.components.TalkMeCard
import com.example.talkme.presentation.components.TalkMeHeader
import com.example.talkme.presentation.components.TalkMeProgressBar
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.ContainerGreenLight
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.SuccessGreen
import com.example.talkme.ui.theme.TalkMeTheme

/**
 * Pixel-Perfect Lesson Completion & Score Summary Screen matching Untitled.pdf Page 5.
 * Displays completion banner, score percentage, time spent, XP earned, weekly goal progress,
 * rule correction tip, exam prep card, and return to course button.
 *
 * @param onReturnToCourseClick Callback to return to the course catalog.
 * @param modifier Composable layout modifier.
 * @param onBackClick Back button click callback.
 * @param onShareClick Optional share action callback.
 * @param onExamPrepClick Optional exam preparation card click callback.
 */
@Composable
fun LessonResultScreen(
    onReturnToCourseClick: () -> Unit,
    modifier: Modifier = Modifier,
    onBackClick: () -> Unit = {},
    onShareClick: () -> Unit = {},
    onExamPrepClick: () -> Unit = {},
) {
    val dimensions = LocalDimensions.current

    Scaffold(
        modifier = modifier.fillMaxSize(),
        containerColor = MaterialTheme.colorScheme.background,
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = dimensions.paddingExtraLarge),
        ) {
            // Header with Back Button and Share Icon
            TalkMeHeader(
                title = stringResource(id = R.string.result_title),
                subtitle = stringResource(id = R.string.result_subtitle),
                onBackClick = onBackClick,
                trailingContent = {
                    IconButton(
                        onClick = onShareClick,
                        modifier = Modifier.size(dimensions.avatarSize),
                    ) {
                        Icon(
                            painter = painterResource(id = AppIcons.Share),
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(dimensions.iconMedium),
                        )
                    }
                },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // Completion Banner Card
            TalkMeCard(
                containerColor = MaterialTheme.colorScheme.primaryContainer,
                borderColor = MaterialTheme.colorScheme.primaryContainer,
                cornerRadius = dimensions.cornerExtraLarge,
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        TalkMeBadge(
                            text = stringResource(id = R.string.result_badge),
                            containerColor = ContainerGreenLight,
                            textColor = SuccessGreen,
                        )

                        Box(
                            modifier = Modifier
                                .size(dimensions.avatarSize)
                                .clip(CircleShape)
                                .background(MaterialTheme.colorScheme.surface),
                            contentAlignment = Alignment.Center,
                        ) {
                            Icon(
                                painter = painterResource(id = AppIcons.Check),
                                contentDescription = null,
                                tint = SuccessGreen,
                                modifier = Modifier.size(dimensions.iconMedium),
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(dimensions.paddingMedium))

                    Text(
                        text = stringResource(id = R.string.result_congrats),
                        style = AppTypography.GreetingTitle.copy(
                            color = MaterialTheme.colorScheme.onBackground,
                        ),
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingMicro))

                    Text(
                        text = stringResource(id = R.string.lesson_topic_tag),
                        style = AppTypography.CardSubtitle.copy(
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        ),
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingLarge))

                    HorizontalDivider(
                        color = MaterialTheme.colorScheme.primary.copy(alpha = 0.2f),
                        thickness = dimensions.borderThin,
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingLarge))

                    // Stats Row (Score %, Time Spent, XP Earned)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        // Score %
                        Column(
                            horizontalAlignment = Alignment.Start,
                        ) {
                            Text(
                                text = stringResource(id = R.string.result_score_pct),
                                style = AppTypography.GreetingTitle.copy(
                                    fontSize = 32.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.primary,
                                ),
                            )
                            Spacer(modifier = Modifier.height(dimensions.paddingMicro))
                            Text(
                                text = stringResource(id = R.string.result_score_fraction),
                                style = AppTypography.CardSubtitle.copy(
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                ),
                            )
                        }

                        // Time Spent
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                        ) {
                            Text(
                                text = "3:24",
                                style = AppTypography.GreetingTitle.copy(
                                    fontSize = 24.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onBackground,
                                ),
                            )
                            Spacer(modifier = Modifier.height(dimensions.paddingMicro))
                            Text(
                                text = stringResource(id = R.string.result_time_spent).substringAfter(" "),
                                style = AppTypography.CardSubtitle.copy(
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                ),
                            )
                        }

                        // XP Earned
                        Column(
                            horizontalAlignment = Alignment.End,
                        ) {
                            Text(
                                text = "+20",
                                style = AppTypography.GreetingTitle.copy(
                                    fontSize = 24.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = SuccessGreen,
                                ),
                            )
                            Spacer(modifier = Modifier.height(dimensions.paddingMicro))
                            Text(
                                text = stringResource(id = R.string.result_xp_earned).substringAfter(" "),
                                style = AppTypography.CardSubtitle.copy(
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                ),
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // Weekly Goal Progress Section
            TalkMeCard(
                containerColor = MaterialTheme.colorScheme.surface,
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(
                            text = stringResource(id = R.string.weekly_plan_title),
                            style = AppTypography.CardTitle.copy(
                                color = MaterialTheme.colorScheme.onBackground,
                            ),
                        )

                        Text(
                            text = "4/5 dars",
                            style = AppTypography.CardTitle.copy(
                                color = SuccessGreen,
                                fontWeight = FontWeight.Bold,
                            ),
                        )
                    }

                    Spacer(modifier = Modifier.height(dimensions.paddingMedium))

                    TalkMeProgressBar(
                        progress = 0.8f,
                        progressColor = SuccessGreen,
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingMedium))

                    Text(
                        text = stringResource(id = R.string.result_goal_note),
                        style = AppTypography.CardSubtitle.copy(
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        ),
                    )
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // Rule Tip Card ("Bir joyini mustahkamlaymiz")
            TalkMeCard(
                containerColor = MaterialTheme.colorScheme.surface,
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(
                            text = stringResource(id = R.string.result_rule_tip_title),
                            style = AppTypography.CardTitle.copy(
                                color = MaterialTheme.colorScheme.onBackground,
                            ),
                        )

                        TalkMeBadge(
                            text = "1 qoida",
                            containerColor = MaterialTheme.colorScheme.surfaceVariant,
                            textColor = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }

                    Spacer(modifier = Modifier.height(dimensions.paddingMedium))

                    val correctionText = buildAnnotatedString {
                        append("“She reading a book.” → ")
                        withStyle(style = SpanStyle(color = SuccessGreen, fontWeight = FontWeight.Bold)) {
                            append("“She is reading a book.”")
                        }
                    }

                    Text(
                        text = correctionText,
                        style = AppTypography.CardTitle.copy(
                            color = MaterialTheme.colorScheme.onBackground,
                        ),
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingMicro))

                    Text(
                        text = stringResource(id = R.string.result_rule_tip_desc).substringAfter("\n"),
                        style = AppTypography.CardSubtitle.copy(
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        ),
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingMedium))

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Icon(
                            painter = painterResource(id = AppIcons.Repeat),
                            contentDescription = null,
                            tint = SuccessGreen,
                            modifier = Modifier.size(dimensions.iconSmall),
                        )

                        Spacer(modifier = Modifier.width(dimensions.paddingSmall))

                        Text(
                            text = "Ertangi takrorlashga qo‘shildi",
                            style = AppTypography.CardSubtitle.copy(
                                color = SuccessGreen,
                                fontWeight = FontWeight.SemiBold,
                            ),
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // Exam Prep Card ("Imtihonga tayyorgarlik")
            TalkMeCard(
                containerColor = ContainerGreenLight.copy(alpha = 0.5f),
                borderColor = ContainerGreenLight,
                onClick = onExamPrepClick,
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(dimensions.avatarSize)
                                    .clip(CircleShape)
                                    .background(ContainerGreenLight),
                                contentAlignment = Alignment.Center,
                            ) {
                                Icon(
                                    painter = painterResource(id = AppIcons.School),
                                    contentDescription = null,
                                    tint = SuccessGreen,
                                    modifier = Modifier.size(dimensions.iconMedium),
                                )
                            }

                            Spacer(modifier = Modifier.width(dimensions.paddingMedium))

                            Column {
                                Text(
                                    text = "Imtihonga tayyorgarlik",
                                    style = AppTypography.CardTitle.copy(
                                        color = MaterialTheme.colorScheme.onBackground,
                                    ),
                                )

                                Spacer(modifier = Modifier.height(dimensions.paddingMicro))

                                Text(
                                    text = "Sertifikat · milliy imtihon · attestatsiya",
                                    style = AppTypography.CardSubtitle.copy(
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    ),
                                )
                            }
                        }

                        Icon(
                            painter = painterResource(id = AppIcons.ArrowUpRight),
                            contentDescription = null,
                            tint = SuccessGreen,
                            modifier = Modifier.size(dimensions.iconMedium),
                        )
                    }

                    Spacer(modifier = Modifier.height(dimensions.paddingMedium))

                    Text(
                        text = "Tayyorgarlik mashqlari rasmiy to‘liq syllabus yoki natija kafolati emas. Amaldagi formatni rasmiy manbadan tekshiring.",
                        style = AppTypography.SplashFooter.copy(
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontSize = 10.sp,
                        ),
                    )
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))

            // Return Button
            TalkMeButton(
                text = stringResource(id = R.string.return_to_course_btn),
                trailingIconRes = AppIcons.ChevronRight,
                onClick = onReturnToCourseClick,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))
        }
    }
}

@Preview(showBackground = true)
@Composable
fun LessonResultScreenPreview() {
    TalkMeTheme {
        LessonResultScreen(onReturnToCourseClick = {})
    }
}
