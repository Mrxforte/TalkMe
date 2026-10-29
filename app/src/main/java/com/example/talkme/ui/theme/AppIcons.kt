package com.example.talkme.ui.theme

import androidx.annotation.DrawableRes
import com.example.talkme.R

/**
 * Centralized Icon Repository for the TalkMe application.
 *
 * Provides single-point access to all Vector Drawables and iconography used
 * throughout the Design System and UI components to avoid hardcoded R.drawable references.
 */
object AppIcons {
    /** Book icon used for logos, lessons, and reading skills */
    @DrawableRes val Book: Int = R.drawable.ic_book

    /** Home navigation tab icon */
    @DrawableRes val Home: Int = R.drawable.ic_home

    /** Courses navigation tab icon */
    @DrawableRes val Courses: Int = R.drawable.ic_courses

    /** Repeat & Spaced repetition tab icon */
    @DrawableRes val Repeat: Int = R.drawable.ic_repeat

    /** Results & Statistics navigation tab icon */
    @DrawableRes val Results: Int = R.drawable.ic_results

    /** Chevron Right arrow icon for navigation buttons and list items */
    @DrawableRes val ChevronRight: Int = R.drawable.ic_chevron_right

    /** Chevron Left back arrow icon for top navigation bar */
    @DrawableRes val ChevronLeft: Int = R.drawable.ic_chevron_left

    /** Up-Right Arrow icon for external or action links */
    @DrawableRes val ArrowUpRight: Int = R.drawable.ic_arrow_up_right

    /** Flame / Fire icon for streak counts and daily progress */
    @DrawableRes val Fire: Int = R.drawable.ic_fire

    /** Headphones icon for Listening skills */
    @DrawableRes val Headphones: Int = R.drawable.ic_headphones

    /** Microphone icon for Speaking skills */
    @DrawableRes val Mic: Int = R.drawable.ic_mic

    /** Edit / Pencil icon for Writing skills */
    @DrawableRes val Edit: Int = R.drawable.ic_edit

    /** Chat / Dialogue icon for real-world scenarios */
    @DrawableRes val Chat: Int = R.drawable.ic_chat

    /** Search lens icon for courses catalog */
    @DrawableRes val Search: Int = R.drawable.ic_search

    /** Bookmark ribbon icon for bookmarking lessons */
    @DrawableRes val Bookmark: Int = R.drawable.ic_bookmark

    /** Volume speaker icon for listening to example pronunciation */
    @DrawableRes val Volume: Int = R.drawable.ic_volume

    /** Audio wave icon for pronunciation tips */
    @DrawableRes val AudioWave: Int = R.drawable.ic_audio_wave

    /** Stacked layers icon for formula structure box */
    @DrawableRes val Layers: Int = R.drawable.ic_layers

    /** Checkmark icon for completed tabs and items */
    @DrawableRes val Check: Int = R.drawable.ic_check

    /** Share node icon for sharing lesson results */
    @DrawableRes val Share: Int = R.drawable.ic_share

    /** School graduation cap icon for exam prep section */
    @DrawableRes val School: Int = R.drawable.ic_school

    /** Clock time icon for onboarding duration feature */
    @DrawableRes val Clock: Int = R.drawable.ic_clock
}
