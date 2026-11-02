package com.talkme.presentation.screens.lesson

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
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
import com.talkme.domain.lesson.model.LessonPlan
import com.talkme.domain.lesson.model.LessonSection
import com.talkme.domain.lesson.model.LessonSegmentTab
import com.talkme.presentation.components.TalkMeBadge
import com.talkme.presentation.components.TalkMeButton
import com.talkme.presentation.components.TalkMeCard
import com.talkme.presentation.components.TalkMeHeader
import com.talkme.presentation.components.TalkMeTabRow
import com.talkme.presentation.state.LocalTalkMeAppState
import com.talkme.presentation.state.TalkMeAppState
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.LocalDimensions
import com.talkme.ui.theme.TalkMeColors

/**
 * Clean Lesson Shell & Roadmap Topic Viewer.
 * All previous hardcoded lessons have been cleared as requested.
 * Lessons will be added one by one into an extensible architecture.
 */
@Composable
fun LessonDetailScreen(
    initialLessonId: String = "lvl_1",
    courseId: String = "grammar_fundamentals",
    onBackClick: () -> Unit = {},
    onOpenQuiz: () -> Unit = {},
    onCompleteLesson: (lessonId: String) -> Unit = {},
    onOpenVoiceSettings: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val dims = LocalDimensions.current
    val appState = LocalTalkMeAppState.current

    val curriculum = remember(courseId) {
        TalkMeAppState.getCurriculumForCourse(courseId, appState.completedLevelIds)
    }

    val activeNode = curriculum.topics.find { it.id == initialLessonId }
        ?: curriculum.topics.firstOrNull()
        ?: curriculum.topics[0]

    val isBookmarked = appState.isBookmarked(activeNode.id)

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFFFAFAFC)),
        contentPadding = PaddingValues(
            horizontal = dims.screenPaddingHorizontal,
            vertical = dims.spaceLarge
        ),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // 1. Top Header with Back button and Bookmark
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(Color.White)
                        .border(1.dp, Color(0xFFEBE8F3), CircleShape)
                        .clickable(onClick = onBackClick),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = AppIcons.ChevronLeft,
                        contentDescription = "Orqaga",
                        tint = TalkMeColors.TextPrimary,
                        modifier = Modifier.size(20.dp)
                    )
                }

                Column(
                    modifier = Modifier.weight(1f).padding(horizontal = 12.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = curriculum.sectionLabel,
                        style = AppTypography.BadgeMicro.copy(
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = 1.sp
                        ),
                        color = TalkMeColors.PrimaryPurple
                    )
                    Text(
                        text = curriculum.title,
                        style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.Black),
                        color = TalkMeColors.TextPrimary,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }

                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(if (isBookmarked) TalkMeColors.PrimaryPurple else Color.White)
                        .border(1.dp, Color(0xFFEBE8F3), CircleShape)
                        .clickable { appState.toggleBookmark(activeNode.id) },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = AppIcons.BookOpen,
                        contentDescription = "Saqlash",
                        tint = if (isBookmarked) Color.White else TalkMeColors.PrimaryPurple,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }
        }

        // 2. Active Topic Overview Card
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(dims.radiusExtraLarge))
                    .background(Color.White)
                    .border(1.dp, Color(0xFFEBE8F3), RoundedCornerShape(dims.radiusExtraLarge))
                    .padding(dims.cardPadding),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TalkMeBadge(
                        text = "YO‘L XARITASI MAVZUSI",
                        containerColor = TalkMeColors.ContainerPurpleLight,
                        textColor = TalkMeColors.PrimaryPurple
                    )
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(dims.radiusFull))
                            .background(Color(0xFFFFF8E7))
                            .border(1.dp, Color(0xFFFFD97D).copy(alpha = 0.6f), RoundedCornerShape(dims.radiusFull))
                            .padding(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = "+${activeNode.xpReward} XP",
                            style = AppTypography.BadgeMicro.copy(fontWeight = FontWeight.Bold),
                            color = Color(0xFFD97706)
                        )
                    }
                }

                Column {
                    Text(
                        text = activeNode.title,
                        style = AppTypography.HeadlineMedium.copy(fontWeight = FontWeight.Black),
                        color = TalkMeColors.TextPrimary
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = activeNode.subtitle,
                        style = AppTypography.BodyMedium,
                        color = TalkMeColors.TextSecondary
                    )
                }

                // TTS Speaker Button
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(TalkMeColors.ContainerPurpleLight)
                        .clickable {
                            val cleanTitle = activeNode.title.replace(Regex("^\\d+-Dars:\\s*"), "")
                            appState.speak("Topic: $cleanTitle. ${activeNode.subtitle}")
                        }
                        .padding(horizontal = 14.dp, vertical = 10.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(
                            imageVector = AppIcons.Headphones,
                            contentDescription = null,
                            tint = TalkMeColors.PrimaryPurple,
                            modifier = Modifier.size(16.dp)
                        )
                        Text(
                            text = "Mavzu nomini tinglash (TTS)",
                            style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.ExtraBold),
                            color = TalkMeColors.PrimaryPurple
                        )
                    }
                }
            }
        }

        // 3. Real lesson content (English Fundamentals Kirish) or Coming Soon Notice Card
        if (activeNode.linkedLessonId == "ef_01_kirish") {
            item {
                EnglishFundamentalsKirishView(onComplete = {})
            }
        } else {
            item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(dims.radiusExtraLarge))
                    .background(
                        Brush.linearGradient(
                            colors = listOf(
                                Color(0xFF1E1B4B),
                                Color(0xFF312E81),
                                Color(0xFF4338CA)
                            )
                        )
                    )
                    .border(1.dp, Color(0xFF818CF8).copy(alpha = 0.35f), RoundedCornerShape(dims.radiusExtraLarge))
                    .padding(dims.cardPadding),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(text = "🚀", fontSize = 20.sp)
                    Text(
                        text = "DARSLAR BIRMA-BIR QO‘SHILMOQDA",
                        style = AppTypography.BadgeMicro.copy(fontWeight = FontWeight.Black),
                        color = Color(0xFFA7F3D0)
                    )
                }

                Text(
                    text = "Ushbu dars tez kunda qo‘shiladi!",
                    style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.Black),
                    color = Color.White
                )

                Text(
                    text = "Talabingizga binoan oldingi hamma test darslar tozalandi va faqat mukammal yo‘l xaritasi saqlab qolindi. Endi har bir darsni birma-bir qo‘shib boramiz!",
                    style = AppTypography.LabelMedium,
                    color = Color(0xFFE0E7FF).copy(alpha = 0.9f)
                )

                Spacer(modifier = Modifier.height(4.dp))

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(46.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(
                            Brush.horizontalGradient(
                                listOf(Color(0xFF34D399), Color(0xFF2DD4BF))
                            )
                        )
                        .clickable(onClick = onBackClick),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "← Yo‘l xaritasiga qaytish",
                        style = AppTypography.TitleMedium.copy(
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Black
                        ),
                        color = Color(0xFF020617)
                    )
                }
            }
            }
        }

        // 4. Unit Topics List
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(dims.radiusExtraLarge))
                    .background(Color.White)
                    .border(1.dp, Color(0xFFEBE8F3), RoundedCornerShape(dims.radiusExtraLarge))
                    .padding(dims.cardPadding),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Text(
                    text = "Ushbu bo‘limdagi barcha mavzular (${curriculum.topics.size} ta)",
                    style = AppTypography.TitleMedium.copy(
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Black
                    ),
                    color = TalkMeColors.TextPrimary
                )

                curriculum.topics.forEachIndexed { idx, topic ->
                    val isCurrent = topic.id == activeNode.id
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(if (isCurrent) TalkMeColors.ContainerPurpleLight else Color(0xFFFAFAFC))
                            .border(
                                1.dp,
                                if (isCurrent) TalkMeColors.PrimaryPurple.copy(alpha = 0.3f) else Color(0xFFF0EFF5),
                                RoundedCornerShape(12.dp)
                            )
                            .padding(10.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            modifier = Modifier.weight(1f),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(24.dp)
                                    .clip(CircleShape)
                                    .background(if (isCurrent) TalkMeColors.PrimaryPurple else Color(0xFFE5E7EB)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "${idx + 1}",
                                    style = AppTypography.BadgeMicro.copy(fontSize = 11.sp, fontWeight = FontWeight.Bold),
                                    color = if (isCurrent) Color.White else Color(0xFF4B5563)
                                )
                            }

                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = topic.title,
                                    style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.Bold),
                                    color = if (isCurrent) TalkMeColors.PrimaryPurple else TalkMeColors.TextPrimary,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Text(
                                    text = topic.subtitle,
                                    style = AppTypography.LabelSmall.copy(fontSize = 10.sp),
                                    color = Color(0xFF6B7280),
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }
                        }

                        Text(
                            text = "+${topic.xpReward} XP",
                            style = AppTypography.BadgeMicro.copy(fontWeight = FontWeight.ExtraBold),
                            color = Color(0xFFD97706)
                        )
                    }
                }
            }
        }
    }
}

// Preserve existing legacy overload signatures so existing call-sites never fail compilation
@Composable
fun LessonDetailScreen(
    lessonPlan: LessonPlan,
    onBackClick: () -> Unit = {},
    onOpenQuiz: () -> Unit = {},
    onCompleteLesson: () -> Unit = {},
    onOpenVoiceSettings: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    LessonDetailScreen(
        initialLessonId = lessonPlan.lessonId,
        courseId = lessonPlan.courseId,
        onBackClick = onBackClick,
        onOpenQuiz = onOpenQuiz,
        onCompleteLesson = { onCompleteLesson() },
        onOpenVoiceSettings = onOpenVoiceSettings,
        modifier = modifier
    )
}
