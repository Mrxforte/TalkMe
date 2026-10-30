# TalkMe - Comprehensive Application Architecture, Design System & Project Rules

This document serves as the **authoritative, single source of truth** for all architectural patterns, design system rules, technology stack specifications, navigation flows, package structures, and development guidelines for the **TalkMe** Android project based on design specifications.

---

## 🎙️ 1. Gemini 3.6 Android Voice AI Engine & Voice Character Library Architecture

The TalkMe application includes a complete, production-ready Voice AI Character Platform supporting approved character voice profiles, offline ONNX/Sherpa-ONNX local models, cloud FastAPI server integration, dynamic model capabilities, centralized DataStore preferences, text normalization for Uzbek/Russian/English, and a built-in long text testing environment.

### 1.1 Core Engine Components & Contracts
- **`TtsEngine` Contract (`domain/voice/engine/TtsEngine.kt`)**: Common abstraction for all speech synthesis engines.
- **Engine Adapters (`data/voice/engine/`)**:
  - `SherpaOnnxTtsEngine`: Local offline ONNX / sherpa-onnx runtime inference adapter.
  - `CloudTtsEngine`: Server-side FastAPI REST & WebSocket streaming adapter (XTTS-v2, F5-TTS, StyleTTS2).
  - `AndroidSystemTtsEngine`: Native Android framework `TextToSpeech` fallback adapter.
- **`EngineRegistry` (`domain/voice/registry/EngineRegistry.kt`)**: Discovers engines and routes synthesis requests according to `EngineSelectionMode` (`LOCAL_FIRST`, `CLOUD_FIRST`, `OFFLINE_ONLY`, `AUTO`).
- **`SpeakTextUseCase` (`domain/voice/usecase/SpeakTextUseCase.kt`)**: Primary entry point for executing speech synthesis requests.
- **DataStore Settings Persistence (`data/preferences/SettingsRepositoryImpl.kt`)**: Stores user-configurable speech preferences (speed, pitch, volume, emotion, intonation, character profile, pause durations, audio cache limits).
- **Text Normalization Pipeline (`domain/voice/normalization/TextNormalizationPipeline.kt`)**: Handles Uzbek Latin/Cyrillic, Russian, English, numbers, date expansion, morphological suffixes, and pronunciation dictionaries.
- **Long-Text Processing (`domain/voice/longtext/LongTextProcessor.kt`)**: Splits long stories into natural sentence/paragraph chunks while preserving speaker identity.
- **Speech Testing & Sample Story (`domain/voice/testing/SampleStory.kt`)**: Preloaded English story **"Sample 01 — The Last Library in the City"** for quick & advanced speech testing and latency/RTF diagnostic reporting.
- **Voice Studio & Settings Screens (`presentation/screens/voicestudio/`, `presentation/screens/settings/`)**: Full Compose UIs for voice character customization, search, individual audition buttons, preview, and testing.

---

## 🏗️ 2. Screen Flow & Navigation Hierarchy

1. **Splash Screen (`SplashScreen.kt`)**: Initial branding screen loaded on app launch (2-second timer).
2. **Onboarding Welcome Screen (`OnboardingScreen.kt`)**: One-time welcome screen introducing platform features ("O'rganishni boshlash" / "Hisobim bor · Kirish").
3. **Home Dashboard (`HomeScreen.kt`)**: Central learning dashboard with bottom bar navigation to Courses, Repeat, and Results screens, and deep-links to lesson details and user profile.
4. **Courses Catalog (`CoursesScreen.kt`)**: Clean 2-Column Grid Grammar Category Catalog Screen featuring prominent visual icon illustration cards (`Ot/Nouns`, `Sifat/Adjectives`, `Son/Numerals`, `Fe'l va Zamonlar`, `Olmosh/Pronouns`, `Ravish va Predloglar`).
5. **Lesson Detail Screen (`LessonDetailScreen.kt`)**: Lesson Detail Screen featuring bookmark action button, Qoida/Misol/Mashq segment tabs with completion checkmark `✓` icon, formula structure box with Pronoun Grid Table (`PronounColumnItem`) and `AppIcons.Layers` icon, example audio cards with highlighted verb phrases and circular speaker buttons (`ExampleAudioCard`) connected to **Voice AI TTS Engine** for English audio narration.
6. **Lesson Result Screen (`LessonResultScreen.kt`)**: Lesson Result Screen featuring share action button, completion banner card (`ContainerPurpleLight`) with "Dars yakunlandi" green chip, checkmark icon, score percentage, time spent, XP earned stats row, weekly plan progress bar, rule correction tip card ("Bir joyini mustahkamlaymiz"), and exam prep card.
7. **Level Unlocked Screen (`LevelUnlockedScreen.kt`)**: Next stage level unlocked celebration screen celebrating score completion.
8. **Voice Studio Screen (`VoiceStudioScreen.kt`)**: Interactive Voice AI controls, speed/pitch sliders, and text input.
9. **Voice Settings Screen (`VoiceSettingsScreen.kt`)**: Centralized voice library, search, category filters, individual voice audition buttons, audio cache, and preloaded English story testing environment.

---

## 📂 3. Architecture, Package & Component Structure

- **Architectural Pattern**: Clean Architecture + MVVM/MVI + Hilt DI + Jetpack Compose + Voice AI Engine.
- **Layer & Package Mapping**:
  - `data/`: Repositories, DataStore preferences, Room database, network APIs, TTS engine adapters.
  - `domain/`: Use cases, engine contracts, registry, text normalization, models.
  - `di/`: Hilt Dependency Injection modules.
  - `presentation/components/`: Reusable UI widgets and common design system components.
  - `presentation/navigation/`: Type-safe Navigation Compose routes and graphs.
  - `presentation/screens/`: Screen composables grouped cleanly by feature:
    - `splash/`, `onboarding/`, `home/`, `courses/`, `lesson/`, `repeat/`, `results/`, `profile/`, `voicestudio/`, `settings/`
  - `ui/theme/`: Theme tokens (`Color.kt`, `Type.kt`, `Dimensions.kt`, `Theme.kt`, `AppIcons.kt`).

---

## ⚙️ 4. Technology Stack & Dependencies

| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Build System** | Android Gradle Plugin (AGP) | `9.4.1` | Project build & resource merger |
| **Language** | Kotlin | `2.0.21` | Modern, safe Kotlin compiler |
| **UI Toolkit** | Jetpack Compose BOM | `2026.02.01` | Declarative UI framework |
| **Design System** | Material Design 3 | Integrated | Material3 color schemes & typography |
| **Dependency Injection** | Dagger Hilt | `2.60.1` | Compile-time dependency injection |
| **Annotation Processing** | KSP (Kotlin Symbol Processing) | `2.0.21-1.0.28` | High-performance code generation |
| **Navigation** | Navigation Compose | `2.8.8` | Declarative type-safe screen routing |
| **DataStore Preferences** | DataStore Preferences | `1.1.2` | Persistent user voice AI settings |
| **Database** | Room KTX | `2.6.1` | Model & audio cache metadata |
| **Media Audio** | Media3 ExoPlayer | `1.5.1` | Audio playback engine |
| **Networking** | Retrofit 2 + OkHttp 4 | `2.11.0` / `4.12.0` | FastAPI Cloud Voice REST API |
| **AI Inference** | ONNX Runtime Android | `1.19.2` | On-device Sherpa-ONNX inference |

---

## 🚫 5. Strictly Enforced Project Rules for Developers & AI

1. **Zero Hardcoding Rule**:
   - 🚫 NEVER hardcode user-facing strings -> Put in `res/values/strings.xml`.
   - 🚫 NEVER hardcode `Color(0xFF...)` -> Reference `MaterialTheme.colorScheme.*` or semantic tokens in `ui/theme/Color.kt`.
   - 🚫 NEVER hardcode `.sp` / `fontSize` / `fontWeight` -> Reference `AppTypography.*` or `MaterialTheme.typography.*` (`ui/theme/Type.kt`).
   - 🚫 NEVER hardcode `.dp` paddings or icon sizes -> Access via `LocalDimensions.current` (`ui/theme/Dimensions.kt`).
   - 🚫 NEVER hardcode `R.drawable.ic_*` -> Access icons via `AppIcons.*` (`ui/theme/AppIcons.kt`).

2. **Navigation Icons Rule**:
   - 🚫 NEVER use forward right chevrons (`ChevronRight`) for back navigation buttons.
   - ✅ Always use left back chevrons (`AppIcons.ChevronLeft`) in `TalkMeHeader` and back action buttons.

3. **Voice AI Engine & TTS Rules**:
   - All speech synthesis requests MUST route through `EngineRegistry` and `SpeakTextUseCase`.
   - Support local offline `SherpaOnnxTtsEngine`, server-side `CloudTtsEngine`, and native `AndroidSystemTtsEngine`.
   - Utilize centralized DataStore preferences (`SettingsRepositoryImpl`) and built-in long text testing environment (**Sample 01 — The Last Library in the City**).

4. **Package & Component Structure Rule**:
   - Reusable UI widgets MUST be placed in `presentation/components/`.
   - All screens MUST be cleanly nested inside `presentation/screens/` (`splash/`, `onboarding/`, `home/`, `courses/`, `lesson/`, `repeat/`, `results/`, `profile/`, `voicestudio/`, `settings/`).

5. **Strict Dead Code Removal Rule**:
   - 🚫 NEVER leave dead code, dangling imports, deprecated methods, or unused files in the project.
   - ✅ Whenever a feature, component, or file is removed or deprecated, all associated unused code, parameters, imports, and entire files MUST be completely and safely deleted from the codebase (`unused code deletes safely`).

6. **Documentation Standards**:
   - Every file, class, Composable, internal code block, and public function MUST have clean, professional English KDoc comments placed directly above declarations.
