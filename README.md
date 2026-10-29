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
1. **Application Initialization & DI**: `App.kt` initializes Dagger Hilt. `MainActivity.kt` sets up edge-to-edge system window insets and hosts `TalkMeTheme` wrapping `AppNavGraph`.
2. **Navigation & Screen Flow**:
   - **Startup Sequence**: `Screen.Splash` (2s timer) ➔ `OnboardingScreen` (Welcome intro) ➔ `HomeScreen` (Main dashboard).
   - **Main Dashboard & Bottom Tabs**: `HomeScreen` acts as Tab 0. `TalkMeBottomBar` manages switching between `Home` (Tab 0), `Courses` (Tab 1), `Repeat` (Tab 2), and `Results` (Tab 3).
   - **Lesson & Quiz Flow**: Users can navigate to `CoursesScreen`, open `LessonDetailScreen`, take exercises in `QuizScreen`, review scores in `LessonResultScreen`, and unlock next levels in `LevelUnlockedScreen`.
3. **Design System Token Resolution**: All colors (`Color.kt`), dimensions (`Dimensions.kt`), typography (`Type.kt`), and icons (`AppIcons.kt`) are fully centralized with zero hardcoded literals.

---
---

## 🇷🇺 Русский

### 📖 Подробный обзор проекта
**TalkMe** — это корпоративное Android-приложение для изучения английского языка. Оно включает пошаговые уроки, интервальное повторение слов, грамматические каталоги CEFR (A1–C2), диалоги из реальной жизни, теги уровня, квизы, сводки результатов и таблицы лидеров.

Приложение построено на базе **Clean Architecture + MVVM**, декларативного UI **Jetpack Compose**, **Material Design 3**, внедрения зависимостей **Dagger Hilt** и безопасной навигации **Navigation Compose**.

---

### 📂 Полная структура папок и файлов

```
com.example.talkme/
├── App.kt                               # Класс Application с аннотацией @HiltAndroidApp
├── MainActivity.kt                      # Главная Activity, хостящая AppNavGraph с поддержкой edge-to-edge
│
├── data/                                # СЛОЙ ДАННЫХ (Репозитории, Источники данных, Мапперы, DTO)
│   ├── datasource/                      # Локальная БД Room и удаленные API источники
│   ├── mapper/                          # Мапперы доменных моделей в сущности данных
│   ├── model/                           # DTO и сущности базы данных
│   └── repository/                      # Конкретные реализации репозиториев
│
├── domain/                              # ДОМЕННЫЙ СЛОЙ (Чистая бизнес-логика Kotlin - без зависимостей от Android)
│   ├── model/                           # Чистые бизнес-модели
│   ├── repository/                      # Абстрактные интерфейсы репозиториев
│   └── usecase/                         # Use Cases с единственной ответственностью
│
├── di/                                  # СЛОЙ ВНЕДРЕНИЯ ЗАВИСИМОСТЕЙ (DI)
│   └── AppModule.kt                     # Hilt модуль, предоставляющий синглтоны и репозитории
│
├── presentation/                        # ПРЕЗЕНТАТИВНЫЙ СЛОЙ (UI, Навигация, ViewModels)
│   ├── components/                      # Переиспользуемые UI виджеты дизайн-системы
│   │   ├── TalkMeButton.kt              # Универсальная кнопка действия
│   │   ├── TalkMeBadge.kt               # Универсальный чип уровня/категории/серии
│   │   ├── TalkMeCard.kt                # Универсальный контейнер карточки
│   │   ├── TalkMeHeader.kt              # Универсальный верхний заголовок с кнопкой назад
│   │   ├── TalkMeTabRow.kt              # Универсальный сегментированный таб-селектор
│   │   ├── TalkMeProgressBar.kt         # Универсальная плавная полоса прогресса
│   │   ├── TalkMeBottomBar.kt           # Универсальная нижняя панель навигации
│   │   ├── TalkMeOptionCard.kt          # Универсальная карточка выбора и модуля
│   │   ├── TalkMeBannerCard.kt          # Универсальный контейнер баннера
│   │   └── TalkMeSubtopicCard.kt        # Кликабельная карточка подтемы с фиолетовой точкой
│   ├── navigation/                      # Система навигации
│   │   ├── Screen.kt                    # Типобезопасные sealed маршруты
│   │   └── NavGraph.kt                  # AppNavGraph, управляющий всеми экранами и табами
│   └── screens/                         # Модульные экраны фич
│       ├── splash/                      # Экран заставки (SplashScreen.kt)
│       ├── onboarding/                  # Приветственный экран (OnboardingScreen.kt)
│       ├── home/                        # Главная панель (HomeScreen.kt и home/components/)
│       │   ├── CurrentLessonCard.kt     # Карточка текущего урока
│       │   ├── GreetingHeader.kt        # Приветствие и бейдж серии
│       │   ├── HomeBottomBar.kt         # Делегат на presentation/components
│       │   ├── HomeHeader.kt            # Логотип и аватар профиля
│       │   ├── SkillSection.kt          # 4 языковых навыка (Listening, Speaking, Reading, Writing)
│       │   ├── VocabularyBannerCard.kt  # Баннер повторения слов
│       │   └── WeeklyPlanSection.kt     # Недельный план и задачи
│       ├── courses/                     # Каталог курсов (CoursesScreen.kt)
│       ├── lesson/                      # Процесс урока и упражнений
│       │   ├── LessonDetailScreen.kt    # Грамматические правила, таблица местоимений, аудио примеры
│       │   ├── QuizScreen.kt            # Интерактивные тесты и карточки обратной связи
│       │   ├── LessonResultScreen.kt    # Сводка результатов (80%, 3:24 времени, +20 XP)
│       │   └── LevelUnlockedScreen.kt   # Экран празднования открытия нового уровня
│       ├── repeat/                      # Повторение словарного запаса (RepeatScreen.kt)
│       ├── results/                     # Таблица лидеров и аналитика (ResultsScreen.kt)
│       └── profile/                     # Профиль пользователя и достижения (ProfileScreen.kt)
│
└── ui/theme/                            # ДИЗАЙН-СИСТЕМА И ТОКЕНЫ
    ├── Color.kt                         # Семантическая палитра цветов с документацией KDoc
    ├── Dimensions.kt                    # Стандартизированная шкала DP и LocalDimensions
    ├── AppIcons.kt                      # Централизованный репозиторий иконок (AppIcons.*)
    ├── Type.kt                          # Иерархия стилей текста AppTypography и маппинг в Material3
    └── Theme.kt                         # Конфигурация темы Material3 и контроллер статус-бара
```

---

### ⚙️ Как работает приложение (Подробный технический процесс)
1. **Инициализация и DI**: `App.kt` запускает Dagger Hilt. `MainActivity.kt` настраивает edge-to-edge отображение и корневую тему `TalkMeTheme`, хостящую `AppNavGraph`.
2. **Навигация**: Цепочка запуска `Splash` (2 сек таймер) ➔ `OnboardingScreen` (Приветствие) ➔ `HomeScreen` (Главная панель с нижним меню `TalkMeBottomBar`). Переключение вкладок сохраняет состояние через `restoreState = true`.
3. **Дизайн-система**: Никакого хардкода. Цвета (`Color.kt`), отступы (`Dimensions.kt`), шрифты (`Type.kt`) и иконки (`AppIcons.kt`) полностью централизованы.

---
---

## 🇺🇿 O'zbekcha

### 📖 To'liq loyiha tavsifi
**TalkMe** — ingliz tilini o'rganish va amalda sinash uchun mo'ljallangan korxona darajasidagi (enterprise-grade) Android ilovasi. U qisqa darslar, so'zlarni oraliqli takrorlash (spaced repetition), CEFR grammatika kataloglari (A1–C2), real hayotiy dialoglar, interaktiv testlar va haftalik reyting jadvallarini o'z ichiga oladi.

Loyiha **Clean Architecture + MVVM**, **Jetpack Compose**, **Material Design 3**, **Dagger Hilt** va **Navigation Compose** texnologiyalari asosida professional darajada qurilgan.

---

### 📂 To'liq Papka va Fayl Tuzilmasi

```
com.example.talkme/
├── App.kt                               # @HiltAndroidApp bilan belgilangan Application klassi
├── MainActivity.kt                      # Edge-to-edge qo'llab-quvvatlaydigan va AppNavGraph'ni saqlovchi Activity
│
├── data/                                # MA'LUMOTLAR QATLAMI (Repositorylar, DataSource'lar, Mapperlar, DTO)
│   ├── datasource/                      # Mahalliy Room DB va masofaviy API manbalari
│   ├── mapper/                          # Domain model va Data entity o'rtasidagi o'tkazgichlar
│   ├── model/                           # DTO va Ma'lumotlar bazasi entity'lari
│   └── repository/                      # Repository interfeyslarining aniq realizatsiyalari
│
├── domain/                              # DOMEN QATLAMI (Sof Kotlin Biznes Mantiqi - Android qaramligisiz)
│   ├── model/                           # Sof biznes domain modellari
│   ├── repository/                      # Abstrakt repository interfeyslari
│   └── usecase/                         # Bitta mas'uliyatga ega biznes Use Case'lar
│
├── di/                                  # BOG'liQLIKLARNI YARATISH QATLAMI (DI)
│   └── AppModule.kt                     # Singleton va repository'larni yetkazib beruvchi Hilt moduli
│
├── presentation/                        # TAQDIMOT QATLAMI (UI, Navigatsiya, ViewModellar)
│   ├── components/                      # Qayta ishlatiluvchi Dizayn Tizimi UI Vidjetlari
│   │   ├── TalkMeButton.kt              # Universal harakat tugmasi
│   │   ├── TalkMeBadge.kt               # Universal daraja/kategoriya/seriya chipi
│   │   ├── TalkMeCard.kt                # Universal sirt kartochka konteyneri
│   │   ├── TalkMeHeader.kt              # Chap orqaga qaytish strelkali universal header
│   │   ├── TalkMeTabRow.kt              # Checkmark qo'llab-quvvatlaydigan segmentlangan tab tanlagich
│   │   ├── TalkMeProgressBar.kt         # Silliq progress bar
│   │   ├── TalkMeBottomBar.kt           # Universal pastki navigatsiya paneli
│   │   ├── TalkMeOptionCard.kt          # Universal tanlanuvchi variant va modul kartochkasi
│   │   ├── TalkMeBannerCard.kt          # Universal banner konteyneri
│   │   └── TalkMeSubtopicCard.kt        # Binafsha nuqtali va bosiladigan subtopic kartochkasi
│   ├── navigation/                      # Navigatsiya Tizimi
│   │   ├── Screen.kt                    # Type-safe sealed marshrut ta'riflari
│   │   └── NavGraph.kt                  # Barcha ekranlar va tab holatini boshqaruvchi AppNavGraph
│   └── screens/                         # Modullashtirilgan Ekranaoidlar
│       ├── splash/                      # Splash Ekrani (SplashScreen.kt)
│       ├── onboarding/                  # Xush kelibsiz va Onboarding Ekrani (OnboardingScreen.kt)
│       ├── home/                        # Bosh Sahifa Paneli (HomeScreen.kt va home/components/)
│       │   ├── CurrentLessonCard.kt     # Aktiv dars kartochkasi
│       │   ├── GreetingHeader.kt        # Salomlashuv va streak badge headeri
│       │   ├── HomeBottomBar.kt         # presentation/components ga yo'naltiruvchi delegat
│       │   ├── HomeHeader.kt            # Ilova logosi va foydalanuvchi avatari
│       │   ├── SkillSection.kt          # 4 ta til ko'nikmasi (Tinglash, Gapirish, O'qish, Yozish)
│       │   ├── VocabularyBannerCard.kt  # So'zlarni takrorlash eslatma banneri
│       │   └── WeeklyPlanSection.kt     # Haftalik o'qish rejasi va vazifa
│       ├── courses/                     # Kurslar Katalogi (CoursesScreen.kt)
│       ├── lesson/                      # Dars va Test Jarayoni Ekranaoidlari
│       │   ├── LessonDetailScreen.kt    # Grammatika qoidalari, formula box, olmoshlar jadvali, audio
│       │   ├── QuizScreen.kt            # Interaktiv testlar va javob variantlari
│       │   ├── LessonResultScreen.kt    # Natijalar (80%, 3:24 vaqt, +20 XP) va qoida maslahati
│       │   └── LevelUnlockedScreen.kt   # Yangi bosqich ochildi tantana ekrani
│       ├── repeat/                      # So'zlarni Takrorlash Ekrani (RepeatScreen.kt)
│       ├── results/                     # Reyting va Statistika Ekrani (ResultsScreen.kt)
│       └── profile/                     # Foydalanuvchi Profili va Yutuqlar (ProfileScreen.kt)
│
└── ui/theme/                            # DIZAYN TIZIMI VA TOKENLAR
    ├── Color.kt                         # KDoc hujjatli semantik ranglar palitrasi
    ├── Dimensions.kt                    # Standartlashtirilgan DP o'lchamlar va LocalDimensions
    ├── AppIcons.kt                      # Markazlashtirilgan ikonka resurslari repozitoriy yig'indisi (AppIcons.*)
    ├── Type.kt                          # AppTypography shriftlar ierarxiyasi va Material3 xaritasi
    └── Theme.kt                         # Material3 mavzu konfiguratsiyasi va status bar boshqaruvchisi
```

---

### ⚙️ Ilova Qanday Ishlaydi? (To'liq Texnologik Jarayon)
1. **Ishga tushish va DI**: `App.kt` orqali Dagger Hilt ishga tushadi. `MainActivity.kt` esa ekran kengligini (edge-to-edge) boshqarib, `AppNavGraph` ni yuklaydi.
2. **Navigatsiya oqimi**: `Splash` (2 soniya) ➔ `Onboarding` (Xush kelibsiz ekrani) ➔ `Home` (Asosiy panel). Pastki menyu (`TalkMeBottomBar`) orqali Kurslar, Takrorlash va Natijalar bo'limlariga o'tishda backstack holati saqlanadi.
3. **Dizayn Tizimi (Design System)**: Ilovada hech qanday qattiq yozilgan (hardcoded) qiymatlar mavjud emas. Ranglar `Color.kt`, o'lchamlar `Dimensions.kt`, shriftlar `Type.kt` va ikonka resurslari `AppIcons.kt` orqali markazlashtirilgan.

---

<div align="center">
  <p>Developed with ❤️ by <a href="https://github.com/Mrxforte">Mrxforte</a></p>
  <p>© 2026 TalkMe. All rights reserved.</p>
</div>
