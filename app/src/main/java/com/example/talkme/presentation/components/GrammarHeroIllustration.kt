package com.example.talkme.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.talkme.ui.theme.AppIcons
import com.example.talkme.ui.theme.AppTypography
import com.example.talkme.ui.theme.LocalDimensions

/**
 * 3D Grammar Fundamentals Hero Illustration Component matching user design specifications.
 * Features soft blue/purple gradient, floating ABC blocks, Grammar formula speech bubble (I+am, You+are, He+is),
 * open grammar books, and pencil stand.
 */
@Composable
fun GrammarHeroIllustration(
    modifier: Modifier = Modifier,
) {
    val dimensions = LocalDimensions.current

    val backgroundGradient = Brush.verticalGradient(
        colors = listOf(
            Color(0xFFE8F0FE), // Soft sky blue top
            Color(0xFFF1EDFA), // Soft purple bottom
        )
    )

    Box(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(dimensions.cornerExtraLarge))
            .background(backgroundGradient)
            .border(
                width = dimensions.borderThin,
                color = Color(0xFFD0E2FF),
                shape = RoundedCornerShape(dimensions.cornerExtraLarge)
            )
            .padding(dimensions.paddingLarge),
        contentAlignment = Alignment.Center,
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth(),
        ) {
            // Top Row: Floating "Hello!" Card, "Aa" Block, and Grammar Formula Speech Bubble
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top,
            ) {
                // "Hello!" Card
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(dimensions.cornerSmall))
                        .background(Color.White)
                        .padding(horizontal = dimensions.paddingMedium, vertical = dimensions.paddingSmall),
                ) {
                    Text(
                        text = "Hello!",
                        style = AppTypography.CardTitle.copy(
                            color = Color(0xFF1E88E5),
                            fontWeight = FontWeight.Bold,
                        ),
                    )
                }

                // "Aa" Block
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(RoundedCornerShape(dimensions.cornerSmall))
                        .background(Color.White),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        text = "Aa",
                        style = AppTypography.GreetingTitle.copy(
                            color = MaterialTheme.colorScheme.primary,
                            fontWeight = FontWeight.Bold,
                        ),
                    )
                }

                // Grammar Formula Speech Bubble ("I + am", "You + are", "He + is")
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(dimensions.cornerMedium))
                        .background(Color.White)
                        .padding(dimensions.paddingSmall),
                ) {
                    Column(
                        horizontalAlignment = Alignment.Start,
                    ) {
                        Text("I + am", style = AppTypography.BadgeText.copy(color = Color(0xFF1E88E5), fontSize = 10.sp))
                        Text("You + are", style = AppTypography.BadgeText.copy(color = Color(0xFF1E88E5), fontSize = 10.sp))
                        Text("He + is", style = AppTypography.BadgeText.copy(color = Color(0xFF1E88E5), fontSize = 10.sp))
                        Text("She + is", style = AppTypography.BadgeText.copy(color = Color(0xFF1E88E5), fontSize = 10.sp))
                        Text("We + are", style = AppTypography.BadgeText.copy(color = Color(0xFF1E88E5), fontSize = 10.sp))
                    }
                }
            }

            Spacer(modifier = Modifier.height(dimensions.paddingMedium))

            // Center Row: 3D "A B C" Big Letters
            Row(
                horizontalArrangement = Arrangement.spacedBy(dimensions.paddingMedium),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text(
                    text = "A",
                    style = AppTypography.GreetingTitle.copy(
                        fontSize = 36.sp,
                        fontWeight = FontWeight.Black,
                        color = Color(0xFF1E88E5), // Blue A
                    ),
                )
                Text(
                    text = "B",
                    style = AppTypography.GreetingTitle.copy(
                        fontSize = 42.sp,
                        fontWeight = FontWeight.Black,
                        color = MaterialTheme.colorScheme.primary, // Purple B
                    ),
                )
                Text(
                    text = "C",
                    style = AppTypography.GreetingTitle.copy(
                        fontSize = 36.sp,
                        fontWeight = FontWeight.Black,
                        color = Color(0xFFFF9800), // Orange C
                    ),
                )
            }

            Spacer(modifier = Modifier.height(dimensions.paddingSmall))

            // Bottom Stacked Grammar Books ("Grammar" & "Fundamentals")
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.fillMaxWidth(),
            ) {
                // Open Book Top Page
                Box(
                    modifier = Modifier
                        .fillMaxWidth(0.85f)
                        .height(28.dp)
                        .clip(RoundedCornerShape(topStart = 12.dp, topEnd = 12.dp))
                        .background(Color.White)
                        .border(1.dp, Color(0xFF1E88E5), RoundedCornerShape(topStart = 12.dp, topEnd = 12.dp)),
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(
                        painter = painterResource(id = AppIcons.Book),
                        contentDescription = null,
                        tint = Color(0xFF1E88E5),
                        modifier = Modifier.size(dimensions.iconMedium),
                    )
                }

                // Middle Blue Book ("Grammar")
                Box(
                    modifier = Modifier
                        .fillMaxWidth(0.88f)
                        .height(34.dp)
                        .clip(RoundedCornerShape(dimensions.cornerSmall))
                        .background(Color(0xFF1976D2)),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        text = "Grammar",
                        style = AppTypography.CardTitle.copy(
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                        ),
                    )
                }

                Spacer(modifier = Modifier.height(2.dp))

                // Bottom Purple Book ("Fundamentals")
                Box(
                    modifier = Modifier
                        .fillMaxWidth(0.92f)
                        .height(36.dp)
                        .clip(RoundedCornerShape(dimensions.cornerSmall))
                        .background(MaterialTheme.colorScheme.primary),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        text = "Fundamentals",
                        style = AppTypography.CardTitle.copy(
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                        ),
                    )
                }
            }
        }
    }
}
