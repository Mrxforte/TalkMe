import React from 'react';
import { Home, BookOpen, Target, RotateCcw, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScreenRoute } from '../types';

interface TalkMeBottomBarProps {
  selectedTab?: number;
  onTabSelected?: (index: number) => void;
}

export const TalkMeBottomBar: React.FC<TalkMeBottomBarProps> = () => {
  const { currentScreen, navigate } = useApp();

  const tabs: Array<{
    label: string;
    route: ScreenRoute;
    icon: React.ComponentType<{ className?: string }>;
    isCenter?: boolean;
  }> = [
    { label: 'Bosh sahifa', route: 'home', icon: Home },
    { label: 'Kurslar', route: 'courses', icon: BookOpen },
    { label: 'Amaliyot', route: 'practice_center', icon: Target, isCenter: true },
    { label: 'Takrorlash', route: 'repeat', icon: RotateCcw },
    { label: 'Profil', route: 'profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E0E4EC] shadow-[0_-2px_8px_rgba(0,0,0,0.05)]">
      <div className="max-w-3xl mx-auto grid grid-cols-5 items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.route;

          if (tab.isCenter) {
            return (
              <button
                key={tab.route}
                type="button"
                onClick={() => navigate(tab.route)}
                className="h-full flex flex-col items-center justify-center cursor-pointer group relative"
                aria-label="Practice Center"
              >
                <div
                  className={`w-11 h-11 -mt-3 rounded-2xl flex items-center justify-center transition-all shadow-sm border ${
                    isActive
                      ? 'bg-[#00897B] text-white border-[#00695C] scale-105'
                      : 'bg-[#3949AB] text-white border-[#283593] group-hover:bg-[#283593]'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span
                  className={`text-[10px] mt-0.5 tracking-tight whitespace-nowrap ${
                    isActive ? 'font-bold text-[#00897B]' : 'font-semibold text-[#3949AB]'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.route}
              type="button"
              onClick={() => navigate(tab.route)}
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
