package com.example.talkme.presentation.screens.repeat

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.talkme.domain.fsrs.FsrsDailyStats
import com.example.talkme.domain.fsrs.FsrsVocabularyItem
import com.example.talkme.domain.fsrs.Rating
import com.example.talkme.domain.repository.FsrsRepository
import com.example.talkme.domain.usecase.GetDueVocabularyUseCase
import com.example.talkme.domain.usecase.SpeakTextUseCase
import com.example.talkme.domain.usecase.SubmitFsrsReviewUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * UI State for the FSRS Spaced Repetition Vocabulary Review Screen.
 */
data class RepeatUiState(
    val isLoading: Boolean = true,
    val dueItems: List<FsrsVocabularyItem> = emptyList(),
    val currentIndex: Int = 0,
    val isAnswerRevealed: Boolean = false,
    val isFinished: Boolean = false,
    val lastRatingSubmitted: Rating? = null
) {
    val currentItem: FsrsVocabularyItem?
        get() = dueItems.getOrNull(currentIndex)
}

/**
 * ViewModel managing FSRS Spaced Repetition Flashcard Review Session and Dashboard Analytics.
 */
@HiltViewModel
class RepeatViewModel @Inject constructor(
    private val getDueVocabularyUseCase: GetDueVocabularyUseCase,
    private val submitFsrsReviewUseCase: SubmitFsrsReviewUseCase,
    private val fsrsRepository: FsrsRepository,
    private val speakTextUseCase: SpeakTextUseCase,
) : ViewModel() {

    private val _uiState = MutableStateFlow(RepeatUiState())
    val uiState: StateFlow<RepeatUiState> = _uiState.asStateFlow()

    val dailyStats: StateFlow<FsrsDailyStats> = fsrsRepository.getDailyStatsFlow()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = FsrsDailyStats()
        )

    init {
        loadDueVocabulary()
    }

    fun loadDueVocabulary() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            val items = getDueVocabularyUseCase()
            _uiState.value = RepeatUiState(
                isLoading = false,
                dueItems = items,
                currentIndex = 0,
                isAnswerRevealed = false,
                isFinished = items.isEmpty()
            )
        }
    }

    fun revealAnswer() {
        _uiState.value = _uiState.value.copy(isAnswerRevealed = true)
        val currentItem = _uiState.value.currentItem
        if (currentItem != null) {
            speakTextUseCase(currentItem.word)
        }
    }

    fun submitRating(rating: Rating) {
        val currentState = _uiState.value
        val currentItem = currentState.currentItem ?: return

        viewModelScope.launch {
            submitFsrsReviewUseCase(currentItem.card, rating)

            val nextIndex = currentState.currentIndex + 1
            val isFinished = nextIndex >= currentState.dueItems.size

            _uiState.value = currentState.copy(
                currentIndex = nextIndex,
                isAnswerRevealed = false,
                isFinished = isFinished,
                lastRatingSubmitted = rating
            )
        }
    }

    fun playWordAudio() {
        val currentItem = _uiState.value.currentItem
        if (currentItem != null) {
            speakTextUseCase(currentItem.word)
        }
    }

    override fun onCleared() {
        super.onCleared()
        speakTextUseCase.stop()
    }
}
