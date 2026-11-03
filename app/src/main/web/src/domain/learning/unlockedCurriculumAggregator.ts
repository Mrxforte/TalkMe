import { LearnedWordItem, MasteredRuleItem } from '../../types';
import {
  SUBTOPICS_REPOSITORY,
  NOUNS_18_SUBTOPIC_IDS,
} from '../../content/registry/subtopicsCatalog';
import { subtopicProgressEngine } from '../../engines/subtopic-engine/subtopicProgressEngine';
import { globalKnowledgeCatalog } from '../../knowledge/domain/services/GlobalKnowledgeCatalog';
import { globalKnowledgeTracker } from '../../knowledge/domain/services/GlobalKnowledgeTracker';

export interface CurriculumTopicUnit {
  id: string;
  title: string;
  subtitle: string;
  section: string;
  level: string;
  iconEmoji: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  words: LearnedWordItem[];
  rules: MasteredRuleItem[];
}

/**
 * Extracts canonical vocabulary words and grammar rules for a SubtopicMicroCourse
 * using GlobalKnowledgeCatalog and live status from GlobalKnowledgeTracker.
 */
function buildUnitFromSubtopic(
  subtopicId: string,
  isUnlocked: boolean,
  isCompleted: boolean
): CurriculumTopicUnit | null {
  const sub = SUBTOPICS_REPOSITORY[subtopicId];
  if (!sub) return null;

  const vocabBlueprints = globalKnowledgeCatalog.getVocabularyBlueprintsForSubtopic(subtopicId);
  const grammarBlueprints = globalKnowledgeCatalog.getGrammarBlueprintsForSubtopic(subtopicId);

  const extractedWords: LearnedWordItem[] = vocabBlueprints.map((bp) => {
    const tracked = globalKnowledgeTracker.getVocabularyRecord(bp.id);
    const isLearned =
      tracked?.status === 'learned' || tracked?.status === 'mastered';
    return {
      id: bp.id,
      word: bp.displayWord,
      translation: bp.translation,
      phonetic: bp.pronunciation,
      category: bp.partOfSpeech || `${sub.orderIndex}-Daraja • ${sub.title.uz}`,
      status: isLearned ? 'learned' : 'learning',
      emoji: bp.emoji || sub.iconEmoji || '📘',
      meaningfulInteractionsCount: tracked ? tracked.exposureCount + tracked.practiceCount : 0,
      correctExercisesCount: tracked ? tracked.correctCount : 0,
      reps: tracked?.srsReview?.reps ?? tracked?.correctCount ?? 0,
      nextReview: tracked?.srsReview?.nextReviewAt || Date.now() + 24 * 60 * 60 * 1000,
      isCloudSynced: Boolean(tracked?.isCloudSynced),
      updatedAt: tracked?.updatedAt || Date.now(),
    };
  });

  const extractedRules: MasteredRuleItem[] = grammarBlueprints.map((bp) => {
    const tracked = globalKnowledgeTracker.getGrammarRecord(bp.id);
    const isLearned =
      tracked?.status === 'learned' || tracked?.status === 'mastered';
    return {
      id: bp.id,
      nameUz: bp.title.uz,
      nameEn: bp.title.en,
      category: bp.categoryUz || `${sub.orderIndex}-Daraja • ${sub.majorTopicTitleUz}`,
      shortSummaryUz: bp.description,
      formula: bp.formula,
      status: isLearned ? 'learned' : 'learning',
      masteryScore: tracked ? tracked.masteryScore : 0,
      exampleEn: bp.examples[0]?.en || sub.title.en,
      exampleUz: bp.examples[0]?.uz || sub.title.uz,
      isCloudSynced: Boolean(tracked?.isCloudSynced),
      updatedAt: tracked?.updatedAt || Date.now(),
    };
  });

  return {
    id: sub.id,
    title: `${sub.orderIndex}-Daraja: ${sub.title.en} (${sub.title.uz})`,
    subtitle: sub.shortIntroUz,
    section: `OT (NOUNS) · ${sub.orderIndex}-DARAJA`,
    level: sub.level,
    iconEmoji: sub.iconEmoji || '🏛️',
    isUnlocked,
    isCompleted,
    words: extractedWords,
    rules: extractedRules,
  };
}

/**
 * Returns all 18 Nouns subtopic units arranged level-by-level with accurate `isUnlocked` status
 * based on the user's completedLevelIds and subtopicProgressEngine state.
 */
export function getAllCurriculumTopicUnits(completedLevelIds: string[]): CurriculumTopicUnit[] {
  const units: CurriculumTopicUnit[] = [];
  const allSubtopicProgress = subtopicProgressEngine.getAllRecords();

  NOUNS_18_SUBTOPIC_IDS.forEach((subId, index) => {
    const rec = allSubtopicProgress.find((r) => r.subtopicId === subId);
    const prevSubId = index > 0 ? NOUNS_18_SUBTOPIC_IDS[index - 1] : null;
    const prevRec = prevSubId
      ? allSubtopicProgress.find((r) => r.subtopicId === prevSubId)
      : null;

    const isVisitedOrCompleted = Boolean(
      rec && (rec.isCompleted || (rec.completedStageNumbers && rec.completedStageNumbers.length > 0))
    );
    const isPrevCompleted = Boolean(prevRec && prevRec.isCompleted);
    const isLevelCompleted =
      completedLevelIds.includes(subId) ||
      completedLevelIds.includes(`nouns_lvl_${index + 1}`) ||
      completedLevelIds.includes(`nouns_level_${index + 1}`) ||
      (index > 0 &&
        (completedLevelIds.includes(`nouns_lvl_${index}`) ||
          completedLevelIds.includes(`nouns_level_${index}`)));

    const isUnlocked = index === 0 || isVisitedOrCompleted || isPrevCompleted || isLevelCompleted;
    const isCompleted = Boolean(
      (rec && rec.isCompleted) ||
        completedLevelIds.includes(subId) ||
        completedLevelIds.includes(`nouns_lvl_${index + 1}`) ||
        completedLevelIds.includes(`nouns_level_${index + 1}`)
    );

    const unit = buildUnitFromSubtopic(subId, isUnlocked, isCompleted);
    if (unit) {
      units.push(unit);
    }
  });

  return units;
}

/**
 * Returns ONLY the unlocked topic/subtopic units for the user.
 */
export function getUnlockedCurriculumTopicUnits(
  completedLevelIds: string[]
): CurriculumTopicUnit[] {
  return getAllCurriculumTopicUnits(completedLevelIds).filter((u) => u.isUnlocked);
}

/**
 * Finds a specific CurriculumTopicUnit by ID (falls back to first unit if not found)
 */
export function findCurriculumTopicUnitById(
  topicId: string,
  completedLevelIds: string[]
): CurriculumTopicUnit {
  const all = getAllCurriculumTopicUnits(completedLevelIds);
  return all.find((u) => u.id === topicId) || all[0];
}

/**
 * Finds a word definition across all curriculum units by wordId
 */
export function findCatalogWordById(wordId: string): LearnedWordItem | undefined {
  const all = getAllCurriculumTopicUnits([]);
  for (const unit of all) {
    const found = unit.words.find((w) => w.id === wordId);
    if (found) return found;
  }
  return undefined;
}

/**
 * Finds a grammar rule definition across all curriculum units by ruleId
 */
export function findCatalogRuleById(ruleId: string): MasteredRuleItem | undefined {
  const all = getAllCurriculumTopicUnits([]);
  for (const unit of all) {
    const found = unit.rules.find((r) => r.id === ruleId);
    if (found) return found;
  }
  return undefined;
}

