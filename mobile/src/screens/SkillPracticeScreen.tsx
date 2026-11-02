import React from 'react';
import { useApp } from '../context/AppContext';
import { ComingSoonScreen } from '../components/ComingSoonScreen';

const SKILL_LABELS: Record<string, string> = {
  listening: 'Tinglash (Listening)',
  speaking: 'Gapirish (Speaking)',
  reading: 'O‘qish (Reading)',
  writing: 'Yozish (Writing)',
};

export const SkillPracticeScreen: React.FC = () => {
  const { selectedSkillType } = useApp();
  return (
    <ComingSoonScreen
      title={SKILL_LABELS[selectedSkillType] || 'Amaliyot'}
      description="Bu ko‘nikma bo‘yicha mashqlar ro‘yxati tez orada to‘liq ko‘chiriladi."
    />
  );
};
