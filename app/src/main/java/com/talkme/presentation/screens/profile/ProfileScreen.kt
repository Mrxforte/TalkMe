package com.talkme.presentation.screens.profile

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
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.talkme.presentation.components.TalkMeBadge
import com.talkme.presentation.components.TalkMeBottomBar
import com.talkme.presentation.components.TalkMeBottomTab
import com.talkme.presentation.components.TalkMeButton
import com.talkme.presentation.components.TalkMeButtonVariant
import com.talkme.presentation.components.TalkMeCard
import com.talkme.presentation.components.TalkMeHeader
import com.talkme.presentation.components.TalkMeTabRow
import com.talkme.presentation.state.LeaderboardStudentUiModel
import com.talkme.presentation.state.LocalTalkMeAppState
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.LocalDimensions
import com.talkme.ui.theme.TalkMeColors

/**
 * Pixel-perfect migration of `src/screens/ProfileScreen.tsx`:
 * - User Info Header Card (`#F1EDFA`, initial avatar `"A"`, `"Aziz"`, `"Toshkent · 2026-yil sentabrdan"`, `"A2 o‘quvchi"` badge)
 * - 2-Column XP and Rank cards (`1,240 XP` + `4-o‘rin`)
 * - Streak Card (`Flame` + `"7 kun ketma-ket! Bugun bajarildi"`)
 * - Section 1: Reyting (Leaderboard) with `Bu hafta / Jami` tabs, motivation banner, and top 4 students list
 * - Section 2: Voice AI Engine & Model Controls:
 *   - Gemini 3.8 Flash TTS card with live speed slider + `"Eshitish"` button
 *   - Primary `"Voice Studio — Ovoz Sinov Muhiti"` button
 *   - Secondary `"Barcha Voice AI Sozlamalari"` button
 * - `TalkMeBottomBar` pinned at bottom
 */
@Composable
fun ProfileScreen(
    onBackClick: (() -> Unit)? = null,
    onNavigateHome: () -> Unit = {},
    onNavigateCourses: () -> Unit = {},
    onNavigateRepeat: () -> Unit = {},
    onOpenVoiceStudio: () -> Unit = {},
    onOpenVoiceSettings: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current
    val appState = LocalTalkMeAppState.current
    var selectedLeaderboardTab by remember { mutableIntStateOf(0) }

    val leaderboardStudents = remember(appState.xp, appState.userName) {
        listOf(
            LeaderboardStudentUiModel(1, "Madina S.", 1480, false, "M"),
            LeaderboardStudentUiModel(2, "Jasur K.", 1320, false, "J"),
            LeaderboardStudentUiModel(3, "Sardor M.", 1280, false, "S"),
            LeaderboardStudentUiModel(4, "${appState.userName} (Siz)", appState.xp, true, appState.userName.take(1))
        )
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        containerColor = Color(0xFFFAFAFC),
        bottomBar = {
            TalkMeBottomBar(
                activeTab = TalkMeBottomTab.PROFILE,
                onSelectTab = { tab ->
                    when (tab) {
                        TalkMeBottomTab.HOME -> onNavigateHome()
                        TalkMeBottomTab.COURSES -> onNavigateCourses()
                        TalkMeBottomTab.REPEAT -> onNavigateRepeat()
                        TalkMeBottomTab.PROFILE -> Unit
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
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Header
            item {
                TalkMeHeader(
                    title = "Profilim",
                    subtitle = "O‘rganish yo‘lim va yutuqlar",
                    onBackClick = onBackClick
                )
            }

            // User Info Header Card
            item {
                val boxShape = RoundedCornerShape(dims.radiusExtraLarge)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(boxShape)
                        .background(TalkMeColors.ContainerPurpleLight)
                        .border(1.dp, TalkMeColors.PrimaryPurple.copy(alpha = 0.2f), boxShape)
                        .padding(dims.cardPadding),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(52.dp)
                                .clip(CircleShape)
                                .background(Color.White)
                                .border(2.dp, Color.White, CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = appState.userName.firstOrNull()?.toString() ?: "A",
                                style = AppTypography.DisplayLarge.copy(
                                    fontSize = 22.sp,
                                    fontWeight = FontWeight.Black
                                ),
                                color = TalkMeColors.PrimaryPurple
                            )
                        }

                        Column {
                            Text(
                                text = appState.userName,
                                style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.ExtraBold),
                                color = TalkMeColors.TextPrimary
                            )
                            Text(
                                text = "Toshkent · 2026-yil sentabrdan",
                                style = AppTypography.LabelSmall,
                                color = TalkMeColors.TextSecondary
                            )
                        }
                    }

                    TalkMeBadge(
                        text = appState.userLevel,
                        containerColor = Color.White,
                        textColor = TalkMeColors.PrimaryPurple
                    )
                }
            }

            // XP & Rank Cards (2 Columns)
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(16.dp))
                            .background(Color.White)
                            .border(1.dp, Color(0xFFF0EFF5), RoundedCornerShape(16.dp))
                            .padding(14.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "Jami to‘plangan",
                            style = AppTypography.LabelSmall.copy(fontWeight = FontWeight.SemiBold),
                            color = TalkMeColors.TextSecondary
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "${appState.xp} XP",
                            style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.Black),
                            color = TalkMeColors.PrimaryPurple
                        )
                    }

                    Column(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(16.dp))
                            .background(Color.White)
                            .border(1.dp, Color(0xFFF0EFF5), RoundedCornerShape(16.dp))
                            .padding(14.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "Haftalik reyting",
                            style = AppTypography.LabelSmall.copy(fontWeight = FontWeight.SemiBold),
                            color = TalkMeColors.TextSecondary
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "4-o‘rin",
                            style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.Black),
                            color = TalkMeColors.SuccessGreen
                        )
                    }
                }
            }

            // Streak Card
            item {
                TalkMeCard {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(Color(0xFFFFF4E5)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = AppIcons.Flame,
                                contentDescription = null,
                                tint = Color(0xFFFF9600),
                                modifier = Modifier.size(24.dp)
                            )
                        }

                        Column {
                            Text(
                                text = "${appState.streakDays} kun ketma-ket! Bugun bajarildi",
                                style = AppTypography.TitleMedium.copy(
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.ExtraBold
                                ),
                                color = TalkMeColors.TextPrimary
                            )
                            Text(
                                text = "O‘rganish odatini mustahkam ushlang",
                                style = AppTypography.LabelSmall,
                                color = TalkMeColors.TextSecondary
                            )
                        }
                    }
                }
            }

            // Section 1: Reyting (Leaderboard)
            item {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Column {
                        Text(
                            text = "Reyting",
                            style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.ExtraBold),
                            color = TalkMeColors.TextPrimary
                        )
                        Text(
                            text = "Birga o‘rganamiz, birga o‘samiz",
                            style = AppTypography.LabelSmall,
                            color = TalkMeColors.TextSecondary
                        )
                    }

                    TalkMeTabRow(
                        tabs = listOf("Bu hafta", "Jami"),
                        selectedIndex = selectedLeaderboardTab,
                        onSelectTab = { selectedLeaderboardTab = it }
                    )

                    // Motivation Banner
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .background(TalkMeColors.ContainerGreenLight)
                            .border(1.dp, TalkMeColors.SuccessGreen.copy(alpha = 0.3f), RoundedCornerShape(16.dp))
                            .padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Icon(
                            imageVector = AppIcons.Award,
                            contentDescription = null,
                            tint = TalkMeColors.SuccessGreen,
                            modifier = Modifier.size(20.dp)
                        )
                        Text(
                            text = "Kuchli uchlikka yana 40 XP! O‘z sur‘atingizda davom eting, ${appState.userName}.",
                            style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.SemiBold),
                            color = Color(0xFF2E7D32)
                        )
                    }

                    // Students Rankings Card
                    TalkMeCard {
                        Text(
                            text = "A2 BILIMDONLARI · 20 O‘QUVCHI",
                            style = AppTypography.LabelSmall.copy(
                                fontWeight = FontWeight.Black,
                                letterSpacing = 1.sp
                            ),
                            color = TalkMeColors.PrimaryPurple
                        )

                        Spacer(modifier = Modifier.height(10.dp))

                        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            leaderboardStudents.forEach { student ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(
                                            if (student.isCurrentUser) TalkMeColors.ContainerPurpleLight.copy(alpha = 0.6f)
                                            else Color.Transparent
                                        )
                                        .padding(horizontal = 10.dp, vertical = 8.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                                    ) {
                                        Text(
                                            text = "#${student.rank}",
                                            style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.Black),
                                            color = if (student.isCurrentUser) TalkMeColors.PrimaryPurple else TalkMeColors.TextSecondary,
                                            modifier = Modifier.width(28.dp)
                                        )

                                        Box(
                                            modifier = Modifier
                                                .size(32.dp)
                                                .clip(CircleShape)
                                                .background(
                                                    if (student.isCurrentUser) TalkMeColors.PrimaryPurple
                                                    else Color(0xFFF0EFF5)
                                                ),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text(
                                                text = student.avatarInitials,
                                                style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.Black),
                                                color = if (student.isCurrentUser) Color.White else TalkMeColors.TextPrimary
                                            )
                                        }

                                        Text(
                                            text = student.name,
                                            style = AppTypography.TitleMedium.copy(
                                                fontSize = 14.sp,
                                                fontWeight = if (student.isCurrentUser) FontWeight.Black else FontWeight.Bold
                                            ),
                                            color = if (student.isCurrentUser) TalkMeColors.PrimaryPurple else TalkMeColors.TextPrimary
                                        )
                                    }

                                    TalkMeBadge(
                                        text = "${student.xp} XP",
                                        containerColor = if (student.isCurrentUser) TalkMeColors.PrimaryPurple else Color(0xFFF0EFF5),
                                        textColor = if (student.isCurrentUser) Color.White else TalkMeColors.TextSecondary
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // Section 2: Voice AI Engine & Model Controls
            item {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Column {
                        Text(
                            text = "Ovozli AI Engine & Model Sozlamalari",
                            style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.ExtraBold),
                            color = TalkMeColors.TextPrimary
                        )
                        Text(
                            text = "TTS dvigatellari, modellar va ovoz tezligini boshqarish",
                            style = AppTypography.LabelSmall,
                            color = TalkMeColors.TextSecondary
                        )
                    }

                    // Active Engine Card with Slider
                    val engineCardShape = RoundedCornerShape(dims.radiusExtraLarge)
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(engineCardShape)
                            .background(TalkMeColors.ContainerPurpleLight)
                            .border(1.dp, TalkMeColors.PrimaryPurple.copy(alpha = 0.2f), engineCardShape)
                            .padding(dims.cardPadding),
                        verticalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "Aktiv Dvigatel: Gemini 3.8 Flash TTS",
                                    style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.ExtraBold),
                                    color = TalkMeColors.PrimaryPurple
                                )
                                Text(
                                    text = "Tabiiy mobil AI ovoz (24kHz WAV · en-US)",
                                    style = AppTypography.LabelSmall,
                                    color = TalkMeColors.TextSecondary
                                )
                            }

                            TalkMeBadge(
                                text = "GEMINI 3.8",
                                containerColor = TalkMeColors.ContainerGreenLight,
                                textColor = TalkMeColors.SuccessGreen
                            )
                        }

                        // Speed Slider
                        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "Ovoz tezligi: ${String.format("%.2f", appState.speechSpeed)}x",
                                    style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.Bold),
                                    color = TalkMeColors.TextPrimary
                                )

                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(dims.radiusFull))
                                        .background(TalkMeColors.PrimaryPurple)
                                        .clickable {
                                            appState.speak("Welcome to TalkMe English learning platform!")
                                        }
                                        .padding(horizontal = 12.dp, vertical = 6.dp)
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                                    ) {
                                        Icon(
                                            imageVector = AppIcons.VolumeUp,
                                            contentDescription = null,
                                            tint = Color.White,
                                            modifier = Modifier.size(14.dp)
                                        )
                                        Text(
                                            text = "Eshitish",
                                            style = AppTypography.BadgeMicro,
                                            color = Color.White
                                        )
                                    }
                                }
                            }

                            Slider(
                                value = appState.speechSpeed,
                                onValueChange = { appState.speechSpeed = it },
                                valueRange = 0.65f..1.25f,
                                colors = SliderDefaults.colors(
                                    thumbColor = TalkMeColors.PrimaryPurple,
                                    activeTrackColor = TalkMeColors.PrimaryPurple,
                                    inactiveTrackColor = TalkMeColors.ContainerPurpleBorder
                                )
                            )
                        }
                    }

                    // Navigation Action Buttons
                    TalkMeButton(
                        text = "Voice Studio — Ovoz Sinov Muhiti",
                        trailingIcon = AppIcons.Mic,
                        onClick = onOpenVoiceStudio
                    )

                    TalkMeButton(
                        text = "Barcha Voice AI Sozlamalari",
                        variant = TalkMeButtonVariant.Secondary,
                        trailingIcon = AppIcons.SettingsSliders,
                        onClick = onOpenVoiceSettings
                    )
                }
            }
        }
    }
}
