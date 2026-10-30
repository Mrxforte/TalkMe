import React from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBadge } from '../components/TalkMeBadge';
import { TalkMeCard } from '../components/TalkMeCard';
import { TalkMeProgressBar } from '../components/TalkMeProgressBar';
import { TalkMeButton } from '../components/TalkMeButton';
import {
  Share2,
  Check,
  RotateCcw,
  GraduationCap,
  ArrowUpRight,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const LessonResultScreen: React.FC = () => {
  const { userName, navigate, goBack } = useApp();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'TalkMe Dars Natijasi',
        text: `Men TalkMe ilovasida Present Continuous darsini 80% natija bilan yakunladim! 🎉`,
      }).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-16 text-[#1D1B20]">
      <div className="px-5 pt-4 space-y-4 max-w-md mx-auto">
        {/* Header with Share Button */}
        <TalkMeHeader
          title="Natijalarim"
          subtitle="Bugungi dars yakuni"
          onBackClick={goBack}
          trailingContent={
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white border border-[#F0EFF5] text-[#5E4B8B] flex items-center justify-center hover:bg-[#F3EFFC] transition-colors cursor-pointer shadow-xs active:scale-95"
              title="Ulashish"
            >
              <Share2 className="w-5 h-5" />
            </button>
          }
        />

        {/* Completion Banner Card */}
        <div className="rounded-3xl p-5 bg-[#F1EDFA] border border-[#5E4B8B]/20 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <TalkMeBadge
              text="Dars yakunlandi"
              containerColor="bg-[#E8F8EE]"
              textColor="text-[#27AE60]"
            />

            <div className="w-9 h-9 rounded-full bg-white text-[#27AE60] flex items-center justify-center shadow-xs">
              <Check className="w-5 h-5 stroke-[2.8]" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-[#1D1B20] tracking-tight">
              Yana bir qadam, {userName}!
            </h2>
            <p className="text-xs text-[#757575] mt-0.5">Kundalik hayot / Tasdiq gaplar</p>
          </div>

          <div className="w-full h-px bg-[#5E4B8B]/20" />

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="text-left">
              <p className="text-3xl font-black text-[#5E4B8B]">80 %</p>
              <p className="text-xs text-[#757575] mt-0.5 font-medium">4/5 to‘g‘ri javob</p>
            </div>

            <div>
              <p className="text-2xl font-black text-[#1D1B20]">3:24</p>
              <p className="text-xs text-[#757575] mt-0.5 font-medium">sarflangan vaqt</p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-black text-[#27AE60]">+20</p>
              <p className="text-xs text-[#757575] mt-0.5 font-medium">o‘quv balli</p>
            </div>
          </div>
        </div>

        {/* Weekly Goal Progress Section */}
        <TalkMeCard>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-[#1D1B20]">Haftalik reja</span>
              <span className="text-sm font-extrabold text-[#27AE60]">4/5 dars</span>
            </div>

            <TalkMeProgressBar progress={0.8} progressColor="bg-[#27AE60]" />

            <p className="text-xs text-[#757575] leading-relaxed">
              A2 maqsadi: hozir qilayotgan ishlarim haqida sodda gap tuza olaman.
            </p>
          </div>
        </TalkMeCard>

        {/* Rule Tip Card ("Bir joyini mustahkamlaymiz") */}
        <TalkMeCard className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-[#1D1B20]">
              Bir joyini mustahkamlaymiz
            </h4>
            <TalkMeBadge
              text="1 qoida"
              containerColor="bg-[#F0EFF5]"
              textColor="text-[#757575]"
            />
          </div>

          <p className="text-sm font-bold text-[#1D1B20]">
            “She reading a book.” →{' '}
            <span className="text-[#27AE60] underline">“She is reading a book.”</span>
          </p>

          <p className="text-xs text-[#757575]">She bilan is yordamchi fe’lini unutmang.</p>

          <div className="flex items-center gap-2 pt-1 text-[#27AE60]">
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span className="text-xs font-bold">Ertangi takrorlashga qo‘shildi</span>
          </div>
        </TalkMeCard>

        {/* Exam Prep Card ("Imtihonga tayyorgarlik") */}
        <div
          onClick={() => navigate('courses')}
          className="rounded-2xl p-4.5 bg-[#E8F8EE]/60 border border-[#27AE60]/40 shadow-xs cursor-pointer hover:border-[#27AE60] transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#27AE60] text-white flex items-center justify-center shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#1D1B20]">
                  Imtihonga tayyorgarlik
                </h4>
                <p className="text-xs text-[#757575]">
                  Sertifikat · milliy imtihon · attestatsiya
                </p>
              </div>
            </div>

            <ArrowUpRight className="w-5 h-5 text-[#27AE60]" />
          </div>

          <p className="text-[11px] text-[#757575] leading-relaxed">
            Tayyorgarlik mashqlari rasmiy to‘liq syllabus yoki natija kafolati emas. Amaldagi formatni rasmiy manbadan tekshiring.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2.5">
          <TalkMeButton
            text="Keyingi Bosqichni Ochish"
            trailingIcon={<Sparkles className="w-5 h-5" />}
            onClick={() => navigate('level_unlocked')}
          />

          <TalkMeButton
            text="Kursga qaytish"
            variant="secondary"
            onClick={() => navigate('courses')}
          />
        </div>
      </div>
    </div>
  );
};
