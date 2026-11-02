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
  let variantClasses =
    'bg-[#3949AB] text-white hover:bg-[#283593] shadow-[0_2px_4px_rgba(57,73,171,0.24)] active:scale-[0.99]';

  if (variant === 'secondary') {
    variantClasses =
      'bg-[#E8EAF6] text-[#3949AB] hover:bg-[#C5CAE9] active:scale-[0.99]';
  } else if (variant === 'outline') {
    variantClasses =
      'bg-white border border-[#3949AB] text-[#3949AB] hover:bg-[#E8EAF6]/50 active:scale-[0.99]';
  } else if (variant === 'danger') {
    variantClasses =
      'bg-[#D32F2F] text-white hover:bg-[#B71C1C] active:scale-[0.99]';
  } else if (variant === 'ghost') {
    variantClasses =
      'bg-transparent text-[#616161] hover:text-[#212121] hover:bg-slate-100';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`min-h-[46px] font-semibold text-sm rounded-lg flex items-center justify-center gap-2 px-5 transition-all duration-150 select-none ${
        fullWidth ? 'w-full' : 'w-auto'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${variantClasses} ${className}`}
    >
      {leadingIcon && <span className="inline-flex shrink-0">{leadingIcon}</span>}
      <span className="truncate">{text}</span>
      {trailingIcon && <span className="inline-flex shrink-0">{trailingIcon}</span>}
    </button>
  );
};
