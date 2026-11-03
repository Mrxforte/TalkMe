import { SkillDomain } from '../../content/schemas/contentSchemas';

export type InteractionPrimitiveType =
  | 'multiple_choice'
  | 'matching_pairs'
  | 'gap_fill_typing'
  | 'sequence_ordering'
  | 'categorization'
  | 'flashcard_recall'
  | 'reading_comprehension'
  | 'audio_listening'
  | 'speaking_pronunciation'
  | 'word_puzzle_grid';

export interface ExerciseTemplateDefinition {
  number: number; // 1 to 110
  code: string;
  nameEn: string;
  nameUz: string;
  category: SkillDomain;
  primitive: InteractionPrimitiveType;
  defaultRequiredScore: number;
  maxRetries: number;
  supportsKidsProfile: boolean;
  supportsAdultProfile: boolean;
}

const RAW_110_TEMPLATES: Array<
  [number, string, string, string, SkillDomain, InteractionPrimitiveType]
> = [
  // VOCABULARY (1 - 16)
  [1, 'picture_to_word_matching', 'Picture to Word Matching', 'Rasmni so‘z bilan moslash', 'vocabulary', 'matching_pairs'],
  [2, 'word_to_picture_matching', 'Word to Picture Matching', 'So‘zni rasm bilan moslash', 'vocabulary', 'multiple_choice'],
  [3, 'word_to_translation', 'Word to Translation', 'Inglizcha so‘zdan o‘zbekchaga', 'vocabulary', 'multiple_choice'],
  [4, 'translation_to_word', 'Translation to Word', 'O‘zbekcha so‘zdan inglizchaga', 'vocabulary', 'multiple_choice'],
  [5, 'multiple_choice_vocabulary', 'Multiple Choice Vocabulary', 'Lug‘at testi', 'vocabulary', 'multiple_choice'],
  [6, 'missing_word', 'Missing Word', 'Tushirib qoldirilgan so‘z', 'vocabulary', 'gap_fill_typing'],
  [7, 'word_definition_matching', 'Word Definition Matching', 'So‘z va izohni moslash', 'vocabulary', 'matching_pairs'],
  [8, 'synonym_matching', 'Synonym Matching', 'Sinonimlar juftligi', 'vocabulary', 'matching_pairs'],
  [9, 'antonym_matching', 'Antonym Matching', 'Antonimlar juftligi', 'vocabulary', 'matching_pairs'],
  [10, 'word_categorization', 'Word Categorization', 'So‘zlarni guruhlarga ajratish', 'vocabulary', 'categorization'],
  [11, 'flashcard_recall', 'Flashcard Recall', 'Kartochka orqali eslab qolish', 'vocabulary', 'flashcard_recall'],
  [12, 'word_association', 'Word Association', 'Ma’nodosh bog‘liqlikni topish', 'vocabulary', 'multiple_choice'],
  [13, 'odd_one_out', 'Odd One Out', 'Ortiqcha so‘zni toping', 'vocabulary', 'multiple_choice'],
  [14, 'word_sorting', 'Word Sorting', 'So‘zlarni tartiblash', 'vocabulary', 'sequence_ordering'],
  [15, 'vocabulary_grid', 'Vocabulary Grid', 'Lug‘at jadvali', 'vocabulary', 'word_puzzle_grid'],
  [16, 'contextual_word_selection', 'Contextual Word Selection', 'Kontekstga mos so‘zni tanlash', 'vocabulary', 'multiple_choice'],

  // GRAMMAR (17 - 36)
  [17, 'grammar_multiple_choice', 'Grammar Multiple Choice', 'Grammatika testi', 'grammar', 'multiple_choice'],
  [18, 'error_detection', 'Error Detection', 'Xatoni aniqlash', 'grammar', 'multiple_choice'],
  [19, 'error_correction', 'Error Correction', 'Xatoni to‘g‘rilash', 'grammar', 'gap_fill_typing'],
  [20, 'fill_in_grammar_gap', 'Fill in Grammar Gap', 'Grammatik bo‘shliqni to‘ldirish', 'grammar', 'gap_fill_typing'],
  [21, 'sentence_transformation', 'Sentence Transformation', 'Gap shaklini o‘zgartirish', 'grammar', 'gap_fill_typing'],
  [22, 'sentence_completion', 'Sentence Completion', 'Gapni tugallash', 'grammar', 'multiple_choice'],
  [23, 'grammar_rule_matching', 'Grammar Rule Matching', 'Qoida va misolni moslash', 'grammar', 'matching_pairs'],
  [24, 'parts_of_speech_identification', 'Parts of Speech Identification', 'So‘z turkumini aniqlash', 'grammar', 'multiple_choice'],
  [25, 'subject_identification', 'Subject Identification', 'Egani (Subject) topish', 'grammar', 'multiple_choice'],
  [26, 'verb_identification', 'Verb Identification', 'Fe’lni (Verb) topish', 'grammar', 'multiple_choice'],
  [27, 'object_identification', 'Object Identification', 'To‘ldiruvchini (Object) topish', 'grammar', 'multiple_choice'],
  [28, 'singular_plural_conversion', 'Singular/Plural Conversion', 'Birlik va ko‘plik shakli', 'grammar', 'gap_fill_typing'],
  [29, 'tense_identification', 'Tense Identification', 'Zamonni aniqlash', 'grammar', 'multiple_choice'],
  [30, 'tense_transformation', 'Tense Transformation', 'Zamonni o‘zgartirish', 'grammar', 'gap_fill_typing'],
  [31, 'article_selection', 'Article Selection', 'Artiklni tanlash (a / an / the)', 'grammar', 'multiple_choice'],
  [32, 'preposition_selection', 'Preposition Selection', 'Predlogni tanlash (in / on / at)', 'grammar', 'multiple_choice'],
  [33, 'pronoun_replacement', 'Pronoun Replacement', 'Olmosh bilan almashtirish', 'grammar', 'multiple_choice'],
  [34, 'adjective_ordering', 'Adjective Ordering', 'Sifatlarni to‘g‘ri tartiblash', 'grammar', 'sequence_ordering'],
  [35, 'word_form_conversion', 'Word Form Conversion', 'So‘z shaklini yasash', 'grammar', 'gap_fill_typing'],
  [36, 'grammar_classification', 'Grammar Classification', 'Grammatik tasniflash', 'grammar', 'categorization'],

  // READING (37 - 51)
  [37, 'read_and_answer', 'Read and Answer', 'O‘qing va javob bering', 'reading', 'reading_comprehension'],
  [38, 'reading_comprehension', 'Reading Comprehension', 'Matnni tushunish', 'reading', 'reading_comprehension'],
  [39, 'true_false_reading', 'True/False Reading', 'To‘g‘ri yoki Noto‘g‘ri (True/False)', 'reading', 'reading_comprehension'],
  [40, 'find_main_idea', 'Find Main Idea', 'Asosiy fikrni topish', 'reading', 'reading_comprehension'],
  [41, 'find_specific_information', 'Find Specific Information', 'Aniq ma’lumotni topish', 'reading', 'reading_comprehension'],
  [42, 'paragraph_ordering', 'Paragraph Ordering', 'Xatboshilarni tartiblash', 'reading', 'sequence_ordering'],
  [43, 'sentence_ordering', 'Sentence Ordering', 'Matn gaplarini tartiblash', 'reading', 'sequence_ordering'],
  [44, 'heading_matching', 'Heading Matching', 'Sarlavhalarni moslash', 'reading', 'matching_pairs'],
  [45, 'word_in_context', 'Word in Context', 'Kontekstdagi so‘z ma’nosi', 'reading', 'reading_comprehension'],
  [46, 'reading_gap_fill', 'Reading Gap Fill', 'Matn bo‘shliqlarini to‘ldirish', 'reading', 'gap_fill_typing'],
  [47, 'short_story_questions', 'Short Story Questions', 'Qisqa hikoya savollari', 'reading', 'reading_comprehension'],
  [48, 'dialogue_comprehension', 'Dialogue Comprehension', 'Suhbatni tushunish', 'reading', 'reading_comprehension'],
  [49, 'text_evidence_selection', 'Text Evidence Selection', 'Matndan dalil topish', 'reading', 'reading_comprehension'],
  [50, 'reading_summary', 'Reading Summary', 'Matn xulosasi', 'reading', 'reading_comprehension'],
  [51, 'information_extraction', 'Information Extraction', 'Ma’lumotni ajratib olish', 'reading', 'reading_comprehension'],

  // LISTENING (52 - 66)
  [52, 'listen_and_choose', 'Listen and Choose', 'Eshiting va tanlang', 'listening', 'audio_listening'],
  [53, 'listen_and_match', 'Listen and Match', 'Eshiting va moslang', 'listening', 'matching_pairs'],
  [54, 'listen_and_type', 'Listen and Type', 'Eshiting va yozing', 'listening', 'audio_listening'],
  [55, 'listen_and_complete', 'Listen and Complete', 'Eshiting va gapni to‘ldiring', 'listening', 'audio_listening'],
  [56, 'listen_and_order', 'Listen and Order', 'Eshiting va tartiblang', 'listening', 'sequence_ordering'],
  [57, 'listen_and_identify', 'Listen and Identify', 'Eshiting va aniqlang', 'listening', 'audio_listening'],
  [58, 'audio_multiple_choice', 'Audio Multiple Choice', 'Audio test savoli', 'listening', 'audio_listening'],
  [59, 'listen_and_answer', 'Listen and Answer', 'Eshiting va javob bering', 'listening', 'audio_listening'],
  [60, 'dictation', 'Dictation', 'Audio diktant', 'listening', 'audio_listening'],
  [61, 'partial_dictation', 'Partial Dictation', 'Qisman diktant', 'listening', 'audio_listening'],
  [62, 'minimal_pair_listening', 'Minimal Pair Listening', 'O‘xshash tovushlarni farqlash', 'listening', 'audio_listening'],
  [63, 'number_recognition', 'Number Recognition', 'Raqamlarni eshitib topish', 'listening', 'audio_listening'],
  [64, 'listening_comprehension', 'Listening Comprehension', 'Audio matnni tushunish', 'listening', 'audio_listening'],
  [65, 'speaker_intention', 'Speaker Intention', 'So‘zlovchi maqsadini topish', 'listening', 'audio_listening'],
  [66, 'audio_gap_fill', 'Audio Gap Fill', 'Audio bo‘shliqni to‘ldirish', 'listening', 'audio_listening'],

  // SPEAKING (67 - 83)
  [67, 'repeat_after_audio', 'Repeat After Audio', 'Audiodan so‘ng takrorlang', 'speaking', 'speaking_pronunciation'],
  [68, 'pronunciation_recording', 'Pronunciation Recording', 'Talaffuzni yozib olish', 'speaking', 'speaking_pronunciation'],
  [69, 'word_pronunciation', 'Word Pronunciation', 'So‘z talaffuzi mashqi', 'speaking', 'speaking_pronunciation'],
  [70, 'sentence_pronunciation', 'Sentence Pronunciation', 'Gap talaffuzi mashqi', 'speaking', 'speaking_pronunciation'],
  [71, 'read_aloud', 'Read Aloud', 'Ovoz chiqarib o‘qish', 'speaking', 'speaking_pronunciation'],
  [72, 'picture_description', 'Picture Description', 'Rasmni inglizcha tasvirlash', 'speaking', 'speaking_pronunciation'],
  [73, 'answer_the_question', 'Answer the Question', 'Savolga og‘zaki javob berish', 'speaking', 'speaking_pronunciation'],
  [74, 'complete_the_dialogue', 'Complete the Dialogue', 'Suhbatni ovozli davom ettirish', 'speaking', 'speaking_pronunciation'],
  [75, 'role_play', 'Role Play', 'Rolli suhbat mashqi', 'speaking', 'speaking_pronunciation'],
  [76, 'describe_an_object', 'Describe an Object', 'Buyumni tasvirlang', 'speaking', 'speaking_pronunciation'],
  [77, 'describe_a_person', 'Describe a Person', 'Insonni tasvirlang', 'speaking', 'speaking_pronunciation'],
  [78, 'describe_a_situation', 'Describe a Situation', 'Vaziyatni tasvirlang', 'speaking', 'speaking_pronunciation'],
  [79, 'sentence_building_speaking', 'Sentence Building Speaking', 'Og‘zaki gap tuzish', 'speaking', 'speaking_pronunciation'],
  [80, 'question_formation_speaking', 'Question Formation Speaking', 'Og‘zaki savol tuzish', 'speaking', 'speaking_pronunciation'],
  [81, 'guided_conversation', 'Guided Conversation', 'Yo‘naltirilgan suhbat', 'speaking', 'speaking_pronunciation'],
  [82, 'free_speaking', 'Free Speaking', 'Erkin gapirish mashqi', 'speaking', 'speaking_pronunciation'],
  [83, 'compare_two_pictures', 'Compare Two Pictures', 'Ikki rasmni solishtirish', 'speaking', 'speaking_pronunciation'],

  // WRITING (84 - 97)
  [84, 'word_spelling', 'Word Spelling', 'So‘zni harflab to‘g‘ri yozish', 'writing', 'gap_fill_typing'],
  [85, 'missing_letters', 'Missing Letters', 'Tushirib qoldirilgan harflar', 'writing', 'gap_fill_typing'],
  [86, 'letter_ordering', 'Letter Ordering', 'Harflardan so‘z yasash', 'writing', 'sequence_ordering'],
  [87, 'word_formation', 'Word Formation', 'So‘z yasash mashqi', 'writing', 'gap_fill_typing'],
  [88, 'sentence_construction', 'Sentence Construction', 'So‘zlardan gap tuzish', 'writing', 'sequence_ordering'],
  [89, 'sentence_rewriting', 'Sentence Rewriting', 'Gapni qayta yozish', 'writing', 'gap_fill_typing'],
  [90, 'translation_writing', 'Translation Writing', 'Tarjima qilib yozish', 'writing', 'gap_fill_typing'],
  [91, 'complete_the_sentence', 'Complete the Sentence', 'Gapni yozib tugallash', 'writing', 'gap_fill_typing'],
  [92, 'write_from_picture', 'Write from Picture', 'Rasmga qarab yozish', 'writing', 'gap_fill_typing'],
  [93, 'short_answer_writing', 'Short Answer Writing', 'Qisqa yozma javob', 'writing', 'gap_fill_typing'],
  [94, 'paragraph_writing', 'Paragraph Writing', 'Qisqa matn yozish', 'writing', 'gap_fill_typing'],
  [95, 'guided_story_writing', 'Guided Story Writing', 'Hikoya davomini yozish', 'writing', 'gap_fill_typing'],
  [96, 'correct_the_sentence', 'Correct the Sentence', 'Xato gapni to‘g‘rilab yozish', 'writing', 'gap_fill_typing'],
  [97, 'punctuation_correction', 'Punctuation Correction', 'Tinish belgilarini to‘g‘rilash', 'writing', 'gap_fill_typing'],

  // INTERACTIVE GAMES (98 - 110)
  [98, 'drag_and_drop', 'Drag and Drop', 'Ushlab joylashtirish', 'interactive_games', 'categorization'],
  [99, 'matching_pairs', 'Matching Pairs', 'Juftliklarni topish o‘yini', 'interactive_games', 'matching_pairs'],
  [100, 'crossword', 'Crossword', 'Inglizcha krossvord', 'interactive_games', 'word_puzzle_grid'],
  [101, 'word_search', 'Word Search', 'Harflar ichidan so‘z qidirish', 'interactive_games', 'word_puzzle_grid'],
  [102, 'word_builder', 'Word Builder', 'So‘z quruvchi', 'interactive_games', 'sequence_ordering'],
  [103, 'letter_puzzle', 'Letter Puzzle', 'Harflar boshqotirmasi', 'interactive_games', 'sequence_ordering'],
  [104, 'sentence_puzzle', 'Sentence Puzzle', 'Gap boshqotirmasi', 'interactive_games', 'sequence_ordering'],
  [105, 'categorization_basket', 'Categorization Basket', 'Savatga saralash o‘yini', 'interactive_games', 'categorization'],
  [106, 'memory_match', 'Memory Match', 'Xotira juftliklari', 'interactive_games', 'matching_pairs'],
  [107, 'timed_challenge', 'Timed Challenge', 'Vaqtga qarshi tezkor bellashuv', 'interactive_games', 'multiple_choice'],
  [108, 'word_maze', 'Word Maze', 'So‘zlar labirinti', 'interactive_games', 'sequence_ordering'],
  [109, 'sequence_builder', 'Sequence Builder', 'Ketma-ketlik quruvchi', 'interactive_games', 'sequence_ordering'],
  [110, 'knowledge_battle', 'Knowledge Battle', 'Bilimlar bellashuvi (Final)', 'interactive_games', 'multiple_choice'],
];

export const EXERCISE_TYPE_REGISTRY: Record<string, ExerciseTemplateDefinition> = {};
export const EXERCISE_BY_NUMBER: Record<number, ExerciseTemplateDefinition> = {};

for (const [number, code, nameEn, nameUz, category, primitive] of RAW_110_TEMPLATES) {
  const def: ExerciseTemplateDefinition = {
    number,
    code,
    nameEn,
    nameUz,
    category,
    primitive,
    defaultRequiredScore: 75,
    maxRetries: 3,
    supportsKidsProfile: true,
    supportsAdultProfile: true,
  };
  EXERCISE_TYPE_REGISTRY[code] = def;
  EXERCISE_BY_NUMBER[number] = def;
}

export function getAllRegisteredExerciseTemplates(): ExerciseTemplateDefinition[] {
  return Object.values(EXERCISE_BY_NUMBER).sort((a, b) => a.number - b.number);
}

export function getExerciseTemplateSafe(codeOrNumber: string | number): ExerciseTemplateDefinition {
  if (typeof codeOrNumber === 'number') {
    return (
      EXERCISE_BY_NUMBER[codeOrNumber] || {
        number: 5,
        code: 'multiple_choice_vocabulary',
        nameEn: 'Multiple Choice Vocabulary',
        nameUz: 'Lug‘at testi',
        category: 'vocabulary',
        primitive: 'multiple_choice',
        defaultRequiredScore: 75,
        maxRetries: 3,
        supportsKidsProfile: true,
        supportsAdultProfile: true,
      }
    );
  }
  return (
    EXERCISE_TYPE_REGISTRY[codeOrNumber] || {
      number: 5,
      code: 'multiple_choice_vocabulary',
      nameEn: 'Multiple Choice Vocabulary',
      nameUz: 'Lug‘at testi',
      category: 'vocabulary',
      primitive: 'multiple_choice',
      defaultRequiredScore: 75,
      maxRetries: 3,
      supportsKidsProfile: true,
      supportsAdultProfile: true,
    }
  );
}

// ============================================================================
// UNIVERSAL ANSWER VALIDATOR ACROSS SHARED INTERACTION PRIMITIVES
// ============================================================================

export function evaluateExerciseSubmission(
  primitive: InteractionPrimitiveType,
  payload: Record<string, unknown>,
  userResponse: unknown
): {
  isCorrect: boolean;
  score: number;
  feedbackUz: string;
  correctAnswerDisplay: string;
} {
  switch (primitive) {
    case 'multiple_choice':
    case 'reading_comprehension': {
      const options = (payload.options as Array<{ id: string; text: string; isCorrect: boolean }>) || [];
      const correctOpt = options.find((o) => o.isCorrect);
      const selectedId = String(userResponse || '');
      const isCorrect = Boolean(correctOpt && correctOpt.id === selectedId);
      return {
        isCorrect,
        score: isCorrect ? 100 : 0,
        feedbackUz: isCorrect
          ? (payload.explanationUz as string) || 'Barakalla! Javobingiz to‘g‘ri.'
          : `Diqqat qiling: to‘g‘ri javob — "${correctOpt?.text || ''}".`,
        correctAnswerDisplay: correctOpt?.text || '',
      };
    }

    case 'gap_fill_typing':
    case 'word_puzzle_grid': {
      const expected = String(payload.correctAnswer || '').trim();
      const acceptedList = ((payload.acceptedAnswers as string[]) || [expected]).map((s) =>
        s.trim().toLowerCase().replace(/[.!?]+$/, '')
      );
      const given = String(userResponse || '')
        .trim()
        .toLowerCase()
        .replace(/[.!?]+$/, '');
      const isCorrect = acceptedList.includes(given);
      return {
        isCorrect,
        score: isCorrect ? 100 : 0,
        feedbackUz: isCorrect
          ? (payload.explanationUz as string) || 'Ajoyib! To‘g‘ri yozdingiz.'
          : `To‘g‘ri javob: "${expected}"`,
        correctAnswerDisplay: expected,
      };
    }

    case 'sequence_ordering': {
      const targetSequence = (payload.correctSequence as string[]) || [];
      const userSequence = Array.isArray(userResponse) ? (userResponse as string[]) : [];
      const expectedJoined = targetSequence.join(' ').trim().toLowerCase();
      const givenJoined = userSequence.join(' ').trim().toLowerCase();
      const isCorrect = expectedJoined.length > 0 && expectedJoined === givenJoined;
      return {
        isCorrect,
        score: isCorrect ? 100 : 0,
        feedbackUz: isCorrect
          ? (payload.explanationUz as string) || 'Tartib mukammal!'
          : `To‘g‘ri tartib: "${targetSequence.join(' ')}"`,
        correctAnswerDisplay: targetSequence.join(' '),
      };
    }

    case 'matching_pairs': {
      const pairs = (payload.pairs as Array<{ id: string; left: string; right: string }>) || [];
      const matchedCount = typeof userResponse === 'number' ? userResponse : 0;
      const total = Math.max(1, pairs.length);
      const score = Math.round((matchedCount / total) * 100);
      const isCorrect = score >= 80;
      return {
        isCorrect,
        score,
        feedbackUz: isCorrect
          ? 'Barcha juftliklarni to‘g‘ri topdingiz!'
          : 'Ba’zi juftliklar mos kelmadi. Yana urinib ko‘ring.',
        correctAnswerDisplay: pairs.map((p) => `${p.left} = ${p.right}`).join(', '),
      };
    }

    case 'categorization': {
      const items =
        (payload.items as Array<{ id: string; label: string; categoryId: string }>) || [];
      const userMap = (userResponse as Record<string, string>) || {};
      let correct = 0;
      items.forEach((item) => {
        if (userMap[item.id] === item.categoryId) correct++;
      });
      const score = items.length > 0 ? Math.round((correct / items.length) * 100) : 100;
      const isCorrect = score >= 80;
      return {
        isCorrect,
        score,
        feedbackUz: isCorrect
          ? 'So‘zlar to‘g‘ri guruhlarga ajratildi!'
          : `${correct}/${items.length} ta element to‘g‘ri joylashtirildi.`,
        correctAnswerDisplay: items.map((i) => `${i.label} → ${i.categoryId}`).join(', '),
      };
    }

    case 'audio_listening': {
      const mode = (payload.listenMode as 'choice' | 'typing') || 'choice';
      if (mode === 'typing') {
        const expected = String(payload.correctAnswer || payload.audioText || '').trim();
        const given = String(userResponse || '')
          .trim()
          .toLowerCase()
          .replace(/[.!?]+$/, '');
        const cleanExpected = expected.toLowerCase().replace(/[.!?]+$/, '');
        const isCorrect = given === cleanExpected;
        return {
          isCorrect,
          score: isCorrect ? 100 : 0,
          feedbackUz: isCorrect
            ? 'Eshitib yozish mashqini a’lo bajardingiz!'
            : `Eshitilgan jumla: "${expected}"`,
          correctAnswerDisplay: expected,
        };
      }
      const options = (payload.options as Array<{ id: string; text: string; isCorrect: boolean }>) || [];
      const correctOpt = options.find((o) => o.isCorrect);
      const isCorrect = Boolean(correctOpt && correctOpt.id === String(userResponse || ''));
      return {
        isCorrect,
        score: isCorrect ? 100 : 0,
        feedbackUz: isCorrect
          ? 'To‘g‘ri eshitdingiz!'
          : `To‘g‘ri javob: "${correctOpt?.text || ''}"`,
        correctAnswerDisplay: correctOpt?.text || '',
      };
    }

    case 'speaking_pronunciation':
    case 'flashcard_recall': {
      const score = typeof userResponse === 'number' ? userResponse : 100;
      const isCorrect = score >= 75;
      return {
        isCorrect,
        score,
        feedbackUz: isCorrect
          ? 'Talaffuz va eslab qolish a’lo darajada!'
          : 'Yana bir bor eshitib, balandroq takrorlab ko‘ring.',
        correctAnswerDisplay: String(payload.targetPhraseEn || payload.frontEn || ''),
      };
    }
  }
}
