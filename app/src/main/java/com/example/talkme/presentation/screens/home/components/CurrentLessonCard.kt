package com.example.talkme.presentation.screens.home.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import com.example.talkme.R
import com.example.talkme.presentation.components.TalkMeBadge
import com.example.talkme.presentation.components.TalkMeButton
import com.example.talkme.presentation.components.TalkMeCard
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.TalkMeTheme
import com.example.talkme.ui.theme.TextCardSubtitle

/**
 * Highlighted Current Active Lesson Card encouraging user to continue their active learning module.
 *
 * @param modifier Composable modifier.
 * @param title Title of current lesson.
 * @param subtitle Subtitle description of the lesson topic.
 * @param details Rule and example details summary.
 * @param duration Estimated duration to finish the lesson.
 * @param level Proficiency level indicator (e.g. A2).
 * @param category Lesson subject category (e.g. Grammar).
 * @param onContinueClick Callback invoked when user clicks the continue action button.
 */
@Composable
fun CurrentLessonCard(
    modifier: Modifier = Modifier,
    title: String = stringResource(id = R.string.lesson_title),
    subtitle: String = stringResource(id = R.string.lesson_subtitle),
    details: String = stringResource(id = R.string.lesson_details),
    duration: String = stringResource(id = R.string.lesson_duration),
    level: String = stringResource(id = R.string.lesson_level_a2),
    category: String = stringResource(id = R.string.lesson_category_grammar),
    onContinueClick: () -> Unit = {},
) {
    val dimensions = LocalDimensions.current

    TalkMeCard(
        modifier = modifier,
        containerColor = MaterialTheme.colorScheme.primaryContainer,
        borderColor = MaterialTheme.colorScheme.primaryContainer,
        cornerRadius = dimensions.cornerExtraLarge,
    ) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top,
            ) {
                Column {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        TalkMeBadge(
                            text = level,
                            containerColor = MaterialTheme.colorScheme.surfaceVariant,
                            textColor = MaterialTheme.colorScheme.primary,
                        )

                        Spacer(modifier = Modifier.width(dimensions.paddingSmall))

                        TalkMeBadge(
                            text = category,
                            containerColor = MaterialTheme.colorScheme.surfaceVariant,
                            textColor = MaterialTheme.colorScheme.primary,
                        )
                    }

                    Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                    Text(
                        text = title,
                        style = AppTypography.LessonTitle.copy(
                            color = MaterialTheme.colorScheme.onBackground,
                        ),
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingExtraSmall))

                    Text(
                        text = subtitle,
                        style = AppTypography.LessonSubtitle.copy(
                            color = TextCardSubtitle,
                        ),
                    )
                }

                Icon(
                    painter = painterResource(id = AppIcons.Book),
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(dimensions.iconHuge),
                )
            }

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    text = details,
                    style = AppTypography.LessonDetails.copy(
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    ),
                )

                Text(
                    text = duration,
                    style = AppTypography.LessonDetails.copy(
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    ),
                )
            }

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            TalkMeButton(
                text = stringResource(id = R.string.continue_lesson),
                trailingIconRes = AppIcons.ChevronRight,
                onClick = onContinueClick,
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun CurrentLessonCardPreview() {
    TalkMeTheme {
        CurrentLessonCard()
    }
}
