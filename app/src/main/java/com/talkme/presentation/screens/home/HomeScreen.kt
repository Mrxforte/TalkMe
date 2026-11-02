package com.talkme.presentation.screens.home

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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.talkme.presentation.components.TalkMeBadge
import com.talkme.presentation.components.TalkMeBottomBar
import com.talkme.presentation.components.TalkMeBottomTab
import com.talkme.presentation.components.TalkMeCard
import com.talkme.presentation.components.TalkMeProgressBar
import com.talkme.presentation.state.LocalTalkMeAppState
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.LocalDimensions
import com.talkme.ui.theme.TalkMeColors

/**
 * Pixel-perfect migration of `src/screens/HomeScreen.tsx`:
 * - Top Avatar (`#D2F5DC` / `#2E7D32`), `"XUSH KELIBSIZ"` + `"Aziz ✨"`, Streak chip (`Flame` + `"7 kun"`), and Voice Studio (`Mic`) button
 * - `"Salom, Aziz!"` + 2 Global Counter cards (`Yodlangan Noyob So‘zlar` & `O‘zlashtirilgan Qoidalar`)
 * - Featured Card 1: **Lesson 1 — Hello! 👋 (A0 • ABSOLUTE BEGINNER)**
 * - Featured Card 2: **Grammar Fundamentals (A1 • 1-MODUL • 10-BOSQICHLI TIZIM)**
 * - Featured Card 3: **Present continuous (A2 • GRAMMATIKA)**
 * - FSRS Spaced Repetition Vocabulary Banner Card
 * - 2x2 Skills Grid (`Tinglash`, `Gapirish`, `O‘qish`, `Yozish`)
 * - Weekly Plan Card (`Haftalik reja` + `"Could I have some tea?"` audio row)
 * - `TalkMeBottomBar` pinned at bottom
 */
@Composable
fun HomeScreen(
    onOpenLessonClick: (courseId: String, lessonId: String) -> Unit = { _, _ -> },
    onOpenCoursesClick: () -> Unit = {},
    onOpenRepeatClick: () -> Unit = {},
    onOpenVoiceStudioClick: () -> Unit = {},
    onOpenVoiceSettingsClick: () -> Unit = {},
    onOpenProfileClick: () -> Unit = {},
    onOpenQuizClick: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current
    val appState = LocalTalkMeAppState.current

    Scaffold(
        modifier = modifier.fillMaxSize(),
        containerColor = Color(0xFFFAFAFC),
        bottomBar = {
            TalkMeBottomBar(
                activeTab = TalkMeBottomTab.HOME,
                onSelectTab = { tab ->
                    when (tab) {
                        TalkMeBottomTab.HOME -> Unit
                        TalkMeBottomTab.COURSES -> onOpenCoursesClick()
                        TalkMeBottomTab.REPEAT -> onOpenRepeatClick()
                        TalkMeBottomTab.PROFILE -> onOpenProfileClick()
                    }
                }
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            contentPadding = PaddingValues(
                horizontal = dims.screenPaddingHorizontal,
                vertical = dims.spaceLarge
            ),
            verticalArrangement = Arrangement.spacedBy(dims.spaceExtraLarge)
        ) {
            // 1. TOP BAR: Avatar + Xush kelibsiz + Streak Chip + Voice Studio Button
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        modifier = Modifier
                            .clip(RoundedCornerShape(dims.radiusMedium))
                            .clickable(onClick = onOpenProfileClick)
                            .padding(end = dims.spaceSmall),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(dims.spaceMedium)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(44.dp)
                                .clip(CircleShape)
                                .background(Color(0xFFD2F5DC))
                                .border(2.dp, Color.White, CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = appState.userName.firstOrNull()?.toString() ?: "A",
                                style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.ExtraBold),
                                color = Color(0xFF2E7D32)
                            )
                        }

                        Column {
                            Text(
                                text = "XUSH KELIBSIZ",
                                style = AppTypography.BadgeMicro.copy(letterSpacing = 0.8.sp),
                                color = TalkMeColors.TextSecondary
                            )
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                Text(
                                    text = appState.userName,
                                    style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.ExtraBold),
                                    color = TalkMeColors.TextPrimary
                                )
                                Icon(
                                    imageVector = AppIcons.StarFilled,
                                    contentDescription = null,
                                    tint = Color(0xFFF59E0B),
                                    modifier = Modifier.size(14.dp)
                                )
                            }
                        }
                    }

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(dims.spaceSmall)
                    ) {
                        // Streak chip
                        Row(
                            modifier = Modifier
                                .clip(RoundedCornerShape(dims.radiusFull))
                                .background(Color(0xFFFFF4E5))
                                .border(1.dp, Color(0xFFFFE0B2), RoundedCornerShape(dims.radiusFull))
                                .padding(horizontal = 12.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(
                                imageVector = AppIcons.Flame,
                                contentDescription = null,
                                tint = Color(0xFFFF9600),
                                modifier = Modifier.size(16.dp)
                            )
                            Text(
                                text = "${appState.streakDays} kun",
                                style = AppTypography.LabelMedium,
                                color = Color(0xFFFF9600)
                            )
                        }

                        // Voice Studio circular icon button
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(CircleShape)
                                .background(TalkMeColors.ContainerPurpleLight)
                                .border(
                                    1.dp,
                                    TalkMeColors.PrimaryPurple.copy(alpha = 0.2f),
                                    CircleShape
                                )
                                .clickable(onClick = onOpenVoiceStudioClick),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = AppIcons.Mic,
                                contentDescription = "Voice Studio",
                                tint = TalkMeColors.PrimaryPurple,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                }
            }

            // 2. GREETING & 2 GLOBAL COUNTERS
            item {
                Column(verticalArrangement = Arrangement.spacedBy(dims.spaceMedium)) {
                    Column {
                        Text(
                            text = "Salom, ${appState.userName}!",
                            style = AppTypography.DisplayLarge.copy(fontSize = 24.sp),
                            color = TalkMeColors.TextPrimary
                        )
                        Text(
                            text = "Kichik qadamlar, katta imkoniyatlar.",
                            style = AppTypography.BodyMedium,
                            color = TalkMeColors.TextSecondary
                        )
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        // Global Vocabulary Counter
                        Column(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(dims.radiusMedium))
                                .background(TalkMeColors.SurfaceWhite)
                                .border(
                                    1.dp,
                                    TalkMeColors.ContainerGreenLight,
                                    RoundedCornerShape(dims.radiusMedium)
                                )
                                .padding(12.dp)
                        ) {
                            Text(
                                text = "YODLANGAN NOYOB SO‘ZLAR",
                                style = AppTypography.BadgeMicro.copy(fontSize = 10.sp),
                                color = TalkMeColors.SuccessGreen
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "${appState.uniqueLearnedWordsCount} ta so‘z",
                                style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.Black),
                                color = TalkMeColors.TextPrimary
                            )
                            Text(
                                text = "Global Vocabulary Counter",
                                style = AppTypography.LabelSmall,
                                color = TalkMeColors.TextSecondary
                            )
                        }

                        // Global Grammar Counter
                        Column(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(dims.radiusMedium))
                                .background(TalkMeColors.SurfaceWhite)
                                .border(
                                    1.dp,
                                    TalkMeColors.ContainerPurpleLight,
                                    RoundedCornerShape(dims.radiusMedium)
                                )
                                .padding(12.dp)
                        ) {
                            Text(
                                text = "O‘ZLASHTIRILGAN QOIDALAR",
                                style = AppTypography.BadgeMicro.copy(fontSize = 10.sp),
                                color = TalkMeColors.PrimaryPurple
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "${appState.masteredGrammarRulesCount} ta qoida",
                                style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.Black),
                                color = TalkMeColors.TextPrimary
                            )
                            Text(
                                text = "Global Grammar Counter",
                                style = AppTypography.LabelSmall,
                                color = TalkMeColors.TextSecondary
                            )
                        }
                    }
                }
            }

            // 3. ROADMAP OVERVIEW CARD (MENING KURSLARIM & ROADMAP)
            item {
                val cardShape = RoundedCornerShape(dims.radiusExtraLarge)
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(cardShape)
                        .background(
                            Brush.linearGradient(
                                colors = listOf(
                                    Color(0xFF1E1B4B),
                                    Color(0xFF312E81),
                                    Color(0xFF4338CA)
                                )
                            )
                        )
                        .border(1.dp, Color(0xFF818CF8).copy(alpha = 0.35f), cardShape)
                        .padding(dims.cardPadding)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(Color(0xFF34D399).copy(alpha = 0.2f))
                                    .border(
                                        1.dp,
                                        Color(0xFF6EE7B7).copy(alpha = 0.4f),
                                        RoundedCornerShape(8.dp)
                                    )
                                    .padding(horizontal = 8.dp, vertical = 3.dp)
                            ) {
                                Text(
                                    text = "ROADMAP • O‘QUV DASTURI",
                                    style = AppTypography.BadgeMicro.copy(fontWeight = FontWeight.Black),
                                    color = Color(0xFFA7F3D0)
                                )
                            }
                            Text(
                                text = "11 BO‘LIM",
                                style = AppTypography.BadgeMicro.copy(fontWeight = FontWeight.ExtraBold),
                                color = Color(0xFFC7D2FE)
                            )
                        }

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(dims.radiusFull))
                                .background(Color.Black.copy(alpha = 0.3f))
                                .padding(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "86 ta mavzu",
                                style = AppTypography.BadgeMicro,
                                color = Color(0xFFFCD34D)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = "Ingliz Tili Yo‘l Xaritasi",
                        style = AppTypography.HeadlineMedium.copy(fontWeight = FontWeight.Black),
                        color = Color.White
                    )
                    Text(
                        text = "Mening kurslarim sahifasida barcha mavzular ro‘yxati",
                        style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.Bold),
                        color = Color(0xFFA7F3D0)
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Duolingo uslubidagi interaktiv xarita, 3D qulflar va bosqichma-bosqich o‘quv rejasi. Darslarni birma-bir o‘rganib boramiz!",
                        style = AppTypography.LabelMedium,
                        color = Color(0xFFE0E7FF).copy(alpha = 0.9f)
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(46.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(
                                Brush.horizontalGradient(
                                    listOf(Color(0xFF34D399), Color(0xFF2DD4BF))
                                )
                            )
                            .clickable(onClick = onOpenCoursesClick),
                        contentAlignment = Alignment.Center
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Text(
                                text = "Mening kurslarim (Yo‘l xaritasi)",
                                style = AppTypography.TitleMedium.copy(
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Black
                                ),
                                color = Color(0xFF020617)
                            )
                            Icon(
                                imageVector = AppIcons.ArrowForward,
                                contentDescription = null,
                                tint = Color(0xFF020617),
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(42.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(Color.White.copy(alpha = 0.1f))
                            .border(1.dp, Color.White.copy(alpha = 0.2f), RoundedCornerShape(12.dp))
                            .clickable {
                                onOpenLessonClick("grammar_fundamentals", "lvl_1")
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Text(
                                text = "1-Bo‘lim: Grammar Fundamentals xaritasiga o‘tish",
                                style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.ExtraBold),
                                color = Color.White
                            )
                            Icon(
                                imageVector = AppIcons.ArrowForward,
                                contentDescription = null,
                                tint = Color.White,
                                modifier = Modifier.size(14.dp)
                            )
                        }
                    }
                }
            }

            // 4. VOCABULARY BANNER CARD (FSRS Spaced Repetition)
            item {
                val shape = RoundedCornerShape(dims.radiusLarge)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(shape)
                        .background(TalkMeColors.ContainerGreenLight)
                        .border(1.dp, TalkMeColors.SuccessGreen.copy(alpha = 0.3f), shape)
                        .clickable(onClick = onOpenRepeatClick)
                        .padding(18.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .clip(RoundedCornerShape(16.dp))
                                .background(TalkMeColors.SuccessGreen),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = AppIcons.BookOpen,
                                contentDescription = null,
                                tint = Color.White,
                                modifier = Modifier.size(24.dp)
                            )
                        }
                        Column {
                            Text(
                                text = "Bugun ${appState.fsrsCards.size} ta so‘zni eslang",
                                style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.ExtraBold),
                                color = TalkMeColors.TextPrimary
                            )
                            Text(
                                text = "FSRS oraliqli takrorlash · ~3 daqiqa",
                                style = AppTypography.LabelMedium,
                                color = Color(0xFF2E7D32)
                            )
                        }
                    }

                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(Color.White),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = AppIcons.ArrowForward,
                            contentDescription = null,
                            tint = TalkMeColors.SuccessGreen,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }
            }

            // 5. SKILLS SECTION (Tinglash, Gapirish, O'qish, Yozish)
            item {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Har kuni, har bir ko‘nikma",
                            style = AppTypography.TitleLarge,
                            color = TalkMeColors.TextPrimary
                        )
                        Text(
                            text = "Barchasi",
                            style = AppTypography.LabelMedium,
                            color = TalkMeColors.PrimaryPurple,
                            modifier = Modifier.clickable(onClick = onOpenCoursesClick)
                        )
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        HomeSkillCard(
                            icon = AppIcons.Headphones,
                            iconBg = TalkMeColors.ContainerPurpleLight,
                            iconTint = TalkMeColors.PrimaryPurple,
                            title = "Tinglash",
                            subtitle = "Listening · 8 daq",
                            onClick = {
                                appState.speak("Hello! Listening practice builds your understanding.")
                            },
                            modifier = Modifier.weight(1f)
                        )
                        HomeSkillCard(
                            icon = AppIcons.Mic,
                            iconBg = Color(0xFFFFF4E5),
                            iconTint = Color(0xFFD97706),
                            title = "Gapirish",
                            subtitle = "Speaking · 5 daq",
                            onClick = onOpenVoiceStudioClick,
                            modifier = Modifier.weight(1f)
                        )
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        HomeSkillCard(
                            icon = AppIcons.BookOpen,
                            iconBg = TalkMeColors.ContainerGreenLight,
                            iconTint = TalkMeColors.SuccessGreen,
                            title = "O‘qish",
                            subtitle = "Reading · 6 daq",
                            onClick = onOpenCoursesClick,
                            modifier = Modifier.weight(1f)
                        )
                        HomeSkillCard(
                            icon = AppIcons.GraduationCap,
                            iconBg = Color(0xFFE5F6FE),
                            iconTint = Color(0xFF0284C7),
                            title = "Yozish",
                            subtitle = "Writing · 7 daq",
                            onClick = onOpenQuizClick,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }

            // 6. WEEKLY PLAN SECTION
            item {
                val pct = ((appState.weeklyCompletedLessons.toFloat() / appState.weeklyGoalLessons.toFloat()) * 100f).toInt()
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Haftalik reja",
                            style = AppTypography.TitleLarge,
                            color = TalkMeColors.TextPrimary
                        )
                        Text(
                            text = "${appState.weeklyCompletedLessons}/${appState.weeklyGoalLessons} dars",
                            style = AppTypography.LabelMedium,
                            color = TalkMeColors.SuccessGreen
                        )
                    }

                    TalkMeCard {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            TalkMeBadge(
                                text = appState.userLevel,
                                containerColor = TalkMeColors.ContainerPurpleLight,
                                textColor = TalkMeColors.PrimaryPurple
                            )
                            Text(
                                text = "$pct% bajarildi",
                                style = AppTypography.LabelMedium,
                                color = TalkMeColors.TextSecondary
                            )
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        TalkMeProgressBar(
                            progress = appState.weeklyCompletedLessons.toFloat() / appState.weeklyGoalLessons.toFloat(),
                            fillColor = TalkMeColors.SuccessGreen
                        )

                        Spacer(modifier = Modifier.height(12.dp))

                        // Real Situation Task Row
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(12.dp))
                                .background(Color(0xFFFAFAFC))
                                .border(1.dp, Color(0xFFF0EFF5), RoundedCornerShape(12.dp))
                                .clickable {
                                    appState.speak("Could I have some tea, please?")
                                }
                                .padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(34.dp)
                                        .clip(RoundedCornerShape(10.dp))
                                        .background(Color(0xFFFEF3C7)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = "☕",
                                        fontSize = 16.sp
                                    )
                                }
                                Column {
                                    Text(
                                        text = "Real vaziyatlar",
                                        style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.Bold),
                                        color = TalkMeColors.TextPrimary
                                    )
                                    Text(
                                        text = "Kafeda buyurtma · “Could I have some tea?”",
                                        style = AppTypography.LabelSmall,
                                        color = TalkMeColors.TextSecondary
                                    )
                                }
                            }

                            Box(
                                modifier = Modifier
                                    .size(28.dp)
                                    .clip(CircleShape)
                                    .background(Color.White),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = AppIcons.VolumeUp,
                                    contentDescription = "Play Audio",
                                    tint = TalkMeColors.PrimaryPurple,
                                    modifier = Modifier.size(15.dp)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun HomeSkillCard(
    icon: ImageVector,
    iconBg: Color,
    iconTint: Color,
    title: String,
    subtitle: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .background(Color.White)
            .border(1.dp, Color(0xFFF0EFF5), RoundedCornerShape(16.dp))
            .clickable(onClick = onClick)
            .padding(14.dp)
    ) {
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(iconBg),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = iconTint,
                modifier = Modifier.size(20.dp)
            )
        }
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = title,
            style = AppTypography.TitleMedium.copy(fontSize = 14.sp),
            color = TalkMeColors.TextPrimary
        )
        Text(
            text = subtitle,
            style = AppTypography.LabelSmall,
            color = TalkMeColors.TextSecondary
        )
    }
}
