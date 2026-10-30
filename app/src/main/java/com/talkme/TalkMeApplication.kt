package com.talkme

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

/**
 * Application entry point for TalkMe configured with Dagger Hilt Dependency Injection.
 */
@HiltAndroidApp
class TalkMeApplication : Application()
