package com.example.talkme.presentation.screens.onboarding

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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Icon
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.talkme.R
import com.example.talkme.presentation.components.TalkMeBadge
import com.example.talkme.presentation.components.TalkMeButton
import com.example.talkme.presentation.components.TalkMeHeader
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.ContainerPurpleLight
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.TalkMeTheme

/**
 * Pixel-Perfect Onboarding & Welcome Screen matching Untitled.pdf Page 6 & 7 specifications.
 * Features branding header with language selector, hero illustration container,
 * highlighted heading text, 10 min / self-pace feature chips, start & login action buttons,
 * and terms & conditions footer note.
 *
 * @param onStartClick Action callback when user clicks "O'rganishni boshlash".
 * @param onLoginClick Action callback when user clicks "Hisobim bor · Kirish".
 * @param modifier Composable layout modifier.
 */
@Composable
fun OnboardingScreen(
    onStartClick: () -> Unit,
    onLoginClick: () -> Unit,
    modifier: Modifier = Modifier,
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
            // Header with Logo, Title and Language Selector ("O'zbekcha")
            TalkMeHeader(
                title = stringResource(id = R.string.splash_title),
                trailingContent = {
                    Text(
                        text = "O‘zbekcha",
                        style = AppTypography.CardTitle.copy(
                            color = MaterialTheme.colorScheme.primary,
                        ),
                    )
                },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // Hero Illustration Box Container
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(280.dp)
                    .clip(RoundedCornerShape(dimensions.cornerExtraLarge))
                    .background(ContainerPurpleLight),
                contentAlignment = Alignment.Center,
            ) {
                Box(
                    modifier = Modifier
                        .size(96.dp)
                        .clip(RoundedCornerShape(dimensions.cornerLarge))
                        .background(MaterialTheme.colorScheme.primary),
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(
                        painter = painterResource(id = AppIcons.Book),
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onPrimary,
                        modifier = Modifier.size(dimensions.iconHuge),
                    )
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))

            // Badge Tag
            TalkMeBadge(
                text = stringResource(id = R.string.onboarding_badge),
                containerColor = MaterialTheme.colorScheme.surfaceVariant,
                textColor = MaterialTheme.colorScheme.primary,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // Main Heading with highlighted words ("ishongan holda")
            val headingText = buildAnnotatedString {
                append("Ingliz tilini o‘zingizga ")
                withStyle(style = SpanStyle(color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)) {
                    append("ishongan holda")
                }
                append(" o‘rganing.")
            }

            Text(
                text = headingText,
                style = AppTypography.GreetingTitle.copy(
                    color = MaterialTheme.colorScheme.onBackground,
                ),
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            Text(
                text = stringResource(id = R.string.onboarding_subtitle),
                style = AppTypography.GreetingSubtitle.copy(
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                ),
            )

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // Highlight Feature Chips Row (10 min / self-pace)
            Row(
                horizontalArrangement = Arrangement.spacedBy(dimensions.paddingMedium),
            ) {
                TalkMeBadge(
                    text = stringResource(id = R.string.onboarding_highlight_time),
                    iconRes = AppIcons.Clock,
                    containerColor = MaterialTheme.colorScheme.surfaceVariant,
                    textColor = MaterialTheme.colorScheme.primary,
                )

                TalkMeBadge(
                    text = stringResource(id = R.string.onboarding_highlight_pace),
                    iconRes = AppIcons.Repeat,
                    containerColor = MaterialTheme.colorScheme.surfaceVariant,
                    textColor = MaterialTheme.colorScheme.primary,
                )
            }

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))

            // Primary Start Button
            TalkMeButton(
                text = stringResource(id = R.string.onboarding_start_btn),
                trailingIconRes = AppIcons.ChevronRight,
                onClick = onStartClick,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // Secondary Login Button
            TalkMeButton(
                text = stringResource(id = R.string.onboarding_login_btn),
                onClick = onLoginClick,
                containerColor = MaterialTheme.colorScheme.surfaceVariant,
                contentColor = MaterialTheme.colorScheme.primary,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // Terms Note
            Text(
                text = stringResource(id = R.string.onboarding_terms_note),
                style = AppTypography.SplashFooter.copy(
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                ),
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth(),
            )

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))
        }
    }
}

@Preview(showBackground = true)
@Composable
fun OnboardingScreenPreview() {
    TalkMeTheme {
        OnboardingScreen(onStartClick = {}, onLoginClick = {})
    }
}
