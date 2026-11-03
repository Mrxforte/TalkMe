import { KnowledgeStatus } from './VocabularyKnowledge';

export interface GrammarRuleExample {
  en: string;
  uz: string;
  highlightedWords?: string[];
}

export interface GrammarKnowledge {
  id: string;
  ruleKey: string;
  title: {
    en: string;
    uz: string;
  };
  description: string;
  formula?: string;
  examples: GrammarRuleExample[];
  categoryUz?: string;
  levelIds: string[];
  courseIds: string[];
  topicIds: string[];
  subtopicIds: string[];
  lessonIds: string[];
  firstIntroducedAt: number;
  firstLearnedAt?: number;
  lastPracticedAt?: number;
  exposureCount: number;
  practiceCount: number;
  correctCount: number;
  incorrectCount: number;
  assessmentPassedCount: number;
  status: KnowledgeStatus;
  masteryScore: number;
  sourceIds: string[];
  isCloudSynced?: boolean;
  updatedAt: number;
}

/**
 * Normalizes a grammar rule key so repeated appearances of the same rule across
 * levels or reviews resolve to one canonical identity, while distinct rules stay separate.
 */
export function normalizeGrammarRuleKey(ruleKeyOrId: string): string {
  return ruleKeyOrId
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9._-]/g, '');
}
