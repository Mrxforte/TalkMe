package com.talkme.presentation.screens.splash

import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.res.stringResource
import com.talkme.R
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.LocalDimensions
import kotlinx.coroutines.delay

/**
 * Initial branding Splash Screen loaded on app launch with a 2-second timer
 * per Section 2 Item 1 of PROJECT_RULES.md.
 */
@Composable
fun SplashScreen(
    onSplashCompleted: () -> Unit,
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current
    var isVisible by remember { mutableStateOf(false) }
    val logoScale by animateFloatAsState(
        targetValue = if (isVisible) 1f else 0.85f,
        animationSpec = spring(stiffness = Spring.StiffnessMediumLow),
        label = "splashLogoScale"
    )

    LaunchedEffect(Unit) {
        isVisible = true
        delay(2000L)
        onSplashCompleted()
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.primary)
            .padding(dims.spaceExtraLarge),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier.scale(logoScale),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(dims.spaceMedium)
        ) {
            Box(
                modifier = Modifier
                    .size(dims.buttonHeightStandard)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.primaryContainer),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = AppIcons.VolumeUp,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(dims.iconLarge)
                )
            }

            Text(
                text = stringResource(R.string.app_name),
                style = AppTypography.DisplayLarge,
                color = MaterialTheme.colorScheme.onPrimary
            )

            Text(
                text = stringResource(R.string.splash_tagline),
                style = AppTypography.BodyMedium,
                color = MaterialTheme.colorScheme.primaryContainer
            )
        }
    }
}
