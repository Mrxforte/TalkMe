import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';

export const LearnedWordsScreen: React.FC = () => {
  const { goBack, userLearnedWords, toggleWordLearned } = useApp();

  return (
    <View className="flex-1 bg-bg px-4 pt-3">
      <TalkMeHeader title="Yodlangan so‘zlar" onBackClick={goBack} />
      <FlatList
        data={userLearnedWords}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 8, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => toggleWordLearned(item.id)}
            className="rounded-xl bg-white border border-borderMd p-3.5 flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-3 shrink">
              <Text className="text-xl">{item.emoji || '📘'}</Text>
              <View className="shrink">
                <Text className="text-sm font-bold text-textPrimary">{item.word}</Text>
                <Text className="text-xs text-textSecondary">{item.translation}</Text>
                <Text className="text-[11px] text-textSecondary mt-0.5">{item.category}</Text>
              </View>
            </View>
            <View
              className={`w-8 h-8 rounded-full items-center justify-center border ${
                item.status === 'learned' ? 'bg-secondary border-secondary' : 'bg-white border-borderMd'
              }`}
            >
              {item.status === 'learned' && <Check size={16} color="#FFFFFF" />}
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};
