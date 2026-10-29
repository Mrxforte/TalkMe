package com.example.talkme.presentation.screens.home

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.example.talkme.presentation.components.TalkMeBottomBar
import com.example.talkme.presentation.screens.home.components.CurrentLessonCard
import com.example.talkme.presentation.screens.home.components.GreetingHeader
import com.example.talkme.presentation.screens.home.components.HomeHeader
import com.example.talkme.presentation.screens.home.components.SkillSection
import com.example.talkme.presentation.screens.home.components.VocabularyBannerCard
import com.example.talkme.presentation.screens.home.components.WeeklyPlanSection
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.TalkMeTheme

/**
 * Main Home Dashboard Screen displaying streak counters, active lesson cards,
 * vocabulary practice banners, 4 skills modules, and weekly goals.
 *
 * @param onTabSelected Bottom bar tab selection handler.
 * @param modifier Composable layout modifier.
 * @param onAvatarClick User profile avatar click handler.
 * @param onContinueLessonClick Active lesson continue button click handler.
 * @param onVocabularyClick Vocabulary banner click handler.
 * @param onSkillClick Training skill card click handler.
 * @param onWeeklyTaskClick Weekly scenario task click handler.
 */
@Composable
fun HomeScreen(
    onTabSelected: (Int) -> Unit,
    modifier: Modifier = Modifier,
    onAvatarClick: () -> Unit = {},
    onContinueLessonClick: () -> Unit = {},
    onVocabularyClick: () -> Unit = {},
    onSkillClick: (String) -> Unit = {},
    onWeeklyTaskClick: () -> Unit = {},
) {
    val dimensions = LocalDimensions.current

    Scaffold(
        modifier = modifier.fillMaxSize(),
        bottomBar = {
            TalkMeBottomBar(
                selectedTab = 0,
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
            HomeHeader(
                onAvatarClick = onAvatarClick,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            GreetingHeader()

            Spacer(modifier = Modifier.height(dimensions.paddingExtraLarge))

            CurrentLessonCard(
                onContinueClick = onContinueLessonClick,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            VocabularyBannerCard(
                onClick = onVocabularyClick,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))

            SkillSection(
                onSkillClick = onSkillClick,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))

            WeeklyPlanSection(
                onTaskClick = onWeeklyTaskClick,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))
        }
    }
}

@Preview(showBackground = true)
@Composable
fun HomeScreenPreview() {
    TalkMeTheme {
        HomeScreen(onTabSelected = {})
    }
}
