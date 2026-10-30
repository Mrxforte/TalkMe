import { CharacterProfile } from '../../types';

export const CHARACTER_VOICE_CATALOG: CharacterProfile[] = [
  {
    id: 'adult_male',
    family: 'ADULT_MALE',
    nameUz: 'Katta Yoshli Erkak',
    nameEn: 'Adult Male',
    iconEmoji: '👨',
    descriptionUz: 'Haqiqiy botiq, salmoqli va chuqur katta yoshli erkak bas/bariton ovozi.',
    baseRate: 0.88,
    basePitch: 0.88,
    preferredGender: 'male',
  },
  {
    id: 'adult_female',
    family: 'ADULT_FEMALE',
    nameUz: 'Katta Yoshli Ayol',
    nameEn: 'Adult Female',
    iconEmoji: '👩',
    descriptionUz: 'Mayin, ravshan va tabiiy katta yoshli ayol alto/soprano ovozi.',
    baseRate: 0.92,
    basePitch: 1.0,
    preferredGender: 'female',
  },
  {
    id: 'young_boy',
    family: 'YOUNG_BOY',
    nameUz: "Yosh O'g'il Bola",
    nameEn: 'Young Boy',
    iconEmoji: '👦',
    descriptionUz: "Qiziquvchan va jonli yosh o'g'il bola sintetizatsiyalangan ovozi.",
    baseRate: 1.0,
    basePitch: 1.3,
    preferredGender: 'male',
  },
  {
    id: 'young_girl',
    family: 'YOUNG_GIRL',
    nameUz: 'Yosh Qiz Bola',
    nameEn: 'Young Girl',
    iconEmoji: '👧',
    descriptionUz: "Quvnoq va sho'x yosh qizaloq sintetizatsiyalangan ovozi.",
    baseRate: 1.02,
    basePitch: 1.4,
    preferredGender: 'female',
  },
  {
    id: 'teenage_boy',
    family: 'TEENAGE_BOY',
    nameUz: "O'smir Yigit",
    nameEn: 'Teenage Boy',
    iconEmoji: '🧑‍🎓',
    descriptionUz: "G'ayratli va ochiq o'smir yigit nutq va ta'lim ovozi.",
    baseRate: 1.02,
    basePitch: 0.75,
    preferredGender: 'male',
  },
  {
    id: 'teenage_girl',
    family: 'TEENAGE_GIRL',
    nameUz: "O'smir Qiz",
    nameEn: 'Teenage Girl',
    iconEmoji: '👩‍🎓',
    descriptionUz: "Jo'shqin va yorqin o'smir qiz nutq va ta'lim ovozi.",
    baseRate: 1.04,
    basePitch: 1.15,
    preferredGender: 'female',
  },
];

export function getProfileById(id: string): CharacterProfile {
  return (
    CHARACTER_VOICE_CATALOG.find((p) => p.id === id || p.nameUz === id || p.nameEn === id) ||
    CHARACTER_VOICE_CATALOG[0]
  );
}
