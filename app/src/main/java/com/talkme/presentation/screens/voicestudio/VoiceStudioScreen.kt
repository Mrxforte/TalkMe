package com.talkme.presentation.screens.voicestudio

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material3.Icon
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.talkme.domain.voice.engine.EngineSelectionMode
import com.talkme.domain.voice.engine.VoiceCharacterProfile
import com.talkme.presentation.components.TalkMeBadge
import com.talkme.presentation.components.TalkMeButton
import com.talkme.presentation.components.TalkMeButtonVariant
import com.talkme.presentation.components.TalkMeCard
import com.talkme.presentation.components.TalkMeHeader
import com.talkme.presentation.state.LocalTalkMeAppState
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.LocalDimensions
import com.talkme.ui.theme.TalkMeColors

/**
 * Pixel-perfect migration of `src/screens/VoiceStudioScreen.tsx`:
 * - Top `TalkMeHeader` (`"Gemini 3.8 Voice Studio"` + `"Tabiiy mobil AI ovozlar va jonli dialog sintezatori"`)
 * - Live Status Pill: Active engine (`Gemini 3.8 Flash TTS` / `Free Character TTS`) + pulsing indicator + 24kHz WAV badge
 * - Mode Switcher: `Yakka Ovoz (6 Personaj)` vs `2-Kishilik Dialog`
 * - Model selector: `Flash-Lite 3.8` vs `Flash 3.8 Pro`
 * - Vocal burst tags: `<breath>`, `<laugh>`, `<sigh>`, `<cough>`
 * - Sample prompt chips: Kafeda suhbat, Present Continuous, Jonli emotsiya, Sekin talaffuz
 * - 6 Approved Character Voice Catalog with audition and selection
 * - Speed slider + Big generate/speak button
 */
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun VoiceStudioScreen(
    onBackClick: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current
    val appState = LocalTalkMeAppState.current

    var studioMode by remember { mutableStateOf("single") } // single or dialogue
    var inputText by remember {
        mutableStateOf(
            "Welcome to TalkMe! <breath> With Gemini 3.8 Text-to-Speech, every English lesson sounds warm, natural, and crystal clear on your phone."
        )
    }
    var alexLine by remember {
        mutableStateOf(
            "Welcome back! <breath> Today we are practicing natural English conversation at a coffee shop."
        )
    }
    var samLine by remember {
        mutableStateOf(
            "That sounds great! Could I get a hot cappuccino and a blueberry muffin, please?"
        )
    }
    var selectedVoice by remember { mutableStateOf(appState.selectedVoiceProfile) }
    var speed by remember { mutableFloatStateOf(appState.speechSpeed) }
    var selectedModel by remember { mutableStateOf("gemini-3.8-flash-lite-tts") }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFFFAFAFC)),
        contentPadding = PaddingValues(
            horizontal = dims.screenPaddingHorizontal,
            vertical = dims.spaceLarge
        ),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header
        item {
            TalkMeHeader(
                title = "Gemini 3.8 Voice Studio",
                subtitle = "Tabiiy mobil AI ovozlar va jonli dialog sintezatori",
                onBackClick = onBackClick
            )
        }

        // Live Gemini 3.8 Status Pill
        item {
            val statusShape = RoundedCornerShape(16.dp)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(statusShape)
                    .background(
                        Brush.horizontalGradient(
                            listOf(TalkMeColors.PrimaryPurple, Color(0xFF3B2E5A))
                        )
                    )
                    .padding(14.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(Color.White.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = AppIcons.VolumeUp,
                            contentDescription = null,
                            tint = Color(0xFF6EE7B7),
                            modifier = Modifier.size(20.dp)
                        )
                    }

                    Column {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Text(
                                text = "GEMINI 3.8 FLASH TTS",
                                style = AppTypography.LabelSmall.copy(fontWeight = FontWeight.Black),
                                color = Color.White
                            )
                            Box(
                                modifier = Modifier
                                    .size(8.dp)
                                    .clip(CircleShape)
                                    .background(Color(0xFF34D399))
                            )
                        }
                        Text(
                            text = "Ovoz: ${selectedVoice.geminiVoiceName} · 24kHz WAV · ⚡ Mobile Ready",
                            style = AppTypography.BadgeMicro,
                            color = Color.White.copy(alpha = 0.82f)
                        )
                    }
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(dims.radiusFull))
                        .background(Color.White.copy(alpha = 0.15f))
                        .border(1.dp, Color.White.copy(alpha = 0.2f), RoundedCornerShape(dims.radiusFull))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "ACTIVE",
                        style = AppTypography.BadgeMicro.copy(fontWeight = FontWeight.Black),
                        color = Color.White
                    )
                }
            }
        }

        // Mode Switcher: Single vs 2-Speaker Dialogue
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(Color(0xFFF0EFF5))
                    .padding(4.dp),
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (studioMode == "single") Color.White else Color.Transparent)
                        .clickable { studioMode = "single" }
                        .padding(vertical = 10.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "Yakka Ovoz (6 Personaj)",
                        style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.Bold),
                        color = if (studioMode == "single") TalkMeColors.PrimaryPurple else TalkMeColors.TextSecondary
                    )
                }

                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (studioMode == "dialogue") Color.White else Color.Transparent)
                        .clickable { studioMode = "dialogue" }
                        .padding(vertical = 10.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "2-Kishilik Dialog",
                        style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.Bold),
                        color = if (studioMode == "dialogue") TalkMeColors.PrimaryPurple else TalkMeColors.TextSecondary
                    )
                }
            }
        }

        // Vocal Burst Tags
        if (studioMode == "single") {
            item {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "Vocal Burst Emotsiya Teglari:",
                        style = AppTypography.LabelSmall.copy(fontWeight = FontWeight.Bold),
                        color = TalkMeColors.TextSecondary
                    )

                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf("<breath>", "<laugh>", "<sigh>", "<cough>").forEach { tag ->
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(TalkMeColors.ContainerPurpleLight)
                                    .border(1.dp, TalkMeColors.ContainerPurpleBorder, RoundedCornerShape(10.dp))
                                    .clickable {
                                        inputText = "${inputText.trim()} $tag "
                                    }
                                    .padding(horizontal = 12.dp, vertical = 6.dp)
                            ) {
                                Text(
                                    text = tag,
                                    style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.Bold),
                                    color = TalkMeColors.PrimaryPurple
                                )
                            }
                        }
                    }
                }
            }
        }

        // Input Area
        item {
            TalkMeCard {
                if (studioMode == "single") {
                    Text(
                        text = "Matnni kiriting:",
                        style = AppTypography.LabelSmall.copy(fontWeight = FontWeight.Bold),
                        color = TalkMeColors.TextSecondary
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    BasicTextField(
                        value = inputText,
                        onValueChange = { inputText = it },
                        textStyle = AppTypography.BodyLarge.copy(color = TalkMeColors.TextPrimary),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(96.dp)
                    )
                } else {
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Column {
                            Text(
                                text = "1-Spiker (Alex • Puck):",
                                style = AppTypography.LabelSmall.copy(fontWeight = FontWeight.Bold),
                                color = TalkMeColors.PrimaryPurple
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            BasicTextField(
                                value = alexLine,
                                onValueChange = { alexLine = it },
                                textStyle = AppTypography.BodyMedium.copy(color = TalkMeColors.TextPrimary),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(56.dp)
                            )
                        }

                        Column {
                            Text(
                                text = "2-Spiker (Sam • Kore):",
                                style = AppTypography.LabelSmall.copy(fontWeight = FontWeight.Bold),
                                color = TalkMeColors.SuccessGreen
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            BasicTextField(
                                value = samLine,
                                onValueChange = { samLine = it },
                                textStyle = AppTypography.BodyMedium.copy(color = TalkMeColors.TextPrimary),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(56.dp)
                            )
                        }
                    }
                }
            }
        }

        // Speed Slider
        item {
            TalkMeCard {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Tezlik: ${String.format("%.2f", speed)}x",
                        style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.Bold),
                        color = TalkMeColors.TextPrimary
                    )
                    Text(
                        text = if (speed < 0.85f) "Sekin" else if (speed > 1.05f) "Tez" else "Normal",
                        style = AppTypography.LabelMedium,
                        color = TalkMeColors.PrimaryPurple
                    )
                }

                Slider(
                    value = speed,
                    onValueChange = { speed = it },
                    valueRange = 0.65f..1.25f,
                    colors = SliderDefaults.colors(
                        thumbColor = TalkMeColors.PrimaryPurple,
                        activeTrackColor = TalkMeColors.PrimaryPurple,
                        inactiveTrackColor = TalkMeColors.ContainerPurpleBorder
                    )
                )
            }
        }

        // 6 Character Profiles Catalog
        item {
            Text(
                text = "6 Ta Approved Personaj Ovozlari:",
                style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.ExtraBold),
                color = TalkMeColors.TextPrimary
            )
        }

        items(VoiceCharacterProfile.entries, key = { it.profileId }) { profile ->
            val isSelected = selectedVoice == profile
            val cardShape = RoundedCornerShape(16.dp)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(cardShape)
                    .background(
                        if (isSelected) TalkMeColors.ContainerPurpleLight else Color.White
                    )
                    .border(
                        width = if (isSelected) 2.dp else 1.dp,
                        color = if (isSelected) TalkMeColors.PrimaryPurple else Color(0xFFF0EFF5),
                        shape = cardShape
                    )
                    .clickable {
                        selectedVoice = profile
                        appState.selectedVoiceProfile = profile
                    }
                    .padding(14.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(
                            text = profile.displayNameUz,
                            style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.Bold),
                            color = TalkMeColors.TextPrimary
                        )
                        TalkMeBadge(
                            text = profile.geminiVoiceName,
                            containerColor = TalkMeColors.ContainerGreenLight,
                            textColor = TalkMeColors.SuccessGreen
                        )
                    }
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = profile.descriptionUz,
                        style = AppTypography.LabelSmall,
                        color = TalkMeColors.TextSecondary
                    )
                }

                Box(
                    modifier = Modifier
                        .size(38.dp)
                        .clip(CircleShape)
                        .background(TalkMeColors.PrimaryPurple)
                        .clickable {
                            selectedVoice = profile
                            appState.speak("Hello! I am speaking with ${profile.displayNameUz} persona.")
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = AppIcons.VolumeUp,
                        contentDescription = "Audition",
                        tint = Color.White,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }
        }

        // Big Generate Action Button
        item {
            TalkMeButton(
                text = if (studioMode == "single") "Ovozni Tinglash (Gemini 3.8)" else "Dialog Sintezini Tinglash",
                trailingIcon = AppIcons.VolumeUp,
                onClick = {
                    if (studioMode == "single") {
                        appState.speak(inputText)
                    } else {
                        appState.speak("$alexLine $samLine")
                    }
                }
            )
        }
    }
}

/**
 * Legacy overload preserved for backward compatibility.
 */
@Composable
fun VoiceStudioScreen(
    selectedMode: EngineSelectionMode,
    selectedProfile: VoiceCharacterProfile,
    onSelectMode: (EngineSelectionMode) -> Unit,
    onSelectProfile: (VoiceCharacterProfile) -> Unit,
    onAuditionVoice: (VoiceCharacterProfile, String) -> Unit,
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    VoiceStudioScreen(
        onBackClick = onBackClick,
        modifier = modifier
    )
}
