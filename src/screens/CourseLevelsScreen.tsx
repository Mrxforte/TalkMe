import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeBottomBar } from '../components/TalkMeBottomBar';
import { TalkMeButton } from '../components/TalkMeButton';
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
  X,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Check,
  Lock,
  Trophy,
  Compass,
  Flag,
  Volume2,
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
import confetti from 'canvas-confetti';

interface RawCourseTopic {
  title: string;
  subtitle: string;
  nodeType: LevelNodeType;
  xpReward: number;
}

// Full curriculum definitions with exact topic counts matching CoursesScreen:
// grammar_fundamentals: 8 topics
// nouns: 9 topics
// verbs: 12 topics
// adjectives: 7 topics
// numerals: 6 topics
// pronouns: 8 topics
// adverbs: 7 topics
// prepositions: 10 topics
// sentences: 9 topics
// adverbials: 7 topics
// articles: 5 topics
const COURSE_CURRICULA: Record<
  string,
  {
    title: string;
    subtitle: string;
    section: string;
    topics: RawCourseTopic[];
  }
> = {
  grammar_fundamentals: {
    title: 'Grammar Fundamentals',
    subtitle: 'Asosiy qoidalar va so‘z tuzilishi',
    section: 'BO‘LIM 1, UNIT 1',
    topics: [
      {
        title: '1-Dars: Tovushlar va Alifbo',
        subtitle: 'Ingliz tili fonetikasi va harflar talaffuzi',
        nodeType: 'MASCOT_INTRO',
        xpReward: 10,
      },
      {
        title: '2-Dars: Otlar bilan tanishuv',
        subtitle: 'Shaxs va narsalarni nomlash qoidalari',
        nodeType: 'STAR',
        xpReward: 10,
      },
      {
        title: '3-Dars: To Be fe’li (Am, Is, Are)',
        subtitle: 'Darak va sodda iboralar tuzish',
        nodeType: 'READING',
        xpReward: 15,
      },
      {
        title: '4-Dars: Sodda gap tuzilishi',
        subtitle: 'Ega + Kesim + Ikkinchi darajali bo‘laklar',
        nodeType: 'MIC',
        xpReward: 15,
      },
      {
        title: '5-Dars: So‘roq va inkor gaplar',
        subtitle: 'Do va Does yordamchi fe’llari bilan savol berish',
        nodeType: 'PRACTICE',
        xpReward: 20,
      },
      {
        title: '6-Dars: Ko‘rsatish olmoshlari',
        subtitle: 'This, That, These, Those qo‘llanishi',
        nodeType: 'CAMERA',
        xpReward: 20,
      },
      {
        title: '7-Dars: Sanaladigan va Sanalmaydigan',
        subtitle: 'Much, Many, A lot of farqlari',
        nodeType: 'HEADPHONES',
        xpReward: 20,
      },
      {
        title: '8-Dars: Katta Sinov Imtihoni',
        subtitle: 'Barcha 8 ta fundamental mavzu bo‘yicha yakuniy test',
        nodeType: 'STAR',
        xpReward: 30,
      },
    ],
  },
  nouns: {
    title: 'Ot (Nouns)',
    subtitle: 'Shaxs, narsa va joy nomlari',
    section: 'BO‘LIM 1, UNIT 2',
    topics: [
      {
        title: '1-Dars: Otlarga kirish',
        subtitle: 'Common va Proper otlar farqi',
        nodeType: 'MASCOT_INTRO',
        xpReward: 10,
      },
      {
        title: '2-Dars: Birlik va ko‘plik',
        subtitle: '-s, -es, -ies qo‘shimchalarining qoidalari',
        nodeType: 'STAR',
        xpReward: 10,
      },
      {
        title: '3-Dars: Noto‘g‘ri ko‘pliklar',
        subtitle: 'Man-men, child-children, tooth-teeth',
        nodeType: 'READING',
        xpReward: 15,
      },
      {
        title: '4-Dars: Sanaladigan va sanalmaydigan',
        subtitle: 'Water, rice, coffee kabi moddiy otlar',
        nodeType: 'PRACTICE',
        xpReward: 15,
      },
      {
        title: '5-Dars: Egalik shakli (\'s)',
        subtitle: 'John\'s car, the boys\' room qoidalari',
        nodeType: 'MIC',
        xpReward: 20,
      },
      {
        title: '6-Dars: Jamlovchi otlar',
        subtitle: 'Family, team, crowd, committee',
        nodeType: 'CAMERA',
        xpReward: 20,
      },
      {
        title: '7-Dars: Mavhum otlar',
        subtitle: 'Love, freedom, peace, knowledge tushunchalari',
        nodeType: 'HEADPHONES',
        xpReward: 20,
      },
      {
        title: '8-Dars: Qo‘shma otlar',
        subtitle: 'Toothpaste, blackboard, sunflower tuzilishi',
        nodeType: 'READING',
        xpReward: 20,
      },
      {
        title: '9-Dars: Otlar bo‘yicha Katta Test',
        subtitle: 'Otlarning barcha qoidalari bo‘yicha yakuniy imtihon',
        nodeType: 'STAR',
        xpReward: 30,
      },
    ],
  },
  verbs: {
    title: 'Fe‘l va Zamonlar',
    subtitle: 'Harakatlar: Present, Past, Future',
    section: 'BO‘LIM 2, UNIT 1',
    topics: [
      {
        title: '1-Dars: Fe’l turlari va Asoslari',
        subtitle: 'Asosiy va yordamchi fe’llar',
        nodeType: 'MASCOT_INTRO',
        xpReward: 10,
      },
      {
        title: '2-Dars: Present Simple',
        subtitle: 'Kundalik odatlar va doimiy holatlar',
        nodeType: 'STAR',
        xpReward: 10,
      },
      {
        title: '3-Dars: Present Continuous',
        subtitle: 'Ayni daqiqada sodir bo‘layotgan ish-harakatlar',
        nodeType: 'MIC',
        xpReward: 15,
      },
      {
        title: '4-Dars: Simple vs Continuous',
        subtitle: 'Stative fe’llar (know, understand, love)',
        nodeType: 'PRACTICE',
        xpReward: 15,
      },
      {
        title: '5-Dars: Past Simple: To‘g‘ri fe’llar',
        subtitle: '-ed qo‘shimchasi va talaffuz qoidalari',
        nodeType: 'READING',
        xpReward: 15,
      },
      {
        title: '6-Dars: Noto‘g‘ri fe’llar (Irregular)',
        subtitle: 'Go-went-gone, see-saw-seen jadvali',
        nodeType: 'STAR',
        xpReward: 20,
      },
      {
        title: '7-Dars: Past Continuous',
        subtitle: 'O‘tgan zamonda davom etgan jarayonlar (Was/Were + V-ing)',
        nodeType: 'CAMERA',
        xpReward: 20,
      },
      {
        title: '8-Dars: Future Simple (Will)',
        subtitle: 'Kelajak rejalari va kutilmagan qarorlar',
        nodeType: 'HEADPHONES',
        xpReward: 20,
      },
      {
        title: '9-Dars: Be going to',
        subtitle: 'Oldindan rejalashtirilgan niyatlar va bashoratlar',
        nodeType: 'MIC',
        xpReward: 20,
      },
      {
        title: '10-Dars: Present Perfect (Have/Has + V3)',
        subtitle: 'Natijasi hozirga bog‘liq harakatlar',
        nodeType: 'READING',
        xpReward: 25,
      },
      {
        title: '11-Dars: Modal fe’llar',
        subtitle: 'Can, could, must, should, may qo‘llanilishi',
        nodeType: 'PRACTICE',
        xpReward: 25,
      },
      {
        title: '12-Dars: Zamonlar Master Imtihoni',
        subtitle: '12 ta dars bo‘yicha to‘liq sinov va sertifikat',
        nodeType: 'STAR',
        xpReward: 35,
      },
    ],
  },
  adjectives: {
    title: 'Sifat (Adjectives)',
    subtitle: 'Belgi, xususiyat va darajalar',
    section: 'BO‘LIM 2, UNIT 2',
    topics: [
      {
        title: '1-Dars: Sifat nima?',
        subtitle: 'Predmetlarning rangi, shakli va belgilari',
        nodeType: 'MASCOT_INTRO',
        xpReward: 10,
      },
      {
        title: '2-Dars: Sifatlarning gapdagi o‘rni',
        subtitle: 'Ot oldida va bog‘lovchi fe’llardan so‘ng',
        nodeType: 'STAR',
        xpReward: 10,
      },
      {
        title: '3-Dars: Qiyosiy daraja (Comparative)',
        subtitle: 'Fast -> Faster, Beautiful -> More beautiful',
        nodeType: 'READING',
        xpReward: 15,
      },
      {
        title: '4-Dars: Orttirma daraja (Superlative)',
        subtitle: 'The fastest, The most beautiful',
        nodeType: 'MIC',
        xpReward: 20,
      },
      {
        title: '5-Dars: Noto‘g‘ri sifatlar',
        subtitle: 'Good -> Better -> Best, Bad -> Worse -> Worst',
        nodeType: 'PRACTICE',
        xpReward: 20,
      },
      {
        title: '6-Dars: Sifatlar ketma-ketligi',
        subtitle: 'OSASCOMP tartibi (Opinion, Size, Age, Shape...)',
        nodeType: 'HEADPHONES',
        xpReward: 20,
      },
      {
        title: '7-Dars: Sifatlar bo‘yicha Sinov',
        subtitle: 'Barcha sifat qoidalari bo‘yicha yakuniy imtihon',
        nodeType: 'STAR',
        xpReward: 30,
      },
    ],
  },
  numerals: {
    title: 'Son (Numerals)',
    subtitle: 'Sanoq va tartib sonlar',
    section: 'BO‘LIM 1, UNIT 3',
    topics: [
      {
        title: '1-Dars: Sanoq sonlar 1 dan 100 gacha',
        subtitle: 'Raqamlar talaffuzi va yozilishi',
        nodeType: 'MASCOT_INTRO',
        xpReward: 10,
      },
      {
        title: '2-Dars: 100 dan milliongacha katta sonlar',
        subtitle: 'Hundreds, thousands, millions qoidalari',
        nodeType: 'STAR',
        xpReward: 10,
      },
      {
        title: '3-Dars: Tartib sonlar',
        subtitle: '1st (first), 2nd (second), 3rd (third)...',
        nodeType: 'READING',
        xpReward: 15,
      },
      {
        title: '4-Dars: Sanalar va yillarni o‘qish',
        subtitle: 'Tug‘ilgan kunlar, asrlar va sanalar aytilishi',
        nodeType: 'MIC',
        xpReward: 20,
      },
      {
        title: '5-Dars: Kasrlar, foizlar va vaqt',
        subtitle: 'Half, quarter, percent va soatni ifodalash',
        nodeType: 'PRACTICE',
        xpReward: 20,
      },
      {
        title: '6-Dars: Sonlar bo‘yicha Katta Sinov',
        subtitle: 'Sonlarning barcha turlari bo‘yicha yakuniy test',
        nodeType: 'STAR',
        xpReward: 30,
      },
    ],
  },
  pronouns: {
    title: 'Olmosh (Pronouns)',
    subtitle: 'Kishilik va egalik olmoshlari',
    section: 'BO‘LIM 2, UNIT 3',
    topics: [
      {
        title: '1-Dars: Kishilik olmoshlari',
        subtitle: 'I, you, he, she, it, we, they',
        nodeType: 'MASCOT_INTRO',
        xpReward: 10,
      },
      {
        title: '2-Dars: Obyekt olmoshlari',
        subtitle: 'Me, you, him, her, it, us, them',
        nodeType: 'STAR',
        xpReward: 10,
      },
      {
        title: '3-Dars: Egalik olmoshlari',
        subtitle: 'My/Mine, Your/Yours, Their/Theirs',
        nodeType: 'READING',
        xpReward: 15,
      },
      {
        title: '4-Dars: O‘zlik olmoshlari',
        subtitle: 'Myself, yourself, himself, ourselves',
        nodeType: 'MIC',
        xpReward: 15,
      },
      {
        title: '5-Dars: Ko‘rsatish olmoshlari',
        subtitle: 'This, that, these, those amaliyoti',
        nodeType: 'PRACTICE',
        xpReward: 20,
      },
      {
        title: '6-Dars: Noaniq olmoshlar',
        subtitle: 'Somebody, anyone, nothing, everywhere',
        nodeType: 'CAMERA',
        xpReward: 20,
      },
      {
        title: '7-Dars: Nisbiy olmoshlar',
        subtitle: 'Who, which, that, whose bog‘lovchi olmoshlari',
        nodeType: 'HEADPHONES',
        xpReward: 20,
      },
      {
        title: '8-Dars: Olmoshlar Master Imtihoni',
        subtitle: '8 ta dars bo‘yicha yakuniy sinov',
        nodeType: 'STAR',
        xpReward: 30,
      },
    ],
  },
  adverbs: {
    title: 'Ravish (Adverbs)',
    subtitle: 'Harakat tarzi, daraja va tezlik',
    section: 'BO‘LIM 3, UNIT 1',
    topics: [
      {
        title: '1-Dars: Ravish nima?',
        subtitle: 'Sifatdan ravish yasash (-ly qo‘shimchasi)',
        nodeType: 'MASCOT_INTRO',
        xpReward: 10,
      },
      {
        title: '2-Dars: Harakat tarzi ravishlari',
        subtitle: 'Quickly, softly, well, hard, fast',
        nodeType: 'STAR',
        xpReward: 10,
      },
      {
        title: '3-Dars: Takroriylik ravishlari',
        subtitle: 'Always, usually, often, sometimes, never',
        nodeType: 'READING',
        xpReward: 15,
      },
      {
        title: '4-Dars: O‘rin va payt ravishlari',
        subtitle: 'Here, there, today, soon, recently',
        nodeType: 'MIC',
        xpReward: 15,
      },
      {
        title: '5-Dars: Daraja-miqdor ravishlari',
        subtitle: 'Very, quite, extremely, too, enough',
        nodeType: 'PRACTICE',
        xpReward: 20,
      },
      {
        title: '6-Dars: Ravish va Sifat farqi',
        subtitle: 'He runs fast vs He is a fast runner',
        nodeType: 'HEADPHONES',
        xpReward: 20,
      },
      {
        title: '7-Dars: Ravishlar bo‘yicha Yakuniy Sinov',
        subtitle: '7 ta mavzu bo‘yicha master imtihon',
        nodeType: 'STAR',
        xpReward: 30,
      },
    ],
  },
  prepositions: {
    title: 'Predloglar (Prepositions)',
    subtitle: 'O‘rin, payt va yo‘nalish (in, on, at)',
    section: 'BO‘LIM 3, UNIT 2',
    topics: [
      {
        title: '1-Dars: Predloglarga kirish',
        subtitle: 'Predloglarning gapdagi bog‘lovchi roli',
        nodeType: 'MASCOT_INTRO',
        xpReward: 10,
      },
      {
        title: '2-Dars: O‘rin predloglari: In, On, At',
        subtitle: 'Shaharlar, ko‘chalar va aniq manzillar',
        nodeType: 'STAR',
        xpReward: 10,
      },
      {
        title: '3-Dars: Payt predloglari: In, On, At',
        subtitle: 'Yillar, oylar, haftaning kunlari va soatlar',
        nodeType: 'READING',
        xpReward: 15,
      },
      {
        title: '4-Dars: Harakat va yo‘nalish',
        subtitle: 'To, into, onto, towards, through',
        nodeType: 'MIC',
        xpReward: 15,
      },
      {
        title: '5-Dars: Joylashuv predloglari',
        subtitle: 'Under, above, behind, in front of, next to',
        nodeType: 'PRACTICE',
        xpReward: 20,
      },
      {
        title: '6-Dars: Between vs Among',
        subtitle: 'Ikki va undan ortiq obyektlar orasi',
        nodeType: 'CAMERA',
        xpReward: 20,
      },
      {
        title: '7-Dars: Vosita va hamrohlik',
        subtitle: 'By bus, with a pen, by myself',
        nodeType: 'HEADPHONES',
        xpReward: 20,
      },
      {
        title: '8-Dars: Sabab va maqsad',
        subtitle: 'For, because of, due to qo‘llanilishi',
        nodeType: 'READING',
        xpReward: 20,
      },
      {
        title: '9-Dars: Fe’l + Predlog birikmalari',
        subtitle: 'Listen to, wait for, depend on, believe in',
        nodeType: 'MIC',
        xpReward: 25,
      },
      {
        title: '10-Dars: Predloglar Master Sinovi',
        subtitle: '10 ta dars bo‘yicha to‘liq sinov va sertifikat',
        nodeType: 'STAR',
        xpReward: 35,
      },
    ],
  },
  sentences: {
    title: 'Gap (Sentences)',
    subtitle: 'Ega, kesim, to‘ldiruvchi (S+V+O)',
    section: 'BO‘LIM 4, UNIT 1',
    topics: [
      {
        title: '1-Dars: Inglizcha gap tuzilishi',
        subtitle: 'S + V + O qat’iy so‘z tartibi qoidasi',
        nodeType: 'MASCOT_INTRO',
        xpReward: 10,
      },
      {
        title: '2-Dars: Ega va kesim moslashuvi',
        subtitle: 'Subject-Verb agreement qoidalari',
        nodeType: 'STAR',
        xpReward: 10,
      },
      {
        title: '3-Dars: Darak gaplar',
        subtitle: 'Oddiy va kengaytirilgan darak gaplar',
        nodeType: 'READING',
        xpReward: 15,
      },
      {
        title: '4-Dars: Inkor gaplar',
        subtitle: 'Not, never, no so‘zlari bilan inkor tuzish',
        nodeType: 'PRACTICE',
        xpReward: 15,
      },
      {
        title: '5-Dars: So‘roq gaplar',
        subtitle: 'General va Wh- questions (What, Where, Why)',
        nodeType: 'MIC',
        xpReward: 20,
      },
      {
        title: '6-Dars: Buyruq gaplar (Imperatives)',
        subtitle: 'Iltimos, ko‘rsatma va taqiqlar (Don\'t do it)',
        nodeType: 'CAMERA',
        xpReward: 20,
      },
      {
        title: '7-Dars: Bog‘langan qo‘shma gaplar',
        subtitle: 'And, but, or, so bilan bog‘lash',
        nodeType: 'HEADPHONES',
        xpReward: 20,
      },
      {
        title: '8-Dars: Ergashgan qo‘shma gaplar',
        subtitle: 'Because, although, when, if bog‘lovchilari',
        nodeType: 'READING',
        xpReward: 25,
      },
      {
        title: '9-Dars: Gap tuzilishi Katta Imtihoni',
        subtitle: '9 ta dars bo‘yicha to‘liq sinov',
        nodeType: 'STAR',
        xpReward: 35,
      },
    ],
  },
  adverbials: {
    title: 'Hol (Adverbials)',
    subtitle: 'Payt, o‘rin, sabab va maqsad',
    section: 'BO‘LIM 4, UNIT 2',
    topics: [
      {
        title: '1-Dars: Hol tushunchasi',
        subtitle: 'Gapda harakatning qanday va qayerda sodir bo‘lishi',
        nodeType: 'MASCOT_INTRO',
        xpReward: 10,
      },
      {
        title: '2-Dars: Payt holi (Adverbial of Time)',
        subtitle: 'In the morning, last night, at 5 o\'clock',
        nodeType: 'STAR',
        xpReward: 10,
      },
      {
        title: '3-Dars: O‘rin holi (Adverbial of Place)',
        subtitle: 'At home, in the park, outside',
        nodeType: 'READING',
        xpReward: 15,
      },
      {
        title: '4-Dars: Sabab va maqsad holi',
        subtitle: 'To buy milk, for learning English',
        nodeType: 'MIC',
        xpReward: 15,
      },
      {
        title: '5-Dars: Harakat tarzi holi',
        subtitle: 'With care, in a loud voice, by car',
        nodeType: 'PRACTICE',
        xpReward: 20,
      },
      {
        title: '6-Dars: Hollar ketma-ketligi',
        subtitle: 'Tarz + O‘rin + Payt (Manner, Place, Time) tartibi',
        nodeType: 'HEADPHONES',
        xpReward: 20,
      },
      {
        title: '7-Dars: Hol bo‘yicha Yakuniy Sinov',
        subtitle: '7 ta mavzu bo‘yicha to‘liq test',
        nodeType: 'STAR',
        xpReward: 30,
      },
    ],
  },
  articles: {
    title: 'Artikl (Articles: A, An, The)',
    subtitle: 'Aniq va noaniq artikl qoidalari',
    section: 'BO‘LIM 1, UNIT 4',
    topics: [
      {
        title: '1-Dars: Noaniq artikllar: A va An',
        subtitle: 'Undosh va unli tovushlar oldidan ishlatilishi',
        nodeType: 'MASCOT_INTRO',
        xpReward: 10,
      },
      {
        title: '2-Dars: Aniq artikl: The',
        subtitle: 'Yagona, aniq yoki avval tilga olingan narsalar',
        nodeType: 'STAR',
        xpReward: 10,
      },
      {
        title: '3-Dars: Zero Article (Artiklsiz holatlar)',
        subtitle: 'Nomlar, sport turlari, fanlar oldida',
        nodeType: 'READING',
        xpReward: 15,
      },
      {
        title: '4-Dars: Geografik nomlar va Artikl',
        subtitle: 'The USA, oceans, rivers vs mount Everest',
        nodeType: 'MIC',
        xpReward: 20,
      },
      {
        title: '5-Dars: Artikllar Master Sinovi',
        subtitle: '5 ta dars bo‘yicha to‘liq sinov va sertifikat',
        nodeType: 'STAR',
        xpReward: 30,
      },
    ],
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
    playTts,
    isTtsSpeaking,
  } = useApp();

  const [selectedNode, setSelectedNode] = useState<LevelNodeItem | null>(null);
  const [rattlingNodeId, setRattlingNodeId] = useState<string | null>(null);
  const [unlockingNodeId, setUnlockingNodeId] = useState<string | null>(null);
  const currentNodeRef = useRef<HTMLDivElement | null>(null);
  const bottomMarkerRef = useRef<HTMLDivElement | null>(null);
  const rattleTimeoutRef = useRef<number | null>(null);
  const unlockTimeoutRef = useRef<number | null>(null);

  const activeCourseKey =
    selectedCourseId && COURSE_CURRICULA[selectedCourseId]
      ? selectedCourseId
      : 'grammar_fundamentals';

  const curriculum = COURSE_CURRICULA[activeCourseKey];
  const topics = curriculum.topics;

  // Build the complete bottom-to-top roadmap nodes with chests
  // Step 1: Base topics from Lesson 1 to Lesson N
  // In between, we insert a Mid-Chest at ~halfway, and a Grand Chest / Trophy at the top!
  const midIndex = Math.floor(topics.length / 2);

  // We assign a step progression:
  // Step 0: Lesson 1 (at bottom)
  // ...
  // Step N: Top / Mastery Chest (at top)
  interface ConstructedNode extends LevelNodeItem {
    stepIndexFromBottom: number; // 0 is bottom, grows up
    isChest?: boolean;
    isMilestone?: boolean;
  }

  const nodesFromBottom: ConstructedNode[] = [];
  let stepCounter = 0;

  topics.forEach((topic, idx) => {
    // If we reached the midpoint, insert a halfway treasure chest
    if (idx === midIndex) {
      nodesFromBottom.push({
        id: `chest_mid_${activeCourseKey}`,
        title: 'Xazina Sandig‘i',
        subtitle: `O‘rta marra mukofoti: +25 XP va 15 Olmos`,
        nodeType: 'CHEST',
        status: 'LOCKED',
        stars: 0,
        horizontalOffsetRatio: 0,
        xpReward: 25,
        stepIndexFromBottom: stepCounter++,
        isChest: true,
      });
    }

    // Determine status: completed if in completedLevelIds or if earlier than first incomplete
    const levelId = `${activeCourseKey}_lvl_${idx + 1}`;
    nodesFromBottom.push({
      id: levelId,
      title: topic.title,
      subtitle: topic.subtitle,
      nodeType: topic.nodeType,
      status: 'LOCKED', // will be resolved in next pass
      stars: 0,
      horizontalOffsetRatio: 0, // will calculate sinusoidal wave
      xpReward: topic.xpReward,
      stepIndexFromBottom: stepCounter++,
    });
  });

  // Top final Grand Chest / Trophy at the apex of the mountain
  nodesFromBottom.push({
    id: `chest_grand_${activeCourseKey}`,
    title: 'Yakuniy Katta Xazina & Sertifikat',
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

  // Now resolve statuses and sinusoidal horizontal offsets:
  // Step 0 (Lesson 1) is at the bottom.
  let foundCurrent = false;

  const resolvedNodes = nodesFromBottom.map((node, i) => {
    const isCompleted =
      completedLevelIds.includes(node.id) ||
      (i === 0 && completedLevelIds.some((id) => id.startsWith(activeCourseKey) || id === 'lvl_1'));
    let status: 'COMPLETED' | 'CURRENT' | 'LOCKED' = 'LOCKED';

    if (isCompleted) {
      status = 'COMPLETED';
    } else if (!foundCurrent) {
      status = 'CURRENT';
      foundCurrent = true;
    } else {
      status = 'LOCKED';
    }

    // Horizontal offset: Unique zigzag geometry for each of the 11 courses!
    // The final apex milestone chest sits centered (0), all other levels & mid-chests follow the asphalt highway
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

  // Make sure at least the first node is CURRENT if none are completed
  if (!resolvedNodes.some((n) => n.status === 'CURRENT' || n.status === 'COMPLETED')) {
    resolvedNodes[0].status = 'CURRENT';
  }

  // Visual order from TOP (Apex Grand Chest) to BOTTOM (1-Dars)
  const visualNodesFromTopToBottom = [...resolvedNodes].reverse();

  // Trigger 3D padlock unlock + chain snap + particle burst + road light surge
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
        colors: ['#FFD700', '#58CC02', '#38BDF8', '#F59E0B', '#A855F7'],
      });
    } catch {
      // Ignore confetti errors
    }

    unlockTimeoutRef.current = window.setTimeout(() => {
      setUnlockingNodeId(null);
    }, 1450);
  };

  // Locked node click: ONLY shake/rattle the 3D lock + metallic sound + vibration (never open modal)
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

  // Detect when a lesson was just completed and play the 3D unlock ceremony on the newly unlocked node
  useEffect(() => {
    if (!recentlyCompletedLevelId) return;

    // Find the newly active CURRENT node (or the node right after the completed one)
    const completedIdx = resolvedNodes.findIndex((n) => n.id === recentlyCompletedLevelId);
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

  // Scroll to active/current level or bottom on initial course change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentNodeRef.current) {
        currentNodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (bottomMarkerRef.current) {
        bottomMarkerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [activeCourseKey]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (rattleTimeoutRef.current) window.clearTimeout(rattleTimeoutRef.current);
      if (unlockTimeoutRef.current) window.clearTimeout(unlockTimeoutRef.current);
    };
  }, []);

  const handleStartNode = (node: LevelNodeItem) => {
    setSelectedNode(null);
    if (node.nodeType === 'MIC') {
      navigate('lesson_detail', { levelId: node.id });
    } else if (node.nodeType === 'PRACTICE' || node.nodeType === 'STAR') {
      navigate('quiz', { levelId: node.id });
    } else if (node.nodeType === 'CHEST') {
      // Chest awards XP & diamonds and unlocks the next node right away or opens result
      awardXpAndDiamonds(node.xpReward, 15, node.id);
      navigate('lesson_result', { levelId: node.id });
    } else {
      navigate('lesson_detail', { levelId: node.id });
    }
  };

  // Complete current active lesson & immediately watch the next 3D lock open on the roadmap
  const handleQuickCompleteAndUnlockNext = (node: LevelNodeItem) => {
    setSelectedNode(null);
    awardXpAndDiamonds(node.xpReward, node.nodeType === 'CHEST' ? 15 : 5, node.id);
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

  // Coordinate calculations for the dynamic SVG connecting road
  const stepHeight = 110;
  const topPadding = 60;
  const totalSvgHeight = (visualNodesFromTopToBottom.length - 1) * stepHeight + topPadding * 2;

  // Build SVG coordinates for each node from top (index 0) to bottom (index N-1)
  const svgPoints = visualNodesFromTopToBottom.map((node, vIdx) => {
    const x = 180 + node.horizontalOffsetRatio * 150;
    const y = topPadding + vIdx * stepHeight;
    return { x, y };
  });

  // Full pathD for base roadbed shadow & shoulder
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

  // Individual road segments from lower node (svgPoints[i]) climbing UP to upper node (svgPoints[i - 1])
  const roadSegments = [];
  for (let i = 1; i < svgPoints.length; i++) {
    const upperNode = visualNodesFromTopToBottom[i - 1];
    const lowerNode = visualNodesFromTopToBottom[i];
    const pUpper = svgPoints[i - 1];
    const pLower = svgPoints[i];
    const cy = (pUpper.y + pLower.y) / 2;
    // Path drawn from lower node UP to upper node so stroke-dashoffset animates upwards!
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

  const biome = BIOMES[activeCourseKey] || BIOMES['grammar_fundamentals'];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${biome.bgGradient} pb-28 text-[#1D1B20] transition-colors duration-500`}>
      {/* ==========================================
          1. TOP DUOLINGO STATUS BAR
         ========================================== */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] px-4 py-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-[#1D1B20] transition-colors cursor-pointer"
            aria-label="Orqaga"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Language Flag Chip */}
          <div className="px-2.5 py-1 rounded-lg bg-[#F0F0F0] border border-[#E0E0E0] text-xs font-bold text-gray-700 flex items-center gap-1.5 select-none">
            <span>🇺🇸</span>
            <span>English</span>
          </div>
        </div>

        {/* Streak Flame */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFF4E5] text-[#FF9600] font-black text-xs">
          <Flame className="w-4 h-4 fill-[#FF9600]" />
          <span>{streakDays}</span>
        </div>

        {/* Diamonds */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#E5F6FE] text-[#1CB0F6] font-black text-xs">
          <span>💎</span>
          <span>{diamonds.toLocaleString()}</span>
        </div>

        {/* Course Topics Total */}
        <div className="px-2.5 py-1 rounded-xl bg-[#F3EFFC] text-[#5E4B8B] font-bold text-xs flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{topics.length} dars</span>
        </div>
      </div>

      <div className="px-4 pt-3 max-w-md mx-auto">
        {/* ==========================================
            2. DUOLINGO UNIT BANNER WITH 3D DEPTH & BIOME TAG
           ========================================== */}
        <div className="relative rounded-2xl bg-[#46A302] pb-1.5 shadow-md">
          <div className="rounded-2xl bg-[#58CC02] p-4 text-white flex items-center justify-between">
            <div className="pr-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-black tracking-wider uppercase text-white/90">
                  {curriculum.section}
                </span>
                <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-bold">
                  {completedCount}/{topics.length} yakunlandi
                </span>
                {/* Course Biome Environment Badge */}
                <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <span>{biome.badgeEmoji}</span>
                  <span>{biome.nameUz}</span>
                </span>
              </div>
              <h2 className="text-xl font-black mt-1 tracking-tight">{curriculum.title}</h2>
              <p className="text-xs text-white/90 mt-0.5 font-medium line-clamp-1">
                {biome.subtitleUz || curriculum.subtitle}
              </p>
            </div>

            <button
              onClick={() => navigate('courses')}
              className="w-11 h-11 shrink-0 rounded-xl bg-white/20 border border-white/50 flex items-center justify-center text-white hover:bg-white/30 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Barcha Kurslar"
            >
              <BookOpen className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ==========================================
            ROADMAP & 3D PADLOCK STATUS INDICATOR
           ========================================== */}
        <div className="mt-3 flex items-center justify-between gap-2 text-xs font-bold text-[#374151] bg-white/90 backdrop-blur-xs py-2 px-3 rounded-xl border border-white/70 shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm shrink-0">🔐</span>
            <div className="truncate">
              <span className="font-extrabold text-[#111827]">3D Qulf Yo‘li: </span>
              <span className="text-gray-600 font-medium">Darsni tugatib keyingi qulfni oching</span>
            </div>
          </div>

          {activeCurrentNode ? (
            <button
              onClick={() => handleQuickCompleteAndUnlockNext(activeCurrentNode)}
              className="shrink-0 flex items-center gap-1 text-[11px] font-extrabold text-amber-950 bg-gradient-to-r from-[#FFD700] to-[#F59E0B] hover:from-[#FDE047] hover:to-[#F59E0B] px-2.5 py-1 rounded-lg shadow-2xs active:scale-95 transition-all cursor-pointer border border-amber-300"
              title="Hozirgi darsni yakunlab keyingi 3D qulf ochilishini ko‘rish"
            >
              <Sparkles className="w-3 h-3 text-amber-900" />
              <span>Qulfni ochish</span>
            </button>
          ) : (
            <div className="shrink-0 flex items-center gap-1 text-[11px] font-extrabold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-lg">
              <Trophy className="w-3 h-3 text-amber-500" />
              <span>Barchasi ochiq!</span>
            </div>
          )}
        </div>

        {/* ==========================================
            3. DYNAMIC ROADMAP: 3D NATURE & ASPHALT HIGHWAY
           ========================================== */}
        <div
          className="relative mt-4 rounded-3xl overflow-hidden shadow-inner bg-white/20 backdrop-blur-2xs border border-white/40"
          style={{ height: `${totalSvgHeight}px` }}
        >
          {/* A. 3D Animated Nature Landscape (Rivers, Waterfalls, Windmills, Trees, Bridges) */}
          <CourseNatureLandscape
            courseKey={activeCourseKey}
            totalHeight={totalSvgHeight}
            points={svgPoints}
          />

          {/* B. Real Multi-Layered Asphalt Highway ("Asfalt Yoli") with Locked vs Illuminated Segments */}
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none select-none z-10"
            viewBox={`0 0 360 ${totalSvgHeight}`}
            fill="none"
          >
            {/* 1. Continuous Road bed drop shadow on terrain */}
            <path
              d={pathD}
              stroke="rgba(15, 23, 42, 0.24)"
              strokeWidth="38"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* 2. Continuous Concrete curb & gravel shoulder */}
            <path
              d={pathD}
              stroke="#475569"
              strokeWidth="33"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* 3. Segment-by-Segment Locked vs Unlocked/Illuminated Asphalt Road */}
            {roadSegments.map((seg) => (
              <g key={seg.id}>
                {seg.isSegmentUnlocked ? (
                  <>
                    {/* Illuminated Golden-Emerald outer aura on unlocked road */}
                    <path
                      d={seg.segPathUpward}
                      stroke="rgba(250, 204, 21, 0.28)"
                      strokeWidth="34"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Crisp white highway border edges */}
                    <path
                      d={seg.segPathUpward}
                      stroke="#F8FAFC"
                      strokeWidth="28"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Rich dark asphalt highway pavement */}
                    <path
                      d={seg.segPathUpward}
                      stroke="#1E293B"
                      strokeWidth="24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Smooth illuminated asphalt inner surface */}
                    <path
                      d={seg.segPathUpward}
                      stroke="#334155"
                      strokeWidth="21"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Vibrant glowing golden yellow center lane divider */}
                    <path
                      d={seg.segPathUpward}
                      stroke="#FBBF24"
                      strokeWidth="3.5"
                      strokeDasharray="10 14"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                ) : (
                  <>
                    {/* Locked/Unreached Road Segment: muted slate edges & darker unlit asphalt */}
                    <path
                      d={seg.segPathUpward}
                      stroke="#94A3B8"
                      strokeWidth="27"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.7"
                    />
                    <path
                      d={seg.segPathUpward}
                      stroke="#1E2430"
                      strokeWidth="23"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.82"
                    />
                    <path
                      d={seg.segPathUpward}
                      stroke="#262D3B"
                      strokeWidth="20"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.82"
                    />
                    {/* Dimmed grey-slate dashed center line on locked road */}
                    <path
                      d={seg.segPathUpward}
                      stroke="#64748B"
                      strokeWidth="2.8"
                      strokeDasharray="8 16"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.65"
                    />
                  </>
                )}

                {/* Animated Golden-Emerald Light Surge when this segment is actively unlocking! */}
                {seg.isSegmentUnlockingNow && (
                  <>
                    <path
                      d={seg.segPathUpward}
                      stroke="#FDE047"
                      strokeWidth="26"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="320"
                      className="anim-road-surge"
                      opacity="0.75"
                    />
                    <path
                      d={seg.segPathUpward}
                      stroke="#4ADE80"
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

          {/* C. Level Node Checkpoints on the Asphalt Highway */}
          <div className="relative z-20 w-full h-full">
            {visualNodesFromTopToBottom.map((node, vIdx) => {
              const isCurrent = node.status === 'CURRENT';
              const isCompleted =
                node.status === 'COMPLETED' || completedLevelIds.includes(node.id);
              const isLocked = !isCurrent && !isCompleted;
              const isChest = node.nodeType === 'CHEST';
              const isFirstLessonAtBottom = vIdx === visualNodesFromTopToBottom.length - 1;
              const isApexAtTop = vIdx === 0;
              const isRattling = rattlingNodeId === node.id;
              const isUnlocking = unlockingNodeId === node.id;
              const showPadlockOverlay = isLocked || isUnlocking;

              // Top position
              const topPx = topPadding + vIdx * stepHeight - 36;
              // Horizontal translation
              const xTranslate = node.horizontalOffsetRatio * 150;

              return (
                <div
                  key={node.id}
                  ref={isCurrent ? currentNodeRef : isFirstLessonAtBottom ? bottomMarkerRef : null}
                  className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center transition-transform"
                  style={{
                    top: `${topPx}px`,
                    transform: `translate(calc(-50% + ${xTranslate}px), 0)`,
                  }}
                >
                  {/* Floating Hint Tooltip when user taps a locked node */}
                  {isRattling && isLocked && (
                    <div className="absolute -top-9 whitespace-nowrap bg-[#1E293B]/95 text-amber-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-lg border border-amber-400/40 z-40 animate-bounce pointer-events-none">
                      🔒 Oldingi darsni tugating!
                    </div>
                  )}

                  {/* Start or Peak Badge */}
                  {isApexAtTop && (
                    <div className="mb-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 animate-pulse">
                      <Trophy className="w-3 h-3" />
                      <span>Cho‘qqi (Final)</span>
                    </div>
                  )}

                  {isFirstLessonAtBottom && (
                    <div className="mb-1 bg-[#58CC02] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                      <Flag className="w-3 h-3" />
                      <span>1-Dars: Boshlanish</span>
                    </div>
                  )}

                  <div className="relative flex items-center justify-center">
                    {/* Glowing ring for current node */}
                    {isCurrent && (
                      <span className="absolute -inset-3 rounded-full bg-[#58CC02]/30 animate-ping pointer-events-none" />
                    )}

                    {/* Mascot owl next to current node */}
                    {isCurrent && (
                      <div
                        className={`absolute -top-3 ${
                          node.horizontalOffsetRatio <= 0 ? '-right-11' : '-left-11'
                        } w-11 h-11 rounded-full bg-[#E8F8EE] border-2 border-[#58CC02] flex items-center justify-center text-xl shadow-md z-20 animate-bounce`}
                      >
                        🦉
                      </div>
                    )}

                    {/* Tactile 3D Circular Button */}
                    <div
                      onClick={() => {
                        if (isLocked) {
                          handleLockedNodeClick(node.id);
                        } else {
                          setSelectedNode(node);
                        }
                      }}
                      className={`relative w-18 h-18 rounded-full cursor-pointer select-none duo-btn-3d ${
                        isChest
                          ? isLocked
                            ? 'bg-[#8C7A5B] pb-1.5'
                            : 'bg-[#E5A100] pb-1.5'
                          : isCompleted || isCurrent
                          ? 'bg-[#46A302] pb-1.5'
                          : 'bg-[#64748B] pb-1.5'
                      } shadow-md active:scale-95 transition-all`}
                    >
                      <div
                        className={`w-full h-full rounded-full flex items-center justify-center text-white ${
                          isChest
                            ? isLocked
                              ? 'bg-[#CBD5E1] text-[#64748B]'
                              : 'bg-[#FFC800] text-amber-950'
                            : isCompleted || isCurrent
                            ? 'bg-[#58CC02]'
                            : 'bg-[#94A3B8] text-[#475569]'
                        }`}
                      >
                        {isCompleted && !isChest ? (
                          <Check className="w-8 h-8 stroke-[3]" />
                        ) : (
                          <div className={isLocked ? 'opacity-30 scale-90 transition-all' : ''}>
                            {node.nodeType === 'MASCOT_INTRO' && <span className="text-2xl">🦉</span>}
                            {node.nodeType === 'STAR' && (
                              <Star className="w-8 h-8 fill-current stroke-current" />
                            )}
                            {node.nodeType === 'READING' && (
                              <BookOpen className="w-7 h-7 stroke-[2.5]" />
                            )}
                            {node.nodeType === 'CHEST' && (
                              <span className="text-2xl">🎁</span>
                            )}
                            {node.nodeType === 'MIC' && <Mic className="w-7 h-7 stroke-[2.5]" />}
                            {node.nodeType === 'PRACTICE' && (
                              <RotateCcw className="w-7 h-7 stroke-[2.5]" />
                            )}
                            {node.nodeType === 'CAMERA' && <span className="text-xl">📹</span>}
                            {node.nodeType === 'HEADPHONES' && (
                              <Headphones className="w-7 h-7 stroke-[2.5]" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* 3D Gold-Silver Padlock & Silver Chain Ring Overlay */}
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

                  {/* Stars badge for completed or title chip */}
                  {isCompleted ? (
                    <div className="flex items-center gap-1 mt-1 bg-white/90 px-2 py-0.5 rounded-full shadow-2xs border border-[#F0EFF5]">
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className="w-3 h-3 fill-[#FFC800] text-[#FFC800]"
                        />
                      ))}
                    </div>
                  ) : (
                    <span
                      className={`text-[10px] font-bold mt-1.5 px-2 py-0.5 rounded-md max-w-[118px] text-center truncate ${
                        isCurrent
                          ? 'bg-[#58CC02] text-white shadow-2xs'
                          : 'bg-white/80 text-slate-600'
                      }`}
                    >
                      {node.title.split(':')[0]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom anchor for scrolling */}
        <div ref={bottomMarkerRef} className="pt-6 pb-2 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-500 shadow-2xs">
            <span>🏁 1-Darsdan boshlab qulflarni ochib cho‘qqiga chiqing</span>
          </div>
        </div>
      </div>

      {/* Floating Action Controls */}
      <div className="fixed bottom-20 right-4 z-20 flex flex-col gap-2">
        {/* Jump to Current Lesson */}
        <button
          onClick={scrollToCurrentLesson}
          className="w-12 h-12 rounded-full bg-[#58CC02] border-2 border-white shadow-lg flex items-center justify-center text-white hover:bg-[#46A302] transition-all cursor-pointer active:scale-95"
          title="Hozirgi darsga o‘tish"
        >
          <Flag className="w-5 h-5" />
        </button>

        {/* Jump to Top */}
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-white border border-[#E0E0E0] shadow-md flex items-center justify-center text-[#1CB0F6] hover:bg-[#F3EFFC] transition-all cursor-pointer active:scale-95"
          title="Cho‘qqiga chiqish"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* ==========================================
          4. INTERACTIVE LEVEL DETAIL BOTTOM SHEET MODAL (Only for Unlocked/Current/Completed Nodes)
         ========================================== */}
      {selectedNode && (
        <div
          onClick={() => setSelectedNode(null)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end justify-center animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-t-3xl p-6 shadow-2xl animate-slide-up border-t border-[#F0EFF5]"
          >
            {/* Top drag handle */}
            <div className="w-12 h-1.5 rounded-full bg-[#E0E0E0] mx-auto mb-4" />

            <div className="flex justify-between items-start">
              <span
                className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                  selectedNode.status === 'COMPLETED'
                    ? 'bg-[#E8F8EE] text-[#27AE60]'
                    : 'bg-[#FFF4E5] text-[#FF9600]'
                }`}
              >
                {selectedNode.status === 'COMPLETED'
                  ? 'YAKUNLANGAN (3/3 ⭐)'
                  : 'HOZIRGI OCHIQ BOSQICH'}
              </span>

              <button
                onClick={() => setSelectedNode(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 mt-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F8EE] flex items-center justify-center text-2xl shrink-0">
                  {selectedNode.nodeType === 'CHEST' ? '🎁' : '📘'}
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#1D1B20] leading-tight">
                    {selectedNode.title}
                  </h3>
                  <p className="text-xs text-[#757575] mt-0.5">{selectedNode.subtitle}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  playTts(
                    `Welcome to ${curriculum.title}! Let's practice ${selectedNode.title.replace(/^\d+-Dars:\s*/i, '')}.`
                  )
                }
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-xs active:scale-95 ${
                  isTtsSpeaking
                    ? 'bg-[#58CC02] text-white animate-pulse'
                    : 'bg-[#F1EDFA] text-[#5E4B8B] hover:bg-[#5E4B8B] hover:text-white'
                }`}
                title="Gemini 3.8 ovozida tinglash"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Reward Card */}
            <div className="mt-4 p-3.5 rounded-2xl bg-[#FFF8E7] border border-[#FFC800] flex items-center justify-around">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚡</span>
                <span className="text-sm font-extrabold text-[#D97706]">
                  +{selectedNode.xpReward} XP
                </span>
              </div>
              <div className="w-px h-6 bg-[#FFD97D]" />
              <div className="flex items-center gap-2">
                <span className="text-lg">💎</span>
                <span className="text-sm font-extrabold text-[#0284C7]">
                  {selectedNode.nodeType === 'CHEST' ? '+15 Olmos' : '+5 Olmos'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-2.5">
              <TalkMeButton
                text={
                  selectedNode.nodeType === 'CHEST'
                    ? 'XAZINANI OCHISH'
                    : `DARSNI BOSHLASH (+${selectedNode.xpReward} XP)`
                }
                onClick={() => handleStartNode(selectedNode)}
                className="bg-[#58CC02] hover:bg-[#46A302] text-white shadow-md text-base"
              />

              {selectedNode.status === 'CURRENT' && (
                <button
                  onClick={() => handleQuickCompleteAndUnlockNext(selectedNode)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 font-extrabold text-xs shadow-sm hover:brightness-105 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Darsni yakunlab keyingi 3D qulfni ochish ⚡</span>
                </button>
              )}

              <button
                onClick={() => setSelectedNode(null)}
                className="w-full py-2 text-xs font-bold text-gray-400 hover:text-gray-600 cursor-pointer text-center"
              >
                YOPISH
              </button>
            </div>
          </div>
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
