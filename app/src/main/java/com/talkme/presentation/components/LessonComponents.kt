package com.talkme.presentation.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateContentSize
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import com.talkme.R
import com.talkme.domain.lesson.model.AnimatedExample
import com.talkme.domain.lesson.model.LessonRule
import com.talkme.domain.lesson.model.PronounRuleCell
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.LocalDimensions
import com.talkme.ui.theme.TalkMeColors

/**
 * Reusable Pronoun Grid Table item (`PronounColumnItem`) displayed inside the formula
 * structure box on [com.talkme.presentation.screens.lesson.LessonDetailScreen]
 * per Section 2 Item 5 of PROJECT_RULES.md.
 */
@Composable
fun PronounColumnItem(
    cell: PronounRuleCell,
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current

    Row(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(dims.radiusMedium))
            .background(MaterialTheme.colorScheme.surface)
            .border(
                width = dims.borderThin,
                color = MaterialTheme.colorScheme.outline,
                shape = RoundedCornerShape(dims.radiusMedium)
            )
            .padding(dims.spaceMedium),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = cell.subjectPronoun,
            style = AppTypography.LabelLarge,
            color = MaterialTheme.colorScheme.onSurface
        )
        Text(
            text = cell.auxiliaryOrForm,
            style = AppTypography.TitleMedium,
            color = MaterialTheme.colorScheme.primary
        )
        Text(
            text = cell.exampleFragment,
            style = AppTypography.BodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

/**
 * Reusable Example Audio Card (`ExampleAudioCard`) featuring highlighted verb/target phrases
 * and circular speaker buttons connected to the Voice AI TTS Engine (`SpeakTextUseCase`)
 * per Section 2 Item 5 of PROJECT_RULES.md.
 */
@Composable
fun ExampleAudioCard(
    example: AnimatedExample,
    onPlayAudio: (text: String, slow: Boolean) -> Unit,
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
                .padding(dims.spaceLarge),
            verticalArrangement = Arrangement.spacedBy(dims.spaceMedium)
        ) {
            // Segmented sentence breakdown with highlighted target phrase
            LazyRow(horizontalArrangement = Arrangement.spacedBy(dims.spaceSmall)) {
                items(example.segments) { segment ->
                    val bgColor = if (segment.isHighlighted) {
                        MaterialTheme.colorScheme.primary
                    } else {
                        MaterialTheme.colorScheme.surfaceVariant
                    }
                    val textColor = if (segment.isHighlighted) {
                        MaterialTheme.colorScheme.onPrimary
                    } else {
                        MaterialTheme.colorScheme.onSurface
                    }

                    Column(
                        modifier = Modifier
                            .clip(RoundedCornerShape(dims.radiusSmall))
                            .background(bgColor)
                            .padding(
                                horizontal = dims.spaceMedium,
                                vertical = dims.spaceSmall
                            )
                    ) {
                        Text(
                            text = segment.text,
                            style = AppTypography.TitleMedium,
                            color = textColor
                        )
                        if (segment.roleLabel.isNotBlank()) {
                            Text(
                                text = segment.roleLabel,
                                style = AppTypography.LabelSmall,
                                color = textColor
                            )
                        }
                    }
                }
            }

            // Full sentence, Uzbek translation, and circular speaker button
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = example.sentenceEn,
                        style = AppTypography.TitleMedium,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = example.translationUz,
                        style = AppTypography.BodyMedium,
                        color = MaterialTheme.colorScheme.primary
                    )
                }

                Row(horizontalArrangement = Arrangement.spacedBy(dims.spaceSmall)) {
                    TextButton(
                        onClick = { onPlayAudio(example.sentenceEn, true) },
                        modifier = Modifier
                            .clip(RoundedCornerShape(dims.radiusSmall))
                            .background(TalkMeColors.ContainerAmberLight)
                    ) {
                        Text(
                            text = stringResource(R.string.action_slow_speech),
                            style = AppTypography.LabelMedium,
                            color = TalkMeColors.WarningAmber
                        )
                    }

                    IconButton(
                        onClick = { onPlayAudio(example.sentenceEn, false) },
                        modifier = Modifier
                            .size(dims.iconButtonSize)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.primaryContainer)
                    ) {
                        Icon(
                            imageVector = AppIcons.VolumeUp,
                            contentDescription = stringResource(R.string.cd_play_audio),
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(dims.iconMedium)
                        )
                    }
                }
            }

            // Grammar note
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(dims.radiusMedium))
                    .background(MaterialTheme.colorScheme.secondaryContainer)
                    .padding(dims.spaceMedium)
            ) {
                Text(
                    text = example.grammarNoteUz,
                    style = AppTypography.LabelMedium,
                    color = MaterialTheme.colorScheme.onSecondaryContainer
                )
            }
        }
    }
}

/**
 * Interactive Step-by-Step Rule Explanation Card with Formula Structure Box (`AppIcons.Layers`),
 * Pronoun Grid Table (`PronounColumnItem`), Common Mistakes, Memory Tip, and Expandable Details.
 */
@Composable
fun InteractiveRuleCard(
    rule: LessonRule,
    onPlayAudio: (text: String, slow: Boolean) -> Unit,
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current
    var expanded by remember(rule.ruleId) { mutableStateOf(false) }

    Card(
        modifier = modifier
            .fillMaxWidth()
            .animateContentSize(animationSpec = spring(stiffness = Spring.StiffnessMediumLow)),
        shape = RoundedCornerShape(dims.radiusExtraLarge),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(dims.spaceExtraLarge),
            verticalArrangement = Arrangement.spacedBy(dims.spaceMedium)
        ) {
            Text(
                text = rule.subtitleUz,
                style = AppTypography.LabelMedium,
                color = MaterialTheme.colorScheme.primary
            )

            Text(
                text = rule.title,
                style = AppTypography.HeadlineMedium,
                color = MaterialTheme.colorScheme.onSurface
            )

            Text(
                text = rule.explanationUz,
                style = AppTypography.BodyLarge,
                color = MaterialTheme.colorScheme.onSurface
            )

            // Formula structure box with AppIcons.Layers and Pronoun Grid Table
            if (!rule.formula.isNullOrBlank()) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(dims.radiusLarge))
                        .background(MaterialTheme.colorScheme.primaryContainer)
                        .padding(dims.spaceLarge),
                    verticalArrangement = Arrangement.spacedBy(dims.spaceSmall)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = stringResource(R.string.label_formula_structure),
                                style = AppTypography.LabelSmall,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Text(
                                text = rule.formula,
                                style = AppTypography.FormulaMono,
                                color = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                        }

                        Icon(
                            imageVector = AppIcons.Layers,
                            contentDescription = stringResource(R.string.cd_formula_layers),
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(dims.iconMedium)
                        )
                    }

                    // Render PronounColumnItem grid rows
                    rule.pronounGrid.forEach { cell ->
                        PronounColumnItem(cell = cell)
                    }
                }
            }

            // Common mistakes
            rule.commonMistakes.forEach { mistake ->
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(dims.radiusMedium))
                        .background(MaterialTheme.colorScheme.errorContainer)
                        .padding(dims.spaceMedium),
                    verticalArrangement = Arrangement.spacedBy(dims.spaceExtraSmall)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(dims.spaceSmall)
                    ) {
                        Icon(
                            imageVector = AppIcons.Warning,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.error,
                            modifier = Modifier.size(dims.iconSmall)
                        )
                        Text(
                            text = stringResource(R.string.label_common_mistake),
                            style = AppTypography.LabelMedium,
                            color = MaterialTheme.colorScheme.error
                        )
                    }
                    Text(
                        text = mistake.incorrect,
                        style = AppTypography.BodyMedium,
                        color = MaterialTheme.colorScheme.error
                    )
                    Text(
                        text = mistake.correct,
                        style = AppTypography.LabelLarge,
                        color = MaterialTheme.colorScheme.secondary
                    )
                    Text(
                        text = mistake.explanationUz,
                        style = AppTypography.BodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            // Memory tip
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(dims.radiusMedium))
                    .background(MaterialTheme.colorScheme.secondaryContainer)
                    .padding(dims.spaceMedium),
                horizontalArrangement = Arrangement.spacedBy(dims.spaceSmall),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = AppIcons.Lightbulb,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.secondary,
                    modifier = Modifier.size(dims.iconMedium)
                )
                Text(
                    text = "${stringResource(R.string.label_memory_tip)} ${rule.memoryTipUz}",
                    style = AppTypography.LabelMedium,
                    color = MaterialTheme.colorScheme.onSecondaryContainer
                )
            }

            // Expandable additional details
            TextButton(onClick = { expanded = !expanded }) {
                Text(
                    text = if (expanded) {
                        stringResource(R.string.action_collapse_details)
                    } else {
                        stringResource(R.string.action_expand_details)
                    },
                    style = AppTypography.LabelLarge,
                    color = MaterialTheme.colorScheme.primary
                )
                Icon(
                    imageVector = if (expanded) AppIcons.ExpandLess else AppIcons.ExpandMore,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(dims.iconSmall)
                )
            }

            AnimatedVisibility(visible = expanded) {
                Text(
                    text = rule.additionalDetailsUz,
                    style = AppTypography.BodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

/**
 * Interactive Word Builder (Section 5 Letter Cards) Composable allowing learners
 * to construct target English words by tapping letter cards.
 * Strictly obeys Rule 1 of PROJECT_RULES.md (no hardcoded .dp, .sp, or hex colors).
 */
@Composable
fun LetterBuilderExerciseCard(
    targetWord: String,
    letterPool: List<Char>,
    onWordCompleted: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current
    var selectedIndices by remember(targetWord) { mutableStateOf<List<Int>>(emptyList()) }
    val currentConstructed = selectedIndices.map { letterPool[it] }.joinToString("")

    LaunchedEffect(currentConstructed) {
        if (currentConstructed.length == targetWord.length &&
            currentConstructed.equals(targetWord, ignoreCase = true)
        ) {
            onWordCompleted(currentConstructed)
        }
    }

    Column(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(dims.spaceLarge),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Target Word Slots
        LazyRow(horizontalArrangement = Arrangement.spacedBy(dims.spaceSmall)) {
            items(targetWord.length) { slotIndex ->
                val placedChar = selectedIndices.getOrNull(slotIndex)?.let { letterPool[it].toString() }
                val isFilled = placedChar != null

                Box(
                    modifier = Modifier
                        .size(dims.letterTileSize)
                        .clip(RoundedCornerShape(dims.radiusMedium))
                        .background(
                            if (isFilled) MaterialTheme.colorScheme.primary
                            else MaterialTheme.colorScheme.surfaceVariant
                        )
                        .border(
                            width = dims.borderThick,
                            color = MaterialTheme.colorScheme.outlineVariant,
                            shape = RoundedCornerShape(dims.radiusMedium)
                        )
                        .clickable(enabled = isFilled) {
                            selectedIndices = selectedIndices.toMutableList().also {
                                it.removeAt(slotIndex)
                            }
                        },
                    contentAlignment = Alignment.Center
                ) {
                    if (placedChar != null) {
                        Text(
                            text = placedChar,
                            style = AppTypography.TitleLarge,
                            color = MaterialTheme.colorScheme.onPrimary
                        )
                    }
                }
            }
        }

        // Available Letter Pool Cards
        LazyRow(horizontalArrangement = Arrangement.spacedBy(dims.spaceSmall)) {
            itemsIndexed(letterPool) { poolIndex, letter ->
                val isUsed = selectedIndices.contains(poolIndex)
                val scale by animateFloatAsState(
                    targetValue = if (isUsed) 0.92f else 1f,
                    label = "letterCardScale"
                )

                Box(
                    modifier = Modifier
                        .size(dims.letterTileSize * scale)
                        .clip(RoundedCornerShape(dims.radiusMedium))
                        .background(
                            if (isUsed) MaterialTheme.colorScheme.surfaceVariant
                            else MaterialTheme.colorScheme.surface
                        )
                        .border(
                            width = dims.borderThick,
                            color = MaterialTheme.colorScheme.outline,
                            shape = RoundedCornerShape(dims.radiusMedium)
                        )
                        .clickable(enabled = !isUsed && selectedIndices.size < targetWord.length) {
                            selectedIndices = selectedIndices + poolIndex
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = letter.toString(),
                        style = AppTypography.TitleMedium,
                        color = if (isUsed) {
                            MaterialTheme.colorScheme.onSurfaceVariant
                        } else {
                            MaterialTheme.colorScheme.onSurface
                        }
                    )
                }
            }
        }
    }
}
