# TalkMe - Comprehensive Application Architecture, Design System & Project Rules

This document serves as the **authoritative, single source of truth** for all architectural patterns, design system rules, technology stack specifications, string usage mappings, and development guidelines for the **TalkMe** Android project based on design specifications.

---

## 🏗️ 1. Complete Application Architecture & Screen Flow

The TalkMe application is built according to **Clean Architecture** principles combined with **MVVM/MVI**, **Jetpack Compose**, and **Hilt Dependency Injection**.

### 1.1 Startup Sequence & Screen Flow
1. **Splash Screen (`SplashScreen.kt`)**: Initial branding screen loaded on app launch (2-second timer).
2. **Onboarding Welcome Screen (`OnboardingScreen.kt`)**: One-time welcome screen introducing platform features ("O'rganishni boshlash" / "Hisobim bor · Kirish").
3. **Home Dashboard (`HomeScreen.kt`)**: Central learning dashboard with bottom bar navigation to Courses, Repeat, and Results screens, and deep-links to lesson details and user profile.
4. **Courses Catalog (`CoursesScreen.kt`)**: **Pixel-Perfect CEFR Level Path Catalog Screen** (matching Untitled.pdf Page 2) featuring CEFR level selector chips (A1-C2), category filter tabs, detailed grammar catalog breakdown, Module 1 subtopic cards (`TalkMeSubtopicCard`) with rounded purple indicator dots and `onClick: () -> Unit` clickability, search action lens, and sticky "Grammatika katalogini davom ettirish" button.
5. **Lesson Detail Screen (`LessonDetailScreen.kt`)**: **Pixel-Perfect Lesson Detail Screen** (matching Untitled.pdf Page 3) featuring bookmark action button, Qoida/Misol/Mashq segment tabs with completion checkmark `✓` icon, formula structure box with Pronoun Grid Table (`PronounColumnItem`) and `AppIcons.Layers` icon, example audio cards with highlighted verb phrases and circular speaker buttons (`ExampleAudioCard`) connected to **Android TextToSpeech (TTS)** engine for native English audio narration, pronunciation wave tip card, and "Mashqlarga o'tish" action button.
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
│       └── TextToSpeechRepositoryImpl.kt # Android native android.speech.tts.TextToSpeech implementation
│
├── domain/                      # DOMAIN LAYER (Pure Kotlin Business Logic - Framework Independent)
│   ├── model/                   # Business domain entities
│   ├── repository/              # Repository interfaces
│   │   └── TextToSpeechRepository.kt # Pure Kotlin TTS contract
│   └── usecase/                 # Isolated single-responsibility Use Cases
│       └── SpeakTextUseCase.kt  # English TTS audio pronunciation use case
│
├── di/                          # DEPENDENCY INJECTION LAYER
│   └── AppModule.kt             # Hilt DI modules providing Singletons & TextToSpeechRepository bindings
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
│       │   ├── LessonDetailScreen.kt # Detailed Grammar Rule & Example Card View (Pixel Perfect + TTS)
│       │   ├── LessonDetailViewModel.kt # ViewModel injecting SpeakTextUseCase
│       │   ├── QuizScreen.kt    # Interactive Exercises & Option Cards
│       │   └── LessonResultScreen.kt# Score Breakdown & Goal Summary (Pixel Perfect)
│       ├── repeat/              # Spaced Repetition Vocabulary Feature (RepeatScreen.kt)
│       ├── results/             # Leaderboard & Analytics Feature (ResultsScreen.kt)
│       └── profile/             # User Profile & Achievements Feature (ProfileScreen.kt)
│
└── ui/theme/                    # DESIGN SYSTEM TOKENS & ENGINE
    ├── Color.kt                 # Semantic Color Palette & Documentation
    ├── Dimensions.kt            # Spacing, Margins, Corner Radii, Icon Sizes & LocalDimensions
    ├── AppIcons.kt              # Centralized Drawable Icon Repository
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
| **Text To Speech** | Android Native TTS (`Locale.US`) | Integrated | English audio pronunciation engine |
| **Architecture Components**| Lifecycle Runtime & ViewModel | `2.11.0` | StateFlow UI state management |

---

## 🔊 3. Text-To-Speech (TTS) Architecture & Guidelines

- **English Only**: The TTS engine is strictly initialized with `Locale.US` / English language support (`TextToSpeech.QUEUE_FLUSH`).
- **Clean Architecture Binding**:
  - `TextToSpeechRepository` interface in `domain/repository/`
  - `SpeakTextUseCase` in `domain/usecase/`
  - `TextToSpeechRepositoryImpl` in `data/repository/`
  - Singleton binding in `di/AppModule.kt`
- **UI Integration**: Audio speaker buttons (`AppIcons.Volume`) in `LessonDetailScreen` pass English sentence text (`example_1_en`, `example_2_en`) to `LessonDetailViewModel.speak()`, triggering native English speech pronunciation.

---

## 🎨 4. Design System Engine & Tokens

### 4.1 Color System (`ui/theme/Color.kt`)
- **Brand Colors**: `BrandPurple` (`0xFF5E4B8B`) - Primary buttons, active tab indicators, branding highlights.
- **Secondary Accent**: `SuccessGreen` (`0xFF27AE60`) - Vocabulary banners, action completion, success badges.
- **Backgrounds**: `ScreenBackground` (`0xFFFAFAFC`) - Main screen surface; `SurfaceWhite` (`0xFFFFFFFF`) - Card containers.
- **Containers**: `ContainerPurpleLight` (`0xFFF1EDFA`) - Lesson card container & onboarding hero box; `ContainerGreenLight` (`0xFFE8F8EE`) - Vocabulary practice & completed level chip container.
- **Text Scale**: `TextPrimary` (`0xFF1D1B20`), `TextSecondary` (`0xFF757575`), `TextMuted` (`0xFF9E9E9E`), `TextCardSubtitle` (`0xFF6E6B7B`).

---

## 🚫 5. Strictly Enforced Project Rules for Developers & AI

1. **Zero Hardcoding Guarantee**:
   - 🚫 NEVER hardcode string literals -> Put in `strings.xml`.
   - 🚫 NEVER hardcode `Color(0xFF...)` -> Put in `Color.kt` or `MaterialTheme.colorScheme`.
   - 🚫 NEVER hardcode `.sp` / `fontSize` / `fontWeight` -> Put in `AppTypography` (`Type.kt`).
   - 🚫 NEVER hardcode `.dp` paddings or icon sizes -> Put in `LocalDimensions.current` (`Dimensions.kt`).
   - 🚫 NEVER hardcode `R.drawable.ic_*` -> Access via `AppIcons.*` (`AppIcons.kt`).
2. **Back Navigation Icons**:
   - 🚫 NEVER use forward right chevrons (`ChevronRight`) for back navigation buttons.
   - ✅ Always use left back chevrons (`AppIcons.ChevronLeft`) in `TalkMeHeader` and back action buttons.
3. **TTS English Only**:
   - All audio pronunciation requests MUST be routed through `SpeakTextUseCase` for English text phrases only (`Locale.US`).
4. **Reusability & Subtopic Cards**:
   - Generic UI widgets MUST be placed in `presentation/components/`.
5. **Documentation Standards**:
   - Every file, class, Composable, internal code block, and public function MUST have English KDoc comments placed directly above declarations.
