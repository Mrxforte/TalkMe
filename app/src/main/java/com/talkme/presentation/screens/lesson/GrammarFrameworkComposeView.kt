package com.talkme.presentation.screens.lesson

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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateMapOf
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

private data class FrameworkSubtopicRuleModel(
    val id: String,
    val titleEn: String,
    val titleUz: String,
    val explanationUz: String,
    val formula: String,
    val exampleEn: String,
    val exampleUz: String,
    val memoryTipUz: String
)

private val EIGHT_FRAMEWORK_RULES = listOf(
    FrameworkSubtopicRuleModel(
        id = "rule_1_grammar",
        titleEn = "1. What is Grammar?",
        titleUz = "Grammatika nima?",
        explanationUz = "Grammatika — so‘zlarni to‘g‘ri shaklda qo‘llash va ulardan aniq ma’noli gap tuzish tizimi.",
        formula = "Letters → Words → Phrases → Clauses → Sentences",
        exampleEn = "Students learn English grammar step by step.",
        exampleUz = "O‘quvchilar ingliz tili grammatikasini bosqichma-bosqich o‘rganadilar.",
        memoryTipUz = "So‘zlar — g‘ishtlar, grammatika esa ularni biriktiruvchi sementdir."
    ),
    FrameworkSubtopicRuleModel(
        id = "rule_2_letters",
        titleEn = "2. Letters and Sounds",
        titleUz = "Harflar va tovushlar (26 Letters = 5 Vowels + 21 Consonants)",
        explanationUz = "Ingliz alifbosida 26 ta harf bor (5 unli: A, E, I, O, U va 21 undosh), ammo ular 44 xil tovush hosil qiladi.",
        formula = "26 Letters = 5 Vowels (A,E,I,O,U) + 21 Consonants",
        exampleEn = "An apple and a book.",
        exampleUz = "Olma va kitob.",
        memoryTipUz = "Unli tovush bilan boshlansa 'an', undosh tovush bilan boshlansa 'a' ishlatiladi."
    ),
    FrameworkSubtopicRuleModel(
        id = "rule_3_word",
        titleEn = "3. Word",
        titleUz = "So‘z va uning ma’nosi",
        explanationUz = "Harflar ma’lum tartibda birikib ma’noga ega bo‘lgan eng kichik mustaqil birlik — so‘zni hosil qiladi.",
        formula = "Root + Prefix / Suffix = Word",
        exampleEn = "Teach + er = Teacher (O‘qituvchi)",
        exampleUz = "O‘qitmoq + chi = O‘qituvchi",
        memoryTipUz = "-er qo‘shimchasi fe’ldan shaxs otini yasaydi."
    ),
    FrameworkSubtopicRuleModel(
        id = "rule_4_phrase",
        titleEn = "4. Phrase (So‘z birikmasi)",
        titleUz = "Ibora va so‘z birikmasi",
        explanationUz = "Ikki yoki undan ortiq so‘z birikib bitta tushunchani bildiradi, lekin unda to‘liq ega va kesim bo‘lmaydi.",
        formula = "Determiner + Adjective + Noun = Noun Phrase",
        exampleEn = "a very smart student",
        exampleUz = "juda aqlli o‘quvchi",
        memoryTipUz = "Phrase — gapning bo‘lagi, to‘liq gap emas."
    ),
    FrameworkSubtopicRuleModel(
        id = "rule_5_clause",
        titleEn = "5. Clause",
        titleUz = "Klauza (Ega + Kesimli tuzilma)",
        explanationUz = "Ichida Ega (Subject) va Kesim (Verb) mavjud bo‘lgan grammatik birlik.",
        formula = "Subject (S) + Verb (V)",
        exampleEn = "Because she studies hard, she succeeds.",
        exampleUz = "U astoydil o‘qigani uchun muvaffaqiyatga erishadi.",
        memoryTipUz = "Har bir Clause ichida kamida bitta Subject va Verb bo‘ladi."
    ),
    FrameworkSubtopicRuleModel(
        id = "rule_6_sentence",
        titleEn = "6. Sentence Structure (S + V + O)",
        titleUz = "Ingliz tilida gap tartibi",
        explanationUz = "Ingliz tilida darak gaplar qat’iy S + V + O (Ega + Kesim + To‘ldiruvchi) tartibida quriladi.",
        formula = "Subject + Verb + Object (+ Place + Time)",
        exampleEn = "Aziz reads English books every evening.",
        exampleUz = "Aziz har oqshom inglizcha kitoblar o‘qiydi.",
        memoryTipUz = "O‘zbek tilida fe’l oxirida kelsa, ingliz tilida Ega (Subject) dan keyin darhol Fe’l (Verb) keladi!"
    ),
    FrameworkSubtopicRuleModel(
        id = "rule_7_pos",
        titleEn = "7. 8 Parts of Speech",
        titleUz = "8 ta So‘z Turkumi",
        explanationUz = "Noun (Ot), Pronoun (Olmosh), Verb (Fe’l), Adjective (Sifat), Adverb (Ravish), Preposition (Predlog), Conjunction (Bog‘lovchi), Interjection (Undov).",
        formula = "N • Pron • V • Adj • Adv • Prep • Conj • Interj",
        exampleEn = "Wow! She quickly read the new book and smiled.",
        exampleUz = "Qoyil! U yangi kitobni tez o‘qidi va jilmaydi.",
        memoryTipUz = "So‘zning qaysi turkumga kirishi uning gapdagi vazifasini belgilaydi."
    ),
    FrameworkSubtopicRuleModel(
        id = "rule_8_hierarchy",
        titleEn = "8. Grammar Hierarchy",
        titleUz = "Grammatik ierarxiya piramidasi",
        explanationUz = "Kichik birliklardan katta muloqotga: Harf → So‘z → Birikma → Klauza → Gap.",
        formula = "Letter → Word → Phrase → Clause → Sentence",
        exampleEn = "C-a-t → Cat → The black cat → The black cat sleeps.",
        exampleUz = "M-u-sh-u-k → Mushuk → Qora mushuk → Qora mushuk uxlayapti.",
        memoryTipUz = "Poydevor qanchalik mustahkam bo‘lsa, murakkab gaplarni tuzish shunchalik oson!"
    )
)

private data class SentenceTokenModel(
    val word: String,
    val pos: String,
    val role: String,
    val noteUz: String,
    val badgeColor: Color
)

private val INTERACTIVE_SENTENCE_TOKENS = listOf(
    SentenceTokenModel("The", "Article", "Determiner", "Aniq artikl — keyingi otni aniqlab keladi.", Color(0xFFD97706)),
    SentenceTokenModel("clever", "Adjective", "Modifier", "Sifat — 'student' otining belgisini bildiradi.", Color(0xFF0284C7)),
    SentenceTokenModel("student", "Noun", "Subject (Ega)", "Ot — ish-harakatni bajaruvchi ega.", Color(0xFF4F46E5)),
    SentenceTokenModel("reads", "Verb", "Predicate (Kesim)", "Fe’l — Present Simple 3-shaxs birlik (-s).", Color(0xFF059669)),
    SentenceTokenModel("English", "Adjective/Noun", "Modifier", "Qaysi tildagi kitob ekanini aniqlaydi.", Color(0xFF7C3AED)),
    SentenceTokenModel("books", "Noun", "Object (To‘ldiruvchi)", "Ko‘plikdagi ot — harakat yo‘nalgan narsa.", Color(0xFF4F46E5)),
    SentenceTokenModel("quickly.", "Adverb", "Adverbial (Hol)", "Ravish — harakatning qanday bajarilishini bildiradi (-ly).", Color(0xFF0D9488))
)

private val TEN_STAGE_LABELS = listOf(
    "1. Kirish",
    "2. 8 Qoida",
    "3. Jonli Misol",
    "4. Bo‘sh joy",
    "5. So‘z yasash",
    "6. Lug‘at",
    "7. Grammatika",
    "8. Tinglash",
    "9. Krossvord",
    "10. Yakuniy Test"
)

/**
 * Pixel-perfect Jetpack Compose implementation of the 10-Stage **Grammar Fundamentals**
 * lesson (`src/features/grammar/components/GrammarLessonFrameworkView.tsx`).
 */
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun GrammarFrameworkComposeView(
    onFinishFrameworkLesson: () -> Unit,
    modifier: Modifier = Modifier
) {
    val appState = LocalTalkMeAppState.current
    val currentStage = appState.frameworkCurrentStageIndex.coerceIn(0, 9)
    var selectedRuleIndex by remember { mutableIntStateOf(0) }
    var selectedTokenIndex by remember { mutableIntStateOf(2) }

    // Interactive Crossword State
    val crosswordLetters = remember {
        mutableStateMapOf(
            "0_0" to "B", "0_1" to "O", "0_2" to "O", "0_3" to "K",
            "1_0" to "R", "1_1" to "E", "1_2" to "", "1_3" to "D",
            "2_0" to "F", "2_1" to "A", "2_2" to "S", "2_3" to "T"
        )
    }

    val progressFraction = (currentStage + 1).toFloat() / 10f

    Column(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Dark Indigo-Emerald Hero Banner matching GrammarLessonFrameworkView.tsx
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(22.dp))
                .background(
                    Brush.linearGradient(
                        listOf(Color(0xFF1E1B4B), Color(0xFF312E81), Color(0xFF064E3B))
                    )
                )
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                TalkMeBadge(
                    text = "A1 • 10-BOSQICHLI TIZIM",
                    containerColor = Color(0xFF34D399).copy(alpha = 0.2f),
                    textColor = Color(0xFFA7F3D0)
                )
                Text(
                    text = "Bosqich ${currentStage + 1} / 10",
                    style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.Black),
                    color = Color(0xFFFCD34D)
                )
            }

            Text(
                text = "Grammar Fundamentals",
                style = AppTypography.HeadlineMedium.copy(fontWeight = FontWeight.Black),
                color = Color.White
            )

            TalkMeProgressBar(
                progress = progressFraction,
                trackColor = Color.White.copy(alpha = 0.2f),
                fillColor = Color(0xFF34D399)
            )

            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                contentPadding = PaddingValues(top = 4.dp)
            ) {
                itemsIndexed(TEN_STAGE_LABELS) { idx, label ->
                    val isCurrent = idx == currentStage
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .background(
                                if (isCurrent) Color(0xFF34D399)
                                else Color.White.copy(alpha = 0.14f)
                            )
                            .clickable { appState.frameworkCurrentStageIndex = idx }
                            .padding(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = label,
                            style = AppTypography.LabelSmall.copy(fontWeight = FontWeight.Bold),
                            color = if (isCurrent) Color(0xFF020617) else Color.White
                        )
                    }
                }
            }
        }

        when (currentStage) {
            // Stage 1: Overview & Learning Objectives
            0 -> {
                TalkMeCard {
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        TalkMeBadge(
                            text = "STAGE 1 • GRAMMAR FUNDAMENTALS",
                            containerColor = TalkMeColors.ContainerPurpleLight,
                            textColor = TalkMeColors.PrimaryPurple
                        )
                        Text(
                            text = "Ingliz tili grammatikasining poydevori",
                            style = AppTypography.HeadlineMedium.copy(fontWeight = FontWeight.Black),
                            color = TalkMeColors.TextPrimary
                        )
                        Text(
                            text = "Ushbu darsda harf va tovushlardan tortib so‘z turkumlari, so‘z birikmalari (Phrase), klauzalar (Clause) va S + V + O gap tartibigacha bo‘lgan 8 ta fundamental qoidani interaktiv misollar bilan o‘rganasiz.",
                            style = AppTypography.BodyMedium,
                            color = TalkMeColors.TextSecondary
                        )

                        listOf(
                            "26 ta harf (5 unli va 21 undosh) hamda tovushlar farqi",
                            "Word → Phrase → Clause → Sentence ierarxiyasi",
                            "Ingliz tilidagi qat’iy S + V + O gap tuzilishi",
                            "8 ta so‘z turkumi (Parts of Speech) va 2D Krossvord"
                        ).forEach { goal ->
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Icon(
                                    imageVector = AppIcons.CheckCircle,
                                    contentDescription = null,
                                    tint = TalkMeColors.SuccessGreen,
                                    modifier = Modifier.size(18.dp)
                                )
                                Text(
                                    text = goal,
                                    style = AppTypography.BodyMedium.copy(fontWeight = FontWeight.SemiBold),
                                    color = TalkMeColors.TextPrimary
                                )
                            }
                        }

                        TalkMeButton(
                            text = "8 ta Qoidani boshlash",
                            trailingIcon = AppIcons.ArrowForward,
                            onClick = { appState.frameworkCurrentStageIndex = 1 }
                        )
                    }
                }
            }

            // Stage 2: 8 Subtopic Rules Explorer
            1 -> {
                val activeRule = EIGHT_FRAMEWORK_RULES[selectedRuleIndex]
                TalkMeCard {
                    Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                        Text(
                            text = "8 ta Fundamental Grammatika Qoidasi",
                            style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.Black),
                            color = TalkMeColors.TextPrimary
                        )

                        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            itemsIndexed(EIGHT_FRAMEWORK_RULES) { idx, rule ->
                                val selected = idx == selectedRuleIndex
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(10.dp))
                                        .background(
                                            if (selected) TalkMeColors.PrimaryPurple
                                            else TalkMeColors.ContainerPurpleLight
                                        )
                                        .clickable {
                                            selectedRuleIndex = idx
                                            appState.recordRuleMastered(rule.id)
                                        }
                                        .padding(horizontal = 12.dp, vertical = 7.dp)
                                ) {
                                    Text(
                                        text = "${idx + 1}-Qoida",
                                        style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.Bold),
                                        color = if (selected) Color.White else TalkMeColors.PrimaryPurple
                                    )
                                }
                            }
                        }

                        Text(
                            text = activeRule.titleEn,
                            style = AppTypography.HeadlineMedium.copy(fontWeight = FontWeight.Black),
                            color = TalkMeColors.PrimaryPurple
                        )
                        Text(
                            text = activeRule.titleUz,
                            style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.Bold),
                            color = TalkMeColors.TextPrimary
                        )
                        Text(
                            text = activeRule.explanationUz,
                            style = AppTypography.BodyLarge,
                            color = TalkMeColors.TextSecondary
                        )

                        // Formula Box
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(14.dp))
                                .background(TalkMeColors.ContainerPurpleLight)
                                .border(1.dp, TalkMeColors.ContainerPurpleBorder, RoundedCornerShape(14.dp))
                                .padding(14.dp),
                            verticalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Text(
                                text = "FORMULA TUZILISHI",
                                style = AppTypography.BadgeMicro,
                                color = TalkMeColors.PrimaryPurple
                            )
                            Text(
                                text = activeRule.formula,
                                style = AppTypography.FormulaMono,
                                color = TalkMeColors.TextPrimary
                            )
                        }

                        // Audio Example Row
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(14.dp))
                                .background(Color(0xFFF8FAFC))
                                .border(1.dp, Color(0xFFE2E8F0), RoundedCornerShape(14.dp))
                                .clickable { appState.speak(activeRule.exampleEn) }
                                .padding(14.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = activeRule.exampleEn,
                                    style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.Bold),
                                    color = TalkMeColors.TextPrimary
                                )
                                Text(
                                    text = activeRule.exampleUz,
                                    style = AppTypography.BodyMedium,
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
                                    contentDescription = "Speak",
                                    tint = Color.White,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                        }

                        // Memory Tip
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(12.dp))
                                .background(TalkMeColors.ContainerGreenLight)
                                .padding(12.dp),
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = AppIcons.Lightbulb,
                                contentDescription = null,
                                tint = TalkMeColors.SuccessGreen,
                                modifier = Modifier.size(18.dp)
                            )
                            Text(
                                text = activeRule.memoryTipUz,
                                style = AppTypography.LabelMedium.copy(fontWeight = FontWeight.SemiBold),
                                color = Color(0xFF065F46)
                            )
                        }

                        TalkMeButton(
                            text = "Keyingi bosqich: Jonli Gap Tahlili",
                            trailingIcon = AppIcons.ArrowForward,
                            onClick = { appState.frameworkCurrentStageIndex = 2 }
                        )
                    }
                }
            }

            // Stage 3: Interactive Sentence Token Inspector
            2 -> {
                val selectedToken = INTERACTIVE_SENTENCE_TOKENS[selectedTokenIndex]
                TalkMeCard {
                    Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                        TalkMeBadge(
                            text = "STAGE 3 • INTERACTIVE SENTENCE ANATOMY",
                            containerColor = TalkMeColors.ContainerPurpleLight,
                            textColor = TalkMeColors.PrimaryPurple
                        )
                        Text(
                            text = "Gapdagi har bir so‘zni bosing va vazifasini ko‘ring:",
                            style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.Black),
                            color = TalkMeColors.TextPrimary
                        )

                        FlowRow(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            INTERACTIVE_SENTENCE_TOKENS.forEachIndexed { idx, token ->
                                val isSelected = idx == selectedTokenIndex
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(
                                            if (isSelected) token.badgeColor
                                            else Color(0xFFF8FAFC)
                                        )
                                        .border(
                                            1.5.dp,
                                            token.badgeColor,
                                            RoundedCornerShape(12.dp)
                                        )
                                        .clickable {
                                            selectedTokenIndex = idx
                                            appState.speak(token.word)
                                        }
                                        .padding(horizontal = 12.dp, vertical = 8.dp)
                                ) {
                                    Text(
                                        text = token.word,
                                        style = AppTypography.TitleMedium.copy(fontWeight = FontWeight.Bold),
                                        color = if (isSelected) Color.White else TalkMeColors.TextPrimary
                                    )
                                }
                            }
                        }

                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .background(TalkMeColors.ContainerPurpleLight)
                                .padding(16.dp),
                            verticalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                TalkMeBadge(
                                    text = selectedToken.pos,
                                    containerColor = selectedToken.badgeColor,
                                    textColor = Color.White
                                )
                                TalkMeBadge(
                                    text = selectedToken.role,
                                    containerColor = Color.White,
                                    textColor = TalkMeColors.PrimaryPurple
                                )
                            }
                            Text(
                                text = "“${selectedToken.word}” — ${selectedToken.noteUz}",
                                style = AppTypography.BodyLarge.copy(fontWeight = FontWeight.SemiBold),
                                color = TalkMeColors.TextPrimary
                            )
                        }

                        TalkMeButton(
                            text = "2D Krossvord va Amaliyotga o‘tish",
                            trailingIcon = AppIcons.ArrowForward,
                            onClick = { appState.frameworkCurrentStageIndex = 8 }
                        )
                    }
                }
            }

            // Stage 9 (index 8): Playable 2D Crossword Puzzle
            8 -> {
                TalkMeCard {
                    Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                        TalkMeBadge(
                            text = "STAGE 9 • PLAYABLE 2D CROSSWORD",
                            containerColor = Color(0xFFD1FAE5),
                            textColor = Color(0xFF065F46)
                        )
                        Text(
                            text = "Grammatik Krossvord (So‘z turkumlari)",
                            style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.Black),
                            color = TalkMeColors.TextPrimary
                        )
                        Text(
                            text = "Bo‘sh katakchani to‘ldiring: 1. BOOK (Ot/Noun), 2. READ (Fe’l/Verb), 3. FAST (Ravish/Adverb)",
                            style = AppTypography.BodyMedium,
                            color = TalkMeColors.TextSecondary
                        )

                        // 3x4 Mini Crossword Grid
                        Column(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            for (row in 0..2) {
                                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    for (col in 0..3) {
                                        val key = "${row}_${col}"
                                        val letter = crosswordLetters[key] ?: ""
                                        val isEditable = row == 1 && col == 2
                                        Box(
                                            modifier = Modifier
                                                .size(54.dp)
                                                .clip(RoundedCornerShape(12.dp))
                                                .background(
                                                    if (letter.isNotEmpty()) TalkMeColors.ContainerPurpleLight
                                                    else Color(0xFFFEF3C7)
                                                )
                                                .border(
                                                    2.dp,
                                                    if (isEditable) Color(0xFFD97706) else TalkMeColors.PrimaryPurple,
                                                    RoundedCornerShape(12.dp)
                                                )
                                                .clickable(enabled = isEditable) {
                                                    crosswordLetters["1_2"] = "A"
                                                    appState.speak("READ")
                                                },
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text(
                                                text = if (letter.isEmpty()) "?" else letter,
                                                style = AppTypography.TitleLarge.copy(fontWeight = FontWeight.Black),
                                                color = TalkMeColors.PrimaryPurple
                                            )
                                        }
                                    }
                                }
                            }
                        }

                        if (crosswordLetters["1_2"] == "A") {
                            Text(
                                text = "✓ Ajoyib! BOOK (Noun), READ (Verb), FAST (Adverb) to‘liq topildi!",
                                style = AppTypography.LabelLarge.copy(fontWeight = FontWeight.Bold),
                                color = TalkMeColors.SuccessGreen,
                                textAlign = TextAlign.Center,
                                modifier = Modifier.fillMaxWidth()
                            )
                        } else {
                            Text(
                                text = "💡 '?' belgili katakchani bosing ('A' harfini joylashtirish uchun)",
                                style = AppTypography.LabelMedium,
                                color = Color(0xFFD97706),
                                textAlign = TextAlign.Center,
                                modifier = Modifier.fillMaxWidth()
                            )
                        }

                        TalkMeButton(
                            text = "Yakuniy Xulosa (Stage 10)",
                            variant = TalkMeButtonVariant.Emerald,
                            trailingIcon = AppIcons.ArrowForward,
                            onClick = { appState.frameworkCurrentStageIndex = 9 }
                        )
                    }
                }
            }

            // Other stages & Stage 10 Final Wrap-up
            else -> {
                TalkMeCard {
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        Text(text = "🏆", fontSize = 46.sp)
                        TalkMeBadge(
                            text = "STAGE ${currentStage + 1} • GRAMMAR FUNDAMENTALS",
                            containerColor = Color(0xFFD1FAE5),
                            textColor = Color(0xFF065F46)
                        )
                        Text(
                            text = "Grammar Fundamentals — Muvaffaqiyatli!",
                            style = AppTypography.HeadlineMedium.copy(fontWeight = FontWeight.Black),
                            color = TalkMeColors.TextPrimary,
                            textAlign = TextAlign.Center
                        )
                        Text(
                            text = "Siz 8 ta fundamental qoida, S + V + O gap tuzilishi, 8 ta so‘z turkumi va 2D krossvordni o‘zlashtirdingiz.",
                            style = AppTypography.BodyMedium,
                            color = TalkMeColors.TextSecondary,
                            textAlign = TextAlign.Center
                        )
                        TalkMeButton(
                            text = "Darsni yakunlash va Natijani ko‘rish",
                            variant = TalkMeButtonVariant.Emerald,
                            trailingIcon = AppIcons.ArrowForward,
                            onClick = {
                                EIGHT_FRAMEWORK_RULES.forEach { appState.recordRuleMastered(it.id) }
                                appState.awardXpAndDiamonds(100, 25, "lvl_2")
                                onFinishFrameworkLesson()
                            }
                        )
                    }
                }
            }
        }
    }
}
