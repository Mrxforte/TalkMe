package com.example.talkme.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions

/**
 * Universal Segmented Tab Selector Row component.
 *
 * @param tabs List of tab titles.
 * @param selectedIndex Currently active tab index.
 * @param onTabSelected Callback invoked when a tab is clicked.
 * @param modifier Composable layout modifier.
 * @param completedIndexIndices Optional set of tab indices that should display a checkmark icon.
 */
@Composable
fun TalkMeTabRow(
    tabs: List<String>,
    selectedIndex: Int,
    onTabSelected: (Int) -> Unit,
    modifier: Modifier = Modifier,
    completedIndexIndices: Set<Int> = emptySet(),
) {
    val dimensions = LocalDimensions.current

    Row(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(dimensions.cornerMedium))
            .background(MaterialTheme.colorScheme.surfaceVariant)
            .padding(dimensions.paddingMicro),
        horizontalArrangement = Arrangement.SpaceEvenly,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        tabs.forEachIndexed { index, title ->
            val isSelected = index == selectedIndex
            val isCompleted = completedIndexIndices.contains(index)

            val containerColor = if (isSelected) MaterialTheme.colorScheme.surface else Color.Transparent
            val textColor = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurfaceVariant
            val textStyle = if (isSelected) AppTypography.BottomNavLabelActive else AppTypography.BottomNavLabel

            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(dimensions.cornerSmall))
                    .background(containerColor)
                    .clickable { onTabSelected(index) }
                    .padding(vertical = dimensions.paddingSmall),
                contentAlignment = Alignment.Center,
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    if (isCompleted) {
                        Icon(
                            painter = painterResource(id = AppIcons.Check),
                            contentDescription = null,
                            tint = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.secondary,
                            modifier = Modifier.size(dimensions.iconSmall),
                        )

                        Spacer(modifier = Modifier.width(dimensions.paddingExtraSmall))
                    }

                    Text(
                        text = title,
                        style = textStyle.copy(
                            color = textColor,
                        ),
                    )
                }
            }
        }
    }
}
