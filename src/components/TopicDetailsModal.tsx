import React, { useState } from 'react';
import { TopicLearningGroup } from '../domain/learning/topicCatalog';
import { useApp } from '../context/AppContext';
import {
  X,
  Volume2,
  Check,
  RotateCcw,
  Sparkles,
  BookOpen,
  Layers,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface TopicDetailsModalProps {
  topic: TopicLearningGroup | null;
  onClose: () => void;
  onStartPractice?: (topicId: string) => void;
}

export const TopicDetailsModal: React.FC<TopicDetailsModalProps> = ({
  topic,
  onClose,
  onStartPractice,
}) => {
  const { playTts, toggleWordLearned, toggleRuleMastered, userLearnedWords, userMasteredRules } =
    useApp();
  const [activeTab, setActiveTab] = useState<'words' | 'rules'>('words');

  if (!topic) return null;

  // Resolve dynamic status from AppContext's userLearnedWords and userMasteredRules
  const topicWordsWithStatus = topic.words.map((tw) => {
    const liveWord = userLearnedWords.find((w) => w.id === tw.id);
    return liveWord ? { ...tw, status: liveWord.status } : tw;
  });

  const topicRulesWithStatus = topic.rules.map((tr) => {
    const liveRule = userMasteredRules.find((r) => r.id === tr.id);
    return liveRule ? { ...tr, status: liveRule.status, masteryScore: liveRule.masteryScore } : tr;
  });

  const learnedWordsCount = topicWordsWithStatus.filter((w) => w.status === 'learned').length;
  const masteredRulesCount = topicRulesWithStatus.filter((r) => r.status === 'learned').length;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAFAFC] w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-[#EBE8F3]">
        {/* Top Header */}
        <div className="p-5 bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white relative">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
            title="Yopish"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-400/20 text-emerald-200 text-[11px] font-black uppercase tracking-wider border border-emerald-300/30">
              {topic.section}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white/10 text-indigo-100 text-[11px] font-bold">
              Daraja: {topic.level}
            </span>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-12 h-12 rounded-2xl bg-white/10 text-2xl flex items-center justify-center shrink-0 border border-white/20">
              {topic.iconEmoji}
            </span>
            <div>
              <h2 className="text-xl font-black text-white leading-tight">{topic.title}</h2>
              <p className="text-xs text-indigo-100/90 mt-1 leading-relaxed">
                {topic.subtitle}
              </p>
            </div>
          </div>

          {/* Dynamic Badges */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/15 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-200 font-extrabold flex items-center gap-1 border border-emerald-400/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {learnedWordsCount}/{topicWordsWithStatus.length} so‘z yodlandi
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-200 font-extrabold flex items-center gap-1 border border-amber-300/30">
              <Sparkles className="w-3.5 h-3.5" />
              {masteredRulesCount}/{topicRulesWithStatus.length} qoida o‘zlashtirildi
            </span>
          </div>
        </div>

        {/* Tab Switcher: So'zlar vs Qoidalar */}
        <div className="p-3 bg-white border-b border-[#EBE8F3] flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('words')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'words'
                ? 'bg-[#5E4B8B] text-white shadow-xs'
                : 'bg-[#F7F6FB] text-[#757575] hover:text-[#5E4B8B]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Mavzuning So‘zlari ({topicWordsWithStatus.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'rules'
                ? 'bg-[#5E4B8B] text-white shadow-xs'
                : 'bg-[#F7F6FB] text-[#757575] hover:text-[#5E4B8B]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Grammatika Qoidalari ({topicRulesWithStatus.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 scrollbar-thin">
          {activeTab === 'words' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-extrabold text-[#757575] uppercase tracking-wider">
                  Ushbu mavzuda o‘rganiladigan so‘zlar
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  + {topicWordsWithStatus.length} ta yangi so‘z
                </span>
              </div>

              {topicWordsWithStatus.map((word) => {
                const isLearned = word.status === 'learned';
                return (
                  <div
                    key={word.id}
                    className="p-3.5 rounded-2xl bg-white border border-[#EBE8F3] shadow-xs flex items-center justify-between gap-3 hover:border-[#5E4B8B]/30 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-10 h-10 rounded-xl bg-[#F7F6FB] text-xl flex items-center justify-center shrink-0">
                        {word.emoji || '📖'}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-[#1D1B20] truncate">
                            {word.word}
                          </span>
                          {word.phonetic && (
                            <span className="text-[11px] text-[#757575] font-mono">
                              {word.phonetic}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-emerald-600 truncate">
                          {word.translation}
                        </p>
                        <span className="text-[10px] text-[#A09EB0] font-semibold">
                          {word.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => playTts(word.word)}
                        className="w-8 h-8 rounded-full bg-[#F1EDFA] text-[#5E4B8B] flex items-center justify-center hover:bg-[#5E4B8B] hover:text-white transition-colors cursor-pointer"
                        title="Talaffuz (TTS)"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleWordLearned(word.id)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                          isLearned
                            ? 'bg-[#E8F8EE] text-[#27AE60]'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {isLearned ? (
                          <>
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Yodlandi</span>
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-3 h-3" />
                            <span>O‘rganish</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-extrabold text-[#757575] uppercase tracking-wider">
                  Mavzuning grammatik qadamlari
                </span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                  {topicRulesWithStatus.length} ta asosiy qoida
                </span>
              </div>

              {topicRulesWithStatus.map((rule) => {
                const isLearned = rule.status === 'learned';
                return (
                  <div
                    key={rule.id}
                    className="p-4 rounded-2xl bg-white border border-[#EBE8F3] shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#5E4B8B] bg-[#F1EDFA] px-2 py-0.5 rounded-md">
                          {rule.category}
                        </span>
                        <h4 className="text-sm font-black text-[#1D1B20] mt-1 leading-snug">
                          {rule.nameUz}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleRuleMastered(rule.id)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer shrink-0 ${
                          isLearned
                            ? 'bg-[#E8F8EE] text-[#27AE60]'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {isLearned ? (
                          <>
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>O‘zlashtirildi</span>
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-3 h-3" />
                            <span>O‘rganilmoqda</span>
                          </>
                        )}
                      </button>
                    </div>

                    {rule.formula && (
                      <div className="p-2.5 rounded-xl bg-[#F7F6FB] border border-[#EBE8F3] text-xs font-mono font-bold text-[#5E4B8B]">
                        {rule.formula}
                      </div>
                    )}

                    <p className="text-xs text-[#555] leading-relaxed">
                      {rule.shortSummaryUz}
                    </p>

                    {rule.exampleEn && (
                      <div className="pt-2 border-t border-[#F0EFF5] flex items-center justify-between">
                        <div>
                          <p className="text-xs font-extrabold text-[#1D1B20]">
                            {rule.exampleEn}
                          </p>
                          <p className="text-[11px] text-[#757575]">{rule.exampleUz}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => playTts(rule.exampleEn || '')}
                          className="w-7 h-7 rounded-full bg-[#F1EDFA] text-[#5E4B8B] flex items-center justify-center hover:bg-[#5E4B8B] hover:text-white transition-colors cursor-pointer"
                          title="Tinglash"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-white border-t border-[#EBE8F3] flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-[#F1EDFA] hover:bg-[#E7E2F3] text-[#5E4B8B] font-extrabold text-xs transition-colors cursor-pointer text-center"
          >
            Yopish
          </button>

          {onStartPractice && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartPractice(topic.id);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md hover:opacity-95 transition-all cursor-pointer"
            >
              <span>Darsga o‘tish</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
