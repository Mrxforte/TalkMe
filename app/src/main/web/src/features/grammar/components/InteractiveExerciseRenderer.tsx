import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Volume2,
  ArrowRight,
  Mic,
  Headphones,
  Layers,
} from 'lucide-react';
import { Exercise } from '../types/grammarFrameworkTypes';
import {
  evaluateExerciseSubmission,
  ExerciseEvaluationOutput,
} from '../engine/exerciseEngine';
import { PlayableCrosswordWidget } from './PlayableCrosswordWidget';

interface InteractiveExerciseRendererProps {
  exercise: Exercise;
  exerciseIndex?: number;
  totalExercises?: number;
  isCompleted?: boolean;
  lightTheme?: boolean;
  learnerName?: string;
  onEvaluated: (exercise: Exercise, result: ExerciseEvaluationOutput) => void;
  onPlayAudio?: (text: string, slow?: boolean) => void;
}

export const InteractiveExerciseRenderer: React.FC<InteractiveExerciseRendererProps> = ({
  exercise,
  exerciseIndex,
  totalExercises,
  isCompleted,
  lightTheme = false,
  learnerName = 'Azamat',
  onEvaluated,
  onPlayAudio,
}) => {
  // State for categorization
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

  // State for word ordering (Activity 2: Build a Word - supports wordBuildItems like CAT, DOG, SUN, BOOK)
  const [builtWords, setBuiltWords] = useState<string[]>([]);
  const [activeWordBuildIndex, setActiveWordBuildIndex] = useState<number>(0);
  const [currentTileIndices, setCurrentTileIndices] = useState<number[]>([]);

  // State for matching pairs (Activity 4)
  const [selectedLeftItem, setSelectedLeftItem] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});

  // State for sentence builder (Activity 5)
  const [selectedSentenceTiles, setSelectedSentenceTiles] = useState<number[]>([]);

  // State for multiple choice / error correction / text input / listening
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [hasPlayedListeningAudio, setHasPlayedListeningAudio] = useState<boolean>(false);

  // State for speaking / pronunciation_practice
  const [spokenCompletedIds, setSpokenCompletedIds] = useState<string[]>([]);
  const [listenedPromptIds, setListenedPromptIds] = useState<string[]>([]);
  const [activeRecordingId, setActiveRecordingId] = useState<string | null>(null);
  const [recognizedTranscripts, setRecognizedTranscripts] = useState<Record<string, string>>({});
  const [speechErrorByPrompt, setSpeechErrorByPrompt] = useState<Record<string, string>>({});

  const isSpeechRecognitionSupported = React.useMemo(() => {
    if (typeof window === 'undefined') return false;
    const w = window as unknown as {
      SpeechRecognition?: unknown;
      webkitSpeechRecognition?: unknown;
    };
    return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
  }, []);

  // Evaluation & Hint state
  const [evaluation, setEvaluation] = useState<ExerciseEvaluationOutput | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  const availableCategories = React.useMemo(() => {
    if (exercise.categories && exercise.categories.length > 0) {
      return exercise.categories;
    }
    if (!exercise.categorizationItems) return [];
    const uniqueIds = Array.from(
      new Set(exercise.categorizationItems.map((item) => item.correctCategory))
    );
    return uniqueIds.map((id) => ({ id, labelUz: id }));
  }, [exercise.categories, exercise.categorizationItems]);

  useEffect(() => {
    setCategoryMap({});
    setBuiltWords([]);
    setActiveWordBuildIndex(0);
    setCurrentTileIndices([]);
    setSelectedLeftItem(null);
    setMatchedPairs({});
    setSelectedSentenceTiles([]);
    setSelectedOption('');
    setTextAnswer('');
    setHasPlayedListeningAudio(false);
    setSpokenCompletedIds([]);
    setListenedPromptIds([]);
    setActiveRecordingId(null);
    setRecognizedTranscripts({});
    setSpeechErrorByPrompt({});
    setEvaluation(null);
    setShowHint(false);
  }, [exercise.id]);

  const handleReset = () => {
    setCategoryMap({});
    setBuiltWords([]);
    setActiveWordBuildIndex(0);
    setCurrentTileIndices([]);
    setSelectedLeftItem(null);
    setMatchedPairs({});
    setSelectedSentenceTiles([]);
    setSelectedOption('');
    setTextAnswer('');
    setHasPlayedListeningAudio(false);
    setSpokenCompletedIds([]);
    setListenedPromptIds([]);
    setActiveRecordingId(null);
    setRecognizedTranscripts({});
    setSpeechErrorByPrompt({});
    setEvaluation(null);
  };

  // ==================== CATEGORIZATION HANDLERS ====================
  const assignItemToCategory = (itemId: string, category: string) => {
    const updated = { ...categoryMap, [itemId]: category };
    setCategoryMap(updated);
    setEvaluation(null);
  };

  const handleSubmitCategorization = () => {
    const res = evaluateExerciseSubmission(exercise, {
      categorizedMap: categoryMap,
    });
    setEvaluation(res);
    onEvaluated(exercise, res);
  };

  // ==================== WORD ORDERING (BUILD A WORD) HANDLERS ====================
  const wordBuildItems = exercise.wordBuildItems || [];
  const activeWordBuildItem = wordBuildItems[activeWordBuildIndex] || wordBuildItems[0];

  const handleToggleWordLetterTile = (idx: number) => {
    if (!activeWordBuildItem) return;
    if (currentTileIndices.includes(idx)) {
      setCurrentTileIndices(currentTileIndices.filter((i) => i !== idx));
      return;
    }
    const nextIndices = [...currentTileIndices, idx];
    const candidate = nextIndices
      .map((i) => activeWordBuildItem.scrambledLetters[i] || '')
      .join('')
      .toUpperCase();

    if (candidate === activeWordBuildItem.targetWord.toUpperCase()) {
      const updatedBuilt = Array.from(new Set([...builtWords, candidate]));
      setBuiltWords(updatedBuilt);
      setCurrentTileIndices([]);
      if (onPlayAudio) {
        onPlayAudio(candidate.toLowerCase());
      }
      if (activeWordBuildIndex < wordBuildItems.length - 1) {
        setActiveWordBuildIndex(activeWordBuildIndex + 1);
      }
      if (updatedBuilt.length === wordBuildItems.length) {
        const res = evaluateExerciseSubmission(exercise, {
          builtWordsCompleted: updatedBuilt,
        });
        setEvaluation(res);
        onEvaluated(exercise, res);
      }
    } else {
      setCurrentTileIndices(nextIndices);
    }
  };

  const handleSubmitWordOrdering = () => {
    const res = evaluateExerciseSubmission(exercise, {
      builtWordsCompleted: builtWords,
    });
    setEvaluation(res);
    onEvaluated(exercise, res);
  };

  // ==================== MATCHING PAIRS HANDLERS ====================
  const rightSideOptions = React.useMemo(() => {
    if (!exercise.matchingPairs) return [];
    return exercise.matchingPairs.map((p) => p.rightText);
  }, [exercise.matchingPairs]);

  const handlePairRightClick = (rightVal: string) => {
    if (!selectedLeftItem) return;
    const updated = {
      ...matchedPairs,
      [selectedLeftItem]: rightVal,
    };
    setMatchedPairs(updated);
    setSelectedLeftItem(null);
    setEvaluation(null);
  };

  const handleSubmitMatchingPairs = () => {
    const res = evaluateExerciseSubmission(exercise, {
      matchedPairs,
    });
    setEvaluation(res);
    onEvaluated(exercise, res);
  };

  // ==================== SENTENCE BUILDER HANDLERS ====================
  const shuffledSentenceTiles = exercise.sentenceBuilder?.shuffledTiles || [];

  const handleToggleSentenceTile = (idx: number) => {
    if (selectedSentenceTiles.includes(idx)) {
      setSelectedSentenceTiles(selectedSentenceTiles.filter((i) => i !== idx));
    } else {
      setSelectedSentenceTiles([...selectedSentenceTiles, idx]);
    }
    setEvaluation(null);
  };

  const handleSubmitSentenceBuilder = () => {
    const tokens = selectedSentenceTiles.map((i) => shuffledSentenceTiles[i] || '');
    const res = evaluateExerciseSubmission(exercise, {
      orderedTokens: tokens,
    });
    setEvaluation(res);
    onEvaluated(exercise, res);
  };

  // ==================== SPEAKING / PRONUNCIATION PRACTICE HANDLERS ====================
  const resolvePersonalizedPhrase = (rawPhrase: string, isPersonalized?: boolean) => {
    if (!isPersonalized) return rawPhrase;
    const cleanName = (learnerName || 'Azamat').trim() || 'Azamat';
    return `I am ${cleanName}.`;
  };

  const resolvePersonalizedMeaning = (rawMeaning: string, isPersonalized?: boolean) => {
    if (!isPersonalized) return rawMeaning;
    const cleanName = (learnerName || 'Azamat').trim() || 'Azamat';
    return `Men ${cleanName}man.`;
  };

  const markPromptSpokenAndCheckAll = (promptId: string) => {
    const prompts = exercise.speakingPrompts || [];
    const nextIds = Array.from(new Set([...spokenCompletedIds, promptId]));
    setSpokenCompletedIds(nextIds);
    if (prompts.length > 0 && nextIds.length === prompts.length) {
      const res = evaluateExerciseSubmission(exercise, {
        spokenPhrasesCompleted: nextIds,
      });
      setEvaluation(res);
      onEvaluated(exercise, res);
    }
  };

  const handleStartMicrophoneRecognition = (
    promptId: string,
    expectedPhrase: string
  ) => {
    if (!isSpeechRecognitionSupported) return;
    try {
      const w = window as unknown as {
        SpeechRecognition?: new () => {
          lang: string;
          interimResults: boolean;
          maxAlternatives: number;
          onresult: ((e: { results: { 0: { 0: { transcript: string } } } }) => void) | null;
          onerror: ((e: { error?: string }) => void) | null;
          onend: (() => void) | null;
          start: () => void;
        };
        webkitSpeechRecognition?: new () => {
          lang: string;
          interimResults: boolean;
          maxAlternatives: number;
          onresult: ((e: { results: { 0: { 0: { transcript: string } } } }) => void) | null;
          onerror: ((e: { error?: string }) => void) | null;
          onend: (() => void) | null;
          start: () => void;
        };
      };
      const RecognitionCtor = w.SpeechRecognition || w.webkitSpeechRecognition;
      if (!RecognitionCtor) return;

      const recognition = new RecognitionCtor();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 2;

      setActiveRecordingId(promptId);
      setSpeechErrorByPrompt((prev) => ({ ...prev, [promptId]: '' }));

      recognition.onresult = (event) => {
        const transcript = (event.results?.[0]?.[0]?.transcript || '').trim();
        setRecognizedTranscripts((prev) => ({ ...prev, [promptId]: transcript }));
        setActiveRecordingId(null);

        const cleanExpected = expectedPhrase
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .trim();
        const cleanSpoken = transcript
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .trim();

        const firstExpectedWord = cleanExpected.split(' ')[0] || '';
        if (
          cleanSpoken.length > 0 &&
          (cleanSpoken.includes(firstExpectedWord) ||
            cleanExpected.includes(cleanSpoken) ||
            cleanSpoken.split(' ').some((w) => cleanExpected.includes(w)))
        ) {
          markPromptSpokenAndCheckAll(promptId);
        } else {
          setSpeechErrorByPrompt((prev) => ({
            ...prev,
            [promptId]: `Eshitildi: "${transcript}". Yana bir marta aniqroq aytib ko‘ring yoki eshitib takrorlang!`,
          }));
        }
      };

      recognition.onerror = () => {
        setActiveRecordingId(null);
        setSpeechErrorByPrompt((prev) => ({
          ...prev,
          [promptId]:
            'Mikrofon orqali aniqlab bo‘lmadi. Iltimos, avval audioni eshiting va ovoz chiqarib takrorlang.',
        }));
      };

      recognition.onend = () => {
        setActiveRecordingId(null);
      };

      recognition.start();
    } catch {
      setActiveRecordingId(null);
      setSpeechErrorByPrompt((prev) => ({
        ...prev,
        [promptId]:
          'Brauzerda mikrofon ruxsati yo‘q. Quyidagi "Eshitdim va ovoz chiqarib aytdim" tugmasidan foydalaning.',
      }));
    }
  };

  // ==================== MULTIPLE CHOICE & ERROR CORRECTION HANDLERS ====================
  const handleSubmitStandardAnswer = (overrideAnswer?: string) => {
    const candidate =
      overrideAnswer !== undefined ? overrideAnswer : textAnswer.trim() || selectedOption;
    if (!candidate) return;
    const res = evaluateExerciseSubmission(exercise, {
      selectedOption: candidate,
      textInput: candidate,
    });
    setEvaluation(res);
    onEvaluated(exercise, res);
  };

  const containerCls = lightTheme
    ? 'rounded-3xl bg-white border border-[#EBE8F3] p-5 sm:p-6 shadow-sm space-y-4 text-[#1D1B20]'
    : 'rounded-3xl bg-slate-900/90 border border-slate-800/90 p-4 sm:p-6 shadow-xl space-y-4 text-white';

  return (
    <div className={containerCls}>
      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {exerciseIndex !== undefined && totalExercises !== undefined && (
              <span
                className={
                  lightTheme
                    ? 'font-extrabold text-[#5E4B8B] uppercase tracking-wider'
                    : 'px-2.5 py-0.5 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-extrabold uppercase tracking-wider'
                }
              >
                Mashq {exerciseIndex + 1} / {totalExercises}
              </span>
            )}
            <span className={lightTheme ? 'text-slate-400' : 'hidden'}>·</span>
            <span
              className={
                lightTheme
                  ? 'font-bold text-amber-600'
                  : 'px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold uppercase'
              }
            >
              +{exercise.xpReward} XP
            </span>
            {isCompleted && (
              <span
                className={
                  lightTheme
                    ? 'inline-flex items-center gap-1 font-extrabold text-[#27AE60]'
                    : 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold'
                }
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Bajarilgan
              </span>
            )}
          </div>
          <h3
            className={`text-base sm:text-lg font-extrabold leading-snug ${
              lightTheme ? 'text-[#1D1B20]' : 'text-white'
            }`}
          >
            {exercise.titleUz}
          </h3>
        </div>

        {/* Hide top right audio button on listening_choose so we use the dedicated central listening player without spoiling */}
        {exercise.audioText && onPlayAudio && exercise.type !== 'listening_choose' && (
          <button
            type="button"
            onClick={() => onPlayAudio(exercise.audioText!, false)}
            className={
              lightTheme
                ? 'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F1EDFA] hover:bg-[#5E4B8B] text-[#5E4B8B] hover:text-white text-xs font-extrabold transition shrink-0 cursor-pointer'
                : 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-xs font-bold transition shrink-0'
            }
          >
            <Volume2 className="w-4 h-4" /> Tinglash
          </button>
        )}
      </div>

      {/* Instructions */}
      <p
        className={`text-xs sm:text-sm leading-relaxed ${
          lightTheme ? 'text-[#5A5866]' : 'text-slate-300'
        }`}
      >
        {exercise.instructionsUz}
      </p>

      {/* Optional Prompt Box (for non-listening exercises so listening_choose never reveals text before submission) */}
      {(exercise.promptEn || exercise.promptUz) &&
        exercise.type !== 'listening_choose' &&
        exercise.type !== 'pronunciation_practice' && (
          <div
            className={
              lightTheme
                ? 'rounded-2xl bg-[#F7F5FC] border border-[#E4DDF6] p-4 flex items-center justify-between gap-3'
                : 'rounded-2xl bg-slate-950/90 border border-indigo-500/30 p-3.5 flex items-center justify-between gap-3'
            }
          >
            <div>
              {exercise.promptEn && (
                <p
                  className={`text-base sm:text-lg font-black tracking-wide ${
                    lightTheme ? 'text-[#1D1B20]' : 'text-amber-300'
                  }`}
                >
                  {exercise.promptEn}
                </p>
              )}
              {exercise.promptUz && (
                <p
                  className={`text-xs mt-0.5 ${
                    lightTheme ? 'text-[#5E4B8B] font-semibold' : 'text-slate-400'
                  }`}
                >
                  {exercise.promptUz}
                </p>
              )}
            </div>
            {exercise.audioText && onPlayAudio && (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onPlayAudio(exercise.audioText!, true)}
                  className={
                    lightTheme
                      ? 'px-2.5 py-2 rounded-xl bg-[#FFF4E5] text-amber-800 text-xs font-extrabold hover:bg-amber-200 transition cursor-pointer'
                      : 'px-2.5 py-2 rounded-xl bg-slate-800 text-amber-300 text-xs font-bold hover:bg-slate-700 transition'
                  }
                  title="Sekin eshitish"
                >
                  🐢 Sekin
                </button>
                <button
                  type="button"
                  onClick={() => onPlayAudio(exercise.audioText!, false)}
                  className={
                    lightTheme
                      ? 'p-2.5 rounded-xl bg-[#5E4B8B] text-white hover:bg-[#4B3B72] transition cursor-pointer shadow-xs'
                      : 'p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 hover:bg-indigo-500/30 transition'
                  }
                  title="Audio eshitish"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

      {/* ==================== 1. CATEGORIZATION EXERCISE ==================== */}
      {exercise.type === 'categorization' && exercise.categorizationItems && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {exercise.categorizationItems.map((item) => {
              const assigned = categoryMap[item.id];
              const isEvaluatedCorrect = evaluation && assigned === item.correctCategory;
              const isEvaluatedWrong = evaluation && assigned !== item.correctCategory;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl p-3.5 border transition-all flex flex-col justify-between gap-2.5 ${
                    isEvaluatedCorrect
                      ? 'bg-emerald-950/30 border-emerald-500/50'
                      : isEvaluatedWrong
                      ? 'bg-rose-950/30 border-rose-500/50'
                      : assigned
                      ? 'bg-indigo-950/40 border-indigo-500/40'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-sm sm:text-base font-extrabold text-white">
                        {item.label}
                      </span>
                      {item.sublabelUz && (
                        <p className="text-xs text-slate-400 mt-0.5">{item.sublabelUz}</p>
                      )}
                    </div>
                    {item.audioText && onPlayAudio && (
                      <button
                        type="button"
                        onClick={() => onPlayAudio(item.audioText!)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-500/30 text-indigo-300 transition"
                        title="Eshitish"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {availableCategories.map((cat) => {
                      const active = assigned === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => assignItemToCategory(item.id, cat.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                            active
                              ? 'bg-indigo-500 border-indigo-300 text-white'
                              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                          }`}
                        >
                          <Layers className="w-3 h-3 inline mr-1" />
                          {cat.labelUz}
                        </button>
                      );
                    })}
                  </div>

                  {evaluation && item.explanationUz && (
                    <p className="text-[11px] text-emerald-300/90 border-t border-slate-800 pt-1.5">
                      {item.explanationUz}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400">
              Belgilandi: {Object.keys(categoryMap).length} / {exercise.categorizationItems.length}
            </span>
            <button
              type="button"
              onClick={handleSubmitCategorization}
              disabled={Object.keys(categoryMap).length < exercise.categorizationItems.length}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 disabled:opacity-40 text-white text-xs sm:text-sm font-extrabold shadow-lg transition"
            >
              Javoblarni tekshirish
            </button>
          </div>
        </div>
      )}

      {/* ==================== 2. WORD ORDERING (BUILD A WORD) ==================== */}
      {exercise.type === 'word_ordering' && wordBuildItems.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {wordBuildItems.map((wb, idx) => {
              const isBuilt = builtWords.includes(wb.targetWord.toUpperCase());
              const isCurrent = idx === activeWordBuildIndex;
              return (
                <button
                  key={wb.id}
                  type="button"
                  onClick={() => {
                    setActiveWordBuildIndex(idx);
                    setCurrentTileIndices([]);
                  }}
                  className={`rounded-2xl p-3 border text-center transition-all ${
                    isBuilt
                      ? 'bg-emerald-950/40 border-emerald-400/50 text-emerald-200'
                      : isCurrent
                      ? 'bg-indigo-950/50 border-indigo-400 text-white'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                    {idx + 1}. {wb.meaningUz}
                  </div>
                  <div className="text-base font-black tracking-widest mt-1">
                    {isBuilt ? wb.targetWord : '_ '.repeat(wb.targetWord.length)}
                  </div>
                </button>
              );
            })}
          </div>

          {activeWordBuildItem && (
            <div className="rounded-2xl bg-slate-950/90 border border-indigo-500/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300">
                  Ma’nosi: <strong className="text-white">{activeWordBuildItem.meaningUz}</strong> (
                  {activeWordBuildItem.targetWord.length} ta harf)
                </span>
                {currentTileIndices.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentTileIndices([])}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Tozalash
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2 justify-center py-1">
                {activeWordBuildItem.scrambledLetters.map((letter, idx) => {
                  const isUsed = currentTileIndices.includes(idx);
                  return (
                    <button
                      key={`${letter}-${idx}`}
                      type="button"
                      onClick={() => handleToggleWordLetterTile(idx)}
                      className={`w-12 h-12 rounded-xl font-black text-lg border-2 transition-all ${
                        isUsed
                          ? 'bg-amber-500/30 border-amber-400 text-amber-200 scale-95'
                          : 'bg-slate-800 border-slate-700 text-white hover:border-indigo-400'
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmitWordOrdering}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 text-white text-xs sm:text-sm font-extrabold shadow-lg transition"
            >
              So‘zlarni tekshirish ({builtWords.length}/{wordBuildItems.length})
            </button>
          </div>
        </div>
      )}

      {/* ==================== 3. MATCHING PAIRS ==================== */}
      {exercise.type === 'matching_pairs' && exercise.matchingPairs && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                1. So‘zni tanlang:
              </div>
              {exercise.matchingPairs.map((pair) => {
                const isSelected = selectedLeftItem === pair.leftText;
                const matchedRight = matchedPairs[pair.leftText];
                return (
                  <button
                    key={pair.id}
                    type="button"
                    onClick={() => setSelectedLeftItem(pair.leftText)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                        : matchedRight
                        ? 'bg-indigo-950/50 border-indigo-400/50 text-white'
                        : 'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="font-extrabold text-sm block">{pair.leftText}</span>
                      {pair.leftSubtext && (
                        <span className="text-[11px] text-slate-400">{pair.leftSubtext}</span>
                      )}
                    </div>
                    {matchedRight && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200 font-bold">
                        → {matchedRight}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                2. So‘z turkumini bosing:
              </div>
              {rightSideOptions.map((rightVal) => (
                <button
                  key={rightVal}
                  type="button"
                  onClick={() => handlePairRightClick(rightVal)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedLeftItem
                      ? 'bg-slate-800/90 border-indigo-400/50 text-white hover:bg-indigo-600/30'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="font-bold text-xs sm:text-sm">{rightVal}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Juftlandi: {Object.keys(matchedPairs).length} / {exercise.matchingPairs.length}
            </span>
            <button
              type="button"
              onClick={handleSubmitMatchingPairs}
              disabled={Object.keys(matchedPairs).length < exercise.matchingPairs.length}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 disabled:opacity-40 text-white text-xs sm:text-sm font-extrabold shadow-lg transition"
            >
              Juftliklarni tekshirish
            </button>
          </div>
        </div>
      )}

      {/* ==================== 4. SENTENCE BUILDER ==================== */}
      {exercise.type === 'sentence_builder' && exercise.sentenceBuilder && (
        <div className="space-y-4">
          <div className="min-h-[60px] rounded-2xl bg-slate-950/90 border-2 border-dashed border-indigo-500/40 p-3.5 flex flex-wrap items-center gap-2">
            {selectedSentenceTiles.length === 0 ? (
              <span className="text-xs text-slate-500">
                Gap tuzish uchun quyidagi bo‘laklarni tartib bilan bosing...
              </span>
            ) : (
              selectedSentenceTiles.map((tileIdx, pos) => (
                <button
                  key={`assembled-${tileIdx}-${pos}`}
                  type="button"
                  onClick={() => handleToggleSentenceTile(tileIdx)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-extrabold text-sm shadow-md hover:bg-rose-600 transition"
                >
                  {shuffledSentenceTiles[tileIdx]}
                </button>
              ))
            )}
          </div>

          <div className="flex flex-wrap gap-2.5">
            {shuffledSentenceTiles.map((tile, idx) => {
              const used = selectedSentenceTiles.includes(idx);
              return (
                <button
                  key={`tile-${idx}`}
                  type="button"
                  disabled={used}
                  onClick={() => handleToggleSentenceTile(idx)}
                  className={`px-4 py-2.5 rounded-xl font-extrabold text-sm border transition-all ${
                    used
                      ? 'bg-slate-900 border-slate-800 text-slate-600 opacity-40'
                      : 'bg-slate-800 border-slate-700 text-white hover:border-indigo-400 hover:bg-slate-700'
                  }`}
                >
                  {tile}
                </button>
              );
            })}
          </div>

          {evaluation?.isCorrect && exercise.sentenceBuilder.roleBreakdown && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {exercise.sentenceBuilder.roleBreakdown.map((rb) => (
                <div
                  key={rb.part}
                  className="rounded-xl bg-emerald-500/15 border border-emerald-400/40 p-2.5 text-center"
                >
                  <div className="text-[10px] font-black text-emerald-300 uppercase">
                    {rb.roleNameUz}
                  </div>
                  <div className="text-sm font-extrabold text-white mt-0.5">{rb.part}</div>
                  <div className="text-[10px] text-slate-300">{rb.questionUz}</div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmitSentenceBuilder}
              disabled={selectedSentenceTiles.length === 0}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 disabled:opacity-40 text-white text-xs sm:text-sm font-extrabold shadow-lg transition"
            >
              Gapni tekshirish
            </button>
          </div>
        </div>
      )}

      {/* ==================== 5. ERROR CORRECTION / MULTIPLE CHOICE ==================== */}
      {(exercise.type === 'error_correction' ||
        exercise.type === 'multiple_choice' ||
        exercise.type === 'fill_in_blank' ||
        exercise.type === 'true_false') && (
        <div className="space-y-3">
          {exercise.type === 'error_correction' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 block">
                To‘g‘rilangan gapni yozing yoki quyidagi variantlardan tanlang:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={textAnswer}
                  onChange={(e) => {
                    setTextAnswer(e.target.value);
                    setSelectedOption('');
                    setEvaluation(null);
                  }}
                  placeholder="Masalan: I am a student."
                  className="flex-1 rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-400 outline-none"
                />
              </div>
            </div>
          )}

          {exercise.options && (
            <div className="grid grid-cols-1 gap-2.5">
              {exercise.options.map((opt) => {
                const isSelected = selectedOption === opt || textAnswer === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setSelectedOption(opt);
                      setTextAnswer(opt);
                      handleSubmitStandardAnswer(opt);
                    }}
                    className={`w-full text-left p-4 rounded-2xl border text-sm sm:text-base font-bold transition-all flex items-center justify-between gap-3 ${
                      lightTheme
                        ? isSelected
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-950 shadow-sm ring-2 ring-indigo-500/20'
                          : 'bg-slate-50/90 border-slate-200 text-slate-800 hover:bg-white hover:border-indigo-300'
                        : isSelected
                        ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-md'
                        : 'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span>{opt}</span>
                    <ArrowRight
                      className={`w-4 h-4 shrink-0 ${
                        lightTheme ? 'text-indigo-500' : 'text-slate-400'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          )}

          {exercise.type === 'error_correction' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => handleSubmitStandardAnswer()}
                disabled={!textAnswer.trim() && !selectedOption}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 disabled:opacity-40 text-white text-xs sm:text-sm font-extrabold shadow-lg transition"
              >
                Tekshirish
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================== 5B. LISTENING CHOOSE ==================== */}
      {exercise.type === 'listening_choose' && (
        <div className="space-y-4">
          <div
            className={`rounded-3xl p-5 border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              lightTheme
                ? 'bg-indigo-50/80 border-indigo-200'
                : 'bg-indigo-950/40 border-indigo-500/30'
            }`}
          >
            <div className="space-y-1 text-center sm:text-left">
              <span
                className={`text-xs font-extrabold uppercase tracking-wider block ${
                  lightTheme ? 'text-indigo-700' : 'text-indigo-300'
                }`}
              >
                🎧 Ovozni eshiting
              </span>
              <p
                className={`text-sm font-semibold ${
                  lightTheme ? 'text-slate-700' : 'text-slate-200'
                }`}
              >
                {hasPlayedListeningAudio
                  ? 'Eshitgan iborangizni quyidan tanlang. Xohlasangiz qayta eshitishingiz mumkin!'
                  : 'Avval tugmani bosib inglizcha so‘zni eshiting:'}
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const audioTarget =
                    exercise.audioText || exercise.acceptedAnswers[0] || 'Hello';
                  setHasPlayedListeningAudio(true);
                  onPlayAudio?.(audioTarget, false);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-extrabold shadow-md transition active:scale-95"
              >
                <Volume2 className="w-5 h-5" />
                {hasPlayedListeningAudio ? 'Qayta eshitish' : 'Ovozni eshitish'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const audioTarget =
                    exercise.audioText || exercise.acceptedAnswers[0] || 'Hello';
                  setHasPlayedListeningAudio(true);
                  onPlayAudio?.(audioTarget, true);
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-3 rounded-2xl border text-xs font-extrabold transition ${
                  lightTheme
                    ? 'bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50'
                    : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                }`}
                title="Sekinroq eshitish"
              >
                🐢 Sekin
              </button>
            </div>
          </div>

          {exercise.options && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {exercise.options.map((opt) => {
                const isSelected = selectedOption === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setSelectedOption(opt);
                      setTextAnswer(opt);
                      handleSubmitStandardAnswer(opt);
                    }}
                    className={`p-4 rounded-2xl border text-center text-base font-extrabold transition-all ${
                      lightTheme
                        ? isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-400 hover:bg-indigo-50/40'
                        : isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                        : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==================== 5C. PRONUNCIATION / SPEAKING PRACTICE ==================== */}
      {exercise.type === 'pronunciation_practice' && exercise.speakingPrompts && (
        <div className="space-y-4">
          {!isSpeechRecognitionSupported && (
            <div
              className={`rounded-2xl p-3.5 border text-xs leading-relaxed ${
                lightTheme
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-amber-950/40 border-amber-500/30 text-amber-200'
              }`}
            >
              <strong>Eslatma:</strong> Brauzeringizda avtomatik mikrofon aniqlash mavjud emas.
              Har bir iborani eshiting, ovoz chiqarib qaytaring va{' '}
              <strong>«Eshitdim va ovoz chiqarib aytdim»</strong> tugmasini bosing.
            </div>
          )}

          <div className="space-y-3">
            {exercise.speakingPrompts.map((item, idx) => {
              const resolvedPhrase = resolvePersonalizedPhrase(
                item.phraseEn,
                item.isPersonalizedName
              );
              const resolvedMeaning = resolvePersonalizedMeaning(
                item.meaningUz,
                item.isPersonalizedName
              );
              const isDone = spokenCompletedIds.includes(item.id);
              const isRecordingThis = activeRecordingId === item.id;
              const transcript = recognizedTranscripts[item.id];
              const promptError = speechErrorByPrompt[item.id];

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl p-4 border transition-all ${
                    lightTheme
                      ? isDone
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-slate-50 border-slate-200'
                      : isDone
                      ? 'bg-emerald-950/30 border-emerald-500/40'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : lightTheme
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </span>
                        <span
                          className={`text-lg font-black ${
                            lightTheme ? 'text-slate-900' : 'text-white'
                          }`}
                        >
                          {resolvedPhrase}
                        </span>
                      </div>
                      <p
                        className={`text-xs font-semibold pl-8 ${
                          lightTheme ? 'text-slate-600' : 'text-slate-400'
                        }`}
                      >
                        Ma’nosi: {resolvedMeaning}
                      </p>
                      {transcript && (
                        <p
                          className={`text-xs font-bold pl-8 ${
                            lightTheme ? 'text-emerald-700' : 'text-emerald-300'
                          }`}
                        >
                          Siz aytdingiz: “{transcript}”
                        </p>
                      )}
                      {promptError && (
                        <p
                          className={`text-xs font-bold pl-8 ${
                            lightTheme ? 'text-amber-800' : 'text-amber-300'
                          }`}
                        >
                          {promptError}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pl-8 sm:pl-0">
                      <button
                        type="button"
                        onClick={() => {
                          setListenedPromptIds((prev) =>
                            Array.from(new Set([...prev, item.id]))
                          );
                          onPlayAudio?.(resolvedPhrase, false);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold border transition ${
                          lightTheme
                            ? 'bg-white border-slate-200 text-indigo-700 hover:bg-indigo-50'
                            : 'bg-slate-900 border-slate-700 text-indigo-300 hover:bg-slate-800'
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                        1. Tinglash
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setListenedPromptIds((prev) =>
                            Array.from(new Set([...prev, item.id]))
                          );
                          onPlayAudio?.(resolvedPhrase, true);
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold border transition ${
                          lightTheme
                            ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                            : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                        title="Sekin eshitish"
                      >
                        🐢
                      </button>

                      {isSpeechRecognitionSupported && (
                        <button
                          type="button"
                          onClick={() =>
                            handleStartMicrophoneRecognition(item.id, resolvedPhrase)
                          }
                          disabled={isRecordingThis}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition ${
                            isRecordingThis
                              ? 'bg-rose-600 text-white animate-pulse'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                          }`}
                        >
                          🎤 {isRecordingThis ? 'Eshitilmoqda...' : '2. Mikrofon bilan aytish'}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (!listenedPromptIds.includes(item.id)) {
                            onPlayAudio?.(resolvedPhrase, false);
                            setListenedPromptIds((prev) =>
                              Array.from(new Set([...prev, item.id]))
                            );
                          }
                          markPromptSpokenAndCheckAll(item.id);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold border transition ${
                          isDone
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : lightTheme
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                            : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200 hover:bg-emerald-900/50'
                        }`}
                      >
                        {isDone ? '✓ Aytildi' : 'Eshitdim va ovoz chiqarib aytdim'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== 6. PLAYABLE 2D CROSSWORD ==================== */}
      {exercise.type === 'crossword' && exercise.crossword && (
        <PlayableCrosswordWidget
          crossword={exercise.crossword}
          onPlayAudio={onPlayAudio}
          onComplete={(gridValues) => {
            const res = evaluateExerciseSubmission(exercise, {
              crosswordCells: gridValues,
            });
            setEvaluation(res);
            onEvaluated(exercise, res);
          }}
        />
      )}

      {/* Footer Actions: Hint + Reset */}
      {exercise.type !== 'crossword' && (
        <div
          className={`flex flex-wrap items-center justify-between gap-2 pt-2 border-t ${
            lightTheme ? 'border-slate-200' : 'border-slate-800/80'
          }`}
        >
          <div className="flex items-center gap-2">
            {exercise.hintUz && (
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                  lightTheme
                    ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                    : 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                {showHint ? 'Yordamni yashirish' : 'Yordam (Hint)'}
              </button>
            )}
            <button
              type="button"
              onClick={handleReset}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                lightTheme
                  ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Qayta boshlash
            </button>
          </div>
        </div>
      )}

      {showHint && exercise.hintUz && (
        <div
          className={`rounded-2xl p-3.5 text-xs leading-relaxed border ${
            lightTheme
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
          }`}
        >
          <strong className="font-extrabold block mb-0.5">💡 Maslahat (Hint):</strong>
          {exercise.hintUz}
        </div>
      )}

      {evaluation && (
        <div
          className={`rounded-2xl p-4 border transition-all ${
            evaluation.isCorrect
              ? lightTheme
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-emerald-950/50 border-emerald-500/50 text-emerald-100'
              : lightTheme
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : 'bg-rose-950/50 border-rose-500/50 text-rose-100'
          }`}
        >
          <div className="flex items-start gap-3">
            {evaluation.isCorrect ? (
              <CheckCircle2
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  lightTheme ? 'text-emerald-600' : 'text-emerald-400'
                }`}
              />
            ) : (
              <XCircle
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  lightTheme ? 'text-rose-600' : 'text-rose-400'
                }`}
              />
            )}
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-extrabold">{evaluation.feedbackTitleUz}</h4>
                <span
                  className={`text-xs font-black px-2 py-0.5 rounded-md ${
                    lightTheme ? 'bg-white/80 text-slate-800' : 'bg-black/30'
                  }`}
                >
                  Aniqlik: {Math.round(evaluation.accuracyRatio * 100)}%
                </span>
              </div>
              <p className="text-xs leading-relaxed opacity-95">
                {evaluation.feedbackExplanationUz}
              </p>
              {!evaluation.isCorrect && (
                <p
                  className={`text-xs font-bold pt-1 ${
                    lightTheme ? 'text-rose-800' : 'text-amber-300'
                  }`}
                >
                  To‘g‘ri javob: {evaluation.expectedAnswerDisplay}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
