package com.example.talkme.presentation.screens.home.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.HorizontalDivider
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
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions
import com.example.talkme.ui.theme.TalkMeTheme

/**
 * Bottom Navigation Bar component for primary section switching.
 *
 * @param modifier Composable modifier.
 * @param selectedTab Index of currently selected tab (0: Home, 1: Courses, 2: Repeat, 3: Results).
 * @param onTabSelected Callback invoked when user selects a tab index.
 */
@Composable
fun HomeBottomBar(
    modifier: Modifier = Modifier,
    selectedTab: Int = 0,
    onTabSelected: (Int) -> Unit = {},
) {
    val dimensions = LocalDimensions.current

    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(MaterialTheme.colorScheme.surface),
    ) {
        HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant, thickness = dimensions.borderThin)

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = dimensions.paddingSmall),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            BottomNavItem(
                title = stringResource(id = R.string.nav_home),
                iconRes = AppIcons.Home,
                isSelected = selectedTab == 0,
                onClick = { onTabSelected(0) },
            )

            BottomNavItem(
                title = stringResource(id = R.string.nav_courses),
                iconRes = AppIcons.Courses,
                isSelected = selectedTab == 1,
                onClick = { onTabSelected(1) },
            )

            BottomNavItem(
                title = stringResource(id = R.string.nav_repeat),
                iconRes = AppIcons.Repeat,
                isSelected = selectedTab == 2,
                onClick = { onTabSelected(2) },
            )

            BottomNavItem(
                title = stringResource(id = R.string.nav_results),
                iconRes = AppIcons.Results,
                isSelected = selectedTab == 3,
                onClick = { onTabSelected(3) },
            )
        }
    }
}

/**
 * Individual Bottom Navigation Item representation.
 */
@Composable
fun BottomNavItem(
    title: String,
    iconRes: Int,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val dimensions = LocalDimensions.current

    val activeColor = MaterialTheme.colorScheme.primary
    val inactiveColor = MaterialTheme.colorScheme.onSurfaceVariant
    val color = if (isSelected) activeColor else inactiveColor
    val textStyle = if (isSelected) AppTypography.BottomNavLabelActive else AppTypography.BottomNavLabel

    Column(
        modifier = modifier
            .clickable(onClick = onClick)
            .padding(horizontal = dimensions.paddingMedium, vertical = dimensions.paddingExtraSmall),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Icon(
            painter = painterResource(id = iconRes),
            contentDescription = title,
            tint = color,
            modifier = Modifier.size(dimensions.iconNavTab),
        )

        Spacer(modifier = Modifier.height(dimensions.paddingExtraSmall))

        Text(
            text = title,
            style = textStyle.copy(
                color = color,
            ),
        )
    }
}

@Preview(showBackground = true)
@Composable
fun HomeBottomBarPreview() {
    TalkMeTheme {
        HomeBottomBar()
    }
}
