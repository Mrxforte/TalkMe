package com.talkme.presentation.screens.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import com.talkme.R
import com.talkme.domain.voice.engine.EngineSelectionMode
import com.talkme.domain.voice.engine.VoiceCharacterProfile
import com.talkme.presentation.components.TalkMeBadge
import com.talkme.presentation.components.TalkMeButton
import com.talkme.presentation.components.TalkMeCard
import com.talkme.presentation.components.TalkMeHeader
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.LocalDimensions
import com.talkme.ui.theme.PrimaryPurple
import com.talkme.ui.theme.PrimaryPurpleLight
import com.talkme.ui.theme.SuccessGreen
import com.talkme.ui.theme.SuccessGreenBg

/**
 * Built-in test story constants for Voice AI & TTS engine benchmarking.
 */
object SampleStory {
    const val TITLE = "Sample 01 — The Last Library in the City"
    const val TEXT =
        "At the edge of the old harbor stood the last paper library in the city. " +
            "Every evening, Maya opened the tall oak doors and listened to the rain tapping " +
            "against the glass roof. Inside, thousands of stories waited patiently for someone " +
            "curious enough to turn the first page."
}

/**
 * Voice AI & TTS Engine Settings screen in Jetpack Compose.
 * Allows switching between:
 * 1) Free / Standard Character TTS (LOCAL_FIRST / OFFLINE_ONLY) with the 6 character voice profiles
 *    for regular users (ADULT_MALE, ADULT_FEMALE, YOUNG_BOY, YOUNG_GIRL, TEENAGE_BOY, TEENAGE_GIRL).
 * 2) Gemini 3.8 Cloud AI TTS (CLOUD_FIRST / AUTO).
 * Strictly obeys PROJECT_RULES.md (Zero Hardcoding, AppIcons, LocalDimensions, AppTypography).
 */
@Composable
fun VoiceSettingsScreen(
    initialMode: EngineSelectionMode = EngineSelectionMode.CLOUD_FIRST,
    initialCharacter: VoiceCharacterProfile = VoiceCharacterProfile.ADULT_MALE,
    onModeChanged: (EngineSelectionMode) -> Unit = {},
    onCharacterSelected: (VoiceCharacterProfile) -> Unit = {},
    onAuditionCharacter: (VoiceCharacterProfile, EngineSelectionMode) -> Unit = { _, _ -> },
    onPlaySampleStory: (String, VoiceCharacterProfile, EngineSelectionMode) -> Unit = { _, _, _ -> },
    onBackClick: () -> Unit = {}
) {
    val dimens = LocalDimensions.current
    var selectedMode by remember(initialMode) { mutableStateOf(initialMode) }
    var selectedCharacter by remember(initialCharacter) { mutableStateOf(initialCharacter) }

    val isFreeTtsActive =
        selectedMode == EngineSelectionMode.LOCAL_FIRST ||
            selectedMode == EngineSelectionMode.OFFLINE_ONLY

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(rememberScrollState())
            .padding(horizontal = dimens.screenHorizontalPadding, vertical = dimens.spacingLg),
        verticalArrangement = Arrangement.spacedBy(dimens.spacingLg)
    ) {
        TalkMeHeader(
            title = stringResource(id = R.string.voice_settings_title),
            subtitle = stringResource(id = R.string.voice_settings_subtitle),
            onBackClick = onBackClick
        )

        // Primary Tier Switcher: Mening Free TTS (6 Voices for Regular Users) vs Gemini 3.8 AI TTS
        TalkMeCard {
            Text(
                text = stringResource(id = R.string.voice_primary_tier_label),
                style = AppTypography.captionBold,
                color = PrimaryPurple
            )
            Spacer(modifier = Modifier.height(dimens.spacingSm))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(dimens.spacingSm)
            ) {
                // Option 1: Free Character TTS (LOCAL_FIRST)
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(dimens.cornerMd))
                        .background(
                            if (isFreeTtsActive) SuccessGreenBg else MaterialTheme.colorScheme.surface
                        )
                        .border(
                            width = dimens.strokeThin,
                            color = if (isFreeTtsActive) SuccessGreen else MaterialTheme.colorScheme.outline,
                            shape = RoundedCornerShape(dimens.cornerMd)
                        )
                        .clickable {
                            selectedMode = EngineSelectionMode.LOCAL_FIRST
                            onModeChanged(EngineSelectionMode.LOCAL_FIRST)
                        }
                        .padding(dimens.spacingMd),
                    verticalArrangement = Arrangement.spacedBy(dimens.spacingXs)
                ) {
                    Text(
                        text = stringResource(id = R.string.voice_tier_free_title),
                        style = AppTypography.bodyBold,
                        color = if (isFreeTtsActive) SuccessGreen else MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = stringResource(id = R.string.voice_tier_free_desc),
                        style = AppTypography.caption,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                // Option 2: Gemini 3.8 Cloud AI TTS (CLOUD_FIRST)
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(dimens.cornerMd))
                        .background(
                            if (!isFreeTtsActive) PrimaryPurpleLight else MaterialTheme.colorScheme.surface
                        )
                        .border(
                            width = dimens.strokeThin,
                            color = if (!isFreeTtsActive) PrimaryPurple else MaterialTheme.colorScheme.outline,
                            shape = RoundedCornerShape(dimens.cornerMd)
                        )
                        .clickable {
                            selectedMode = EngineSelectionMode.CLOUD_FIRST
                            onModeChanged(EngineSelectionMode.CLOUD_FIRST)
                        }
                        .padding(dimens.spacingMd),
                    verticalArrangement = Arrangement.spacedBy(dimens.spacingXs)
                ) {
                    Text(
                        text = stringResource(id = R.string.voice_tier_gemini_title),
                        style = AppTypography.bodyBold,
                        color = if (!isFreeTtsActive) PrimaryPurple else MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = stringResource(id = R.string.voice_tier_gemini_desc),
                        style = AppTypography.caption,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }

        // Section 1: 6 Character Voices Catalog (Katta Erkak, Katta Ayol, Yosh O'g'il, Yosh Qiz, O'smir Yigit, O'smir Qiz)
        TalkMeCard {
            Text(
                text = stringResource(id = R.string.voice_section_characters_title),
                style = AppTypography.sectionHeader,
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = stringResource(id = R.string.voice_section_characters_subtitle),
                style = AppTypography.caption,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(dimens.spacingSm))

            Column(verticalArrangement = Arrangement.spacedBy(dimens.spacingSm)) {
                VoiceCharacterProfile.entries.forEach { profile ->
                    val isSelected = selectedCharacter == profile
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(dimens.cornerMd))
                            .background(
                                if (isSelected) {
                                    if (isFreeTtsActive) SuccessGreenBg else PrimaryPurpleLight
                                } else {
                                    MaterialTheme.colorScheme.background
                                }
                            )
                            .border(
                                width = dimens.strokeThin,
                                color = if (isSelected) {
                                    if (isFreeTtsActive) SuccessGreen else PrimaryPurple
                                } else {
                                    MaterialTheme.colorScheme.outline
                                },
                                shape = RoundedCornerShape(dimens.cornerMd)
                            )
                            .clickable {
                                selectedCharacter = profile
                                onCharacterSelected(profile)
                            }
                            .padding(dimens.spacingMd),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(
                            modifier = Modifier.weight(1f),
                            verticalArrangement = Arrangement.spacedBy(dimens.spacingXs)
                        ) {
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(dimens.spacingSm),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = profile.displayNameUz,
                                    style = AppTypography.bodyBold,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                                TalkMeBadge(
                                    text = if (isFreeTtsActive) {
                                        "Pitch ${profile.basePitch}x · Speed ${profile.baseRate}x"
                                    } else {
                                        "Gemini: ${profile.geminiVoiceName}"
                                    },
                                    containerColor = if (isFreeTtsActive) SuccessGreenBg else PrimaryPurpleLight,
                                    textColor = if (isFreeTtsActive) SuccessGreen else PrimaryPurple
                                )
                            }
                            Text(
                                text = profile.freeDescriptionUz,
                                style = AppTypography.caption,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }

                        IconButton(
                            onClick = {
                                selectedCharacter = profile
                                onCharacterSelected(profile)
                                onAuditionCharacter(profile, selectedMode)
                            }
                        ) {
                            Icon(
                                imageVector = AppIcons.VolumeUp,
                                contentDescription = stringResource(id = R.string.cd_play_audio),
                                tint = if (isFreeTtsActive) SuccessGreen else PrimaryPurple,
                                modifier = Modifier.size(dimens.iconSizeLg)
                            )
                        }
                    }
                }
            }
        }

        // Section 2: 4 EngineRegistry Routing Modes
        TalkMeCard {
            Text(
                text = stringResource(id = R.string.voice_section_routing_title),
                style = AppTypography.sectionHeader,
                color = MaterialTheme.colorScheme.onSurface
            )
            Spacer(modifier = Modifier.height(dimens.spacingSm))

            val modeEntries = listOf(
                EngineSelectionMode.LOCAL_FIRST to R.string.voice_mode_local_first,
                EngineSelectionMode.OFFLINE_ONLY to R.string.voice_mode_offline_only,
                EngineSelectionMode.CLOUD_FIRST to R.string.voice_mode_cloud_first,
                EngineSelectionMode.AUTO to R.string.voice_mode_auto
            )

            Column(verticalArrangement = Arrangement.spacedBy(dimens.spacingSm)) {
                modeEntries.forEach { (mode, labelRes) ->
                    val isSelected = selectedMode == mode
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(dimens.cornerMd))
                            .background(
                                if (isSelected) PrimaryPurpleLight else MaterialTheme.colorScheme.background
                            )
                            .border(
                                width = dimens.strokeThin,
                                color = if (isSelected) PrimaryPurple else MaterialTheme.colorScheme.outline,
                                shape = RoundedCornerShape(dimens.cornerMd)
                            )
                            .clickable {
                                selectedMode = mode
                                onModeChanged(mode)
                            }
                            .padding(dimens.spacingMd),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = stringResource(id = labelRes),
                            style = AppTypography.bodyBold,
                            color = if (isSelected) PrimaryPurple else MaterialTheme.colorScheme.onSurface
                        )
                        if (isSelected) {
                            Icon(
                                imageVector = AppIcons.Check,
                                contentDescription = stringResource(id = R.string.cd_completed_check),
                                tint = PrimaryPurple,
                                modifier = Modifier.size(dimens.iconSizeMd)
                            )
                        }
                    }
                }
            }
        }

        // Section 3: Sample 01 Benchmark Story Card
        TalkMeCard {
            Text(
                text = SampleStory.TITLE,
                style = AppTypography.sectionHeader,
                color = PrimaryPurple
            )
            Spacer(modifier = Modifier.height(dimens.spacingSm))
            Text(
                text = SampleStory.TEXT,
                style = AppTypography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurface
            )
            Spacer(modifier = Modifier.height(dimens.spacingMd))
            TalkMeButton(
                text = stringResource(id = R.string.voice_action_test_story),
                onClick = {
                    onPlaySampleStory(SampleStory.TEXT, selectedCharacter, selectedMode)
                }
            )
        }
    }
}
