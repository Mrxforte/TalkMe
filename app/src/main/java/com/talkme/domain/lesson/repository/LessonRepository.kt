package com.talkme.domain.lesson.repository

import com.talkme.domain.lesson.model.LessonPlan

/**
 * Repository contract for retrieving structured, versioned TalkMe [LessonPlan] instances.
 */
interface LessonRepository {
    /**
     * Retrieves the [LessonPlan] matching the given [courseId] and [lessonId].
     */
    fun getLessonPlan(courseId: String, lessonId: String): LessonPlan

    /**
     * Returns all featured lessons available in the curriculum.
     */
    fun getAllLessons(): List<LessonPlan>
}
