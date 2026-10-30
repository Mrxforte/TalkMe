package com.talkme.ui.theme

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowLeft
import androidx.compose.material.icons.automirrored.filled.VolumeUp
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.Layers
import androidx.compose.material.icons.filled.Lightbulb
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.StarBorder
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material.icons.filled.Warning
import androidx.compose.ui.graphics.vector.ImageVector

/**
 * Centralized icon catalog for TalkMe.
 * Enforces Rule 1 & Rule 2 of PROJECT_RULES.md:
 * - Never hardcode R.drawable.ic_* in screens.
 * - Always use AppIcons.ChevronLeft for back navigation (never ChevronRight).
 */
object AppIcons {
    val ChevronLeft: ImageVector = Icons.AutoMirrored.Filled.KeyboardArrowLeft
    val Layers: ImageVector = Icons.Default.Layers
    val VolumeUp: ImageVector = Icons.AutoMirrored.Filled.VolumeUp
    val BookmarkFilled: ImageVector = Icons.Default.Bookmark
    val BookmarkOutline: ImageVector = Icons.Default.BookmarkBorder
    val Check: ImageVector = Icons.Default.Check
    val CheckCircle: ImageVector = Icons.Default.CheckCircle
    val Share: ImageVector = Icons.Default.Share
    val SettingsSliders: ImageVector = Icons.Default.Tune
    val Play: ImageVector = Icons.Default.PlayArrow
    val Refresh: ImageVector = Icons.Default.Refresh
    val StarFilled: ImageVector = Icons.Default.Star
    val StarOutline: ImageVector = Icons.Default.StarBorder
    val Lightbulb: ImageVector = Icons.Default.Lightbulb
    val Warning: ImageVector = Icons.Default.Warning
    val ExpandMore: ImageVector = Icons.Default.ExpandMore
    val ExpandLess: ImageVector = Icons.Default.ExpandLess
}
