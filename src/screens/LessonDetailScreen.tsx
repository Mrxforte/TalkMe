import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { Bookmark, BookOpen } from 'lucide-react';
import { COURSE_CURRICULA } from './CourseLevelsScreen';
import { UniversalSubtopicPlayer } from '../features/subtopic-player/UniversalSubtopicPlayer';
import { EnglishFundamentalsKirishView } from '../features/grammar/components/EnglishFundamentalsKirishView';
import {
  SUBTOPICS_REPOSITORY,
  NOUNS_18_SUBTOPIC_IDS,
} from '../content/registry/subtopicsCatalog';

export interface LessonContentItem {
  id: string;
  title: string;
  component: React.ComponentType;
}

export const LESSON_REGISTRY: Record<string, LessonContentItem> = {};

export const LessonDetailScreen: React.FC = () => {
  const {
    goBack,
    selectedCourseId,
    selectedLevelId,
    selectedFrameworkLessonId,
    bookmarkedLessons,
    toggleBookmark,
  } = useApp();

  const resolveSubtopicId = (): string => {
    if (selectedFrameworkLessonId && SUBTOPICS_REPOSITORY[selectedFrameworkLessonId]) {
      return selectedFrameworkLessonId;
    }
    if (
      selectedCourseId === 'english_fundamentals' ||
      selectedCourseId === 'grammar_fundamentals'
    ) {
      return 'ef_01_kirish';
    }
    const match = selectedLevelId ? selectedLevelId.match(/(\d+)/) : null;
    const idx = match ? Math.max(0, parseInt(match[1], 10) - 1) : 0;
    return NOUNS_18_SUBTOPIC_IDS[idx] || 'noun_01_what_is_a_noun';
  };

  const activeSubtopicId = resolveSubtopicId();

  const courseKey = selectedCourseId || 'nouns';
  const curriculum = COURSE_CURRICULA[courseKey] || COURSE_CURRICULA.nouns;

  const nodeIndexMatch = selectedLevelId ? selectedLevelId.match(/\d+/) : null;
  const topicIndex = nodeIndexMatch ? Math.max(0, parseInt(nodeIndexMatch[0], 10) - 1) : 0;
  const currentTopic =
    curriculum.topics[topicIndex] ||
    curriculum.topics[0] || {
      title: '1-Daraja: Ot nima?',
      subtitle: 'Ot so‘z turkumiga kirish',
      nodeType: 'STAR',
      xpReward: 40,
    };

  const activeSubtopicData =
    SUBTOPICS_REPOSITORY[activeSubtopicId] || SUBTOPICS_REPOSITORY.noun_01_what_is_a_noun;
  const activeTopicTitleUz =
    activeSubtopicData?.title?.uz || currentTopic.title;

  const levelIdToComplete = selectedLevelId || `nouns_lvl_${topicIndex + 1}`;
  const isBookmarked = bookmarkedLessons.includes(levelIdToComplete);

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-20 text-[#212121]">
      <div className="max-w-2xl mx-auto px-4 sm:px-5 pt-3 space-y-4">
        <TalkMeHeader
          title={activeTopicTitleUz}
          leadingIcon={<BookOpen className="w-5 h-5" />}
          onBackClick={goBack}
          trailingContent={
            <button
              onClick={() => toggleBookmark(levelIdToComplete)}
              type="button"
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all cursor-pointer shadow-2xs shrink-0 ${
                isBookmarked
                  ? 'bg-[#3949AB] text-white border-[#3949AB]'
                  : 'bg-white text-[#3949AB] border-[#E0E4EC] hover:bg-[#E8EAF6]'
              }`}
              title={isBookmarked ? 'Saqlangan' : 'Saqlash'}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          }
        />

        {activeSubtopicId === 'ef_01_kirish' ? (
          <EnglishFundamentalsKirishView />
        ) : (
          <UniversalSubtopicPlayer initialSubtopicId={activeSubtopicId} />
        )}
      </div>
    </div>
  );
};
