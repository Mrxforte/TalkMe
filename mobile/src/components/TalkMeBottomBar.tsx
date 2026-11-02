import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Home, BookOpen, Target, RotateCcw, User } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { ScreenRoute } from '../types';

export const TalkMeBottomBar: React.FC = () => {
  const { currentScreen, navigate } = useApp();

  const tabs: Array<{
    label: string;
    route: ScreenRoute;
    Icon: React.ComponentType<{ size?: number; color?: string }>;
    isCenter?: boolean;
  }> = [
    { label: 'Bosh sahifa', route: 'home', Icon: Home },
    { label: 'Kurslar', route: 'courses', Icon: BookOpen },
    { label: 'Amaliyot', route: 'practice_center', Icon: Target, isCenter: true },
    { label: 'Takrorlash', route: 'repeat', Icon: RotateCcw },
    { label: 'Profil', route: 'profile', Icon: User },
  ];

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-borderMd flex-row h-16 px-2">
      {tabs.map((tab) => {
        const isActive = currentScreen === tab.route;
        const { Icon } = tab;

        if (tab.isCenter) {
          return (
            <Pressable
              key={tab.route}
              onPress={() => navigate(tab.route)}
              className="flex-1 items-center justify-center"
            >
              <View
                className={`w-11 h-11 -mt-3 rounded-2xl items-center justify-center border ${
                  isActive ? 'bg-secondary border-secondary-dark' : 'bg-primary border-primary-dark'
                }`}
              >
                <Icon size={20} color="#FFFFFF" />
              </View>
              <Text
                className={`text-[10px] mt-0.5 ${
                  isActive ? 'font-bold text-secondary' : 'font-semibold text-primary'
                }`}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={tab.route}
            onPress={() => navigate(tab.route)}
            className="flex-1 items-center justify-center"
          >
            <Icon size={20} color={isActive ? '#3949AB' : '#616161'} />
            <Text className={`text-[11px] mt-1 ${isActive ? 'font-bold text-primary' : 'font-medium text-textSecondary'}`}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
