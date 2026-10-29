package com.example.talkme.presentation.screens.lesson

import androidx.compose.foundation.background
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.tooling.preview.Preview
import com.example.talkme.R
import com.example.talkme.presentation.components.TalkMeBadge
import com.example.talkme.presentation.components.TalkMeButton
import com.example.talkme.presentation.components.TalkMeCard
import com.example.talkme.presentation.components.TalkMeHeader
import com.example.talkme.presentation.components.TalkMeTabRow
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.ContainerGreenLight
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.SuccessGreen
import com.example.talkme.ui.theme.TalkMeTheme

/**
 * Pixel-Perfect Detailed Lesson Screen matching design specifications from Untitled.pdf Page 3.
 * Presents grammar rules, structural formulas, pronoun tables, examples with highlighted verbs and
 * speaker audio buttons, pronunciation tips with audio wave, and quiz action buttons.
 *
 * @param onBackClick Back arrow callback handler.
 * @param onStartQuizClick Callback to transition to the quiz/exercise screen.
 * @param modifier Composable layout modifier.
 * @param onBookmarkClick Optional bookmark action callback handler.
 * @param onPlayAudioClick Optional audio play callback handler for examples.
 */
@Composable
fun LessonDetailScreen(
    onBackClick: () -> Unit,
    onStartQuizClick: () -> Unit,
    modifier: Modifier = Modifier,
    onBookmarkClick: () -> Unit = {},
    onPlayAudioClick: (String) -> Unit = {},
) {
    val dimensions = LocalDimensions.current

    var selectedTabIndex by remember { mutableIntStateOf(1) } // Default: Misol (matching screenshot)
    val tabs = listOf(
        stringResource(id = R.string.tab_rule),
        stringResource(id = R.string.tab_example),
        stringResource(id = R.string.tab_exercise),
    )

    val example1En = stringResource(id = R.string.example_1_en)
    val example2En = stringResource(id = R.string.example_2_en)

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
            // Header with Circular Back Button and Bookmark Ribbon Icon
            TalkMeHeader(
                title = stringResource(id = R.string.lesson_title),
                subtitle = stringResource(id = R.string.lesson_topic_tag),
                onBackClick = onBackClick,
                trailingContent = {
                    IconButton(
                        onClick = onBookmarkClick,
                        modifier = Modifier.size(dimensions.avatarSize),
                    ) {
                        Icon(
                            painter = painterResource(id = AppIcons.Bookmark),
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(dimensions.iconMedium),
                        )
                    }
                },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // Tab Selector Segment Row (with Checkmark ✓ on completed Qoida tab)
            TalkMeTabRow(
                tabs = tabs,
                selectedIndex = selectedTabIndex,
                onTabSelected = { selectedTabIndex = it },
                completedIndexIndices = setOf(0), // Shows ✓ Qoida matching screenshot
            )

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // Level & Duration Indicator Row
            Row(
                verticalAlignment = Alignment.CenterVertically,
            ) {
                TalkMeBadge(
                    text = stringResource(id = R.string.lesson_level_a2),
                    containerColor = MaterialTheme.colorScheme.surfaceVariant,
                    textColor = MaterialTheme.colorScheme.primary,
                )

                Spacer(modifier = Modifier.width(dimensions.paddingSmall))

                Text(
                    text = stringResource(id = R.string.lesson_details),
                    style = AppTypography.CardSubtitle.copy(
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    ),
                )
            }

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // Rule Heading & Explanation
            Text(
                text = stringResource(id = R.string.rule_heading),
                style = AppTypography.GreetingTitle.copy(
                    color = MaterialTheme.colorScheme.onBackground,
                ),
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            Text(
                text = stringResource(id = R.string.rule_description),
                style = AppTypography.GreetingSubtitle.copy(
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                ),
            )

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // Structure Box Formula Container (TASDIQ GAP TUZILISHI)
            TalkMeCard(
                containerColor = MaterialTheme.colorScheme.primaryContainer,
                borderColor = MaterialTheme.colorScheme.primaryContainer,
                cornerRadius = dimensions.cornerExtraLarge,
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(
                            text = stringResource(id = R.string.structure_box_title),
                            style = AppTypography.LessonTag.copy(
                                color = MaterialTheme.colorScheme.primary,
                            ),
                        )

                        Icon(
                            painter = painterResource(id = AppIcons.Layers),
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(dimensions.iconMedium),
                        )
                    }

                    Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                    // Formula Text with highlighted auxiliary verbs
                    val formulaText = buildAnnotatedString {
                        append("Ega + ")
                        withStyle(style = SpanStyle(color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)) {
                            append("am / is / are")
                        }
                        append("\n+ ")
                        withStyle(style = SpanStyle(color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)) {
                            append("fe’l-ing")
                        }
                    }

                    Text(
                        text = formulaText,
                        style = AppTypography.GreetingTitle.copy(
                            color = MaterialTheme.colorScheme.onBackground,
                        ),
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingMedium))

                    HorizontalDivider(
                        color = MaterialTheme.colorScheme.primary.copy(alpha = 0.2f),
                        thickness = dimensions.borderThin,
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingMedium))

                    // Pronoun Subject Table Grid
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                    ) {
                        PronounColumnItem(
                            pronouns = "I",
                            verb = "am",
                        )

                        PronounColumnItem(
                            pronouns = "He / She / It",
                            verb = "is",
                        )

                        PronounColumnItem(
                            pronouns = "You / We / They",
                            verb = "are",
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))

            // Examples Header Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    text = stringResource(id = R.string.example_heading),
                    style = AppTypography.SectionTitle.copy(
                        color = MaterialTheme.colorScheme.onBackground,
                    ),
                )

                Text(
                    text = stringResource(id = R.string.tab_pronunciation),
                    style = AppTypography.CardSubtitle.copy(
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    ),
                )
            }

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // Example 1 Item Card with Verb Highlight ("am studying")
            val example1Annotated = buildAnnotatedString {
                append("I ")
                withStyle(style = SpanStyle(color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)) {
                    append("am studying")
                }
                append(" English.")
            }

            ExampleAudioCard(
                englishAnnotatedText = example1Annotated,
                uzbekText = stringResource(id = R.string.example_1_uz),
                onPlayClick = { onPlayAudioClick(example1En) },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // Example 2 Item Card with Verb Highlight ("is reading")
            val example2Annotated = buildAnnotatedString {
                append("She ")
                withStyle(style = SpanStyle(color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)) {
                    append("is reading")
                }
                append(" a book now.")
            }

            ExampleAudioCard(
                englishAnnotatedText = example2Annotated,
                uzbekText = stringResource(id = R.string.example_2_uz),
                onPlayClick = { onPlayAudioClick(example2En) },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // Pronunciation Card (Talaffuz: -ing /ɪŋ/)
            TalkMeCard(
                containerColor = ContainerGreenLight,
                borderColor = ContainerGreenLight,
                cornerRadius = dimensions.cornerLarge,
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Column(
                        modifier = Modifier.weight(1f),
                    ) {
                        Text(
                            text = stringResource(id = R.string.pronunciation_note),
                            style = AppTypography.CardTitle.copy(
                                color = SuccessGreen,
                            ),
                        )
                    }

                    Icon(
                        painter = painterResource(id = AppIcons.AudioWave),
                        contentDescription = null,
                        tint = SuccessGreen,
                        modifier = Modifier.size(dimensions.iconLarge),
                    )
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))

            // Action Button
            TalkMeButton(
                text = stringResource(id = R.string.start_quiz_btn),
                trailingIconRes = AppIcons.ChevronRight,
                onClick = onStartQuizClick,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingExtraSmall))

            Text(
                text = stringResource(id = R.string.quiz_question_count),
                style = AppTypography.CardSubtitle.copy(
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                ),
                modifier = Modifier.align(Alignment.CenterHorizontally),
            )

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))
        }
    }
}

/**
 * Reusable Pronoun Subject Table Column Item inside Formula Box.
 */
@Composable
fun PronounColumnItem(
    pronouns: String,
    verb: String,
    modifier: Modifier = Modifier,
) {
    val dimensions = LocalDimensions.current

    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            text = pronouns,
            style = AppTypography.CardSubtitle.copy(
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            ),
        )

        Spacer(modifier = Modifier.height(dimensions.paddingMicro))

        Text(
            text = verb,
            style = AppTypography.CardTitle.copy(
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.Bold,
            ),
        )
    }
}

/**
 * Reusable Example Card with Highlighted Verb Text and Circular Speaker Audio Button.
 */
@Composable
fun ExampleAudioCard(
    englishAnnotatedText: AnnotatedString,
    uzbekText: String,
    onPlayClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val dimensions = LocalDimensions.current

    TalkMeCard(
        modifier = modifier,
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(
                modifier = Modifier.weight(1f),
            ) {
                Text(
                    text = englishAnnotatedText,
                    style = AppTypography.CardTitle.copy(
                        color = MaterialTheme.colorScheme.onBackground,
                    ),
                )

                Spacer(modifier = Modifier.height(dimensions.paddingMicro))

                Text(
                    text = uzbekText,
                    style = AppTypography.CardSubtitle.copy(
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    ),
                )
            }

            Box(
                modifier = Modifier
                    .size(dimensions.avatarSize)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.primaryContainer)
                    .clickable(onClick = onPlayClick),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    painter = painterResource(id = AppIcons.Volume),
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(dimensions.iconSmall),
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun LessonDetailScreenPreview() {
    TalkMeTheme {
        LessonDetailScreen(onBackClick = {}, onStartQuizClick = {})
    }
}
