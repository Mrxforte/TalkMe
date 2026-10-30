import React from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBadge } from '../components/TalkMeBadge';
import { TalkMeButton } from '../components/TalkMeButton';
import { GrammarHeroIllustration } from '../components/GrammarHeroIllustration';
import { Clock, RotateCcw, ChevronRight } from 'lucide-react';

export const OnboardingScreen: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-10 flex flex-col justify-between">
      <div className="px-5 pt-3">
        <TalkMeHeader
          title="English Learning"
          trailingContent={
            <span className="text-xs font-bold text-[#5E4B8B] bg-[#F1EDFA] px-3 py-1.5 rounded-full border border-[#5E4B8B]/20">
              🇺🇿 O‘zbekcha
            </span>
          }
        />

        <div className="mt-3">
          <GrammarHeroIllustration />
        </div>

        <div className="mt-6">
          <TalkMeBadge
            text="HAR KUNI BIR QADAM"
            containerColor="bg-[#F1EDFA]"
            textColor="text-[#5E4B8B]"
          />
        </div>

        <h2 className="text-2xl font-extrabold text-[#1D1B20] mt-3 leading-snug">
          Ingliz tilini o‘zingizga{' '}
          <span className="text-[#5E4B8B] underline decoration-[#5E4B8B]/30">ishongan holda</span>{' '}
          o‘rganing.
        </h2>

        <p className="text-sm text-[#757575] mt-2 leading-relaxed">
          O‘zbekcha tushuntirishlar, qisqa mashqlar va har kuni seziladigan o‘sish.
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap gap-2.5 mt-5">
          <TalkMeBadge
            text="Kuniga 10 daqiqa"
            icon={<Clock className="w-3.5 h-3.5 text-[#5E4B8B]" />}
            containerColor="bg-[#F1EDFA]"
            textColor="text-[#5E4B8B]"
          />
          <TalkMeBadge
            text="O‘z sur‘atingizda"
            icon={<RotateCcw className="w-3.5 h-3.5 text-[#5E4B8B]" />}
            containerColor="bg-[#F1EDFA]"
            textColor="text-[#5E4B8B]"
          />
        </div>
      </div>

      <div className="px-5 mt-8 space-y-3">
        <TalkMeButton
          text="O‘rganishni boshlash"
          trailingIcon={<ChevronRight className="w-5 h-5" />}
          onClick={() => navigate('home')}
        />

        <TalkMeButton
          text="Hisobim bor · Kirish"
          variant="secondary"
          onClick={() => navigate('home')}
        />

        <p className="text-[11px] text-[#9E9E9E] text-center pt-2 leading-normal">
          Davom etish orqali foydalanish shartlari va maxfiylik siyosatiga rozilik bildirasiz.
        </p>
      </div>
    </div>
  );
};
