import React from 'react';
import { Text, View } from 'react-native';
import { BookOpen, Sparkles, Star, GraduationCap } from 'lucide-react-native';

export const GrammarHeroIllustration: React.FC = () => {
  return (
    <View className="relative w-full h-56 rounded-3xl bg-primary-light border border-[#5E4B8B]/15 overflow-hidden items-center justify-center">
      <View className="absolute top-4 left-4 bg-white/90 border border-[#F0EFF5] rounded-xl px-2.5 py-1 flex-row items-center gap-1.5">
        <View className="w-2 h-2 rounded-full bg-[#27AE60]" />
        <Text className="text-[11px] font-bold text-[#1D1B20]">A2 CEFR</Text>
      </View>

      <View className="absolute bottom-4 left-4 bg-white/90 border border-[#F0EFF5] rounded-xl px-2.5 py-1 flex-row items-center gap-1.5">
        <Text className="text-amber-500 text-xs">⚡</Text>
        <Text className="text-[11px] font-bold text-[#5E4B8B]">Voice AI TTS</Text>
      </View>

      <View className="absolute top-4 right-4 bg-white/90 border border-[#F0EFF5] rounded-xl px-2.5 py-1 flex-row items-center gap-1.5">
        <Star size={14} color="#F59E0B" fill="#F59E0B" />
        <Text className="text-[11px] font-bold text-amber-600">FSRS-6</Text>
      </View>

      <View className="items-center">
        <View className="w-14 h-14 rounded-2xl bg-white border border-[#F0EFF5] items-center justify-center -mb-3 z-10">
          <GraduationCap size={32} color="#5E4B8B" />
        </View>

        <View className="w-36 rounded-2xl bg-[#5E4B8B] py-4 items-center justify-center px-3 border-2 border-white/40">
          <View className="flex-row items-center gap-1.5">
            <BookOpen size={20} color="#FCD34D" />
            <Text className="font-extrabold text-sm text-white">TalkMe</Text>
          </View>
          <Text className="text-[10px] text-white/80 mt-1 font-medium text-center">
            English Grammar &amp; Speech
          </Text>
        </View>

        <Sparkles size={18} color="#FBBF24" style={{ position: 'absolute', top: -8, right: 8 }} />
      </View>
    </View>
  );
};
