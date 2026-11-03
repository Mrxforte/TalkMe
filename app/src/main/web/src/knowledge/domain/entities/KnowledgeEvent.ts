export type KnowledgeEventType =
  | 'VOCABULARY_DISCOVERED'
  | 'VOCABULARY_PRACTICED'
  | 'VOCABULARY_ANSWER_CORRECT'
  | 'VOCABULARY_ANSWER_INCORRECT'
  | 'VOCABULARY_REVIEW_COMPLETED'
  | 'VOCABULARY_MASTERED'
  | 'GRAMMAR_RULE_INTRODUCED'
  | 'GRAMMAR_RULE_PRACTICED'
  | 'GRAMMAR_RULE_ANSWER_CORRECT'
  | 'GRAMMAR_RULE_ANSWER_INCORRECT'
  | 'GRAMMAR_RULE_LEARNED'
  | 'GRAMMAR_RULE_MASTERED';

export interface KnowledgeEventSource {
  courseId?: string;
  levelId?: string;
  topicId?: string;
  subtopicId?: string;
  lessonId?: string;
  exerciseId?: string;
  activityType?:
    | 'roadmap'
    | 'subtopic'
    | 'lesson'
    | 'vocabulary_card'
    | 'grammar_block'
    | 'guided_practice'
    | 'assessment'
    | 'practice_center'
    | 'reading'
    | 'listening'
    | 'speaking'
    | 'writing'
    | 'fsrs_review'
    | 'manual_toggle';
}

export interface KnowledgeEventPayloadMetadata {
  word?: string;
  language?: string;
  translation?: string;
  pronunciation?: string;
  partOfSpeech?: string;
  emoji?: string;
  exampleEn?: string;
  exampleUz?: string;
  ruleKey?: string;
  titleEn?: string;
  titleUz?: string;
  description?: string;
  formula?: string;
  examples?: Array<{ en: string; uz: string }>;
  scorePercent?: number;
  passedAssessment?: boolean;
  fsrsRating?: number; // 1=Again, 2=Hard, 3=Good, 4=Easy
  fsrsReps?: number;
  fsrsStabilityDays?: number;
  fsrsNextReviewAt?: number;
  forceStatus?: 'discovered' | 'learning' | 'learned' | 'mastered';
  [key: string]: unknown;
}

export interface KnowledgeEvent {
  eventId: string;
  eventType: KnowledgeEventType;
  knowledgeId: string;
  source: KnowledgeEventSource;
  timestamp: number;
  metadata?: KnowledgeEventPayloadMetadata;
}

/**
 * Generates a deterministic idempotent event ID when an explicit one is not supplied,
 * preventing duplicate submissions or component re-renders from inflating counters.
 */
export function buildDeterministicEventId(params: {
  eventType: KnowledgeEventType;
  knowledgeId: string;
  source: KnowledgeEventSource;
  dedupeWindowKey?: string;
}): string {
  const { eventType, knowledgeId, source, dedupeWindowKey } = params;
  const srcParts = [
    source.courseId || '',
    source.levelId || '',
    source.topicId || '',
    source.subtopicId || '',
    source.lessonId || '',
    source.exerciseId || '',
    source.activityType || '',
  ].join(':');
  return `evt__${eventType}__${knowledgeId}__${srcParts}__${dedupeWindowKey || 'default'}`;
}
