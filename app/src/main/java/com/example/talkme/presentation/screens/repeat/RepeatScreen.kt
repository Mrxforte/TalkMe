package com.example.talkme.presentation.screens.repeat

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.talkme.R
import com.example.talkme.domain.fsrs.FsrsDailyStats
import com.example.talkme.domain.fsrs.Rating
import com.example.talkme.presentation.components.TalkMeBadge
import com.example.talkme.presentation.components.TalkMeBottomBar
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
 * Production-Ready FSRS Spaced Repetition Vocabulary Learning & Review Screen.
 *
 * @param uiState Current FSRS review session state.
 * @param dailyStats FSRS Daily Dashboard statistics.
 * @param onTabSelected Bottom navigation tab selection handler.
 * @param onRevealAnswerClick Callback to reveal the translation answer.
 * @param onRatingClick Callback to submit user recall rating (Again, Hard, Good, Easy).
 * @param onPlayAudioClick Callback to pronounce the English word via TTS.
 * @param onBackClick Navigation back handler.
 * @param modifier Composable layout modifier.
 */
@Composable
fun RepeatScreen(
    uiState: RepeatUiState,
    dailyStats: FsrsDailyStats,
    onTabSelected: (Int) -> Unit,
    onRevealAnswerClick: () -> Unit,
    onRatingClick: (Rating) -> Unit,
    onPlayAudioClick: () -> Unit,
    modifier: Modifier = Modifier,
    onBackClick: () -> Unit = {},
) {
    val dimensions = LocalDimensions.current

    Scaffold(
        modifier = modifier.fillMaxSize(),
        bottomBar = {
            TalkMeBottomBar(
                selectedTab = 2, // Takrorlash Tab
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
                onBackClick = onBackClick,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // ==========================================
            // 1. FSRS DAILY REPETITION DASHBOARD
            // ==========================================
            TalkMeCard(
                containerColor = MaterialTheme.colorScheme.primaryContainer,
                borderColor = MaterialTheme.colorScheme.primary,
                cornerRadius = dimensions.cornerExtraLarge,
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(
                            text = "FSRS Spaced Repetition Dashboard",
                            style = AppTypography.CardTitle.copy(
                                color = MaterialTheme.colorScheme.primary,
                                fontWeight = FontWeight.Bold,
                            ),
                        )

                        TalkMeBadge(
                            text = "${dailyStats.retentionPercentage}% Retention",
                            containerColor = ContainerGreenLight,
                            textColor = SuccessGreen,
                        )
                    }

                    Spacer(modifier = Modifier.height(dimensions.paddingMedium))

                    // Stats Grid Row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                    ) {
                        Column {
                            Text("${dailyStats.dueWordsCount}", style = AppTypography.GreetingTitle.copy(fontSize = 24.sp, color = MaterialTheme.colorScheme.primary))
                            Text("Qolgan Dars", style = AppTypography.CardSubtitle)
                        }
                        Column {
                            Text("${dailyStats.completedTodayCount}", style = AppTypography.GreetingTitle.copy(fontSize = 24.sp, color = SuccessGreen))
                            Text("Bugun Bajarildi", style = AppTypography.CardSubtitle)
                        }
                        Column {
                            Text("${dailyStats.dailyStreakDays} kun", style = AppTypography.GreetingTitle.copy(fontSize = 24.sp, color = MaterialTheme.colorScheme.onBackground))
                            Text("Ketma-ketlik", style = AppTypography.CardSubtitle)
                        }
                    }

                    Spacer(modifier = Modifier.height(dimensions.paddingMedium))

                    TalkMeProgressBar(
                        progress = if (dailyStats.dueWordsCount + dailyStats.completedTodayCount > 0) {
                            dailyStats.completedTodayCount.toFloat() / (dailyStats.dueWordsCount + dailyStats.completedTodayCount)
                        } else 1.0f,
                        progressColor = SuccessGreen,
                    )
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // ==========================================
            // 2. FSRS INTERACTIVE FLASHCARD REVIEW SESSION
            // ==========================================
            if (uiState.isFinished || uiState.currentItem == null) {
                TalkMeCard(
                    containerColor = ContainerGreenLight,
                    borderColor = SuccessGreen,
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(dimensions.paddingMedium),
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        Text(
                            text = "🎉 Barcha takrorlashlar bugunga bajarildi!",
                            style = AppTypography.GreetingTitle.copy(color = SuccessGreen, fontSize = 20.sp),
                            textAlign = TextAlign.Center,
                        )
                        Spacer(modifier = Modifier.height(dimensions.paddingSmall))
                        Text(
                            text = "Ertaga FSRS algoritmi bo'yicha yangi so'zlar takrorlash uchun tayyorlanadi.",
                            style = AppTypography.CardSubtitle,
                            textAlign = TextAlign.Center,
                        )
                    }
                }
            } else {
                val currentItem = uiState.currentItem!!

                TalkMeCard(
                    containerColor = MaterialTheme.colorScheme.surface,
                    cornerRadius = dimensions.cornerExtraLarge,
                ) {
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        // Card Header
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            TalkMeBadge(
                                text = currentItem.category,
                                containerColor = MaterialTheme.colorScheme.primaryContainer,
                                textColor = MaterialTheme.colorScheme.primary,
                            )

                            Text(
                                text = "${uiState.currentIndex + 1} / ${uiState.dueItems.size}",
                                style = AppTypography.CardSubtitle,
                            )
                        }

                        Spacer(modifier = Modifier.height(dimensions.paddingLarge))

                        // Target Word & Audio Button
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.Center,
                        ) {
                            Text(
                                text = currentItem.word,
                                style = AppTypography.GreetingTitle.copy(
                                    fontSize = 32.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onBackground,
                                ),
                            )

                            Spacer(modifier = Modifier.width(dimensions.paddingMedium))

                            Box(
                                modifier = Modifier
                                    .size(44.dp)
                                    .clip(CircleShape)
                                    .background(MaterialTheme.colorScheme.primaryContainer)
                                    .clickable(onClick = onPlayAudioClick),
                                contentAlignment = Alignment.Center,
                            ) {
                                Icon(
                                    painter = painterResource(id = AppIcons.Volume),
                                    contentDescription = null,
                                    tint = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.size(dimensions.iconMedium),
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(dimensions.paddingMicro))

                        Text(
                            text = currentItem.phonetic,
                            style = AppTypography.GreetingSubtitle.copy(
                                color = MaterialTheme.colorScheme.primary,
                            ),
                        )

                        Spacer(modifier = Modifier.height(dimensions.paddingLarge))

                        // Hidden or Revealed Answer Content
                        if (!uiState.isAnswerRevealed) {
                            TalkMeButton(
                                text = "Javobni Ko'rsatish",
                                onClick = onRevealAnswerClick,
                                containerColor = MaterialTheme.colorScheme.surfaceVariant,
                                contentColor = MaterialTheme.colorScheme.primary,
                            )
                        } else {
                            HorizontalDivider(
                                color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f),
                                thickness = dimensions.borderThin,
                            )

                            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

                            // Translation
                            Text(
                                text = currentItem.translation,
                                style = AppTypography.GreetingTitle.copy(
                                    fontSize = 24.sp,
                                    color = SuccessGreen,
                                    fontWeight = FontWeight.Bold,
                                ),
                            )

                            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                            // Example Sentence
                            Text(
                                text = "“${currentItem.exampleEn}”",
                                style = AppTypography.CardTitle.copy(
                                    color = MaterialTheme.colorScheme.onBackground,
                                ),
                                textAlign = TextAlign.Center,
                            )

                            Spacer(modifier = Modifier.height(dimensions.paddingMicro))

                            Text(
                                text = currentItem.exampleUz,
                                style = AppTypography.CardSubtitle.copy(
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                ),
                                textAlign = TextAlign.Center,
                            )

                            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

                            // ==========================================
                            // FSRS 4-RATING RECALL BUTTONS
                            // ==========================================
                            Text(
                                text = "Xotirada Saqlanish Darajasini Baholang:",
                                style = AppTypography.CardSubtitle,
                            )

                            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(dimensions.paddingMicro),
                            ) {
                                // 1. AGAIN (Red)
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .clip(RoundedCornerShape(dimensions.cornerSmall))
                                        .background(Color(0xFFFFEBEE))
                                        .clickable { onRatingClick(Rating.AGAIN) }
                                        .padding(vertical = dimensions.paddingSmall),
                                    contentAlignment = Alignment.Center,
                                ) {
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Text("Qayta", style = AppTypography.BadgeText.copy(color = Color(0xFFD32F2F), fontWeight = FontWeight.Bold))
                                        Text("1 daq", style = AppTypography.CardSubtitle.copy(fontSize = 10.sp, color = Color(0xFFD32F2F)))
                                    }
                                }

                                // 2. HARD (Orange)
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .clip(RoundedCornerShape(dimensions.cornerSmall))
                                        .background(Color(0xFFFFF3E0))
                                        .clickable { onRatingClick(Rating.HARD) }
                                        .padding(vertical = dimensions.paddingSmall),
                                    contentAlignment = Alignment.Center,
                                ) {
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Text("Qiyin", style = AppTypography.BadgeText.copy(color = Color(0xFFE65100), fontWeight = FontWeight.Bold))
                                        Text("1 kun", style = AppTypography.CardSubtitle.copy(fontSize = 10.sp, color = Color(0xFFE65100)))
                                    }
                                }

                                // 3. GOOD (Green)
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .clip(RoundedCornerShape(dimensions.cornerSmall))
                                        .background(ContainerGreenLight)
                                        .clickable { onRatingClick(Rating.GOOD) }
                                        .padding(vertical = dimensions.paddingSmall),
                                    contentAlignment = Alignment.Center,
                                ) {
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Text("Yaxshi", style = AppTypography.BadgeText.copy(color = SuccessGreen, fontWeight = FontWeight.Bold))
                                        Text("3 kun", style = AppTypography.CardSubtitle.copy(fontSize = 10.sp, color = SuccessGreen))
                                    }
                                }

                                // 4. EASY (Blue)
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .clip(RoundedCornerShape(dimensions.cornerSmall))
                                        .background(MaterialTheme.colorScheme.primaryContainer)
                                        .clickable { onRatingClick(Rating.EASY) }
                                        .padding(vertical = dimensions.paddingSmall),
                                    contentAlignment = Alignment.Center,
                                ) {
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Text("Oson", style = AppTypography.BadgeText.copy(color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold))
                                        Text("7 kun", style = AppTypography.CardSubtitle.copy(fontSize = 10.sp, color = MaterialTheme.colorScheme.primary))
                                    }
                                }
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))
        }
    }
}

@Preview(showBackground = true)
@Composable
fun RepeatScreenPreview() {
    TalkMeTheme {
        RepeatScreen(
            uiState = RepeatUiState(),
            dailyStats = FsrsDailyStats(),
            onTabSelected = {},
            onRevealAnswerClick = {},
            onRatingClick = {},
            onPlayAudioClick = {},
        )
    }
}
