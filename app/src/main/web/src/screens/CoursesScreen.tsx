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
  hasSubtopics: boolean;
  icon: React.ElementType;
  bgImage: string;
}

export const CoursesScreen: React.FC = () => {
  const { navigate, goBack } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const categories: GrammarCategory[] = [
    {
      id: 'nouns',
      title: 'Ot (Nouns)',
      subtitle: 'Shaxs, narsa va joy nomlari (18 ta darajali xarita)',
      topicsCount: '18 ta ost-mavzu',
      hasSubtopics: true,
      icon: BookOpen,
      bgImage: '/images/nouns.svg',
    },
    {
      id: 'english_fundamentals',
      title: 'English Fundamentals',
      subtitle: 'Ingliz tili asoslari — 1-dars: Kirish',
      topicsCount: '1 ta dars',
      hasSubtopics: true,
      icon: BookOpen,
      bgImage: '/images/grammar_fundamentals.png',
    },
    {
      id: 'verbs',
      title: 'Fe‘l va Zamonlar',
      subtitle: 'Harakatlar: Present, Past, Future',
      topicsCount: '0 ta ost-mavzu',
      hasSubtopics: false,
      icon: Flame,
      bgImage: '/images/verbs.svg',
    },
    {
      id: 'adjectives',
      title: 'Sifat (Adjectives)',
      subtitle: 'Belgi, xususiyat va darajalar',
      topicsCount: '0 ta ost-mavzu',
      hasSubtopics: false,
      icon: Edit3,
      bgImage: '/images/adjectives.svg',
    },
    {
      id: 'numerals',
      title: 'Son (Numerals)',
      subtitle: 'Sanoq va tartib sonlar',
      topicsCount: '0 ta ost-mavzu',
      hasSubtopics: false,
      icon: BarChart2,
      bgImage: '/images/numerals.svg',
    },
    {
      id: 'pronouns',
      title: 'Olmosh (Pronouns)',
      subtitle: 'Kishilik va egalik olmoshlari',
      topicsCount: '0 ta ost-mavzu',
      hasSubtopics: false,
      icon: MessageSquare,
      bgImage: '/images/pronouns.svg',
    },
    {
      id: 'adverbs',
      title: 'Ravish (Adverbs)',
      subtitle: 'Harakat tarzi, daraja va tezlik',
      topicsCount: '0 ta ost-mavzu',
      hasSubtopics: false,
      icon: Zap,
      bgImage: '/images/adverbs.svg',
    },
    {
      id: 'prepositions',
      title: 'Predloglar (Prepositions)',
      subtitle: 'O‘rin, payt va yo‘nalish (in, on, at)',
      topicsCount: '0 ta ost-mavzu',
      hasSubtopics: false,
      icon: Compass,
      bgImage: '/images/prepositions.svg',
    },
    {
      id: 'sentences',
      title: 'Gap (Sentences)',
      subtitle: 'Ega, kesim, to‘ldiruvchi (S+V+O)',
      topicsCount: '0 ta ost-mavzu',
      hasSubtopics: false,
      icon: Layers,
      bgImage: '/images/sentences.svg',
    },
    {
      id: 'adverbials',
      title: 'Hol (Adverbials)',
      subtitle: 'Payt, o‘rin, sabab va maqsad',
      topicsCount: '0 ta ost-mavzu',
      hasSubtopics: false,
      icon: Compass,
      bgImage: '/images/adverbials.svg',
    },
    {
      id: 'articles',
      title: 'Artikl (Articles: A, An, The)',
      subtitle: 'Aniq va noaniq artikl qoidalari',
      topicsCount: '0 ta ost-mavzu',
      hasSubtopics: false,
      icon: Sparkles,
      bgImage: '/images/articles.svg',
    },
  ];

  const filteredCategories = categories.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-24 text-[#212121]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 space-y-4">
        <TalkMeHeader
          title="Mening kurslarim"
          onBackClick={goBack}
        />

        {/* Search input for Roadmap Modules */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Grammatika bo‘limlarini izlash..."
            className="w-full h-11 pl-10 pr-4 rounded-lg bg-white border border-[#E0E4EC] text-sm text-[#212121] placeholder-[#616161] focus:outline-none focus:border-[#3949AB] transition-colors"
          />
          <Search className="w-4 h-4 text-[#616161] absolute left-3.5 top-3.5" />
        </div>

        {/* 2-Column Material 2 Course Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-1">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;

            return (
              <div
                key={cat.id}
                onClick={() => navigate('course_levels', { courseId: cat.id })}
                className={`rounded-xl bg-white border transition-all duration-150 overflow-hidden flex flex-col group cursor-pointer active:scale-[0.99] ${
                  cat.hasSubtopics
                    ? 'border-[#3949AB] shadow-[0_2px_8px_rgba(57,73,171,0.14)]'
                    : 'border-[#E0E4EC] hover:border-[#3949AB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] opacity-85'
                }`}
              >
                <div className="relative w-full aspect-[4/3] bg-[#F5F6FA] overflow-hidden flex items-center justify-center border-b border-[#E0E4EC]">
                  <img
                    src={cat.bgImage}
                    alt={cat.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {cat.hasSubtopics && (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md bg-[#00897B] text-white text-[10px] font-bold shadow-xs">
                      FAOL XARITA
                    </span>
                  )}
                </div>

                <div className="p-3.5 bg-white flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                          cat.hasSubtopics
                            ? 'bg-[#E0F2F1] text-[#00897B]'
                            : 'bg-[#F5F6FA] text-[#616161]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          cat.hasSubtopics ? 'text-[#00897B]' : 'text-[#616161]'
                        }`}
                      >
                        {cat.topicsCount}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#212121] leading-snug line-clamp-1 group-hover:text-[#3949AB] transition-colors">
                      {cat.title}
                    </h3>

                    <p className="text-xs text-[#616161] line-clamp-2 mt-1">
                      {cat.subtitle}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#E0E4EC] flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#3949AB]">
                      {cat.hasSubtopics ? 'Xaritani ochish' : 'Ko‘rish'}
                    </span>
                    <div className="w-6 h-6 rounded-md bg-[#E8EAF6] group-hover:bg-[#3949AB] text-[#3949AB] group-hover:text-white flex items-center justify-center transition-colors">
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
