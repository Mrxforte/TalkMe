package com.talkme.presentation.screens.webview

import android.annotation.SuppressLint
import android.graphics.Bitmap
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import com.talkme.ui.theme.TalkMeColors

/**
 * Clean 100% Full-Screen Android Native WebView Container for TalkMe.
 *
 * Runs the TalkMe web application with:
 * - Full JavaScript, DOM Storage, LocalStorage & WebGL/HTML5 Audio support
 * - Automatic host loopback resolution (`http://10.0.2.2:3000` for Android Emulator)
 * - Automatic fallback to embedded assets (`file:///android_asset/dist/index.html`)
 * - No top URL control bar or header (pure full-screen experience)
 */
@Suppress("DEPRECATION")
@SuppressLint("SetJavaScriptEnabled")
@Composable
fun TalkMeWebViewScreen(
    initialUrl: String = "http://10.0.2.2:3000",
    modifier: Modifier = Modifier
) {
    var currentUrl by remember { mutableStateOf(initialUrl) }
    var isLoading by remember { mutableStateOf(true) }
    var hasError by remember { mutableStateOf(false) }
    var webViewRef by remember { mutableStateOf<WebView?>(null) }

    val fallbackAssetUrl = "file:///android_asset/dist/index.html"

    Scaffold(
        modifier = modifier.fillMaxSize(),
        containerColor = Color.Black
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
                                        // Auto-fallback to embedded offline assets!
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

            if (isLoading) {
                Box(
                    modifier = Modifier
                        .align(Alignment.TopCenter)
                        .padding(top = 16.dp)
                        .clip(RoundedCornerShape(20.dp))
                        .background(Color.White.copy(alpha = 0.9f))
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(18.dp),
                            color = TalkMeColors.PrimaryPurple,
                            strokeWidth = 2.dp
                        )
                        Text(
                            text = "TalkMe yuklanmoqda...",
                            style = MaterialTheme.typography.labelMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = TalkMeColors.PrimaryPurple
                            )
                        )
                    }
                }
            }

            if (hasError) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color.White)
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Text(
                            text = "⚠️ TalkMe Yuklanmadi",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = Color.Red
                            )
                        )
                        Text(
                            text = "Server holatini tekshiring yoki qayta urinib ko'ring.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = TalkMeColors.TextSecondary,
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
                                .clip(RoundedCornerShape(12.dp))
                                .background(TalkMeColors.PrimaryPurple)
                                .padding(horizontal = 16.dp, vertical = 8.dp)
                        ) {
                            Text(
                                text = "Qayta urinish 🔄",
                                color = Color.White,
                                style = MaterialTheme.typography.labelLarge
                            )
                        }
                    }
                }
            }
        }
    }
}
