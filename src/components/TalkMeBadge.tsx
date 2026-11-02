import React, { ReactNode } from 'react';

interface TalkMeBadgeProps {
  text: string;
  icon?: ReactNode;
  containerColor?: string;
  textColor?: string;
  className?: string;
  onClick?: () => void;
}

export const TalkMeBadge: React.FC<TalkMeBadgeProps> = ({
  text,
  icon,
  containerColor = 'bg-[#F3EFFC]',
  textColor = 'text-[#5E4B8B]',
  className = '',
  onClick,
}) => {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide transition-all ${containerColor} ${textColor} ${
        onClick ? 'cursor-pointer hover:opacity-90 active:scale-95' : ''
      } ${className}`}
    >
      {icon && <span className="inline-flex items-center text-current">{icon}</span>}
      <span>{text}</span>
    </span>
  );
};
