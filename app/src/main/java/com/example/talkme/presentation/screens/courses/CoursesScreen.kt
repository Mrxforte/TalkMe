package com.example.talkme.presentation.screens.courses

import androidx.compose.foundation.background
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.talkme.presentation.components.TalkMeBottomBar
import com.example.talkme.presentation.components.TalkMeCard
import com.example.talkme.presentation.components.TalkMeHeader
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.TalkMeTheme

/**
 * Clean Courses Catalog Screen displaying "Mening kurslarim" title and a 2-Column Grid of Grammar Category Cards.
 * Features prominent visual icon illustrations and subtopic topic counts in a clean 2-column layout.
 *
 * @param onTabSelected Bottom navigation tab callback handler.
 * @param modifier Composable layout modifier.
 * @param onBackClick Back navigation click callback.
 * @param onSearchClick Search lens click callback.
 * @param onSubtopicClick Clickable subtopic card callback handler.
 */
@Composable
fun CoursesScreen(
    onTabSelected: (Int) -> Unit,
    modifier: Modifier = Modifier,
    onBackClick: () -> Unit = {},
    onSearchClick: () -> Unit = {},
    onSubtopicClick: (String) -> Unit = {},
) {
    val dimensions = LocalDimensions.current

    Scaffold(
        modifier = modifier.fillMaxSize(),
        bottomBar = {
            TalkMeBottomBar(
                selectedTab = 1,
                onTabSelected = onTabSelected,
            )
        },
        containerColor = MaterialTheme.colorScheme.background,
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = dimensions.paddingExtraLarge),
        ) {
            // Header with Title "Mening kurslarim" and Search Lens Icon
            TalkMeHeader(
                title = "Mening kurslarim",
                subtitle = "Ingliz tili grammatika bo'limlari",
                onBackClick = onBackClick,
                trailingContent = {
                    IconButton(
                        onClick = onSearchClick,
                        modifier = Modifier.size(dimensions.avatarSize),
                    ) {
                        Icon(
                            painter = painterResource(id = AppIcons.Search),
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(dimensions.iconMedium),
                        )
                    }
                },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // ==========================================
            // 2-COLUMN GRID GRAMMAR CATEGORY CARDS
            // ==========================================
            // Row 1: Ot (Nouns) & Sifat (Adjectives)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(dimensions.paddingMedium),
            ) {
                GrammarGridCard(
                    title = "Ot (Nouns)",
                    subtitle = "8 ta mavzu",
                    iconRes = AppIcons.Book,
                    onClick = { onSubtopicClick("nouns") },
                    modifier = Modifier.weight(1f),
                )

                GrammarGridCard(
                    title = "Sifat (Adjectives)",
                    subtitle = "6 ta mavzu",
                    iconRes = AppIcons.Edit,
                    onClick = { onSubtopicClick("adjectives") },
                    modifier = Modifier.weight(1f),
                )
            }

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // Row 2: Son (Numerals) & Fe'l va Zamonlar (Verbs & Tenses)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(dimensions.paddingMedium),
            ) {
                GrammarGridCard(
                    title = "Son (Numerals)",
                    subtitle = "5 ta mavzu",
                    iconRes = AppIcons.Results,
                    onClick = { onSubtopicClick("numerals") },
                    modifier = Modifier.weight(1f),
                )

                GrammarGridCard(
                    title = "Fe'l va Zamonlar",
                    subtitle = "12 ta mavzu",
                    iconRes = AppIcons.Fire,
                    onClick = { onSubtopicClick("verbs") },
                    modifier = Modifier.weight(1f),
                )
            }

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // Row 3: Olmosh (Pronouns) & Predloglar (Prepositions)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(dimensions.paddingMedium),
            ) {
                GrammarGridCard(
                    title = "Olmosh (Pronouns)",
                    subtitle = "7 ta mavzu",
                    iconRes = AppIcons.Chat,
                    onClick = { onSubtopicClick("pronouns") },
                    modifier = Modifier.weight(1f),
                )

                GrammarGridCard(
                    title = "Predloglar",
                    subtitle = "9 ta mavzu",
                    iconRes = AppIcons.Search,
                    onClick = { onSubtopicClick("prepositions") },
                    modifier = Modifier.weight(1f),
                )
            }

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))
        }
    }
}

/**
 * 2-Column Grid Card Component featuring prominent visual icon illustration and subtopic count.
 */
@Composable
fun GrammarGridCard(
    title: String,
    subtitle: String,
    iconRes: Int,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val dimensions = LocalDimensions.current

    TalkMeCard(
        modifier = modifier,
        onClick = onClick,
        containerColor = MaterialTheme.colorScheme.surface,
        cornerRadius = dimensions.cornerLarge,
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(dimensions.paddingSmall),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .clip(RoundedCornerShape(dimensions.cornerLarge))
                    .background(MaterialTheme.colorScheme.primaryContainer),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    painter = painterResource(id = iconRes),
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(dimensions.iconExtraLarge),
                )
            }

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            Text(
                text = title,
                style = AppTypography.CardTitle.copy(
                    color = MaterialTheme.colorScheme.onBackground,
                    fontWeight = FontWeight.Bold,
                ),
                textAlign = TextAlign.Center,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingMicro))

            Text(
                text = subtitle,
                style = AppTypography.CardSubtitle.copy(
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                ),
                textAlign = TextAlign.Center,
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun CoursesScreenPreview() {
    TalkMeTheme {
        CoursesScreen(onTabSelected = {})
    }
}
