import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  CheckCircle2,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Volume2,
  ArrowRight,
  ArrowDown,
  Trophy,
} from 'lucide-react';
import {
  CrosswordGridPayload,
  CrosswordClueItem,
} from '../types/grammarFrameworkTypes';
import { validateCrosswordGrid } from '../engine/exerciseEngine';

interface PlayableCrosswordWidgetProps {
  crossword: CrosswordGridPayload;
  onComplete: (
    gridValues: Record<string, string>,
    validationResult: { isCorrect: boolean; accuracy: number }
  ) => void;
  onPlayAudio?: (text: string) => void;
}

interface CrosswordCellMeta {
  row: number;
  col: number;
  expectedLetter: string;
  clueNumber?: number;
  clueIds: string[];
}

function buildCellMap(crossword: CrosswordGridPayload): Map<string, CrosswordCellMeta> {
  const map = new Map<string, CrosswordCellMeta>();
  for (const clue of crossword.clues) {
    const clean = clue.answer.trim().toUpperCase();
    for (let i = 0; i < clean.length; i++) {
      const r = clue.direction === 'down' ? clue.row + i : clue.row;
      const c = clue.direction === 'across' ? clue.col + i : clue.col;
      const key = `${r}_${c}`;
      const existing = map.get(key);
      if (existing) {
        if (!existing.clueIds.includes(clue.id)) {
          existing.clueIds.push(clue.id);
        }
        if (i === 0 && existing.clueNumber === undefined) {
          existing.clueNumber = clue.number;
        }
      } else {
        map.set(key, {
          row: r,
          col: c,
          expectedLetter: clean[i],
          clueNumber: i === 0 ? clue.number : undefined,
          clueIds: [clue.id],
        });
      }
    }
  }
  return map;
}

const ALPHABET_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const PlayableCrosswordWidget: React.FC<PlayableCrosswordWidgetProps> = ({
  crossword,
  onComplete,
  onPlayAudio,
}) => {
  const cellMap = useMemo(() => buildCellMap(crossword), [crossword]);
  const [gridValues, setGridValues] = useState<Record<string, string>>({});
  const [activeClueId, setActiveClueId] = useState<string>(crossword.clues[0]?.id || '');
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number }>(() => ({
    row: crossword.clues[0]?.row || 0,
    col: crossword.clues[0]?.col || 0,
  }));
  const [hasChecked, setHasChecked] = useState(false);
  const [cellStatuses, setCellStatuses] = useState<
    Record<string, 'correct' | 'incorrect' | 'empty'>
  >({});
  const [solvedCelebration, setSolvedCelebration] = useState(false);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const activeClue = useMemo(
    () => crossword.clues.find((c) => c.id === activeClueId) || crossword.clues[0],
    [crossword.clues, activeClueId]
  );

  const activeClueCoords = useMemo(() => {
    const coords: Array<{ row: number; col: number; key: string }> = [];
    if (!activeClue) return coords;
    const len = activeClue.answer.trim().length;
    for (let i = 0; i < len; i++) {
      const r = activeClue.direction === 'down' ? activeClue.row + i : activeClue.row;
      const c = activeClue.direction === 'across' ? activeClue.col + i : activeClue.col;
      coords.push({ row: r, col: c, key: `${r}_${c}` });
    }
    return coords;
  }, [activeClue]);

  const activeClueKeySet = useMemo(
    () => new Set(activeClueCoords.map((item) => item.key)),
    [activeClueCoords]
  );

  const isClueSolved = (clue: CrosswordClueItem): boolean => {
    const clean = clue.answer.trim().toUpperCase();
    for (let i = 0; i < clean.length; i++) {
      const r = clue.direction === 'down' ? clue.row + i : clue.row;
      const c = clue.direction === 'across' ? clue.col + i : clue.col;
      if ((gridValues[`${r}_${c}`] || '').toUpperCase() !== clean[i]) {
        return false;
      }
    }
    return true;
  };

  const selectClue = (clue: CrosswordClueItem) => {
    setActiveClueId(clue.id);
    const clean = clue.answer.trim().toUpperCase();
    for (let i = 0; i < clean.length; i++) {
      const r = clue.direction === 'down' ? clue.row + i : clue.row;
      const c = clue.direction === 'across' ? clue.col + i : clue.col;
      if (!gridValues[`${r}_${c}`]) {
        setSelectedCell({ row: r, col: c });
        hiddenInputRef.current?.focus();
        return;
      }
    }
    setSelectedCell({ row: clue.row, col: clue.col });
    hiddenInputRef.current?.focus();
  };

  const handleCellClick = (row: number, col: number) => {
    const key = `${row}_${col}`;
    const meta = cellMap.get(key);
    if (!meta) return;

    if (selectedCell.row === row && selectedCell.col === col && meta.clueIds.length > 1) {
      const otherClueId = meta.clueIds.find((id) => id !== activeClueId) || meta.clueIds[0];
      setActiveClueId(otherClueId);
    } else if (!meta.clueIds.includes(activeClueId)) {
      setActiveClueId(meta.clueIds[0]);
    }
    setSelectedCell({ row, col });
    hiddenInputRef.current?.focus();
  };

  const advanceCursor = (fromRow: number, fromCol: number, step: 1 | -1) => {
    const idx = activeClueCoords.findIndex((c) => c.row === fromRow && c.col === fromCol);
    if (idx === -1) return;
    const nextIdx = idx + step;
    if (nextIdx >= 0 && nextIdx < activeClueCoords.length) {
      setSelectedCell({
        row: activeClueCoords[nextIdx].row,
        col: activeClueCoords[nextIdx].col,
      });
    }
  };

  const handleLetterInput = (letter: string) => {
    const cleanLetter = letter.toUpperCase().replace(/[^A-Z]/g, '');
    if (!cleanLetter) return;
    const key = `${selectedCell.row}_${selectedCell.col}`;
    if (!cellMap.has(key)) return;

    const updated = {
      ...gridValues,
      [key]: cleanLetter[0],
    };
    setGridValues(updated);
    setHasChecked(false);
    advanceCursor(selectedCell.row, selectedCell.col, 1);
  };

  const handleBackspace = () => {
    const key = `${selectedCell.row}_${selectedCell.col}`;
    if (gridValues[key]) {
      const updated = { ...gridValues };
      delete updated[key];
      setGridValues(updated);
      setHasChecked(false);
    } else {
      const idx = activeClueCoords.findIndex(
        (c) => c.row === selectedCell.row && c.col === selectedCell.col
      );
      if (idx > 0) {
        const prev = activeClueCoords[idx - 1];
        const prevKey = `${prev.row}_${prev.col}`;
        const updated = { ...gridValues };
        delete updated[prevKey];
        setGridValues(updated);
        setSelectedCell({ row: prev.row, col: prev.col });
        setHasChecked(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      handleBackspace();
      return;
    }
    if (/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();
      handleLetterInput(e.key);
    }
  };

  const handleRevealHint = () => {
    const targetCoords = [
      {
        row: selectedCell.row,
        col: selectedCell.col,
        key: `${selectedCell.row}_${selectedCell.col}`,
      },
      ...activeClueCoords,
    ];
    for (const coord of targetCoords) {
      const meta = cellMap.get(coord.key);
      if (meta && (gridValues[coord.key] || '').toUpperCase() !== meta.expectedLetter) {
        const updated = {
          ...gridValues,
          [coord.key]: meta.expectedLetter,
        };
        setGridValues(updated);
        setSelectedCell({ row: coord.row, col: coord.col });
        advanceCursor(coord.row, coord.col, 1);
        setHasChecked(false);
        return;
      }
    }
  };

  const handleReset = () => {
    setGridValues({});
    setHasChecked(false);
    setCellStatuses({});
    setSolvedCelebration(false);
  };

  const handleCheckCrossword = () => {
    const result = validateCrosswordGrid(crossword, gridValues);
    setCellStatuses(result.cellStatuses);
    setHasChecked(true);
    if (result.isAllCorrect) {
      setSolvedCelebration(true);
    }
    const accuracy =
      result.totalRequiredCells > 0
        ? Math.round((result.correctCellsCount / result.totalRequiredCells) * 100)
        : 0;
    onComplete(gridValues, {
      isCorrect: result.isAllCorrect,
      accuracy,
    });
  };

  useEffect(() => {
    const totalActiveCells = cellMap.size;
    const filledCount = Array.from(cellMap.keys()).filter((k) => Boolean(gridValues[k])).length;
    if (filledCount === totalActiveCells && totalActiveCells > 0 && !solvedCelebration) {
      const check = validateCrosswordGrid(crossword, gridValues);
      if (check.isAllCorrect) {
        setCellStatuses(check.cellStatuses);
        setHasChecked(true);
        setSolvedCelebration(true);
        onComplete(gridValues, { isCorrect: true, accuracy: 100 });
      }
    }
  }, [gridValues, cellMap, crossword, onComplete, solvedCelebration]);

  const filledCellsCount = Array.from(cellMap.keys()).filter((k) => Boolean(gridValues[k])).length;

  return (
    <div className="space-y-4 outline-none" tabIndex={0} onKeyDown={handleKeyDown}>
      <input
        ref={hiddenInputRef}
        type="text"
        value=""
        onChange={(e) => {
          const val = e.target.value;
          if (val) handleLetterInput(val.slice(-1));
        }}
        onKeyDown={handleKeyDown}
        className="sr-only"
        aria-label="Crossword letter input"
      />

      {activeClue && (
        <div className="rounded-2xl bg-gradient-to-r from-indigo-950/90 via-slate-900 to-indigo-950/90 border border-indigo-500/40 p-3.5 shadow-lg">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-[11px] font-extrabold text-indigo-300 uppercase tracking-wider">
              {activeClue.direction === 'across' ? (
                <>
                  <ArrowRight className="w-3.5 h-3.5" /> {activeClue.number}-Gorizontal (Across)
                </>
              ) : (
                <>
                  <ArrowDown className="w-3.5 h-3.5" /> {activeClue.number}-Vertikal (Down)
                </>
              )}
            </span>
            <div className="flex items-center gap-1.5">
              {isClueSolved(activeClue) && onPlayAudio && (
                <button
                  type="button"
                  onClick={() => onPlayAudio(activeClue.answer)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition"
                >
                  <Volume2 className="w-3.5 h-3.5" /> {activeClue.answer}
                </button>
              )}
              <span className="text-[11px] font-bold text-slate-400">
                {activeClue.answer.length} harf
              </span>
            </div>
          </div>
          <p className="text-sm font-bold text-white leading-snug">{activeClue.clueUz}</p>
          {activeClue.clueEnHint && (
            <p className="text-xs text-indigo-300/80 mt-0.5 italic">{activeClue.clueEnHint}</p>
          )}
        </div>
      )}

      {/* 2D Playable Crossword Grid */}
      <div className="rounded-2xl bg-slate-950/90 border border-slate-800 p-3 overflow-x-auto shadow-inner">
        <div
          className="grid gap-1 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${crossword.cols}, minmax(28px, 36px))`,
            width: 'fit-content',
          }}
        >
          {Array.from({ length: crossword.rows }).map((_, r) =>
            Array.from({ length: crossword.cols }).map((__, c) => {
              const key = `${r}_${c}`;
              const meta = cellMap.get(key);
              if (!meta) {
                return (
                  <div
                    key={key}
                    className="w-7 h-7 sm:w-9 sm:h-9 rounded-md bg-slate-900/40 border border-slate-800/30"
                  />
                );
              }

              const isSelected = selectedCell.row === r && selectedCell.col === c;
              const isInActiveWord = activeClueKeySet.has(key);
              const val = gridValues[key] || '';
              const status = cellStatuses[key];

              let cellStyle =
                'bg-slate-800/90 border-slate-600 text-white hover:border-indigo-400';
              if (isSelected) {
                cellStyle =
                  'bg-amber-500/30 border-amber-400 text-amber-200 ring-2 ring-amber-400/50 scale-105 z-10';
              } else if (hasChecked && status === 'correct') {
                cellStyle = 'bg-emerald-500/25 border-emerald-400 text-emerald-200';
              } else if (hasChecked && status === 'incorrect') {
                cellStyle = 'bg-rose-500/25 border-rose-400 text-rose-200';
              } else if (isInActiveWord) {
                cellStyle = 'bg-indigo-500/25 border-indigo-400/80 text-white';
              }

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleCellClick(r, c)}
                  className={`relative w-7 h-7 sm:w-9 sm:h-9 rounded-lg border-2 flex items-center justify-center font-extrabold text-sm sm:text-base transition-all select-none ${cellStyle}`}
                >
                  {meta.clueNumber !== undefined && (
                    <span className="absolute top-0.5 left-1 text-[8px] sm:text-[9px] font-black leading-none text-amber-300">
                      {meta.clueNumber}
                    </span>
                  )}
                  <span className="mt-0.5">{val}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* On-Screen Interactive Letter Keypad */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-3 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Harflarni bosing yoki klaviaturada yozing:</span>
          <span className="font-bold text-indigo-300">
            {filledCellsCount} / {cellMap.size} katak
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-1.5">
          {ALPHABET_KEYS.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => handleLetterInput(letter)}
              className="w-8 h-9 sm:w-9 sm:h-10 rounded-lg bg-slate-800 hover:bg-indigo-600/40 active:scale-95 border border-slate-700 hover:border-indigo-400 text-white font-bold text-xs sm:text-sm transition"
            >
              {letter}
            </button>
          ))}
          <button
            type="button"
            onClick={handleBackspace}
            className="px-3 h-9 sm:h-10 rounded-lg bg-rose-950/70 hover:bg-rose-900/70 border border-rose-500/40 text-rose-200 font-bold text-xs transition"
          >
            ⌫ O‘chirish
          </button>
        </div>
      </div>

      {/* Clues Selector List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {crossword.clues.map((clue) => {
          const solved = isClueSolved(clue);
          const isCurrent = clue.id === activeClueId;
          return (
            <div
              key={clue.id}
              onClick={() => selectClue(clue)}
              className={`cursor-pointer rounded-xl p-3 border transition-all ${
                solved
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
                  : isCurrent
                  ? 'bg-indigo-950/50 border-indigo-400 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-5 h-5 rounded-md bg-slate-800 text-amber-300 inline-flex items-center justify-center text-[11px]">
                    {clue.number}
                  </span>
                  {clue.direction === 'across' ? 'Gorizontal' : 'Vertikal'}
                </span>
                <div className="flex items-center gap-1.5">
                  {solved && (
                    <>
                      {onPlayAudio && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlayAudio(clue.answer);
                          }}
                          className="p-1 rounded-md bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                          title="Talaffuzni eshitish"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs leading-relaxed">{clue.clueUz}</p>
            </div>
          );
        })}
      </div>

      {/* Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRevealHint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/25 transition"
          >
            <HelpCircle className="w-4 h-4" />
            1 ta harf yordam (Hint)
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Tozalash
          </button>
        </div>

        <button
          type="button"
          onClick={handleCheckCrossword}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-indigo-500/20 hover:opacity-95 transition"
        >
          <Sparkles className="w-4 h-4" />
          Krossvordni tekshirish
        </button>
      </div>

      {solvedCelebration && (
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950/90 via-teal-950/90 to-emerald-950/90 border border-emerald-400/50 p-4 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-emerald-200">
                Barakalla! Krossvord 100% to‘g‘ri yechildi!
              </h4>
              <p className="text-xs text-emerald-300/80">
                SENTENCE, STUDENT, TEACHER va WORD so‘zlari muvaffaqiyatli o‘zlashtirildi.
              </p>
            </div>
          </div>
          {onPlayAudio && (
            <button
              type="button"
              onClick={() => onPlayAudio('Sentence, Student, Teacher, Word')}
              className="px-3 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-1.5 shrink-0 hover:bg-emerald-500/30"
            >
              <Volume2 className="w-4 h-4" /> Eshitish
            </button>
          )}
        </div>
      )}
    </div>
  );
};
