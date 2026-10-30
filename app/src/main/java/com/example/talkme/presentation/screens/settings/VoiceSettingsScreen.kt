package com.example.talkme.presentation.screens.settings

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Slider
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.talkme.R
import com.example.talkme.domain.settings.VoiceSettings
import com.example.talkme.domain.voice.model.EngineSelectionMode
import com.example.talkme.domain.voice.testing.SampleStory
import com.example.talkme.presentation.components.TalkMeBadge
import com.example.talkme.presentation.components.TalkMeButton
import com.example.talkme.presentation.components.TalkMeCard
import com.example.talkme.presentation.components.TalkMeHeader
import com.example.talkme.presentation.components.TalkMeTabRow
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.SuccessGreen
import com.example.talkme.ui.theme.TalkMeTheme

/**
 * Reactive Voice AI Settings & Speech Testing Screen connected to DataStore preferences.
 * Includes 6 distinct human character voice profiles, natural speech rate sliders, and explicit play/stop controls.
 *
 * @param settings Current active VoiceSettings state.
 * @param onBackClick Navigation back handler.
 * @param onLocalFirstChanged Callback invoked when local-first switch is toggled.
 * @param onCharacterProfileChanged Callback invoked when character voice profile is selected.
 * @param onSpeedChanged Callback invoked when speed slider changes.
 * @param onPitchChanged Callback invoked when pitch slider changes.
 * @param onAudioCacheChanged Callback invoked when audio cache switch is toggled.
 * @param onRunQuickTestClick Callback invoked when speech test button is clicked.
 * @param onResetDefaultsClick Callback invoked when reset defaults is clicked.
 * @param modifier Composable layout modifier.
 */
@Composable
fun VoiceSettingsScreen(
    settings: VoiceSettings,
    onBackClick: () -> Unit,
    onLocalFirstChanged: (Boolean) -> Unit,
    onCharacterProfileChanged: (String) -> Unit,
    onSpeedChanged: (Float) -> Unit,
    onPitchChanged: (Float) -> Unit,
    onAudioCacheChanged: (Boolean) -> Unit,
    onRunQuickTestClick: (String) -> Unit,
    onResetDefaultsClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val dimensions = LocalDimensions.current
    var testReportText by remember { mutableStateOf("") }
    var isTestPlaying by remember { mutableStateOf(false) }

    val characterProfilesList = listOf(
        "Ustoz",
        "Hikoyachi",
        "Suhbatdosh",
        "Akademik",
        "Kichik O'quvchi",
        "Dinamik"
    )

    val currentProfileName = settings.selectedCharacterProfile
    var selectedCharacterIndex by remember(currentProfileName) {
        mutableIntStateOf(characterProfilesList.indexOf(currentProfileName).coerceAtLeast(0))
    }

    val isLocalFirst = settings.engineSelectionMode == EngineSelectionMode.LOCAL_FIRST

    Scaffold(
        modifier = modifier.fillMaxSize(),
        containerColor = MaterialTheme.colorScheme.background,
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = dimensions.paddingExtraLarge),
        ) {
            TalkMeHeader(
                title = stringResource(id = R.string.voice_settings_title),
                subtitle = stringResource(id = R.string.voice_settings_subtitle),
                onBackClick = onBackClick,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // 1. General & Engine Routing Settings
            TalkMeCard(
                containerColor = MaterialTheme.colorScheme.surface,
            ) {
                Column {
                    Text(
                        text = stringResource(id = R.string.section_general_engine),
                        style = AppTypography.CardTitle,
                    )
                    Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = stringResource(id = R.string.label_local_first),
                                style = AppTypography.CardTitle,
                            )
                            Text(
                                text = stringResource(id = R.string.desc_local_first),
                                style = AppTypography.CardSubtitle,
                            )
                        }
                        Switch(
                            checked = isLocalFirst,
                            onCheckedChange = onLocalFirstChanged,
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // 2. Character Voice Profile Selection ("6 ta haqiqiy va bir-biridan farqli personajlar")
            TalkMeCard(
                containerColor = MaterialTheme.colorScheme.primaryContainer,
                borderColor = MaterialTheme.colorScheme.primary,
            ) {
                Column {
                    Text(
                        text = "Ovoz Xarakteri & Personajlar (6 xil distinct ovoz)",
                        style = AppTypography.CardTitle.copy(color = MaterialTheme.colorScheme.primary),
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                    // Row 1: Primary Profiles
                    TalkMeTabRow(
                        tabs = characterProfilesList.subList(0, 3),
                        selectedIndex = if (selectedCharacterIndex in 0..2) selectedCharacterIndex else -1,
                        onTabSelected = { index ->
                            selectedCharacterIndex = index
                            val chosenName = characterProfilesList[index]
                            onCharacterProfileChanged(chosenName)
                        },
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                    // Row 2: Secondary Profiles
                    TalkMeTabRow(
                        tabs = characterProfilesList.subList(3, 6),
                        selectedIndex = if (selectedCharacterIndex in 3..5) selectedCharacterIndex - 3 else -1,
                        onTabSelected = { index ->
                            val actualIndex = index + 3
                            selectedCharacterIndex = actualIndex
                            val chosenName = characterProfilesList[actualIndex]
                            onCharacterProfileChanged(chosenName)
                        },
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                    val profileDescription = when (characterProfilesList[selectedCharacterIndex]) {
                        "Ustoz" -> "👨‍🏫 Ustoz: Aniq, ravshan va sekinroq qoidalarni o'qish nutqi."
                        "Hikoyachi" -> "📖 Hikoyachi: Chuqurroq, bosiq va ohangdor hikoya o'qish ovozi."
                        "Akademik" -> "🎓 Akademik: Salmoqli va botiq akademik ma'ruza toni."
                        "Kichik O'quvchi" -> "👧 Kichik O'quvchi: Yuqori pitchli, sho'x va jonli ovoz."
                        "Dinamik" -> "🚀 Dinamik: Tez, shiddatli va ekspressiv spiker."
                        else -> "💬 Suhbatdosh: Tabiiy kunlik insoniy so'zlashuv nutq tezligi."
                    }

                    Text(
                        text = profileDescription,
                        style = AppTypography.CardSubtitle.copy(
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontWeight = FontWeight.SemiBold,
                        ),
                    )
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // 3. Speech Parameters (Human Natural Speech Rate & Pitch Sliders)
            TalkMeCard(
                containerColor = MaterialTheme.colorScheme.surface,
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                    ) {
                        Text(
                            text = stringResource(id = R.string.label_speech_speed),
                            style = AppTypography.CardTitle,
                        )
                        Text(
                            text = "${"%.2f".format(settings.speechSpeed)}x (Tabiiy insoniy)",
                            style = AppTypography.CardTitle,
                            fontWeight = FontWeight.Bold,
                        )
                    }

                    Slider(
                        value = settings.speechSpeed,
                        onValueChange = onSpeedChanged,
                        valueRange = 0.7f..1.4f,
                        modifier = Modifier.fillMaxWidth(),
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                    ) {
                        Text(
                            text = stringResource(id = R.string.label_speech_pitch),
                            style = AppTypography.CardTitle,
                        )
                        Text(
                            text = "${"%.2f".format(settings.speechPitch)}x",
                            style = AppTypography.CardTitle,
                            fontWeight = FontWeight.Bold,
                        )
                    }

                    Slider(
                        value = settings.speechPitch,
                        onValueChange = onPitchChanged,
                        valueRange = 0.6f..1.5f,
                        modifier = Modifier.fillMaxWidth(),
                    )
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // 4. Audio Cache Settings
            TalkMeCard(
                containerColor = MaterialTheme.colorScheme.surface,
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = stringResource(id = R.string.section_audio_cache),
                            style = AppTypography.CardTitle,
                        )
                        Text(
                            text = stringResource(id = R.string.desc_audio_cache),
                            style = AppTypography.CardSubtitle,
                        )
                    }
                    Switch(
                        checked = settings.audioCacheEnabled,
                        onCheckedChange = onAudioCacheChanged,
                    )
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // 5. Built-in Long Text Testing & Sample Texts
            Text(
                text = stringResource(id = R.string.section_speech_test),
                style = AppTypography.SectionTitle,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            TalkMeCard(
                containerColor = MaterialTheme.colorScheme.primaryContainer,
                borderColor = MaterialTheme.colorScheme.primary,
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(
                            text = SampleStory.TITLE,
                            style = AppTypography.CardTitle.copy(color = MaterialTheme.colorScheme.primary),
                        )

                        TalkMeBadge(
                            text = "${SampleStory.wordCount} words",
                            containerColor = MaterialTheme.colorScheme.surface,
                            textColor = MaterialTheme.colorScheme.primary,
                        )
                    }

                    Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                    Text(
                        text = "Category: ${SampleStory.CATEGORY} · Tanlangan Personaj: ${characterProfilesList[selectedCharacterIndex]}",
                        style = AppTypography.CardSubtitle,
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingMedium))

                    // Story Text Preview Box
                    OutlinedTextField(
                        value = SampleStory.FULL_TEXT,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Preloaded Sample Story") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(180.dp),
                        textStyle = AppTypography.CardSubtitle,
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingMedium))

                    // Explicit Play / Stop Speech Test Button
                    TalkMeButton(
                        text = if (isTestPlaying) "Nutqni To‘xtatish" else stringResource(id = R.string.btn_run_quick_test),
                        trailingIconRes = AppIcons.Volume,
                        onClick = {
                            if (isTestPlaying) {
                                isTestPlaying = false
                                testReportText = "Nutq to‘xtatildi."
                            } else {
                                isTestPlaying = true
                                val startTime = System.currentTimeMillis()
                                onRunQuickTestClick(SampleStory.FULL_TEXT)
                                val duration = System.currentTimeMillis() - startTime
                                testReportText = "Test Report: Personaj: ${characterProfilesList[selectedCharacterIndex]} | Words: ${SampleStory.wordCount} | Latency: ${duration}ms | Status: PLAYING"
                            }
                        },
                    )

                    if (testReportText.isNotEmpty()) {
                        Spacer(modifier = Modifier.height(dimensions.paddingMedium))

                        Text(
                            text = testReportText,
                            style = AppTypography.CardSubtitle.copy(
                                color = SuccessGreen,
                                fontWeight = FontWeight.Bold,
                            ),
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // Reset Defaults Button
            TalkMeButton(
                text = stringResource(id = R.string.btn_reset_defaults),
                onClick = onResetDefaultsClick,
                containerColor = MaterialTheme.colorScheme.surfaceVariant,
                contentColor = MaterialTheme.colorScheme.primary,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))
        }
    }
}

@Preview(showBackground = true)
@Composable
fun VoiceSettingsScreenPreview() {
    TalkMeTheme {
        VoiceSettingsScreen(
            settings = VoiceSettings(),
            onBackClick = {},
            onLocalFirstChanged = {},
            onCharacterProfileChanged = {},
            onSpeedChanged = {},
            onPitchChanged = {},
            onAudioCacheChanged = {},
            onRunQuickTestClick = {},
            onResetDefaultsClick = {},
        )
    }
}
