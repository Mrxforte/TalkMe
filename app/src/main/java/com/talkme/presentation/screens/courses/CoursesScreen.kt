package com.talkme.presentation.screens.courses

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material3.Icon
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.talkme.presentation.components.CourseCategoryIllustration
import com.talkme.presentation.components.TalkMeBottomBar
import com.talkme.presentation.components.TalkMeBottomTab
import com.talkme.presentation.components.TalkMeHeader
import com.talkme.presentation.state.GrammarCategoryUiModel
import com.talkme.presentation.state.TalkMeAppState
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.LocalDimensions
import com.talkme.ui.theme.TalkMeColors

/**
 * Pixel-perfect migration of `src/screens/CoursesScreen.tsx`:
 * - Top `TalkMeHeader` (`"Mening kurslarim"` + `"Ingliz tili grammatika bo‘limlari"` + trailing `Layers` circle button)
 * - Live search bar (`"Grammatika bo‘limlarini izlash..."`)
 * - Purple gradient catalog banner (`"CEFR A2 DASTURI"` • `"Duolingo Uslubidagi Bosqichlar 🦉"`)
 * - 2-Column Ozon-Style Product Cards Grid for all 11 grammar categories with 4:5 custom vector illustration,
 *   topic count badge, title, subtitle, and `"O‘rganish ->"` footer
 * - `TalkMeBottomBar` pinned at bottom
 */
@Composable
fun CoursesScreen(
    onBackClick: (() -> Unit)? = null,
    onCourseSelected: (courseId: String, lessonId: String) -> Unit = { _, _ -> },
    onNavigateHome: () -> Unit = {},
    onNavigateRepeat: () -> Unit = {},
    onNavigateProfile: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current
    var searchQuery by remember { mutableStateOf("") }

    val allCategories = TalkMeAppState.grammarCategories
    val filteredCategories = remember(searchQuery, allCategories) {
        if (searchQuery.isBlank()) {
            allCategories
        } else {
            allCategories.filter {
                it.title.contains(searchQuery, ignoreCase = true) ||
                    it.subtitle.contains(searchQuery, ignoreCase = true)
            }
        }
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        containerColor = Color(0xFFFAFAFC),
        bottomBar = {
            TalkMeBottomBar(
                activeTab = TalkMeBottomTab.COURSES,
                onSelectTab = { tab ->
                    when (tab) {
                        TalkMeBottomTab.HOME -> onNavigateHome()
                        TalkMeBottomTab.COURSES -> Unit
                        TalkMeBottomTab.REPEAT -> onNavigateRepeat()
                        TalkMeBottomTab.PROFILE -> onNavigateProfile()
                    }
                }
            )
        }
    ) { innerPadding ->
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            contentPadding = PaddingValues(
                horizontal = dims.screenPaddingHorizontal,
                vertical = dims.spaceLarge
            ),
            horizontalArrangement = Arrangement.spacedBy(14.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // 1. Header
            item(span = { GridItemSpan(2) }) {
                TalkMeHeader(
                    title = "Mening kurslarim",
                    subtitle = "Ingliz tili grammatika bo‘limlari",
                    onBackClick = onBackClick,
                    trailingContent = {
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(CircleShape)
                                .background(Color.White)
                                .border(1.dp, Color(0xFFF0EFF5), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = AppIcons.Layers,
                                contentDescription = null,
                                tint = TalkMeColors.PrimaryPurple,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                )
            }

            // 2. Search Input
            item(span = { GridItemSpan(2) }) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(44.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color.White)
                        .border(1.dp, Color(0xFFF0EFF5), RoundedCornerShape(12.dp))
                        .padding(horizontal = 14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Icon(
                        imageVector = AppIcons.Search,
                        contentDescription = null,
                        tint = TalkMeColors.TextMuted,
                        modifier = Modifier.size(16.dp)
                    )
                    Box(modifier = Modifier.weight(1f)) {
                        if (searchQuery.isEmpty()) {
                            Text(
                                text = "Grammatika bo‘limlarini izlash...",
                                style = AppTypography.BodyMedium,
                                color = TalkMeColors.TextMuted
                            )
                        }
                        BasicTextField(
                            value = searchQuery,
                            onValueChange = { searchQuery = it },
                            singleLine = true,
                            textStyle = AppTypography.BodyMedium.copy(color = TalkMeColors.TextPrimary),
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            }

            // 3. CEFR A2 Duolingo-Style Catalog Banner
            item(span = { GridItemSpan(2) }) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(
                            Brush.horizontalGradient(
                                listOf(TalkMeColors.PrimaryPurple, Color(0xFF7C4DFF))
                            )
                        )
                        .padding(16.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "CEFR A2 DASTURI",
                                style = AppTypography.BadgeMicro.copy(
                                    letterSpacing = 1.2.sp,
                                    fontWeight = FontWeight.ExtraBold
                                ),
                                color = Color.White.copy(alpha = 0.72f)
                            )
                            Text(
                                text = "Duolingo Uslubidagi Bosqichlar",
                                style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.ExtraBold),
                                color = Color.White
                            )
                        }
                        Text(
                            text = "🦉",
                            fontSize = 26.sp
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Har bir bo‘lim interaktiv xarita, 3D bosqich tugmalari va testlar bilan jihozlangan.",
                        style = AppTypography.LabelMedium,
                        color = Color.White.copy(alpha = 0.85f)
                    )
                }
            }

            // 4. 2-Column Ozon-Style Product Cards Grid
            items(filteredCategories, key = { it.id }) { cat ->
                OzonStyleCategoryCard(
                    category = cat,
                    onClick = {
                        val defaultLesson = if (cat.id == "grammar_fundamentals") {
                            "lesson_01_hello_a0"
                        } else {
                            "lesson_present_continuous"
                        }
                        onCourseSelected(cat.id, defaultLesson)
                    }
                )
            }
        }
    }
}

@Composable
private fun OzonStyleCategoryCard(
    category: GrammarCategoryUiModel,
    onClick: () -> Unit
) {
    val cardShape = RoundedCornerShape(16.dp)
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(cardShape)
            .background(Color.White)
            .border(
                1.dp,
                if (category.hasSubtopics) TalkMeColors.PrimaryPurple else Color(0xFFEBE8F3),
                cardShape
            )
            .clickable(onClick = onClick)
    ) {
        // 4:5 Illustration Container
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(0.85f)
                .background(category.bgTint),
            contentAlignment = Alignment.Center
        ) {
            CourseCategoryIllustration(
                categoryId = category.illustrationId,
                accentColor = category.accentColor
            )
            if (category.hasSubtopics) {
                Box(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(8.dp)
                        .clip(RoundedCornerShape(6.dp))
                        .background(TalkMeColors.SecondaryTeal)
                        .padding(horizontal = 8.dp, vertical = 3.dp)
                ) {
                    Text(
                        text = "FAOL XARITA",
                        style = AppTypography.BadgeMicro.copy(fontSize = 9.sp),
                        color = Color.White
                    )
                }
            }
        }

        // Bottom Product Info Section (Ozon-Style)
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(20.dp)
                            .clip(RoundedCornerShape(6.dp))
                            .background(Color(0xFFF4F1FA)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = AppIcons.BookOpen,
                            contentDescription = null,
                            tint = category.accentColor,
                            modifier = Modifier.size(12.dp)
                        )
                    }
                    Text(
                        text = category.topicsCount,
                        style = AppTypography.BadgeMicro.copy(fontSize = 11.sp),
                        color = TalkMeColors.PrimaryPurple
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))

                Text(
                    text = category.title,
                    style = AppTypography.TitleMedium.copy(
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    ),
                    color = TalkMeColors.TextPrimary,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                Text(
                    text = category.subtitle,
                    style = AppTypography.LabelSmall,
                    color = Color(0xFF6B7280),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(
                        width = 0.5.dp,
                        color = Color(0xFFF2F1F6),
                        shape = RoundedCornerShape(4.dp)
                    )
                    .padding(top = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "O‘rganish",
                    style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.Bold),
                    color = TalkMeColors.PrimaryPurple
                )
                Box(
                    modifier = Modifier
                        .size(24.dp)
                        .clip(CircleShape)
                        .background(Color(0xFFF4F1FA)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = AppIcons.ArrowForward,
                        contentDescription = null,
                        tint = TalkMeColors.PrimaryPurple,
                        modifier = Modifier.size(14.dp)
                    )
                }
            }
        }
    }
}
