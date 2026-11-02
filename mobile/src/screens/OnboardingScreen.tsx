import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Clock, RotateCcw, ChevronRight } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBadge } from '../components/TalkMeBadge';
import { TalkMeButton } from '../components/TalkMeButton';
import { GrammarHeroIllustration } from '../components/GrammarHeroIllustration';

export const OnboardingScreen: React.FC = () => {
  const { navigate } = useApp();

  return (
    <ScrollView className="flex-1 bg-[#FAFAFC]" contentContainerStyle={{ flexGrow: 1 }}>
      <View className="px-5 pt-3 flex-1 justify-between pb-8">
        <View>
          <TalkMeHeader
            title="English Learning"
            trailingContent={
              <Text className="text-xs font-bold text-[#5E4B8B] bg-[#F1EDFA] px-3 py-1.5 rounded-full border border-[#5E4B8B]/20">
                🇺🇿 O‘zbekcha
              </Text>
            }
          />

          <View className="mt-3">
            <GrammarHeroIllustration />
          </View>

          <View className="mt-6">
            <TalkMeBadge text="HAR KUNI BIR QADAM" />
          </View>

          <Text className="text-2xl font-extrabold text-[#1D1B20] mt-3 leading-snug">
            Ingliz tilini o‘zingizga <Text className="text-[#5E4B8B] underline">ishongan holda</Text> o‘rganing.
          </Text>

          <Text className="text-sm text-[#757575] mt-2 leading-relaxed">
            O‘zbekcha tushuntirishlar, qisqa mashqlar va har kuni seziladigan o‘sish.
          </Text>

          <View className="flex-row flex-wrap gap-2.5 mt-5">
            <TalkMeBadge text="Kuniga 10 daqiqa" icon={<Clock size={14} color="#5E4B8B" />} />
            <TalkMeBadge text="O‘z sur‘atingizda" icon={<RotateCcw size={14} color="#5E4B8B" />} />
          </View>
        </View>

        <View className="mt-8 gap-3">
          <TalkMeButton
            text="O‘rganishni boshlash"
            trailingIcon={<ChevronRight size={20} color="#FFFFFF" />}
            onPress={() => navigate('home')}
          />
          <TalkMeButton text="Hisobim bor · Kirish" variant="secondary" onPress={() => navigate('home')} />
          <Text className="text-[11px] text-[#9E9E9E] text-center pt-2 leading-normal">
            Davom etish orqali foydalanish shartlari va maxfiylik siyosatiga rozilik bildirasiz.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};
