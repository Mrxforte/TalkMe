package com.example.talkme.ui.theme

import androidx.annotation.DrawableRes
import com.example.talkme.R

/**
 * Centralized Image Asset Repository & Visual Symbol Constants for TalkMe Application.
 *
 * Provides typed single-point references to PNG/JPEG raster illustrations,
 * mascot emojis, flags, and UI status symbols to avoid string and drawable hardcoding.
 */
object AppImages {

    /** Default Grammar Background PNG/JPEG illustration */
    @DrawableRes val GrammarBgIllustration: Int = R.drawable.img

    // ==========================================
    // MASCOT & CHARACTER EMOJI CONSTANTS
    // ==========================================
    /** Wise Owl mascot emoji */
    const val EMOJI_OWL_MASCOT: String = "🦉"

    /** Spanish country flag emoji */
    const val EMOJI_SPANISH_FLAG: String = "🇪🇸"

    /** UK country flag emoji */
    const val EMOJI_UK_FLAG: String = "🇬🇧"

    /** US country flag emoji */
    const val EMOJI_US_FLAG: String = "🇺🇸"

    /** Flame streak emoji */
    const val EMOJI_FIRE_STREAK: String = "🔥"

    /** Diamond gem currency emoji */
    const val EMOJI_BLUE_GEM: String = "💎"

    /** Cyan ice gem emoji */
    const val EMOJI_CYAN_GEM: String = "🧊"

    /** Magic crystal ball shop icon */
    const val EMOJI_MAGIC_BALL: String = "🔮"

    /** Treasure chest reward box emoji */
    const val EMOJI_TREASURE_CHEST: String = "🎁"

    /** Crown summit badge emoji */
    const val EMOJI_CROWN: String = "👑"

    /** Golden trophy level badge */
    const val EMOJI_TROPHY: String = "🏆"

    /** Star symbol for levels and ratings */
    const val SYMBOL_STAR_FILLED: String = "★"

    /** Lightning bolt XP symbol */
    const val EMOJI_LIGHTNING: String = "⚡"

    /** Camera video lesson icon */
    const val EMOJI_CAMERA_VIDEO: String = "📹"

    /** Lock symbol for locked stages */
    const val SYMBOL_LOCK: String = "🔒"

    /** Notification bell icon */
    const val EMOJI_NOTIFICATION_BELL: String = "🔔"

    /** Up arrow scroll jump button */
    const val SYMBOL_ARROW_UP: String = "↑"

    /** Right arrow action button */
    const val SYMBOL_ARROW_RIGHT: String = "→"
}

/**
 * Sealed class specifying Image Asset Category Types for strict type-safety.
 */
sealed class ImageAssetType {
    data object VectorDrawable : ImageAssetType()
    data object RasterIllustration : ImageAssetType()
    data object MascotEmoji : ImageAssetType()
}
