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
import com.example.talkme.presentation.components.TalkMeCard
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.TalkMeTheme

/**
 * Weekly Study Plan & Goal Progress Section.
 *
 * @param modifier Composable modifier.
 * @param title Section header title.
 * @param progressText Text indicating lesson progress (e.g. 3/5 lessons).
 * @param badgeText User proficiency badge text (e.g. A2 Learner).
 * @param taskTitle Current active weekly scenario task title.
 * @param taskSubtitle Scenario practice details.
 * @param onTaskClick Callback invoked when user clicks the active task item.
 */
@Composable
fun WeeklyPlanSection(
    modifier: Modifier = Modifier,
    title: String = stringResource(id = R.string.weekly_plan_title),
    progressText: String = stringResource(id = R.string.weekly_plan_progress),
    badgeText: String = stringResource(id = R.string.weekly_plan_badge),
    taskTitle: String = stringResource(id = R.string.real_situations_title),
    taskSubtitle: String = stringResource(id = R.string.real_situations_subtitle),
    onTaskClick: () -> Unit = {},
) {
    val dimensions = LocalDimensions.current

    Column(
        modifier = modifier.fillMaxWidth(),
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = title,
                style = AppTypography.SectionTitle.copy(
                    color = MaterialTheme.colorScheme.onBackground,
                ),
            )

            Row(
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    text = progressText,
                    style = AppTypography.BannerSubtitle.copy(
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    ),
                )

                Spacer(modifier = Modifier.width(dimensions.paddingSmall))

                TalkMeBadge(
                    text = badgeText,
                    containerColor = MaterialTheme.colorScheme.surfaceVariant,
                    textColor = MaterialTheme.colorScheme.primary,
                )
            }
        }

        Spacer(modifier = Modifier.height(dimensions.paddingMedium))

        TalkMeCard(
            modifier = Modifier.fillMaxWidth(),
            onClick = onTaskClick,
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                Row(
                    modifier = Modifier.weight(1f),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Icon(
                        painter = painterResource(id = AppIcons.Chat),
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(dimensions.iconMedium),
                    )

                    Spacer(modifier = Modifier.width(dimensions.paddingMedium))

                    Column {
                        Text(
                            text = taskTitle,
                            style = AppTypography.CardTitle.copy(
                                color = MaterialTheme.colorScheme.onBackground,
                            ),
                        )

                        Spacer(modifier = Modifier.height(dimensions.paddingMicro))

                        Text(
                            text = taskSubtitle,
                            style = AppTypography.BannerSubtitle.copy(
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            ),
                        )
                    }
                }

                Icon(
                    painter = painterResource(id = AppIcons.ChevronRight),
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.size(dimensions.iconMedium),
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun WeeklyPlanSectionPreview() {
    TalkMeTheme {
        WeeklyPlanSection()
    }
}
