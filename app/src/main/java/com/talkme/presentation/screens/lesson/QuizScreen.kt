package com.talkme.presentation.screens.lesson

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Icon
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
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
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

private data class QuizOptionUiModel(
    val id: Int,
    val letter: String,
    val text: String,
    val isCorrect: Boolean
)

/**
 * Pixel-perfect migration of `src/screens/QuizScreen.tsx`:
 * - `TalkMeHeader` (`"Bilimni sinaymiz"` + `"Present continuous"`)
 * - Progress header (`"4 / 5 savol"` + `"A2"` badge) + `TalkMeProgressBar(0.8f)`
 * - Context badge `"KUTUBXONADA"`
 * - Question Prompt Card (`"To‘g‘ri gapni tanlang"` + `“U hozir kitob o‘qiyapti.”`)
 * - 3 Options (`A. She reads a book now.`, `B. She is reading a book now.`, `C. She reading a book now.`)
 * - Green feedback explanation card (`"To‘g‘ri, davom eting!"` + `"She + is + reading..."`)
 * - Primary `"Keyingi savol"` + Secondary `"Qoidani yana ko‘rish"` buttons
 */
@Composable
fun QuizScreen(
    onBackClick: () -> Unit,
    onFinishQuiz: () -> Unit,
    onReviewRules: () -> Unit,
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current
    val appState = LocalTalkMeAppState.current

    var selectedOptionIndex by remember { mutableIntStateOf(1) }
    var hasSubmitted by remember { mutableStateOf(true) }

    val options = remember {
        listOf(
            QuizOptionUiModel(0, "A", "She reads a book now.", false),
            QuizOptionUiModel(1, "B", "She is reading a book now.", true),
            QuizOptionUiModel(2, "C", "She reading a book now.", false)
        )
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFFFAFAFC))
            .verticalScroll(rememberScrollState())
            .padding(horizontal = dims.screenPaddingHorizontal, vertical = dims.spaceLarge),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        TalkMeHeader(
            title = "Bilimni sinaymiz",
            subtitle = "Present continuous",
            onBackClick = onBackClick
        )

        // Progress Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "4 / 5 savol",
                style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.ExtraBold),
                color = TalkMeColors.PrimaryPurple
            )
            TalkMeBadge(
                text = "A2",
                containerColor = TalkMeColors.ContainerPurpleLight,
                textColor = TalkMeColors.PrimaryPurple
            )
        }

        TalkMeProgressBar(progress = 0.8f)

        TalkMeBadge(
            text = "KUTUBXONADA",
            containerColor = TalkMeColors.ContainerPurpleLight,
            textColor = TalkMeColors.PrimaryPurple
        )

        // Question Prompt Card
        TalkMeCard {
            Text(
                text = "To‘g‘ri gapni tanlang",
                style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.SemiBold),
                color = TalkMeColors.TextSecondary
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = "“U hozir kitob o‘qiyapti.”",
                style = AppTypography.DisplayLarge.copy(
                    fontSize = 24.sp,
                    fontWeight = FontWeight.ExtraBold
                ),
                color = TalkMeColors.TextPrimary
            )
        }

        // Question Options
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            options.forEachIndexed { idx, option ->
                val isSelected = selectedOptionIndex == idx
                val isCorrect = option.isCorrect

                val bgColor = when {
                    isSelected && isCorrect -> TalkMeColors.ContainerGreenLight
                    isSelected && !isCorrect -> TalkMeColors.ContainerCoralLight
                    else -> Color.White
                }
                val borderColor = when {
                    isSelected && isCorrect -> TalkMeColors.SuccessGreen
                    isSelected && !isCorrect -> TalkMeColors.ErrorCoral
                    else -> Color(0xFFF0EFF5)
                }
                val badgeBg = when {
                    isSelected && isCorrect -> TalkMeColors.SuccessGreen
                    isSelected && !isCorrect -> TalkMeColors.ErrorCoral
                    else -> Color(0xFFF0EFF5)
                }
                val badgeFg = if (isSelected) Color.White else TalkMeColors.TextSecondary

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(bgColor)
                        .border(2.dp, borderColor, RoundedCornerShape(16.dp))
                        .clickable {
                            selectedOptionIndex = idx
                            hasSubmitted = true
                            if (option.isCorrect) {
                                appState.speak(option.text)
                            }
                        }
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(28.dp)
                                .clip(CircleShape)
                                .background(badgeBg),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = option.letter,
                                style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.Bold),
                                color = badgeFg
                            )
                        }
                        Text(
                            text = option.text,
                            style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.Bold),
                            color = TalkMeColors.TextPrimary
                        )
                    }

                    if (isSelected) {
                        Icon(
                            imageVector = if (isCorrect) AppIcons.CheckCircle else AppIcons.Warning,
                            contentDescription = null,
                            tint = if (isCorrect) TalkMeColors.SuccessGreen else TalkMeColors.ErrorCoral,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }
        }

        // Explanation Feedback Banner
        if (hasSubmitted) {
            val selectedOpt = options[selectedOptionIndex]
            val isCorrect = selectedOpt.isCorrect
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(
                        if (isCorrect) TalkMeColors.ContainerGreenLight
                        else TalkMeColors.ContainerCoralLight
                    )
                    .border(
                        1.dp,
                        if (isCorrect) TalkMeColors.SuccessGreen.copy(alpha = 0.4f)
                        else TalkMeColors.ErrorCoral.copy(alpha = 0.4f),
                        RoundedCornerShape(16.dp)
                    )
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(
                        imageVector = if (isCorrect) AppIcons.CheckCircle else AppIcons.Warning,
                        contentDescription = null,
                        tint = if (isCorrect) TalkMeColors.SuccessGreen else TalkMeColors.ErrorCoral,
                        modifier = Modifier.size(20.dp)
                    )
                    Text(
                        text = if (isCorrect) "To‘g‘ri, davom eting!" else "Diqqat qiling!",
                        style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.ExtraBold),
                        color = if (isCorrect) TalkMeColors.SuccessGreen else TalkMeColors.ErrorCoral
                    )
                }
                Text(
                    text = buildAnnotatedString {
                        withStyle(SpanStyle(fontWeight = FontWeight.Bold)) {
                            append("She + is + reading. ")
                        }
                        append("“Now” hozirgi paytni bildiradi, shuning uchun ")
                        withStyle(SpanStyle(fontWeight = FontWeight.Bold)) {
                            append("is + fe’l-ing")
                        }
                        append(" ishlatiladi.")
                    },
                    style = AppTypography.LabelMedium,
                    color = if (isCorrect) Color(0xFF2E7D32) else TalkMeColors.ErrorCoral
                )
            }
        }

        // Action Buttons
        Column(
            verticalArrangement = Arrangement.spacedBy(10.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            TalkMeButton(
                text = "Keyingi savol",
                trailingIcon = AppIcons.ArrowForward,
                onClick = {
                    appState.awardXpAndDiamonds(20, 5, appState.selectedLevelId)
                    onFinishQuiz()
                }
            )

            TalkMeButton(
                text = "Qoidani yana ko‘rish",
                variant = TalkMeButtonVariant.Secondary,
                onClick = onReviewRules
            )

            Text(
                text = "Javob saqlandi · yana 1 ta savol qoldi",
                style = AppTypography.LabelSmall,
                color = TalkMeColors.TextMuted,
                textAlign = TextAlign.Center
            )
        }
    }
}
