import React, { useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import {
  Search,
  BookOpen,
  Edit3,
  BarChart2,
  Flame,
  MessageSquare,
  Compass,
  ArrowRight,
  Layers,
  Zap,
  Sparkles,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBottomBar } from '../components/TalkMeBottomBar';

interface GrammarCategory {
  id: string;
  title: string;
  subtitle: string;
  topicsCount: string;
  hasSubtopics: boolean;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
}

const CATEGORIES: GrammarCategory[] = [
  { id: 'nouns', title: 'Ot (Nouns)', subtitle: 'Shaxs, narsa va joy nomlari (18 ta darajali xarita)', topicsCount: '18 ta ost-mavzu', hasSubtopics: true, Icon: BookOpen },
  { id: 'english_fundamentals', title: 'English Fundamentals', subtitle: 'Ingliz tili asoslari — 1-dars: Kirish', topicsCount: '1 ta dars', hasSubtopics: true, Icon: BookOpen },
  { id: 'verbs', title: 'Fe‘l va Zamonlar', subtitle: 'Harakatlar: Present, Past, Future', topicsCount: '0 ta ost-mavzu', hasSubtopics: false, Icon: Flame },
  { id: 'adjectives', title: 'Sifat (Adjectives)', subtitle: 'Belgi, xususiyat va darajalar', topicsCount: '0 ta ost-mavzu', hasSubtopics: false, Icon: Edit3 },
  { id: 'numerals', title: 'Son (Numerals)', subtitle: 'Sanoq va tartib sonlar', topicsCount: '0 ta ost-mavzu', hasSubtopics: false, Icon: BarChart2 },
  { id: 'pronouns', title: 'Olmosh (Pronouns)', subtitle: 'Kishilik va egalik olmoshlari', topicsCount: '0 ta ost-mavzu', hasSubtopics: false, Icon: MessageSquare },
  { id: 'adverbs', title: 'Ravish (Adverbs)', subtitle: 'Harakat tarzi, daraja va tezlik', topicsCount: '0 ta ost-mavzu', hasSubtopics: false, Icon: Zap },
  { id: 'prepositions', title: 'Predloglar (Prepositions)', subtitle: 'O‘rin, payt va yo‘nalish (in, on, at)', topicsCount: '0 ta ost-mavzu', hasSubtopics: false, Icon: Compass },
  { id: 'sentences', title: 'Gap (Sentences)', subtitle: 'Ega, kesim, to‘ldiruvchi (S+V+O)', topicsCount: '0 ta ost-mavzu', hasSubtopics: false, Icon: Layers },
  { id: 'adverbials', title: 'Hol (Adverbials)', subtitle: 'Payt, o‘rin, sabab va maqsad', topicsCount: '0 ta ost-mavzu', hasSubtopics: false, Icon: Compass },
  { id: 'articles', title: 'Artikl (Articles: A, An, The)', subtitle: 'Aniq va noaniq artikl qoidalari', topicsCount: '0 ta ost-mavzu', hasSubtopics: false, Icon: Sparkles },
];

export const CoursesScreen: React.FC = () => {
  const { navigate, goBack } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = CATEGORIES.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex-1 bg-bg">
      <View className="px-4 pt-3">
        <TalkMeHeader title="Mening kurslarim" onBackClick={goBack} />
        <View className="relative mb-3">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Grammatika bo‘limlarini izlash..."
            placeholderTextColor="#616161"
            className="w-full h-11 pl-10 pr-4 rounded-lg bg-white border border-borderMd text-sm text-textPrimary"
          />
          <View style={{ position: 'absolute', left: 14, top: 14 }}>
            <Search size={16} color="#616161" />
          </View>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 110, gap: 12 }}
        columnWrapperStyle={{ gap: 12 }}
        renderItem={({ item: cat }) => {
          const { Icon } = cat;
          return (
            <Pressable
              onPress={() => navigate('course_levels', { courseId: cat.id })}
              className={`flex-1 rounded-xl bg-white border p-3.5 ${
                cat.hasSubtopics ? 'border-primary' : 'border-borderMd opacity-90'
              }`}
            >
              <View className="flex-row items-center gap-1.5 mb-1.5">
                <View className={`w-6 h-6 rounded-md items-center justify-center ${cat.hasSubtopics ? 'bg-secondary-light' : 'bg-bg'}`}>
                  <Icon size={14} color={cat.hasSubtopics ? '#00897B' : '#616161'} />
                </View>
                <Text className={`text-xs font-semibold ${cat.hasSubtopics ? 'text-secondary' : 'text-textSecondary'}`}>
                  {cat.topicsCount}
                </Text>
              </View>

              <Text className="text-sm font-bold text-textPrimary" numberOfLines={1}>
                {cat.title}
              </Text>
              <Text className="text-xs text-textSecondary mt-1" numberOfLines={2}>
                {cat.subtitle}
              </Text>

              <View className="mt-3 pt-2.5 border-t border-borderMd flex-row items-center justify-between">
                <Text className="text-xs font-semibold text-primary">
                  {cat.hasSubtopics ? 'Xaritani ochish' : 'Ko‘rish'}
                </Text>
                <View className="w-6 h-6 rounded-md bg-primary-light items-center justify-center">
                  <ArrowRight size={14} color="#3949AB" />
                </View>
              </View>
            </Pressable>
          );
        }}
      />

      <TalkMeBottomBar />
    </View>
  );
};
