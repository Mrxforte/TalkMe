import {
  VocabularyKnowledge,
  KnowledgeStatus,
} from '../entities/VocabularyKnowledge';
import { GrammarKnowledge } from '../entities/GrammarKnowledge';
import {
  KnowledgeEvent,
  KnowledgeEventType,
  KnowledgeEventSource,
  KnowledgeEventPayloadMetadata,
  buildDeterministicEventId,
} from '../entities/KnowledgeEvent';
import {
  KnowledgeMasteryEngine,
  KnowledgeCriteriaConfig,
  knowledgeMasteryEngine,
} from './KnowledgeMasteryEngine';
import {
  globalKnowledgeCatalog,
  CanonicalVocabularyBlueprint,
  CanonicalGrammarBlueprint,
} from './GlobalKnowledgeCatalog';
import {
  LocalKnowledgeRepository,
  localKnowledgeRepository,
} from '../../data/local/LocalKnowledgeRepository';
import { LearnedWordItem, MasteredRuleItem } from '../../../types';

export interface GlobalKnowledgeStatistics {
  uniqueLearnedWordsCount: number;
  masteredGrammarRulesCount: number;
  vocabularyCounts: {
    discovered: number;
    learning: number;
    learned: number;
    mastered: number;
    total: number;
  };
  grammarCounts: {
    discovered: number;
    learning: number;
    learned: number;
    mastered: number;
    total: number;
  };
}

export interface VocabularyLibraryQuery {
  searchQuery?: string;
  levelId?: string;
  courseOrTopicId?: string;
  status?: KnowledgeStatus | 'all' | 'learned_or_mastered';
  sortBy?: 'alphabetical' | 'recently_learned' | 'mastery_desc';
  includeCatalogUntracked?: boolean;
}

export interface GrammarLibraryQuery {
  searchQuery?: string;
  levelId?: string;
  topicId?: string;
  status?: KnowledgeStatus | 'all' | 'learned_or_mastered';
  sortBy?: 'recently_learned' | 'alphabetical' | 'mastery_desc';
  includeCatalogUntracked?: boolean;
}

type TrackerListener = () => void;

function addUniqueItem(list: string[], value?: string): void {
  if (!value || !value.trim()) return;
  if (!list.includes(value)) list.push(value);
}

const STATUS_RANK: Record<KnowledgeStatus, number> = {
  discovered: 1,
  learning: 2,
  learned: 3,
  mastered: 4,
};

export class GlobalKnowledgeTracker {
  private vocabMap: Map<string, VocabularyKnowledge> = new Map();
  private grammarMap: Map<string, GrammarKnowledge> = new Map();
  private processedEventIds: Set<string> = new Set();
  private listeners: Set<TrackerListener> = new Set();
  private repository: LocalKnowledgeRepository;
  private masteryEngine: KnowledgeMasteryEngine;
  private isLoading = false;
  private lastError: string | null = null;

  constructor(
    repository: LocalKnowledgeRepository = localKnowledgeRepository,
    masteryEngine: KnowledgeMasteryEngine = knowledgeMasteryEngine
  ) {
    this.repository = repository;
    this.masteryEngine = masteryEngine;
    this.loadFromStorage();
  }

  // ==========================================================================
  // INITIALIZATION & PERSISTENCE
  // ==========================================================================

  loadFromStorage(): void {
    try {
      this.isLoading = true;
      this.lastError = null;
      const snapshot = this.repository.loadSnapshot();
      this.vocabMap.clear();
      this.grammarMap.clear();
      this.processedEventIds.clear();

      for (const [id, rec] of Object.entries(snapshot.vocabulary)) {
        if (rec && rec.id) {
          this.vocabMap.set(id, rec);
        }
      }

      for (const [id, rec] of Object.entries(snapshot.grammar)) {
        if (rec && rec.id) {
          this.grammarMap.set(id, rec);
        }
      }

      for (const evId of snapshot.processedEventIds) {
        this.processedEventIds.add(evId);
      }

      this.migrateLegacyStorageIfPresent();
      this.isLoading = false;
    } catch (err) {
      this.isLoading = false;
      this.lastError =
        err instanceof Error ? err.message : 'Bilimlar bazasini yuklashda xatolik yuz berdi';
    }
  }

  private migrateLegacyStorageIfPresent(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const legacyWordsRaw = window.localStorage.getItem('talkme_user_learned_words_v2');
      if (legacyWordsRaw) {
        const legacyWords = JSON.parse(legacyWordsRaw) as LearnedWordItem[];
        if (Array.isArray(legacyWords)) {
          for (const lw of legacyWords) {
            // Only migrate items that the user genuinely learned or interacted with
            if (lw.status === 'learned' || lw.correctExercisesCount > 0) {
              const bp = globalKnowledgeCatalog.resolveVocabularyBlueprint(lw.id, {
                word: lw.word,
                translation: lw.translation,
                pronunciation: lw.phonetic,
                partOfSpeech: lw.category,
                emoji: lw.emoji,
              });
              if (!this.vocabMap.has(bp.id)) {
                const now = lw.updatedAt || Date.now();
                const migrated: VocabularyKnowledge = this.createVocabFromBlueprint(bp, now);
                migrated.exposureCount = Math.max(1, lw.meaningfulInteractionsCount || 1);
                migrated.practiceCount = Math.max(1, lw.meaningfulInteractionsCount || 1);
                migrated.correctCount =
                  lw.status === 'learned' ? Math.max(2, lw.correctExercisesCount || 2) : lw.correctExercisesCount;
                migrated.assessmentPassedCount = lw.status === 'learned' ? 1 : 0;
                migrated.status = lw.status === 'learned' ? 'learned' : 'learning';
                migrated.masteryScore = lw.status === 'learned' ? 85 : 45;
                migrated.firstLearnedAt = lw.status === 'learned' ? now : undefined;
                migrated.lastPracticedAt = now;
                this.vocabMap.set(bp.id, migrated);
              }
            }
          }
        }
      }

      const legacyRulesRaw = window.localStorage.getItem('talkme_user_mastered_rules_v2');
      if (legacyRulesRaw) {
        const legacyRules = JSON.parse(legacyRulesRaw) as MasteredRuleItem[];
        if (Array.isArray(legacyRules)) {
          for (const lr of legacyRules) {
            if (lr.status === 'learned') {
              const bp = globalKnowledgeCatalog.resolveGrammarBlueprint(lr.id, {
                titleEn: lr.nameEn || lr.nameUz,
                titleUz: lr.nameUz,
                description: lr.shortSummaryUz,
                formula: lr.formula,
                categoryUz: lr.category,
              });
              if (!this.grammarMap.has(bp.id)) {
                const now = lr.updatedAt || Date.now();
                const migrated: GrammarKnowledge = this.createGrammarFromBlueprint(bp, now);
                migrated.exposureCount = 2;
                migrated.practiceCount = 2;
                migrated.correctCount = 2;
                migrated.assessmentPassedCount = 1;
                migrated.status = 'learned';
                migrated.masteryScore = Math.max(80, lr.masteryScore || 85);
                migrated.firstLearnedAt = now;
                migrated.lastPracticedAt = now;
                this.grammarMap.set(bp.id, migrated);
              }
            }
          }
        }
      }
    } catch {
      // Ignore migration errors
    }
  }

  private persist(latestEvents?: KnowledgeEvent[]): void {
    const vocabulary: Record<string, VocabularyKnowledge> = {};
    this.vocabMap.forEach((v, k) => {
      vocabulary[k] = v;
    });

    const grammar: Record<string, GrammarKnowledge> = {};
    this.grammarMap.forEach((g, k) => {
      grammar[k] = g;
    });

    this.repository.saveSnapshot(
      {
        vocabulary,
        grammar,
        processedEventIds: Array.from(this.processedEventIds),
      },
      latestEvents
    );
    this.notifyListeners();
  }

  subscribe(listener: TrackerListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch {
        // ignore listener error
      }
    });
  }

  getLoadingState(): { isLoading: boolean; error: string | null } {
    return { isLoading: this.isLoading, error: this.lastError };
  }

  getCriteriaConfig(): KnowledgeCriteriaConfig {
    return this.masteryEngine.getConfig();
  }

  updateCriteriaConfig(partial: Partial<KnowledgeCriteriaConfig>): void {
    this.masteryEngine.updateConfig(partial);
  }

  /**
   * Resets all tracked knowledge (used for clean tests or full profile reset)
   */
  resetAllKnowledge(): void {
    this.vocabMap.clear();
    this.grammarMap.clear();
    this.processedEventIds.clear();
    this.repository.clearAll();
    this.notifyListeners();
  }

  /**
   * Simulates an application restart by clearing in-memory maps and reloading from persistent storage
   */
  simulateAppRestart(): void {
    this.vocabMap.clear();
    this.grammarMap.clear();
    this.processedEventIds.clear();
    this.loadFromStorage();
    this.notifyListeners();
  }

  // ==========================================================================
  // RECORD FACTORY HELPERS
  // ==========================================================================

  private createVocabFromBlueprint(
    bp: CanonicalVocabularyBlueprint,
    timestamp: number
  ): VocabularyKnowledge {
    return {
      id: bp.id,
      normalizedWord: bp.normalizedWord,
      displayWord: bp.displayWord,
      language: bp.language,
      translation: bp.translation,
      pronunciation: bp.pronunciation,
      partOfSpeech: bp.partOfSpeech,
      emoji: bp.emoji,
      exampleEn: bp.exampleEn,
      exampleUz: bp.exampleUz,
      relatedForms: bp.relatedForms ? [...bp.relatedForms] : [],
      levelIds: [...bp.levelIds],
      courseIds: [...bp.courseIds],
      topicIds: [...bp.topicIds],
      subtopicIds: [...bp.subtopicIds],
      lessonIds: [...bp.lessonIds],
      firstIntroducedAt: timestamp,
      exposureCount: 0,
      practiceCount: 0,
      correctCount: 0,
      incorrectCount: 0,
      assessmentPassedCount: 0,
      status: 'discovered',
      masteryScore: 0,
      sourceIds: [...bp.sourceIds],
      updatedAt: timestamp,
    };
  }

  private createGrammarFromBlueprint(
    bp: CanonicalGrammarBlueprint,
    timestamp: number
  ): GrammarKnowledge {
    return {
      id: bp.id,
      ruleKey: bp.ruleKey,
      title: { ...bp.title },
      description: bp.description,
      formula: bp.formula,
      examples: bp.examples.map((e) => ({ ...e })),
      categoryUz: bp.categoryUz,
      levelIds: [...bp.levelIds],
      courseIds: [...bp.courseIds],
      topicIds: [...bp.topicIds],
      subtopicIds: [...bp.subtopicIds],
      lessonIds: [...bp.lessonIds],
      firstIntroducedAt: timestamp,
      exposureCount: 0,
      practiceCount: 0,
      correctCount: 0,
      incorrectCount: 0,
      assessmentPassedCount: 0,
      status: 'discovered',
      masteryScore: 0,
      sourceIds: [...bp.sourceIds],
      updatedAt: timestamp,
    };
  }

  // ==========================================================================
  // CENTRALIZED IDEMPOTENT EVENT PROCESSING
  // ==========================================================================

  emitEvent(eventInput: {
    eventId?: string;
    eventType: KnowledgeEventType;
    knowledgeId: string;
    source?: KnowledgeEventSource;
    timestamp?: number;
    metadata?: KnowledgeEventPayloadMetadata;
    dedupeWindowKey?: string;
  }): {
    processed: boolean;
    duplicate: boolean;
    canonicalKnowledgeId: string;
  } {
    const timestamp = eventInput.timestamp || Date.now();
    const source: KnowledgeEventSource = eventInput.source || {};
    const eventId =
      eventInput.eventId ||
      buildDeterministicEventId({
        eventType: eventInput.eventType,
        knowledgeId: eventInput.knowledgeId,
        source,
        dedupeWindowKey: eventInput.dedupeWindowKey || `${timestamp}`,
      });

    if (this.processedEventIds.has(eventId)) {
      const isGrammar = eventInput.eventType.startsWith('GRAMMAR_');
      const resolvedId = isGrammar
        ? globalKnowledgeCatalog.resolveGrammarBlueprint(eventInput.knowledgeId).id
        : globalKnowledgeCatalog.resolveVocabularyBlueprint(eventInput.knowledgeId).id;
      return {
        processed: false,
        duplicate: true,
        canonicalKnowledgeId: resolvedId,
      };
    }

    const fullEvent: KnowledgeEvent = {
      eventId,
      eventType: eventInput.eventType,
      knowledgeId: eventInput.knowledgeId,
      source,
      timestamp,
      metadata: eventInput.metadata,
    };

    const canonicalId = this.applyEventInternal(fullEvent);
    this.processedEventIds.add(eventId);
    this.persist([fullEvent]);

    return {
      processed: true,
      duplicate: false,
      canonicalKnowledgeId: canonicalId,
    };
  }

  emitBatchEvents(
    events: Array<{
      eventId?: string;
      eventType: KnowledgeEventType;
      knowledgeId: string;
      source?: KnowledgeEventSource;
      timestamp?: number;
      metadata?: KnowledgeEventPayloadMetadata;
      dedupeWindowKey?: string;
    }>
  ): void {
    const processedBatch: KnowledgeEvent[] = [];

    for (const ev of events) {
      const timestamp = ev.timestamp || Date.now();
      const source = ev.source || {};
      const eventId =
        ev.eventId ||
        buildDeterministicEventId({
          eventType: ev.eventType,
          knowledgeId: ev.knowledgeId,
          source,
          dedupeWindowKey: ev.dedupeWindowKey || `${timestamp}`,
        });

      if (this.processedEventIds.has(eventId)) continue;

      const fullEvent: KnowledgeEvent = {
        eventId,
        eventType: ev.eventType,
        knowledgeId: ev.knowledgeId,
        source,
        timestamp,
        metadata: ev.metadata,
      };

      this.applyEventInternal(fullEvent);
      this.processedEventIds.add(eventId);
      processedBatch.push(fullEvent);
    }

    if (processedBatch.length > 0) {
      this.persist(processedBatch);
    }
  }

  private applyEventInternal(event: KnowledgeEvent): string {
    const isGrammarEvent = event.eventType.startsWith('GRAMMAR_');
    if (isGrammarEvent) {
      return this.applyGrammarEvent(event);
    }
    return this.applyVocabularyEvent(event);
  }

  private applyVocabularyEvent(event: KnowledgeEvent): string {
    const meta = event.metadata || {};
    const src = event.source || {};

    const bp = globalKnowledgeCatalog.resolveVocabularyBlueprint(event.knowledgeId, {
      word: meta.word,
      language: meta.language,
      translation: meta.translation,
      pronunciation: meta.pronunciation,
      partOfSpeech: meta.partOfSpeech,
      emoji: meta.emoji,
      exampleEn: meta.exampleEn,
      exampleUz: meta.exampleUz,
      courseId: src.courseId,
      levelId: src.levelId,
      topicId: src.topicId,
      subtopicId: src.subtopicId,
      lessonId: src.lessonId,
      distinctSenseKey:
        typeof meta.distinctSenseKey === 'string' ? meta.distinctSenseKey : undefined,
    });

    const existing =
      this.vocabMap.get(bp.id) || this.createVocabFromBlueprint(bp, event.timestamp);

    // Merge source provenance
    addUniqueItem(existing.courseIds, src.courseId);
    addUniqueItem(existing.levelIds, src.levelId);
    addUniqueItem(existing.topicIds, src.topicId);
    addUniqueItem(existing.subtopicIds, src.subtopicId);
    addUniqueItem(existing.lessonIds, src.lessonId);
    addUniqueItem(existing.sourceIds, event.knowledgeId);
    addUniqueItem(existing.sourceIds, src.exerciseId);

    if (meta.translation && (!existing.translation || existing.translation === existing.displayWord)) {
      existing.translation = meta.translation;
    }
    if (meta.pronunciation && !existing.pronunciation) {
      existing.pronunciation = meta.pronunciation;
    }
    if (meta.exampleEn && !existing.exampleEn) {
      existing.exampleEn = meta.exampleEn;
    }
    if (meta.exampleUz && !existing.exampleUz) {
      existing.exampleUz = meta.exampleUz;
    }

    switch (event.eventType) {
      case 'VOCABULARY_DISCOVERED': {
        existing.exposureCount += 1;
        break;
      }
      case 'VOCABULARY_PRACTICED': {
        existing.exposureCount = Math.max(1, existing.exposureCount);
        existing.practiceCount += 1;
        existing.lastPracticedAt = event.timestamp;
        break;
      }
      case 'VOCABULARY_ANSWER_CORRECT': {
        existing.exposureCount = Math.max(1, existing.exposureCount);
        existing.practiceCount += 1;
        existing.correctCount += 1;
        existing.lastPracticedAt = event.timestamp;
        if (meta.passedAssessment) {
          existing.assessmentPassedCount += 1;
        }
        break;
      }
      case 'VOCABULARY_ANSWER_INCORRECT': {
        existing.exposureCount = Math.max(1, existing.exposureCount);
        existing.practiceCount += 1;
        existing.incorrectCount += 1;
        existing.lastPracticedAt = event.timestamp;
        break;
      }
      case 'VOCABULARY_REVIEW_COMPLETED': {
        existing.exposureCount = Math.max(1, existing.exposureCount);
        existing.practiceCount += 1;
        existing.lastPracticedAt = event.timestamp;
        const rating = typeof meta.fsrsRating === 'number' ? meta.fsrsRating : 3;
        if (rating >= 3) {
          existing.correctCount += 1;
        } else if (rating === 1) {
          existing.incorrectCount += 1;
        }
        const prevReps = existing.srsReview?.reps || 0;
        const nextReps =
          typeof meta.fsrsReps === 'number' ? meta.fsrsReps : prevReps + (rating >= 2 ? 1 : 0);
        const stabilityDays =
          typeof meta.fsrsStabilityDays === 'number'
            ? meta.fsrsStabilityDays
            : rating === 4
            ? 7
            : rating === 3
            ? 3
            : 1;
        const nextReviewAt =
          typeof meta.fsrsNextReviewAt === 'number'
            ? meta.fsrsNextReviewAt
            : event.timestamp + stabilityDays * 86400000;

        existing.srsReview = {
          cardId: typeof meta.cardId === 'string' ? meta.cardId : existing.srsReview?.cardId,
          reps: nextReps,
          lapses: (existing.srsReview?.lapses || 0) + (rating === 1 ? 1 : 0),
          stabilityDays,
          lastReviewAt: event.timestamp,
          nextReviewAt,
          isDue: nextReviewAt <= Date.now(),
        };
        break;
      }
      case 'VOCABULARY_MASTERED': {
        existing.exposureCount = Math.max(1, existing.exposureCount);
        existing.practiceCount = Math.max(2, existing.practiceCount + 1);
        existing.correctCount = Math.max(3, existing.correctCount + 1);
        existing.assessmentPassedCount = Math.max(1, existing.assessmentPassedCount);
        existing.lastPracticedAt = event.timestamp;
        break;
      }
    }

    if (meta.forceStatus) {
      existing.status = meta.forceStatus;
      existing.masteryScore =
        meta.forceStatus === 'mastered'
          ? 95
          : meta.forceStatus === 'learned'
          ? Math.max(75, existing.masteryScore)
          : meta.forceStatus === 'learning'
          ? 45
          : 20;
    } else {
      const evaluated = this.masteryEngine.evaluateVocabularyProgression(existing);
      // Do not downgrade from learned/mastered on mere discovery events
      if (
        event.eventType === 'VOCABULARY_DISCOVERED' &&
        STATUS_RANK[existing.status] > STATUS_RANK[evaluated.status]
      ) {
        // Keep higher status
      } else {
        existing.status = evaluated.status;
        existing.masteryScore = Math.max(existing.masteryScore, evaluated.masteryScore);
      }
    }

    if (
      (existing.status === 'learned' || existing.status === 'mastered') &&
      !existing.firstLearnedAt
    ) {
      existing.firstLearnedAt = event.timestamp;
    }

    existing.updatedAt = event.timestamp;
    this.vocabMap.set(bp.id, existing);
    return bp.id;
  }

  private applyGrammarEvent(event: KnowledgeEvent): string {
    const meta = event.metadata || {};
    const src = event.source || {};

    const bp = globalKnowledgeCatalog.resolveGrammarBlueprint(event.knowledgeId, {
      ruleKey: meta.ruleKey,
      titleEn: meta.titleEn,
      titleUz: meta.titleUz,
      description: meta.description,
      formula: meta.formula,
      examples: meta.examples,
      courseId: src.courseId,
      levelId: src.levelId,
      topicId: src.topicId,
      subtopicId: src.subtopicId,
      lessonId: src.lessonId,
    });

    const existing =
      this.grammarMap.get(bp.id) || this.createGrammarFromBlueprint(bp, event.timestamp);

    addUniqueItem(existing.courseIds, src.courseId);
    addUniqueItem(existing.levelIds, src.levelId);
    addUniqueItem(existing.topicIds, src.topicId);
    addUniqueItem(existing.subtopicIds, src.subtopicId);
    addUniqueItem(existing.lessonIds, src.lessonId);
    addUniqueItem(existing.sourceIds, event.knowledgeId);
    addUniqueItem(existing.sourceIds, src.exerciseId);

    switch (event.eventType) {
      case 'GRAMMAR_RULE_INTRODUCED': {
        existing.exposureCount += 1;
        break;
      }
      case 'GRAMMAR_RULE_PRACTICED': {
        existing.exposureCount = Math.max(1, existing.exposureCount);
        existing.practiceCount += 1;
        existing.lastPracticedAt = event.timestamp;
        break;
      }
      case 'GRAMMAR_RULE_ANSWER_CORRECT': {
        existing.exposureCount = Math.max(1, existing.exposureCount);
        existing.practiceCount += 1;
        existing.correctCount += 1;
        existing.lastPracticedAt = event.timestamp;
        if (meta.passedAssessment) {
          existing.assessmentPassedCount += 1;
        }
        break;
      }
      case 'GRAMMAR_RULE_ANSWER_INCORRECT': {
        existing.exposureCount = Math.max(1, existing.exposureCount);
        existing.practiceCount += 1;
        existing.incorrectCount += 1;
        existing.lastPracticedAt = event.timestamp;
        break;
      }
      case 'GRAMMAR_RULE_LEARNED': {
        existing.exposureCount = Math.max(1, existing.exposureCount);
        existing.practiceCount = Math.max(1, existing.practiceCount + 1);
        existing.correctCount = Math.max(2, existing.correctCount + 1);
        existing.assessmentPassedCount += 1;
        existing.lastPracticedAt = event.timestamp;
        break;
      }
      case 'GRAMMAR_RULE_MASTERED': {
        existing.exposureCount = Math.max(1, existing.exposureCount);
        existing.practiceCount = Math.max(2, existing.practiceCount + 1);
        existing.correctCount = Math.max(3, existing.correctCount + 1);
        existing.assessmentPassedCount = Math.max(1, existing.assessmentPassedCount + 1);
        existing.lastPracticedAt = event.timestamp;
        break;
      }
    }

    if (meta.forceStatus) {
      existing.status = meta.forceStatus;
      existing.masteryScore =
        meta.forceStatus === 'mastered'
          ? 95
          : meta.forceStatus === 'learned'
          ? Math.max(80, existing.masteryScore)
          : meta.forceStatus === 'learning'
          ? 45
          : 20;
    } else {
      const evaluated = this.masteryEngine.evaluateGrammarProgression(existing);
      if (
        event.eventType === 'GRAMMAR_RULE_INTRODUCED' &&
        STATUS_RANK[existing.status] > STATUS_RANK[evaluated.status]
      ) {
        // Keep higher status
      } else {
        existing.status = evaluated.status;
        existing.masteryScore = Math.max(existing.masteryScore, evaluated.masteryScore);
      }
    }

    if (
      (existing.status === 'learned' || existing.status === 'mastered') &&
      !existing.firstLearnedAt
    ) {
      existing.firstLearnedAt = event.timestamp;
    }

    existing.updatedAt = event.timestamp;
    this.grammarMap.set(bp.id, existing);
    return bp.id;
  }

  // ==========================================================================
  // HIGH-LEVEL DOMAIN HELPERS FOR LEARNING MODULES
  // ==========================================================================

  /**
   * Called when a learner views a Subtopic stage or Lesson explanation/examples.
   * Registers vocabulary as DISCOVERED and grammar rules as INTRODUCED (NOT learned).
   */
  recordSubtopicStageExposure(subtopicId: string, stageNumber: number): void {
    const vocabBps = globalKnowledgeCatalog.getVocabularyBlueprintsForSubtopic(subtopicId);
    const grammarBps = globalKnowledgeCatalog.getGrammarBlueprintsForSubtopic(subtopicId);
    const events: Array<Parameters<GlobalKnowledgeTracker['emitEvent']>[0]> = [];

    if (stageNumber === 1 || stageNumber === 2) {
      for (const g of grammarBps) {
        events.push({
          eventType: 'GRAMMAR_RULE_INTRODUCED',
          knowledgeId: g.id,
          source: {
            courseId: 'nouns',
            subtopicId,
            lessonId: subtopicId,
            activityType: 'grammar_block',
          },
          dedupeWindowKey: `stage_${stageNumber}`,
        });
      }
    }

    if (stageNumber === 1 || stageNumber === 3 || stageNumber === 5) {
      for (const v of vocabBps) {
        events.push({
          eventType: 'VOCABULARY_DISCOVERED',
          knowledgeId: v.id,
          source: {
            courseId: 'nouns',
            subtopicId,
            lessonId: subtopicId,
            activityType: 'vocabulary_card',
          },
          dedupeWindowKey: `stage_${stageNumber}`,
        });
      }
    }

    if (events.length > 0) {
      this.emitBatchEvents(events);
    }
  }

  /**
   * Called when a learner completes a guided practice activity (Stage 4) or inline practice.
   */
  recordPracticeActivityOutcome(params: {
    knowledgeIds: string[];
    isCorrect: boolean;
    source: KnowledgeEventSource;
    attemptKey?: string;
  }): void {
    const events: Array<Parameters<GlobalKnowledgeTracker['emitEvent']>[0]> = [];
    const subtopicId = params.source.subtopicId;

    // Also include subtopic-specific grammar/vocab when generic knowledgeId like kw_noun_concept is used
    const expandedIds = new Set<string>(params.knowledgeIds);
    if (subtopicId) {
      const subGrammar = globalKnowledgeCatalog.getGrammarBlueprintsForSubtopic(subtopicId);
      subGrammar.forEach((g) => expandedIds.add(g.id));
    }

    for (const kid of expandedIds) {
      const isGrammar =
        globalKnowledgeCatalog.isKnownGrammarId(kid) &&
        !globalKnowledgeCatalog.isKnownVocabularyId(kid);

      if (isGrammar) {
        events.push({
          eventType: params.isCorrect
            ? 'GRAMMAR_RULE_ANSWER_CORRECT'
            : 'GRAMMAR_RULE_ANSWER_INCORRECT',
          knowledgeId: kid,
          source: params.source,
          dedupeWindowKey: params.attemptKey || `${Date.now()}_${Math.random()}`,
        });
      } else {
        events.push({
          eventType: params.isCorrect
            ? 'VOCABULARY_ANSWER_CORRECT'
            : 'VOCABULARY_ANSWER_INCORRECT',
          knowledgeId: kid,
          source: params.source,
          dedupeWindowKey: params.attemptKey || `${Date.now()}_${Math.random()}`,
        });
      }
    }

    this.emitBatchEvents(events);
  }

  /**
   * Called when a learner submits a Subtopic or Lesson Assessment (Stage 6).
   * When the learner passes the assessment, target vocabulary and grammar rules tested
   * in the assessment/subtopic transition to 'learned' (or 'mastered' on repeated passes).
   */
  recordSubtopicAssessmentEvaluated(params: {
    subtopicId: string;
    passed: boolean;
    scorePercent: number;
    questionResults: Array<{
      questionId: string;
      knowledgeId: string;
      isCorrect: boolean;
    }>;
    attemptNumber: number;
  }): void {
    const events: Array<Parameters<GlobalKnowledgeTracker['emitEvent']>[0]> = [];
    const source: KnowledgeEventSource = {
      courseId: 'nouns',
      subtopicId: params.subtopicId,
      lessonId: params.subtopicId,
      activityType: 'assessment',
    };

    // 1. Record per-question results
    for (const qRes of params.questionResults) {
      const isGrammar =
        globalKnowledgeCatalog.isKnownGrammarId(qRes.knowledgeId) &&
        !globalKnowledgeCatalog.isKnownVocabularyId(qRes.knowledgeId);

      events.push({
        eventType: isGrammar
          ? qRes.isCorrect
            ? 'GRAMMAR_RULE_ANSWER_CORRECT'
            : 'GRAMMAR_RULE_ANSWER_INCORRECT'
          : qRes.isCorrect
          ? 'VOCABULARY_ANSWER_CORRECT'
          : 'VOCABULARY_ANSWER_INCORRECT',
        knowledgeId: qRes.knowledgeId,
        source: { ...source, exerciseId: qRes.questionId },
        metadata: {
          passedAssessment: params.passed && qRes.isCorrect,
          scorePercent: params.scorePercent,
        },
        dedupeWindowKey: `assess_attempt_${params.attemptNumber}_${qRes.questionId}`,
      });
    }

    // 2. If the learner passed the assessment, mark the subtopic's canonical grammar rules and practiced vocabulary as learned
    if (params.passed) {
      const subGrammar = globalKnowledgeCatalog.getGrammarBlueprintsForSubtopic(params.subtopicId);
      for (const g of subGrammar) {
        events.push({
          eventType: 'GRAMMAR_RULE_LEARNED',
          knowledgeId: g.id,
          source,
          metadata: {
            passedAssessment: true,
            scorePercent: params.scorePercent,
          },
          dedupeWindowKey: `assess_pass_${params.attemptNumber}_${g.id}`,
        });
      }

      const subVocab = globalKnowledgeCatalog.getVocabularyBlueprintsForSubtopic(params.subtopicId);
      for (const v of subVocab) {
        events.push({
          eventType: 'VOCABULARY_ANSWER_CORRECT',
          knowledgeId: v.id,
          source,
          metadata: {
            passedAssessment: true,
            scorePercent: params.scorePercent,
          },
          dedupeWindowKey: `assess_pass_vocab_${params.attemptNumber}_${v.id}`,
        });
      }
    }

    this.emitBatchEvents(events);
  }

  // ==========================================================================
  // STATISTICS & LIBRARY QUERIES
  // ==========================================================================

  getGlobalStatistics(): GlobalKnowledgeStatistics {
    const vocabValues = Array.from(this.vocabMap.values());
    const grammarValues = Array.from(this.grammarMap.values());

    const vocabCounts = {
      discovered: 0,
      learning: 0,
      learned: 0,
      mastered: 0,
      total: vocabValues.length,
    };

    for (const v of vocabValues) {
      vocabCounts[v.status] += 1;
    }

    const grammarCounts = {
      discovered: 0,
      learning: 0,
      learned: 0,
      mastered: 0,
      total: grammarValues.length,
    };

    for (const g of grammarValues) {
      grammarCounts[g.status] += 1;
    }

    return {
      uniqueLearnedWordsCount: vocabCounts.learned + vocabCounts.mastered,
      masteredGrammarRulesCount: grammarCounts.learned + grammarCounts.mastered,
      vocabularyCounts: vocabCounts,
      grammarCounts: grammarCounts,
    };
  }

  getVocabularyRecord(idOrAliasOrWord: string): VocabularyKnowledge | undefined {
    if (this.vocabMap.has(idOrAliasOrWord)) {
      return this.vocabMap.get(idOrAliasOrWord);
    }
    if (globalKnowledgeCatalog.isKnownVocabularyId(idOrAliasOrWord)) {
      const bp = globalKnowledgeCatalog.resolveVocabularyBlueprint(idOrAliasOrWord);
      return this.vocabMap.get(bp.id);
    }
    return undefined;
  }

  getGrammarRecord(idOrRuleKey: string): GrammarKnowledge | undefined {
    if (this.grammarMap.has(idOrRuleKey)) {
      return this.grammarMap.get(idOrRuleKey);
    }
    if (globalKnowledgeCatalog.isKnownGrammarId(idOrRuleKey)) {
      const bp = globalKnowledgeCatalog.resolveGrammarBlueprint(idOrRuleKey);
      return this.grammarMap.get(bp.id);
    }
    return undefined;
  }

  getVocabularyLibrary(query: VocabularyLibraryQuery = {}): VocabularyKnowledge[] {
    let items: VocabularyKnowledge[];

    if (query.includeCatalogUntracked) {
      const allBps = globalKnowledgeCatalog.getAllVocabularyBlueprints();
      items = allBps.map((bp) => {
        const tracked = this.vocabMap.get(bp.id);
        return tracked ? { ...tracked } : this.createVocabFromBlueprint(bp, 0);
      });
    } else {
      items = Array.from(this.vocabMap.values()).map((v) => ({ ...v }));
    }

    if (query.status && query.status !== 'all') {
      if (query.status === 'learned_or_mastered') {
        items = items.filter((i) => i.status === 'learned' || i.status === 'mastered');
      } else {
        items = items.filter((i) => i.status === query.status);
      }
    }

    if (query.levelId && query.levelId !== 'all') {
      items = items.filter((i) => i.levelIds.includes(query.levelId!));
    }

    if (query.courseOrTopicId && query.courseOrTopicId !== 'all') {
      const target = query.courseOrTopicId;
      items = items.filter(
        (i) =>
          i.courseIds.includes(target) ||
          i.topicIds.includes(target) ||
          i.subtopicIds.includes(target) ||
          i.lessonIds.includes(target)
      );
    }

    if (query.searchQuery && query.searchQuery.trim().length > 0) {
      const q = query.searchQuery.trim().toLowerCase();
      items = items.filter(
        (i) =>
          i.displayWord.toLowerCase().includes(q) ||
          i.translation.toLowerCase().includes(q) ||
          (i.partOfSpeech && i.partOfSpeech.toLowerCase().includes(q))
      );
    }

    const sortBy = query.sortBy || 'recently_learned';
    items.sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return a.displayWord.localeCompare(b.displayWord);
      }
      if (sortBy === 'mastery_desc') {
        return b.masteryScore - a.masteryScore || b.updatedAt - a.updatedAt;
      }
      // recently_learned
      const timeA = a.firstLearnedAt || a.lastPracticedAt || a.updatedAt || 0;
      const timeB = b.firstLearnedAt || b.lastPracticedAt || b.updatedAt || 0;
      if (timeB !== timeA) return timeB - timeA;
      return STATUS_RANK[b.status] - STATUS_RANK[a.status];
    });

    return items;
  }

  getGrammarLibrary(query: GrammarLibraryQuery = {}): GrammarKnowledge[] {
    let items: GrammarKnowledge[];

    if (query.includeCatalogUntracked) {
      const allBps = globalKnowledgeCatalog.getAllGrammarBlueprints();
      items = allBps.map((bp) => {
        const tracked = this.grammarMap.get(bp.id);
        return tracked ? { ...tracked } : this.createGrammarFromBlueprint(bp, 0);
      });
    } else {
      items = Array.from(this.grammarMap.values()).map((g) => ({ ...g }));
    }

    if (query.status && query.status !== 'all') {
      if (query.status === 'learned_or_mastered') {
        items = items.filter((i) => i.status === 'learned' || i.status === 'mastered');
      } else {
        items = items.filter((i) => i.status === query.status);
      }
    }

    if (query.levelId && query.levelId !== 'all') {
      items = items.filter((i) => i.levelIds.includes(query.levelId!));
    }

    if (query.topicId && query.topicId !== 'all') {
      const target = query.topicId;
      items = items.filter(
        (i) =>
          i.courseIds.includes(target) ||
          i.topicIds.includes(target) ||
          i.subtopicIds.includes(target) ||
          i.lessonIds.includes(target)
      );
    }

    if (query.searchQuery && query.searchQuery.trim().length > 0) {
      const q = query.searchQuery.trim().toLowerCase();
      items = items.filter(
        (i) =>
          i.title.en.toLowerCase().includes(q) ||
          i.title.uz.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.ruleKey.toLowerCase().includes(q)
      );
    }

    const sortBy = query.sortBy || 'recently_learned';
    items.sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return a.title.uz.localeCompare(b.title.uz);
      }
      if (sortBy === 'mastery_desc') {
        return b.masteryScore - a.masteryScore || b.updatedAt - a.updatedAt;
      }
      const timeA = a.firstLearnedAt || a.lastPracticedAt || a.updatedAt || 0;
      const timeB = b.firstLearnedAt || b.lastPracticedAt || b.updatedAt || 0;
      if (timeB !== timeA) return timeB - timeA;
      return STATUS_RANK[b.status] - STATUS_RANK[a.status];
    });

    return items;
  }

  /**
   * Adapts tracked VocabularyKnowledge records to Legacy LearnedWordItem[] for AppContext compatibility
   */
  toLegacyLearnedWordItems(): LearnedWordItem[] {
    return this.getVocabularyLibrary({ includeCatalogUntracked: true }).map((v) => ({
      id: v.id,
      word: v.displayWord,
      translation: v.translation,
      phonetic: v.pronunciation,
      category: v.partOfSpeech || 'Ot (Noun)',
      status: v.status === 'learned' || v.status === 'mastered' ? 'learned' : 'learning',
      emoji: v.emoji || '📘',
      meaningfulInteractionsCount: v.exposureCount + v.practiceCount,
      correctExercisesCount: v.correctCount,
      reps: v.srsReview?.reps || v.correctCount,
      nextReview: v.srsReview?.nextReviewAt || Date.now() + 86400000,
      isCloudSynced: Boolean(v.isCloudSynced),
      updatedAt: v.updatedAt || Date.now(),
    }));
  }

  /**
   * Adapts tracked GrammarKnowledge records to Legacy MasteredRuleItem[] for AppContext compatibility
   */
  toLegacyMasteredRuleItems(): MasteredRuleItem[] {
    return this.getGrammarLibrary({ includeCatalogUntracked: true }).map((g) => ({
      id: g.id,
      nameUz: g.title.uz,
      nameEn: g.title.en,
      category: g.categoryUz || 'Grammatika',
      shortSummaryUz: g.description,
      formula: g.formula,
      status: g.status === 'learned' || g.status === 'mastered' ? 'learned' : 'learning',
      masteryScore: g.masteryScore,
      exampleEn: g.examples[0]?.en,
      exampleUz: g.examples[0]?.uz,
      isCloudSynced: Boolean(g.isCloudSynced),
      updatedAt: g.updatedAt || Date.now(),
    }));
  }
}

export const globalKnowledgeTracker = new GlobalKnowledgeTracker();
