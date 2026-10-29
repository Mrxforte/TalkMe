<div align="center">

# 🗣️ TalkMe — Modern Android English Learning & Practice Application

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

### 📖 Overview
**TalkMe** is an enterprise-grade, highly polished Android application designed for learning and practicing English through bite-sized lessons, interactive vocabulary spaced repetition, CEFR grammar catalogs, real-world scenario dialogues, quizzes, and live leaderboard rankings.

Built from the ground up using modern Android development best practices, **TalkMe** features a strict **Clean Architecture + MVVM** structure, **Jetpack Compose** declarative UI, **Material Design 3**, **Dagger Hilt** dependency injection, and type-safe **Navigation Compose**.

---

### 🏛️ Architectural Highlights
- **Clean Architecture**: Separation of concerns across `data`, `domain`, and `presentation` layers, keeping business logic independent of the Android framework.
- **Modular Presentation Hierarchy**: UI screens are cleanly organized under `presentation/screens/` (`splash`, `onboarding`, `home`, `courses`, `lesson`, `repeat`, `results`, `profile`), while generic reusable widgets reside in `presentation/components/`.
- **Zero-Hardcoding Policy**: Absolutely zero hardcoded strings (`strings.xml`), colors (`Color.kt`), dimensions (`Dimensions.kt`), typography (`Type.kt`), or icons (`AppIcons.kt`).
- **Pixel-Perfect Fidelity**: Matches professional Figma design specifications (CEFR path selector, interactive subtopic cards with rounded purple indicator dots, audio pronunciation speaker buttons, formula tables, and smooth progress bars).

---

### 🛠️ Technology Stack
- **Min SDK**: 24 (Android 7.0+)
- **Compile SDK**: 37
- **Language**: Kotlin 2.0.21
- **UI Framework**: Jetpack Compose (BOM 2026.02.01)
- **Dependency Injection**: Dagger Hilt 2.60.1 + KSP 2.0.21-1.0.28
- **Navigation**: Navigation Compose 2.8.8 (Type-safe routes & backstack preservation)
- **Architecture Components**: ViewModel, StateFlow, Coroutines

---

### 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Mrxforte/TalkMe.git
   ```
2. **Open in Android Studio**:
   - Recommended version: Android Studio Jellyfish / Koala or newer.
   - Ensure Kotlin 2.0+ and KSP plugin support are enabled.
3. **Sync Gradle & Run**:
   - Click **Sync Project with Gradle Files**.
   - Select an emulator or physical device and click **Run 'app'**.

---
---

## 🇷🇺 Русский

### 📖 Обзор
**TalkMe** — это современное Android-приложение корпоративного уровня для изучения и практики английского языка. Оно включает в себя интерактивные уроки, интервальное повторение словарного запаса, каталоги грамматики CEFR, диалоги из реальной жизни, теги уровня, квизы и таблицы лидеров.

Приложение спроектировано по принципам **Clean Architecture + MVVM**, использует декларативный UI **Jetpack Compose**, **Material Design 3**, внедрение зависимостей **Dagger Hilt** и безопасную навигацию **Navigation Compose**.

---

### 🏛️ Архитектурные особенности
- **Чистая архитектура (Clean Architecture)**: Четкое разделение на слои `data`, `domain` и `presentation`.
- **Модульная структура UI**: Экраны сгруппированы в `presentation/screens/`, а переиспользуемые виджеты — в `presentation/components/`.
- **Политика отсутствия хардкода**: Все строки вынесены в `strings.xml`, цвета в `Color.kt`, размеры в `Dimensions.kt`, шрифты в `Type.kt`, а иконки в `AppIcons.kt`.

---

### 🚀 Начало работы

1. **Клонируйте репозиторий**:
   ```bash
   git clone https://github.com/Mrxforte/TalkMe.git
   ```
2. **Откройте в Android Studio** и выполните Sync Project with Gradle Files.
3. **Запустите приложение** на эмуляторе или реальном устройстве.

---
---

## 🇺🇿 O'zbekcha

### 📖 Umumiy tavsif
**TalkMe** — ingliz tilini qadam-baqadam, qisqa darslar, oraliqli takrorlash (spaced repetition), CEFR grammatika kataloglari, real hayotiy vaziyatlar va testlar orqali o'rganishga mo'ljallangan zamonaviy Android ilovasi.

Loyiha **Clean Architecture + MVVM**, **Jetpack Compose**, **Material Design 3**, **Dagger Hilt** va **Navigation Compose** texnologiyalari asosida qurilgan bo'lib, korxona darajasidagi (enterprise-grade) talablarga to'liq javob beradi.

---

### 🏛️ Arxitektura va Tuzilma
- **Toza Arxitektura (Clean Architecture)**: `data`, `domain` va `presentation` qatlamlariga qat'iy bo'lingan.
- **Modul UI Tuzilmasi**: Barcha ekranlar `presentation/screens/` ostida, umumiy komponentlar esa `presentation/components/` ostida joylashgan.
- **Nollik Hardcoding Siyosati**: Matnlar `strings.xml` da, ranglar `Color.kt` da, o'lchamlar `Dimensions.kt` da, shriftlar `Type.kt` da va ikonka resurslari `AppIcons.kt` da markazlashtirilgan.

---

### 🚀 O'rnatish va Ishga Tushirish

1. **Loyihani klonlash**:
   ```bash
   git clone https://github.com/Mrxforte/TalkMe.git
   ```
2. **Android Studio'da ochish**:
   - Android Studio Jellyfish / Koala yoki undan yangi versiyasidan foydalaning.
   - Gradle sinxronizatsiyasini (`Sync Project with Gradle Files`) bajaring.
3. **Ilovani ishga tushirish**:
   - Emulator yoki real Android qurilmani tanlab, **Run 'app'** tugmasini bosing.

---

<div align="center">
  <p>Developed with ❤️ by <a href="https://github.com/Mrxforte">Mrxforte</a></p>
  <p>© 2026 TalkMe. All rights reserved.</p>
</div>
