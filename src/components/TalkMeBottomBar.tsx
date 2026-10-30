import React from 'react';
import { Home, BookOpen, RotateCcw, Award } from 'lucide-react';

interface TalkMeBottomBarProps {
  selectedTab: number;
  onTabSelected: (index: number) => void;
}

export const TalkMeBottomBar: React.FC<TalkMeBottomBarProps> = ({
  selectedTab,
  onTabSelected,
}) => {
  const tabs = [
    { label: 'Bosh sahifa', icon: Home, index: 0 },
    { label: 'Kurslar', icon: BookOpen, index: 1 },
    { label: 'Takrorlash', icon: RotateCcw, index: 2 },
    { label: 'Natijalar', icon: Award, index: 3 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F0EFF5] px-4 py-2 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedTab === tab.index;

          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => onTabSelected(tab.index)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer relative ${
                isActive ? 'text-[#5E4B8B]' : 'text-[#9E9E9E] hover:text-[#5E4B8B]/70'
              }`}
            >
              <div
                className={`w-10 h-7 flex items-center justify-center rounded-full transition-all ${
                  isActive ? 'bg-[#F1EDFA]' : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
