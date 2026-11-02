import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeBottomBar } from '../components/TalkMeBottomBar';
import { LevelNodeItem, LevelNodeType } from '../types';
import {
  ChevronLeft,
  Flame,
  BookOpen,
  Mic,
  RotateCcw,
  Headphones,
  Star,
  Gift,
  Video,
  ArrowUp,
  Check,
  Trophy,
  Compass,
  Flag,
  ArrowRight,
} from 'lucide-react';
import {
  CourseNatureLandscape,
  BIOMES,
  getCourseZigzagOffset,
} from './courses/CourseNatureLandscape';
import {
  LockedNode3DPadlock,
  triggerLockRattleFeedback,
  triggerUnlockCeremonyFeedback,
} from './courses/LockedNode3DPadlock';
import { NOUNS_18_SUBTOPIC_IDS } from '../content/registry/subtopicsCatalog';
import { subtopicProgressEngine } from '../engines/subtopic-engine/subtopicProgressEngine';
import confetti from 'canvas-confetti';

export interface RawCourseTopic {
  title: string;
  subtitle: string;
  nodeType: LevelNodeType;
  xpReward: number;
  subtopicId?: string;
}

// Currently ONLY Nouns (Ot so‘z turkumi) has subtopics (18 levels).
// All other categories have topics: [] as requested.
export const COURSE_CURRICULA: Record<
  string,
  {
    title: string;
    subtitle: string;
    section: string;
    topics: RawCourseTopic[];
  }
> = {
  nouns: {
    title: 'Ot (Nouns — 18 Ost-Mavzu)',
    subtitle: 'Ot so‘z turkumi bo‘yicha darajalar (level) ketma-ketligidagi to‘liq kurs',
    section: 'BO‘LIM 1 · OT SO‘Z TURKUMI',
    topics: [
      {
        title: '1-Daraja: What is a Noun? (Ot nima?)',
        subtitle: '6 mustaqil so‘z turkumi hamda Kim? (Who?) va Nima? (What?) savollari',
        nodeType: 'MASCOT_INTRO',
        xpReward: 15,
        subtopicId: NOUNS_18_SUBTOPIC_IDS[0],
      },
      {
        title: '2-Daraja: Articles & Prepositions',
        subtitle: 'Ot oldidan keladigan artikllar (a, an, the) va predloglar (in, on, under, near)',
        nodeType: 'STAR',
        xpReward: 15,
        subtopicId: NOUNS_18_SUBTOPIC_IDS[1],
      },
      {
        title: '3-Daraja: Nouns in the Sentence',
        subtitle: 'Otning gapdagi 5 vazifasi: Subject, Complement, Object, Modifier, Adverbial',
        nodeType: 'READING',
        xpReward: 20,
        subtopicId: NOUNS_18_SUBTOPIC_IDS[2],
      },
      {
        title: '4-Daraja: Proper & Common Nouns Intro',
        subtitle: 'Atoqli va turdosh otlar: boy → Ali, city → Tashkent, country → Uzbekistan',
        nodeType: 'PRACTICE',
        xpReward: 15,
        subtopicId: NOUNS_18_SUBTOPIC_IDS[3],
      },
      {
        title: '5-Daraja: Proper Nouns (Atoqli otlar)',
        subtitle: 'Katta harf qoidasi: ismlar, shaharlar, davlatlar, kunlar va oylar',
        nodeType: 'MIC',
        xpReward: 15,
        subtopicId: NOUNS_18_SUBTOPIC_IDS[4],
      },
      {
        title: '6-Daraja: Common Nouns (Turdosh otlar)',
        subtitle: 'Shaxs, joy, hayvon va narsa-buyumlarning umumiy nomlari',
        nodeType: 'CAMERA',
        xpReward: 15,
        subtopicId: NOUNS_18_SUBTOPIC_IDS[5],
      },
      {
        title: '7-Daraja: Types of Common Nouns',
        subtitle: 'Jamlovchi (family), moddiy (water, milk) va mavhum (love, happiness) otlar',
        nodeType: 'HEADPHONES',
        xpReward: 20,
        subtopicId: NOUNS_18_SUBTOPIC_IDS[6],
      },
      {
        title: '8-Daraja: Countable & Uncountable Intro',
        subtitle: 'Sanaladigan (one book, two books) va sanalmaydigan (water, milk, rice) otlar',
        nodeType: 'STAR',
        xpReward: 15,
        subtopicId: NOUNS_18_SUBTOPIC_IDS[7],
      },
      {
        title: '9-Daraja: Countable Nouns',
        subtitle: 'Donalab sanaladigan otlar: a/an, many, a few va How many?',
        nodeType: 'PRACTICE',
        xpReward: 20,
        subtopicId: NOUNS_18_SUBTOPIC_IDS[8],
      },
      {
        title: '10-Daraja: Uncountable Nouns',
        subtitle: 'Sanalmaydigan otlar: much, a little, How much? va a glass of water',
        nodeType: 'READING',
        xpReward: 20,
        subtopicId: NOUNS_18_SUBTOPIC_IDS[9],
      },
      {
        title: '11-Daraja: Singular and Plural Intro',
        subtitle: 'Otda son kategoriyasi: Birlik (1 ta) va Ko‘plik (2 va undan ko‘p)',
        nodeType: 'MIC',
        xpReward: 15,
        subtopicId: NOUNS_18_SUBTOPIC_IDS[10],
      },
      {
        title: '12-Daraja: How to Form Plural Nouns',
        subtitle: 'Ko‘plik yasashning 7 qoidasi: -s, -es, -ies, -ves, irregular (children) va sheep',
        nodeType: 'STAR',
        xpReward: 25,
        subtopicId: NOUNS_18_SUBTOPIC_IDS[11],
      },
      {
        title: '13-Daraja: Nouns Used Only in the Singular',
        subtitle: 'Faqat birlikda: information, advice, furniture, knowledge (+ is)',
        nodeType: 'HEADPHONES',
        xpReward: 20,
        subtopicId: NOUNS_18_SUBTOPIC_IDS[12],
      },
      {
        title: '14-Daraja: Nouns Used Only in the Plural',
        subtitle: 'Faqat ko‘plikda: scissors, trousers, glasses, clothes (+ are)',
        nodeType: 'CAMERA',
        xpReward: 20,
        subtopicId: NOUNS_18_SUBTOPIC_IDS[13],
      },
      {
        title: '15-Daraja: Compound Nouns (Qo‘shma otlar)',
        subtitle: 'Qo‘shib (bedroom), ajratib (school bag) va chiziqcha bilan (mother-in-law)',
        nodeType: 'PRACTICE',
        xpReward: 20,
        subtopicId: NOUNS_18_SUBTOPIC_IDS[14],
      },
      {
        title: '16-Daraja: English Noun Cases Intro',
        subtitle: 'Nega o‘zbek tilida 6 ta kelishik, ingliz tilida esa 2 ta Case bor?',
        nodeType: 'READING',
        xpReward: 15,
        subtopicId: NOUNS_18_SUBTOPIC_IDS[15],
      },
      {
        title: '17-Daraja: Common Case & Possessive Case',
        subtitle: "Umumiy va Qaratqich kelishigi: Ali's book, students' books, of",
        nodeType: 'MIC',
        xpReward: 25,
        subtopicId: NOUNS_18_SUBTOPIC_IDS[16],
      },
      {
        title: '18-Daraja: Nouns: Complete Review',
        subtitle: 'Barcha 18 mavzuni jamlovchi katta takrorlash va yakuniy imtihon',
        nodeType: 'STAR',
        xpReward: 40,
        subtopicId: NOUNS_18_SUBTOPIC_IDS[17],
      },
    ],
  },
  english_fundamentals: {
    title: 'English Fundamentals',
    subtitle: 'Ingliz tili asoslari va ilk tushunchalar',
    section: 'BO‘LIM 0 · ASOSLAR',
    topics: [
      {
        title: '1-Dars: Kirish',
        subtitle: 'Til, harflar, tovushlar, so‘zlar va grammatika haqida tushuncha',
        nodeType: 'STAR',
        xpReward: 25,
        subtopicId: 'ef_01_kirish',
      },
    ],
  },
  grammar_fundamentals: {
    title: 'English Fundamentals',
    subtitle: 'Asosiy qoidalar va so‘z tuzilishi',
    section: 'BO‘LIM 0 · ASOSLAR',
    topics: [
      {
        title: '1-Dars: Kirish',
        subtitle: 'Til, harflar, tovushlar, so‘zlar va grammatika haqida tushuncha',
        nodeType: 'STAR',
        xpReward: 25,
        subtopicId: 'ef_01_kirish',
      },
    ],
  },
  verbs: {
    title: 'Fe‘l va Zamonlar',
    subtitle: 'Harakatlar: Present, Past, Future',
    section: 'BO‘LIM 2',
    topics: [],
  },
  adjectives: {
    title: 'Sifat (Adjectives)',
    subtitle: 'Belgi, xususiyat va darajalar',
    section: 'BO‘LIM 3',
    topics: [],
  },
  numerals: {
    title: 'Son (Numerals)',
    subtitle: 'Sanoq va tartib sonlar',
    section: 'BO‘LIM 4',
    topics: [],
  },
  pronouns: {
    title: 'Olmosh (Pronouns)',
    subtitle: 'Kishilik va egalik olmoshlari',
    section: 'BO‘LIM 5',
    topics: [],
  },
  adverbs: {
    title: 'Ravish (Adverbs)',
    subtitle: 'Harakat tarzi, daraja va tezlik',
    section: 'BO‘LIM 6',
    topics: [],
  },
  prepositions: {
    title: 'Predloglar (Prepositions)',
    subtitle: 'O‘rin, payt va yo‘nalish (in, on, at)',
    section: 'BO‘LIM 7',
    topics: [],
  },
  sentences: {
    title: 'Gap (Sentences)',
    subtitle: 'Ega, kesim, to‘ldiruvchi (S+V+O)',
    section: 'BO‘LIM 8',
    topics: [],
  },
  adverbials: {
    title: 'Hol (Adverbials)',
    subtitle: 'Payt, o‘rin, sabab va maqsad',
    section: 'BO‘LIM 9',
    topics: [],
  },
  articles: {
    title: 'Artikl (Articles: A, An, The)',
    subtitle: 'Aniq va noaniq artikl qoidalari',
    section: 'BO‘LIM 10',
    topics: [],
  },
};

export const CourseLevelsScreen: React.FC = () => {
  const {
    selectedCourseId,
    streakDays,
    diamonds,
    navigate,
    goBack,
    completedLevelIds,
    recentlyCompletedLevelId,
    clearRecentlyCompletedLevel,
    awardXpAndDiamonds,
  } = useApp();

  const [rattlingNodeId, setRattlingNodeId] = useState<string | null>(null);
  const [unlockingNodeId, setUnlockingNodeId] = useState<string | null>(null);
  const [, setProgressTick] = useState<number>(0);
  const currentNodeRef = useRef<HTMLDivElement | null>(null);
  const bottomMarkerRef = useRef<HTMLDivElement | null>(null);
  const rattleTimeoutRef = useRef<number | null>(null);
  const unlockTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const unsubscribe = subtopicProgressEngine.subscribe(() => {
      setProgressTick((prev) => prev + 1);
    });
    return () => unsubscribe();
  }, []);

  const activeCourseKey =
    selectedCourseId && COURSE_CURRICULA[selectedCourseId]
      ? selectedCourseId
      : 'nouns';

  const curriculum = COURSE_CURRICULA[activeCourseKey] || COURSE_CURRICULA.nouns;
  const topics = curriculum.topics;

  const midIndex = Math.floor(topics.length / 2);

  interface ConstructedNode extends LevelNodeItem {
    stepIndexFromBottom: number;
    isChest?: boolean;
    isMilestone?: boolean;
    subtopicId?: string;
  }

  const nodesFromBottom: ConstructedNode[] = [];
  let stepCounter = 0;

  if (topics.length > 0) {
    topics.forEach((topic, idx) => {
      if (idx === midIndex) {
        nodesFromBottom.push({
          id: `chest_mid_${activeCourseKey}`,
          title: 'O‘rta Marra Mukofoti',
          subtitle: 'O‘rta marra mukofoti: +25 XP va 15 Olmos',
          nodeType: 'CHEST',
          status: 'LOCKED',
          stars: 0,
          horizontalOffsetRatio: 0,
          xpReward: 25,
          stepIndexFromBottom: stepCounter++,
          isChest: true,
        });
      }

      const levelId = `${activeCourseKey}_lvl_${idx + 1}`;
      nodesFromBottom.push({
        id: levelId,
        title: topic.title,
        subtitle: topic.subtitle,
        nodeType: topic.nodeType,
        status: 'LOCKED',
        stars: 0,
        horizontalOffsetRatio: 0,
        xpReward: topic.xpReward,
        stepIndexFromBottom: stepCounter++,
        subtopicId: topic.subtopicId,
      });
    });

    nodesFromBottom.push({
      id: `chest_grand_${activeCourseKey}`,
      title: 'Yakuniy Mukofot va Sertifikat',
      subtitle: `${curriculum.title} kursi yakuni va 50 Olmos`,
      nodeType: 'CHEST',
      status: 'LOCKED',
      stars: 0,
      horizontalOffsetRatio: 0,
      xpReward: 50,
      stepIndexFromBottom: stepCounter++,
      isChest: true,
      isMilestone: true,
    });
  }

  let foundCurrent = false;

  const resolvedNodes = nodesFromBottom.map((node) => {
    const subtopicCompleted = node.subtopicId
      ? subtopicProgressEngine.getRecord(node.subtopicId).isCompleted
      : false;

    const altId1 = node.id.replace('nouns_lvl_', 'nouns_level_');
    const altId2 = node.id.replace('nouns_level_', 'nouns_lvl_');

    const isCompleted =
      completedLevelIds.includes(node.id) ||
      completedLevelIds.includes(altId1) ||
      completedLevelIds.includes(altId2) ||
      (node.subtopicId ? completedLevelIds.includes(node.subtopicId) : false) ||
      subtopicCompleted;

    let status: 'COMPLETED' | 'CURRENT' | 'LOCKED' = 'LOCKED';

    if (isCompleted) {
      status = 'COMPLETED';
    } else if (!foundCurrent) {
      status = 'CURRENT';
      foundCurrent = true;
    } else {
      status = 'LOCKED';
    }

    let horizontalOffsetRatio = 0;
    if (node.isMilestone) {
      horizontalOffsetRatio = 0;
    } else {
      horizontalOffsetRatio = getCourseZigzagOffset(
        activeCourseKey,
        node.stepIndexFromBottom,
        nodesFromBottom.length
      );
    }

    return {
      ...node,
      status,
      stars: status === 'COMPLETED' ? 3 : 0,
      horizontalOffsetRatio,
    };
  });

  if (
    resolvedNodes.length > 0 &&
    !resolvedNodes.some((n) => n.status === 'CURRENT' || n.status === 'COMPLETED')
  ) {
    resolvedNodes[0].status = 'CURRENT';
  }

  const visualNodesFromTopToBottom = [...resolvedNodes].reverse();

  const triggerUnlockForNode = (targetNodeId: string) => {
    if (unlockTimeoutRef.current) {
      window.clearTimeout(unlockTimeoutRef.current);
    }
    setUnlockingNodeId(targetNodeId);
    triggerUnlockCeremonyFeedback();

    try {
      confetti({
        particleCount: 55,
        spread: 68,
        origin: { y: 0.58 },
        colors: ['#3949AB', '#00897B', '#5C6BC0', '#26A69A'],
      });
    } catch {
      // Ignore confetti errors
    }

    unlockTimeoutRef.current = window.setTimeout(() => {
      setUnlockingNodeId(null);
    }, 1450);
  };

  const handleLockedNodeClick = (nodeId: string) => {
    if (rattleTimeoutRef.current) {
      window.clearTimeout(rattleTimeoutRef.current);
    }
    setRattlingNodeId(nodeId);
    triggerLockRattleFeedback();

    rattleTimeoutRef.current = window.setTimeout(() => {
      setRattlingNodeId((prev) => (prev === nodeId ? null : prev));
    }, 560);
  };

  useEffect(() => {
    if (!recentlyCompletedLevelId || resolvedNodes.length === 0) return;

    const completedIdx = resolvedNodes.findIndex(
      (n) => n.id === recentlyCompletedLevelId || n.subtopicId === recentlyCompletedLevelId
    );
    const newlyUnlockedNode =
      completedIdx !== -1 && completedIdx + 1 < resolvedNodes.length
        ? resolvedNodes[completedIdx + 1]
        : resolvedNodes.find((n) => n.status === 'CURRENT');

    clearRecentlyCompletedLevel();

    if (newlyUnlockedNode) {
      const scrollTimer = window.setTimeout(() => {
        if (currentNodeRef.current) {
          currentNodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        triggerUnlockForNode(newlyUnlockedNode.id);
      }, 220);
      return () => window.clearTimeout(scrollTimer);
    }
  }, [recentlyCompletedLevelId, activeCourseKey]);

  useEffect(() => {
    if (resolvedNodes.length === 0) return;
    const timer = setTimeout(() => {
      if (currentNodeRef.current) {
        currentNodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (bottomMarkerRef.current) {
        bottomMarkerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [activeCourseKey]);

  useEffect(() => {
    return () => {
      if (rattleTimeoutRef.current) window.clearTimeout(rattleTimeoutRef.current);
      if (unlockTimeoutRef.current) window.clearTimeout(unlockTimeoutRef.current);
    };
  }, []);

  const handleOpenNodeScreen = (node: ConstructedNode) => {
    if (node.nodeType === 'CHEST') {
      awardXpAndDiamonds(node.xpReward, 15, node.id);
      navigate('lesson_result', { levelId: node.id, courseId: activeCourseKey });
    } else {
      navigate('lesson_detail', {
        courseId: activeCourseKey,
        levelId: node.id,
        lessonId: node.subtopicId || 'noun_01_what_is_a_noun',
      });
    }
  };

  const handleQuickCompleteAndUnlockNext = (node: ConstructedNode) => {
    if (node.subtopicId) {
      subtopicProgressEngine.completeSubtopicWrapUp(node.subtopicId, true);
    }
    const canonicalId = node.id.replace('nouns_lvl_', 'nouns_level_');
    awardXpAndDiamonds(node.xpReward, node.nodeType === 'CHEST' ? 15 : 5, canonicalId);
  };

  const scrollToCurrentLesson = () => {
    if (currentNodeRef.current) {
      currentNodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (bottomMarkerRef.current) {
      bottomMarkerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completedCount = resolvedNodes.filter(
    (n) => n.status === 'COMPLETED' && n.nodeType !== 'CHEST'
  ).length;

  const activeCurrentNode = resolvedNodes.find((n) => n.status === 'CURRENT') || null;

  const stepHeight = 110;
  const topPadding = 60;
  const totalSvgHeight =
    visualNodesFromTopToBottom.length > 0
      ? (visualNodesFromTopToBottom.length - 1) * stepHeight + topPadding * 2
      : 320;

  const svgPoints = visualNodesFromTopToBottom.map((node, vIdx) => {
    const x = 180 + node.horizontalOffsetRatio * 150;
    const y = topPadding + vIdx * stepHeight;
    return { x, y };
  });

  let pathD = '';
  if (svgPoints.length > 0) {
    pathD = `M ${svgPoints[0].x} ${svgPoints[0].y}`;
    for (let i = 1; i < svgPoints.length; i++) {
      const p0 = svgPoints[i - 1];
      const p1 = svgPoints[i];
      const cy = (p0.y + p1.y) / 2;
      pathD += ` C ${p0.x} ${cy}, ${p1.x} ${cy}, ${p1.x} ${p1.y}`;
    }
  }

  const roadSegments = [];
  for (let i = 1; i < svgPoints.length; i++) {
    const upperNode = visualNodesFromTopToBottom[i - 1];
    const lowerNode = visualNodesFromTopToBottom[i];
    const pUpper = svgPoints[i - 1];
    const pLower = svgPoints[i];
    const cy = (pUpper.y + pLower.y) / 2;
    const segPathUpward = `M ${pLower.x} ${pLower.y} C ${pLower.x} ${cy}, ${pUpper.x} ${cy}, ${pUpper.x} ${pUpper.y}`;
    const isSegmentUnlocked =
      upperNode.status === 'COMPLETED' || upperNode.status === 'CURRENT';
    const isSegmentUnlockingNow = upperNode.id === unlockingNodeId;

    roadSegments.push({
      id: `seg_${lowerNode.id}_to_${upperNode.id}`,
      segPathUpward,
      isSegmentUnlocked,
      isSegmentUnlockingNow,
    });
  }

  const biome = BIOMES[activeCourseKey] || BIOMES.nouns;

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-28 text-[#212121]">
      {/* 1. MATERIAL DESIGN 2 TOP APP BAR */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E0E4EC] px-4 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={goBack}
              className="w-10 h-10 rounded-lg border border-[#E0E4EC] flex items-center justify-center hover:bg-[#E8EAF6] text-[#3949AB] transition-colors cursor-pointer"
              aria-label="Orqaga"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-base font-bold text-[#212121] truncate max-w-[200px] block">
              {curriculum.title}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-[#616161] tabular-nums">
            <span className="flex items-center gap-1 text-[#3949AB]">
              <Flame className="w-4 h-4" />
              {streakDays} kun
            </span>
            <span aria-hidden="true">·</span>
            <span>{diamonds.toLocaleString()} olmos</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#00897B]">{topics.length} ost-mavzu</span>
          </div>
        </div>
      </header>

      <div className="px-4 pt-4 max-w-md mx-auto space-y-3">
        {/* 2. MATERIAL 2 UNIT BANNER */}
        <div className="rounded-xl bg-[#3949AB] p-4 text-white shadow-[0_2px_6px_rgba(57,73,171,0.2)] flex items-center justify-between">
          <div className="pr-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/80 font-medium">
              <span>{curriculum.section}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {completedCount}/{topics.length} daraja yakunlandi
              </span>
              <span aria-hidden="true">·</span>
              <span>{biome.nameUz}</span>
            </div>
            <h2 className="text-lg font-bold mt-1 tracking-tight">{curriculum.title}</h2>
            <p className="text-xs text-white/85 mt-0.5 line-clamp-1">
              {biome.subtitleUz || curriculum.subtitle}
            </p>
          </div>

          <button
            onClick={() => navigate('courses')}
            className="w-11 h-11 shrink-0 rounded-lg bg-white/15 border border-white/30 flex items-center justify-center text-white hover:bg-white/25 transition-colors cursor-pointer"
            title="Barcha Kurslar"
          >
            <BookOpen className="w-5 h-5" />
          </button>
        </div>

        {topics.length === 0 ? (
          <div className="rounded-2xl bg-white border border-[#E0E4EC] p-6 text-center space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-[#E8EAF6] text-[#3949AB] flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#212121]">
              Ushbu bo‘limda hozircha ost-mavzular yo‘q
            </h3>
            <p className="text-xs text-[#616161] leading-relaxed">
              Hozircha faqat <strong>Ot (Nouns)</strong> so‘z turkumi uchun 18 ta darajadan iborat ost-mavzular xaritasi mavjud.
            </p>
            <button
              type="button"
              onClick={() => navigate('course_levels', { courseId: 'nouns' })}
              className="w-full py-3 px-4 rounded-xl bg-[#3949AB] hover:bg-[#283593] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>Ot (Nouns — 18 Daraja) Xaritasini Ochish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            {/* 3. ROADMAP STATUS & QUICK UNLOCK BAR */}
            <div className="flex items-center justify-between gap-2 text-xs bg-white py-2.5 px-3.5 rounded-xl border border-[#E0E4EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="min-w-0 truncate">
                <span className="font-bold text-[#212121]">Darajalar Xaritasi: </span>
                <span className="text-[#616161]">Ost-mavzuni bosing va 7 bosqichda o‘rganing</span>
              </div>

              {activeCurrentNode ? (
                <button
                  onClick={() => handleQuickCompleteAndUnlockNext(activeCurrentNode)}
                  className="shrink-0 min-h-[34px] px-3 py-1 rounded-lg bg-[#00897B] hover:bg-[#00695C] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                  title="Hozirgi darajani yakunlab keyingi qulfni ochish"
                >
                  <span>Qulfni ochish</span>
                </button>
              ) : (
                <span className="shrink-0 text-xs font-semibold text-[#00897B]">
                  Barchasi ochiq
                </span>
              )}
            </div>

            {/* 4. DYNAMIC ROADMAP PATH */}
            <div
              className="relative mt-3 rounded-2xl overflow-hidden bg-white border border-[#E0E4EC] shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
              style={{ height: `${totalSvgHeight}px` }}
            >
              <CourseNatureLandscape
                courseKey={activeCourseKey}
                totalHeight={totalSvgHeight}
                points={svgPoints}
              />

              <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none select-none z-10"
                viewBox={`0 0 360 ${totalSvgHeight}`}
                fill="none"
              >
                <path
                  d={pathD}
                  stroke="rgba(15, 23, 42, 0.2)"
                  strokeWidth="36"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={pathD}
                  stroke="#475569"
                  strokeWidth="31"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {roadSegments.map((seg) => (
                  <g key={seg.id}>
                    {seg.isSegmentUnlocked ? (
                      <>
                        <path
                          d={seg.segPathUpward}
                          stroke="#F8FAFC"
                          strokeWidth="26"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d={seg.segPathUpward}
                          stroke="#1E293B"
                          strokeWidth="22"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d={seg.segPathUpward}
                          stroke="#334155"
                          strokeWidth="19"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d={seg.segPathUpward}
                          stroke="#E2E8F0"
                          strokeWidth="3"
                          strokeDasharray="10 14"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </>
                    ) : (
                      <>
                        <path
                          d={seg.segPathUpward}
                          stroke="#94A3B8"
                          strokeWidth="25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity="0.7"
                        />
                        <path
                          d={seg.segPathUpward}
                          stroke="#1E2430"
                          strokeWidth="21"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity="0.82"
                        />
                        <path
                          d={seg.segPathUpward}
                          stroke="#64748B"
                          strokeWidth="2.5"
                          strokeDasharray="8 16"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity="0.65"
                        />
                      </>
                    )}

                    {seg.isSegmentUnlockingNow && (
                      <>
                        <path
                          d={seg.segPathUpward}
                          stroke="#3949AB"
                          strokeWidth="24"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray="320"
                          className="anim-road-surge"
                          opacity="0.75"
                        />
                        <path
                          d={seg.segPathUpward}
                          stroke="#00897B"
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray="320"
                          className="anim-road-surge"
                        />
                      </>
                    )}
                  </g>
                ))}
              </svg>

              {/* Level Node Checkpoints */}
              <div className="relative z-20 w-full h-full">
                {visualNodesFromTopToBottom.map((node, vIdx) => {
                  const isCurrent = node.status === 'CURRENT';
                  const isCompleted = node.status === 'COMPLETED';
                  const isLocked = !isCurrent && !isCompleted;
                  const isChest = node.nodeType === 'CHEST';
                  const isFirstLessonAtBottom = vIdx === visualNodesFromTopToBottom.length - 1;
                  const isApexAtTop = vIdx === 0;
                  const isRattling = rattlingNodeId === node.id;
                  const isUnlocking = unlockingNodeId === node.id;
                  const showPadlockOverlay = isLocked || isUnlocking;

                  const topPx = topPadding + vIdx * stepHeight - 36;
                  const xTranslate = node.horizontalOffsetRatio * 150;

                  return (
                    <div
                      key={node.id}
                      ref={
                        isCurrent ? currentNodeRef : isFirstLessonAtBottom ? bottomMarkerRef : null
                      }
                      className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center transition-transform"
                      style={{
                        top: `${topPx}px`,
                        transform: `translate(calc(-50% + ${xTranslate}px), 0)`,
                      }}
                    >
                      {isRattling && isLocked && (
                        <div className="absolute -top-9 whitespace-nowrap bg-[#212121] text-white text-[11px] font-semibold px-3 py-1 rounded-md shadow-md z-40 pointer-events-none">
                          Oldingi darajani tugating
                        </div>
                      )}

                      {isApexAtTop && (
                        <div className="mb-2 bg-[#3949AB] text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          <span>Yakuniy Marra</span>
                        </div>
                      )}

                      {isFirstLessonAtBottom && (
                        <div className="mb-1 bg-[#00897B] text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                          <Flag className="w-3 h-3" />
                          <span>1-Daraja: Boshlanish</span>
                        </div>
                      )}

                      <div className="relative flex items-center justify-center">
                        {/* Material 2 Circular Node Button */}
                        <div
                          onClick={() => {
                            if (isLocked) {
                              handleLockedNodeClick(node.id);
                            } else {
                              handleOpenNodeScreen(node);
                            }
                          }}
                          className={`relative w-18 h-18 rounded-full cursor-pointer select-none mat-node-btn ${
                            isChest
                              ? isLocked
                                ? 'bg-[#64748B] pb-1.5'
                                : 'bg-[#00695C] pb-1.5'
                              : isCurrent
                              ? 'bg-[#283593] pb-1.5 ring-4 ring-[#3949AB]/25'
                              : isCompleted
                              ? 'bg-[#00695C] pb-1.5'
                              : 'bg-[#64748B] pb-1.5'
                          } shadow-md`}
                        >
                          <div
                            className={`w-full h-full rounded-full flex items-center justify-center text-white ${
                              isChest
                                ? isLocked
                                  ? 'bg-[#CBD5E1] text-[#64748B]'
                                  : 'bg-[#00897B] text-white'
                                : isCurrent
                                ? 'bg-[#3949AB]'
                                : isCompleted
                                ? 'bg-[#00897B]'
                                : 'bg-[#94A3B8] text-[#475569]'
                            }`}
                          >
                            {isCompleted && !isChest ? (
                              <Check className="w-8 h-8 stroke-[3]" />
                            ) : (
                              <div
                                className={
                                  isLocked ? 'opacity-30 scale-90 transition-all' : ''
                                }
                              >
                                {node.nodeType === 'MASCOT_INTRO' && (
                                  <Compass className="w-7 h-7 stroke-[2.2]" />
                                )}
                                {node.nodeType === 'STAR' && (
                                  <Star className="w-7 h-7 fill-current stroke-current" />
                                )}
                                {node.nodeType === 'READING' && (
                                  <BookOpen className="w-7 h-7 stroke-[2.2]" />
                                )}
                                {node.nodeType === 'CHEST' && (
                                  <Gift className="w-7 h-7 stroke-[2.2]" />
                                )}
                                {node.nodeType === 'MIC' && (
                                  <Mic className="w-7 h-7 stroke-[2.2]" />
                                )}
                                {node.nodeType === 'PRACTICE' && (
                                  <RotateCcw className="w-7 h-7 stroke-[2.2]" />
                                )}
                                {node.nodeType === 'CAMERA' && (
                                  <Video className="w-7 h-7 stroke-[2.2]" />
                                )}
                                {node.nodeType === 'HEADPHONES' && (
                                  <Headphones className="w-7 h-7 stroke-[2.2]" />
                                )}
                              </div>
                            )}
                          </div>

                          {showPadlockOverlay && (
                            <LockedNode3DPadlock
                              idSuffix={node.id}
                              isRattling={isRattling}
                              isUnlocking={isUnlocking}
                              isChest={isChest}
                            />
                          )}
                        </div>
                      </div>

                      {/* Node Label */}
                      {isCompleted ? (
                        <div className="flex flex-col items-center mt-1.5">
                          <div className="flex items-center gap-1 bg-white/95 px-2.5 py-0.5 rounded-md shadow-2xs border border-[#E0E4EC]">
                            {[1, 2, 3].map((starIdx) => (
                              <Star
                                key={starIdx}
                                className="w-3 h-3 fill-[#00897B] text-[#00897B]"
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold mt-1 px-2 py-0.5 rounded bg-white/95 text-[#00695C] border border-[#E0E4EC] max-w-[140px] truncate">
                            {node.title}
                          </span>
                        </div>
                      ) : (
                        <span
                          className={`text-[10px] font-bold mt-1.5 px-2.5 py-0.5 rounded-md max-w-[144px] text-center truncate ${
                            isCurrent
                              ? 'bg-[#3949AB] text-white shadow-2xs'
                              : 'bg-white/90 text-[#212121] border border-[#E0E4EC]'
                          }`}
                        >
                          {node.title}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom anchor */}
            <div ref={bottomMarkerRef} className="pt-4 pb-2 text-center">
              <span className="text-xs font-medium text-[#616161]">
                1-Darajadan boshlab bosqichma-bosqich yuqoriga harakatlaning
              </span>
            </div>
          </>
        )}
      </div>

      {/* Floating Action Controls */}
      {topics.length > 0 && (
        <div className="fixed bottom-20 right-4 z-20 flex flex-col gap-2">
          <button
            onClick={scrollToCurrentLesson}
            className="w-11 h-11 rounded-lg bg-[#3949AB] border border-white/40 shadow-md flex items-center justify-center text-white hover:bg-[#283593] transition-colors cursor-pointer"
            title="Hozirgi darajaga o‘tish"
          >
            <Flag className="w-5 h-5" />
          </button>

          <button
            onClick={scrollToTop}
            className="w-11 h-11 rounded-lg bg-white border border-[#E0E4EC] shadow-md flex items-center justify-center text-[#3949AB] hover:bg-[#E8EAF6] transition-colors cursor-pointer"
            title="Yuqoriga chiqish"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      )}

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
