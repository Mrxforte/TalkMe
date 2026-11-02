import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TOPIC_LEARNING_GROUPS, SkillExerciseItem } from '../domain/learning/topicCatalog';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBottomBar } from '../components/TalkMeBottomBar';
import { SkillPracticeType } from '../types';
import { globalKnowledgeTracker } from '../knowledge/domain/services/GlobalKnowledgeTracker';
import {
  Volume2,
  Mic,
  BookOpen,
  Edit3,
  Headphones,
  Check,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SkillPracticeScreen: React.FC = () => {
  const {
    selectedSkillType,
    navigate,
    goBack,
    playTts,
    awardXpAndDiamonds,
  } = useApp();

  const [activeSkillTab, setActiveSkillTab] = useState<SkillPracticeType>(
    selectedSkillType || 'listening'
  );
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');
  const [revealedTranslations, setRevealedTranslations] = useState<Record<string, boolean>>({});
  const [speakingActiveId, setSpeakingActiveId] = useState<string | null>(null);

  // Sentence builder state for writing
  const [assembledWords, setAssembledWords] = useState<Record<string, string[]>>({});
  const [writingValidationState, setWritingValidationState] = useState<
    Record<string, 'correct' | 'incorrect' | null>
  >({});

  const allSkillItems: SkillExerciseItem[] = [];
  TOPIC_LEARNING_GROUPS.forEach((topic) => {
    const items = topic.skillItems[activeSkillTab] || [];
    allSkillItems.push(...items);
  });

  const filteredItems =
    selectedTopicFilter === 'all'
      ? allSkillItems
      : allSkillItems.filter((item) => item.topicId === selectedTopicFilter);

  const totalAccumulatedWords = TOPIC_LEARNING_GROUPS.reduce(
    (sum, t) => sum + t.words.length,
    0
  );

  const skillMeta: Record<
    SkillPracticeType,
    { label: string; title: string; subtitle: string; icon: React.ReactNode }
  > = {
    listening: {
      label: 'Tinglash',
      title: 'Tinglash Amaliyoti (Listening)',
      subtitle: 'O‘tilgan mavzular bo‘yicha audio iboralar va so‘zlarni eshitib tushunish',
      icon: <Headphones className="w-5 h-5" />,
    },
    speaking: {
      label: 'Gapirish',
      title: 'Gapirish Amaliyoti (Speaking)',
      subtitle: 'Iboralarni tabiiy ovozda eshitish va talaffuzni mashq qilish',
      icon: <Mic className="w-5 h-5" />,
    },
    reading: {
      label: 'O‘qish',
      title: 'O‘qish Amaliyoti (Reading)',
      subtitle: 'Mavzular bo‘ylab muloqotlar va qisqa matnlarni o‘qish',
      icon: <BookOpen className="w-5 h-5" />,
    },
    writing: {
      label: 'Yozish',
      title: 'Yozish va Gap Tuzish (Writing)',
      subtitle: 'So‘z bo‘laklaridan to‘g‘ri tartibda (S + V + O) gap yig‘ish',
      icon: <Edit3 className="w-5 h-5" />,
    },
  };

  const currentMeta = skillMeta[activeSkillTab];

  const emitTopicSkillEvents = (
    topicId: string,
    exerciseId: string,
    activityType: 'listening' | 'speaking' | 'reading' | 'writing',
    mode: 'practiced' | 'correct' | 'incorrect'
  ) => {
    const topicGroup = TOPIC_LEARNING_GROUPS.find((t) => t.id === topicId);
    if (!topicGroup) return;

    const events: Array<Parameters<typeof globalKnowledgeTracker.emitEvent>[0]> = [];

    for (const w of topicGroup.words) {
      events.push({
        eventType:
          mode === 'correct'
            ? 'VOCABULARY_ANSWER_CORRECT'
            : mode === 'incorrect'
            ? 'VOCABULARY_ANSWER_INCORRECT'
            : 'VOCABULARY_PRACTICED',
        knowledgeId: w.id,
        source: {
          courseId: 'grammar_fundamentals',
          levelId: topicGroup.level,
          topicId: topicGroup.id,
          exerciseId,
          activityType,
        },
        dedupeWindowKey: `${exerciseId}_${mode}_${Date.now()}`,
      });
    }

    for (const r of topicGroup.rules) {
      events.push({
        eventType:
          mode === 'correct'
            ? 'GRAMMAR_RULE_ANSWER_CORRECT'
            : mode === 'incorrect'
            ? 'GRAMMAR_RULE_ANSWER_INCORRECT'
            : 'GRAMMAR_RULE_PRACTICED',
        knowledgeId: r.id,
        source: {
          courseId: 'grammar_fundamentals',
          levelId: topicGroup.level,
          topicId: topicGroup.id,
          exerciseId,
          activityType,
        },
        dedupeWindowKey: `${exerciseId}_${mode}_${Date.now()}`,
      });
    }

    if (events.length > 0) {
      globalKnowledgeTracker.emitBatchEvents(events);
    }
  };

  const handleToggleReveal = (id: string, topicId?: string) => {
    const willReveal = !revealedTranslations[id];
    setRevealedTranslations((prev) => ({ ...prev, [id]: willReveal }));
    if (willReveal && topicId) {
      emitTopicSkillEvents(topicId, id, 'listening', 'practiced');
    }
  };

  const handleSimulateSpeaking = (id: string, textEn: string, topicId?: string) => {
    setSpeakingActiveId(id);
    playTts(textEn);
    if (topicId) {
      emitTopicSkillEvents(topicId, id, 'speaking', 'correct');
    }
    setTimeout(() => {
      setSpeakingActiveId(null);
      awardXpAndDiamonds(5, 1);
      confetti({ particleCount: 30, spread: 50 });
    }, 2200);
  };

  const handleWordClick = (
    exerciseId: string,
    word: string,
    correctOrder: string[] | undefined,
    topicId?: string
  ) => {
    const currentList = assembledWords[exerciseId] || [];
    if (currentList.includes(word)) {
      const updated = currentList.filter((w) => w !== word);
      setAssembledWords((prev) => ({ ...prev, [exerciseId]: updated }));
      setWritingValidationState((prev) => ({ ...prev, [exerciseId]: null }));
    } else {
      const updated = [...currentList, word];
      setAssembledWords((prev) => ({ ...prev, [exerciseId]: updated }));

      if (correctOrder && updated.length === correctOrder.length) {
        const isMatch = updated.every((w, idx) => w === correctOrder[idx]);
        if (isMatch) {
          setWritingValidationState((prev) => ({ ...prev, [exerciseId]: 'correct' }));
          awardXpAndDiamonds(10, 1);
          confetti({ particleCount: 45, spread: 60 });
          if (topicId) {
            emitTopicSkillEvents(topicId, exerciseId, 'writing', 'correct');
          }
        } else {
          setWritingValidationState((prev) => ({ ...prev, [exerciseId]: 'incorrect' }));
          if (topicId) {
            emitTopicSkillEvents(topicId, exerciseId, 'writing', 'incorrect');
          }
        }
      }
    }
  };

  const handleResetWriting = (exerciseId: string) => {
    setAssembledWords((prev) => ({ ...prev, [exerciseId]: [] }));
    setWritingValidationState((prev) => ({ ...prev, [exerciseId]: null }));
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-24 text-[#212121]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 space-y-5">
        <TalkMeHeader
          title={currentMeta.title}
          subtitle={currentMeta.subtitle}
          onBackClick={goBack}
        />

        {/* Material 2 Skill Tabs (Listening, Speaking, Reading, Writing) */}
        <div className="grid grid-cols-4 border-b border-[#E0E4EC] bg-white rounded-t-xl overflow-hidden">
          {(['listening', 'speaking', 'reading', 'writing'] as SkillPracticeType[]).map((st) => {
            const isActive = activeSkillTab === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setActiveSkillTab(st)}
                className={`py-3 px-2 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 relative whitespace-nowrap ${
                  isActive
                    ? 'text-[#3949AB] bg-[#E8EAF6]/40'
                    : 'text-[#616161] hover:text-[#212121]'
                }`}
              >
                {skillMeta[st].icon}
                <span>{skillMeta[st].label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3949AB]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Summary Strip & Topic Filter Controls */}
        <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#616161]">
            <div className="flex items-center gap-2 font-medium">
              <span className="text-[#212121] font-bold">{allSkillItems.length} ta mashq</span>
              <span aria-hidden="true">·</span>
              <span>{TOPIC_LEARNING_GROUPS.length} ta o‘tilgan mavzu</span>
              <span aria-hidden="true">·</span>
              <span>{totalAccumulatedWords} ta jamg‘arilgan so‘z</span>
            </div>
          </div>

          {/* Interactive Topic Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setSelectedTopicFilter('all')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                selectedTopicFilter === 'all'
                  ? 'bg-[#3949AB] text-white'
                  : 'bg-[#F5F6FA] text-[#616161] hover:text-[#212121]'
              }`}
            >
              Barcha mavzular ({allSkillItems.length})
            </button>

            {TOPIC_LEARNING_GROUPS.map((topic) => {
              const count = topic.skillItems[activeSkillTab]?.length || 0;
              if (count === 0) return null;
              const isSelected = selectedTopicFilter === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopicFilter(topic.id)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#3949AB] text-white'
                      : 'bg-[#F5F6FA] text-[#616161] hover:text-[#212121]'
                  }`}
                >
                  {topic.title.split('—')[0].trim()} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Exercises List */}
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isRevealed = !!revealedTranslations[item.id];
            const isSpeakingActive = speakingActiveId === item.id;
            const currentAssembled = assembledWords[item.id] || [];
            const validation = writingValidationState[item.id];

            return (
              <div
                key={item.id}
                className="p-5 rounded-xl bg-white border border-[#E0E4EC] shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-3.5"
              >
                {/* Unboxed Clean Metadata Header */}
                <div className="flex items-center justify-between text-xs text-[#616161]">
                  <div className="flex items-center gap-2 font-medium">
                    <span className="text-[#3949AB] font-semibold">{item.topicTitle}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.badgeText}</span>
                  </div>
                </div>

                <p className="text-sm font-semibold text-[#212121]">{item.promptUz}</p>

                {/* LISTENING */}
                {activeSkillTab === 'listening' && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-[#F5F6FA] border border-[#E0E4EC] flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-[#616161]">
                          Audio matni:
                        </span>
                        <p className="text-base font-bold text-[#212121]">
                          {isRevealed ? item.textEn : '•••••••••••••••••'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          playTts(item.audioPrompt || item.textEn);
                          emitTopicSkillEvents(item.topicId, item.id, 'listening', 'practiced');
                        }}
                        className="w-11 h-11 rounded-lg bg-[#3949AB] text-white flex items-center justify-center hover:bg-[#283593] transition-colors cursor-pointer shrink-0"
                        title="Tinglash"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleToggleReveal(item.id, item.topicId)}
                        className="text-xs text-[#3949AB] font-semibold hover:underline cursor-pointer"
                      >
                        {isRevealed ? 'Matnni yashirish' : 'Matn va tarjimani ko‘rish'}
                      </button>

                      {isRevealed && (
                        <p className="text-xs font-semibold text-[#00897B]">
                          {item.textUz}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* SPEAKING */}
                {activeSkillTab === 'speaking' && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-[#F5F6FA] border border-[#E0E4EC] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-[#212121]">
                          {item.textEn}
                        </span>
                        <button
                          type="button"
                          onClick={() => playTts(item.audioPrompt || item.textEn)}
                          className="w-10 h-10 rounded-lg bg-white text-[#3949AB] border border-[#E0E4EC] flex items-center justify-center hover:bg-[#E8EAF6] cursor-pointer"
                          title="Namunaviy ovoz"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs font-semibold text-[#00897B]">{item.textUz}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSimulateSpeaking(item.id, item.textEn, item.topicId)}
                      disabled={isSpeakingActive}
                      className={`w-full min-h-[44px] py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                        isSpeakingActive
                          ? 'bg-[#00897B] text-white'
                          : 'bg-[#3949AB] hover:bg-[#283593] text-white'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                      <span>
                        {isSpeakingActive
                          ? 'Tinglanmoqda va tekshirilmoqda...'
                          : 'Ovoz chiqarib takrorlash'}
                      </span>
                    </button>
                  </div>
                )}

                {/* READING */}
                {activeSkillTab === 'reading' && (
                  <div className="p-4 rounded-lg bg-[#F5F6FA] border border-[#E0E4EC] space-y-3">
                    <div className="space-y-2 divide-y divide-[#E0E4EC]">
                      {item.readingParagraphs?.map((paragraph, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex items-center justify-between gap-3 pt-2 first:pt-0"
                        >
                          <span className="text-sm font-medium text-[#212121]">
                            {paragraph}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              playTts(paragraph);
                              emitTopicSkillEvents(
                                item.topicId,
                                `${item.id}_p_${pIdx}`,
                                'reading',
                                'practiced'
                              );
                            }}
                            className="w-9 h-9 rounded-lg bg-white text-[#3949AB] border border-[#E0E4EC] flex items-center justify-center hover:bg-[#E8EAF6] cursor-pointer shrink-0"
                            title="Qatorni eshitish"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-[#E0E4EC]">
                      <span className="text-xs font-semibold text-[#616161]">
                        O‘zbekcha ma’nosi:
                      </span>
                      <p className="text-xs text-[#00897B] font-medium mt-1 leading-relaxed whitespace-pre-line">
                        {item.textUz}
                      </p>
                    </div>
                  </div>
                )}

                {/* WRITING */}
                {activeSkillTab === 'writing' && (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-lg bg-[#F5F6FA] border border-[#E0E4EC]">
                      <span className="text-xs font-medium text-[#616161]">
                        O‘zbekcha ma’nosi:
                      </span>
                      <p className="text-sm font-bold text-[#212121] mt-0.5">
                        “{item.textUz}”
                      </p>
                    </div>

                    {/* Sentence Dropzone */}
                    <div
                      className={`min-h-[52px] p-3 rounded-lg border flex flex-wrap items-center gap-2 transition-colors ${
                        validation === 'correct'
                          ? 'bg-[#E0F2F1] border-[#00897B]'
                          : validation === 'incorrect'
                          ? 'bg-red-50 border-red-400'
                          : 'bg-[#F5F6FA] border-[#E0E4EC]'
                      }`}
                    >
                      {currentAssembled.length === 0 ? (
                        <span className="text-xs text-[#616161]">
                          Quyidagi so‘zlarni tartib bilan tanlang...
                        </span>
                      ) : (
                        currentAssembled.map((word, wIdx) => (
                          <button
                            key={wIdx}
                            type="button"
                            onClick={() => handleWordClick(item.id, word, item.correctOrder, item.topicId)}
                            className="px-3 py-1.5 rounded-md bg-[#3949AB] text-white font-semibold text-xs cursor-pointer hover:bg-[#283593] transition-colors flex items-center gap-1.5"
                          >
                            <span>{word}</span>
                            <span className="text-[10px] opacity-75">✕</span>
                          </button>
                        ))
                      )}
                    </div>

                    {/* Word Pool */}
                    <div className="flex flex-wrap items-center gap-2">
                      {item.wordsPool?.map((word, wIdx) => {
                        const isUsed = currentAssembled.includes(word);
                        return (
                          <button
                            key={wIdx}
                            type="button"
                            disabled={isUsed}
                            onClick={() => handleWordClick(item.id, word, item.correctOrder, item.topicId)}
                            className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                              isUsed
                                ? 'opacity-35 bg-slate-200 text-slate-500 cursor-not-allowed'
                                : 'bg-white border border-[#E0E4EC] text-[#212121] hover:border-[#3949AB]'
                            }`}
                          >
                            {word}
                          </button>
                        );
                      })}

                      {currentAssembled.length > 0 && (
                        <button
                          type="button"
                          onClick={() => handleResetWriting(item.id)}
                          className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#F5F6FA] text-[#616161] hover:text-[#212121] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ml-auto"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Tozalash</span>
                        </button>
                      )}
                    </div>

                    {validation === 'correct' && (
                      <div className="p-3 rounded-lg bg-[#E0F2F1] text-[#00695C] text-xs font-semibold flex items-center gap-2">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>Gap to‘g‘ri tuzildi (+10 XP)</span>
                      </div>
                    )}

                    {validation === 'incorrect' && (
                      <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-semibold flex items-center justify-between">
                        <span>So‘zlar tartibi noto‘g‘ri. Qaytadan urinib ko‘ring.</span>
                        <button
                          type="button"
                          onClick={() => handleResetWriting(item.id)}
                          className="underline cursor-pointer"
                        >
                          Qayta terish
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <TalkMeBottomBar
        selectedTab={0}
        onTabSelected={(idx) => {
          if (idx === 0) navigate('home');
          if (idx === 1) navigate('courses');
          if (idx === 2) navigate('repeat');
          if (idx === 3) navigate('profile');
        }}
      />
    </div>
  );
};
