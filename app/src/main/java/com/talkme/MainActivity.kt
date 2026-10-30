package com.talkme

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.navigation.compose.rememberNavController
import com.talkme.presentation.navigation.TalkMeNavGraph
import com.talkme.ui.theme.TalkMeTheme
import dagger.hilt.android.AndroidEntryPoint

/**
 * Main Activity hosting the Jetpack Compose navigation graph (`TalkMeNavGraph`)
 * inside `TalkMeTheme`.
 */
@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            TalkMeTheme {
                val navController = rememberNavController()
                TalkMeNavGraph(navController = navController)
            }
        }
    }
}
