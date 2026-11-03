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
    <div className={`flex items-center border-b border-[#E0E4EC] bg-white rounded-t-lg overflow-hidden ${className}`}>
      {tabs.map((tab, idx) => {
        const isSelected = selectedIndex === idx;
        const isCompleted = completedIndices.includes(idx);

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabSelected(idx)}
            className={`flex-1 py-2.5 px-3 text-xs font-semibold transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer relative ${
              isSelected
                ? 'text-[#3949AB] bg-[#E8EAF6]/30'
                : 'text-[#616161] hover:text-[#212121] hover:bg-slate-50'
            }`}
          >
            {isCompleted && (
              <span className="w-3.5 h-3.5 rounded-full bg-[#00897B] text-white flex items-center justify-center text-[9px]">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
            <span className="whitespace-nowrap">{tab}</span>
            {isSelected && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3949AB]" />
            )}
          </button>
        );
      })}
    </div>
  );
};
