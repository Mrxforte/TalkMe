package com.talkme.presentation.screens.onboarding

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.talkme.presentation.components.GrammarHeroIllustration
import com.talkme.presentation.components.TalkMeBadge
import com.talkme.presentation.components.TalkMeButton
import com.talkme.presentation.components.TalkMeButtonVariant
import com.talkme.presentation.components.TalkMeHeader
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.LocalDimensions
import com.talkme.ui.theme.TalkMeColors

/**
 * Pixel-perfect migration of `src/screens/OnboardingScreen.tsx`:
 * - Top `TalkMeHeader` (`"English Learning"` + `"🇺🇿 O‘zbekcha"` pill)
 * - `GrammarHeroIllustration` (3D grammar books, graduation cap, floating badges)
 * - `"HAR KUNI BIR QADAM"` badge
 * - Headline `"Ingliz tilini o‘zingizga ishongan holda o‘rganing."` with underlined purple highlight
 * - Subtitle `"O‘zbekcha tushuntirishlar, qisqa mashqlar va har kuni seziladigan o‘sish."`
 * - Feature chips: `"Kuniga 10 daqiqa"` and `"O‘z sur‘atingizda"`
 * - Primary `"O‘rganishni boshlash"` + Secondary `"Hisobim bor · Kirish"` buttons
 * - Terms of service footer caption
 */
@Composable
fun OnboardingScreen(
    onStartLearningClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(TalkMeColors.BackgroundWarmIvory)
            .verticalScroll(rememberScrollState())
            .padding(horizontal = dims.screenPaddingHorizontal, vertical = dims.spaceLarge),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column {
            TalkMeHeader(
                title = "English Learning",
                trailingContent = {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(dims.radiusFull))
                            .background(TalkMeColors.ContainerPurpleLight)
                            .border(
                                width = dims.borderThin,
                                color = TalkMeColors.PrimaryPurple.copy(alpha = 0.2f),
                                shape = RoundedCornerShape(dims.radiusFull)
                            )
                            .padding(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = "🇺🇿 O‘zbekcha",
                            style = AppTypography.LabelMedium,
                            color = TalkMeColors.PrimaryPurple
                        )
                    }
                }
            )

            Spacer(modifier = Modifier.height(dims.spaceMedium))

            GrammarHeroIllustration()

            Spacer(modifier = Modifier.height(dims.spaceLarge))

            TalkMeBadge(
                text = "HAR KUNI BIR QADAM",
                containerColor = TalkMeColors.ContainerPurpleLight,
                textColor = TalkMeColors.PrimaryPurple
            )

            Spacer(modifier = Modifier.height(dims.spaceMedium))

            Text(
                text = buildAnnotatedString {
                    append("Ingliz tilini o‘zingizga ")
                    withStyle(
                        SpanStyle(
                            color = TalkMeColors.PrimaryPurple,
                            textDecoration = TextDecoration.Underline,
                            fontWeight = FontWeight.ExtraBold
                        )
                    ) {
                        append("ishongan holda")
                    }
                    append(" o‘rganing.")
                },
                style = AppTypography.DisplayLarge.copy(
                    fontSize = 24.sp,
                    lineHeight = 32.sp
                ),
                color = TalkMeColors.TextPrimary
            )

            Spacer(modifier = Modifier.height(dims.spaceSmall))

            Text(
                text = "O‘zbekcha tushuntirishlar, qisqa mashqlar va har kuni seziladigan o‘sish.",
                style = AppTypography.BodyMedium,
                color = TalkMeColors.TextSecondary
            )

            Spacer(modifier = Modifier.height(dims.spaceLarge))

            Row(
                horizontalArrangement = Arrangement.spacedBy(dims.spaceSmall),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    modifier = Modifier
                        .clip(RoundedCornerShape(dims.radiusSmall))
                        .background(TalkMeColors.ContainerPurpleLight)
                        .padding(horizontal = 12.dp, vertical = 7.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Icon(
                        imageVector = AppIcons.Play,
                        contentDescription = null,
                        tint = TalkMeColors.PrimaryPurple,
                        modifier = Modifier.size(14.dp)
                    )
                    Text(
                        text = "Kuniga 10 daqiqa",
                        style = AppTypography.LabelMedium,
                        color = TalkMeColors.PrimaryPurple
                    )
                }

                Row(
                    modifier = Modifier
                        .clip(RoundedCornerShape(dims.radiusSmall))
                        .background(TalkMeColors.ContainerPurpleLight)
                        .padding(horizontal = 12.dp, vertical = 7.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Icon(
                        imageVector = AppIcons.Refresh,
                        contentDescription = null,
                        tint = TalkMeColors.PrimaryPurple,
                        modifier = Modifier.size(14.dp)
                    )
                    Text(
                        text = "O‘z sur‘atingizda",
                        style = AppTypography.LabelMedium,
                        color = TalkMeColors.PrimaryPurple
                    )
                }
            }
        }

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = dims.spaceExtraLarge, bottom = dims.spaceMedium),
            verticalArrangement = Arrangement.spacedBy(dims.spaceMedium)
        ) {
            TalkMeButton(
                text = "O‘rganishni boshlash",
                onClick = onStartLearningClick,
                variant = TalkMeButtonVariant.Primary
            )

            TalkMeButton(
                text = "Hisobim bor · Kirish",
                onClick = onStartLearningClick,
                variant = TalkMeButtonVariant.Secondary
            )

            Text(
                text = "Davom etish orqali foydalanish shartlari va maxfiylik siyosatiga rozilik bildirasiz.",
                style = AppTypography.LabelSmall,
                color = TalkMeColors.TextMuted,
                textAlign = TextAlign.Center,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = dims.spaceExtraSmall)
            )
        }
    }
}
