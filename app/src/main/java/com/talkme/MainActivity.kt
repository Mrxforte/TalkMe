package com.talkme

import android.graphics.Color
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.talkme.presentation.screens.webview.TalkMeWebViewScreen
import com.talkme.ui.theme.TalkMeTheme
import dagger.hilt.android.AndroidEntryPoint

/**
 * Main Activity hosting the TalkMe Full-Screen WebView container (`TalkMeWebViewScreen`)
 * with edge-to-edge transparent status bar and navigation bar.
 */
@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge(
            statusBarStyle = SystemBarStyle.light(
                Color.TRANSPARENT,
                Color.TRANSPARENT
            ),
            navigationBarStyle = SystemBarStyle.light(
                Color.TRANSPARENT,
                Color.TRANSPARENT
            )
        )

        setContent {
            TalkMeTheme {
                TalkMeWebViewScreen(
                    initialUrl = "file:///android_asset/dist/index.html"
                )
            }
        }
    }
}
