import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBottomBar } from '../components/TalkMeBottomBar';
import { getUnlockedCurriculumTopicUnits } from '../domain/learning/unlockedCurriculumAggregator';
import { useGrammarKnowledge } from '../knowledge/presentation/hooks/useKnowledgeTracker';
import { KnowledgeStatus } from '../knowledge/domain/entities/VocabularyKnowledge';
import { GrammarKnowledge } from '../knowledge/domain/entities/GrammarKnowledge';
import {
  Layers,
  ChevronRight,
  Check,
  RotateCcw,
  Volume2,
  Lock,
  Search,
  ArrowUpDown,
  BookOpen,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const STATUS_BADGE_META: Record<
  KnowledgeStatus,
  { labelUz: string; bg: string; text: string; border: string }
> = {
  discovered: {
    labelUz: 'Ko‘rilgan (Introduced)',
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
    labelUz: 'O‘zlashtirilgan (Learned)',
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
  if (!timestamp || timestamp <= 0) return 'Hali yakunlanmagan';
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

export const MasteredRulesScreen: React.FC = () => {
  const {
    navigate,
    goBack,
    playTts,
    completedLevelIds,
    toggleRuleMastered,
  } = useApp();

  const [viewMode, setViewMode] = useState<'library' | 'topics'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    KnowledgeStatus | 'all' | 'learned_or_mastered'
  >('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recently_learned' | 'alphabetical' | 'mastery_desc'>(
    'recently_learned'
  );
  const [includeUntrackedCatalog, setIncludeUntrackedCatalog] = useState<boolean>(true);
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);

  const { items: trackedRules, stats } = useGrammarKnowledge({
    searchQuery,
    status: statusFilter,
    topicId: topicFilter,
    sortBy,
    includeCatalogUntracked: includeUntrackedCatalog,
  });

  const { items: allTrackedRules } = useGrammarKnowledge({
    includeCatalogUntracked: includeUntrackedCatalog,
  });

  const availableTopics = useMemo(() => {
    const set = new Set<string>();
    allTrackedRules.forEach((r) => {
      r.courseIds.forEach((c) => set.add(c));
      r.subtopicIds.forEach((s) => set.add(s));
      r.topicIds.forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [allTrackedRules]);

  const unlockedUnits = getUnlockedCurriculumTopicUnits(completedLevelIds);

  const handleOpenOriginalLesson = (rule: GrammarKnowledge) => {
    const lessonId =
      rule.subtopicIds[0] || rule.lessonIds[0] || 'noun_01_what_is_a_noun';
    navigate('lesson_detail', { lessonId });
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-24 text-[#212121]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 space-y-4">
        <TalkMeHeader
          title="O‘zlashtirilgan qoidalar"
          onBackClick={goBack}
        />

        {/* Top Summary Banner */}
        <div className="rounded-xl p-5 bg-[#00897B] text-white shadow-[0_2px_6px_rgba(0,137,123,0.2)] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                Global Grammatika Bazasi · Barcha kurs va darslar
              </span>
              <p className="text-2xl font-bold text-white tabular-nums">
                {stats.masteredGrammarRulesCount} ta qoida o‘zlashtirilgan
              </p>
              <p className="text-xs text-white/85">
                Ko‘rilgan: {stats.grammarCounts.discovered} · O‘rganilmoqda:{' '}
                {stats.grammarCounts.learning} · O‘zlashtirilgan: {stats.grammarCounts.learned} ·
                Mukammal: {stats.grammarCounts.mastered}
              </p>
            </div>

            <div className="flex items-center bg-white/15 p-1 rounded-lg shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('library')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                  viewMode === 'library'
                    ? 'bg-white text-[#00897B]'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Ro‘yxat ({allTrackedRules.length})
              </button>
              <button
                type="button"
                onClick={() => setViewMode('topics')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                  viewMode === 'topics'
                    ? 'bg-white text-[#00897B]'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Mavzular ({unlockedUnits.length})
              </button>
            </div>
          </div>
        </div>

        {/* GLOBAL GRAMMAR KNOWLEDGE LIBRARY VIEW */}
        {viewMode === 'library' && (
          <div className="space-y-3.5">
            {/* Search, Filter & Sort Controls */}
            <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#616161]" />
                <input
                  type="text"
                  placeholder="Qoida nomi, tushuntirishi yoki kalitini qidiring (masalan: noun.definition)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F5F6FA] border border-[#E0E4EC] text-xs font-semibold text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#00897B]"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: `Barchasi (${stats.grammarCounts.total})` },
                  {
                    id: 'learned_or_mastered',
                    label: `O‘zlashtirilganlar (${stats.masteredGrammarRulesCount})`,
                  },
                  {
                    id: 'mastered',
                    label: `Mukammal (${stats.grammarCounts.mastered})`,
                  },
                  {
                    id: 'learned',
                    label: `O‘zlashtirilgan (${stats.grammarCounts.learned})`,
                  },
                  {
                    id: 'learning',
                    label: `O‘rganilmoqda (${stats.grammarCounts.learning})`,
                  },
                  {
                    id: 'discovered',
                    label: `Ko‘rilgan (${stats.grammarCounts.discovered})`,
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
                          ? 'bg-[#00897B] text-white'
                          : 'bg-[#F5F6FA] text-[#616161] hover:text-[#212121]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Topic & Sort Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="flex items-center gap-2 bg-[#F5F6FA] px-3 py-2 rounded-lg border border-[#E0E4EC]">
                  <BookOpen className="w-3.5 h-3.5 text-[#00897B] shrink-0" />
                  <select
                    value={topicFilter}
                    onChange={(e) => setTopicFilter(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-[#212121] focus:outline-none cursor-pointer"
                  >
                    <option value="all">Barcha mavzular</option>
                    {availableTopics.map((topic) => (
                      <option key={topic} value={topic}>
                        Mavzu: {topic}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-[#F5F6FA] px-3 py-2 rounded-lg border border-[#E0E4EC]">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#00897B] shrink-0" />
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
                    className="rounded text-[#00897B]"
                  />
                  <span>O‘quv dasturidagi barcha qoidalarni ko‘rsatish</span>
                </label>

                <span className="font-semibold text-[#00897B]">
                  Natija: {trackedRules.length} ta qoida
                </span>
              </div>
            </div>

            {/* Empty State */}
            {trackedRules.length === 0 ? (
              <div className="p-8 rounded-xl bg-white border border-[#E0E4EC] text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#E0F2F1] text-[#00897B] flex items-center justify-center mx-auto">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#212121]">
                    Hozircha bu filtr bo‘yicha grammatika qoidalari topilmadi
                  </h3>
                  <p className="text-xs text-[#616161] max-w-md mx-auto leading-relaxed">
                    Darslardagi qoidalarni o‘qib, amaliy mashq va sinovlarni muvaffaqiyatli bajarganingizda qoidalar o‘zlashtirilgan sifatida saqlanadi.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIncludeUntrackedCatalog(true)}
                    className="px-4 py-2 rounded-lg bg-[#E0F2F1] text-[#00897B] text-xs font-bold cursor-pointer hover:bg-[#B2DFDB]"
                  >
                    Dasturdagi barcha qoidalarni ko‘rish
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      navigate('lesson_detail', { lessonId: 'noun_01_what_is_a_noun' })
                    }
                    className="px-4 py-2 rounded-lg bg-[#00897B] text-white text-xs font-bold cursor-pointer hover:bg-[#00695C]"
                  >
                    Darsni boshlash →
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {trackedRules.map((rule) => {
                  const isLearned =
                    rule.status === 'learned' || rule.status === 'mastered';
                  const badge = STATUS_BADGE_META[rule.status];
                  const isExpanded = expandedRuleId === rule.id;

                  return (
                    <div
                      key={rule.id}
                      className="p-5 rounded-xl bg-white border border-[#E0E4EC] shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className="min-w-0 flex-1 cursor-pointer"
                          onClick={() =>
                            setExpandedRuleId(isExpanded ? null : rule.id)
                          }
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-[#00897B]">
                              {rule.categoryUz || 'Grammatika'}
                            </span>
                            <span className="text-[11px] font-mono text-[#616161] bg-[#F5F6FA] px-2 py-0.5 rounded border border-[#E0E4EC]">
                              {rule.ruleKey}
                            </span>
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${badge.bg} ${badge.text} ${badge.border}`}
                            >
                              {badge.labelUz}
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-[#212121] mt-1 leading-snug">
                            {rule.title.uz}
                          </h3>
                          {rule.title.en && rule.title.en !== rule.title.uz && (
                            <p className="text-xs text-[#616161] font-medium">
                              {rule.title.en}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleRuleMastered(rule.id)}
                            className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap ${
                              isLearned
                                ? 'bg-[#E0F2F1] text-[#00897B]'
                                : 'bg-[#E8EAF6] text-[#3949AB]'
                            }`}
                          >
                            {isLearned ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>O‘zlashtirildi</span>
                              </>
                            ) : (
                              <>
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>O‘rganilmoqda</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setExpandedRuleId(isExpanded ? null : rule.id)
                            }
                            className="w-9 h-9 rounded-lg bg-[#F5F6FA] text-[#616161] hover:text-[#212121] flex items-center justify-center cursor-pointer"
                            title="Batafsil"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {rule.formula && (
                        <div className="p-3 rounded-lg bg-[#F5F6FA] border border-[#E0E4EC] text-xs font-mono font-semibold text-[#3949AB]">
                          📐 Formula: {rule.formula}
                        </div>
                      )}

                      <p className="text-sm text-[#616161] leading-relaxed">
                        {rule.description}
                      </p>

                      {rule.examples.length > 0 && (
                        <div className="space-y-2">
                          {(isExpanded ? rule.examples : rule.examples.slice(0, 1)).map(
                            (ex, idx) => (
                              <div
                                key={idx}
                                className="p-3.5 rounded-lg bg-[#E0F2F1]/50 border border-[#B2DFDB] flex items-center justify-between gap-3"
                              >
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-[#212121]">
                                    {ex.en}
                                  </p>
                                  {ex.uz && (
                                    <p className="text-xs text-[#00695C] font-medium mt-0.5">
                                      {ex.uz}
                                    </p>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => playTts(ex.en)}
                                  className="w-10 h-10 rounded-lg bg-white text-[#00897B] border border-[#B2DFDB] flex items-center justify-center hover:bg-[#00897B] hover:text-white transition-colors cursor-pointer shrink-0"
                                  title="Misolni tinglash"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      )}

                      {/* Footer Metadata & Original Lesson Link */}
                      <div className="pt-2.5 border-t border-[#E0E4EC] flex flex-wrap items-center justify-between gap-2 text-xs text-[#616161]">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="tabular-nums">
                            O‘zlashtirish: {rule.masteryScore}%
                          </span>
                          <span className="tabular-nums">
                            Mashqlar: {rule.correctCount} ✓ / {rule.incorrectCount} ✗
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatShortDate(rule.firstLearnedAt || rule.firstIntroducedAt)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenOriginalLesson(rule)}
                          className="px-3 py-1.5 rounded-lg bg-[#00897B] text-white font-semibold hover:bg-[#00695C] flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Asl darsga o‘tish</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
              const masteredInUnit = unit.rules.filter((r) => r.status === 'learned').length;

              return (
                <button
                  key={unit.id}
                  type="button"
                  onClick={() => navigate('topic_rules_detail', { topicId: unit.id })}
                  className="w-full text-left p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-[0_1px_3px_rgba(0,0,0,0.05)] cursor-pointer hover:border-[#00897B] transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-lg bg-[#E0F2F1] text-[#00897B] flex items-center justify-center shrink-0 text-lg">
                        {unit.iconEmoji || <Layers className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs text-[#616161] font-medium">
                          <span className="text-[#00897B] font-semibold">{unit.section}</span>
                        </div>
                        <h3 className="text-sm font-bold text-[#212121] mt-0.5 truncate group-hover:text-[#00897B] transition-colors">
                          {unit.title}
                        </h3>
                        <p className="text-xs text-[#616161] mt-0.5 line-clamp-1">
                          {unit.rules.map((r) => r.nameUz).join(' · ')}
                        </p>
                      </div>
                    </div>

                    <div className="w-9 h-9 rounded-lg bg-[#F5F6FA] group-hover:bg-[#00897B] group-hover:text-white flex items-center justify-center text-[#616161] transition-colors shrink-0">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#E0E4EC] flex items-center justify-between text-xs">
                    <span className="text-[#00897B] font-semibold flex items-center gap-1 tabular-nums">
                      <Check className="w-3.5 h-3.5" />
                      {masteredInUnit} / {unit.rules.length} ta qoida o‘zlashtirilgan
                    </span>
                    <span className="text-[#00897B] font-semibold">
                      Mavzu qoidalarini ochish →
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
                Keyingi ost-mavzular va darajalarni o‘quv yo‘l xaritasida ochganingiz sari ularning grammatika qoidalari avtomatik ravishda shu yerga qo‘shiladi.
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
