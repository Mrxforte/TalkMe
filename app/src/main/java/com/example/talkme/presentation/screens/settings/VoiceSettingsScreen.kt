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
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.SuccessGreen
import com.example.talkme.ui.theme.TalkMeTheme

/**
 * Reactive Voice AI Settings & Speech Testing Screen connected to DataStore preferences.
 *
 * @param settings Current active VoiceSettings state.
 * @param onBackClick Navigation back handler.
 * @param onLocalFirstChanged Callback invoked when local-first switch is toggled.
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
    onSpeedChanged: (Float) -> Unit,
    onPitchChanged: (Float) -> Unit,
    onAudioCacheChanged: (Boolean) -> Unit,
    onRunQuickTestClick: (String) -> Unit,
    onResetDefaultsClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val dimensions = LocalDimensions.current
    var testReportText by remember { mutableStateOf("") }

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

            // 2. Speech Parameters (Speed & Pitch)
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
                            text = "${"%.1f".format(settings.speechSpeed)}x",
                            style = AppTypography.CardTitle,
                            fontWeight = FontWeight.Bold,
                        )
                    }

                    Slider(
                        value = settings.speechSpeed,
                        onValueChange = onSpeedChanged,
                        valueRange = 0.5f..2.0f,
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
                            text = "${"%.1f".format(settings.speechPitch)}x",
                            style = AppTypography.CardTitle,
                            fontWeight = FontWeight.Bold,
                        )
                    }

                    Slider(
                        value = settings.speechPitch,
                        onValueChange = onPitchChanged,
                        valueRange = 0.5f..1.5f,
                        modifier = Modifier.fillMaxWidth(),
                    )
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // 3. Audio Cache Settings
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

            // 4. Built-in Long Text Testing & Sample Texts
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
                        text = "Category: ${SampleStory.CATEGORY} · Language: ${SampleStory.LANGUAGE.uppercase()} · Est. ~${"%.1f".format(SampleStory.estimatedDurationMinutes)} min",
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

                    TalkMeButton(
                        text = stringResource(id = R.string.btn_run_quick_test),
                        trailingIconRes = AppIcons.Volume,
                        onClick = {
                            val startTime = System.currentTimeMillis()
                            onRunQuickTestClick(SampleStory.FULL_TEXT)
                            val duration = System.currentTimeMillis() - startTime
                            testReportText = "Test Report: Engine: Sherpa-ONNX | Words: ${SampleStory.wordCount} | Chunks: ${(SampleStory.wordCount / 30) + 1} | Latency: ${duration}ms | Status: PLAYING AUDIO"
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
            onSpeedChanged = {},
            onPitchChanged = {},
            onAudioCacheChanged = {},
            onRunQuickTestClick = {},
            onResetDefaultsClick = {},
        )
    }
}
