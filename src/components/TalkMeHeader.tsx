import React, { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

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
    <header className="flex items-center justify-between py-3 mb-2 border-b border-[#E0E4EC]">
      <div className="flex items-center gap-3 min-w-0">
        {onBackClick && (
          <button
            onClick={onBackClick}
            type="button"
            className="w-11 h-11 rounded-lg flex items-center justify-center bg-white border border-[#E0E4EC] text-[#212121] hover:bg-[#E8EAF6] hover:text-[#3949AB] transition-colors cursor-pointer shrink-0 active:scale-95"
            aria-label="Orqaga"
          >
            <ArrowLeft className="w-5 h-5 text-[#3949AB]" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-[#212121] leading-snug truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs text-[#616161] font-medium mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {trailingContent && <div className="flex items-center shrink-0 ml-2">{trailingContent}</div>}
    </header>
  );
};
