import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Flame, Mic, Headphones, BookOpen, Edit3, ChevronRight, Play } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { TalkMeBottomBar } from '../components/TalkMeBottomBar';
import { TOPIC_LEARNING_GROUPS } from '../domain/learning/topicCatalog';

export const HomeScreen: React.FC = () => {
  const {
    userName,
    streakDays,
    dailyStats,
    uniqueLearnedWordsCount,
    masteredGrammarRulesCount,
    completedLevelIds,
    navigate,
    setActiveProfileTab,
  } = useApp();

  const hasStartedLearning = completedLevelIds.length > 0 || uniqueLearnedWordsCount > 0 || masteredGrammarRulesCount > 0;

  const listeningCount = TOPIC_LEARNING_GROUPS.reduce((sum, t) => sum + (t.skillItems.listening?.length || 0), 0);
  const speakingCount = TOPIC_LEARNING_GROUPS.reduce((sum, t) => sum + (t.skillItems.speaking?.length || 0), 0);
  const readingCount = TOPIC_LEARNING_GROUPS.reduce((sum, t) => sum + (t.skillItems.reading?.length || 0), 0);
  const writingCount = TOPIC_LEARNING_GROUPS.reduce((sum, t) => sum + (t.skillItems.writing?.length || 0), 0);

  const handlePlayCurrentLesson = () => {
    navigate('lesson_detail', {
      courseId: hasStartedLearning ? 'nouns' : 'english_fundamentals',
      levelId: hasStartedLearning ? 'nouns_level_1' : 'ef_lvl_1',
      lessonId: hasStartedLearning ? 'noun_01_what_is_a_noun' : 'ef_01_kirish',
    });
  };

  const skillCards = [
    { skillType: 'listening' as const, title: 'Tinglash (Listening)', subtitle: 'Mavzular audiosi va talaffuz', badge: `${listeningCount} ta mashq`, Icon: Headphones },
    { skillType: 'speaking' as const, title: 'Gapirish (Speaking)', subtitle: 'Ovozli takrorlash mashqlari', badge: `${speakingCount} ta ibora`, Icon: Mic },
    { skillType: 'reading' as const, title: 'O‘qish (Reading)', subtitle: 'Dialoglar va qisqa hikoyalar', badge: `${readingCount} ta matn`, Icon: BookOpen },
    { skillType: 'writing' as const, title: 'Yozish (Writing)', subtitle: 'S+V+O tartibida gap yig‘ish', badge: `${writingCount} ta gap`, Icon: Edit3 },
  ];

  return (
    <View className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120, gap: 20 }}>
        <View className="flex-row items-center justify-between pb-2.5 border-b border-borderMd">
          <Pressable
            onPress={() => {
              setActiveProfileTab(2);
              navigate('profile');
            }}
            className="flex-row items-center gap-3"
          >
            <View className="w-11 h-11 rounded-full bg-primary items-center justify-center">
              <Text className="text-white font-bold text-base">{userName.charAt(0).toUpperCase()}</Text>
            </View>
            <View>
              <Text className="text-xs font-medium text-textSecondary">Xush kelibsiz</Text>
              <Text className="text-base font-bold text-textPrimary">{userName}</Text>
            </View>
          </Pressable>

          <View className="flex-row items-center gap-2.5">
            <View className="min-h-[40px] px-3 py-1.5 rounded-lg bg-white border border-borderMd flex-row items-center gap-1.5">
              <Flame size={16} color="#3949AB" />
              <Text className="text-xs font-semibold text-textPrimary">{streakDays} kun</Text>
            </View>
            <Pressable
              onPress={() => navigate('voice_studio')}
              className="w-11 h-11 rounded-lg bg-white border border-borderMd items-center justify-center"
            >
              <Mic size={20} color="#3949AB" />
            </Pressable>
          </View>
        </View>

        <View className="flex-row gap-2.5">
          <Pressable
            onPress={() => navigate('learned_words')}
            className="flex-1 rounded-xl bg-white border border-borderMd p-3.5 flex-row items-center justify-between gap-2"
          >
            <View className="shrink">
              <Text className="text-xs font-semibold text-textSecondary">Yodlangan noyob so‘zlar</Text>
              <Text className="text-xl font-bold text-primary mt-1">{uniqueLearnedWordsCount} ta so‘z</Text>
              <Text className="text-[11px] text-secondary font-medium mt-1">Ochilgan so‘zlarni ko‘rish</Text>
            </View>
            <View className="w-9 h-9 rounded-lg bg-primary-light items-center justify-center">
              <ChevronRight size={18} color="#3949AB" />
            </View>
          </Pressable>

          <Pressable
            onPress={() => navigate('mastered_rules')}
            className="flex-1 rounded-xl bg-white border border-borderMd p-3.5 flex-row items-center justify-between gap-2"
          >
            <View className="shrink">
              <Text className="text-xs font-semibold text-textSecondary">O‘zlashtirilgan qoidalar</Text>
              <Text className="text-xl font-bold text-secondary mt-1">{masteredGrammarRulesCount} ta qoida</Text>
              <Text className="text-[11px] text-primary font-medium mt-1">Ochilgan qoidalarni ko‘rish</Text>
            </View>
            <View className="w-9 h-9 rounded-lg bg-secondary-light items-center justify-center">
              <ChevronRight size={18} color="#00897B" />
            </View>
          </Pressable>
        </View>

        <View className="gap-3">
          <View>
            <Text className="text-base font-bold text-textPrimary">Ko‘nikmalar amaliyot markazi</Text>
            <Text className="text-xs text-textSecondary mt-0.5">
              O‘tilgan darslar bo‘yicha tinglash, gapirish, o‘qish va yozish mashqlari
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-3">
            {skillCards.map(({ skillType, title, subtitle, badge, Icon }) => (
              <Pressable
                key={skillType}
                onPress={() => navigate('skill_practice', { skillType })}
                className="grow basis-[47%] min-h-[132px] p-4 rounded-xl bg-white border border-borderMd justify-between"
              >
                <View className="flex-row items-center justify-between gap-2">
                  <View className="w-10 h-10 rounded-lg bg-primary-light items-center justify-center">
                    <Icon size={20} color="#3949AB" />
                  </View>
                  <Text className="px-2.5 py-1 rounded-md bg-bg border border-borderMd text-xs font-semibold text-primary">
                    {badge}
                  </Text>
                </View>
                <View className="mt-3 gap-1">
                  <Text className="text-sm font-bold text-textPrimary">{title}</Text>
                  <Text className="text-xs text-textSecondary leading-snug" numberOfLines={2}>
                    {subtitle}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          onPress={() => navigate('repeat')}
          className="rounded-xl p-4 bg-white border border-borderMd flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-3.5 shrink">
            <View className="w-11 h-11 rounded-lg bg-secondary items-center justify-center">
              <BookOpen size={20} color="#FFFFFF" />
            </View>
            <View className="shrink">
              <Text className="text-sm font-bold text-textPrimary">
                Bugun {dailyStats.dueWordsCount} ta so‘zni takrorlang
              </Text>
              <Text className="text-xs text-textSecondary mt-0.5">
                FSRS xotira algoritmi · ~{dailyStats.estimatedMinutesRemaining} daqiqa
              </Text>
            </View>
          </View>
          <View className="w-9 h-9 rounded-lg bg-secondary-light items-center justify-center">
            <ChevronRight size={16} color="#00897B" />
          </View>
        </Pressable>
      </ScrollView>

      <Pressable
        onPress={handlePlayCurrentLesson}
        className="absolute bottom-20 right-5 w-14 h-14 rounded-full bg-primary items-center justify-center active:opacity-80"
      >
        <Play size={26} color="#FFFFFF" fill="#FFFFFF" />
      </Pressable>

      <TalkMeBottomBar />
    </View>
  );
};
