package com.talkme.presentation.screens.courses

import androidx.annotation.StringRes
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import com.talkme.R
import com.talkme.presentation.components.TalkMeHeader
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.LocalDimensions

private data class CourseCatalogItem(
    val courseId: String,
    val lessonId: String,
    @StringRes val titleRes: Int,
    @StringRes val subtitleRes: Int,
    @StringRes val metaRes: Int,
    val progress: Float,
    val isBeginner: Boolean
)

/**
 * Clean 2-Column Grid Grammar Category Catalog Screen (`CoursesScreen.kt`)
 * per Section 2 Item 4 of PROJECT_RULES.md.
 */
@Composable
fun CoursesScreen(
    onBackClick: (() -> Unit)? = null,
    onCourseSelected: (courseId: String, lessonId: String) -> Unit = { _, _ -> },
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current
    var selectedFilterIndex by remember { mutableIntStateOf(0) }

    val allCourses = remember {
        listOf(
            CourseCatalogItem(
                courseId = "course_a0_numbers",
                lessonId = "lesson_numbers_1",
                titleRes = R.string.course_1_title,
                subtitleRes = R.string.course_1_subtitle,
                metaRes = R.string.course_1_meta,
                progress = 0.65f,
                isBeginner = true
            ),
            CourseCatalogItem(
                courseId = "course_a1_to_be",
                lessonId = "lesson_to_be_1",
                titleRes = R.string.course_2_title,
                subtitleRes = R.string.course_2_subtitle,
                metaRes = R.string.course_2_meta,
                progress = 0.40f,
                isBeginner = true
            ),
            CourseCatalogItem(
                courseId = "course_a1_present_simple",
                lessonId = "lesson_present_simple_1",
                titleRes = R.string.course_3_title,
                subtitleRes = R.string.course_3_subtitle,
                metaRes = R.string.course_3_meta,
                progress = 0.25f,
                isBeginner = true
            ),
            CourseCatalogItem(
                courseId = "course_a1_articles",
                lessonId = "lesson_articles_1",
                titleRes = R.string.course_4_title,
                subtitleRes = R.string.course_4_subtitle,
                metaRes = R.string.course_4_meta,
                progress = 0.15f,
                isBeginner = true
            ),
            CourseCatalogItem(
                courseId = "course_a2_prepositions",
                lessonId = "lesson_prepositions_1",
                titleRes = R.string.course_5_title,
                subtitleRes = R.string.course_5_subtitle,
                metaRes = R.string.course_5_meta,
                progress = 0.10f,
                isBeginner = false
            ),
            CourseCatalogItem(
                courseId = "course_a2_past_simple",
                lessonId = "lesson_past_simple_1",
                titleRes = R.string.course_6_title,
                subtitleRes = R.string.course_6_subtitle,
                metaRes = R.string.course_6_meta,
                progress = 0.0f,
                isBeginner = false
            )
        )
    }

    val filteredCourses = remember(selectedFilterIndex, allCourses) {
        when (selectedFilterIndex) {
            1 -> allCourses.filter { it.isBeginner }
            2 -> allCourses.filter { !it.isBeginner }
            else -> allCourses
        }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(horizontal = dims.spaceLarge)
    ) {
        TalkMeHeader(
            title = stringResource(R.string.courses_screen_title),
            subtitle = stringResource(R.string.courses_screen_subtitle),
            onBackClick = onBackClick
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = dims.spaceSmall),
            horizontalArrangement = Arrangement.spacedBy(dims.spaceSmall)
        ) {
            val filterLabels = listOf(
                R.string.courses_filter_all,
                R.string.courses_filter_beginner,
                R.string.courses_filter_elementary
            )
            filterLabels.forEachIndexed { index, labelRes ->
                FilterChip(
                    selected = selectedFilterIndex == index,
                    onClick = { selectedFilterIndex = index },
                    label = {
                        Text(
                            text = stringResource(labelRes),
                            style = AppTypography.LabelMedium
                        )
                    }
                )
            }
        }

        // Clean 2-Column Grid Grammar Category Catalog
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(vertical = dims.spaceMedium),
            horizontalArrangement = Arrangement.spacedBy(dims.spaceMedium),
            verticalArrangement = Arrangement.spacedBy(dims.spaceMedium)
        ) {
            items(filteredCourses, key = { it.courseId }) { course ->
                CourseGridCard(
                    item = course,
                    onClick = { onCourseSelected(course.courseId, course.lessonId) }
                )
            }
        }
    }
}

@Composable
private fun CourseGridCard(
    item: CourseCatalogItem,
    onClick: () -> Unit
) {
    val dims = LocalDimensions.current

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(
                width = dims.borderThin,
                color = MaterialTheme.colorScheme.outline,
                shape = RoundedCornerShape(dims.radiusLarge)
            )
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(dims.radiusLarge),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(dims.spaceLarge),
            verticalArrangement = Arrangement.spacedBy(dims.spaceSmall)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(dims.iconButtonSize)
                        .clip(CircleShape)
                        .background(MaterialTheme.colorScheme.primaryContainer),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = AppIcons.Layers,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(dims.iconMedium)
                    )
                }

                Text(
                    text = stringResource(item.metaRes),
                    style = AppTypography.LabelSmall,
                    color = MaterialTheme.colorScheme.primary
                )
            }

            Text(
                text = stringResource(item.titleRes),
                style = AppTypography.TitleMedium,
                color = MaterialTheme.colorScheme.onSurface
            )

            Text(
                text = stringResource(item.subtitleRes),
                style = AppTypography.BodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            LinearProgressIndicator(
                progress = { item.progress },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(dims.progressBarHeight)
                    .clip(RoundedCornerShape(dims.radiusFull)),
                color = MaterialTheme.colorScheme.primary,
                trackColor = MaterialTheme.colorScheme.surfaceVariant
            )
        }
    }
}
