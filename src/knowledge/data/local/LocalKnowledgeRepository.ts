import { VocabularyKnowledge } from '../../domain/entities/VocabularyKnowledge';
import { GrammarKnowledge } from '../../domain/entities/GrammarKnowledge';
import { KnowledgeEvent } from '../../domain/entities/KnowledgeEvent';
import { talkMeDb } from '../../../core/db/talkMeDb';

const VOCAB_KNOWLEDGE_STORAGE_KEY = 'talkme_global_vocab_knowledge_v3';
const GRAMMAR_KNOWLEDGE_STORAGE_KEY = 'talkme_global_grammar_knowledge_v3';
const PROCESSED_EVENTS_STORAGE_KEY = 'talkme_global_knowledge_events_v3';

export interface KnowledgeStorageSnapshot {
  vocabulary: Record<string, VocabularyKnowledge>;
  grammar: Record<string, GrammarKnowledge>;
  processedEventIds: string[];
}

// Fallback memory store when running in environments without window.localStorage
const memoryFallbackStore: Record<string, string> = {};

function getRawItem(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    // ignore
  }
  return memoryFallbackStore[key] ?? null;
}

function setRawItem(key: string, value: string): void {
  memoryFallbackStore[key] = value;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // ignore quota or security error
  }
}

function removeRawItem(key: string): void {
  delete memoryFallbackStore[key];
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
}

export class LocalKnowledgeRepository {
  loadSnapshot(): KnowledgeStorageSnapshot {
    let vocabulary: Record<string, VocabularyKnowledge> = {};
    let grammar: Record<string, GrammarKnowledge> = {};
    let processedEventIds: string[] = [];

    try {
      const rawVocab = getRawItem(VOCAB_KNOWLEDGE_STORAGE_KEY);
      if (rawVocab) {
        vocabulary = JSON.parse(rawVocab);
      }
    } catch {
      vocabulary = {};
    }

    try {
      const rawGrammar = getRawItem(GRAMMAR_KNOWLEDGE_STORAGE_KEY);
      if (rawGrammar) {
        grammar = JSON.parse(rawGrammar);
      }
    } catch {
      grammar = {};
    }

    try {
      const rawEvents = getRawItem(PROCESSED_EVENTS_STORAGE_KEY);
      if (rawEvents) {
        processedEventIds = JSON.parse(rawEvents);
      }
    } catch {
      processedEventIds = [];
    }

    return {
      vocabulary,
      grammar,
      processedEventIds,
    };
  }

  saveSnapshot(snapshot: KnowledgeStorageSnapshot, latestEvents?: KnowledgeEvent[]): void {
    setRawItem(VOCAB_KNOWLEDGE_STORAGE_KEY, JSON.stringify(snapshot.vocabulary));
    setRawItem(GRAMMAR_KNOWLEDGE_STORAGE_KEY, JSON.stringify(snapshot.grammar));
    setRawItem(PROCESSED_EVENTS_STORAGE_KEY, JSON.stringify(snapshot.processedEventIds));

    // Also mirror asynchronously to Dexie IndexedDB when available
    try {
      const vocabRows = Object.values(snapshot.vocabulary).map((v) => ({
        id: v.id,
        normalizedWord: v.normalizedWord,
        language: v.language,
        status: v.status,
        masteryScore: v.masteryScore,
        updatedAt: v.updatedAt,
        jsonPayload: JSON.stringify(v),
      }));
      if (vocabRows.length > 0 && talkMeDb?.vocabularyKnowledge) {
        talkMeDb.vocabularyKnowledge.bulkPut(vocabRows).catch(() => {});
      }

      const grammarRows = Object.values(snapshot.grammar).map((g) => ({
        id: g.id,
        ruleKey: g.ruleKey,
        status: g.status,
        masteryScore: g.masteryScore,
        updatedAt: g.updatedAt,
        jsonPayload: JSON.stringify(g),
      }));
      if (grammarRows.length > 0 && talkMeDb?.grammarKnowledge) {
        talkMeDb.grammarKnowledge.bulkPut(grammarRows).catch(() => {});
      }

      if (latestEvents && latestEvents.length > 0 && talkMeDb?.processedKnowledgeEvents) {
        talkMeDb.processedKnowledgeEvents
          .bulkPut(
            latestEvents.map((ev) => ({
              eventId: ev.eventId,
              eventType: ev.eventType,
              knowledgeId: ev.knowledgeId,
              timestamp: ev.timestamp,
            }))
          )
          .catch(() => {});
      }
    } catch {
      // Ignore IndexedDB errors in headless/offline environments
    }
  }

  /**
   * Hydrates from IndexedDB if localStorage was cleared but IndexedDB still holds data
   */
  async hydrateFromIndexedDbIfNeeded(): Promise<KnowledgeStorageSnapshot | null> {
    try {
      if (!talkMeDb?.vocabularyKnowledge) return null;
      const [vocabRows, grammarRows, eventRows] = await Promise.all([
        talkMeDb.vocabularyKnowledge.toArray(),
        talkMeDb.grammarKnowledge.toArray(),
        talkMeDb.processedKnowledgeEvents.toArray(),
      ]);

      if (vocabRows.length === 0 && grammarRows.length === 0) {
        return null;
      }

      const vocabulary: Record<string, VocabularyKnowledge> = {};
      for (const row of vocabRows) {
        try {
          vocabulary[row.id] = JSON.parse(row.jsonPayload);
        } catch {
          // ignore
        }
      }

      const grammar: Record<string, GrammarKnowledge> = {};
      for (const row of grammarRows) {
        try {
          grammar[row.id] = JSON.parse(row.jsonPayload);
        } catch {
          // ignore
        }
      }

      const processedEventIds = eventRows.map((e) => e.eventId);

      const hydrated: KnowledgeStorageSnapshot = {
        vocabulary,
        grammar,
        processedEventIds,
      };
      this.saveSnapshot(hydrated);
      return hydrated;
    } catch {
      return null;
    }
  }

  clearAll(): void {
    removeRawItem(VOCAB_KNOWLEDGE_STORAGE_KEY);
    removeRawItem(GRAMMAR_KNOWLEDGE_STORAGE_KEY);
    removeRawItem(PROCESSED_EVENTS_STORAGE_KEY);
    try {
      talkMeDb?.vocabularyKnowledge?.clear().catch(() => {});
      talkMeDb?.grammarKnowledge?.clear().catch(() => {});
      talkMeDb?.processedKnowledgeEvents?.clear().catch(() => {});
    } catch {
      // ignore
    }
  }
}

export const localKnowledgeRepository = new LocalKnowledgeRepository();
