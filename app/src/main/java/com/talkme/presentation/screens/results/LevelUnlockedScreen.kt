package com.talkme.presentation.screens.results

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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.talkme.presentation.components.TalkMeBadge
import com.talkme.presentation.components.TalkMeButton
import com.talkme.presentation.components.TalkMeButtonVariant
import com.talkme.presentation.components.TalkMeHeader
import com.talkme.presentation.state.LocalTalkMeAppState
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.LocalDimensions
import com.talkme.ui.theme.TalkMeColors

/**
 * Pixel-perfect migration of `src/screens/LevelUnlockedScreen.tsx`:
 * - `TalkMeHeader` (`"A2 · Grammatika"` + `"Yangi bosqich ochildi"`)
 * - Celebration Banner Card (`#F1EDFA`, `"80%"` white badge, `"Zo‘r natija, Aziz!"`,
 *   `"Tasdiq gaplarni mashq qildingiz. Endi inkor gaplarga o‘tamiz."`, `"3:24 dars vaqti"` + `"+20 XP qo‘shildi"`)
 * - Next Stage Card (`"KEYINGI BOSQICH · OCHIQ"`, `"6 daqiqa"`, `"Present continuous"`,
 *   `"Inkor gaplar · 6 daqiqa"`, `“She is not reading a book.”`)
 * - Primary `"Keyingi darsni boshlash"` + Secondary `"Kursga qaytish"` buttons
 */
@Composable
fun LevelUnlockedScreen(
    onBackClick: () -> Unit = {},
    onStartNextLesson: () -> Unit = {},
    onReturnToCourse: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current
    val appState = LocalTalkMeAppState.current

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFFFAFAFC))
            .verticalScroll(rememberScrollState())
            .padding(horizontal = dims.screenPaddingHorizontal, vertical = dims.spaceLarge),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        TalkMeHeader(
            title = "A2 · Grammatika",
            subtitle = "Yangi bosqich ochildi",
            onBackClick = onBackClick
        )

        // Celebration Banner Card
        val bannerShape = RoundedCornerShape(dims.radiusExtraLarge)
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .clip(bannerShape)
                .background(TalkMeColors.ContainerPurpleLight)
                .border(1.dp, TalkMeColors.PrimaryPurple.copy(alpha = 0.2f), bannerShape)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            TalkMeBadge(
                text = "80%",
                containerColor = Color.White,
                textColor = TalkMeColors.PrimaryPurple
            )

            Text(
                text = "Zo‘r natija, ${appState.userName}!",
                style = AppTypography.DisplayLarge.copy(
                    fontSize = 24.sp,
                    fontWeight = FontWeight.ExtraBold
                ),
                color = TalkMeColors.PrimaryPurple,
                textAlign = TextAlign.Center
            )

            Text(
                text = "Tasdiq gaplarni mashq qildingiz. Endi inkor gaplarga o‘tamiz.",
                style = AppTypography.LabelMedium,
                color = TalkMeColors.TextSecondary,
                textAlign = TextAlign.Center
            )

            HorizontalDivider(color = TalkMeColors.PrimaryPurple.copy(alpha = 0.2f))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceAround,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "3:24 dars vaqti",
                    style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.SemiBold),
                    color = TalkMeColors.TextSecondary
                )
                Text(
                    text = "+20 XP qo‘shildi",
                    style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.ExtraBold),
                    color = TalkMeColors.SuccessGreen
                )
            }
        }

        // Next Stage Card ("KEYINGI BOSQICH · OCHIQ")
        val nextShape = RoundedCornerShape(16.dp)
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .clip(nextShape)
                .background(Color.White)
                .border(2.dp, TalkMeColors.PrimaryPurple, nextShape)
                .clickable(onClick = onStartNextLesson)
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "KEYINGI BOSQICH · OCHIQ",
                    style = AppTypography.LabelSmall.copy(
                        fontWeight = FontWeight.Black,
                        letterSpacing = 1.sp
                    ),
                    color = TalkMeColors.PrimaryPurple
                )
                TalkMeBadge(
                    text = "6 daqiqa",
                    containerColor = TalkMeColors.ContainerPurpleLight,
                    textColor = TalkMeColors.PrimaryPurple
                )
            }

            Column {
                Text(
                    text = "Present continuous",
                    style = AppTypography.HeadlineMedium.copy(fontWeight = FontWeight.ExtraBold),
                    color = TalkMeColors.TextPrimary
                )
                Text(
                    text = "Inkor gaplar · 6 daqiqa",
                    style = AppTypography.LabelMedium,
                    color = TalkMeColors.TextSecondary
                )
            }

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color(0xFFF8F9FA))
                    .border(1.dp, Color(0xFFF0EFF5), RoundedCornerShape(12.dp))
                    .padding(12.dp)
            ) {
                Text(
                    text = "“She is not reading a book.”",
                    style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.Bold),
                    color = TalkMeColors.PrimaryPurple
                )
            }
        }

        Spacer(modifier = Modifier.height(4.dp))

        // Action Buttons
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            TalkMeButton(
                text = "Keyingi darsni boshlash",
                trailingIcon = AppIcons.ArrowForward,
                onClick = onStartNextLesson
            )

            TalkMeButton(
                text = "Kursga qaytish",
                variant = TalkMeButtonVariant.Secondary,
                onClick = onReturnToCourse
            )
        }
    }
}
