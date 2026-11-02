import React, { useState } from 'react';
import { Volume2, CheckCircle2, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { globalKnowledgeTracker } from '../../../knowledge/domain/services/GlobalKnowledgeTracker';
import { subtopicProgressEngine } from '../../../engines/subtopic-engine/subtopicProgressEngine';
import confetti from 'canvas-confetti';
import {
  KIRISH_EXPLANATION_PARAGRAPH_1,
  KIRISH_EXPLANATION_PARAGRAPH_2,
} from '../content/lessons/lesson01EnglishFundamentalsKirish';

interface EnglishFundamentalsKirishViewProps {
  onComplete?: () => void;
}

export const EnglishFundamentalsKirishView: React.FC<EnglishFundamentalsKirishViewProps> = ({
  onComplete,
}) => {
  const { awardXpAndDiamonds, navigate } = useApp();
  const [isCompleted, setIsCompleted] = useState(() => {
    return subtopicProgressEngine.getRecord('ef_01_kirish').isCompleted;
  });
  const [isReadingAudio, setIsReadingAudio] = useState(false);

  const handlePlayUzbekExplanation = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isReadingAudio) {
      setIsReadingAudio(false);
      return;
    }

    const fullText = `${KIRISH_EXPLANATION_PARAGRAPH_1} ${KIRISH_EXPLANATION_PARAGRAPH_2}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'uz-UZ';
    utterance.rate = 0.95;

    utterance.onend = () => setIsReadingAudio(false);
    utterance.onerror = () => setIsReadingAudio(false);

    setIsReadingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleFinishLesson = () => {
    subtopicProgressEngine.completeSubtopicWrapUp('ef_01_kirish', true);

    globalKnowledgeTracker.emitEvent({
      eventType: 'GRAMMAR_RULE_LEARNED',
      knowledgeId: 'rule_ef_01_kirish',
      source: {
        courseId: 'english_fundamentals',
        lessonId: 'ef_01_kirish',
        activityType: 'grammar_block',
      },
      metadata: {
        titleUz: 'Kirish',
        passedAssessment: true,
      },
      dedupeWindowKey: `ef_01_finish_${Date.now()}`,
    });

    awardXpAndDiamonds(25, 5, 'ef_01_kirish');
    setIsCompleted(true);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3949AB', '#00897B', '#5C6BC0', '#26A69A'],
      });
    } catch {
      // Ignore confetti error
    }

    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* 1. CLEAN TITLE HEADER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#3949AB] text-white shadow-xs space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/80">
            <BookOpen className="w-4 h-4" />
            <span>English Fundamentals · 1-Dars</span>
          </div>
          {isCompleted && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#00897B] text-white text-[11px] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>O‘zlashtirildi</span>
            </span>
          )}
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Kirish</h1>
        <p className="text-xs sm:text-sm text-white/85">
          Ingliz tili, so‘zlar, tovushlar va grammatika haqida sodda boshlang‘ich tushuncha
        </p>
      </div>

      {/* 2. EXACT MAIN LEARNING EXPLANATION CARD */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E0E4EC] shadow-[0_1px_4px_rgba(0,0,0,0.05)] space-y-5">
        <div className="flex items-center justify-between border-b border-[#E0E4EC] pb-3">
          <h2 className="text-base sm:text-lg font-bold text-[#212121]">
            Kirish
          </h2>

          <button
            type="button"
            onClick={handlePlayUzbekExplanation}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isReadingAudio
                ? 'bg-[#00897B] text-white border-[#00897B]'
                : 'bg-[#F5F6FA] text-[#3949AB] border-[#E0E4EC] hover:bg-[#E8EAF6]'
            }`}
            title="Dars matnini ovozli tinglash"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isReadingAudio ? 'To‘xtatish' : 'Ovozli tinglash'}</span>
          </button>
        </div>

        {/* Paragraph 1 */}
        <p className="text-sm sm:text-base text-[#212121] leading-relaxed">
          {KIRISH_EXPLANATION_PARAGRAPH_1}
        </p>

        {/* Paragraph 2 */}
        <p className="text-sm sm:text-base text-[#212121] leading-relaxed">
          {KIRISH_EXPLANATION_PARAGRAPH_2}
        </p>
      </div>

      {/* 3. COMPLETION ACTION */}
      <div className="pt-2">
        {!isCompleted ? (
          <button
            type="button"
            onClick={handleFinishLesson}
            className="w-full py-3.5 px-5 rounded-xl bg-[#3949AB] hover:bg-[#283593] text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99] transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Tushunarli — Darsni yakunlash</span>
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-[#E0F2F1] border border-[#80CBC4] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#00897B] shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#00695C]">
                  Tabriklaymiz! 1-dars muvaffaqiyatli yakunlandi
                </p>
                <p className="text-[11px] text-[#212121]">
                  Siz til va grammatika asoslarini bilib oldingiz (+25 XP)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('courses')}
              className="px-3.5 py-2 rounded-lg bg-[#00897B] hover:bg-[#00695C] text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Barcha Kurslar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
