import React from 'react';
import { Check } from 'lucide-react';

interface TalkMeTabRowProps {
  tabs: string[];
  selectedIndex: number;
  onTabSelected: (index: number) => void;
  completedIndices?: number[];
  className?: string;
}

export const TalkMeTabRow: React.FC<TalkMeTabRowProps> = ({
  tabs,
  selectedIndex,
  onTabSelected,
  completedIndices = [],
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-1.5 p-1 bg-[#F0EFF5] rounded-xl ${className}`}>
      {tabs.map((tab, idx) => {
        const isSelected = selectedIndex === idx;
        const isCompleted = completedIndices.includes(idx);

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabSelected(idx)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1 cursor-pointer ${
              isSelected
                ? 'bg-white text-[#5E4B8B] shadow-xs'
                : 'text-[#757575] hover:text-[#1D1B20]'
            }`}
          >
            {isCompleted && (
              <span className="w-3.5 h-3.5 rounded-full bg-[#27AE60] text-white flex items-center justify-center text-[9px]">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
            <span>{tab}</span>
          </button>
        );
      })}
    </div>
  );
};
