/**
 * TALKME — COMPLETE SCALABLE ENGLISH GRAMMAR & GLOBAL LEARNING FRAMEWORK
 * Core TypeScript Content Contract, Mastery Models, Exercise Engine Types,
 * Content Versioning, and Wrap-up Configuration.
 */

export type CEFRLevel = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type LessonDifficulty = 'beginner' | 'easy' | 'medium' | 'advanced';

export type LearningDomainPurpose =
  | 'grammar'
  | 'vocabulary'
  | 'phonetics'
  | 'pronunciation'
  | 'reading'
  | 'listening'
  | 'writing'
  | 'speaking'
  | 'general_english'
  | 'exam_preparation';

export type LearningMasteryState =
  | 'not_started'
  | 'learning'
  | 'practiced'
  | 'learned'
  | 'needs_review';

/**
 * Standard 10-stage lesson lifecycle.
 * CRITICAL RULE: Stage 10 is ALWAYS 'wrap_up' (Wrap-up). Never 'warm_up'.
 */
export type StandardLessonLifecycleStage =
  | 'introduction'
  | 'objectives'
  | 'explanation'
  | 'detailed_examples'
  | 'new_vocabulary'
  | 'interactive_activities'
  | 'practice_exercises'
  | 'knowledge_challenge'
  | 'final_assessment'
  | 'wrap_up';

export interface LocalizedText {
  uz: string;
  en?: string;
  ru?: string;
}

export interface LearningObjective {
  id: string;
  description: LocalizedText;
  grammarRuleId?: string;
}

export interface VocabularyItem {
  id: string;
  wordEn: string;
  translationUz: string;
  ipa: string;
  visualEmoji?: string;
  personalizableTemplate?: {
    templateEn: string;
    templateUz: string;
    defaultName: string;
  };
  partOfSpeech:
    | 'Noun'
    | 'Pronoun'
    | 'Verb'
    | 'Adjective'
    | 'Adverb'
    | 'Preposition'
    | 'Conjunction'
    | 'Interjection'
    | 'Article';
  exampleEn: string;
  exampleUz: string;
  difficulty: LessonDifficulty;
  audioText?: string;
  courseSource: LearningDomainPurpose;
  /**
   * True if this item is a real target vocabulary item to be learned.
   * False if it is merely a pronunciation/phonetics example (which must NOT inflate the unique word counter).
   */
  isTargetVocabulary: boolean;
}

export interface VocabularyProgressRecord {
  vocabularyId: string;
  status: LearningMasteryState;
  meaningfulInteractionsCount: number;
  correctExercisesCount: number;
  incorrectExercisesCount: number;
  firstLearnedDate?: number;
  lastReviewedDate?: number;
}

export interface GrammarRule {
  id: string;
  nameEn: string;
  nameUz: string;
  shortSummaryUz: string;
  whyRuleExistsUz: string;
  formula?: string;
  commonQuestionsAnsweredUz: string;
  functionInSentenceUz: string;
  relatedExampleIds: string[];
  relatedLessonIds: string[];
  difficulty: LessonDifficulty;
}

export interface GrammarRuleProgressRecord {
  ruleId: string;
  status: LearningMasteryState;
  understandingPracticed: boolean;
  applicationPracticed: boolean;
  attempts: number;
  correctCount: number;
  incorrectCount: number;
  accuracyPercentage: number;
  lastPracticedAt?: number;
}

export interface SentenceTokenBreakdown {
  token: string;
  partOfSpeechEn: string;
  partOfSpeechUz: string;
  grammaticalRoleUz: string;
  questionAnsweredUz: string;
  explanationUz: string;
}

export interface GrammarExample {
  id: string;
  grammarRuleId: string;
  englishSentence: string;
  uzbekTranslation: string;
  incorrectSentence?: string;
  whyIncorrectUz?: string;
  highlightedSegment?: string;
  explanationUz: string;
  tokenBreakdown?: SentenceTokenBreakdown[];
}

export type ExerciseType =
  | 'multiple_choice'
  | 'multiple_select'
  | 'true_false'
  | 'matching_pairs'
  | 'drag_and_drop'
  | 'categorization'
  | 'fill_in_blank'
  | 'missing_word'
  | 'missing_letter'
  | 'word_ordering'
  | 'sentence_builder'
  | 'error_correction'
  | 'crossword'
  | 'listening_choose'
  | 'listening_write'
  | 'pronunciation_practice'
  | 'flashcards'
  | 'reading_comprehension'
  | 'contextual_questions'
  | 'text_input'
  | 'sentence_transformation'
  | 'grammar_classification'
  | 'word_sorting'
  | 'dialogue_completion';

export type ExerciseProgressionStage =
  | 'recognition'
  | 'identification'
  | 'classification'
  | 'matching'
  | 'completion'
  | 'error_correction'
  | 'sentence_construction'
  | 'contextual_application'
  | 'independent_production'
  | 'mixed_assessment';

export interface CategorizationItem {
  id: string;
  label: string;
  sublabelUz?: string;
  correctCategory: string;
  explanationUz: string;
  audioText?: string;
}

export interface MatchingPairItem {
  id: string;
  leftText: string;
  leftSubtext?: string;
  rightText: string;
  rightSubtext?: string;
  explanationUz: string;
  audioText?: string;
}

export interface WordBuildSequenceItem {
  id: string;
  targetWord: string;
  meaningUz: string;
  scrambledLetters: string[];
  explanationUz: string;
}

export interface SentenceBuilderPayload {
  targetSentence: string;
  meaningUz: string;
  shuffledTiles: string[];
  roleBreakdown: {
    part: string;
    roleNameEn: string;
    roleNameUz: string;
    questionUz: string;
  }[];
}

export interface CrosswordClueItem {
  id: string;
  number: number;
  direction: 'across' | 'down';
  clueUz: string;
  clueEnHint: string;
  answer: string; // Uppercase e.g. 'TEACHER'
  row: number;
  col: number;
  vocabularyId?: string;
  grammarRuleId?: string;
}

export interface CrosswordGridPayload {
  rows: number;
  cols: number;
  clues: CrosswordClueItem[];
}

export interface SpeakingPromptItem {
  id: string;
  phraseEn: string;
  meaningUz: string;
  isPersonalizedName?: boolean;
  audioText?: string;
}

export interface Exercise {
  id: string;
  version: number;
  type: ExerciseType;
  progressionStage: ExerciseProgressionStage;
  titleUz: string;
  instructionsUz: string;
  promptEn?: string;
  promptUz?: string;
  audioText?: string;
  options?: string[];
  categories?: { id: string; labelUz: string; labelEn?: string }[];
  categorizationItems?: CategorizationItem[];
  matchingPairs?: MatchingPairItem[];
  wordBuildItems?: WordBuildSequenceItem[];
  sentenceBuilder?: SentenceBuilderPayload;
  crossword?: CrosswordGridPayload;
  speakingPrompts?: SpeakingPromptItem[];
  acceptedAnswers: string[];
  explanationUz: string;
  hintUz: string;
  difficulty: LessonDifficulty;
  xpReward: number;
  relatedVocabularyIds: string[];
  relatedGrammarRuleIds: string[];
  requiresApplication?: boolean;
}

export interface ExerciseAttemptResult {
  exerciseId: string;
  exerciseVersion: number;
  isCorrect: boolean;
  attemptsCount: number;
  correctCount: number;
  incorrectCount: number;
  xpAwarded: number;
  completedAt: number;
}

export interface LessonTheorySubtopic {
  id: string;
  sectionNumber: number;
  titleEn: string;
  titleUz: string;
  analogyOrIntroUz: string;
  paragraphsUz: string[];
  comparisonCards?: {
    wrongEn: string;
    rightEn: string;
    meaningUz: string;
    whyUz: string;
  }[];
  conceptCards?: {
    termEn: string;
    termUz: string;
    definitionUz: string;
    questionsAnsweredUz?: string;
    functionInSentenceUz?: string;
    examples: { en: string; uz: string; highlight?: string }[];
  }[];
  hierarchyFlow?: {
    levelNameEn: string;
    levelNameUz: string;
    sampleEn: string;
    sampleUz: string;
    whyUz: string;
  }[];
  sentenceBreakdown?: {
    sentenceEn: string;
    sentenceUz: string;
    tokens: SentenceTokenBreakdown[];
  };
}

export interface BeginnerGreetingRow {
  english: string;
  uzbek: string;
  ipa?: string;
  audioText: string;
}

export interface BeginnerLegoExample {
  blocks: string[];
  fullSentenceEn: string;
  fullSentenceUz: string;
  explanationUz: string;
}

export interface BeginnerSectionContent {
  kind: 'welcome' | 'greeting_situation' | 'assistant_intro' | 'grammar_lego';
  badgeUz?: string;
  heroTitleEn?: string;
  heroQuoteEn?: string;
  situationPromptUz?: string;
  bodyParagraphsUz: string[];
  greetingTable?: BeginnerGreetingRow[];
  greetingExplanationUz?: string;
  speakingCalloutEn?: string;
  speakingCalloutUz?: string;
  benefitBulletsUz?: string[];
  legoAnalogy?: BeginnerLegoExample;
  closingCalloutEn?: string;
  closingCalloutUz?: string;
}

export interface LessonSection {
  id: string;
  order: number;
  stage: StandardLessonLifecycleStage;
  title: LocalizedText;
  subtitle?: LocalizedText;
  beginnerContent?: BeginnerSectionContent;
  theorySubtopics?: LessonTheorySubtopic[];
  exampleIds?: string[];
  vocabularyIds?: string[];
  exerciseIds?: string[];
}

export interface AssessmentQuestion {
  id: string;
  conceptAssessed: string;
  grammarRuleId: string;
  vocabularyId?: string;
  questionUz: string;
  promptEn?: string;
  audioText?: string;
  options: string[];
  correctAnswer: string;
  explanationUz: string;
}

export interface LessonAssessment {
  id: string;
  title: LocalizedText;
  passingPercentage: number;
  xpReward: number;
  questions: AssessmentQuestion[];
}

export interface WrapUpConfiguration {
  title: LocalizedText; // Must always be Wrap-up
  summaryNoteUz: string;
  celebrationTitleEn?: string;
  celebrationSubtitleUz?: string;
  learnedSkillsSummaryUz?: string[];
  rememberMessageUz?: string;
  nextLessonId: string;
  nextLessonTitleEn: string;
  nextLessonTitleUz: string;
  whyNextLessonLogicalUz: string;
}

export interface LearningLesson {
  id: string;
  courseId: string;
  moduleId: string;
  purpose: LearningDomainPurpose;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  level: CEFRLevel;
  difficulty: LessonDifficulty;
  estimatedDuration: number;
  objectives: LearningObjective[];
  sections: LessonSection[];
  theorySubtopics: LessonTheorySubtopic[];
  examples: GrammarExample[];
  vocabulary: VocabularyItem[];
  grammarRules: GrammarRule[];
  exercises: Exercise[];
  assessment: LessonAssessment;
  wrapUp: WrapUpConfiguration;
  version: number;
  status: 'draft' | 'published' | 'archived';
}

export interface GrammarCourseModuleMetadata {
  id: string;
  moduleNumber: number;
  titleEn: string;
  titleUz: string;
  descriptionUz: string;
  lessons: {
    id: string;
    lessonNumber: number;
    titleEn: string;
    titleUz: string;
    subtitleUz: string;
    level: CEFRLevel;
    isImplemented: boolean;
  }[];
}

export interface LearnerLessonProgress {
  lessonId: string;
  completedVersion: number;
  status: LearningMasteryState;
  currentSectionIndex?: number;
  completedSectionIds: string[];
  exerciseResults: Record<string, ExerciseAttemptResult>;
  assessmentScorePercentage: number | null;
  assessmentCorrectCount: number;
  assessmentTotalCount: number;
  assessmentCompleted: boolean;
  lessonCompleted?: boolean;
  timeSpentSeconds?: number;
  personalizedLearnerName?: string;
  awardedRewardKeys: string[]; // Prevents duplicate XP awards across versions
  totalLessonXpEarned: number;
  lastUpdatedAt: number;
}
