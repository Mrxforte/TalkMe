# TalkMe - Comprehensive Application Architecture, Design System & Project Rules

This document serves as the **authoritative, single source of truth** for all architectural patterns, design system rules, technology stack specifications, string usage mappings, and development guidelines for the **TalkMe** Android project based on design specifications.

---

## 🎙️ 1. Gemini 3.6 Android Voice AI Engine Architecture

The TalkMe application includes a complete, production-ready Voice AI engine supporting offline ONNX/Sherpa-ONNX local models, cloud FastAPI server integration, dynamic model capabilities, centralized DataStore preferences, text normalization for Uzbek/Russian/English, and built-in long text testing environment.

### 1.1 Core Engine Components & Contracts
- **`TtsEngine` Contract (`domain/voice/engine/TtsEngine.kt`)**: Common abstraction for all speech synthesis engines.
- **Engine Adapters (`data/voice/engine/`)**:
  - `SherpaOnnxTtsEngine`: Local offline ONNX / sherpa-onnx runtime inference adapter.
  - `CloudTtsEngine`: Server-side FastAPI REST & WebSocket streaming adapter (XTTS-v2, F5-TTS, StyleTTS2).
  - `AndroidSystemTtsEngine`: Native Android framework `TextToSpeech` fallback adapter.
- **`EngineRegistry` (`domain/voice/registry/EngineRegistry.kt`)**: Discovers engines and routes synthesis requests according to `EngineSelectionMode` (`LOCAL_FIRST`, `CLOUD_FIRST`, `OFFLINE_ONLY`, `AUTO`).
- **DataStore Settings Persistence (`data/preferences/SettingsRepositoryImpl.kt`)**: Stores user-configurable speech preferences (speed, pitch, volume, emotion, intonation, character profile, pause durations, audio cache limits).
- **Text Normalization Pipeline (`domain/voice/normalization/TextNormalizationPipeline.kt`)**: Handles Uzbek Latin/Cyrillic, Russian, English, numbers, date expansion, morphological suffixes, and pronunciation dictionaries.
- **Long-Text Processing (`domain/voice/longtext/LongTextProcessor.kt`)**: Splits long stories into natural sentence/paragraph chunks while preserving speaker identity.
- **Speech Testing & Sample Story (`domain/voice/testing/SampleStory.kt`)**: Preloaded English story **"Sample 01 — The Last Library in the City"** for quick & advanced speech testing and latency/RTF diagnostic reporting.
- **Voice Studio & Settings Screens (`presentation/screens/voicestudio/`, `presentation/screens/settings/`)**: Full Compose UIs for voice customization, preview, and testing.

---

## 🏗️ 2. Screen Flow & Navigation Hierarchy

1. **Splash Screen (`SplashScreen.kt`)**: Initial branding screen loaded on app launch (2-second timer).
2. **Onboarding Welcome Screen (`OnboardingScreen.kt`)**: One-time welcome screen introducing platform features ("O'rganishni boshlash" / "Hisobim bor · Kirish").
3. **Home Dashboard (`HomeScreen.kt`)**: Central learning dashboard with bottom bar navigation to Courses, Repeat, and Results screens, and deep-links to lesson details and user profile.
4. **Courses Catalog (`CoursesScreen.kt`)**: CEFR Level Path Catalog Screen (matching Untitled.pdf Page 2) featuring CEFR level selector chips (A1-C2), category filter tabs, detailed grammar catalog breakdown, Module 1 subtopic cards (`TalkMeSubtopicCard`) with rounded purple indicator dots and `onClick: () -> Unit` clickability, search action lens, and sticky "Grammatika katalogini davom ettirish" button.
5. **Lesson Detail Screen (`LessonDetailScreen.kt`)**: Lesson Detail Screen (matching Untitled.pdf Page 3) featuring bookmark action button, Qoida/Misol/Mashq segment tabs with completion checkmark `✓` icon, formula structure box with Pronoun Grid Table (`PronounColumnItem`) and `AppIcons.Layers` icon, example audio cards with highlighted verb phrases and circular speaker buttons (`ExampleAudioCard`) connected to **Voice AI TTS Engine** for English audio narration.
6. **Lesson Result Screen (`LessonResultScreen.kt`)**: Lesson Result Screen (matching Untitled.pdf Page 5) featuring share action button, completion banner card (`ContainerPurpleLight`) with "Dars yakunlandi" green chip, checkmark icon, score percentage, time spent, XP earned stats row, weekly plan progress bar, rule correction tip card ("Bir joyini mustahkamlaymiz"), and exam prep card.
7. **Level Unlocked Screen (`LevelUnlockedScreen.kt`)**: Next stage level unlocked celebration screen celebrating score completion.
8. **Voice Studio Screen (`VoiceStudioScreen.kt`)**: Interactive Voice AI controls, speed/pitch sliders, and text input.
9. **Voice Settings Screen (`VoiceSettingsScreen.kt`)**: Centralized preferences, audio cache, and preloaded English story testing environment.

---

## ⚙️ 3. Technology Stack & Dependencies

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

## 🚫 4. Strictly Enforced Project Rules for Developers & AI

1. **Zero Hardcoding Guarantee**:
   - 🚫 NEVER hardcode string literals -> Put in `strings.xml`.
   - 🚫 NEVER hardcode `Color(0xFF...)` -> Put in `Color.kt` or `MaterialTheme.colorScheme`.
   - 🚫 NEVER hardcode `.sp` / `fontSize` / `fontWeight` -> Put in `AppTypography` (`Type.kt`).
   - 🚫 NEVER hardcode `.dp` paddings or icon sizes -> Put in `LocalDimensions.current` (`Dimensions.kt`).
   - 🚫 NEVER hardcode `R.drawable.ic_*` -> Access via `AppIcons.*` (`AppIcons.kt`).
2. **Back Navigation Icons**:
   - 🚫 NEVER use forward right chevrons (`ChevronRight`) for back navigation buttons.
   - ✅ Always use left back chevrons (`AppIcons.ChevronLeft`) in `TalkMeHeader` and back action buttons.
3. **Voice AI Engine Rules**:
   - All speech requests MUST route through `EngineRegistry` and `SpeakTextUseCase`.
   - Unadvertised features (like emotion on basic Piper models) MUST be accurately reported in `TtsCapabilities`.
4. **Documentation Standards**:
   - Every file, class, Composable, internal code block, and public function MUST have English KDoc comments placed directly above declarations.
