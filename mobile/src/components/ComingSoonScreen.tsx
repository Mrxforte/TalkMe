import React from 'react';
import { Text, View } from 'react-native';
import { Construction } from 'lucide-react-native';
import { TalkMeHeader } from './TalkMeHeader';

interface ComingSoonScreenProps {
  title: string;
  description?: string;
}

/**
 * Placeholder for web screens not yet ported to React Native (e.g. the full
 * interactive exercise engine, practice center, topic detail breakdowns).
 * Keeps navigation fully wired across the app while those larger subsystems
 * are ported incrementally.
 */
export const ComingSoonScreen: React.FC<ComingSoonScreenProps> = ({
  title,
  description = 'Bu ekran React Native versiyasida tez orada to‘liq ishlab chiqiladi.',
}) => {
  return (
    <View className="flex-1 bg-bg px-4 pt-3">
      <TalkMeHeader title={title} />
      <View className="flex-1 items-center justify-center gap-3 px-8">
        <Construction size={40} color="#9E9E9E" />
        <Text className="text-sm text-textSecondary text-center leading-relaxed">{description}</Text>
      </View>
    </View>
  );
};
