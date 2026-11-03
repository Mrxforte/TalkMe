import React, { useState, useEffect } from 'react';
import { Volume2, Square, Sparkles } from 'lucide-react';
import { speechManager, subscriptionService } from '../../../engines/tts-engine/speechArchitecture';
import { useApp } from '../../../context/AppContext';

// ============================================================================
// 1. SPEAKABLE WORD — Tap any individual English word to hear pronunciation
// ============================================================================

export interface SpeakableWordProps {
  word: string;
  translationUz?: string;
  phonetic?: string;
  isHighlighted?: boolean;
  className?: string;
  showIcon?: boolean;
}

export const SpeakableWord: React.FC<SpeakableWordProps> = ({
  word,
  translationUz,
  phonetic,
  isHighlighted = false,
  className = '',
  showIcon = false,
}) => {
  const { voiceSettings } = useApp();
  const [playingThis, setPlayingThis] = useState(false);

  const cleanWord = word.replace(/[^a-zA-Z0-9'-]/g, '') || word;

  const handleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayingThis(true);
    speechManager
      .speak({
        text: cleanWord,
        profileId: voiceSettings.selectedCharacterProfile,
        speed: voiceSettings.speechSpeed,
        onEnd: () => setPlayingThis(false),
      })
      .catch(() => setPlayingThis(false));
  };

  return (
    <span
      onClick={handleTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleTap(e as unknown as React.MouseEvent);
      }}
      title={
        translationUz
          ? `${cleanWord} — ${translationUz} (Eshitish uchun bosing)`
          : `${cleanWord} (Talaffuzni eshitish)`
      }
      className={`inline-flex items-center gap-1 rounded px-1 py-0.5 transition-all cursor-pointer select-none border-b border-dashed ${
        playingThis || isHighlighted
          ? 'bg-[#00897B] text-white border-[#00897B] font-bold shadow-2xs scale-[1.03]'
          : 'border-[#3949AB]/40 text-[#212121] hover:bg-[#E8EAF6] hover:text-[#3949AB]'
      } ${className}`}
    >
      <span>{word}</span>
      {showIcon && <Volume2 className="w-3 h-3 shrink-0 text-[#3949AB]" />}
    </span>
  );
};

// ============================================================================
// 2. SPEAKABLE SENTENCE — Tap to hear full sentence OR tap individual words
// ============================================================================

export interface SpeakableSentenceProps {
  sentence: string;
  translationUz?: string;
  interactiveWords?: boolean;
  className?: string;
}

export const SpeakableSentence: React.FC<SpeakableSentenceProps> = ({
  sentence,
  translationUz,
  interactiveWords = true,
  className = '',
}) => {
  const { voiceSettings } = useApp();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeWordIdx, setActiveWordIdx] = useState<number>(-1);

  useEffect(() => {
    return speechManager.subscribe((state) => {
      if (state.activeText === sentence) {
        setIsSpeaking(state.isSpeaking);
        setActiveWordIdx(state.activeWordIndex);
      } else {
        setIsSpeaking(false);
        setActiveWordIdx(-1);
      }
    });
  }, [sentence]);

  const handlePlaySentence = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      speechManager.stop();
      return;
    }
    speechManager.speak({
      text: sentence,
      profileId: voiceSettings.selectedCharacterProfile,
      speed: voiceSettings.speechSpeed,
    });
  };

  const words = sentence.trim().split(/\s+/);

  return (
    <div
      className={`p-3 rounded-xl bg-white border transition-all ${
        isSpeaking ? 'border-[#00897B] bg-[#E0F2F1]/30' : 'border-[#E0E4EC]'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex-1 leading-relaxed text-sm font-semibold text-[#212121]">
          {interactiveWords ? (
            <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
              {words.map((w, idx) => (
                <SpeakableWord
                  key={`${w}-${idx}`}
                  word={w}
                  isHighlighted={isSpeaking && activeWordIdx === idx}
                />
              ))}
            </div>
          ) : (
            <span onClick={handlePlaySentence} className="cursor-pointer hover:text-[#3949AB]">
              {sentence}
            </span>
          )}
          {translationUz && (
            <p className="text-xs font-medium text-[#616161] mt-1">{translationUz}</p>
          )}
        </div>

        <button
          type="button"
          onClick={handlePlaySentence}
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
            isSpeaking
              ? 'bg-[#00897B] text-white'
              : 'bg-[#E8EAF6] text-[#3949AB] hover:bg-[#3949AB] hover:text-white'
          }`}
          title={isSpeaking ? 'To‘xtatish' : 'Gapni eshitish (TTS)'}
        >
          {isSpeaking ? (
            <Square className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 3. SPEAKABLE PARAGRAPH — Full paragraph playback + word-by-word selection
// ============================================================================

export interface SpeakableParagraphProps {
  textEn: string;
  translationUz?: string;
  titleEn?: string;
}

export const SpeakableParagraph: React.FC<SpeakableParagraphProps> = ({
  textEn,
  translationUz,
  titleEn,
}) => {
  const { voiceSettings } = useApp();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeWordIdx, setActiveWordIdx] = useState<number>(-1);

  useEffect(() => {
    return speechManager.subscribe((state) => {
      if (state.activeText === textEn) {
        setIsSpeaking(state.isSpeaking);
        setActiveWordIdx(state.activeWordIndex);
      } else {
        setIsSpeaking(false);
        setActiveWordIdx(-1);
      }
    });
  }, [textEn]);

  const handleTogglePlay = () => {
    if (isSpeaking) {
      speechManager.stop();
    } else {
      speechManager.speak({
        text: textEn,
        profileId: voiceSettings.selectedCharacterProfile,
        speed: voiceSettings.speechSpeed,
      });
    }
  };

  const words = textEn.trim().split(/\s+/);

  return (
    <div className="p-4 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#3949AB]">
          {titleEn || 'English Passage (Tap any word or Play All)'}
        </span>

        <button
          type="button"
          onClick={handleTogglePlay}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            isSpeaking
              ? 'bg-[#00897B] text-white'
              : 'bg-[#3949AB] text-white hover:bg-[#283593]'
          }`}
        >
          {isSpeaking ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>To‘xtatish</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span>Matnni tinglash</span>
            </>
          )}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm leading-relaxed">
        {words.map((w, idx) => (
          <SpeakableWord
            key={`${w}-${idx}`}
            word={w}
            isHighlighted={isSpeaking && activeWordIdx === idx}
          />
        ))}
      </div>

      {translationUz && (
        <p className="text-xs text-[#616161] pt-2 border-t border-[#E0E4EC] leading-relaxed">
          {translationUz}
        </p>
      )}
    </div>
  );
};

// ============================================================================
// 4. SPEAKABLE TEXT & ENGLISH TEXT WRAPPERS
// ============================================================================

export const EnglishText: React.FC<{
  text: string;
  translationUz?: string;
  className?: string;
  inline?: boolean;
}> = ({ text, translationUz, className = '', inline = true }) => {
  const { voiceSettings } = useApp();
  const [speaking, setSpeaking] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSpeaking(true);
    speechManager
      .speak({
        text,
        profileId: voiceSettings.selectedCharacterProfile,
        speed: voiceSettings.speechSpeed,
        onEnd: () => setSpeaking(false),
      })
      .catch(() => setSpeaking(false));
  };

  if (inline) {
    return (
      <span
        onClick={handlePlay}
        title={translationUz ? `${text} — ${translationUz}` : 'Tinglash uchun bosing'}
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-semibold cursor-pointer transition-colors ${
          speaking
            ? 'bg-[#00897B] text-white'
            : 'bg-[#E8EAF6] text-[#3949AB] hover:bg-[#3949AB] hover:text-white'
        } ${className}`}
      >
        <span>{text}</span>
        <Volume2 className="w-3 h-3 shrink-0" />
      </span>
    );
  }

  return <SpeakableSentence sentence={text} translationUz={translationUz} className={className} />;
};

export const SpeakableText = EnglishText;

// ============================================================================
// 5. SPEAKABLE RICH TEXT — Mixed Uzbek + English (e.g., quotes or [en:Hello!])
// ============================================================================

export const SpeakableRichText: React.FC<{
  content: string;
  className?: string;
}> = ({ content, className = '' }) => {
  // Detects quoted English segments like "I am happy." or “She is reading.”
  const parts = content.split(/("[^"]+"|“[^”]+”)/g);

  return (
    <span className={`leading-relaxed ${className}`}>
      {parts.map((part, idx) => {
        if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith('“') && part.endsWith('”'))) {
          const inner = part.slice(1, -1);
          return (
            <EnglishText key={idx} text={inner} inline={true} className="mx-0.5" />
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </span>
  );
};

// ============================================================================
// 6. GLOBAL AUDIO CONTROLS BAR (Rendered ONLY inside Profile / Settings)
// ============================================================================

export const GlobalTtsControlStrip: React.FC<{ showInSettingsOnly?: boolean }> = ({
  showInSettingsOnly = false,
}) => {
  const { voiceSettings, updateVoiceSettings } = useApp();
  const [tier, setTier] = useState(subscriptionService.getTier());
  const [speakingState, setSpeakingState] = useState<{
    isSpeaking: boolean;
    activeText: string | null;
  }>({ isSpeaking: false, activeText: null });

  useEffect(() => {
    const unsubTier = subscriptionService.subscribe(setTier);
    const unsubSpeech = speechManager.subscribe((s) =>
      setSpeakingState({ isSpeaking: s.isSpeaking, activeText: s.activeText })
    );
    return () => {
      unsubTier();
      unsubSpeech();
    };
  }, []);

  if (!showInSettingsOnly) {
    return null;
  }

  const toggleTier = () => {
    const next = tier === 'PREMIUM' ? 'FREE' : 'PREMIUM';
    subscriptionService.setTier(next);
  };

  return (
    <div className="p-3 rounded-xl bg-white border border-[#E0E4EC] shadow-2xs flex flex-wrap items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTier}
          className={`px-2.5 py-1 rounded-md font-bold flex items-center gap-1 cursor-pointer transition-colors ${
            tier === 'PREMIUM'
              ? 'bg-[#3949AB] text-white'
              : 'bg-[#F5F6FA] text-[#616161] border border-[#E0E4EC]'
          }`}
          title="TTS Provider rejimini almashtirish (Premium Gemini TTS / Free Native TTS)"
        >
          <Sparkles className="w-3 h-3" />
          <span>{tier === 'PREMIUM' ? 'Premium: Gemini TTS' : 'Free: Browser TTS'}</span>
        </button>

        {speakingState.isSpeaking && (
          <button
            type="button"
            onClick={() => speechManager.stop()}
            className="px-2 py-1 rounded-md bg-[#D32F2F] text-white font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Stop</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-semibold text-[#616161]">Tezlik:</span>
        {[0.8, 0.92, 1.05].map((spd) => (
          <button
            key={spd}
            type="button"
            onClick={() => updateVoiceSettings({ speechSpeed: spd })}
            className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
              Math.abs(voiceSettings.speechSpeed - spd) < 0.04
                ? 'bg-[#00897B] text-white'
                : 'bg-[#F5F6FA] text-[#616161] hover:text-[#212121]'
            }`}
          >
            {spd}x
          </button>
        ))}
      </div>
    </div>
  );
};
