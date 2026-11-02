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
  Target,
  ChevronRight,
} from 'lucide-react';
import { UNIVERSAL_COURSES_REPOSITORY } from '../content/registry/universalContentRepository';
import {
  MAJOR_TOPICS_CATALOG,
  SUBTOPICS_REPOSITORY,
} from '../content/registry/subtopicsCatalog';
import { subtopicProgressEngine } from '../engines/subtopic-engine/subtopicProgressEngine';
import { GlobalTtsControlStrip, SpeakableWord } from '../shared/components/speakable/SpeakableComponents';

interface GrammarCategory {
  id: string;
  title: string;
  subtitle: string;
  topicsCount: string;
  icon: React.ElementType;
  bgImage: string;
}

export const CoursesScreen: React.FC = () => {
  const { navigate, goBack } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMajorTopicId, setExpandedMajorTopicId] = useState<string>('nouns');

  const universalCourse = UNIVERSAL_COURSES_REPOSITORY[0];

  const categories: GrammarCategory[] = [
    {
      id: 'grammar_fundamentals',
      title: 'Grammar fundamentals',
      subtitle: 'Asosiy qoidalar va so‘z tuzilishi',
      topicsCount: '8 ta mavzu',
      icon: BookOpen,
      bgImage: '/images/grammar_fundamentals.png',
    },
    {
      id: 'nouns',
      title: 'Ot (Nouns)',
      subtitle: 'Shaxs, narsa va joy nomlari (6 Subtopic)',
      topicsCount: '6 ta ost-mavzu',
      icon: BookOpen,
      bgImage: '/images/nouns.svg',
    },
    {
      id: 'verbs',
      title: 'Fe‘l va Zamonlar',
      subtitle: 'Harakatlar: Present, Past, Future',
      topicsCount: '12 ta mavzu',
      icon: Flame,
      bgImage: '/images/verbs.svg',
    },
    {
      id: 'adjectives',
      title: 'Sifat (Adjectives)',
      subtitle: 'Belgi, xususiyat va darajalar',
      topicsCount: '7 ta mavzu',
      icon: Edit3,
      bgImage: '/images/adjectives.svg',
    },
    {
      id: 'numerals',
      title: 'Son (Numerals)',
      subtitle: 'Sanoq va tartib sonlar',
      topicsCount: '9 ta mavzu',
      icon: BarChart2,
      bgImage: '/images/numerals.svg',
    },
    {
      id: 'pronouns',
      title: 'Olmosh (Pronouns)',
      subtitle: 'Kishilik va egalik olmoshlari',
      topicsCount: '8 ta mavzu',
      icon: MessageSquare,
      bgImage: '/images/pronouns.svg',
    },
    {
      id: 'adverbs',
      title: 'Ravish (Adverbs)',
      subtitle: 'Harakat tarzi, daraja va tezlik',
      topicsCount: '7 ta mavzu',
      icon: Zap,
      bgImage: '/images/adverbs.svg',
    },
    {
      id: 'prepositions',
      title: 'Predloglar (Prepositions)',
      subtitle: 'O‘rin, payt va yo‘nalish (in, on, at)',
      topicsCount: '10 ta mavzu',
      icon: Compass,
      bgImage: '/images/prepositions.svg',
    },
    {
      id: 'sentences',
      title: 'Gap (Sentences)',
      subtitle: 'Ega, kesim, to‘ldiruvchi (S+V+O)',
      topicsCount: '9 ta mavzu',
      icon: Layers,
      bgImage: '/images/sentences.svg',
    },
    {
      id: 'adverbials',
      title: 'Hol (Adverbials)',
      subtitle: 'Payt, o‘rin, sabab va maqsad',
      topicsCount: '7 ta mavzu',
      icon: Compass,
      bgImage: '/images/adverbials.svg',
    },
    {
      id: 'articles',
      title: 'Artikl (Articles: A, An, The)',
      subtitle: 'Aniq va noaniq artikl qoidalari',
      topicsCount: '5 ta mavzu',
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 space-y-5">
        <TalkMeHeader
          title="Mening kurslarim"
          subtitle="Course → Major Topic → Subtopics (7-Stage Micro-Courses) va Practice Center"
          onBackClick={goBack}
        />

        <GlobalTtsControlStrip />

        {/* Separate Practice Center Quick Access Card */}
        <div className="p-4 rounded-xl bg-[#3949AB] text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5CAE9]">
              ALOHIDA TIZIM · PRACTICE CENTER
            </span>
            <h2 className="text-base font-bold mt-0.5">
              Amaliyot Markazi va 110 Mashq Kutubxonasi
            </h2>
            <p className="text-xs text-white/85 mt-1">
              Darslarni tugatgach, mavzu bo‘yicha ketma-ket ochiluvchi amaliyot yo‘llarini bajaring.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('practice_center')}
            className="py-2.5 px-4 rounded-xl bg-[#00897B] hover:bg-[#00695C] text-white font-semibold text-xs flex items-center gap-2 shrink-0 cursor-pointer shadow-xs"
          >
            <Target className="w-4 h-4" />
            <span>Practice Center →</span>
          </button>
        </div>

        {/* =================================================================
            HIERARCHICAL ROADMAP: COURSE -> MAJOR TOPICS -> SUBTOPICS (VARIABLE)
           ================================================================= */}
        <section className="space-y-3">
          <div>
            <h3 className="text-base font-bold text-[#212121]">
              Universal Subtopic O‘quv Tizimi (7-Bosqichli Mikro-Kurslar)
            </h3>
            <p className="text-xs text-[#616161]">
              Har bir Yirik Mavzu o‘zgaruvchan sondagi Ost-Mavzularga (Subtopics) ega. Masalan: Nouns (6 ta Subtopic)
            </p>
          </div>

          <div className="space-y-3">
            {MAJOR_TOPICS_CATALOG.map((majorTopic) => {
              const isExpanded = expandedMajorTopicId === majorTopic.id;
              const subtopicsList = majorTopic.subtopicIds
                .map((id) => SUBTOPICS_REPOSITORY[id])
                .filter(Boolean);

              return (
                <div
                  key={majorTopic.id}
                  className="rounded-xl bg-white border border-[#E0E4EC] shadow-2xs overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedMajorTopicId(isExpanded ? '' : majorTopic.id)
                    }
                    className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-[#F5F6FA] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-11 h-11 rounded-xl bg-[#E8EAF6] border border-[#C5CAE9] flex items-center justify-center text-2xl shrink-0">
                        {majorTopic.iconEmoji}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase text-[#3949AB] bg-[#E8EAF6] px-2 py-0.5 rounded">
                            {subtopicsList.length} ta Subtopic · 7-Bosqichli Mikro-Kurs
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#212121] mt-1 truncate">
                          {majorTopic.titleEn} — {majorTopic.titleUz}
                        </h4>
                        <p className="text-xs text-[#616161] truncate">
                          {majorTopic.descriptionUz}
                        </p>
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-5 h-5 text-[#616161] transition-transform shrink-0 ${
                        isExpanded ? 'rotate-90 text-[#3949AB]' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="p-4 pt-2 border-t border-[#E0E4EC] bg-[#F5F6FA] space-y-2">
                      {subtopicsList.map((sub, sIdx) => {
                        const progress = subtopicProgressEngine.getRecord(sub.id);
                        return (
                          <div
                            key={sub.id}
                            className="p-3 rounded-xl bg-white border border-[#E0E4EC] flex flex-wrap items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                                  progress.isCompleted
                                    ? 'bg-[#E0F2F1] text-[#00897B]'
                                    : 'bg-[#E8EAF6] text-[#3949AB]'
                                }`}
                              >
                                {sIdx + 1}
                              </span>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <SpeakableWord
                                    word={sub.title.en}
                                    translationUz={sub.title.uz}
                                    className="text-xs font-bold"
                                  />
                                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#F5F6FA] text-[#616161]">
                                    {sub.level} · ~{sub.estimatedMinutes} daq
                                  </span>
                                  {progress.isCompleted && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E0F2F1] text-[#00897B]">
                                      ✓ Tugallangan ({progress.assessmentBestScorePercent}%)
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-[#616161] truncate">{sub.title.uz}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate('lesson_detail', {
                                    lessonId: sub.id,
                                  })
                                }
                                className="px-3 py-1.5 rounded-lg bg-[#3949AB] text-white text-xs font-semibold cursor-pointer hover:bg-[#283593]"
                              >
                                7-Bosqichli Dars
                              </button>
                              <button
                                type="button"
                                onClick={() => navigate('practice_center')}
                                className="px-2.5 py-1.5 rounded-lg bg-[#E0F2F1] text-[#00897B] text-xs font-semibold cursor-pointer hover:bg-[#00897B] hover:text-white"
                              >
                                Amaliyot
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Search input for 11 Roadmap Modules */}
        <div className="relative pt-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Grammatika bo‘limlarini izlash..."
            className="w-full h-11 pl-10 pr-4 rounded-lg bg-white border border-[#E0E4EC] text-sm text-[#212121] placeholder-[#616161] focus:outline-none focus:border-[#3949AB] transition-colors"
          />
          <Search className="w-4 h-4 text-[#616161] absolute left-3.5 top-5.5" />
        </div>

        {/* 2-Column Material 2 Course Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-1">
          {filteredCategories.map((cat, idx) => {
            const Icon = cat.icon;
            const isSecondaryAccent = idx % 2 === 1;

            return (
              <div
                key={cat.id}
                onClick={() => navigate('course_levels', { courseId: cat.id })}
                className="rounded-xl bg-white border border-[#E0E4EC] hover:border-[#3949AB] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_10px_rgba(57,73,171,0.12)] transition-all duration-150 overflow-hidden flex flex-col group cursor-pointer active:scale-[0.99]"
              >
                <div className="relative w-full aspect-[4/3] bg-[#F5F6FA] overflow-hidden flex items-center justify-center border-b border-[#E0E4EC]">
                  <img
                    src={cat.bgImage}
                    alt={cat.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-3.5 bg-white flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                          isSecondaryAccent
                            ? 'bg-[#E0F2F1] text-[#00897B]'
                            : 'bg-[#E8EAF6] text-[#3949AB]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          isSecondaryAccent ? 'text-[#00897B]' : 'text-[#3949AB]'
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
                    <span className="text-xs font-semibold text-[#3949AB]">Xaritani ochish</span>
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
