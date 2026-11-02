export type KnowledgeStatus = 'discovered' | 'learning' | 'learned' | 'mastered';

export interface VocabularySrsReviewInfo {
  cardId?: string;
  reps: number;
  lapses: number;
  stabilityDays: number;
  nextReviewAt?: number;
  lastReviewAt?: number;
  isDue: boolean;
}

export interface VocabularyKnowledge {
  id: string;
  normalizedWord: string;
  displayWord: string;
  language: string;
  translation: string;
  pronunciation?: string;
  partOfSpeech?: string;
  emoji?: string;
  exampleEn?: string;
  exampleUz?: string;
  relatedForms?: string[];
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
  srsReview?: VocabularySrsReviewInfo;
  isCloudSynced?: boolean;
  updatedAt: number;
}

/**
 * Normalizes a vocabulary word for canonical identity matching while preserving
 * explicit dictionary entry distinction when provided.
 */
export function normalizeVocabularyTerm(word: string, language = 'en'): string {
  const cleaned = word
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/^[.,!?;:"'()[\]{}]+|[.,!?;:"'()[\]{}]+$/g, '');
  return `${language.toLowerCase()}:${cleaned}`;
}

/**
 * Generates a deterministic canonical vocabulary knowledge ID.
 * If an explicit knowledgeId is provided, uses its canonical mapping; otherwise builds from language + normalized word + optional sense/partOfSpeech.
 */
export function buildStableVocabularyId(params: {
  explicitId?: string;
  word: string;
  language?: string;
  partOfSpeech?: string;
  senseKey?: string;
}): string {
  if (params.explicitId && params.explicitId.trim().length > 0) {
    return params.explicitId.trim();
  }
  const lang = (params.language || 'en').toLowerCase().trim();
  const baseSlug = params.word
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  const senseSuffix = params.senseKey
    ? `__${params.senseKey.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_')}`
    : '';
  return `vocab_${lang}_${baseSlug || 'item'}${senseSuffix}`;
}
