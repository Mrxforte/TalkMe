import {
  Exercise,
  CrosswordGridPayload,
} from '../types/grammarFrameworkTypes';

export interface ExerciseEvaluationInput {
  selectedOption?: string;
  selectedOptions?: string[];
  textInput?: string;
  orderedTokens?: string[];
  categorizedMap?: Record<string, string>; // itemId -> categoryId
  matchedPairs?: Record<string, string>; // leftText -> rightText
  crosswordCells?: Record<string, string>; // "r_c" -> uppercase letter
  builtWordsCompleted?: string[]; // list of completed targetWords
  spokenPhrasesCompleted?: string[]; // list of practiced/spoken prompt IDs
}

export interface ExerciseEvaluationOutput {
  isCorrect: boolean;
  accuracyRatio: number; // 0.0 to 1.0
  feedbackTitleUz: string;
  feedbackExplanationUz: string;
  normalizedUserAnswer: string;
  expectedAnswerDisplay: string;
}

export function normalizeEnglishString(str: string): string {
  return str.trim().replace(/\s+/g, ' ');
}

export function validateCrosswordGrid(
  crossword: CrosswordGridPayload,
  userCells: Record<string, string>
): {
  isAllCorrect: boolean;
  correctCellsCount: number;
  totalRequiredCells: number;
  cellStatuses: Record<string, 'correct' | 'incorrect' | 'empty'>;
} {
  const expectedMap = new Map<string, string>();
  for (const clue of crossword.clues) {
    const word = clue.answer.trim().toUpperCase();
    for (let i = 0; i < word.length; i++) {
      const r = clue.direction === 'across' ? clue.row : clue.row + i;
      const c = clue.direction === 'across' ? clue.col + i : clue.col;
      expectedMap.set(`${r}_${c}`, word[i]);
    }
  }

  let correctCellsCount = 0;
  const cellStatuses: Record<string, 'correct' | 'incorrect' | 'empty'> = {};

  for (const [key, expectedChar] of expectedMap.entries()) {
    const userChar = (userCells[key] || '').trim().toUpperCase();
    if (!userChar) {
      cellStatuses[key] = 'empty';
    } else if (userChar === expectedChar) {
      cellStatuses[key] = 'correct';
      correctCellsCount++;
    } else {
      cellStatuses[key] = 'incorrect';
    }
  }

  const totalRequiredCells = expectedMap.size;
  return {
    isAllCorrect: totalRequiredCells > 0 && correctCellsCount === totalRequiredCells,
    correctCellsCount,
    totalRequiredCells,
    cellStatuses,
  };
}

/**
 * Strategy-based Exercise Answer Evaluator supporting all 24 reusable exercise types.
 */
export function evaluateExerciseSubmission(
  exercise: Exercise,
  input: ExerciseEvaluationInput
): ExerciseEvaluationOutput {
  switch (exercise.type) {
    case 'categorization':
    case 'word_sorting':
    case 'grammar_classification': {
      const items = exercise.categorizationItems || [];
      if (items.length === 0 && input.selectedOption) {
        // Fallback single classification item
        const isCorrect = exercise.acceptedAnswers.some(
          (ans) => ans.toLowerCase() === input.selectedOption?.trim().toLowerCase()
        );
        return {
          isCorrect,
          accuracyRatio: isCorrect ? 1 : 0,
          feedbackTitleUz: isCorrect ? 'Barakalla! To‘g‘ri tasniflandingiz!' : 'Qayta tekshirib ko‘ring',
          feedbackExplanationUz: exercise.explanationUz,
          normalizedUserAnswer: input.selectedOption || '',
          expectedAnswerDisplay: exercise.acceptedAnswers[0] || '',
        };
      }

      const map = input.categorizedMap || {};
      let correctCount = 0;
      for (const item of items) {
        if (map[item.id] === item.correctCategory) {
          correctCount++;
        }
      }
      const isCorrect = items.length > 0 && correctCount === items.length;
      return {
        isCorrect,
        accuracyRatio: items.length > 0 ? correctCount / items.length : 0,
        feedbackTitleUz: isCorrect
          ? `Ajoyib! Barcha ${items.length} ta element to‘g‘ri guruhga ajratildi!`
          : `${correctCount} / ${items.length} ta to‘g‘ri. Qoidaga e’tibor bering:`,
        feedbackExplanationUz: exercise.explanationUz,
        normalizedUserAnswer: `${correctCount}/${items.length}`,
        expectedAnswerDisplay: exercise.acceptedAnswers[0] || 'ALL_SORTED',
      };
    }

    case 'matching_pairs': {
      const pairs = exercise.matchingPairs || [];
      const userMap = input.matchedPairs || {};
      let correctCount = 0;
      for (const p of pairs) {
        if (userMap[p.leftText] === p.rightText) {
          correctCount++;
        }
      }
      const isCorrect = pairs.length > 0 && correctCount === pairs.length;
      return {
        isCorrect,
        accuracyRatio: pairs.length > 0 ? correctCount / pairs.length : 0,
        feedbackTitleUz: isCorrect
          ? 'Barcha juftliklar 100% to‘g‘ri topildi!'
          : `${correctCount} / ${pairs.length} juftlik mos tushdi.`,
        feedbackExplanationUz: exercise.explanationUz,
        normalizedUserAnswer: `${correctCount}/${pairs.length}`,
        expectedAnswerDisplay: exercise.acceptedAnswers[0] || 'ALL_MATCHED',
      };
    }

    case 'word_ordering': {
      const items = exercise.wordBuildItems || [];
      if (items.length > 0 && input.builtWordsCompleted) {
        const doneSet = new Set(input.builtWordsCompleted.map((w) => w.toUpperCase()));
        const correctCount = items.filter((it) => doneSet.has(it.targetWord.toUpperCase())).length;
        const isCorrect = correctCount === items.length;
        return {
          isCorrect,
          accuracyRatio: correctCount / items.length,
          feedbackTitleUz: isCorrect
            ? 'Barcha so‘zlar harflardan to‘g‘ri yasaldi!'
            : `${correctCount}/${items.length} ta so‘z yasaldi.`,
          feedbackExplanationUz: exercise.explanationUz,
          normalizedUserAnswer: input.builtWordsCompleted.join(', '),
          expectedAnswerDisplay: items.map((i) => i.targetWord).join(', '),
        };
      }
      const joined = (input.orderedTokens || []).join('');
      const isCorrect = exercise.acceptedAnswers.some(
        (a) => a.toUpperCase() === joined.toUpperCase()
      );
      return {
        isCorrect,
        accuracyRatio: isCorrect ? 1 : 0,
        feedbackTitleUz: isCorrect ? 'So‘z to‘g‘ri yasaldi!' : 'Harflar tartibini tekshiring',
        feedbackExplanationUz: exercise.explanationUz,
        normalizedUserAnswer: joined,
        expectedAnswerDisplay: exercise.acceptedAnswers[0] || '',
      };
    }

    case 'sentence_builder': {
      const built = normalizeEnglishString((input.orderedTokens || []).join(' '));
      const isCorrect = exercise.acceptedAnswers.some(
        (ans) => normalizeEnglishString(ans).toLowerCase() === built.toLowerCase()
      );
      return {
        isCorrect,
        accuracyRatio: isCorrect ? 1 : 0,
        feedbackTitleUz: isCorrect
          ? 'Gap qurilishi (Subject + Verb + Object) to‘g‘ri!'
          : 'Ingliz tilida so‘z tartibi: Ega (Subject) + Fe’l (Verb) + To‘ldiruvchi (Object)',
        feedbackExplanationUz: exercise.explanationUz,
        normalizedUserAnswer: built,
        expectedAnswerDisplay: exercise.acceptedAnswers[0] || '',
      };
    }

    case 'error_correction':
    case 'text_input':
    case 'sentence_transformation': {
      const rawText = normalizeEnglishString(input.textInput || input.selectedOption || '');
      // For capitalization and punctuation exercises, check exact case & punctuation!
      const isExactCaseRequired =
        exercise.id.includes('capitalization') || exercise.id.includes('punctuation');
      const isCorrect = exercise.acceptedAnswers.some((ans) =>
        isExactCaseRequired
          ? normalizeEnglishString(ans) === rawText
          : normalizeEnglishString(ans).toLowerCase() === rawText.toLowerCase()
      );
      return {
        isCorrect,
        accuracyRatio: isCorrect ? 1 : 0,
        feedbackTitleUz: isCorrect
          ? 'Xato to‘g‘ri tuzatildi!'
          : 'Bosh harf, so‘z tartibi va tinish belgisiga (nuqta) e’tibor bering',
        feedbackExplanationUz: exercise.explanationUz,
        normalizedUserAnswer: rawText,
        expectedAnswerDisplay: exercise.acceptedAnswers[0] || '',
      };
    }

    case 'crossword': {
      if (!exercise.crossword) {
        return {
          isCorrect: false,
          accuracyRatio: 0,
          feedbackTitleUz: 'Krossvord topilmadi',
          feedbackExplanationUz: exercise.explanationUz,
          normalizedUserAnswer: '',
          expectedAnswerDisplay: '',
        };
      }
      const result = validateCrosswordGrid(
        exercise.crossword,
        input.crosswordCells || {}
      );
      return {
        isCorrect: result.isAllCorrect,
        accuracyRatio:
          result.totalRequiredCells > 0
            ? result.correctCellsCount / result.totalRequiredCells
            : 0,
        feedbackTitleUz: result.isAllCorrect
          ? 'Tabriklaymiz! Krossvorddagi barcha 4 ta so‘z 100% to‘g‘ri topildi!'
          : `${result.correctCellsCount} / ${result.totalRequiredCells} ta katak to‘g‘ri to‘ldirildi.`,
        feedbackExplanationUz: exercise.explanationUz,
        normalizedUserAnswer: `${result.correctCellsCount}/${result.totalRequiredCells}`,
        expectedAnswerDisplay: 'TEACHER, SENTENCE, STUDENT, WORD',
      };
    }

    case 'pronunciation_practice': {
      const prompts = exercise.speakingPrompts || [];
      if (prompts.length > 0 && input.spokenPhrasesCompleted) {
        const doneIds = new Set(input.spokenPhrasesCompleted);
        const completedCount = prompts.filter((p) => doneIds.has(p.id)).length;
        const isCorrect = completedCount === prompts.length;
        return {
          isCorrect,
          accuracyRatio: prompts.length > 0 ? completedCount / prompts.length : 0,
          feedbackTitleUz: isCorrect
            ? 'Barakalla! Barcha 3 ta iborani ajoyib talaffuz qildingiz!'
            : `${completedCount} / ${prompts.length} ta ibora mashq qilindi.`,
          feedbackExplanationUz: exercise.explanationUz,
          normalizedUserAnswer: `${completedCount}/${prompts.length}`,
          expectedAnswerDisplay: prompts.map((p) => p.phraseEn).join(' · '),
        };
      }
      const candidate = normalizeEnglishString(
        input.selectedOption || input.textInput || ''
      );
      const isCorrect = exercise.acceptedAnswers.some(
        (ans) => normalizeEnglishString(ans).toLowerCase() === candidate.toLowerCase()
      );
      return {
        isCorrect,
        accuracyRatio: isCorrect ? 1 : 0,
        feedbackTitleUz: isCorrect
          ? 'Barakalla! Juda yaxshi aytdingiz!'
          : 'Yana bir bor eshitib, qayta aytib ko‘ring:',
        feedbackExplanationUz: exercise.explanationUz,
        normalizedUserAnswer: candidate,
        expectedAnswerDisplay: exercise.acceptedAnswers[0] || '',
      };
    }

    default: {
      // multiple_choice, true_false, listening_choose, fill_in_blank, etc.
      const candidate = normalizeEnglishString(
        input.selectedOption || input.textInput || ''
      );
      const isCorrect = exercise.acceptedAnswers.some(
        (ans) => normalizeEnglishString(ans).toLowerCase() === candidate.toLowerCase()
      );
      return {
        isCorrect,
        accuracyRatio: isCorrect ? 1 : 0,
        feedbackTitleUz: isCorrect ? 'To‘g‘ri javob!' : 'Noto‘g‘ri javob. Tushuntirishni o‘qing:',
        feedbackExplanationUz: exercise.explanationUz,
        normalizedUserAnswer: candidate,
        expectedAnswerDisplay: exercise.acceptedAnswers[0] || '',
      };
    }
  }
}
