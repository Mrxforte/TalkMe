import React, { useState } from 'react';
import {
  SubtopicContentBlock,
  LearnerLevelTier,
  GuidedActivityItem,
  AssessmentQuestion,
  validateBlockSafe,
  SpeakableTextModel,
} from '../../content/schemas/subtopicSchemas';
import {
  SpeakableWord,
  SpeakableSentence,
} from '../../shared/components/speakable/SpeakableComponents';
import { speechManager } from '../tts-engine/speechArchitecture';
import { subtopicProgressEngine } from './subtopicProgressEngine';
import { globalKnowledgeTracker } from '../../knowledge/domain/services/GlobalKnowledgeTracker';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  RotateCcw,
  Award,
  Sparkles,
  Check,
  Play,
} from 'lucide-react';

// Helper component to render English text with highlighted target words and tap-to-speak on each word
export const HighlightedSpeakableSentence: React.FC<{
  sentence: string;
  highlightedWords?: string[];
  translationUz?: string;
  grammarNoteUz?: string;
  emoji?: string;
}> = ({ sentence, highlightedWords = [], translationUz, grammarNoteUz, emoji }) => {
  const [speaking, setSpeaking] = useState(false);

  const handlePlayFull = async () => {
    setSpeaking(true);
    try {
      await speechManager.speakEnglish(sentence);
    } finally {
      setSpeaking(false);
    }
  };

  const lowerHighlights = highlightedWords.map((w) => w.toLowerCase().trim());
  const tokens = sentence.split(/(\s+)/);

  return (
    <div className="p-3.5 rounded-xl bg-[#F5F6FA] border border-[#E0E4EC] space-y-2">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5 flex-1">
          {emoji && (
            <span className="w-9 h-9 rounded-lg bg-white border border-[#E0E4EC] flex items-center justify-center text-lg shrink-0">
              {emoji}
            </span>
          )}
          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center gap-y-1 text-sm leading-relaxed text-[#212121]">
              {tokens.map((tok, idx) => {
                if (/^\s+$/.test(tok)) {
                  return <span key={idx}>&nbsp;</span>;
                }
                const clean = tok.replace(/[^a-zA-Z0-9'-]/g, '').toLowerCase();
                const isTarget = lowerHighlights.includes(clean);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      speechManager.speakEnglish(clean || tok);
                      if (isTarget && clean) {
                        globalKnowledgeTracker.emitEvent({
                          eventType: 'VOCABULARY_PRACTICED',
                          knowledgeId: clean,
                          source: {
                            courseId: 'nouns',
                            activityType: 'vocabulary_card',
                          },
                          metadata: {
                            word: clean,
                            exampleEn: sentence,
                            exampleUz: translationUz,
                          },
                          dedupeWindowKey: `highlight_tap_${clean}_${Date.now()}`,
                        });
                      }
                    }}
                    title="Talaffuzni eshitish uchun bosing"
                    className={`px-1 py-0.5 rounded transition-colors cursor-pointer ${
                      isTarget
                        ? 'bg-[#E8EAF6] text-[#3949AB] font-bold underline decoration-[#3949AB] decoration-2 underline-offset-4'
                        : ' font-medium hover:bg-[#E8EAF6]/60 hover:text-[#3949AB]'
                    }`}
                  >
                    {tok}
                  </button>
                );
              })}
            </div>

            {translationUz && (
              <p className="text-xs text-[#616161] font-medium">{translationUz}</p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handlePlayFull}
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
            speaking
              ? 'bg-[#00897B] text-white'
              : 'bg-[#E8EAF6] text-[#3949AB] hover:bg-[#3949AB] hover:text-white'
          }`}
          title="Butun gapni eshitish"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {grammarNoteUz && (
        <div className="pt-2 border-t border-[#E0E4EC] flex items-center gap-1.5 text-[11px] font-semibold text-[#00897B]">
          <span>🎯 E’tibor bering:</span>
          <span>{grammarNoteUz}</span>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// GUIDED ACTIVITY CARD (STAGE 4 MINI-PRACTICE)
// ============================================================================
const GuidedActivityCard: React.FC<{
  subtopicId: string;
  activity: GuidedActivityItem;
  index: number;
  onResultRecorded: () => void;
}> = ({ subtopicId, activity, index, onResultRecorded }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [builtTokens, setBuiltTokens] = useState<string[]>([]);
  const [matchedLeft, setMatchedLeft] = useState<string | null>(null);
  const [completedPairs, setCompletedPairs] = useState<string[]>([]);
  const [categorizedMap, setCategorizedMap] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleReset = () => {
    setSelectedOptionId('');
    setTextAnswer('');
    setBuiltTokens([]);
    setMatchedLeft(null);
    setCompletedPairs([]);
    setCategorizedMap({});
    setSubmitted(false);
    setIsCorrect(false);
  };

  const evaluateActivity = () => {
    let correct = false;

    if (
      activity.interactionMode === 'multiple_choice' ||
      activity.interactionMode === 'identify_word' ||
      activity.interactionMode === 'true_false'
    ) {
      const chosen = activity.options?.find((o) => o.id === selectedOptionId);
      correct = Boolean(chosen?.isCorrect);
    } else if (activity.interactionMode === 'fill_blank') {
      const normalizedUser = textAnswer.trim().toLowerCase();
      const normalizedTarget = (activity.correctAnswerString || '').trim().toLowerCase();
      correct = normalizedUser.length > 0 && normalizedUser === normalizedTarget;
    } else if (activity.interactionMode === 'sentence_builder') {
      const joined = builtTokens
        .join(' ')
        .replace(/\s+([.,!?])/g, '$1')
        .trim()
        .toLowerCase();
      const target = (activity.correctAnswerString || '')
        .replace(/\s+([.,!?])/g, '$1')
        .trim()
        .toLowerCase();
      correct = joined === target;
    } else if (activity.interactionMode === 'match_pairs') {
      const totalPairs = activity.pairs?.length || 0;
      correct = totalPairs > 0 && completedPairs.length === totalPairs;
    } else if (activity.interactionMode === 'categorize') {
      const items = activity.categorizeItems || [];
      correct =
        items.length > 0 &&
        items.every((item) => categorizedMap[item.id] === item.correctCategoryId);
    }

    setSubmitted(true);
    setIsCorrect(correct);

    subtopicProgressEngine.recordGuidedActivityResult(subtopicId, {
      itemId: activity.id,
      knowledgeId: activity.knowledgeId,
      promptUz: activity.questionUz,
      explanationUz: activity.explanationUz,
      isCorrect: correct,
    });
    onResultRecorded();
  };

  return (
    <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#E8EAF6] text-[#3949AB]">
          Mashq #{index + 1} · {activity.exerciseTypeLabelUz} ({activity.exerciseTemplateCode})
        </span>
        {submitted && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded ${
              isCorrect ? 'bg-[#E0F2F1] text-[#00897B]' : 'bg-[#FFEBEE] text-[#D32F2F]'
            }`}
          >
            {isCorrect ? '✓ To‘g‘ri' : '✗ Xato'}
          </span>
        )}
      </div>

      <p className="text-sm font-bold text-[#212121]">{activity.questionUz}</p>

      {activity.questionEn && (
        <SpeakableSentence
          sentence={activity.questionEn}
          className="bg-[#F5F6FA] border-[#C5CAE9]"
        />
      )}

      {/* Multiple choice / Identify word / True-False */}
      {(activity.interactionMode === 'multiple_choice' ||
        activity.interactionMode === 'identify_word' ||
        activity.interactionMode === 'true_false') &&
        activity.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activity.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    if (!submitted) {
                      setSelectedOptionId(opt.id);
                      speechManager.speakEnglish(opt.textEn);
                    }
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    submitted
                      ? opt.isCorrect
                        ? 'bg-[#E0F2F1] border-[#00897B] text-[#00695C]'
                        : isSelected
                        ? 'bg-[#FFEBEE] border-[#D32F2F] text-[#D32F2F]'
                        : 'bg-[#F5F6FA] border-[#E0E4EC] text-[#616161]'
                      : isSelected
                      ? 'bg-[#E8EAF6] border-[#3949AB] text-[#3949AB] font-bold'
                      : 'bg-[#F5F6FA] border-[#E0E4EC] hover:border-[#3949AB]'
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold">{opt.textEn}</div>
                    {opt.textUz && <div className="text-xs text-[#616161]">{opt.textUz}</div>}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speechManager.speakEnglish(opt.textEn);
                    }}
                    className="w-7 h-7 rounded-md bg-white border border-[#E0E4EC] flex items-center justify-center text-[#3949AB] shrink-0"
                    title="Eshitish"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

      {/* Match Pairs */}
      {activity.interactionMode === 'match_pairs' && activity.pairs && (
        <div className="space-y-2">
          <p className="text-xs text-[#616161]">
            Inglizcha so‘zni bosing va uning o‘zbekcha juftini tanlang:
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              {activity.pairs.map((p) => {
                const done = completedPairs.includes(p.id);
                const active = matchedLeft === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={done || submitted}
                    onClick={() => {
                      speechManager.speakEnglish(p.leftEn);
                      setMatchedLeft(p.id);
                    }}
                    className={`w-full p-2.5 rounded-lg border text-xs font-bold text-left flex items-center justify-between cursor-pointer ${
                      done
                        ? 'bg-[#E0F2F1] border-[#00897B] text-[#00897B]'
                        : active
                        ? 'bg-[#3949AB] border-[#3949AB] text-white'
                        : 'bg-[#F5F6FA] border-[#E0E4EC] text-[#212121]'
                    }`}
                  >
                    <span>{p.leftEn}</span>
                    <Volume2 className="w-3.5 h-3.5 opacity-75" />
                  </button>
                );
              })}
            </div>
            <div className="space-y-1.5">
              {activity.pairs.map((p) => {
                const done = completedPairs.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={done || submitted}
                    onClick={() => {
                      if (matchedLeft === p.id) {
                        setCompletedPairs((prev) => [...prev, p.id]);
                        setMatchedLeft(null);
                      } else {
                        setMatchedLeft(null);
                      }
                    }}
                    className={`w-full p-2.5 rounded-lg border text-xs font-semibold text-left cursor-pointer ${
                      done
                        ? 'bg-[#E0F2F1] border-[#00897B] text-[#00897B]'
                        : 'bg-white border-[#E0E4EC] text-[#212121] hover:border-[#3949AB]'
                    }`}
                  >
                    {p.rightUz}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Categorize */}
      {activity.interactionMode === 'categorize' &&
        activity.categories &&
        activity.categorizeItems && (
          <div className="space-y-2.5">
            {activity.categorizeItems.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl bg-[#F5F6FA] border border-[#E0E4EC] flex flex-wrap items-center justify-between gap-2"
              >
                <SpeakableWord word={item.wordEn} className="text-sm" />
                <div className="flex flex-wrap gap-1.5">
                  {activity.categories!.map((cat) => {
                    const chosen = categorizedMap[item.id] === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        disabled={submitted}
                        onClick={() =>
                          setCategorizedMap((prev) => ({ ...prev, [item.id]: cat.id }))
                        }
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                          chosen
                            ? 'bg-[#3949AB] text-white border-[#3949AB]'
                            : 'bg-white text-[#616161] border-[#E0E4EC] hover:border-[#3949AB]'
                        }`}
                      >
                        {cat.labelUz}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Sentence Builder */}
      {activity.interactionMode === 'sentence_builder' && activity.sentenceTokens && (
        <div className="space-y-2.5">
          <div className="min-h-11 p-2.5 rounded-xl bg-[#F5F6FA] border border-[#C5CAE9] flex flex-wrap items-center gap-1.5">
            {builtTokens.length === 0 ? (
              <span className="text-xs text-[#616161]">
                Gap tuzish uchun quyidagi so‘zlarni ketma-ket bosing...
              </span>
            ) : (
              builtTokens.map((tok, idx) => (
                <button
                  key={`${tok}-${idx}`}
                  type="button"
                  disabled={submitted}
                  onClick={() =>
                    setBuiltTokens((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="px-2.5 py-1 rounded-lg bg-[#3949AB] text-white text-xs font-bold cursor-pointer"
                >
                  {tok}
                </button>
              ))
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {activity.sentenceTokens.map((tok, idx) => (
              <button
                key={`${tok}-pool-${idx}`}
                type="button"
                disabled={submitted}
                onClick={() => {
                  speechManager.speakEnglish(tok);
                  setBuiltTokens((prev) => [...prev, tok]);
                }}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E0E4EC] hover:border-[#3949AB] text-xs font-semibold text-[#212121] cursor-pointer"
              >
                {tok}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fill Blank */}
      {activity.interactionMode === 'fill_blank' && (
        <div>
          <input
            type="text"
            disabled={submitted}
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            placeholder="Javobni ingliz tilida yozing..."
            className="w-full h-10 px-3 rounded-lg bg-[#F5F6FA] border border-[#E0E4EC] text-sm text-[#212121] focus:outline-none focus:border-[#3949AB]"
          />
        </div>
      )}

      {/* Actions & Immediate Feedback */}
      {!submitted ? (
        <button
          type="button"
          onClick={evaluateActivity}
          className="w-full py-2.5 px-4 rounded-xl bg-[#3949AB] hover:bg-[#283593] text-white font-semibold text-xs cursor-pointer transition-colors"
        >
          Javobni Tekshirish
        </button>
      ) : (
        <div
          className={`p-3 rounded-xl border space-y-2 ${
            isCorrect
              ? 'bg-[#E0F2F1] border-[#80CBC4] text-[#00695C]'
              : 'bg-[#FFEBEE] border-[#EF9A9A] text-[#C62828]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold">
              {isCorrect ? '🎉 Barakalla! Javobingiz to‘g‘ri.' : '💡 Izohni o‘qing va qayta urinib ko‘ring:'}
            </span>
            {activity.allowRetry && !isCorrect && (
              <button
                type="button"
                onClick={handleReset}
                className="px-2.5 py-1 rounded-lg bg-white text-[#212121] text-xs font-semibold border border-[#E0E4EC] flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Qayta urinish</span>
              </button>
            )}
          </div>
          <p className="text-xs leading-relaxed text-[#212121]">{activity.explanationUz}</p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// ASSESSMENT BLOCK RENDERER (STAGE 6 SUBTOPIC ASSESSMENT)
// ============================================================================
const SubtopicAssessmentRenderer: React.FC<{
  subtopicId: string;
  block: Extract<SubtopicContentBlock, { type: 'AssessmentBlock' }>;
  onAssessmentEvaluated: () => void;
}> = ({ subtopicId, block, onAssessmentEvaluated }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [builtSentenceMap, setBuiltSentenceMap] = useState<Record<string, string[]>>({});
  const [evaluation, setEvaluation] = useState<{
    scorePercent: number;
    passed: boolean;
    correctCount: number;
    totalCount: number;
    details: Array<{
      question: AssessmentQuestion;
      isCorrect: boolean;
      userAnswerDisplay: string;
    }>;
  } | null>(null);

  const handleSubmitAssessment = () => {
    const details = block.questions.map((q) => {
      let isCorrect = false;
      let userAnswerDisplay = '';

      if (q.questionType === 'multiple_choice' || q.questionType === 'true_false') {
        const chosenId = answers[q.id];
        const chosenOpt = q.options?.find((o) => o.id === chosenId);
        userAnswerDisplay = chosenOpt?.textEn || 'Tanlanmagan';
        isCorrect = Boolean(chosenOpt?.isCorrect);
      } else if (q.questionType === 'fill_blank') {
        const raw = (answers[q.id] || '').trim();
        userAnswerDisplay = raw || 'Yozilmagan';
        isCorrect = raw.toLowerCase() === (q.correctAnswerText || '').trim().toLowerCase();
      } else if (q.questionType === 'sentence_builder') {
        const tokens = builtSentenceMap[q.id] || [];
        const built = tokens
          .join(' ')
          .replace(/\s+([.,!?])/g, '$1')
          .trim();
        userAnswerDisplay = built || 'Tuzilmagan';
        const target = (q.correctAnswerText || '')
          .replace(/\s+([.,!?])/g, '$1')
          .trim();
        isCorrect = built.toLowerCase() === target.toLowerCase();
      }

      return { question: q, isCorrect, userAnswerDisplay };
    });

    const outcome = subtopicProgressEngine.recordAssessmentSubmission(
      subtopicId,
      block.passingThresholdPercent,
      details.map((d) => ({
        questionId: d.question.id,
        knowledgeId: d.question.knowledgeId,
        promptUz: d.question.promptUz,
        explanationUz: d.question.explanationUz,
        isCorrect: d.isCorrect,
      }))
    );

    setEvaluation({
      scorePercent: outcome.scorePercent,
      passed: outcome.passed,
      correctCount: outcome.correctCount,
      totalCount: outcome.totalCount,
      details,
    });
    onAssessmentEvaluated();
  };

  const handleRetryAssessment = () => {
    setAnswers({});
    setBuiltSentenceMap({});
    setEvaluation(null);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-[#E8EAF6] border border-[#C5CAE9] flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#3949AB]">
            6-BOSQICH · YAKUNIY SINOV (ASSESSMENT)
          </span>
          <h4 className="text-base font-bold text-[#212121] mt-0.5">{block.titleUz}</h4>
          <p className="text-xs text-[#616161] mt-0.5">{block.descriptionUz}</p>
        </div>
        <div className="px-3 py-2 rounded-xl bg-white border border-[#C5CAE9] text-center shrink-0">
          <div className="text-[10px] font-bold uppercase text-[#616161]">O‘tish bali</div>
          <div className="text-sm font-bold text-[#3949AB]">{block.passingThresholdPercent}%</div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {block.questions.map((q, qIdx) => {
          const detail = evaluation?.details.find((d) => d.question.id === q.id);

          return (
            <div
              key={q.id}
              className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#3949AB]">
                  {qIdx + 1}-savol · {q.ruleCoveredUz}
                </span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#F5F6FA] text-[#616161]">
                  {q.difficulty === 'easy'
                    ? 'Oson'
                    : q.difficulty === 'medium'
                    ? 'O‘rta'
                    : 'Murakkab'}
                </span>
              </div>

              <p className="text-sm font-bold text-[#212121]">{q.promptUz}</p>

              {q.promptEn && (
                <SpeakableSentence
                  sentence={q.promptEn}
                  className="bg-[#F5F6FA] border-[#E0E4EC]"
                />
              )}

              {(q.questionType === 'multiple_choice' || q.questionType === 'true_false') &&
                q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt) => {
                      const selected = answers[q.id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={Boolean(evaluation)}
                          onClick={() => {
                            speechManager.speakEnglish(opt.textEn);
                            setAnswers((prev) => ({ ...prev, [q.id]: opt.id }));
                          }}
                          className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                            evaluation
                              ? opt.isCorrect
                                ? 'bg-[#E0F2F1] border-[#00897B] text-[#00695C]'
                                : selected
                                ? 'bg-[#FFEBEE] border-[#D32F2F] text-[#C62828]'
                                : 'bg-[#F5F6FA] border-[#E0E4EC] text-[#616161]'
                              : selected
                              ? 'bg-[#E8EAF6] border-[#3949AB] text-[#3949AB] font-bold'
                              : 'bg-[#F5F6FA] border-[#E0E4EC] text-[#212121] hover:border-[#3949AB]'
                          }`}
                        >
                          <div>
                            <div>{opt.textEn}</div>
                            {opt.textUz && (
                              <div className="text-[11px] text-[#616161]">{opt.textUz}</div>
                            )}
                          </div>
                          <Volume2 className="w-3.5 h-3.5 shrink-0 opacity-75" />
                        </button>
                      );
                    })}
                  </div>
                )}

              {q.questionType === 'fill_blank' && (
                <input
                  type="text"
                  disabled={Boolean(evaluation)}
                  value={answers[q.id] || ''}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  placeholder="Javobni ingliz tilida kiriting..."
                  className="w-full h-10 px-3 rounded-lg bg-[#F5F6FA] border border-[#E0E4EC] text-sm text-[#212121] focus:outline-none focus:border-[#3949AB]"
                />
              )}

              {q.questionType === 'sentence_builder' && q.sentenceTokens && (
                <div className="space-y-2">
                  <div className="min-h-10 p-2.5 rounded-xl bg-[#F5F6FA] border border-[#C5CAE9] flex flex-wrap gap-1.5">
                    {(builtSentenceMap[q.id] || []).length === 0 ? (
                      <span className="text-xs text-[#616161]">
                        So‘zlarni bosib gapni yig‘ing...
                      </span>
                    ) : (
                      (builtSentenceMap[q.id] || []).map((tok, idx) => (
                        <button
                          key={`${tok}-${idx}`}
                          type="button"
                          disabled={Boolean(evaluation)}
                          onClick={() =>
                            setBuiltSentenceMap((prev) => ({
                              ...prev,
                              [q.id]: (prev[q.id] || []).filter((_, i) => i !== idx),
                            }))
                          }
                          className="px-2.5 py-1 rounded-lg bg-[#3949AB] text-white text-xs font-bold cursor-pointer"
                        >
                          {tok}
                        </button>
                      ))
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {q.sentenceTokens.map((tok, idx) => (
                      <button
                        key={`${tok}-opt-${idx}`}
                        type="button"
                        disabled={Boolean(evaluation)}
                        onClick={() => {
                          speechManager.speakEnglish(tok);
                          setBuiltSentenceMap((prev) => ({
                            ...prev,
                            [q.id]: [...(prev[q.id] || []), tok],
                          }));
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E0E4EC] text-xs font-semibold hover:border-[#3949AB] cursor-pointer"
                      >
                        {tok}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {detail && (
                <div
                  className={`p-3 rounded-xl border text-xs ${
                    detail.isCorrect
                      ? 'bg-[#E0F2F1] border-[#80CBC4] text-[#00695C]'
                      : 'bg-[#FFEBEE] border-[#EF9A9A] text-[#C62828]'
                  }`}
                >
                  <div className="font-bold">
                    {detail.isCorrect
                      ? '✓ To‘g‘ri javob!'
                      : `✗ Sizning javobingiz: "${detail.userAnswerDisplay}"`}
                  </div>
                  <p className="mt-1 text-[#212121]">{q.explanationUz}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit or Evaluation Banner */}
      {!evaluation ? (
        <button
          type="button"
          onClick={handleSubmitAssessment}
          className="w-full py-3.5 px-5 rounded-xl bg-[#3949AB] hover:bg-[#283593] text-white font-bold text-sm cursor-pointer shadow-xs transition-colors"
        >
          Sinovni Yakunlash va Natijani Ko‘rish
        </button>
      ) : (
        <div
          className={`p-5 rounded-xl border space-y-3 ${
            evaluation.passed
              ? 'bg-[#E0F2F1] border-[#00897B]'
              : 'bg-[#FFF8E1] border-[#FFB300]'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#212121]">
                {evaluation.passed
                  ? '🏆 Sinov Muvaffaqiyatli Topshirildi!'
                  : '⚠️ O‘tish baliga yetmadi — Qayta urinib ko‘ring'}
              </span>
              <h4 className="text-lg font-bold text-[#212121] mt-0.5">
                Natija: {evaluation.scorePercent}% ({evaluation.correctCount}/
                {evaluation.totalCount} to‘g‘ri)
              </h4>
              <p className="text-xs text-[#616161] mt-0.5">
                {evaluation.passed
                  ? 'Siz bu ost-mavzuni to‘liq o‘zlashtirdingiz! Endi Yakuniy Xulosa (Wrap-up) bosqichiga o‘ting.'
                  : `Ushbu ost-mavzuni tugallash uchun kamida ${block.passingThresholdPercent}% to‘plash kerak. Xatolarni ko‘rib chiqib, qayta topshiring.`}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRetryAssessment}
              className="px-3.5 py-2 rounded-xl bg-white border border-[#E0E4EC] text-[#212121] text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 hover:border-[#3949AB]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Qayta topshirish</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// UNIVERSAL SUBTOPIC BLOCK REGISTRY RENDERER (ALL 17 BLOCK TYPES + FALLBACK)
// ============================================================================
export const SubtopicBlockRenderer: React.FC<{
  rawBlock: unknown;
  subtopicId: string;
  learnerLevel: LearnerLevelTier;
  onProgressUpdated: () => void;
}> = ({ rawBlock, subtopicId, learnerLevel, onProgressUpdated }) => {
  const validated = validateBlockSafe(rawBlock);

  if (!validated.known || !validated.block) {
    return (
      <div className="p-4 rounded-xl bg-[#F5F6FA] border border-[#E0E4EC] text-xs text-[#616161]">
        Qo‘shimcha o‘quv bloki ({validated.rawType}) — moslashtirilgan rejimda ko‘rsatilmoqda.
      </div>
    );
  }

  const block = validated.block;

  switch (block.type) {
    case 'RuleExplanation':
      return (
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3949AB] bg-[#E8EAF6] px-2.5 py-0.5 rounded">
                Asosiy Qoida (O‘zbek tilida tushuntirish)
              </span>
              <h3 className="text-base font-bold text-[#212121] mt-1.5">{block.ruleTitleUz}</h3>
            </div>
            {block.ruleTitleEn && (
              <SpeakableWord word={block.ruleTitleEn} className="text-xs" />
            )}
          </div>

          <p className="text-sm text-[#212121] leading-relaxed whitespace-pre-line">
            {block.simpleExplanationUz}
          </p>

          {/* Questions Answered */}
          {block.questionsAnsweredUz.length > 0 && (
            <div className="p-3 rounded-xl bg-[#E8EAF6]/60 border border-[#C5CAE9] space-y-1.5">
              <div className="text-xs font-bold text-[#3949AB] flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>Bu qoida qanday savollarga javob beradi?</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {block.questionsAnsweredUz.map((q, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-white border border-[#C5CAE9] text-xs font-bold text-[#3949AB]"
                  >
                    {q}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* When and Why used */}
          <div className="p-3 rounded-xl bg-[#E0F2F1]/60 border border-[#80CBC4]">
            <div className="text-xs font-bold text-[#00695C]">Qachon va nima uchun ishlatiladi?</div>
            <p className="text-xs text-[#212121] mt-1 leading-relaxed">{block.whenToUseUz}</p>
          </div>

          {/* Formula if present */}
          {block.formula && (
            <div className="p-3 rounded-xl bg-[#212121] text-white font-mono text-xs">
              <span className="text-[#80CBC4] font-sans font-bold block mb-1">
                📐 Gapda joylashuv formulasi:
              </span>
              {block.formula}
            </div>
          )}

          {/* Progressive Disclosure ("Bilish foydali") */}
          {block.progressiveDisclosure && (
            <div className="p-3 rounded-xl bg-[#F5F6FA] border border-[#E0E4EC] space-y-1">
              <div className="text-[11px] font-bold uppercase text-[#3949AB]">
                💡 Bilish foydali:
              </div>
              {learnerLevel === 'A0-A1' && block.progressiveDisclosure.beginnerNoteUz && (
                <p className="text-xs text-[#212121]">
                  {block.progressiveDisclosure.beginnerNoteUz}
                </p>
              )}
              {learnerLevel === 'A2' && (
                <p className="text-xs text-[#212121]">
                  {block.progressiveDisclosure.elementaryNoteUz ||
                    block.progressiveDisclosure.beginnerNoteUz}
                </p>
              )}
              {learnerLevel === 'B1-B2' && (
                <p className="text-xs text-[#212121]">
                  {block.progressiveDisclosure.intermediateExceptionsUz ||
                    block.progressiveDisclosure.elementaryNoteUz ||
                    block.progressiveDisclosure.beginnerNoteUz}
                </p>
              )}
              {learnerLevel === 'C1-C2' && (
                <p className="text-xs text-[#212121]">
                  {block.progressiveDisclosure.advancedNuanceUz ||
                    block.progressiveDisclosure.intermediateExceptionsUz ||
                    block.progressiveDisclosure.beginnerNoteUz}
                </p>
              )}
            </div>
          )}

          {/* Contextual Examples */}
          {block.examples.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#212121]">
                🔊 Hayotiy misollar (har bir inglizcha so‘zni bosib eshiting):
              </div>
              {block.examples.map((ex, i) => (
                <HighlightedSpeakableSentence
                  key={i}
                  sentence={ex.text}
                  highlightedWords={ex.highlightedWords}
                  translationUz={ex.translation}
                  grammarNoteUz={ex.grammarNoteUz}
                  emoji={ex.emoji}
                />
              ))}
            </div>
          )}
        </div>
      );

    case 'GrammarFormula':
      return (
        <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-3">
          <div className="text-xs font-bold uppercase text-[#3949AB]">📐 {block.titleUz}</div>
          <div className="p-3 rounded-xl bg-[#3949AB] text-white font-bold text-sm text-center">
            {block.formulaPattern}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {block.partsBreakdown.map((part, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#F5F6FA] border border-[#E0E4EC] space-y-1"
              >
                <div className="text-xs font-bold text-[#3949AB]">{part.partLabel}</div>
                <div className="text-xs text-[#616161]">{part.meaningUz}</div>
                <SpeakableWord word={part.exampleEn} className="mt-1" />
              </div>
            ))}
          </div>
        </div>
      );

    case 'ExampleSentence':
      return (
        <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-2">
          {block.categoryLabelUz && (
            <span className="inline-block text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-[#E8EAF6] text-[#3949AB]">
              {block.categoryLabelUz}
            </span>
          )}
          <HighlightedSpeakableSentence
            sentence={block.sentence.text}
            highlightedWords={block.sentence.highlightedWords}
            translationUz={block.sentence.translation}
            grammarNoteUz={block.sentence.grammarNoteUz}
            emoji={block.sentence.emoji}
          />
          <p className="text-xs text-[#616161] pl-1">{block.explanationUz}</p>
        </div>
      );

    case 'VocabularyCard':
      return (
        <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-3">
          <h4 className="text-sm font-bold text-[#212121]">{block.titleUz}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {block.words.map((w) => (
              <div
                key={w.id}
                className="p-3 rounded-xl bg-[#F5F6FA] border border-[#E0E4EC] space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{w.emoji}</span>
                    <div>
                      <SpeakableWord
                        word={w.wordEn}
                        translationUz={w.translationUz}
                        phonetic={w.phonetic}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-[#E0E4EC] text-[#3949AB]">
                    {w.categoryUz}
                  </span>
                </div>
                <HighlightedSpeakableSentence
                  sentence={w.exampleSentenceEn}
                  highlightedWords={[w.wordEn]}
                  translationUz={w.exampleSentenceUz}
                />
              </div>
            ))}
          </div>
        </div>
      );

    case 'WordHighlight':
      return (
        <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-3">
          <div className="text-xs font-bold uppercase text-[#00897B]">
            🔍 So‘zlarni tahlil qilish
          </div>
          <p className="text-xs text-[#616161]">{block.instructionUz}</p>
          <HighlightedSpeakableSentence
            sentence={block.sentenceEn}
            highlightedWords={block.highlightedItems.map((i) => i.wordEn)}
            translationUz={block.sentenceUz}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {block.highlightedItems.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-[#E8EAF6]/50 border border-[#C5CAE9] space-y-1"
              >
                <SpeakableWord word={item.wordEn} translationUz={item.meaningUz} />
                <p className="text-[11px] text-[#212121]">{item.roleExplanationUz}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'ComparisonBlock':
      return (
        <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-3">
          <h4 className="text-sm font-bold text-[#212121]">⚖️ {block.titleUz}</h4>

          {block.comparisonRows && block.comparisonRows.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-[#E0E4EC]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#E8EAF6] text-[#3949AB] font-bold">
                    <th className="p-2.5 border-b border-[#C5CAE9]">Turi / Vazifasi</th>
                    <th className="p-2.5 border-b border-[#C5CAE9]">So‘rog‘i yoki Qoidasi</th>
                    <th className="p-2.5 border-b border-[#C5CAE9]">Inglizcha Misol (Bosing)</th>
                  </tr>
                </thead>
                <tbody>
                  {block.comparisonRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="border-b border-[#E0E4EC] last:border-b-0 odd:bg-white even:bg-[#F5F6FA]"
                    >
                      <td className="p-2.5 font-bold text-[#212121] align-top">
                        {row.categoryUz}
                      </td>
                      <td className="p-2.5 text-[#616161] align-top">{row.questionOrRuleUz}</td>
                      <td className="p-2.5 align-top">
                        <SpeakableWord
                          word={row.exampleEn}
                          translationUz={row.exampleUz}
                          className="text-xs"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#E0F2F1] border border-[#00897B] space-y-1.5">
              <div className="text-xs font-bold text-[#00695C] flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>To‘g‘ri (Correct)</span>
              </div>
              <HighlightedSpeakableSentence
                sentence={block.correctExample.text}
                highlightedWords={block.correctExample.highlightedWords}
                translationUz={block.correctExample.translation}
              />
            </div>

            <div className="p-3 rounded-xl bg-[#FFEBEE] border border-[#EF9A9A] space-y-1.5">
              <div className="text-xs font-bold text-[#C62828] flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                <span>Xato (Incorrect)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[#EF9A9A] text-sm font-semibold text-[#C62828] line-through">
                {block.incorrectExample.text}
              </div>
              <p className="text-xs text-[#212121]">{block.incorrectExample.reasonUz}</p>
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#F5F6FA] text-xs font-semibold text-[#3949AB]">
            📌 Xulosa: {block.takeawayUz}
          </div>
        </div>
      );

    case 'ImageExample':
      return (
        <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-3">
          <h4 className="text-sm font-bold text-[#212121]">🖼️ {block.titleUz}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {block.cards.map((c, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#F5F6FA] border border-[#E0E4EC] space-y-2.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E0E4EC] flex items-center justify-center text-2xl">
                    {c.emoji}
                  </div>
                  <div>
                    <SpeakableWord word={c.labelEn} translationUz={c.labelUz} />
                  </div>
                </div>
                <HighlightedSpeakableSentence
                  sentence={c.sentenceEn}
                  highlightedWords={[c.highlightedWord]}
                  translationUz={c.sentenceUz}
                />
              </div>
            ))}
          </div>
        </div>
      );

    case 'DialogueBlock':
      return (
        <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-3">
          <div>
            <span className="text-[11px] font-bold uppercase text-[#00897B]">
              💬 Jonli Suhbat (Dialogue)
            </span>
            <h4 className="text-sm font-bold text-[#212121] mt-0.5">{block.titleUz}</h4>
            <p className="text-xs text-[#616161]">{block.contextUz}</p>
          </div>
          <div className="space-y-2.5">
            {block.lines.map((line, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-xs font-bold text-[#3949AB] flex items-center gap-1.5">
                  <span>{line.avatarEmoji}</span>
                  <span>{line.speaker}:</span>
                </div>
                <HighlightedSpeakableSentence
                  sentence={line.english}
                  highlightedWords={line.highlightedWords}
                  translationUz={line.uzbek}
                />
              </div>
            ))}
          </div>
        </div>
      );

    case 'StoryBlock':
      return (
        <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase text-[#3949AB]">
                📖 Qisqa Hikoya (Mini-Story)
              </span>
              <h4 className="text-sm font-bold text-[#212121]">
                {block.titleEn} — {block.titleUz}
              </h4>
            </div>
          </div>
          <div className="space-y-2.5">
            {block.paragraphs.map((p, idx) => (
              <HighlightedSpeakableSentence
                key={idx}
                sentence={p.english}
                highlightedWords={p.highlightedWords}
                translationUz={p.uzbek}
              />
            ))}
          </div>
        </div>
      );

    case 'AudioTextBlock':
      return (
        <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-3">
          <h4 className="text-sm font-bold text-[#212121]">🎧 {block.titleUz}</h4>
          <p className="text-xs text-[#616161]">{block.promptUz}</p>
          <div className="space-y-2">
            {block.items.map((item, idx) => (
              <HighlightedSpeakableSentence
                key={idx}
                sentence={item.text}
                highlightedWords={item.highlightedWords}
                translationUz={item.translation}
                emoji={item.emoji}
              />
            ))}
          </div>
        </div>
      );

    case 'VideoBlock':
      return (
        <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-2">
          <div className="text-xs font-bold text-[#3949AB]">🎬 {block.titleUz}</div>
          <HighlightedSpeakableSentence
            sentence={block.captionEn}
            translationUz={block.captionUz}
          />
        </div>
      );

    case 'AnimationBlock':
      return (
        <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-3">
          <h4 className="text-sm font-bold text-[#212121]">✨ {block.titleUz}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {block.visualSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#F5F6FA] border border-[#E0E4EC] text-center space-y-1.5"
              >
                <div className="text-2xl">{step.emoji}</div>
                <SpeakableWord word={step.labelEn} className="justify-center" />
                <div className="text-[11px] font-semibold text-[#616161]">{step.labelUz}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#616161]">{block.summaryUz}</p>
        </div>
      );

    case 'TipBlock':
      return (
        <div className="p-4 rounded-xl bg-[#E0F2F1] border border-[#80CBC4] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#00695C]">
            <Lightbulb className="w-4 h-4" />
            <span>{block.titleUz}</span>
          </div>
          <p className="text-xs text-[#212121] leading-relaxed">{block.bodyUz}</p>
          {block.exampleEn && (
            <HighlightedSpeakableSentence
              sentence={block.exampleEn}
              translationUz={block.exampleUz}
            />
          )}
        </div>
      );

    case 'WarningBlock':
      return (
        <div className="p-4 rounded-xl bg-[#FFF8E1] border border-[#FFE082] space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F57F17]">
            <AlertTriangle className="w-4 h-4" />
            <span>{block.titleUz}</span>
          </div>
          <p className="text-xs text-[#212121] leading-relaxed">{block.bodyUz}</p>
        </div>
      );

    case 'SummaryBlock':
      return (
        <div className="p-5 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#3949AB]">
            <Award className="w-5 h-5" />
            <span>{block.titleUz}</span>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-[#212121]">✅ Bugun o‘rganganlaringiz:</div>
            {block.learnedPointsUz.map((pt, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-[#F5F6FA] border border-[#E0E4EC] text-xs text-[#212121] flex items-start gap-2"
              >
                <Check className="w-4 h-4 text-[#00897B] shrink-0 mt-0.5" />
                <span>{pt}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-bold text-[#212121]">📌 Asosiy qoidalar eslatmasi:</div>
            {block.keyRulesUz.map((kr, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-[#E8EAF6]/60 text-xs font-semibold text-[#3949AB]"
              >
                • {kr}
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-[#E0F2F1] border border-[#80CBC4] text-xs text-[#00695C] font-medium">
            🚀 Keyingi qadam: {block.nextStepRecommendationUz}
          </div>
        </div>
      );

    case 'ExerciseBlock':
      return (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-[#E8EAF6] border border-[#C5CAE9]">
            <h4 className="text-sm font-bold text-[#3949AB]">{block.titleUz}</h4>
            <p className="text-xs text-[#616161] mt-0.5">{block.subtitleUz}</p>
          </div>
          {block.activities.map((act, idx) => (
            <GuidedActivityCard
              key={act.id}
              subtopicId={subtopicId}
              activity={act}
              index={idx}
              onResultRecorded={onProgressUpdated}
            />
          ))}
        </div>
      );

    case 'AssessmentBlock':
      return (
        <SubtopicAssessmentRenderer
          subtopicId={subtopicId}
          block={block}
          onAssessmentEvaluated={onProgressUpdated}
        />
      );
  }
};
