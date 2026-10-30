package com.talkme.presentation.screens.lesson

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import com.talkme.R
import com.talkme.data.lesson.Lessons03And04Catalog
import com.talkme.data.lesson.SpellingLessonWord
import com.talkme.presentation.components.TalkMeHeader
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.LocalDimensions
import com.talkme.ui.theme.TalkMeColors

/**
 * Jetpack Compose section for Lesson 3 (`lesson_03_vowels_consonants` — Vowels and Consonants).
 *
 * Strictly obeys PROJECT_RULES.md:
 * - Zero hardcoded strings (`stringResource(R.string.*)`)
 * - Zero hardcoded hex colors (`MaterialTheme.colorScheme.*` & `TalkMeColors.*`)
 * - Zero hardcoded `.sp` or `FontWeight` (`AppTypography.*`)
 * - Zero hardcoded `.dp` (`LocalDimensions.current`)
 * - Uses `AppIcons.ChevronLeft` via `TalkMeHeader` for back navigation.
 */
@Composable
fun Lesson03VowelsConsonantsComposeSection(
    interfaceLanguage: String,
    onBackClick: () -> Unit,
    onSpeakLetter: (String) -> Unit,
    onSpeakWord: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current

    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(MaterialTheme.colorScheme.background)
            .padding(dims.spaceLarge),
        verticalArrangement = Arrangement.spacedBy(dims.spaceLarge)
    ) {
        TalkMeHeader(
            title = stringResource(R.string.lesson_03_title),
            subtitle = stringResource(R.string.lesson_03_subtitle),
            onBackClick = onBackClick
        )

        Text(
            text = stringResource(R.string.lesson_03_vowels_header),
            style = AppTypography.TitleLarge,
            color = MaterialTheme.colorScheme.onBackground
        )

        Lessons03And04Catalog.VOWEL_CARDS.forEach { card ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(dims.radiusLarge))
                    .background(TalkMeColors.ContainerAmberLight)
                    .border(
                        width = dims.borderThin,
                        color = TalkMeColors.WarningAmber,
                        shape = RoundedCornerShape(dims.radiusLarge)
                    )
                    .padding(dims.spaceLarge),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(dims.spaceExtraSmall)) {
                    Text(
                        text = "${card.letterUpper} ${card.letterLower} — ${card.englishWord}",
                        style = AppTypography.TitleMedium,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = card.translations[interfaceLanguage] ?: card.translations["uz"].orEmpty(),
                        style = AppTypography.BodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                Row(horizontalArrangement = Arrangement.spacedBy(dims.spaceSmall)) {
                    Button(
                        onClick = { onSpeakLetter(card.letterUpper) },
                        shape = RoundedCornerShape(dims.radiusMedium)
                    ) {
                        Icon(
                            imageVector = AppIcons.VolumeUp,
                            contentDescription = stringResource(R.string.cd_play_audio),
                            modifier = Modifier.size(dims.iconSmall)
                        )
                        Spacer(modifier = Modifier.width(dims.spaceExtraSmall))
                        Text(
                            text = "${stringResource(R.string.action_hear_letter)} (${card.letterUpper})",
                            style = AppTypography.LabelMedium
                        )
                    }

                    OutlinedButton(
                        onClick = { onSpeakWord(card.englishWord) },
                        shape = RoundedCornerShape(dims.radiusMedium)
                    ) {
                        Text(
                            text = card.englishWord,
                            style = AppTypography.LabelMedium,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                }
            }
        }
    }
}

/**
 * Jetpack Compose section for Lesson 4 (`lesson_04_phonics_spelling` — Phonics and Spelling).
 *
 * Displays the 2-Column Grid of 10 Everyday English Words (`APPLE`, `CAT`, `DOG`, `SUN`,
 * `CAR`, `FISH`, `BALL`, `TREE`, `CUP`, `BOOK`) with separate Word TTS and Letter-by-Letter
 * Spelling TTS playback.
 */
@Composable
fun Lesson04PhonicsSpellingComposeSection(
    interfaceLanguage: String,
    onBackClick: () -> Unit,
    onSpeakWord: (String) -> Unit,
    onSpeakSpelling: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current

    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(MaterialTheme.colorScheme.background)
            .padding(dims.spaceLarge),
        verticalArrangement = Arrangement.spacedBy(dims.spaceLarge)
    ) {
        TalkMeHeader(
            title = stringResource(R.string.lesson_04_title),
            subtitle = stringResource(R.string.lesson_04_subtitle),
            onBackClick = onBackClick
        )

        Text(
            text = stringResource(R.string.lesson_04_words_header),
            style = AppTypography.TitleLarge,
            color = MaterialTheme.colorScheme.onBackground
        )

        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            horizontalArrangement = Arrangement.spacedBy(dims.spaceMedium),
            verticalArrangement = Arrangement.spacedBy(dims.spaceMedium),
            modifier = Modifier.fillMaxWidth()
        ) {
            items(
                items = Lessons03And04Catalog.TEN_SPELLING_WORDS,
                key = { it.id }
            ) { item: SpellingLessonWord ->
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(dims.radiusLarge))
                        .background(MaterialTheme.colorScheme.surfaceVariant)
                        .border(
                            width = dims.borderThin,
                            color = MaterialTheme.colorScheme.outline,
                            shape = RoundedCornerShape(dims.radiusLarge)
                        )
                        .clickable { onSpeakWord(item.word) }
                        .padding(dims.spaceMedium),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(dims.spaceSmall)
                ) {
                    Text(
                        text = item.word,
                        style = AppTypography.TitleLarge,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = item.translations[interfaceLanguage] ?: item.translations["uz"].orEmpty(),
                        style = AppTypography.BodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Row(horizontalArrangement = Arrangement.spacedBy(dims.spaceSmall)) {
                        TextButton(onClick = { onSpeakWord(item.word) }) {
                            Text(
                                text = stringResource(R.string.action_hear_word),
                                style = AppTypography.LabelSmall,
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                        TextButton(onClick = { onSpeakSpelling(item.word) }) {
                            Text(
                                text = stringResource(R.string.action_hear_spelling),
                                style = AppTypography.LabelSmall,
                                color = MaterialTheme.colorScheme.secondary
                            )
                        }
                    }
                }
            }
        }
    }
}
