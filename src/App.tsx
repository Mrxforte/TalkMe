import React from 'react';
import { useApp } from './context/AppContext';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CoursesScreen } from './screens/CoursesScreen';
import { CourseLevelsScreen } from './screens/CourseLevelsScreen';
import { LessonDetailScreen } from './screens/LessonDetailScreen';
import { QuizScreen } from './screens/QuizScreen';
import { LessonResultScreen } from './screens/LessonResultScreen';
import { LevelUnlockedScreen } from './screens/LevelUnlockedScreen';
import { RepeatScreen } from './screens/RepeatScreen';
import { ProfileScreen } from './screens/ProfileScreen';
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
    <div className="w-full min-h-screen bg-[#FAFAFC] font-sans antialiased">
      <AppContent />
    </div>
  );
};

export default App;
