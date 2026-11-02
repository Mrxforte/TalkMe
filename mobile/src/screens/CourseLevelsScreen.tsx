import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { BookOpen, Check, Lock, PlayCircle } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { COURSE_CURRICULA } from '../domain/learning/courseCurricula';

/**
 * Simplified port of `src/screens/CourseLevelsScreen.tsx`. The web version
 * renders a hand-illustrated, zig-zagging "nature landscape" path with
 * animated SVG biomes and 3D padlock nodes (`./courses/CourseNatureLandscape`,
 * `./courses/LockedNode3DPadlock`, `canvas-confetti`). That bespoke art is a
 * large, separate illustration project on its own, so this mobile port keeps
 * the same data/progression/navigation logic but renders it as a clean
 * vertical level list instead.
 */
export const CourseLevelsScreen: React.FC = () => {
  const { selectedCourseId, completedLevelIds, navigate, goBack, awardXpAndDiamonds } = useApp();

  const activeCourseKey = selectedCourseId && COURSE_CURRICULA[selectedCourseId] ? selectedCourseId : 'nouns';
  const curriculum = COURSE_CURRICULA[activeCourseKey] || COURSE_CURRICULA.nouns;
  const topics = curriculum.topics;

  const firstIncompleteIndex = topics.findIndex(
    (_t, idx) => !completedLevelIds.includes(`${activeCourseKey}_lvl_${idx + 1}`)
  );

  return (
    <View className="flex-1 bg-bg">
      <View className="px-4 pt-3">
        <TalkMeHeader title={curriculum.title} leadingIcon={<BookOpen size={18} color="#3949AB" />} onBackClick={goBack} />
        <Text className="text-xs text-textSecondary mb-2">{curriculum.subtitle}</Text>
      </View>

      {topics.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-sm text-textSecondary text-center">
            Bu bo‘lim uchun darslar hali qo‘shilmagan. Tez kunda qo‘shiladi.
          </Text>
        </View>
      ) : (
        <FlatList
          data={topics}
          keyExtractor={(_item, idx) => `${activeCourseKey}_lvl_${idx + 1}`}
          contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 40 }}
          renderItem={({ item: topic, index: idx }) => {
            const levelId = `${activeCourseKey}_lvl_${idx + 1}`;
            const isCompleted = completedLevelIds.includes(levelId);
            const isCurrent = !isCompleted && (firstIncompleteIndex === -1 || idx === firstIncompleteIndex);
            const isLocked = !isCompleted && !isCurrent;

            return (
              <Pressable
                disabled={isLocked}
                onPress={() => {
                  if (isCurrent && !isCompleted) {
                    awardXpAndDiamonds(topic.xpReward, Math.round(topic.xpReward / 2), levelId);
                  }
                  navigate('lesson_detail', {
                    courseId: activeCourseKey,
                    levelId,
                    lessonId: topic.subtopicId,
                  });
                }}
                className={`rounded-xl p-4 border flex-row items-center gap-3 ${
                  isLocked ? 'bg-white/60 border-borderMd opacity-60' : 'bg-white border-borderMd'
                }`}
              >
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    isCompleted ? 'bg-secondary' : isCurrent ? 'bg-primary' : 'bg-bg'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={18} color="#FFFFFF" />
                  ) : isLocked ? (
                    <Lock size={16} color="#9E9E9E" />
                  ) : (
                    <PlayCircle size={20} color="#FFFFFF" />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-textPrimary">{topic.title}</Text>
                  <Text className="text-xs text-textSecondary mt-0.5" numberOfLines={2}>
                    {topic.subtitle}
                  </Text>
                </View>
                <Text className="text-xs font-semibold text-primary">+{topic.xpReward} XP</Text>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
};
