package com.example.talkme.presentation.components

import androidx.annotation.DrawableRes
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions

/**
 * Standardized Reusable Button Component for the TalkMe Design System.
 *
 * @param text Button label text.
 * @param onClick Triggered on button click.
 * @param modifier Composable modifier for custom positioning.
 * @param trailingIconRes Optional trailing icon drawable resource ID.
 * @param containerColor Background color for the button container.
 * @param contentColor Text and icon tint color.
 * @param enabled Controls interactive state of the button.
 */
@Composable
fun TalkMeButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    @DrawableRes trailingIconRes: Int? = null,
    containerColor: Color = MaterialTheme.colorScheme.primary,
    contentColor: Color = MaterialTheme.colorScheme.onPrimary,
    enabled: Boolean = true,
) {
    val dimensions = LocalDimensions.current

    Button(
        onClick = onClick,
        enabled = enabled,
        modifier = modifier
            .fillMaxWidth()
            .height(dimensions.buttonHeight),
        shape = RoundedCornerShape(dimensions.cornerMedium),
        colors = ButtonDefaults.buttonColors(
            containerColor = containerColor,
            contentColor = contentColor,
        ),
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center,
        ) {
            Text(
                text = text,
                style = AppTypography.ButtonText.copy(
                    color = contentColor,
                ),
            )

            if (trailingIconRes != null) {
                Spacer(modifier = Modifier.width(dimensions.paddingSmall))

                Icon(
                    painter = painterResource(id = trailingIconRes),
                    contentDescription = null,
                    tint = contentColor,
                    modifier = Modifier.size(dimensions.iconMedium),
                )
            }
        }
    }
}
