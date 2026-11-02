import Dexie, { type Table } from 'dexie';

export interface StoredLessonProgress {
  lessonId: string;
  subtopicId: string;
  majorTopicId: string;
  completed: boolean;
  currentSectionIndex: number;
  score: number;
  attempts: number;
  completedAt?: number;
  updatedAt: number;
}

export interface StoredPracticeNodeProgress {
  id: string; // `${practicePathId}__${exerciseId}`
  practicePathId: string;
  exerciseId: string;
  unlocked: boolean;
  completed: boolean;
  bestScore: number;
  lastScore: number;
  attempts: number;
  completedAt?: number;
  updatedAt: number;
}

export interface StoredKnowledgeState {
  knowledgeId: string;
  domain: string;
  topicId: string;
  subtopicId: string;
  termEn: string;
  meaningUz: string;
  masteryScore: number; // 0 to 100
  exposuresCount: number;
  correctCount: number;
  incorrectCount: number;
  stabilityDays: number;
  lastPracticedAt: number;
  nextReviewAt: number;
}

export interface StoredAudioCacheEntry {
  cacheKey: string;
  text: string;
  provider: 'gemini' | 'native';
  voiceName: string;
  audioBase64: string;
  mimeType: string;
  createdAt: number;
}

export interface StoredContentPack {
  packId: string;
  schemaVersion: string;
  title: string;
  jsonPayload: string;
  installedAt: number;
}

export interface StoredVocabularyKnowledgeRecord {
  id: string;
  normalizedWord: string;
  language: string;
  status: 'discovered' | 'learning' | 'learned' | 'mastered';
  masteryScore: number;
  updatedAt: number;
  jsonPayload: string;
}

export interface StoredGrammarKnowledgeRecord {
  id: string;
  ruleKey: string;
  status: 'discovered' | 'learning' | 'learned' | 'mastered';
  masteryScore: number;
  updatedAt: number;
  jsonPayload: string;
}

export interface StoredProcessedKnowledgeEvent {
  eventId: string;
  eventType: string;
  knowledgeId: string;
  timestamp: number;
}

export class TalkMeLocalDatabase extends Dexie {
  lessonProgress!: Table<StoredLessonProgress, string>;
  practiceProgress!: Table<StoredPracticeNodeProgress, string>;
  knowledgeStates!: Table<StoredKnowledgeState, string>;
  audioCache!: Table<StoredAudioCacheEntry, string>;
  contentPacks!: Table<StoredContentPack, string>;
  vocabularyKnowledge!: Table<StoredVocabularyKnowledgeRecord, string>;
  grammarKnowledge!: Table<StoredGrammarKnowledgeRecord, string>;
  processedKnowledgeEvents!: Table<StoredProcessedKnowledgeEvent, string>;

  constructor() {
    super('TalkMeOfflineDB_v1');
    this.version(1).stores({
      lessonProgress: 'lessonId, subtopicId, majorTopicId, completed, updatedAt',
      practiceProgress: 'id, practicePathId, exerciseId, unlocked, completed',
      knowledgeStates: 'knowledgeId, domain, topicId, subtopicId, masteryScore, nextReviewAt',
      audioCache: 'cacheKey, provider, voiceName, createdAt',
      contentPacks: 'packId, schemaVersion, installedAt',
    });
    this.version(2).stores({
      lessonProgress: 'lessonId, subtopicId, majorTopicId, completed, updatedAt',
      practiceProgress: 'id, practicePathId, exerciseId, unlocked, completed',
      knowledgeStates: 'knowledgeId, domain, topicId, subtopicId, masteryScore, nextReviewAt',
      audioCache: 'cacheKey, provider, voiceName, createdAt',
      contentPacks: 'packId, schemaVersion, installedAt',
      vocabularyKnowledge: 'id, normalizedWord, status, masteryScore, updatedAt',
      grammarKnowledge: 'id, ruleKey, status, masteryScore, updatedAt',
      processedKnowledgeEvents: 'eventId, eventType, knowledgeId, timestamp',
    });
  }
}

export const talkMeDb = new TalkMeLocalDatabase();

export async function exportLocalLearningSnapshot(): Promise<string> {
  const [lessons, practices, knowledge, vocabKnowledge, grammarKnowledge, events] =
    await Promise.all([
      talkMeDb.lessonProgress.toArray(),
      talkMeDb.practiceProgress.toArray(),
      talkMeDb.knowledgeStates.toArray(),
      talkMeDb.vocabularyKnowledge.toArray(),
      talkMeDb.grammarKnowledge.toArray(),
      talkMeDb.processedKnowledgeEvents.toArray(),
    ]);
  return JSON.stringify(
    {
      exportedAt: Date.now(),
      schemaVersion: '2.0.0',
      lessons,
      practices,
      knowledge,
      vocabKnowledge,
      grammarKnowledge,
      events,
    },
    null,
    2
  );
}

export async function importLocalLearningSnapshot(jsonString: string): Promise<boolean> {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed.lessons)) {
      await talkMeDb.lessonProgress.bulkPut(parsed.lessons);
    }
    if (Array.isArray(parsed.practices)) {
      await talkMeDb.practiceProgress.bulkPut(parsed.practices);
    }
    if (Array.isArray(parsed.knowledge)) {
      await talkMeDb.knowledgeStates.bulkPut(parsed.knowledge);
    }
    if (Array.isArray(parsed.vocabKnowledge)) {
      await talkMeDb.vocabularyKnowledge.bulkPut(parsed.vocabKnowledge);
    }
    if (Array.isArray(parsed.grammarKnowledge)) {
      await talkMeDb.grammarKnowledge.bulkPut(parsed.grammarKnowledge);
    }
    if (Array.isArray(parsed.events)) {
      await talkMeDb.processedKnowledgeEvents.bulkPut(parsed.events);
    }
    return true;
  } catch {
    return false;
  }
}
