# TalkMe Project Rules & Conventions

This rule file governs all current and future development in the **TalkMe** codebase based on design specifications.

## 1. Zero Hardcoding Rule
- **Strings**: Always put user-facing text in `res/values/strings.xml`.
- **Colors**: Always reference `MaterialTheme.colorScheme.*` or semantic tokens in `ui/theme/Color.kt`.
- **Dimensions**: Always access spacing, padding, icon sizes, and corner radii via `LocalDimensions.current` (`ui/theme/Dimensions.kt`).
- **Typography & Fonts**: Always reference `AppTypography.*` or `MaterialTheme.typography.*` (`ui/theme/Type.kt`).
- **Icons**: Always access icons via `AppIcons.*`.

## 2. Navigation Icons
- 🚫 NEVER use `ChevronRight` for back buttons.
- ✅ Always use `AppIcons.ChevronLeft` for back buttons in `TalkMeHeader`.

## 3. Package & Component Structure
- Reusable UI widgets MUST be in `presentation/components/`:
  - `TalkMeButton.kt`
  - `TalkMeBadge.kt`
  - `TalkMeCard.kt`
  - `TalkMeHeader.kt` (Left back arrow `AppIcons.ChevronLeft`)
  - `TalkMeTabRow.kt` (Supports `✓` checkmark completed tab indicators)
  - `TalkMeProgressBar.kt`
  - `TalkMeBottomBar.kt`
  - `TalkMeOptionCard.kt`
  - `TalkMeBannerCard.kt`
  - `TalkMeSubtopicCard.kt` (Interactive clickable card with rounded purple dot indicator)
- All screens MUST be cleanly nested inside `presentation/screens/` (`splash/`, `onboarding/`, `home/`, `courses/`, `lesson/`, `repeat/`, `results/`, `profile/`).

## 4. Architecture
- Clean Architecture + MVVM/MVI + Hilt DI + Jetpack Compose.
- `data/`, `domain/`, `di/`, `presentation/components/`, `presentation/navigation/`, `presentation/screens/`, `ui/theme/`.

## 5. Pixel-Perfect Design Fidelity
- Screens MUST match `Untitled.pdf` mockups down to exact CEFR path selectors, module subtopics, speaker audio buttons with highlighted verbs, pronoun tables, onboarding welcome illustrations, language selectors, search icons, and sticky action buttons.

## 6. Documentation
- Write clean, professional English KDocs for all classes, composables, internal code blocks, and public functions placed directly above declarations.
