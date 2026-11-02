import React from 'react';
import { Home, BookOpen, RotateCcw, User } from 'lucide-react';

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
    { label: 'Profil', icon: User, index: 3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E0E4EC] shadow-[0_-2px_6px_rgba(0,0,0,0.04)]">
      <div className="max-w-3xl mx-auto grid grid-cols-4 items-center h-14 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedTab === tab.index;

          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => onTabSelected(tab.index)}
              className={`h-full flex flex-col items-center justify-center transition-colors cursor-pointer relative ${
                isActive ? 'text-[#3949AB]' : 'text-[#616161] hover:text-[#3949AB]'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-[#3949AB] rounded-b-full" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              <span
                className={`text-[11px] mt-1 tracking-tight whitespace-nowrap ${
                  isActive ? 'font-bold text-[#3949AB]' : 'font-medium text-[#616161]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
