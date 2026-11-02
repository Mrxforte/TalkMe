import React from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBadge } from '../components/TalkMeBadge';
import { TalkMeButton } from '../components/TalkMeButton';
import {
  Bookmark,
  Volume2,
  Sparkles,
  BookOpen,
  ArrowLeft,
  Layers,
  ChevronRight,
  Clock,
  Award,
} from 'lucide-react';
import { COURSE_CURRICULA } from './CourseLevelsScreen';

/**
 * Clean Lesson Shell & Roadmap Topic Viewer.
 * All previous hardcoded lessons have been cleared as requested.
 * Lessons will be added one by one into the extensible registry below.
 */

// Extensible lesson registry: As lessons are added one by one, they register here.
export interface LessonContentItem {
  id: string;
  title: string;
  component: React.ComponentType;
}

export const LESSON_REGISTRY: Record<string, LessonContentItem> = {
  // Lessons will be registered here one by one
};

export const LessonDetailScreen: React.FC = () => {
  const {
    navigate,
    goBack,
    playTts,
    isTtsSpeaking,
    selectedCourseId,
    selectedLevelId,
    bookmarkedLessons,
    toggleBookmark,
  } = useApp();

  // Retrieve course curriculum and topic info from the roadmap
  const courseKey = selectedCourseId || 'grammar_fundamentals';
  const curriculum = COURSE_CURRICULA[courseKey] || COURSE_CURRICULA.grammar_fundamentals;

  // Resolve topic index from levelId (e.g. lvl_1 -> index 0, lvl_2 -> index 1)
  const nodeIndexMatch = selectedLevelId ? selectedLevelId.match(/\d+/) : null;
  const topicIndex = nodeIndexMatch ? Math.max(0, parseInt(nodeIndexMatch[0], 10) - 1) : 0;
  const currentTopic =
    curriculum.topics[topicIndex] ||
    curriculum.topics[0] || {
      title: 'Dars Mavzusi',
      subtitle: 'Mavzu bo‘yicha batafsil ma’lumot',
      nodeType: 'STAR',
      xpReward: 25,
    };

  const isBookmarked = bookmarkedLessons.includes(selectedLevelId || courseKey);

  const handlePlayAudio = () => {
    playTts(`Topic: ${currentTopic.title.replace(/^\d+-Dars:\s*/i, '')}. ${currentTopic.subtitle}`);
  };

  // If a specific lesson has been added to the registry, render it
  const registeredLesson = LESSON_REGISTRY[selectedLevelId || ''];
  if (registeredLesson) {
    const Component = registeredLesson.component;
    return <Component />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-20 text-[#1D1B20]">
      <div className="max-w-md mx-auto px-4 sm:px-5 pt-4 space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-white border border-[#EBE8F3] flex items-center justify-center text-[#1D1B20] hover:bg-[#F3EFFC] transition-all cursor-pointer shadow-xs active:scale-95"
            title="Orqaga"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center flex-1 px-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#5E4B8B]">
              {curriculum.section}
            </span>
            <h1 className="text-sm font-extrabold text-[#1D1B20] truncate">
              {curriculum.title}
            </h1>
          </div>

          <button
            onClick={() => toggleBookmark(selectedLevelId || courseKey)}
            type="button"
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-xs ${
              isBookmarked
                ? 'bg-[#5E4B8B] text-white border-[#5E4B8B]'
                : 'bg-white text-[#5E4B8B] border-[#EBE8F3] hover:bg-[#F3EFFC]'
            }`}
            title={isBookmarked ? 'Saqlangan' : 'Saqlash'}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Topic Card */}
        <div className="rounded-3xl p-5 bg-white border border-[#EBE8F3] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <TalkMeBadge
              text={currentTopic.nodeType === 'MASCOT_INTRO' ? 'KIRISH DARSI' : 'YO‘L XARITASI MAVZUSI'}
              containerColor="bg-[#F1EDFA]"
              textColor="text-[#5E4B8B]"
            />
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#D97706] bg-[#FFF8E7] px-2.5 py-1 rounded-full border border-[#FFD97D]/60">
              <Award className="w-3.5 h-3.5" />
              <span>+{currentTopic.xpReward} XP</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-[#1D1B20] leading-snug">
              {currentTopic.title}
            </h2>
            <p className="text-sm text-[#757575] mt-1.5 leading-relaxed">
              {currentTopic.subtitle}
            </p>
          </div>

          {/* Audio Pronunciation Button */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handlePlayAudio}
              type="button"
              className={`py-2.5 px-4 rounded-xl flex items-center gap-2 text-xs font-extrabold transition-all cursor-pointer shadow-xs active:scale-95 ${
                isTtsSpeaking
                  ? 'bg-[#58CC02] text-white animate-pulse'
                  : 'bg-[#F1EDFA] text-[#5E4B8B] hover:bg-[#5E4B8B] hover:text-white'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isTtsSpeaking ? 'O‘qilmoqda...' : 'Mavzu nomini tinglash (TTS)'}</span>
            </button>
          </div>
        </div>

        {/* Coming Soon Notice Card */}
        <div className="rounded-3xl p-5 bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white border border-indigo-400/30 relative overflow-hidden shadow-md space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-bold text-base">
              🚀
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
              Darslar birma-bir qo‘shilmoqda
            </span>
          </div>

          <h3 className="text-lg font-black text-white">
            Ushbu dars tez kunda qo‘shiladi!
          </h3>

          <p className="text-xs text-indigo-100/90 leading-relaxed">
            Talabingizga binoan oldingi hamma test darslar tozalandi va faqat mukammal yo‘l xaritasi saqlab qolindi.
            Endi har bir darsni eng yuqori sifatda birma-bir qo‘shib boramiz!
          </p>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={goBack}
              type="button"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer shadow-md active:scale-[0.99]"
            >
              <span>← Yo‘l xaritasiga qaytish</span>
            </button>

            <button
              onClick={() => navigate('courses')}
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Mening kurslarim (Barcha 11 bo‘lim)</span>
            </button>
          </div>
        </div>

        {/* Unit Topics Roadmap Preview */}
        <div className="rounded-3xl p-5 bg-white border border-[#EBE8F3] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#5E4B8B]" />
              <h4 className="text-xs font-black uppercase tracking-wider text-[#1D1B20]">
                Ushbu bo‘limdagi barcha mavzular ({curriculum.topics.length} ta)
              </h4>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {curriculum.topics.map((t, idx) => {
              const isCurrent = idx === topicIndex;
              return (
                <div
                  key={t.title}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'bg-[#F1EDFA] border-[#5E4B8B]/40 shadow-xs'
                      : 'bg-[#FAFAFC] border-[#F0EFF5]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center shrink-0 ${
                        isCurrent
                          ? 'bg-[#5E4B8B] text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-bold truncate ${
                          isCurrent ? 'text-[#5E4B8B]' : 'text-[#1D1B20]'
                        }`}
                      >
                        {t.title}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate">
                        {t.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-extrabold text-[#D97706] shrink-0 ml-2">
                    +{t.xpReward} XP
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
