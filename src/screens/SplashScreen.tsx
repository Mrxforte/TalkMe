import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Mic, Sparkles } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { navigate } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('home');
    }, 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      onClick={() => navigate('home')}
      className="min-h-screen bg-linear-to-b from-[#5E4B8B] to-[#43326B] text-white flex flex-col justify-between items-center p-8 cursor-pointer select-none"
    >
      <div className="w-full flex justify-end">
        <span className="text-xs font-semibold px-3 py-1 bg-white/10 rounded-full text-white/80">
          v1.0 • FSRS & Voice AI
        </span>
      </div>

      <div className="flex flex-col items-center text-center animate-fade-in">
        {/* Animated Brand Logo Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-white text-[#5E4B8B] flex items-center justify-center shadow-2xl transform rotate-3">
            <Mic className="w-12 h-12 stroke-[2.2]" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-7 h-7 text-amber-300 animate-pulse" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight">TalkMe</h1>
        <p className="text-white/80 text-sm mt-2 max-w-xs font-medium">
          Kichik qadamlar, katta imkoniyatlar.
        </p>
      </div>

      <div className="text-center">
        <p className="text-[11px] font-bold tracking-widest text-white/60 uppercase">
          INGLIZ TILI — O‘ZBEKCHA IZOH
        </p>
        <p className="text-[10px] text-white/40 mt-1">Davom etish uchun ekranga bosing</p>
      </div>
    </div>
  );
};
