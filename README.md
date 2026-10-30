# TalkMe — React English Learning Platform

A comprehensive English learning and speech synthesis platform rewritten from the original Android application into a modern React application. TalkMe preserves all original core features, gamification flows, FSRS-6 spaced repetition, and 6 approved Voice AI character profiles.

## 🎙️ Core Features

1. **Voice AI Character Platform & TTS**:
   - 6 approved character voices with authentic pitch and speech rate parameters:
     - 👨 **Adult Male (Katta Yoshli Erkak)**: 0.88x rate, 0.88x pitch
     - 👩 **Adult Female (Katta Yoshli Ayol)**: 0.92x rate, 1.00x pitch
     - 👦 **Young Boy (Yosh O'g'il Bola)**: 1.00x rate, 1.30x pitch
     - 👧 **Young Girl (Yosh Qiz Bola)**: 1.02x rate, 1.40x pitch
     - 🧑‍🎓 **Teenage Boy (O'smir Yigit)**: 1.02x rate, 0.75x pitch
     - 👩‍🎓 **Teenage Girl (O'smir Qiz)**: 1.04x rate, 1.15x pitch
   - Natural human learning speed presets (0.75x, 0.80x, 0.88x, 0.95x).
   - Live speech synthesis and audition buttons across all screens.
   - Built-in prosody testing with **"Sample 01 — The Last Library in the City"** and statement/question intonation contour benchmarks.

2. **Official FSRS-6 Spaced Repetition**:
   - Complete implementation of the FSRS-6 algorithm (Stability, Difficulty, Retrievability, Review Intervals).
   - 4 user recall ratings: **Qayta (Again)**, **Qiyin (Hard)**, **Yaxshi (Good)**, **Oson (Easy)**.
   - Daily Spaced Repetition dashboard tracking retention rate, completed flashcards, and daily streaks.

3. **Curriculum & Duolingo-Style Levels Path**:
   - Grammar Category Catalog: *Grammar Fundamentals*, *Sifat (Adjectives)*, *Son (Numerals)*, *Fe'l va Zamonlar*, *Olmosh (Pronouns)*, *Predloglar*.
   - Duolingo-style curved map path with 3D circular tactile buttons, owl mascot intro nodes, star rewards, and level detail bottom sheets.

4. **Lesson & Practice Exercises**:
   - Present Continuous lesson with structural formula, pronoun subject grid (`I -> am`, `He/She/It -> is`, `You/We/They -> are`), audio example narration cards, and pronunciation guides.
   - Interactive 5-question quiz with instant feedback and rule reinforcement.
   - Lesson Result summary showing 80% score, XP rewards, weekly goal progress, and unlocked levels.

5. **Student Leaderboard & Profile**:
   - Profile overview with XP counters, streak badges, and student ranking tables (Madina S. #1, Jasur K. #2, Sardor M. #3, Aziz #4).

## 🛠️ Technology Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design tokens matching the TalkMe palette (`#5E4B8B` Brand Purple, `#27AE60` Success Green, `#FAFAFC` Soft Background)
- **Icons**: Lucide Icons
- **Animation**: Canvas Confetti & CSS tactile 3D interactions
