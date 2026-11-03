import { z } from 'zod';

export const SUBTOPIC_SCHEMA_VERSION = '2.0.0';

export const LearnerLevelTierSchema = z.enum(['A0-A1', 'A2', 'B1-B2', 'C1-C2']);
export type LearnerLevelTier = z.infer<typeof LearnerLevelTierSchema>;

export const SpeakableTextModelSchema = z.object({
  text: z.string(),
  language: z.enum(['en', 'uz']).default('en'),
  translation: z.string().optional(),
  translationLanguage: z.enum(['uz', 'en']).default('uz'),
  speakable: z.boolean().default(true),
  phonetic: z.string().optional(),
  highlightedWords: z.array(z.string()).default([]),
  grammarNoteUz: z.string().optional(),
  emoji: z.string().optional(),
});
export type SpeakableTextModel = z.infer<typeof SpeakableTextModelSchema>;

// ============================================================================
// 17 REUSABLE CONTENT BLOCK SCHEMAS (DISCRIMINATED UNION + GRACEFUL FALLBACK)
// ============================================================================

export const RuleExplanationBlockSchema = z.object({
  type: z.literal('RuleExplanation'),
  id: z.string(),
  ruleId: z.string(),
  ruleTitleUz: z.string(),
  ruleTitleEn: z.string().optional(),
  simpleExplanationUz: z.string(),
  questionsAnsweredUz: z.array(z.string()),
  whenToUseUz: z.string(),
  formula: z.string().optional(),
  examples: z.array(SpeakableTextModelSchema),
  progressiveDisclosure: z
    .object({
      beginnerNoteUz: z.string().optional(),
      elementaryNoteUz: z.string().optional(),
      intermediateExceptionsUz: z.string().optional(),
      advancedNuanceUz: z.string().optional(),
    })
    .optional(),
});

export const GrammarFormulaBlockSchema = z.object({
  type: z.literal('GrammarFormula'),
  id: z.string(),
  titleUz: z.string(),
  formulaPattern: z.string(),
  partsBreakdown: z.array(
    z.object({
      partLabel: z.string(),
      meaningUz: z.string(),
      exampleEn: z.string(),
    })
  ),
});

export const ExampleSentenceBlockSchema = z.object({
  type: z.literal('ExampleSentence'),
  id: z.string(),
  categoryLabelUz: z.string().optional(),
  sentence: SpeakableTextModelSchema,
  explanationUz: z.string(),
});

export const VocabularyCardBlockSchema = z.object({
  type: z.literal('VocabularyCard'),
  id: z.string(),
  titleUz: z.string(),
  words: z.array(
    z.object({
      id: z.string(),
      knowledgeId: z.string(),
      wordEn: z.string(),
      translationUz: z.string(),
      phonetic: z.string().optional(),
      categoryUz: z.string(), // e.g., "Kim? (Inson)", "Qayer? (Joy)", "Nima? (Buyum)"
      emoji: z.string(),
      exampleSentenceEn: z.string(),
      exampleSentenceUz: z.string(),
    })
  ),
});

export const WordHighlightBlockSchema = z.object({
  type: z.literal('WordHighlight'),
  id: z.string(),
  instructionUz: z.string(),
  sentenceEn: z.string(),
  sentenceUz: z.string(),
  highlightedItems: z.array(
    z.object({
      wordEn: z.string(),
      meaningUz: z.string(),
      roleExplanationUz: z.string(),
    })
  ),
});

export const ComparisonBlockSchema = z.object({
  type: z.literal('ComparisonBlock'),
  id: z.string(),
  titleUz: z.string(),
  correctExample: SpeakableTextModelSchema,
  incorrectExample: z.object({
    text: z.string(),
    reasonUz: z.string(),
  }),
  takeawayUz: z.string(),
  comparisonRows: z
    .array(
      z.object({
        categoryUz: z.string(),
        questionOrRuleUz: z.string(),
        exampleEn: z.string(),
        exampleUz: z.string(),
      })
    )
    .optional(),
});

export const ImageExampleBlockSchema = z.object({
  type: z.literal('ImageExample'),
  id: z.string(),
  titleUz: z.string(),
  cards: z.array(
    z.object({
      emoji: z.string(),
      labelEn: z.string(),
      labelUz: z.string(),
      sentenceEn: z.string(),
      sentenceUz: z.string(),
      highlightedWord: z.string(),
    })
  ),
});

export const DialogueBlockSchema = z.object({
  type: z.literal('DialogueBlock'),
  id: z.string(),
  titleUz: z.string(),
  contextUz: z.string(),
  lines: z.array(
    z.object({
      speaker: z.string(),
      avatarEmoji: z.string(),
      english: z.string(),
      uzbek: z.string(),
      highlightedWords: z.array(z.string()).default([]),
    })
  ),
});

export const StoryBlockSchema = z.object({
  type: z.literal('StoryBlock'),
  id: z.string(),
  titleEn: z.string(),
  titleUz: z.string(),
  paragraphs: z.array(
    z.object({
      english: z.string(),
      uzbek: z.string(),
      highlightedWords: z.array(z.string()).default([]),
    })
  ),
});

export const AudioTextBlockSchema = z.object({
  type: z.literal('AudioTextBlock'),
  id: z.string(),
  titleUz: z.string(),
  promptUz: z.string(),
  items: z.array(SpeakableTextModelSchema),
});

export const VideoBlockSchema = z.object({
  type: z.literal('VideoBlock'),
  id: z.string(),
  titleUz: z.string(),
  captionEn: z.string(),
  captionUz: z.string(),
});

export const AnimationBlockSchema = z.object({
  type: z.literal('AnimationBlock'),
  id: z.string(),
  titleUz: z.string(),
  visualSteps: z.array(
    z.object({
      emoji: z.string(),
      labelEn: z.string(),
      labelUz: z.string(),
    })
  ),
  summaryUz: z.string(),
});

export const TipBlockSchema = z.object({
  type: z.literal('TipBlock'),
  id: z.string(),
  titleUz: z.string(),
  bodyUz: z.string(),
  exampleEn: z.string().optional(),
  exampleUz: z.string().optional(),
});

export const WarningBlockSchema = z.object({
  type: z.literal('WarningBlock'),
  id: z.string(),
  titleUz: z.string(),
  bodyUz: z.string(),
});

export const SummaryBlockSchema = z.object({
  type: z.literal('SummaryBlock'),
  id: z.string(),
  titleUz: z.string(),
  learnedPointsUz: z.array(z.string()),
  keyRulesUz: z.array(z.string()),
  nextStepRecommendationUz: z.string(),
  unlockedPracticePathId: z.string().optional(),
  nextSubtopicId: z.string().optional(),
});

export const GuidedActivityItemSchema = z.object({
  id: z.string(),
  exerciseTemplateCode: z.string(),
  exerciseTypeLabelUz: z.string(),
  questionUz: z.string(),
  questionEn: z.string().optional(),
  interactionMode: z.enum([
    'multiple_choice',
    'identify_word',
    'match_pairs',
    'fill_blank',
    'categorize',
    'sentence_builder',
    'true_false',
  ]),
  options: z
    .array(
      z.object({
        id: z.string(),
        textEn: z.string(),
        textUz: z.string().optional(),
        isCorrect: z.boolean(),
      })
    )
    .optional(),
  pairs: z
    .array(
      z.object({
        id: z.string(),
        leftEn: z.string(),
        rightUz: z.string(),
      })
    )
    .optional(),
  categories: z
    .array(
      z.object({
        id: z.string(),
        labelUz: z.string(),
      })
    )
    .optional(),
  categorizeItems: z
    .array(
      z.object({
        id: z.string(),
        wordEn: z.string(),
        correctCategoryId: z.string(),
      })
    )
    .optional(),
  sentenceTokens: z.array(z.string()).optional(),
  correctAnswerString: z.string().optional(),
  explanationUz: z.string(),
  knowledgeId: z.string(),
  allowRetry: z.boolean().default(true),
});
export type GuidedActivityItem = z.infer<typeof GuidedActivityItemSchema>;

export const ExerciseBlockSchema = z.object({
  type: z.literal('ExerciseBlock'),
  id: z.string(),
  titleUz: z.string(),
  subtitleUz: z.string(),
  activities: z.array(GuidedActivityItemSchema),
});

export const AssessmentQuestionSchema = z.object({
  id: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('easy'),
  ruleCoveredUz: z.string(),
  promptUz: z.string(),
  promptEn: z.string().optional(),
  questionType: z.enum(['multiple_choice', 'fill_blank', 'sentence_builder', 'true_false']),
  options: z
    .array(
      z.object({
        id: z.string(),
        textEn: z.string(),
        textUz: z.string().optional(),
        isCorrect: z.boolean(),
      })
    )
    .optional(),
  correctAnswerText: z.string().optional(),
  sentenceTokens: z.array(z.string()).optional(),
  explanationUz: z.string(),
  knowledgeId: z.string(),
});
export type AssessmentQuestion = z.infer<typeof AssessmentQuestionSchema>;

export const AssessmentBlockSchema = z.object({
  type: z.literal('AssessmentBlock'),
  id: z.string(),
  titleUz: z.string(),
  descriptionUz: z.string(),
  passingThresholdPercent: z.number().min(50).max(100).default(70),
  allowRetry: z.boolean().default(true),
  questions: z.array(AssessmentQuestionSchema),
});

export const SubtopicContentBlockSchema = z.discriminatedUnion('type', [
  RuleExplanationBlockSchema,
  GrammarFormulaBlockSchema,
  ExampleSentenceBlockSchema,
  VocabularyCardBlockSchema,
  WordHighlightBlockSchema,
  ComparisonBlockSchema,
  ImageExampleBlockSchema,
  DialogueBlockSchema,
  StoryBlockSchema,
  AudioTextBlockSchema,
  VideoBlockSchema,
  AnimationBlockSchema,
  TipBlockSchema,
  WarningBlockSchema,
  SummaryBlockSchema,
  ExerciseBlockSchema,
  AssessmentBlockSchema,
]);
export type SubtopicContentBlock = z.infer<typeof SubtopicContentBlockSchema>;

// ============================================================================
// 7-STAGE MANDATORY SUBTOPIC SECTION & MICRO-COURSE SCHEMA
// ============================================================================

export const SubtopicStageTypeSchema = z.enum([
  'introduction',
  'explanation',
  'examples',
  'practice',
  'application',
  'assessment',
  'wrap_up',
]);
export type SubtopicStageType = z.infer<typeof SubtopicStageTypeSchema>;

export const SubtopicSectionSchema = z.object({
  id: z.string(),
  stageNumber: z.number().min(1).max(7),
  type: SubtopicStageTypeSchema,
  titleUz: z.string(),
  titleEn: z.string(),
  blocks: z.array(z.record(z.string(), z.unknown())), // Validated individually so unknown blocks fail gracefully
});
export type SubtopicSection = z.infer<typeof SubtopicSectionSchema>;

export const SubtopicMicroCourseSchema = z.object({
  schemaVersion: z.string().default(SUBTOPIC_SCHEMA_VERSION),
  id: z.string(),
  majorTopicId: z.string(),
  majorTopicTitleUz: z.string(),
  orderIndex: z.number(),
  title: z.object({
    en: z.string(),
    uz: z.string(),
  }),
  level: z.enum(['A0', 'A1', 'A2', 'B1', 'B2', 'C1']),
  difficultyLabelUz: z.string(),
  estimatedMinutes: z.number(),
  iconEmoji: z.string(),
  shortIntroUz: z.string(),
  whyUsefulUz: z.string(),
  learningObjectivesUz: z.array(z.string()),
  knowledgeIds: z.array(z.string()),
  practicePathId: z.string(),
  nextSubtopicId: z.string().optional(),
  sections: z.array(SubtopicSectionSchema),
});
export type SubtopicMicroCourse = z.infer<typeof SubtopicMicroCourseSchema>;

export function validateSubtopicSafe(raw: unknown): {
  success: boolean;
  data?: SubtopicMicroCourse;
  error?: string;
} {
  const res = SubtopicMicroCourseSchema.safeParse(raw);
  if (!res.success) {
    return {
      success: false,
      error: res.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
    };
  }
  return { success: true, data: res.data };
}

export function validateBlockSafe(rawBlock: unknown): {
  known: boolean;
  block?: SubtopicContentBlock;
  rawType?: string;
} {
  const parsed = SubtopicContentBlockSchema.safeParse(rawBlock);
  if (parsed.success) {
    return { known: true, block: parsed.data };
  }
  const rawType =
    rawBlock && typeof rawBlock === 'object' && 'type' in rawBlock
      ? String((rawBlock as Record<string, unknown>).type)
      : 'UnknownBlock';
  return { known: false, rawType };
}
