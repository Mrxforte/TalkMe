import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TalkMeHeader } from '../components/TalkMeHeader';
import { TalkMeTabRow } from '../components/TalkMeTabRow';
import { TalkMeBadge } from '../components/TalkMeBadge';
import { TalkMeCard } from '../components/TalkMeCard';
import { TalkMeButton } from '../components/TalkMeButton';
import {
  Bookmark,
  Volume2,
  Layers,
  Activity,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const LessonDetailScreen: React.FC = () => {
  const {
    navigate,
    goBack,
    playTts,
    isTtsSpeaking,
    bookmarkedLessons,
    toggleBookmark,
  } = useApp();

  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(1); // Default: Misol (matching Kotlin)

  const isBookmarked = bookmarkedLessons.includes('lesson_present_continuous');

  const example1En = 'I am studying English.';
  const example2En = 'She is reading a book now.';

  return (
    <div className="min-h-screen bg-[#FAFAFC] pb-16 text-[#1D1B20]">
      <div className="px-5 pt-4 space-y-4 max-w-md mx-auto">
        {/* Header with Circular Back Button & Bookmark */}
        <TalkMeHeader
          title="Present continuous"
          subtitle="Kundalik hayot / Tasdiq gaplar"
          onBackClick={goBack}
          trailingContent={
            <button
              onClick={() => toggleBookmark('lesson_present_continuous')}
              type="button"
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-xs ${
                isBookmarked
                  ? 'bg-[#5E4B8B] text-white border-[#5E4B8B]'
                  : 'bg-white text-[#5E4B8B] border-[#F0EFF5] hover:bg-[#F3EFFC]'
              }`}
              title={isBookmarked ? 'Saqlangan' : 'Saqlash'}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          }
        />

        {/* Tab Row Segment (Qoida has checkmark ✓) */}
        <TalkMeTabRow
          tabs={['Qoida', 'Misol', 'Mashq']}
          selectedIndex={selectedTabIndex}
          onTabSelected={(idx) => {
            setSelectedTabIndex(idx);
            if (idx === 2) navigate('quiz');
          }}
          completedIndices={[0]}
        />

        {/* Level and details badge row */}
        <div className="flex items-center gap-2 pt-1">
          <TalkMeBadge
            text="A2"
            containerColor="bg-[#F1EDFA]"
            textColor="text-[#5E4B8B]"
          />
          <span className="text-xs font-semibold text-[#757575]">
            Tasdiq gaplar · qoida va misollar
          </span>
        </div>

        {/* Rule Heading & Explanation */}
        <div>
          <h2 className="text-2xl font-extrabold text-[#1D1B20] tracking-tight">
            Hozir nima bo‘lyapti?
          </h2>
          <p className="text-sm text-[#757575] mt-1 leading-relaxed">
            Ayni paytda davom etayotgan ish-harakatni Present continuous bilan ifodalaymiz.
          </p>
        </div>

        {/* Structure Box Formula Container (TASDIQ GAP TUZILISHI) */}
        <div className="rounded-3xl p-5 bg-[#F1EDFA] border border-[#5E4B8B]/20 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-wider text-[#5E4B8B] uppercase">
              TASDIQ GAP TUZILISHI
            </span>
            <div className="w-8 h-8 rounded-lg bg-white/80 text-[#5E4B8B] flex items-center justify-center shadow-2xs">
              <Layers className="w-4 h-4" />
            </div>
          </div>

          <div className="text-xl font-extrabold text-[#1D1B20] leading-snug">
            Ega + <span className="text-[#5E4B8B]">am / is / are</span>
            <br />+ <span className="text-[#5E4B8B]">fe’l-ing</span>
          </div>

          <div className="w-full h-px bg-[#5E4B8B]/20" />

          {/* Pronoun Grid Table */}
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2 rounded-xl bg-white/70 border border-white">
              <p className="text-xs text-[#757575] font-semibold">I</p>
              <p className="text-base font-extrabold text-[#5E4B8B] mt-0.5">am</p>
            </div>
            <div className="p-2 rounded-xl bg-white/70 border border-white">
              <p className="text-xs text-[#757575] font-semibold">He / She / It</p>
              <p className="text-base font-extrabold text-[#5E4B8B] mt-0.5">is</p>
            </div>
            <div className="p-2 rounded-xl bg-white/70 border border-white">
              <p className="text-xs text-[#757575] font-semibold">You / We / They</p>
              <p className="text-base font-extrabold text-[#5E4B8B] mt-0.5">are</p>
            </div>
          </div>
        </div>

        {/* Examples Section */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#1D1B20]">
              Misolda ko‘ring · Tinglang va takrorlang
            </h3>
            <span className="text-xs font-semibold text-[#757575]">Talaffuz</span>
          </div>

          {/* Example 1 Card */}
          <TalkMeCard className="group">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-base font-bold text-[#1D1B20]">
                  I <span className="text-[#5E4B8B] font-extrabold underline decoration-[#5E4B8B]/30">am studying</span> English.
                </p>
                <p className="text-xs text-[#757575] mt-1">
                  Men ingliz tilini o‘rganyapman.
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() =>
                    playTts(
                      example1En,
                      undefined,
                      'Speak slowly, clearly, and patiently word by word for a mobile English learner'
                    )
                  }
                  type="button"
                  className="px-2.5 h-9 rounded-full bg-[#FFF4E5] text-amber-700 text-[11px] font-extrabold flex items-center justify-center hover:bg-amber-200 transition-all cursor-pointer active:scale-95"
                  title="Sekin talaffuz (Gemini 3.8)"
                >
                  🐢 Sekin
                </button>
                <button
                  onClick={() => playTts(example1En)}
                  type="button"
                  className="w-11 h-11 rounded-full bg-[#F1EDFA] text-[#5E4B8B] flex items-center justify-center hover:bg-[#5E4B8B] hover:text-white transition-all cursor-pointer active:scale-95 shadow-xs"
                  title="Tabiiy ovozda tinglash (Gemini 3.8)"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </TalkMeCard>

          {/* Example 2 Card */}
          <TalkMeCard className="group">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-base font-bold text-[#1D1B20]">
                  She <span className="text-[#5E4B8B] font-extrabold underline decoration-[#5E4B8B]/30">is reading</span> a book now.
                </p>
                <p className="text-xs text-[#757575] mt-1">
                  U hozir kitob o‘qiyapti.
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() =>
                    playTts(
                      example2En,
                      undefined,
                      'Speak slowly, clearly, and patiently word by word for a mobile English learner'
                    )
                  }
                  type="button"
                  className="px-2.5 h-9 rounded-full bg-[#FFF4E5] text-amber-700 text-[11px] font-extrabold flex items-center justify-center hover:bg-amber-200 transition-all cursor-pointer active:scale-95"
                  title="Sekin talaffuz (Gemini 3.8)"
                >
                  🐢 Sekin
                </button>
                <button
                  onClick={() => playTts(example2En)}
                  type="button"
                  className="w-11 h-11 rounded-full bg-[#F1EDFA] text-[#5E4B8B] flex items-center justify-center hover:bg-[#5E4B8B] hover:text-white transition-all cursor-pointer active:scale-95 shadow-xs"
                  title="Tabiiy ovozda tinglash (Gemini 3.8)"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </TalkMeCard>
        </div>

        {/* Pronunciation Tip Card (Talaffuz: -ing /ɪŋ/) */}
        <div className="rounded-2xl p-4 bg-[#E8F8EE] border border-[#27AE60]/30 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold text-[#27AE60]">
              Talaffuz: -ing /ɪŋ/
            </p>
            <p className="text-xs text-[#2E7D32] mt-0.5 font-medium">
              Oxiridagi /g/ alohida aytilmaydi, burun orqali yumshoq talaffuz qilinadi.
            </p>
          </div>

          <div className="w-9 h-9 rounded-xl bg-white text-[#27AE60] flex items-center justify-center shadow-xs shrink-0">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Start Quiz Action Button */}
        <div className="pt-3 space-y-2">
          <TalkMeButton
            text="Mashqlarga o‘tish"
            trailingIcon={<ChevronRight className="w-5 h-5" />}
            onClick={() => navigate('quiz')}
          />

          <p className="text-xs text-[#757575] text-center">
            5 ta savol · bilimni amalda sinab ko‘ring
          </p>
        </div>
      </div>
    </div>
  );
};
