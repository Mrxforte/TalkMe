package com.example.talkme.presentation.screens.lesson

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
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import com.example.talkme.R
import com.example.talkme.presentation.components.TalkMeBadge
import com.example.talkme.presentation.components.TalkMeBannerCard
import com.example.talkme.presentation.components.TalkMeButton
import com.example.talkme.presentation.components.TalkMeCard
import com.example.talkme.presentation.components.TalkMeHeader
import com.example.talkme.presentation.components.TalkMeOptionCard
import com.example.talkme.presentation.components.TalkMeProgressBar
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.TalkMeTheme

/**
 * Quiz & Interactive Exercise Practice Screen displaying question options,
 * real-time feedback, and rule explanations.
 * Reuses TalkMeHeader, TalkMeBadge, TalkMeProgressBar, TalkMeCard, TalkMeOptionCard, TalkMeBannerCard, TalkMeButton.
 *
 * @param onBackClick Back arrow callback handler.
 * @param onNextClick Callback to transition to the next question or result screen.
 * @param onReviewRuleClick Callback to reopen rule detail view.
 * @param modifier Composable layout modifier.
 */
@Composable
fun QuizScreen(
    onBackClick: () -> Unit,
    onNextClick: () -> Unit,
    onReviewRuleClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val dimensions = LocalDimensions.current

    var selectedOptionIndex by remember { mutableIntStateOf(1) } // Default: Option B

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
                title = stringResource(id = R.string.quiz_title),
                subtitle = stringResource(id = R.string.lesson_title),
                onBackClick = onBackClick,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // Progress Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    text = stringResource(id = R.string.quiz_progress_counter),
                    style = AppTypography.BannerTitle.copy(
                        color = MaterialTheme.colorScheme.primary,
                    ),
                )

                TalkMeBadge(
                    text = stringResource(id = R.string.lesson_level_a2),
                    containerColor = MaterialTheme.colorScheme.surfaceVariant,
                    textColor = MaterialTheme.colorScheme.primary,
                )
            }

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            TalkMeProgressBar(
                progress = 0.8f, // 4 out of 5 questions
            )

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))

            // Context Tag
            TalkMeBadge(
                text = stringResource(id = R.string.quiz_context_tag),
                containerColor = MaterialTheme.colorScheme.primaryContainer,
                textColor = MaterialTheme.colorScheme.primary,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // Question Prompt Card
            TalkMeCard(
                containerColor = MaterialTheme.colorScheme.surface,
            ) {
                Column {
                    Text(
                        text = stringResource(id = R.string.quiz_question_instruction),
                        style = AppTypography.CardSubtitle.copy(
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        ),
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                    Text(
                        text = stringResource(id = R.string.quiz_prompt_text),
                        style = AppTypography.GreetingTitle.copy(
                            color = MaterialTheme.colorScheme.onBackground,
                        ),
                    )
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // Question Options using reusable TalkMeOptionCard
            TalkMeOptionCard(
                title = stringResource(id = R.string.quiz_option_a),
                isSelected = selectedOptionIndex == 0,
                onClick = { selectedOptionIndex = 0 },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            TalkMeOptionCard(
                title = stringResource(id = R.string.quiz_option_b),
                isSelected = selectedOptionIndex == 1,
                onClick = { selectedOptionIndex = 1 },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            TalkMeOptionCard(
                title = stringResource(id = R.string.quiz_option_c),
                isSelected = selectedOptionIndex == 2,
                onClick = { selectedOptionIndex = 2 },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // Correct Answer Explanation Feedback using TalkMeBannerCard
            TalkMeBannerCard(
                title = stringResource(id = R.string.quiz_feedback_correct),
                subtitle = stringResource(id = R.string.quiz_feedback_explanation),
                containerColor = MaterialTheme.colorScheme.secondaryContainer,
                iconTint = MaterialTheme.colorScheme.secondary,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))

            // Action Buttons
            TalkMeButton(
                text = stringResource(id = R.string.next_question_btn),
                onClick = onNextClick,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            TalkMeButton(
                text = stringResource(id = R.string.review_rule_btn),
                onClick = onReviewRuleClick,
                containerColor = MaterialTheme.colorScheme.surfaceVariant,
                contentColor = MaterialTheme.colorScheme.primary,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            Text(
                text = stringResource(id = R.string.quiz_footer_note),
                style = AppTypography.SplashFooter.copy(
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                ),
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth(),
            )

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))
        }
    }
}

@Preview(showBackground = true)
@Composable
fun QuizScreenPreview() {
    TalkMeTheme {
        QuizScreen(onBackClick = {}, onNextClick = {}, onReviewRuleClick = {})
    }
}
