import React, { useState } from 'react';
import {
  Target,
  Lock,
  CheckCircle2,
  Play,
  Layers,
  Sparkles,
  Shuffle,
  Brain,
  Search,
  ArrowLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { TalkMeHeader } from '../../components/TalkMeHeader';
import { TalkMeBottomBar } from '../../components/TalkMeBottomBar';
import { TalkMeBadge } from '../../components/TalkMeBadge';
import { PRACTICE_PATHS_REPOSITORY } from '../../content/registry/universalContentRepository';
import {
  learningEngine,
  knowledgeTracker,
  PracticeSelectionMode,
} from '../../engines/knowledge-engine/knowledgeAndPracticeEngine';
import {
  getAllRegisteredExerciseTemplates,
  ExerciseTemplateDefinition,
} from '../../engines/exercise-engine/exerciseRegistry';
import { ExerciseRenderer } from '../../engines/exercise-engine/ExerciseRenderer';
import { ExerciseInstance, SkillDomain } from '../../content/schemas/contentSchemas';
import { GlobalTtsControlStrip } from '../../shared/components/speakable/SpeakableComponents';

export const PracticeCenterScreen: React.FC = () => {
  const { navigate, goBack, awardXpAndDiamonds } = useApp();

  const [activeTab, setActiveTab] = useState<'paths' | 'library110' | 'knowledge'>('paths');
  const [selectedPathId, setSelectedPathId] = useState<string>('practice_path_nouns');
  const [practiceMode, setPracticeMode] = useState<PracticeSelectionMode>('FIXED_PATH');
  const [activeExercise, setActiveExercise] = useState<ExerciseInstance | null>(null);
  const [libraryFilter, setLibraryFilter] = useState<SkillDomain | 'all'>('all');
  const [librarySearch, setLibrarySearch] = useState<string>('');
  const [, setRefreshTick] = useState<number>(0);

  const allPaths = Object.values(PRACTICE_PATHS_REPOSITORY);
  const currentPath =
    PRACTICE_PATHS_REPOSITORY[selectedPathId] || PRACTICE_PATHS_REPOSITORY.practice_path_nouns;
  const pathNodes = learningEngine.getPracticePathNodesState(currentPath.id);
  const domainSummary = knowledgeTracker.getDomainMasterySummary();

  const all110Templates = getAllRegisteredExerciseTemplates().filter((t) => {
    if (libraryFilter !== 'all' && t.category !== libraryFilter) return false;
    if (!librarySearch.trim()) return true;
    const q = librarySearch.toLowerCase();
    return (
      t.nameEn.toLowerCase().includes(q) ||
      t.nameUz.toLowerCase().includes(q) ||
      String(t.number).includes(q)
    );
  });

  const handleLaunchTemplateDemo = (tpl: ExerciseTemplateDefinition) => {
    // Build a live functional exercise instance for the selected template from the 110 registry
    const matchingExisting = allPaths
      .flatMap((p) => p.exercises)
      .find((e) => e.templateNumber === tpl.number || e.templateCode === tpl.code);

    if (matchingExisting) {
      setActiveExercise(matchingExisting);
      return;
    }

    const demoInstance: ExerciseInstance = {
      id: `demo_${tpl.code}`,
      templateNumber: tpl.number,
      templateCode: tpl.code,
      titleEn: `${tpl.number}. ${tpl.nameEn}`,
      titleUz: `#${tpl.number} ${tpl.nameUz}`,
      instructionUz: `${tpl.nameUz} (${tpl.nameEn}) shabloni bo‘yicha amaliy mashqni bajaring:`,
      instructionEn: 'Practice makes your English clear and confident.',
      skillDomain: tpl.category,
      cefrLevel: 'A1',
      difficulty: 1,
      requiredScore: 75,
      minimumAttempts: 1,
      maxRetries: 3,
      prerequisites: [],
      knowledgeIds: ['kw_noun_book'],
      xpReward: 20,
      payload:
        tpl.primitive === 'matching_pairs'
          ? {
              pairs: [
                { id: 'p1', left: 'Book', right: 'Kitob' },
                { id: 'p2', left: 'City', right: 'Shahar' },
                { id: 'p3', left: 'Hello', right: 'Salom' },
              ],
            }
          : tpl.primitive === 'sequence_ordering'
          ? {
              promptUz: 'Inglizcha gapni to‘g‘ri tartibda tering:',
              tokens: ['happy', 'I', 'am'],
              correctSequence: ['I', 'am', 'happy'],
            }
          : tpl.primitive === 'categorization'
          ? {
              categories: [
                { id: 'person', title: 'Person' },
                { id: 'thing', title: 'Thing' },
              ],
              items: [
                { id: '1', label: 'Teacher', categoryId: 'person' },
                { id: '2', label: 'Book', categoryId: 'thing' },
              ],
            }
          : tpl.primitive === 'gap_fill_typing' || tpl.primitive === 'word_puzzle_grid'
          ? {
              sentenceTemplateEn: 'She reads a good ___ (book) every day.',
              promptUz: 'Bo‘sh joyga "book" so‘zini yozing:',
              hintWords: ['book', 'books'],
              correctAnswer: 'book',
              acceptedAnswers: ['book'],
            }
          : tpl.primitive === 'audio_listening'
          ? {
              listenMode: 'choice',
              audioText: 'Welcome to TalkMe English learning platform.',
              options: [
                {
                  id: 'a',
                  text: 'Welcome to TalkMe English learning platform.',
                  isCorrect: true,
                },
                { id: 'b', text: 'Goodbye, see you tomorrow.', isCorrect: false },
              ],
            }
          : tpl.primitive === 'speaking_pronunciation'
          ? {
              targetPhraseEn: 'I am learning English step by step.',
              targetPhraseUz: 'Men ingliz tilini bosqichma-bosqich o‘rganyapman.',
            }
          : tpl.primitive === 'flashcard_recall'
          ? {
              frontEn: 'Welcome!',
              backUz: 'Xush kelibsiz!',
              exampleEn: 'Welcome to our English class!',
            }
          : {
              promptEn: 'Which word is a Noun (person, place, or thing)?',
              promptUz: 'Qaysi so‘z Ot (Noun) hisoblanadi?',
              options: [
                { id: 'a', text: 'Book (Kitob)', isCorrect: true },
                { id: 'b', text: 'Quickly (Tez)', isCorrect: false },
                { id: 'c', text: 'Happy (Xursand)', isCorrect: false },
              ],
            },
    };
    setActiveExercise(demoInstance);
  };

  // Dedicated full-screen Exercise Player when an exercise is active
  if (activeExercise) {
    return (
      <div className="min-h-screen bg-[#F5F6FA] pb-20 text-[#212121]">
        <div className="max-w-md mx-auto px-4 sm:px-5 pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveExercise(null)}
              className="w-10 h-10 rounded-xl bg-white border border-[#E0E4EC] flex items-center justify-center text-[#212121] hover:bg-[#E8EAF6] hover:text-[#3949AB] cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-center flex-1 px-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3949AB]">
                PRACTICE CENTER · {practiceMode}
              </span>
              <h1 className="text-sm font-bold text-[#212121] truncate">
                {currentPath.titleUz}
              </h1>
            </div>
            <TalkMeBadge
              text={`+${activeExercise.xpReward} XP`}
              containerColor="bg-[#E0F2F1]"
              textColor="text-[#00897B]"
            />
          </div>

          <GlobalTtsControlStrip />

          <ExerciseRenderer
            exercise={activeExercise}
            onComplete={(res) => {
              const submission = learningEngine.recordExerciseSubmission(
                currentPath.id,
                activeExercise.id,
                res.score
              );
              if (submission.passed) {
                confetti({ particleCount: 55, spread: 70, origin: { y: 0.6 } });
                awardXpAndDiamonds(activeExercise.xpReward, 10, activeExercise.id);
              }
              setRefreshTick((t) => t + 1);
              setActiveExercise(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-24 text-[#212121]">
      <div className="max-w-md mx-auto px-4 sm:px-5 pt-4 space-y-4">
        <TalkMeHeader
          title="Amaliyot Markazi (Practice Center)"
          subtitle="Mavzular bo‘yicha ketma-ket ochiluvchi mashqlar va 110 shablon"
          onBackClick={goBack}
        />

        <GlobalTtsControlStrip />

        {/* Top Section Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-white border border-[#E0E4EC]">
          <button
            type="button"
            onClick={() => setActiveTab('paths')}
            className={`py-2 px-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'paths'
                ? 'bg-[#3949AB] text-white'
                : 'text-[#616161] hover:text-[#212121]'
            }`}
          >
            Amaliyot Yo‘llari
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('library110')}
            className={`py-2 px-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'library110'
                ? 'bg-[#3949AB] text-white'
                : 'text-[#616161] hover:text-[#212121]'
            }`}
          >
            110 Mashq Turi
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('knowledge')}
            className={`py-2 px-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'knowledge'
                ? 'bg-[#3949AB] text-white'
                : 'text-[#616161] hover:text-[#212121]'
            }`}
          >
            Knowledge Tracker
          </button>
        </div>

        {/* =================================================================
            TAB 1: SEQUENTIAL PRACTICE PATHS & 3 PRACTICE MODES
           ================================================================= */}
        {activeTab === 'paths' && (
          <div className="space-y-4">
            {/* Topic Practice Path Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {allPaths.map((p) => {
                const isSelected = p.id === currentPath.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPathId(p.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold whitespace-nowrap flex items-center gap-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#3949AB] border-[#3949AB] text-white shadow-2xs'
                        : 'bg-white border-[#E0E4EC] text-[#212121] hover:border-[#3949AB]'
                    }`}
                  >
                    <span>{p.iconEmoji}</span>
                    <span>{p.titleEn}</span>
                  </button>
                );
              })}
            </div>

            {/* 3 Practice Modes Selector: Fixed Path / Adaptive / Random */}
            <div className="p-3.5 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#3949AB]">
                  Mashq Tanlash Rejimi (3 Modes)
                </span>
                <span className="text-[11px] font-semibold text-[#00897B]">
                  {currentPath.cefrLevel} daraja
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPracticeMode('FIXED_PATH')}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 cursor-pointer ${
                    practiceMode === 'FIXED_PATH'
                      ? 'bg-[#E8EAF6] border-[#3949AB] text-[#3949AB]'
                      : 'bg-[#F5F6FA] border-[#E0E4EC] text-[#616161]'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Fixed Path</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPracticeMode('ADAPTIVE_PRACTICE');
                    const adaptiveList = learningEngine.selectExercisesForMode(
                      'ADAPTIVE_PRACTICE',
                      currentPath.id
                    );
                    if (adaptiveList[0]) setActiveExercise(adaptiveList[0]);
                  }}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 cursor-pointer ${
                    practiceMode === 'ADAPTIVE_PRACTICE'
                      ? 'bg-[#E0F2F1] border-[#00897B] text-[#00897B]'
                      : 'bg-[#F5F6FA] border-[#E0E4EC] text-[#616161]'
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  <span>Adaptive AI</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPracticeMode('RANDOM_PRACTICE');
                    const randomList = learningEngine.selectExercisesForMode(
                      'RANDOM_PRACTICE',
                      currentPath.id
                    );
                    if (randomList[0]) setActiveExercise(randomList[0]);
                  }}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 cursor-pointer ${
                    practiceMode === 'RANDOM_PRACTICE'
                      ? 'bg-[#E8EAF6] border-[#3949AB] text-[#3949AB]'
                      : 'bg-[#F5F6FA] border-[#E0E4EC] text-[#616161]'
                  }`}
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Random Mix</span>
                </button>
              </div>
            </div>

            {/* Sequential Unlocking Path List */}
            <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-3">
              <div>
                <h3 className="text-base font-bold text-[#212121]">{currentPath.titleUz}</h3>
                <p className="text-xs text-[#616161] mt-0.5">{currentPath.descriptionUz}</p>
              </div>

              <div className="space-y-2.5 pt-1">
                {pathNodes.map(({ exercise, progress }, idx) => {
                  const isUnlocked = progress.unlocked;
                  const isCompleted = progress.completed;

                  return (
                    <div
                      key={exercise.id}
                      onClick={() => {
                        if (isUnlocked) {
                          setActiveExercise(exercise);
                        }
                      }}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isCompleted
                          ? 'bg-[#E0F2F1]/50 border-[#00897B] cursor-pointer'
                          : isUnlocked
                          ? 'bg-[#E8EAF6]/60 border-[#3949AB] cursor-pointer hover:bg-[#E8EAF6]'
                          : 'bg-[#F5F6FA] border-[#E0E4EC] opacity-65 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                            isCompleted
                              ? 'bg-[#00897B] text-white'
                              : isUnlocked
                              ? 'bg-[#3949AB] text-white'
                              : 'bg-white border border-[#E0E4EC] text-[#9E9E9E]'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : isUnlocked ? (
                            idx + 1
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase text-[#3949AB]">
                              #{exercise.templateNumber} · {exercise.skillDomain}
                            </span>
                            {progress.bestScore > 0 && (
                              <span className="text-[10px] font-bold text-[#00897B]">
                                · Eng yuqori: {progress.bestScore}%
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-[#212121] truncate">
                            {exercise.titleEn}
                          </h4>
                          <p className="text-xs text-[#616161] truncate">{exercise.titleUz}</p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isUnlocked ? (
                          <span className="px-3 py-1.5 rounded-lg bg-[#3949AB] text-white text-xs font-semibold flex items-center gap-1">
                            <Play className="w-3 h-3 fill-current" />
                            <span>{isCompleted ? 'Qayta' : 'Boshlash'}</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-[#616161]">
                            Oldingi mashqni tugating
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            TAB 2: 110 REGISTERED EXERCISE TEMPLATES LIBRARY
           ================================================================= */}
        {activeTab === 'library110' && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3949AB]">
                  110 ta Ro‘yxatdan O‘tgan Mashq Shablonlari
                </span>
                <TalkMeBadge
                  text={`${all110Templates.length} / 110`}
                  containerColor="bg-[#E0F2F1]"
                  textColor="text-[#00897B]"
                />
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-[#616161] absolute left-3 top-3" />
                <input
                  type="text"
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  placeholder="110 ta shablon ichidan izlash (#1..#110, Crossword, Dictation...)"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#F5F6FA] border border-[#E0E4EC] text-xs font-semibold text-[#212121] focus:outline-none focus:border-[#3949AB]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {(
                  [
                    ['all', 'Barchasi (110)'],
                    ['vocabulary', 'Vocabulary (1–16)'],
                    ['grammar', 'Grammar (17–36)'],
                    ['reading', 'Reading (37–51)'],
                    ['listening', 'Listening (52–66)'],
                    ['speaking', 'Speaking (67–83)'],
                    ['writing', 'Writing (84–97)'],
                    ['interactive_games', 'Games (98–110)'],
                  ] as const
                ).map(([cat, label]) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setLibraryFilter(cat)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap cursor-pointer ${
                      libraryFilter === cat
                        ? 'bg-[#3949AB] text-white'
                        : 'bg-[#F5F6FA] text-[#616161]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {all110Templates.map((tpl) => (
                <div
                  key={tpl.code}
                  onClick={() => handleLaunchTemplateDemo(tpl)}
                  className="p-3.5 rounded-xl bg-white border border-[#E0E4EC] hover:border-[#3949AB] transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 rounded-lg bg-[#E8EAF6] text-[#3949AB] font-bold text-xs flex items-center justify-center shrink-0">
                      #{tpl.number}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#212121] truncate">{tpl.nameEn}</h4>
                      <p className="text-[11px] text-[#616161] truncate">
                        {tpl.nameUz} · <span className="text-[#00897B]">{tpl.primitive}</span>
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-md bg-[#E0F2F1] text-[#00897B] text-[11px] font-semibold shrink-0">
                    Sinash →
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================
            TAB 3: CENTRALIZED KNOWLEDGE TRACKER
           ================================================================= */}
        {activeTab === 'knowledge' && (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#212121]">
                  Ko‘nikmalar va Bilim O‘zlashtirish Ko‘rsatkichi
                </h3>
                <Sparkles className="w-4 h-4 text-[#00897B]" />
              </div>
              <p className="text-xs text-[#616161] leading-relaxed">
                Darsni o‘qib chiqish (Lesson Completion) boshlang‘ich tanishuv beradi (45%), haqiqiy o‘zlashtirish (Knowledge Mastery 80%+) esa Amaliyot Markazidagi mashqlar orqali shakllanadi.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {(
                  [
                    ['vocabulary', 'Vocabulary (Lug‘at)'],
                    ['grammar', 'Grammar (Qoidalar)'],
                    ['listening', 'Listening (Tinglash)'],
                    ['speaking', 'Speaking (So‘zlash)'],
                    ['reading', 'Reading (O‘qish)'],
                    ['writing', 'Writing (Yozish)'],
                  ] as const
                ).map(([dom, label]) => {
                  const stat = domainSummary[dom];
                  return (
                    <div
                      key={dom}
                      className="p-3 rounded-lg bg-[#F5F6FA] border border-[#E0E4EC] space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-[#212121]">{label}</span>
                        <span className="text-[#00897B]">{stat?.averageScore || 0}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#E8EAF6] overflow-hidden">
                        <div
                          className="h-full bg-[#00897B]"
                          style={{ width: `${stat?.averageScore || 0}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              {knowledgeTracker.getAllKnowledgeStates().map((ks) => (
                <div
                  key={ks.knowledgeId}
                  className="p-3.5 rounded-xl bg-white border border-[#E0E4EC] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase text-[#3949AB] bg-[#E8EAF6] px-2 py-0.5 rounded">
                      {ks.domain}
                    </span>
                    <h4 className="text-sm font-bold text-[#212121] mt-1">{ks.termEn}</h4>
                    <p className="text-xs text-[#616161]">{ks.meaningUz}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-[#00897B]">{ks.masteryScore}%</span>
                    <p className="text-[10px] text-[#616161]">
                      {ks.exposuresCount} marta ko‘rildi
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
