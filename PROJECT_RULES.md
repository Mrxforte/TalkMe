# TalkMe - Comprehensive Application Architecture, Design System & Project Rules

This document serves as the **authoritative, single source of truth** for all architectural patterns, design system rules, technology stack specifications, string usage mappings, and development guidelines for the **TalkMe** Android project based on design specifications.

---

## 🏗️ 1. Complete Application Architecture & Screen Flow

The TalkMe application is built according to **Clean Architecture** principles combined with **MVVM/MVI**, **Jetpack Compose**, and **Hilt Dependency Injection**.

### 1.1 Startup Sequence & Screen Flow
1. **Splash Screen (`SplashScreen.kt`)**: Initial branding screen loaded on app launch (2-second timer).
2. **Onboarding Welcome Screen (`OnboardingScreen.kt`)**: **Pixel-Perfect Welcome & Onboarding Screen** (matching Untitled.pdf Page 6 & 7) featuring top header with language selector ("O'zbekcha"), hero illustration box container (`ContainerPurpleLight`), highlighted heading text with "ishongan holda" in primary purple, highlight feature chips (10 min / self-pace) with clock and repeat icons, start & login action buttons, and terms & conditions footer note.
3. **Home Dashboard (`HomeScreen.kt`)**: Central learning dashboard with bottom bar navigation to Courses, Repeat, and Results screens, and deep-links to lesson details and user profile.
4. **Courses Catalog (`CoursesScreen.kt`)**: **Pixel-Perfect CEFR Level Path Catalog Screen** (matching Untitled.pdf Page 2) featuring CEFR level selector chips (A1-C2), category filter tabs, detailed grammar catalog breakdown, Module 1 subtopic cards (`TalkMeSubtopicCard`) with rounded purple indicator dots and `onClick: () -> Unit` clickability, search action lens, and sticky "Grammatika katalogini davom ettirish" button.
5. **Lesson Detail Screen (`LessonDetailScreen.kt`)**: **Pixel-Perfect Lesson Detail Screen** (matching Untitled.pdf Page 3) featuring bookmark action button, Qoida/Misol/Mashq segment tabs with completion checkmark `✓` icon, formula structure box with Pronoun Grid Table (`PronounColumnItem`) and `AppIcons.Layers` icon, example audio cards with highlighted verb phrases and circular speaker buttons (`ExampleAudioCard`), pronunciation wave tip card, and "Mashqlarga o'tish" action button.
6. **Lesson Result Screen (`LessonResultScreen.kt`)**: **Pixel-Perfect Lesson Result Screen** (matching Untitled.pdf Page 5) featuring share action button, completion banner card (`ContainerPurpleLight`) with "Dars yakunlandi" green chip, checkmark icon, score percentage, time spent, XP earned stats row, weekly plan progress bar, rule correction tip card ("Bir joyini mustahkamlaymiz"), and exam prep card.

### 1.2 Architectural Layers & Package Hierarchy

```
com.example.talkme/
├── App.kt                       # Application class annotated with @HiltAndroidApp
├── MainActivity.kt              # Main Activity host annotated with @AndroidEntryPoint
│
├── data/                        # DATA LAYER (Data sources, Repositories Implementation, DTOs, Mappers)
│   ├── datasource/              # Local (Room) and Remote (Retrofit/Ktor) data sources
│   ├── mapper/                  # Entity <-> Domain Model mappers
│   ├── model/                   # Data Transfer Objects (DTOs) & Database Entities
│   └── repository/              # Repository Interface implementations
│
├── domain/                      # DOMAIN LAYER (Pure Kotlin Business Logic - Framework Independent)
│   ├── model/                   # Business domain entities
│   ├── repository/              # Repository interfaces
│   └── usecase/                 # Isolated single-responsibility Use Cases
│
├── di/                          # DEPENDENCY INJECTION LAYER
│   └── AppModule.kt             # Hilt DI modules providing Singletons & Repositories
│
├── presentation/                # PRESENTATION LAYER (UI, ViewModels, State)
│   ├── components/              # Generic Reusable Design System Widgets
│   │   ├── TalkMeButton.kt      # Universal Action Button
│   │   ├── TalkMeBadge.kt       # Universal Level/Category/Streak Chip
│   │   ├── TalkMeCard.kt        # Universal Surface Card Container
│   │   ├── TalkMeHeader.kt      # Universal Top Navigation Header (Left Back Arrow)
│   │   ├── TalkMeTabRow.kt      # Universal Segmented Tab Selector (supports ✓ checkmarks)
│   │   ├── TalkMeProgressBar.kt # Universal Smooth Progress Bar
│   │   ├── TalkMeBottomBar.kt   # Universal Bottom Navigation Bar
│   │   ├── TalkMeOptionCard.kt  # Universal Selectable Choice & Module Item Card
│   │   ├── TalkMeBannerCard.kt  # Universal Feature & Practice Banner Container
│   │   └── TalkMeSubtopicCard.kt# Universal Clickable Subtopic Card Container with Purple Indicator Dot
│   ├── navigation/              # Navigation System
│   │   ├── Screen.kt            # Type-Safe Sealed Routes
│   │   └── NavGraph.kt          # AppNavGraph & Tab State Manager
│   └── screens/                 # Cleanly Modularized UI Screens
│       ├── splash/              # Splash Intro Feature (SplashScreen.kt)
│       ├── onboarding/          # Welcome & Onboarding Feature (OnboardingScreen.kt - Pixel Perfect)
│       ├── home/                # Home Dashboard Feature (HomeScreen.kt & components/)
│       ├── courses/             # Courses Catalog Feature (CoursesScreen.kt - Pixel Perfect)
│       ├── lesson/              # Lesson Rules, Exercises & Score Features
│       │   ├── LessonDetailScreen.kt# Detailed Grammar Rule & Example Card View (Pixel Perfect)
│       │   ├── QuizScreen.kt    # Interactive Exercises & Option Cards
│       │   └── LessonResultScreen.kt# Score Breakdown & Goal Summary (Pixel Perfect)
│       ├── repeat/              # Spaced Repetition Vocabulary Feature (RepeatScreen.kt)
│       ├── results/             # Leaderboard & Analytics Feature (ResultsScreen.kt)
│       └── profile/             # User Profile & Achievements Feature (ProfileScreen.kt)
│
└── ui/theme/                    # DESIGN SYSTEM TOKENS & ENGINE
    ├── Color.kt                 # Semantic Color Palette & Documentation
    ├── Dimensions.kt            # Spacing, Margins, Corner Radii, Icon Sizes & LocalDimensions
    ├── AppIcons.kt              # Centralized Drawable Icon Repository (ChevronLeft, Bookmark, Volume, AudioWave, Layers, Check, Share, School, Clock)
    ├── Type.kt                  # AppTypography Scale & Detailed Font Documentation
    └── Theme.kt                 # Material3 Theme & Local Composition Providers
```

---

## ⚙️ 2. Technology Stack & Dependencies

| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Build System** | Android Gradle Plugin (AGP) | `9.4.1` | Project build & resource merger |
| **Language** | Kotlin | `2.0.21` | Modern, safe Kotlin compiler |
| **UI Toolkit** | Jetpack Compose BOM | `2026.02.01` | Declarative UI framework |
| **Design System** | Material Design 3 | Integrated | Material3 color schemes & typography |
| **Dependency Injection** | Dagger Hilt | `2.60.1` | Compile-time dependency injection |
| **Annotation Processing** | KSP (Kotlin Symbol Processing) | `2.0.21-1.0.28` | High-performance code generation |
| **Navigation** | Navigation Compose | `2.8.8` | Declarative type-safe screen routing |
| **Architecture Components**| Lifecycle Runtime & ViewModel | `2.11.0` | StateFlow UI state management |

---

## 🎨 3. Design System Engine & Tokens

### 3.1 Color System (`ui/theme/Color.kt`)
- **Brand Colors**: `BrandPurple` (`0xFF5E4B8B`) - Primary buttons, active tab indicators, branding highlights.
- **Secondary Accent**: `SuccessGreen` (`0xFF27AE60`) - Vocabulary banners, action completion, success badges.
- **Backgrounds**: `ScreenBackground` (`0xFFFAFAFC`) - Main screen surface; `SurfaceWhite` (`0xFFFFFFFF`) - Card containers.
- **Containers**: `ContainerPurpleLight` (`0xFFF1EDFA`) - Lesson card container & onboarding hero box; `ContainerGreenLight` (`0xFFE8F8EE`) - Vocabulary practice & completed level chip container.
- **Text Scale**: `TextPrimary` (`0xFF1D1B20`), `TextSecondary` (`0xFF757575`), `TextMuted` (`0xFF9E9E9E`), `TextCardSubtitle` (`0xFF6E6B7B`).

### 3.2 Typography Scale (`ui/theme/Type.kt` & `AppTypography`)
Every text element in the app uses pre-configured text styles from `AppTypography` documented in `Type.kt`:

| Style Name | Font Size | Font Weight | Line Height | Usage Location |
| :--- | :--- | :--- | :--- | :--- |
| `SplashTitle` | `22.sp` | Bold | `28.sp` | Main branding headline on Splash screen |
| `SplashSubtitle` | `13.sp` | Normal | `18.sp` | Subtitle description on Splash screen |
| `SplashFooter` | `11.sp` | Normal | `16.sp` | Legal/note footer text on Splash screen (1.2sp letterSpacing) |
| `GreetingTitle` | `24.sp` | Bold | `30.sp` | User greeting header on Home Dashboard & Onboarding |
| `GreetingSubtitle` | `13.sp` | Normal | `18.sp` | Tagline subtitle on Home Dashboard & Onboarding |
| `LessonTitle` | `20.sp` | Bold | `26.sp` | Active lesson heading in cards and detail views |
| `LessonSubtitle` | `13.sp` | Normal | `18.sp` | Active lesson explanation summary |
| `LessonDetails` | `12.sp` | Normal | `16.sp` | Small lesson metadata details (duration, rules) |
| `LessonTag` | `11.sp` | Bold | - | Category/level indicator tag in formula headers (1.sp letterSpacing) |
| `BannerTitle` | `15.sp` | Bold | `20.sp` | Heading title for practice & vocabulary banners |
| `BannerSubtitle` | `12.sp` | Normal | `16.sp` | Subtitle text for vocabulary & feature banners |
| `SectionTitle` | `16.sp` | Bold | `22.sp` | Section headers for list groups |
| `SectionAction` | `13.sp` | Medium | - | Action text link for headers (e.g., 'See All') |
| `CardTitle` | `14.sp` | Bold | `18.sp` | Primary title for list item cards and modules |
| `CardSubtitle` | `11.sp` | Normal | `15.sp` | Secondary subtitle for list item cards and modules |
| `BadgeText` | `11.sp` | SemiBold | - | Chip and badge text for levels and streak counts |
| `BottomNavLabel` | `11.sp` | Normal | - | Inactive bottom navigation tab label |
| `BottomNavLabelActive` | `11.sp` | SemiBold | - | Active bottom navigation tab label |
| `ButtonText` | `14.sp` | SemiBold | - | Label text inside primary action buttons |
| `HeaderAppTitle` | `15.sp` | SemiBold | - | Top bar app title text |
| `AvatarText` | `15.sp` | Bold | - | User profile avatar initial letter |

### 3.3 Dimension Scale (`ui/theme/Dimensions.kt`)
Standardized DP scale via `LocalDimensions.current`:
- **Paddings**: `paddingMicro` (2dp), `paddingExtraSmall` (4dp), `paddingSmall` (8dp), `paddingMedium` (12dp), `paddingLarge` (16dp), `paddingExtraLarge` (20dp), `paddingHuge` (24dp).
- **Icon Sizes**: `iconSmall` (16dp), `iconMedium` (20dp), `iconNavTab` (22dp), `iconLarge` (24dp), `iconExtraLarge` (38dp), `iconHuge` (48dp).
- **Corner Radii**: `cornerSmall` (10dp), `cornerMedium` (16dp), `cornerLarge` (20dp), `cornerExtraLarge` (24dp), `cornerCircle` (100dp).
- **Component Dimensions**: `buttonHeight` (48dp), `avatarSize` (36dp), `logoSize` (76dp), `borderThin` (1dp).

### 3.4 Icon Repository (`ui/theme/AppIcons.kt`)
All icons are centralized in the `AppIcons` singleton:
- `AppIcons.Book`: Logo & Reading
- `AppIcons.Home`: Home Tab
- `AppIcons.Courses`: Courses Tab
- `AppIcons.Repeat`: Vocabulary & Repeat Tab
- `AppIcons.Results`: Statistics & Results Tab
- `AppIcons.ChevronLeft`: Back Arrow for Top Headers
- `AppIcons.ChevronRight`: Forward Navigation Arrow
- `AppIcons.ArrowUpRight`: External Action Arrow
- `AppIcons.Fire`: Streak Counter Flame
- `AppIcons.Headphones`: Listening Skill
- `AppIcons.Mic`: Speaking Skill
- `AppIcons.Edit`: Writing Skill
- `AppIcons.Chat`: Dialogue Scenarios
- `AppIcons.Search`: Search Lens for Courses Catalog
- `AppIcons.Bookmark`: Bookmark Ribbon Icon
- `AppIcons.Volume`: Speaker Audio Play Icon
- `AppIcons.AudioWave`: Pronunciation Wave Icon
- `AppIcons.Layers`: Stacked Grammar Layers Icon
- `AppIcons.Check`: Completed Item Checkmark Icon
- `AppIcons.Share`: Share Node Icon
- `AppIcons.School`: Graduation Cap Exam Prep Icon
- `AppIcons.Clock`: Time Duration Clock Icon

---

## 🗺️ 4. Navigation Architecture (`presentation/navigation/`)

- **Screen Routes (`Screen.kt`)**: Type-safe sealed class destinations:
  - `Screen.Splash` (`"splash"`): Startup splash screen.
  - `Screen.Onboarding` (`"onboarding"`): Welcome & onboarding screen.
  - `Screen.Home` (`"home"`): Main dashboard.
  - `Screen.Courses` (`"courses"`): Courses list & CEFR catalog screen.
  - `Screen.Repeat` (`"repeat"`): Spaced repetition vocabulary practice.
  - `Screen.Results` (`"results"`): Leaderboard & statistics screen.
  - `Screen.LessonDetail` (`"lesson_detail/{lessonId}"`): Detailed lesson rules & formulas.
  - `Screen.Quiz` (`"quiz/{lessonId}"`): Interactive exercise question view.
  - `Screen.LessonResult` (`"lesson_result"`): Lesson score & goal summary.
  - `Screen.Profile` (`"profile"`): User profile & streak achievements.
- **NavGraph Host (`NavGraph.kt`)**: Manages `NavHost`, 2-second splash timer transition to Onboarding, and tab retention (`launchSingleTop = true`, `restoreState = true`, `saveState = true`).

---

## 🔤 5. Complete String Resource Usage Matrix

All strings are declared in `res/values/strings.xml` and categorized as follows:

| String Key (`name`) | String Value | Screen / Component Usage | Purpose |
| :--- | :--- | :--- | :--- |
| `app_name` | TalkMe | Manifest, Application | App System Title |
| `user_avatar_cd` | User Avatar | `HomeHeader` | Accessibility Content Description |
| `see_all` | Barchasi | `SkillSection` | "See All" action button |
| `back` | Orqaga | `TalkMeHeader` | Back navigation button |
| `splash_title` | English Learning | `SplashScreen`, `HomeHeader`, `OnboardingScreen` | Main branding title |
| `splash_subtitle` | Kichik qadamlar, katta imkoniyatlar. | `SplashScreen` | App tagline |
| `splash_footer` | INGLIZ TILI - O'ZBEKCHA IZOH | `SplashScreen` | Footer subtitle note |
| `onboarding_badge` | HAR KUNI BIR QADAM | `OnboardingScreen` | Welcome badge chip |
| `onboarding_title` | Ingliz tilini o'zingizga ishongan holda o'rganing. | `OnboardingScreen` | Main welcome heading (with "ishongan holda" highlighted) |
| `onboarding_subtitle` | O'zbekcha tushuntirishlar, qisqa mashqlar... | `OnboardingScreen` | Subtitle description |
| `onboarding_highlight_time` | Kuniga 10 daqiqa | `OnboardingScreen` | Duration feature chip (with clock icon) |
| `onboarding_highlight_pace` | O'z sur'atingizda | `OnboardingScreen` | Self-pace feature chip |
| `onboarding_start_btn` | O'rganishni boshlash | `OnboardingScreen` | Primary start button |
| `onboarding_login_btn` | Hisobim bor · Kirish | `OnboardingScreen` | Secondary login button |
| `onboarding_terms_note` | Davom etish orqali foydalanish shartlari... | `OnboardingScreen` | Terms and conditions note |
| `greeting_title` | Salom, Aziz! | `GreetingHeader` | Personalized user welcome |
| `greeting_subtitle` | Kichik qadamlar, katta imkoniyatlar. | `GreetingHeader` | Subtitle welcome banner |
| `streak_count` | 7 kun | `GreetingHeader` | Daily streak counter badge |
| `lesson_level_a2` | A2 | `CurrentLessonCard` | Proficiency level tag |
| `lesson_category_grammar` | GRAMMATIKA | `CurrentLessonCard` | Lesson category tag |
| `lesson_title` | Present continuous | `CurrentLessonCard`, `LessonDetailScreen` | Active lesson title |
| `lesson_subtitle` | Hozir davom etayotgan ishlar | `CurrentLessonCard` | Lesson explanation summary |
| `lesson_details` | Tasdiq gaplar · qoida va misollar | `CurrentLessonCard`, `LessonDetailScreen` | Lesson topics detail |
| `continue_lesson` | Darsni davom ettirish | `CurrentLessonCard` | Action button text |
| `vocab_banner_title` | Bugun 12 ta so'zni eslang | `VocabularyBannerCard` | Vocabulary practice header |
| `vocab_banner_subtitle` | Oraliqli takrorlash · taxminan 4 daqiqa | `VocabularyBannerCard` | Spaced practice subtitle |
| `skills_section_title` | Har kuni, har bir ko'nikma | `SkillSection` | Skills section title |
| `skill_listening` | Tinglash | `SkillSection` | Listening skill title |
| `skill_listening_desc` | Listening · 8 daq | `SkillSection` | Listening duration |
| `skill_speaking` | Gapirish | `SkillSection` | Speaking skill title |
| `skill_speaking_desc` | Speaking · 5 daq | `SkillSection` | Speaking duration |
| `skill_reading` | O'qish | `SkillSection` | Reading skill title |
| `skill_reading_desc` | Reading · 6 daq | `SkillSection` | Reading duration |
| `skill_writing` | Yozish | `SkillSection` | Writing skill title |
| `skill_writing_desc` | Writing · 7 daq | `SkillSection` | Writing duration |
| `weekly_plan_title` | Haftalik reja | `WeeklyPlanSection` | Weekly plan header |
| `weekly_plan_progress` | 3/5 dars | `WeeklyPlanSection` | Progress count text |
| `weekly_plan_badge` | A2 o'quvchi | `WeeklyPlanSection` | User level badge |
| `real_situations_title` | Real vaziyatlar | `WeeklyPlanSection` | Scenario task title |
| `real_situations_subtitle` | Kafeda buyurtma · "Could I have some tea?" | `WeeklyPlanSection` | Scenario task description |
| `my_course_title` | Mening kursim | `CoursesScreen` | Courses screen title |
| `cefr_path_subtitle` | CEFR bo'yicha o'quv yo'li | `CoursesScreen` | CEFR path subtitle |
| `a2_description` | A2 · Tanish vaziyatlarda sodda muloqot qila olaman. | `CoursesScreen` | Active level info text |
| `tab_grammar` | Grammatika | `CoursesScreen` | Category tab item |
| `tab_vocabulary` | Lug'at | `CoursesScreen` | Category tab item |
| `tab_pronunciation` | Talaffuz | `CoursesScreen` | Category tab item |
| `tab_skills` | Ko'nikmalar | `CoursesScreen` | Category tab item |
| `grammar_catalog_tag` | GRAMMATIKA · BATAFSIL KATALOG | `CoursesScreen` | Catalog section header tag |
| `grammar_catalog_heading` | Grammar — batafsil grammatika katalogi | `CoursesScreen` | Catalog section heading |
| `grammar_catalog_desc` | Quyidagi 23 modul ingliz grammatikasining... | `CoursesScreen` | Catalog description paragraph |
| `module_1_tag` | MODUL 1 | `CoursesScreen` | Module 1 tag |
| `module_1_count` | 5 kichik mavzu | `CoursesScreen` | Module 1 topics count badge |
| `module_1_title` | Grammar fundamentals | `CoursesScreen` | Module 1 title |
| `module_1_bullet_1` | Alphabet and letter names... | `CoursesScreen` | Subtopic card 1 |
| `module_1_bullet_2` | Parts of speech... | `CoursesScreen` | Subtopic card 2 |
| `module_1_bullet_3` | Basic word order (SVO)... | `CoursesScreen` | Subtopic card 3 |
| `module_1_bullet_4` | There is / There are... | `CoursesScreen` | Subtopic card 4 |
| `module_1_bullet_5` | Capitalization, punctuation... | `CoursesScreen` | Subtopic card 5 |
| `continue_grammar_catalog_btn` | Grammatika katalogini davom ettirish | `CoursesScreen` | Sticky action button text |
| `catalog_footer_note` | Rejada 23 modul. Hozir 1–4-modullar to'liq... | `CoursesScreen` | Catalog footer note |
| `tab_rule` | Qoida | `LessonDetailScreen` | Lesson tab item (displays ✓) |
| `tab_example` | Misol | `LessonDetailScreen` | Lesson tab item |
| `tab_exercise` | Mashq | `LessonDetailScreen` | Lesson tab item |
| `rule_heading` | Hozir nima bo'lyapti? | `LessonDetailScreen` | Rule heading title |
| `rule_description` | Ayni paytda davom etayotgan ish-harakatni... | `LessonDetailScreen` | Rule description |
| `structure_box_title` | TASDIQ GAP TUZILISHI | `LessonDetailScreen` | Structure formula box title |
| `structure_box_formula` | Ega + am / is / are + fe'l-ing | `LessonDetailScreen` | Structure formula expression |
| `example_heading` | Misolda ko'ring · Tinglang va takrorlang | `LessonDetailScreen` | Examples heading |
| `example_1_en` | I am studying English. | `LessonDetailScreen` | English example sentence 1 |
| `example_1_uz` | Men ingliz tilini o'rganyapman. | `LessonDetailScreen` | Uzbek translation sentence 1 |
| `example_2_en` | She is reading a book now. | `LessonDetailScreen` | English example sentence 2 |
| `example_2_uz` | U hozir kitob o'qiyapti. | `LessonDetailScreen` | Uzbek translation sentence 2 |
| `pronunciation_note` | Talaffuz: -ing /ɪŋ/ · Oxiridagi /g/ alohida... | `LessonDetailScreen` | Pronunciation tip card |
| `start_quiz_btn` | Mashqlarga o'tish | `LessonDetailScreen` | Start quiz button text |
| `quiz_title` | Bilimni sinaymiz | `QuizScreen` | Quiz page title |
| `quiz_progress_counter` | 4 / 5 savol | `QuizScreen` | Quiz question counter |
| `quiz_question_instruction` | To'g'ri gapni tanlang | `QuizScreen` | Question instruction |
| `quiz_context_tag` | KUTUBXONADA | `QuizScreen` | Scenario context tag |
| `quiz_prompt_text` | "U hozir kitob o'qiyapti." | `QuizScreen` | Question Uzbek prompt |
| `quiz_option_a` | She reads a book now. | `QuizScreen` | Option A choice |
| `quiz_option_b` | She is reading a book now. | `QuizScreen` | Option B choice |
| `quiz_option_c` | She reading a book now. | `QuizScreen` | Option C choice |
| `quiz_feedback_correct` | To'g'ri, davom eting! | `QuizScreen` | Correct answer feedback banner |
| `quiz_feedback_explanation` | She + is + reading. "Now" hozirgi paytni... | `QuizScreen` | Answer explanation card |
| `review_rule_btn` | Qoidani yana ko'rish | `QuizScreen` | Review rule button |
| `next_question_btn` | Keyingi savol | `QuizScreen` | Next question button |
| `result_title` | Natijalarim | `LessonResultScreen` | Score screen title |
| `result_subtitle` | Bugungi dars yakuni | `LessonResultScreen` | Subtitle text |
| `result_congrats` | Yana bir qadam, Aziz! | `LessonResultScreen` | Congratulations banner |
| `result_score_pct` | 80 % | `LessonResultScreen` | Score percentage |
| `result_score_fraction` | 4/5 to'g'ri javob | `LessonResultScreen` | Correct answers fraction |
| `result_time_spent` | 3:24 sarflangan vaqt | `LessonResultScreen` | Duration-based stat |
| `result_xp_earned` | +20 o'quv balli | `LessonResultScreen` | XP earned stat |
| `result_rule_tip_title` | Bir joyini mustahkamlaymiz · 1 qoida | `LessonResultScreen` | Rule tip header |
| `return_to_course_btn` | Kursga qaytish | `LessonResultScreen` | Return to course catalog button |
| `profile_title` | Profilim | `ProfileScreen` | User profile page title |
| `profile_user_name` | Aziz | `ProfileScreen` | User display name |
| `profile_total_xp` | 1 240 jami XP | `ProfileScreen` | Total XP badge |
| `profile_user_level` | A2 o'quvchi | `ProfileScreen` | User level badge |
| `leaderboard_title` | Reyting | `ResultsScreen` | Leaderboard screen title |
| `leaderboard_subtitle` | Birga o'rganamiz, birga o'samiz | `ResultsScreen` | Leaderboard subtitle |
| `tab_this_week` | Bu hafta | `ResultsScreen` | Timeframe tab item |
| `tab_all_time` | Jami | `ResultsScreen` | Timeframe tab item |
| `leaderboard_header_note` | A2 bilimdonlari · 20 o'quvchi | `ResultsScreen` | Leaderboard student count note |
| `leaderboard_motivation` | Kuchli uchlikka yana 40 XP! O'z sur'atingizda... | `ResultsScreen` | Motivational banner |
| `nav_home` | Bosh sahifa | `TalkMeBottomBar` | Home tab item label |
| `nav_courses` | Kurslar | `TalkMeBottomBar` | Courses tab item label |
| `nav_repeat` | Takrorlash | `TalkMeBottomBar` | Repeat tab item label |
| `nav_results` | Natijalar | `TalkMeBottomBar` | Results tab item label |

---

## 🚫 6. Strictly Enforced Project Rules for Developers & AI

1. **Zero Hardcoding Guarantee**:
   - 🚫 NEVER hardcode string literals -> Put in `strings.xml`.
   - 🚫 NEVER hardcode `Color(0xFF...)` -> Put in `Color.kt` or `MaterialTheme.colorScheme`.
   - 🚫 NEVER hardcode `.sp` / `fontSize` / `fontWeight` -> Put in `AppTypography` (`Type.kt`).
   - 🚫 NEVER hardcode `.dp` paddings or icon sizes -> Put in `LocalDimensions.current` (`Dimensions.kt`).
   - 🚫 NEVER hardcode `R.drawable.ic_*` -> Access via `AppIcons.*` (`AppIcons.kt`).
2. **Back Navigation Icons**:
   - 🚫 NEVER use forward right chevrons (`ChevronRight`) for back navigation buttons.
   - ✅ Always use left back chevrons (`AppIcons.ChevronLeft`) in `TalkMeHeader` and back action buttons.
3. **Reusability & Subtopic Cards**:
   - Generic UI widgets MUST be placed in `presentation/components/` (`TalkMeButton`, `TalkMeBadge`, `TalkMeCard`, `TalkMeHeader`, `TalkMeTabRow`, `TalkMeProgressBar`, `TalkMeBottomBar`, `TalkMeOptionCard`, `TalkMeBannerCard`, `TalkMeSubtopicCard`).
   - Subtopic items inside modules MUST use `TalkMeSubtopicCard` with rounded purple indicator dots, interactive `onClick: () -> Unit` handlers, surface background, and soft outline borders.
4. **Architecture Integrity**:
   - Keep `domain/` free of Android framework dependencies.
   - Inject dependencies via Hilt (`@HiltViewModel`, `@Inject`, `@Provides`).
5. **Documentation Standards**:
   - Every file, class, Composable, internal code block, and public function MUST have English KDoc comments placed directly above declarations.
