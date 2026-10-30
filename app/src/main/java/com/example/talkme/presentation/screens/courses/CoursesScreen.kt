package com.example.talkme.presentation.screens.courses

import androidx.annotation.DrawableRes
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.talkme.R
import com.example.talkme.presentation.components.TalkMeBadge
import com.example.talkme.presentation.components.TalkMeBottomBar
import com.example.talkme.presentation.components.TalkMeCard
import com.example.talkme.presentation.components.TalkMeHeader
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.ContainerPurpleLight
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.TalkMeTheme

/**
 * Clean Courses Catalog Screen displaying "Mening kurslarim" title and a 2-Column Compact Grid of Grammar Category Cards.
 * Features PNG/JPEG background image support with contrast overlay containers and compact row/colspan padding.
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

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // ==========================================
            // COMPACT 2-COLUMN GRID GRAMMAR CARDS WITH BG PNG/JPEG ILLUSTRATION SUPPORT
            // ==========================================
            // Row 1: Ot (Nouns) & Sifat (Adjectives)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(dimensions.paddingSmall),
            ) {
                GrammarGridCard(
                    title = "Grammar fundamentals",
                    subtitle = "8 ta mavzu",
                    iconRes = AppIcons.Book,
                    bgImageRes = R.drawable.img, // Passing PNG/JPEG drawable resource ID
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

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // Row 2: Son (Numerals) & Fe'l va Zamonlar (Verbs & Tenses)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(dimensions.paddingSmall),
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

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // Row 3: Olmosh (Pronouns) & Predloglar (Prepositions)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(dimensions.paddingSmall),
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
 * Compact 2-Column Grid Card Component with PNG/JPEG Background Image Container.
 *
 * @param title Topic card title.
 * @param subtitle Subtopic count text.
 * @param iconRes Topic icon drawable.
 * @param onClick Click handler.
 * @param modifier Layout modifier.
 * @param bgImageRes Optional PNG or JPEG background image drawable resource ID.
 */
@Composable
fun GrammarGridCard(
    title: String,
    subtitle: String,
    iconRes: Int,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    @DrawableRes bgImageRes: Int? = null,
) {
    val dimensions = LocalDimensions.current

    val cardBgGradient = Brush.verticalGradient(
        colors = listOf(
            ContainerPurpleLight,
            MaterialTheme.colorScheme.surface,
        )
    )

    TalkMeCard(
        modifier = modifier.height(115.dp),
        onClick = onClick,
        containerColor = MaterialTheme.colorScheme.surface,
        cornerRadius = dimensions.cornerMedium,
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .clip(RoundedCornerShape(dimensions.cornerMedium))
                .background(cardBgGradient)
                .border(
                    width = dimensions.borderThin,
                    color = Color(0xFFE8F0FE),
                    shape = RoundedCornerShape(dimensions.cornerMedium)
                ),
            contentAlignment = Alignment.Center,
        ) {
            if (bgImageRes != null) {
                Image(
                    painter = painterResource(id = bgImageRes),
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.matchParentSize(),
                    alpha = 0.88f
                )

                // Protective soft contrast overlay for high-legibility text
                Box(
                    modifier = Modifier
                        .matchParentSize()
                        .background(
                            Brush.verticalGradient(
                                colors = listOf(
                                    Color.White.copy(alpha = 0.5f),
                                    Color.White.copy(alpha = 0.85f)
                                )
                            )
                        )
                )
            }

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(dimensions.paddingSmall),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center,
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center,
                ) {
                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .clip(RoundedCornerShape(dimensions.cornerSmall))
                            .background(MaterialTheme.colorScheme.primaryContainer),
                        contentAlignment = Alignment.Center,
                    ) {
                        Icon(
                            painter = painterResource(id = iconRes),
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(dimensions.iconMedium),
                        )
                    }

                    Spacer(modifier = Modifier.width(dimensions.paddingExtraSmall))

                    TalkMeBadge(
                        text = subtitle,
                        containerColor = MaterialTheme.colorScheme.surface,
                        textColor = MaterialTheme.colorScheme.primary,
                    )
                }

                Spacer(modifier = Modifier.height(dimensions.paddingExtraSmall))

                Text(
                    text = title,
                    style = AppTypography.CardTitle.copy(
                        fontSize = 13.sp,
                        color = MaterialTheme.colorScheme.onBackground,
                        fontWeight = FontWeight.Bold,
                    ),
                    textAlign = TextAlign.Center,
                    maxLines = 2,
                )
            }
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
