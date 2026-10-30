package com.talkme.presentation.screens.voicestudio

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import com.talkme.R
import com.talkme.domain.voice.engine.EngineSelectionMode
import com.talkme.domain.voice.engine.VoiceCharacterProfile
import com.talkme.domain.voice.testing.SampleStory
import com.talkme.presentation.components.TalkMeBadge
import com.talkme.presentation.components.TalkMeButton
import com.talkme.presentation.components.TalkMeCard
import com.talkme.presentation.components.TalkMeHeader
import com.talkme.ui.theme.*

/**
 * Interactive Voice AI Studio Screen (`VoiceStudioScreen.kt`) supporting:
 * - Global TTS Mode Switcher (Gemini 3.8 AI TTS `CLOUD_FIRST` vs Free 6-Character TTS `LOCAL_FIRST` vs `AUTO`)
 * - All 6 Character Voices (`ADULT_MALE`, `ADULT_FEMALE`, `YOUNG_BOY`, `YOUNG_GIRL`, `TEENAGE_BOY`, `TEENAGE_GIRL`)
 * - SampleStory (Sample 01) testing per Section 1.1 & Section 2 Item 8 of PROJECT_RULES.md.
 */
@Composable
fun VoiceStudioScreen(
    selectedMode: EngineSelectionMode = EngineSelectionMode.CLOUD_FIRST,
    selectedProfile: VoiceCharacterProfile = VoiceCharacterProfile.ADULT_MALE,
    onSelectMode: (EngineSelectionMode) -> Unit = {},
    onSelectProfile: (VoiceCharacterProfile) -> Unit = {},
    onAuditionVoice: (VoiceCharacterProfile, String) -> Unit = { _, _ -> },
    onBackClick: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current
    var activeMode by remember(selectedMode) { mutableStateOf(selectedMode) }
    var activeProfile by remember(selectedProfile) { mutableStateOf(selectedProfile) }
    val isFreeTierActive = activeMode == EngineSelectionMode.LOCAL_FIRST ||
        activeMode == EngineSelectionMode.OFFLINE_ONLY

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        TalkMeHeader(
            title = stringResource(R.string.voice_settings_title),
            subtitle = stringResource(R.string.voice_settings_subtitle),
            onBackClick = onBackClick
        )

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(
                horizontal = dims.screenPaddingHorizontal,
                vertical = dims.spaceLarge
            ),
            verticalArrangement = Arrangement.spacedBy(dims.spaceLarge)
        ) {
            // Global TTS Mode Switcher Card (Gemini 3.8 AI TTS vs Free 6-Character TTS)
            item {
                TalkMeCard {
                    Text(
                        text = stringResource(R.string.voice_primary_tier_label),
                        style = AppTypography.TitleMedium,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.height(dims.spaceSmall))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(dims.spaceSmall)
                    ) {
                        Column(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(dims.cornerMedium))
                                .background(
                                    if (!isFreeTierActive) PrimaryPurpleLight
                                    else MaterialTheme.colorScheme.surface
                                )
                                .border(
                                    width = if (!isFreeTierActive) dims.strokeMedium else dims.strokeThin,
                                    color = if (!isFreeTierActive) PrimaryPurple else MaterialTheme.colorScheme.outline,
                                    shape = RoundedCornerShape(dims.cornerMedium)
                                )
                                .clickable {
                                    activeMode = EngineSelectionMode.CLOUD_FIRST
                                    onSelectMode(EngineSelectionMode.CLOUD_FIRST)
                                }
                                .padding(dims.spaceMedium),
                            verticalArrangement = Arrangement.spacedBy(dims.spaceExtraSmall)
                        ) {
                            Text(
                                text = stringResource(R.string.voice_tier_gemini_title),
                                style = AppTypography.TitleMedium,
                                color = if (!isFreeTierActive) PrimaryPurple else MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                text = stringResource(R.string.voice_tier_gemini_desc),
                                style = AppTypography.BodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }

                        Column(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(dims.cornerMedium))
                                .background(
                                    if (isFreeTierActive) SuccessGreenBg
                                    else MaterialTheme.colorScheme.surface
                                )
                                .border(
                                    width = if (isFreeTierActive) dims.strokeMedium else dims.strokeThin,
                                    color = if (isFreeTierActive) SuccessGreen else MaterialTheme.colorScheme.outline,
                                    shape = RoundedCornerShape(dims.cornerMedium)
                                )
                                .clickable {
                                    activeMode = EngineSelectionMode.LOCAL_FIRST
                                    onSelectMode(EngineSelectionMode.LOCAL_FIRST)
                                }
                                .padding(dims.spaceMedium),
                            verticalArrangement = Arrangement.spacedBy(dims.spaceExtraSmall)
                        ) {
                            Text(
                                text = stringResource(R.string.voice_tier_free_title),
                                style = AppTypography.TitleMedium,
                                color = if (isFreeTierActive) SuccessGreen else MaterialTheme.colorScheme.onSurface
                            )
                            Text(
                                text = stringResource(R.string.voice_tier_free_desc),
                                style = AppTypography.BodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }

            item {
                TalkMeCard {
                    Text(
                        text = SampleStory.TITLE,
                        style = AppTypography.TitleLarge,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.height(dims.spaceSmall))
                    Text(
                        text = SampleStory.CONTENT,
                        style = AppTypography.BodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(dims.spaceMedium))
                    TalkMeButton(
                        text = stringResource(R.string.voice_action_test_story),
                        onClick = { onAuditionVoice(activeProfile, SampleStory.CONTENT) }
                    )
                }
            }

            items(VoiceCharacterProfile.entries.toList(), key = { it.profileId }) { profile ->
                val isSelected = activeProfile == profile
                val cardShape = RoundedCornerShape(dims.cornerMedium)

                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(cardShape)
                        .background(
                            if (isSelected) BrandBlue500.copy(alpha = 0.08f)
                            else MaterialTheme.colorScheme.surface
                        )
                        .border(
                            width = if (isSelected) dims.strokeMedium else dims.strokeThin,
                            color = if (isSelected) BrandBlue500 else MaterialTheme.colorScheme.outline,
                            shape = cardShape
                        )
                        .clickable {
                            activeProfile = profile
                            onSelectProfile(profile)
                        }
                        .padding(dims.cardPadding),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(
                        modifier = Modifier.weight(1f),
                        verticalArrangement = Arrangement.spacedBy(dims.spaceExtraSmall)
                    ) {
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(dims.spaceSmall),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = profile.displayNameUz,
                                style = AppTypography.TitleMedium,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            TalkMeBadge(
                                text = profile.badgeLabelUz,
                                backgroundColor = BrandBlue500.copy(alpha = 0.14f),
                                contentColor = BrandBlue600
                            )
                        }
                        Text(
                            text = if (isFreeTierActive) {
                                "${profile.freeTtsDescriptionUz} (Rate: ${profile.baseRate}x | Pitch: ${profile.basePitch}x)"
                            } else {
                                "Gemini 3.8 Voice: ${profile.geminiVoiceName}"
                            },
                            style = AppTypography.BodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    Row(
                        modifier = Modifier
                            .clip(RoundedCornerShape(dims.cornerSmall))
                            .background(BrandBlue500.copy(alpha = 0.12f))
                            .clickable {
                                activeProfile = profile
                                onSelectProfile(profile)
                                onAuditionVoice(profile, SampleStory.CONTENT)
                            }
                            .padding(
                                horizontal = dims.spaceMedium,
                                vertical = dims.spaceSmall
                            ),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(dims.spaceExtraSmall)
                    ) {
                        Icon(
                            imageVector = AppIcons.VolumeUp,
                            contentDescription = stringResource(R.string.cd_play_audio),
                            tint = BrandBlue600,
                            modifier = Modifier.size(dims.iconSmall)
                        )
                        Text(
                            text = stringResource(R.string.voice_action_audition),
                            style = AppTypography.LabelMedium,
                            color = BrandBlue600
                        )
                    }
                }
            }
        }
    }
}
