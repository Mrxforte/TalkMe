import React, { ReactNode } from 'react';

interface TalkMeButtonProps {
  text: string;
  onClick?: () => void;
  trailingIcon?: ReactNode;
  leadingIcon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export const TalkMeButton: React.FC<TalkMeButtonProps> = ({
  text,
  onClick,
  trailingIcon,
  leadingIcon,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
  fullWidth = true,
}) => {
  let variantClasses = 'bg-[#5E4B8B] text-white hover:bg-[#4E3D75] shadow-xs active:scale-[0.98]';

  if (variant === 'secondary') {
    variantClasses = 'bg-[#F1EDFA] text-[#5E4B8B] hover:bg-[#E7E0F7] active:scale-[0.98]';
  } else if (variant === 'outline') {
    variantClasses = 'bg-white border-2 border-[#5E4B8B] text-[#5E4B8B] hover:bg-[#F3EFFC] active:scale-[0.98]';
  } else if (variant === 'danger') {
    variantClasses = 'bg-rose-500 text-white hover:bg-rose-600 active:scale-[0.98]';
  } else if (variant === 'ghost') {
    variantClasses = 'bg-transparent text-[#757575] hover:text-[#1D1B20] hover:bg-gray-100';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`h-13 font-bold rounded-2xl flex items-center justify-center gap-2 px-6 transition-all duration-150 select-none ${
        fullWidth ? 'w-full' : 'w-auto'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${variantClasses} ${className}`}
    >
      {leadingIcon && <span className="inline-flex shrink-0">{leadingIcon}</span>}
      <span className="truncate">{text}</span>
      {trailingIcon && <span className="inline-flex shrink-0">{trailingIcon}</span>}
    </button>
  );
};
