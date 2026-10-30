export type ScreenRoute =
  | 'splash'
  | 'onboarding'
  | 'home'
  | 'courses'
  | 'course_levels'
  | 'lesson_detail'
  | 'quiz'
  | 'lesson_result'
  | 'level_unlocked'
  | 'repeat'
  | 'profile'
  | 'voice_studio'
  | 'voice_settings';

export type LevelNodeType =
  | 'MASCOT_INTRO'
  | 'STAR'
  | 'READING'
  | 'CHEST'
  | 'MIC'
  | 'PRACTICE'
  | 'CAMERA'
  | 'HEADPHONES';

export type LevelStatus = 'COMPLETED' | 'CURRENT' | 'LOCKED';

export interface LevelNodeItem {
  id: string;
  title: string;
  subtitle: string;
  nodeType: LevelNodeType;
  status: LevelStatus;
  stars: number;
  horizontalOffsetRatio: number; // -0.4 to +0.4
  xpReward: number;
}

export enum FsrsState {
  NEW = 0,
  LEARNING = 1,
  REVIEW = 2,
  RELEARNING = 3,
}

export enum Rating {
  AGAIN = 1,
  HARD = 2,
  GOOD = 3,
  EASY = 4,
}

export interface FsrsCard {
  cardId: string;
  wordId: string;
  userId: string;
  stability: number;
  difficulty: number;
  state: FsrsState;
  lastReview: number;
  nextReview: number;
  reps: number;
  lapses: number;
  scheduledDays: number;
  elapsedDays: number;
  schedulerVersion: string;
}

export interface FsrsVocabularyItem {
  card: FsrsCard;
  word: string;
  phonetic: string;
  translation: string;
  exampleEn: string;
  exampleUz: string;
  category: string;
}

export interface FsrsSchedulingInfo {
  card: FsrsCard;
  intervalDays: number;
  nextReviewTimestamp: number;
}

export interface FsrsDailyStats {
  newWordsCount: number;
  dueWordsCount: number;
  learningWordsCount: number;
  completedTodayCount: number;
  totalLearnedCount: number;
  retentionPercentage: number;
  dailyStreakDays: number;
  estimatedMinutesRemaining: number;
}

export type VoiceFamily =
  | 'ADULT_MALE'
  | 'ADULT_FEMALE'
  | 'YOUNG_BOY'
  | 'YOUNG_GIRL'
  | 'TEENAGE_BOY'
  | 'TEENAGE_GIRL';

export interface CharacterProfile {
  id: string;
  family: VoiceFamily;
  nameUz: string;
  nameEn: string;
  iconEmoji: string;
  descriptionUz: string;
  baseRate: number;
  basePitch: number;
  preferredGender: 'male' | 'female';
}

export type EngineSelectionMode = 'LOCAL_FIRST' | 'CLOUD_FIRST' | 'OFFLINE_ONLY' | 'AUTO';

export interface VoiceSettings {
  engineSelectionMode: EngineSelectionMode;
  selectedCharacterProfile: string;
  speechSpeed: number;
  speechPitch: number;
  audioCacheEnabled: boolean;
}

export interface SpeechTestReport {
  selectedEngine: string;
  selectedModel: string;
  selectedVoice: string;
  textLength: number;
  wordCount: number;
  chunkCount: number;
  initializationTimeMs: number;
  firstAudioLatencyMs: number;
  totalGenerationTimeMs: number;
  audioDurationMs: number;
  realTimeFactor: number;
  failedChunks: number;
  userRatingNaturalness: number;
  userRatingEmotion: number;
  userRatingOverall: number;
}
