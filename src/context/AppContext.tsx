import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  ScreenRoute,
  FsrsVocabularyItem,
  FsrsDailyStats,
  Rating,
  VoiceSettings,
  TtsPlaybackStatus,
  CloudSyncStatus,
  LearnedWordItem,
  MasteredRuleItem,
  SkillPracticeType,
} from '../types';
import { INITIAL_VOCABULARY } from '../domain/fsrs/defaultVocab';
import { defaultFsrsScheduler } from '../domain/fsrs/fsrsEngine';
import { getProfileById } from '../domain/voice/catalog';
import { ttsEngine, DialogueTurn } from '../domain/voice/ttsEngine';
import {
  LearningLesson,
  Exercise,
  VocabularyItem,
  GrammarRule,
} from '../features/grammar/types/grammarFrameworkTypes';
import {
  GlobalLearningTrackerState,
  INITIAL_GLOBAL_TRACKER_STATE,
  recordVocabularyExposure,
  recordGrammarRulePerformance,
  recordLessonExerciseOutcome,
  recordLessonAssessmentOutcome,
  recordLessonSectionProgress,
} from '../features/grammar/engine/progressAndMasteryEngine';
import { ExerciseEvaluationOutput } from '../features/grammar/engine/exerciseEngine';
import { GRAMMAR_LESSONS_REGISTRY } from '../features/grammar/content/lessons/lesson01GrammarFundamentals';
import { migrateLessonProgressVersion } from '../features/grammar/validators/lessonContentValidator';
import {
  auth,
  loginWithGoogle,
  logoutUser,
  User,
  handleFirestoreError,
} from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  syncUserProfileToFirestore,
  fetchUserProfileFromFirestore,
  syncLearnedWordToFirestore,
  syncMasteredRuleToFirestore,
  fetchUserLearnedWordsFromFirestore,
  fetchUserMasteredRulesFromFirestore,
  batchSyncLearnedWordsToFirestore,
  FirestoreLearnedWord,
  FirestoreMasteredRule,
} from '../lib/firestoreSync';
import {
  INITIAL_LEARNED_WORDS,
  INITIAL_MASTERED_RULES,
} from '../domain/learning/initialCatalog';
import {
  findCatalogWordById,
  findCatalogRuleById,
} from '../domain/learning/unlockedCurriculumAggregator';
import { globalKnowledgeTracker } from '../knowledge/domain/services/GlobalKnowledgeTracker';
import { localKnowledgeRepository } from '../knowledge/data/local/LocalKnowledgeRepository';

interface AppContextType {
  currentScreen: ScreenRoute;
  screenHistory: ScreenRoute[];
  selectedCourseId: string;
  selectedLevelId: string;
  selectedTopicId: string;
  selectedSkillType: SkillPracticeType;
  selectedFrameworkLessonId: string;
  setSelectedFrameworkLessonId: (lessonId: string) => void;
  navigate: (
    screen: ScreenRoute,
    params?: {
      courseId?: string;
      levelId?: string;
      lessonId?: string;
      topicId?: string;
      skillType?: SkillPracticeType;
    }
  ) => void;
  goBack: () => void;

  // Firebase Auth & Cloud Sync
  currentUser: User | null;
  authLoading: boolean;
  authError: string | null;
  cloudSyncStatus: CloudSyncStatus;
  lastCloudSyncTimestamp: number | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  manualSyncToCloud: () => Promise<void>;

  // Gamification & User Stats
  userName: string;
  userEmail: string | null;
  userPhotoURL: string | null;
  userLevel: string;
  xp: number;
  diamonds: number;
  streakDays: number;
  weeklyCompletedLessons: number;
  weeklyGoalLessons: number;
  completedLevelIds: string[];
  recentlyCompletedLevelId: string | null;
  clearRecentlyCompletedLevel: () => void;
  bookmarkedLessons: string[];
  toggleBookmark: (lessonId: string) => void;
  awardXpAndDiamonds: (xpBonus: number, diamondsBonus: number, levelId?: string) => void;

  // Real Learned Words & Mastered Rules Collections
  userLearnedWords: LearnedWordItem[];
  userMasteredRules: MasteredRuleItem[];
  toggleWordLearned: (wordId: string) => Promise<void>;
  toggleRuleMastered: (ruleId: string) => Promise<void>;
  activeProfileTab: number;
  setActiveProfileTab: (tab: number) => void;

  // Global Grammar & Vocabulary Framework Tracker
  globalTrackerState: GlobalLearningTrackerState;
  uniqueLearnedWordsCount: number;
  masteredGrammarRulesCount: number;
  recordFrameworkRuleOpened: (rule: GrammarRule) => void;
  recordFrameworkVocabExposure: (
    vocabItem: VocabularyItem,
    interactionType:
      | 'explanation_view'
      | 'audio_practice'
      | 'exercise_correct'
      | 'exercise_incorrect'
  ) => void;
  recordFrameworkExerciseEvaluated: (
    lesson: LearningLesson,
    exercise: Exercise,
    result: ExerciseEvaluationOutput
  ) => void;
  recordFrameworkAssessmentSubmitted: (
    lesson: LearningLesson,
    answersByQuestionId: Record<string, string>
  ) => void;
  recordFrameworkSectionProgress: (
    lesson: LearningLesson,
    options: {
      currentSectionIndex: number;
      completedSectionId?: string;
      markLessonCompleted?: boolean;
      timeSpentDeltaSeconds?: number;
      personalizedLearnerName?: string;
    }
  ) => void;
  syncLessonVocabularyToFsrs: (lesson: LearningLesson) => void;

  // FSRS Spaced Repetition
  vocabList: FsrsVocabularyItem[];
  dailyStats: FsrsDailyStats;
  submitFsrsReview: (cardId: string, rating: Rating) => void;
  resetFsrsVocab: () => void;

  // Voice AI Engine (Gemini 3.8 TTS)
  voiceSettings: VoiceSettings;
  updateVoiceSettings: (settings: Partial<VoiceSettings>) => void;
  resetVoiceSettings: () => void;
  playTts: (
    text: string,
    overrideProfileId?: string,
    customStylePrompt?: string
  ) => Promise<boolean>;
  playDialogueTts: (turns: DialogueTurn[]) => Promise<boolean>;
  stopTts: () => void;
  isTtsSpeaking: boolean;
  ttsStatus: TtsPlaybackStatus;
}

const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  engineSelectionMode: 'CLOUD_FIRST',
  selectedCharacterProfile: 'adult_male',
  speechSpeed: 0.92,
  speechPitch: 1.0,
  audioCacheEnabled: true,
  geminiModel: 'gemini-3.8-flash-lite-tts',
};

const GLOBAL_TRACKER_STORAGE_KEY = 'talkme_global_learning_tracker_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenRoute>('home');
  const [screenHistory, setScreenHistory] = useState<ScreenRoute[]>(['home']);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('grammar_fundamentals');
  const [selectedLevelId, setSelectedLevelId] = useState<string>('lvl_1');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('topic_hello_a0');
  const [selectedSkillType, setSelectedSkillType] = useState<SkillPracticeType>('listening');
  const [selectedFrameworkLessonId, setSelectedFrameworkLessonId] = useState<string>(() => {
    const saved = localStorage.getItem('talkme_selected_framework_lesson_id');
    return saved || 'lesson_01_hello_a0';
  });

  // Profile navigation tab helper (0 = So'zlar, 1 = Qoidalar, 2 = Google Hisob, 3 = Reyting, 4 = Ovoz)
  const [activeProfileTab, setActiveProfileTab] = useState<number>(0);

  // Firebase Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>('offline');
  const [lastCloudSyncTimestamp, setLastCloudSyncTimestamp] = useState<number | null>(null);

  // Gamification state
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('talkme_user_name') || 'Aziz';
  });
  const [userLevel] = useState<string>('A2 o‘quvchi');
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('talkme_xp');
    return saved ? parseInt(saved, 10) : 1240;
  });
  const [diamonds, setDiamonds] = useState<number>(() => {
    const saved = localStorage.getItem('talkme_diamonds');
    return saved ? parseInt(saved, 10) : 26032;
  });
  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem('talkme_streak_days');
    return saved ? parseInt(saved, 10) : 7;
  });
  const [weeklyCompletedLessons, setWeeklyCompletedLessons] = useState<number>(3);
  const weeklyGoalLessons = 5;

  const [completedLevelIds, setCompletedLevelIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('talkme_completed_levels_v2');
    return saved ? JSON.parse(saved) : [];
  });
  const [recentlyCompletedLevelId, setRecentlyCompletedLevelId] = useState<string | null>(null);

  const [bookmarkedLessons, setBookmarkedLessons] = useState<string[]>([
    'lesson_01_grammar_fundamentals',
    'lesson_present_continuous',
  ]);

  // Global Knowledge Tracker Reactive State (Single Source of Truth)
  const [knowledgeStats, setKnowledgeStats] = useState(() =>
    globalKnowledgeTracker.getGlobalStatistics()
  );
  const [userLearnedWords, setUserLearnedWords] = useState<LearnedWordItem[]>(() =>
    globalKnowledgeTracker.toLegacyLearnedWordItems()
  );
  const [userMasteredRules, setUserMasteredRules] = useState<MasteredRuleItem[]>(() =>
    globalKnowledgeTracker.toLegacyMasteredRuleItems()
  );

  useEffect(() => {
    // Hydrate from IndexedDB if localStorage was cleared
    localKnowledgeRepository.hydrateFromIndexedDbIfNeeded().then((hydrated) => {
      if (hydrated) {
        globalKnowledgeTracker.loadFromStorage();
        setKnowledgeStats(globalKnowledgeTracker.getGlobalStatistics());
        setUserLearnedWords(globalKnowledgeTracker.toLegacyLearnedWordItems());
        setUserMasteredRules(globalKnowledgeTracker.toLegacyMasteredRuleItems());
      }
    });

    const unsubscribe = globalKnowledgeTracker.subscribe(() => {
      setKnowledgeStats(globalKnowledgeTracker.getGlobalStatistics());
      setUserLearnedWords(globalKnowledgeTracker.toLegacyLearnedWordItems());
      setUserMasteredRules(globalKnowledgeTracker.toLegacyMasteredRuleItems());
    });

    return () => unsubscribe();
  }, []);

  // Global Learning Framework Tracker State
  const [globalTrackerState, setGlobalTrackerState] = useState<GlobalLearningTrackerState>(() => {
    const saved = localStorage.getItem(GLOBAL_TRACKER_STORAGE_KEY);
    if (saved) {
      try {
        const parsed: GlobalLearningTrackerState = JSON.parse(saved);
        const migratedProgressMap = { ...(parsed.lessonProgress || {}) };
        for (const [lessonId, prog] of Object.entries(migratedProgressMap)) {
          const lessonDef = GRAMMAR_LESSONS_REGISTRY[lessonId];
          if (lessonDef) {
            migratedProgressMap[lessonId] = migrateLessonProgressVersion(prog, lessonDef);
          }
        }
        return {
          ...INITIAL_GLOBAL_TRACKER_STATE,
          ...parsed,
          lessonProgress: migratedProgressMap,
        };
      } catch {
        return INITIAL_GLOBAL_TRACKER_STATE;
      }
    }
    return INITIAL_GLOBAL_TRACKER_STATE;
  });

  // FSRS Vocab state
  const [vocabList, setVocabList] = useState<FsrsVocabularyItem[]>(() => {
    const saved = localStorage.getItem('talkme_vocab_list');
    return saved ? JSON.parse(saved) : INITIAL_VOCABULARY;
  });

  // Voice AI Settings state
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(() => {
    const saved = localStorage.getItem('talkme_voice_settings_v2');
    if (saved) {
      try {
        return { ...DEFAULT_VOICE_SETTINGS, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_VOICE_SETTINGS;
      }
    }
    return DEFAULT_VOICE_SETTINGS;
  });

  const [isTtsSpeaking, setIsTtsSpeaking] = useState<boolean>(false);
  const [ttsStatus, setTtsStatus] = useState<TtsPlaybackStatus>(ttsEngine.getStatus());

  useEffect(() => {
    const unsubSpeak = ttsEngine.subscribe(setIsTtsSpeaking);
    const unsubStatus = ttsEngine.subscribeStatus(setTtsStatus);
    return () => {
      unsubSpeak();
      unsubStatus();
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('talkme_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('talkme_diamonds', diamonds.toString());
  }, [diamonds]);

  useEffect(() => {
    localStorage.setItem('talkme_streak_days', streakDays.toString());
  }, [streakDays]);

  useEffect(() => {
    localStorage.setItem('talkme_completed_levels_v2', JSON.stringify(completedLevelIds));
  }, [completedLevelIds]);

  useEffect(() => {
    localStorage.setItem('talkme_vocab_list', JSON.stringify(vocabList));
  }, [vocabList]);

  useEffect(() => {
    localStorage.setItem('talkme_voice_settings_v2', JSON.stringify(voiceSettings));
  }, [voiceSettings]);

  useEffect(() => {
    localStorage.setItem(GLOBAL_TRACKER_STORAGE_KEY, JSON.stringify(globalTrackerState));
  }, [globalTrackerState]);

  useEffect(() => {
    localStorage.setItem('talkme_selected_framework_lesson_id', selectedFrameworkLessonId);
  }, [selectedFrameworkLessonId]);

  // Cloud sync helper to push full profile
  const syncProfileToCloud = useCallback(
    async (userId: string, currentXp: number, currentDiamonds: number, currentStreak: number) => {
      try {
        setCloudSyncStatus('syncing');
        const stats = globalKnowledgeTracker.getGlobalStatistics();

        await syncUserProfileToFirestore(userId, {
          displayName: currentUser?.displayName || userName,
          email: currentUser?.email || null,
          photoURL: currentUser?.photoURL || null,
          xp: currentXp,
          diamonds: currentDiamonds,
          streakDays: currentStreak,
          uniqueLearnedWordsCount: stats.uniqueLearnedWordsCount,
          masteredGrammarRulesCount: stats.masteredGrammarRulesCount,
        });
        setCloudSyncStatus('synced');
        setLastCloudSyncTimestamp(Date.now());
      } catch (err) {
        console.error('Failed to sync profile to cloud:', err);
        setCloudSyncStatus('error');
      }
    },
    [currentUser, userName]
  );

  // Load user data from Firestore upon login & merge into GlobalKnowledgeTracker
  const loadCloudUserData = useCallback(
    async (fbUser: User) => {
      setCloudSyncStatus('syncing');
      try {
        const stats = globalKnowledgeTracker.getGlobalStatistics();
        const cloudProfile = await fetchUserProfileFromFirestore(fbUser.uid);
        if (cloudProfile) {
          if (cloudProfile.xp && cloudProfile.xp > xp) setXp(cloudProfile.xp);
          if (cloudProfile.diamonds && cloudProfile.diamonds > diamonds)
            setDiamonds(cloudProfile.diamonds);
          if (cloudProfile.streakDays) setStreakDays(cloudProfile.streakDays);
        } else {
          await syncUserProfileToFirestore(fbUser.uid, {
            displayName: fbUser.displayName,
            email: fbUser.email,
            photoURL: fbUser.photoURL,
            xp,
            diamonds,
            streakDays,
            uniqueLearnedWordsCount: stats.uniqueLearnedWordsCount,
            masteredGrammarRulesCount: stats.masteredGrammarRulesCount,
          });
        }

        // Fetch cloud words and merge into globalKnowledgeTracker
        const cloudWords = await fetchUserLearnedWordsFromFirestore(fbUser.uid);
        if (cloudWords.length > 0) {
          const events: Array<Parameters<typeof globalKnowledgeTracker.emitEvent>[0]> = [];
          for (const cw of cloudWords) {
            events.push({
              eventType:
                cw.status === 'learned' ? 'VOCABULARY_ANSWER_CORRECT' : 'VOCABULARY_PRACTICED',
              knowledgeId: cw.wordId,
              metadata: {
                word: cw.word,
                translation: cw.translation,
                pronunciation: cw.phonetic,
                partOfSpeech: cw.category,
                forceStatus: cw.status === 'learned' ? 'learned' : 'learning',
              },
              dedupeWindowKey: `cloud_word_${cw.wordId}_${cw.updatedAt || 1}`,
            });
          }
          globalKnowledgeTracker.emitBatchEvents(events);
        } else {
          const trackedWords = globalKnowledgeTracker.toLegacyLearnedWordItems().filter(
            (w) => w.status === 'learned'
          );
          if (trackedWords.length > 0) {
            const wordsToUpload: FirestoreLearnedWord[] = trackedWords.map((w) => ({
              wordId: w.id,
              word: w.word,
              translation: w.translation,
              phonetic: w.phonetic,
              category: w.category,
              status: w.status,
              meaningfulInteractionsCount: w.meaningfulInteractionsCount,
              correctExercisesCount: w.correctExercisesCount,
              reps: w.reps,
              nextReview: w.nextReview,
              updatedAt: w.updatedAt,
            }));
            await batchSyncLearnedWordsToFirestore(fbUser.uid, wordsToUpload);
          }
        }

        // Fetch cloud grammar rules and merge into globalKnowledgeTracker
        const cloudRules = await fetchUserMasteredRulesFromFirestore(fbUser.uid);
        if (cloudRules.length > 0) {
          const events: Array<Parameters<typeof globalKnowledgeTracker.emitEvent>[0]> = [];
          for (const cr of cloudRules) {
            events.push({
              eventType:
                cr.status === 'learned' ? 'GRAMMAR_RULE_LEARNED' : 'GRAMMAR_RULE_PRACTICED',
              knowledgeId: cr.ruleId,
              metadata: {
                titleUz: cr.titleUz,
                forceStatus: cr.status === 'learned' ? 'learned' : 'learning',
              },
              dedupeWindowKey: `cloud_rule_${cr.ruleId}_${cr.updatedAt || 1}`,
            });
          }
          globalKnowledgeTracker.emitBatchEvents(events);
        } else {
          const trackedRules = globalKnowledgeTracker.toLegacyMasteredRuleItems().filter(
            (r) => r.status === 'learned'
          );
          for (const rule of trackedRules) {
            await syncMasteredRuleToFirestore(fbUser.uid, {
              ruleId: rule.id,
              titleUz: rule.nameUz,
              category: rule.category,
              status: rule.status,
              masteryScore: rule.masteryScore,
              successfulExercisesCount: 3,
              updatedAt: rule.updatedAt,
            });
          }
        }

        setCloudSyncStatus('synced');
        setLastCloudSyncTimestamp(Date.now());
      } catch (err) {
        console.error('Error synchronizing with cloud upon login:', err);
        setCloudSyncStatus('error');
      }
    },
    [xp, diamonds, streakDays]
  );

  // Monitor Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setAuthLoading(false);
      if (fbUser) {
        setCurrentUser(fbUser);
        if (fbUser.displayName) {
          setUserName(fbUser.displayName);
          localStorage.setItem('talkme_user_name', fbUser.displayName);
        }
        await loadCloudUserData(fbUser);
      } else {
        setCurrentUser(null);
        setCloudSyncStatus('offline');
      }
    });

    return () => unsubscribe();
  }, [loadCloudUserData]);

  // Google Sign-In Action
  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      setAuthLoading(true);
      const user = await loginWithGoogle();
      setCurrentUser(user);
      if (user.displayName) {
        setUserName(user.displayName);
        localStorage.setItem('talkme_user_name', user.displayName);
      }
      await loadCloudUserData(user);
    } catch (err: unknown) {
      console.error('Google Sign-In failed:', err);
      const msg = err instanceof Error ? err.message : 'Google orqali kirishda xatolik yuz berdi';
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  // Google Sign-Out Action
  const signOutUser = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      setCloudSyncStatus('offline');
      setUserName('Aziz');
      localStorage.setItem('talkme_user_name', 'Aziz');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // Manual Trigger to re-sync
  const manualSyncToCloud = async () => {
    if (!currentUser) return;
    await syncProfileToCloud(currentUser.uid, xp, diamonds, streakDays);
  };

  // Toggle Learned Status of a Word via GlobalKnowledgeTracker
  const toggleWordLearned = async (wordId: string) => {
    const existing = globalKnowledgeTracker.getVocabularyRecord(wordId);
    const isCurrentlyLearned =
      existing?.status === 'learned' || existing?.status === 'mastered';
    const nextForceStatus = isCurrentlyLearned ? 'learning' : 'learned';

    const result = globalKnowledgeTracker.emitEvent({
      eventType: isCurrentlyLearned ? 'VOCABULARY_PRACTICED' : 'VOCABULARY_ANSWER_CORRECT',
      knowledgeId: wordId,
      metadata: {
        forceStatus: nextForceStatus,
        passedAssessment: !isCurrentlyLearned,
      },
      dedupeWindowKey: `toggle_word_${wordId}_${Date.now()}`,
    });

    const updatedRecord = globalKnowledgeTracker.getVocabularyRecord(result.canonicalKnowledgeId);
    if (currentUser && updatedRecord) {
      try {
        await syncLearnedWordToFirestore(currentUser.uid, {
          wordId: updatedRecord.id,
          word: updatedRecord.displayWord,
          translation: updatedRecord.translation,
          phonetic: updatedRecord.pronunciation,
          category: updatedRecord.partOfSpeech || 'Ot (Noun)',
          status:
            updatedRecord.status === 'learned' || updatedRecord.status === 'mastered'
              ? 'learned'
              : 'learning',
          meaningfulInteractionsCount:
            updatedRecord.exposureCount + updatedRecord.practiceCount,
          correctExercisesCount: updatedRecord.correctCount,
          reps: updatedRecord.srsReview?.reps || updatedRecord.correctCount,
          nextReview: updatedRecord.srsReview?.nextReviewAt || Date.now() + 86400000,
          updatedAt: updatedRecord.updatedAt,
        });
        setCloudSyncStatus('synced');
        setLastCloudSyncTimestamp(Date.now());
      } catch (err) {
        console.error('Failed to sync word to Firestore:', err);
      }
    }
  };

  // Toggle Mastered Status of a Grammar Rule via GlobalKnowledgeTracker
  const toggleRuleMastered = async (ruleId: string) => {
    const existing = globalKnowledgeTracker.getGrammarRecord(ruleId);
    const isCurrentlyLearned =
      existing?.status === 'learned' || existing?.status === 'mastered';
    const nextForceStatus = isCurrentlyLearned ? 'learning' : 'learned';

    const result = globalKnowledgeTracker.emitEvent({
      eventType: isCurrentlyLearned ? 'GRAMMAR_RULE_PRACTICED' : 'GRAMMAR_RULE_LEARNED',
      knowledgeId: ruleId,
      metadata: {
        forceStatus: nextForceStatus,
        passedAssessment: !isCurrentlyLearned,
      },
      dedupeWindowKey: `toggle_rule_${ruleId}_${Date.now()}`,
    });

    const updatedRecord = globalKnowledgeTracker.getGrammarRecord(result.canonicalKnowledgeId);
    if (currentUser && updatedRecord) {
      try {
        await syncMasteredRuleToFirestore(currentUser.uid, {
          ruleId: updatedRecord.id,
          titleUz: updatedRecord.title.uz,
          category: updatedRecord.categoryUz || 'Grammatika',
          status:
            updatedRecord.status === 'learned' || updatedRecord.status === 'mastered'
              ? 'learned'
              : 'learning',
          masteryScore: updatedRecord.masteryScore,
          successfulExercisesCount: updatedRecord.correctCount,
          updatedAt: updatedRecord.updatedAt,
        });
        setCloudSyncStatus('synced');
        setLastCloudSyncTimestamp(Date.now());
      } catch (err) {
        console.error('Failed to sync rule to Firestore:', err);
      }
    }
  };

  const navigate = (
    screen: ScreenRoute,
    params?: {
      courseId?: string;
      levelId?: string;
      lessonId?: string;
      topicId?: string;
      skillType?: SkillPracticeType;
    }
  ) => {
    if (params?.courseId) setSelectedCourseId(params.courseId);
    if (params?.levelId) setSelectedLevelId(params.levelId);
    if (params?.lessonId) setSelectedFrameworkLessonId(params.lessonId);
    if (params?.topicId) setSelectedTopicId(params.topicId);
    if (params?.skillType) setSelectedSkillType(params.skillType);
    setScreenHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setScreenHistory((prev) => {
      if (prev.length <= 1) {
        setCurrentScreen('home');
        return ['home'];
      }
      const nextHistory = prev.slice(0, prev.length - 1);
      const prevScreen = nextHistory[nextHistory.length - 1];
      setCurrentScreen(prevScreen);
      return nextHistory;
    });
  };

  const toggleBookmark = (lessonId: string) => {
    setBookmarkedLessons((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const awardXpAndDiamonds = (xpBonus: number, diamondsBonus: number, levelId?: string) => {
    setXp((prev) => {
      const nextXp = prev + xpBonus;
      if (currentUser) {
        syncProfileToCloud(currentUser.uid, nextXp, diamonds + diamondsBonus, streakDays);
      }
      return nextXp;
    });
    setDiamonds((prev) => prev + diamondsBonus);
    if (levelId && !completedLevelIds.includes(levelId)) {
      setCompletedLevelIds((prev) => [...prev, levelId]);
      setRecentlyCompletedLevelId(levelId);
      setWeeklyCompletedLessons((prev) => Math.min(5, prev + 1));
    }
  };

  const clearRecentlyCompletedLevel = () => {
    setRecentlyCompletedLevelId(null);
  };

  // ==================== FRAMEWORK TRACKER HANDLERS ====================
  const recordFrameworkRuleOpened = (rule: GrammarRule) => {
    setGlobalTrackerState((prev) =>
      recordGrammarRulePerformance(prev, rule, { type: 'explanation_opened' })
    );
    globalKnowledgeTracker.emitEvent({
      eventType: 'GRAMMAR_RULE_INTRODUCED',
      knowledgeId: rule.id,
      source: {
        courseId: 'grammar_fundamentals',
        lessonId: rule.relatedLessonIds?.[0] || 'lesson_01_grammar_fundamentals',
        activityType: 'grammar_block',
      },
      metadata: {
        titleEn: rule.nameEn,
        titleUz: rule.nameUz,
        description: rule.shortSummaryUz,
        formula: rule.formula,
      },
      dedupeWindowKey: `fw_rule_open_${rule.id}`,
    });
  };

  const recordFrameworkVocabExposure = (
    vocabItem: VocabularyItem,
    interactionType:
      | 'explanation_view'
      | 'audio_practice'
      | 'exercise_correct'
      | 'exercise_incorrect'
  ) => {
    setGlobalTrackerState((prev) =>
      recordVocabularyExposure(prev, vocabItem, interactionType)
    );

    const eventType =
      interactionType === 'exercise_correct'
        ? 'VOCABULARY_ANSWER_CORRECT'
        : interactionType === 'exercise_incorrect'
        ? 'VOCABULARY_ANSWER_INCORRECT'
        : interactionType === 'audio_practice'
        ? 'VOCABULARY_PRACTICED'
        : 'VOCABULARY_DISCOVERED';

    globalKnowledgeTracker.emitEvent({
      eventType,
      knowledgeId: vocabItem.id,
      source: {
        courseId: 'grammar_fundamentals',
        activityType: 'vocabulary_card',
      },
      metadata: {
        word: vocabItem.wordEn,
        translation: vocabItem.translationUz,
        pronunciation: vocabItem.ipa,
        partOfSpeech: vocabItem.partOfSpeech,
        emoji: vocabItem.visualEmoji,
        exampleEn: vocabItem.exampleEn,
        exampleUz: vocabItem.exampleUz,
      },
      dedupeWindowKey: `fw_vocab_${vocabItem.id}_${interactionType}_${Date.now()}`,
    });
  };

  const recordFrameworkExerciseEvaluated = (
    lesson: LearningLesson,
    exercise: Exercise,
    result: ExerciseEvaluationOutput
  ) => {
    setGlobalTrackerState((prev) => {
      const outcome = recordLessonExerciseOutcome(prev, lesson, exercise, result.isCorrect);
      if (outcome.xpJustAwarded > 0) {
        awardXpAndDiamonds(outcome.xpJustAwarded, 2);
      }
      return outcome.nextState;
    });

    const events: Array<Parameters<typeof globalKnowledgeTracker.emitEvent>[0]> = [];
    for (const ruleId of exercise.relatedGrammarRuleIds || []) {
      events.push({
        eventType: result.isCorrect
          ? 'GRAMMAR_RULE_ANSWER_CORRECT'
          : 'GRAMMAR_RULE_ANSWER_INCORRECT',
        knowledgeId: ruleId,
        source: {
          courseId: 'grammar_fundamentals',
          levelId: lesson.level,
          lessonId: lesson.id,
          exerciseId: exercise.id,
          activityType: 'guided_practice',
        },
        dedupeWindowKey: `fw_ex_rule_${exercise.id}_${ruleId}_${Date.now()}`,
      });
    }

    for (const vocabId of exercise.relatedVocabularyIds || []) {
      events.push({
        eventType: result.isCorrect
          ? 'VOCABULARY_ANSWER_CORRECT'
          : 'VOCABULARY_ANSWER_INCORRECT',
        knowledgeId: vocabId,
        source: {
          courseId: 'grammar_fundamentals',
          levelId: lesson.level,
          lessonId: lesson.id,
          exerciseId: exercise.id,
          activityType: 'guided_practice',
        },
        dedupeWindowKey: `fw_ex_vocab_${exercise.id}_${vocabId}_${Date.now()}`,
      });
    }

    if (events.length > 0) {
      globalKnowledgeTracker.emitBatchEvents(events);
    }
  };

  const recordFrameworkAssessmentSubmitted = (
    lesson: LearningLesson,
    answersByQuestionId: Record<string, string>
  ) => {
    setGlobalTrackerState((prev) => {
      const outcome = recordLessonAssessmentOutcome(prev, lesson, answersByQuestionId);
      if (outcome.xpJustAwarded > 0) {
        awardXpAndDiamonds(outcome.xpJustAwarded, 15);
      }
      return outcome.nextState;
    });

    const events: Array<Parameters<typeof globalKnowledgeTracker.emitEvent>[0]> = [];
    for (const rule of lesson.grammarRules || []) {
      events.push({
        eventType: 'GRAMMAR_RULE_LEARNED',
        knowledgeId: rule.id,
        source: {
          courseId: 'grammar_fundamentals',
          levelId: lesson.level,
          lessonId: lesson.id,
          activityType: 'assessment',
        },
        metadata: {
          passedAssessment: true,
        },
        dedupeWindowKey: `fw_assess_rule_${lesson.id}_${rule.id}_${Date.now()}`,
      });
    }

    for (const voc of lesson.vocabulary || []) {
      events.push({
        eventType: 'VOCABULARY_ANSWER_CORRECT',
        knowledgeId: voc.id,
        source: {
          courseId: 'grammar_fundamentals',
          levelId: lesson.level,
          lessonId: lesson.id,
          activityType: 'assessment',
        },
        metadata: {
          passedAssessment: true,
        },
        dedupeWindowKey: `fw_assess_voc_${lesson.id}_${voc.id}_${Date.now()}`,
      });
    }

    if (events.length > 0) {
      globalKnowledgeTracker.emitBatchEvents(events);
    }
  };

  const recordFrameworkSectionProgress = (
    lesson: LearningLesson,
    options: {
      currentSectionIndex: number;
      completedSectionId?: string;
      markLessonCompleted?: boolean;
      timeSpentDeltaSeconds?: number;
      personalizedLearnerName?: string;
    }
  ) => {
    setGlobalTrackerState((prev) => {
      const outcome = recordLessonSectionProgress(prev, lesson, options);
      if (outcome.xpJustAwarded > 0) {
        awardXpAndDiamonds(outcome.xpJustAwarded, 20);
      }
      return outcome.nextState;
    });
  };

  const syncLessonVocabularyToFsrs = (lesson: LearningLesson) => {
    const targetVocab = lesson.vocabulary.filter((v) => v.isTargetVocabulary);
    setVocabList((prev) => {
      const existingWords = new Set(prev.map((item) => item.word.trim().toLowerCase()));
      const newItems: FsrsVocabularyItem[] = [];
      for (const voc of targetVocab) {
        const key = voc.wordEn.trim().toLowerCase();
        if (!existingWords.has(key)) {
          existingWords.add(key);
          newItems.push({
            card: {
              cardId: `card_${voc.id}`,
              wordId: voc.id,
              userId: currentUser?.uid || 'user_default',
              stability: 0.40255,
              difficulty: 5.0,
              state: 0,
              lastReview: Date.now() - 24 * 60 * 60 * 1000,
              nextReview: Date.now() - 1000,
              reps: 0,
              lapses: 0,
              scheduledDays: 0,
              elapsedDays: 1,
              schedulerVersion: 'FSRS-6',
            },
            word: voc.wordEn,
            phonetic: voc.ipa,
            translation: voc.translationUz,
            exampleEn: voc.exampleEn,
            exampleUz: voc.exampleUz,
            category: `${lesson.level} • ${voc.partOfSpeech}`,
          });
        }
      }
      return [...newItems, ...prev];
    });
  };

  // Global Knowledge Counts directly from GlobalKnowledgeTracker
  const uniqueLearnedWordsCount = knowledgeStats.uniqueLearnedWordsCount;
  const masteredGrammarRulesCount = knowledgeStats.masteredGrammarRulesCount;

  const submitFsrsReview = (cardId: string, rating: Rating) => {
    setVocabList((prev) =>
      prev.map((item) => {
        if (item.card.cardId !== cardId) return item;
        const now = Date.now();
        const schedMap = defaultFsrsScheduler.repeat(item.card, now);
        const schedInfo = schedMap[rating];
        const updatedCard = schedInfo.card;

        // Emit real FSRS review event to GlobalKnowledgeTracker
        globalKnowledgeTracker.emitEvent({
          eventType: 'VOCABULARY_REVIEW_COMPLETED',
          knowledgeId: item.card.wordId || item.word,
          source: {
            activityType: 'fsrs_review',
            exerciseId: cardId,
          },
          metadata: {
            word: item.word,
            translation: item.translation,
            pronunciation: item.phonetic,
            partOfSpeech: item.category,
            exampleEn: item.exampleEn,
            exampleUz: item.exampleUz,
            fsrsRating: rating,
            fsrsReps: updatedCard.reps,
            fsrsStabilityDays: updatedCard.stability,
            fsrsNextReviewAt: updatedCard.nextReview,
            cardId: updatedCard.cardId,
          },
          dedupeWindowKey: `fsrs_${cardId}_${now}`,
        });

        return {
          ...item,
          card: updatedCard,
        };
      })
    );
    awardXpAndDiamonds(5, 1);
  };

  const resetFsrsVocab = () => {
    setVocabList(INITIAL_VOCABULARY);
    localStorage.removeItem('talkme_vocab_list');
  };

  const updateVoiceSettings = (settings: Partial<VoiceSettings>) => {
    setVoiceSettings((prev) => ({
      ...prev,
      ...settings,
    }));
  };

  const resetVoiceSettings = () => {
    setVoiceSettings(DEFAULT_VOICE_SETTINGS);
  };

  const playTts = (
    text: string,
    overrideProfileId?: string,
    customStylePrompt?: string
  ): Promise<boolean> => {
    const profile = overrideProfileId
      ? getProfileById(overrideProfileId)
      : getProfileById(voiceSettings.selectedCharacterProfile);
    return ttsEngine.speak(text, voiceSettings, profile, customStylePrompt);
  };

  const playDialogueTts = (turns: DialogueTurn[]): Promise<boolean> => {
    return ttsEngine.speakDialogue(turns, voiceSettings);
  };

  const stopTts = () => {
    ttsEngine.stop();
  };

  const now = Date.now();
  const dueItems = vocabList.filter((item) => item.card.nextReview <= now);
  const completedToday = vocabList.filter(
    (item) => item.card.lastReview >= now - 24 * 60 * 60 * 1000 && item.card.reps > 0
  );

  const dailyStats: FsrsDailyStats = {
    newWordsCount: vocabList.filter((item) => item.card.reps === 0).length,
    dueWordsCount: dueItems.length,
    learningWordsCount: vocabList.filter((item) => item.card.state === 1).length,
    completedTodayCount: completedToday.length,
    totalLearnedCount: uniqueLearnedWordsCount,
    retentionPercentage: 94,
    dailyStreakDays: streakDays,
    estimatedMinutesRemaining: Math.max(1, Math.ceil(dueItems.length * 0.6)),
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        screenHistory,
        selectedCourseId,
        selectedLevelId,
        selectedTopicId,
        selectedSkillType,
        selectedFrameworkLessonId,
        setSelectedFrameworkLessonId,
        navigate,
        goBack,
        currentUser,
        authLoading,
        authError,
        cloudSyncStatus,
        lastCloudSyncTimestamp,
        signInWithGoogle,
        signOutUser,
        manualSyncToCloud,
        userName,
        userEmail: currentUser?.email || null,
        userPhotoURL: currentUser?.photoURL || null,
        userLevel,
        xp,
        diamonds,
        streakDays,
        weeklyCompletedLessons,
        weeklyGoalLessons,
        completedLevelIds,
        recentlyCompletedLevelId,
        clearRecentlyCompletedLevel,
        bookmarkedLessons,
        toggleBookmark,
        awardXpAndDiamonds,
        userLearnedWords,
        userMasteredRules,
        toggleWordLearned,
        toggleRuleMastered,
        activeProfileTab,
        setActiveProfileTab,
        globalTrackerState,
        uniqueLearnedWordsCount,
        masteredGrammarRulesCount,
        recordFrameworkRuleOpened,
        recordFrameworkVocabExposure,
        recordFrameworkExerciseEvaluated,
        recordFrameworkAssessmentSubmitted,
        recordFrameworkSectionProgress,
        syncLessonVocabularyToFsrs,
        vocabList,
        dailyStats,
        submitFsrsReview,
        resetFsrsVocab,
        voiceSettings,
        updateVoiceSettings,
        resetVoiceSettings,
        playTts,
        playDialogueTts,
        stopTts,
        isTtsSpeaking,
        ttsStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
