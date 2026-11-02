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

export interface RawCourseTopic {
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
export const COURSE_CURRICULA: Record<
  string,
  {
    title: string;
    subtitle: string;
    section: string;
    topics: RawCourseTopic[];
  }
> = {
  grammar_fundamentals: {
    title: 'Grammar Fundamentals & A0',
    subtitle: 'Noldan boshlovchilar (A0) va asosiy qoidalar',
    section: 'BO‘LIM 1, UNIT 1',
    topics: [
      {
        title: 'Lesson 1 — Hello! (A0)',
        subtitle: 'A0 Absolute Beginner • Salomlashish, 6 ta so‘z va 5 mashq',
        nodeType: 'MASCOT_INTRO',
        xpReward: 50,
      },
      {
        title: '2-Dars: Grammar Fundamentals',
        subtitle: 'Ingliz tili grammatikasi asoslari (8 bo‘lim, 10 mashq, Krossvord)',
        nodeType: 'STAR',
        xpReward: 25,
      },
      {
        title: '3-Dars: Parts of Speech Introduction',
        subtitle: 'So‘z turkumlariga kirish va gapdagi vazifalar',
        nodeType: 'READING',
        xpReward: 20,
      },
      {
        title: '4-Dars: To Be fe’li (Am, Is, Are)',
        subtitle: 'Darak va sodda iboralar tuzish',
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
  } = useApp();

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

  const midIndex = Math.floor(topics.length / 2);

  interface ConstructedNode extends LevelNodeItem {
    stepIndexFromBottom: number;
    isChest?: boolean;
    isMilestone?: boolean;
  }

  const nodesFromBottom: ConstructedNode[] = [];
  let stepCounter = 0;

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

  if (!resolvedNodes.some((n) => n.status === 'CURRENT' || n.status === 'COMPLETED')) {
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
    if (!recentlyCompletedLevelId) return;

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

  useEffect(() => {
    return () => {
      if (rattleTimeoutRef.current) window.clearTimeout(rattleTimeoutRef.current);
      if (unlockTimeoutRef.current) window.clearTimeout(unlockTimeoutRef.current);
    };
  }, []);

  // Direct screen navigation instead of bottom sheet modal
  const handleOpenNodeScreen = (node: LevelNodeItem) => {
    if (node.nodeType === 'CHEST') {
      awardXpAndDiamonds(node.xpReward, 15, node.id);
      navigate('lesson_result', { levelId: node.id, courseId: activeCourseKey });
    } else {
      navigate('lesson_detail', {
        courseId: activeCourseKey,
        levelId: node.id,
      });
    }
  };

  const handleQuickCompleteAndUnlockNext = (node: LevelNodeItem) => {
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

  const stepHeight = 110;
  const topPadding = 60;
  const totalSvgHeight = (visualNodesFromTopToBottom.length - 1) * stepHeight + topPadding * 2;

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

  const biome = BIOMES[activeCourseKey] || BIOMES['grammar_fundamentals'];

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

            <div>
              <span className="text-xs font-semibold text-[#616161] block leading-none">
                {curriculum.section}
              </span>
              <span className="text-sm font-bold text-[#212121] truncate max-w-[180px] block mt-0.5">
                {curriculum.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-[#616161] tabular-nums">
            <span className="flex items-center gap-1 text-[#3949AB]">
              <Flame className="w-4 h-4" />
              {streakDays} kun
            </span>
            <span aria-hidden="true">·</span>
            <span>{diamonds.toLocaleString()} olmos</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#00897B]">{topics.length} dars</span>
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
                {completedCount}/{topics.length} yakunlandi
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

        {/* 3. ROADMAP STATUS & QUICK UNLOCK BAR */}
        <div className="flex items-center justify-between gap-2 text-xs bg-white py-2.5 px-3.5 rounded-xl border border-[#E0E4EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="min-w-0 truncate">
            <span className="font-bold text-[#212121]">O‘quv Xaritasi: </span>
            <span className="text-[#616161]">Mavzuni bosing va alohida sahifada o‘rganing</span>
          </div>

          {activeCurrentNode ? (
            <button
              onClick={() => handleQuickCompleteAndUnlockNext(activeCurrentNode)}
              className="shrink-0 min-h-[34px] px-3 py-1 rounded-lg bg-[#00897B] hover:bg-[#00695C] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
              title="Hozirgi darsni yakunlab keyingi qulfni ochish"
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
              const isCompleted =
                node.status === 'COMPLETED' || completedLevelIds.includes(node.id);
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
                  ref={isCurrent ? currentNodeRef : isFirstLessonAtBottom ? bottomMarkerRef : null}
                  className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center transition-transform"
                  style={{
                    top: `${topPx}px`,
                    transform: `translate(calc(-50% + ${xTranslate}px), 0)`,
                  }}
                >
                  {isRattling && isLocked && (
                    <div className="absolute -top-9 whitespace-nowrap bg-[#212121] text-white text-[11px] font-semibold px-3 py-1 rounded-md shadow-md z-40 pointer-events-none">
                      Oldingi darsni tugating
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
                      <span>1-Dars: Boshlanish</span>
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
                          <div className={isLocked ? 'opacity-30 scale-90 transition-all' : ''}>
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
                            {node.nodeType === 'MIC' && <Mic className="w-7 h-7 stroke-[2.2]" />}
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
                    <div className="flex items-center gap-1 mt-1.5 bg-white/95 px-2.5 py-0.5 rounded-md shadow-2xs border border-[#E0E4EC]">
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className="w-3 h-3 fill-[#00897B] text-[#00897B]"
                        />
                      ))}
                    </div>
                  ) : (
                    <span
                      className={`text-[10px] font-bold mt-1.5 px-2.5 py-0.5 rounded-md max-w-[124px] text-center truncate ${
                        isCurrent
                          ? 'bg-[#3949AB] text-white shadow-2xs'
                          : 'bg-white/90 text-[#212121] border border-[#E0E4EC]'
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

        {/* Bottom anchor */}
        <div ref={bottomMarkerRef} className="pt-4 pb-2 text-center">
          <span className="text-xs font-medium text-[#616161]">
            1-Darsdan boshlab bosqichma-bosqich yuqoriga harakatlaning
          </span>
        </div>
      </div>

      {/* Floating Action Controls */}
      <div className="fixed bottom-20 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={scrollToCurrentLesson}
          className="w-11 h-11 rounded-lg bg-[#3949AB] border border-white/40 shadow-md flex items-center justify-center text-white hover:bg-[#283593] transition-colors cursor-pointer"
          title="Hozirgi darsga o‘tish"
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
