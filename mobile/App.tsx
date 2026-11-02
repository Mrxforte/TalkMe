import React from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './global.css';
import { AppProvider, useApp } from './src/context/AppContext';

import { SplashScreen } from './src/screens/SplashScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { CoursesScreen } from './src/screens/CoursesScreen';
import { CourseLevelsScreen } from './src/screens/CourseLevelsScreen';
import { LessonDetailScreen } from './src/screens/LessonDetailScreen';
import {
  TopicDetailScreen,
  TopicWordsDetailScreen,
  TopicRulesDetailScreen,
} from './src/screens/TopicDetailScreen';
import { LearnedWordsScreen } from './src/screens/LearnedWordsScreen';
import { MasteredRulesScreen } from './src/screens/MasteredRulesScreen';
import { SkillPracticeScreen } from './src/screens/SkillPracticeScreen';
import { PracticeCenterScreen } from './src/screens/PracticeCenterScreen';
import { QuizScreen } from './src/screens/QuizScreen';
import { LessonResultScreen } from './src/screens/LessonResultScreen';
import { LevelUnlockedScreen } from './src/screens/LevelUnlockedScreen';
import { RepeatScreen } from './src/screens/RepeatScreen';
import {
  ProfileScreen,
  GoogleAccountScreen,
  VoiceAiSettingsScreen,
  LeaderboardScreen,
} from './src/screens/ProfileScreen';
import { VoiceStudioScreen } from './src/screens/VoiceStudioScreen';
import { VoiceSettingsScreen } from './src/screens/VoiceSettingsScreen';

/** Mirrors the web app's switch-based router in `src/App.tsx`. */
const AppContent: React.FC = () => {
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

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <View style={{ flex: 1, backgroundColor: '#F5F6FA' }}>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
            <AppContent />
          </SafeAreaView>
        </View>
      </AppProvider>
    </SafeAreaProvider>
  );
}

export default App;
