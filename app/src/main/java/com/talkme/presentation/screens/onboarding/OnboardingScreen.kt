package com.talkme.presentation.screens.onboarding

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import com.talkme.R
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.LocalDimensions

/**
 * One-time Onboarding Welcome Screen introducing platform features
 * (Universal 10-Section Lesson System, 6 Character Voices & Gemini 3.8 AI TTS, FSRS-6 Spaced Repetition)
 * per Section 2 Item 2 of PROJECT_RULES.md.
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
            .background(MaterialTheme.colorScheme.background)
            .padding(dims.spaceExtraLarge),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(
            verticalArrangement = Arrangement.spacedBy(dims.spaceMedium)
        ) {
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(dims.radiusFull))
                    .background(MaterialTheme.colorScheme.primaryContainer)
                    .padding(horizontal = dims.spaceMedium, vertical = dims.spaceExtraSmall)
            ) {
                Text(
                    text = stringResource(R.string.onboarding_badge),
                    style = AppTypography.LabelMedium,
                    color = MaterialTheme.colorScheme.primary
                )
            }

            Text(
                text = stringResource(R.string.onboarding_title),
                style = AppTypography.DisplayMedium,
                color = MaterialTheme.colorScheme.onBackground
            )

            Text(
                text = stringResource(R.string.onboarding_subtitle),
                style = AppTypography.BodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        Column(
            verticalArrangement = Arrangement.spacedBy(dims.spaceMedium)
        ) {
            OnboardingFeatureCard(
                icon = AppIcons.Layers,
                title = stringResource(R.string.onboarding_feature_1_title),
                description = stringResource(R.string.onboarding_feature_1_desc)
            )
            OnboardingFeatureCard(
                icon = AppIcons.VolumeUp,
                title = stringResource(R.string.onboarding_feature_2_title),
                description = stringResource(R.string.onboarding_feature_2_desc)
            )
            OnboardingFeatureCard(
                icon = AppIcons.Refresh,
                title = stringResource(R.string.onboarding_feature_3_title),
                description = stringResource(R.string.onboarding_feature_3_desc)
            )
        }

        Button(
            onClick = onStartLearningClick,
            modifier = Modifier
                .fillMaxWidth()
                .height(dims.buttonHeightStandard),
            shape = RoundedCornerShape(dims.radiusLarge)
        ) {
            Text(
                text = stringResource(R.string.action_start_learning),
                style = AppTypography.LabelLarge
            )
        }
    }
}

@Composable
private fun OnboardingFeatureCard(
    icon: ImageVector,
    title: String,
    description: String
) {
    val dims = LocalDimensions.current

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(
                width = dims.borderThin,
                color = MaterialTheme.colorScheme.outline,
                shape = RoundedCornerShape(dims.radiusLarge)
            ),
        shape = RoundedCornerShape(dims.radiusLarge),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(dims.spaceLarge),
            horizontalArrangement = Arrangement.spacedBy(dims.spaceMedium),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(dims.iconButtonSize)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.primaryContainer),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(dims.iconMedium)
                )
            }

            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(dims.spaceExtraSmall)
            ) {
                Text(
                    text = title,
                    style = AppTypography.TitleMedium,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = description,
                    style = AppTypography.BodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}
