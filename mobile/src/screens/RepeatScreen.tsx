import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { RotateCcw, Volume2 } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeButton } from '../components/TalkMeButton';
import { Rating } from '../types';

/**
 * FSRS spaced-repetition review flow — genuinely ported (not a stub), since
 * `fsrsEngine`/`defaultVocab` are pure logic that port 1:1 from the web app.
 */
export const RepeatScreen: React.FC = () => {
  const { goBack, dailyStats, vocabList, submitFsrsReview, playTts } = useApp();
  const [showAnswer, setShowAnswer] = useState(false);

  const now = Date.now();
  const dueCards = vocabList.filter((v) => v.card.nextReview <= now);
  const current = dueCards[0];

  const handleRate = (rating: Rating) => {
    if (!current) return;
    submitFsrsReview(current.card.cardId, rating);
    setShowAnswer(false);
  };

  return (
    <View className="flex-1 bg-bg px-4 pt-3">
      <TalkMeHeader title="Takrorlash" onBackClick={goBack} />

      {!current ? (
        <View className="flex-1 items-center justify-center gap-3">
          <RotateCcw size={40} color="#00897B" />
          <Text className="text-base font-bold text-textPrimary">Bugunga hammasi tayyor!</Text>
          <Text className="text-sm text-textSecondary text-center px-8">
            Hozircha takrorlash uchun yangi so‘zlar yo‘q. Ertaga qayting.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingTop: 12, paddingBottom: 40, gap: 16 }}>
          <Text className="text-xs text-textSecondary">
            Navbatda: {dueCards.length} ta so‘z · Bugun qolgan: ~{dailyStats.estimatedMinutesRemaining} daqiqa
          </Text>

          <View className="rounded-2xl bg-white border border-borderMd p-6 items-center gap-3">
            <Text className="text-xs font-semibold text-secondary">{current.category}</Text>
            <Text className="text-3xl font-extrabold text-textPrimary">{current.word}</Text>
            <Text className="text-sm text-textSecondary">{current.phonetic}</Text>

            <Pressable
              onPress={() => playTts(current.word)}
              className="flex-row items-center gap-2 bg-primary-light px-3 py-2 rounded-lg mt-1"
            >
              <Volume2 size={16} color="#3949AB" />
              <Text className="text-xs font-semibold text-primary">Talaffuzni eshitish</Text>
            </Pressable>

            {showAnswer ? (
              <View className="mt-3 items-center gap-1">
                <Text className="text-lg font-bold text-secondary">{current.translation}</Text>
                <Text className="text-xs text-textSecondary italic text-center">{current.exampleEn}</Text>
                <Text className="text-xs text-textSecondary text-center">{current.exampleUz}</Text>
              </View>
            ) : (
              <TalkMeButton text="Tarjimani ko‘rish" variant="outline" onPress={() => setShowAnswer(true)} />
            )}
          </View>

          {showAnswer && (
            <View className="flex-row gap-2">
              <Pressable onPress={() => handleRate(Rating.AGAIN)} className="flex-1 py-3 rounded-lg bg-red-100 items-center">
                <Text className="text-xs font-bold text-red-700">Qayta</Text>
              </Pressable>
              <Pressable onPress={() => handleRate(Rating.HARD)} className="flex-1 py-3 rounded-lg bg-amber-100 items-center">
                <Text className="text-xs font-bold text-amber-700">Qiyin</Text>
              </Pressable>
              <Pressable onPress={() => handleRate(Rating.GOOD)} className="flex-1 py-3 rounded-lg bg-primary-light items-center">
                <Text className="text-xs font-bold text-primary">Yaxshi</Text>
              </Pressable>
              <Pressable onPress={() => handleRate(Rating.EASY)} className="flex-1 py-3 rounded-lg bg-secondary-light items-center">
                <Text className="text-xs font-bold text-secondary">Oson</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};
