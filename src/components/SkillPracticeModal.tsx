import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TOPIC_LEARNING_GROUPS, SkillExerciseItem } from '../domain/learning/topicCatalog';
import {
  X,
  Volume2,
  Mic,
  BookOpen,
  Edit3,
  Headphones,
  Check,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Flame,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SkillPracticeModalProps {
  skillType: 'listening' | 'speaking' | 'reading' | 'writing' | null;
  onClose: () => void;
}

export const SkillPracticeModal: React.FC<SkillPracticeModalProps> = ({
  skillType,
  onClose,
}) => {
  const { playTts, awardXpAndDiamonds } = useApp();

  // Selected topic filter for practice (all or specific topic)
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [revealedTranslations, setRevealedTranslations] = useState<Record<string, boolean>>({});
  const [speakingActiveId, setSpeakingActiveId] = useState<string | null>(null);

  // Writing / LEGO sentence assembler state
  const [assembledWords, setAssembledWords] = useState<Record<string, string[]>>({});
  const [writingValidationState, setWritingValidationState] = useState<
    Record<string, 'correct' | 'incorrect' | null>
  >({});

  if (!skillType) return null;

  // Collect all items for this skill from all topics
  const allSkillItems: SkillExerciseItem[] = [];
  TOPIC_LEARNING_GROUPS.forEach((topic) => {
    const items = topic.skillItems[skillType] || [];
    allSkillItems.push(...items);
  });

  const filteredItems =
    selectedTopicId === 'all'
      ? allSkillItems
      : allSkillItems.filter((item) => item.topicId === selectedTopicId);

  // Total vocabulary accumulated across topics
  const totalAccumulatedWords = TOPIC_LEARNING_GROUPS.reduce(
    (sum, t) => sum + t.words.length,
    0
  );

  const skillConfig = {
    listening: {
      title: 'Tinglash Ko‘nikmasi (Listening)',
      subtitle: 'O‘tilgan darslar bo‘yicha audio materiallar va so‘zlarni eshitish',
      icon: <Headphones className="w-6 h-6 text-[#5E4B8B]" />,
      badgeColor: 'bg-[#F1EDFA] text-[#5E4B8B] border-[#5E4B8B]/20',
      badgeText: `${allSkillItems.length} ta audio mashq`,
    },
    speaking: {
      title: 'Gapirish Ko‘nikmasi (Speaking)',
      subtitle: 'O‘tilgan iboralarni Gemini 3.8 TTS bilan tinglash va baland ovozda takrorlash',
      icon: <Mic className="w-6 h-6 text-amber-600" />,
      badgeColor: 'bg-[#FFF4E5] text-amber-700 border-[#FFE0B2]',
      badgeText: `${allSkillItems.length} ta nutqiy ibora`,
    },
    reading: {
      title: 'O‘qish Ko‘nikmasi (Reading)',
      subtitle: 'Mavzular bo‘ylab kichik matnlar, muloqotlar va gaplarni o‘qish',
      icon: <BookOpen className="w-6 h-6 text-[#27AE60]" />,
      badgeColor: 'bg-[#E8F8EE] text-[#27AE60] border-[#27AE60]/30',
      badgeText: `${allSkillItems.length} ta o‘qish matni`,
    },
    writing: {
      title: 'Yozish & Gap Tuzish (Writing)',
      subtitle: 'LEGO qoidasi va S+V+O tartibida so‘zlardan to‘g‘ri gaplar yasash',
      icon: <Edit3 className="w-6 h-6 text-[#0284C7]" />,
      badgeColor: 'bg-[#E5F6FE] text-[#0284C7] border-[#BAE6FD]',
      badgeText: `${allSkillItems.length} ta gap yig‘ish mashqi`,
    },
  }[skillType];

  const handleToggleReveal = (id: string) => {
    setRevealedTranslations((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSimulateSpeaking = (id: string, textEn: string) => {
    setSpeakingActiveId(id);
    playTts(textEn);
    setTimeout(() => {
      setSpeakingActiveId(null);
      awardXpAndDiamonds(5, 1);
      confetti({ particleCount: 30, spread: 50 });
    }, 2200);
  };

  // Word selection for Writing/Sentence builder
  const handleWordClick = (
    exerciseId: string,
    word: string,
    correctOrder: string[] | undefined
  ) => {
    const currentList = assembledWords[exerciseId] || [];
    if (currentList.includes(word)) {
      // Remove word
      const updated = currentList.filter((w) => w !== word);
      setAssembledWords((prev) => ({ ...prev, [exerciseId]: updated }));
      setWritingValidationState((prev) => ({ ...prev, [exerciseId]: null }));
    } else {
      // Add word
      const updated = [...currentList, word];
      setAssembledWords((prev) => ({ ...prev, [exerciseId]: updated }));

      // If length matches, validate
      if (correctOrder && updated.length === correctOrder.length) {
        const isMatch = updated.every((w, idx) => w === correctOrder[idx]);
        if (isMatch) {
          setWritingValidationState((prev) => ({ ...prev, [exerciseId]: 'correct' }));
          awardXpAndDiamonds(10, 1);
          confetti({ particleCount: 45, spread: 60 });
        } else {
          setWritingValidationState((prev) => ({ ...prev, [exerciseId]: 'incorrect' }));
        }
      }
    }
  };

  const handleResetWriting = (exerciseId: string) => {
    setAssembledWords((prev) => ({ ...prev, [exerciseId]: [] }));
    setWritingValidationState((prev) => ({ ...prev, [exerciseId]: null }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAFAFC] w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-[#EBE8F3]">
        {/* Header */}
        <div className="p-5 bg-white border-b border-[#EBE8F3] relative space-y-3">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F0EFF5] hover:bg-[#E5E3ED] flex items-center justify-center text-[#1D1B20] transition-colors cursor-pointer"
            title="Yopish"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 pr-10">
            <div className="w-12 h-12 rounded-2xl bg-[#F7F6FB] flex items-center justify-center border border-[#EBE8F3] shrink-0">
              {skillConfig.icon}
            </div>
            <div>
              <h2 className="text-lg font-black text-[#1D1B20] leading-tight">
                {skillConfig.title}
              </h2>
              <p className="text-xs text-[#757575] mt-0.5">{skillConfig.subtitle}</p>
            </div>
          </div>

          {/* Accumulation Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span
              className={`px-2.5 py-1 rounded-full font-extrabold border ${skillConfig.badgeColor}`}
            >
              {skillConfig.badgeText}
            </span>

            <span className="px-2.5 py-1 rounded-full font-bold bg-[#E8F8EE] text-[#27AE60] border border-[#27AE60]/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              +{totalAccumulatedWords} ta so‘z jamg‘arildi
            </span>

            <span className="px-2.5 py-1 rounded-full font-bold bg-[#F1EDFA] text-[#5E4B8B] border border-[#5E4B8B]/20">
              {TOPIC_LEARNING_GROUPS.length} ta dars integratsiyasi
            </span>
          </div>

          {/* Topic Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedTopicId('all')}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                selectedTopicId === 'all'
                  ? 'bg-[#1D1B20] text-white shadow-xs'
                  : 'bg-[#F7F6FB] text-[#757575] border border-[#EBE8F3]'
              }`}
            >
              Barcha Mavzular ({allSkillItems.length})
            </button>

            {TOPIC_LEARNING_GROUPS.map((topic) => {
              const count = topic.skillItems[skillType].length;
              if (count === 0) return null;
              const isSelected = selectedTopicId === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#5E4B8B] text-white shadow-xs'
                      : 'bg-white text-[#757575] border border-[#EBE8F3]'
                  }`}
                >
                  {topic.iconEmoji} {topic.title.split('—')[0].trim()} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1 scrollbar-thin">
          {filteredItems.map((item, index) => {
            const isRevealed = !!revealedTranslations[item.id];
            const isSpeakingActive = speakingActiveId === item.id;
            const currentAssembled = assembledWords[item.id] || [];
            const validation = writingValidationState[item.id];

            return (
              <div
                key={item.id}
                className="p-4 rounded-3xl bg-white border border-[#EBE8F3] shadow-xs space-y-3 hover:border-[#5E4B8B]/40 transition-all"
              >
                {/* Topic context header */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#5E4B8B] bg-[#F1EDFA] px-2.5 py-0.5 rounded-lg">
                    {item.topicTitle}
                  </span>
                  <span className="text-[11px] font-extrabold text-[#757575] uppercase">
                    {item.badgeText}
                  </span>
                </div>

                <p className="text-xs font-semibold text-[#1D1B20]">{item.promptUz}</p>

                {/* ================= LISTENING EXERCISE ================= */}
                {skillType === 'listening' && (
                  <div className="space-y-2.5 pt-1">
                    <div className="p-4 rounded-2xl bg-[#F7F6FB] border border-[#EBE8F3] flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#5E4B8B]">
                          Audioni tinglang:
                        </span>
                        <p className="text-sm font-extrabold text-[#1D1B20] font-sans">
                          {isRevealed ? item.textEn : '•••••••••••••••••'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => playTts(item.audioPrompt || item.textEn)}
                        className="w-11 h-11 rounded-2xl bg-[#5E4B8B] text-white flex items-center justify-center hover:bg-[#4E3D75] transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
                        title="Tinglash"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => handleToggleReveal(item.id)}
                        className="text-xs text-[#5E4B8B] font-bold hover:underline cursor-pointer"
                      >
                        {isRevealed ? 'Matnni yashirish' : 'Matn va tarjimani ko‘rish'}
                      </button>

                      {isRevealed && (
                        <p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {item.textUz}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* ================= SPEAKING EXERCISE ================= */}
                {skillType === 'speaking' && (
                  <div className="space-y-3 pt-1">
                    <div className="p-4 rounded-2xl bg-[#FFF8E7] border border-[#FFE0B2] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-black text-[#1D1B20]">
                          {item.textEn}
                        </span>
                        <button
                          type="button"
                          onClick={() => playTts(item.audioPrompt || item.textEn)}
                          className="w-8 h-8 rounded-full bg-white text-amber-600 border border-[#FFE0B2] flex items-center justify-center hover:bg-amber-50 cursor-pointer shadow-xs"
                          title="Namunaviy ovoz"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.phonetic && (
                        <p className="text-xs text-amber-900/80 font-mono font-medium">
                          {item.phonetic}
                        </p>
                      )}
                      <p className="text-xs font-bold text-emerald-700">{item.textUz}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSimulateSpeaking(item.id, item.textEn)}
                      disabled={isSpeakingActive}
                      className={`w-full py-3 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                        isSpeakingActive
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-amber-500 hover:bg-amber-600 text-white active:scale-98'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                      <span>
                        {isSpeakingActive
                          ? 'Tinglanmoqda va tekshirilmoqda...'
                          : 'Baland ovozda gapiring (Sinov)'}
                      </span>
                    </button>
                  </div>
                )}

                {/* ================= READING EXERCISE ================= */}
                {skillType === 'reading' && (
                  <div className="space-y-3 pt-1">
                    <div className="p-4 rounded-2xl bg-[#F4FAF6] border border-[#D2F5DC] space-y-2">
                      <div className="space-y-1.5">
                        {item.readingParagraphs?.map((paragraph, pIdx) => (
                          <div
                            key={pIdx}
                            className="flex items-center justify-between gap-2 py-1 border-b border-emerald-100 last:border-none"
                          >
                            <span className="text-xs font-bold text-[#1D1B20]">
                              {paragraph}
                            </span>
                            <button
                              type="button"
                              onClick={() => playTts(paragraph)}
                              className="w-6 h-6 rounded-full bg-white text-emerald-700 flex items-center justify-center hover:bg-emerald-100 cursor-pointer shrink-0"
                              title="Qatorni eshitish"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-emerald-200">
                        <span className="text-[10px] font-black uppercase text-emerald-700">
                          O‘zbekcha ma’nosi:
                        </span>
                        <p className="text-xs text-[#2E7D32] font-semibold mt-0.5 leading-relaxed whitespace-pre-line">
                          {item.textUz}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= WRITING / SENTENCE BUILDER ================= */}
                {skillType === 'writing' && (
                  <div className="space-y-3 pt-1">
                    <div className="p-3.5 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] space-y-2">
                      <span className="text-[11px] font-bold text-[#0284C7] uppercase">
                        O‘zbekcha tarjima:
                      </span>
                      <p className="text-sm font-black text-[#1D1B20]">"{item.textUz}"</p>
                    </div>

                    {/* Sentence dropzone */}
                    <div
                      className={`min-h-[52px] p-3 rounded-2xl border-2 border-dashed flex flex-wrap items-center gap-2 transition-all ${
                        validation === 'correct'
                          ? 'bg-emerald-50 border-emerald-400'
                          : validation === 'incorrect'
                          ? 'bg-rose-50 border-rose-400'
                          : 'bg-[#F7F6FB] border-[#D8D6E2]'
                      }`}
                    >
                      {currentAssembled.length === 0 ? (
                        <span className="text-xs text-[#A09EB0] font-semibold italic">
                          Quyidagi so‘z bo‘laklarini tartib bilan tanlang...
                        </span>
                      ) : (
                        currentAssembled.map((word, wIdx) => (
                          <span
                            key={wIdx}
                            onClick={() => handleWordClick(item.id, word, item.correctOrder)}
                            className="px-3 py-1.5 rounded-xl bg-[#5E4B8B] text-white font-black text-xs shadow-xs cursor-pointer active:scale-95 hover:bg-[#4E3D75] transition-all flex items-center gap-1"
                          >
                            <span>{word}</span>
                            <span className="text-[10px] opacity-70">✕</span>
                          </span>
                        ))
                      )}
                    </div>

                    {/* Available word blocks */}
                    <div className="flex flex-wrap items-center gap-2">
                      {item.wordsPool?.map((word, wIdx) => {
                        const isUsed = currentAssembled.includes(word);
                        return (
                          <button
                            key={wIdx}
                            type="button"
                            disabled={isUsed}
                            onClick={() => handleWordClick(item.id, word, item.correctOrder)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
                              isUsed
                                ? 'opacity-30 bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-white border border-[#EBE8F3] text-[#1D1B20] hover:border-[#5E4B8B] active:scale-95'
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
                          className="px-2.5 py-1.5 rounded-xl bg-[#F0EFF5] text-[#757575] hover:text-[#1D1B20] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ml-auto"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Qayta boshlash</span>
                        </button>
                      )}
                    </div>

                    {/* Result message */}
                    {validation === 'correct' && (
                      <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-2">
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Barakalla! Gap to‘g‘ri tuzildi (+10 XP)</span>
                      </div>
                    )}

                    {validation === 'incorrect' && (
                      <div className="p-2.5 rounded-xl bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-between">
                        <span>Tartib noto‘g‘ri. Qaytadan urinib ko‘ring!</span>
                        <button
                          type="button"
                          onClick={() => handleResetWriting(item.id)}
                          className="underline cursor-pointer"
                        >
                          Tozalash
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#EBE8F3] flex items-center justify-between">
          <span className="text-xs text-[#757575] font-semibold">
            Barcha mashqlar o‘tilgan darslar asosida shakllanadi
          </span>

          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-[#5E4B8B] text-white font-extrabold text-xs hover:bg-[#4E3D75] transition-colors cursor-pointer"
          >
            Tushundim
          </button>
        </div>
      </div>
    </div>
  );
};
