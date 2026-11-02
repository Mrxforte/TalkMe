package com.talkme.presentation.screens.lesson

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.talkme.presentation.components.TalkMeBadge
import com.talkme.presentation.components.TalkMeButton
import com.talkme.presentation.components.TalkMeButtonVariant
import com.talkme.presentation.components.TalkMeCard
import com.talkme.presentation.components.TalkMeProgressBar
import com.talkme.presentation.state.LocalTalkMeAppState
import com.talkme.ui.theme.AppIcons
import com.talkme.ui.theme.AppTypography
import com.talkme.ui.theme.TalkMeColors

private data class BeginnerA0VocabCardModel(
    val id: String,
    val english: String,
    val uzbek: String,
    val phonetic: String,
    val emoji: String
)

private val SIX_A0_VOCAB_ITEMS = listOf(
    BeginnerA0VocabCardModel("voc_hello", "Hello", "Salom", "/həˈləʊ/", "👋"),
    BeginnerA0VocabCardModel("voc_hi", "Hi", "Salom", "/haɪ/", "😊"),
    BeginnerA0VocabCardModel("voc_thank_you", "Thank you", "Rahmat", "/ˈθæŋk juː/", "❤️"),
    BeginnerA0VocabCardModel("voc_i_am", "I am", "Men ...man", "/aɪ æm/", "🙋"),
    BeginnerA0VocabCardModel("voc_welcome", "Welcome", "Xush kelibsiz", "/ˈwel.kəm/", "🎉"),
    BeginnerA0VocabCardModel("voc_goodbye", "Goodbye", "Xayr", "/ˌɡʊdˈbaɪ/", "👋")
)

private val SEVEN_A0_SECTION_TITLES = listOf(
    "sec_1_welcome" to "1. Welcome",
    "sec_2_hello" to "2. Say Hello!",
    "sec_3_meet" to "3. Meet TalkMe",
    "sec_4_grammar" to "4. Grammar",
    "sec_5_words" to "5. 6 Words",
    "sec_6_practice" to "6. Practice",
    "sec_7_wrapup" to "7. Wrap-up"
)

/**
 * Pixel-perfect Jetpack Compose implementation of **Lesson 1 — "Hello!" (A0 — Absolute Beginner)**
 * matching `src/features/grammar/components/BeginnerLessonA0Renderer.tsx` and
 * `src/features/grammar/content/lessons/lesson01HelloBeginner.ts`.
 *
 * Implements all 7 sections in exact curriculum order:
 * 1. Welcome to TalkMe (`Hello! Welcome to TalkMe!` + Uzbek reassurance + `Let's start!`)
 * 2. Let's say Hello! (`Hello!` & `Hi!` greeting table + audio + repeat speaking practice)
 * 3. Meet TalkMe! (4 simple learning benefits + `"Siz shoshilmang. Har bir narsani o‘z vaqtida o‘rganamiz."`)
 * 4. What is Grammar? (LEGO analogy `[ I ] + [ am ] + [ happy ]` -> `"I am happy."` — `"Men xursandman."`, zero jargon)
 * 5. Your First 6 Words (`Hello`, `Hi`, `Thank you`, `I am`, `Welcome`, `Goodbye` + live `"I am Azamat."` personalization)
 * 6. Let's Practice! (5 interactive exercises: Translation, Situation, Build a Sentence, Listening, Conversation)
 * 7. Wrap-up! (Celebration + 6-word mastery review + XP/Diamond reward)
 */
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun BeginnerLessonA0ComposeView(
    onCompleteLesson: () -> Unit,
    onSwitchToFrameworkLesson: () -> Unit,
    modifier: Modifier = Modifier
) {
    val appState = LocalTalkMeAppState.current
    val currentIdx = appState.lesson01CurrentSectionIndex.coerceIn(0, 6)
    var activePlayingText by remember { mutableStateOf<String?>(null) }
    var practicedRepeatGreeting by remember { mutableStateOf(false) }

    fun playEnglish(text: String, slow: Boolean = false) {
        activePlayingText = text
        appState.speak(text, slow)
        if (!appState.lesson01PlayedAudioIds.contains(text)) {
            appState.lesson01PlayedAudioIds.add(text)
        }
    }

    fun goToSection(nextIndex: Int) {
        val currentId = SEVEN_A0_SECTION_TITLES[currentIdx].first
        if (!appState.lesson01CompletedSections.contains(currentId)) {
            appState.lesson01CompletedSections.add(currentId)
        }
        val clamped = nextIndex.coerceIn(0, 6)
        appState.lesson01CurrentSectionIndex = clamped
        if (clamped == 6 && !appState.lesson01IsCompleted) {
            appState.lesson01IsCompleted = true
            val finishId = SEVEN_A0_SECTION_TITLES[6].first
            if (!appState.lesson01CompletedSections.contains(finishId)) {
                appState.lesson01CompletedSections.add(finishId)
            }
            SIX_A0_VOCAB_ITEMS.forEach { appState.recordVocabLearned(it.english) }
            appState.syncLesson01VocabToFsrs()
            appState.awardXpAndDiamonds(70, 20, "lvl_1")
        }
    }

    val progressFraction = ((currentIdx + 1).toFloat() / 7f).coerceIn(0f, 1f)

    Column(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Top Lesson Header & Progress Strip
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(22.dp))
                .background(
                    Brush.linearGradient(
                        listOf(Color(0xFFECFDF5), Color.White, Color(0xFFEEF2FF))
                    )
                )
                .border(1.5.dp, Color(0xFF6EE7B7), RoundedCornerShape(22.dp))
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TalkMeBadge(
                        text = "A0 — Absolute Beginner",
                        containerColor = Color(0xFF059669),
                        textColor = Color.White
                    )
                    TalkMeBadge(
                        text = "Section ${currentIdx + 1} / 7",
                        containerColor = TalkMeColors.ContainerPurpleLight,
                        textColor = TalkMeColors.PrimaryPurple
                    )
                }

                Text(
                    text = "${(progressFraction * 100).toInt()}%",
                    style = AppTypography.LabelLarge.copy(fontWeight = FontWeight.Black),
                    color = Color(0xFF059669)
                )
            }

            Text(
                text = "Lesson 1 — Hello! 👋",
                style = AppTypography.HeadlineMedium.copy(fontWeight = FontWeight.Black),
                color = TalkMeColors.TextPrimary
            )

            TalkMeProgressBar(
                progress = progressFraction,
                fillColor = Color(0xFF059669)
            )

            // 7 Section Step Pills
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                contentPadding = PaddingValues(top = 4.dp)
            ) {
                itemsIndexed(SEVEN_A0_SECTION_TITLES) { idx, (secId, label) ->
                    val isCurrent = idx == currentIdx
                    val isDone = appState.lesson01CompletedSections.contains(secId)
                    Row(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(
                                when {
                                    isCurrent -> Color(0xFF059669)
                                    isDone -> Color(0xFFD1FAE5)
                                    else -> Color.White
                                }
                            )
                            .border(
                                1.dp,
                                when {
                                    isCurrent -> Color(0xFF059669)
                                    isDone -> Color(0xFF6EE7B7)
                                    else -> TalkMeColors.OutlineWarm
                                },
                                RoundedCornerShape(12.dp)
                            )
                            .clickable { appState.lesson01CurrentSectionIndex = idx }
                            .padding(horizontal = 12.dp, vertical = 7.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        if (isDone) {
                            Icon(
                                imageVector = AppIcons.Check,
                                contentDescription = null,
                                tint = if (isCurrent) Color.White else Color(0xFF059669),
                                modifier = Modifier.size(13.dp)
                            )
                        }
                        Text(
                            text = label,
                            style = AppTypography.LabelSmall.copy(fontWeight = FontWeight.Bold),
                            color = when {
                                isCurrent -> Color.White
                                isDone -> Color(0xFF065F46)
                                else -> TalkMeColors.TextSecondary
                            }
                        )
                    }
                }
            }
        }

        // Dynamic Section Renderer (Sections 1..7)
        when (currentIdx) {
            // =====================================================
            // SECTION 1 — Welcome to TalkMe
            // =====================================================
            0 -> {
                TalkMeCard {
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        // Friendly Welcome Illustration
                        Box(
                            modifier = Modifier
                                .size(92.dp)
                                .clip(CircleShape)
                                .background(
                                    Brush.linearGradient(
                                        listOf(Color(0xFFD1FAE5), Color(0xFFE0E7FF))
                                    )
                                )
                                .border(2.dp, Color(0xFF6EE7B7), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(text = "👋", fontSize = 44.sp)
                        }

                        TalkMeBadge(
                            text = "SECTION 1 • XUSH KELIBSIZ",
                            containerColor = Color(0xFFD1FAE5),
                            textColor = Color(0xFF065F46)
                        )

                        Text(
                            text = "Hello! Welcome to TalkMe!",
                            style = AppTypography.DisplayLarge.copy(
                                fontSize = 24.sp,
                                fontWeight = FontWeight.Black
                            ),
                            color = TalkMeColors.TextPrimary,
                            textAlign = TextAlign.Center
                        )

                        // English Phrase Audio Card
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .background(TalkMeColors.ContainerPurpleLight)
                                .border(1.dp, TalkMeColors.ContainerPurpleBorder, RoundedCornerShape(16.dp))
                                .clickable { playEnglish("Hello! Welcome to TalkMe!") }
                                .padding(14.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "“Hello! Welcome to TalkMe!”",
                                    style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.ExtraBold),
                                    color = TalkMeColors.PrimaryPurple
                                )
                                Text(
                                    text = "Salom! TalkMe-ga xush kelibsiz!",
                                    style = AppTypography.BodyMedium,
                                    color = TalkMeColors.TextSecondary
                                )
                            }
                            Box(
                                modifier = Modifier
                                    .size(42.dp)
                                    .clip(CircleShape)
                                    .background(TalkMeColors.PrimaryPurple),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = AppIcons.VolumeUp,
                                    contentDescription = "Play Audio",
                                    tint = Color.White,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        }

                        // Uzbek Reassurance Text
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .background(Color(0xFFF8FAFC))
                                .border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(16.dp))
                                .padding(16.dp),
                            verticalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Text(
                                text = "Biz bilan ingliz tilini o‘rganishni boshlang. Xavotir olmang, ingliz tilini bilishingiz shart emas. Biz hammasini boshidan, juda oson qilib o‘rgatamiz.",
                                style = AppTypography.BodyLarge,
                                color = TalkMeColors.TextPrimary
                            )
                            Text(
                                text = "Har kuni ozgina yangi so‘z o‘rganasiz, eshitasiz va mashq qilasiz.",
                                style = AppTypography.BodyMedium.copy(fontWeight = FontWeight.SemiBold),
                                color = Color(0xFF047857)
                            )
                        }

                        // Final phrase badge + Continue CTA
                        Row(
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .background(Color(0xFFFEF3C7))
                                .clickable { playEnglish("Let's start!") }
                                .padding(horizontal = 14.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(
                                imageVector = AppIcons.VolumeUp,
                                contentDescription = null,
                                tint = Color(0xFFD97706),
                                modifier = Modifier.size(16.dp)
                            )
                            Text(
                                text = "Let's start! (Qani, boshladik!)",
                                style = AppTypography.LabelLarge.copy(fontWeight = FontWeight.ExtraBold),
                                color = Color(0xFF92400E)
                            )
                        }

                        TalkMeButton(
                            text = "Let's start! • Boshlash",
                            variant = TalkMeButtonVariant.Emerald,
                            trailingIcon = AppIcons.ArrowForward,
                            onClick = {
                                playEnglish("Let's start!")
                                goToSection(1)
                            }
                        )
                    }
                }
            }

            // =====================================================
            // SECTION 2 — Let's say Hello!
            // =====================================================
            1 -> {
                TalkMeCard {
                    Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                        TalkMeBadge(
                            text = "SECTION 2 • SALOMLASHISH",
                            containerColor = TalkMeColors.ContainerPurpleLight,
                            textColor = TalkMeColors.PrimaryPurple
                        )

                        Text(
                            text = "Let's say Hello!",
                            style = AppTypography.HeadlineMedium.copy(fontWeight = FontWeight.Black),
                            color = TalkMeColors.TextPrimary
                        )

                        // Everyday contextual situation box
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .background(Color(0xFFFFFBEB))
                                .border(1.dp, Color(0xFFFDE68A), RoundedCornerShape(16.dp))
                                .padding(14.dp),
                            horizontalArrangement = Arrangement.spacedBy(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(text = "🤝", fontSize = 32.sp)
                            Text(
                                text = "Tasavvur qiling, siz yangi odamni uchratdingiz. Unga nima deysiz?",
                                style = AppTypography.BodyLarge.copy(fontWeight = FontWeight.SemiBold),
                                color = Color(0xFF78350F)
                            )
                        }

                        // Greeting Item 1: Hello! | Salom!
                        GreetingAudioComparisonRow(
                            english = "Hello!",
                            phonetic = "/həˈləʊ/",
                            uzbek = "Salom!",
                            noteUz = "Har qanday vaziyatda ishlatsa bo‘ladigan asosiy salomlashish so‘zi.",
                            isPlaying = activePlayingText == "Hello!",
                            onPlayNormal = { playEnglish("Hello!", slow = false) },
                            onPlaySlow = { playEnglish("Hello!", slow = true) }
                        )

                        // Greeting Item 2: Hi! | Salom!
                        GreetingAudioComparisonRow(
                            english = "Hi!",
                            phonetic = "/haɪ/",
                            uzbek = "Salom!",
                            noteUz = "Do‘stona va qisqa salomlashish so‘zi. Ikkalasi ham odamlar bilan ko‘rishganda aytiladi!",
                            isPlaying = activePlayingText == "Hi!",
                            onPlayNormal = { playEnglish("Hi!", slow = false) },
                            onPlaySlow = { playEnglish("Hi!", slow = true) }
                        )

                        // Prominent Speaking / Repeating Interaction
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(18.dp))
                                .background(
                                    if (practicedRepeatGreeting) TalkMeColors.ContainerGreenLight
                                    else TalkMeColors.ContainerPurpleLight
                                )
                                .border(
                                    1.5.dp,
                                    if (practicedRepeatGreeting) TalkMeColors.SuccessGreen
                                    else TalkMeColors.PrimaryPurple,
                                    RoundedCornerShape(18.dp)
                                )
                                .padding(16.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Text(
                                text = "🎤 Ovoz chiqarib qaytaring (Speaking Practice)",
                                style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.ExtraBold),
                                color = TalkMeColors.TextPrimary
                            )
                            Text(
                                text = "Eshitib ko‘ring va ovoz chiqarib “Hello!” hamda “Hi!” deb ayting:",
                                style = AppTypography.BodyMedium,
                                color = TalkMeColors.TextSecondary,
                                textAlign = TextAlign.Center
                            )
                            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(TalkMeColors.PrimaryPurple)
                                        .clickable {
                                            practicedRepeatGreeting = true
                                            playEnglish("Hello! Hi!")
                                        }
                                        .padding(vertical = 12.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                                    ) {
                                        Icon(
                                            imageVector = AppIcons.Mic,
                                            contentDescription = null,
                                            tint = Color.White,
                                            modifier = Modifier.size(18.dp)
                                        )
                                        Text(
                                            text = "Eshitish va Qaytarish",
                                            style = AppTypography.LabelLarge,
                                            color = Color.White
                                        )
                                    }
                                }
                            }
                            if (practicedRepeatGreeting) {
                                Text(
                                    text = "✓ Barakalla! Juda chiroyli talaffuz qildingiz!",
                                    style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.Bold),
                                    color = TalkMeColors.SuccessGreen
                                )
                            }
                        }

                        TalkMeButton(
                            text = "Davom etish • Meet TalkMe!",
                            variant = TalkMeButtonVariant.Primary,
                            trailingIcon = AppIcons.ArrowForward,
                            onClick = { goToSection(2) }
                        )
                    }
                }
            }

            // =====================================================
            // SECTION 3 — Meet TalkMe!
            // =====================================================
            2 -> {
                TalkMeCard {
                    Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                        TalkMeBadge(
                            text = "SECTION 3 • SIZNING YORDAMCHINGIZ",
                            containerColor = TalkMeColors.ContainerPurpleLight,
                            textColor = TalkMeColors.PrimaryPurple
                        )

                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(56.dp)
                                    .clip(RoundedCornerShape(16.dp))
                                    .background(TalkMeColors.PrimaryPurple),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(text = "🦉", fontSize = 30.sp)
                            }
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "Meet TalkMe!",
                                    style = AppTypography.HeadlineMedium.copy(fontWeight = FontWeight.Black),
                                    color = TalkMeColors.TextPrimary
                                )
                                Text(
                                    text = "TalkMe — sizning ingliz tili o‘rganish yordamchingiz.",
                                    style = AppTypography.BodyMedium.copy(fontWeight = FontWeight.SemiBold),
                                    color = TalkMeColors.PrimaryPurple
                                )
                            }
                        }

                        Text(
                            text = "Biz sizga yangi so‘zlarni, oddiy gaplarni va inglizcha suhbatlashishni o‘rgatamiz.",
                            style = AppTypography.BodyLarge,
                            color = TalkMeColors.TextPrimary
                        )

                        // 4 Simple Learning Benefits
                        val benefits = listOf(
                            "🎧" to "So‘zlarni eshitasiz.",
                            "🖼️" to "Rasmlar orqali o‘rganasiz.",
                            "✍️" to "Oddiy mashqlar bajarasiz.",
                            "💬" to "O‘rganganlaringiz bilan gap tuzasiz."
                        )
                        benefits.forEach { (emoji, benefitText) ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(14.dp))
                                    .background(Color(0xFFF8FAFC))
                                    .border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(14.dp))
                                    .padding(14.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                Text(text = emoji, fontSize = 22.sp)
                                Text(
                                    text = benefitText,
                                    style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.Bold),
                                    color = TalkMeColors.TextPrimary
                                )
                            }
                        }

                        // Calming reassurance box
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .background(TalkMeColors.ContainerGreenLight)
                                .border(1.dp, TalkMeColors.ContainerGreenBorder, RoundedCornerShape(16.dp))
                                .padding(14.dp)
                        ) {
                            Text(
                                text = "🌱 Siz shoshilmang. Har bir narsani o‘z vaqtida o‘rganamiz.",
                                style = AppTypography.BodyMedium.copy(fontWeight = FontWeight.Bold),
                                color = Color(0xFF065F46)
                            )
                        }

                        TalkMeButton(
                            text = "Davom etish • What is Grammar?",
                            variant = TalkMeButtonVariant.Primary,
                            trailingIcon = AppIcons.ArrowForward,
                            onClick = { goToSection(3) }
                        )
                    }
                }
            }

            // =====================================================
            // SECTION 4 — What is Grammar? (LEGO Analogy, Zero Jargon)
            // =====================================================
            3 -> {
                TalkMeCard {
                    Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                        TalkMeBadge(
                            text = "SECTION 4 • LEGO QOIDASI",
                            containerColor = Color(0xFFFEF3C7),
                            textColor = Color(0xFF92400E)
                        )

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "What is Grammar?",
                                    style = AppTypography.HeadlineMedium.copy(fontWeight = FontWeight.Black),
                                    color = TalkMeColors.TextPrimary
                                )
                                Text(
                                    text = "Inglizcha atama: Grammar",
                                    style = AppTypography.LabelMedium,
                                    color = TalkMeColors.PrimaryPurple
                                )
                            }
                            Box(
                                modifier = Modifier
                                    .size(42.dp)
                                    .clip(CircleShape)
                                    .background(TalkMeColors.ContainerPurpleLight)
                                    .clickable { playEnglish("Grammar") },
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = AppIcons.VolumeUp,
                                    contentDescription = "Hear Grammar",
                                    tint = TalkMeColors.PrimaryPurple,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        }

                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .background(Color(0xFFF8FAFC))
                                .border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(16.dp))
                                .padding(14.dp),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Text(
                                text = "Grammar — bu gap tuzish qoidalari.",
                                style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.ExtraBold),
                                color = TalkMeColors.TextPrimary
                            )
                            Text(
                                text = "Alohida so‘zlarni bilish yaxshi. Lekin ularni birlashtirib, gap tuzishni ham o‘rganamiz.",
                                style = AppTypography.BodyMedium,
                                color = TalkMeColors.TextSecondary
                            )
                        }

                        // Interactive LEGO Analogy Box (ONE example: "I am happy." -> "Men xursandman.")
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(18.dp))
                                .background(TalkMeColors.ContainerPurpleLight)
                                .border(1.5.dp, TalkMeColors.ContainerPurpleBorder, RoundedCornerShape(18.dp))
                                .padding(16.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Text(
                                text = "🧱 LEGO kubiklari kabi so‘zlarni birlashtiramiz:",
                                style = AppTypography.LabelLarge.copy(fontWeight = FontWeight.ExtraBold),
                                color = TalkMeColors.PrimaryPurple
                            )

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.Center,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                LegoWordBlock(
                                    english = "I",
                                    uzbek = "Men",
                                    bgColor = Color(0xFF4F46E5),
                                    onClick = { playEnglish("I") }
                                )
                                Text(
                                    text = " + ",
                                    style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.Black),
                                    color = TalkMeColors.PrimaryPurple
                                )
                                LegoWordBlock(
                                    english = "am",
                                    uzbek = "...man",
                                    bgColor = Color(0xFF059669),
                                    onClick = { playEnglish("am") }
                                )
                                Text(
                                    text = " + ",
                                    style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.Black),
                                    color = TalkMeColors.PrimaryPurple
                                )
                                LegoWordBlock(
                                    english = "happy",
                                    uzbek = "xursand",
                                    bgColor = Color(0xFFD97706),
                                    onClick = { playEnglish("happy") }
                                )
                            }

                            // Combined Result Sentence
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(14.dp))
                                    .background(Color.White)
                                    .border(1.dp, TalkMeColors.ContainerPurpleBorder, RoundedCornerShape(14.dp))
                                    .clickable { playEnglish("I am happy.") }
                                    .padding(14.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = "I am happy.",
                                        style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.Black),
                                        color = TalkMeColors.TextPrimary
                                    )
                                    Text(
                                        text = "Men xursandman.",
                                        style = AppTypography.BodyMedium.copy(fontWeight = FontWeight.Bold),
                                        color = Color(0xFF059669)
                                    )
                                }
                                Box(
                                    modifier = Modifier
                                        .size(38.dp)
                                        .clip(CircleShape)
                                        .background(TalkMeColors.PrimaryPurple),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = AppIcons.VolumeUp,
                                        contentDescription = "Play sentence",
                                        tint = Color.White,
                                        modifier = Modifier.size(18.dp)
                                    )
                                }
                            }

                            Text(
                                text = "Ingliz tilida ham so‘zlardan gap yasaymiz.",
                                style = AppTypography.BodyMedium.copy(fontWeight = FontWeight.SemiBold),
                                color = TalkMeColors.TextPrimary,
                                textAlign = TextAlign.Center
                            )
                        }

                        // Reassurance Footer
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(14.dp))
                                .background(TalkMeColors.ContainerGreenLight)
                                .padding(14.dp)
                        ) {
                            Text(
                                text = "✨ Don't worry! Qoidalarni keyingi darslarda birma-bir o‘rganamiz.",
                                style = AppTypography.BodyMedium.copy(fontWeight = FontWeight.Bold),
                                color = Color(0xFF065F46)
                            )
                        }

                        TalkMeButton(
                            text = "Davom etish • Your First 6 Words",
                            variant = TalkMeButtonVariant.Primary,
                            trailingIcon = AppIcons.ArrowForward,
                            onClick = { goToSection(4) }
                        )
                    }
                }
            }

            // =====================================================
            // SECTION 5 — Your First 6 Words + "I am Azamat." Personalization
            // =====================================================
            4 -> {
                TalkMeCard {
                    Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                        TalkMeBadge(
                            text = "SECTION 5 • SIZNING BIRINCHI 6 TA SO‘ZINGIZ",
                            containerColor = Color(0xFFD1FAE5),
                            textColor = Color(0xFF065F46)
                        )

                        Text(
                            text = "Your First 6 Words",
                            style = AppTypography.HeadlineMedium.copy(fontWeight = FontWeight.Black),
                            color = TalkMeColors.TextPrimary
                        )
                        Text(
                            text = "Har bir so‘zni bosing, eshiting va ovoz chiqarib qaytaring:",
                            style = AppTypography.BodyMedium,
                            color = TalkMeColors.TextSecondary
                        )

                        // Render the 6 Vocabulary Cards
                        SIX_A0_VOCAB_ITEMS.forEach { item ->
                            val isPlaying = activePlayingText == item.english
                            val hasPlayed = appState.lesson01PlayedAudioIds.contains(item.english)

                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(16.dp))
                                    .background(
                                        if (isPlaying) TalkMeColors.ContainerPurpleLight
                                        else Color(0xFFF8FAFC)
                                    )
                                    .border(
                                        width = if (isPlaying) 2.dp else 1.dp,
                                        color = if (isPlaying) TalkMeColors.PrimaryPurple else Color(0xFFE2E8F0),
                                        shape = RoundedCornerShape(16.dp)
                                    )
                                    .clickable {
                                        playEnglish(item.english, slow = false)
                                        appState.recordVocabLearned(item.english)
                                    }
                                    .padding(14.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(48.dp)
                                                .clip(RoundedCornerShape(14.dp))
                                                .background(Color.White)
                                                .border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(14.dp)),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text(text = item.emoji, fontSize = 24.sp)
                                        }
                                        Column {
                                            Row(
                                                verticalAlignment = Alignment.CenterVertically,
                                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                                            ) {
                                                Text(
                                                    text = item.english,
                                                    style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.Black),
                                                    color = TalkMeColors.TextPrimary
                                                )
                                                if (hasPlayed) {
                                                    Icon(
                                                        imageVector = AppIcons.CheckCircle,
                                                        contentDescription = null,
                                                        tint = TalkMeColors.SuccessGreen,
                                                        modifier = Modifier.size(16.dp)
                                                    )
                                                }
                                            }
                                            Text(
                                                text = "${item.uzbek}  ·  ${item.phonetic}",
                                                style = AppTypography.BodyMedium.copy(fontWeight = FontWeight.SemiBold),
                                                color = Color(0xFF059669)
                                            )
                                        }
                                    }

                                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                        // Repeat / Slow button
                                        Box(
                                            modifier = Modifier
                                                .clip(RoundedCornerShape(10.dp))
                                                .background(TalkMeColors.ContainerAmberLight)
                                                .clickable {
                                                    playEnglish(item.english, slow = true)
                                                    appState.recordVocabLearned(item.english)
                                                }
                                                .padding(horizontal = 10.dp, vertical = 8.dp)
                                        ) {
                                            Text(
                                                text = "Sekin",
                                                style = AppTypography.LabelSmall.copy(fontWeight = FontWeight.Bold),
                                                color = TalkMeColors.WarningAmber
                                            )
                                        }

                                        // Normal Play button
                                        Box(
                                            modifier = Modifier
                                                .size(38.dp)
                                                .clip(CircleShape)
                                                .background(TalkMeColors.PrimaryPurple)
                                                .clickable {
                                                    playEnglish(item.english, slow = false)
                                                    appState.recordVocabLearned(item.english)
                                                },
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Icon(
                                                imageVector = AppIcons.VolumeUp,
                                                contentDescription = "Play",
                                                tint = Color.White,
                                                modifier = Modifier.size(18.dp)
                                            )
                                        }
                                    }
                                }
                            }
                        }

                        // Personalization Card for "I am" -> "I am Azamat." — "Men Azamatman."
                        val cleanName = appState.personalizedLearnerName.ifBlank { "Azamat" }
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(18.dp))
                                .background(
                                    Brush.linearGradient(
                                        listOf(Color(0xFFEEF2FF), Color(0xFFECFDF5))
                                    )
                                )
                                .border(1.5.dp, Color(0xFF818CF8), RoundedCornerShape(18.dp))
                                .padding(16.dp),
                            verticalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Text(
                                text = "🙋 O‘z ismingizni qo‘yib ayting (Personalization):",
                                style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.ExtraBold),
                                color = Color(0xFF312E81)
                            )

                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(Color.White)
                                    .border(1.dp, Color(0xFFC7D2FE), RoundedCornerShape(12.dp))
                                    .padding(horizontal = 12.dp, vertical = 10.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Text(
                                    text = "Ismingiz:",
                                    style = AppTypography.LabelMedium,
                                    color = TalkMeColors.TextSecondary
                                )
                                BasicTextField(
                                    value = appState.personalizedLearnerName,
                                    onValueChange = { appState.personalizedLearnerName = it },
                                    singleLine = true,
                                    textStyle = AppTypography.TitleMedium.copy(
                                        color = TalkMeColors.PrimaryPurple,
                                        fontWeight = FontWeight.ExtraBold
                                    ),
                                    modifier = Modifier.weight(1f)
                                )
                            }

                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(14.dp))
                                    .background(Color.White)
                                    .clickable { playEnglish("I am $cleanName.") }
                                    .padding(14.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = "“I am $cleanName.”",
                                        style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.Black),
                                        color = TalkMeColors.PrimaryPurple
                                    )
                                    Text(
                                        text = "“Men ${cleanName}man.”",
                                        style = AppTypography.BodyMedium.copy(fontWeight = FontWeight.Bold),
                                        color = Color(0xFF059669)
                                    )
                                }
                                Box(
                                    modifier = Modifier
                                        .size(40.dp)
                                        .clip(CircleShape)
                                        .background(TalkMeColors.PrimaryPurple),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = AppIcons.VolumeUp,
                                        contentDescription = "Speak My Name",
                                        tint = Color.White,
                                        modifier = Modifier.size(18.dp)
                                    )
                                }
                            }
                        }

                        TalkMeButton(
                            text = "Mashqlarga o‘tish • Let's Practice!",
                            variant = TalkMeButtonVariant.Emerald,
                            trailingIcon = AppIcons.ArrowForward,
                            onClick = { goToSection(5) }
                        )
                    }
                }
            }

            // =====================================================
            // SECTION 6 — Let's Practice! (5 Interactive Exercises)
            // =====================================================
            5 -> {
                BeginnerSection6PracticeCard(
                    learnerName = appState.personalizedLearnerName.ifBlank { "Azamat" },
                    onSpeak = { playEnglish(it, false) },
                    onAllExercisesDone = { goToSection(6) }
                )
            }

            // =====================================================
            // SECTION 7 — Wrap-up! (Congratulations!)
            // =====================================================
            else -> {
                val cleanName = appState.personalizedLearnerName.ifBlank { "Azamat" }
                TalkMeCard {
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        Text(text = "🎉", fontSize = 48.sp)

                        TalkMeBadge(
                            text = "LESSON 1 COMPLETED • +70 XP • +20 💎",
                            containerColor = Color(0xFFD1FAE5),
                            textColor = Color(0xFF065F46)
                        )

                        Text(
                            text = "Tabriklaymiz, $cleanName!",
                            style = AppTypography.DisplayLarge.copy(
                                fontSize = 24.sp,
                                fontWeight = FontWeight.Black
                            ),
                            color = TalkMeColors.TextPrimary,
                            textAlign = TextAlign.Center
                        )

                        Text(
                            text = "Siz birinchi ingliz tili darsingizni muvaffaqiyatli yakunladingiz! Endi siz 6 ta eng muhim so‘zni va o‘zingizni tanishtirishni bilasiz:",
                            style = AppTypography.BodyMedium,
                            color = TalkMeColors.TextSecondary,
                            textAlign = TextAlign.Center
                        )

                        // Summary Grid of 6 Mastered Words
                        FlowRow(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            SIX_A0_VOCAB_ITEMS.forEach { item ->
                                Row(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(Color(0xFFECFDF5))
                                        .border(1.dp, Color(0xFF6EE7B7), RoundedCornerShape(12.dp))
                                        .clickable { playEnglish(item.english) }
                                        .padding(horizontal = 10.dp, vertical = 6.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Text(text = item.emoji, fontSize = 14.sp)
                                    Text(
                                        text = "${item.english} — ${item.uzbek}",
                                        style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.Bold),
                                        color = Color(0xFF065F46)
                                    )
                                }
                            }
                        }

                        // Personalized sentence badge
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(14.dp))
                                .background(TalkMeColors.ContainerPurpleLight)
                                .clickable { playEnglish("Hello! I am $cleanName.") }
                                .padding(14.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "“Hello! I am $cleanName.”",
                                    style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.Black),
                                    color = TalkMeColors.PrimaryPurple
                                )
                                Text(
                                    text = "“Salom! Men ${cleanName}man.”",
                                    style = AppTypography.LabelMedium,
                                    color = TalkMeColors.TextSecondary
                                )
                            }
                            Icon(
                                imageVector = AppIcons.VolumeUp,
                                contentDescription = null,
                                tint = TalkMeColors.PrimaryPurple,
                                modifier = Modifier.size(20.dp)
                            )
                        }

                        TalkMeButton(
                            text = "Natijalarni ko‘rish • Finish Lesson",
                            variant = TalkMeButtonVariant.Emerald,
                            trailingIcon = AppIcons.ArrowForward,
                            onClick = onCompleteLesson
                        )

                        TalkMeButton(
                            text = "2-Dars: Grammar Fundamentals (10-Bosqich)",
                            variant = TalkMeButtonVariant.Secondary,
                            onClick = onSwitchToFrameworkLesson
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun GreetingAudioComparisonRow(
    english: String,
    phonetic: String,
    uzbek: String,
    noteUz: String,
    isPlaying: Boolean,
    onPlayNormal: () -> Unit,
    onPlaySlow: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(if (isPlaying) TalkMeColors.ContainerPurpleLight else Color(0xFFF8FAFC))
            .border(
                width = if (isPlaying) 2.dp else 1.dp,
                color = if (isPlaying) TalkMeColors.PrimaryPurple else Color(0xFFE2E8F0),
                shape = RoundedCornerShape(16.dp)
            )
            .padding(14.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = english,
                    style = AppTypography.HeadlineMedium.copy(fontWeight = FontWeight.Black),
                    color = TalkMeColors.PrimaryPurple
                )
                Text(
                    text = "$uzbek  ·  $phonetic",
                    style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.Bold),
                    color = Color(0xFF059669)
                )
            }

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(10.dp))
                        .background(TalkMeColors.ContainerAmberLight)
                        .clickable(onClick = onPlaySlow)
                        .padding(horizontal = 10.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = "Sekin",
                        style = AppTypography.LabelSmall.copy(fontWeight = FontWeight.Bold),
                        color = TalkMeColors.WarningAmber
                    )
                }

                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(TalkMeColors.PrimaryPurple)
                        .clickable(onClick = onPlayNormal),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = AppIcons.VolumeUp,
                        contentDescription = "Play",
                        tint = Color.White,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }
        }

        Text(
            text = noteUz,
            style = AppTypography.LabelMedium,
            color = TalkMeColors.TextSecondary
        )
    }
}

@Composable
private fun LegoWordBlock(
    english: String,
    uzbek: String,
    bgColor: Color,
    onClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .clip(RoundedCornerShape(12.dp))
            .background(bgColor)
            .clickable(onClick = onClick)
            .padding(horizontal = 14.dp, vertical = 10.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = english,
            style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.Black),
            color = Color.White
        )
        Text(
            text = uzbek,
            style = AppTypography.BadgeMicro,
            color = Color.White.copy(alpha = 0.85f)
        )
    }
}

/**
 * SECTION 6 — Let's Practice! (5 Interactive Exercises):
 * 1. Translation: "What does Hello mean?" -> Salom
 * 2. Situation: "When do we say Thank you?" -> B. When someone helps us.
 * 3. Build a Sentence: Tap [ I ] [ am ] [ Azamat ] -> "I am Azamat."
 * 4. Listening: Hear "Goodbye" -> Xayr
 * 5. Conversation: Person A: "Hello!" -> Hi!
 */
@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun BeginnerSection6PracticeCard(
    learnerName: String,
    onSpeak: (String) -> Unit,
    onAllExercisesDone: () -> Unit
) {
    var activeExerciseIdx by remember { mutableIntStateOf(0) }
    var selectedOption by remember { mutableStateOf<String?>(null) }
    val selectedSentenceTokens = remember { mutableStateListOf<String>() }
    var isChecked by remember { mutableStateOf(false) }
    var isCorrect by remember { mutableStateOf(false) }

    val totalExercises = 5

    fun resetExerciseState() {
        selectedOption = null
        selectedSentenceTokens.clear()
        isChecked = false
        isCorrect = false
    }

    TalkMeCard {
        Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                TalkMeBadge(
                    text = "SECTION 6 • LET'S PRACTICE!",
                    containerColor = TalkMeColors.ContainerPurpleLight,
                    textColor = TalkMeColors.PrimaryPurple
                )
                Text(
                    text = "Mashq ${activeExerciseIdx + 1} / $totalExercises",
                    style = AppTypography.LabelLarge.copy(fontWeight = FontWeight.Black),
                    color = Color(0xFF059669)
                )
            }

            TalkMeProgressBar(
                progress = (activeExerciseIdx + 1).toFloat() / totalExercises.toFloat(),
                fillColor = TalkMeColors.PrimaryPurple
            )

            when (activeExerciseIdx) {
                // Exercise 1 — Translation
                0 -> {
                    Text(
                        text = "1-Mashq (Translation): What does “Hello” mean?",
                        style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.Black),
                        color = TalkMeColors.TextPrimary
                    )
                    Text(
                        text = "“Hello” so‘zining o‘zbekcha ma’nosi nima?",
                        style = AppTypography.BodyMedium,
                        color = TalkMeColors.TextSecondary
                    )
                    listOf("Rahmat", "Salom", "Xayr").forEach { option ->
                        ExerciseChoiceRow(
                            text = option,
                            isSelected = selectedOption == option,
                            isChecked = isChecked,
                            isCorrectOption = option == "Salom",
                            onClick = {
                                if (!isChecked) selectedOption = option
                            }
                        )
                    }
                }

                // Exercise 2 — Situation
                1 -> {
                    Text(
                        text = "2-Mashq (Situation): When do we say “Thank you”?",
                        style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.Black),
                        color = TalkMeColors.TextPrimary
                    )
                    Text(
                        text = "Qachon “Thank you” (Rahmat) deymiz?",
                        style = AppTypography.BodyMedium,
                        color = TalkMeColors.TextSecondary
                    )
                    val options = listOf(
                        "A. When we say goodbye. (Xayrlashganda)",
                        "B. When someone helps us. (Kimdir bizga yordam berganda)",
                        "C. When we sleep. (Uxlaganda)"
                    )
                    options.forEach { option ->
                        ExerciseChoiceRow(
                            text = option,
                            isSelected = selectedOption == option,
                            isChecked = isChecked,
                            isCorrectOption = option.startsWith("B."),
                            onClick = {
                                if (!isChecked) selectedOption = option
                            }
                        )
                    }
                }

                // Exercise 3 — Build a Sentence
                2 -> {
                    Text(
                        text = "3-Mashq (Build a Sentence): “Men Azamatman” gapini tuzing",
                        style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.Black),
                        color = TalkMeColors.TextPrimary
                    )
                    Text(
                        text = "So‘zlarni ketma-ket bosib “I am Azamat” gapini yasang:",
                        style = AppTypography.BodyMedium,
                        color = TalkMeColors.TextSecondary
                    )

                    // Constructed slots
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(14.dp))
                            .background(Color(0xFFF8FAFC))
                            .border(1.5.dp, TalkMeColors.ContainerPurpleBorder, RoundedCornerShape(14.dp))
                            .padding(14.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        if (selectedSentenceTokens.isEmpty()) {
                            Text(
                                text = "So‘zlarni tanlang...",
                                style = AppTypography.BodyMedium,
                                color = TalkMeColors.TextMuted
                            )
                        } else {
                            selectedSentenceTokens.forEachIndexed { idx, word ->
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(10.dp))
                                        .background(TalkMeColors.PrimaryPurple)
                                        .clickable(enabled = !isChecked) {
                                            selectedSentenceTokens.removeAt(idx)
                                        }
                                        .padding(horizontal = 12.dp, vertical = 8.dp)
                                ) {
                                    Text(
                                        text = word,
                                        style = AppTypography.TitleMedium,
                                        color = Color.White
                                    )
                                }
                            }
                        }
                    }

                    // Word bank
                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        listOf("Azamat", "I", "am", "Hello").forEach { token ->
                            val isUsed = selectedSentenceTokens.contains(token)
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(if (isUsed) Color(0xFFE2E8F0) else Color.White)
                                    .border(1.dp, TalkMeColors.OutlineWarm, RoundedCornerShape(12.dp))
                                    .clickable(enabled = !isUsed && !isChecked) {
                                        onSpeak(token)
                                        selectedSentenceTokens.add(token)
                                    }
                                    .padding(horizontal = 16.dp, vertical = 10.dp)
                            ) {
                                Text(
                                    text = token,
                                    style = AppTypography.TitleMedium,
                                    color = if (isUsed) TalkMeColors.TextMuted else TalkMeColors.TextPrimary
                                )
                            }
                        }
                    }
                }

                // Exercise 4 — Listening
                3 -> {
                    Text(
                        text = "4-Mashq (Listening): Eshiting va to‘g‘ri javobni toping",
                        style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.Black),
                        color = TalkMeColors.TextPrimary
                    )
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .background(TalkMeColors.ContainerPurpleLight)
                            .clickable { onSpeak("Goodbye") }
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .clip(CircleShape)
                                .background(TalkMeColors.PrimaryPurple),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = AppIcons.VolumeUp,
                                contentDescription = "Listen",
                                tint = Color.White,
                                modifier = Modifier.size(22.dp)
                            )
                        }
                        Column {
                            Text(
                                text = "Audioni eshitish uchun bosing",
                                style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.Bold),
                                color = TalkMeColors.PrimaryPurple
                            )
                            Text(
                                text = "So‘z: “Goodbye” — ma’nosi nima?",
                                style = AppTypography.LabelMedium,
                                color = TalkMeColors.TextSecondary
                            )
                        }
                    }

                    listOf("Salom", "Rahmat", "Xayr").forEach { option ->
                        ExerciseChoiceRow(
                            text = option,
                            isSelected = selectedOption == option,
                            isChecked = isChecked,
                            isCorrectOption = option == "Xayr",
                            onClick = {
                                if (!isChecked) selectedOption = option
                            }
                        )
                    }
                }

                // Exercise 5 — Conversation
                else -> {
                    Text(
                        text = "5-Mashq (Conversation): Suhbatni davom ettiring",
                        style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.Black),
                        color = TalkMeColors.TextPrimary
                    )
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(14.dp))
                            .background(Color(0xFFECFDF5))
                            .border(1.dp, Color(0xFF6EE7B7), RoundedCornerShape(14.dp))
                            .clickable { onSpeak("Hello!") }
                            .padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Text(text = "🧑", fontSize = 24.sp)
                        Column {
                            Text(
                                text = "Suhbatdosh: “Hello!”",
                                style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.ExtraBold),
                                color = Color(0xFF065F46)
                            )
                            Text(
                                text = "Siz qanday javob berasiz?",
                                style = AppTypography.LabelMedium,
                                color = TalkMeColors.TextSecondary
                            )
                        }
                    }

                    listOf("Goodbye", "Hi!", "Thank you").forEach { option ->
                        ExerciseChoiceRow(
                            text = option,
                            isSelected = selectedOption == option,
                            isChecked = isChecked,
                            isCorrectOption = option == "Hi!",
                            onClick = {
                                if (!isChecked) {
                                    selectedOption = option
                                    onSpeak(option)
                                }
                            }
                        )
                    }
                }
            }

            // Feedback Banner
            AnimatedVisibility(visible = isChecked) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(
                            if (isCorrect) TalkMeColors.ContainerGreenLight
                            else TalkMeColors.ContainerCoralLight
                        )
                        .padding(14.dp)
                ) {
                    Text(
                        text = if (isCorrect) {
                            "🎉 Barakalla! Javobingiz to‘g‘ri! This is very easy!"
                        } else {
                            "💡 Yana bir bor urinib ko‘ring! Siz albatta uddalaysiz!"
                        },
                        style = AppTypography.BodyMedium.copy(fontWeight = FontWeight.Bold),
                        color = if (isCorrect) Color(0xFF065F46) else TalkMeColors.ErrorCoral
                    )
                }
            }

            // Action Button (Tekshirish / Keyingi mashq)
            val canSubmit = if (activeExerciseIdx == 2) {
                selectedSentenceTokens.isNotEmpty()
            } else {
                selectedOption != null
            }

            TalkMeButton(
                text = when {
                    !isChecked -> "Tekshirish"
                    !isCorrect -> "Qayta urinish"
                    activeExerciseIdx < totalExercises - 1 -> "Keyingi mashq"
                    else -> "Darsni yakunlash 🎉"
                },
                enabled = canSubmit || isChecked,
                variant = if (isCorrect) TalkMeButtonVariant.Emerald else TalkMeButtonVariant.Primary,
                onClick = {
                    if (!isChecked) {
                        isChecked = true
                        isCorrect = when (activeExerciseIdx) {
                            0 -> selectedOption == "Salom"
                            1 -> selectedOption?.startsWith("B.") == true
                            2 -> selectedSentenceTokens.joinToString(" ").equals("I am Azamat", ignoreCase = true)
                            3 -> selectedOption == "Xayr"
                            else -> selectedOption == "Hi!"
                        }
                        if (isCorrect) {
                            onSpeak("Great job!")
                        }
                    } else if (!isCorrect) {
                        resetExerciseState()
                    } else if (activeExerciseIdx < totalExercises - 1) {
                        activeExerciseIdx += 1
                        resetExerciseState()
                    } else {
                        onAllExercisesDone()
                    }
                }
            )
        }
    }
}

@Composable
private fun ExerciseChoiceRow(
    text: String,
    isSelected: Boolean,
    isChecked: Boolean,
    isCorrectOption: Boolean,
    onClick: () -> Unit
) {
    val bgColor = when {
        isChecked && isCorrectOption -> TalkMeColors.ContainerGreenLight
        isChecked && isSelected && !isCorrectOption -> TalkMeColors.ContainerCoralLight
        isSelected -> TalkMeColors.ContainerPurpleLight
        else -> Color(0xFFF8FAFC)
    }
    val borderColor = when {
        isChecked && isCorrectOption -> TalkMeColors.SuccessGreen
        isChecked && isSelected && !isCorrectOption -> TalkMeColors.ErrorCoral
        isSelected -> TalkMeColors.PrimaryPurple
        else -> Color(0xFFE2E8F0)
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(14.dp))
            .background(bgColor)
            .border(1.5.dp, borderColor, RoundedCornerShape(14.dp))
            .clickable(onClick = onClick)
            .padding(14.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = text,
            style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.SemiBold),
            color = TalkMeColors.TextPrimary,
            modifier = Modifier.weight(1f)
        )
        if (isChecked && isCorrectOption) {
            Icon(
                imageVector = AppIcons.CheckCircle,
                contentDescription = null,
                tint = TalkMeColors.SuccessGreen,
                modifier = Modifier.size(20.dp)
            )
        }
    }
}
