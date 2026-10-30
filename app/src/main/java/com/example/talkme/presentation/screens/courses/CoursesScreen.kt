package com.example.talkme.presentation.screens.courses

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.talkme.R
import com.example.talkme.presentation.components.TalkMeBadge
import com.example.talkme.presentation.components.TalkMeBottomBar
import com.example.talkme.presentation.components.TalkMeButton
import com.example.talkme.presentation.components.TalkMeCard
import com.example.talkme.presentation.components.TalkMeHeader
import com.example.talkme.presentation.components.TalkMeSubtopicCard
import com.example.talkme.presentation.components.TalkMeTabRow
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.ContainerGreenLight
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.SuccessGreen
import com.example.talkme.ui.theme.TalkMeTheme

/**
 * Pixel-Perfect Courses Catalog Screen matching design specifications from Untitled.pdf Page 2.
 * Displays CEFR Level Path, Category Filter Tabs, Individual Grammar Topic Cards (Ot, Sifat, Son, Fe'l, Olmosh, Predloglar),
 * Module 1 Clickable Subtopic Cards with rounded purple indicator dots, and Sticky Action Button.
 *
 * @param onTabSelected Bottom navigation tab callback handler.
 * @param modifier Composable layout modifier.
 * @param onBackClick Back navigation click callback.
 * @param onSearchClick Search lens click callback.
 * @param onSubtopicClick Clickable subtopic card callback handler.
 * @param onContinueCatalogClick Continue grammar catalog button click callback.
 */
@Composable
fun CoursesScreen(
    onTabSelected: (Int) -> Unit,
    modifier: Modifier = Modifier,
    onBackClick: () -> Unit = {},
    onSearchClick: () -> Unit = {},
    onSubtopicClick: (String) -> Unit = {},
    onContinueCatalogClick: () -> Unit = {},
) {
    val dimensions = LocalDimensions.current

    var selectedCefrIndex by remember { mutableIntStateOf(1) } // Default: A2
    var selectedCategoryIndex by remember { mutableIntStateOf(0) } // Default: Grammatika

    val cefrLevels = listOf("A1", "A2", "B1", "B2", "C1", "C2")
    val categories = listOf(
        stringResource(id = R.string.tab_grammar),
        stringResource(id = R.string.tab_vocabulary),
        stringResource(id = R.string.tab_pronunciation),
        stringResource(id = R.string.tab_skills),
    )

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
            // Header with Back Button and Search Lens Icon
            TalkMeHeader(
                title = stringResource(id = R.string.my_course_title),
                subtitle = stringResource(id = R.string.cefr_path_subtitle),
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

            // CEFR Level Row
            CefrLevelSelectorRow(
                levels = cefrLevels,
                selectedIndex = selectedCefrIndex,
                onLevelSelected = { selectedCefrIndex = it },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // Active CEFR Level Info Text
            Text(
                text = stringResource(id = R.string.a2_description),
                style = AppTypography.CardSubtitle.copy(
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                ),
            )

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // Category Tab Selector
            TalkMeTabRow(
                tabs = categories,
                selectedIndex = selectedCategoryIndex,
                onTabSelected = { selectedCategoryIndex = it },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))

            // Section Tag & Catalog Title
            Text(
                text = stringResource(id = R.string.grammar_catalog_tag),
                style = AppTypography.LessonTag.copy(
                    color = MaterialTheme.colorScheme.primary,
                ),
            )

            Spacer(modifier = Modifier.height(dimensions.paddingMicro))

            Text(
                text = stringResource(id = R.string.grammar_catalog_heading),
                style = AppTypography.GreetingTitle.copy(
                    color = MaterialTheme.colorScheme.onBackground,
                ),
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            Text(
                text = stringResource(id = R.string.grammar_catalog_desc),
                style = AppTypography.CardSubtitle.copy(
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                ),
            )

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // ==========================================
            // GRAMMAR PARTS OF SPEECH INDIVIDUAL CARDS
            // (Ot, Sifat, Son, Fe'l va Zamonlar, Olmosh, Predloglar)
            // ==========================================
            Text(
                text = "Grammatika Bo'limlari (Parts of Speech)",
                style = AppTypography.SectionTitle.copy(
                    color = MaterialTheme.colorScheme.onBackground,
                ),
            )

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // 1. Ot (Nouns) Card
            GrammarCategoryCard(
                title = "Ot (Nouns)",
                subtitle = "Birlik va ko'plik · Sanaladigan va sanalmaydigan otlar",
                tagText = "GRAMMATIKA · 8 MAVZU",
                iconRes = AppIcons.Book,
                onClick = { onSubtopicClick("nouns") },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // 2. Sifat (Adjectives) Card
            GrammarCategoryCard(
                title = "Sifat (Adjectives)",
                subtitle = "Sifat darajalari · Qiyosiy va ortirma daraja",
                tagText = "GRAMMATIKA · 6 MAVZU",
                iconRes = AppIcons.Edit,
                onClick = { onSubtopicClick("adjectives") },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // 3. Son (Numerals) Card
            GrammarCategoryCard(
                title = "Son (Numerals)",
                subtitle = "Sanoq va tartib sonlar · Sanalar va vaqt",
                tagText = "GRAMMATIKA · 5 MAVZU",
                iconRes = AppIcons.Results,
                onClick = { onSubtopicClick("numerals") },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // 4. Fe'l va Zamonlar (Verbs & Tenses) Card
            GrammarCategoryCard(
                title = "Fe'l va Zamonlar (Verbs & Tenses)",
                subtitle = "Hozirgi, o'tgan va kelasi zamon shakllari",
                tagText = "GRAMMATIKA · 12 MAVZU",
                iconRes = AppIcons.Fire,
                onClick = { onSubtopicClick("verbs") },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // 5. Olmosh (Pronouns) Card
            GrammarCategoryCard(
                title = "Olmosh (Pronouns)",
                subtitle = "Kishilik, egalik va ko'rsatkich olmoshlari",
                tagText = "GRAMMATIKA · 7 MAVZU",
                iconRes = AppIcons.Chat,
                onClick = { onSubtopicClick("pronouns") },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // 6. Ravish va Predloglar (Adverbs & Prepositions) Card
            GrammarCategoryCard(
                title = "Ravish va Predloglar (Prepositions)",
                subtitle = "O'rin va vaqt predloglari · in, on, at",
                tagText = "GRAMMATIKA · 9 MAVZU",
                iconRes = AppIcons.Search,
                onClick = { onSubtopicClick("prepositions") },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))

            // Expanded Module 1 Card Container
            TalkMeCard(
                containerColor = MaterialTheme.colorScheme.surface,
                cornerRadius = dimensions.cornerLarge,
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(
                            text = stringResource(id = R.string.module_1_tag),
                            style = AppTypography.LessonTag.copy(
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            ),
                        )

                        TalkMeBadge(
                            text = stringResource(id = R.string.module_1_count),
                            containerColor = MaterialTheme.colorScheme.primaryContainer,
                            textColor = MaterialTheme.colorScheme.primary,
                        )
                    }

                    Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                    Text(
                        text = stringResource(id = R.string.module_1_title),
                        style = AppTypography.LessonTitle.copy(
                            color = MaterialTheme.colorScheme.onBackground,
                        ),
                    )

                    Spacer(modifier = Modifier.height(dimensions.paddingMedium))

                    // Clickable Subtopic Cards Breakdown with rounded purple indicator dots
                    TalkMeSubtopicCard(
                        text = stringResource(id = R.string.module_1_bullet_1),
                        onClick = { onSubtopicClick("subtopic_1") },
                    )
                    Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                    TalkMeSubtopicCard(
                        text = stringResource(id = R.string.module_1_bullet_2),
                        onClick = { onSubtopicClick("subtopic_2") },
                    )
                    Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                    TalkMeSubtopicCard(
                        text = stringResource(id = R.string.module_1_bullet_3),
                        onClick = { onSubtopicClick("subtopic_3") },
                    )
                    Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                    TalkMeSubtopicCard(
                        text = stringResource(id = R.string.module_1_bullet_4),
                        onClick = { onSubtopicClick("subtopic_4") },
                    )
                    Spacer(modifier = Modifier.height(dimensions.paddingSmall))

                    TalkMeSubtopicCard(
                        text = stringResource(id = R.string.module_1_bullet_5),
                        onClick = { onSubtopicClick("subtopic_5") },
                    )
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))

            // Action Button
            TalkMeButton(
                text = stringResource(id = R.string.continue_grammar_catalog_btn),
                trailingIconRes = AppIcons.ChevronRight,
                onClick = onContinueCatalogClick,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // Footer Catalog Progress Note
            Text(
                text = stringResource(id = R.string.catalog_footer_note),
                style = AppTypography.CardSubtitle.copy(
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                ),
            )

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))
        }
    }
}

/**
 * Dedicated Grammar Parts of Speech Category Card with Iconography and Subtopic Count Tag.
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

/**
 * Custom CEFR Level Selector Row component.
 */
@Composable
fun CefrLevelSelectorRow(
    levels: List<String>,
    selectedIndex: Int,
    onLevelSelected: (Int) -> Unit,
    modifier: Modifier = Modifier,
) {
    val dimensions = LocalDimensions.current

    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(dimensions.paddingSmall),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        levels.forEachIndexed { index, level ->
            val isSelected = index == selectedIndex
            val isCompleted = index < selectedIndex

            val containerColor = when {
                isSelected -> MaterialTheme.colorScheme.primary
                isCompleted -> ContainerGreenLight
                else -> MaterialTheme.colorScheme.surface
            }

            val textColor = when {
                isSelected -> MaterialTheme.colorScheme.onPrimary
                isCompleted -> SuccessGreen
                else -> MaterialTheme.colorScheme.onSurfaceVariant
            }

            val borderColor = when {
                isSelected -> MaterialTheme.colorScheme.primary
                isCompleted -> SuccessGreen
                else -> MaterialTheme.colorScheme.outline
            }

            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(dimensions.cornerSmall))
                    .background(containerColor)
                    .border(dimensions.borderThin, borderColor, RoundedCornerShape(dimensions.cornerSmall))
                    .clickable { onLevelSelected(index) }
                    .padding(vertical = dimensions.paddingMedium),
                contentAlignment = Alignment.Center,
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Text(
                        text = level,
                        style = AppTypography.CardTitle.copy(
                            color = textColor,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                        ),
                    )

                    if (isSelected) {
                        Spacer(modifier = Modifier.height(dimensions.paddingMicro))
                        Box(
                            modifier = Modifier
                                .width(dimensions.paddingMedium)
                                .height(dimensions.paddingMicro)
                                .background(MaterialTheme.colorScheme.onPrimary),
                        )
                    }
                }
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
