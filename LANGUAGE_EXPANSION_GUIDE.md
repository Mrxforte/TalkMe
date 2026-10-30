# TalkMe — Multilingual Language Pack & Beginner Lesson Expansion Guide

## Overview
TalkMe separates the **Interface & Explanation Language** (`interfaceLanguage`) from the **Target Learning Language** (`learningLanguage`) and stores all lesson explanations, vocabulary translations, exercise instructions, and feedback in modular **Language Packs**.

Adding a new language (e.g., Kazakh `kk`, Turkish `tr`, Arabic `ar`, Spanish `es`) requires **zero modifications** to ViewModels, Composables, React screens, or exercise evaluation logic.

---

## Step-by-Step: How to Add a New Interface Language

### 1. Register Language Metadata
Add or enable the language entry in:
- **Android Kotlin**: `/app/src/main/java/com/talkme/domain/localization/LanguagePackModels.kt` (`InterfaceLanguage` enum)
- **Web / TypeScript**: `/src/domain/i18n/uiStrings.ts` (`LANGUAGE_METADATA_REGISTRY`)

Provide:
- `code`: ISO 639-1 language code (e.g., `'kk'`, `'tr'`)
- `nameEn`: English name (e.g., `'Kazakh'`)
- `nativeName`: Native display name (e.g., `'Қазақша'`)
- `flagEmoji`: Flag icon (e.g., `'🇰🇿'`)
- `bcp47Locale`: Valid BCP-47 locale tag (e.g., `'kk-KZ'`)
- `typography`: Font family, `lineHeightScale`, `isRtl`, and `supportsCjkLineBreak`

### 2. Add Static UI Localization Resources
- **Android**: Create `/app/src/main/res/values-<lang>/strings.xml` (e.g. `values-kk/strings.xml`) with translated keys matching `values/strings.xml`.
- **Web / TypeScript**: Add the key-value dictionary in `/src/domain/i18n/uiStrings.ts` under `UI_TRANSLATIONS_BY_LANGUAGE[<lang>]`.
  - Keep all `{placeholder}` tokens (such as `{name}`, `{count}`, `{days}`) identical to the reference language.

### 3. Add Localized Lesson Translation Pack
In `/src/domain/i18n/beginnerLessonPack.ts` (and `/app/src/main/java/com/talkme/data/lesson/FirstBeginnerLessonCatalog.kt`):
- Reference the same stable IDs:
  - `lessonId`: `"grammar_fundamentals_001"`
  - `vocabId`s: `voc_a0_hello`, `voc_a0_hi`, `voc_a0_thank_you`, `voc_a0_i_am`, `voc_a0_welcome`, `voc_a0_goodbye`
  - `sectionId`s: `step_1_welcome` through `step_10_completion`
  - `exerciseId`s: `ex_a0_01_choose_translation` through `ex_a0_06_speaking_mic`
- Write natural, beginner-friendly explanations in the target language (never translate word-by-word when unnatural).
- Keep all target English phrases and `ttsMeta` (`en-US` / `en-GB`) untouched so TTS always speaks English with an English voice.

### 4. Run the Automated Validator & Verification Suite
Run the validation engine to verify 100% key completeness, placeholder integrity, and TTS metadata:
```bash
npx tsx src/domain/i18n/__tests__/verifyMultilingualSystem.ts
```
If any key is missing, empty, or has a mismatched placeholder, `LanguagePackValidator` will report the exact `languageCode`, `targetKeyOrId`, and error code.
