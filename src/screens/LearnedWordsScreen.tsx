import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBottomBar } from '../components/TalkMeBottomBar';
import { getUnlockedCurriculumTopicUnits } from '../domain/learning/unlockedCurriculumAggregator';
import { useVocabularyKnowledge } from '../knowledge/presentation/hooks/useKnowledgeTracker';
import { KnowledgeStatus, VocabularyKnowledge } from '../knowledge/domain/entities/VocabularyKnowledge';
import {
  BookOpen,
  ChevronRight,
  Check,
  RotateCcw,
  Volume2,
  Search,
  Lock,
  Filter,
  ArrowUpDown,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const STATUS_BADGE_META: Record<
  KnowledgeStatus,
  { labelUz: string; bg: string; text: string; border: string }
> = {
  discovered: {
    labelUz: 'Ko‘rilgan (Discovered)',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
  },
  learning: {
    labelUz: 'O‘rganilmoqda (Learning)',
    bg: 'bg-[#FFF8E1]',
    text: 'text-[#F57F17]',
    border: 'border-[#FFE082]',
  },
  learned: {
    labelUz: 'Yodlangan (Learned)',
    bg: 'bg-[#E0F2F1]',
    text: 'text-[#00897B]',
    border: 'border-[#80CBC4]',
  },
  mastered: {
    labelUz: 'Mukammal (Mastered)',
    bg: 'bg-[#E8EAF6]',
    text: 'text-[#3949AB]',
    border: 'border-[#9FA8DA]',
  },
};

function formatShortDate(timestamp?: number): string {
  if (!timestamp || timestamp <= 0) return 'Hali mashq qilinmagan';
  try {
    return new Date(timestamp).toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Yaqinda';
  }
}

export const LearnedWordsScreen: React.FC = () => {
  const {
    navigate,
    goBack,
    playTts,
    completedLevelIds,
    toggleWordLearned,
  } = useApp();

  const [viewMode, setViewMode] = useState<'library' | 'topics'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    KnowledgeStatus | 'all' | 'learned_or_mastered'
  >('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [courseOrTopicFilter, setCourseOrTopicFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recently_learned' | 'alphabetical' | 'mastery_desc'>(
    'recently_learned'
  );
  const [includeUntrackedCatalog, setIncludeUntrackedCatalog] = useState<boolean>(false);
  const [expandedWordId, setExpandedWordId] = useState<string | null>(null);

  const { items: trackedWords, stats } = useVocabularyKnowledge({
    searchQuery,
    status: statusFilter,
    levelId: levelFilter,
    courseOrTopicId: courseOrTopicFilter,
    sortBy,
    includeCatalogUntracked: includeUntrackedCatalog,
  });

  // Also fetch all tracked items without filter to populate dynamic filter dropdowns
  const { items: allTrackedWords } = useVocabularyKnowledge({
    includeCatalogUntracked: includeUntrackedCatalog,
  });

  const availableLevels = useMemo(() => {
    const set = new Set<string>();
    allTrackedWords.forEach((w) => w.levelIds.forEach((lvl) => set.add(lvl)));
    return Array.from(set);
  }, [allTrackedWords]);

  const availableTopics = useMemo(() => {
    const set = new Set<string>();
    allTrackedWords.forEach((w) => {
      w.courseIds.forEach((c) => set.add(c));
      w.subtopicIds.forEach((s) => set.add(s));
      w.topicIds.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [allTrackedWords]);

  const unlockedUnits = getUnlockedCurriculumTopicUnits(completedLevelIds);

  const handleOpenSourceLesson = (word: VocabularyKnowledge) => {
    const lessonId =
      word.subtopicIds[0] || word.lessonIds[0] || 'noun_01_what_is_a_noun';
    navigate('lesson_detail', { lessonId });
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-24 text-[#212121]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 space-y-4">
        <TalkMeHeader
          title="Yodlangan noyob so‘zlar"
          onBackClick={goBack}
        />

        {/* Global Vocabulary Summary Card */}
        <div className="rounded-xl p-5 bg-[#3949AB] text-white shadow-[0_2px_6px_rgba(57,73,171,0.2)] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                Global Lug‘at Bazasi · Barcha kurs va darslar
              </span>
              <p className="text-2xl font-bold text-white tabular-nums">
                {stats.uniqueLearnedWordsCount} ta so‘z yodlangan
              </p>
              <p className="text-xs text-white/85">
                Ko‘rilgan: {stats.vocabularyCounts.discovered} · O‘rganilmoqda:{' '}
                {stats.vocabularyCounts.learning} · Yodlangan: {stats.vocabularyCounts.learned} ·
                Mukammal: {stats.vocabularyCounts.mastered}
              </p>
            </div>

            <div className="flex items-center bg-white/15 p-1 rounded-lg shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('library')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                  viewMode === 'library'
                    ? 'bg-white text-[#3949AB]'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Ro‘yxat ({allTrackedWords.length})
              </button>
              <button
                type="button"
                onClick={() => setViewMode('topics')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                  viewMode === 'topics'
                    ? 'bg-white text-[#3949AB]'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Mavzular ({unlockedUnits.length})
              </button>
            </div>
          </div>
        </div>

        {/* GLOBAL VOCABULARY LIBRARY VIEW */}
        {viewMode === 'library' && (
          <div className="space-y-3.5">
            {/* Search & Filters Panel */}
            <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#616161]" />
                <input
                  type="text"
                  placeholder="Inglizcha so‘z, o‘zbekcha tarjima yoki so‘z turkumini qidiring..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F5F6FA] border border-[#E0E4EC] text-xs font-semibold text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#3949AB]"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: `Barchasi (${stats.vocabularyCounts.total})` },
                  {
                    id: 'learned_or_mastered',
                    label: `Yodlanganlar (${stats.uniqueLearnedWordsCount})`,
                  },
                  {
                    id: 'mastered',
                    label: `Mukammal (${stats.vocabularyCounts.mastered})`,
                  },
                  {
                    id: 'learned',
                    label: `O‘zlashtirilgan (${stats.vocabularyCounts.learned})`,
                  },
                  {
                    id: 'learning',
                    label: `O‘rganilmoqda (${stats.vocabularyCounts.learning})`,
                  },
                  {
                    id: 'discovered',
                    label: `Ko‘rilgan (${stats.vocabularyCounts.discovered})`,
                  },
                ].map((tab) => {
                  const active = statusFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() =>
                        setStatusFilter(
                          tab.id as KnowledgeStatus | 'all' | 'learned_or_mastered'
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                        active
                          ? 'bg-[#3949AB] text-white'
                          : 'bg-[#F5F6FA] text-[#616161] hover:text-[#212121]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Level, Topic & Sort Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <div className="flex items-center gap-2 bg-[#F5F6FA] px-3 py-2 rounded-lg border border-[#E0E4EC]">
                  <Filter className="w-3.5 h-3.5 text-[#3949AB] shrink-0" />
                  <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-[#212121] focus:outline-none cursor-pointer"
                  >
                    <option value="all">Barcha darajalar</option>
                    {availableLevels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        Daraja: {lvl}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-[#F5F6FA] px-3 py-2 rounded-lg border border-[#E0E4EC]">
                  <BookOpen className="w-3.5 h-3.5 text-[#3949AB] shrink-0" />
                  <select
                    value={courseOrTopicFilter}
                    onChange={(e) => setCourseOrTopicFilter(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-[#212121] focus:outline-none cursor-pointer"
                  >
                    <option value="all">Barcha kurs va mavzular</option>
                    {availableTopics.map((topic) => (
                      <option key={topic} value={topic}>
                        Mavzu: {topic}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-[#F5F6FA] px-3 py-2 rounded-lg border border-[#E0E4EC]">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#3949AB] shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as
                          | 'recently_learned'
                          | 'alphabetical'
                          | 'mastery_desc'
                      )
                    }
                    className="w-full bg-transparent text-xs font-semibold text-[#212121] focus:outline-none cursor-pointer"
                  >
                    <option value="recently_learned">Saralash: Oxirgi o‘rganilgan</option>
                    <option value="alphabetical">Saralash: Alifbo (A-Z)</option>
                    <option value="mastery_desc">Saralash: O‘zlashtirish darajasi</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#E0E4EC] text-xs">
                <label className="flex items-center gap-2 text-[#616161] font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeUntrackedCatalog}
                    onChange={(e) => setIncludeUntrackedCatalog(e.target.checked)}
                    className="rounded text-[#3949AB]"
                  />
                  <span>O‘quv dasturidagi barcha so‘zlarni ko‘rsatish</span>
                </label>

                <span className="font-semibold text-[#3949AB]">
                  Natija: {trackedWords.length} ta so‘z
                </span>
              </div>
            </div>

            {/* Empty State */}
            {trackedWords.length === 0 ? (
              <div className="p-8 rounded-xl bg-white border border-[#E0E4EC] text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#E8EAF6] text-[#3949AB] flex items-center justify-center mx-auto">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#212121]">
                    Hozircha bu filtr bo‘yicha so‘zlar topilmadi
                  </h3>
                  <p className="text-xs text-[#616161] max-w-md mx-auto leading-relaxed">
                    Darslarni ochib, mashq va sinovlarni bajarganingiz sari o‘rganilgan noyob so‘zlar avtomatik ravishda shu yerga qo‘shiladi.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIncludeUntrackedCatalog(true)}
                    className="px-4 py-2 rounded-lg bg-[#E8EAF6] text-[#3949AB] text-xs font-bold cursor-pointer hover:bg-[#C5CAE9]"
                  >
                    Dasturdagi barcha so‘zlarni ko‘rish
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      navigate('lesson_detail', { lessonId: 'noun_01_what_is_a_noun' })
                    }
                    className="px-4 py-2 rounded-lg bg-[#3949AB] text-white text-xs font-bold cursor-pointer hover:bg-[#283593]"
                  >
                    Darsni boshlash →
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-[#E0E4EC] divide-y divide-[#E0E4EC] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                {trackedWords.map((word) => {
                  const isLearned =
                    word.status === 'learned' || word.status === 'mastered';
                  const badge = STATUS_BADGE_META[word.status];
                  const isExpanded = expandedWordId === word.id;

                  return (
                    <div
                      key={word.id}
                      className="p-4 hover:bg-slate-50/60 transition-colors space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className="min-w-0 flex-1 cursor-pointer"
                          onClick={() =>
                            setExpandedWordId(isExpanded ? null : word.id)
                          }
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            {word.emoji && (
                              <span className="text-lg shrink-0">{word.emoji}</span>
                            )}
                            <span className="text-base font-bold text-[#212121]">
                              {word.displayWord}
                            </span>
                            {word.pronunciation && (
                              <span className="text-xs text-[#616161] font-mono">
                                {word.pronunciation}
                              </span>
                            )}
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${badge.bg} ${badge.text} ${badge.border}`}
                            >
                              {badge.labelUz}
                            </span>
                          </div>

                          <p className="text-sm font-semibold text-[#00897B] mt-1">
                            {word.translation}
                          </p>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#616161] mt-1.5">
                            {word.partOfSpeech && (
                              <span className="font-medium">{word.partOfSpeech}</span>
                            )}
                            {word.levelIds.length > 0 && (
                              <span>Daraja: {word.levelIds.join(', ')}</span>
                            )}
                            <span className="tabular-nums">
                              O‘zlashtirish: {word.masteryScore}%
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => playTts(word.displayWord)}
                            className="w-10 h-10 rounded-lg bg-[#E8EAF6] text-[#3949AB] flex items-center justify-center hover:bg-[#3949AB] hover:text-white transition-colors cursor-pointer"
                            title="Talaffuzni tinglash"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleWordLearned(word.id)}
                            className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                              isLearned
                                ? 'bg-[#E0F2F1] text-[#00897B]'
                                : 'bg-[#E8EAF6] text-[#3949AB]'
                            }`}
                          >
                            {isLearned ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>Yodlandi</span>
                              </>
                            ) : (
                              <>
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>O‘rganish</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setExpandedWordId(isExpanded ? null : word.id)
                            }
                            className="w-9 h-9 rounded-lg bg-[#F5F6FA] text-[#616161] hover:text-[#212121] flex items-center justify-center cursor-pointer"
                            title="Batafsil ma’lumot"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Word Details View */}
                      {isExpanded && (
                        <div className="pt-3 border-t border-[#E0E4EC] space-y-3 text-xs bg-[#F5F6FA]/70 p-3.5 rounded-xl">
                          {word.exampleEn && (
                            <div className="p-3 rounded-lg bg-white border border-[#E0E4EC] flex items-center justify-between gap-3">
                              <div>
                                <div className="font-bold text-[#212121] text-sm">
                                  {word.exampleEn}
                                </div>
                                {word.exampleUz && (
                                  <div className="text-[#00897B] font-medium mt-0.5">
                                    {word.exampleUz}
                                  </div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => playTts(word.exampleEn!)}
                                className="w-9 h-9 rounded-lg bg-[#E8EAF6] text-[#3949AB] flex items-center justify-center shrink-0 cursor-pointer"
                                title="Misolni eshitish"
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <div className="p-2.5 rounded-lg bg-white border border-[#E0E4EC]">
                              <span className="text-[#616161] block">Ko‘rish / Mashq</span>
                              <span className="font-bold text-[#212121] text-sm tabular-nums">
                                {word.exposureCount} / {word.practiceCount} marta
                              </span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-white border border-[#E0E4EC]">
                              <span className="text-[#616161] block">To‘g‘ri / Xato</span>
                              <span className="font-bold text-[#00897B] text-sm tabular-nums">
                                {word.correctCount} ✓ · {word.incorrectCount} ✗
                              </span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-white border border-[#E0E4EC]">
                              <span className="text-[#616161] flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Yodlangan sana
                              </span>
                              <span className="font-bold text-[#212121]">
                                {formatShortDate(word.firstLearnedAt || word.firstIntroducedAt)}
                              </span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-white border border-[#E0E4EC]">
                              <span className="text-[#616161] flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Oxirgi mashq
                              </span>
                              <span className="font-bold text-[#212121]">
                                {formatShortDate(word.lastPracticedAt)}
                              </span>
                            </div>
                          </div>

                          {word.relatedForms && word.relatedForms.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-semibold text-[#616161]">
                                So‘z shakllari:
                              </span>
                              {word.relatedForms.map((form) => (
                                <span
                                  key={form}
                                  className="px-2 py-0.5 rounded bg-white border border-[#E0E4EC] font-mono text-[#3949AB] font-semibold"
                                >
                                  {form}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <div className="text-[#616161]">
                              <span className="font-semibold">Manba darslar: </span>
                              <span>
                                {[...word.subtopicIds, ...word.topicIds]
                                  .slice(0, 3)
                                  .join(', ') || 'Asosiy kurs'}
                              </span>
                              {word.srsReview && (
                                <span className="ml-2 text-[#00897B] font-semibold">
                                  · FSRS: {word.srsReview.reps} takrorlash
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => navigate('repeat')}
                                className="px-3 py-1.5 rounded-lg bg-white border border-[#E0E4EC] text-[#3949AB] font-semibold hover:border-[#3949AB] flex items-center gap-1 cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>FSRS Takrorlash</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenSourceLesson(word)}
                                className="px-3 py-1.5 rounded-lg bg-[#3949AB] text-white font-semibold hover:bg-[#283593] flex items-center gap-1 cursor-pointer"
                              >
                                <span>Asl darsni ochish</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TOPICS VIEW (CURRICULUM SUBTOPICS & LEVELS) */}
        {viewMode === 'topics' && (
          <div className="space-y-3">
            {unlockedUnits.map((unit) => {
              const learnedInUnit = unit.words.filter((w) => w.status === 'learned').length;
              const sampleWords = unit.words
                .slice(0, 5)
                .map((w) => w.word)
                .join(', ');

              return (
                <button
                  key={unit.id}
                  type="button"
                  onClick={() => navigate('topic_words_detail', { topicId: unit.id })}
                  className="w-full text-left p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-[0_1px_3px_rgba(0,0,0,0.05)] cursor-pointer hover:border-[#3949AB] transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-lg bg-[#E8EAF6] text-[#3949AB] flex items-center justify-center shrink-0 text-lg">
                        {unit.iconEmoji || <BookOpen className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs text-[#616161] font-medium">
                          <span className="text-[#3949AB] font-semibold">{unit.section}</span>
                          <span aria-hidden="true">·</span>
                          <span>Daraja {unit.level}</span>
                        </div>
                        <h3 className="text-sm font-bold text-[#212121] mt-0.5 truncate group-hover:text-[#3949AB] transition-colors">
                          {unit.title}
                        </h3>
                        <p className="text-xs text-[#616161] mt-0.5 line-clamp-1">
                          So‘zlar: {sampleWords}
                        </p>
                      </div>
                    </div>

                    <div className="w-9 h-9 rounded-lg bg-[#F5F6FA] group-hover:bg-[#3949AB] group-hover:text-white flex items-center justify-center text-[#616161] transition-colors shrink-0">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#E0E4EC] flex items-center justify-between text-xs">
                    <span className="text-[#00897B] font-semibold flex items-center gap-1 tabular-nums">
                      <Check className="w-3.5 h-3.5" />
                      {learnedInUnit} / {unit.words.length} ta so‘z yodlangan
                    </span>
                    <span className="text-[#3949AB] font-semibold">
                      Mavzu so‘zlarini ochish →
                    </span>
                  </div>
                </button>
              );
            })}

            <div className="p-4 rounded-xl bg-white border border-dashed border-[#E0E4EC] flex items-center gap-3 text-xs text-[#616161]">
              <div className="w-9 h-9 rounded-lg bg-[#F5F6FA] text-[#616161] flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <p>
                Keyingi ost-mavzular va darajalarni o‘quv yo‘l xaritasida ochganingiz sari ularning yangi so‘zlari avtomatik ravishda shu yerga qo‘shiladi.
              </p>
            </div>
          </div>
        )}
      </div>

      <TalkMeBottomBar
        selectedTab={0}
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
