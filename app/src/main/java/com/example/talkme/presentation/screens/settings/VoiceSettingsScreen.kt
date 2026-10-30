package com.example.talkme.presentation.screens.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Icon
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.talkme.R
import com.example.talkme.domain.settings.VoiceSettings
import com.example.talkme.domain.voice.catalog.CharacterVoiceCatalog
import com.example.talkme.domain.voice.model.CharacterProfile
import com.example.talkme.domain.voice.model.EngineSelectionMode
import com.example.talkme.domain.voice.model.VoiceFamily
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
 * World-Class Reactive Voice AI Settings & Speech Testing Screen with intuitive UX,
 * character search, 200 voice profiles catalog, individual voice audition buttons, and DataStore preferences.
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

    var searchQuery by remember { mutableStateOf("") }
    val families = VoiceFamily.entries
    var selectedFamilyIndex by remember { mutableIntStateOf(0) } // 0: All, or specific family
    var showAllFamilies by remember { mutableStateOf(true) }

    val currentProfile = CharacterVoiceCatalog.allProfiles.find {
        it.id == settings.selectedCharacterProfile || it.nameUz == settings.selectedCharacterProfile || it.nameEn == settings.selectedCharacterProfile
    } ?: CharacterVoiceCatalog.allProfiles.first()

    // Filter profiles based on search query and family selection
    val filteredProfiles = CharacterVoiceCatalog.allProfiles.filter { profile ->
        val matchesSearch = searchQuery.isBlank() ||
                profile.nameUz.contains(searchQuery, ignoreCase = true) ||
                profile.nameEn.contains(searchQuery, ignoreCase = true) ||
                profile.descriptionUz.contains(searchQuery, ignoreCase = true)

        val matchesFamily = showAllFamilies || profile.family == families[selectedFamilyIndex]

        matchesSearch && matchesFamily
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

            // 2. FEATURED ACTIVE VOICE CARD (Aktiv Personaj Profil)
            TalkMeCard(
                containerColor = MaterialTheme.colorScheme.primaryContainer,
                borderColor = MaterialTheme.colorScheme.primary,
                cornerRadius = dimensions.cornerExtraLarge,
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = currentProfile.iconEmoji,
                                style = AppTypography.GreetingTitle,
                            )
                            Spacer(modifier = Modifier.width(dimensions.paddingSmall))
                            Column {
                                Text(
                                    text = currentProfile.nameUz,
                                    style = AppTypography.CardTitle.copy(
                                        color = MaterialTheme.colorScheme.primary,
                                        fontWeight = FontWeight.Bold,
                                    ),
                                )
                                Text(
                                    text = currentProfile.nameEn,
                                    style = AppTypography.CardSubtitle,
                                )
                            }
                        }

                        TalkMeBadge(
                            text = currentProfile.family.titleUz,
                            containerColor = MaterialTheme.colorScheme.surface,
                            textColor = MaterialTheme.colorScheme.primary,
                        )
                    }

                    Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                    Text(
                        text = currentProfile.descriptionUz,
                        style = AppTypography.CardSubtitle.copy(
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        ),
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingMedium))

                    // Instant Audition Button for Active Voice
                    TalkMeButton(
                        text = "Aktiv Ovozni Sinab Ko'rish",
                        trailingIconRes = AppIcons.Volume,
                        onClick = {
                            onRunQuickTestClick("Hello! I am ${currentProfile.nameEn}, your AI voice character.")
                        },
                    )
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // 3. 200 CHARACTER VOICES CATALOG & SEARCH UX
            Text(
                text = "Personaj Ovozlar Katalogi (200 Ovoz)",
                style = AppTypography.SectionTitle,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // Search Input Field
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                label = { Text("Personaj nomi yoki xarakterini izlash...") },
                trailingIcon = {
                    Icon(
                        painter = painterResource(id = AppIcons.Search),
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                    )
                },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                textStyle = AppTypography.CardTitle,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // Family Filter Category Horizontal Tabs
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(dimensions.paddingSmall),
            ) {
                item {
                    val isAllSelected = showAllFamilies
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(dimensions.cornerSmall))
                            .background(if (isAllSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surface)
                            .clickable { showAllFamilies = true }
                            .padding(horizontal = dimensions.paddingMedium, vertical = dimensions.paddingSmall),
                    ) {
                        Text(
                            text = "🌐 Barchasi (200)",
                            style = AppTypography.CardSubtitle.copy(
                                color = if (isAllSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant,
                                fontWeight = if (isAllSelected) FontWeight.Bold else FontWeight.Normal,
                            ),
                        )
                    }
                }

                items(families.size) { index ->
                    val family = families[index]
                    val isSelected = !showAllFamilies && selectedFamilyIndex == index

                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(dimensions.cornerSmall))
                            .background(if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surface)
                            .clickable {
                                selectedFamilyIndex = index
                                showAllFamilies = false
                            }
                            .padding(horizontal = dimensions.paddingMedium, vertical = dimensions.paddingSmall),
                    ) {
                        Text(
                            text = "${family.iconEmoji} ${family.titleUz}",
                            style = AppTypography.CardSubtitle.copy(
                                color = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                            ),
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // Filtered Character Cards Grid Container
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
                            text = if (showAllFamilies) "Barcha Personajlar" else families[selectedFamilyIndex].titleUz,
                            style = AppTypography.CardTitle,
                        )

                        TalkMeBadge(
                            text = "${filteredProfiles.size} ta mos ovoz",
                            containerColor = MaterialTheme.colorScheme.primaryContainer,
                            textColor = MaterialTheme.colorScheme.primary,
                        )
                    }

                    Spacer(modifier = Modifier.height(dimensions.paddingMedium))

                    // Render First 12 Matching Profiles with Audition Buttons
                    val displayedProfiles = filteredProfiles.take(12)
                    displayedProfiles.forEach { profile ->
                        val isSelected = profile.id == currentProfile.id
                        CharacterItemCard(
                            profile = profile,
                            isSelected = isSelected,
                            onSelect = { onCharacterProfileChanged(profile.id) },
                            onPreviewAudio = {
                                onCharacterProfileChanged(profile.id)
                                onRunQuickTestClick("Hello! This is ${profile.nameEn}.")
                            },
                        )
                        Spacer(modifier = Modifier.height(dimensions.paddingSmall))
                    }
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // 4. Speech Parameters (Speed & Pitch Sliders)
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

            // 5. Audio Cache Settings
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

            // 6. Built-in Long Text Testing & Sample Texts
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
                        text = "Category: ${SampleStory.CATEGORY} · Personaj: ${currentProfile.nameUz} · Est. ~${"%.1f".format(SampleStory.estimatedDurationMinutes)} min",
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
                                testReportText = "Test Report: Personaj: ${currentProfile.nameUz} | Words: ${SampleStory.wordCount} | Latency: ${duration}ms | Status: PLAYING"
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

/**
 * Reusable Character Profile Card Item with Instant Audition Play Button.
 */
@Composable
fun CharacterItemCard(
    profile: CharacterProfile,
    isSelected: Boolean,
    onSelect: () -> Unit,
    onPreviewAudio: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val dimensions = LocalDimensions.current

    val containerColor = if (isSelected) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surface
    val borderColor = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f)

    Row(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(dimensions.cornerSmall))
            .background(containerColor)
            .border(dimensions.borderThin, borderColor, RoundedCornerShape(dimensions.cornerSmall))
            .clickable(onClick = onSelect)
            .padding(dimensions.paddingMedium),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Row(
            modifier = Modifier.weight(1f),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = profile.iconEmoji,
                style = AppTypography.SectionTitle,
            )

            Spacer(modifier = Modifier.width(dimensions.paddingSmall))

            Column {
                Text(
                    text = profile.nameUz,
                    style = AppTypography.CardTitle.copy(
                        color = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onBackground,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                    ),
                )

                Text(
                    text = "${profile.nameEn} · ${"%.2f".format(profile.baseRate)}x rate",
                    style = AppTypography.CardSubtitle.copy(
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    ),
                )
            }
        }

        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(CircleShape)
                .background(if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant)
                .clickable(onClick = onPreviewAudio),
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                painter = painterResource(id = AppIcons.Volume),
                contentDescription = null,
                tint = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(dimensions.iconSmall),
            )
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
