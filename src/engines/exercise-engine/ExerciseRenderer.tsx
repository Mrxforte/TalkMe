import React, { useState, useEffect } from 'react';
import { Volume2, Mic, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { ExerciseInstance } from '../../content/schemas/contentSchemas';
import {
  getExerciseTemplateSafe,
  evaluateExerciseSubmission,
} from './exerciseRegistry';
import {
  SpeakableSentence,
  SpeakableParagraph,
  SpeakableWord,
  EnglishText,
} from '../../shared/components/speakable/SpeakableComponents';
import { speechManager } from '../tts-engine/speechArchitecture';
import { useApp } from '../../context/AppContext';

export interface ExerciseRendererProps {
  exercise: ExerciseInstance;
  onComplete: (result: {
    isCorrect: boolean;
    score: number;
    feedbackUz: string;
  }) => void;
}

export const ExerciseRenderer: React.FC<ExerciseRendererProps> = ({
  exercise,
  onComplete,
}) => {
  const { voiceSettings } = useApp();
  const template = getExerciseTemplateSafe(exercise.templateCode || exercise.templateNumber);
  const primitive = template.primitive;
  const payload = exercise.payload || {};

  // Shared state across primitives
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [typedInput, setTypedInput] = useState<string>('');
  const [orderedTokens, setOrderedTokens] = useState<string[]>([]);
  const [matchedLeftIds, setMatchedLeftIds] = useState<string[]>([]);
  const [activeLeftId, setActiveLeftId] = useState<string | null>(null);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [flashcardRevealed, setFlashcardRevealed] = useState<boolean>(false);
  const [speakingRecorded, setSpeakingRecorded] = useState<boolean>(false);
  const [submittedResult, setSubmittedResult] = useState<{
    isCorrect: boolean;
    score: number;
    feedbackUz: string;
    correctAnswerDisplay: string;
  } | null>(null);

  useEffect(() => {
    setSelectedOptionId('');
    setTypedInput('');
    setOrderedTokens([]);
    setMatchedLeftIds([]);
    setActiveLeftId(null);
    setCategoryMap({});
    setFlashcardRevealed(false);
    setSpeakingRecorded(false);
    setSubmittedResult(null);
  }, [exercise.id]);

  const speakText = (text: string) => {
    speechManager.speak({
      text,
      profileId: voiceSettings.selectedCharacterProfile,
      speed: voiceSettings.speechSpeed,
    });
  };

  const handleCheckAnswer = (overrideValue?: unknown) => {
    let userResponse: unknown = overrideValue;
    if (userResponse === undefined) {
      if (primitive === 'multiple_choice' || primitive === 'reading_comprehension') {
        userResponse = selectedOptionId;
      } else if (primitive === 'gap_fill_typing' || primitive === 'word_puzzle_grid') {
        userResponse = typedInput;
      } else if (primitive === 'sequence_ordering') {
        userResponse = orderedTokens;
      } else if (primitive === 'matching_pairs') {
        userResponse = matchedLeftIds.length;
      } else if (primitive === 'categorization') {
        userResponse = categoryMap;
      } else if (primitive === 'audio_listening') {
        const mode = (payload.listenMode as 'choice' | 'typing') || 'choice';
        userResponse = mode === 'typing' ? typedInput : selectedOptionId;
      } else {
        userResponse = 100;
      }
    }

    const evaluation = evaluateExerciseSubmission(primitive, payload, userResponse);
    setSubmittedResult(evaluation);
  };

  const handleContinue = () => {
    if (!submittedResult) return;
    onComplete({
      isCorrect: submittedResult.isCorrect,
      score: submittedResult.score,
      feedbackUz: submittedResult.feedbackUz,
    });
  };

  const handleRetryCurrent = () => {
    setSubmittedResult(null);
  };

  return (
    <div className="space-y-4">
      {/* Exercise Template Header */}
      <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#3949AB] bg-[#E8EAF6] px-2.5 py-0.5 rounded-md">
            #{template.number} · {template.nameEn}
          </span>
          <span className="text-xs font-semibold text-[#00897B]">
            Min ball: {exercise.requiredScore}%
          </span>
        </div>

        <h3 className="text-base font-bold text-[#212121]">{exercise.titleUz}</h3>
        <p className="text-xs text-[#616161] leading-relaxed">{exercise.instructionUz}</p>

        {exercise.instructionEn && (
          <SpeakableSentence sentence={exercise.instructionEn} />
        )}
      </div>

      {/* =================================================================
          PRIMITIVE 1 & 7: MULTIPLE CHOICE & READING COMPREHENSION
         ================================================================= */}
      {(primitive === 'multiple_choice' || primitive === 'reading_comprehension') && (
        <div className="space-y-3">
          {Boolean(payload.passageEn) && (
            <SpeakableParagraph
              titleEn={String(payload.passageTitleEn || 'Reading Passage')}
              textEn={String(payload.passageEn)}
              translationUz={payload.passageUz ? String(payload.passageUz) : undefined}
            />
          )}

          {Boolean(payload.promptEn) && (
            <SpeakableSentence
              sentence={String(payload.promptEn)}
              translationUz={payload.promptUz ? String(payload.promptUz) : undefined}
            />
          )}

          {Boolean(payload.promptUz && !payload.promptEn) && (
            <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] text-sm font-bold text-[#212121]">
              {String(payload.promptUz)}
            </div>
          )}

          <div className="space-y-2">
            {((payload.options as Array<{ id: string; text: string; isCorrect: boolean }>) || []).map(
              (opt, idx) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      if (submittedResult) return;
                      setSelectedOptionId(opt.id);
                      if (/^[a-zA-Z0-9\s.,?!'-]+$/.test(opt.text)) {
                        speakText(opt.text);
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#E8EAF6] border-[#3949AB] text-[#3949AB]'
                        : 'bg-white border-[#E0E4EC] text-[#212121] hover:border-[#3949AB]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#3949AB] text-white'
                            : 'bg-[#F5F6FA] text-[#616161] border border-[#E0E4EC]'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm font-semibold">{opt.text}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakText(opt.text);
                      }}
                      className="w-8 h-8 rounded-lg bg-[#F5F6FA] text-[#3949AB] flex items-center justify-center hover:bg-[#3949AB] hover:text-white transition-colors shrink-0 cursor-pointer"
                      title="Variantni eshitish (TTS)"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* =================================================================
          PRIMITIVE 2: MATCHING PAIRS (Picture/Word/Translation/Rule)
         ================================================================= */}
      {primitive === 'matching_pairs' && (
        <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] space-y-3">
          <p className="text-xs font-semibold text-[#616161]">
            Chap ustundagi inglizcha so‘zni bosing va o‘ng ustundan mos juftlikni tanlang:
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              {((payload.pairs as Array<{ id: string; left: string; right: string }>) || []).map(
                (pair) => {
                  const isMatched = matchedLeftIds.includes(pair.id);
                  const isSelected = activeLeftId === pair.id;
                  return (
                    <button
                      key={pair.id}
                      type="button"
                      disabled={isMatched}
                      onClick={() => {
                        setActiveLeftId(pair.id);
                        speakText(pair.left);
                      }}
                      className={`w-full p-3 rounded-lg border text-left text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        isMatched
                          ? 'bg-[#E0F2F1] border-[#00897B] text-[#00897B] opacity-75'
                          : isSelected
                          ? 'bg-[#3949AB] border-[#3949AB] text-white'
                          : 'bg-[#F5F6FA] border-[#E0E4EC] text-[#212121] hover:border-[#3949AB]'
                      }`}
                    >
                      <span>{pair.left}</span>
                      <Volume2 className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  );
                }
              )}
            </div>

            <div className="space-y-2">
              {((payload.pairs as Array<{ id: string; left: string; right: string }>) || []).map(
                (pair) => {
                  const isMatched = matchedLeftIds.includes(pair.id);
                  return (
                    <button
                      key={`${pair.id}-right`}
                      type="button"
                      disabled={isMatched}
                      onClick={() => {
                        if (!activeLeftId) return;
                        if (activeLeftId === pair.id) {
                          const next = [...matchedLeftIds, pair.id];
                          setMatchedLeftIds(next);
                          setActiveLeftId(null);
                          const allPairs = (payload.pairs as Array<{ id: string }>) || [];
                          if (next.length === allPairs.length) {
                            handleCheckAnswer(next.length);
                          }
                        } else {
                          setActiveLeftId(null);
                        }
                      }}
                      className={`w-full p-3 rounded-lg border text-left text-xs font-semibold transition-all cursor-pointer ${
                        isMatched
                          ? 'bg-[#E0F2F1] border-[#00897B] text-[#00897B] opacity-75'
                          : 'bg-white border-[#E0E4EC] text-[#212121] hover:border-[#3949AB]'
                      }`}
                    >
                      {pair.right}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          PRIMITIVE 3 & 10: GAP FILL TYPING & WORD PUZZLE GRID
         ================================================================= */}
      {(primitive === 'gap_fill_typing' || primitive === 'word_puzzle_grid') && (
        <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] space-y-3">
          {Boolean(payload.sentenceTemplateEn) && (
            <SpeakableSentence
              sentence={String(payload.sentenceTemplateEn)}
              translationUz={payload.promptUz ? String(payload.promptUz) : undefined}
            />
          )}

          {Boolean(payload.clueUz) && (
            <p className="text-xs font-semibold text-[#3949AB] bg-[#E8EAF6] p-2.5 rounded-lg">
              Maslahat / Izoh: {String(payload.clueUz)}
            </p>
          )}

          {Array.isArray(payload.hintWords) && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-[#616161] font-medium">Yordamchi so‘zlar:</span>
              {(payload.hintWords as string[]).map((hw) => (
                <SpeakableWord
                  key={hw}
                  word={hw}
                  showIcon={true}
                  className="bg-[#F5F6FA] text-xs"
                />
              ))}
            </div>
          )}

          <input
            type="text"
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            placeholder="Inglizcha javobni yozing..."
            className="w-full p-3.5 rounded-xl bg-[#F5F6FA] border border-[#E0E4EC] text-sm font-bold text-[#212121] focus:outline-none focus:border-[#3949AB]"
          />
        </div>
      )}

      {/* =================================================================
          PRIMITIVE 4: SEQUENCE ORDERING (Sentence / Word / Paragraph Builder)
         ================================================================= */}
      {primitive === 'sequence_ordering' && (
        <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] space-y-3">
          {Boolean(payload.promptUz) && (
            <p className="text-sm font-bold text-[#212121]">{String(payload.promptUz)}</p>
          )}

          {/* Assembled output box */}
          <div className="min-h-14 p-3 rounded-xl bg-[#F5F6FA] border border-[#E0E4EC] flex flex-wrap items-center gap-2">
            {orderedTokens.length === 0 ? (
              <span className="text-xs text-[#9E9E9E]">
                Quyidagi bo‘laklarni ketma-ket bosing...
              </span>
            ) : (
              orderedTokens.map((tok, i) => (
                <button
                  key={`${tok}-${i}`}
                  type="button"
                  onClick={() =>
                    setOrderedTokens((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  className="px-3 py-1.5 rounded-lg bg-[#3949AB] text-white text-xs font-bold cursor-pointer"
                >
                  {tok} ✕
                </button>
              ))
            )}
          </div>

          {/* Available token bank */}
          <div className="flex flex-wrap gap-2">
            {((payload.tokens as string[]) || (payload.correctSequence as string[]) || []).map(
              (tok, idx) => {
                const usedCount = orderedTokens.filter((t) => t === tok).length;
                const totalAvailable = (
                  (payload.tokens as string[]) ||
                  (payload.correctSequence as string[]) ||
                  []
                ).filter((t) => t === tok).length;
                const isExhausted = usedCount >= totalAvailable;

                return (
                  <button
                    key={`${tok}-${idx}`}
                    type="button"
                    disabled={isExhausted}
                    onClick={() => {
                      speakText(tok);
                      setOrderedTokens((prev) => [...prev, tok]);
                    }}
                    className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      isExhausted
                        ? 'bg-[#F5F6FA] border-[#E0E4EC] text-[#9E9E9E] opacity-40'
                        : 'bg-white border-[#C5CAE9] text-[#3949AB] hover:bg-[#E8EAF6]'
                    }`}
                  >
                    {tok}
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* =================================================================
          PRIMITIVE 5: CATEGORIZATION (Word / Grammar Classification)
         ================================================================= */}
      {primitive === 'categorization' && (
        <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] space-y-3">
          <div className="space-y-2">
            {(
              (payload.items as Array<{ id: string; label: string; categoryId: string }>) || []
            ).map((item) => {
              const categories = (payload.categories as Array<{ id: string; title: string }>) || [];
              const assigned = categoryMap[item.id];
              return (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-[#F5F6FA] border border-[#E0E4EC] flex flex-wrap items-center justify-between gap-2"
                >
                  <EnglishText text={item.label} />
                  <div className="flex items-center gap-1.5">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() =>
                          setCategoryMap((prev) => ({ ...prev, [item.id]: cat.id }))
                        }
                        className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                          assigned === cat.id
                            ? 'bg-[#3949AB] text-white'
                            : 'bg-white border border-[#E0E4EC] text-[#616161]'
                        }`}
                      >
                        {cat.title}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =================================================================
          PRIMITIVE 6: FLASHCARD RECALL
         ================================================================= */}
      {primitive === 'flashcard_recall' && (
        <div className="p-5 rounded-xl bg-white border border-[#E0E4EC] text-center space-y-4">
          <div className="py-3">
            <SpeakableSentence sentence={String(payload.frontEn || 'Hello!')} />
          </div>

          {!flashcardRevealed ? (
            <button
              type="button"
              onClick={() => setFlashcardRevealed(true)}
              className="w-full py-3 rounded-xl bg-[#E8EAF6] text-[#3949AB] font-semibold text-xs cursor-pointer"
            >
              Tarjima va misolni ko‘rish
            </button>
          ) : (
            <div className="space-y-3 pt-2 border-t border-[#E0E4EC]">
              <p className="text-lg font-bold text-[#00897B]">{String(payload.backUz || '')}</p>
              {Boolean(payload.exampleEn) && (
                <SpeakableSentence sentence={String(payload.exampleEn)} />
              )}
              <button
                type="button"
                onClick={() => handleCheckAnswer(100)}
                className="w-full py-3 rounded-xl bg-[#00897B] text-white font-semibold text-xs cursor-pointer"
              >
                Eslab qoldim (+100%)
              </button>
            </div>
          )}
        </div>
      )}

      {/* =================================================================
          PRIMITIVE 8: AUDIO LISTENING (Listen & Choose / Dictation / Numbers)
         ================================================================= */}
      {primitive === 'audio_listening' && (
        <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] space-y-4">
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#E8EAF6] border border-[#C5CAE9] space-y-2">
            <button
              type="button"
              onClick={() => speakText(String(payload.audioText || payload.correctAnswer || ''))}
              className="py-3 px-5 rounded-xl bg-[#3949AB] text-white font-semibold text-xs flex items-center gap-2 hover:bg-[#283593] transition-colors cursor-pointer shadow-xs"
            >
              <Volume2 className="w-4 h-4" />
              <span>Audioni Tinglash (TTS)</span>
            </button>
            <span className="text-[11px] text-[#3949AB] font-medium">
              Istalgancha qayta eshitishingiz mumkin
            </span>
          </div>

          {(payload.listenMode as string) === 'typing' ? (
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="Eshitgan inglizcha so‘z yoki gapni yozing..."
              className="w-full p-3.5 rounded-xl bg-[#F5F6FA] border border-[#E0E4EC] text-sm font-bold text-[#212121] focus:outline-none focus:border-[#3949AB]"
            />
          ) : (
            <div className="space-y-2">
              {(
                (payload.options as Array<{ id: string; text: string; isCorrect: boolean }>) || []
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`w-full p-3.5 rounded-xl border text-left text-sm font-semibold transition-all cursor-pointer ${
                    selectedOptionId === opt.id
                      ? 'bg-[#E8EAF6] border-[#3949AB] text-[#3949AB]'
                      : 'bg-[#F5F6FA] border-[#E0E4EC] text-[#212121]'
                  }`}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =================================================================
          PRIMITIVE 9: SPEAKING PRONUNCIATION
         ================================================================= */}
      {primitive === 'speaking_pronunciation' && (
        <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] space-y-4">
          <SpeakableSentence
            sentence={String(payload.targetPhraseEn || 'Hello! Welcome to TalkMe!')}
            translationUz={payload.targetPhraseUz ? String(payload.targetPhraseUz) : undefined}
          />

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => speakText(String(payload.targetPhraseEn || 'Hello!'))}
              className="py-3 px-4 rounded-xl bg-[#E8EAF6] text-[#3949AB] font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Namuna eshitish</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSpeakingRecorded(true);
                handleCheckAnswer(95);
              }}
              className={`py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                speakingRecorded
                  ? 'bg-[#00897B] text-white'
                  : 'bg-[#3949AB] text-white hover:bg-[#283593]'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{speakingRecorded ? 'Talaffuz qabul qilindi ✓' : 'Ovoz chiqarib aytish'}</span>
            </button>
          </div>
        </div>
      )}

      {/* =================================================================
          SUBMISSION FEEDBACK & ACTION FOOTER
         ================================================================= */}
      {submittedResult ? (
        <div
          className={`p-4 rounded-xl border space-y-3 ${
            submittedResult.isCorrect
              ? 'bg-[#E0F2F1] border-[#00897B]/40 text-[#00695C]'
              : 'bg-[#FFEBEE] border-[#D32F2F]/40 text-[#D32F2F]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {submittedResult.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-[#00897B]" />
              ) : (
                <XCircle className="w-5 h-5 text-[#D32F2F]" />
              )}
              <span className="text-sm font-bold">
                {submittedResult.isCorrect
                  ? `To‘g‘ri! Ball: ${submittedResult.score}%`
                  : `Natija: ${submittedResult.score}% (Kerakli: ${exercise.requiredScore}%)`}
              </span>
            </div>

            {submittedResult.correctAnswerDisplay && (
              <EnglishText text={submittedResult.correctAnswerDisplay} />
            )}
          </div>

          <p className="text-xs leading-relaxed">{submittedResult.feedbackUz}</p>

          <div className="flex items-center gap-2 pt-1">
            {!submittedResult.isCorrect && (
              <button
                type="button"
                onClick={handleRetryCurrent}
                className="flex-1 py-2.5 px-4 rounded-lg bg-white border border-[#D32F2F]/40 text-[#D32F2F] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Qayta urinish</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleContinue}
              className="flex-1 py-2.5 px-4 rounded-lg bg-[#3949AB] hover:bg-[#283593] text-white text-xs font-semibold cursor-pointer"
            >
              Davom etish →
            </button>
          </div>
        </div>
      ) : (
        primitive !== 'matching_pairs' &&
        primitive !== 'flashcard_recall' && (
          <button
            type="button"
            onClick={() => handleCheckAnswer()}
            className="w-full py-3.5 px-5 rounded-xl bg-[#3949AB] hover:bg-[#283593] text-white font-semibold text-sm transition-colors cursor-pointer shadow-xs"
          >
            Javobni Tekshirish
          </button>
        )
      )}
    </div>
  );
};
