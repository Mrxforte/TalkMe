import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TOPIC_LEARNING_GROUPS } from '../domain/learning/topicCatalog';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeBottomBar } from '../components/TalkMeBottomBar';
import { TalkMeButton } from '../components/TalkMeButton';
import {
  Volume2,
  Check,
  RotateCcw,
  BookOpen,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const TopicDetailScreen: React.FC = () => {
  const {
    selectedTopicId,
    navigate,
    goBack,
    playTts,
    toggleWordLearned,
    toggleRuleMastered,
    userLearnedWords,
    userMasteredRules,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'words' | 'rules'>('words');

  const topic =
    TOPIC_LEARNING_GROUPS.find((t) => t.id === selectedTopicId) || TOPIC_LEARNING_GROUPS[0];

  const topicWordsWithStatus = topic.words.map((tw) => {
    const liveWord = userLearnedWords.find((w) => w.id === tw.id);
    return liveWord ? { ...tw, status: liveWord.status } : tw;
  });

  const topicRulesWithStatus = topic.rules.map((tr) => {
    const liveRule = userMasteredRules.find((r) => r.id === tr.id);
    return liveRule
      ? { ...tr, status: liveRule.status, masteryScore: liveRule.masteryScore }
      : tr;
  });

  const learnedWordsCount = topicWordsWithStatus.filter((w) => w.status === 'learned').length;
  const masteredRulesCount = topicRulesWithStatus.filter((r) => r.status === 'learned').length;

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-24 text-[#212121]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-4 space-y-5">
        <TalkMeHeader
          title={topic.title}
          subtitle={`${topic.section} · Daraja ${topic.level}`}
          onBackClick={goBack}
        />

        {/* Material 2 Topic Overview Card */}
        <div className="rounded-xl p-5 bg-[#3949AB] text-white shadow-[0_2px_6px_rgba(57,73,171,0.2)] space-y-3">
          <div className="flex items-center gap-2 text-xs text-white/80 font-medium">
            <span>{topic.section}</span>
            <span aria-hidden="true">·</span>
            <span>Daraja {topic.level}</span>
            <span aria-hidden="true">·</span>
            <span>{topicWordsWithStatus.length} ta so‘z</span>
          </div>

          <h2 className="text-xl font-bold text-white leading-snug">{topic.title}</h2>
          <p className="text-sm text-white/85 leading-relaxed">{topic.subtitle}</p>

          <div className="pt-3 border-t border-white/15 flex flex-wrap items-center gap-4 text-xs font-semibold text-white/95 tabular-nums">
            <span>
              Yodlangan so‘zlar: {learnedWordsCount} / {topicWordsWithStatus.length}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              O‘zlashtirilgan qoidalar: {masteredRulesCount} / {topicRulesWithStatus.length}
            </span>
          </div>
        </div>

        {/* Material 2 Tab Bar */}
        <div className="flex items-center border-b border-[#E0E4EC] bg-white rounded-t-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setActiveTab('words')}
            className={`flex-1 py-3 px-4 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 relative whitespace-nowrap ${
              activeTab === 'words'
                ? 'text-[#3949AB] bg-[#E8EAF6]/40'
                : 'text-[#616161] hover:text-[#212121]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Mavzu so‘zlari ({topicWordsWithStatus.length})</span>
            {activeTab === 'words' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3949AB]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`flex-1 py-3 px-4 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 relative whitespace-nowrap ${
              activeTab === 'rules'
                ? 'text-[#3949AB] bg-[#E8EAF6]/40'
                : 'text-[#616161] hover:text-[#212121]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Grammatika qoidalari ({topicRulesWithStatus.length})</span>
            {activeTab === 'rules' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3949AB]" />
            )}
          </button>
        </div>

        {/* Tab 1: Topic Vocabulary List */}
        {activeTab === 'words' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#616161] px-1">
              <span>Ushbu mavzuda o‘rganiladigan so‘zlar ro‘yxati</span>
              <span className="tabular-nums font-medium">
                {learnedWordsCount} / {topicWordsWithStatus.length} yodlangan
              </span>
            </div>

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
        )}

        {/* Tab 2: Topic Grammar Rules */}
        {activeTab === 'rules' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#616161] px-1">
              <span>Mavzuning asosiy grammatik qoidalari</span>
              <span className="tabular-nums font-medium">
                {masteredRulesCount} / {topicRulesWithStatus.length} o‘zlashtirilgan
              </span>
            </div>

            {topicRulesWithStatus.map((rule) => {
              const isLearned = rule.status === 'learned';
              return (
                <div
                  key={rule.id}
                  className="p-5 rounded-xl bg-white border border-[#E0E4EC] shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-[#3949AB]">
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
                    <div className="pt-3 border-t border-[#E0E4EC] flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-[#212121]">{rule.exampleEn}</p>
                        <p className="text-xs text-[#616161] mt-0.5">{rule.exampleUz}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => playTts(rule.exampleEn || '')}
                        className="w-10 h-10 rounded-lg bg-[#E8EAF6] text-[#3949AB] flex items-center justify-center hover:bg-[#3949AB] hover:text-white transition-colors cursor-pointer shrink-0"
                        title="Misolni eshitish"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Action Footer */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <TalkMeButton
            text="Ko‘nikmalar amaliyotiga o‘tish"
            trailingIcon={<ChevronRight className="w-4 h-4" />}
            onClick={() => navigate('skill_practice', { skillType: 'listening' })}
          />
          <TalkMeButton
            text="Orqaga qaytish"
            variant="secondary"
            onClick={goBack}
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
