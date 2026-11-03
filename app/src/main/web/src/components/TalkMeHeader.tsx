import React, { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface TalkMeHeaderProps {
  title: string;
  subtitle?: string;
  leadingIcon?: ReactNode;
  onBackClick?: () => void;
  trailingContent?: ReactNode;
}

export const TalkMeHeader: React.FC<TalkMeHeaderProps> = ({
  title,
  leadingIcon,
  onBackClick,
  trailingContent,
}) => {
  const { goBack } = useApp();
  const handleBack = onBackClick || goBack;

  return (
    <header className="flex items-center justify-between py-3 mb-2 border-b border-[#E0E4EC]">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          onClick={handleBack}
          type="button"
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-[#E0E4EC] text-[#212121] hover:bg-[#E8EAF6] hover:text-[#3949AB] transition-colors cursor-pointer shrink-0 active:scale-95 shadow-2xs"
          aria-label="Orqaga"
        >
          <ArrowLeft className="w-5 h-5 text-[#3949AB]" />
        </button>
        {leadingIcon && (
          <div className="w-10 h-10 rounded-xl bg-[#E8EAF6] border border-[#C5CAE9] text-[#3949AB] flex items-center justify-center shrink-0">
            {leadingIcon}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-[#212121] leading-snug truncate">
            {title}
          </h1>
        </div>
      </div>

      {trailingContent && (
        <div className="flex items-center gap-2 shrink-0 ml-2">{trailingContent}</div>
      )}
    </header>
  );
};
