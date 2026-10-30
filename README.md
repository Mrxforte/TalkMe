<div align="center">

# 🗣️ TalkMe — Enterprise Android English Learning & Gemini 3.6 Voice AI Engine

[![Android](https://img.shields.io/badge/Platform-Android-3DDC84?style=flat-square&logo=android&logoColor=white)](https://developer.android.com)
[![Kotlin](https://img.shields.io/badge/Language-Kotlin_2.0-7F52FF?style=flat-square&logo=kotlin&logoColor=white)](https://kotlinlang.org)
[![Jetpack Compose](https://img.shields.io/badge/Toolkit-Jetpack_Compose-4285F4?style=flat-square&logo=jetpackcompose&logoColor=white)](https://developer.android.com/compose)
[![Material Design 3](https://img.shields.io/badge/Design-Material_3-757575?style=flat-square&logo=materialdesign&logoColor=white)](https://m3.material.io)
[![Hilt](https://img.shields.io/badge/DI-Dagger_Hilt-4285F4?style=flat-square&logo=dagger&logoColor=white)](https://dagger.dev/hilt)
[![ONNX Runtime](https://img.shields.io/badge/AI-ONNX_Runtime_1.19-00599C?style=flat-square&logo=onnx&logoColor=white)](https://onnxruntime.ai)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

[🇬🇧 English](#-english) • [🇷🇺 Русский](#-русский) • [🇺🇿 O'zbekcha](#-ozbekcha)

</div>

---

## 🇬🇧 English

### 📖 Project & Voice AI Engine Overview
**TalkMe** is an enterprise-grade Android application engineered for English language learning, featuring an extensible **Gemini 3.6 Android Voice AI System**. It integrates offline local ONNX / Sherpa-ONNX speech inference, cloud FastAPI server TTS integration, automatic engine selection (`LOCAL_FIRST`, `CLOUD_FIRST`, `OFFLINE_ONLY`, `AUTO`), persistent DataStore preferences, multilingual text normalization for Uzbek (Latin/Cyrillic), Russian, and English, and a built-in long-text testing environment featuring the complete story **"Sample 01 — The Last Library in the City"**.

Built on **Clean Architecture + MVVM**, **Jetpack Compose**, **Material Design 3**, **Dagger Hilt**, and **Navigation Compose**.

---

### 🎙️ Core Voice AI System Capabilities
1. **Engine Abstraction (`TtsEngine`)**: Unified contract for local ONNX (`SherpaOnnxTtsEngine`), cloud FastAPI REST/WebSockets (`CloudTtsEngine`), and system fallback (`AndroidSystemTtsEngine`).
2. **Engine Registry & Local-First Routing (`EngineRegistry`)**: Automatically selects offline local models or cloud engines based on network conditions and required capabilities (emotion, intonation, speed, pitch).
3. **Centralized DataStore Settings (`SettingsRepositoryImpl`)**: Persists user speech preferences, speed/pitch controls, audio cache limits, and Wi-Fi download preferences.
4. **Uzbek & Multilingual Text Normalization (`TextNormalizationPipeline`)**: Normalizes Uzbek Latin/Cyrillic, Russian, English, numbers, abbreviations, and attached morphological suffixes (e.g. `projectni`, `meetingga`).
5. **Long-Text Processing (`LongTextProcessor`)**: Splits long stories into natural sentence/paragraph chunks while preserving speaker identity.
6. **Built-in Speech Testing (`SampleStory`)**: Includes the complete preloaded story **"Sample 01 — The Last Library in the City"** with Quick Test, Advanced Test, latency metrics, and RTF diagnostic reports.
7. **Voice Studio (`VoiceStudioScreen`)**: Interactive Compose interface with controls for text, voice selection, speed, pitch, generation, and audio playback.

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
│   ├── preferences/                     # DataStore Voice AI Settings Persistence
│   │   └── SettingsRepositoryImpl.kt    # Jetpack DataStore VoiceSettings repository
│   ├── remote/                          # Retrofit REST API Client for FastAPI Cloud Voice AI
│   │   ├── TtsApiService.kt             # FastAPI REST endpoints interface
│   │   └── model/CloudTtsModels.kt      # Cloud synthesis and voice metadata DTOs
│   ├── repository/                      # Concrete repository implementations
│   │   └── TextToSpeechRepositoryImpl.kt# Android native TTS repository implementation
│   └── voice/                           # Voice Engine Adapters
│       └── engine/                      # TtsEngine Adapters
│           ├── AndroidSystemTtsEngine.kt# System TTS fallback adapter
│           ├── CloudTtsEngine.kt        # FastAPI Cloud REST/WebSocket adapter
│           └── SherpaOnnxTtsEngine.kt   # Local ONNX / Sherpa-ONNX offline inference adapter
│
├── domain/                              # DOMAIN LAYER (Pure Kotlin Business Logic - Zero Android Dependencies)
│   ├── model/                           # Pure business domain entities
│   ├── repository/                      # Abstract repository interfaces
│   │   └── TextToSpeechRepository.kt    # Pure Kotlin TTS contract
│   ├── settings/                        # Settings domain entities
│   │   └── VoiceSettings.kt             # Configurable voice preferences model
│   ├── usecase/                         # Business use cases
│   │   └── SpeakTextUseCase.kt          # Speech pronunciation use case
│   └── voice/                           # Voice AI Business Core
│       ├── engine/                      # Common TtsEngine contract
│       │   └── TtsEngine.kt             # TtsEngine interface
│       ├── longtext/                    # Sentence & paragraph chunking engine
│       │   └── LongTextProcessor.kt     # Natural sentence chunking processor
│       ├── model/                       # Core engine data models
│       │   └── TtsEngineModels.kt       # TtsCapabilities, TtsRequest, AudioResult, ModelMetadata
│       ├── normalization/               # Text Normalization & Morphological Handling
│       │   └── TextNormalizationPipeline.kt # Uzbek Latin/Cyrillic, RU, EN normalizer
│       ├── registry/                    # Engine Discovery & Routing
│       │   └── EngineRegistry.kt        # Engine selection and capability routing
│       └── testing/                     # Long Text Testing & Sample Story
│           └── SampleStory.kt           # Complete story "Sample 01 — The Last Library in the City"
│
├── di/                                  # DEPENDENCY INJECTION LAYER
│   └── AppModule.kt                     # Hilt DI module providing singletons and Voice AI bindings
│
├── presentation/                        # PRESENTATION LAYER (UI, Navigation, ViewModels)
│   ├── components/                      # Reusable Design System UI Widgets
│   ├── navigation/                      # Navigation System
│   │   ├── Screen.kt                    # Type-safe sealed route definitions (includes VoiceStudio & VoiceSettings)
│   │   └── NavGraph.kt                  # AppNavGraph hosting all screen destinations & tab state
│   └── screens/                         # Modularized Feature Screens
│       ├── splash/                      # Splash Screen (SplashScreen.kt)
│       ├── onboarding/                  # Welcome & Onboarding Screen (OnboardingScreen.kt)
│       ├── home/                        # Home Dashboard (HomeScreen.kt & home/components/)
│       ├── courses/                     # Courses Catalog (CoursesScreen.kt)
│       ├── lesson/                      # Lesson & Exercise Workflow
│       │   ├── LessonDetailScreen.kt    # Grammar rules, formula box, pronoun grid, audio examples (Voice AI connected)
│       │   ├── LessonDetailViewModel.kt # ViewModel injecting SpeakTextUseCase
│       │   ├── QuizScreen.kt            # Interactive quiz options & feedback cards
│       │   ├── LessonResultScreen.kt    # Score breakdown (80%, 3:24 time, +20 XP) & rule tip
│       │   └── LevelUnlockedScreen.kt   # Next stage / level unlocked celebration screen
│       ├── repeat/                      # Spaced Repetition Practice (RepeatScreen.kt)
│       ├── results/                     # Leaderboard & Analytics (ResultsScreen.kt)
│       ├── profile/                     # User Profile & Achievements (ProfileScreen.kt)
│       ├── voicestudio/                 # Voice AI Studio & Speech Controls (VoiceStudioScreen.kt)
│       └── settings/                    # Centralized Settings & Speech Testing (VoiceSettingsScreen.kt)
│
└── ui/theme/                            # DESIGN SYSTEM ENGINE & TOKENS
    ├── Color.kt                         # Semantic color palette with full KDoc documentation
    ├── Dimensions.kt                    # Standardized DP scale & LocalDimensions CompositionLocal
    ├── AppIcons.kt                      # Centralized drawable icon repository
    ├── Type.kt                          # AppTypography text styles hierarchy
    └── Theme.kt                         # Material3 theme configuration
```

---

### ⚙️ How the Voice AI Engine Works
1. **Request Dispatch**: UI screens call `SpeakTextUseCase` or `EngineRegistry.synthesize(request)`.
2. **Text Normalization**: `TextNormalizationPipeline` detects language/script, converts Uzbek Cyrillic if necessary, expands numbers, and applies morphological replacements.
3. **Engine Routing**: `EngineRegistry` selects `SherpaOnnxTtsEngine` (for offline local ONNX inference), `CloudTtsEngine` (for FastAPI server models like XTTS-v2), or `AndroidSystemTtsEngine` (for system fallback) based on `VoiceSettings`.
4. **Long-Text Chunking**: `LongTextProcessor` splits multi-paragraph text (such as **Sample 01 — The Last Library in the City**) into sentence chunks while preserving voice identity and sample rates.
5. **Persistence**: `SettingsRepositoryImpl` persists user speech settings via Jetpack DataStore.

---
---

## 🇷🇺 Русский

### 📖 Обзор голосового движка Voice AI
**TalkMe** включает в себя расширяемую **голосовую систему Voice AI Gemini 3.6**. Система поддерживает локальный офлайн-синтез ONNX / Sherpa-ONNX, облачные серверные модели FastAPI (XTTS-v2, F5-TTS, StyleTTS2), автоматический выбор движка (`LOCAL_FIRST`, `CLOUD_FIRST`, `OFFLINE_ONLY`, `AUTO`), сохранение настроек в DataStore, нормализацию текста для узбекского (латиница/кириллица), русского и английского языков, а также встроенную среду тестирования длинных текстов с рассказом **"Sample 01 — The Last Library in the City"**.

---
---

## 🇺🇿 O'zbekcha

### 📖 Ovozli AI Dvigateli Haqida
**TalkMe** loyihasi o'z ichiga kengaytiriluvchi **Gemini 3.6 Android Voice AI Dvigatelini** oladi. U lokal oflayn ONNX / Sherpa-ONNX modellari, masofaviy FastAPI bulutli server modellari (XTTS-v2, F5-TTS, StyleTTS2), dvigatelni avtomatik tanlash (`LOCAL_FIRST`, `CLOUD_FIRST`, `OFFLINE_ONLY`, `AUTO`), DataStore sozlamalarini saqlash, o'zbek (lotin/kirill), rus va ingliz tillarida matnni normallashtirish hamda to'liq **"Sample 01 — The Last Library in the City"** hikoyasini o'z ichiga olgan sinov muhitini taqdim etadi.

---

<div align="center">
  <p>Developed with ❤️ by <a href="https://github.com/Mrxforte">Mrxforte</a></p>
  <p>© 2026 TalkMe. All rights reserved.</p>
</div>
