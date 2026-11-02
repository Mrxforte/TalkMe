import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { BookOpen, Bookmark, Volume2 } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeButton } from '../components/TalkMeButton';
import { COURSE_CURRICULA } from '../domain/learning/courseCurricula';

/**
 * Simplified port of `src/screens/LessonDetailScreen.tsx`. The web version
 * hosts the full interactive lesson engine (`UniversalSubtopicPlayer`,
 * `EnglishFundamentalsKirishView`) with stage-by-stage explanations, guided
 * practice and auto-graded exercises pulled from `SUBTOPICS_REPOSITORY` — a
 * large content + exercise-engine subsystem on its own. This mobile port
 * shows the lesson's title/subtitle and lets the learner mark it complete
 * (awarding XP), with the on-device TTS reading the topic aloud. Porting the
 * full exercise player is tracked as follow-up work.
 */
export const LessonDetailScreen: React.FC = () => {
  const { goBack, selectedCourseId, selectedLevelId, bookmarkedLessons, toggleBookmark, awardXpAndDiamonds, playTts, navigate } =
    useApp();

  const courseKey = selectedCourseId || 'nouns';
  const curriculum = COURSE_CURRICULA[courseKey] || COURSE_CURRICULA.nouns;
  const match = selectedLevelId ? selectedLevelId.match(/(\d+)/) : null;
  const topicIndex = match ? Math.max(0, parseInt(match[1], 10) - 1) : 0;
  const topic = curriculum.topics[topicIndex] || curriculum.topics[0];

  const levelId = selectedLevelId || `${courseKey}_lvl_1`;
  const isBookmarked = bookmarkedLessons.includes(levelId);

  if (!topic) {
    return (
      <View className="flex-1 bg-bg px-4 pt-3">
        <TalkMeHeader title="Dars" onBackClick={goBack} />
        <Text className="text-sm text-textSecondary mt-4">Bu dars hali tayyor emas.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerStyle={{ padding: 16 }}>
      <TalkMeHeader
        title={topic.title}
        leadingIcon={<BookOpen size={18} color="#3949AB" />}
        onBackClick={goBack}
        trailingContent={
          <Pressable
            onPress={() => toggleBookmark(levelId)}
            className={`w-10 h-10 rounded-xl items-center justify-center border ${
              isBookmarked ? 'bg-primary border-primary' : 'bg-white border-borderMd'
            }`}
          >
            <Bookmark size={18} color={isBookmarked ? '#FFFFFF' : '#3949AB'} fill={isBookmarked ? '#FFFFFF' : 'none'} />
          </Pressable>
        }
      />

      <View className="rounded-xl bg-white border border-borderMd p-4 mt-2 gap-3">
        <Text className="text-sm text-textSecondary leading-relaxed">{topic.subtitle}</Text>

        <Pressable
          onPress={() => playTts(`${topic.title}. ${topic.subtitle}`)}
          className="flex-row items-center gap-2 self-start bg-primary-light px-3 py-2 rounded-lg"
        >
          <Volume2 size={16} color="#3949AB" />
          <Text className="text-xs font-semibold text-primary">Ovozda eshitish</Text>
        </Pressable>
      </View>

      <View className="mt-6">
        <TalkMeButton
          text={`Darsni yakunlash (+${topic.xpReward} XP)`}
          onPress={() => {
            awardXpAndDiamonds(topic.xpReward, Math.round(topic.xpReward / 2), levelId);
            navigate('lesson_result');
          }}
        />
      </View>
    </ScrollView>
  );
};
