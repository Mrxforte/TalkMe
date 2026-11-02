import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';

export const MasteredRulesScreen: React.FC = () => {
  const { goBack, userMasteredRules, toggleRuleMastered } = useApp();

  return (
    <View className="flex-1 bg-bg px-4 pt-3">
      <TalkMeHeader title="O‘zlashtirilgan qoidalar" onBackClick={goBack} />
      <FlatList
        data={userMasteredRules}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 8, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => toggleRuleMastered(item.id)}
            className="rounded-xl bg-white border border-borderMd p-3.5 flex-row items-center justify-between"
          >
            <View className="shrink flex-1 pr-2">
              <Text className="text-sm font-bold text-textPrimary">{item.nameUz}</Text>
              <Text className="text-xs text-textSecondary mt-0.5" numberOfLines={2}>
                {item.shortSummaryUz}
              </Text>
              <Text className="text-[11px] text-textSecondary mt-0.5">{item.category}</Text>
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
