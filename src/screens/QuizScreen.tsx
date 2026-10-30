import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBadge } from '../components/TalkMeBadge';
import { TalkMeProgressBar } from '../components/TalkMeProgressBar';
import { TalkMeCard } from '../components/TalkMeCard';
import { TalkMeButton } from '../components/TalkMeButton';
import { CheckCircle2, XCircle, ChevronRight, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizScreen: React.FC = () => {
  const { navigate, goBack, playTts, awardXpAndDiamonds } = useApp();

  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(1); // Default Option B
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(true); // Pre-evaluated matching design

  const options = [
    { id: 0, text: 'She reads a book now.', isCorrect: false },
    { id: 1, text: 'She is reading a book now.', isCorrect: true },
    { id: 2, text: 'She reading a book now.', isCorrect: false },
  ];

  const handleNext = () => {
    // Trigger confetti celebration!
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
    awardXpAndDiamonds(20, 5, 'lvl_4');
    navigate('lesson_result');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-16 text-[#1D1B20]">
      <div className="px-5 pt-4 space-y-4 max-w-md mx-auto">
        {/* Header */}
        <TalkMeHeader
          title="Bilimni sinaymiz"
          subtitle="Present continuous"
          onBackClick={goBack}
        />

        {/* Progress Header */}
        <div className="flex items-center justify-between">
          <span className="text-base font-extrabold text-[#5E4B8B]">4 / 5 savol</span>
          <TalkMeBadge
            text="A2"
            containerColor="bg-[#F1EDFA]"
            textColor="text-[#5E4B8B]"
          />
        </div>

        {/* Progress Bar */}
        <TalkMeProgressBar progress={0.8} />

        {/* Context Tag */}
        <div className="pt-2">
          <TalkMeBadge
            text="KUTUBXONADA"
            containerColor="bg-[#F1EDFA]"
            textColor="text-[#5E4B8B]"
          />
        </div>

        {/* Question Prompt Card */}
        <TalkMeCard className="p-5">
          <p className="text-xs text-[#757575] font-semibold">To‘g‘ri gapni tanlang</p>
          <h3 className="text-2xl font-extrabold text-[#1D1B20] mt-1.5 leading-snug">
            “U hozir kitob o‘qiyapti.”
          </h3>
        </TalkMeCard>

        {/* Question Options */}
        <div className="space-y-2.5 pt-1">
          {options.map((option, idx) => {
            const isSelected = selectedOptionIndex === idx;
            const isCorrect = option.isCorrect;

            let borderClass = 'border-[#F0EFF5] bg-white';
            if (isSelected) {
              borderClass = isCorrect
                ? 'border-[#27AE60] bg-[#E8F8EE]/70'
                : 'border-rose-400 bg-rose-50';
            }

            return (
              <div
                key={option.id}
                onClick={() => {
                  setSelectedOptionIndex(idx);
                  setHasSubmitted(true);
                  if (option.isCorrect) {
                    playTts(option.text);
                  }
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between shadow-2xs active:scale-[0.99] ${borderClass}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isSelected
                        ? isCorrect
                          ? 'bg-[#27AE60] text-white'
                          : 'bg-rose-500 text-white'
                        : 'bg-[#F0EFF5] text-[#757575]'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm font-bold text-[#1D1B20]">{option.text}</span>
                </div>

                {isSelected && (
                  <div>
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Correct Answer Explanation Feedback */}
        {hasSubmitted && (
          <div className="p-4 rounded-2xl bg-[#E8F8EE] border border-[#27AE60]/40 shadow-xs space-y-1 animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />
              <span className="text-sm font-extrabold text-[#27AE60]">
                To‘g‘ri, davom eting!
              </span>
            </div>
            <p className="text-xs text-[#2E7D32] leading-relaxed pt-1">
              <strong>She + is + reading.</strong> “Now” hozirgi paytni bildiradi, shuning uchun <strong>is + fe’l-ing</strong> ishlatiladi.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 space-y-2.5">
          <TalkMeButton
            text="Keyingi savol"
            trailingIcon={<ChevronRight className="w-5 h-5" />}
            onClick={handleNext}
          />

          <TalkMeButton
            text="Qoidani yana ko‘rish"
            variant="secondary"
            onClick={() => navigate('lesson_detail')}
          />

          <p className="text-xs text-[#9E9E9E] text-center pt-1">
            Javob saqlandi · yana 1 ta savol qoldi
          </p>
        </div>
      </div>
    </div>
  );
};
