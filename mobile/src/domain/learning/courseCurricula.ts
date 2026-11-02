import { LevelNodeType } from '../../types';
import { NOUNS_18_SUBTOPIC_IDS } from '../../content/registry/subtopicsCatalog';

export interface RawCourseTopic {
  title: string;
  subtitle: string;
  nodeType: LevelNodeType;
  xpReward: number;
  subtopicId?: string;
}

// Ported from `src/screens/CourseLevelsScreen.tsx` (`COURSE_CURRICULA`).
// Currently only Nouns (Ot so'z turkumi) has real subtopic content (18 levels);
// everything else is a placeholder category with `topics: []`.
export const COURSE_CURRICULA: Record<
  string,
  {
    title: string;
    subtitle: string;
    section: string;
    topics: RawCourseTopic[];
  }
> = {
  nouns: {
    title: 'Ot (Nouns — 18 Ost-Mavzu)',
    subtitle: 'Ot so‘z turkumi bo‘yicha darajalar (level) ketma-ketligidagi to‘liq kurs',
    section: 'BO‘LIM 1 · OT SO‘Z TURKUMI',
    topics: [
      { title: '1-Daraja: What is a Noun? (Ot nima?)', subtitle: '6 mustaqil so‘z turkumi hamda Kim? (Who?) va Nima? (What?) savollari', nodeType: 'MASCOT_INTRO', xpReward: 15, subtopicId: NOUNS_18_SUBTOPIC_IDS[0] },
      { title: '2-Daraja: Articles & Prepositions', subtitle: 'Ot oldidan keladigan artikllar (a, an, the) va predloglar (in, on, under, near)', nodeType: 'STAR', xpReward: 15, subtopicId: NOUNS_18_SUBTOPIC_IDS[1] },
      { title: '3-Daraja: Nouns in the Sentence', subtitle: 'Otning gapdagi 5 vazifasi: Subject, Complement, Object, Modifier, Adverbial', nodeType: 'READING', xpReward: 20, subtopicId: NOUNS_18_SUBTOPIC_IDS[2] },
      { title: '4-Daraja: Proper & Common Nouns Intro', subtitle: 'Atoqli va turdosh otlar: boy → Ali, city → Tashkent, country → Uzbekistan', nodeType: 'PRACTICE', xpReward: 15, subtopicId: NOUNS_18_SUBTOPIC_IDS[3] },
      { title: '5-Daraja: Proper Nouns (Atoqli otlar)', subtitle: 'Katta harf qoidasi: ismlar, shaharlar, davlatlar, kunlar va oylar', nodeType: 'MIC', xpReward: 15, subtopicId: NOUNS_18_SUBTOPIC_IDS[4] },
      { title: '6-Daraja: Common Nouns (Turdosh otlar)', subtitle: 'Shaxs, joy, hayvon va narsa-buyumlarning umumiy nomlari', nodeType: 'CAMERA', xpReward: 15, subtopicId: NOUNS_18_SUBTOPIC_IDS[5] },
      { title: '7-Daraja: Types of Common Nouns', subtitle: 'Jamlovchi (family), moddiy (water, milk) va mavhum (love, happiness) otlar', nodeType: 'HEADPHONES', xpReward: 20, subtopicId: NOUNS_18_SUBTOPIC_IDS[6] },
      { title: '8-Daraja: Countable & Uncountable Intro', subtitle: 'Sanaladigan (one book, two books) va sanalmaydigan (water, milk, rice) otlar', nodeType: 'STAR', xpReward: 15, subtopicId: NOUNS_18_SUBTOPIC_IDS[7] },
      { title: '9-Daraja: Countable Nouns', subtitle: 'Donalab sanaladigan otlar: a/an, many, a few va How many?', nodeType: 'PRACTICE', xpReward: 20, subtopicId: NOUNS_18_SUBTOPIC_IDS[8] },
      { title: '10-Daraja: Uncountable Nouns', subtitle: 'Sanalmaydigan otlar: much, a little, How much? va a glass of water', nodeType: 'READING', xpReward: 20, subtopicId: NOUNS_18_SUBTOPIC_IDS[9] },
      { title: '11-Daraja: Singular and Plural Intro', subtitle: 'Otda son kategoriyasi: Birlik (1 ta) va Ko‘plik (2 va undan ko‘p)', nodeType: 'MIC', xpReward: 15, subtopicId: NOUNS_18_SUBTOPIC_IDS[10] },
      { title: '12-Daraja: How to Form Plural Nouns', subtitle: 'Ko‘plik yasashning 7 qoidasi: -s, -es, -ies, -ves, irregular (children) va sheep', nodeType: 'STAR', xpReward: 25, subtopicId: NOUNS_18_SUBTOPIC_IDS[11] },
      { title: '13-Daraja: Nouns Used Only in the Singular', subtitle: 'Faqat birlikda: information, advice, furniture, knowledge (+ is)', nodeType: 'HEADPHONES', xpReward: 20, subtopicId: NOUNS_18_SUBTOPIC_IDS[12] },
      { title: '14-Daraja: Nouns Used Only in the Plural', subtitle: 'Faqat ko‘plikda: scissors, trousers, glasses, clothes (+ are)', nodeType: 'CAMERA', xpReward: 20, subtopicId: NOUNS_18_SUBTOPIC_IDS[13] },
      { title: '15-Daraja: Compound Nouns (Qo‘shma otlar)', subtitle: 'Qo‘shib (bedroom), ajratib (school bag) va chiziqcha bilan (mother-in-law)', nodeType: 'PRACTICE', xpReward: 20, subtopicId: NOUNS_18_SUBTOPIC_IDS[14] },
      { title: '16-Daraja: English Noun Cases Intro', subtitle: 'Nega o‘zbek tilida 6 ta kelishik, ingliz tilida esa 2 ta Case bor?', nodeType: 'READING', xpReward: 15, subtopicId: NOUNS_18_SUBTOPIC_IDS[15] },
      { title: '17-Daraja: Common Case & Possessive Case', subtitle: "Umumiy va Qaratqich kelishigi: Ali's book, students' books, of", nodeType: 'MIC', xpReward: 25, subtopicId: NOUNS_18_SUBTOPIC_IDS[16] },
      { title: '18-Daraja: Nouns: Complete Review', subtitle: 'Barcha 18 mavzuni jamlovchi katta takrorlash va yakuniy imtihon', nodeType: 'STAR', xpReward: 40, subtopicId: NOUNS_18_SUBTOPIC_IDS[17] },
    ],
  },
  english_fundamentals: {
    title: 'English Fundamentals',
    subtitle: 'Ingliz tili asoslari va ilk tushunchalar',
    section: 'BO‘LIM 0 · ASOSLAR',
    topics: [
      { title: '1-Dars: Kirish', subtitle: 'Til, harflar, tovushlar, so‘zlar va grammatika haqida tushuncha', nodeType: 'STAR', xpReward: 25, subtopicId: 'ef_01_kirish' },
    ],
  },
  grammar_fundamentals: {
    title: 'English Fundamentals',
    subtitle: 'Asosiy qoidalar va so‘z tuzilishi',
    section: 'BO‘LIM 0 · ASOSLAR',
    topics: [
      { title: '1-Dars: Kirish', subtitle: 'Til, harflar, tovushlar, so‘zlar va grammatika haqida tushuncha', nodeType: 'STAR', xpReward: 25, subtopicId: 'ef_01_kirish' },
    ],
  },
  verbs: { title: 'Fe‘l va Zamonlar', subtitle: 'Harakatlar: Present, Past, Future', section: 'BO‘LIM 2', topics: [] },
  adjectives: { title: 'Sifat (Adjectives)', subtitle: 'Belgi, xususiyat va darajalar', section: 'BO‘LIM 3', topics: [] },
  numerals: { title: 'Son (Numerals)', subtitle: 'Sanoq va tartib sonlar', section: 'BO‘LIM 4', topics: [] },
  pronouns: { title: 'Olmosh (Pronouns)', subtitle: 'Kishilik va egalik olmoshlari', section: 'BO‘LIM 5', topics: [] },
  adverbs: { title: 'Ravish (Adverbs)', subtitle: 'Harakat tarzi, daraja va tezlik', section: 'BO‘LIM 6', topics: [] },
  prepositions: { title: 'Predloglar (Prepositions)', subtitle: 'O‘rin, payt va yo‘nalish (in, on, at)', section: 'BO‘LIM 7', topics: [] },
  sentences: { title: 'Gap (Sentences)', subtitle: 'Ega, kesim, to‘ldiruvchi (S+V+O)', section: 'BO‘LIM 8', topics: [] },
  adverbials: { title: 'Hol (Adverbials)', subtitle: 'Payt, o‘rin, sabab va maqsad', section: 'BO‘LIM 9', topics: [] },
  articles: { title: 'Artikl (Articles: A, An, The)', subtitle: 'Aniq va noaniq artikl qoidalari', section: 'BO‘LIM 10', topics: [] },
};
