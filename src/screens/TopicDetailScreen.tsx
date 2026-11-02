import React from 'react';
import { useApp } from '../context/AppContext';
import { findCurriculumTopicUnitById } from '../domain/learning/unlockedCurriculumAggregator';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBottomBar } from '../components/TalkMeBottomBar';
import { TalkMeButton } from '../components/TalkMeButton';
import {
  Volume2,
  Check,
  RotateCcw,
} from 'lucide-react';

/**
 * Dedicated screen showing ONLY Vocabulary Words for a selected unlocked Level / Subtopic.
 * Does NOT mix Grammar Rules in the same screen.
 */
export const TopicWordsDetailScreen: React.FC = () => {
  const {
    selectedTopicId,
    completedLevelIds,
    navigate,
    goBack,
    playTts,
    toggleWordLearned,
    userLearnedWords,
  } = useApp();

  const topic = findCurriculumTopicUnitById(selectedTopicId, completedLevelIds);

  const topicWordsWithStatus = topic.words.map((tw) => {
    const liveWord = userLearnedWords.find((w) => w.id === tw.id);
    return liveWord
      ? { ...tw, status: liveWord.status, reps: liveWord.reps }
      : tw;
  });

  const learnedWordsCount = topicWordsWithStatus.filter((w) => w.status === 'learned').length;

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-24 text-[#212121]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 space-y-5">
        <TalkMeHeader
          title={topic.title}
          subtitle={`${topic.section} · Mavzu so‘zlari`}
          onBackClick={goBack}
        />

        {/* Topic Words Overview Card */}
        <div className="rounded-xl p-5 bg-[#3949AB] text-white shadow-[0_2px_6px_rgba(57,73,171,0.2)] space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-white/80 font-medium">
            <span>{topic.section}</span>
            <span aria-hidden="true">·</span>
            <span>Daraja {topic.level}</span>
          </div>

          <h2 className="text-lg font-bold text-white leading-snug">{topic.title}</h2>
          <p className="text-xs text-white/85 leading-relaxed">{topic.subtitle}</p>

          <div className="pt-2.5 border-t border-white/15 flex items-center justify-between text-xs font-semibold text-white/95 tabular-nums">
            <span>Mavzu so‘zlari ({topicWordsWithStatus.length})</span>
            <span>
              Yodlangan: {learnedWordsCount} / {topicWordsWithStatus.length}
            </span>
          </div>
        </div>

        {/* Words-Only List */}
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-[#E0E4EC] divide-y divide-[#E0E4EC] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            {topicWordsWithStatus.map((word) => {
              const isLearned = word.status === 'learned';
              return (
                <div
                  key={word.id}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-[#212121] truncate">
                        {word.word}
                      </span>
                      {word.phonetic && (
                        <span className="text-xs text-[#616161] font-mono">
                          {word.phonetic}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-[#00897B] mt-0.5">
                      {word.translation}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#616161] mt-1">
                      <span>{word.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{word.reps} marta takrorlangan</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => playTts(word.word)}
                      className="w-11 h-11 rounded-lg bg-[#E8EAF6] text-[#3949AB] flex items-center justify-center hover:bg-[#3949AB] hover:text-white transition-colors cursor-pointer"
                      title="Talaffuzni tinglash"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleWordLearned(word.id)}
                      className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                        isLearned
                          ? 'bg-[#E0F2F1] text-[#00897B] hover:bg-[#B2DFDB]'
                          : 'bg-[#E8EAF6] text-[#3949AB] hover:bg-[#C5CAE9]'
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-2">
          <TalkMeButton
            text="Ushbu mavzu darsini boshlash"
            onClick={() =>
              navigate('lesson_detail', {
                lessonId: topic.id,
              })
            }
          />
        </div>
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

/**
 * Dedicated screen showing ONLY Grammar Rules for a selected unlocked Level / Subtopic.
 * Does NOT mix Vocabulary Words in the same screen.
 */
export const TopicRulesDetailScreen: React.FC = () => {
  const {
    selectedTopicId,
    completedLevelIds,
    navigate,
    goBack,
    playTts,
    toggleRuleMastered,
    userMasteredRules,
  } = useApp();

  const topic = findCurriculumTopicUnitById(selectedTopicId, completedLevelIds);

  const topicRulesWithStatus = topic.rules.map((tr) => {
    const liveRule = userMasteredRules.find((r) => r.id === tr.id);
    return liveRule
      ? { ...tr, status: liveRule.status, masteryScore: liveRule.masteryScore }
      : tr;
  });

  const masteredRulesCount = topicRulesWithStatus.filter((r) => r.status === 'learned').length;

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-24 text-[#212121]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 space-y-5">
        <TalkMeHeader
          title={topic.title}
          subtitle={`${topic.section} · Grammatika qoidalari`}
          onBackClick={goBack}
        />

        {/* Topic Rules Overview Card */}
        <div className="rounded-xl p-5 bg-[#00897B] text-white shadow-[0_2px_6px_rgba(0,137,123,0.2)] space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-white/80 font-medium">
            <span>{topic.section}</span>
            <span aria-hidden="true">·</span>
            <span>Daraja {topic.level}</span>
          </div>

          <h2 className="text-lg font-bold text-white leading-snug">{topic.title}</h2>
          <p className="text-xs text-white/85 leading-relaxed">{topic.subtitle}</p>

          <div className="pt-2.5 border-t border-white/15 flex items-center justify-between text-xs font-semibold text-white/95 tabular-nums">
            <span>Grammatika qoidalari ({topicRulesWithStatus.length})</span>
            <span>
              O‘zlashtirilgan: {masteredRulesCount} / {topicRulesWithStatus.length}
            </span>
          </div>
        </div>

        {/* Rules-Only List */}
        <div className="space-y-3">
          {topicRulesWithStatus.map((rule) => {
            const isLearned = rule.status === 'learned';
            return (
              <div
                key={rule.id}
                className="p-5 rounded-xl bg-white border border-[#E0E4EC] shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-[#00897B]">
                      {rule.category}
                    </span>
                    <h3 className="text-base font-bold text-[#212121] mt-1 leading-snug">
                      {rule.nameUz}
                    </h3>
                  </div>

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
                </div>

                {rule.formula && (
                  <div className="p-3 rounded-lg bg-[#F5F6FA] border border-[#E0E4EC] text-xs font-mono font-semibold text-[#3949AB]">
                    {rule.formula}
                  </div>
                )}

                <p className="text-sm text-[#616161] leading-relaxed">
                  {rule.shortSummaryUz}
                </p>

                {rule.exampleEn && (
                  <div className="p-3.5 rounded-lg bg-[#E0F2F1]/50 border border-[#B2DFDB] flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#212121]">{rule.exampleEn}</p>
                      {rule.exampleUz && (
                        <p className="text-xs text-[#00695C] font-medium mt-0.5">
                          {rule.exampleUz}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => playTts(rule.exampleEn || '')}
                      className="w-11 h-11 rounded-lg bg-white text-[#00897B] border border-[#B2DFDB] flex items-center justify-center hover:bg-[#00897B] hover:text-white transition-colors cursor-pointer shrink-0"
                      title="Misolni tinglash"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-2">
          <TalkMeButton
            text="Ushbu mavzu darsini boshlash"
            onClick={() =>
              navigate('lesson_detail', {
                lessonId: topic.id,
              })
            }
          />
        </div>
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

export const TopicDetailScreen: React.FC = () => {
  const { activeProfileTab } = useApp();
  return activeProfileTab === 1 ? <TopicRulesDetailScreen /> : <TopicWordsDetailScreen />;
};
