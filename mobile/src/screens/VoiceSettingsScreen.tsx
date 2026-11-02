import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Check, Volume2 } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { CHARACTER_VOICE_CATALOG } from '../domain/voice/catalog';

export const VoiceSettingsScreen: React.FC = () => {
  const { goBack, voiceSettings, updateVoiceSettings, playTts } = useApp();

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerStyle={{ padding: 16, gap: 16 }}>
      <TalkMeHeader title="Ovoz sozlamalari" onBackClick={goBack} />

      <View>
        <Text className="text-sm font-bold text-textPrimary mb-2">Ovoz personaji</Text>
        <View className="gap-2">
          {CHARACTER_VOICE_CATALOG.map((profile) => {
            const isSelected = voiceSettings.selectedCharacterProfile === profile.id;
            return (
              <Pressable
                key={profile.id}
                onPress={() => updateVoiceSettings({ selectedCharacterProfile: profile.id })}
                className={`rounded-xl p-3.5 border flex-row items-center justify-between ${
                  isSelected ? 'bg-primary-light border-primary' : 'bg-white border-borderMd'
                }`}
              >
                <View className="flex-row items-center gap-3 shrink">
                  <Text className="text-2xl">{profile.iconEmoji}</Text>
                  <View className="shrink">
                    <Text className="text-sm font-bold text-textPrimary">{profile.nameUz}</Text>
                    <Text className="text-xs text-textSecondary" numberOfLines={2}>
                      {profile.descriptionUz}
                    </Text>
                  </View>
                </View>
                {isSelected && (
                  <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                    <Check size={14} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      <Pressable
        onPress={() => playTts('Salom! Men TalkMe ilovasining ovoz yordamchisiman.')}
        className="flex-row items-center justify-center gap-2 bg-primary rounded-lg py-3"
      >
        <Volume2 size={18} color="#FFFFFF" />
        <Text className="text-white font-semibold text-sm">Tanlangan ovozni sinab ko‘rish</Text>
      </Pressable>

      <Text className="text-[11px] text-textSecondary leading-relaxed">
        Eslatma: bu yerda qurilmaning tizim TTS ovozi ishlatiladi. Web versiyadagi Gemini 3.8 bulut ovozlarini ulash
        uchun server.ts dagi /api endpointdan audio oqimini olib, shu yerda ijro etish kerak (keyingi bosqich).
      </Text>
    </ScrollView>
  );
};
