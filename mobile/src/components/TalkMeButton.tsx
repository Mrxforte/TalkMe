import React, { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';

interface TalkMeButtonProps {
  text: string;
  onPress?: () => void;
  trailingIcon?: ReactNode;
  leadingIcon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  disabled?: boolean;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<NonNullable<TalkMeButtonProps['variant']>, string> = {
  primary: 'bg-primary',
  secondary: 'bg-primary-light',
  outline: 'bg-white border border-primary',
  danger: 'bg-red-600',
  ghost: 'bg-transparent',
};

const VARIANT_TEXT_CLASSES: Record<NonNullable<TalkMeButtonProps['variant']>, string> = {
  primary: 'text-white',
  secondary: 'text-primary',
  outline: 'text-primary',
  danger: 'text-white',
  ghost: 'text-textSecondary',
};

export const TalkMeButton: React.FC<TalkMeButtonProps> = ({
  text,
  onPress,
  trailingIcon,
  leadingIcon,
  variant = 'primary',
  disabled = false,
  fullWidth = true,
}) => {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      className={`min-h-[46px] rounded-lg flex-row items-center justify-center gap-2 px-5 ${
        fullWidth ? 'w-full' : 'self-start'
      } ${disabled ? 'opacity-50' : 'active:opacity-80'} ${VARIANT_CLASSES[variant]}`}
    >
      {leadingIcon}
      <Text className={`font-semibold text-sm ${VARIANT_TEXT_CLASSES[variant]}`}>{text}</Text>
      {trailingIcon}
    </Pressable>
  );
};
