import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBottomBar } from '../components/TalkMeBottomBar';
import { TalkMeBadge } from '../components/TalkMeBadge';
import {
  Search,
  BookOpen,
  Edit3,
  BarChart2,
  Flame,
  MessageSquare,
  Compass,
  ArrowRight,
  Layers,
} from 'lucide-react';

interface GrammarCategory {
  id: string;
  title: string;
  subtitle: string;
  topicsCount: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
}

export const CoursesScreen: React.FC = () => {
  const { navigate, goBack } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const categories: GrammarCategory[] = [
    {
      id: 'nouns',
      title: 'Grammar fundamentals',
      subtitle: 'Otlar va so‘z tuzilishi',
      topicsCount: '8 ta mavzu',
      icon: BookOpen,
      color: 'text-[#5E4B8B]',
      bgGradient: 'from-[#F1EDFA] to-white',
    },
    {
      id: 'adjectives',
      title: 'Sifat (Adjectives)',
      subtitle: 'Qiyosiy va orttirma daraja',
      topicsCount: '6 ta mavzu',
      icon: Edit3,
      color: 'text-[#0284C7]',
      bgGradient: 'from-[#E0F2FE] to-white',
    },
    {
      id: 'numerals',
      title: 'Son (Numerals)',
      subtitle: 'Sanoq va tartib sonlar',
      topicsCount: '5 ta mavzu',
      icon: BarChart2,
      color: 'text-[#27AE60]',
      bgGradient: 'from-[#E8F8EE] to-white',
    },
    {
      id: 'verbs',
      title: "Fe‘l va Zamonlar",
      subtitle: 'Present, Past, Future',
      topicsCount: '12 ta mavzu',
      icon: Flame,
      color: 'text-[#EA580C]',
      bgGradient: 'from-[#FFEDD5] to-white',
    },
    {
      id: 'pronouns',
      title: 'Olmosh (Pronouns)',
      subtitle: 'Kishilik va egalik olmoshlari',
      topicsCount: '7 ta mavzu',
      icon: MessageSquare,
      color: 'text-[#7C3AED]',
      bgGradient: 'from-[#EDE9FE] to-white',
    },
    {
      id: 'prepositions',
      title: 'Predloglar',
      subtitle: 'O‘rin, payt va yo‘nalish',
      topicsCount: '9 ta mavzu',
      icon: Compass,
      color: 'text-[#0D9488]',
      bgGradient: 'from-[#CCFBF1] to-white',
    },
  ];

  const filteredCategories = categories.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-24 text-[#1D1B20]">
      <div className="px-5 pt-4 space-y-4">
        {/* Header */}
        <TalkMeHeader
          title="Mening kurslarim"
          subtitle="Ingliz tili grammatika bo‘limlari"
          onBackClick={goBack}
          trailingContent={
            <div className="w-10 h-10 rounded-full bg-white border border-[#F0EFF5] flex items-center justify-center text-[#5E4B8B] shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
          }
        />

        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Grammatika bo‘limlarini izlash..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-[#F0EFF5] text-sm text-[#1D1B20] placeholder-[#9E9E9E] focus:outline-none focus:border-[#5E4B8B] shadow-2xs transition-all"
          />
          <Search className="w-4 h-4 text-[#9E9E9E] absolute left-3.5 top-3.5" />
        </div>

        {/* Catalog Banner */}
        <div className="p-4 rounded-2xl bg-linear-to-r from-[#5E4B8B] to-[#7C4DFF] text-white shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">
                CEFR A2 DASTURI
              </span>
              <h3 className="text-base font-extrabold mt-0.5">Duolingo Uslubidagi Bosqichlar</h3>
            </div>
            <div className="text-2xl">🦉</div>
          </div>
          <p className="text-xs text-white/80 mt-1">
            Har bir bo‘lim interaktiv xarita, 3D bosqich tugmalari va testlar bilan jihozlangan.
          </p>
        </div>

        {/* 2-Column Compact Grid */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;

            return (
              <div
                key={cat.id}
                onClick={() => navigate('course_levels', { courseId: cat.id })}
                className={`p-4 rounded-2xl bg-linear-to-b ${cat.bgGradient} border border-[#E8F0FE] hover:border-[#5E4B8B]/40 hover:shadow-md cursor-pointer transition-all duration-150 flex flex-col justify-between h-36 group active:scale-[0.98] shadow-2xs`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl bg-white shadow-xs flex items-center justify-center ${cat.color} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <TalkMeBadge
                    text={cat.topicsCount}
                    containerColor="bg-white/80"
                    textColor="text-[#5E4B8B]"
                    className="text-[10px] px-2 py-0.5"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-[#1D1B20] leading-snug group-hover:text-[#5E4B8B] transition-colors">
                    {cat.title}
                  </h4>
                  <p className="text-[11px] text-[#757575] mt-0.5 truncate">{cat.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <TalkMeBottomBar
        selectedTab={1}
        onTabSelected={(idx) => {
          if (idx === 0) navigate('home');
          if (idx === 1) navigate('courses');
          if (idx === 2) navigate('repeat');
          if (idx === 3) navigate('profile');
        }}
      />
    </div>
  );
};
