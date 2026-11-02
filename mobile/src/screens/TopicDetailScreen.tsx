import React from 'react';
import { ComingSoonScreen } from '../components/ComingSoonScreen';

export const TopicDetailScreen: React.FC = () => (
  <ComingSoonScreen title="Mavzu tafsiloti" description="Mavzu bo‘yicha batafsil ko‘rinish tez orada ko‘chiriladi." />
);

export const TopicWordsDetailScreen: React.FC = () => (
  <ComingSoonScreen title="Mavzu so‘zlari" description="Mavzuga oid so‘zlar ro‘yxati tez orada ko‘chiriladi." />
);

export const TopicRulesDetailScreen: React.FC = () => (
  <ComingSoonScreen title="Mavzu qoidalari" description="Mavzuga oid grammatik qoidalar tez orada ko‘chiriladi." />
);
