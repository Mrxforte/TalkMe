import React, { ReactNode } from 'react';

interface TalkMeCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  containerColor?: string;
  borderColor?: string;
}

export const TalkMeCard: React.FC<TalkMeCardProps> = ({
  children,
  onClick,
  className = '',
  containerColor = 'bg-white',
  borderColor = 'border-[#E0E4EC]',
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-4 border transition-all duration-150 shadow-[0_1px_3px_rgba(0,0,0,0.06)] ${containerColor} ${borderColor} ${
        onClick
          ? 'cursor-pointer hover:border-[#3949AB]/50 hover:shadow-[0_3px_8px_rgba(57,73,171,0.1)] active:scale-[0.99]'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
