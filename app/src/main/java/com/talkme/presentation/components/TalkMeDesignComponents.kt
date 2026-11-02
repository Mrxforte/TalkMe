package com.talkme.presentation.components

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.LocalDimensions
import com.talkme.ui.theme.TalkMeColors

/**
 * Reusable TalkMe Card surface matching the React warm-ivory & white card system
 * (`bg-white rounded-[20px] border border-[#EAE4DC] p-5 shadow-sm`).
 */
@Composable
fun TalkMeCard(
    modifier: Modifier = Modifier,
    containerColor: Color = TalkMeColors.SurfaceWhite,
    borderColor: Color = TalkMeColors.OutlineWarm,
    borderWidth: Dp = LocalDimensions.current.borderThin,
    cornerRadius: Dp = LocalDimensions.current.radiusLarge,
    contentPadding: PaddingValues = PaddingValues(LocalDimensions.current.cardPadding),
    onClick: (() -> Unit)? = null,
    content: @Composable ColumnScope.() -> Unit
) {
    val shape = RoundedCornerShape(cornerRadius)
    val baseModifier = modifier
        .fillMaxWidth()
        .clip(shape)
        .background(containerColor)
        .border(width = borderWidth, color = borderColor, shape = shape)
        .let { mod ->
            if (onClick != null) {
                mod.clickable(onClick = onClick)
            } else {
                mod
            }
        }
        .padding(contentPadding)

    Column(
        modifier = baseModifier,
        content = content
    )
}

/**
 * Supported visual variants for [TalkMeButton] matching the React button hierarchy.
 */
enum class TalkMeButtonVariant {
    Primary,
    Secondary,
    Outline,
    Emerald,
    GradientIndigoPurple,
    Danger
}

/**
 * Reusable TalkMe Primary/Secondary/Outline CTA Button with press-scale physics.
 */
@Composable
fun TalkMeButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: TalkMeButtonVariant = TalkMeButtonVariant.Primary,
    enabled: Boolean = true,
    leadingIcon: ImageVector? = null,
    trailingIcon: ImageVector? = null,
    height: Dp = LocalDimensions.current.buttonHeightStandard,
    cornerRadius: Dp = LocalDimensions.current.radiusMedium
) {
    val dims = LocalDimensions.current
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed && enabled) 0.98f else 1f,
        animationSpec = spring(stiffness = Spring.StiffnessMediumLow),
        label = "talkMeButtonScale"
    )

    val shape = RoundedCornerShape(cornerRadius)
    val bgBrush = when (variant) {
        TalkMeButtonVariant.GradientIndigoPurple -> Brush.horizontalGradient(
            listOf(TalkMeColors.PrimaryPurple, TalkMeColors.PrimaryPurpleDark)
        )
        else -> null
    }
    val bgColor = when {
        !enabled -> TalkMeColors.SurfaceBeige2
        variant == TalkMeButtonVariant.Primary -> TalkMeColors.PrimaryPurple
        variant == TalkMeButtonVariant.Secondary -> TalkMeColors.ContainerPurpleLight
        variant == TalkMeButtonVariant.Outline -> TalkMeColors.SurfaceWhite
        variant == TalkMeButtonVariant.Emerald -> TalkMeColors.SuccessGreen
        variant == TalkMeButtonVariant.GradientIndigoPurple -> TalkMeColors.PrimaryPurple
        variant == TalkMeButtonVariant.Danger -> TalkMeColors.ErrorCoral
        else -> TalkMeColors.PrimaryPurple
    }
    val contentColor = when {
        !enabled -> TalkMeColors.TextDisabled
        variant == TalkMeButtonVariant.Primary -> TalkMeColors.SurfaceWhite
        variant == TalkMeButtonVariant.Secondary -> TalkMeColors.PrimaryPurple
        variant == TalkMeButtonVariant.Outline -> TalkMeColors.TextPrimary
        variant == TalkMeButtonVariant.Emerald -> TalkMeColors.SurfaceWhite
        variant == TalkMeButtonVariant.GradientIndigoPurple -> TalkMeColors.SurfaceWhite
        variant == TalkMeButtonVariant.Danger -> TalkMeColors.SurfaceWhite
        else -> TalkMeColors.SurfaceWhite
    }

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(height)
            .scale(scale)
            .clip(shape)
            .let { mod ->
                if (bgBrush != null && enabled) {
                    mod.background(bgBrush)
                } else {
                    mod.background(bgColor)
                }
            }
            .let { mod ->
                if (variant == TalkMeButtonVariant.Outline) {
                    mod.border(dims.borderThin, TalkMeColors.OutlineWarm, shape)
                } else if (variant == TalkMeButtonVariant.Secondary) {
                    mod.border(dims.borderThin, TalkMeColors.ContainerPurpleBorder, shape)
                } else {
                    mod
                }
            }
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                enabled = enabled,
                onClick = onClick
            )
            .padding(horizontal = dims.spaceLarge),
        contentAlignment = Alignment.Center
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            if (leadingIcon != null) {
                Icon(
                    imageVector = leadingIcon,
                    contentDescription = null,
                    tint = contentColor,
                    modifier = Modifier.size(dims.iconMedium)
                )
                Spacer(modifier = Modifier.width(dims.spaceSmall))
            }
            Text(
                text = text,
                style = AppTypography.TitleMedium,
                color = contentColor,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            if (trailingIcon != null) {
                Spacer(modifier = Modifier.width(dims.spaceSmall))
                Icon(
                    imageVector = trailingIcon,
                    contentDescription = null,
                    tint = contentColor,
                    modifier = Modifier.size(dims.iconSmall)
                )
            }
        }
    }
}

/**
 * Reusable pill/chip badge supporting both (`containerColor`, `textColor`) and
 * (`backgroundColor`, `contentColor`) parameter conventions across screens.
 */
@Composable
fun TalkMeBadge(
    text: String,
    modifier: Modifier = Modifier,
    containerColor: Color = TalkMeColors.ContainerPurpleLight,
    textColor: Color = TalkMeColors.PrimaryPurple,
    backgroundColor: Color? = null,
    contentColor: Color? = null,
    borderColor: Color? = null
) {
    val dims = LocalDimensions.current
    val resolvedBg = backgroundColor ?: containerColor
    val resolvedFg = contentColor ?: textColor
    val shape = RoundedCornerShape(dims.radiusSmall)

    Box(
        modifier = modifier
            .clip(shape)
            .background(resolvedBg)
            .let { mod ->
                if (borderColor != null) {
                    mod.border(dims.borderThin, borderColor, shape)
                } else {
                    mod
                }
            }
            .padding(horizontal = dims.spaceSmall, vertical = dims.spaceTiny),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            style = AppTypography.LabelSmall,
            color = resolvedFg
        )
    }
}

/**
 * Animated horizontal progress bar matching React progress indicators.
 */
@Composable
fun TalkMeProgressBar(
    progress: Float,
    modifier: Modifier = Modifier,
    height: Dp = LocalDimensions.current.progressBarHeight,
    trackColor: Color = TalkMeColors.SurfaceBeige2,
    fillColor: Color = TalkMeColors.PrimaryPurple
) {
    val clamped = progress.coerceIn(0f, 1f)
    val animatedProgress by animateFloatAsState(
        targetValue = clamped,
        animationSpec = tween(durationMillis = 450, easing = FastOutSlowInEasing),
        label = "talkMeProgressBar"
    )
    val shape = RoundedCornerShape(LocalDimensions.current.radiusFull)

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(height)
            .clip(shape)
            .background(trackColor)
    ) {
        Box(
            modifier = Modifier
                .fillMaxHeight()
                .fillMaxWidth(animatedProgress)
                .clip(shape)
                .background(fillColor)
        )
    }
}

/**
 * Segmented Tab Row matching React `Qoida / Misol / Mashq` and `Bu hafta / Jami` tabs.
 */
@Composable
fun TalkMeTabRow(
    tabs: List<String>,
    selectedIndex: Int,
    onSelectTab: (Int) -> Unit,
    completedIndices: Set<Int> = emptySet(),
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(dims.radiusMedium))
            .background(TalkMeColors.SurfaceWhite)
            .border(dims.borderThin, TalkMeColors.OutlineWarm, RoundedCornerShape(dims.radiusMedium))
            .padding(dims.spaceExtraSmall),
        horizontalArrangement = Arrangement.spacedBy(dims.spaceExtraSmall)
    ) {
        tabs.forEachIndexed { index, label ->
            val isSelected = selectedIndex == index
            val isDone = completedIndices.contains(index)
            Row(
                modifier = Modifier
                    .weight(1f)
                    .height(dims.buttonHeightCompact)
                    .clip(RoundedCornerShape(dims.radiusSmall))
                    .background(if (isSelected) TalkMeColors.PrimaryPurple else Color.Transparent)
                    .clickable { onSelectTab(index) },
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = label,
                    style = AppTypography.LabelMedium,
                    color = if (isSelected) TalkMeColors.SurfaceWhite else TalkMeColors.TextSecondary
                )
                if (isDone) {
                    Spacer(modifier = Modifier.width(dims.spaceExtraSmall))
                    Icon(
                        imageVector = AppIcons.Check,
                        contentDescription = null,
                        tint = if (isSelected) TalkMeColors.SurfaceWhite else TalkMeColors.SuccessGreen,
                        modifier = Modifier.size(13.dp)
                    )
                }
            }
        }
    }
}

/**
 * Bottom navigation tabs matching `src/components/BottomNav.tsx`.
 */
enum class TalkMeBottomTab(val labelUz: String) {
    HOME("Bosh sahifa"),
    COURSES("Kurslar"),
    REPEAT("Takrorlash"),
    PROFILE("Natijalar")
}

/**
 * Pixel-faithful replica of `src/components/BottomNav.tsx`:
 * White rounded top bar (`rounded-t-[24px] border-t border-[#EAE4DC]`) with 4 items
 * (`Bosh sahifa`, `Kurslar`, `Takrorlash`, `Natijalar`), active `#F3EFFA` icon pill and `#5E4B8B` text.
 */
@Composable
fun TalkMeBottomBar(
    activeTab: TalkMeBottomTab,
    onSelectTab: (TalkMeBottomTab) -> Unit,
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current
    Surface(
        modifier = modifier
            .fillMaxWidth()
            .shadow(
                elevation = 10.dp,
                shape = RoundedCornerShape(topStart = dims.radiusExtraLarge, topEnd = dims.radiusExtraLarge)
            ),
        shape = RoundedCornerShape(topStart = dims.radiusExtraLarge, topEnd = dims.radiusExtraLarge),
        color = TalkMeColors.SurfaceWhite
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .border(
                    width = dims.borderThin,
                    color = TalkMeColors.OutlineWarm,
                    shape = RoundedCornerShape(topStart = dims.radiusExtraLarge, topEnd = dims.radiusExtraLarge)
                )
                .padding(horizontal = dims.spaceLarge, vertical = dims.spaceSmall),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            TalkMeBottomTab.entries.forEach { tab ->
                val isActive = activeTab == tab
                val icon = when (tab) {
                    TalkMeBottomTab.HOME -> AppIcons.Home
                    TalkMeBottomTab.COURSES -> AppIcons.BookOpen
                    TalkMeBottomTab.REPEAT -> AppIcons.Refresh
                    TalkMeBottomTab.PROFILE -> AppIcons.Person
                }
                Column(
                    modifier = Modifier
                        .clip(RoundedCornerShape(dims.radiusMedium))
                        .clickable { onSelectTab(tab) }
                        .padding(horizontal = dims.spaceSmall, vertical = dims.spaceExtraSmall),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(dims.spaceTiny)
                ) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(dims.radiusSmall))
                            .background(
                                if (isActive) TalkMeColors.ContainerPurpleLight else Color.Transparent
                            )
                            .padding(horizontal = dims.spaceMedium, vertical = 6.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = icon,
                            contentDescription = tab.labelUz,
                            tint = if (isActive) TalkMeColors.PrimaryPurple else TalkMeColors.TextMuted,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                    Text(
                        text = tab.labelUz,
                        style = AppTypography.BadgeMicro.copy(
                            fontSize = 11.sp,
                            fontWeight = if (isActive) FontWeight.Bold else FontWeight.Medium
                        ),
                        color = if (isActive) TalkMeColors.PrimaryPurple else TalkMeColors.TextMuted
                    )
                }
            }
        }
    }
}

/**
 * Pixel-faithful Jetpack Compose replica of `src/components/GrammarHeroIllustration.tsx`:
 * - Soft glowing gradient aura
 * - Floating `A2 CEFR`, `Voice AI TTS`, and `FSRS-6` badges
 * - 3D stacked grammar books (Rose, Emerald, Indigo) with page edges & yellow bookmark ribbon
 * - Graduation cap with golden tassel
 * - Floating alphabet tiles `Aa`, `Bb`, `Cc`
 */
@Composable
fun GrammarHeroIllustration(
    modifier: Modifier = Modifier
) {
    val infiniteTransition = rememberInfiniteTransition(label = "heroFloat")
    val floatOffset by infiniteTransition.animateFloat(
        initialValue = -3f,
        targetValue = 3f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 2200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "floatOffset"
    )

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(250.dp),
        contentAlignment = Alignment.Center
    ) {
        // Soft purple/amber radial glow
        Canvas(modifier = Modifier.size(220.dp)) {
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        TalkMeColors.ContainerPurpleBorder.copy(alpha = 0.65f),
                        TalkMeColors.ContainerAmberLight.copy(alpha = 0.4f),
                        Color.Transparent
                    )
                ),
                radius = size.minDimension / 2f
            )
        }

        // Central 3D Book Stack & Graduation Cap Canvas
        Canvas(
            modifier = Modifier
                .size(230.dp)
                .offset(y = floatOffset.dp)
        ) {
            val w = size.width
            val h = size.height

            // Ground shadow
            drawOval(
                color = TalkMeColors.ContainerPurpleBorder.copy(alpha = 0.55f),
                topLeft = Offset(w * 0.16f, h * 0.80f),
                size = Size(w * 0.68f, h * 0.08f)
            )

            // Bottom Book (Rose/Coral - Grammar Foundation)
            drawRoundRect(
                color = Color(0xFFE07A5F),
                topLeft = Offset(w * 0.19f, h * 0.64f),
                size = Size(w * 0.62f, h * 0.14f),
                cornerRadius = CornerRadius(18f, 18f)
            )
            drawRoundRect(
                color = Color(0xFFFFFBF7),
                topLeft = Offset(w * 0.23f, h * 0.665f),
                size = Size(w * 0.55f, h * 0.09f),
                cornerRadius = CornerRadius(10f, 10f)
            )

            // Middle Book (Emerald - Vocabulary & Practice)
            drawRoundRect(
                color = TalkMeColors.SuccessGreen,
                topLeft = Offset(w * 0.22f, h * 0.49f),
                size = Size(w * 0.58f, h * 0.14f),
                cornerRadius = CornerRadius(18f, 18f)
            )
            drawRoundRect(
                color = Color(0xFFFFFBF7),
                topLeft = Offset(w * 0.26f, h * 0.515f),
                size = Size(w * 0.51f, h * 0.09f),
                cornerRadius = CornerRadius(10f, 10f)
            )
            // Golden bookmark ribbon
            val ribbonPath = Path().apply {
                moveTo(w * 0.64f, h * 0.52f)
                lineTo(w * 0.69f, h * 0.52f)
                lineTo(w * 0.69f, h * 0.66f)
                lineTo(w * 0.665f, h * 0.635f)
                lineTo(w * 0.64f, h * 0.66f)
                close()
            }
            drawPath(ribbonPath, color = TalkMeColors.GoldBookmark)

            // Top Book (Royal Indigo - English Mastery)
            drawRoundRect(
                color = TalkMeColors.PrimaryPurple,
                topLeft = Offset(w * 0.20f, h * 0.34f),
                size = Size(w * 0.56f, h * 0.14f),
                cornerRadius = CornerRadius(18f, 18f)
            )
            drawRoundRect(
                color = Color(0xFFFFFBF7),
                topLeft = Offset(w * 0.24f, h * 0.365f),
                size = Size(w * 0.49f, h * 0.09f),
                cornerRadius = CornerRadius(10f, 10f)
            )

            // Graduation Cap on Top
            val capDiamond = Path().apply {
                moveTo(w * 0.48f, h * 0.13f)
                lineTo(w * 0.72f, h * 0.21f)
                lineTo(w * 0.48f, h * 0.29f)
                lineTo(w * 0.24f, h * 0.21f)
                close()
            }
            drawPath(capDiamond, color = Color(0xFF3E3060))
            drawRoundRect(
                color = TalkMeColors.PrimaryPurple,
                topLeft = Offset(w * 0.36f, h * 0.25f),
                size = Size(w * 0.24f, h * 0.08f),
                cornerRadius = CornerRadius(12f, 12f)
            )
            // Tassel
            drawLine(
                color = TalkMeColors.GoldBookmark,
                start = Offset(w * 0.48f, h * 0.21f),
                end = Offset(w * 0.66f, h * 0.26f),
                strokeWidth = 5f,
                cap = StrokeCap.Round
            )
            drawLine(
                color = TalkMeColors.GoldBookmark,
                start = Offset(w * 0.66f, h * 0.26f),
                end = Offset(w * 0.66f, h * 0.34f),
                strokeWidth = 5f,
                cap = StrokeCap.Round
            )
            drawCircle(
                color = TalkMeColors.WarningAmber,
                radius = 7f,
                center = Offset(w * 0.66f, h * 0.35f)
            )
        }

        // Top-Left Floating Badge: A2 CEFR
        Row(
            modifier = Modifier
                .align(Alignment.TopStart)
                .padding(start = 16.dp, top = 16.dp)
                .rotate(-4f)
                .clip(RoundedCornerShape(16.dp))
                .background(TalkMeColors.SurfaceWhite)
                .border(1.dp, TalkMeColors.ContainerPurpleBorder, RoundedCornerShape(16.dp))
                .padding(horizontal = 12.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(20.dp)
                    .clip(CircleShape)
                    .background(TalkMeColors.ContainerPurpleLight),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "✓",
                    style = AppTypography.BadgeMicro,
                    color = TalkMeColors.PrimaryPurple
                )
            }
            Text(
                text = "A2 CEFR",
                style = AppTypography.LabelSmall,
                color = TalkMeColors.PrimaryPurple
            )
        }

        // Top-Right Floating Badge: Voice AI TTS
        Row(
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(end = 12.dp, top = 28.dp)
                .rotate(4f)
                .clip(RoundedCornerShape(16.dp))
                .background(TalkMeColors.SurfaceWhite)
                .border(1.dp, TalkMeColors.ContainerGreenBorder, RoundedCornerShape(16.dp))
                .padding(horizontal = 12.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .clip(CircleShape)
                    .background(TalkMeColors.SuccessGreen)
            )
            Text(
                text = "Voice AI TTS",
                style = AppTypography.LabelSmall,
                color = TalkMeColors.SuccessGreen
            )
        }

        // Bottom-Left Floating Badge: FSRS-6
        Row(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(start = 24.dp, bottom = 14.dp)
                .clip(RoundedCornerShape(14.dp))
                .background(TalkMeColors.ContainerAmberLight)
                .border(1.dp, TalkMeColors.WarningAmber.copy(alpha = 0.35f), RoundedCornerShape(14.dp))
                .padding(horizontal = 10.dp, vertical = 5.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(
                text = "★ FSRS-6",
                style = AppTypography.BadgeMicro,
                color = TalkMeColors.WarningAmber
            )
        }

        // Bottom-Right Floating Letter Tiles: Aa / Bb
        Row(
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(end = 24.dp, bottom = 14.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(10.dp))
                    .background(TalkMeColors.ContainerPurpleLight)
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Text(
                    text = "Aa",
                    style = AppTypography.LabelSmall,
                    color = TalkMeColors.PrimaryPurple
                )
            }
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(10.dp))
                    .background(TalkMeColors.ContainerGreenLight)
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Text(
                    text = "Bb",
                    style = AppTypography.LabelSmall,
                    color = TalkMeColors.SuccessGreen
                )
            }
        }
    }
}

/**
 * Custom vector illustration for each of the 11 grammar categories in `CoursesScreen`
 * matching `src/components/CourseIllustrations.tsx`.
 */
@Composable
fun CourseCategoryIllustration(
    categoryId: String,
    accentColor: Color,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.size(110.dp)) {
            val w = size.width
            val h = size.height

            // Soft circular aura
            drawCircle(
                color = accentColor.copy(alpha = 0.12f),
                radius = size.minDimension * 0.44f,
                center = Offset(w * 0.5f, h * 0.5f)
            )

            // Main 3D tilted card / book base
            drawRoundRect(
                color = Color.White,
                topLeft = Offset(w * 0.18f, h * 0.22f),
                size = Size(w * 0.64f, h * 0.56f),
                cornerRadius = CornerRadius(22f, 22f)
            )
            drawRoundRect(
                color = accentColor.copy(alpha = 0.22f),
                topLeft = Offset(w * 0.18f, h * 0.22f),
                size = Size(w * 0.64f, h * 0.56f),
                cornerRadius = CornerRadius(22f, 22f),
                style = Stroke(width = 3f)
            )

            // Header bar inside card
            drawRoundRect(
                color = accentColor,
                topLeft = Offset(w * 0.26f, h * 0.31f),
                size = Size(w * 0.48f, h * 0.12f),
                cornerRadius = CornerRadius(10f, 10f)
            )

            // Category-specific geometric accent
            when (categoryId) {
                "cat-1", "cat-2" -> {
                    // Clock / Timeline rings for Tenses
                    drawCircle(
                        color = accentColor.copy(alpha = 0.2f),
                        radius = w * 0.16f,
                        center = Offset(w * 0.5f, h * 0.60f)
                    )
                    drawCircle(
                        color = accentColor,
                        radius = w * 0.16f,
                        center = Offset(w * 0.5f, h * 0.60f),
                        style = Stroke(width = 4f)
                    )
                    drawLine(
                        color = accentColor,
                        start = Offset(w * 0.5f, h * 0.60f),
                        end = Offset(w * 0.5f, h * 0.50f),
                        strokeWidth = 4f,
                        cap = StrokeCap.Round
                    )
                    drawLine(
                        color = accentColor,
                        start = Offset(w * 0.5f, h * 0.60f),
                        end = Offset(w * 0.59f, h * 0.64f),
                        strokeWidth = 4f,
                        cap = StrokeCap.Round
                    )
                }
                "cat-3", "cat-4" -> {
                    // Building blocks for Verbs & Modals
                    drawRoundRect(
                        color = accentColor.copy(alpha = 0.25f),
                        topLeft = Offset(w * 0.26f, h * 0.49f),
                        size = Size(w * 0.22f, h * 0.18f),
                        cornerRadius = CornerRadius(8f, 8f)
                    )
                    drawRoundRect(
                        color = accentColor,
                        topLeft = Offset(w * 0.52f, h * 0.49f),
                        size = Size(w * 0.22f, h * 0.18f),
                        cornerRadius = CornerRadius(8f, 8f)
                    )
                }
                else -> {
                    // Structured lines & badge
                    drawRoundRect(
                        color = accentColor.copy(alpha = 0.28f),
                        topLeft = Offset(w * 0.26f, h * 0.49f),
                        size = Size(w * 0.48f, h * 0.08f),
                        cornerRadius = CornerRadius(8f, 8f)
                    )
                    drawRoundRect(
                        color = accentColor.copy(alpha = 0.18f),
                        topLeft = Offset(w * 0.26f, h * 0.61f),
                        size = Size(w * 0.34f, h * 0.08f),
                        cornerRadius = CornerRadius(8f, 8f)
                    )
                    drawCircle(
                        color = accentColor,
                        radius = w * 0.09f,
                        center = Offset(w * 0.72f, h * 0.66f)
                    )
                }
            }
        }

        // Category badge pill at bottom-right of illustration
        val badgeText = when (categoryId) {
            "cat-1" -> "NOW • DO"
            "cat-2" -> "PAST • WILL"
            "cat-3" -> "CAN • MUST"
            "cat-4" -> "TO • -ING"
            "cat-5" -> "A / AN / THE"
            "cat-6" -> "MY • SOME"
            "cat-7" -> "-ER • -EST"
            "cat-8" -> "IN • ON • AT"
            "cat-9" -> "WHO • WHAT"
            "cat-10" -> "IF • BECAUSE"
            else -> "PASSIVE"
        }
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 10.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(TalkMeColors.SurfaceWhite.copy(alpha = 0.92f))
                .border(1.dp, accentColor.copy(alpha = 0.35f), RoundedCornerShape(8.dp))
                .padding(horizontal = 8.dp, vertical = 3.dp)
        ) {
            Text(
                text = badgeText,
                style = AppTypography.BadgeMicro.copy(fontSize = 9.sp, fontWeight = FontWeight.ExtraBold),
                color = accentColor,
                textAlign = TextAlign.Center
            )
        }
    }
}
