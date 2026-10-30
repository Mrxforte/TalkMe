package com.talkme.domain.greeting

import java.time.LocalTime
import javax.inject.Inject
import javax.inject.Singleton

enum class TimeOfDayPeriod {
    MORNING,
    DAYTIME,
    EVENING
}

enum class GreetingTopicContext {
    GENERAL,
    LETTERS,
    WORDS_SPELLING
}

data class DynamicGreetingModel(
    val period: TimeOfDayPeriod,
    val headline: String,
    val subline: String,
    val fullMessage: String,
    val usedProfileName: Boolean
)

@Singleton
class DynamicGreetingUseCase @Inject constructor() {

    private val sessionGreetingCache = mutableMapOf<String, DynamicGreetingModel>()

    fun resolvePeriod(localHour: Int = LocalTime.now().hour): TimeOfDayPeriod {
        val hour = ((localHour % 24) + 24) % 24
        return when (hour) {
            in 5..11 -> TimeOfDayPeriod.MORNING
            in 12..17 -> TimeOfDayPeriod.DAYTIME
            else -> TimeOfDayPeriod.EVENING
        }
    }

    fun normalizeProfileName(rawName: String?): String? {
        val trimmed = rawName?.trim()
        return if (trimmed.isNullOrEmpty()) null else trimmed
    }

    fun buildGreeting(
        interfaceLanguageCode: String,
        profileName: String? = null,
        localHour: Int = LocalTime.now().hour,
        isFirstVisit: Boolean = false,
        topicContext: GreetingTopicContext = GreetingTopicContext.GENERAL
    ): DynamicGreetingModel {
        val period = resolvePeriod(localHour)
        val cleanName = normalizeProfileName(profileName)
        val lang = interfaceLanguageCode.lowercase()

        if (isFirstVisit) {
            val headline = when (lang) {
                "ru" -> if (cleanName != null) "Добро пожаловать в TalkMe, $cleanName!" else "Добро пожаловать в TalkMe!"
                "en" -> if (cleanName != null) "Welcome to TalkMe, $cleanName!" else "Welcome to TalkMe!"
                else -> if (cleanName != null) "TalkMe’ga xush kelibsiz, $cleanName!" else "TalkMe’ga xush kelibsiz!"
            }
            val subline = when (lang) {
                "ru" -> "Сегодня мы легко выучим новые буквы и слова через игры!"
                "en" -> "Today we will learn letters and words through interactive games!"
                else -> "Bugun yangi harf va so‘zlarni oson o‘yinlar orqali o‘rganamiz!"
            }
            return DynamicGreetingModel(
                period = period,
                headline = headline,
                subline = subline,
                fullMessage = "$headline $subline",
                usedProfileName = cleanName != null
            )
        }

        val headline = when (lang) {
            "ru" -> when (period) {
                TimeOfDayPeriod.MORNING -> if (cleanName != null) "Доброе утро, $cleanName!" else "Доброе утро!"
                TimeOfDayPeriod.DAYTIME -> if (cleanName != null) "Добрый день, $cleanName!" else "Добрый день!"
                TimeOfDayPeriod.EVENING -> if (cleanName != null) "Добрый вечер, $cleanName!" else "Добрый вечер!"
            }
            "en" -> when (period) {
                TimeOfDayPeriod.MORNING -> if (cleanName != null) "Good morning, $cleanName!" else "Good morning!"
                TimeOfDayPeriod.DAYTIME -> if (cleanName != null) "Good afternoon, $cleanName!" else "Good afternoon!"
                TimeOfDayPeriod.EVENING -> if (cleanName != null) "Good evening, $cleanName!" else "Good evening!"
            }
            else -> when (period) {
                TimeOfDayPeriod.MORNING -> if (cleanName != null) "Xayrli tong, $cleanName!" else "Xayrli tong!"
                TimeOfDayPeriod.DAYTIME -> if (cleanName != null) "Xayrli kun, $cleanName!" else "Xayrli kun!"
                TimeOfDayPeriod.EVENING -> if (cleanName != null) "Xayrli kech, $cleanName!" else "Xayrli kech!"
            }
        }

        val subline = when (lang) {
            "ru" -> when (topicContext) {
                GreetingTopicContext.WORDS_SPELLING -> "Сегодня мы выучим новые слова!"
                else -> when (period) {
                    TimeOfDayPeriod.MORNING -> "Сегодня мы выучим новые буквы."
                    TimeOfDayPeriod.DAYTIME -> "Готовы к новому уроку?"
                    TimeOfDayPeriod.EVENING -> "Давайте поучимся вместе и сегодня."
                }
            }
            "en" -> when (topicContext) {
                GreetingTopicContext.WORDS_SPELLING -> "Today we will learn new words!"
                else -> when (period) {
                    TimeOfDayPeriod.MORNING -> "Today we will learn new letters."
                    TimeOfDayPeriod.DAYTIME -> "Are you ready for a new lesson?"
                    TimeOfDayPeriod.EVENING -> "Let's learn together tonight."
                }
            }
            else -> when (topicContext) {
                GreetingTopicContext.WORDS_SPELLING -> when (period) {
                    TimeOfDayPeriod.MORNING -> "Bugun yangi so‘zlarni o‘rganamiz."
                    TimeOfDayPeriod.DAYTIME -> "Bugun harflardan so‘z tuzishni o‘rganamiz!"
                    TimeOfDayPeriod.EVENING -> "Keling, birga so‘zlarni o‘rganamiz."
                }
                else -> when (period) {
                    TimeOfDayPeriod.MORNING -> "Bugun yangi harflarni o‘rganamiz."
                    TimeOfDayPeriod.DAYTIME -> "Yangi darsga tayyormisiz?"
                    TimeOfDayPeriod.EVENING -> "Keling, bugun ham birga o‘rganamiz."
                }
            }
        }

        return DynamicGreetingModel(
            period = period,
            headline = headline,
            subline = subline,
            fullMessage = "$headline $subline",
            usedProfileName = cleanName != null
        )
    }

    fun getOrCreateSessionLessonGreeting(
        lessonId: String,
        interfaceLanguageCode: String,
        profileName: String?,
        topicContext: GreetingTopicContext
    ): DynamicGreetingModel {
        val key = "$lessonId::$interfaceLanguageCode::${normalizeProfileName(profileName) ?: "anon"}"
        return sessionGreetingCache.getOrPut(key) {
            buildGreeting(
                interfaceLanguageCode = interfaceLanguageCode,
                profileName = profileName,
                topicContext = topicContext
            )
        }
    }
}
