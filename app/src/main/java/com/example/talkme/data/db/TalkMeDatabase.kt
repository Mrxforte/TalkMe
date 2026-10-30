package com.example.talkme.data.db

import androidx.room.Database
import androidx.room.RoomDatabase
import com.example.talkme.data.db.dao.FsrsDao
import com.example.talkme.data.db.entity.FsrsCardEntity
import com.example.talkme.data.db.entity.FsrsReviewLogEntity
import com.example.talkme.data.db.entity.FsrsVocabularyEntity

/**
 * Room SQLite Database for TalkMe application FSRS Spaced Repetition cards, logs, and vocabulary.
 */
@Database(
    entities = [
        FsrsCardEntity::class,
        FsrsVocabularyEntity::class,
        FsrsReviewLogEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class TalkMeDatabase : RoomDatabase() {
    abstract fun fsrsDao(): FsrsDao
}
