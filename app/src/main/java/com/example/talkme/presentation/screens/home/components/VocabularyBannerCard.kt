package com.example.talkme.presentation.screens.home.components

import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import com.example.talkme.R
import com.example.talkme.presentation.components.TalkMeBannerCard
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.TalkMeTheme

/**
 * Vocabulary Spaced Repetition Practice Banner component delegating to TalkMeBannerCard.
 *
 * @param modifier Composable modifier.
 * @param title Banner heading title.
 * @param subtitle Banner subtitle description detailing practice time.
 * @param onClick Callback invoked when user taps the vocabulary practice card.
 */
@Composable
fun VocabularyBannerCard(
    modifier: Modifier = Modifier,
    title: String = stringResource(id = R.string.vocab_banner_title),
    subtitle: String = stringResource(id = R.string.vocab_banner_subtitle),
    onClick: () -> Unit = {},
) {
    TalkMeBannerCard(
        title = title,
        subtitle = subtitle,
        leadingIconRes = AppIcons.Repeat,
        containerColor = MaterialTheme.colorScheme.secondaryContainer,
        iconTint = MaterialTheme.colorScheme.secondary,
        onClick = onClick,
        modifier = modifier,
    )
}

@Preview(showBackground = true)
@Composable
fun VocabularyBannerCardPreview() {
    TalkMeTheme {
        VocabularyBannerCard()
    }
}
