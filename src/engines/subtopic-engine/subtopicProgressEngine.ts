import { SUBTOPICS_REPOSITORY } from '../../content/registry/subtopicsCatalog';
import {
  knowledgeTracker,
  learningEngine,
} from '../knowledge-engine/knowledgeAndPracticeEngine';
import { globalKnowledgeTracker } from '../../knowledge/domain/services/GlobalKnowledgeTracker';

export interface SubtopicMistakeRecord {
  itemId: string;
  promptUz: string;
  explanationUz: string;
  timestamp: number;
}

export interface SubtopicProgressRecord {
  subtopicId: string;
  currentStageNumber: number; // 1..7
  completedStageNumbers: number[];
  explanationViewed: boolean;
  examplesViewed: boolean;
  guidedPracticeCompleted: boolean;
  guidedPracticeCorrectCount: number;
  guidedPracticeTotalCount: number;
  guidedPracticeMistakes: SubtopicMistakeRecord[];
  realLifeViewed: boolean;
  assessmentAttempts: number;
  assessmentBestScorePercent: number;
  assessmentPassed: boolean;
  assessmentMistakes: SubtopicMistakeRecord[];
  isCompleted: boolean;
  completedAt?: number;
}

const STORAGE_KEY = 'talkme_subtopic_progress_v2';

function createInitialRecord(subtopicId: string): SubtopicProgressRecord {
  return {
    subtopicId,
    currentStageNumber: 1,
    completedStageNumbers: [],
    explanationViewed: false,
    examplesViewed: false,
    guidedPracticeCompleted: false,
    guidedPracticeCorrectCount: 0,
    guidedPracticeTotalCount: 0,
    guidedPracticeMistakes: [],
    realLifeViewed: false,
    assessmentAttempts: 0,
    assessmentBestScorePercent: 0,
    assessmentPassed: false,
    assessmentMistakes: [],
    isCompleted: false,
  };
}

class SubtopicProgressEngine {
  private records: Map<string, SubtopicProgressRecord> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, SubtopicProgressRecord>;
      Object.entries(parsed).forEach(([k, v]) => {
        if (v && typeof v === 'object') {
          this.records.set(k, v);
        }
      });
    } catch {
      // Ignore corrupt storage
    }
  }

  private persist(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const obj: Record<string, SubtopicProgressRecord> = {};
      this.records.forEach((val, key) => {
        obj[key] = val;
      });
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch {
      // Ignore quota errors
    }
  }

  getRecord(subtopicId: string): SubtopicProgressRecord {
    const existing = this.records.get(subtopicId);
    if (existing) return existing;
    const fresh = createInitialRecord(subtopicId);
    this.records.set(subtopicId, fresh);
    return fresh;
  }

  getAllRecords(): SubtopicProgressRecord[] {
    return Array.from(this.records.values());
  }

  recordStageVisited(subtopicId: string, stageNumber: number): SubtopicProgressRecord {
    const rec = this.getRecord(subtopicId);
    rec.currentStageNumber = Math.max(1, Math.min(7, stageNumber));
    if (!rec.completedStageNumbers.includes(stageNumber)) {
      rec.completedStageNumbers = [...rec.completedStageNumbers, stageNumber].sort((a, b) => a - b);
    }

    if (stageNumber === 2) rec.explanationViewed = true;
    if (stageNumber === 3) rec.examplesViewed = true;
    if (stageNumber === 5) rec.realLifeViewed = true;

    const subtopic = SUBTOPICS_REPOSITORY[subtopicId];
    if (subtopic && (stageNumber === 2 || stageNumber === 3)) {
      knowledgeTracker.recordLessonExposure(subtopic.knowledgeIds);
    }

    // Report stage exposure to centralized GlobalKnowledgeTracker (discovered/introduced only)
    globalKnowledgeTracker.recordSubtopicStageExposure(subtopicId, stageNumber);

    this.records.set(subtopicId, { ...rec });
    this.persist();
    return this.getRecord(subtopicId);
  }

  recordGuidedActivityResult(
    subtopicId: string,
    activity: {
      itemId: string;
      knowledgeId: string;
      promptUz: string;
      explanationUz: string;
      isCorrect: boolean;
    }
  ): SubtopicProgressRecord {
    const rec = this.getRecord(subtopicId);
    rec.guidedPracticeTotalCount += 1;

    knowledgeTracker.recordExerciseAttempt(
      [activity.knowledgeId],
      activity.isCorrect,
      activity.isCorrect ? 100 : 0
    );

    globalKnowledgeTracker.recordPracticeActivityOutcome({
      knowledgeIds: [activity.knowledgeId],
      isCorrect: activity.isCorrect,
      source: {
        courseId: 'nouns',
        subtopicId,
        lessonId: subtopicId,
        exerciseId: activity.itemId,
        activityType: 'guided_practice',
      },
      attemptKey: `guided_${subtopicId}_${activity.itemId}_${rec.guidedPracticeTotalCount}`,
    });

    if (activity.isCorrect) {
      rec.guidedPracticeCorrectCount += 1;
      rec.guidedPracticeMistakes = rec.guidedPracticeMistakes.filter(
        (m) => m.itemId !== activity.itemId
      );
    } else {
      const exists = rec.guidedPracticeMistakes.some((m) => m.itemId === activity.itemId);
      if (!exists) {
        rec.guidedPracticeMistakes = [
          ...rec.guidedPracticeMistakes,
          {
            itemId: activity.itemId,
            promptUz: activity.promptUz,
            explanationUz: activity.explanationUz,
            timestamp: Date.now(),
          },
        ];
      }
    }

    rec.guidedPracticeCompleted = true;
    if (!rec.completedStageNumbers.includes(4)) {
      rec.completedStageNumbers = [...rec.completedStageNumbers, 4].sort((a, b) => a - b);
    }

    this.records.set(subtopicId, { ...rec });
    this.persist();
    return this.getRecord(subtopicId);
  }

  recordAssessmentSubmission(
    subtopicId: string,
    passingThresholdPercent: number,
    results: Array<{
      questionId: string;
      knowledgeId: string;
      promptUz: string;
      explanationUz: string;
      isCorrect: boolean;
    }>
  ): {
    record: SubtopicProgressRecord;
    scorePercent: number;
    passed: boolean;
    correctCount: number;
    totalCount: number;
  } {
    const rec = this.getRecord(subtopicId);
    const totalCount = Math.max(1, results.length);
    const correctCount = results.filter((r) => r.isCorrect).length;
    const scorePercent = Math.round((correctCount / totalCount) * 100);
    const passed = scorePercent >= passingThresholdPercent;

    rec.assessmentAttempts += 1;
    rec.assessmentBestScorePercent = Math.max(rec.assessmentBestScorePercent, scorePercent);

    const newMistakes: SubtopicMistakeRecord[] = [];
    results.forEach((res) => {
      knowledgeTracker.recordExerciseAttempt(
        [res.knowledgeId],
        res.isCorrect,
        res.isCorrect ? 100 : 0
      );
      if (!res.isCorrect) {
        newMistakes.push({
          itemId: res.questionId,
          promptUz: res.promptUz,
          explanationUz: res.explanationUz,
          timestamp: Date.now(),
        });
      }
    });

    // Report assessment evaluation to centralized GlobalKnowledgeTracker
    globalKnowledgeTracker.recordSubtopicAssessmentEvaluated({
      subtopicId,
      passed,
      scorePercent,
      questionResults: results.map((r) => ({
        questionId: r.questionId,
        knowledgeId: r.knowledgeId,
        isCorrect: r.isCorrect,
      })),
      attemptNumber: rec.assessmentAttempts,
    });

    rec.assessmentMistakes = newMistakes;

    if (passed) {
      rec.assessmentPassed = true;
      if (!rec.completedStageNumbers.includes(6)) {
        rec.completedStageNumbers = [...rec.completedStageNumbers, 6].sort((a, b) => a - b);
      }
    }

    this.records.set(subtopicId, { ...rec });
    this.persist();

    return {
      record: this.getRecord(subtopicId),
      scorePercent,
      passed,
      correctCount,
      totalCount,
    };
  }

  completeSubtopicWrapUp(subtopicId: string): SubtopicProgressRecord {
    const rec = this.getRecord(subtopicId);
    if (!rec.completedStageNumbers.includes(7)) {
      rec.completedStageNumbers = [...rec.completedStageNumbers, 7].sort((a, b) => a - b);
    }

    // A Subtopic is only marked completed when the learner passes its assessment AND reaches Wrap-up
    if (rec.assessmentPassed) {
      rec.isCompleted = true;
      rec.completedAt = Date.now();

      const subtopic = SUBTOPICS_REPOSITORY[subtopicId];
      if (subtopic) {
        // Also mark corresponding lesson IDs in learningEngine so Practice Center paths unlock
        knowledgeTracker.recordExerciseAttempt(subtopic.knowledgeIds, true, 100);
        learningEngine.markLessonCompleted(subtopicId);
        if (subtopicId === 'what_is_a_noun' || subtopic.majorTopicId === 'major_topic_nouns') {
          learningEngine.markLessonCompleted('lesson_nouns_1');
        }
        if (subtopicId === 'common_and_proper_nouns') {
          learningEngine.markLessonCompleted('lesson_nouns_2');
        }
        if (subtopicId === 'hello_first_steps') {
          learningEngine.markLessonCompleted('lesson_hello_a0');
        }
        if (subtopicId === 'numbers_0_10_subtopic') {
          learningEngine.markLessonCompleted('lesson_numbers_0_10');
        }
      }
    }

    this.records.set(subtopicId, { ...rec });
    this.persist();
    return this.getRecord(subtopicId);
  }

  resetSubtopicProgress(subtopicId: string): SubtopicProgressRecord {
    const fresh = createInitialRecord(subtopicId);
    this.records.set(subtopicId, fresh);
    this.persist();
    return fresh;
  }
}

export const subtopicProgressEngine = new SubtopicProgressEngine();

