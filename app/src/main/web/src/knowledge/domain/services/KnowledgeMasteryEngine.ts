import { KnowledgeStatus, VocabularyKnowledge } from '../entities/VocabularyKnowledge';
import { GrammarKnowledge } from '../entities/GrammarKnowledge';

export interface VocabularyCriteriaConfig {
  minPracticeForLearning: number;
  minCorrectForLearned: number;
  allowAssessmentPassForLearned: boolean;
  minCorrectForMastered: number;
  minMasteryScoreForLearned: number;
  minMasteryScoreForMastered: number;
  minFsrsRepsForLearned: number;
  minFsrsStabilityDaysForMastered: number;
}

export interface GrammarCriteriaConfig {
  minPracticeForLearning: number;
  minCorrectForLearned: number;
  requireAssessmentPassOrMinCorrectForLearned: boolean;
  minCorrectForMastered: number;
  minMasteryScoreForLearned: number;
  minMasteryScoreForMastered: number;
}

export interface KnowledgeCriteriaConfig {
  vocabulary: VocabularyCriteriaConfig;
  grammar: GrammarCriteriaConfig;
}

export const DEFAULT_KNOWLEDGE_CRITERIA_CONFIG: KnowledgeCriteriaConfig = {
  vocabulary: {
    minPracticeForLearning: 1,
    minCorrectForLearned: 1,
    allowAssessmentPassForLearned: true,
    minCorrectForMastered: 3,
    minMasteryScoreForLearned: 70,
    minMasteryScoreForMastered: 90,
    minFsrsRepsForLearned: 2,
    minFsrsStabilityDaysForMastered: 5,
  },
  grammar: {
    minPracticeForLearning: 1,
    minCorrectForLearned: 2,
    requireAssessmentPassOrMinCorrectForLearned: true,
    minCorrectForMastered: 3,
    minMasteryScoreForLearned: 70,
    minMasteryScoreForMastered: 90,
  },
};

export class KnowledgeMasteryEngine {
  private config: KnowledgeCriteriaConfig;

  constructor(customConfig?: Partial<KnowledgeCriteriaConfig>) {
    this.config = {
      vocabulary: {
        ...DEFAULT_KNOWLEDGE_CRITERIA_CONFIG.vocabulary,
        ...(customConfig?.vocabulary || {}),
      },
      grammar: {
        ...DEFAULT_KNOWLEDGE_CRITERIA_CONFIG.grammar,
        ...(customConfig?.grammar || {}),
      },
    };
  }

  getConfig(): KnowledgeCriteriaConfig {
    return this.config;
  }

  updateConfig(partial: Partial<KnowledgeCriteriaConfig>): void {
    this.config = {
      vocabulary: {
        ...this.config.vocabulary,
        ...(partial.vocabulary || {}),
      },
      grammar: {
        ...this.config.grammar,
        ...(partial.grammar || {}),
      },
    };
  }

  /**
   * Computes mastery score (0..100) and status ("discovered" | "learning" | "learned" | "mastered")
   * for a VocabularyKnowledge record.
   *
   * Key rules:
   * - Encountering/hearing a word in a lesson ONLY marks it "discovered" (score <= 25).
   * - Practicing or answering once transitions to "learning".
   * - Passing an assessment or achieving required correct practice / FSRS review threshold transitions to "learned".
   * - Repeated successful practice / FSRS stability transitions to "mastered".
   */
  evaluateVocabularyProgression(record: VocabularyKnowledge): {
    status: KnowledgeStatus;
    masteryScore: number;
  } {
    const cfg = this.config.vocabulary;
    const srsReps = record.srsReview?.reps || 0;
    const srsStability = record.srsReview?.stabilityDays || 0;

    // Calculate mastery score (0..100)
    let score = 0;
    if (record.exposureCount > 0) {
      score = Math.min(25, record.exposureCount * 10);
    }
    if (record.practiceCount > 0) {
      score = Math.max(score, 40);
    }
    if (record.correctCount > 0) {
      const accuracyRatio =
        record.correctCount / Math.max(1, record.correctCount + record.incorrectCount);
      const practiceBoost = Math.min(45, record.correctCount * 20 * accuracyRatio);
      score = Math.max(score, Math.round(35 + practiceBoost));
    }
    if (record.assessmentPassedCount > 0) {
      score = Math.max(score, 75);
    }
    if (srsReps >= cfg.minFsrsRepsForLearned) {
      score = Math.max(score, 75);
    }
    if (record.correctCount >= cfg.minCorrectForMastered && record.assessmentPassedCount > 0) {
      score = Math.max(score, 92);
    }
    if (srsStability >= cfg.minFsrsStabilityDaysForMastered && srsReps >= 3) {
      score = Math.max(score, 95);
    }
    score = Math.min(100, Math.max(0, score));

    // Determine status
    const meetsMastered =
      (record.correctCount >= cfg.minCorrectForMastered &&
        score >= cfg.minMasteryScoreForMastered) ||
      (srsStability >= cfg.minFsrsStabilityDaysForMastered && srsReps >= 3);

    if (meetsMastered) {
      return { status: 'mastered', masteryScore: Math.max(score, cfg.minMasteryScoreForMastered) };
    }

    const meetsLearnedByAssessment =
      cfg.allowAssessmentPassForLearned &&
      record.assessmentPassedCount >= 1 &&
      record.correctCount >= 1;

    const meetsLearnedByPractice =
      record.correctCount >= cfg.minCorrectForLearned &&
      (record.assessmentPassedCount >= 1 ||
        record.practiceCount >= 2 ||
        score >= cfg.minMasteryScoreForLearned);

    const meetsLearnedByFsrs = srsReps >= cfg.minFsrsRepsForLearned;

    if (meetsLearnedByAssessment || meetsLearnedByPractice || meetsLearnedByFsrs) {
      return { status: 'learned', masteryScore: Math.max(score, cfg.minMasteryScoreForLearned) };
    }

    if (
      record.practiceCount >= cfg.minPracticeForLearning ||
      record.correctCount > 0 ||
      record.incorrectCount > 0 ||
      srsReps > 0
    ) {
      return { status: 'learning', masteryScore: Math.max(score, 40) };
    }

    return { status: 'discovered', masteryScore: Math.min(score, 25) };
  }

  /**
   * Computes mastery score (0..100) and status ("discovered" | "learning" | "learned" | "mastered")
   * for a GrammarKnowledge record.
   *
   * Key rules:
   * - Opening/viewing a grammar rule block ONLY marks it "discovered" (score <= 25).
   * - Completing a guided activity on the rule marks it "learning".
   * - Passing the rule assessment (or meeting required correct answers) marks it "learned".
   * - Consistent performance across practice & assessment marks it "mastered".
   */
  evaluateGrammarProgression(record: GrammarKnowledge): {
    status: KnowledgeStatus;
    masteryScore: number;
  } {
    const cfg = this.config.grammar;

    let score = 0;
    if (record.exposureCount > 0) {
      score = Math.min(25, record.exposureCount * 12);
    }
    if (record.practiceCount > 0) {
      score = Math.max(score, 45);
    }
    if (record.correctCount > 0) {
      const accuracyRatio =
        record.correctCount / Math.max(1, record.correctCount + record.incorrectCount);
      const boost = Math.min(40, record.correctCount * 18 * accuracyRatio);
      score = Math.max(score, Math.round(40 + boost));
    }
    if (record.assessmentPassedCount > 0) {
      score = Math.max(score, 78);
    }
    if (record.correctCount >= cfg.minCorrectForMastered && record.assessmentPassedCount > 0) {
      score = Math.max(score, 94);
    }
    score = Math.min(100, Math.max(0, score));

    const meetsMastered =
      record.correctCount >= cfg.minCorrectForMastered &&
      record.assessmentPassedCount >= 1 &&
      score >= cfg.minMasteryScoreForMastered;

    if (meetsMastered) {
      return { status: 'mastered', masteryScore: Math.max(score, cfg.minMasteryScoreForMastered) };
    }

    const meetsLearned =
      record.assessmentPassedCount >= 1 ||
      (record.correctCount >= cfg.minCorrectForLearned && score >= cfg.minMasteryScoreForLearned);

    if (meetsLearned) {
      return { status: 'learned', masteryScore: Math.max(score, cfg.minMasteryScoreForLearned) };
    }

    if (
      record.practiceCount >= cfg.minPracticeForLearning ||
      record.correctCount > 0 ||
      record.incorrectCount > 0
    ) {
      return { status: 'learning', masteryScore: Math.max(score, 45) };
    }

    return { status: 'discovered', masteryScore: Math.min(score, 25) };
  }

  /**
   * Returns true if the given status counts as "learned" for the main card counters
   * ("Yodlangan noyob so‘zlar" and "O‘zlashtirilgan qoidalar").
   */
  isCountedAsLearned(status: KnowledgeStatus): boolean {
    return status === 'learned' || status === 'mastered';
  }
}

export const knowledgeMasteryEngine = new KnowledgeMasteryEngine();
