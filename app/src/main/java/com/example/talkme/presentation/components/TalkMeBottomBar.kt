package com.example.talkme.presentation.components

import androidx.annotation.DrawableRes
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
 * Universal Bottom Navigation Bar component shared across main application tabs
 * (Home, Courses, Repeat, Results).
 *
 * @param selectedTab Currently active tab index (0: Home, 1: Courses, 2: Repeat, 3: Results).
 * @param onTabSelected Callback invoked when user selects a tab index.
 * @param modifier Composable layout modifier.
 */
@Composable
fun TalkMeBottomBar(
    selectedTab: Int,
    onTabSelected: (Int) -> Unit,
    modifier: Modifier = Modifier,
) {
    val dimensions = LocalDimensions.current

    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(MaterialTheme.colorScheme.surface),
    ) {
        HorizontalDivider(
            color = MaterialTheme.colorScheme.outlineVariant,
            thickness = dimensions.borderThin,
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = dimensions.paddingSmall),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            TalkMeBottomNavItem(
                title = stringResource(id = R.string.nav_home),
                iconRes = AppIcons.Home,
                isSelected = selectedTab == 0,
                onClick = { onTabSelected(0) },
            )

            TalkMeBottomNavItem(
                title = stringResource(id = R.string.nav_courses),
                iconRes = AppIcons.Courses,
                isSelected = selectedTab == 1,
                onClick = { onTabSelected(1) },
            )

            TalkMeBottomNavItem(
                title = stringResource(id = R.string.nav_repeat),
                iconRes = AppIcons.Repeat,
                isSelected = selectedTab == 2,
                onClick = { onTabSelected(2) },
            )

            TalkMeBottomNavItem(
                title = stringResource(id = R.string.nav_results),
                iconRes = AppIcons.Results,
                isSelected = selectedTab == 3,
                onClick = { onTabSelected(3) },
            )
        }
    }
}

/**
 * Reusable Bottom Navigation Item representation.
 *
 * @param title Tab label text.
 * @param iconRes Drawable icon resource ID.
 * @param isSelected Active selection state.
 * @param onClick Click handler.
 * @param modifier Layout modifier.
 */
@Composable
fun TalkMeBottomNavItem(
    title: String,
    @DrawableRes iconRes: Int,
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
fun TalkMeBottomBarPreview() {
    TalkMeTheme {
        TalkMeBottomBar(selectedTab = 0, onTabSelected = {})
    }
}
