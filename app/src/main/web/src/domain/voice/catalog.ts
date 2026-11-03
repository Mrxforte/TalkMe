import { CharacterProfile } from '../../types';

export const CHARACTER_VOICE_CATALOG: CharacterProfile[] = [
  {
    id: 'adult_male',
    family: 'ADULT_MALE',
    nameUz: 'Katta Yoshli Erkak',
    nameEn: 'Adult Male (Charon)',
    iconEmoji: '👨',
    descriptionUz:
      'Gemini 3.8 Charon: Haqiqiy chuqur, salmoqli va ravshan katta yoshli erkak ustoz ovozi.',
    baseRate: 0.88,
    basePitch: 0.88,
    preferredGender: 'male',
    geminiVoiceName: 'Charon',
    geminiStylePrompt:
      'Warm, resonant, articulate adult male English teacher with clear pronunciation and natural conversational cadence',
  },
  {
    id: 'adult_female',
    family: 'ADULT_FEMALE',
    nameUz: 'Katta Yoshli Ayol',
    nameEn: 'Adult Female (Kore)',
    iconEmoji: '👩',
    descriptionUz:
      'Gemini 3.8 Kore: Mayin, ravshan va tabiiy intonatsiyali ayol ustoz ovozi.',
    baseRate: 0.92,
    basePitch: 1.0,
    preferredGender: 'female',
    geminiVoiceName: 'Kore',
    geminiStylePrompt:
      'Friendly, warm, crystal-clear adult female English tutor with encouraging, natural intonation',
  },
  {
    id: 'young_boy',
    family: 'YOUNG_BOY',
    nameUz: "Yosh O'g'il Bola",
    nameEn: 'Young Boy (Puck)',
    iconEmoji: '👦',
    descriptionUz:
      "Gemini 3.8 Puck: Qiziquvchan, jonli va tabiiy yosh o'g'il bola ovozi.",
    baseRate: 1.0,
    basePitch: 1.3,
    preferredGender: 'male',
    geminiVoiceName: 'Puck',
    geminiStylePrompt:
      'Bright, curious, energetic young boy voice with lively, friendly pronunciation',
  },
  {
    id: 'young_girl',
    family: 'YOUNG_GIRL',
    nameUz: 'Yosh Qiz Bola',
    nameEn: 'Young Girl (Zephyr)',
    iconEmoji: '👧',
    descriptionUz:
      "Gemini 3.8 Zephyr: Quvnoq, ifodali va sho'x yosh qizaloq ovozi.",
    baseRate: 1.02,
    basePitch: 1.4,
    preferredGender: 'female',
    geminiVoiceName: 'Zephyr',
    geminiStylePrompt:
      'Cheerful, expressive, clear young girl voice with upbeat, natural storytelling rhythm',
  },
  {
    id: 'teenage_boy',
    family: 'TEENAGE_BOY',
    nameUz: "O'smir Yigit",
    nameEn: 'Teenage Boy (Fenrir)',
    iconEmoji: '🧑‍🎓',
    descriptionUz:
      "Gemini 3.8 Fenrir: G'ayratli va zamonaviy talaffuzga ega o'smir yigit ovozi.",
    baseRate: 1.02,
    basePitch: 0.75,
    preferredGender: 'male',
    geminiVoiceName: 'Fenrir',
    geminiStylePrompt:
      'Confident, enthusiastic teenage student voice with modern, clear American English articulation',
  },
  {
    id: 'teenage_girl',
    family: 'TEENAGE_GIRL',
    nameUz: "O'smir Qiz",
    nameEn: 'Teenage Girl (Zephyr+)',
    iconEmoji: '👩‍🎓',
    descriptionUz:
      "Gemini 3.8 Zephyr: Jo'shqin, yorqin va tabiiy suhbatdosh o'smir qiz ovozi.",
    baseRate: 1.04,
    basePitch: 1.15,
    preferredGender: 'female',
    geminiVoiceName: 'Zephyr',
    geminiStylePrompt:
      'Vibrant, articulate, friendly teenage girl voice with natural conversational prosody',
  },
];

export function getProfileById(id: string): CharacterProfile {
  return (
    CHARACTER_VOICE_CATALOG.find(
      (p) => p.id === id || p.nameUz === id || p.nameEn === id
    ) || CHARACTER_VOICE_CATALOG[0]
  );
}
