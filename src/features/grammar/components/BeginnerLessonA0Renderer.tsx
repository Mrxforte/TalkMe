import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Trophy,
  Mic,
  HeartHandshake,
  Blocks,
  BookOpen,
  UserCheck,
} from 'lucide-react';
import {
  LearningLesson,
  Exercise,
  VocabularyItem,
} from '../types/grammarFrameworkTypes';
import {
  GlobalLearningTrackerState,
  computeDynamicWrapUpSummary,
} from '../engine/progressAndMasteryEngine';
import { ExerciseEvaluationOutput } from '../engine/exerciseEngine';
import { InteractiveExerciseRenderer } from './InteractiveExerciseRenderer';

interface BeginnerLessonA0RendererProps {
  lesson: LearningLesson;
  availableLessons: LearningLesson[];
  onSelectLesson: (lessonId: string) => void;
  globalTrackerState: GlobalLearningTrackerState;
  onRecordVocabExposure: (
    vocabItem: VocabularyItem,
    interactionType:
      | 'explanation_view'
      | 'audio_practice'
      | 'exercise_correct'
      | 'exercise_incorrect'
  ) => void;
  onRecordExerciseEvaluated: (
    lesson: LearningLesson,
    exercise: Exercise,
    result: ExerciseEvaluationOutput
  ) => void;
  onRecordSectionProgress?: (
    lesson: LearningLesson,
    options: {
      currentSectionIndex: number;
      completedSectionId?: string;
      markLessonCompleted?: boolean;
      timeSpentDeltaSeconds?: number;
      personalizedLearnerName?: string;
    }
  ) => void;
  onSyncLessonVocabToFsrs?: (lesson: LearningLesson) => void;
  onPlayAudio: (text: string, slow?: boolean) => void;
  onStopAudio: () => void;
  isPlayingAudio: boolean;
}

export const BeginnerLessonA0Renderer: React.FC<BeginnerLessonA0RendererProps> = ({
  lesson,
  availableLessons,
  onSelectLesson,
  globalTrackerState,
  onRecordVocabExposure,
  onRecordExerciseEvaluated,
  onRecordSectionProgress,
  onSyncLessonVocabToFsrs,
  onPlayAudio,
  isPlayingAudio,
}) => {
  const savedProgress = globalTrackerState.lessonProgress[lesson.id];

  // Restore saved section index on initial mount or lesson switch
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(() => {
    const idx = savedProgress?.currentSectionIndex ?? 0;
    return idx >= 0 && idx < lesson.sections.length ? idx : 0;
  });

  // Personalization name for "I am [name]." (defaults to Azamat)
  const [learnerName, setLearnerName] = useState<string>(() => {
    return savedProgress?.personalizedLearnerName || 'Azamat';
  });

  // Track which English text item is currently playing for visual highlight
  const [activeAudioKey, setActiveAudioKey] = useState<string | null>(null);

  // Section 2 speaking/repeating interaction state
  const [greetingRepeatStatus, setGreetingRepeatStatus] = useState<Record<string, boolean>>({});
  const [greetingSpeechTranscript, setGreetingSpeechTranscript] = useState<string | null>(null);
  const [isRecordingGreeting, setIsRecordingGreeting] = useState<boolean>(false);

  // Sync section index if lesson changes
  useEffect(() => {
    const idx = globalTrackerState.lessonProgress[lesson.id]?.currentSectionIndex ?? 0;
    setActiveSectionIndex(idx >= 0 && idx < lesson.sections.length ? idx : 0);
  }, [lesson.id, lesson.sections.length]);

  // Clear highlight when audio stops
  useEffect(() => {
    if (!isPlayingAudio) {
      setActiveAudioKey(null);
    }
  }, [isPlayingAudio]);

  // Track time spent every 15 seconds
  useEffect(() => {
    const timer = window.setInterval(() => {
      onRecordSectionProgress?.(lesson, {
        currentSectionIndex: activeSectionIndex,
        timeSpentDeltaSeconds: 15,
      });
    }, 15000);
    return () => window.clearInterval(timer);
  }, [lesson, activeSectionIndex, onRecordSectionProgress]);

  const activeSection = lesson.sections[activeSectionIndex] || lesson.sections[0];
  const beginnerContent = activeSection.beginnerContent;

  // Trigger celebratory confetti and mark lesson completed when reaching Section 7 (Wrap-up)
  useEffect(() => {
    if (activeSection.stage === 'wrap_up') {
      onRecordSectionProgress?.(lesson, {
        currentSectionIndex: activeSectionIndex,
        completedSectionId: activeSection.id,
        markLessonCompleted: true,
        personalizedLearnerName: learnerName.trim() || 'Azamat',
      });
      onSyncLessonVocabToFsrs?.(lesson);
      try {
        confetti({
          particleCount: 70,
          spread: 65,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore confetti errors in headless/test environments
      }
    }
  }, [activeSection.id, activeSection.stage, activeSectionIndex]);

  const handlePlayTrackedAudio = (
    text: string,
    key: string,
    slow = false,
    vocabItem?: VocabularyItem
  ) => {
    setActiveAudioKey(key);
    onPlayAudio(text, slow);
    if (vocabItem) {
      onRecordVocabExposure(vocabItem, 'audio_practice');
    }
  };

  const handleGoToSection = (nextIndex: number) => {
    const clamped = Math.max(0, Math.min(lesson.sections.length - 1, nextIndex));
    const currentSection = lesson.sections[activeSectionIndex];
    onRecordSectionProgress?.(lesson, {
      currentSectionIndex: clamped,
      completedSectionId: currentSection?.id,
      markLessonCompleted: lesson.sections[clamped]?.stage === 'wrap_up',
      personalizedLearnerName: learnerName.trim() || 'Azamat',
    });
    setActiveSectionIndex(clamped);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNameChange = (newName: string) => {
    setLearnerName(newName);
    onRecordSectionProgress?.(lesson, {
      currentSectionIndex: activeSectionIndex,
      personalizedLearnerName: newName.trim() || 'Azamat',
    });
  };

  // Speech recognition helper for Section 2 ("Let's say Hello!")
  const speechApiAvailable = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const w = window as unknown as Record<string, unknown>;
    return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
  }, []);

  const handleTrySpeakGreeting = (phraseEn: string) => {
    if (!speechApiAvailable) {
      handlePlayTrackedAudio(phraseEn, `sec2_repeat_${phraseEn}`, false);
      setGreetingRepeatStatus((prev) => ({ ...prev, [phraseEn]: true }));
      return;
    }

    try {
      const w = window as unknown as Record<
        string,
        new () => {
          lang: string;
          interimResults: boolean;
          maxAlternatives: number;
          onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
          onerror: () => void;
          onend: () => void;
          start: () => void;
        }
      >;
      const SpeechRec = w.SpeechRecognition || w.webkitSpeechRecognition;
      const recognition = new SpeechRec();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      setIsRecordingGreeting(true);

      recognition.onresult = (event) => {
        const spoken = event.results?.[0]?.[0]?.transcript || '';
        setGreetingSpeechTranscript(spoken);
        setGreetingRepeatStatus((prev) => ({ ...prev, [phraseEn]: true }));
        setIsRecordingGreeting(false);
      };
      recognition.onerror = () => {
        setIsRecordingGreeting(false);
        setGreetingRepeatStatus((prev) => ({ ...prev, [phraseEn]: true }));
      };
      recognition.onend = () => {
        setIsRecordingGreeting(false);
      };
      recognition.start();
    } catch {
      setIsRecordingGreeting(false);
      setGreetingRepeatStatus((prev) => ({ ...prev, [phraseEn]: true }));
    }
  };

  const wrapUpSummary = useMemo(
    () => computeDynamicWrapUpSummary(globalTrackerState, lesson),
    [globalTrackerState, lesson]
  );

  const completedSectionIds = savedProgress?.completedSectionIds || [];
  const completedExercisesCount = wrapUpSummary.exercisesCompletedCount;
  const progressPercent = Math.round(((activeSectionIndex + 1) / lesson.sections.length) * 100);
  const displayLearnerName = learnerName.trim() || 'Azamat';

  return (
    <div className="space-y-6 pb-20 text-slate-900">
      {/* Top Lesson Bar & Progress Header */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-black text-base shadow-xs">
              {lesson.level}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                  Absolute Beginner • Nol darajadan
                </span>
                {savedProgress?.lessonCompleted && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    Tugatilgan
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                {lesson.title.en || lesson.title.uz}
              </h2>
            </div>
          </div>

          {/* Lesson switcher to keep all existing lessons accessible */}
          {availableLessons.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {availableLessons.map((item) => {
                const isCurrent = item.id === lesson.id;
                const labelText = (item.title.en || item.title.uz).replace('Lesson 1 — ', '');
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectLesson(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition border ${
                      isCurrent
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.level}: {labelText}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Smooth Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-600">
            <span>
              Bo‘lim {activeSectionIndex + 1} / {lesson.sections.length}:{' '}
              {activeSection.title.en || activeSection.title.uz}
            </span>
            <span className="text-indigo-600">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 7 Section Navigation Steps */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 mt-3 border-t border-slate-100">
          {lesson.sections.map((sec, idx) => {
            const isActive = idx === activeSectionIndex;
            const isDone = completedSectionIds.includes(sec.id) || idx < activeSectionIndex;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleGoToSection(idx)}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : isDone
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {isDone && !isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                <span>
                  {idx + 1}. {sec.title.en || sec.title.uz}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================== SECTION 1: WELCOME TO TALKME ==================== */}
      {beginnerContent?.kind === 'welcome' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Clean, attractive welcome illustration */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50 border border-indigo-100 p-6 sm:p-8 flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-white shadow-md border border-indigo-100 flex items-center justify-center text-4xl">
              👋
            </div>
            <div className="space-y-2 max-w-md">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-indigo-200 text-indigo-700 text-xs font-extrabold">
                <Sparkles className="w-3.5 h-3.5" />
                {beginnerContent.badgeUz || '1-Qadam • Xush kelibsiz!'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {beginnerContent.heroTitleEn || 'Hello! Welcome to TalkMe!'}
              </h1>
            </div>

            {/* Audio controls for English greeting */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() =>
                  handlePlayTrackedAudio(
                    beginnerContent.heroTitleEn || 'Hello! Welcome to TalkMe!',
                    'sec1_welcome',
                    false
                  )
                }
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-extrabold transition shadow-sm ${
                  activeAudioKey === 'sec1_welcome' && isPlayingAudio
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                Inglizcha eshitish
              </button>
              <button
                type="button"
                onClick={() =>
                  handlePlayTrackedAudio(
                    beginnerContent.heroTitleEn || 'Hello! Welcome to TalkMe!',
                    'sec1_welcome_slow',
                    true
                  )
                }
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-extrabold transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                🐢 Qayta (sekin)
              </button>
            </div>
          </div>

          {/* Uzbek friendly explanation */}
          <div className="space-y-3 bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200/80">
            {beginnerContent.bodyParagraphsUz.map((para, index) => (
              <p
                key={index}
                className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed"
              >
                {para}
              </p>
            ))}
          </div>

          {/* Final phrase + Primary Continue Action */}
          <div className="rounded-2xl bg-emerald-50/80 border border-emerald-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  handlePlayTrackedAudio(
                    beginnerContent.closingCalloutEn || "Let's start!",
                    'sec1_lets_start',
                    false
                  )
                }
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition shadow-xs ${
                  activeAudioKey === 'sec1_lets_start' && isPlayingAudio
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                }`}
                title="Let's start! ni eshitish"
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <div>
                <div className="text-lg font-black text-emerald-950">
                  “{beginnerContent.closingCalloutEn || "Let's start!"}”
                </div>
                <div className="text-xs font-bold text-emerald-800">
                  {beginnerContent.closingCalloutUz} — Tayyormisiz?
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                handlePlayTrackedAudio("Let's start!", 'sec1_lets_start_btn', false);
                handleGoToSection(activeSectionIndex + 1);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-base font-extrabold shadow-md transition active:scale-98"
            >
              <span>Let&apos;s start! (Davom etish)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== SECTION 2: LET'S SAY HELLO! ==================== */}
      {beginnerContent?.kind === 'greeting_situation' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Everyday Situation Header & Contextual Illustration */}
          <div className="rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50/70 to-indigo-50 border border-amber-200/80 p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-white border border-amber-200 shadow-xs flex items-center justify-center text-4xl shrink-0">
              🤝
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800">
                Hayotiy vaziyat
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {beginnerContent.situationPromptUz}
              </h3>
              <p className="text-sm font-medium text-slate-600">
                {beginnerContent.greetingExplanationUz}
              </p>
            </div>
          </div>

          {/* Greeting Expressions Table / Cards */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <span>English (Inglizcha)</span>
              <span>Uzbek (O‘zbekcha)</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {beginnerContent.greetingTable?.map((item) => {
                const playKey = `sec2_${item.english}`;
                const isThisPlaying = activeAudioKey === playKey && isPlayingAudio;
                const isRepeated = Boolean(greetingRepeatStatus[item.english]);

                return (
                  <div
                    key={item.english}
                    className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                      isThisPlaying
                        ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'bg-slate-50/80 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-8">
                        <div className="text-2xl sm:text-3xl font-black text-indigo-950">
                          {item.english}
                        </div>
                        <div className="text-xl sm:text-2xl font-extrabold text-emerald-700">
                          {item.uzbek}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handlePlayTrackedAudio(item.audioText, playKey, false)}
                          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition ${
                            isThisPlaying
                              ? 'bg-indigo-700 text-white'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
                          }`}
                        >
                          <Volume2 className="w-4 h-4" />
                          Tinglash
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePlayTrackedAudio(item.audioText, playKey, true)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-extrabold transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          🐢 Qayta eshitish
                        </button>
                      </div>
                    </div>

                    {/* Prominent Speaking / Repeating Interaction */}
                    <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-600">
                        🗣️ Endi ovoz chiqarib qaytarib ko‘ring: <strong>“{item.english}”</strong>
                      </span>
                      <div className="flex items-center gap-2">
                        {speechApiAvailable && (
                          <button
                            type="button"
                            onClick={() => handleTrySpeakGreeting(item.english)}
                            disabled={isRecordingGreeting}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-xs font-extrabold transition"
                          >
                            <Mic className="w-3.5 h-3.5" />
                            {isRecordingGreeting ? 'Eshitilmoqda...' : 'Mikrofon bilan aytish'}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            handlePlayTrackedAudio(item.audioText, playKey, false);
                            setGreetingRepeatStatus((prev) => ({
                              ...prev,
                              [item.english]: true,
                            }));
                          }}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold border transition ${
                            isRepeated
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                          }`}
                        >
                          {isRepeated ? '✓ Ajoyib! Aytdingiz' : 'Eshitib qaytardim'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {greetingSpeechTranscript && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-bold text-emerald-900">
              🎤 Barakalla! Siz aytdingiz: “{greetingSpeechTranscript}”
            </div>
          )}
        </div>
      )}

      {/* ==================== SECTION 3: MEET TALKME! ==================== */}
      {beginnerContent?.kind === 'assistant_intro' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50/60 to-emerald-50 border border-indigo-100 p-6 flex flex-col sm:flex-row items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-indigo-600 text-white flex items-center justify-center text-3xl font-black shadow-md shrink-0">
              TM
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-indigo-200 text-indigo-700 text-xs font-extrabold">
                <HeartHandshake className="w-3.5 h-3.5" />
                {beginnerContent.badgeUz || 'Sizning yordamchingiz'}
              </span>
              {beginnerContent.bodyParagraphsUz.map((para, i) => (
                <p
                  key={i}
                  className={`${
                    i === 0
                      ? 'text-xl sm:text-2xl font-black text-slate-900'
                      : 'text-sm sm:text-base font-medium text-slate-700'
                  }`}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* 4 Simple Learning Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {beginnerContent.benefitBulletsUz?.map((benefit, idx) => {
              const icons = ['🎧', '🖼️', '✍️', '💬'];
              return (
                <div
                  key={benefit}
                  className="rounded-2xl bg-slate-50 border border-slate-200/90 p-4 flex items-center gap-3.5"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                    {icons[idx % icons.length]}
                  </div>
                  <span className="text-base font-extrabold text-slate-800">{benefit}</span>
                </div>
              );
            })}
          </div>

          {/* Reassuring closing message */}
          <div className="rounded-2xl bg-amber-50/90 border border-amber-200 p-4 sm:p-5 text-center">
            <p className="text-base sm:text-lg font-extrabold text-amber-950">
              🌱 {beginnerContent.closingCalloutUz}
            </p>
          </div>
        </div>
      )}

      {/* ==================== SECTION 4: WHAT IS GRAMMAR? ==================== */}
      {beginnerContent?.kind === 'grammar_lego' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          {/* English term Grammar with TTS */}
          <div className="rounded-3xl bg-indigo-50/80 border border-indigo-200 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
                Yangi tushuncha • Oddiy va oson
              </span>
              <div className="text-2xl sm:text-3xl font-black text-indigo-950">
                {beginnerContent.heroTitleEn || 'Grammar'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handlePlayTrackedAudio(
                    beginnerContent.heroTitleEn || 'Grammar',
                    'sec4_grammar_term',
                    false
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-extrabold shadow-xs transition"
              >
                <Volume2 className="w-4 h-4" />
                “Grammar” ni eshitish
              </button>
              <button
                type="button"
                onClick={() =>
                  handlePlayTrackedAudio(
                    beginnerContent.heroTitleEn || 'Grammar',
                    'sec4_grammar_term',
                    true
                  )
                }
                className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl bg-white border border-indigo-200 text-indigo-700 text-xs font-extrabold"
              >
                🐢 Sekin
              </button>
            </div>
          </div>

          {/* Simple Uzbek explanation */}
          <div className="space-y-2.5 bg-slate-50 rounded-2xl p-5 border border-slate-200">
            {beginnerContent.bodyParagraphsUz.map((para, idx) => (
              <p
                key={idx}
                className={`${
                  idx === 0
                    ? 'text-lg sm:text-xl font-black text-slate-900'
                    : 'text-base font-medium text-slate-700'
                }`}
              >
                {para}
              </p>
            ))}
          </div>

          {/* LEGO Analogy Interactive Visual */}
          {beginnerContent.legoAnalogy && (
            <div className="rounded-3xl bg-gradient-to-br from-amber-50/70 via-white to-emerald-50/70 border border-slate-200 p-5 sm:p-6 space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
                  <Blocks className="w-5 h-5" />
                </div>
                <p className="text-sm sm:text-base font-bold text-slate-700 leading-relaxed">
                  🧱 LEGO o‘yinchoqlarida kichik bo‘laklarni birlashtirib shakl yasaganimiz kabi,{' '}
                  {beginnerContent.legoAnalogy.explanationUz.toLowerCase()}
                </p>
              </div>

              {/* Interactive LEGO Word Bricks */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-2">
                {beginnerContent.legoAnalogy.blocks.map((brick, idx) => {
                  const brickColors = [
                    'bg-rose-500 border-rose-600 text-white',
                    'bg-amber-500 border-amber-600 text-white',
                    'bg-emerald-600 border-emerald-700 text-white',
                  ];
                  return (
                    <React.Fragment key={brick}>
                      <button
                        type="button"
                        onClick={() =>
                          handlePlayTrackedAudio(brick.replace('.', ''), `lego_${brick}`, false)
                        }
                        className={`px-5 py-3.5 rounded-2xl border-b-4 font-black text-lg sm:text-xl shadow-sm transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 ${
                          brickColors[idx % brickColors.length]
                        }`}
                      >
                        <span>{brick}</span>
                        <Volume2 className="w-4 h-4 opacity-85" />
                      </button>
                      {idx < beginnerContent.legoAnalogy!.blocks.length - 1 && (
                        <span className="text-xl font-black text-slate-400">+</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Combined Sentence Result */}
              <div className="rounded-2xl bg-white border-2 border-emerald-300 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-2xl font-black text-slate-900">
                    “{beginnerContent.legoAnalogy.fullSentenceEn}”
                  </div>
                  <div className="text-base font-extrabold text-emerald-700">
                    “{beginnerContent.legoAnalogy.fullSentenceUz}”
                  </div>
                  <p className="text-xs font-semibold text-slate-500 pt-1">
                    {beginnerContent.legoAnalogy.explanationUz}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handlePlayTrackedAudio(
                        beginnerContent.legoAnalogy?.fullSentenceEn || 'I am happy.',
                        'sec4_example',
                        false
                      )
                    }
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-extrabold shadow-xs transition"
                  >
                    <Volume2 className="w-4 h-4" />
                    Gapni eshitish
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handlePlayTrackedAudio(
                        beginnerContent.legoAnalogy?.fullSentenceEn || 'I am happy.',
                        'sec4_example_slow',
                        true
                      )
                    }
                    className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition"
                  >
                    🐢 Sekin
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reassurance Footer */}
          <div className="rounded-2xl bg-indigo-50 border border-indigo-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm sm:text-base font-extrabold text-indigo-950 text-center sm:text-left">
              ✨ {beginnerContent.closingCalloutUz}
            </p>
            <button
              type="button"
              onClick={() =>
                handlePlayTrackedAudio(
                  beginnerContent.closingCalloutEn || "Don't worry!",
                  'sec4_dont_worry',
                  false
                )
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-indigo-200 text-indigo-700 text-xs font-extrabold shrink-0 hover:bg-indigo-100 transition"
            >
              <Volume2 className="w-3.5 h-3.5" />
              “Don&apos;t worry!”
            </button>
          </div>
        </div>
      )}

      {/* ==================== SECTION 5: YOUR FIRST 6 WORDS ==================== */}
      {activeSection.stage === 'new_vocabulary' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                Birinchi 6 ta so‘zingiz • 6 Vocabulary Cards
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                {activeSection.subtitle?.uz ||
                  'Har bir so‘zni eshiting va ovoz chiqarib takrorlang:'}
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold self-start sm:self-auto">
              Jami: {lesson.vocabulary.length} ta so‘z
            </span>
          </div>

          {/* 6 Vocabulary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lesson.vocabulary.map((item) => {
              const cardKey = `vocab_${item.id}`;
              const isCardPlaying = activeAudioKey === cardKey && isPlayingAudio;

              return (
                <div
                  key={item.id}
                  className={`rounded-3xl p-5 border transition-all flex flex-col justify-between gap-4 ${
                    isCardPlaying
                      ? 'bg-indigo-50/90 border-indigo-500 ring-4 ring-indigo-500/15 shadow-md'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-indigo-300 hover:shadow-xs'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-2xs">
                        {item.visualEmoji || '✨'}
                      </span>
                      {isCardPlaying && (
                        <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-extrabold animate-pulse">
                          🔊 O‘qilmoqda...
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="text-2xl font-black text-slate-900">{item.wordEn}</div>
                      <div className="text-base font-extrabold text-emerald-700 mt-0.5">
                        {item.translationUz}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/70">
                    <button
                      type="button"
                      onClick={() => handlePlayTrackedAudio(item.wordEn, cardKey, false, item)}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-extrabold transition ${
                        isCardPlaying
                          ? 'bg-indigo-700 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xs'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                      Eshitish
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePlayTrackedAudio(item.wordEn, cardKey, true, item)}
                      className="inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-extrabold transition"
                      title="Qayta sekin eshitish"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      🐢
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Personalization Box for "I am [name]." */}
          <div className="rounded-3xl bg-gradient-to-r from-indigo-50 via-emerald-50/70 to-sky-50 border border-indigo-200 p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                “I am” bilan o‘zingizni tanishtiring!
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-600 block">
                  Ismingizni yozing (masalan: Azamat):
                </label>
                <input
                  type="text"
                  value={learnerName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Azamat"
                  className="w-full rounded-2xl bg-white border border-indigo-300 px-4 py-3 text-base font-extrabold text-slate-900 focus:border-indigo-600 outline-none shadow-2xs"
                />
              </div>

              <div className="rounded-2xl bg-white border border-indigo-200 p-4 flex items-center justify-between gap-3 shadow-2xs">
                <div>
                  <div className="text-xl font-black text-indigo-950">
                    “I am {displayLearnerName}.”
                  </div>
                  <div className="text-sm font-extrabold text-emerald-700">
                    “Men {displayLearnerName}man.”
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      handlePlayTrackedAudio(
                        `I am ${displayLearnerName}.`,
                        'sec5_personal_iam',
                        false
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-xs transition"
                  >
                    <Volume2 className="w-4 h-4" />
                    Eshitish
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handlePlayTrackedAudio(
                        `I am ${displayLearnerName}.`,
                        'sec5_personal_iam',
                        true
                      )
                    }
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition"
                    title="Sekin qayta eshitish"
                  >
                    🐢
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SECTION 6: LET'S PRACTICE! (5 EXERCISES) ==================== */}
      {activeSection.stage === 'interactive_activities' && (
        <div className="space-y-5">
          <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                Amaliyot vaqti • 5 ta oson mashq
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                {activeSection.subtitle?.uz ||
                  'Keling, bugun o‘rgangan 6 ta so‘zimizni 5 ta juda oson mashqda sinab ko‘ramiz!'}
              </h3>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold self-start sm:self-auto">
              Bajarildi: {completedExercisesCount} / {lesson.exercises.length} mashq
            </div>
          </div>

          <div className="space-y-4">
            {lesson.exercises.map((exercise, idx) => (
              <InteractiveExerciseRenderer
                key={exercise.id}
                exercise={exercise}
                exerciseIndex={idx}
                totalExercises={lesson.exercises.length}
                isCompleted={Boolean(savedProgress?.exerciseResults[exercise.id]?.isCorrect)}
                lightTheme={true}
                learnerName={displayLearnerName}
                onPlayAudio={(text, slow) =>
                  handlePlayTrackedAudio(text, `ex_${exercise.id}`, slow)
                }
                onEvaluated={(ex, result) => {
                  onRecordExerciseEvaluated(lesson, ex, result);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ==================== SECTION 7: WRAP-UP ==================== */}
      {activeSection.stage === 'wrap_up' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Celebratory Hero Banner */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-50 via-indigo-50/70 to-amber-50 border border-emerald-200 p-6 sm:p-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-white border border-emerald-200 shadow-md flex items-center justify-center mx-auto text-amber-500 animate-bounce">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-emerald-200 text-emerald-700 text-xs font-extrabold">
                🎉 Tabriklaymiz! • Wrap-up
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                {lesson.wrapUp.celebrationTitleEn || 'You did it!'}
              </h2>
              <p className="text-lg sm:text-xl font-extrabold text-emerald-800">
                {lesson.wrapUp.celebrationSubtitleUz ||
                  'Ajoyib! Siz birinchi darsni tugatdingiz.'}
              </p>
            </div>

            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={() => handlePlayTrackedAudio('You did it!', 'sec7_you_did_it', false)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-extrabold shadow-sm transition"
              >
                <Volume2 className="w-4 h-4" />
                “You did it!” ni eshitish
              </button>
            </div>
          </div>

          {/* Summary of what the learner has learned */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              ✅ Bugun nimalarni o‘rgandingiz:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                lesson.wrapUp.learnedSkillsSummaryUz || [
                  'Salomlashish.',
                  'Rahmat aytish.',
                  'O‘zini tanishtirish.',
                  'Xayrlashish.',
                ]
              ).map((skill) => (
                <div
                  key={skill}
                  className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-4 flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-base font-extrabold text-slate-800">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lesson Completion Status, Exercise Results & Progress Indicator */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-center">
              <div className="text-2xl font-black text-emerald-600">100%</div>
              <div className="text-xs font-bold text-slate-500 mt-0.5">Dars holati</div>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-center">
              <div className="text-2xl font-black text-indigo-600">
                {wrapUpSummary.exercisesCompletedCount} / {wrapUpSummary.totalExercisesCount}
              </div>
              <div className="text-xs font-bold text-slate-500 mt-0.5">Mashqlar natijasi</div>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-center">
              <div className="text-2xl font-black text-amber-600">
                {lesson.vocabulary.length} ta
              </div>
              <div className="text-xs font-bold text-slate-500 mt-0.5">O‘rganilgan so‘zlar</div>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-center">
              <div className="text-2xl font-black text-sky-600">
                +{wrapUpSummary.totalLessonXpEarned || 25} XP
              </div>
              <div className="text-xs font-bold text-slate-500 mt-0.5">Mukofot ballari</div>
            </div>
          </div>

          {/* Vocabulary Learned Quick Replay */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-extrabold text-slate-600">
              🔊 O‘rganilgan 6 ta so‘zni qayta eshitib ko‘ring:
            </h4>
            <div className="flex flex-wrap gap-2">
              {lesson.vocabulary.map((voc) => (
                <button
                  key={voc.id}
                  type="button"
                  onClick={() => handlePlayTrackedAudio(voc.wordEn, `wrap_${voc.id}`, false, voc)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-xs font-extrabold text-slate-800 transition"
                >
                  <span>{voc.visualEmoji}</span>
                  <span>{voc.wordEn}</span>
                  <span className="text-slate-400">—</span>
                  <span className="text-emerald-700">{voc.translationUz}</span>
                  <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
                </button>
              ))}
            </div>
          </div>

          {/* Final Remember Message */}
          <div className="rounded-2xl bg-indigo-50/90 border border-indigo-200 p-5 text-center">
            <p className="text-base sm:text-lg font-extrabold text-indigo-950 leading-relaxed">
              💡{' '}
              {lesson.wrapUp.rememberMessageUz ||
                'Remember: Ingliz tilini o‘rganish qiyin bo‘lishi shart emas. Kichik qadamlar bilan katta natijaga erishasiz!'}
            </p>
          </div>

          {/* Continue to Next Lesson Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleGoToSection(0)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-extrabold transition"
            >
              <RotateCcw className="w-4 h-4" />
              Darsni boshidan ko‘rish
            </button>

            <button
              type="button"
              onClick={() => {
                const nextLesson = availableLessons.find((l) => l.id !== lesson.id);
                if (nextLesson) {
                  onSelectLesson(nextLesson.id);
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-base font-extrabold shadow-md transition"
            >
              <BookOpen className="w-5 h-5" />
              <span>Keyingi darsga o‘tish</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Prev / Next Section Navigation Bar */}
      {beginnerContent?.kind !== 'welcome' && activeSection.stage !== 'wrap_up' && (
        <div className="rounded-3xl bg-white border border-slate-200/90 p-4 flex items-center justify-between gap-3 shadow-xs">
          <button
            type="button"
            onClick={() => handleGoToSection(activeSectionIndex - 1)}
            disabled={activeSectionIndex === 0}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs sm:text-sm font-extrabold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Oldingi bo‘lim
          </button>

          <span className="text-xs font-extrabold text-slate-500">
            {activeSectionIndex + 1} / {lesson.sections.length}
          </span>

          <button
            type="button"
            onClick={() => handleGoToSection(activeSectionIndex + 1)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-extrabold shadow-sm transition"
          >
            <span>Davom etish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
