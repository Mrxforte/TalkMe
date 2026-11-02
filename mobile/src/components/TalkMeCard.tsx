import React, { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

interface TalkMeCardProps {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
}

export const TalkMeCard: React.FC<TalkMeCardProps> = ({ children, onPress, className = '' }) => {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      className={`rounded-xl p-4 border bg-white border-borderMd ${
        onPress ? 'active:opacity-80' : ''
      } ${className}`}
    >
      {children}
    </Wrapper>
  );
};
