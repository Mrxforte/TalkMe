import {
  SubtopicMicroCourse,
} from '../schemas/subtopicSchemas';
import { NOUNS_CURRICULUM_PART_1 } from './nounsCurriculumPart1';
import { NOUNS_CURRICULUM_PART_2 } from './nounsCurriculumPart2';

export interface MajorTopicWithSubtopics {
  id: string;
  courseId: string;
  titleEn: string;
  titleUz: string;
  descriptionUz: string;
  iconEmoji: string;
  cefrLevel: string;
  subtopicIds: string[];
}

export const NOUNS_18_SUBTOPIC_IDS: string[] = [
  'noun_01_what_is_a_noun',
  'noun_02_articles_and_prepositions',
  'noun_03_nouns_in_sentence',
  'noun_04_proper_and_common_intro',
  'noun_05_proper_nouns',
  'noun_06_common_nouns',
  'noun_07_types_of_common_nouns',
  'noun_08_countable_uncountable_intro',
  'noun_09_countable_nouns',
  'noun_10_uncountable_nouns',
  'noun_11_number_singular_plural',
  'noun_12_how_to_form_plural',
  'noun_13_singular_only_nouns',
  'noun_14_plural_only_nouns',
  'noun_15_compound_nouns',
  'noun_16_noun_cases_intro',
  'noun_17_common_and_possessive_case',
  'noun_18_complete_review',
];

export const MAJOR_TOPICS_CATALOG: MajorTopicWithSubtopics[] = [
  {
    id: 'nouns',
    courseId: 'course_general_english',
    titleEn: 'Nouns — Complete Curriculum (18 Subtopics)',
    titleUz: 'Nouns — Ot so‘z turkumi (18 ta Daraja)',
    descriptionUz:
      'Ot nima ekanligidan boshlab, gapdagi 5 vazifasi, atoqli va turdosh otlar, sanaladigan va sanalmaydigan otlar, ko‘plik yasashning 7 qoidasi, qo‘shma otlar hamda kelishiklargacha 18 darajali to‘liq o‘quv dasturi.',
    iconEmoji: '🏛️',
    cefrLevel: 'A0–B1',
    subtopicIds: NOUNS_18_SUBTOPIC_IDS,
  },
];

// ============================================================================
// SUBTOPICS REPOSITORY (ONLY NOUNS 18 SUBTOPICS)
// ============================================================================

export const SUBTOPICS_REPOSITORY: Record<string, SubtopicMicroCourse> = {
  ...NOUNS_CURRICULUM_PART_1,
  ...NOUNS_CURRICULUM_PART_2,

  // Backward-compatible aliases pointing to the 18-Subtopic Nouns Curriculum
  what_is_a_noun: NOUNS_CURRICULUM_PART_1.noun_01_what_is_a_noun,
  common_and_proper_nouns: NOUNS_CURRICULUM_PART_1.noun_04_proper_and_common_intro,
  singular_and_plural_nouns: NOUNS_CURRICULUM_PART_2.noun_11_number_singular_plural,
  countable_and_uncountable_nouns: NOUNS_CURRICULUM_PART_1.noun_08_countable_uncountable_intro,
  concrete_and_abstract_nouns: NOUNS_CURRICULUM_PART_1.noun_07_types_of_common_nouns,
  possessive_nouns: NOUNS_CURRICULUM_PART_2.noun_17_common_and_possessive_case,
};
