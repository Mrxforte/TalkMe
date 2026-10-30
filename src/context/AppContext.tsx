import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ScreenRoute,
  FsrsVocabularyItem,
  FsrsDailyStats,
  Rating,
  VoiceSettings,
} from '../types';
import { INITIAL_VOCABULARY } from '../domain/fsrs/defaultVocab';
import { defaultFsrsScheduler } from '../domain/fsrs/fsrsEngine';
import { getProfileById } from '../domain/voice/catalog';
import { ttsEngine } from '../domain/voice/ttsEngine';

interface AppContextType {
  currentScreen: ScreenRoute;
  screenHistory: ScreenRoute[];
  selectedCourseId: string;
  selectedLevelId: string;
  navigate: (screen: ScreenRoute, params?: { courseId?: string; levelId?: string }) => void;
  goBack: () => void;

  // Gamification & User Stats
  userName: string;
  userLevel: string;
  xp: number;
  diamonds: number;
  streakDays: number;
  weeklyCompletedLessons: number;
  weeklyGoalLessons: number;
  completedLevelIds: string[];
  bookmarkedLessons: string[];
  toggleBookmark: (lessonId: string) => void;
  awardXpAndDiamonds: (xpBonus: number, diamondsBonus: number, levelId?: string) => void;

  // FSRS Spaced Repetition
  vocabList: FsrsVocabularyItem[];
  dailyStats: FsrsDailyStats;
  submitFsrsReview: (cardId: string, rating: Rating) => void;
  resetFsrsVocab: () => void;

  // Voice AI Engine
  voiceSettings: VoiceSettings;
  updateVoiceSettings: (settings: Partial<VoiceSettings>) => void;
  resetVoiceSettings: () => void;
  playTts: (text: string, overrideProfileId?: string) => Promise<boolean>;
  stopTts: () => void;
  isTtsSpeaking: boolean;
}

const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  engineSelectionMode: 'LOCAL_FIRST',
  selectedCharacterProfile: 'adult_male',
  speechSpeed: 0.88,
  speechPitch: 0.88,
  audioCacheEnabled: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenRoute>('home');
  const [screenHistory, setScreenHistory] = useState<ScreenRoute[]>(['home']);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('nouns');
  const [selectedLevelId, setSelectedLevelId] = useState<string>('lvl_4');

  // Gamification state
  const [userName] = useState<string>('Aziz');
  const [userLevel] = useState<string>('A2 o‘quvchi');
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('talkme_xp');
    return saved ? parseInt(saved, 10) : 1240;
  });
  const [diamonds, setDiamonds] = useState<number>(() => {
    const saved = localStorage.getItem('talkme_diamonds');
    return saved ? parseInt(saved, 10) : 26032;
  });
  const [streakDays] = useState<number>(7);
  const [weeklyCompletedLessons, setWeeklyCompletedLessons] = useState<number>(3);
  const weeklyGoalLessons = 5;

  const [completedLevelIds, setCompletedLevelIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('talkme_completed_levels');
    return saved ? JSON.parse(saved) : ['lvl_1', 'lvl_2', 'lvl_3', 'lvl_chest_1'];
  });

  const [bookmarkedLessons, setBookmarkedLessons] = useState<string[]>(['lesson_present_continuous']);

  // FSRS Vocab state
  const [vocabList, setVocabList] = useState<FsrsVocabularyItem[]>(() => {
    const saved = localStorage.getItem('talkme_vocab_list');
    return saved ? JSON.parse(saved) : INITIAL_VOCABULARY;
  });

  // Voice AI Settings state
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(() => {
    const saved = localStorage.getItem('talkme_voice_settings');
    return saved ? JSON.parse(saved) : DEFAULT_VOICE_SETTINGS;
  });

  const [isTtsSpeaking, setIsTtsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = ttsEngine.subscribe(setIsTtsSpeaking);
    return () => {
      unsubscribe();
    };
  }, []);

  // Save changes
  useEffect(() => {
    localStorage.setItem('talkme_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('talkme_diamonds', diamonds.toString());
  }, [diamonds]);

  useEffect(() => {
    localStorage.setItem('talkme_completed_levels', JSON.stringify(completedLevelIds));
  }, [completedLevelIds]);

  useEffect(() => {
    localStorage.setItem('talkme_vocab_list', JSON.stringify(vocabList));
  }, [vocabList]);

  useEffect(() => {
    localStorage.setItem('talkme_voice_settings', JSON.stringify(voiceSettings));
  }, [voiceSettings]);

  const navigate = (screen: ScreenRoute, params?: { courseId?: string; levelId?: string }) => {
    if (params?.courseId) setSelectedCourseId(params.courseId);
    if (params?.levelId) setSelectedLevelId(params.levelId);
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
    setXp((prev) => prev + xpBonus);
    setDiamonds((prev) => prev + diamondsBonus);
    if (levelId && !completedLevelIds.includes(levelId)) {
      setCompletedLevelIds((prev) => [...prev, levelId]);
      setWeeklyCompletedLessons((prev) => Math.min(5, prev + 1));
    }
  };

  const submitFsrsReview = (cardId: string, rating: Rating) => {
    setVocabList((prev) =>
      prev.map((item) => {
        if (item.card.cardId !== cardId) return item;
        const now = Date.now();
        const schedMap = defaultFsrsScheduler.repeat(item.card, now);
        const schedInfo = schedMap[rating];
        return {
          ...item,
          card: schedInfo.card,
        };
      })
    );
    // Award 5 XP for completing an FSRS review
    setXp((prev) => prev + 5);
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

  const playTts = (text: string, overrideProfileId?: string): Promise<boolean> => {
    const profile = overrideProfileId
      ? getProfileById(overrideProfileId)
      : getProfileById(voiceSettings.selectedCharacterProfile);
    return ttsEngine.speak(text, voiceSettings, profile);
  };

  const stopTts = () => {
    ttsEngine.stop();
  };

  // Compute daily stats dynamically from current vocab items
  const now = Date.now();
  const dueItems = vocabList.filter((item) => item.card.nextReview <= now);
  const completedToday = vocabList.filter(
    (item) => item.card.lastReview >= now - 24 * 60 * 60 * 1000 && item.card.reps > 0
  );
  const learnedItems = vocabList.filter((item) => item.card.reps > 0);

  const dailyStats: FsrsDailyStats = {
    newWordsCount: vocabList.filter((item) => item.card.reps === 0).length,
    dueWordsCount: dueItems.length,
    learningWordsCount: vocabList.filter((item) => item.card.state === 1).length,
    completedTodayCount: completedToday.length,
    totalLearnedCount: learnedItems.length,
    retentionPercentage: 94,
    dailyStreakDays: 7,
    estimatedMinutesRemaining: Math.max(1, Math.ceil(dueItems.length * 0.6)),
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        screenHistory,
        selectedCourseId,
        selectedLevelId,
        navigate,
        goBack,
        userName,
        userLevel,
        xp,
        diamonds,
        streakDays,
        weeklyCompletedLessons,
        weeklyGoalLessons,
        completedLevelIds,
        bookmarkedLessons,
        toggleBookmark,
        awardXpAndDiamonds,
        vocabList,
        dailyStats,
        submitFsrsReview,
        resetFsrsVocab,
        voiceSettings,
        updateVoiceSettings,
        resetVoiceSettings,
        playTts,
        stopTts,
        isTtsSpeaking,
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
