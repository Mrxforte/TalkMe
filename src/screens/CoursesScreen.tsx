import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBottomBar } from '../components/TalkMeBottomBar';
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
  Zap,
  Sparkles,
} from 'lucide-react';

interface GrammarCategory {
  id: string;
  title: string;
  subtitle: string;
  topicsCount: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  bgImage: string;
}

export const CoursesScreen: React.FC = () => {
  const { navigate, goBack } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const categories: GrammarCategory[] = [
    {
      id: 'grammar_fundamentals',
      title: 'Grammar fundamentals',
      subtitle: 'Asosiy qoidalar va so‘z tuzilishi',
      topicsCount: '8 ta mavzu',
      icon: BookOpen,
      color: 'text-[#5E4B8B]',
      bgGradient: 'from-[#F1EDFA] to-white',
      bgImage: '/images/grammar_fundamentals.png',
    },
    {
      id: 'nouns',
      title: 'Ot (Nouns)',
      subtitle: 'Shaxs, narsa va joy nomlari',
      topicsCount: '9 ta mavzu',
      icon: BookOpen,
      color: 'text-[#4338CA]',
      bgGradient: 'from-[#EEF2FF] to-white',
      bgImage: '/images/nouns.svg',
    },
    {
      id: 'verbs',
      title: "Fe‘l va Zamonlar",
      subtitle: 'Harakatlar: Present, Past, Future',
      topicsCount: '12 ta mavzu',
      icon: Flame,
      color: 'text-[#EA580C]',
      bgGradient: 'from-[#FFEDD5] to-white',
      bgImage: '/images/verbs.svg',
    },
    {
      id: 'adjectives',
      title: 'Sifat (Adjectives)',
      subtitle: 'Belgi, xususiyat va darajalar',
      topicsCount: '7 ta mavzu',
      icon: Edit3,
      color: 'text-[#0284C7]',
      bgGradient: 'from-[#E0F2FE] to-white',
      bgImage: '/images/adjectives.svg',
    },
    {
      id: 'numerals',
      title: 'Son (Numerals)',
      subtitle: 'Sanoq va tartib sonlar',
      topicsCount: '6 ta mavzu',
      icon: BarChart2,
      color: 'text-[#16A34A]',
      bgGradient: 'from-[#E8F8EE] to-white',
      bgImage: '/images/numerals.svg',
    },
    {
      id: 'pronouns',
      title: 'Olmosh (Pronouns)',
      subtitle: 'Kishilik va egalik olmoshlari',
      topicsCount: '8 ta mavzu',
      icon: MessageSquare,
      color: 'text-[#7C3AED]',
      bgGradient: 'from-[#EDE9FE] to-white',
      bgImage: '/images/pronouns.svg',
    },
    {
      id: 'adverbs',
      title: 'Ravish (Adverbs)',
      subtitle: 'Harakat tarzi, daraja va tezlik',
      topicsCount: '7 ta mavzu',
      icon: Zap,
      color: 'text-[#4F46E5]',
      bgGradient: 'from-[#EEF2FF] to-white',
      bgImage: '/images/adverbs.svg',
    },
    {
      id: 'prepositions',
      title: 'Predloglar (Prepositions)',
      subtitle: 'O‘rin, payt va yo‘nalish (in, on, at)',
      topicsCount: '10 ta mavzu',
      icon: Compass,
      color: 'text-[#0D9488]',
      bgGradient: 'from-[#CCFBF1] to-white',
      bgImage: '/images/prepositions.svg',
    },
    {
      id: 'sentences',
      title: 'Gap (Sentences)',
      subtitle: 'Ega, kesim, to‘ldiruvchi (S+V+O)',
      topicsCount: '9 ta mavzu',
      icon: Layers,
      color: 'text-[#9333EA]',
      bgGradient: 'from-[#F3E8FF] to-white',
      bgImage: '/images/sentences.svg',
    },
    {
      id: 'adverbials',
      title: 'Hol (Adverbials)',
      subtitle: 'Payt, o‘rin, sabab va maqsad',
      topicsCount: '7 ta mavzu',
      icon: Compass,
      color: 'text-[#059669]',
      bgGradient: 'from-[#D1FAE5] to-white',
      bgImage: '/images/adverbials.svg',
    },
    {
      id: 'articles',
      title: 'Artikl (Articles: A, An, The)',
      subtitle: 'Aniq va noaniq artikl qoidalari',
      topicsCount: '5 ta mavzu',
      icon: Sparkles,
      color: 'text-[#D97706]',
      bgGradient: 'from-[#FEF3C7] to-white',
      bgImage: '/images/articles.svg',
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

        {/* 2-Column Ozon-Style Product Cards Grid */}
        <div className="grid grid-cols-2 gap-3.5 pt-1">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;

            return (
              <div
                key={cat.id}
                onClick={() => navigate('course_levels', { courseId: cat.id })}
                className="rounded-2xl bg-white border border-[#EBE8F3] hover:border-[#5E4B8B]/40 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group cursor-pointer active:scale-[0.98]"
              >
                {/* Elongated Product Image Container (NO opacity, NO overlay) */}
                <div className="relative w-full aspect-[4/5] bg-[#F7F6FB] overflow-hidden flex items-center justify-center">
                  <img
                    src={cat.bgImage}
                    alt={cat.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Bottom Product Info Section (Ozon-Style) */}
                <div className="p-3 bg-white flex flex-col justify-between flex-1">
                  <div>
                    {/* Topic count badge & Category icon */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div
                        className={`w-5 h-5 rounded-md ${cat.color} bg-[#F4F1FA] flex items-center justify-center shrink-0`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-bold text-[#5E4B8B]">
                        {cat.topicsCount}
                      </span>
                    </div>

                    {/* Course Title */}
                    <h4 className="text-sm font-bold text-[#1D1B20] leading-snug line-clamp-1 group-hover:text-[#5E4B8B] transition-colors">
                      {cat.title}
                    </h4>

                    {/* Description / Subtitle */}
                    <p className="text-[11px] text-[#6B7280] line-clamp-1 mt-0.5">
                      {cat.subtitle}
                    </p>
                  </div>

                  {/* Action button at bottom */}
                  <div className="mt-2.5 pt-2 border-t border-[#F2F1F6] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#5E4B8B]">O‘rganish</span>
                    <div className="w-6 h-6 rounded-full bg-[#F4F1FA] group-hover:bg-[#5E4B8B] text-[#5E4B8B] group-hover:text-white flex items-center justify-center transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
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
