package com.example.talkme.presentation.screens.splash

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import com.example.talkme.R
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.TalkMeTheme
import kotlinx.coroutines.delay

/**
 * Startup Splash Screen displayed first when the application launches.
 * Automatically transitions to the Onboarding Welcome Screen after a 2-second delay.
 *
 * @param onSplashFinished Callback triggered when splash timer expires.
 * @param modifier Composable layout modifier.
 */
@Composable
fun SplashScreen(
    onSplashFinished: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val dimensions = LocalDimensions.current

    LaunchedEffect(Unit) {
        delay(2000L) // 2-second splash transition delay
        onSplashFinished()
    }

    Surface(
        modifier = modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background,
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(dimensions.paddingHuge),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween,
        ) {
            Spacer(modifier = Modifier.height(dimensions.borderThin))

            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Box(
                    modifier = Modifier
                        .size(dimensions.logoSize)
                        .clip(RoundedCornerShape(dimensions.cornerExtraLarge))
                        .background(MaterialTheme.colorScheme.primary),
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(
                        painter = painterResource(id = AppIcons.Book),
                        contentDescription = stringResource(id = R.string.splash_logo_content_description),
                        tint = MaterialTheme.colorScheme.onPrimary,
                        modifier = Modifier.size(dimensions.iconExtraLarge),
                    )
                }

                Spacer(modifier = Modifier.height(dimensions.paddingExtraLarge))

                Text(
                    text = stringResource(id = R.string.splash_title),
                    style = AppTypography.SplashTitle.copy(
                        color = MaterialTheme.colorScheme.onBackground,
                    ),
                    textAlign = TextAlign.Center,
                )

                Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                Text(
                    text = stringResource(id = R.string.splash_subtitle),
                    style = AppTypography.SplashSubtitle.copy(
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    ),
                    textAlign = TextAlign.Center,
                )
            }

            Text(
                text = stringResource(id = R.string.splash_footer),
                style = AppTypography.SplashFooter.copy(
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                ),
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(bottom = dimensions.paddingSmall),
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun SplashScreenPreview() {
    TalkMeTheme {
        SplashScreen(onSplashFinished = {})
    }
}
