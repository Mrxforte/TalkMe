import {
  VocabularyKnowledge,
  normalizeVocabularyTerm,
  buildStableVocabularyId,
} from '../entities/VocabularyKnowledge';
import {
  GrammarKnowledge,
  normalizeGrammarRuleKey,
} from '../entities/GrammarKnowledge';
import {
  SUBTOPICS_REPOSITORY,
  NOUNS_18_SUBTOPIC_IDS,
} from '../../../content/registry/subtopicsCatalog';
import { validateBlockSafe } from '../../../content/schemas/subtopicSchemas';
import {
  KNOWLEDGE_ITEMS_REPOSITORY,
  UNIVERSAL_LESSONS_REPOSITORY,
} from '../../../content/registry/universalContentRepository';
import { TOPIC_LEARNING_GROUPS } from '../../../domain/learning/topicCatalog';
import {
  INITIAL_LEARNED_WORDS,
  INITIAL_MASTERED_RULES,
} from '../../../domain/learning/initialCatalog';
import { INITIAL_VOCABULARY } from '../../../domain/fsrs/defaultVocab';

export interface CanonicalVocabularyBlueprint {
  id: string;
  normalizedWord: string;
  displayWord: string;
  language: string;
  translation: string;
  pronunciation?: string;
  partOfSpeech?: string;
  emoji?: string;
  exampleEn?: string;
  exampleUz?: string;
  relatedForms?: string[];
  levelIds: string[];
  courseIds: string[];
  topicIds: string[];
  subtopicIds: string[];
  lessonIds: string[];
  sourceIds: string[];
  aliases: string[];
}

export interface CanonicalGrammarBlueprint {
  id: string;
  ruleKey: string;
  title: {
    en: string;
    uz: string;
  };
  description: string;
  formula?: string;
  examples: Array<{ en: string; uz: string; highlightedWords?: string[] }>;
  categoryUz?: string;
  levelIds: string[];
  courseIds: string[];
  topicIds: string[];
  subtopicIds: string[];
  lessonIds: string[];
  sourceIds: string[];
  aliases: string[];
}

/**
 * Explicit canonical ruleKey mapping for the 18 Nouns subtopics and universal lessons
 */
const SUBTOPIC_CANONICAL_RULE_KEY_MAP: Record<string, string> = {
  noun_01_what_is_a_noun: 'noun.definition',
  noun_02_articles_and_prepositions: 'noun.articles_and_prepositions',
  noun_03_nouns_in_sentence: 'noun.sentence_functions',
  noun_04_proper_and_common_intro: 'noun.proper_vs_common',
  noun_05_proper_nouns: 'noun.proper_capitalization',
  noun_06_common_nouns: 'noun.common_usage',
  noun_07_types_of_common_nouns: 'noun.concrete_abstract_collective',
  noun_08_countable_uncountable_intro: 'noun.countable_vs_uncountable',
  noun_09_countable_nouns: 'noun.countable_rules',
  noun_10_uncountable_nouns: 'noun.uncountable_partitives',
  noun_11_number_singular_plural: 'noun.singular_plural',
  noun_12_how_to_form_plural: 'noun.plural_formation_rules',
  noun_13_singular_only_nouns: 'noun.singular_only',
  noun_14_plural_only_nouns: 'noun.plural_only',
  noun_15_compound_nouns: 'noun.compound_nouns',
  noun_16_noun_cases_intro: 'noun.cases_overview',
  noun_17_common_and_possessive_case: 'noun.possessive_case',
  noun_18_complete_review: 'noun.complete_mastery_review',
};

const INFLECTED_FORM_TO_LEMMA: Record<string, string> = {
  goes: 'go',
  went: 'go',
  gone: 'go',
  going: 'go',
  does: 'do',
  did: 'do',
  done: 'do',
  has: 'have',
  had: 'have',
  children: 'child',
  men: 'man',
  women: 'woman',
  mice: 'mouse',
  teeth: 'tooth',
  feet: 'foot',
  geese: 'goose',
  oxen: 'ox',
  knives: 'knife',
  leaves: 'leaf',
  wolves: 'wolf',
  lives: 'life',
  cities: 'city',
  babies: 'baby',
  stories: 'story',
  countries: 'country',
  boxes: 'box',
  buses: 'bus',
  watches: 'watch',
  dishes: 'dish',
  classes: 'class',
  quizzes: 'quiz',
  potatoes: 'potato',
  tomatoes: 'tomato',
  heroes: 'hero',
  books: 'book',
  apples: 'apple',
  teachers: 'teacher',
  students: 'student',
  cars: 'car',
};

function addUnique(arr: string[], value?: string): void {
  if (!value || !value.trim()) return;
  if (!arr.includes(value)) arr.push(value);
}

class GlobalKnowledgeCatalogService {
  private vocabById: Map<string, CanonicalVocabularyBlueprint> = new Map();
  private vocabAliasToId: Map<string, string> = new Map();
  private vocabNormalizedWordToIds: Map<string, string[]> = new Map();

  private grammarById: Map<string, CanonicalGrammarBlueprint> = new Map();
  private grammarAliasToId: Map<string, string> = new Map();
  private grammarRuleKeyToId: Map<string, string> = new Map();

  constructor() {
    this.buildCatalog();
  }

  private registerVocabularyBlueprint(input: {
    preferredId?: string;
    word: string;
    language?: string;
    translation: string;
    pronunciation?: string;
    partOfSpeech?: string;
    emoji?: string;
    exampleEn?: string;
    exampleUz?: string;
    relatedForms?: string[];
    courseId?: string;
    levelId?: string;
    topicId?: string;
    subtopicId?: string;
    lessonId?: string;
    sourceId?: string;
    aliasIds?: string[];
    distinctSenseKey?: string;
  }): CanonicalVocabularyBlueprint {
    const language = input.language || 'en';
    const rawParts = input.word.split('/').map((s) => s.trim()).filter(Boolean);
    const cleanWord = rawParts[0] || input.word.trim(); // e.g. "Book / Books" -> "Book"
    const normalizedWord = normalizeVocabularyTerm(cleanWord, language);

    // Check if an existing entry matches this normalizedWord with compatible meaning
    const existingIds = this.vocabNormalizedWordToIds.get(normalizedWord) || [];
    let matchedBlueprint: CanonicalVocabularyBlueprint | undefined;

    for (const candidateId of existingIds) {
      const candidate = this.vocabById.get(candidateId);
      if (!candidate) continue;
      if (!input.distinctSenseKey) {
        matchedBlueprint = candidate;
        break;
      }
      if (candidate.id.endsWith(`__${input.distinctSenseKey}`)) {
        matchedBlueprint = candidate;
        break;
      }
    }

    if (!matchedBlueprint && input.preferredId && this.vocabById.has(input.preferredId)) {
      matchedBlueprint = this.vocabById.get(input.preferredId);
    }

    const extraForms = rawParts.slice(1);
    const allRelatedForms = [
      ...(input.relatedForms || []),
      ...extraForms,
    ];

    if (!matchedBlueprint) {
      const canonicalId = buildStableVocabularyId({
        explicitId: input.preferredId?.startsWith('vocab_') ? input.preferredId : undefined,
        word: cleanWord,
        language,
        senseKey: input.distinctSenseKey,
      });

      matchedBlueprint = {
        id: canonicalId,
        normalizedWord,
        displayWord: cleanWord,
        language,
        translation: input.translation,
        pronunciation: input.pronunciation,
        partOfSpeech: input.partOfSpeech || 'noun',
        emoji: input.emoji || '📘',
        exampleEn: input.exampleEn,
        exampleUz: input.exampleUz,
        relatedForms: [...allRelatedForms],
        levelIds: [],
        courseIds: [],
        topicIds: [],
        subtopicIds: [],
        lessonIds: [],
        sourceIds: [],
        aliases: [canonicalId],
      };

      this.vocabById.set(canonicalId, matchedBlueprint);
      this.vocabAliasToId.set(canonicalId, canonicalId);
      if (!input.distinctSenseKey) {
        this.vocabAliasToId.set(normalizedWord, canonicalId);
      }
      const list = this.vocabNormalizedWordToIds.get(normalizedWord) || [];
      if (!list.includes(canonicalId)) {
        this.vocabNormalizedWordToIds.set(normalizedWord, [...list, canonicalId]);
      }
    } else {
      // Enrich metadata if missing
      if (!matchedBlueprint.pronunciation && input.pronunciation) {
        matchedBlueprint.pronunciation = input.pronunciation;
      }
      if (!matchedBlueprint.exampleEn && input.exampleEn) {
        matchedBlueprint.exampleEn = input.exampleEn;
      }
      if (!matchedBlueprint.exampleUz && input.exampleUz) {
        matchedBlueprint.exampleUz = input.exampleUz;
      }
      if (
        (!matchedBlueprint.translation ||
          matchedBlueprint.translation === matchedBlueprint.displayWord) &&
        input.translation
      ) {
        matchedBlueprint.translation = input.translation;
      }
    }

    for (const rf of allRelatedForms) {
      if (!matchedBlueprint.relatedForms) matchedBlueprint.relatedForms = [];
      addUnique(matchedBlueprint.relatedForms, rf);
      const normRf = normalizeVocabularyTerm(rf, language);
      if (!this.vocabAliasToId.has(normRf)) {
        this.vocabAliasToId.set(normRf, matchedBlueprint.id);
      }
    }

    addUnique(matchedBlueprint.courseIds, input.courseId);
    addUnique(matchedBlueprint.levelIds, input.levelId);
    addUnique(matchedBlueprint.topicIds, input.topicId);
    addUnique(matchedBlueprint.subtopicIds, input.subtopicId);
    addUnique(matchedBlueprint.lessonIds, input.lessonId);
    addUnique(matchedBlueprint.sourceIds, input.sourceId);

    if (input.preferredId) {
      addUnique(matchedBlueprint.aliases, input.preferredId);
      this.vocabAliasToId.set(input.preferredId, matchedBlueprint.id);
    }
    if (input.aliasIds) {
      for (const al of input.aliasIds) {
        addUnique(matchedBlueprint.aliases, al);
        this.vocabAliasToId.set(al, matchedBlueprint.id);
      }
    }

    return matchedBlueprint;
  }

  private registerGrammarBlueprint(input: {
    preferredId?: string;
    ruleKey: string;
    titleEn: string;
    titleUz: string;
    description: string;
    formula?: string;
    examples?: Array<{ en: string; uz: string; highlightedWords?: string[] }>;
    categoryUz?: string;
    courseId?: string;
    levelId?: string;
    topicId?: string;
    subtopicId?: string;
    lessonId?: string;
    sourceId?: string;
    aliasIds?: string[];
  }): CanonicalGrammarBlueprint {
    const normalizedKey = normalizeGrammarRuleKey(input.ruleKey);
    const existingId = this.grammarRuleKeyToId.get(normalizedKey);
    let blueprint = existingId ? this.grammarById.get(existingId) : undefined;

    if (!blueprint && input.preferredId && this.grammarById.has(input.preferredId)) {
      blueprint = this.grammarById.get(input.preferredId);
    }

    if (!blueprint) {
      const canonicalId = `grammar_${normalizedKey.replace(/\./g, '_')}`;
      blueprint = {
        id: canonicalId,
        ruleKey: normalizedKey,
        title: {
          en: input.titleEn,
          uz: input.titleUz,
        },
        description: input.description,
        formula: input.formula,
        examples: input.examples ? [...input.examples] : [],
        categoryUz: input.categoryUz || 'Grammatika',
        levelIds: [],
        courseIds: [],
        topicIds: [],
        subtopicIds: [],
        lessonIds: [],
        sourceIds: [],
        aliases: [canonicalId, normalizedKey],
      };

      this.grammarById.set(canonicalId, blueprint);
      this.grammarRuleKeyToId.set(normalizedKey, canonicalId);
      this.grammarAliasToId.set(canonicalId, canonicalId);
      this.grammarAliasToId.set(normalizedKey, canonicalId);
    } else {
      if (!blueprint.formula && input.formula) {
        blueprint.formula = input.formula;
      }
      if (input.examples && input.examples.length > 0 && blueprint.examples.length === 0) {
        blueprint.examples = [...input.examples];
      }
    }

    addUnique(blueprint.courseIds, input.courseId);
    addUnique(blueprint.levelIds, input.levelId);
    addUnique(blueprint.topicIds, input.topicId);
    addUnique(blueprint.subtopicIds, input.subtopicId);
    addUnique(blueprint.lessonIds, input.lessonId);
    addUnique(blueprint.sourceIds, input.sourceId);

    if (input.preferredId) {
      addUnique(blueprint.aliases, input.preferredId);
      this.grammarAliasToId.set(input.preferredId, blueprint.id);
    }
    if (input.aliasIds) {
      for (const al of input.aliasIds) {
        addUnique(blueprint.aliases, al);
        this.grammarAliasToId.set(al, blueprint.id);
      }
    }

    return blueprint;
  }

  private buildCatalog(): void {
    // 1. Seed from INITIAL_LEARNED_WORDS
    for (const item of INITIAL_LEARNED_WORDS) {
      const levelMatch = item.category.match(/^(A0|A1|A2|B1|B2)/i);
      const levelId = levelMatch ? levelMatch[1].toUpperCase() : 'A0';
      this.registerVocabularyBlueprint({
        word: item.word,
        translation: item.translation,
        pronunciation: item.phonetic,
        partOfSpeech: item.category,
        emoji: item.emoji,
        courseId: 'course_general_english',
        levelId,
        topicId: item.id.includes('hello') ? 'topic_hello_a0' : 'topic_parts_of_speech',
        sourceId: item.id,
        aliasIds: [item.id],
      });
    }

    // 2. Seed from INITIAL_VOCABULARY (FSRS cards)
    for (const fsrsItem of INITIAL_VOCABULARY) {
      this.registerVocabularyBlueprint({
        word: fsrsItem.word,
        translation: fsrsItem.translation,
        pronunciation: fsrsItem.phonetic,
        partOfSpeech: fsrsItem.category,
        exampleEn: fsrsItem.exampleEn,
        exampleUz: fsrsItem.exampleUz,
        courseId: 'course_general_english',
        levelId: 'A1',
        topicId: 'topic_parts_of_speech',
        sourceId: fsrsItem.card.wordId,
        aliasIds: [fsrsItem.card.wordId, fsrsItem.card.cardId],
      });
    }

    // 3. Seed from TOPIC_LEARNING_GROUPS (Skill Practice & Topic Groups)
    for (const group of TOPIC_LEARNING_GROUPS) {
      for (const w of group.words) {
        this.registerVocabularyBlueprint({
          word: w.word,
          translation: w.translation,
          pronunciation: w.phonetic,
          partOfSpeech: w.category,
          emoji: w.emoji,
          courseId: 'course_general_english',
          levelId: group.level,
          topicId: group.id,
          lessonId: group.id,
          sourceId: w.id,
          aliasIds: [w.id],
        });
      }

      for (const r of group.rules) {
        const ruleKey =
          r.id === 'rule_hello_01_lego_sentence'
            ? 'sentence.lego_structure'
            : r.id === 'rule_gf_01_word_order_meaning'
            ? 'sentence.svo_word_order'
            : r.id === 'rule_gf_02_letters_sounds_words'
            ? 'phonetics.letters_vs_sounds'
            : r.id === 'rule_to_be_present'
            ? 'verb.to_be_present'
            : r.id;

        this.registerGrammarBlueprint({
          ruleKey,
          titleEn: r.nameEn || r.nameUz,
          titleUz: r.nameUz,
          description: r.shortSummaryUz,
          formula: r.formula,
          examples: r.exampleEn ? [{ en: r.exampleEn, uz: r.exampleUz || '' }] : [],
          categoryUz: r.category,
          courseId: 'course_general_english',
          levelId: group.level,
          topicId: group.id,
          lessonId: group.id,
          sourceId: r.id,
          aliasIds: [r.id],
        });
      }
    }

    // 4. Seed from INITIAL_MASTERED_RULES
    for (const r of INITIAL_MASTERED_RULES) {
      const ruleKey =
        r.id === 'rule_hello_01_lego_sentence'
          ? 'sentence.lego_structure'
          : r.id === 'rule_gf_01_word_order_meaning'
          ? 'sentence.svo_word_order'
          : r.id === 'rule_gf_02_letters_sounds_words'
          ? 'phonetics.letters_vs_sounds'
          : r.id === 'rule_to_be_present'
          ? 'verb.to_be_present'
          : r.id;

      this.registerGrammarBlueprint({
        ruleKey,
        titleEn: r.nameEn || r.nameUz,
        titleUz: r.nameUz,
        description: r.shortSummaryUz,
        formula: r.formula,
        examples: r.exampleEn ? [{ en: r.exampleEn, uz: r.exampleUz || '' }] : [],
        categoryUz: r.category,
        courseId: 'course_general_english',
        levelId: 'A1',
        topicId: 'topic_parts_of_speech',
        sourceId: r.id,
        aliasIds: [r.id],
      });
    }

    // 5. Seed from KNOWLEDGE_ITEMS_REPOSITORY & UNIVERSAL_LESSONS_REPOSITORY
    for (const kItem of KNOWLEDGE_ITEMS_REPOSITORY) {
      if (kItem.domain === 'vocabulary') {
        const cleanTerm = kItem.termEn.includes('(')
          ? kItem.termEn.split('(')[0].trim()
          : kItem.termEn.split('/')[0].trim();
        this.registerVocabularyBlueprint({
          word: cleanTerm,
          translation: kItem.meaningUz,
          pronunciation: kItem.phonetic,
          emoji: kItem.emoji,
          exampleEn: kItem.exampleEn,
          exampleUz: kItem.exampleUz,
          courseId: 'course_general_english',
          levelId: kItem.cefrLevel,
          topicId: kItem.topicId,
          subtopicId: kItem.subtopicId,
          sourceId: kItem.id,
          aliasIds: [kItem.id],
        });
      } else if (kItem.domain === 'grammar') {
        const mappedRuleKey =
          kItem.id === 'kw_noun_concept'
            ? 'noun.definition'
            : kItem.id === 'kw_noun_plural_s'
            ? 'noun.singular_plural'
            : kItem.id === 'kw_i_am'
            ? 'verb.to_be_present'
            : kItem.id;

        this.registerGrammarBlueprint({
          ruleKey: mappedRuleKey,
          titleEn: kItem.termEn,
          titleUz: kItem.meaningUz,
          description: kItem.meaningUz,
          formula: kItem.formula,
          examples: kItem.exampleEn ? [{ en: kItem.exampleEn, uz: kItem.exampleUz || '' }] : [],
          courseId: 'course_general_english',
          levelId: kItem.cefrLevel,
          topicId: kItem.topicId,
          subtopicId: kItem.subtopicId,
          sourceId: kItem.id,
          aliasIds: [kItem.id],
        });
      }
    }

    for (const lesson of Object.values(UNIVERSAL_LESSONS_REPOSITORY)) {
      for (const sec of lesson.sections) {
        for (const block of sec.blocks) {
          if (block.blockType === 'vocabulary_grid') {
            for (const vItem of block.items) {
              this.registerVocabularyBlueprint({
                word: vItem.english,
                translation: vItem.uzbek,
                pronunciation: vItem.phonetic,
                emoji: vItem.emoji,
                exampleEn: vItem.exampleEn,
                exampleUz: vItem.exampleUz,
                courseId: lesson.courseId,
                levelId: lesson.cefrLevel,
                topicId: lesson.majorTopicId,
                subtopicId: lesson.subtopicId,
                lessonId: lesson.id,
                sourceId: vItem.id,
                aliasIds: [vItem.id, vItem.knowledgeId],
              });
            }
          } else if (block.blockType === 'grammar_rule') {
            const ruleKey =
              block.knowledgeId === 'kw_noun_concept'
                ? 'noun.definition'
                : block.knowledgeId === 'kw_noun_plural_s'
                ? 'noun.singular_plural'
                : block.id === 'blk_teen_ty'
                ? 'numeral.teens_vs_tens'
                : block.id === 'blk_pronouns'
                ? 'pronoun.subject_pronouns'
                : block.id === 'blk_verbs'
                ? 'verb.present_simple'
                : block.id === 'blk_adj'
                ? 'adjective.position_before_noun'
                : block.knowledgeId || block.id;

            this.registerGrammarBlueprint({
              ruleKey,
              titleEn: block.ruleNameEn || block.ruleNameUz,
              titleUz: block.ruleNameUz,
              description: block.explanationUz,
              formula: block.formula,
              examples: block.examples.map((ex) => ({ en: ex.english, uz: ex.uzbek })),
              courseId: lesson.courseId,
              levelId: lesson.cefrLevel,
              topicId: lesson.majorTopicId,
              subtopicId: lesson.subtopicId,
              lessonId: lesson.id,
              sourceId: block.id,
              aliasIds: [block.id, block.knowledgeId],
            });
          }
        }
      }
    }

    // 6. Seed from all 18 Nouns Subtopic Micro-Courses
    NOUNS_18_SUBTOPIC_IDS.forEach((subId) => {
      const sub = SUBTOPICS_REPOSITORY[subId];
      if (!sub) return;

      const levelTag = `nouns_level_${sub.orderIndex}`;
      let vocabCounter = 0;
      let ruleBlockIndex = 0;

      for (const section of sub.sections) {
        for (const rawBlock of section.blocks) {
          const validated = validateBlockSafe(rawBlock);
          if (!validated.known || !validated.block) continue;
          const block = validated.block;

          if (block.type === 'VocabularyCard') {
            for (const w of block.words) {
              const legacySubWordId = `sub_${sub.id}_${w.id}`;
              this.registerVocabularyBlueprint({
                word: w.wordEn,
                translation: w.translationUz,
                pronunciation: w.phonetic,
                partOfSpeech: w.categoryUz || 'Ot (Noun)',
                emoji: w.emoji || sub.iconEmoji,
                exampleEn: w.exampleSentenceEn,
                exampleUz: w.exampleSentenceUz,
                courseId: 'nouns',
                levelId: levelTag,
                topicId: sub.majorTopicId,
                subtopicId: sub.id,
                lessonId: sub.id,
                sourceId: legacySubWordId,
                aliasIds: [w.id, legacySubWordId],
              });
              vocabCounter += 1;
            }
          }

          if (block.type === 'RuleExplanation') {
            const legacySubRuleId = `sub_${sub.id}_${block.id}`;
            const baseRuleKey = SUBTOPIC_CANONICAL_RULE_KEY_MAP[sub.id] || `noun.${sub.id}`;
            const specificRuleKey =
              ruleBlockIndex === 0 ? baseRuleKey : `${baseRuleKey}.${block.id}`;
            ruleBlockIndex += 1;

            this.registerGrammarBlueprint({
              ruleKey: specificRuleKey,
              titleEn: block.ruleTitleEn || sub.title.en,
              titleUz: block.ruleTitleUz,
              description: block.simpleExplanationUz,
              formula: block.formula || block.questionsAnsweredUz.join(' | '),
              examples: block.examples.map((ex) => ({
                en: ex.text,
                uz: ex.translation || '',
                highlightedWords: ex.highlightedWords,
              })),
              categoryUz: `${sub.orderIndex}-Daraja • ${sub.majorTopicTitleUz}`,
              courseId: 'nouns',
              levelId: levelTag,
              topicId: sub.majorTopicId,
              subtopicId: sub.id,
              lessonId: sub.id,
              sourceId: legacySubRuleId,
              aliasIds: [
                legacySubRuleId,
                block.id,
                ...(ruleBlockIndex === 1 ? [`rule_${sub.id}`] : []),
              ],
            });
          }
        }
      }

      // If a subtopic had no explicit VocabularyCard, extract up to 5 target words from ExampleSentence
      if (vocabCounter === 0) {
        let exIdx = 1;
        for (const section of sub.sections) {
          for (const rawBlock of section.blocks) {
            const validated = validateBlockSafe(rawBlock);
            if (!validated.known || !validated.block) continue;
            const block = validated.block;

            if (block.type === 'ExampleSentence' && exIdx <= 5) {
              const hw = block.sentence.highlightedWords?.[0] || block.sentence.text;
              const legacyExWordId = `sub_${sub.id}_exw_${exIdx}`;
              this.registerVocabularyBlueprint({
                word: hw,
                translation:
                  block.explanationUz || block.sentence.translation || sub.title.uz,
                partOfSpeech: 'Ot (Noun)',
                emoji: sub.iconEmoji || '📘',
                exampleEn: block.sentence.text,
                exampleUz: block.sentence.translation,
                courseId: 'nouns',
                levelId: levelTag,
                topicId: sub.majorTopicId,
                subtopicId: sub.id,
                lessonId: sub.id,
                sourceId: legacyExWordId,
                aliasIds: [legacyExWordId],
              });
              exIdx += 1;
            }
          }
        }
      }
    });
  }

  resolveVocabularyBlueprint(
    idOrAliasOrWord: string,
    fallbackMeta?: {
      word?: string;
      language?: string;
      translation?: string;
      pronunciation?: string;
      partOfSpeech?: string;
      emoji?: string;
      exampleEn?: string;
      exampleUz?: string;
      courseId?: string;
      levelId?: string;
      topicId?: string;
      subtopicId?: string;
      lessonId?: string;
      distinctSenseKey?: string;
    }
  ): CanonicalVocabularyBlueprint {
    const directId = this.vocabAliasToId.get(idOrAliasOrWord);
    if (directId && this.vocabById.has(directId)) {
      const bp = this.vocabById.get(directId)!;
      if (fallbackMeta) {
        addUnique(bp.courseIds, fallbackMeta.courseId);
        addUnique(bp.levelIds, fallbackMeta.levelId);
        addUnique(bp.topicIds, fallbackMeta.topicId);
        addUnique(bp.subtopicIds, fallbackMeta.subtopicId);
        addUnique(bp.lessonIds, fallbackMeta.lessonId);
      }
      return bp;
    }

    const rawWord = fallbackMeta?.word || idOrAliasOrWord;
    const norm = normalizeVocabularyTerm(rawWord, fallbackMeta?.language || 'en');
    const normMappedId = this.vocabAliasToId.get(norm);
    if (normMappedId && this.vocabById.has(normMappedId) && !fallbackMeta?.distinctSenseKey) {
      const bp = this.vocabById.get(normMappedId)!;
      addUnique(bp.aliases, idOrAliasOrWord);
      this.vocabAliasToId.set(idOrAliasOrWord, bp.id);
      if (fallbackMeta) {
        addUnique(bp.courseIds, fallbackMeta.courseId);
        addUnique(bp.levelIds, fallbackMeta.levelId);
        addUnique(bp.topicIds, fallbackMeta.topicId);
        addUnique(bp.subtopicIds, fallbackMeta.subtopicId);
        addUnique(bp.lessonIds, fallbackMeta.lessonId);
      }
      return bp;
    }

    // Check if rawWord is a known inflected form (e.g., goes, went, gone -> go)
    const lowerClean = rawWord.trim().toLowerCase();
    const lemma = INFLECTED_FORM_TO_LEMMA[lowerClean];
    if (lemma && !fallbackMeta?.distinctSenseKey) {
      const lemmaNorm = normalizeVocabularyTerm(lemma, fallbackMeta?.language || 'en');
      const lemmaMappedId = this.vocabAliasToId.get(lemmaNorm);
      if (lemmaMappedId && this.vocabById.has(lemmaMappedId)) {
        const bp = this.vocabById.get(lemmaMappedId)!;
        if (!bp.relatedForms) bp.relatedForms = [];
        addUnique(bp.relatedForms, lowerClean);
        addUnique(bp.aliases, idOrAliasOrWord);
        this.vocabAliasToId.set(norm, bp.id);
        this.vocabAliasToId.set(idOrAliasOrWord, bp.id);
        return bp;
      }
    }

    // Dynamically register new vocabulary entry (supports future lessons/courses)
    return this.registerVocabularyBlueprint({
      preferredId: idOrAliasOrWord.startsWith('vocab_') ? idOrAliasOrWord : undefined,
      word: fallbackMeta?.word || idOrAliasOrWord,
      language: fallbackMeta?.language || 'en',
      translation: fallbackMeta?.translation || fallbackMeta?.word || idOrAliasOrWord,
      pronunciation: fallbackMeta?.pronunciation,
      partOfSpeech: fallbackMeta?.partOfSpeech,
      emoji: fallbackMeta?.emoji,
      exampleEn: fallbackMeta?.exampleEn,
      exampleUz: fallbackMeta?.exampleUz,
      courseId: fallbackMeta?.courseId,
      levelId: fallbackMeta?.levelId,
      topicId: fallbackMeta?.topicId,
      subtopicId: fallbackMeta?.subtopicId,
      lessonId: fallbackMeta?.lessonId,
      sourceId: idOrAliasOrWord,
      aliasIds: [idOrAliasOrWord],
      distinctSenseKey: fallbackMeta?.distinctSenseKey,
    });
  }

  resolveGrammarBlueprint(
    idOrRuleKey: string,
    fallbackMeta?: {
      ruleKey?: string;
      titleEn?: string;
      titleUz?: string;
      description?: string;
      formula?: string;
      examples?: Array<{ en: string; uz: string }>;
      categoryUz?: string;
      courseId?: string;
      levelId?: string;
      topicId?: string;
      subtopicId?: string;
      lessonId?: string;
    }
  ): CanonicalGrammarBlueprint {
    const directId = this.grammarAliasToId.get(idOrRuleKey);
    if (directId && this.grammarById.has(directId)) {
      const bp = this.grammarById.get(directId)!;
      if (fallbackMeta) {
        addUnique(bp.courseIds, fallbackMeta.courseId);
        addUnique(bp.levelIds, fallbackMeta.levelId);
        addUnique(bp.topicIds, fallbackMeta.topicId);
        addUnique(bp.subtopicIds, fallbackMeta.subtopicId);
        addUnique(bp.lessonIds, fallbackMeta.lessonId);
      }
      return bp;
    }

    const normKey = normalizeGrammarRuleKey(fallbackMeta?.ruleKey || idOrRuleKey);
    const keyMappedId = this.grammarRuleKeyToId.get(normKey);
    if (keyMappedId && this.grammarById.has(keyMappedId)) {
      const bp = this.grammarById.get(keyMappedId)!;
      addUnique(bp.aliases, idOrRuleKey);
      this.grammarAliasToId.set(idOrRuleKey, bp.id);
      if (fallbackMeta) {
        addUnique(bp.courseIds, fallbackMeta.courseId);
        addUnique(bp.levelIds, fallbackMeta.levelId);
        addUnique(bp.topicIds, fallbackMeta.topicId);
        addUnique(bp.subtopicIds, fallbackMeta.subtopicId);
        addUnique(bp.lessonIds, fallbackMeta.lessonId);
      }
      return bp;
    }

    return this.registerGrammarBlueprint({
      preferredId: idOrRuleKey.startsWith('grammar_') ? idOrRuleKey : undefined,
      ruleKey: fallbackMeta?.ruleKey || idOrRuleKey,
      titleEn: fallbackMeta?.titleEn || idOrRuleKey,
      titleUz: fallbackMeta?.titleUz || fallbackMeta?.titleEn || idOrRuleKey,
      description:
        fallbackMeta?.description || fallbackMeta?.titleUz || fallbackMeta?.titleEn || idOrRuleKey,
      formula: fallbackMeta?.formula,
      examples: fallbackMeta?.examples,
      categoryUz: fallbackMeta?.categoryUz,
      courseId: fallbackMeta?.courseId,
      levelId: fallbackMeta?.levelId,
      topicId: fallbackMeta?.topicId,
      subtopicId: fallbackMeta?.subtopicId,
      lessonId: fallbackMeta?.lessonId,
      sourceId: idOrRuleKey,
      aliasIds: [idOrRuleKey],
    });
  }

  getAllVocabularyBlueprints(): CanonicalVocabularyBlueprint[] {
    return Array.from(this.vocabById.values());
  }

  getAllGrammarBlueprints(): CanonicalGrammarBlueprint[] {
    return Array.from(this.grammarById.values());
  }

  getVocabularyBlueprintsForSubtopic(subtopicId: string): CanonicalVocabularyBlueprint[] {
    return Array.from(this.vocabById.values()).filter(
      (v) => v.subtopicIds.includes(subtopicId) || v.lessonIds.includes(subtopicId)
    );
  }

  getGrammarBlueprintsForSubtopic(subtopicId: string): CanonicalGrammarBlueprint[] {
    return Array.from(this.grammarById.values()).filter(
      (g) => g.subtopicIds.includes(subtopicId) || g.lessonIds.includes(subtopicId)
    );
  }

  isKnownGrammarId(idOrKey: string): boolean {
    if (this.grammarAliasToId.has(idOrKey)) return true;
    const norm = normalizeGrammarRuleKey(idOrKey);
    return this.grammarRuleKeyToId.has(norm);
  }

  isKnownVocabularyId(idOrWord: string): boolean {
    if (this.vocabAliasToId.has(idOrWord)) return true;
    const norm = normalizeVocabularyTerm(idOrWord, 'en');
    return this.vocabAliasToId.has(norm);
  }
}

export const globalKnowledgeCatalog = new GlobalKnowledgeCatalogService();
