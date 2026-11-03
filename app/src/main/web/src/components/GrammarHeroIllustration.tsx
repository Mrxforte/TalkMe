import React from 'react';
import { BookOpen, Sparkles, Star, GraduationCap } from 'lucide-react';

export const GrammarHeroIllustration: React.FC = () => {
  return (
    <div className="relative w-full h-56 rounded-3xl bg-linear-to-br from-[#F1EDFA] via-[#E8F8EE] to-[#F1EDFA] border border-[#5E4B8B]/15 overflow-hidden flex items-center justify-center shadow-xs">
      {/* Decorative gradient glow circles */}
      <div className="absolute top-2 left-6 w-32 h-32 bg-[#5E4B8B]/10 rounded-full blur-2xl" />
      <div className="absolute bottom-2 right-6 w-32 h-32 bg-[#27AE60]/10 rounded-full blur-2xl" />

      {/* Floating badges */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs border border-[#F0EFF5] rounded-xl px-2.5 py-1 flex items-center gap-1.5 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-[#27AE60] animate-pulse" />
        <span className="text-[11px] font-bold text-[#1D1B20]">A2 CEFR</span>
      </div>

      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-xs border border-[#F0EFF5] rounded-xl px-2.5 py-1 flex items-center gap-1.5 shadow-xs">
        <span className="text-amber-500 text-xs">⚡</span>
        <span className="text-[11px] font-bold text-[#5E4B8B]">Voice AI TTS</span>
      </div>

      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs border border-[#F0EFF5] rounded-xl px-2.5 py-1 flex items-center gap-1.5 shadow-xs">
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        <span className="text-[11px] font-bold text-amber-600">FSRS-6</span>
      </div>

      {/* Main 3D Composition */}
      <div className="relative flex flex-col items-center">
        {/* Graduation cap */}
        <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-[#F0EFF5] flex items-center justify-center text-[#5E4B8B] -mb-3 z-10 transform -rotate-6">
          <GraduationCap className="w-8 h-8" />
        </div>

        {/* Central Book Stack */}
        <div className="w-36 h-22 rounded-2xl bg-[#5E4B8B] shadow-lg flex flex-col items-center justify-center text-white px-3 border-2 border-white/40">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-5 h-5 text-amber-300" />
            <span className="font-extrabold text-sm tracking-wide">TalkMe</span>
          </div>
          <span className="text-[10px] text-white/80 mt-1 font-medium text-center">
            English Grammar & Speech
          </span>
        </div>

        {/* Floating Letters */}
        <span className="absolute -left-10 top-8 text-2xl font-black text-[#5E4B8B]/40 select-none transform -rotate-12">
          Aa
        </span>
        <span className="absolute -right-10 top-6 text-2xl font-black text-[#27AE60]/50 select-none transform rotate-12">
          Bb
        </span>
        <span className="absolute right-4 -bottom-2 text-lg font-black text-amber-500/60 select-none">
          Cc
        </span>

        <Sparkles className="absolute -top-1 right-2 w-5 h-5 text-amber-400 animate-bounce" />
      </div>
    </div>
  );
};
