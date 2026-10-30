import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeBottomBar } from '../components/TalkMeBottomBar';
import { TalkMeButton } from '../components/TalkMeButton';
import { LevelNodeItem, LevelNodeType, LevelStatus } from '../types';
import {
  ChevronLeft,
  Flame,
  BookOpen,
  Mic,
  RotateCcw,
  Headphones,
  Star,
  Gift,
  Video,
  X,
  ArrowUp,
} from 'lucide-react';

export const CourseLevelsScreen: React.FC = () => {
  const {
    selectedCourseId,
    streakDays,
    diamonds,
    navigate,
    goBack,
    completedLevelIds,
  } = useApp();

  const [selectedNode, setSelectedNode] = useState<LevelNodeItem | null>(null);

  const courseTitle =
    selectedCourseId === 'nouns'
      ? 'Grammar Fundamentals'
      : selectedCourseId === 'adjectives'
      ? 'Sifat (Adjectives)'
      : selectedCourseId === 'numerals'
      ? 'Son (Numerals)'
      : selectedCourseId === 'verbs'
      ? 'Fe‘l va Zamonlar'
      : selectedCourseId === 'pronouns'
      ? 'Olmosh (Pronouns)'
      : selectedCourseId === 'prepositions'
      ? 'Predloglar'
      : 'Express Travel Needs';

  const levelNodes: LevelNodeItem[] = [
    {
      id: 'lvl_1',
      title: '1-Dars: Kirish so‘zlari',
      subtitle: 'Boshlang‘ich iboralar va fonetika',
      nodeType: 'MASCOT_INTRO',
      status: 'COMPLETED',
      stars: 3,
      horizontalOffsetRatio: 0,
      xpReward: 10,
    },
    {
      id: 'lvl_2',
      title: '2-Dars: Yulduzli mashq',
      subtitle: 'Grammatika asosi va so‘z tartibi',
      nodeType: 'STAR',
      status: 'COMPLETED',
      stars: 3,
      horizontalOffsetRatio: 0.38,
      xpReward: 10,
    },
    {
      id: 'lvl_3',
      title: '3-Dars: Mutolaa va O‘qish',
      subtitle: 'Matn bilan ishlash va tushunish',
      nodeType: 'READING',
      status: 'COMPLETED',
      stars: 3,
      horizontalOffsetRatio: 0.22,
      xpReward: 15,
    },
    {
      id: 'lvl_chest_1',
      title: 'Xazina Sandig‘i',
      subtitle: '+20 XP va 15 Olmos mukofoti',
      nodeType: 'CHEST',
      status: 'COMPLETED',
      stars: 0,
      horizontalOffsetRatio: 0,
      xpReward: 20,
    },
    {
      id: 'lvl_4',
      title: '4-Dars: Gapirish va Talaffuz',
      subtitle: 'Present continuous ovozli mashg‘ulot',
      nodeType: 'MIC',
      status: 'CURRENT',
      stars: 0,
      horizontalOffsetRatio: -0.32,
      xpReward: 20,
    },
    {
      id: 'lvl_5',
      title: '5-Dars: Mustahkamlash mashqi',
      subtitle: 'Intensiv amaliyot va savollar',
      nodeType: 'PRACTICE',
      status: 'LOCKED',
      stars: 0,
      horizontalOffsetRatio: -0.42,
      xpReward: 15,
    },
    {
      id: 'lvl_6',
      title: '6-Dars: Video Darslik',
      subtitle: 'Vizual dialoglar va hikoya',
      nodeType: 'CAMERA',
      status: 'LOCKED',
      stars: 0,
      horizontalOffsetRatio: -0.18,
      xpReward: 15,
    },
    {
      id: 'lvl_7',
      title: '7-Dars: Tinglab tushunish',
      subtitle: 'Audio mashg‘ulot va fonetika',
      nodeType: 'HEADPHONES',
      status: 'LOCKED',
      stars: 0,
      horizontalOffsetRatio: 0.18,
      xpReward: 20,
    },
    {
      id: 'lvl_chest_2',
      title: 'Yakuniy Katta Xazina',
      subtitle: 'Bo‘lim sertifikati va 50 Olmos',
      nodeType: 'CHEST',
      status: 'LOCKED',
      stars: 0,
      horizontalOffsetRatio: 0,
      xpReward: 50,
    },
  ];

  const handleStartNode = (node: LevelNodeItem) => {
    setSelectedNode(null);
    if (node.nodeType === 'MIC' || node.id === 'lvl_4') {
      navigate('lesson_detail', { levelId: node.id });
    } else if (node.nodeType === 'PRACTICE' || node.nodeType === 'STAR') {
      navigate('quiz', { levelId: node.id });
    } else {
      navigate('lesson_detail', { levelId: node.id });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-24 text-[#1D1B20]">
      {/* ==========================================
          1. TOP DUOLINGO STATUS BAR
         ========================================== */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] px-4 py-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-[#1D1B20] transition-colors cursor-pointer"
            aria-label="Orqaga"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Country flag chip */}
          <div className="px-2 py-1 rounded-lg bg-[#F0F0F0] border border-[#E0E0E0] text-sm select-none">
            🇺🇸 English
          </div>
        </div>

        {/* Streak Flame */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFF4E5] text-[#FF9600] font-black text-xs">
          <Flame className="w-4 h-4 fill-[#FF9600]" />
          <span>{streakDays}</span>
        </div>

        {/* Diamonds */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#E5F6FE] text-[#1CB0F6] font-black text-xs">
          <span>💎</span>
          <span>{diamonds.toLocaleString()}</span>
        </div>

        {/* Magic Chest */}
        <div className="w-9 h-9 rounded-full bg-[#F3EFFC] flex items-center justify-center text-sm cursor-pointer hover:scale-105 transition-transform">
          🔮
        </div>
      </div>

      <div className="px-4 pt-3 max-w-md mx-auto">
        {/* ==========================================
            2. DUOLINGO GREEN UNIT BANNER WITH 3D DEPTH
           ========================================== */}
        <div className="relative rounded-2xl bg-[#46A302] pb-1.5 shadow-md">
          <div className="rounded-2xl bg-[#58CC02] p-4 text-white flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black tracking-wider uppercase text-white/90">
                SECTION 2, UNIT 2
              </span>
              <h2 className="text-xl font-black mt-0.5 tracking-tight">{courseTitle}</h2>
            </div>

            <button
              onClick={() => navigate('courses')}
              className="w-11 h-11 rounded-xl bg-white/20 border border-white/50 flex items-center justify-center text-white hover:bg-white/30 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Guidebook"
            >
              <BookOpen className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ==========================================
            3. CURVED DUOLINGO PATH & 3D BUTTONS
           ========================================== */}
        <div className="relative mt-8 min-h-[920px]">
          {/* Curved connecting SVG path */}
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            viewBox="0 0 360 880"
            fill="none"
          >
            <path
              d="M 180 35 C 260 70, 260 110, 245 130 C 230 160, 210 200, 180 230 C 140 265, 110 300, 120 330 C 130 360, 110 400, 105 430 C 100 465, 140 500, 150 530 C 160 560, 210 600, 215 630 C 220 665, 190 700, 180 730"
              stroke="#E5E5E5"
              strokeWidth="12"
              strokeDasharray="14 14"
              strokeLinecap="round"
            />
          </svg>

          {/* Level Nodes */}
          <div className="space-y-7 relative z-10 pt-2">
            {levelNodes.map((node) => {
              const isCurrent = node.status === 'CURRENT';
              const isCompleted =
                node.status === 'COMPLETED' || completedLevelIds.includes(node.id);
              const isLocked = !isCurrent && !isCompleted;
              const isChest = node.nodeType === 'CHEST';

              // Horizontal translation based on ratio
              const xTranslate = node.horizontalOffsetRatio * 150;

              return (
                <div
                  key={node.id}
                  className="flex flex-col items-center justify-center"
                  style={{ transform: `translateX(${xTranslate}px)` }}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Pulsing ring for current node */}
                    {isCurrent && (
                      <span className="absolute -inset-2.5 rounded-full bg-[#58CC02]/30 animate-ping pointer-events-none" />
                    )}

                    {/* Floating mascot owl next to intro or current node */}
                    {(node.nodeType === 'MASCOT_INTRO' || isCurrent) && (
                      <div
                        className={`absolute -top-3 ${
                          node.horizontalOffsetRatio <= 0 ? '-right-10' : '-left-10'
                        } w-11 h-11 rounded-full bg-[#E8F8EE] border-2 border-[#58CC02] flex items-center justify-center text-xl shadow-md z-20 animate-bounce`}
                      >
                        🦉
                      </div>
                    )}

                    {/* Tactile 3D Circular Button */}
                    <div
                      onClick={() => setSelectedNode(node)}
                      className={`relative w-18 h-18 rounded-full cursor-pointer select-none duo-btn-3d ${
                        isChest
                          ? 'bg-[#E5A100] pb-1.5'
                          : isCompleted || isCurrent
                          ? 'bg-[#46A302] pb-1.5'
                          : 'bg-[#AFAFAF] pb-1.5'
                      } shadow-md`}
                    >
                      <div
                        className={`w-full h-full rounded-full flex items-center justify-center text-white ${
                          isChest
                            ? 'bg-[#FFC800] text-amber-950'
                            : isCompleted || isCurrent
                            ? 'bg-[#58CC02]'
                            : 'bg-[#E5E5E5] text-[#888888]'
                        }`}
                      >
                        {node.nodeType === 'MASCOT_INTRO' && <span className="text-2xl">🦉</span>}
                        {node.nodeType === 'STAR' && (
                          <Star className="w-8 h-8 fill-current stroke-current" />
                        )}
                        {node.nodeType === 'READING' && <BookOpen className="w-7 h-7 stroke-[2.5]" />}
                        {node.nodeType === 'CHEST' && <span className="text-2xl">🎁</span>}
                        {node.nodeType === 'MIC' && <Mic className="w-7 h-7 stroke-[2.5]" />}
                        {node.nodeType === 'PRACTICE' && (
                          <RotateCcw className="w-7 h-7 stroke-[2.5]" />
                        )}
                        {node.nodeType === 'CAMERA' && <span className="text-xl">📹</span>}
                        {node.nodeType === 'HEADPHONES' && (
                          <Headphones className="w-7 h-7 stroke-[2.5]" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stars for completed nodes */}
                  {(node.stars > 0 || isCompleted) && (
                    <div className="flex items-center gap-1 mt-1.5 bg-white/80 px-2 py-0.5 rounded-full shadow-2xs border border-[#F0EFF5]">
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-3 h-3 ${
                            starIdx <= (node.stars || 3)
                              ? 'fill-[#FFC800] text-[#FFC800]'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Jump to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-20 right-5 z-20 w-12 h-12 rounded-full bg-white border border-[#E0E0E0] shadow-lg flex items-center justify-center text-[#1CB0F6] hover:bg-[#F3EFFC] transition-all cursor-pointer active:scale-95"
        title="Yuqoriga"
      >
        <ArrowUp className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* ==========================================
          4. INTERACTIVE LEVEL DETAIL BOTTOM SHEET MODAL
         ========================================== */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center animate-fade-in">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-t-3xl p-6 shadow-2xl animate-slide-up border-t border-[#F0EFF5]"
          >
            {/* Top drag handle */}
            <div className="w-12 h-1.5 rounded-full bg-[#E0E0E0] mx-auto mb-4" />

            <div className="flex justify-between items-start">
              <span
                className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                  selectedNode.status === 'LOCKED'
                    ? 'bg-gray-100 text-gray-500'
                    : 'bg-[#E8F8EE] text-[#27AE60]'
                }`}
              >
                {selectedNode.status === 'COMPLETED'
                  ? 'YAKUNLANGAN (3/3 ⭐)'
                  : selectedNode.status === 'CURRENT'
                  ? 'HOZIRGI BO‘LIM'
                  : 'YOPILGAN BOSQICH'}
              </span>

              <button
                onClick={() => setSelectedNode(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-xl font-black text-[#1D1B20] mt-3">{selectedNode.title}</h3>
            <p className="text-xs text-[#757575] mt-1">{selectedNode.subtitle}</p>

            {/* Reward Card */}
            <div className="mt-4 p-3.5 rounded-2xl bg-[#FFF8E7] border border-[#FFC800] flex items-center justify-around">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <span className="text-sm font-extrabold text-[#D97706]">
                  +{selectedNode.xpReward} XP
                </span>
              </div>
              <div className="w-px h-6 bg-[#FFD97D]" />
              <div className="flex items-center gap-2">
                <span className="text-lg">💎</span>
                <span className="text-sm font-extrabold text-[#0284C7]">+5 Olmos</span>
              </div>
            </div>

            {/* Big Duolingo Start Button */}
            <div className="mt-6 space-y-2">
              <TalkMeButton
                text={
                  selectedNode.status === 'LOCKED'
                    ? 'BOSHLASH'
                    : `BOSHLASH (+${selectedNode.xpReward} XP)`
                }
                onClick={() => handleStartNode(selectedNode)}
                className="bg-[#58CC02] hover:bg-[#46A302] text-white shadow-md text-base"
              />

              <button
                onClick={() => setSelectedNode(null)}
                className="w-full py-2 text-xs font-bold text-gray-400 hover:text-gray-600 cursor-pointer text-center"
              >
                YOPISH
              </button>
            </div>
          </div>
        </div>
      )}

      <TalkMeBottomBar
        selectedTab={1}
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
