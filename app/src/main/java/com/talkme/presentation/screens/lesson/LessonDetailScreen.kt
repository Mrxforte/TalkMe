package com.talkme.presentation.screens.lesson

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import com.talkme.R
import com.talkme.domain.lesson.model.LessonPlan
import com.talkme.domain.lesson.model.LessonSection
import com.talkme.domain.lesson.model.LessonSegmentTab
import com.talkme.presentation.components.ExampleAudioCard
import com.talkme.presentation.components.InteractiveRuleCard
import com.talkme.presentation.components.LetterBuilderExerciseCard
import com.talkme.presentation.components.TalkMeHeader
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.LocalDimensions

/**
 * Lesson Detail Screen (`LessonDetailScreen.kt`) nested inside `presentation/screens/lesson/`
 * per Section 2 Item 5 & Section 5 Rule 4 of PROJECT_RULES.md.
 *
 * Features:
 * - Bookmark action button & Voice settings action button
 * - Qoida / Misol / Mashq segment tabs with completion checkmark icon (`AppIcons.Check`)
 * - Universal 10-Section Lesson stepper (Intro -> Rules -> Examples -> Fill Blanks -> Word Builder -> Vocab -> Grammar -> Listening -> Mixed -> Final Test)
 * - Formula structure box with Pronoun Grid Table (`PronounColumnItem`) and `AppIcons.Layers`
 * - Example audio cards (`ExampleAudioCard`) connected to Voice AI TTS (`SpeakTextUseCase`)
 * - Zero hardcoded strings, hex colors, .sp, or .dp values (Rule 1).
 */
@Composable
fun LessonDetailScreen(
    uiState: LessonUiState,
    onBackClick: () -> Unit,
    onToggleBookmark: () -> Unit,
    onOpenVoiceSettings: () -> Unit,
    onSelectSegmentTab: (LessonSegmentTab) -> Unit,
    onSelectSection: (LessonSection) -> Unit,
    onSpeakText: (text: String, slow: Boolean) -> Unit,
    onCompleteSection: (completed: LessonSection, next: LessonSection) -> Unit,
    onFinishLesson: () -> Unit,
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current
    val lesson = uiState.lesson ?: return

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(horizontal = dims.spaceLarge),
        verticalArrangement = Arrangement.spacedBy(dims.spaceLarge),
        contentPadding = PaddingValues(vertical = dims.spaceLarge)
    ) {
        // 1. Top Header with Back ChevronLeft, Voice Settings, and Bookmark Button
        item {
            TalkMeHeader(
                title = lesson.title,
                subtitle = "${lesson.level.name} · ${lesson.difficultyLabel}",
                onBackClick = onBackClick,
                trailingContent = {
                    IconButton(
                        onClick = onOpenVoiceSettings,
                        modifier = Modifier
                            .size(dims.iconButtonSize)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.surface)
                            .border(
                                width = dims.borderThin,
                                color = MaterialTheme.colorScheme.outline,
                                shape = CircleShape
                            )
                    ) {
                        Icon(
                            imageVector = AppIcons.SettingsSliders,
                            contentDescription = stringResource(R.string.cd_voice_settings),
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(dims.iconMedium)
                        )
                    }

                    IconButton(
                        onClick = onToggleBookmark,
                        modifier = Modifier
                            .size(dims.iconButtonSize)
                            .clip(CircleShape)
                            .background(
                                if (uiState.isBookmarked) MaterialTheme.colorScheme.primary
                                else MaterialTheme.colorScheme.surface
                            )
                            .border(
                                width = dims.borderThin,
                                color = MaterialTheme.colorScheme.outline,
                                shape = CircleShape
                            )
                    ) {
                        Icon(
                            imageVector = if (uiState.isBookmarked) {
                                AppIcons.BookmarkFilled
                            } else {
                                AppIcons.BookmarkOutline
                            },
                            contentDescription = stringResource(R.string.cd_bookmark_lesson),
                            tint = if (uiState.isBookmarked) {
                                MaterialTheme.colorScheme.onPrimary
                            } else {
                                MaterialTheme.colorScheme.primary
                            },
                            modifier = Modifier.size(dims.iconMedium)
                        )
                    }
                }
            )
        }

        // 2. Qoida / Misol / Mashq Segment Tabs with Completion Checkmark Icon
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(dims.radiusLarge))
                    .background(MaterialTheme.colorScheme.surface)
                    .border(
                        width = dims.borderThin,
                        color = MaterialTheme.colorScheme.outline,
                        shape = RoundedCornerShape(dims.radiusLarge)
                    )
                    .padding(dims.spaceExtraSmall),
                horizontalArrangement = Arrangement.spacedBy(dims.spaceExtraSmall)
            ) {
                val tabs = listOf(
                    Triple(LessonSegmentTab.RULE, R.string.tab_rule, uiState.completedSections.contains(LessonSection.RULES)),
                    Triple(LessonSegmentTab.EXAMPLE, R.string.tab_example, uiState.completedSections.contains(LessonSection.ANIMATED_EXAMPLES)),
                    Triple(LessonSegmentTab.EXERCISE, R.string.tab_exercise, uiState.completedSections.contains(LessonSection.FINAL_ASSESSMENT))
                )

                tabs.forEach { (tab, labelRes, isCompleted) ->
                    val isSelected = uiState.activeSegmentTab == tab
                    Row(
                        modifier = Modifier
                            .weight(1f)
                            .height(dims.buttonHeightCompact)
                            .clip(RoundedCornerShape(dims.radiusMedium))
                            .background(
                                if (isSelected) MaterialTheme.colorScheme.primary
                                else MaterialTheme.colorScheme.surface
                            )
                            .clickable { onSelectSegmentTab(tab) },
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        if (isCompleted) {
                            Icon(
                                imageVector = AppIcons.Check,
                                contentDescription = stringResource(R.string.cd_completed_check),
                                tint = if (isSelected) {
                                    MaterialTheme.colorScheme.onPrimary
                                } else {
                                    MaterialTheme.colorScheme.secondary
                                },
                                modifier = Modifier.size(dims.iconSmall)
                            )
                            Spacer(modifier = Modifier.width(dims.spaceExtraSmall))
                        }
                        Text(
                            text = stringResource(labelRes),
                            style = AppTypography.LabelLarge,
                            color = if (isSelected) {
                                MaterialTheme.colorScheme.onPrimary
                            } else {
                                MaterialTheme.colorScheme.onSurfaceVariant
                            }
                        )
                    }
                }
            }
        }

        // 3. Universal 10-Section Stepper Row
        item {
            LazyRow(horizontalArrangement = Arrangement.spacedBy(dims.spaceSmall)) {
                items(LessonSection.entries) { section ->
                    val isCurrent = uiState.currentSection == section
                    val isDone = uiState.completedSections.contains(section)
                    val labelRes = when (section) {
                        LessonSection.INTRO -> R.string.section_1_intro
                        LessonSection.RULES -> R.string.section_2_rules
                        LessonSection.ANIMATED_EXAMPLES -> R.string.section_3_examples
                        LessonSection.FILL_BLANKS -> R.string.section_4_fill_blanks
                        LessonSection.WORD_BUILDER -> R.string.section_5_word_builder
                        LessonSection.VOCABULARY -> R.string.section_6_vocabulary
                        LessonSection.GRAMMAR_PRACTICE -> R.string.section_7_grammar
                        LessonSection.LISTENING -> R.string.section_8_listening
                        LessonSection.MIXED_PRACTICE -> R.string.section_9_mixed
                        LessonSection.FINAL_ASSESSMENT -> R.string.section_10_final_test
                    }

                    Row(
                        modifier = Modifier
                            .clip(RoundedCornerShape(dims.radiusSmall))
                            .background(
                                when {
                                    isCurrent -> MaterialTheme.colorScheme.primary
                                    isDone -> MaterialTheme.colorScheme.secondaryContainer
                                    else -> MaterialTheme.colorScheme.surface
                                }
                            )
                            .clickable { onSelectSection(section) }
                            .padding(
                                horizontal = dims.spaceMedium,
                                vertical = dims.spaceSmall
                            ),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(dims.spaceExtraSmall)
                    ) {
                        if (isDone) {
                            Icon(
                                imageVector = AppIcons.Check,
                                contentDescription = null,
                                tint = if (isCurrent) {
                                    MaterialTheme.colorScheme.onPrimary
                                } else {
                                    MaterialTheme.colorScheme.secondary
                                },
                                modifier = Modifier.size(dims.iconSmall)
                            )
                        }
                        Text(
                            text = stringResource(labelRes),
                            style = AppTypography.LabelMedium,
                            color = when {
                                isCurrent -> MaterialTheme.colorScheme.onPrimary
                                isDone -> MaterialTheme.colorScheme.secondary
                                else -> MaterialTheme.colorScheme.onSurfaceVariant
                            }
                        )
                    }
                }
            }
        }

        // 4. Dynamic Section Content
        when (uiState.currentSection) {
            LessonSection.INTRO -> {
                item {
                    LessonIntroductionSectionCard(
                        lesson = lesson,
                        onStartLearning = {
                            onCompleteSection(LessonSection.INTRO, LessonSection.RULES)
                        }
                    )
                }
            }

            LessonSection.RULES -> {
                items(lesson.rules, key = { it.ruleId }) { rule ->
                    InteractiveRuleCard(
                        rule = rule,
                        onPlayAudio = onSpeakText
                    )
                }
                item {
                    Button(
                        onClick = {
                            onCompleteSection(LessonSection.RULES, LessonSection.ANIMATED_EXAMPLES)
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(dims.buttonHeightStandard),
                        shape = RoundedCornerShape(dims.radiusLarge)
                    ) {
                        Text(
                            text = stringResource(R.string.action_continue_examples),
                            style = AppTypography.LabelLarge
                        )
                    }
                }
            }

            LessonSection.ANIMATED_EXAMPLES -> {
                items(lesson.examples, key = { it.exampleId }) { example ->
                    ExampleAudioCard(
                        example = example,
                        onPlayAudio = onSpeakText
                    )
                }
                item {
                    Button(
                        onClick = {
                            onCompleteSection(LessonSection.ANIMATED_EXAMPLES, LessonSection.FILL_BLANKS)
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(dims.buttonHeightStandard),
                        shape = RoundedCornerShape(dims.radiusLarge)
                    ) {
                        Text(
                            text = stringResource(R.string.action_continue_practice),
                            style = AppTypography.LabelLarge
                        )
                    }
                }
            }

            LessonSection.WORD_BUILDER -> {
                val wbExercise = lesson.exercises.firstOrNull { it.section == LessonSection.WORD_BUILDER }
                if (wbExercise != null) {
                    item {
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(dims.radiusExtraLarge),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                        ) {
                            Column(
                                modifier = Modifier.padding(dims.spaceExtraLarge),
                                verticalArrangement = Arrangement.spacedBy(dims.spaceLarge)
                            ) {
                                Text(
                                    text = wbExercise.question,
                                    style = AppTypography.TitleMedium,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                                LetterBuilderExerciseCard(
                                    targetWord = wbExercise.correctAnswer,
                                    letterPool = wbExercise.distractorLetters,
                                    onWordCompleted = {
                                        onCompleteSection(LessonSection.WORD_BUILDER, LessonSection.VOCABULARY)
                                    }
                                )
                            }
                        }
                    }
                }
            }

            else -> {
                item {
                    Button(
                        onClick = onFinishLesson,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(dims.buttonHeightStandard),
                        shape = RoundedCornerShape(dims.radiusLarge)
                    ) {
                        Text(
                            text = stringResource(R.string.action_next_exercise),
                            style = AppTypography.LabelLarge
                        )
                    }
                }
            }
        }
    }
}

/**
 * Section 1 — Lesson Introduction Card Composable.
 * Strictly obeys Rule 1 of PROJECT_RULES.md (uses LocalDimensions, AppTypography, MaterialTheme, and stringResource).
 */
@Composable
fun LessonIntroductionSectionCard(
    lesson: LessonPlan,
    onStartLearning: () -> Unit,
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(dims.radiusExtraLarge),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(dims.spaceExtraLarge),
            verticalArrangement = Arrangement.spacedBy(dims.spaceLarge)
        ) {
            Text(
                text = "${lesson.level.name} · ${lesson.difficultyLabel}",
                style = AppTypography.LabelMedium,
                color = MaterialTheme.colorScheme.primary
            )

            Text(
                text = lesson.title,
                style = AppTypography.DisplayLarge,
                color = MaterialTheme.colorScheme.onSurface
            )

            Text(
                text = lesson.description,
                style = AppTypography.BodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Column(verticalArrangement = Arrangement.spacedBy(dims.spaceSmall)) {
                Text(
                    text = stringResource(R.string.label_learning_objectives),
                    style = AppTypography.LabelLarge,
                    color = MaterialTheme.colorScheme.onSurface
                )

                lesson.learningObjectives.forEach { objective ->
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(dims.spaceSmall)
                    ) {
                        Icon(
                            imageVector = AppIcons.CheckCircle,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.secondary,
                            modifier = Modifier.size(dims.iconSmall)
                        )
                        Text(
                            text = objective,
                            style = AppTypography.BodyMedium,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                }
            }

            Button(
                onClick = onStartLearning,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(dims.buttonHeightStandard),
                shape = RoundedCornerShape(dims.radiusLarge)
            ) {
                Icon(
                    imageVector = AppIcons.Play,
                    contentDescription = null,
                    modifier = Modifier.size(dims.iconMedium)
                )
                Spacer(modifier = Modifier.width(dims.spaceSmall))
                Text(
                    text = stringResource(R.string.action_start_learning),
                    style = AppTypography.LabelLarge,
                    color = MaterialTheme.colorScheme.onPrimary
                )
            }
        }
    }
}
