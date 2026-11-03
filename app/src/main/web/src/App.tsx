import React from 'react';
import { useApp } from './context/AppContext';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CoursesScreen } from './screens/CoursesScreen';
import { CourseLevelsScreen } from './screens/CourseLevelsScreen';
import { LessonDetailScreen } from './screens/LessonDetailScreen';
import {
  TopicDetailScreen,
  TopicWordsDetailScreen,
  TopicRulesDetailScreen,
} from './screens/TopicDetailScreen';
import { LearnedWordsScreen } from './screens/LearnedWordsScreen';
import { MasteredRulesScreen } from './screens/MasteredRulesScreen';
import { SkillPracticeScreen } from './screens/SkillPracticeScreen';
import { PracticeCenterScreen } from './features/practice-center/PracticeCenterScreen';
import { QuizScreen } from './screens/QuizScreen';
import { LessonResultScreen } from './screens/LessonResultScreen';
import { LevelUnlockedScreen } from './screens/LevelUnlockedScreen';
import { RepeatScreen } from './screens/RepeatScreen';
import {
  ProfileScreen,
  GoogleAccountScreen,
  VoiceAiSettingsScreen,
  LeaderboardScreen,
} from './screens/ProfileScreen';
import { VoiceStudioScreen } from './screens/VoiceStudioScreen';
import { VoiceSettingsScreen } from './screens/VoiceSettingsScreen';

export const AppContent: React.FC = () => {
  const { currentScreen } = useApp();

  switch (currentScreen) {
    case 'splash':
      return <SplashScreen />;
    case 'onboarding':
      return <OnboardingScreen />;
    case 'home':
      return <HomeScreen />;
    case 'courses':
      return <CoursesScreen />;
    case 'course_levels':
      return <CourseLevelsScreen />;
    case 'lesson_detail':
      return <LessonDetailScreen />;
    case 'topic_detail':
      return <TopicDetailScreen />;
    case 'topic_words_detail':
      return <TopicWordsDetailScreen />;
    case 'topic_rules_detail':
      return <TopicRulesDetailScreen />;
    case 'learned_words':
      return <LearnedWordsScreen />;
    case 'mastered_rules':
      return <MasteredRulesScreen />;
    case 'skill_practice':
      return <SkillPracticeScreen />;
    case 'practice_center':
      return <PracticeCenterScreen />;
    case 'quiz':
      return <QuizScreen />;
    case 'lesson_result':
      return <LessonResultScreen />;
    case 'level_unlocked':
      return <LevelUnlockedScreen />;
    case 'repeat':
      return <RepeatScreen />;
    case 'profile':
      return <ProfileScreen />;
    case 'google_account':
      return <GoogleAccountScreen />;
    case 'voice_ai_settings':
      return <VoiceAiSettingsScreen />;
    case 'leaderboard':
      return <LeaderboardScreen />;
    case 'voice_studio':
      return <VoiceStudioScreen />;
    case 'voice_settings':
      return <VoiceSettingsScreen />;
    default:
      return <HomeScreen />;
  }
};

export const App: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[#F5F6FA] text-[#212121] font-sans antialiased">
      <AppContent />
    </div>
  );
};

export default App;
