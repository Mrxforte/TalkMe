package com.example.talkme.presentation.screens.courses

import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
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
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.talkme.presentation.components.TalkMeBottomBar
import com.example.talkme.presentation.components.TalkMeButton
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppImages
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.TalkMeTheme
import kotlinx.coroutines.launch

/**
 * Type of Duolingo-style level path node.
 */
enum class LevelNodeType {
    MASCOT_INTRO,
    STAR,
    READING,
    CHEST,
    MIC,
    PRACTICE,
    CAMERA,
    HEADPHONES
}

/**
 * Completion status of a level node.
 */
enum class LevelStatus {
    COMPLETED,
    CURRENT,
    LOCKED
}

/**
 * Data model representing a single level node in the learning path map.
 */
data class LevelNodeItem(
    val id: String,
    val title: String,
    val subtitle: String,
    val nodeType: LevelNodeType,
    val status: LevelStatus,
    val stars: Int = 0,
    val horizontalOffsetRatio: Float = 0f, // -0.4f (left) to +0.4f (right)
    val xpReward: Int = 10,
)

/**
 * Duolingo-Style Levels Path Screen.
 *
 * Displays top status bar (flag, streak, gems), green unit banner, 3D interactive circular level buttons
 * along a curved path, character mascot graphics, chest reward nodes, and level detail bottom sheet dialogs.
 *
 * @param courseId ID or name of selected course.
 * @param onTabSelected Bottom bar navigation tab click callback.
 * @param onBackClick Back button click callback.
 * @param onStartLessonClick Callback when user starts a level lesson.
 * @param modifier Modifier for root container layout.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CourseLevelsScreen(
    courseId: String,
    onTabSelected: (Int) -> Unit,
    modifier: Modifier = Modifier,
    onBackClick: () -> Unit = {},
    onStartLessonClick: (String) -> Unit = {},
) {
    val dimensions = LocalDimensions.current
    val scrollState = rememberScrollState()
    val coroutineScope = rememberCoroutineScope()

    var selectedNode by remember { mutableStateOf<LevelNodeItem?>(null) }
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    // Sample Duolingo level path map data
    val levelNodes = remember(courseId) {
        listOf(
            LevelNodeItem(
                id = "lvl_1",
                title = "1-Dars: Kirish so'zlari",
                subtitle = "Boshlang'ich iboralar",
                nodeType = LevelNodeType.MASCOT_INTRO,
                status = LevelStatus.COMPLETED,
                stars = 3,
                horizontalOffsetRatio = 0f,
            ),
            LevelNodeItem(
                id = "lvl_2",
                title = "2-Dars: Yulduzli mashq",
                subtitle = "Grammatika asosi",
                nodeType = LevelNodeType.STAR,
                status = LevelStatus.COMPLETED,
                stars = 3,
                horizontalOffsetRatio = 0.38f,
            ),
            LevelNodeItem(
                id = "lvl_3",
                title = "3-Dars: Mutolaa va O'qish",
                subtitle = "Matn bilan ishlash",
                nodeType = LevelNodeType.READING,
                status = LevelStatus.COMPLETED,
                stars = 3,
                horizontalOffsetRatio = 0.22f,
            ),
            LevelNodeItem(
                id = "lvl_chest_1",
                title = "Xazina Sandig'i",
                subtitle = "+20 Olmos mukofoti",
                nodeType = LevelNodeType.CHEST,
                status = LevelStatus.COMPLETED,
                stars = 0,
                horizontalOffsetRatio = 0f,
            ),
            LevelNodeItem(
                id = "lvl_4",
                title = "4-Dars: Gapirish va Talaffuz",
                subtitle = "Ovozli muloqot",
                nodeType = LevelNodeType.MIC,
                status = LevelStatus.CURRENT,
                stars = 0,
                horizontalOffsetRatio = -0.32f,
            ),
            LevelNodeItem(
                id = "lvl_5",
                title = "5-Dars: Mustahkamlash mashqi",
                subtitle = "Intensiv amaliyot",
                nodeType = LevelNodeType.PRACTICE,
                status = LevelStatus.LOCKED,
                stars = 0,
                horizontalOffsetRatio = -0.42f,
            ),
            LevelNodeItem(
                id = "lvl_6",
                title = "6-Dars: Video Darslik",
                subtitle = "Vizual dialoglar",
                nodeType = LevelNodeType.CAMERA,
                status = LevelStatus.LOCKED,
                stars = 0,
                horizontalOffsetRatio = -0.18f,
            ),
            LevelNodeItem(
                id = "lvl_7",
                title = "7-Dars: Tinglab tushunish",
                subtitle = "Audio mashg'ulot",
                nodeType = LevelNodeType.HEADPHONES,
                status = LevelStatus.LOCKED,
                stars = 0,
                horizontalOffsetRatio = 0.15f,
            ),
            LevelNodeItem(
                id = "lvl_chest_2",
                title = "Yakuniy Katta Xazina",
                subtitle = "Bo'lim sertifikati",
                nodeType = LevelNodeType.CHEST,
                status = LevelStatus.LOCKED,
                stars = 0,
                horizontalOffsetRatio = 0f,
            )
        )
    }

    val courseTitle = remember(courseId) {
        CourseConstants.resolveCourseTitle(courseId)
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = {
            DuolingoTopStatusBar(
                onBackClick = onBackClick,
            )
        },
        bottomBar = {
            TalkMeBottomBar(
                selectedTab = 1,
                onTabSelected = onTabSelected,
            )
        },
        containerColor = Color(0xFFFAFAFA),
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(scrollState),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                // Duolingo Unit Header Banner
                DuolingoUnitBanner(
                    sectionUnitText = CourseConstants.SECTION_UNIT_BANNER_LABEL,
                    title = courseTitle,
                    onGuidebookClick = {
                        // Open Guidebook
                    },
                    modifier = Modifier.padding(horizontal = dimensions.paddingMedium, vertical = dimensions.paddingSmall)
                )

                Spacer(modifier = Modifier.height(dimensions.paddingMedium))

                // Curved Path Map Area
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = dimensions.paddingMedium),
                    contentAlignment = Alignment.TopCenter
                ) {
                    val screenWidthPx = LocalConfiguration.current.screenWidthDp.dp

                    // Background Curved Connecting Path Canvas
                    CurvedPathCanvas(
                        levelNodes = levelNodes,
                    )

                    // Vertical Column of Nodes positioned according to horizontal offset
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(28.dp)
                    ) {
                        levelNodes.forEach { node ->
                            val xOffset = (screenWidthPx.value * 0.42f * node.horizontalOffsetRatio).dp

                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .offset(x = xOffset),
                                contentAlignment = Alignment.Center
                            ) {
                                LevelNodeComposable(
                                    node = node,
                                    onClick = {
                                        selectedNode = node
                                    }
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(100.dp))
                    }
                }
            }

            // Floating Jump-to-Top Button
            FloatingActionButton(
                onClick = {
                    coroutineScope.launch {
                        scrollState.animateScrollTo(0)
                    }
                },
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(end = dimensions.paddingLarge, bottom = 16.dp)
            )
        }
    }

    // Modal BottomSheet when a level node is selected
    if (selectedNode != null) {
        ModalBottomSheet(
            onDismissRequest = { selectedNode = null },
            sheetState = sheetState,
            containerColor = Color.White,
            shape = RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp)
        ) {
            val node = selectedNode!!
            LevelDetailBottomSheetContent(
                node = node,
                onStartClick = {
                    val targetNodeId = node.id
                    selectedNode = null
                    onStartLessonClick(targetNodeId)
                },
                onCloseClick = {
                    selectedNode = null
                }
            )
        }
    }
}

/**
 * Top Status Bar matching Duolingo design (Country Flag, Flame Streak, Gems, Shop/Chest).
 */
@Composable
fun DuolingoTopStatusBar(
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val dimensions = LocalDimensions.current

    Surface(
        modifier = modifier.fillMaxWidth(),
        color = Color.White,
        shadowElevation = 2.dp,
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = dimensions.paddingMedium, vertical = dimensions.paddingSmall),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            // Back Chevron & Flag
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(dimensions.paddingExtraSmall)
            ) {
                IconButton(
                    onClick = onBackClick,
                    modifier = Modifier.size(36.dp)
                ) {
                    Icon(
                        painter = painterResource(id = AppIcons.ChevronLeft),
                        contentDescription = "Back",
                        tint = MaterialTheme.colorScheme.onSurface,
                        modifier = Modifier.size(dimensions.iconMedium)
                    )
                }

                // Country Flag Chip (Spanish flag)
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(Color(0xFFF0F0F0))
                        .border(1.dp, Color(0xFFE0E0E0), RoundedCornerShape(8.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = AppImages.EMOJI_SPANISH_FLAG,
                        fontSize = 18.sp
                    )
                }
            }

            // Streak Flame Counter (🔥 2520)
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp),
                modifier = Modifier
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color(0xFFFFF4E5))
                    .padding(horizontal = 10.dp, vertical = 6.dp)
            ) {
                Icon(
                    painter = painterResource(id = AppIcons.Fire),
                    contentDescription = null,
                    tint = Color(0xFFFF9600),
                    modifier = Modifier.size(18.dp)
                )
                Text(
                    text = CourseConstants.DEFAULT_STREAK_COUNT,
                    style = AppTypography.BadgeText.copy(
                        color = Color(0xFFFF9600),
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp
                    )
                )
            }

            // Gem Counter (💎 26032)
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp),
                modifier = Modifier
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color(0xFFE5F6FE))
                    .padding(horizontal = 10.dp, vertical = 6.dp)
            ) {
                Text(
                    text = AppImages.EMOJI_BLUE_GEM,
                    fontSize = 14.sp
                )
                Text(
                    text = CourseConstants.DEFAULT_GEM_COUNT,
                    style = AppTypography.BadgeText.copy(
                        color = Color(0xFF1CB0F6),
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp
                    )
                )
            }

            // Shop / Magic Chest Badge
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(Color(0xFFF3EFFC)),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = AppImages.EMOJI_MAGIC_BALL,
                    fontSize = 18.sp
                )
            }
        }
    }
}

/**
 * Duolingo Unit Header Banner Component (Bright green card with 3D bottom border).
 */
@Composable
fun DuolingoUnitBanner(
    sectionUnitText: String,
    title: String,
    onGuidebookClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val dimensions = LocalDimensions.current

    val primaryGreen = Color(0xFF58CC02)
    val darkGreenBorder = Color(0xFF46A302)

    Box(
        modifier = modifier
            .fillMaxWidth()
            .shadow(4.dp, RoundedCornerShape(20.dp))
            .clip(RoundedCornerShape(20.dp))
            .background(darkGreenBorder)
            .padding(bottom = 6.dp) // Creates 3D bottom depth!
            .background(primaryGreen)
            .padding(horizontal = dimensions.paddingLarge, vertical = dimensions.paddingMedium)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = sectionUnitText.uppercase(),
                    style = AppTypography.BadgeText.copy(
                        color = Color.White.copy(alpha = 0.88f),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 0.8.sp
                    )
                )

                Spacer(modifier = Modifier.height(2.dp))

                Text(
                    text = title,
                    style = AppTypography.GreetingTitle.copy(
                        color = Color.White,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold
                    ),
                    maxLines = 2
                )
            }

            Spacer(modifier = Modifier.width(dimensions.paddingSmall))

            // Guidebook icon button
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(Color.White.copy(alpha = 0.22f))
                    .border(1.5.dp, Color.White.copy(alpha = 0.5f), RoundedCornerShape(14.dp))
                    .clickable(onClick = onGuidebookClick),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    painter = painterResource(id = AppIcons.Book),
                    contentDescription = "Guidebook",
                    tint = Color.White,
                    modifier = Modifier.size(dimensions.iconMedium)
                )
            }
        }
    }
}

/**
 * Canvas drawing smooth curved connecting path lines between nodes.
 */
@Composable
fun CurvedPathCanvas(
    levelNodes: List<LevelNodeItem>,
    modifier: Modifier = Modifier
) {
    val totalHeight = (levelNodes.size * 105).dp

    Canvas(
        modifier = modifier
            .fillMaxWidth()
            .height(totalHeight)
    ) {
        val width = size.width
        val centerX = width / 2f

        val path = Path()
        val pathEffect = PathEffect.dashPathEffect(floatArrayOf(16f, 16f), 0f)

        levelNodes.forEachIndexed { index, node ->
            val nodeX = centerX + (width * 0.42f * node.horizontalOffsetRatio)
            val nodeY = (index * 98f) + 50f

            if (index == 0) {
                path.moveTo(nodeX, nodeY)
            } else {
                val prevNode = levelNodes[index - 1]
                val prevX = centerX + (width * 0.42f * prevNode.horizontalOffsetRatio)
                val prevY = ((index - 1) * 98f) + 50f

                val controlY1 = prevY + 45f
                val controlY2 = nodeY - 45f

                path.cubicTo(prevX, controlY1, nodeX, controlY2, nodeX, nodeY)
            }
        }

        drawPath(
            path = path,
            color = Color(0xFFE5E5E5),
            style = Stroke(
                width = 12f,
                pathEffect = pathEffect
            )
        )
    }
}

/**
 * Level Node Composable rendering 3D circular Duolingo level buttons, star ratings, and floating mascots.
 */
@Composable
fun LevelNodeComposable(
    node: LevelNodeItem,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()

    val pulseTransition = rememberInfiniteTransition(label = "pulse")
    val pulseScale by pulseTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.08f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulseScale"
    )

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = modifier
    ) {
        Box(
            contentAlignment = Alignment.Center
        ) {
            // Glowing pulse ring if node is CURRENT
            if (node.status == LevelStatus.CURRENT) {
                Box(
                    modifier = Modifier
                        .size(86.dp)
                        .scale(pulseScale)
                        .clip(CircleShape)
                        .background(Color(0xFF58CC02).copy(alpha = 0.25f))
                )
            }

            // Main 3D Circular Level Button
            Duolingo3DButton(
                node = node,
                isPressed = isPressed,
                onClick = onClick,
                interactionSource = interactionSource
            )

            // Floating Mascot alongside CURRENT or MASCOT_INTRO node
            if (node.nodeType == LevelNodeType.MASCOT_INTRO || node.status == LevelStatus.CURRENT) {
                MascotAvatarBadge(
                    modifier = Modifier
                        .offset(x = if (node.horizontalOffsetRatio <= 0f) 52.dp else (-52).dp, y = (-20).dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(6.dp))

        // Star Rating Bar (⭐⭐⭐)
        if (node.stars > 0 || node.status == LevelStatus.COMPLETED) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(2.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                repeat(3) { starIndex ->
                    val isFilled = starIndex < node.stars
                    Text(
                        text = AppImages.SYMBOL_STAR_FILLED,
                        fontSize = 12.sp,
                        color = if (isFilled) Color(0xFFFFC800) else Color(0xFFD0D0D0)
                    )
                }
            }
        }
    }
}

/**
 * Custom 3D Circular Duolingo Button Component with tactile press animation.
 */
@Composable
fun Duolingo3DButton(
    node: LevelNodeItem,
    isPressed: Boolean,
    onClick: () -> Unit,
    interactionSource: MutableInteractionSource,
    modifier: Modifier = Modifier
) {
    val buttonSize = 72.dp

    // Color definitions
    val (primaryColor, shadowColor, iconColor) = when (node.status) {
        LevelStatus.COMPLETED -> Triple(Color(0xFF58CC02), Color(0xFF46A302), Color.White)
        LevelStatus.CURRENT -> Triple(Color(0xFF58CC02), Color(0xFF46A302), Color.White)
        LevelStatus.LOCKED -> Triple(Color(0xFFE5E5E5), Color(0xFFAFAFAF), Color(0xFF888888))
    }

    // Chest color override
    val baseColor = if (node.nodeType == LevelNodeType.CHEST) Color(0xFFFFC800) else primaryColor
    val baseShadowColor = if (node.nodeType == LevelNodeType.CHEST) Color(0xFFE5A100) else shadowColor

    val pressOffset = if (isPressed) 6.dp else 0.dp

    Box(
        modifier = modifier
            .size(buttonSize)
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                onClick = onClick
            ),
        contentAlignment = Alignment.TopCenter
    ) {
        // Bottom 3D Base Shadow Circle
        Box(
            modifier = Modifier
                .size(buttonSize)
                .clip(CircleShape)
                .background(baseShadowColor)
        )

        // Top Elevated Circle (moves down on press!)
        Box(
            modifier = Modifier
                .offset(y = pressOffset)
                .size(if (isPressed) buttonSize else buttonSize - 6.dp)
                .clip(CircleShape)
                .background(baseColor),
            contentAlignment = Alignment.Center
        ) {
            // Icon according to LevelNodeType
            when (node.nodeType) {
                LevelNodeType.MASCOT_INTRO -> {
                    Text(text = AppImages.EMOJI_OWL_MASCOT, fontSize = 32.sp)
                }
                LevelNodeType.STAR -> {
                    Text(text = AppImages.SYMBOL_STAR_FILLED, fontSize = 32.sp, color = iconColor)
                }
                LevelNodeType.READING -> {
                    Icon(
                        painter = painterResource(id = AppIcons.Book),
                        contentDescription = null,
                        tint = iconColor,
                        modifier = Modifier.size(28.dp)
                    )
                }
                LevelNodeType.CHEST -> {
                    Text(text = AppImages.EMOJI_TREASURE_CHEST, fontSize = 32.sp)
                }
                LevelNodeType.MIC -> {
                    Icon(
                        painter = painterResource(id = AppIcons.Mic),
                        contentDescription = null,
                        tint = iconColor,
                        modifier = Modifier.size(28.dp)
                    )
                }
                LevelNodeType.PRACTICE -> {
                    Icon(
                        painter = painterResource(id = AppIcons.Repeat),
                        contentDescription = null,
                        tint = iconColor,
                        modifier = Modifier.size(28.dp)
                    )
                }
                LevelNodeType.CAMERA -> {
                    Text(text = AppImages.EMOJI_CAMERA_VIDEO, fontSize = 28.sp)
                }
                LevelNodeType.HEADPHONES -> {
                    Icon(
                        painter = painterResource(id = AppIcons.Headphones),
                        contentDescription = null,
                        tint = iconColor,
                        modifier = Modifier.size(28.dp)
                    )
                }
            }
        }
    }
}

/**
 * Cute Mascot Owl Illustration Badge floating along level path.
 */
@Composable
fun MascotAvatarBadge(
    modifier: Modifier = Modifier
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = modifier
    ) {
        Box(
            modifier = Modifier
                .size(48.dp)
                .shadow(4.dp, CircleShape)
                .clip(CircleShape)
                .background(Color(0xFFE8F8EE))
                .border(2.dp, Color(0xFF58CC02), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = AppImages.EMOJI_OWL_MASCOT,
                fontSize = 28.sp
            )
        }
    }
}

/**
 * Floating Action Button for jumping to top/current level.
 */
@Composable
fun FloatingActionButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .size(52.dp)
            .shadow(6.dp, CircleShape)
            .clip(CircleShape)
            .background(Color.White)
            .border(1.5.dp, Color(0xFFE0E0E0), CircleShape)
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = AppImages.SYMBOL_ARROW_UP,
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF1CB0F6)
        )
    }
}

/**
 * Interactive Level Details BottomSheet Content when a node is clicked.
 */
@Composable
fun LevelDetailBottomSheetContent(
    node: LevelNodeItem,
    onStartClick: () -> Unit,
    onCloseClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val dimensions = LocalDimensions.current

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = dimensions.paddingLarge, vertical = dimensions.paddingMedium),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Top Drag Handle
        Box(
            modifier = Modifier
                .width(38.dp)
                .height(4.dp)
                .clip(RoundedCornerShape(2.dp))
                .background(Color(0xFFE0E0E0))
        )

        Spacer(modifier = Modifier.height(dimensions.paddingMedium))

        // Level Header Badge
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(12.dp))
                .background(
                    if (node.status == LevelStatus.LOCKED) Color(0xFFF0F0F0) else Color(0xFFE8F8EE)
                )
                .padding(horizontal = 14.dp, vertical = 6.dp)
        ) {
            Text(
                text = when (node.status) {
                    LevelStatus.COMPLETED -> CourseConstants.BADGE_COMPLETED_TEXT
                    LevelStatus.CURRENT -> CourseConstants.BADGE_CURRENT_TEXT
                    LevelStatus.LOCKED -> CourseConstants.BADGE_LOCKED_TEXT
                },
                style = AppTypography.BadgeText.copy(
                    color = if (node.status == LevelStatus.LOCKED) Color.Gray else Color(0xFF27AE60),
                    fontWeight = FontWeight.Bold
                )
            )
        }

        Spacer(modifier = Modifier.height(dimensions.paddingSmall))

        Text(
            text = node.title,
            style = AppTypography.GreetingTitle.copy(
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            ),
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(4.dp))

        Text(
            text = node.subtitle,
            style = AppTypography.CardSubtitle.copy(
                fontSize = 14.sp,
                color = Color.Gray
            ),
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(dimensions.paddingMedium))

        // XP & Diamonds Reward Badge Card
        Row(
            modifier = Modifier
                .fillMaxWidth(0.85f)
                .clip(RoundedCornerShape(16.dp))
                .background(Color(0xFFFFF8E7))
                .border(1.dp, Color(0xFFFFC800), RoundedCornerShape(16.dp))
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Text(text = AppImages.EMOJI_LIGHTNING, fontSize = 20.sp)
                Text(
                    text = "+${node.xpReward} XP",
                    style = AppTypography.CardTitle.copy(
                        color = Color(0xFFD97706),
                        fontWeight = FontWeight.Bold
                    )
                )
            }

            Box(
                modifier = Modifier
                    .width(1.dp)
                    .height(20.dp)
                    .background(Color(0xFFFFD97D))
            )

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                Text(text = AppImages.EMOJI_BLUE_GEM, fontSize = 18.sp)
                Text(
                    text = "+5 Olmos",
                    style = AppTypography.CardTitle.copy(
                        color = Color(0xFF0284C7),
                        fontWeight = FontWeight.Bold
                    )
                )
            }
        }

        Spacer(modifier = Modifier.height(dimensions.paddingLarge))

        // Big Duolingo Start Action Button
        TalkMeButton(
            text = if (node.status == LevelStatus.LOCKED) CourseConstants.BTN_START_LABEL else "${CourseConstants.BTN_START_LABEL} (+${node.xpReward} XP)",
            onClick = onStartClick,
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp)
        )

        Spacer(modifier = Modifier.height(dimensions.paddingSmall))

        // Secondary Close Button
        Text(
            text = CourseConstants.BTN_CLOSE_LABEL,
            style = AppTypography.CardTitle.copy(
                fontSize = 14.sp,
                color = Color.Gray,
                fontWeight = FontWeight.Bold
            ),
            modifier = Modifier
                .clickable(onClick = onCloseClick)
                .padding(dimensions.paddingSmall)
        )

        Spacer(modifier = Modifier.height(dimensions.paddingMedium))
    }
}

@Preview(showBackground = true)
@Composable
fun CourseLevelsScreenPreview() {
    TalkMeTheme {
        CourseLevelsScreen(
            courseId = "nouns",
            onTabSelected = {}
        )
    }
}
