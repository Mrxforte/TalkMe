import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBadge } from '../components/TalkMeBadge';
import { TalkMeCard } from '../components/TalkMeCard';
import { TalkMeButton } from '../components/TalkMeButton';
import { ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const LevelUnlockedScreen: React.FC = () => {
  const { userName, navigate, goBack } = useApp();

  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-16 text-[#1D1B20]">
      <div className="px-5 pt-4 space-y-4 max-w-md mx-auto">
        <TalkMeHeader
          title="A2 · Grammatika"
          subtitle="Yangi bosqich ochildi"
          onBackClick={goBack}
        />

        {/* Celebration Banner Card */}
        <div className="rounded-3xl p-6 bg-[#F1EDFA] border border-[#5E4B8B]/20 shadow-xs text-center space-y-3">
          <TalkMeBadge
            text="80%"
            containerColor="bg-white"
            textColor="text-[#5E4B8B]"
            className="text-sm px-3.5 py-1"
          />

          <h2 className="text-2xl font-extrabold text-[#5E4B8B]">
            Zo‘r natija, {userName}!
          </h2>

          <p className="text-xs text-[#757575] leading-relaxed px-2">
            Tasdiq gaplarni mashq qildingiz. Endi inkor gaplarga o‘tamiz.
          </p>

          <div className="w-full h-px bg-[#5E4B8B]/20 my-3" />

          <div className="flex items-center justify-around text-xs">
            <span className="text-[#757575] font-semibold">3:24 dars vaqti</span>
            <span className="text-[#27AE60] font-extrabold">+20 XP qo‘shildi</span>
          </div>
        </div>

        {/* Next Stage Card ("KEYINGI BOSQICH · OCHIQ") */}
        <div
          onClick={() => navigate('lesson_detail')}
          className="rounded-2xl p-5 bg-white border-2 border-[#5E4B8B] shadow-xs cursor-pointer hover:shadow-md transition-all space-y-3 active:scale-[0.99]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-wider text-[#5E4B8B] uppercase">
              KEYINGI BOSQICH · OCHIQ
            </span>
            <TalkMeBadge
              text="6 daqiqa"
              containerColor="bg-[#F1EDFA]"
              textColor="text-[#5E4B8B]"
            />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-[#1D1B20]">Present continuous</h3>
            <p className="text-xs text-[#757575] mt-0.5">Inkor gaplar · 6 daqiqa</p>
          </div>

          <div className="p-3 rounded-xl bg-[#F8F9FA] border border-[#F0EFF5]">
            <p className="text-sm font-bold text-[#5E4B8B]">
              “She is not reading a book.”
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 space-y-2.5">
          <TalkMeButton
            text="Keyingi darsni boshlash"
            trailingIcon={<ChevronRight className="w-5 h-5" />}
            onClick={() => navigate('lesson_detail')}
          />

          <TalkMeButton
            text="Kursga qaytish"
            variant="secondary"
            onClick={() => navigate('course_levels')}
          />
        </div>
      </div>
    </div>
  );
};
