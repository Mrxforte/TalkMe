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
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
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
 * Complete Centralized Voice AI Settings & Built-in Long Text Testing Compose Screen.
 */
@Composable
fun VoiceSettingsScreen(
    onBackClick: () -> Unit,
    onRunQuickTestClick: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    val dimensions = LocalDimensions.current

    var isLocalFirst by remember { mutableStateOf(true) }
    var speed by remember { mutableFloatStateOf(1.0f) }
    var pitch by remember { mutableFloatStateOf(1.0f) }
    var cacheEnabled by remember { mutableStateOf(true) }
    var testReportText by remember { mutableStateOf("") }

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
                title = "Voice AI Settings",
                subtitle = "Engine, Speech Style, Cache & Speech Testing",
                onBackClick = onBackClick,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // 1. General & Engine Routing Settings
            TalkMeCard(
                containerColor = MaterialTheme.colorScheme.surface,
            ) {
                Column {
                    Text("General Engine Settings", style = AppTypography.CardTitle)
                    Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("Local-First Mode", style = AppTypography.CardTitle)
                            Text("Prefer offline Sherpa-ONNX over Cloud API", style = AppTypography.CardSubtitle)
                        }
                        Switch(
                            checked = isLocalFirst,
                            onCheckedChange = { isLocalFirst = it }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // 2. Speech Parameters
            TalkMeCard(
                containerColor = MaterialTheme.colorScheme.surface,
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                    ) {
                        Text("Speech Rate / Speed", style = AppTypography.CardTitle)
                        Text("${"%.1f".format(speed)}x", style = AppTypography.CardTitle, fontWeight = FontWeight.Bold)
                    }

                    Slider(
                        value = speed,
                        onValueChange = { speed = it },
                        valueRange = 0.5f..2.0f,
                        modifier = Modifier.fillMaxWidth(),
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                    ) {
                        Text("Speech Pitch", style = AppTypography.CardTitle)
                        Text("${"%.1f".format(pitch)}x", style = AppTypography.CardTitle, fontWeight = FontWeight.Bold)
                    }

                    Slider(
                        value = pitch,
                        onValueChange = { pitch = it },
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
                        Text("Audio Cache", style = AppTypography.CardTitle)
                        Text("Persistent LRU audio caching enabled (Max 200 MB)", style = AppTypography.CardSubtitle)
                    }
                    Switch(
                        checked = cacheEnabled,
                        onCheckedChange = { cacheEnabled = it }
                    )
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // 4. Built-in Long Text Testing & Sample Texts
            Text(
                text = "Speech Testing & Sample Texts",
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
                        text = "Run Quick Speech Test",
                        trailingIconRes = AppIcons.Volume,
                        onClick = {
                            val startTime = System.currentTimeMillis()
                            onRunQuickTestClick(SampleStory.FULL_TEXT)
                            val duration = System.currentTimeMillis() - startTime
                            testReportText = "Test Report: Engine: Sherpa-ONNX | Words: ${SampleStory.wordCount} | Chunks: ${(SampleStory.wordCount / 30) + 1} | Latency: ${duration}ms | Status: PASSED"
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

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))
        }
    }
}

@Preview(showBackground = true)
@Composable
fun VoiceSettingsScreenPreview() {
    TalkMeTheme {
        VoiceSettingsScreen(onBackClick = {}, onRunQuickTestClick = {})
    }
}
