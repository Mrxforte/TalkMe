package com.talkme

import android.os.Bundle
import android.speech.tts.TextToSpeech
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.CompositionLocalProvider
import androidx.navigation.compose.rememberNavController
import com.talkme.presentation.navigation.TalkMeNavGraph
import com.talkme.presentation.state.LocalTalkMeAppState
import com.talkme.presentation.state.rememberTalkMeAppState
import com.talkme.ui.theme.TalkMeTheme
import dagger.hilt.android.AndroidEntryPoint
import java.util.Locale

/**
 * Main Activity hosting the Jetpack Compose navigation graph (`TalkMeNavGraph`)
 * inside `TalkMeTheme`, with Android native TextToSpeech engine wired to `LocalTalkMeAppState`.
 */
@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    private var textToSpeech: TextToSpeech? = null
    private var isTtsInitialized = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        textToSpeech = TextToSpeech(this) { status ->
            if (status == TextToSpeech.SUCCESS) {
                textToSpeech?.language = Locale.US
                isTtsInitialized = true
            }
        }

        setContent {
            TalkMeTheme {
                val appState = rememberTalkMeAppState { text, slow ->
                    if (isTtsInitialized && textToSpeech != null) {
                        textToSpeech?.setSpeechRate(if (slow) 0.65f else 1.0f)
                        textToSpeech?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "talkme_tts")
                    }
                }

                CompositionLocalProvider(LocalTalkMeAppState provides appState) {
                    val navController = rememberNavController()
                    TalkMeNavGraph(
                        navController = navController,
                        onPlaySampleVoice = { text ->
                            appState.speak(text)
                        }
                    )
                }
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        textToSpeech?.stop()
        textToSpeech?.shutdown()
        textToSpeech = null
    }
}

