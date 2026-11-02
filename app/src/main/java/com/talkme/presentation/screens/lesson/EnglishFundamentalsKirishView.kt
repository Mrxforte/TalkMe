package com.talkme.presentation.screens.lesson

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.talkme.presentation.state.LocalTalkMeAppState
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.TalkMeColors

/**
 * Pixel-perfect port of `src/features/grammar/components/EnglishFundamentalsKirishView.tsx`
 * (English Fundamentals — Lesson 1 "Kirish"). Unlike the web version, no TTS/confetti call is
 * made here directly — on-device speech and celebratory feedback are triggered via
 * [com.talkme.presentation.state.TalkMeAppState] exactly as the rest of the Compose app does.
 */
private const val KIRISH_PARAGRAPH_1 =
    "Til — insonlarning bir-biri bilan muloqot qilish, fikr almashish va bir-birini tushunish " +
        "vositasidir. Ingliz tili ham dunyodagi tillardan biri bo‘lib, undagi gaplar so‘zlardan, " +
        "so‘zlar esa harflardan tashkil topadi. Harflar yozuvda ko‘rinadi, tovushlar esa talaffuzda " +
        "eshitiladi. Bularning barchasini TalkMe dasturi orqali birgalikda bosqichma-bosqich o‘rganamiz."

private const val KIRISH_PARAGRAPH_2 =
    "Ingliz tilida chiroyli, tushunarli va to‘g‘ri gapirish uchun grammatikani ham bilish kerak. " +
        "Grammatika — so‘zlarning gap ichida qanday tartibda va qayerda ishlatilishini o‘rgatuvchi " +
        "qoidalar to‘plamidir. U bizga so‘zlarni to‘g‘ri birlashtirib, mazmunli gaplar tuzishga " +
        "yordam beradi."

@Composable
fun EnglishFundamentalsKirishView(
    onComplete: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val appState = LocalTalkMeAppState.current
    val isCompleted = appState.completedLevelIds.contains("ef_01_kirish")

    Column(modifier = modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        // 1. Clean title header
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(TalkMeColors.PrimaryPurple)
                .padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Icon(
                        imageVector = AppIcons.BookOpen,
                        contentDescription = null,
                        tint = Color.White.copy(alpha = 0.8f),
                        modifier = Modifier.padding(top = 2.dp)
                    )
                    Text(
                        text = "English Fundamentals · 1-Dars",
                        style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.SemiBold),
                        color = Color.White.copy(alpha = 0.8f)
                    )
                }
                if (isCompleted) {
                    Row(
                        modifier = Modifier
                            .clip(RoundedCornerShape(50))
                            .background(TalkMeColors.SecondaryTeal)
                            .padding(horizontal = 10.dp, vertical = 3.dp),
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Icon(AppIcons.CheckCircle, contentDescription = null, tint = Color.White)
                        Text("O‘zlashtirildi", style = AppTypography.BadgeMicro, color = Color.White)
                    }
                }
            }
            Text(
                text = "Kirish",
                style = AppTypography.HeadlineMedium.copy(fontWeight = FontWeight.Bold),
                color = Color.White
            )
            Text(
                text = "Ingliz tili, so‘zlar, tovushlar va grammatika haqida sodda boshlang‘ich tushuncha",
                style = AppTypography.BodyMedium,
                color = Color.White.copy(alpha = 0.85f)
            )
        }

        // 2. Main learning explanation card
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(Color.White)
                .border(1.dp, Color(0xFFE0E4EC), RoundedCornerShape(16.dp))
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(0.dp, Color.Transparent)
            ) {
                Text(
                    text = "Kirish",
                    style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.Bold),
                    color = TalkMeColors.TextPrimary
                )
            }
            Text(text = KIRISH_PARAGRAPH_1, style = AppTypography.BodyMedium, color = TalkMeColors.TextPrimary)
            Text(text = KIRISH_PARAGRAPH_2, style = AppTypography.BodyMedium, color = TalkMeColors.TextPrimary)
        }

        // 3. Completion action
        if (!isCompleted) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(TalkMeColors.PrimaryPurple)
                    .clickable {
                        appState.awardXpAndDiamonds(25, 5, "ef_01_kirish")
                        onComplete()
                    }
                    .padding(vertical = 14.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Icon(AppIcons.CheckCircle, contentDescription = null, tint = Color.White)
                Text(
                    text = "Tushunarli — Darsni yakunlash",
                    style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.Bold),
                    color = Color.White
                )
            }
        } else {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(TalkMeColors.ContainerTealLight)
                    .border(1.dp, Color(0xFF80CBC4), RoundedCornerShape(12.dp))
                    .padding(14.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Icon(AppIcons.CheckCircle, contentDescription = null, tint = TalkMeColors.SecondaryTeal)
                    Column {
                        Text(
                            text = "Tabriklaymiz! 1-dars muvaffaqiyatli yakunlandi",
                            style = AppTypography.LabelSmall.copy(fontWeight = FontWeight.Bold),
                            color = Color(0xFF00695C)
                        )
                        Text(
                            text = "Siz til va grammatika asoslarini bilib oldingiz (+25 XP)",
                            style = AppTypography.LabelSmall,
                            color = TalkMeColors.TextPrimary
                        )
                    }
                }
            }
        }
    }
}
