import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBadge } from '../components/TalkMeBadge';
import { TalkMeButton } from '../components/TalkMeButton';

export const LevelUnlockedScreen: React.FC = () => {
  const { userName, navigate, goBack } = useApp();

  return (
    <ScrollView className="flex-1 bg-[#FAFAFC]" contentContainerStyle={{ padding: 20, gap: 16 }}>
      <TalkMeHeader title="A2 · Grammatika" onBackClick={goBack} />

      <View className="rounded-3xl p-6 bg-[#F1EDFA] border border-[#5E4B8B]/20 items-center gap-3">
        <TalkMeBadge text="80%" containerClassName="bg-white" textClassName="text-[#5E4B8B]" />
        <Text className="text-2xl font-extrabold text-[#5E4B8B] text-center">Zo‘r natija, {userName}!</Text>
        <Text className="text-xs text-[#757575] leading-relaxed text-center px-2">
          Tasdiq gaplarni mashq qildingiz. Endi inkor gaplarga o‘tamiz.
        </Text>
        <View className="w-full h-px bg-[#5E4B8B]/20 my-1" />
        <View className="flex-row items-center justify-around w-full">
          <Text className="text-[#757575] font-semibold text-xs">3:24 dars vaqti</Text>
          <Text className="text-[#27AE60] font-extrabold text-xs">+20 XP qo‘shildi</Text>
        </View>
      </View>

      <Pressable
        onPress={() => navigate('lesson_detail')}
        className="rounded-2xl p-5 bg-white border-2 border-[#5E4B8B] gap-3"
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-black tracking-wider text-[#5E4B8B]">KEYINGI BOSQICH · OCHIQ</Text>
          <TalkMeBadge text="6 daqiqa" containerClassName="bg-[#F1EDFA]" textClassName="text-[#5E4B8B]" />
        </View>
        <View>
          <Text className="text-xl font-extrabold text-[#1D1B20]">Present continuous</Text>
          <Text className="text-xs text-[#757575] mt-0.5">Inkor gaplar · 6 daqiqa</Text>
        </View>
        <View className="p-3 rounded-xl bg-[#F8F9FA] border border-[#F0EFF5]">
          <Text className="text-sm font-bold text-[#5E4B8B]">“She is not reading a book.”</Text>
        </View>
      </Pressable>

      <View className="gap-2.5">
        <TalkMeButton
          text="Keyingi darsni boshlash"
          trailingIcon={<ChevronRight size={20} color="#FFFFFF" />}
          onPress={() => navigate('lesson_detail')}
        />
        <TalkMeButton text="Kursga qaytish" variant="secondary" onPress={() => navigate('course_levels')} />
      </View>
    </ScrollView>
  );
};
