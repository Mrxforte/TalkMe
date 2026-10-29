package com.example.talkme.presentation.screens.results

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import com.example.talkme.R
import com.example.talkme.presentation.components.TalkMeBottomBar
import com.example.talkme.presentation.components.TalkMeCard
import com.example.talkme.presentation.components.TalkMeHeader
import com.example.talkme.presentation.components.TalkMeOptionCard
import com.example.talkme.presentation.components.TalkMeTabRow
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.TalkMeTheme

/**
 * Leaderboard & Learning Results Screen displaying weekly and overall user rankings.
 * Reuses TalkMeHeader, TalkMeTabRow, TalkMeOptionCard, TalkMeCard, and TalkMeBottomBar.
 *
 * @param onTabSelected Bottom navigation tab selection handler.
 * @param modifier Composable layout modifier.
 */
@Composable
fun ResultsScreen(
    onTabSelected: (Int) -> Unit,
    modifier: Modifier = Modifier,
) {
    val dimensions = LocalDimensions.current

    var selectedTabIndex by remember { mutableIntStateOf(0) } // Default: Bu hafta
    val tabs = listOf(
        stringResource(id = R.string.tab_this_week),
        stringResource(id = R.string.tab_all_time),
    )

    Scaffold(
        modifier = modifier.fillMaxSize(),
        bottomBar = {
            TalkMeBottomBar(
                selectedTab = 3,
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
            TalkMeHeader(
                title = stringResource(id = R.string.leaderboard_title),
                subtitle = stringResource(id = R.string.leaderboard_subtitle),
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // Timeframe Tab Selector
            TalkMeTabRow(
                tabs = tabs,
                selectedIndex = selectedTabIndex,
                onTabSelected = { selectedTabIndex = it },
            )

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // Subtitle Note
            Text(
                text = stringResource(id = R.string.leaderboard_header_note),
                style = AppTypography.CardSubtitle.copy(
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                ),
            )

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // Leaders Ranking List Items using reusable TalkMeOptionCard
            TalkMeOptionCard(
                leadingText = "1",
                title = "Madina",
                subtitle = "12 kunlik seriya",
                trailingBadgeText = "360 XP",
                isSelected = false,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            TalkMeOptionCard(
                leadingText = "2",
                title = "Sardor",
                subtitle = "9 kunlik seriya",
                trailingBadgeText = "320 XP",
                isSelected = false,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            TalkMeOptionCard(
                leadingText = "3",
                title = "Dilnoza",
                subtitle = "8 kunlik seriya",
                trailingBadgeText = "280 XP",
                isSelected = false,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // Current User Item Highlighted
            TalkMeOptionCard(
                leadingText = "4",
                title = "Aziz (Siz)",
                subtitle = "7 kunlik seriya",
                trailingBadgeText = "240 XP",
                isSelected = true,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            TalkMeOptionCard(
                leadingText = "5",
                title = "Javohir",
                subtitle = "5 kunlik seriya",
                trailingBadgeText = "200 XP",
                isSelected = false,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            TalkMeOptionCard(
                leadingText = "6",
                title = "Malika",
                subtitle = "4 kunlik seriya",
                trailingBadgeText = "220 XP",
                isSelected = false,
            )

            Spacer(modifier = Modifier.height(dimensions.paddingLarge))

            // Motivational Footer Banner
            TalkMeCard(
                containerColor = MaterialTheme.colorScheme.primaryContainer,
                borderColor = MaterialTheme.colorScheme.primary,
            ) {
                Text(
                    text = stringResource(id = R.string.leaderboard_motivation),
                    style = AppTypography.CardSubtitle.copy(
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.SemiBold,
                    ),
                )
            }

            Spacer(modifier = Modifier.height(dimensions.paddingHuge))
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ResultsScreenPreview() {
    TalkMeTheme {
        ResultsScreen(onTabSelected = {})
    }
}
