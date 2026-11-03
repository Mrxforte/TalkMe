import React, { useState, useEffect } from 'react';
import {
  SUBTOPICS_REPOSITORY,
  MAJOR_TOPICS_CATALOG,
} from '../../content/registry/subtopicsCatalog';
import {
  LearnerLevelTier,
  validateSubtopicSafe,
} from '../../content/schemas/subtopicSchemas';
import { SubtopicBlockRenderer } from '../../engines/subtopic-engine/SubtopicBlockRegistry';
import {
  subtopicProgressEngine,
  SubtopicProgressRecord,
} from '../../engines/subtopic-engine/subtopicProgressEngine';
import {
  GlobalTtsControlStrip,
  SpeakableWord,
} from '../../shared/components/speakable/SpeakableComponents';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Target,
  Award,
  AlertCircle,
  Map,
} from 'lucide-react';

interface UniversalSubtopicPlayerProps {
  initialSubtopicId?: string;
  onSubtopicCompleted?: (subtopicId: string) => void;
}

const STAGE_SHORT_LABELS_UZ: Record<number, string> = {
  1: '1. Kirish',
  2: '2. Qoida',
  3: '3. Misollar',
  4: '4. Mashq',
  5: '5. Hayotda',
  6: '6. Sinov',
  7: '7. Xulosa',
};

export const UniversalSubtopicPlayer: React.FC<UniversalSubtopicPlayerProps> = ({
  initialSubtopicId = 'noun_01_what_is_a_noun',
  onSubtopicCompleted,
}) => {
  const { navigate, awardXpAndDiamonds } = useApp();

  const resolvedInitialId = SUBTOPICS_REPOSITORY[initialSubtopicId]
    ? initialSubtopicId
    : 'noun_01_what_is_a_noun';

  const [activeSubtopicId, setActiveSubtopicId] = useState<string>(resolvedInitialId);
  const [activeStageNumber, setActiveStageNumber] = useState<number>(1);
  const [learnerLevel, setLearnerLevel] = useState<LearnerLevelTier>('A0-A1');
  const [presentationMode, setPresentationMode] = useState<'ADULT' | 'KIDS'>('ADULT');
  const [progressRecord, setProgressRecord] = useState<SubtopicProgressRecord>(() =>
    subtopicProgressEngine.getRecord(resolvedInitialId)
  );

  useEffect(() => {
    if (SUBTOPICS_REPOSITORY[initialSubtopicId]) {
      setActiveSubtopicId(initialSubtopicId);
      setActiveStageNumber(1);
    }
  }, [initialSubtopicId]);

  useEffect(() => {
    const rec = subtopicProgressEngine.recordStageVisited(activeSubtopicId, activeStageNumber);
    setProgressRecord({ ...rec });
  }, [activeSubtopicId, activeStageNumber]);

  const refreshProgress = () => {
    setProgressRecord({ ...subtopicProgressEngine.getRecord(activeSubtopicId) });
  };

  const rawSubtopic =
    SUBTOPICS_REPOSITORY[activeSubtopicId] || SUBTOPICS_REPOSITORY.noun_01_what_is_a_noun;
  const validation = validateSubtopicSafe(rawSubtopic);

  if (!validation.success || !validation.data) {
    return (
      <div className="p-5 rounded-xl bg-white border border-[#E0E4EC] text-xs text-[#D32F2F]">
        Ost-mavzu ma’lumotlarini tekshirishda xatolik: {validation.error}
      </div>
    );
  }

  const subtopic = validation.data;
  const currentMajorTopic =
    MAJOR_TOPICS_CATALOG.find((m) => m.id === subtopic.majorTopicId) || MAJOR_TOPICS_CATALOG[0];

  const activeSection =
    subtopic.sections.find((s) => s.stageNumber === activeStageNumber) || subtopic.sections[0];

  const roadmapLevelId = `nouns_level_${subtopic.orderIndex}`;

  const handleCompleteWrapUp = () => {
    const updated = subtopicProgressEngine.completeSubtopicWrapUp(subtopic.id, true);
    setProgressRecord({ ...updated });
    if (updated.isCompleted) {
      confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
      awardXpAndDiamonds(50, 15, roadmapLevelId);
      if (onSubtopicCompleted) {
        onSubtopicCompleted(subtopic.id);
      }
    }
  };

  const allMistakes = [
    ...progressRecord.guidedPracticeMistakes,
    ...progressRecord.assessmentMistakes,
  ];

  const cleanDifficultyLabelUz = subtopic.difficultyLabelUz.replace(
    /^[ABC][0-2](\s*[–-]\s*[ABC][0-2])?\s*·\s*/i,
    ''
  );

  return (
    <div className="space-y-4">
      <GlobalTtsControlStrip />

      {/* 7-Stage Stepper Navigation */}
      <div className="p-2.5 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs">
        <div className="grid grid-cols-7 gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((stageNum) => {
            const isCurrent = activeStageNumber === stageNum;
            const isDone = progressRecord.completedStageNumbers.includes(stageNum);
            return (
              <button
                key={stageNum}
                type="button"
                onClick={() => setActiveStageNumber(stageNum)}
                className={`py-2 px-1 rounded-lg text-center transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-[#3949AB] text-white font-bold shadow-2xs'
                    : isDone
                    ? 'bg-[#E0F2F1] text-[#00897B] font-semibold'
                    : 'bg-[#F5F6FA] text-[#616161] hover:bg-[#E8EAF6]/60'
                }`}
              >
                <div className="text-[10px] sm:text-[11px] truncate">
                  {STAGE_SHORT_LABELS_UZ[stageNum]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage 1 Special Header Card: Subtopic Title, Uzbek Intro, Why Useful, Time & Difficulty */}
      {activeStageNumber === 1 && (
        <div className="p-5 rounded-xl border bg-white border-[#E0E4EC] shadow-2xs space-y-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#3949AB] text-white flex items-center justify-center text-2xl shrink-0">
                {subtopic.iconEmoji}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-[#E8EAF6] text-[#3949AB]">
                    {subtopic.orderIndex}-Daraja · {cleanDifficultyLabelUz}
                  </span>
                  <span className="text-[11px] font-semibold text-[#616161] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#00897B]" />
                    <span>~{subtopic.estimatedMinutes} daqiqa</span>
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <SpeakableWord
                    word={subtopic.title.en}
                    translationUz={subtopic.title.uz}
                    className="text-base"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F5F6FA] border border-[#E0E4EC] space-y-1.5">
            <div className="text-xs font-bold text-[#3949AB]">👋 Xush kelibsiz! (Kirish)</div>
            <p className="text-sm text-[#212121] leading-relaxed">{subtopic.shortIntroUz}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#E0F2F1]/70 border border-[#80CBC4] space-y-1">
            <div className="text-xs font-bold text-[#00695C]">
              💡 Nima uchun bu mavzu real muloqotda muhim?
            </div>
            <p className="text-xs text-[#212121] leading-relaxed">{subtopic.whyUsefulUz}</p>
          </div>

          <div className="space-y-1.5">
            <div className="text-xs font-bold text-[#212121]">
              🎯 Ushbu ost-mavzu yakunida siz quyidagilarni bilib olasiz:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {subtopic.learningObjectivesUz.map((obj, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-[#F5F6FA] border border-[#E0E4EC] text-xs text-[#212121] flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#00897B] shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Stage Title Banner (for Stages 2..7) */}
      {activeStageNumber > 1 && (
        <div className="p-3.5 rounded-xl bg-[#3949AB] text-white flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5CAE9]">
              BOSQICH {activeSection.stageNumber} / 7 · {activeSection.titleEn.toUpperCase()}
            </span>
            <h3 className="text-sm font-bold mt-0.5">{activeSection.titleUz}</h3>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/15">
            {subtopic.orderIndex}-Daraja
          </span>
        </div>
      )}

      {/* Render All Configurable Blocks in Current Stage */}
      <div className="space-y-4">
        {activeSection.blocks.map((rawBlock, idx) => (
          <SubtopicBlockRenderer
            key={idx}
            rawBlock={rawBlock}
            subtopicId={subtopic.id}
            learnerLevel={learnerLevel}
            onProgressUpdated={refreshProgress}
          />
        ))}
      </div>

      {/* Stage 7 Special Wrap-Up Analytics, Mistake Tracker & Unlock Actions */}
      {activeStageNumber === 7 && (
        <div className="p-5 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E0E4EC] pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase text-[#00897B]">
                📊 BILIMLAR HISOBOTI VA KEYINGI DARAJA
              </span>
              <h4 className="text-base font-bold text-[#212121] mt-0.5">
                {subtopic.orderIndex}-Daraja: {subtopic.title.en} ({subtopic.title.uz})
              </h4>
            </div>
            <span
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                progressRecord.isCompleted
                  ? 'bg-[#E0F2F1] text-[#00695C]'
                  : progressRecord.assessmentPassed
                  ? 'bg-[#E8EAF6] text-[#3949AB]'
                  : 'bg-[#FFF8E1] text-[#F57F17]'
              }`}
            >
              {progressRecord.isCompleted
                ? '✓ Daraja Tugallangan'
                : progressRecord.assessmentPassed
                ? 'Sinovdan O‘tgan (Yakunlashga tayyor)'
                : 'Sinovdan o‘tish talab etiladi (6-bosqich)'}
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-[#F5F6FA] border border-[#E0E4EC] text-center">
              <div className="text-[11px] text-[#616161]">Sinov Natijasi</div>
              <div className="text-base font-bold text-[#3949AB] mt-0.5">
                {progressRecord.assessmentBestScorePercent}%
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#F5F6FA] border border-[#E0E4EC] text-center">
              <div className="text-[11px] text-[#616161]">To‘g‘ri Mashqlar</div>
              <div className="text-base font-bold text-[#00897B] mt-0.5">
                {progressRecord.guidedPracticeCorrectCount}/
                {Math.max(1, progressRecord.guidedPracticeTotalCount)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#F5F6FA] border border-[#E0E4EC] text-center">
              <div className="text-[11px] text-[#616161]">O‘zlashtirilgan Birliklar</div>
              <div className="text-base font-bold text-[#212121] mt-0.5">
                {subtopic.knowledgeIds.length} ta
              </div>
            </div>
          </div>

          {/* Mistakes Review if any */}
          {allMistakes.length > 0 && (
            <div className="p-3.5 rounded-xl bg-[#FFF8E1] border border-[#FFE082] space-y-2">
              <div className="text-xs font-bold text-[#F57F17] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Mustahkamlash kerak bo‘lgan savollar ({allMistakes.length} ta):</span>
              </div>
              {allMistakes.map((m, idx) => (
                <div
                  key={`${m.itemId}-${idx}`}
                  className="p-2.5 rounded-lg bg-white border border-[#FFE082] text-xs space-y-1"
                >
                  <div className="font-bold text-[#212121]">{m.promptUz}</div>
                  <div className="text-[#616161]">{m.explanationUz}</div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            {!progressRecord.assessmentPassed ? (
              <button
                type="button"
                onClick={() => setActiveStageNumber(6)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#3949AB] hover:bg-[#283593] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>6-Bosqich (Sinov)ni Topshirish (70%+ talab etiladi)</span>
              </button>
            ) : !progressRecord.isCompleted ? (
              <button
                type="button"
                onClick={handleCompleteWrapUp}
                className="flex-1 py-3 px-4 rounded-xl bg-[#00897B] hover:bg-[#00695C] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Darajani Rasman Tugallash (+50 XP)</span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => navigate('course_levels', { courseId: 'nouns' })}
              className="flex-1 py-3 px-4 rounded-xl bg-[#3949AB] hover:bg-[#283593] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Map className="w-4 h-4" />
              <span>Yo‘l Xaritasida Keyingi Darajaga O‘tish</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => navigate('practice_center')}
              className="py-3 px-4 rounded-xl bg-[#E0F2F1] hover:bg-[#00897B] text-[#00897B] hover:text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Target className="w-4 h-4" />
              <span>Practice Center</span>
            </button>
          </div>
        </div>
      )}

      {/* Stage Footer Navigation (Previous / Next Stage) */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          disabled={activeStageNumber <= 1}
          onClick={() => setActiveStageNumber((s) => Math.max(1, s - 1))}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
            activeStageNumber <= 1
              ? 'bg-[#F5F6FA] text-[#9E9E9E] border-[#E0E4EC] cursor-not-allowed'
              : 'bg-white text-[#212121] border-[#E0E4EC] hover:border-[#3949AB] cursor-pointer'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Oldingi bosqich</span>
        </button>

        <span className="text-xs font-semibold text-[#616161]">
          Bosqich {activeStageNumber} / 7
        </span>

        {activeStageNumber < 7 && (
          <button
            type="button"
            onClick={() => setActiveStageNumber((s) => Math.min(7, s + 1))}
            className="py-2.5 px-5 rounded-xl bg-[#3949AB] hover:bg-[#283593] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <span>Keyingi bosqich</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
