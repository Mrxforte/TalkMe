import React, { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Mic, Sparkles } from 'lucide-react-native';
import { useApp } from '../context/AppContext';

export const SplashScreen: React.FC = () => {
  const { navigate } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => navigate('onboarding'), 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Pressable
      onPress={() => navigate('onboarding')}
      className="flex-1 bg-[#43326B] justify-between items-center p-8"
    >
      <View className="w-full items-end">
        <Text className="text-xs font-semibold px-3 py-1 bg-white/10 rounded-full text-white/80">
          v1.0 • FSRS &amp; Voice AI
        </Text>
      </View>

      <View className="items-center">
        <View className="relative mb-6">
          <View className="w-24 h-24 rounded-3xl bg-white items-center justify-center">
            <Mic size={48} color="#5E4B8B" strokeWidth={2.2} />
          </View>
          <View style={{ position: 'absolute', top: -8, right: -8 }}>
            <Sparkles size={28} color="#FCD34D" />
          </View>
        </View>

        <Text className="text-3xl font-extrabold text-white">TalkMe</Text>
        <Text className="text-white/80 text-sm mt-2 max-w-xs text-center font-medium">
          Kichik qadamlar, katta imkoniyatlar.
        </Text>
      </View>

      <View className="items-center">
        <Text className="text-[11px] font-bold tracking-widest text-white/60 uppercase">
          INGLIZ TILI — O‘ZBEKCHA IZOH
        </Text>
        <Text className="text-[10px] text-white/40 mt-1">Davom etish uchun ekranga bosing</Text>
      </View>
    </Pressable>
  );
};
