package com.example.talkme.presentation.screens.home.components

import androidx.compose.foundation.clickable
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
import com.example.talkme.presentation.components.TalkMeCard
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.TalkMeTheme

/**
 * Skill Training Section displaying Listening, Speaking, Reading, and Writing practice options.
 *
 * @param modifier Composable modifier.
 * @param title Section title.
 * @param onSeeAllClick Callback when user clicks "See All".
 * @param onSkillClick Callback invoked when a specific skill card is clicked with skill key parameter.
 */
@Composable
fun SkillSection(
    modifier: Modifier = Modifier,
    title: String = stringResource(id = R.string.skills_section_title),
    onSeeAllClick: () -> Unit = {},
    onSkillClick: (String) -> Unit = {},
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

            Text(
                text = stringResource(id = R.string.see_all),
                style = AppTypography.SectionAction.copy(
                    color = MaterialTheme.colorScheme.primary,
                ),
                modifier = Modifier.clickable(onClick = onSeeAllClick),
            )
        }

        Spacer(modifier = Modifier.height(dimensions.paddingMedium))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(dimensions.paddingMedium),
        ) {
            SkillCard(
                title = stringResource(id = R.string.skill_listening),
                description = stringResource(id = R.string.skill_listening_desc),
                iconRes = AppIcons.Headphones,
                onClick = { onSkillClick("listening") },
                modifier = Modifier.weight(1f),
            )

            SkillCard(
                title = stringResource(id = R.string.skill_speaking),
                description = stringResource(id = R.string.skill_speaking_desc),
                iconRes = AppIcons.Mic,
                onClick = { onSkillClick("speaking") },
                modifier = Modifier.weight(1f),
            )
        }

        Spacer(modifier = Modifier.height(dimensions.paddingMedium))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(dimensions.paddingMedium),
        ) {
            SkillCard(
                title = stringResource(id = R.string.skill_reading),
                description = stringResource(id = R.string.skill_reading_desc),
                iconRes = AppIcons.Book,
                onClick = { onSkillClick("reading") },
                modifier = Modifier.weight(1f),
            )

            SkillCard(
                title = stringResource(id = R.string.skill_writing),
                description = stringResource(id = R.string.skill_writing_desc),
                iconRes = AppIcons.Edit,
                onClick = { onSkillClick("writing") },
                modifier = Modifier.weight(1f),
            )
        }
    }
}

/**
 * Individual skill training card component.
 */
@Composable
fun SkillCard(
    title: String,
    description: String,
    iconRes: Int,
    modifier: Modifier = Modifier,
    onClick: () -> Unit = {},
) {
    val dimensions = LocalDimensions.current

    TalkMeCard(
        modifier = modifier,
        onClick = onClick,
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(
                painter = painterResource(id = iconRes),
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(dimensions.iconMedium),
            )

            Spacer(modifier = Modifier.width(dimensions.paddingSmall))

            Column {
                Text(
                    text = title,
                    style = AppTypography.CardTitle.copy(
                        color = MaterialTheme.colorScheme.onBackground,
                    ),
                )

                Spacer(modifier = Modifier.height(dimensions.paddingMicro))

                Text(
                    text = description,
                    style = AppTypography.CardSubtitle.copy(
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    ),
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun SkillSectionPreview() {
    TalkMeTheme {
        SkillSection()
    }
}
