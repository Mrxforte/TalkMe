import { z } from 'zod';

export const CURRENT_SCHEMA_VERSION = '1.0.0';

export const CefrLevelSchema = z.enum(['A0', 'A1', 'A2', 'B1', 'B2', 'C1']);
export type CefrLevel = z.infer<typeof CefrLevelSchema>;

export const PresentationProfileTypeSchema = z.enum(['KIDS', 'ADULT']);
export type PresentationProfileType = z.infer<typeof PresentationProfileTypeSchema>;

export const SkillDomainSchema = z.enum([
  'vocabulary',
  'grammar',
  'phonetics',
  'listening',
  'speaking',
  'reading',
  'writing',
  'interactive_games',
]);
export type SkillDomain = z.infer<typeof SkillDomainSchema>;

export const SpeakableSegmentSchema = z.object({
  text: z.string(),
  lang: z.enum(['en', 'uz']),
  speakable: z.boolean().default(true),
  phonetic: z.string().optional(),
  translationUz: z.string().optional(),
  knowledgeId: z.string().optional(),
});
export type SpeakableSegment = z.infer<typeof SpeakableSegmentSchema>;

export const MediaAssetSchema = z.object({
  id: z.string(),
  type: z.enum(['image', 'audio', 'animation', 'icon']),
  urlOrEmoji: z.string(),
  altText: z.string(),
  localPackId: z.string().optional(),
});
export type MediaAsset = z.infer<typeof MediaAssetSchema>;

export const KnowledgeItemSchema = z.object({
  id: z.string(),
  domain: SkillDomainSchema,
  topicId: z.string(),
  subtopicId: z.string(),
  termEn: z.string(),
  meaningUz: z.string(),
  phonetic: z.string().optional(),
  formula: z.string().optional(),
  exampleEn: z.string().optional(),
  exampleUz: z.string().optional(),
  cefrLevel: CefrLevelSchema,
  emoji: z.string().optional(),
});
export type KnowledgeItem = z.infer<typeof KnowledgeItemSchema>;

// ============================================================================
// DISCRIMINATED UNION FOR LESSON CONTENT BLOCKS
// ============================================================================

export const IntroBlockSchema = z.object({
  blockType: z.literal('introduction'),
  id: z.string(),
  titleEn: z.string().optional(),
  titleUz: z.string(),
  bodyUz: z.string(),
  highlightPhraseEn: z.string().optional(),
  illustrationEmoji: z.string().default('👋'),
});

export const ExplanationBlockSchema = z.object({
  blockType: z.literal('explanation'),
  id: z.string(),
  titleUz: z.string(),
  explanationUz: z.string(),
  analogyTitleUz: z.string().optional(),
  analogyTextUz: z.string().optional(),
  speakableExamples: z
    .array(
      z.object({
        english: z.string(),
        uzbek: z.string(),
        phonetic: z.string().optional(),
      })
    )
    .default([]),
  reassuranceTextUz: z.string().optional(),
});

export const VocabularyGridBlockSchema = z.object({
  blockType: z.literal('vocabulary_grid'),
  id: z.string(),
  titleUz: z.string(),
  subtitleUz: z.string().optional(),
  items: z.array(
    z.object({
      id: z.string(),
      knowledgeId: z.string(),
      english: z.string(),
      uzbek: z.string(),
      phonetic: z.string().optional(),
      emoji: z.string(),
      exampleEn: z.string().optional(),
      exampleUz: z.string().optional(),
    })
  ),
});

export const GrammarRuleBlockSchema = z.object({
  blockType: z.literal('grammar_rule'),
  id: z.string(),
  knowledgeId: z.string(),
  ruleNameUz: z.string(),
  ruleNameEn: z.string().optional(),
  formula: z.string().optional(),
  explanationUz: z.string(),
  examples: z.array(
    z.object({
      english: z.string(),
      uzbek: z.string(),
    })
  ),
});

export const ConversationDialogueBlockSchema = z.object({
  blockType: z.literal('conversation_dialogue'),
  id: z.string(),
  scenarioUz: z.string(),
  turns: z.array(
    z.object({
      speaker: z.string(),
      avatarEmoji: z.string(),
      english: z.string(),
      uzbek: z.string(),
    })
  ),
});

export const StoryPassageBlockSchema = z.object({
  blockType: z.literal('story_passage'),
  id: z.string(),
  titleEn: z.string(),
  titleUz: z.string(),
  paragraphs: z.array(
    z.object({
      english: z.string(),
      uzbek: z.string(),
    })
  ),
});

export const SpeakingRepeatBlockSchema = z.object({
  blockType: z.literal('speaking_repeat'),
  id: z.string(),
  situationUz: z.string(),
  phrases: z.array(
    z.object({
      english: z.string(),
      uzbek: z.string(),
      phonetic: z.string().optional(),
      emoji: z.string().optional(),
    })
  ),
  tipUz: z.string().optional(),
});

export const InlinePracticeBlockSchema = z.object({
  blockType: z.literal('inline_practice'),
  id: z.string(),
  exerciseTypeCode: z.string(),
  promptUz: z.string(),
  promptEn: z.string().optional(),
  options: z.array(
    z.object({
      id: z.string(),
      textEn: z.string().optional(),
      textUz: z.string().optional(),
      isCorrect: z.boolean(),
    })
  ),
  explanationUz: z.string(),
  knowledgeIds: z.array(z.string()).default([]),
});

export const WrapUpBlockSchema = z.object({
  blockType: z.literal('wrap_up'),
  id: z.string(),
  congratsTitleUz: z.string(),
  summaryPointsUz: z.array(z.string()),
  unlockedPracticeTopicId: z.string().optional(),
  xpReward: z.number().default(30),
});

export const ContentBlockSchema = z.discriminatedUnion('blockType', [
  IntroBlockSchema,
  ExplanationBlockSchema,
  VocabularyGridBlockSchema,
  GrammarRuleBlockSchema,
  ConversationDialogueBlockSchema,
  StoryPassageBlockSchema,
  SpeakingRepeatBlockSchema,
  InlinePracticeBlockSchema,
  WrapUpBlockSchema,
]);
export type ContentBlock = z.infer<typeof ContentBlockSchema>;

// ============================================================================
// LESSON & SECTION SCHEMAS
// ============================================================================

export const LessonSectionSchema = z.object({
  id: z.string(),
  titleUz: z.string(),
  titleEn: z.string().optional(),
  sectionType: z.enum([
    'welcome',
    'explanation',
    'vocabulary',
    'grammar',
    'dialogue',
    'story',
    'speaking',
    'practice',
    'wrap_up',
  ]),
  blocks: z.array(ContentBlockSchema),
});
export type LessonSection = z.infer<typeof LessonSectionSchema>;

export const LessonSchema = z.object({
  schemaVersion: z.string().default(CURRENT_SCHEMA_VERSION),
  id: z.string(),
  courseId: z.string(),
  majorTopicId: z.string(),
  subtopicId: z.string(),
  titleEn: z.string(),
  titleUz: z.string(),
  subtitleUz: z.string(),
  cefrLevel: CefrLevelSchema,
  estimatedMinutes: z.number().default(5),
  xpReward: z.number().default(30),
  knowledgeIds: z.array(z.string()),
  prerequisites: z.array(z.string()).default([]),
  sections: z.array(LessonSectionSchema),
});
export type LessonContent = z.infer<typeof LessonSchema>;

// ============================================================================
// ROADMAP HIERARCHY: COURSE -> MAJOR TOPIC -> SUBTOPIC -> LESSONS
// ============================================================================

export const SubtopicSchema = z.object({
  id: z.string(),
  majorTopicId: z.string(),
  titleEn: z.string(),
  titleUz: z.string(),
  descriptionUz: z.string(),
  iconEmoji: z.string(),
  cefrLevel: CefrLevelSchema,
  lessonIds: z.array(z.string()),
  practicePathId: z.string(),
  knowledgeIds: z.array(z.string()),
});
export type SubtopicItem = z.infer<typeof SubtopicSchema>;

export const MajorTopicSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  titleEn: z.string(),
  titleUz: z.string(),
  descriptionUz: z.string(),
  iconEmoji: z.string(),
  cefrLevel: CefrLevelSchema,
  subtopics: z.array(SubtopicSchema), // Variable number of subtopics
});
export type MajorTopicItem = z.infer<typeof MajorTopicSchema>;

export const CourseSchema = z.object({
  schemaVersion: z.string().default(CURRENT_SCHEMA_VERSION),
  id: z.string(),
  titleEn: z.string(),
  titleUz: z.string(),
  descriptionUz: z.string(),
  cefrRange: z.string(),
  majorTopics: z.array(MajorTopicSchema),
});
export type CourseItem = z.infer<typeof CourseSchema>;

// ============================================================================
// PRACTICE CENTER & SEQUENTIAL UNLOCKING SCHEMAS
// ============================================================================

export const ExerciseInstanceSchema = z.object({
  id: z.string(),
  templateNumber: z.number().min(1).max(110),
  templateCode: z.string(),
  titleEn: z.string(),
  titleUz: z.string(),
  instructionUz: z.string(),
  instructionEn: z.string().optional(),
  skillDomain: SkillDomainSchema,
  cefrLevel: CefrLevelSchema,
  difficulty: z.number().min(1).max(5).default(1),
  requiredScore: z.number().min(50).max(100).default(75),
  minimumAttempts: z.number().min(1).default(1),
  maxRetries: z.number().default(3),
  prerequisites: z.array(z.string()).default([]),
  knowledgeIds: z.array(z.string()),
  xpReward: z.number().default(20),
  payload: z.record(z.string(), z.unknown()),
});
export type ExerciseInstance = z.infer<typeof ExerciseInstanceSchema>;

export const PracticePathSchema = z.object({
  schemaVersion: z.string().default(CURRENT_SCHEMA_VERSION),
  id: z.string(),
  majorTopicId: z.string(),
  subtopicId: z.string(),
  titleEn: z.string(),
  titleUz: z.string(),
  descriptionUz: z.string(),
  iconEmoji: z.string(),
  cefrLevel: CefrLevelSchema,
  requiredLessonIds: z.array(z.string()),
  exercises: z.array(ExerciseInstanceSchema), // Configurable length & sequential order
});
export type PracticePath = z.infer<typeof PracticePathSchema>;

// ============================================================================
// SAFE VALIDATORS WITH FALLBACKS FOR UNKNOWN VERSIONS OR TYPES
// ============================================================================

export function validateLessonSafe(raw: unknown): {
  success: boolean;
  data?: LessonContent;
  error?: string;
} {
  const parsed = LessonSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
    };
  }
  return { success: true, data: parsed.data };
}

export function validatePracticePathSafe(raw: unknown): {
  success: boolean;
  data?: PracticePath;
  error?: string;
} {
  const parsed = PracticePathSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
    };
  }
  return { success: true, data: parsed.data };
}
