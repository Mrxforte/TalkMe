import {
  KNOWLEDGE_ITEMS_REPOSITORY,
  PRACTICE_PATHS_REPOSITORY,
  UNIVERSAL_LESSONS_REPOSITORY,
} from '../../content/registry/universalContentRepository';
import {
  ExerciseInstance,
  PracticePath,
  SkillDomain,
} from '../../content/schemas/contentSchemas';
import {
  talkMeDb,
  StoredKnowledgeState,
  StoredLessonProgress,
  StoredPracticeNodeProgress,
} from '../../core/db/talkMeDb';
import { globalKnowledgeTracker } from '../../knowledge/domain/services/GlobalKnowledgeTracker';
import { globalKnowledgeCatalog } from '../../knowledge/domain/services/GlobalKnowledgeCatalog';

export type PracticeSelectionMode = 'FIXED_PATH' | 'ADAPTIVE_PRACTICE' | 'RANDOM_PRACTICE';

const LOCAL_LESSON_PROGRESS_KEY = 'talkme_universal_lesson_progress_v1';
const LOCAL_PRACTICE_PROGRESS_KEY = 'talkme_universal_practice_progress_v1';
const LOCAL_KNOWLEDGE_STATE_KEY = 'talkme_universal_knowledge_state_v1';

// ============================================================================
// 1. CENTRALIZED KNOWLEDGE TRACKER ENGINE
// ============================================================================

export class KnowledgeTrackerEngine {
  private states: Record<string, StoredKnowledgeState> = {};

  constructor() {
    this.loadInitialStates();
  }

  private loadInitialStates(): void {
    try {
      const saved = localStorage.getItem(LOCAL_KNOWLEDGE_STATE_KEY);
      if (saved) {
        this.states = JSON.parse(saved);
      }
    } catch {
      // ignore
    }

    // Seed any missing knowledge items from repository
    for (const item of KNOWLEDGE_ITEMS_REPOSITORY) {
      if (!this.states[item.id]) {
        this.states[item.id] = {
          knowledgeId: item.id,
          domain: item.domain,
          topicId: item.topicId,
          subtopicId: item.subtopicId,
          termEn: item.termEn,
          meaningUz: item.meaningUz,
          masteryScore: 0,
          exposuresCount: 0,
          correctCount: 0,
          incorrectCount: 0,
          stabilityDays: 0,
          lastPracticedAt: 0,
          nextReviewAt: Date.now(),
        };
      }
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(LOCAL_KNOWLEDGE_STATE_KEY, JSON.stringify(this.states));
      talkMeDb.knowledgeStates.bulkPut(Object.values(this.states)).catch(() => {});
    } catch {
      // ignore
    }
  }

  recordLessonExposure(knowledgeIds: string[]): void {
    const now = Date.now();
    for (const id of knowledgeIds) {
      const existing = this.states[id];
      if (existing) {
        // Lesson completion increases initial exposure & base familiarity (up to 45%),
        // while true mastery (80%+) requires active practice in Practice Center!
        existing.exposuresCount += 1;
        existing.masteryScore = Math.min(100, Math.max(existing.masteryScore, 45));
        existing.lastPracticedAt = now;
      }

      const isGrammar =
        globalKnowledgeCatalog.isKnownGrammarId(id) &&
        !globalKnowledgeCatalog.isKnownVocabularyId(id);
      globalKnowledgeTracker.emitEvent({
        eventType: isGrammar ? 'GRAMMAR_RULE_INTRODUCED' : 'VOCABULARY_DISCOVERED',
        knowledgeId: id,
        source: {
          topicId: existing?.topicId,
          subtopicId: existing?.subtopicId,
          activityType: 'lesson',
        },
      });
    }
    this.persist();
  }

  recordExerciseAttempt(knowledgeIds: string[], isCorrect: boolean, score: number): void {
    const now = Date.now();
    for (const id of knowledgeIds) {
      const existing = this.states[id];
      if (existing) {
        existing.exposuresCount += 1;
        existing.lastPracticedAt = now;

        if (isCorrect) {
          existing.correctCount += 1;
          const delta = Math.max(15, Math.round(score * 0.3));
          existing.masteryScore = Math.min(100, existing.masteryScore + delta);
          existing.stabilityDays = Math.max(1, existing.stabilityDays * 2 + 1);
          existing.nextReviewAt = now + existing.stabilityDays * 86400000;
        } else {
          existing.incorrectCount += 1;
          existing.masteryScore = Math.max(10, existing.masteryScore - 15);
          existing.stabilityDays = 0.5;
          existing.nextReviewAt = now + 3600000;
        }
      }

      const isGrammar =
        globalKnowledgeCatalog.isKnownGrammarId(id) &&
        !globalKnowledgeCatalog.isKnownVocabularyId(id);
      globalKnowledgeTracker.emitEvent({
        eventType: isGrammar
          ? isCorrect
            ? 'GRAMMAR_RULE_ANSWER_CORRECT'
            : 'GRAMMAR_RULE_ANSWER_INCORRECT'
          : isCorrect
          ? 'VOCABULARY_ANSWER_CORRECT'
          : 'VOCABULARY_ANSWER_INCORRECT',
        knowledgeId: id,
        source: {
          topicId: existing?.topicId,
          subtopicId: existing?.subtopicId,
          activityType: 'practice_center',
        },
        metadata: {
          scorePercent: score,
          passedAssessment: isCorrect && score >= 75,
        },
      });
    }
    this.persist();
  }

  getAllKnowledgeStates(): StoredKnowledgeState[] {
    return Object.values(this.states);
  }

  getDomainMasterySummary(): Record<SkillDomain, { averageScore: number; masteredCount: number; totalCount: number }> {
    const domains: SkillDomain[] = [
      'vocabulary',
      'grammar',
      'phonetics',
      'listening',
      'speaking',
      'reading',
      'writing',
      'interactive_games',
    ];
    const result = {} as Record<
      SkillDomain,
      { averageScore: number; masteredCount: number; totalCount: number }
    >;

    for (const dom of domains) {
      const items = Object.values(this.states).filter((s) => s.domain === dom);
      if (items.length === 0) {
        result[dom] = { averageScore: 0, masteredCount: 0, totalCount: 0 };
      } else {
        const sum = items.reduce((acc, i) => acc + i.masteryScore, 0);
        const mastered = items.filter((i) => i.masteryScore >= 75).length;
        result[dom] = {
          averageScore: Math.round(sum / items.length),
          masteredCount: mastered,
          totalCount: items.length,
        };
      }
    }
    return result;
  }
}

export const knowledgeTracker = new KnowledgeTrackerEngine();

// ============================================================================
// 2. UNIVERSAL LESSON & SEQUENTIAL PRACTICE UNLOCK ENGINE
// ============================================================================

export class LearningAndPracticeEngine {
  private lessonProgress: Record<string, StoredLessonProgress> = {};
  private practiceProgress: Record<string, StoredPracticeNodeProgress> = {};

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    try {
      const savedLessons = localStorage.getItem(LOCAL_LESSON_PROGRESS_KEY);
      if (savedLessons) {
        this.lessonProgress = JSON.parse(savedLessons);
      }
      const savedPractice = localStorage.getItem(LOCAL_PRACTICE_PROGRESS_KEY);
      if (savedPractice) {
        this.practiceProgress = JSON.parse(savedPractice);
      }
    } catch {
      // ignore
    }

    // Ensure exercise 1 of every practice path is initialized
    Object.values(PRACTICE_PATHS_REPOSITORY).forEach((path) => {
      path.exercises.forEach((ex, index) => {
        const key = `${path.id}__${ex.id}`;
        if (!this.practiceProgress[key]) {
          this.practiceProgress[key] = {
            id: key,
            practicePathId: path.id,
            exerciseId: ex.id,
            unlocked: index === 0, // Exercise 1 unlocked first; subsequent unlock sequentially!
            completed: false,
            bestScore: 0,
            lastScore: 0,
            attempts: 0,
            updatedAt: Date.now(),
          };
        }
      });
    });
  }

  private persist(): void {
    try {
      localStorage.setItem(LOCAL_LESSON_PROGRESS_KEY, JSON.stringify(this.lessonProgress));
      localStorage.setItem(LOCAL_PRACTICE_PROGRESS_KEY, JSON.stringify(this.practiceProgress));
      talkMeDb.lessonProgress.bulkPut(Object.values(this.lessonProgress)).catch(() => {});
      talkMeDb.practiceProgress.bulkPut(Object.values(this.practiceProgress)).catch(() => {});
    } catch {
      // ignore
    }
  }

  isLessonCompleted(lessonId: string): boolean {
    return Boolean(this.lessonProgress[lessonId]?.completed);
  }

  markLessonCompleted(lessonId: string, score = 100): void {
    const lesson = UNIVERSAL_LESSONS_REPOSITORY[lessonId];
    const now = Date.now();
    this.lessonProgress[lessonId] = {
      lessonId,
      subtopicId: lesson?.subtopicId || '',
      majorTopicId: lesson?.majorTopicId || '',
      completed: true,
      currentSectionIndex: lesson ? lesson.sections.length - 1 : 0,
      score,
      attempts: (this.lessonProgress[lessonId]?.attempts || 0) + 1,
      completedAt: now,
      updatedAt: now,
    };

    if (lesson?.knowledgeIds) {
      knowledgeTracker.recordLessonExposure(lesson.knowledgeIds);
    }

    this.persist();
  }

  isPracticePathUnlocked(pathId: string): boolean {
    const path = PRACTICE_PATHS_REPOSITORY[pathId];
    if (!path) return false;
    // Starter A0 path is always ready; other paths unlock when at least one required lesson is completed OR user unlocks it
    if (path.id === 'practice_path_hello_a0') return true;
    if (path.requiredLessonIds.length === 0) return true;
    return path.requiredLessonIds.some((lid) => this.isLessonCompleted(lid));
  }

  getPracticePathNodesState(pathId: string): Array<{
    exercise: ExerciseInstance;
    progress: StoredPracticeNodeProgress;
  }> {
    const path = PRACTICE_PATHS_REPOSITORY[pathId];
    if (!path) return [];

    return path.exercises.map((exercise, idx) => {
      const key = `${path.id}__${exercise.id}`;
      let progress = this.practiceProgress[key];
      if (!progress) {
        progress = {
          id: key,
          practicePathId: path.id,
          exerciseId: exercise.id,
          unlocked: idx === 0,
          completed: false,
          bestScore: 0,
          lastScore: 0,
          attempts: 0,
          updatedAt: Date.now(),
        };
        this.practiceProgress[key] = progress;
      }
      return { exercise, progress };
    });
  }

  /**
   * Sequential unlocking logic:
   * When exercise i is completed with score >= requiredScore and attempts >= minimumAttempts,
   * exercise i + 1 becomes unlocked automatically!
   */
  recordExerciseSubmission(
    pathId: string,
    exerciseId: string,
    score: number
  ): {
    passed: boolean;
    newlyUnlockedExerciseId: string | null;
    updatedProgress: StoredPracticeNodeProgress;
  } {
    const path = PRACTICE_PATHS_REPOSITORY[pathId];
    const key = `${pathId}__${exerciseId}`;
    const existing = this.practiceProgress[key] || {
      id: key,
      practicePathId: pathId,
      exerciseId,
      unlocked: true,
      completed: false,
      bestScore: 0,
      lastScore: 0,
      attempts: 0,
      updatedAt: Date.now(),
    };

    const exerciseIndex = path ? path.exercises.findIndex((e) => e.id === exerciseId) : -1;
    const exerciseDef = exerciseIndex >= 0 && path ? path.exercises[exerciseIndex] : null;
    const requiredScore = exerciseDef?.requiredScore ?? 75;
    const minAttempts = exerciseDef?.minimumAttempts ?? 1;

    existing.attempts += 1;
    existing.lastScore = score;
    existing.bestScore = Math.max(existing.bestScore, score);
    existing.updatedAt = Date.now();

    const passed = existing.bestScore >= requiredScore && existing.attempts >= minAttempts;
    if (passed) {
      existing.completed = true;
      existing.completedAt = existing.completedAt || Date.now();
    }
    this.practiceProgress[key] = existing;

    if (exerciseDef?.knowledgeIds) {
      knowledgeTracker.recordExerciseAttempt(exerciseDef.knowledgeIds, score >= requiredScore, score);
    }

    let newlyUnlockedExerciseId: string | null = null;
    if (passed && path && exerciseIndex >= 0 && exerciseIndex + 1 < path.exercises.length) {
      const nextExercise = path.exercises[exerciseIndex + 1];
      const nextKey = `${pathId}__${nextExercise.id}`;
      const nextProg = this.practiceProgress[nextKey] || {
        id: nextKey,
        practicePathId: pathId,
        exerciseId: nextExercise.id,
        unlocked: false,
        completed: false,
        bestScore: 0,
        lastScore: 0,
        attempts: 0,
        updatedAt: Date.now(),
      };
      if (!nextProg.unlocked) {
        nextProg.unlocked = true;
        newlyUnlockedExerciseId = nextExercise.id;
      }
      this.practiceProgress[nextKey] = nextProg;
    }

    this.persist();
    return {
      passed,
      newlyUnlockedExerciseId,
      updatedProgress: existing,
    };
  }

  /**
   * Topic-Based Practice Selection Modes:
   * 1. FIXED_PATH
   * 2. ADAPTIVE_PRACTICE (targets lowest mastery knowledge items)
   * 3. RANDOM_PRACTICE
   */
  selectExercisesForMode(
    mode: PracticeSelectionMode,
    pathId: string
  ): ExerciseInstance[] {
    const path: PracticePath =
      PRACTICE_PATHS_REPOSITORY[pathId] || PRACTICE_PATHS_REPOSITORY.practice_path_nouns;

    if (mode === 'FIXED_PATH') {
      return path.exercises;
    }

    const allExercises = Object.values(PRACTICE_PATHS_REPOSITORY).flatMap((p) => p.exercises);

    if (mode === 'ADAPTIVE_PRACTICE') {
      const allStates = knowledgeTracker.getAllKnowledgeStates();
      const scoreMap = new Map(allStates.map((s) => [s.knowledgeId, s.masteryScore]));
      return [...allExercises]
        .sort((a, b) => {
          const avgA =
            a.knowledgeIds.reduce((sum, id) => sum + (scoreMap.get(id) ?? 0), 0) /
            Math.max(1, a.knowledgeIds.length);
          const avgB =
            b.knowledgeIds.reduce((sum, id) => sum + (scoreMap.get(id) ?? 0), 0) /
            Math.max(1, b.knowledgeIds.length);
          return avgA - avgB;
        })
        .slice(0, 6);
    }

    // RANDOM_PRACTICE
    return [...allExercises].sort(() => Math.random() - 0.5).slice(0, 5);
  }
}

export const learningEngine = new LearningAndPracticeEngine();
