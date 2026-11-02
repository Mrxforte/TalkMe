package com.talkme.presentation.screens.courses

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.talkme.presentation.components.TalkMeBottomBar
import com.talkme.presentation.components.TalkMeBottomTab
import com.talkme.presentation.components.TalkMeButton
import com.talkme.presentation.components.TalkMeButtonVariant
import com.talkme.presentation.state.CourseLevelNodeUiModel
import com.talkme.presentation.state.LevelNodeStatus
import com.talkme.presentation.state.LevelNodeType
import com.talkme.presentation.state.LocalTalkMeAppState
import com.talkme.presentation.state.TalkMeAppState
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.TalkMeColors
import kotlinx.coroutines.launch

/**
 * Pixel-perfect migration of `src/screens/CourseLevelsScreen.tsx`,
 * `src/screens/courses/CourseNatureLandscape.tsx`, and `src/screens/courses/LockedNode3DPadlock.tsx`:
 * - Top status bar (`AppIcons.ChevronLeft`, `🇬🇧`, `🔥 7`, `💎 26,032`, `⚡ 1,240`)
 * - Unit header banner (`BO‘LIM 1, UNIT 1` + Course title & subtitle)
 * - Duolingo-style zigzag level path over a custom 3D Nature Landscape Canvas (sky, mountains, pine forest, river, cobblestone trail)
 * - 3D tactile circular level buttons (`#58CC02` / `#46A302` active/completed, `#E5E5E5` / `#B7B7B7` locked)
 * - 3D metallic padlock with rattle shake animation on locked nodes
 * - Interactive Level Detail Sheet (`"Darsni boshlash +50 XP"`)
 */
@Composable
fun CourseLevelsScreen(
    courseId: String,
    onBackClick: () -> Unit,
    onStartLesson: (courseId: String, lessonId: String) -> Unit,
    onNavigateHome: () -> Unit = {},
    onNavigateCourses: () -> Unit = {},
    onNavigateRepeat: () -> Unit = {},
    onNavigateProfile: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val appState = LocalTalkMeAppState.current
    val curriculum = remember(courseId, appState.completedLevelIds.size) {
        TalkMeAppState.getCurriculumForCourse(courseId, appState.completedLevelIds)
    }

    var selectedNode by remember { mutableStateOf<CourseLevelNodeUiModel?>(null) }
    var rattlingNodeId by remember { mutableStateOf<String?>(null) }
    val rattleAnim = remember { Animatable(0f) }
    val coroutineScope = rememberCoroutineScope()

    val infiniteTransition = rememberInfiniteTransition(label = "levelBounce")
    val bounceOffset by infiniteTransition.animateFloat(
        initialValue = -4f,
        targetValue = 4f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "bounceOffset"
    )

    Scaffold(
        modifier = modifier.fillMaxSize(),
        containerColor = TalkMeColors.NatureGrassMid,
        bottomBar = {
            TalkMeBottomBar(
                activeTab = TalkMeBottomTab.COURSES,
                onSelectTab = { tab ->
                    when (tab) {
                        TalkMeBottomTab.HOME -> onNavigateHome()
                        TalkMeBottomTab.COURSES -> onNavigateCourses()
                        TalkMeBottomTab.REPEAT -> onNavigateRepeat()
                        TalkMeBottomTab.PROFILE -> onNavigateProfile()
                    }
                }
            )
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            // 1. 3D Nature Landscape Background Canvas
            CourseNatureLandscapeBackground(modifier = Modifier.fillMaxSize())

            Column(modifier = Modifier.fillMaxSize()) {
                // 2. Top Status Bar (Back, Flag, Streak, Gems, XP)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color.White.copy(alpha = 0.94f))
                        .padding(horizontal = 16.dp, vertical = 10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        IconButton(
                            onClick = onBackClick,
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(Color(0xFFF4F1FA))
                        ) {
                            Icon(
                                imageVector = AppIcons.ChevronLeft,
                                contentDescription = "Back",
                                tint = TalkMeColors.PrimaryPurple,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Text(text = "🇬🇧", fontSize = 20.sp)
                    }

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        StatusMetricPill(emoji = "🔥", value = "${appState.streakDays}", color = Color(0xFFFF9600))
                        StatusMetricPill(emoji = "💎", value = "${appState.diamonds}", color = Color(0xFF1CB0F6))
                        StatusMetricPill(emoji = "⚡", value = "${appState.xp}", color = TalkMeColors.PrimaryPurple)
                    }
                }

                // 3. Unit Banner Card
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 10.dp)
                        .clip(RoundedCornerShape(20.dp))
                        .background(
                            Brush.horizontalGradient(
                                listOf(Color(0xFF58CC02), Color(0xFF2E9E00))
                            )
                        )
                        .border(2.dp, Color(0xFF46A302), RoundedCornerShape(20.dp))
                        .padding(16.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = curriculum.sectionLabel,
                                style = AppTypography.BadgeMicro.copy(
                                    letterSpacing = 1.2.sp,
                                    fontWeight = FontWeight.Black
                                ),
                                color = Color.White.copy(alpha = 0.85f)
                            )
                            Text(
                                text = curriculum.title,
                                style = AppTypography.TitleLarge.copy(
                                    fontSize = 19.sp,
                                    fontWeight = FontWeight.Black
                                ),
                                color = Color.White
                            )
                            Text(
                                text = curriculum.subtitle,
                                style = AppTypography.LabelMedium,
                                color = Color.White.copy(alpha = 0.92f)
                            )
                        }
                        Box(
                            modifier = Modifier
                                .size(44.dp)
                                .clip(RoundedCornerShape(14.dp))
                                .background(Color.White.copy(alpha = 0.2f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = AppIcons.BookOpen,
                                contentDescription = null,
                                tint = Color.White,
                                modifier = Modifier.size(22.dp)
                            )
                        }
                    }
                }

                // 4. Zigzag Duolingo-Style Level Nodes List
                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentPadding = PaddingValues(vertical = 24.dp, horizontal = 24.dp),
                    verticalArrangement = Arrangement.spacedBy(28.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    itemsIndexed(curriculum.topics, key = { _, item -> item.id }) { idx, node ->
                        val zigzagOffsets = listOf(0.dp, (-44).dp, (-68).dp, (-36).dp, 24.dp, 64.dp, 36.dp, (-16).dp)
                        val xOffset: Dp = zigzagOffsets[idx % zigzagOffsets.size]
                        val isRattling = rattlingNodeId == node.id
                        val shakeDp = if (isRattling) rattleAnim.value.dp else 0.dp

                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .offset(x = xOffset + shakeDp),
                            contentAlignment = Alignment.Center
                        ) {
                            // Show Owl Mascot beside node #1 or #4
                            if (idx == 0 || idx == 4) {
                                Column(
                                    modifier = Modifier
                                        .offset(x = if (idx == 0) 96.dp else (-96).dp, y = bounceOffset.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    Text(text = "🦉", fontSize = 38.sp)
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(8.dp))
                                            .background(Color.White.copy(alpha = 0.9f))
                                            .padding(horizontal = 6.dp, vertical = 2.dp)
                                    ) {
                                        Text(
                                            text = if (idx == 0) "Let's go!" else "Keep going!",
                                            style = AppTypography.BadgeMicro,
                                            color = TalkMeColors.PrimaryPurple
                                        )
                                    }
                                }
                            }

                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                // Floating "BOSHLASH" callout above CURRENT node
                                if (node.status == LevelNodeStatus.CURRENT) {
                                    Box(
                                        modifier = Modifier
                                            .offset(y = bounceOffset.dp)
                                            .padding(bottom = 8.dp)
                                            .shadow(6.dp, RoundedCornerShape(12.dp))
                                            .clip(RoundedCornerShape(12.dp))
                                            .background(Color.White)
                                            .border(2.dp, Color(0xFF58CC02), RoundedCornerShape(12.dp))
                                            .padding(horizontal = 14.dp, vertical = 6.dp)
                                    ) {
                                        Text(
                                            text = "BOSHLASH",
                                            style = AppTypography.LabelMedium.copy(
                                                fontWeight = FontWeight.Black,
                                                letterSpacing = 0.8.sp
                                            ),
                                            color = Color(0xFF58CC02)
                                        )
                                    }
                                }

                                // 3D Tactile Level Node Button
                                Tactile3DLevelNodeButton(
                                    node = node,
                                    onClick = {
                                        selectedNode = node
                                        if (node.status == LevelNodeStatus.LOCKED) {
                                            rattlingNodeId = node.id
                                            coroutineScope.launch {
                                                rattleAnim.snapTo(0f)
                                                listOf(-10f, 10f, -8f, 8f, -4f, 4f, 0f).forEach { target ->
                                                    rattleAnim.animateTo(target, tween(45))
                                                }
                                                rattlingNodeId = null
                                            }
                                        }
                                    }
                                )

                                Spacer(modifier = Modifier.height(6.dp))

                                // Node Title Pill
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(10.dp))
                                        .background(Color.White.copy(alpha = 0.92f))
                                        .border(1.dp, Color(0xFFE5E7EB), RoundedCornerShape(10.dp))
                                        .padding(horizontal = 10.dp, vertical = 4.dp)
                                ) {
                                    Text(
                                        text = node.title,
                                        style = AppTypography.BadgeMicro.copy(
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.ExtraBold
                                        ),
                                        color = TalkMeColors.TextPrimary,
                                        textAlign = TextAlign.Center
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // 5. Interactive Level Detail Bottom Card Modal
            AnimatedVisibility(
                visible = selectedNode != null,
                enter = slideInVertically(initialOffsetY = { it }) + fadeIn(),
                exit = slideOutVertically(targetOffsetY = { it }) + fadeOut(),
                modifier = Modifier.align(Alignment.BottomCenter)
            ) {
                val node = selectedNode ?: return@AnimatedVisibility
                val isLocked = node.status == LevelNodeStatus.LOCKED

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                        .shadow(20.dp, RoundedCornerShape(24.dp))
                        .clip(RoundedCornerShape(24.dp))
                        .background(
                            if (isLocked) Color.White else Color(0xFF58CC02)
                        )
                        .border(
                            2.dp,
                            if (isLocked) Color(0xFFE5E5E5) else Color(0xFF46A302),
                            RoundedCornerShape(24.dp)
                        )
                        .padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = if (isLocked) "🔒 QULFLANGAN BOSQICH" else "✨ FAOL DARS BOSQICHI",
                            style = AppTypography.BadgeMicro.copy(fontWeight = FontWeight.Black),
                            color = if (isLocked) TalkMeColors.TextSecondary else Color.White.copy(alpha = 0.9f)
                        )
                        Text(
                            text = "✕",
                            style = AppTypography.TitleMedium,
                            color = if (isLocked) TalkMeColors.TextSecondary else Color.White,
                            modifier = Modifier.clickable { selectedNode = null }
                        )
                    }

                    Text(
                        text = node.title,
                        style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.Black),
                        color = if (isLocked) TalkMeColors.TextPrimary else Color.White
                    )

                    Text(
                        text = node.subtitle,
                        style = AppTypography.BodyMedium,
                        color = if (isLocked) TalkMeColors.TextSecondary else Color.White.copy(alpha = 0.92f)
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    if (isLocked) {
                        TalkMeButton(
                            text = "Oldingi darsni yakunlang (Yoki sinab ko‘rish)",
                            variant = TalkMeButtonVariant.Primary,
                            onClick = {
                                val targetLessonId = node.linkedLessonId
                                selectedNode = null
                                appState.selectedFrameworkLessonId = targetLessonId
                                onStartLesson(courseId, targetLessonId)
                            }
                        )
                    } else {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(48.dp)
                                .clip(RoundedCornerShape(14.dp))
                                .background(Color.White)
                                .clickable {
                                    val targetLessonId = node.linkedLessonId
                                    selectedNode = null
                                    appState.selectedFrameworkLessonId = targetLessonId
                                    onStartLesson(courseId, targetLessonId)
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "DARSNI BOSHLASH +${node.xpReward} XP",
                                style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.Black),
                                color = Color(0xFF46A302)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun StatusMetricPill(
    emoji: String,
    value: String,
    color: Color
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Text(text = emoji, fontSize = 15.sp)
        Text(
            text = value,
            style = AppTypography.LabelLarge.copy(fontWeight = FontWeight.ExtraBold),
            color = color
        )
    }
}

/**
 * 3D Tactile Level Node Button with 3D metallic padlock overlay when locked.
 */
@Composable
private fun Tactile3DLevelNodeButton(
    node: CourseLevelNodeUiModel,
    onClick: () -> Unit
) {
    val isLocked = node.status == LevelNodeStatus.LOCKED
    val isChest = node.nodeType == LevelNodeType.CHEST

    val topColor = when {
        isChest && !isLocked -> TalkMeColors.NodeGoldTop
        isLocked -> TalkMeColors.NodeLockedTop
        else -> TalkMeColors.NodeGreenTop
    }
    val bottomLipColor = when {
        isChest && !isLocked -> TalkMeColors.NodeGoldBottom
        isLocked -> TalkMeColors.NodeLockedBottom
        else -> TalkMeColors.NodeGreenBottom
    }

    Box(
        modifier = Modifier
            .size(82.dp)
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        // Outer pulsing ring for CURRENT node
        if (node.status == LevelNodeStatus.CURRENT) {
            Box(
                modifier = Modifier
                    .size(82.dp)
                    .clip(CircleShape)
                    .border(4.dp, Color(0xFF58CC02).copy(alpha = 0.45f), CircleShape)
            )
        }

        // 3D Bottom Lip Shadow
        Box(
            modifier = Modifier
                .size(68.dp)
                .offset(y = 6.dp)
                .clip(CircleShape)
                .background(bottomLipColor)
        )

        // 3D Top Surface
        Box(
            modifier = Modifier
                .size(68.dp)
                .clip(CircleShape)
                .background(topColor)
                .border(2.dp, Color.White.copy(alpha = 0.35f), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            if (isChest) {
                Text(text = "🎁", fontSize = 28.sp)
            } else if (isLocked) {
                // 3D Metallic Padlock Canvas matching LockedNode3DPadlock.tsx
                Metallic3DPadlockIcon(modifier = Modifier.size(32.dp))
            } else {
                val icon = when (node.nodeType) {
                    LevelNodeType.MASCOT_INTRO -> AppIcons.StarFilled
                    LevelNodeType.STAR -> AppIcons.StarFilled
                    LevelNodeType.READING -> AppIcons.BookOpen
                    LevelNodeType.MIC -> AppIcons.Mic
                    LevelNodeType.PRACTICE -> AppIcons.Refresh
                    LevelNodeType.CAMERA -> AppIcons.Play
                    LevelNodeType.HEADPHONES -> AppIcons.Headphones
                    LevelNodeType.CHEST -> AppIcons.StarFilled
                }
                Icon(
                    imageVector = icon,
                    contentDescription = node.title,
                    tint = Color.White,
                    modifier = Modifier.size(30.dp)
                )
            }
        }

        // Completed Crown Badge
        if (node.status == LevelNodeStatus.COMPLETED) {
            Box(
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .size(24.dp)
                    .clip(CircleShape)
                    .background(TalkMeColors.NodeGoldTop)
                    .border(2.dp, Color.White, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = AppIcons.Check,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(14.dp)
                )
            }
        }
    }
}

/**
 * Custom Canvas 3D Metallic Padlock matching `src/screens/courses/LockedNode3DPadlock.tsx`.
 */
@Composable
private fun Metallic3DPadlockIcon(modifier: Modifier = Modifier) {
    Canvas(modifier = modifier) {
        val w = size.width
        val h = size.height

        // Steel shackle arch
        drawArc(
            color = Color(0xFF64748B),
            startAngle = 180f,
            sweepAngle = 180f,
            useCenter = false,
            topLeft = Offset(w * 0.25f, h * 0.08f),
            size = Size(w * 0.50f, h * 0.45f),
            style = Stroke(width = 6f, cap = StrokeCap.Round)
        )

        // Metallic Gold/Bronze body
        drawRoundRect(
            brush = Brush.verticalGradient(
                listOf(Color(0xFFFBBF24), Color(0xFFD97706))
            ),
            topLeft = Offset(w * 0.16f, h * 0.42f),
            size = Size(w * 0.68f, h * 0.50f),
            cornerRadius = CornerRadius(10f, 10f)
        )

        // Keyhole
        drawCircle(
            color = Color(0xFF451A03),
            radius = w * 0.08f,
            center = Offset(w * 0.5f, h * 0.62f)
        )
        drawLine(
            color = Color(0xFF451A03),
            start = Offset(w * 0.5f, h * 0.64f),
            end = Offset(w * 0.5f, h * 0.78f),
            strokeWidth = 4f,
            cap = StrokeCap.Round
        )
    }
}

/**
 * Custom Compose Canvas 3D Nature Landscape background matching `CourseNatureLandscape.tsx`
 * (Sky horizon, snow mountains, pine trees, winding river, and cobblestone trail).
 */
@Composable
private fun CourseNatureLandscapeBackground(modifier: Modifier = Modifier) {
    Canvas(modifier = modifier) {
        val w = size.width
        val h = size.height

        // Sky & Meadow vertical gradient
        drawRect(
            brush = Brush.verticalGradient(
                colors = listOf(
                    TalkMeColors.NatureSkyTop,
                    TalkMeColors.NatureSkyBottom,
                    TalkMeColors.NatureGrassLight,
                    TalkMeColors.NatureGrassMid,
                    TalkMeColors.NatureGrassDeep
                )
            )
        )

        // Distant Mountains
        val mountainPath = Path().apply {
            moveTo(0f, h * 0.22f)
            lineTo(w * 0.22f, h * 0.11f)
            lineTo(w * 0.45f, h * 0.20f)
            lineTo(w * 0.72f, h * 0.09f)
            lineTo(w, h * 0.21f)
            lineTo(w, h * 0.26f)
            lineTo(0f, h * 0.26f)
            close()
        }
        drawPath(mountainPath, color = Color(0xFF93C5FD).copy(alpha = 0.45f))

        // Winding River
        val riverPath = Path().apply {
            moveTo(w * 0.85f, h * 0.18f)
            cubicTo(
                w * 0.15f, h * 0.38f,
                w * 0.90f, h * 0.65f,
                w * 0.20f, h * 0.95f
            )
        }
        drawPath(
            path = riverPath,
            color = TalkMeColors.NatureRiverBlue.copy(alpha = 0.35f),
            style = Stroke(width = 48f, cap = StrokeCap.Round)
        )

        // Central Dashed Trail connecting nodes
        val trailPath = Path().apply {
            moveTo(w * 0.50f, h * 0.20f)
            cubicTo(
                w * 0.25f, h * 0.42f,
                w * 0.75f, h * 0.68f,
                w * 0.50f, h * 0.95f
            )
        }
        drawPath(
            path = trailPath,
            color = TalkMeColors.NaturePathStone.copy(alpha = 0.75f),
            style = Stroke(
                width = 16f,
                cap = StrokeCap.Round,
                pathEffect = PathEffect.dashPathEffect(floatArrayOf(24f, 18f), 0f)
            )
        )
    }
}
