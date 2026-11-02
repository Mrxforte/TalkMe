import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Volume2,
  Mic,
  Sparkles,
  BookOpen,
  Target,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  ContentBlock,
  LessonContent,
  PresentationProfileType,
  validateLessonSafe,
} from '../../content/schemas/contentSchemas';
import { UNIVERSAL_LESSONS_REPOSITORY } from '../../content/registry/universalContentRepository';
import {
  SpeakableSentence,
  SpeakableParagraph,
  SpeakableWord,
  EnglishText,
  SpeakableRichText,
  GlobalTtsControlStrip,
} from '../../shared/components/speakable/SpeakableComponents';
import { speechManager } from '../../engines/tts-engine/speechArchitecture';
import { learningEngine } from '../../engines/knowledge-engine/knowledgeAndPracticeEngine';
import { useApp } from '../../context/AppContext';

export interface UniversalLessonPlayerProps {
  lessonId: string;
  onExit: () => void;
  onOpenPracticeCenter?: (practicePathId?: string) => void;
}

export const UniversalLessonPlayer: React.FC<UniversalLessonPlayerProps> = ({
  lessonId,
  onExit,
  onOpenPracticeCenter,
}) => {
  const { voiceSettings, awardXpAndDiamonds, selectedLevelId } = useApp();
  const rawLesson =
    UNIVERSAL_LESSONS_REPOSITORY[lessonId] || UNIVERSAL_LESSONS_REPOSITORY.lesson_hello_a0;
  const validation = validateLessonSafe(rawLesson);
  const lesson: LessonContent = validation.data || UNIVERSAL_LESSONS_REPOSITORY.lesson_hello_a0;

  const [sectionIdx, setSectionIdx] = useState<number>(0);
  const [profileMode, setProfileMode] = useState<PresentationProfileType>('ADULT');
  const [inlineAnswers, setInlineAnswers] = useState<Record<string, string>>({});
  const [repeatedPhrases, setRepeatedPhrases] = useState<Record<string, boolean>>({});

  const currentSection = lesson.sections[sectionIdx] || lesson.sections[0];
  const totalSections = lesson.sections.length;
  const progressRatio = (sectionIdx + 1) / Math.max(1, totalSections);

  const speak = (text: string) => {
    speechManager.speak({
      text,
      profileId: voiceSettings.selectedCharacterProfile,
      speed: voiceSettings.speechSpeed,
    });
  };

  const handleFinishLesson = (unlockedPracticePathId?: string) => {
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    learningEngine.markLessonCompleted(lesson.id, 100);
    awardXpAndDiamonds(lesson.xpReward, 15, selectedLevelId || lesson.id);
    if (unlockedPracticePathId && onOpenPracticeCenter) {
      onOpenPracticeCenter(unlockedPracticePathId);
    } else {
      onExit();
    }
  };

  const renderBlock = (block: ContentBlock) => {
    switch (block.blockType) {
      case 'introduction':
        return (
          <div
            key={block.id}
            className="p-5 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-[#E8EAF6] border border-[#C5CAE9] flex items-center justify-center text-3xl shrink-0">
                {block.illustrationEmoji}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3949AB] bg-[#E8EAF6] px-2 py-0.5 rounded">
                  KIRISH · {lesson.cefrLevel}
                </span>
                {block.titleEn && (
                  <div className="mt-1">
                    <SpeakableSentence sentence={block.titleEn} />
                  </div>
                )}
              </div>
            </div>

            <div className="text-sm text-[#212121] whitespace-pre-line leading-relaxed">
              <SpeakableRichText content={block.bodyUz} />
            </div>

            {block.highlightPhraseEn && (
              <div className="p-3.5 rounded-xl bg-[#E0F2F1] border border-[#B2DFDB] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00897B]" />
                  <SpeakableWord
                    word={block.highlightPhraseEn}
                    showIcon={true}
                    className="text-sm font-bold text-[#00695C]"
                  />
                </div>
                <span className="text-xs font-semibold text-[#00695C]">Boshladik!</span>
              </div>
            )}
          </div>
        );

      case 'speaking_repeat':
        return (
          <div
            key={block.id}
            className="p-5 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-4"
          >
            <p className="text-sm font-semibold text-[#212121] leading-relaxed">
              {block.situationUz}
            </p>

            <div className="space-y-3">
              {block.phrases.map((ph) => {
                const isRepeated = Boolean(repeatedPhrases[ph.english]);
                return (
                  <div
                    key={ph.english}
                    className="p-4 rounded-xl bg-[#F5F6FA] border border-[#E0E4EC] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{ph.emoji || '🗣️'}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <SpeakableWord
                              word={ph.english}
                              phonetic={ph.phonetic}
                              translationUz={ph.uzbek}
                              className="text-base font-bold"
                            />
                          </div>
                          <p className="text-xs font-semibold text-[#00897B] mt-0.5">
                            {ph.uzbek}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => speak(ph.english)}
                          className="py-2 px-3 rounded-lg bg-[#E8EAF6] text-[#3949AB] hover:bg-[#3949AB] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Eshitish</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            speak(ph.english);
                            setRepeatedPhrases((prev) => ({ ...prev, [ph.english]: true }));
                          }}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isRepeated
                              ? 'bg-[#00897B] text-white'
                              : 'bg-[#3949AB] text-white hover:bg-[#283593]'
                          }`}
                        >
                          <Mic className="w-3.5 h-3.5" />
                          <span>{isRepeated ? 'Aytildi ✓' : 'Takrorlash'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {block.tipUz && (
              <p className="text-xs text-[#616161] bg-[#E8EAF6]/60 p-3 rounded-lg">
                {block.tipUz}
              </p>
            )}
          </div>
        );

      case 'explanation':
        return (
          <div
            key={block.id}
            className="p-5 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-4"
          >
            <h3 className="text-base font-bold text-[#212121]">{block.titleUz}</h3>
            <p className="text-sm text-[#616161] whitespace-pre-line leading-relaxed">
              <SpeakableRichText content={block.explanationUz} />
            </p>

            {block.analogyTitleUz && (
              <div className="p-4 rounded-xl bg-[#E8EAF6] border border-[#C5CAE9] space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3949AB]">
                  {block.analogyTitleUz}
                </h4>
                <p className="text-xs text-[#212121] leading-relaxed">
                  {block.analogyTextUz}
                </p>
              </div>
            )}

            {block.speakableExamples.length > 0 && (
              <div className="space-y-2">
                {block.speakableExamples.map((ex, i) => (
                  <SpeakableSentence
                    key={i}
                    sentence={ex.english}
                    translationUz={ex.uzbek}
                  />
                ))}
              </div>
            )}

            {block.reassuranceTextUz && (
              <div className="p-3 rounded-lg bg-[#E0F2F1] border border-[#B2DFDB] text-xs font-semibold text-[#00695C]">
                <SpeakableRichText content={block.reassuranceTextUz} />
              </div>
            )}
          </div>
        );

      case 'vocabulary_grid':
        return (
          <div
            key={block.id}
            className="p-5 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-4"
          >
            <div>
              <h3 className="text-base font-bold text-[#212121]">{block.titleUz}</h3>
              {block.subtitleUz && (
                <p className="text-xs text-[#616161] mt-0.5">{block.subtitleUz}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {block.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => speak(item.english)}
                  className="p-3.5 rounded-xl bg-[#F5F6FA] border border-[#E0E4EC] hover:border-[#3949AB] transition-all cursor-pointer flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-10 h-10 rounded-lg bg-white border border-[#E0E4EC] flex items-center justify-center text-xl shrink-0">
                      {item.emoji}
                    </span>
                    <div className="min-w-0">
                      <SpeakableWord
                        word={item.english}
                        phonetic={item.phonetic}
                        translationUz={item.uzbek}
                        className="text-sm font-bold"
                      />
                      <p className="text-xs font-semibold text-[#00897B] truncate">
                        {item.uzbek}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(item.exampleEn ? `${item.english}. ${item.exampleEn}` : item.english);
                    }}
                    className="w-8 h-8 rounded-lg bg-[#E8EAF6] text-[#3949AB] flex items-center justify-center hover:bg-[#3949AB] hover:text-white transition-colors shrink-0 cursor-pointer"
                    title="Eshitish"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'grammar_rule':
        return (
          <div
            key={block.id}
            className="p-5 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-4"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3949AB] bg-[#E8EAF6] px-2 py-0.5 rounded">
                GRAMMATIKA QOIDASI
              </span>
              <h3 className="text-base font-bold text-[#212121] mt-1.5">
                {block.ruleNameUz}
              </h3>
            </div>

            {block.formula && (
              <div className="p-3 rounded-lg bg-[#F5F6FA] border border-[#E0E4EC] text-xs font-mono font-bold text-[#3949AB]">
                {block.formula}
              </div>
            )}

            <p className="text-sm text-[#616161] leading-relaxed">
              <SpeakableRichText content={block.explanationUz} />
            </p>

            <div className="space-y-2">
              {block.examples.map((ex, idx) => (
                <SpeakableSentence
                  key={idx}
                  sentence={ex.english}
                  translationUz={ex.uzbek}
                />
              ))}
            </div>
          </div>
        );

      case 'story_passage':
        return (
          <div key={block.id} className="space-y-3">
            {block.paragraphs.map((p, idx) => (
              <SpeakableParagraph
                key={idx}
                titleEn={idx === 0 ? block.titleEn : undefined}
                textEn={p.english}
                translationUz={p.uzbek}
              />
            ))}
          </div>
        );

      case 'conversation_dialogue':
        return (
          <div
            key={block.id}
            className="p-5 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-3"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-[#3949AB]">
              {block.scenarioUz}
            </p>
            {block.turns.map((t, i) => (
              <SpeakableSentence
                key={i}
                sentence={`${t.speaker}: ${t.english}`}
                translationUz={t.uzbek}
              />
            ))}
          </div>
        );

      case 'inline_practice': {
        const selectedId = inlineAnswers[block.id];
        return (
          <div
            key={block.id}
            className="p-5 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-3"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00897B] bg-[#E0F2F1] px-2 py-0.5 rounded">
              DARhol SINAB KO‘RING
            </span>
            <p className="text-sm font-bold text-[#212121]">{block.promptUz}</p>

            {block.promptEn && <SpeakableSentence sentence={block.promptEn} />}

            <div className="space-y-2">
              {block.options.map((opt) => {
                const isSelected = selectedId === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      setInlineAnswers((prev) => ({ ...prev, [block.id]: opt.id }));
                      if (opt.textEn) speak(opt.textEn);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-[#E0F2F1] border-[#00897B] text-[#00695C]'
                          : 'bg-[#FFEBEE] border-[#D32F2F] text-[#D32F2F]'
                        : 'bg-[#F5F6FA] border-[#E0E4EC] text-[#212121]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {opt.textEn && <EnglishText text={opt.textEn} />}
                      {opt.textUz && <span className="text-xs font-semibold">{opt.textUz}</span>}
                    </div>
                    {isSelected && opt.isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-[#00897B]" />
                    )}
                  </div>
                );
              })}
            </div>

            {selectedId && (
              <p className="text-xs font-medium text-[#00695C] bg-[#E0F2F1] p-2.5 rounded-lg">
                {block.explanationUz}
              </p>
            )}
          </div>
        );
      }

      case 'wrap_up':
        return (
          <div
            key={block.id}
            className="p-5 rounded-xl bg-[#3949AB] text-white shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/15 px-2.5 py-1 rounded">
                DARS YAKUNI · +{block.xpReward} XP
              </span>
              <CheckCircle2 className="w-6 h-6 text-[#80CBC4]" />
            </div>

            <h3 className="text-lg font-bold">{block.congratsTitleUz}</h3>

            <ul className="space-y-1.5 text-xs text-[#E8EAF6]">
              {block.summaryPointsUz.map((pt, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span>✓</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => handleFinishLesson(block.unlockedPracticeTopicId)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#00897B] hover:bg-[#00695C] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Target className="w-4 h-4" />
                <span>Darsni Tugatish va Amaliyot Markaziga O‘tish →</span>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Lesson Engine Bar */}
      <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onExit}
            className="w-9 h-9 rounded-lg bg-[#F5F6FA] border border-[#E0E4EC] flex items-center justify-center text-[#212121] hover:bg-[#E8EAF6] hover:text-[#3949AB] cursor-pointer"
            title="Orqaga"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 min-w-0 px-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase text-[#3949AB] bg-[#E8EAF6] px-2 py-0.5 rounded">
                {lesson.cefrLevel} · Universal Lesson Engine
              </span>
              <button
                type="button"
                onClick={() =>
                  setProfileMode((p) => (p === 'ADULT' ? 'KIDS' : 'ADULT'))
                }
                className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#E0F2F1] text-[#00897B] cursor-pointer"
              >
                Rejim: {profileMode === 'KIDS' ? 'Bolalar (Kids)' : 'Kattalar (Adult)'}
              </button>
            </div>
            <h2
              className={`font-bold text-[#212121] truncate mt-1 ${
                profileMode === 'KIDS' ? 'text-base' : 'text-sm'
              }`}
            >
              {lesson.titleUz}
            </h2>
          </div>

          <span className="text-xs font-bold text-[#3949AB] shrink-0">
            {sectionIdx + 1} / {totalSections}
          </span>
        </div>

        {/* Section Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#E8EAF6] overflow-hidden">
          <div
            className="h-full bg-[#3949AB] transition-all duration-300"
            style={{ width: `${Math.round(progressRatio * 100)}%` }}
          />
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {lesson.sections.map((sec, i) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setSectionIdx(i)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                i === sectionIdx
                  ? 'bg-[#3949AB] text-white'
                  : 'bg-[#F5F6FA] text-[#616161] hover:text-[#212121]'
              }`}
            >
              {sec.titleUz}
            </button>
          ))}
        </div>
      </div>

      {/* Global Freemium TTS Controls */}
      <GlobalTtsControlStrip />

      {/* Current Section Content Blocks */}
      <div className={`space-y-4 ${profileMode === 'KIDS' ? 'text-base' : 'text-sm'}`}>
        {currentSection.blocks.map((block) => renderBlock(block))}
      </div>

      {/* Section Navigation Footer */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          disabled={sectionIdx === 0}
          onClick={() => setSectionIdx((i) => Math.max(0, i - 1))}
          className="py-3 px-4 rounded-xl bg-white border border-[#E0E4EC] text-[#212121] font-semibold text-xs flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Oldingi bo‘lim</span>
        </button>

        {sectionIdx + 1 < totalSections ? (
          <button
            type="button"
            onClick={() => setSectionIdx((i) => Math.min(totalSections - 1, i + 1))}
            className="flex-1 py-3 px-5 rounded-xl bg-[#3949AB] hover:bg-[#283593] text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Keyingi bo‘lim ({sectionIdx + 2}/{totalSections})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleFinishLesson()}
            className="flex-1 py-3 px-5 rounded-xl bg-[#00897B] hover:bg-[#00695C] text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <BookOpen className="w-4 h-4" />
            <span>Darsni Yakunlash (+{lesson.xpReward} XP)</span>
          </button>
        )}
      </div>
    </div>
  );
};
