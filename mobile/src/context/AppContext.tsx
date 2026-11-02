import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  ScreenRoute,
  FsrsVocabularyItem,
  FsrsDailyStats,
  Rating,
  VoiceSettings,
  LearnedWordItem,
  MasteredRuleItem,
  SkillPracticeType,
} from '../types';
import { INITIAL_VOCABULARY } from '../domain/fsrs/defaultVocab';
import { defaultFsrsScheduler } from '../domain/fsrs/fsrsEngine';
import { INITIAL_LEARNED_WORDS, INITIAL_MASTERED_RULES } from '../domain/learning/initialCatalog';
import { mobileTtsEngine } from '../domain/voice/mobileTtsEngine';
import { getJson, setJson } from '../storage/localStore';

/**
 * Mobile port of `src/context/AppContext.tsx`.
 *
 * Scope decisions vs. the web version (documented for follow-up work):
 *  - Firebase Auth / Firestore cloud sync is stubbed out (local-only). Wiring
 *    real auth requires adding `@react-native-firebase/app` + `/auth` +
 *    `/firestore` with native Google Services config, which is a separate,
 *    native-linking task beyond a pure JS/TS port.
 *  - Gemini cloud TTS is replaced by the on-device Android TTS engine via
 *    `mobileTtsEngine` (see that file for how to re-wire the cloud voices).
 *  - `localStorage` (synchronous) is replaced by AsyncStorage (async), so
 *    state is hydrated in a `useEffect` after first mount instead of in the
 *    `useState` initializer.
 */

interface NavigateParams {
  courseId?: string;
  levelId?: string;
  lessonId?: string;
  topicId?: string;
  skillType?: SkillPracticeType;
}

interface AppContextType {
  currentScreen: ScreenRoute;
  navigate: (screen: ScreenRoute, params?: NavigateParams) => void;
  goBack: () => void;

  selectedCourseId: string;
  selectedLevelId: string;
  selectedTopicId: string;
  selectedSkillType: SkillPracticeType;
  selectedFrameworkLessonId: string;
  setSelectedFrameworkLessonId: (lessonId: string) => void;

  currentUser: null;
  authLoading: boolean;
  cloudSyncStatus: 'offline';
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  manualSyncToCloud: () => Promise<void>;

  userName: string;
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

  userLearnedWords: LearnedWordItem[];
  userMasteredRules: MasteredRuleItem[];
  toggleWordLearned: (wordId: string) => void;
  toggleRuleMastered: (ruleId: string) => void;
  uniqueLearnedWordsCount: number;
  masteredGrammarRulesCount: number;
  activeProfileTab: number;
  setActiveProfileTab: (tab: number) => void;

  vocabList: FsrsVocabularyItem[];
  dailyStats: FsrsDailyStats;
  submitFsrsReview: (cardId: string, rating: Rating) => void;
  resetFsrsVocab: () => void;

  voiceSettings: VoiceSettings;
  updateVoiceSettings: (settings: Partial<VoiceSettings>) => void;
  playTts: (text: string) => Promise<boolean>;
  stopTts: () => void;
  isTtsSpeaking: boolean;
}

const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  engineSelectionMode: 'OFFLINE_ONLY',
  selectedCharacterProfile: 'adult_male',
  speechSpeed: 0.92,
  speechPitch: 1.0,
  audioCacheEnabled: true,
};

const K_USER_NAME = 'talkme_user_name';
const K_XP = 'talkme_xp';
const K_DIAMONDS = 'talkme_diamonds';
const K_STREAK = 'talkme_streak_days';
const K_COMPLETED_LEVELS = 'talkme_completed_levels_v2';
const K_BOOKMARKS = 'talkme_bookmarked_lessons';
const K_LEARNED_WORDS = 'talkme_learned_words_v1';
const K_MASTERED_RULES = 'talkme_mastered_rules_v1';
const K_VOCAB = 'talkme_fsrs_vocab_v1';
const K_VOICE_SETTINGS = 'talkme_voice_settings_v1';

function computeDailyStats(vocab: FsrsVocabularyItem[]): FsrsDailyStats {
  const now = Date.now();
  const due = vocab.filter((v) => v.card.nextReview <= now);
  const learning = vocab.filter((v) => v.card.reps > 0 && v.card.reps < 3);
  return {
    newWordsCount: vocab.filter((v) => v.card.reps === 0).length,
    dueWordsCount: due.length,
    learningWordsCount: learning.length,
    completedTodayCount: 0,
    totalLearnedCount: vocab.filter((v) => v.card.reps >= 3).length,
    retentionPercentage: 92,
    dailyStreakDays: 0,
    estimatedMinutesRemaining: Math.max(1, Math.round(due.length * 0.4)),
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenRoute>('splash');
  const [screenHistory, setScreenHistory] = useState<ScreenRoute[]>(['splash']);
  const [selectedCourseId, setSelectedCourseId] = useState('nouns');
  const [selectedLevelId, setSelectedLevelId] = useState('nouns_level_1');
  const [selectedTopicId, setSelectedTopicId] = useState('topic_hello_a0');
  const [selectedSkillType, setSelectedSkillType] = useState<SkillPracticeType>('listening');
  const [selectedFrameworkLessonId, setSelectedFrameworkLessonId] = useState('ef_01_kirish');
  const [activeProfileTab, setActiveProfileTab] = useState(0);

  const [userName, setUserName] = useState('Aziz');
  const [userLevel] = useState("A2 o'quvchi");
  const [xp, setXp] = useState(1240);
  const [diamonds, setDiamonds] = useState(26032);
  const [streakDays, setStreakDays] = useState(7);
  const [weeklyCompletedLessons] = useState(3);
  const weeklyGoalLessons = 5;

  const [completedLevelIds, setCompletedLevelIds] = useState<string[]>([]);
  const [recentlyCompletedLevelId, setRecentlyCompletedLevelId] = useState<string | null>(null);
  const [bookmarkedLessons, setBookmarkedLessons] = useState<string[]>([]);

  const [userLearnedWords, setUserLearnedWords] = useState<LearnedWordItem[]>(INITIAL_LEARNED_WORDS);
  const [userMasteredRules, setUserMasteredRules] = useState<MasteredRuleItem[]>(INITIAL_MASTERED_RULES);

  const [vocabList, setVocabList] = useState<FsrsVocabularyItem[]>(INITIAL_VOCABULARY);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(DEFAULT_VOICE_SETTINGS);
  const [isTtsSpeaking, setIsTtsSpeaking] = useState(false);

  const [hydrated, setHydrated] = useState(false);

  // Hydrate persisted state from AsyncStorage once on mount.
  useEffect(() => {
    (async () => {
      const [name, xpVal, diamondsVal, streak, levels, bookmarks, words, rules, vocab, voice] =
        await Promise.all([
          getJson<string>(K_USER_NAME, 'Aziz'),
          getJson<number>(K_XP, 1240),
          getJson<number>(K_DIAMONDS, 26032),
          getJson<number>(K_STREAK, 7),
          getJson<string[]>(K_COMPLETED_LEVELS, []),
          getJson<string[]>(K_BOOKMARKS, []),
          getJson<LearnedWordItem[]>(K_LEARNED_WORDS, INITIAL_LEARNED_WORDS),
          getJson<MasteredRuleItem[]>(K_MASTERED_RULES, INITIAL_MASTERED_RULES),
          getJson<FsrsVocabularyItem[]>(K_VOCAB, INITIAL_VOCABULARY),
          getJson<VoiceSettings>(K_VOICE_SETTINGS, DEFAULT_VOICE_SETTINGS),
        ]);
      setUserName(name);
      setXp(xpVal);
      setDiamonds(diamondsVal);
      setStreakDays(streak);
      setCompletedLevelIds(levels);
      setBookmarkedLessons(bookmarks);
      setUserLearnedWords(words);
      setUserMasteredRules(rules);
      setVocabList(vocab);
      setVoiceSettings(voice);
      setHydrated(true);
    })();
  }, []);

  // Persist on change (skip the initial pre-hydration render).
  useEffect(() => {
    if (!hydrated) return;
    setJson(K_COMPLETED_LEVELS, completedLevelIds);
  }, [hydrated, completedLevelIds]);
  useEffect(() => {
    if (!hydrated) return;
    setJson(K_BOOKMARKS, bookmarkedLessons);
  }, [hydrated, bookmarkedLessons]);
  useEffect(() => {
    if (!hydrated) return;
    setJson(K_XP, xp);
    setJson(K_DIAMONDS, diamonds);
  }, [hydrated, xp, diamonds]);
  useEffect(() => {
    if (!hydrated) return;
    setJson(K_LEARNED_WORDS, userLearnedWords);
  }, [hydrated, userLearnedWords]);
  useEffect(() => {
    if (!hydrated) return;
    setJson(K_MASTERED_RULES, userMasteredRules);
  }, [hydrated, userMasteredRules]);
  useEffect(() => {
    if (!hydrated) return;
    setJson(K_VOCAB, vocabList);
  }, [hydrated, vocabList]);
  useEffect(() => {
    if (!hydrated) return;
    setJson(K_VOICE_SETTINGS, voiceSettings);
  }, [hydrated, voiceSettings]);

  const navigate = useCallback((screen: ScreenRoute, params?: NavigateParams) => {
    if (params?.courseId) setSelectedCourseId(params.courseId);
    if (params?.levelId) setSelectedLevelId(params.levelId);
    if (params?.lessonId) setSelectedFrameworkLessonId(params.lessonId);
    if (params?.topicId) setSelectedTopicId(params.topicId);
    if (params?.skillType) setSelectedSkillType(params.skillType);
    setScreenHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
  }, []);

  const goBack = useCallback(() => {
    setScreenHistory((prev) => {
      if (prev.length <= 1) {
        setCurrentScreen('home');
        return ['home'];
      }
      const next = prev.slice(0, -1);
      setCurrentScreen(next[next.length - 1]);
      return next;
    });
  }, []);

  const clearRecentlyCompletedLevel = useCallback(() => setRecentlyCompletedLevelId(null), []);

  const toggleBookmark = useCallback((lessonId: string) => {
    setBookmarkedLessons((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  }, []);

  const awardXpAndDiamonds = useCallback(
    (xpBonus: number, diamondsBonus: number, levelId?: string) => {
      setXp((prev) => prev + xpBonus);
      setDiamonds((prev) => prev + diamondsBonus);
      if (levelId) {
        setCompletedLevelIds((prev) => (prev.includes(levelId) ? prev : [...prev, levelId]));
        setRecentlyCompletedLevelId(levelId);
      }
    },
    []
  );

  const toggleWordLearned = useCallback((wordId: string) => {
    setUserLearnedWords((prev) =>
      prev.map((w) =>
        w.id === wordId
          ? { ...w, status: w.status === 'learned' ? 'learning' : 'learned', updatedAt: Date.now() }
          : w
      )
    );
  }, []);

  const toggleRuleMastered = useCallback((ruleId: string) => {
    setUserMasteredRules((prev) =>
      prev.map((r) =>
        r.id === ruleId
          ? { ...r, status: r.status === 'learned' ? 'learning' : 'learned', updatedAt: Date.now() }
          : r
      )
    );
  }, []);

  const submitFsrsReview = useCallback((cardId: string, rating: Rating) => {
    setVocabList((prev) =>
      prev.map((item) => {
        if (item.card.cardId !== cardId) return item;
        const scheduling = defaultFsrsScheduler.repeat(item.card)[rating];
        return { ...item, card: scheduling.card };
      })
    );
  }, []);

  const resetFsrsVocab = useCallback(() => setVocabList(INITIAL_VOCABULARY), []);

  const updateVoiceSettings = useCallback((settings: Partial<VoiceSettings>) => {
    setVoiceSettings((prev) => ({ ...prev, ...settings }));
  }, []);

  const playTts = useCallback(
    async (text: string) => {
      setIsTtsSpeaking(true);
      const ok = await mobileTtsEngine.speak(text, voiceSettings.speechSpeed, voiceSettings.speechPitch);
      setIsTtsSpeaking(false);
      return ok;
    },
    [voiceSettings.speechSpeed, voiceSettings.speechPitch]
  );

  const stopTts = useCallback(() => {
    mobileTtsEngine.stop();
    setIsTtsSpeaking(false);
  }, []);

  const uniqueLearnedWordsCount = userLearnedWords.filter((w) => w.status === 'learned').length;
  const masteredGrammarRulesCount = userMasteredRules.filter((r) => r.status === 'learned').length;
  const dailyStats = computeDailyStats(vocabList);

  const value: AppContextType = {
    currentScreen,
    navigate,
    goBack,
    selectedCourseId,
    selectedLevelId,
    selectedTopicId,
    selectedSkillType,
    selectedFrameworkLessonId,
    setSelectedFrameworkLessonId,
    currentUser: null,
    authLoading: false,
    cloudSyncStatus: 'offline',
    signInWithGoogle: async () => {
      // TODO: wire @react-native-firebase/auth with Google Sign-In for native cloud sync.
    },
    signOutUser: async () => {},
    manualSyncToCloud: async () => {},
    userName,
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
    uniqueLearnedWordsCount,
    masteredGrammarRulesCount,
    activeProfileTab,
    setActiveProfileTab,
    vocabList,
    dailyStats,
    submitFsrsReview,
    resetFsrsVocab,
    voiceSettings,
    updateVoiceSettings,
    playTts,
    stopTts,
    isTtsSpeaking,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
