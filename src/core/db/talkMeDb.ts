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

export class TalkMeLocalDatabase extends Dexie {
  lessonProgress!: Table<StoredLessonProgress, string>;
  practiceProgress!: Table<StoredPracticeNodeProgress, string>;
  knowledgeStates!: Table<StoredKnowledgeState, string>;
  audioCache!: Table<StoredAudioCacheEntry, string>;
  contentPacks!: Table<StoredContentPack, string>;

  constructor() {
    super('TalkMeOfflineDB_v1');
    this.version(1).stores({
      lessonProgress: 'lessonId, subtopicId, majorTopicId, completed, updatedAt',
      practiceProgress: 'id, practicePathId, exerciseId, unlocked, completed',
      knowledgeStates: 'knowledgeId, domain, topicId, subtopicId, masteryScore, nextReviewAt',
      audioCache: 'cacheKey, provider, voiceName, createdAt',
      contentPacks: 'packId, schemaVersion, installedAt',
    });
  }
}

export const talkMeDb = new TalkMeLocalDatabase();

export async function exportLocalLearningSnapshot(): Promise<string> {
  const [lessons, practices, knowledge] = await Promise.all([
    talkMeDb.lessonProgress.toArray(),
    talkMeDb.practiceProgress.toArray(),
    talkMeDb.knowledgeStates.toArray(),
  ]);
  return JSON.stringify(
    {
      exportedAt: Date.now(),
      schemaVersion: '1.0.0',
      lessons,
      practices,
      knowledge,
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
    return true;
  } catch {
    return false;
  }
}
