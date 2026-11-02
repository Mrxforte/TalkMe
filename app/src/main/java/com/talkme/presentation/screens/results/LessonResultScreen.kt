package com.talkme.presentation.screens.results

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
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.talkme.domain.lesson.model.LessonResultSummary
import com.talkme.presentation.components.TalkMeBadge
import com.talkme.presentation.components.TalkMeButton
import com.talkme.presentation.components.TalkMeButtonVariant
import com.talkme.presentation.components.TalkMeCard
import com.talkme.presentation.components.TalkMeHeader
import com.talkme.presentation.components.TalkMeProgressBar
import com.talkme.presentation.state.LocalTalkMeAppState
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.LocalDimensions
import com.talkme.ui.theme.TalkMeColors

/**
 * Pixel-perfect migration of `src/screens/LessonResultScreen.tsx`:
 * - Top `TalkMeHeader` (`"Natijalarim"` + `"Bugungi dars yakuni"` + Share action button)
 * - Completion Banner Card (`#F1EDFA`, `"Dars yakunlandi"` green chip, checkmark circle, `"Yana bir qadam, Aziz!"`,
 *   `80%` / `3:24` / `+20` stats row)
 * - Weekly Goal Progress Card (`"Haftalik reja"` + `"4/5 dars"` + `TalkMeProgressBar(0.8f)`)
 * - Rule Tip Card (`"Bir joyini mustahkamlaymiz"` + `"1 qoida"` + `“She reading a book.” → “She is reading a book.”` + `"Ertangi takrorlashga qo‘shildi"`)
 * - Exam Prep Card (`"Imtihonga tayyorgarlik"`)
 * - Primary `"Xaritada Keyingi Qulfni Ochish"` + Secondary `"Yangi Bosqich Tafsiloti"` buttons
 */
@Composable
fun LessonResultScreen(
    onBackClick: () -> Unit = {},
    onShareClick: () -> Unit = {},
    onOpenCourseLevels: () -> Unit = {},
    onOpenLevelUnlocked: () -> Unit = {},
    onOpenCourses: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current
    val appState = LocalTalkMeAppState.current

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFFFAFAFC)),
        contentPadding = PaddingValues(
            horizontal = dims.screenPaddingHorizontal,
            vertical = dims.spaceLarge
        ),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // 1. Header with Share Button
        item {
            TalkMeHeader(
                title = "Natijalarim",
                subtitle = "Bugungi dars yakuni",
                onBackClick = onBackClick,
                trailingContent = {
                    IconButton(
                        onClick = onShareClick,
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(Color.White)
                            .border(1.dp, Color(0xFFF0EFF5), CircleShape)
                    ) {
                        Icon(
                            imageVector = AppIcons.Share,
                            contentDescription = "Ulashish",
                            tint = TalkMeColors.PrimaryPurple,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            )
        }

        // 2. Completion Banner Card
        item {
            val shape = RoundedCornerShape(dims.radiusExtraLarge)
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(shape)
                    .background(TalkMeColors.ContainerPurpleLight)
                    .border(1.dp, TalkMeColors.PrimaryPurple.copy(alpha = 0.2f), shape)
                    .padding(dims.cardPadding),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TalkMeBadge(
                        text = "Dars yakunlandi",
                        containerColor = TalkMeColors.ContainerGreenLight,
                        textColor = TalkMeColors.SuccessGreen
                    )

                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(Color.White),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = AppIcons.Check,
                            contentDescription = null,
                            tint = TalkMeColors.SuccessGreen,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }

                Column {
                    Text(
                        text = "Yana bir qadam, ${appState.userName}!",
                        style = AppTypography.DisplayLarge.copy(
                            fontSize = 24.sp,
                            fontWeight = FontWeight.ExtraBold
                        ),
                        color = TalkMeColors.TextPrimary
                    )
                    Text(
                        text = "Kundalik hayot / Tasdiq gaplar",
                        style = AppTypography.LabelMedium,
                        color = TalkMeColors.TextSecondary
                    )
                }

                HorizontalDivider(color = TalkMeColors.PrimaryPurple.copy(alpha = 0.2f))

                // 3-Column Stats Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "80 %",
                            style = AppTypography.DisplayLarge.copy(
                                fontSize = 28.sp,
                                fontWeight = FontWeight.Black
                            ),
                            color = TalkMeColors.PrimaryPurple
                        )
                        Text(
                            text = "4/5 to‘g‘ri javob",
                            style = AppTypography.LabelSmall,
                            color = TalkMeColors.TextSecondary
                        )
                    }

                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "3:24",
                            style = AppTypography.HeadlineMedium.copy(fontWeight = FontWeight.Black),
                            color = TalkMeColors.TextPrimary
                        )
                        Text(
                            text = "sarflangan vaqt",
                            style = AppTypography.LabelSmall,
                            color = TalkMeColors.TextSecondary
                        )
                    }

                    Column(horizontalAlignment = Alignment.End) {
                        Text(
                            text = "+20",
                            style = AppTypography.HeadlineMedium.copy(fontWeight = FontWeight.Black),
                            color = TalkMeColors.SuccessGreen
                        )
                        Text(
                            text = "o‘quv balli",
                            style = AppTypography.LabelSmall,
                            color = TalkMeColors.TextSecondary
                        )
                    }
                }
            }
        }

        // 3. Weekly Goal Progress Card
        item {
            TalkMeCard {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Haftalik reja",
                        style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.ExtraBold),
                        color = TalkMeColors.TextPrimary
                    )
                    Text(
                        text = "4/5 dars",
                        style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.ExtraBold),
                        color = TalkMeColors.SuccessGreen
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                TalkMeProgressBar(
                    progress = 0.8f,
                    fillColor = TalkMeColors.SuccessGreen
                )

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = "A2 maqsadi: hozir qilayotgan ishlarim haqida sodda gap tuza olaman.",
                    style = AppTypography.LabelMedium,
                    color = TalkMeColors.TextSecondary
                )
            }
        }

        // 4. Rule Tip Card ("Bir joyini mustahkamlaymiz")
        item {
            TalkMeCard {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Bir joyini mustahkamlaymiz",
                        style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.ExtraBold),
                        color = TalkMeColors.TextPrimary
                    )
                    TalkMeBadge(
                        text = "1 qoida",
                        containerColor = Color(0xFFF0EFF5),
                        textColor = TalkMeColors.TextSecondary
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = buildAnnotatedString {
                        append("“She reading a book.” → ")
                        withStyle(
                            SpanStyle(
                                color = TalkMeColors.SuccessGreen,
                                textDecoration = TextDecoration.Underline,
                                fontWeight = FontWeight.ExtraBold
                            )
                        ) {
                            append("“She is reading a book.”")
                        }
                    },
                    style = AppTypography.TitleMedium,
                    color = TalkMeColors.TextPrimary
                )

                Spacer(modifier = Modifier.height(6.dp))

                Text(
                    text = "She bilan is yordamchi fe’lini unutmang.",
                    style = AppTypography.LabelMedium,
                    color = TalkMeColors.TextSecondary
                )

                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(
                        imageVector = AppIcons.Refresh,
                        contentDescription = null,
                        tint = TalkMeColors.SuccessGreen,
                        modifier = Modifier.size(16.dp)
                    )
                    Text(
                        text = "Ertangi takrorlashga qo‘shildi",
                        style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.Bold),
                        color = TalkMeColors.SuccessGreen
                    )
                }
            }
        }

        // 5. Exam Prep Card ("Imtihonga tayyorgarlik")
        item {
            val shape = RoundedCornerShape(16.dp)
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(shape)
                    .background(TalkMeColors.ContainerGreenLight.copy(alpha = 0.7f))
                    .border(1.dp, TalkMeColors.SuccessGreen.copy(alpha = 0.4f), shape)
                    .clickable(onClick = onOpenCourses)
                    .padding(18.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(TalkMeColors.SuccessGreen),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = AppIcons.GraduationCap,
                                contentDescription = null,
                                tint = Color.White,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Column {
                            Text(
                                text = "Imtihonga tayyorgarlik",
                                style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.ExtraBold),
                                color = TalkMeColors.TextPrimary
                            )
                            Text(
                                text = "Sertifikat · milliy imtihon · attestatsiya",
                                style = AppTypography.LabelSmall,
                                color = TalkMeColors.TextSecondary
                            )
                        }
                    }

                    Icon(
                        imageVector = AppIcons.ArrowForward,
                        contentDescription = null,
                        tint = TalkMeColors.SuccessGreen,
                        modifier = Modifier.size(20.dp)
                    )
                }

                Text(
                    text = "Tayyorgarlik mashqlari rasmiy to‘liq syllabus yoki natija kafolati emas. Amaldagi formatni rasmiy manbadan tekshiring.",
                    style = AppTypography.LabelSmall,
                    color = TalkMeColors.TextSecondary
                )
            }
        }

        // 6. Action Buttons
        item {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                TalkMeButton(
                    text = "Xaritada Keyingi Qulfni Ochish",
                    trailingIcon = AppIcons.StarFilled,
                    onClick = onOpenCourseLevels
                )

                TalkMeButton(
                    text = "Yangi Bosqich Tafsiloti",
                    variant = TalkMeButtonVariant.Secondary,
                    onClick = onOpenLevelUnlocked
                )
            }
        }
    }
}

/**
 * Legacy overload preserved for backward compatibility with unit tests.
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
    LessonResultScreen(
        onBackClick = onBackClick,
        onShareClick = onShareClick,
        onOpenCourseLevels = onContinueNextLesson,
        onOpenLevelUnlocked = onContinueNextLesson,
        onOpenCourses = onRepeatLesson,
        modifier = modifier
    )
}
