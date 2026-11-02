import React from 'react';
import { View } from 'react-native';

interface TalkMeProgressBarProps {
  progress: number; // 0.0 to 1.0
  heightClassName?: string;
  progressClassName?: string;
  trackClassName?: string;
}

export const TalkMeProgressBar: React.FC<TalkMeProgressBarProps> = ({
  progress,
  heightClassName = 'h-2',
  progressClassName = 'bg-primary',
  trackClassName = 'bg-primary-light',
}) => {
  const clamped = Math.max(0, Math.min(1, progress));
  const percent = Math.round(clamped * 100);

  return (
    <View className={`w-full overflow-hidden rounded-full ${trackClassName} ${heightClassName}`}>
      <View className={`h-full rounded-full ${progressClassName}`} style={{ width: `${percent}%` }} />
    </View>
  );
};
