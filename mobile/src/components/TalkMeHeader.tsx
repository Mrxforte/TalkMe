import React, { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useApp } from '../context/AppContext';

interface TalkMeHeaderProps {
  title: string;
  leadingIcon?: ReactNode;
  onBackClick?: () => void;
  trailingContent?: ReactNode;
}

export const TalkMeHeader: React.FC<TalkMeHeaderProps> = ({
  title,
  leadingIcon,
  onBackClick,
  trailingContent,
}) => {
  const { goBack } = useApp();
  const handleBack = onBackClick || goBack;

  return (
    <View className="flex-row items-center justify-between py-3 mb-2 border-b border-borderMd">
      <View className="flex-row items-center gap-2.5 shrink">
        <Pressable
          onPress={handleBack}
          className="w-10 h-10 rounded-xl items-center justify-center bg-white border border-borderMd active:opacity-70"
        >
          <ArrowLeft size={20} color="#3949AB" />
        </Pressable>
        {leadingIcon && (
          <View className="w-10 h-10 rounded-xl bg-primary-light border border-[#C5CAE9] items-center justify-center">
            {leadingIcon}
          </View>
        )}
        <Text className="text-base font-bold text-textPrimary shrink" numberOfLines={1}>
          {title}
        </Text>
      </View>

      {trailingContent && <View className="flex-row items-center gap-2 ml-2">{trailingContent}</View>}
    </View>
  );
};
