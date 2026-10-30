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
import androidx.compose.foundation.layout.width
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
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.talkme.R
import com.example.talkme.presentation.components.TalkMeBottomBar
import com.example.talkme.presentation.components.TalkMeCard
import com.example.talkme.presentation.components.TalkMeHeader
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.TalkMeTheme

/**
 * Clean Courses Catalog Screen displaying "Mening kurslarim" title and dedicated Grammar Category Cards.
 * All unneeded CEFR rows, level selectors, and redundant paragraphs have been completely removed.
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
            // GRAMMAR CATEGORY CARDS (ONLY THESE CARDS)
            // ==========================================
            GrammarCategoryCard(
                title = "Ot (Nouns)",
                subtitle = "Birlik va ko'plik · Sanaladigan va sanalmaydigan otlar",
                tagText = "GRAMMATIKA · 8 MAVZU",
                iconRes = AppIcons.Book,
                onClick = { onSubtopicClick("nouns") },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            GrammarCategoryCard(
                title = "Sifat (Adjectives)",
                subtitle = "Sifat darajalari · Qiyosiy va ortirma daraja",
                tagText = "GRAMMATIKA · 6 MAVZU",
                iconRes = AppIcons.Edit,
                onClick = { onSubtopicClick("adjectives") },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            GrammarCategoryCard(
                title = "Son (Numerals)",
                subtitle = "Sanoq va tartib sonlar · Sanalar va vaqt",
                tagText = "GRAMMATIKA · 5 MAVZU",
                iconRes = AppIcons.Results,
                onClick = { onSubtopicClick("numerals") },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            GrammarCategoryCard(
                title = "Fe'l va Zamonlar (Verbs & Tenses)",
                subtitle = "Hozirgi, o'tgan va kelasi zamon shakllari",
                tagText = "GRAMMATIKA · 12 MAVZU",
                iconRes = AppIcons.Fire,
                onClick = { onSubtopicClick("verbs") },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            GrammarCategoryCard(
                title = "Olmosh (Pronouns)",
                subtitle = "Kishilik, egalik va ko'rsatkich olmoshlari",
                tagText = "GRAMMATIKA · 7 MAVZU",
                iconRes = AppIcons.Chat,
                onClick = { onSubtopicClick("pronouns") },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            GrammarCategoryCard(
                title = "Ravish va Predloglar (Prepositions)",
                subtitle = "O'rin va vaqt predloglari · in, on, at",
                tagText = "GRAMMATIKA · 9 MAVZU",
                iconRes = AppIcons.Search,
                onClick = { onSubtopicClick("prepositions") },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))
        }
    }
}

/**
 * Dedicated Grammar Category Card with Iconography and Subtopic Count Tag.
 */
@Composable
fun GrammarCategoryCard(
    title: String,
    subtitle: String,
    tagText: String,
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
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Row(
                modifier = Modifier.weight(1f),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(RoundedCornerShape(dimensions.cornerMedium))
                        .background(MaterialTheme.colorScheme.primaryContainer),
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(
                        painter = painterResource(id = iconRes),
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(dimensions.iconLarge),
                    )
                }

                Spacer(modifier = Modifier.width(dimensions.paddingMedium))

                Column {
                    Text(
                        text = tagText,
                        style = AppTypography.LessonTag.copy(
                            color = MaterialTheme.colorScheme.primary,
                        ),
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingMicro))

                    Text(
                        text = title,
                        style = AppTypography.CardTitle.copy(
                            color = MaterialTheme.colorScheme.onBackground,
                            fontWeight = FontWeight.Bold,
                        ),
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingMicro))

                    Text(
                        text = subtitle,
                        style = AppTypography.CardSubtitle.copy(
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        ),
                    )
                }
            }

            Icon(
                painter = painterResource(id = AppIcons.ChevronRight),
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(dimensions.iconMedium),
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
