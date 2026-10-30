import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBottomBar } from '../components/TalkMeBottomBar';
import { TalkMeBadge } from '../components/TalkMeBadge';
import { TalkMeCard } from '../components/TalkMeCard';
import { TalkMeProgressBar } from '../components/TalkMeProgressBar';
import { TalkMeButton } from '../components/TalkMeButton';
import { Rating } from '../types';
import {
  Volume2,
  CheckCircle,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RepeatScreen: React.FC = () => {
  const {
    vocabList,
    dailyStats,
    submitFsrsReview,
    resetFsrsVocab,
    navigate,
    goBack,
    playTts,
    isTtsSpeaking,
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);

  // Active review list
  const dueItems = vocabList;
  const currentItem = dueItems[currentIndex];
  const isFinished = currentIndex >= dueItems.length;

  const handleRating = (rating: Rating) => {
    if (!currentItem) return;
    submitFsrsReview(currentItem.card.cardId, rating);
    setIsAnswerRevealed(false);

    if (currentIndex + 1 >= dueItems.length) {
      confetti({ particleCount: 50, spread: 60 });
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    resetFsrsVocab();
    setCurrentIndex(0);
    setIsAnswerRevealed(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-24 text-[#1D1B20]">
      <div className="px-5 pt-4 space-y-4 max-w-md mx-auto">
        <TalkMeHeader
          title="Takrorlash bo‘limi"
          subtitle="FSRS-6 algoritmi bo‘yicha oraliqli takrorlash"
          onBackClick={goBack}
          trailingContent={
            <button
              onClick={handleRestart}
              type="button"
              className="w-10 h-10 rounded-full bg-white border border-[#F0EFF5] flex items-center justify-center text-[#5E4B8B] hover:bg-[#F3EFFC] transition-colors cursor-pointer shadow-xs"
              title="So‘zlarni qayta boshlash"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          }
        />

        {/* ==========================================
            1. FSRS DAILY REPETITION DASHBOARD
           ========================================== */}
        <div className="rounded-3xl p-5 bg-[#F1EDFA] border border-[#5E4B8B]/20 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black tracking-wider text-[#5E4B8B] uppercase">
              FSRS Memory Retention Dashboard
            </h3>

            <TalkMeBadge
              text={`${dailyStats.retentionPercentage}% Retention`}
              containerColor="bg-[#E8F8EE]"
              textColor="text-[#27AE60]"
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="text-left">
              <p className="text-2xl font-black text-[#5E4B8B]">{dailyStats.dueWordsCount}</p>
              <p className="text-xs text-[#757575] font-semibold">Qolgan Dars</p>
            </div>

            <div>
              <p className="text-2xl font-black text-[#27AE60]">{dailyStats.completedTodayCount}</p>
              <p className="text-xs text-[#757575] font-semibold">Bugun Bajarildi</p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-black text-[#1D1B20]">{dailyStats.dailyStreakDays} kun</p>
              <p className="text-xs text-[#757575] font-semibold">Ketma-ketlik</p>
            </div>
          </div>

          <TalkMeProgressBar
            progress={
              dailyStats.dueWordsCount + dailyStats.completedTodayCount > 0
                ? dailyStats.completedTodayCount /
                  (dailyStats.dueWordsCount + dailyStats.completedTodayCount)
                : 1
            }
            progressColor="bg-[#27AE60]"
          />
        </div>

        {/* ==========================================
            2. INTERACTIVE FLASHCARD SESSION
           ========================================== */}
        {isFinished || !currentItem ? (
          <div className="rounded-3xl p-8 bg-[#E8F8EE] border border-[#27AE60]/40 text-center space-y-3 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-white text-[#27AE60] flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h3 className="text-xl font-extrabold text-[#27AE60]">
              🎉 Barcha takrorlashlar bugunga bajarildi!
            </h3>

            <p className="text-xs text-[#2E7D32] leading-relaxed max-w-xs mx-auto">
              Ertaga FSRS algoritmi bo‘yicha yangi so‘zlar xotirada saqlanish darajasi asosida takrorlashga tayyorlanadi.
            </p>

            <div className="pt-2">
              <TalkMeButton
                text="So‘zlarni qayta mashq qilish"
                variant="secondary"
                onClick={handleRestart}
              />
            </div>
          </div>
        ) : (
          <TalkMeCard className="p-6 text-center space-y-4">
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <TalkMeBadge
                text={currentItem.category}
                containerColor="bg-[#F1EDFA]"
                textColor="text-[#5E4B8B]"
              />

              <span className="text-xs font-bold text-[#757575]">
                {currentIndex + 1} / {dueItems.length}
              </span>
            </div>

            {/* Target Word & Audio Button */}
            <div className="py-2 flex items-center justify-center gap-3">
              <h2 className="text-3xl font-black text-[#1D1B20] tracking-tight">
                {currentItem.word}
              </h2>

              <button
                onClick={() => playTts(currentItem.word)}
                type="button"
                className="w-11 h-11 rounded-full bg-[#F1EDFA] text-[#5E4B8B] flex items-center justify-center hover:bg-[#5E4B8B] hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
                title="Talaffuzni tinglash"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm font-semibold text-[#5E4B8B] -mt-2">
              {currentItem.phonetic}
            </p>

            {/* Hidden vs Revealed Answer */}
            {!isAnswerRevealed ? (
              <div className="pt-4">
                <TalkMeButton
                  text="Javobni Ko‘rsatish"
                  variant="secondary"
                  onClick={() => {
                    setIsAnswerRevealed(true);
                    playTts(currentItem.exampleEn);
                  }}
                />
              </div>
            ) : (
              <div className="space-y-4 pt-2 border-t border-[#F0EFF5] animate-fade-in">
                {/* Translation */}
                <div>
                  <p className="text-xs text-[#757575] font-semibold uppercase">Tarjimasi</p>
                  <p className="text-2xl font-extrabold text-[#27AE60] mt-0.5">
                    {currentItem.translation}
                  </p>
                </div>

                {/* Example sentence */}
                <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#F0EFF5] text-left">
                  <p className="text-sm font-bold text-[#1D1B20]">
                    “{currentItem.exampleEn}”
                  </p>
                  <p className="text-xs text-[#757575] mt-1">{currentItem.exampleUz}</p>
                </div>

                {/* ==========================================
                    FSRS 4-RATING RECALL BUTTONS
                   ========================================== */}
                <div className="pt-2">
                  <p className="text-xs font-bold text-[#757575] mb-2.5">
                    Xotirada Saqlanish Darajasini Baholang:
                  </p>

                  <div className="grid grid-cols-4 gap-2">
                    {/* AGAIN */}
                    <button
                      onClick={() => handleRating(Rating.AGAIN)}
                      className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-all cursor-pointer text-center active:scale-95"
                    >
                      <p className="text-xs font-black">Qayta</p>
                      <p className="text-[10px] text-rose-600 font-semibold mt-0.5">1 daq</p>
                    </button>

                    {/* HARD */}
                    <button
                      onClick={() => handleRating(Rating.HARD)}
                      className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-all cursor-pointer text-center active:scale-95"
                    >
                      <p className="text-xs font-black">Qiyin</p>
                      <p className="text-[10px] text-amber-700 font-semibold mt-0.5">1 kun</p>
                    </button>

                    {/* GOOD */}
                    <button
                      onClick={() => handleRating(Rating.GOOD)}
                      className="p-2.5 rounded-xl bg-[#E8F8EE] border border-[#27AE60]/40 text-[#2E7D32] hover:bg-[#D2F5DC] transition-all cursor-pointer text-center active:scale-95"
                    >
                      <p className="text-xs font-black">Yaxshi</p>
                      <p className="text-[10px] text-[#27AE60] font-semibold mt-0.5">3 kun</p>
                    </button>

                    {/* EASY */}
                    <button
                      onClick={() => handleRating(Rating.EASY)}
                      className="p-2.5 rounded-xl bg-[#F1EDFA] border border-[#5E4B8B]/40 text-[#5E4B8B] hover:bg-[#E7E0F7] transition-all cursor-pointer text-center active:scale-95"
                    >
                      <p className="text-xs font-black">Oson</p>
                      <p className="text-[10px] text-[#5E4B8B] font-semibold mt-0.5">7 kun</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </TalkMeCard>
        )}
      </div>

      <TalkMeBottomBar
        selectedTab={2}
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
