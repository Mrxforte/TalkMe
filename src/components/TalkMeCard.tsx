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
  borderColor = 'border-[#F0EFF5]',
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-4.5 border transition-all duration-150 shadow-xs ${containerColor} ${borderColor} ${
        onClick ? 'cursor-pointer hover:border-[#5E4B8B]/40 hover:shadow-md active:scale-[0.99]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
