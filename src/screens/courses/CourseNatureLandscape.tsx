import React from 'react';

export interface BiomeConfig {
  id: string;
  nameUz: string;
  subtitleUz: string;
  badgeEmoji: string;
  themeStyle:
    | 'emerald'
    | 'alpine'
    | 'canyon'
    | 'flower'
    | 'autumn'
    | 'misty'
    | 'windy'
    | 'tropical'
    | 'citadel'
    | 'oasis'
    | 'coastal';
  bgGradient: string;
  riverGradient: [string, string];
  grassTone: string;
  hillTone: string;
  skyTint: string;
  lawnColors: [string, string, string]; // [top sunlit lawn, mid lush lawn, deep meadow]
  lawnStripe: string;
  flowerColors: [string, string, string];
}

export const BIOMES: Record<string, BiomeConfig> = {
  grammar_fundamentals: {
    id: 'grammar_fundamentals',
    nameUz: 'Yashil Gazon Vodiysi & Daryo',
    subtitleUz: 'Pixar uslubidagi yam-yashil maysazor, soylik va tegirmon',
    badgeEmoji: '🌿',
    themeStyle: 'emerald',
    bgGradient: 'from-[#D9F99D] via-[#BBF7D0] to-[#86EFAC]',
    riverGradient: ['#38BDF8', '#0284C7'],
    grassTone: '#4ADE80',
    hillTone: '#16A34A',
    skyTint: '#E0F2FE',
    lawnColors: ['#A3E635', '#4ADE80', '#22C55E'],
    lawnStripe: '#84CC16',
    flowerColors: ['#FDE047', '#FB7185', '#FFFFFF'],
  },
  nouns: {
    id: 'nouns',
    nameUz: 'Alp Maysazori & Sharshara',
    subtitleUz: 'Tog‘ etagidagi zumrad gazon va sharshara',
    badgeEmoji: '🏔️',
    themeStyle: 'alpine',
    bgGradient: 'from-[#E0F2FE] via-[#D1FAE5] to-[#A7F3D0]',
    riverGradient: ['#60A5FA', '#2563EB'],
    grassTone: '#34D399',
    hillTone: '#059669',
    skyTint: '#DBEAFE',
    lawnColors: ['#6EE7B7', '#34D399', '#10B981'],
    lawnStripe: '#10B981',
    flowerColors: ['#93C5FD', '#FFFFFF', '#FDE047'],
  },
  verbs: {
    id: 'verbs',
    nameUz: 'Quyoshli Vodiy & Kanyon Oqimi',
    subtitleUz: 'Issiq quyosh nuri ostidagi yashil maysazor va tezkor daryo',
    badgeEmoji: '⚡',
    themeStyle: 'canyon',
    bgGradient: 'from-[#FEF08A] via-[#D9F99D] to-[#86EFAC]',
    riverGradient: ['#38BDF8', '#0891B2'],
    grassTone: '#84CC16',
    hillTone: '#4D7C0F',
    skyTint: '#FEF3C7',
    lawnColors: ['#BEF264', '#84CC16', '#4ADE80'],
    lawnStripe: '#65A30D',
    flowerColors: ['#FB923C', '#FDE047', '#F43F5E'],
  },
  adjectives: {
    id: 'adjectives',
    nameUz: 'Sehrli Gulzor & Baxmal Gazon',
    subtitleUz: 'Rang-barang gullar bilan qoplangan Pixar maysazori',
    badgeEmoji: '🌸',
    themeStyle: 'flower',
    bgGradient: 'from-[#FCE7F3] via-[#D9F99D] to-[#86EFAC]',
    riverGradient: ['#60A5FA', '#8B5CF6'],
    grassTone: '#4ADE80',
    hillTone: '#16A34A',
    skyTint: '#FAE8FF',
    lawnColors: ['#A3E635', '#4ADE80', '#22C55E'],
    lawnStripe: '#65A30D',
    flowerColors: ['#F472B6', '#C084FC', '#FDE047'],
  },
  numerals: {
    id: 'numerals',
    nameUz: 'Oltin-Yashil Bog‘ & Suv Tegirmoni',
    subtitleUz: 'Yorqin maysazor, oltin daraxtlar va charxpalak',
    badgeEmoji: '🍂',
    themeStyle: 'autumn',
    bgGradient: 'from-[#FEF3C7] via-[#D9F99D] to-[#86EFAC]',
    riverGradient: ['#38BDF8', '#0284C7'],
    grassTone: '#84CC16',
    hillTone: '#15803D',
    skyTint: '#FEF9C3',
    lawnColors: ['#BEF264', '#84CC16', '#22C55E'],
    lawnStripe: '#65A30D',
    flowerColors: ['#F59E0B', '#FDE047', '#EF4444'],
  },
  pronouns: {
    id: 'pronouns',
    nameUz: 'Zumrad Qarag‘ayzor & Moviy Ko‘l',
    subtitleUz: 'Qalin yashil gazon o‘tlari va sokin ko‘l bo‘yi',
    badgeEmoji: '🌲',
    themeStyle: 'misty',
    bgGradient: 'from-[#CCFBF1] via-[#BBF7D0] to-[#6EE7B7]',
    riverGradient: ['#2DD4BF', '#0D9488'],
    grassTone: '#34D399',
    hillTone: '#047857',
    skyTint: '#CCFBF1',
    lawnColors: ['#86EFAC', '#34D399', '#10B981'],
    lawnStripe: '#059669',
    flowerColors: ['#5EEAD4', '#FFFFFF', '#FDE047'],
  },
  adverbs: {
    id: 'adverbs',
    nameUz: 'Shamolli Tepaliklar & Yashil Yaylov',
    subtitleUz: 'Mayin tebranuvchi gazon o‘tlar va shamol turbinalari',
    badgeEmoji: '💨',
    themeStyle: 'windy',
    bgGradient: 'from-[#E0F2FE] via-[#D9F99D] to-[#86EFAC]',
    riverGradient: ['#38BDF8', '#2563EB'],
    grassTone: '#4ADE80',
    hillTone: '#15803D',
    skyTint: '#E0F2FE',
    lawnColors: ['#A3E635', '#4ADE80', '#16A34A'],
    lawnStripe: '#65A30D',
    flowerColors: ['#38BDF8', '#FFFFFF', '#FDE047'],
  },
  prepositions: {
    id: 'prepositions',
    nameUz: 'Tropik Gazon Orollari & Moviy Lagun',
    subtitleUz: 'Palmalar, yam-yashil maysazor va moviy suv',
    badgeEmoji: '🏝️',
    themeStyle: 'tropical',
    bgGradient: 'from-[#CFFAFE] via-[#D9F99D] to-[#6EE7B7]',
    riverGradient: ['#06B6D4', '#0284C7'],
    grassTone: '#4ADE80',
    hillTone: '#0D9488',
    skyTint: '#E0F2FE',
    lawnColors: ['#A3E635', '#34D399', '#10B981'],
    lawnStripe: '#16A34A',
    flowerColors: ['#FB7185', '#FDE047', '#38BDF8'],
  },
  sentences: {
    id: 'sentences',
    nameUz: 'Qirollik Bog‘i & Tosh Qal‘a',
    subtitleUz: 'Tekis o‘rilgan saroy gazoni, daryo va baland qal‘a',
    badgeEmoji: '🏰',
    themeStyle: 'citadel',
    bgGradient: 'from-[#EDE9FE] via-[#D9F99D] to-[#86EFAC]',
    riverGradient: ['#38BDF8', '#1D4ED8'],
    grassTone: '#4ADE80',
    hillTone: '#15803D',
    skyTint: '#F5F3FF',
    lawnColors: ['#A3E635', '#4ADE80', '#16A34A'],
    lawnStripe: '#65A30D',
    flowerColors: ['#C084FC', '#F472B6', '#FDE047'],
  },
  adverbials: {
    id: 'adverbials',
    nameUz: 'Yashil Voha Bog‘i & Xurmozor',
    subtitleUz: 'Zilol buloq atrofidagi qalin maysazor va palmalar',
    badgeEmoji: '🏜️',
    themeStyle: 'oasis',
    bgGradient: 'from-[#FEF3C7] via-[#D9F99D] to-[#6EE7B7]',
    riverGradient: ['#22D3EE', '#0891B2'],
    grassTone: '#84CC16',
    hillTone: '#15803D',
    skyTint: '#FFEDD5',
    lawnColors: ['#BEF264', '#4ADE80', '#16A34A'],
    lawnStripe: '#65A30D',
    flowerColors: ['#FBBF24', '#FB7185', '#2DD4BF'],
  },
  articles: {
    id: 'articles',
    nameUz: 'Sohilbo‘yi Maysazori & Dengiz Mayog‘i',
    subtitleUz: 'Dengiz bo‘yidagi yashil tepaliklar va nurli mayoq',
    badgeEmoji: '🌊',
    themeStyle: 'coastal',
    bgGradient: 'from-[#E0F2FE] via-[#D9F99D] to-[#86EFAC]',
    riverGradient: ['#0284C7', '#0369A1'],
    grassTone: '#4ADE80',
    hillTone: '#0284C7',
    skyTint: '#E0F2FE',
    lawnColors: ['#A3E635', '#4ADE80', '#22C55E'],
    lawnStripe: '#65A30D',
    flowerColors: ['#38BDF8', '#FDE047', '#FFFFFF'],
  },
};

/**
 * Generates unique zigzag offset patterns for each course.
 * Range: approx -0.42 to +0.42
 */
export function getCourseZigzagOffset(
  courseKey: string,
  stepIndex: number,
  totalSteps: number
): number {
  switch (courseKey) {
    case 'grammar_fundamentals':
      return Number(
        (Math.sin(stepIndex * 1.3) * 0.38 + Math.cos(stepIndex * 0.65) * 0.08).toFixed(2)
      );

    case 'nouns':
      const nounDir = stepIndex % 2 === 0 ? 0.4 : -0.38;
      const nounShift = 0.88 + ((stepIndex * 3) % 4) * 0.04;
      return Number((nounDir * nounShift).toFixed(2));

    case 'verbs':
      return Number((Math.sin(stepIndex * 1.7) * 0.42).toFixed(2));

    case 'adjectives':
      return Number((Math.sin(stepIndex * 1.15 + 0.4) * 0.41).toFixed(2));

    case 'numerals':
      const numPatterns = [-0.36, 0.35, -0.38, 0.32, -0.3, 0.36];
      return numPatterns[stepIndex % numPatterns.length];

    case 'pronouns':
      const baseWave = Math.sin(stepIndex * 1.35) * 0.36;
      const lakeDrift = stepIndex % 3 === 1 ? 0.12 : -0.06;
      return Number((baseWave + lakeDrift).toFixed(2));

    case 'adverbs':
      const switchback = (stepIndex % 2 === 0 ? 1 : -1) * 0.43;
      return Number((switchback + Math.sin(stepIndex * 0.5) * 0.04).toFixed(2));

    case 'prepositions':
      return Number((Math.cos(stepIndex * 1.25) * 0.4).toFixed(2));

    case 'sentences':
      return Number(
        (Math.sin(stepIndex * 1.05) * 0.38 + Math.sin(stepIndex * 2.1) * 0.12).toFixed(2)
      );

    case 'adverbials':
      return Number((Math.sin(stepIndex * 1.5 + 1.1) * 0.39).toFixed(2));

    case 'articles':
      return Number((Math.cos(stepIndex * 1.6 + 0.3) * 0.41).toFixed(2));

    default:
      return Number((Math.sin(stepIndex * 1.35) * 0.36).toFixed(2));
  }
}

interface NatureProps {
  courseKey: string;
  totalHeight: number;
  points: { x: number; y: number }[];
}

export const CourseNatureLandscape: React.FC<NatureProps> = ({
  courseKey,
  totalHeight,
  points,
}) => {
  const biome = BIOMES[courseKey] || BIOMES['grammar_fundamentals'];

  // Calculate river trajectory that winds dynamically across the terrain
  const riverPoints: { x: number; y: number }[] = [];
  const riverSegments = Math.max(6, Math.floor(totalHeight / 140));
  for (let i = 0; i <= riverSegments; i++) {
    const y = (i / riverSegments) * totalHeight;
    let xOffset = 0;
    if (courseKey === 'grammar_fundamentals' || courseKey === 'sentences') {
      xOffset = Math.sin(i * 1.2) * 90;
    } else if (courseKey === 'nouns' || courseKey === 'verbs') {
      xOffset = Math.cos(i * 1.5) * 110;
    } else if (courseKey === 'prepositions' || courseKey === 'articles') {
      xOffset = Math.sin(i * 0.9) * 120;
    } else {
      xOffset = Math.sin(i * 1.4 + 0.8) * 95;
    }
    riverPoints.push({ x: 180 + xOffset, y });
  }

  let riverPathD = `M ${riverPoints[0].x} ${riverPoints[0].y}`;
  for (let i = 1; i < riverPoints.length; i++) {
    const p0 = riverPoints[i - 1];
    const p1 = riverPoints[i];
    const cy = (p0.y + p1.y) / 2;
    riverPathD += ` C ${p0.x} ${cy}, ${p1.x} ${cy}, ${p1.x} ${p1.y}`;
  }

  const bridgeY1 = totalHeight * 0.35;
  const bridgeY2 = totalHeight * 0.72;

  // Generate Pixar mowed lawn stripes every 150px vertically
  const lawnStripeCount = Math.ceil(totalHeight / 130) + 1;
  const lawnStripes = Array.from({ length: lawnStripeCount }, (_, idx) => idx * 130);

  // Generate procedural Pixar 3D rolling hills down the entire roadmap
  const hillStepCount = Math.ceil(totalHeight / 210) + 1;
  const rollingHills = Array.from({ length: hillStepCount }, (_, idx) => idx * 210);

  // Generate dense Pixar 3D Grass Tufts ("Gazon o'tlari"), Flower Shrubs, and Mossy Rocks
  // distributed across the left, center-side, and right lawn banks for the entire height
  const grassRowCount = Math.ceil(totalHeight / 52);
  const grassElements: {
    id: string;
    x: number;
    y: number;
    scale: number;
    delayed: boolean;
    hasFlower: boolean;
    flowerColor: string;
  }[] = [];

  for (let r = 0; r < grassRowCount; r++) {
    const baseY = 32 + r * 52;
    // Left lawn bank grass tufts
    const leftX1 = 16 + ((r * 23) % 42);
    const leftX2 = 64 + ((r * 37) % 38);
    // Right lawn bank grass tufts
    const rightX1 = 262 + ((r * 29) % 38);
    const rightX2 = 306 + ((r * 19) % 40);

    const fColors = biome.flowerColors;

    grassElements.push({
      id: `g_l1_${r}`,
      x: leftX1,
      y: baseY + ((r * 7) % 16),
      scale: 0.85 + ((r % 3) * 0.15),
      delayed: r % 2 === 0,
      hasFlower: r % 3 === 0,
      flowerColor: fColors[r % fColors.length],
    });

    if (r % 2 === 0) {
      grassElements.push({
        id: `g_l2_${r}`,
        x: leftX2,
        y: baseY + 18,
        scale: 0.78 + ((r % 2) * 0.16),
        delayed: true,
        hasFlower: r % 4 === 0,
        flowerColor: fColors[(r + 1) % fColors.length],
      });
    }

    grassElements.push({
      id: `g_r1_${r}`,
      x: rightX2,
      y: baseY + ((r * 11) % 18),
      scale: 0.88 + ((r % 3) * 0.14),
      delayed: r % 2 === 1,
      hasFlower: r % 3 === 1,
      flowerColor: fColors[(r + 2) % fColors.length],
    });

    if (r % 2 === 1) {
      grassElements.push({
        id: `g_r2_${r}`,
        x: rightX1,
        y: baseY + 20,
        scale: 0.8 + ((r % 2) * 0.14),
        delayed: false,
        hasFlower: r % 4 === 1,
        flowerColor: fColors[r % fColors.length],
      });
    }
  }

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none select-none overflow-hidden"
      viewBox={`0 0 360 ${totalHeight}`}
      preserveAspectRatio="none"
      fill="none"
    >
      <defs>
        {/* Pixar Velvet Lawn Main Background Gradient */}
        <linearGradient id={`pixarLawnBg_${courseKey}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={biome.lawnColors[0]} />
          <stop offset="45%" stopColor={biome.lawnColors[1]} />
          <stop offset="100%" stopColor={biome.lawnColors[2]} />
        </linearGradient>

        {/* Pixar Sunlit Hill Mound Gradient */}
        <linearGradient id={`pixarHillGrad_${courseKey}`} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#ECFCCB" stopOpacity="0.85" />
          <stop offset="35%" stopColor={biome.lawnColors[0]} stopOpacity="0.9" />
          <stop offset="100%" stopColor={biome.lawnColors[2]} stopOpacity="0.95" />
        </linearGradient>

        {/* Pixar Individual Grass Blade 3D Gradient */}
        <linearGradient id="pixarGrassBladeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ECFCCB" />
          <stop offset="35%" stopColor="#84CC16" />
          <stop offset="75%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#14532D" />
        </linearGradient>

        <linearGradient id="pixarGrassBladeRich" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#BEF264" />
          <stop offset="45%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>

        {/* Golden Sunbeam Gradient */}
        <linearGradient id="pixarSunbeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.55" />
          <stop offset="50%" stopColor="#FDE047" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* River Water Gradient */}
        <linearGradient id={`riverGrad_${courseKey}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={biome.riverGradient[0]} stopOpacity="0.95" />
          <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.92" />
          <stop offset="100%" stopColor={biome.riverGradient[1]} stopOpacity="0.98" />
        </linearGradient>

        {/* Pixar 3D Volumetric Tree Canopy Gradients (Radial for spherical 3D look) */}
        <radialGradient id="pixarCanopyLightGreen" cx="32%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#ECFCCB" />
          <stop offset="30%" stopColor="#84CC16" />
          <stop offset="70%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#14532D" />
        </radialGradient>

        <radialGradient id="pixarCanopyMidGreen" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#BEF264" />
          <stop offset="35%" stopColor="#22C55E" />
          <stop offset="75%" stopColor="#15803D" />
          <stop offset="100%" stopColor="#052E16" />
        </radialGradient>

        <radialGradient id="pixarCanopyPine" cx="35%" cy="25%" r="72%">
          <stop offset="0%" stopColor="#99F6E4" />
          <stop offset="35%" stopColor="#14B8A6" />
          <stop offset="75%" stopColor="#0F766E" />
          <stop offset="100%" stopColor="#042F2E" />
        </radialGradient>

        <radialGradient id="pixarCanopyAutumn" cx="32%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="35%" stopColor="#F59E0B" />
          <stop offset="75%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </radialGradient>

        {/* 3D Tree Trunk Bark Gradient */}
        <linearGradient id="pixarTrunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A16207" />
          <stop offset="35%" stopColor="#78350F" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>

        {/* 3D Mossy Boulder Gradient */}
        <radialGradient id="pixarRockGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="50%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#334155" />
        </radialGradient>

        {/* 3D Mountain Crag Gradient */}
        <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F1F5F9" />
          <stop offset="45%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        {/* Soft Drop Shadow Filter for 3D Pixar elements */}
        <filter id="soft3DShadow" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="5" stdDeviation="3.5" floodColor="#052E16" floodOpacity="0.28" />
        </filter>
      </defs>

      {/* ====================================================
          1. PIXAR 3D LUSH LAWN BASE ("GAZON MAYSAZOR") & MOWED TURF STRIPES
         ==================================================== */}
      {/* Full Rich Green Lawn Canvas */}
      <rect
        x="0"
        y="0"
        width="360"
        height={totalHeight}
        fill={`url(#pixarLawnBg_${courseKey})`}
      />

      {/* Manicured Pixar Park Mowed Lawn Stripes (Diagonal Curved Velvet Bands) */}
      {lawnStripes.map((stripeY, idx) => (
        <path
          key={`lawn_stripe_${idx}`}
          d={`M -20 ${stripeY} Q 180 ${stripeY - 38}, 380 ${stripeY + 12} L 380 ${
            stripeY + 68
          } Q 180 ${stripeY + 18}, -20 ${stripeY + 56} Z`}
          fill={idx % 2 === 0 ? '#ECFCCB' : biome.lawnStripe}
          fillOpacity={idx % 2 === 0 ? '0.22' : '0.18'}
        />
      ))}

      {/* Rolling 3D Pixar Hills on Left & Right with Sunlit Rim Edges */}
      {rollingHills.map((hillY, idx) => {
        const isLeft = idx % 2 === 0;
        return (
          <g key={`hill_mound_${idx}`}>
            {isLeft ? (
              <>
                {/* Left 3D Hill Mound */}
                <path
                  d={`M -30 ${hillY + 170} Q 75 ${hillY + 10}, 155 ${
                    hillY + 170
                  } Z`}
                  fill={`url(#pixarHillGrad_${courseKey})`}
                />
                {/* Sunlit Crest Rim Highlight */}
                <path
                  d={`M -20 ${hillY + 165} Q 75 ${hillY + 14}, 145 ${hillY + 165}`}
                  stroke="#ECFCCB"
                  strokeWidth="2.5"
                  strokeOpacity="0.55"
                  fill="none"
                />
              </>
            ) : (
              <>
                {/* Right 3D Hill Mound */}
                <path
                  d={`M 205 ${hillY + 180} Q 285 ${hillY + 15}, 390 ${
                    hillY + 180
                  } Z`}
                  fill={`url(#pixarHillGrad_${courseKey})`}
                />
                {/* Sunlit Crest Rim Highlight */}
                <path
                  d={`M 215 ${hillY + 175} Q 285 ${hillY + 19}, 380 ${hillY + 175}`}
                  stroke="#ECFCCB"
                  strokeWidth="2.5"
                  strokeOpacity="0.55"
                  fill="none"
                />
              </>
            )}
          </g>
        );
      })}

      {/* Soft Velvet Lawn Turf Mounds under trees and meadows */}
      {rollingHills.map((mY, idx) => (
        <g key={`turf_mound_${idx}`}>
          <ellipse
            cx={idx % 2 === 0 ? 52 : 308}
            cy={mY + 95}
            rx="54"
            ry="24"
            fill="#ECFCCB"
            opacity="0.28"
          />
          <ellipse
            cx={idx % 2 === 0 ? 305 : 58}
            cy={mY + 155}
            rx="46"
            ry="20"
            fill="#15803D"
            opacity="0.14"
          />
        </g>
      ))}

      {/* ====================================================
          2. ANIMATED 3D PIXAR RIVER, GRASSY BANKS, STONES & LILY PADS
         ==================================================== */}
      {/* Outer Dark Green Lush Riverbank Grass Border */}
      <path
        d={riverPathD}
        stroke="#15803D"
        strokeWidth="48"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
      />
      {/* Warm Sandy / Pebble Shoreline Bank */}
      <path
        d={riverPathD}
        stroke="#FDE68A"
        strokeWidth="40"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.82"
      />
      {/* River Water Body */}
      <path
        d={riverPathD}
        stroke={`url(#riverGrad_${courseKey})`}
        strokeWidth="31"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#soft3DShadow)"
      />
      {/* Glossy Cyan Inner Water Depth */}
      <path
        d={riverPathD}
        stroke="#7DD3FC"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
      />
      {/* Flowing Water Rapid Currents (Animated) */}
      <path
        d={riverPathD}
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeDasharray="16 22"
        strokeLinecap="round"
        className="anim-river-flow"
        opacity="0.85"
      />
      <path
        d={riverPathD}
        stroke="#E0F2FE"
        strokeWidth="2.2"
        strokeDasharray="8 18"
        strokeLinecap="round"
        className="anim-river-slow"
        opacity="0.7"
      />

      {/* Riverbank Pebbles, Lily Pads & Animated Water Ripples */}
      {riverPoints.slice(1, -1).map((pt, idx) => (
        <g key={`river_detail_${idx}`}>
          {/* Water Ripple */}
          <g transform={`translate(${pt.x}, ${pt.y})`} className="anim-ripple">
            <ellipse
              rx="13"
              ry="5"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.3"
              opacity="0.65"
            />
          </g>
          {/* Floating Pixar Lily Pad ("Nilufar bargi") on alternating river bends */}
          {idx % 2 === 0 && (
            <g transform={`translate(${pt.x - 10}, ${pt.y + 8})`}>
              <circle cx="0" cy="0" r="5.5" fill="#22C55E" stroke="#15803D" strokeWidth="0.8" />
              <path d="M 0 0 L 5.5 -1.5 L 5.5 1.5 Z" fill="#0284C7" />
              {idx % 4 === 0 && (
                <circle cx="-1" cy="-1" r="2.2" fill="#F472B6" stroke="#FFFFFF" strokeWidth="0.6" />
              )}
            </g>
          )}
          {/* Riverbank 3D Mossy Pebble Cluster */}
          <PixarMossyRock
            x={pt.x + (idx % 2 === 0 ? 23 : -24)}
            y={pt.y + 4}
            scale={0.75}
          />
        </g>
      ))}

      {/* ====================================================
          3. DENSE PIXAR 3D LAWN GRASS TUFTS ("GAZON O'TLAR") & WILDFLOWERS
         ==================================================== */}
      {grassElements.map((gItem) => (
        <PixarGrassTuft
          key={gItem.id}
          x={gItem.x}
          y={gItem.y}
          scale={gItem.scale}
          delayed={gItem.delayed}
          hasFlower={gItem.hasFlower}
          flowerColor={gItem.flowerColor}
        />
      ))}

      {/* ====================================================
          4. COURSE-SPECIFIC 3D PIXAR LANDMARKS & VOLUMETRIC TREES
         ==================================================== */}

      {/* --- A. GRAMMAR FUNDAMENTALS (Emerald Lawn Valley & Windmill) --- */}
      {biome.themeStyle === 'emerald' && (
        <g>
          {/* 3D Animated Dutch Windmill at top right */}
          <g transform="translate(292, 112)">
            <ellipse cx="0" cy="30" rx="24" ry="9" fill="rgba(5,46,22,0.28)" />
            {/* Lush grass bushes at windmill base */}
            <PixarBushCluster x={-16} y={24} scale={0.85} flowerColor="#FDE047" />
            <PixarBushCluster x={16} y={25} scale={0.8} flowerColor="#FB7185" />
            {/* Stone & Wood Mill Tower Base */}
            <polygon
              points="-16,28 16,28 12,-16 -12,-16"
              fill="#F8FAFC"
              stroke="#CBD5E1"
              strokeWidth="1.2"
            />
            <polygon points="-14,28 14,28 13,12 -13,12" fill="#E2E8F0" />
            {/* Conical Red-Orange Pixar Roof */}
            <polygon points="-14,-15 14,-15 0,-36" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />
            {/* Arched Wooden Mill Door */}
            <path d="M -4.5 28 L -4.5 16 A 4.5 4.5 0 0 1 4.5 16 L 4.5 28 Z" fill="#78350F" />
            {/* Spinning Rotor Blades */}
            <g className="anim-windmill">
              <line x1="-34" y1="0" x2="34" y2="0" stroke="#78350F" strokeWidth="2.8" />
              <line x1="0" y1="-34" x2="0" y2="34" stroke="#78350F" strokeWidth="2.8" />
              <rect
                x="6"
                y="-6"
                width="24"
                height="5.5"
                rx="1"
                fill="#FEF08A"
                stroke="#B45309"
                strokeWidth="0.8"
              />
              <rect
                x="-30"
                y="1"
                width="24"
                height="5.5"
                rx="1"
                fill="#FEF08A"
                stroke="#B45309"
                strokeWidth="0.8"
              />
              <rect
                x="1"
                y="6"
                width="5.5"
                height="24"
                rx="1"
                fill="#FEF08A"
                stroke="#B45309"
                strokeWidth="0.8"
              />
              <rect
                x="-6.5"
                y="-30"
                width="5.5"
                height="24"
                rx="1"
                fill="#FEF08A"
                stroke="#B45309"
                strokeWidth="0.8"
              />
              <circle cx="0" cy="0" r="4" fill="#F59E0B" stroke="#78350F" strokeWidth="1.2" />
            </g>
          </g>

          {/* 3D Volumetric Pixar Trees & Bushes */}
          <PineTree x={45} y={225} scale={0.95} variant="green" />
          <DeciduousTree x={32} y={268} scale={1.12} />
          <PixarBushCluster x={58} y={282} scale={0.95} flowerColor="#FDE047" />
          <PineTree x={315} y={320} scale={1.05} variant="green" />
          <DeciduousTree x={308} y={505} scale={1.08} />
          <PineTree x={48} y={555} scale={1.1} variant="green" />
          <PixarBushCluster x={318} y={640} scale={1.0} flowerColor="#FB7185" />
          <PineTree x={320} y={695} scale={1.0} variant="green" />
          <DeciduousTree x={42} y={780} scale={1.15} />
        </g>
      )}

      {/* --- B. NOUNS (Alpine Meadow Lawn & Waterfall) --- */}
      {biome.themeStyle === 'alpine' && (
        <g>
          {/* Snowy 3D Mountain Peaks with Lush Green Foothills */}
          <g transform="translate(0, 35)">
            <polygon
              points="8,125 70,16 132,125"
              fill="url(#mountainGrad)"
              filter="url(#soft3DShadow)"
            />
            <polygon points="48,46 70,16 92,46 80,52 70,42 58,51" fill="#FFFFFF" />
            <polygon
              points="228,140 292,12 356,140"
              fill="url(#mountainGrad)"
              filter="url(#soft3DShadow)"
            />
            <polygon points="265,46 292,12 318,46 305,52 292,40 276,50" fill="#FFFFFF" />
          </g>

          {/* Cascading 3D Waterfall with Mossy Rocks */}
          <g transform="translate(46, 158)">
            <rect
              x="-2"
              y="0"
              width="40"
              height="72"
              rx="8"
              fill="#475569"
              filter="url(#soft3DShadow)"
            />
            {/* Lush green moss on waterfall cliff top */}
            <ellipse cx="18" cy="2" rx="20" ry="5" fill="#4ADE80" />
            <rect x="8" y="3" width="20" height="67" fill="#38BDF8" rx="4" />
            <line
              x1="14"
              y1="5"
              x2="14"
              y2="68"
              stroke="#FFFFFF"
              strokeWidth="2.6"
              strokeDasharray="8 8"
              className="anim-waterfall"
            />
            <line
              x1="22"
              y1="5"
              x2="22"
              y2="68"
              stroke="#E0F2FE"
              strokeWidth="2.2"
              strokeDasharray="6 6"
              className="anim-waterfall"
            />
            <ellipse
              cx="18"
              cy="72"
              rx="25"
              ry="8"
              fill="#67E8F9"
              opacity="0.9"
              className="anim-ripple"
            />
          </g>

          <PineTree x={312} y={180} scale={1.12} variant="pine" />
          <PineTree x={328} y={224} scale={0.95} variant="green" />
          <DeciduousTree x={42} y={380} scale={1.12} />
          <PineTree x={315} y={535} scale={1.08} variant="pine" />
          <PineTree x={36} y={695} scale={1.2} variant="green" />
          <DeciduousTree x={310} y={845} scale={1.08} />
        </g>
      )}

      {/* --- C. VERBS (Sunlit Canyon Lawn & Rapids) --- */}
      {biome.themeStyle === 'canyon' && (
        <g>
          {/* Sculpted Warm Canyon Outcrops with Green Grass Tops */}
          <g transform="translate(0, 58)">
            <path d="M 0 80 L 68 62 L 52 156 L 0 175 Z" fill="#EA580C" opacity="0.82" />
            <path d="M 0 80 Q 34 65 68 62 L 60 74 L 0 90 Z" fill="#4ADE80" />
            <path d="M 360 220 L 292 200 L 310 315 L 360 335 Z" fill="#EA580C" opacity="0.82" />
            <path d="M 360 220 Q 325 205 292 200 L 300 212 L 360 230 Z" fill="#4ADE80" />
          </g>
          <DeciduousTree x={42} y={258} scale={1.02} />
          <PineTree x={320} y={150} scale={1.05} variant="autumn" />
          <DeciduousTree x={315} y={430} scale={1.12} />
          <PineTree x={45} y={580} scale={1.08} variant="green" />
          <DeciduousTree x={324} y={750} scale={1.08} />
          <PineTree x={40} y={920} scale={1.15} variant="autumn" />
          <DeciduousTree x={310} y={1095} scale={1.05} />
        </g>
      )}

      {/* --- D. ADJECTIVES (Pixar Flower Meadow & Blossom Windmill) --- */}
      {biome.themeStyle === 'flower' && (
        <g>
          {/* Fantasy Flower Windmill */}
          <g transform="translate(300, 150)">
            <ellipse cx="0" cy="24" rx="20" ry="8" fill="rgba(5,46,22,0.22)" />
            <polygon points="-13,22 13,22 9,-14 -9,-14" fill="#F472B6" stroke="#DB2777" strokeWidth="1" />
            <polygon points="-11,-14 11,-14 0,-29" fill="#EC4899" />
            <g className="anim-windmill">
              {[0, 90, 180, 270].map((deg) => (
                <g key={deg} transform={`rotate(${deg})`}>
                  <ellipse
                    cx="0"
                    cy="-19"
                    rx="6.5"
                    ry="13"
                    fill="#FDE047"
                    stroke="#CA8A04"
                    strokeWidth="0.9"
                  />
                </g>
              ))}
              <circle cx="0" cy="0" r="4.5" fill="#BE185D" stroke="#FCE7F3" strokeWidth="1" />
            </g>
          </g>
          <MagicMushroom x={46} y={220} color="#F43F5E" />
          <MagicMushroom x={315} y={360} color="#8B5CF6" />
          <MagicMushroom x={42} y={520} color="#EC4899" />
          <MagicMushroom x={320} y={660} color="#3B82F6" />
          <DeciduousTree x={50} y={348} scale={1.15} />
          <DeciduousTree x={310} y={510} scale={1.08} />
          <DeciduousTree x={45} y={690} scale={1.18} />
        </g>
      )}

      {/* --- E. NUMERALS (Golden-Green Orchard & Waterwheel) --- */}
      {biome.themeStyle === 'autumn' && (
        <g>
          {/* Rotating Waterwheel beside river */}
          <g
            transform={`translate(${
              riverPoints[2]?.x ? riverPoints[2].x + 36 : 240
            }, ${riverPoints[2]?.y || 260})`}
          >
            <rect x="10" y="-24" width="28" height="34" fill="#92400E" rx="3" filter="url(#soft3DShadow)" />
            <polygon points="7,-24 41,-24 24,-42" fill="#B45309" />
            <g className="anim-windmill">
              <circle cx="0" cy="0" r="18" fill="none" stroke="#D97706" strokeWidth="3.2" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((ang) => (
                <line
                  key={ang}
                  x1="0"
                  y1="0"
                  x2={Math.cos((ang * Math.PI) / 180) * 18}
                  y2={Math.sin((ang * Math.PI) / 180) * 18}
                  stroke="#78350F"
                  strokeWidth="2.2"
                />
              ))}
              <circle cx="0" cy="0" r="4.5" fill="#451A03" />
            </g>
          </g>
          <PineTree x={45} y={150} scale={1.08} variant="autumn" />
          <DeciduousTree x={35} y={320} scale={1.15} />
          <PineTree x={315} y={420} scale={1.1} variant="autumn" />
          <DeciduousTree x={42} y={540} scale={1.12} />
        </g>
      )}

      {/* --- F. PRONOUNS (Emerald Pine Lawn & Wooden Boat) --- */}
      {biome.themeStyle === 'misty' && (
        <g>
          <g
            transform={`translate(${riverPoints[1]?.x || 160}, ${riverPoints[1]?.y || 190})`}
            className="anim-boat"
          >
            <path
              d="M -18 4 Q 0 12 18 4 Q 10 -4 -10 -4 Z"
              fill="#92400E"
              stroke="#78350F"
              strokeWidth="1"
            />
            <line x1="-6" y1="-9" x2="-2" y2="6" stroke="#FEF3C7" strokeWidth="1.5" />
            <polygon points="-2,-9 11,-4 -2,1" fill="#FFFFFF" opacity="0.95" />
          </g>
          <PineTree x={40} y={130} scale={1.12} variant="pine" />
          <DeciduousTree x={315} y={230} scale={1.05} />
          <PineTree x={32} y={380} scale={1.22} variant="green" />
          <DeciduousTree x={325} y={510} scale={1.08} />
          <PineTree x={45} y={670} scale={1.16} variant="pine" />
          <DeciduousTree x={310} y={800} scale={1.06} />
        </g>
      )}

      {/* --- G. ADVERBS (Windy Green Highlands & Wind Turbines) --- */}
      {biome.themeStyle === 'windy' && (
        <g>
          <g transform="translate(58, 240)">
            <ellipse cx="0" cy="50" rx="16" ry="6" fill="rgba(5,46,22,0.22)" />
            <polygon
              points="-3.5,50 3.5,50 1.2,-20 -1.2,-20"
              fill="#F8FAFC"
              stroke="#CBD5E1"
              strokeWidth="0.6"
            />
            <circle cx="0" cy="-20" r="4" fill="#38BDF8" />
            <g transform="translate(0, -20)" className="anim-windmill-fast">
              {[0, 120, 240].map((deg) => (
                <g key={deg} transform={`rotate(${deg})`}>
                  <polygon
                    points="-1.8,0 1.8,0 0.6,-38 -0.6,-38"
                    fill="#FFFFFF"
                    stroke="#94A3B8"
                    strokeWidth="0.6"
                  />
                </g>
              ))}
            </g>
          </g>

          <g transform="translate(302, 480)">
            <ellipse cx="0" cy="55" rx="18" ry="6.5" fill="rgba(5,46,22,0.22)" />
            <polygon
              points="-4,55 4,55 1.5,-25 -1.5,-25"
              fill="#F8FAFC"
              stroke="#CBD5E1"
              strokeWidth="0.6"
            />
            <circle cx="0" cy="-25" r="4.5" fill="#38BDF8" />
            <g transform="translate(0, -25)" className="anim-windmill">
              {[0, 120, 240].map((deg) => (
                <g key={deg} transform={`rotate(${deg})`}>
                  <polygon
                    points="-2,0 2,0 0.8,-44 -0.8,-44"
                    fill="#FFFFFF"
                    stroke="#94A3B8"
                    strokeWidth="0.6"
                  />
                </g>
              ))}
            </g>
          </g>

          <DeciduousTree x={45} y={420} scale={1.1} />
          <PineTree x={320} y={640} scale={1.16} variant="green" />
          <DeciduousTree x={42} y={760} scale={1.12} />
        </g>
      )}

      {/* --- H. PREPOSITIONS (Tropical Lawn Archipelago & Palms) --- */}
      {biome.themeStyle === 'tropical' && (
        <g>
          <g transform="translate(70, 310)" className="anim-boat">
            <path
              d="M -16 6 Q 0 14 16 6 Q 12 0 -12 0 Z"
              fill="#FFFFFF"
              stroke="#0284C7"
              strokeWidth="1"
            />
            <polygon points="0,-18 12,0 0,0" fill="#38BDF8" />
            <polygon points="0,-18 -8,0 0,0" fill="#F43F5E" />
          </g>

          <PalmTree x={45} y={150} scale={1.12} />
          <DeciduousTree x={315} y={260} scale={1.05} />
          <PalmTree x={40} y={490} scale={1.18} />
          <PalmTree x={325} y={620} scale={1.08} />
          <DeciduousTree x={45} y={800} scale={1.15} />
          <PalmTree x={315} y={950} scale={1.06} />
        </g>
      )}

      {/* --- I. SENTENCES (Royal Citadel Castle & Palace Lawn) --- */}
      {biome.themeStyle === 'citadel' && (
        <g>
          <g transform="translate(55, 120)">
            <ellipse cx="0" cy="40" rx="24" ry="9" fill="rgba(5,46,22,0.26)" />
            <rect
              x="-18"
              y="-20"
              width="36"
              height="58"
              rx="3"
              fill="#E2E8F0"
              stroke="#94A3B8"
              strokeWidth="1.2"
            />
            <rect x="-21" y="-28" width="42" height="10" rx="1" fill="#94A3B8" />
            <rect x="-19" y="-34" width="8" height="6" fill="#94A3B8" />
            <rect x="-4" y="-34" width="8" height="6" fill="#94A3B8" />
            <rect x="11" y="-34" width="8" height="6" fill="#94A3B8" />
            <line x1="0" y1="-34" x2="0" y2="-52" stroke="#EAB308" strokeWidth="2.2" />
            <polygon points="0,-52 17,-46 0,-40" fill="#EF4444" />
            <path d="M -4.5 2 A 4.5 4.5 0 0 1 4.5 2 L 4.5 15 L -4.5 15 Z" fill="#1E293B" />
          </g>
          <DeciduousTree x={315} y={230} scale={1.12} />
          <DeciduousTree x={40} y={390} scale={1.16} />
          <PineTree x={320} y={540} scale={1.12} variant="green" />
          <DeciduousTree x={45} y={700} scale={1.2} />
          <PineTree x={315} y={850} scale={1.08} variant="green" />
        </g>
      )}

      {/* --- J. ADVERBIALS (Sunlit Oasis Lawn & Date Palms) --- */}
      {biome.themeStyle === 'oasis' && (
        <g>
          <g transform="translate(70, 340)">
            <ellipse
              cx="0"
              cy="0"
              rx="36"
              ry="19"
              fill="#38BDF8"
              stroke="#86EFAC"
              strokeWidth="4.5"
            />
            <ellipse cx="0" cy="0" rx="24" ry="11" fill="#06B6D4" className="anim-ripple" />
          </g>
          <PalmTree x={40} y={200} scale={1.12} />
          <DeciduousTree x={100} y={320} scale={0.95} />
          <PalmTree x={315} y={380} scale={1.08} />
          <DeciduousTree x={45} y={560} scale={1.15} />
          <PalmTree x={320} y={690} scale={1.05} />
        </g>
      )}

      {/* --- K. ARTICLES (Coastal Green Cliffs & Ocean Lighthouse) --- */}
      {biome.themeStyle === 'coastal' && (
        <g>
          <g transform="translate(305, 120)">
            <ellipse cx="0" cy="46" rx="22" ry="8.5" fill="rgba(5,46,22,0.26)" />
            <polygon
              points="-16,44 16,44 10,-24 -10,-24"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="1"
            />
            <polygon points="-14,30 14,30 12,12 -12,12" fill="#EF4444" />
            <polygon points="-11,-6 11,-6 9,-22 -9,-22" fill="#EF4444" />
            <rect
              x="-9"
              y="-36"
              width="18"
              height="12"
              fill="#FEF08A"
              stroke="#713F12"
              strokeWidth="1"
            />
            <polygon points="-11,-36 11,-36 0,-48" fill="#1E293B" />
            <polygon
              points="0,-30 -85,-52 -95,-8"
              fill="#FEF08A"
              opacity="0.38"
              className="anim-ripple"
            />
          </g>

          <DeciduousTree x={45} y={230} scale={1.12} />
          <PineTree x={315} y={390} scale={1.05} variant="green" />
          <DeciduousTree x={40} y={540} scale={1.16} />
        </g>
      )}

      {/* ====================================================
          5. DRIFTING 3D PIXAR CLOUDS Across All Courses
         ==================================================== */}
      <g transform="translate(62, 74)" className="anim-cloud-left">
        <ellipse
          cx="0"
          cy="4"
          rx="28"
          ry="12"
          fill="#FFFFFF"
          opacity="0.92"
          filter="url(#soft3DShadow)"
        />
        <ellipse cx="-11" cy="-2" rx="16" ry="13" fill="#FFFFFF" opacity="0.96" />
        <ellipse cx="10" cy="-3" rx="18" ry="12" fill="#FFFFFF" opacity="0.96" />
      </g>
      <g transform="translate(286, 410)" className="anim-cloud-right">
        <ellipse
          cx="0"
          cy="4"
          rx="30"
          ry="13"
          fill="#FFFFFF"
          opacity="0.88"
          filter="url(#soft3DShadow)"
        />
        <ellipse cx="-12" cy="-2" rx="17" ry="12" fill="#FFFFFF" opacity="0.94" />
        <ellipse cx="12" cy="-3" rx="19" ry="13" fill="#FFFFFF" opacity="0.94" />
      </g>

      {/* ====================================================
          6. 3D BRIDGES WHERE HIGHWAY CROSSES WATER
         ==================================================== */}
      <g transform={`translate(180, ${bridgeY1})`}>
        <rect
          x="-42"
          y="-12"
          width="14"
          height="24"
          rx="3"
          fill="#64748B"
          filter="url(#soft3DShadow)"
        />
        <rect
          x="28"
          y="-12"
          width="14"
          height="24"
          rx="3"
          fill="#64748B"
          filter="url(#soft3DShadow)"
        />
        <rect x="-48" y="-16" width="96" height="5" rx="2" fill="#EF4444" />
        <rect x="-48" y="11" width="96" height="5" rx="2" fill="#EF4444" />
        {[-44, -22, 0, 22, 44].map((px) => (
          <g key={px}>
            <rect x={px - 2} y="-16" width="4" height="32" fill="#F8FAFC" />
            <circle cx={px} cy="-13" r="1.5" fill="#FEF08A" />
            <circle cx={px} cy="13" r="1.5" fill="#FEF08A" />
          </g>
        ))}
      </g>

      {totalHeight > 600 && (
        <g transform={`translate(180, ${bridgeY2})`}>
          <rect
            x="-42"
            y="-12"
            width="14"
            height="24"
            rx="3"
            fill="#64748B"
            filter="url(#soft3DShadow)"
          />
          <rect
            x="28"
            y="-12"
            width="14"
            height="24"
            rx="3"
            fill="#64748B"
            filter="url(#soft3DShadow)"
          />
          <rect x="-48" y="-16" width="96" height="5" rx="2" fill="#EF4444" />
          <rect x="-48" y="11" width="96" height="5" rx="2" fill="#EF4444" />
          {[-44, -22, 0, 22, 44].map((px) => (
            <g key={px}>
              <rect x={px - 2} y="-16" width="4" height="32" fill="#F8FAFC" />
              <circle cx={px} cy="-13" r="1.5" fill="#FEF08A" />
              <circle cx={px} cy="13" r="1.5" fill="#FEF08A" />
            </g>
          ))}
        </g>
      )}

      {/* ====================================================
          7. ROADSIDE PIXAR FLOWER BUSHES, GRASS SHOULDERS & SIGNS
         ==================================================== */}
      {points.slice(1, -1).map((pt, idx) => {
        const side = pt.x > 180 ? -1 : 1;
        const propX = pt.x + side * 48;
        const propY = pt.y + 8;
        const oppositeX = pt.x - side * 42;

        return (
          <g key={`roadside_${idx}`}>
            {/* Always place a lush Pixar Grass Tuft & Flower Bush near the road curve */}
            <PixarBushCluster
              x={oppositeX}
              y={pt.y + 14}
              scale={0.82}
              flowerColor={biome.flowerColors[idx % biome.flowerColors.length]}
            />
            <PixarGrassTuft
              x={propX - side * 8}
              y={propY + 12}
              scale={0.95}
              delayed={idx % 2 === 0}
              hasFlower={true}
              flowerColor={biome.flowerColors[(idx + 1) % biome.flowerColors.length]}
            />

            {idx % 2 === 0 ? (
              <g transform={`translate(${propX}, ${propY})`}>
                {/* Pixar Wooden Country Fence Post & Flower */}
                <ellipse cx="0" cy="9" rx="10" ry="4" fill="rgba(5,46,22,0.25)" />
                <rect x="-9" y="-4" width="4" height="13" rx="1.5" fill="#92400E" />
                <rect x="5" y="-4" width="4" height="13" rx="1.5" fill="#92400E" />
                <rect x="-11" y="-1" width="22" height="3" rx="1" fill="#B45309" />
                <rect x="-11" y="4" width="22" height="3" rx="1" fill="#B45309" />
              </g>
            ) : idx % 3 === 0 ? (
              <g transform={`translate(${propX}, ${propY - 12})`}>
                <ellipse cx="0" cy="18" rx="6" ry="2.5" fill="rgba(5,46,22,0.25)" />
                <line x1="0" y1="0" x2="0" y2="18" stroke="#78350F" strokeWidth="3" />
                <polygon
                  points="0,-15 14,0 0,15 -14,0"
                  fill="#FBBF24"
                  stroke="#D97706"
                  strokeWidth="1.2"
                  filter="url(#soft3DShadow)"
                />
                <path
                  d="M -5 5 L 0 0 L -3 -3 L 4 -7"
                  stroke="#1E293B"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </g>
            ) : null}
          </g>
        );
      })}

      {/* ====================================================
          8. PIXAR GOLDEN HOUR SUNBEAMS & MAGICAL SUNLIT ATMOSPHERE
         ==================================================== */}
      <g className="anim-sunbeam">
        <polygon points="-20,0 140,0 290,340 60,340" fill="url(#pixarSunbeamGrad)" />
        <polygon points="160,0 320,0 360,260 240,260" fill="url(#pixarSunbeamGrad)" />
      </g>
    </svg>
  );
};

/* ============================================================================
   PIXAR-STYLE 3D NATURE SUBCOMPONENTS (Grass Tufts, Bushes, Volumetric Trees)
   ============================================================================ */

/**
 * 3D Multi-Blade Pixar Lawn Grass Tuft ("Gazon o'ti") with optional blooming flower
 */
const PixarGrassTuft: React.FC<{
  x: number;
  y: number;
  scale?: number;
  delayed?: boolean;
  hasFlower?: boolean;
  flowerColor?: string;
}> = ({
  x,
  y,
  scale = 1,
  delayed = false,
  hasFlower = false,
  flowerColor = '#FDE047',
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Soft Ground Ambient Occlusion Shadow */}
      <ellipse cx="0" cy="2" rx="11" ry="3.8" fill="#052E16" opacity="0.22" />

      <g className={delayed ? 'anim-grass-sway-delayed' : 'anim-grass-sway'}>
        {/* Back Dark Emerald Blades for Depth */}
        <path
          d="M -5 2 Q -11 -9 -14 -15 Q -7 -10 -2 2 Z"
          fill="#15803D"
        />
        <path
          d="M 5 2 Q 11 -10 15 -14 Q 8 -9 2 2 Z"
          fill="#15803D"
        />

        {/* Mid Sunlit 3D Curved Grass Blades */}
        <path
          d="M -3 2 Q -7 -12 -9 -19 Q -2 -12 1 2 Z"
          fill="url(#pixarGrassBladeRich)"
        />
        <path
          d="M 3 2 Q 8 -12 10 -18 Q 3 -11 -1 2 Z"
          fill="url(#pixarGrassBladeRich)"
        />

        {/* Center Tall Sun-Kissed Pixar Hero Blade */}
        <path
          d="M -2 2 Q -1 -15 2 -22 Q 4 -13 2.5 2 Z"
          fill="url(#pixarGrassBladeGrad)"
        />

        {/* Optional Pixar Meadow Wildflower */}
        {hasFlower && (
          <g transform="translate(4, -15)">
            <circle cx="0" cy="0" r="4.2" fill={flowerColor} />
            <circle cx="-1" cy="-1" r="1.4" fill="#FFFFFF" opacity="0.65" />
            <circle cx="0" cy="0" r="1.6" fill="#F59E0B" />
          </g>
        )}
      </g>
    </g>
  );
};

/**
 * 3D Volumetric Pixar Bush Cluster with Specular Sunlight & Blossoms
 */
const PixarBushCluster: React.FC<{
  x: number;
  y: number;
  scale?: number;
  flowerColor?: string;
}> = ({ x, y, scale = 1, flowerColor = '#FDE047' }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="7" rx="18" ry="6" fill="#052E16" opacity="0.26" />
      {/* 3D Spherical Bush Lobes */}
      <circle cx="-8" cy="1" r="9.5" fill="url(#pixarCanopyMidGreen)" />
      <circle cx="9" cy="1" r="9" fill="url(#pixarCanopyMidGreen)" />
      <circle cx="0" cy="-3" r="11.5" fill="url(#pixarCanopyLightGreen)" />
      {/* Sunlit Specular Rim Dots */}
      <circle cx="-3" cy="-8" r="3.5" fill="#ECFCCB" opacity="0.55" />
      {/* Cute Pixar Blossoms */}
      <circle cx="-7" cy="0" r="2.4" fill={flowerColor} />
      <circle cx="6" cy="-1" r="2.2" fill={flowerColor} />
      <circle cx="1" cy="3" r="2" fill="#FFFFFF" />
    </g>
  );
};

/**
 * 3D Mossy Boulder for Riverbanks & Hillsides
 */
const PixarMossyRock: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="5" rx="11" ry="4" fill="#052E16" opacity="0.25" />
      <path
        d="M -9 4 Q -10 -6 -1 -7 Q 9 -6 10 4 Z"
        fill="url(#pixarRockGrad)"
      />
      {/* Lush Green Moss Cap */}
      <path d="M -7 -2 Q 0 -8 7 -2 Q 2 0 -7 -2 Z" fill="#4ADE80" />
    </g>
  );
};

interface TreeProps {
  x: number;
  y: number;
  scale?: number;
  variant?: 'green' | 'autumn' | 'pine';
}

const PineTree: React.FC<TreeProps> = ({ x, y, scale = 1, variant = 'green' }) => {
  const gradId =
    variant === 'autumn'
      ? 'pixarCanopyAutumn'
      : variant === 'pine'
      ? 'pixarCanopyPine'
      : 'pixarCanopyLightGreen';

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* 3D Ground Shadow */}
      <ellipse cx="0" cy="24" rx="18" ry="6.5" fill="#052E16" opacity="0.28" />
      {/* Sculpted 3D Trunk */}
      <path d="M -4 24 L -2.5 8 L 2.5 8 L 4 24 Z" fill="url(#pixarTrunkGrad)" />
      {/* Lush Grass Blades Hugging Tree Roots */}
      <path d="M -7 24 Q -5 18 -2 24 M 2 24 Q 5 18 7 24" stroke="#4ADE80" strokeWidth="2" fill="none" />

      <g className="anim-tree-breeze">
        {/* Soft Rounded Pixar Tiered Cones */}
        <path
          d="M -19 14 Q 0 18 19 14 Q 10 -2 0 -6 Q -10 -2 -19 14 Z"
          fill={`url(#${gradId})`}
          filter="url(#soft3DShadow)"
        />
        <path
          d="M -15 3 Q 0 7 15 3 Q 8 -11 0 -16 Q -8 -11 -15 3 Z"
          fill={`url(#${gradId})`}
        />
        <path
          d="M -11 -7 Q 0 -4 11 -7 Q 5 -20 0 -26 Q -5 -20 -11 -7 Z"
          fill={`url(#${gradId})`}
        />
        {/* Warm Pixar Rim Sunlight Highlight */}
        <ellipse cx="-3" cy="-15" rx="3" ry="5" fill="#ECFCCB" opacity="0.42" />
      </g>
    </g>
  );
};

const DeciduousTree: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Ground Ambient Shadow */}
      <ellipse cx="0" cy="23" rx="19" ry="7" fill="#052E16" opacity="0.28" />
      {/* Sculpted Pixar Tree Trunk with Root Flare */}
      <path
        d="M -5 23 Q -3 15 -3 8 L 3 8 Q 3 15 5 23 Z"
        fill="url(#pixarTrunkGrad)"
      />
      {/* Grass Tuft at Tree Base */}
      <circle cx="-5" cy="22" r="3.5" fill="#22C55E" />
      <circle cx="5" cy="22" r="3" fill="#4ADE80" />

      {/* Volumetric 3D Cloud Canopy */}
      <g className="anim-tree-breeze" filter="url(#soft3DShadow)">
        <circle cx="-10" cy="2" r="13" fill="url(#pixarCanopyMidGreen)" />
        <circle cx="10" cy="2" r="12.5" fill="url(#pixarCanopyMidGreen)" />
        <circle cx="0" cy="-9" r="15.5" fill="url(#pixarCanopyLightGreen)" />
        {/* Specular Sun-Kissed Crown Highlight */}
        <ellipse cx="-4" cy="-14" rx="6.5" ry="4.5" fill="#ECFCCB" opacity="0.58" />
      </g>
    </g>
  );
};

const PalmTree: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="22" rx="16" ry="5.5" fill="#052E16" opacity="0.26" />
      {/* Base Grass Tuft */}
      <circle cx="-4" cy="20" r="4" fill="#22C55E" />
      <circle cx="4" cy="20" r="3.5" fill="#4ADE80" />
      {/* Curved 3D Trunk */}
      <path
        d="M 0 20 Q 8 6 4 -12"
        stroke="url(#pixarTrunkGrad)"
        strokeWidth="5.5"
        strokeLinecap="round"
        fill="none"
      />
      <g className="anim-tree-breeze">
        {/* Lush Pixar Palm Fronds */}
        <path
          d="M 4 -12 Q -16 -25 -25 -11"
          stroke="#16A34A"
          strokeWidth="3.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 4 -12 Q 22 -25 30 -13"
          stroke="#22C55E"
          strokeWidth="3.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 4 -12 Q -9 -35 -2 -39"
          stroke="#84CC16"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 4 -12 Q 18 -33 14 -39"
          stroke="#4ADE80"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Coconuts */}
        <circle cx="2" cy="-10" r="2.8" fill="#78350F" />
        <circle cx="6" cy="-9" r="2.8" fill="#451A03" />
      </g>
    </g>
  );
};

const MagicMushroom: React.FC<{ x: number; y: number; color: string }> = ({ x, y, color }) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="14" rx="12" ry="4.5" fill="#052E16" opacity="0.26" />
      <path d="M -4 14 Q -3 6 -2.5 2 L 2.5 2 Q 3 6 4 14 Z" fill="#FEF9C3" />
      <path d="M -14 4 Q 0 -16 14 4 Z" fill={color} filter="url(#soft3DShadow)" />
      <circle cx="-5" cy="-2" r="2.5" fill="#FFFFFF" opacity="0.9" />
      <circle cx="4" cy="-3" r="2" fill="#FFFFFF" opacity="0.9" />
      <circle cx="0" cy="1" r="1.6" fill="#FFFFFF" opacity="0.9" />
    </g>
  );
};
