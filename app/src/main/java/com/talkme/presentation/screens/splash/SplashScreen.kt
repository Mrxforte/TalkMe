package com.talkme.presentation.screens.splash

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.LocalDimensions
import com.talkme.ui.theme.TalkMeColors
import kotlinx.coroutines.delay

/**
 * Pixel-perfect migration of `src/screens/SplashScreen.tsx`:
 * - Linear gradient from `#5E4B8B` to `#43326B`
 * - Top-right `v1.0 • FSRS & Voice AI` glassmorphic pill
 * - Center 96dp (`w-24 h-24`) rounded-3xl white box rotated 3deg with `Mic` icon + pulsing amber sparkle
 * - Title `"TalkMe"` + subtitle `"Kichik qadamlar, katta imkoniyatlar."`
 * - Bottom `"INGLIZ TILI — O‘ZBEKCHA IZOH"` + `"Davom etish uchun ekranga bosing"`
 * - Auto-advances after 2.2s or on tap
 */
@Composable
fun SplashScreen(
    onSplashCompleted: () -> Unit,
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current
    var isVisible by remember { mutableStateOf(false) }
    val logoScale by animateFloatAsState(
        targetValue = if (isVisible) 1f else 0.88f,
        animationSpec = spring(stiffness = Spring.StiffnessMediumLow),
        label = "splashLogoScale"
    )

    val infiniteTransition = rememberInfiniteTransition(label = "sparklePulse")
    val sparkleAlpha by infiniteTransition.animateFloat(
        initialValue = 0.45f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 900),
            repeatMode = RepeatMode.Reverse
        ),
        label = "sparkleAlpha"
    )

    LaunchedEffect(Unit) {
        isVisible = true
        delay(2200L)
        onSplashCompleted()
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        TalkMeColors.PrimaryPurple,
                        TalkMeColors.PrimaryPurpleDeep
                    )
                )
            )
            .clickable { onSplashCompleted() }
            .padding(dims.spaceSection),
        verticalArrangement = Arrangement.SpaceBetween,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Top-right version pill: v1.0 • FSRS & Voice AI
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.End
        ) {
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(dims.radiusFull))
                    .background(Color.White.copy(alpha = 0.12f))
                    .padding(horizontal = 12.dp, vertical = 5.dp)
            ) {
                Text(
                    text = "v1.0 • FSRS & Voice AI",
                    style = AppTypography.LabelMedium,
                    color = Color.White.copy(alpha = 0.85f)
                )
            }
        }

        // Center Brand Logo + Title + Subtitle
        Column(
            modifier = Modifier.scale(logoScale),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(contentAlignment = Alignment.TopEnd) {
                Box(
                    modifier = Modifier
                        .size(96.dp)
                        .rotate(3f)
                        .shadow(20.dp, RoundedCornerShape(dims.radiusExtraLarge))
                        .clip(RoundedCornerShape(dims.radiusExtraLarge))
                        .background(TalkMeColors.SurfaceWhite),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = AppIcons.Mic,
                        contentDescription = null,
                        tint = TalkMeColors.PrimaryPurple,
                        modifier = Modifier.size(48.dp)
                    )
                }

                Icon(
                    imageVector = AppIcons.StarFilled,
                    contentDescription = null,
                    tint = Color(0xFFFCD34D),
                    modifier = Modifier
                        .offset(x = 8.dp, y = (-8).dp)
                        .size(28.dp)
                        .alpha(sparkleAlpha)
                )
            }

            Spacer(modifier = Modifier.height(dims.spaceExtraLarge))

            Text(
                text = "TalkMe",
                style = AppTypography.DisplayLarge.copy(
                    fontSize = 30.sp,
                    fontWeight = FontWeight.ExtraBold
                ),
                color = TalkMeColors.SurfaceWhite
            )

            Spacer(modifier = Modifier.height(dims.spaceSmall))

            Text(
                text = "Kichik qadamlar, katta imkoniyatlar.",
                style = AppTypography.BodyMedium.copy(fontWeight = FontWeight.Medium),
                color = Color.White.copy(alpha = 0.82f),
                textAlign = TextAlign.Center
            )
        }

        // Bottom caption
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "INGLIZ TILI — O‘ZBEKCHA IZOH",
                style = AppTypography.LabelSmall.copy(
                    letterSpacing = 1.5.sp,
                    fontWeight = FontWeight.Bold
                ),
                color = Color.White.copy(alpha = 0.62f),
                textAlign = TextAlign.Center
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Davom etish uchun ekranga bosing",
                style = AppTypography.BadgeMicro,
                color = Color.White.copy(alpha = 0.42f),
                textAlign = TextAlign.Center
            )
        }
    }
}
