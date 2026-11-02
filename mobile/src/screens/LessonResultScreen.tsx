import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Check, RotateCcw, GraduationCap, ArrowUpRight, Sparkles } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBadge } from '../components/TalkMeBadge';
import { TalkMeCard } from '../components/TalkMeCard';
import { TalkMeProgressBar } from '../components/TalkMeProgressBar';
import { TalkMeButton } from '../components/TalkMeButton';

export const LessonResultScreen: React.FC = () => {
  const { userName, navigate, goBack } = useApp();

  return (
    <ScrollView className="flex-1 bg-[#FAFAFC]" contentContainerStyle={{ padding: 20, gap: 14 }}>
      <TalkMeHeader title="Natijalarim" onBackClick={goBack} />

      <View className="rounded-3xl p-5 bg-[#F1EDFA] border border-[#5E4B8B]/20 gap-4">
        <View className="flex-row items-center justify-between">
          <TalkMeBadge text="Dars yakunlandi" containerClassName="bg-[#E8F8EE]" textClassName="text-[#27AE60]" />
          <View className="w-9 h-9 rounded-full bg-white items-center justify-center">
            <Check size={18} color="#27AE60" strokeWidth={2.8} />
          </View>
        </View>

        <View>
          <Text className="text-2xl font-extrabold text-[#1D1B20]">Yana bir qadam, {userName}!</Text>
          <Text className="text-xs text-[#757575] mt-0.5">Kundalik hayot / Tasdiq gaplar</Text>
        </View>

        <View className="w-full h-px bg-[#5E4B8B]/20" />

        <View className="flex-row justify-between">
          <View>
            <Text className="text-3xl font-black text-[#5E4B8B]">80 %</Text>
            <Text className="text-xs text-[#757575] mt-0.5 font-medium">4/5 to‘g‘ri javob</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-black text-[#1D1B20]">3:24</Text>
            <Text className="text-xs text-[#757575] mt-0.5 font-medium">sarflangan vaqt</Text>
          </View>
          <View className="items-end">
            <Text className="text-2xl font-black text-[#27AE60]">+20</Text>
            <Text className="text-xs text-[#757575] mt-0.5 font-medium">o‘quv balli</Text>
          </View>
        </View>
      </View>

      <TalkMeCard>
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-extrabold text-[#1D1B20]">Haftalik reja</Text>
            <Text className="text-sm font-extrabold text-[#27AE60]">4/5 dars</Text>
          </View>
          <TalkMeProgressBar progress={0.8} progressClassName="bg-[#27AE60]" />
          <Text className="text-xs text-[#757575] leading-relaxed">
            A2 maqsadi: hozir qilayotgan ishlarim haqida sodda gap tuza olaman.
          </Text>
        </View>
      </TalkMeCard>

      <TalkMeCard>
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-extrabold text-[#1D1B20]">Bir joyini mustahkamlaymiz</Text>
            <TalkMeBadge text="1 qoida" containerClassName="bg-[#F0EFF5]" textClassName="text-[#757575]" />
          </View>
          <Text className="text-sm font-bold text-[#1D1B20]">
            "She reading a book." → <Text className="text-[#27AE60] underline">"She is reading a book."</Text>
          </Text>
          <Text className="text-xs text-[#757575]">She bilan is yordamchi fe'lini unutmang.</Text>
          <View className="flex-row items-center gap-2">
            <RotateCcw size={16} color="#27AE60" strokeWidth={2.5} />
            <Text className="text-xs font-bold text-[#27AE60]">Ertangi takrorlashga qo‘shildi</Text>
          </View>
        </View>
      </TalkMeCard>

      <Pressable
        onPress={() => navigate('courses')}
        className="rounded-2xl p-4 bg-[#E8F8EE]/60 border border-[#27AE60]/40 gap-3"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3 shrink">
            <View className="w-10 h-10 rounded-xl bg-[#27AE60] items-center justify-center">
              <GraduationCap size={20} color="#FFFFFF" />
            </View>
            <View className="shrink">
              <Text className="text-sm font-extrabold text-[#1D1B20]">Imtihonga tayyorgarlik</Text>
              <Text className="text-xs text-[#757575]">Sertifikat · milliy imtihon · attestatsiya</Text>
            </View>
          </View>
          <ArrowUpRight size={20} color="#27AE60" />
        </View>
        <Text className="text-[11px] text-[#757575] leading-relaxed">
          Tayyorgarlik mashqlari rasmiy to‘liq syllabus yoki natija kafolati emas.
        </Text>
      </Pressable>

      <View className="gap-2.5">
        <TalkMeButton
          text="Xaritada Keyingi Qulfni Ochish"
          trailingIcon={<Sparkles size={20} color="#FFFFFF" />}
          onPress={() => navigate('course_levels')}
        />
        <TalkMeButton text="Yangi Bosqich Tafsiloti" variant="secondary" onPress={() => navigate('level_unlocked')} />
      </View>
    </ScrollView>
  );
};
