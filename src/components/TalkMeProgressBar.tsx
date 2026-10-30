import React from 'react';

interface TalkMeProgressBarProps {
  progress: number; // 0.0 to 1.0
  height?: string;
  progressColor?: string;
  trackColor?: string;
  className?: string;
}

export const TalkMeProgressBar: React.FC<TalkMeProgressBarProps> = ({
  progress,
  height = 'h-2.5',
  progressColor = 'bg-[#5E4B8B]',
  trackColor = 'bg-[#F0EFF5]',
  className = '',
}) => {
  const clamped = Math.max(0, Math.min(1, progress));
  const percent = Math.round(clamped * 100);

  return (
    <div className={`w-full overflow-hidden rounded-full ${trackColor} ${height} ${className}`}>
      <div
        className={`h-full transition-all duration-500 ease-out rounded-full ${progressColor}`}
        style={{ width: `${percent}%` }}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};
