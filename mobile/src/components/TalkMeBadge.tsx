import React, { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

interface TalkMeBadgeProps {
  text: string;
  icon?: ReactNode;
  containerClassName?: string;
  textClassName?: string;
  onPress?: () => void;
}

export const TalkMeBadge: React.FC<TalkMeBadgeProps> = ({
  text,
  icon,
  containerClassName = 'bg-primary-light',
  textClassName = 'text-primary',
  onPress,
}) => {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      className={`flex-row items-center gap-1.5 px-2.5 py-1 rounded-md ${containerClassName}`}
    >
      {icon}
      <Text className={`text-xs font-semibold ${textClassName}`}>{text}</Text>
    </Wrapper>
  );
};
