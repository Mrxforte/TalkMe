# TalkMe Project Rules & Conventions

This rule file governs all current and future development in the **TalkMe** codebase based on design specifications.

## 1. Zero Hardcoding Rule
- **Strings**: Always put user-facing text in `res/values/strings.xml`.
- **Colors**: Always reference `MaterialTheme.colorScheme.*` or semantic tokens in `ui/theme/Color.kt`.
- **Dimensions**: Always access spacing, padding, icon sizes, and corner radii via `LocalDimensions.current` (`ui/theme/Dimensions.kt`).
- **Typography & Fonts**: Always reference `AppTypography.*` or `MaterialTheme.typography.*` (`ui/theme/Type.kt`).
- **Icons**: Always access icons via `AppIcons.*`.

## 2. Voice AI Engine & 600 Character Library Rules
- All speech requests MUST route through `EngineRegistry` and `SpeakTextUseCase`.
- Supports 600 character voice profiles across 24 major families (Families A to X) with distinct acoustic identities.
- Features local offline `SherpaOnnxTtsEngine`, server-side `CloudTtsEngine`, and native `AndroidSystemTtsEngine`.
- Features centralized DataStore preferences (`SettingsRepositoryImpl`) and built-in long text testing environment (**Sample 01 — The Last Library in the City**).

## 3. Navigation Icons
- 🚫 NEVER use `ChevronRight` for back buttons.
- ✅ Always use `AppIcons.ChevronLeft` for back buttons in `TalkMeHeader`.

## 4. Package & Component Structure
- Reusable UI widgets MUST be in `presentation/components/`.
- All screens MUST be cleanly nested inside `presentation/screens/` (`splash/`, `onboarding/`, `home/`, `courses/`, `lesson/`, `repeat/`, `results/`, `profile/`, `voicestudio/`, `settings/`).

## 5. Architecture
- Clean Architecture + MVVM/MVI + Hilt DI + Jetpack Compose + Voice AI Engine.
- `data/`, `domain/`, `di/`, `presentation/components/`, `presentation/navigation/`, `presentation/screens/`, `ui/theme/`.

## 6. Documentation
- Write clean, professional English KDocs for all classes, composables, internal code blocks, and public functions placed directly above declarations.
