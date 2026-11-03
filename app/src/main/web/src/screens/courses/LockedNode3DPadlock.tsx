import React from 'react';

// Synthesized Web Audio API sound effects + haptics (no external audio files needed)
export function triggerLockRattleFeedback() {
  // 1. Tactile Haptic Vibration
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([45, 40, 65]);
    }
  } catch {
    // Ignore on unsupported devices
  }

  // 2. Metallic Chain + Padlock Clank Sound via Web Audio API
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Two quick metallic clanks (rattle)
    [0, 0.11, 0.22].forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const mod = ctx.createOscillator();
      const modGain = ctx.createGain();
      const gain = ctx.createGain();

      // Inharmonic metallic frequencies
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(idx === 1 ? 520 : 410, now + offset);
      osc.frequency.exponentialRampToValueAtTime(160, now + offset + 0.085);

      mod.type = 'square';
      mod.frequency.setValueAtTime(1180 + idx * 190, now + offset);
      modGain.gain.setValueAtTime(340, now + offset);

      gain.gain.setValueAtTime(0.22, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.09);

      mod.connect(modGain);
      modGain.connect(osc.frequency);
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      mod.start(now + offset);
      osc.stop(now + offset + 0.095);
      mod.stop(now + offset + 0.095);
    });
  } catch {
    // AudioContext blocked or unsupported
  }
}

export function triggerUnlockCeremonyFeedback() {
  // 1. Celebratory Haptic Vibration
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([35, 45, 85, 40, 130]);
    }
  } catch {
    // Ignore on unsupported devices
  }

  // 2. Mechanical Lock Pop + Golden Sparkle Arpeggio via Web Audio API
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Initial rattle (0.0s - 0.3s)
    [0, 0.12].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(360, now + offset);
      osc.frequency.exponentialRampToValueAtTime(180, now + offset + 0.08);
      gain.gain.setValueAtTime(0.16, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.085);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.09);
    });

    // Crisp mechanical shackle "POP" at 0.35s
    const popOsc = ctx.createOscillator();
    const popGain = ctx.createGain();
    popOsc.type = 'sine';
    popOsc.frequency.setValueAtTime(280, now + 0.34);
    popOsc.frequency.exponentialRampToValueAtTime(880, now + 0.44);
    popGain.gain.setValueAtTime(0.28, now + 0.34);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.46);
    popOsc.connect(popGain);
    popGain.connect(ctx.destination);
    popOsc.start(now + 0.34);
    popOsc.stop(now + 0.47);

    // Shimmering Golden Chime Arpeggio (C5 - E5 - G5 - C6)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const start = now + 0.45 + i * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.56);
    });
  } catch {
    // Ignore audio errors
  }
}

interface LockedNode3DPadlockProps {
  idSuffix: string;
  isRattling?: boolean;
  isUnlocking?: boolean;
  isChest?: boolean;
}

export const LockedNode3DPadlock: React.FC<LockedNode3DPadlockProps> = ({
  idSuffix,
  isRattling = false,
  isUnlocking = false,
  isChest = false,
}) => {
  const uid = idSuffix.replace(/[^a-zA-Z0-9_-]/g, '_');

  // 12 radial particle vectors for the unlock burst
  const particles = [
    { dx: -46, dy: -42, color: '#FACC15', delay: '0.32s', size: 7 },
    { dx: 0, dy: -56, color: '#4ADE80', delay: '0.35s', size: 8 },
    { dx: 46, dy: -42, color: '#FBBF24', delay: '0.32s', size: 7 },
    { dx: 58, dy: -6, color: '#38BDF8', delay: '0.38s', size: 6 },
    { dx: 48, dy: 38, color: '#FACC15', delay: '0.34s', size: 8 },
    { dx: 16, dy: 54, color: '#4ADE80', delay: '0.36s', size: 6 },
    { dx: -18, dy: 52, color: '#FDE047', delay: '0.37s', size: 7 },
    { dx: -50, dy: 36, color: '#F59E0B', delay: '0.33s', size: 8 },
    { dx: -58, dy: -8, color: '#4ADE80', delay: '0.35s', size: 6 },
    { dx: -26, dy: -50, color: '#FFFBEB', delay: '0.39s', size: 5 },
    { dx: 28, dy: -50, color: '#FFFBEB', delay: '0.39s', size: 5 },
    { dx: 0, dy: 42, color: '#FACC15', delay: '0.31s', size: 7 },
  ];

  return (
    <div
      className={`pointer-events-none absolute -inset-3 z-30 flex items-center justify-center select-none ${
        isRattling ? 'anim-lock-rattle' : ''
      }`}
    >
      {/* Subtle metallic red/amber flash ring when rattled while locked */}
      {isRattling && (
        <span className="absolute inset-1 rounded-full border-2 border-amber-400/90 bg-amber-400/15 animate-ping" />
      )}

      {/* Expanding golden-emerald shockwave ring when unlocking */}
      {isUnlocking && (
        <>
          <span className="absolute inset-0 rounded-full border-4 border-yellow-300 bg-emerald-400/25 anim-unlock-shockwave" />
          {/* Bursting 3D star & diamond particles */}
          {particles.map((p, idx) => (
            <span
              key={idx}
              className="absolute rounded-full shadow-sm"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                boxShadow: `0 0 8px ${p.color}`,
                transform: isUnlocking
                  ? `translate(${p.dx}px, ${p.dy}px) scale(0)`
                  : 'translate(0px, 0px) scale(1)',
                opacity: isUnlocking ? 0 : 1,
                transition: `transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${p.delay}, opacity 0.85s ease-out ${p.delay}`,
              }}
            />
          ))}
        </>
      )}

      {/* 3D Silver-Steel Chain Ring & Golden-Silver Padlock SVG */}
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full overflow-visible drop-shadow-[0_4px_6px_rgba(15,23,42,0.38)] ${
          isUnlocking ? 'anim-lock-unlock' : ''
        }`}
        fill="none"
      >
        <defs>
          {/* Brushed Silver-Chrome Gradient for Chain Links & Shackle */}
          <linearGradient id={`silverChain_${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="35%" stopColor="#CBD5E1" />
            <stop offset="70%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <linearGradient id={`shackleChrome_${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="28%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#CBD5E1" />
            <stop offset="90%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          {/* 3D Royal Gold Gradient for Lock Body */}
          <linearGradient id={`goldBody_${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="22%" stopColor="#FACC15" />
            <stop offset="65%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#9A3412" />
          </linearGradient>

          <linearGradient id={`goldFront_${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FEF9C3" />
            <stop offset="30%" stopColor="#FDE047" />
            <stop offset="70%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
        </defs>

        {/* ============================================================
            1. 3D SILVER-STEEL CHAIN HALQASI (Left & Right Chain Arcs)
           ============================================================ */}
        <g className={isUnlocking ? 'anim-chain-left' : ''}>
          {/* Left diagonal & perimeter chain links wrapping the button */}
          <rect
            x="10"
            y="38"
            width="16"
            height="9"
            rx="4.5"
            transform="rotate(-52 18 42)"
            stroke={`url(#silverChain_${uid})`}
            strokeWidth="3.6"
            fill="rgba(15,23,42,0.18)"
          />
          <rect
            x="16"
            y="22"
            width="16"
            height="9"
            rx="4.5"
            transform="rotate(-28 24 26)"
            stroke={`url(#silverChain_${uid})`}
            strokeWidth="3.6"
            fill="rgba(15,23,42,0.18)"
          />
          <rect
            x="14"
            y="53"
            width="17"
            height="9"
            rx="4.5"
            transform="rotate(36 22 57)"
            stroke={`url(#silverChain_${uid})`}
            strokeWidth="3.6"
            fill="rgba(15,23,42,0.18)"
          />
          <rect
            x="25"
            y="63"
            width="17"
            height="9"
            rx="4.5"
            transform="rotate(18 33 67)"
            stroke={`url(#silverChain_${uid})`}
            strokeWidth="3.6"
            fill="rgba(15,23,42,0.18)"
          />
        </g>

        <g className={isUnlocking ? 'anim-chain-right' : ''}>
          {/* Right diagonal & perimeter chain links wrapping the button */}
          <rect
            x="74"
            y="38"
            width="16"
            height="9"
            rx="4.5"
            transform="rotate(52 82 42)"
            stroke={`url(#silverChain_${uid})`}
            strokeWidth="3.6"
            fill="rgba(15,23,42,0.18)"
          />
          <rect
            x="68"
            y="22"
            width="16"
            height="9"
            rx="4.5"
            transform="rotate(28 76 26)"
            stroke={`url(#silverChain_${uid})`}
            strokeWidth="3.6"
            fill="rgba(15,23,42,0.18)"
          />
          <rect
            x="69"
            y="53"
            width="17"
            height="9"
            rx="4.5"
            transform="rotate(-36 77 57)"
            stroke={`url(#silverChain_${uid})`}
            strokeWidth="3.6"
            fill="rgba(15,23,42,0.18)"
          />
          <rect
            x="58"
            y="63"
            width="17"
            height="9"
            rx="4.5"
            transform="rotate(-18 66 67)"
            stroke={`url(#silverChain_${uid})`}
            strokeWidth="3.6"
            fill="rgba(15,23,42,0.18)"
          />
        </g>

        {/* ============================================================
            2. 3D SILVER SHACKLE (Kumush Po'lat Ilmoq - Pops Open!)
           ============================================================ */}
        <g className={isUnlocking ? 'anim-shackle-pop' : ''}>
          {/* Shackle Back Shadow */}
          <path
            d="M 38 49 V 35 C 38 25.5 62 25.5 62 35 V 49"
            stroke="rgba(15, 23, 42, 0.45)"
            strokeWidth="8.5"
            strokeLinecap="round"
          />
          {/* Main 3D Chrome Shackle */}
          <path
            d="M 38 48 V 34.5 C 38 25 62 25 62 34.5 V 48"
            stroke={`url(#shackleChrome_${uid})`}
            strokeWidth="6.8"
            strokeLinecap="round"
          />
          {/* Specular White-Silver Rim Highlight */}
          <path
            d="M 40.5 46 V 34.5 C 40.5 27.8 59.5 27.8 59.5 34.5"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.85"
          />
        </g>

        {/* ============================================================
            3. 3D ROYAL GOLD & SILVER PADLOCK BODY (Oltin-Kumush Korpus)
           ============================================================ */}
        <g>
          {/* Deep 3D Bottom Extrusion Bevel */}
          <rect
            x="30"
            y="47"
            width="40"
            height="34"
            rx="9"
            fill={`url(#goldBody_${uid})`}
            stroke="#78350F"
            strokeWidth="1.5"
          />

          {/* Main Front Beveled Gold Plate */}
          <rect
            x="30"
            y="44"
            width="40"
            height="31"
            rx="8.5"
            fill={`url(#goldFront_${uid})`}
            stroke="#FEF08A"
            strokeWidth="1.4"
          />

          {/* Silver Metallic Top & Bottom Reinforcement Trim Bars */}
          <rect
            x="32"
            y="46"
            width="36"
            height="4"
            rx="2"
            fill={`url(#silverChain_${uid})`}
            opacity="0.9"
          />

          {/* Glossy Diagonal Shine Reflection */}
          <path
            d="M 34 46 L 45 46 L 36 73 L 32 73 Z"
            fill="#FFFFFF"
            opacity="0.38"
          />

          {/* 4 Silver Corner Rivets */}
          <circle cx="35.5" cy="53.5" r="1.6" fill="#F8FAFC" stroke="#475569" strokeWidth="0.8" />
          <circle cx="64.5" cy="53.5" r="1.6" fill="#F8FAFC" stroke="#475569" strokeWidth="0.8" />
          <circle cx="35.5" cy="69.5" r="1.6" fill="#F8FAFC" stroke="#475569" strokeWidth="0.8" />
          <circle cx="64.5" cy="69.5" r="1.6" fill="#F8FAFC" stroke="#475569" strokeWidth="0.8" />

          {/* Center Silver Escutcheon Ring + Keyhole */}
          <circle
            cx="50"
            cy="59.5"
            r="7.2"
            fill={`url(#silverChain_${uid})`}
            stroke="#9A3412"
            strokeWidth="1"
          />
          {/* Keyhole Circle & Slot */}
          <circle cx="50" cy="57.8" r="2.6" fill="#1E293B" />
          <path
            d="M 48.6 58.5 L 51.4 58.5 L 52.3 64.2 L 47.7 64.2 Z"
            fill="#1E293B"
          />

          {/* Crown jewel accent for chest nodes */}
          {isChest && (
            <circle
              cx="50"
              cy="48"
              r="2.3"
              fill="#EF4444"
              stroke="#FEF08A"
              strokeWidth="0.9"
            />
          )}
        </g>
      </svg>
    </div>
  );
};
