package com.talkme.presentation.screens.webview

import android.annotation.SuppressLint
import android.graphics.Bitmap
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import com.talkme.ui.theme.TalkMeColors

/**
 * Clean 100% Full-Screen Android Native WebView Container with Full-Screen Animated Splash Screen.
 *
 * Highlights:
 * - Defaults to `file:///android_asset/dist/index.html` for **INSTANT** zero-latency app launch.
 * - Displays a sleek, animated Native Splash Screen while WebView initializes, then smoothly fades out.
 * - Supports JavaScript, LocalStorage, WebGL, and HTML5 Audio.
 */
@Suppress("DEPRECATION")
@SuppressLint("SetJavaScriptEnabled")
@Composable
fun TalkMeWebViewScreen(
    initialUrl: String = "file:///android_asset/dist/index.html",
    modifier: Modifier = Modifier
) {
    var currentUrl by remember { mutableStateOf(initialUrl) }
    var isLoading by remember { mutableStateOf(true) }
    var hasError by remember { mutableStateOf(false) }
    var webViewRef by remember { mutableStateOf<WebView?>(null) }

    val fallbackAssetUrl = "file:///android_asset/dist/index.html"

    Scaffold(
        modifier = modifier.fillMaxSize(),
        containerColor = Color(0xFF1E1B4B)
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            AndroidView(
                factory = { context ->
                    WebView(context).apply {
                        settings.apply {
                            javaScriptEnabled = true
                            domStorageEnabled = true
                            allowFileAccess = true
                            allowContentAccess = true
                            allowFileAccessFromFileURLs = true
                            allowUniversalAccessFromFileURLs = true
                            useWideViewPort = true
                            loadWithOverviewMode = true
                            builtInZoomControls = false
                            displayZoomControls = false
                            javaScriptCanOpenWindowsAutomatically = true
                            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                            userAgentString = "$userAgentString TalkMeAndroidWebView/1.0"
                        }

                        webChromeClient = WebChromeClient()
                        webViewClient = object : WebViewClient() {
                            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                                super.onPageStarted(view, url, favicon)
                                isLoading = true
                                hasError = false
                            }

                            override fun onPageFinished(view: WebView?, url: String?) {
                                super.onPageFinished(view, url)
                                isLoading = false
                            }

                            override fun onReceivedError(
                                view: WebView?,
                                request: WebResourceRequest?,
                                error: WebResourceError?
                            ) {
                                super.onReceivedError(view, request, error)
                                if (request?.isForMainFrame == true) {
                                    if (currentUrl != fallbackAssetUrl) {
                                        currentUrl = fallbackAssetUrl
                                        view?.loadUrl(fallbackAssetUrl)
                                    } else {
                                        hasError = true
                                        isLoading = false
                                    }
                                }
                            }
                        }

                        webViewRef = this
                        loadUrl(currentUrl)
                    }
                },
                update = { webView ->
                    webViewRef = webView
                },
                modifier = Modifier.fillMaxSize()
            )

            // Full-Screen Native Splash Overlay
            AnimatedVisibility(
                visible = isLoading,
                exit = fadeOut(animationSpec = tween(durationMillis = 400))
            ) {
                TalkMeSplashOverlay()
            }

            // Error Screen
            if (hasError) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color(0xFF1E1B4B))
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        Text(
                            text = "⚠️ TalkMe Yuklanmadi",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        )
                        Text(
                            text = "Dasturni qayta yuklash uchun tugmani bosing.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = Color(0xFFA5B4FC),
                            textAlign = TextAlign.Center
                        )
                        IconButton(
                            onClick = {
                                hasError = false
                                isLoading = true
                                currentUrl = fallbackAssetUrl
                                webViewRef?.loadUrl(fallbackAssetUrl)
                            },
                            modifier = Modifier
                                .clip(RoundedCornerShape(14.dp))
                                .background(TalkMeColors.SuccessGreen)
                                .padding(horizontal = 24.dp, vertical = 10.dp)
                        ) {
                            Text(
                                text = "Qayta urinish 🔄",
                                color = Color.White,
                                style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold)
                            )
                        }
                    }
                }
            }
        }
    }
}

/**
 * Premium Full-Screen Splash Screen Overlay
 * Displays while the web application bundle is initializing.
 */
@Composable
private fun TalkMeSplashOverlay() {
    val infiniteTransition = rememberInfiniteTransition(label = "SplashPulse")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 0.95f,
        targetValue = 1.05f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "LogoPulseScale"
    )

    val backgroundGradient = Brush.verticalGradient(
        colors = listOf(
            Color(0xFF1E1B4B), // Indigo950
            Color(0xFF4F46E5), // Indigo600
            Color(0xFF5E4B8B)  // Brand Purple
        )
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(backgroundGradient),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.padding(32.dp)
        ) {
            // Animated Glowing Brand Icon Container
            Box(
                modifier = Modifier
                    .scale(pulseScale)
                    .size(100.dp)
                    .clip(CircleShape)
                    .background(Color.White)
                    .padding(16.dp),
                contentAlignment = Alignment.Center
            ) {
                // Speech Bubble & Soundwave Icon Graphic
                Row(
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(width = 6.dp, height = 24.dp)
                            .clip(RoundedCornerShape(3.dp))
                            .background(TalkMeColors.SuccessGreen)
                    )
                    Box(
                        modifier = Modifier
                            .size(width = 6.dp, height = 40.dp)
                            .clip(RoundedCornerShape(3.dp))
                            .background(TalkMeColors.BrandPurple)
                    )
                    Box(
                        modifier = Modifier
                            .size(width = 6.dp, height = 50.dp)
                            .clip(RoundedCornerShape(3.dp))
                            .background(TalkMeColors.SuccessGreen)
                    )
                    Box(
                        modifier = Modifier
                            .size(width = 6.dp, height = 40.dp)
                            .clip(RoundedCornerShape(3.dp))
                            .background(TalkMeColors.BrandPurple)
                    )
                    Box(
                        modifier = Modifier
                            .size(width = 6.dp, height = 24.dp)
                            .clip(RoundedCornerShape(3.dp))
                            .background(TalkMeColors.SuccessGreen)
                    )
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            // App Brand Name
            Text(
                text = "TalkMe",
                style = MaterialTheme.typography.headlineLarge.copy(
                    fontWeight = FontWeight.ExtraBold,
                    fontSize = 36.sp,
                    color = Color.White
                )
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Subtitle Tagline
            Text(
                text = "AI Powered Language Companion",
                style = MaterialTheme.typography.bodyMedium.copy(
                    fontWeight = FontWeight.Medium,
                    color = Color(0xFFC7D2FE),
                    letterSpacing = 0.5.sp
                )
            )

            Spacer(modifier = Modifier.height(48.dp))

            // Loading Indicator
            CircularProgressIndicator(
                modifier = Modifier.size(36.dp),
                color = TalkMeColors.SuccessGreen,
                strokeWidth = 3.dp
            )
        }
    }
}
