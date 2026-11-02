import React, { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';

interface TalkMeHeaderProps {
  title: string;
  subtitle?: string;
  onBackClick?: () => void;
  trailingContent?: ReactNode;
}

export const TalkMeHeader: React.FC<TalkMeHeaderProps> = ({
  title,
  subtitle,
  onBackClick,
  trailingContent,
}) => {
  return (
    <div className="flex items-center justify-between py-3 mb-2">
      <div className="flex items-center gap-3">
        {onBackClick && (
          <button
            onClick={onBackClick}
            type="button"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[#F0EFF5] text-[#1D1B20] hover:bg-[#F3EFFC] hover:text-[#5E4B8B] transition-colors shadow-xs active:scale-95"
            aria-label="Orqaga"
          >
            <ChevronLeft className="w-5 h-5 text-[#5E4B8B]" />
          </button>
        )}
        <div>
          <h1 className="text-xl font-bold text-[#1D1B20] leading-tight tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs text-[#757575] font-medium mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {trailingContent && <div className="flex items-center">{trailingContent}</div>}
    </div>
  );
};
