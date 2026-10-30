package com.talkme.presentation.screens.repeat

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
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
import androidx.compose.ui.res.stringResource
import com.talkme.R
import com.talkme.presentation.components.TalkMeHeader
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.LocalDimensions

private data class FsrsFlashcardItem(
    val wordEn: String,
    val phonetic: String,
    val translationUz: String,
    val exampleEn: String,
    val exampleUz: String
)

/**
 * Spaced Repetition FSRS-6 Flashcard Review Screen (`RepeatScreen.kt`)
 * nested inside `presentation/screens/repeat/` per Section 3 of PROJECT_RULES.md.
 */
@Composable
fun RepeatScreen(
    onBackClick: (() -> Unit)? = null,
    onPlayAudio: (text: String) -> Unit = {},
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current
    var currentIndex by remember { mutableIntStateOf(0) }
    var isAnswerRevealed by remember { mutableStateOf(false) }

    val flashcards = remember {
        listOf(
            FsrsFlashcardItem(
                wordEn = "Seventeen",
                phonetic = "/ˌsev.ənˈtiːn/",
                translationUz = "O‘n yetti (17)",
                exampleEn = "There are seventeen students in the classroom.",
                exampleUz = "Sinfxonada o‘n yettita o‘quvchi bor."
            ),
            FsrsFlashcardItem(
                wordEn = "Forty-five",
                phonetic = "/ˈfɔː.ti faɪv/",
                translationUz = "Qirq besh (45)",
                exampleEn = "The lesson lasts forty-five minutes.",
                exampleUz = "Dars qirq besh daqiqa davom etadi."
            ),
            FsrsFlashcardItem(
                wordEn = "Hundred",
                phonetic = "/ˈhʌn.drəd/",
                translationUz = "Yuz (100)",
                exampleEn = "This book has one hundred pages.",
                exampleUz = "Ushbu kitob yuz sahifadan iborat."
            )
        )
    }

    val currentCard = flashcards[currentIndex % flashcards.size]

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(horizontal = dims.spaceLarge),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(dims.spaceMedium)) {
            TalkMeHeader(
                title = stringResource(R.string.repeat_screen_title),
                subtitle = stringResource(R.string.repeat_screen_subtitle),
                onBackClick = onBackClick
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = stringResource(R.string.repeat_cards_remaining),
                    style = AppTypography.LabelLarge,
                    color = MaterialTheme.colorScheme.primary
                )
                Row(horizontalArrangement = Arrangement.spacedBy(dims.spaceSmall)) {
                    Text(
                        text = stringResource(R.string.repeat_stability_label),
                        style = AppTypography.LabelSmall,
                        color = MaterialTheme.colorScheme.secondary
                    )
                    Text(
                        text = stringResource(R.string.repeat_difficulty_label),
                        style = AppTypography.LabelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }

        // Flashcard Surface
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .border(
                    width = dims.borderThick,
                    color = MaterialTheme.colorScheme.outlineVariant,
                    shape = RoundedCornerShape(dims.radiusExtraLarge)
                ),
            shape = RoundedCornerShape(dims.radiusExtraLarge),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(dims.spaceExtraLarge),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(dims.spaceMedium)
            ) {
                IconButton(
                    onClick = { onPlayAudio(currentCard.wordEn) },
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

                Text(
                    text = currentCard.wordEn,
                    style = AppTypography.DisplayLarge,
                    color = MaterialTheme.colorScheme.onSurface
                )

                Text(
                    text = currentCard.phonetic,
                    style = AppTypography.BodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                OutlinedButton(
                    onClick = { isAnswerRevealed = !isAnswerRevealed },
                    shape = RoundedCornerShape(dims.radiusMedium)
                ) {
                    Text(
                        text = if (isAnswerRevealed) {
                            stringResource(R.string.repeat_hide_translation)
                        } else {
                            stringResource(R.string.repeat_tap_to_reveal)
                        },
                        style = AppTypography.LabelLarge
                    )
                }

                AnimatedVisibility(visible = isAnswerRevealed) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(dims.radiusLarge))
                            .background(MaterialTheme.colorScheme.primaryContainer)
                            .padding(dims.spaceLarge),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(dims.spaceSmall)
                    ) {
                        Text(
                            text = currentCard.translationUz,
                            style = AppTypography.HeadlineMedium,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Text(
                            text = currentCard.exampleEn,
                            style = AppTypography.TitleMedium,
                            color = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                        Text(
                            text = currentCard.exampleUz,
                            style = AppTypography.BodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }

        // FSRS-6 4-Grade Action Row (Again / Hard / Good / Easy)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = dims.spaceLarge),
            horizontalArrangement = Arrangement.spacedBy(dims.spaceSmall)
        ) {
            val advanceCard = {
                isAnswerRevealed = false
                currentIndex = (currentIndex + 1) % flashcards.size
            }

            OutlinedButton(
                onClick = advanceCard,
                modifier = Modifier
                    .weight(1f)
                    .height(dims.buttonHeightCompact),
                shape = RoundedCornerShape(dims.radiusMedium)
            ) {
                Text(
                    text = stringResource(R.string.repeat_grade_again),
                    style = AppTypography.LabelSmall,
                    color = MaterialTheme.colorScheme.error
                )
            }

            OutlinedButton(
                onClick = advanceCard,
                modifier = Modifier
                    .weight(1f)
                    .height(dims.buttonHeightCompact),
                shape = RoundedCornerShape(dims.radiusMedium)
            ) {
                Text(
                    text = stringResource(R.string.repeat_grade_hard),
                    style = AppTypography.LabelSmall
                )
            }

            Button(
                onClick = advanceCard,
                modifier = Modifier
                    .weight(1f)
                    .height(dims.buttonHeightCompact),
                shape = RoundedCornerShape(dims.radiusMedium)
            ) {
                Text(
                    text = stringResource(R.string.repeat_grade_good),
                    style = AppTypography.LabelSmall
                )
            }

            Button(
                onClick = advanceCard,
                modifier = Modifier
                    .weight(1f)
                    .height(dims.buttonHeightCompact),
                shape = RoundedCornerShape(dims.radiusMedium)
            ) {
                Text(
                    text = stringResource(R.string.repeat_grade_easy),
                    style = AppTypography.LabelSmall
                )
            }
        }
    }
}
