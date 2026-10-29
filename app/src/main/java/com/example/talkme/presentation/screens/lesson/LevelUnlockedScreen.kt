package com.example.talkme.presentation.screens.lesson

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
import androidx.compose.material3.HorizontalDivider
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
import com.example.talkme.presentation.components.TalkMeButton
import com.example.talkme.presentation.components.TalkMeCard
import com.example.talkme.presentation.components.TalkMeHeader
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.SuccessGreen
import com.example.talkme.ui.theme.TalkMeTheme

/**
 * Pixel-Perfect Level Unlocked & Next Stage Screen matching Untitled.pdf Page 8.
 * Celebrates score completion and unlocks the subsequent grammar level module.
 *
 * @param onStartNextLessonClick Callback to start the next lesson.
 * @param onReturnToCourseClick Callback to return to courses catalog.
 * @param modifier Composable layout modifier.
 * @param onBackClick Back button click callback.
 */
@Composable
fun LevelUnlockedScreen(
    onStartNextLessonClick: () -> Unit,
    onReturnToCourseClick: () -> Unit,
    modifier: Modifier = Modifier,
    onBackClick: () -> Unit = {},
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
            TalkMeHeader(
                title = stringResource(id = R.string.level_unlocked_tag),
                subtitle = stringResource(id = R.string.level_unlocked_title),
                onBackClick = onBackClick,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // Celebration Banner Card
            TalkMeCard(
                containerColor = MaterialTheme.colorScheme.primaryContainer,
                borderColor = MaterialTheme.colorScheme.primaryContainer,
                cornerRadius = dimensions.cornerExtraLarge,
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    TalkMeBadge(
                        text = "80%",
                        containerColor = MaterialTheme.colorScheme.surfaceVariant,
                        textColor = MaterialTheme.colorScheme.primary,
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingMedium))

                    Text(
                        text = stringResource(id = R.string.level_unlocked_congrats),
                        style = AppTypography.GreetingTitle.copy(
                            color = MaterialTheme.colorScheme.primary,
                        ),
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                    Text(
                        text = stringResource(id = R.string.level_unlocked_desc),
                        style = AppTypography.CardSubtitle.copy(
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        ),
                        modifier = Modifier.padding(horizontal = dimensions.paddingMedium),
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingLarge))

                    HorizontalDivider(
                        color = MaterialTheme.colorScheme.primary.copy(alpha = 0.2f),
                        thickness = dimensions.borderThin,
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingLarge))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceAround,
                    ) {
                        Text(
                            text = "3:24 dars vaqti",
                            style = AppTypography.CardSubtitle.copy(
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            ),
                        )
                        Text(
                            text = "+20 XP qo‘shildi",
                            style = AppTypography.CardSubtitle.copy(
                                color = SuccessGreen,
                                fontWeight = FontWeight.Bold,
                            ),
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // Next Stage Card ("KEYINGI BOSQICH · OCHIQ")
            TalkMeCard(
                containerColor = MaterialTheme.colorScheme.surface,
                borderColor = MaterialTheme.colorScheme.primary,
                cornerRadius = dimensions.cornerLarge,
                onClick = onStartNextLessonClick,
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(
                            text = stringResource(id = R.string.next_stage_tag),
                            style = AppTypography.LessonTag.copy(
                                color = MaterialTheme.colorScheme.primary,
                            ),
                        )

                        TalkMeBadge(
                            text = "6 daqiqa",
                            containerColor = MaterialTheme.colorScheme.primaryContainer,
                            textColor = MaterialTheme.colorScheme.primary,
                        )
                    }

                    Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                    Text(
                        text = stringResource(id = R.string.next_stage_title),
                        style = AppTypography.LessonTitle.copy(
                            color = MaterialTheme.colorScheme.onBackground,
                        ),
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingMicro))

                    Text(
                        text = stringResource(id = R.string.next_stage_subtitle),
                        style = AppTypography.CardSubtitle.copy(
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        ),
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingMedium))

                    Text(
                        text = stringResource(id = R.string.next_stage_example),
                        style = AppTypography.CardTitle.copy(
                            color = MaterialTheme.colorScheme.primary,
                            fontWeight = FontWeight.SemiBold,
                        ),
                    )
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))

            // Action Buttons
            TalkMeButton(
                text = stringResource(id = R.string.start_next_lesson_btn),
                trailingIconRes = AppIcons.ChevronRight,
                onClick = onStartNextLessonClick,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            TalkMeButton(
                text = stringResource(id = R.string.return_to_course_btn),
                onClick = onReturnToCourseClick,
                containerColor = MaterialTheme.colorScheme.surfaceVariant,
                contentColor = MaterialTheme.colorScheme.primary,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))
        }
    }
}

@Preview(showBackground = true)
@Composable
fun LevelUnlockedScreenPreview() {
    TalkMeTheme {
        LevelUnlockedScreen(onStartNextLessonClick = {}, onReturnToCourseClick = {})
    }
}
