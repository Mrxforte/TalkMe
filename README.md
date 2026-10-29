<div align="center">

# 🗣️ TalkMe — Enterprise Android English Learning & Practice Application

[![Android](https://img.shields.io/badge/Platform-Android-3DDC84?style=flat-square&logo=android&logoColor=white)](https://developer.android.com)
[![Kotlin](https://img.shields.io/badge/Language-Kotlin_2.0-7F52FF?style=flat-square&logo=kotlin&logoColor=white)](https://kotlinlang.org)
[![Jetpack Compose](https://img.shields.io/badge/Toolkit-Jetpack_Compose-4285F4?style=flat-square&logo=jetpackcompose&logoColor=white)](https://developer.android.com/compose)
[![Material Design 3](https://img.shields.io/badge/Design-Material_3-757575?style=flat-square&logo=materialdesign&logoColor=white)](https://m3.material.io)
[![Hilt](https://img.shields.io/badge/DI-Dagger_Hilt-4285F4?style=flat-square&logo=dagger&logoColor=white)](https://dagger.dev/hilt)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

[🇬🇧 English](#-english) • [🇷🇺 Русский](#-русский) • [🇺🇿 O'zbekcha](#-ozbekcha)

</div>

---

## 🇬🇧 English

### 📖 Comprehensive Project Overview
**TalkMe** is an enterprise-grade Android application engineered for English language learning and practice. It provides immersive bite-sized lessons, spaced repetition vocabulary flashcards, CEFR-aligned grammar catalogs (A1–C2), real-world scenario dialogues, interactive quizzes, score summaries, rank progression, and live weekly leaderboards.

The application strictly implements **Clean Architecture** combined with **MVVM/MVI**, **Jetpack Compose** declarative UI, **Material Design 3**, **Dagger Hilt** compile-time dependency injection, and type-safe **Navigation Compose**. Every screen and widget is crafted to 100% pixel-perfect fidelity matching professional design specifications.

---

### 📂 Complete Project Folder & File Structure

```
com.example.talkme/
├── App.kt                               # Application class annotated with @HiltAndroidApp
├── MainActivity.kt                      # Main Activity hosting AppNavGraph with edge-to-edge support
│
├── data/                                # DATA LAYER (Repositories, Data Sources, Mappers, DTOs)
│   ├── datasource/                      # Local Room DB and Remote API data sources
│   ├── mapper/                          # Domain model to Data entity mappers
│   ├── model/                           # Data Transfer Objects (DTOs) & Database Entities
│   └── repository/                      # Concrete repository implementations
│
├── domain/                              # DOMAIN LAYER (Pure Kotlin Business Logic - Zero Android Dependencies)
│   ├── model/                           # Pure business domain entities
│   ├── repository/                      # Abstract repository interfaces
│   └── usecase/                         # Single-responsibility business use cases
│
├── di/                                  # DEPENDENCY INJECTION LAYER
│   └── AppModule.kt                     # Hilt DI module providing singletons and repository bindings
│
├── presentation/                        # PRESENTATION LAYER (UI, Navigation, ViewModels)
│   ├── components/                      # Reusable Design System UI Widgets
│   │   ├── TalkMeButton.kt              # Universal primary/secondary action button
│   │   ├── TalkMeBadge.kt               # Universal level/category/streak chip
│   │   ├── TalkMeCard.kt                # Universal surface card container
│   │   ├── TalkMeHeader.kt              # Universal top navigation header with left back arrow
│   │   ├── TalkMeTabRow.kt              # Universal segmented tab selector with checkmark support
│   │   ├── TalkMeProgressBar.kt         # Universal smooth progress bar
│   │   ├── TalkMeBottomBar.kt           # Universal bottom navigation bar
│   │   ├── TalkMeOptionCard.kt          # Universal selectable choice & module item card
│   │   ├── TalkMeBannerCard.kt          # Universal feature & practice banner container
│   │   └── TalkMeSubtopicCard.kt        # Universal clickable subtopic card with purple indicator dot
│   ├── navigation/                      # Navigation System
│   │   ├── Screen.kt                    # Type-safe sealed route definitions
│   │   └── NavGraph.kt                  # AppNavGraph hosting all screen destinations & tab state
│   └── screens/                         # Modularized Feature Screens
│       ├── splash/                      # Splash Screen (SplashScreen.kt)
│       ├── onboarding/                  # Welcome & Onboarding Screen (OnboardingScreen.kt)
│       ├── home/                        # Home Dashboard (HomeScreen.kt & home/components/)
│       │   ├── CurrentLessonCard.kt     # Active lesson highlight card
│       │   ├── GreetingHeader.kt        # User greeting & streak badge header
│       │   ├── HomeBottomBar.kt         # Delegate to presentation/components
│       │   ├── HomeHeader.kt            # App logo & user profile avatar header
│       │   ├── SkillSection.kt          # 4 core language skills (Listening, Speaking, Reading, Writing)
│       │   ├── VocabularyBannerCard.kt  # Spaced repetition vocabulary reminder banner
│       │   └── WeeklyPlanSection.kt     # Weekly study goal & scenario task item
│       ├── courses/                     # Courses Catalog (CoursesScreen.kt)
│       ├── lesson/                      # Lesson & Exercise Workflow
│       │   ├── LessonDetailScreen.kt    # Grammar rules, formula box, pronoun grid, audio examples
│       │   ├── QuizScreen.kt            # Interactive quiz options & feedback cards
│       │   ├── LessonResultScreen.kt    # Score breakdown (80%, 3:24 time, +20 XP) & rule tip
│       │   └── LevelUnlockedScreen.kt   # Next stage / level unlocked celebration screen
│       ├── repeat/                      # Spaced Repetition Practice (RepeatScreen.kt)
│       ├── results/                     # Leaderboard & Analytics (ResultsScreen.kt)
│       └── profile/                     # User Profile & Achievements (ProfileScreen.kt)
│
└── ui/theme/                            # DESIGN SYSTEM ENGINE & TOKENS
    ├── Color.kt                         # Semantic color palette with full KDoc documentation
    ├── Dimensions.kt                    # Standardized DP scale & LocalDimensions CompositionLocal
    ├── AppIcons.kt                      # Centralized drawable icon repository (AppIcons.*)
    ├── Type.kt                          # AppTypography text styles hierarchy & Material3 mapping
    └── Theme.kt                         # Material3 theme configuration & status bar controller
```

---

### ⚙️ How the Application Works (Detailed Technical Workflow)

1. **Application Initialization & DI**:
   - When the app starts, `App.kt` initializes the Dagger Hilt dependency graph via `@HiltAndroidApp`.
   - `MainActivity.kt` (`@AndroidEntryPoint`) sets up edge-to-edge system window insets and hosts `TalkMeTheme` wrapping `AppNavGraph`.

2. **Navigation & Screen Flow**:
   - **Startup Sequence**: `Screen.Splash` renders a 2-second splash screen, then automatically navigates to `Screen.Onboarding` while clearing itself from the backstack (`popUpTo(Splash) { inclusive = true }`).
   - **Onboarding Welcome**: `OnboardingScreen` presents the platform introduction with language selection ("O'zbekcha"), feature highlights, and start/login actions. Clicking either button navigates to `Screen.Home` and clears onboarding (`popUpTo(Onboarding) { inclusive = true }`).
   - **Main Dashboard & Bottom Tabs**: `HomeScreen` acts as Tab 0. The bottom navigation bar (`TalkMeBottomBar`) enables switching between `Home` (Tab 0), `Courses` (Tab 1), `Repeat` (Tab 2), and `Results` (Tab 3) using `launchSingleTop = true` and `restoreState = true` to preserve backstack state.
   - **Deep-Linking & Feature Flow**: From Home or Courses, users can tap active lessons to open `LessonDetailScreen` ("Present continuous"), take interactive exercises in `QuizScreen`, view score summaries in `LessonResultScreen`, unlock next stages in `LevelUnlockedScreen`, check rankings in `ResultsScreen`, or view stats in `ProfileScreen`.

3. **Design System Token Resolution**:
   - **Colors**: UI components never use hardcoded hex values. They query `MaterialTheme.colorScheme.*` or explicit semantic tokens from `Color.kt`.
   - **Dimensions**: All paddings, margins, corner radii, and icon sizes are retrieved dynamically via `LocalDimensions.current`.
   - **Typography**: Text elements use pre-defined text styles from `AppTypography` (`Type.kt`), eliminating ad-hoc `.sp` or `.fontWeight` overrides.
   - **Icons**: Vector drawables are referenced exclusively through `AppIcons.*` (`AppIcons.Book`, `AppIcons.ChevronLeft`, `AppIcons.Search`, `AppIcons.Bookmark`, `AppIcons.Volume`, `AppIcons.AudioWave`, `AppIcons.Layers`, `AppIcons.Check`, `AppIcons.Share`, `AppIcons.School`, `AppIcons.Clock`).

---
---

## 🇷🇺 Русский

### 📖 Подробный обзор проекта
**TalkMe** — это корпоративное Android-приложение для изучения английского языка. Оно включает пошаговые уроки, интервальное повторение слов, грамматические каталоги CEFR (A1–C2), диалоги из реальной жизни, теги уровня, квизы, сводки результатов и таблицы лидеров.

Приложение построено на базе **Clean Architecture + MVVM**, декларативного UI **Jetpack Compose**, **Material Design 3**, внедрения зависимостей **Dagger Hilt** и безопасной навигации **Navigation Compose**.

---

### 📂 Полная структура папок и файлов
*(См. английскую версию выше для детализированного дерева каталогов с описанием каждого файла).*

---

### ⚙️ Как работает приложение (Технический процесс)
1. **Инициализация и DI**: Класс `App.kt` запускает граф зависимостей Hilt. `MainActivity.kt` настраивает edge-to-edge отображение и корневую тему `TalkMeTheme`.
2. **Навигация**: Цепочка запуска `Splash` (2 сек) -> `Onboarding` (Приветствие) -> `Home` (Главная панель с нижним меню). Вкладки нижнего меню сохраняют свое состояние благодаря `restoreState = true`.
3. **Дизайн-система**: Никакого хардкода. Все цвета берутся из `Color.kt`, отступы из `Dimensions.kt`, шрифты из `Type.kt`, а иконки через `AppIcons.*`.

---
---

## 🇺🇿 O'zbekcha

### 📖 To'liq loyiha tavsifi
**TalkMe** — ingliz tilini o'rganish va amalda sinash uchun mo'ljallangan korxona darajasidagi (enterprise-grade) Android ilovasi. U qisqa darslar, so'zlarni oraliqli takrorlash (spaced repetition), CEFR grammatika kataloglari (A1–C2), real hayotiy dialoglar, interaktiv testlar va haftalik reyting jadvallarini o'z ichiga oladi.

Loyiha **Clean Architecture + MVVM**, **Jetpack Compose**, **Material Design 3**, **Dagger Hilt** va **Navigation Compose** texnologiyalari asosida professional darajada qurilgan.

---

### 📂 To'liq Papka va Fayl Tuzilmasi
*(Yuqoridagi inglizcha bo'limda barcha papka va fayllar batafsil keltirilgan).*

---

### ⚙️ Ilova Qanday Ishlaydi? (Texnologik Jarayon)
1. **Ishga tushish va DI**: `App.kt` orqali Dagger Hilt ishga tushadi. `MainActivity.kt` esa ekran kengligini (edge-to-edge) boshqarib, `AppNavGraph` ni yuklaydi.
2. **Navigatsiya oqimi**: `Splash` (2 soniya) ➔ `Onboarding` (Xush kelibsiz ekrani) ➔ `Home` (Asosiy panel). Pastki menyu (`TalkMeBottomBar`) orqali Kurslar, Takrorlash va Natijalar bo'limlariga o'tishda backstack holati saqlanadi.
3. **Dizayn Tizimi (Design System)**: Ilovada hech qanday qattiq yozilgan (hardcoded) qiymatlar mavjud emas. Ranglar `Color.kt`, o'lchamlar `Dimensions.kt`, shriftlar `Type.kt` va ikonka resurslari `AppIcons.kt` orqali markazlashtirilgan.

---

<div align="center">
  <p>Developed with ❤️ by <a href="https://github.com/Mrxforte">Mrxforte</a></p>
  <p>© 2026 TalkMe. All rights reserved.</p>
</div>
