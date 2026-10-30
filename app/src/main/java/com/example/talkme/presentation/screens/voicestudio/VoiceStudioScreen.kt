package com.example.talkme.presentation.screens.voicestudio

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Slider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.talkme.R
import com.example.talkme.presentation.components.TalkMeBadge
import com.example.talkme.presentation.components.TalkMeButton
import com.example.talkme.presentation.components.TalkMeCard
import com.example.talkme.presentation.components.TalkMeHeader
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.TalkMeTheme

/**
 * Voice Studio Compose Screen for interactive English, Uzbek, and Russian speech generation.
 */
@Composable
fun VoiceStudioScreen(
    onBackClick: () -> Unit,
    onGenerateClick: (String, Float, Float) -> Unit,
    modifier: Modifier = Modifier,
) {
    val dimensions = LocalDimensions.current

    var inputText by remember { mutableStateOf("Welcome to TalkMe Voice AI Engine. Enjoy natural speech generation!") }
    var speed by remember { mutableFloatStateOf(1.0f) }
    var pitch by remember { mutableFloatStateOf(1.0f) }
    var selectedLanguage by remember { mutableStateOf("English (US)") }
    var selectedVoice by remember { mutableStateOf("Sherpa-ONNX Local Model") }

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
                title = "Voice Studio",
                subtitle = "Interactive Voice AI Studio & Speech Controls",
                onBackClick = onBackClick,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // Large Text Input Box
            OutlinedTextField(
                value = inputText,
                onValueChange = { inputText = it },
                label = { Text("Speech Text Input") },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(140.dp),
                textStyle = AppTypography.GreetingSubtitle,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // Voice & Model Selection Card
            TalkMeCard(
                containerColor = MaterialTheme.colorScheme.surface,
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(
                            text = "Engine & Voice Profile",
                            style = AppTypography.CardTitle,
                        )

                        TalkMeBadge(
                            text = selectedLanguage,
                            containerColor = MaterialTheme.colorScheme.primaryContainer,
                            textColor = MaterialTheme.colorScheme.primary,
                        )
                    }

                    Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                    Text(
                        text = "Selected Model: $selectedVoice",
                        style = AppTypography.CardSubtitle,
                    )
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // Speech Parameter Sliders (Speed & Pitch)
            TalkMeCard(
                containerColor = MaterialTheme.colorScheme.surface,
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                    ) {
                        Text("Speech Speed", style = AppTypography.CardTitle)
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

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))

            // Generate Action Button
            TalkMeButton(
                text = "Generate Speech",
                trailingIconRes = AppIcons.Volume,
                onClick = { onGenerateClick(inputText, speed, pitch) },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))
        }
    }
}

@Preview(showBackground = true)
@Composable
fun VoiceStudioScreenPreview() {
    TalkMeTheme {
        VoiceStudioScreen(onBackClick = {}, onGenerateClick = { _, _, _ -> })
    }
}
