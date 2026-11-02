import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { BookOpen, CheckCircle2, ChevronRight, Mic, Trophy, User } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBottomBar } from '../components/TalkMeBottomBar';
import { ComingSoonScreen } from '../components/ComingSoonScreen';

export const ProfileScreen: React.FC = () => {
  const { userName, userLevel, xp, diamonds, streakDays, uniqueLearnedWordsCount, masteredGrammarRulesCount, navigate, goBack } =
    useApp();

  const menuItems = [
    { label: 'Yodlangan so‘zlar', value: `${uniqueLearnedWordsCount} ta`, Icon: BookOpen, route: 'learned_words' as const },
    { label: 'O‘zlashtirilgan qoidalar', value: `${masteredGrammarRulesCount} ta`, Icon: CheckCircle2, route: 'mastered_rules' as const },
    { label: 'Ovoz AI sozlamalari', value: '', Icon: Mic, route: 'voice_settings' as const },
    { label: 'Reyting jadvali', value: '', Icon: Trophy, route: 'leaderboard' as const },
    { label: 'Google hisob', value: '', Icon: User, route: 'google_account' as const },
  ];

  return (
    <View className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 110, gap: 16 }}>
        <TalkMeHeader title="Profil" onBackClick={goBack} />

        <View className="items-center gap-2 py-2">
          <View className="w-20 h-20 rounded-full bg-primary items-center justify-center">
            <Text className="text-white font-extrabold text-2xl">{userName.charAt(0).toUpperCase()}</Text>
          </View>
          <Text className="text-lg font-extrabold text-textPrimary">{userName}</Text>
          <Text className="text-xs font-semibold text-secondary">{userLevel}</Text>
        </View>

        <View className="flex-row gap-2.5">
          <View className="flex-1 rounded-xl bg-white border border-borderMd p-3 items-center">
            <Text className="text-lg font-extrabold text-primary">{xp}</Text>
            <Text className="text-[11px] text-textSecondary mt-0.5">XP</Text>
          </View>
          <View className="flex-1 rounded-xl bg-white border border-borderMd p-3 items-center">
            <Text className="text-lg font-extrabold text-amber-500">{diamonds}</Text>
            <Text className="text-[11px] text-textSecondary mt-0.5">Olmos</Text>
          </View>
          <View className="flex-1 rounded-xl bg-white border border-borderMd p-3 items-center">
            <Text className="text-lg font-extrabold text-secondary">{streakDays}</Text>
            <Text className="text-[11px] text-textSecondary mt-0.5">Kun ketma-ket</Text>
          </View>
        </View>

        <View className="gap-2">
          {menuItems.map((item) => (
            <Pressable
              key={item.route}
              onPress={() => navigate(item.route)}
              className="rounded-xl bg-white border border-borderMd p-3.5 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-9 h-9 rounded-lg bg-primary-light items-center justify-center">
                  <item.Icon size={18} color="#3949AB" />
                </View>
                <Text className="text-sm font-semibold text-textPrimary">{item.label}</Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                {!!item.value && <Text className="text-xs font-semibold text-textSecondary">{item.value}</Text>}
                <ChevronRight size={16} color="#616161" />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <TalkMeBottomBar />
    </View>
  );
};

export const GoogleAccountScreen: React.FC = () => (
  <ComingSoonScreen
    title="Google hisob"
    description="Google orqali kirish va bulutga sinxronlash uchun @react-native-firebase/auth ulanishi kerak (follow-up)."
  />
);

export const VoiceAiSettingsScreen: React.FC = () => <ComingSoonScreen title="Ovoz AI sozlamalari" />;

export const LeaderboardScreen: React.FC = () => (
  <ComingSoonScreen title="Reyting jadvali" description="Boshqa o‘quvchilar bilan reyting taqqoslash tez orada qo‘shiladi." />
);
