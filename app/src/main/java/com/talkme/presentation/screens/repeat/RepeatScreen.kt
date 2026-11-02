package com.talkme.presentation.screens.repeat

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.talkme.presentation.components.TalkMeBadge
import com.talkme.presentation.components.TalkMeBottomBar
import com.talkme.presentation.components.TalkMeBottomTab
import com.talkme.presentation.components.TalkMeButton
import com.talkme.presentation.components.TalkMeButtonVariant
import com.talkme.presentation.components.TalkMeCard
import com.talkme.presentation.components.TalkMeHeader
import com.talkme.presentation.components.TalkMeProgressBar
import com.talkme.presentation.state.FsrsRating
import com.talkme.presentation.state.LocalTalkMeAppState
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.LocalDimensions
import com.talkme.ui.theme.TalkMeColors

/**
 * Pixel-perfect migration of `src/screens/RepeatScreen.tsx`:
 * - Top `TalkMeHeader` (`"Takrorlash bo‘limi"` + `"FSRS-6 algoritmi bo‘yicha oraliqli takrorlash"` + restart icon button)
 * - 1. FSRS Memory Retention Dashboard (`#F1EDFA`, `"${retention}% Retention"` badge, `Qolgan Dars` / `Bugun Bajarildi` / `Ketma-ketlik` grid + `TalkMeProgressBar`)
 * - 2. Interactive Flashcard Surface:
 *   - Category badge & card counter (`1 / 6`)
 *   - Word in bold 3xl (`continuous`, `fundamental`, etc.) + circular audio button
 *   - Phonetic notation (`/kənˈtɪn.ju.əs/`)
 *   - Secondary `"Javobni Ko‘rsatish"` button
 *   - Answer revealed: Uzbek translation (`davomiylik, uzluksiz`), example sentence container (`“It is raining continuously today.”` + Uzbek translation)
 *   - FSRS 4-grade rating buttons row:
 *     - `Qayta (1 daq)` (rose)
 *     - `Qiyin (1 kun)` (amber)
 *     - `Yaxshi (3 kun)` (emerald)
 *     - `Oson (7 kun)` (purple)
 * - Completion celebratory state (`🎉 Barcha takrorlashlar bugunga bajarildi!`)
 * - `TalkMeBottomBar` pinned at bottom
 */
@Composable
fun RepeatScreen(
    onBackClick: (() -> Unit)? = null,
    onNavigateHome: () -> Unit = {},
    onNavigateCourses: () -> Unit = {},
    onNavigateProfile: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current
    val appState = LocalTalkMeAppState.current

    var currentIndex by remember { mutableIntStateOf(0) }
    var isAnswerRevealed by remember { mutableStateOf(false) }

    val cards = appState.fsrsCards
    val currentCard = cards.getOrNull(currentIndex)
    val isFinished = currentIndex >= cards.size || currentCard == null

    Scaffold(
        modifier = modifier.fillMaxSize(),
        containerColor = Color(0xFFFAFAFC),
        bottomBar = {
            TalkMeBottomBar(
                activeTab = TalkMeBottomTab.REPEAT,
                onSelectTab = { tab ->
                    when (tab) {
                        TalkMeBottomTab.HOME -> onNavigateHome()
                        TalkMeBottomTab.COURSES -> onNavigateCourses()
                        TalkMeBottomTab.REPEAT -> Unit
                        TalkMeBottomTab.PROFILE -> onNavigateProfile()
                    }
                }
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            contentPadding = PaddingValues(
                horizontal = dims.screenPaddingHorizontal,
                vertical = dims.spaceLarge
            ),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Header
            item {
                TalkMeHeader(
                    title = "Takrorlash bo‘limi",
                    subtitle = "FSRS-6 algoritmi bo‘yicha oraliqli takrorlash",
                    onBackClick = onBackClick,
                    trailingContent = {
                        IconButton(
                            onClick = {
                                appState.resetFsrsVocab()
                                currentIndex = 0
                                isAnswerRevealed = false
                            },
                            modifier = Modifier
                                .size(40.dp)
                                .clip(CircleShape)
                                .background(Color.White)
                                .border(1.dp, Color(0xFFF0EFF5), CircleShape)
                        ) {
                            Icon(
                                imageVector = AppIcons.Refresh,
                                contentDescription = "So‘zlarni qayta boshlash",
                                tint = TalkMeColors.PrimaryPurple,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                )
            }

            // 1. FSRS Memory Retention Dashboard
            item {
                val boxShape = RoundedCornerShape(dims.radiusExtraLarge)
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(boxShape)
                        .background(TalkMeColors.ContainerPurpleLight)
                        .border(1.dp, TalkMeColors.PrimaryPurple.copy(alpha = 0.2f), boxShape)
                        .padding(dims.cardPadding),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "FSRS MEMORY RETENTION DASHBOARD",
                            style = AppTypography.LabelSmall.copy(
                                fontWeight = FontWeight.Black,
                                letterSpacing = 1.sp
                            ),
                            color = TalkMeColors.PrimaryPurple
                        )
                        TalkMeBadge(
                            text = "${appState.averageRetentionPercent}% Retention",
                            containerColor = TalkMeColors.ContainerGreenLight,
                            textColor = TalkMeColors.SuccessGreen
                        )
                    }

                    // 3-Column Stats Row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "${cards.size - currentIndex.coerceAtMost(cards.size)}",
                                style = AppTypography.DisplayLarge.copy(
                                    fontSize = 26.sp,
                                    fontWeight = FontWeight.Black
                                ),
                                color = TalkMeColors.PrimaryPurple
                            )
                            Text(
                                text = "Qolgan Dars",
                                style = AppTypography.LabelSmall.copy(fontWeight = FontWeight.SemiBold),
                                color = TalkMeColors.TextSecondary
                            )
                        }

                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = "$currentIndex",
                                style = AppTypography.DisplayLarge.copy(
                                    fontSize = 26.sp,
                                    fontWeight = FontWeight.Black
                                ),
                                color = TalkMeColors.SuccessGreen
                            )
                            Text(
                                text = "Bugun Bajarildi",
                                style = AppTypography.LabelSmall.copy(fontWeight = FontWeight.SemiBold),
                                color = TalkMeColors.TextSecondary
                            )
                        }

                        Column(horizontalAlignment = Alignment.End) {
                            Text(
                                text = "${appState.streakDays} kun",
                                style = AppTypography.DisplayLarge.copy(
                                    fontSize = 26.sp,
                                    fontWeight = FontWeight.Black
                                ),
                                color = TalkMeColors.TextPrimary
                            )
                            Text(
                                text = "Ketma-ketlik",
                                style = AppTypography.LabelSmall.copy(fontWeight = FontWeight.SemiBold),
                                color = TalkMeColors.TextSecondary
                            )
                        }
                    }

                    TalkMeProgressBar(
                        progress = if (cards.isNotEmpty()) {
                            currentIndex.toFloat() / cards.size.toFloat()
                        } else {
                            1f
                        },
                        fillColor = TalkMeColors.SuccessGreen
                    )
                }
            }

            // 2. Interactive Flashcard Surface / Completion Card
            item {
                if (isFinished || currentCard == null) {
                    val finishShape = RoundedCornerShape(dims.radiusExtraLarge)
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(finishShape)
                            .background(TalkMeColors.ContainerGreenLight)
                            .border(1.5.dp, TalkMeColors.SuccessGreen.copy(alpha = 0.4f), finishShape)
                            .padding(28.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(64.dp)
                                .clip(CircleShape)
                                .background(Color.White),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = AppIcons.CheckCircle,
                                contentDescription = null,
                                tint = TalkMeColors.SuccessGreen,
                                modifier = Modifier.size(36.dp)
                            )
                        }

                        Text(
                            text = "🎉 Barcha takrorlashlar bugunga bajarildi!",
                            style = AppTypography.HeadlineMedium.copy(fontWeight = FontWeight.ExtraBold),
                            color = TalkMeColors.SuccessGreen,
                            textAlign = TextAlign.Center
                        )

                        Text(
                            text = "Ertaga FSRS algoritmi bo‘yicha yangi so‘zlar xotirada saqlanish darajasi asosida takrorlashga tayyorlanadi.",
                            style = AppTypography.BodyMedium,
                            color = Color(0xFF2E7D32),
                            textAlign = TextAlign.Center
                        )

                        Spacer(modifier = Modifier.height(4.dp))

                        TalkMeButton(
                            text = "So‘zlarni qayta mashq qilish",
                            variant = TalkMeButtonVariant.Secondary,
                            onClick = {
                                appState.resetFsrsVocab()
                                currentIndex = 0
                                isAnswerRevealed = false
                            }
                        )
                    }
                } else {
                    TalkMeCard {
                        Column(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(14.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                TalkMeBadge(
                                    text = currentCard.category,
                                    containerColor = TalkMeColors.ContainerPurpleLight,
                                    textColor = TalkMeColors.PrimaryPurple
                                )
                                Text(
                                    text = "${currentIndex + 1} / ${cards.size}",
                                    style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.Bold),
                                    color = TalkMeColors.TextSecondary
                                )
                            }

                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                Text(
                                    text = currentCard.word,
                                    style = AppTypography.DisplayLarge.copy(
                                        fontSize = 32.sp,
                                        fontWeight = FontWeight.Black
                                    ),
                                    color = TalkMeColors.TextPrimary
                                )

                                Box(
                                    modifier = Modifier
                                        .size(44.dp)
                                        .clip(CircleShape)
                                        .background(TalkMeColors.ContainerPurpleLight)
                                        .clickable { appState.speak(currentCard.word) },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = AppIcons.VolumeUp,
                                        contentDescription = "Speak",
                                        tint = TalkMeColors.PrimaryPurple,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                            }

                            Text(
                                text = currentCard.phonetic,
                                style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.SemiBold),
                                color = TalkMeColors.PrimaryPurple
                            )

                            if (!isAnswerRevealed) {
                                Spacer(modifier = Modifier.height(10.dp))
                                TalkMeButton(
                                    text = "Javobni Ko‘rsatish",
                                    variant = TalkMeButtonVariant.Secondary,
                                    onClick = {
                                        isAnswerRevealed = true
                                        appState.speak(currentCard.exampleEn)
                                    }
                                )
                            }

                            AnimatedVisibility(
                                visible = isAnswerRevealed,
                                enter = fadeIn(),
                                exit = fadeOut()
                            ) {
                                Column(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalAlignment = Alignment.CenterHorizontally,
                                    verticalArrangement = Arrangement.spacedBy(14.dp)
                                ) {
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Text(
                                            text = "TARJIMASI",
                                            style = AppTypography.BadgeMicro,
                                            color = TalkMeColors.TextSecondary
                                        )
                                        Text(
                                            text = currentCard.translation,
                                            style = AppTypography.HeadlineMedium.copy(
                                                fontSize = 24.sp,
                                                fontWeight = FontWeight.ExtraBold
                                            ),
                                            color = TalkMeColors.SuccessGreen
                                        )
                                    }

                                    Column(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .clip(RoundedCornerShape(16.dp))
                                            .background(Color(0xFFF8F9FA))
                                            .border(1.dp, Color(0xFFF0EFF5), RoundedCornerShape(16.dp))
                                            .padding(14.dp),
                                        verticalArrangement = Arrangement.spacedBy(4.dp)
                                    ) {
                                        Text(
                                            text = "“${currentCard.exampleEn}”",
                                            style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.Bold),
                                            color = TalkMeColors.TextPrimary
                                        )
                                        Text(
                                            text = currentCard.exampleUz,
                                            style = AppTypography.LabelMedium,
                                            color = TalkMeColors.TextSecondary
                                        )
                                    }

                                    // FSRS 4-Rating Buttons
                                    Column(modifier = Modifier.fillMaxWidth()) {
                                        Text(
                                            text = "Xotirada Saqlanish Darajasini Baholang:",
                                            style = AppTypography.LabelSmall.copy(fontWeight = FontWeight.Bold),
                                            color = TalkMeColors.TextSecondary,
                                            modifier = Modifier.padding(bottom = 8.dp)
                                        )

                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                                        ) {
                                            FsrsGradeButton(
                                                rating = FsrsRating.AGAIN,
                                                bgColor = Color(0xFFFFF1F2),
                                                borderColor = Color(0xFFFECDD3),
                                                textColor = Color(0xFFBE123C),
                                                onClick = {
                                                    appState.submitFsrsReview(currentCard.cardId, FsrsRating.AGAIN)
                                                    isAnswerRevealed = false
                                                    currentIndex += 1
                                                },
                                                modifier = Modifier.weight(1f)
                                            )
                                            FsrsGradeButton(
                                                rating = FsrsRating.HARD,
                                                bgColor = Color(0xFFFFFBEB),
                                                borderColor = Color(0xFFFDE68A),
                                                textColor = Color(0xFF92400E),
                                                onClick = {
                                                    appState.submitFsrsReview(currentCard.cardId, FsrsRating.HARD)
                                                    isAnswerRevealed = false
                                                    currentIndex += 1
                                                },
                                                modifier = Modifier.weight(1f)
                                            )
                                            FsrsGradeButton(
                                                rating = FsrsRating.GOOD,
                                                bgColor = TalkMeColors.ContainerGreenLight,
                                                borderColor = Color(0xFFA7F3D0),
                                                textColor = Color(0xFF065F46),
                                                onClick = {
                                                    appState.submitFsrsReview(currentCard.cardId, FsrsRating.GOOD)
                                                    isAnswerRevealed = false
                                                    currentIndex += 1
                                                },
                                                modifier = Modifier.weight(1f)
                                            )
                                            FsrsGradeButton(
                                                rating = FsrsRating.EASY,
                                                bgColor = TalkMeColors.ContainerPurpleLight,
                                                borderColor = TalkMeColors.ContainerPurpleBorder,
                                                textColor = TalkMeColors.PrimaryPurple,
                                                onClick = {
                                                    appState.submitFsrsReview(currentCard.cardId, FsrsRating.EASY)
                                                    isAnswerRevealed = false
                                                    currentIndex += 1
                                                },
                                                modifier = Modifier.weight(1f)
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun FsrsGradeButton(
    rating: FsrsRating,
    bgColor: Color,
    borderColor: Color,
    textColor: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(bgColor)
            .border(1.dp, borderColor, RoundedCornerShape(12.dp))
            .clickable(onClick = onClick)
            .padding(vertical = 10.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(2.dp)
    ) {
        Text(
            text = rating.labelUz,
            style = AppTypography.TitleMedium.copy(fontSize = 13.sp, fontWeight = FontWeight.Black),
            color = textColor
        )
        Text(
            text = rating.intervalHint,
            style = AppTypography.BadgeMicro,
            color = textColor.copy(alpha = 0.85f)
        )
    }
}

/**
 * Legacy overload preserved for backward compatibility.
 */
@Composable
fun RepeatScreen(
    onBackClick: (() -> Unit)?,
    onPlayAudio: (text: String) -> Unit,
    modifier: Modifier = Modifier
) {
    RepeatScreen(
        onBackClick = onBackClick,
        modifier = modifier
    )
}
