import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  onSnapshot,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError } from './firebase';

export interface FirestoreLearnedWord {
  wordId: string;
  word: string;
  translation: string;
  phonetic?: string;
  category?: string;
  status: 'not_started' | 'learning' | 'practiced' | 'learned' | 'needs_review';
  meaningfulInteractionsCount: number;
  correctExercisesCount: number;
  reps: number;
  nextReview: number;
  updatedAt: number;
}

export interface FirestoreMasteredRule {
  ruleId: string;
  titleUz: string;
  category?: string;
  status: 'not_started' | 'learning' | 'practiced' | 'learned';
  masteryScore: number;
  successfulExercisesCount: number;
  updatedAt: number;
}

export interface FirestoreUserProfile {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  xp: number;
  diamonds: number;
  streakDays: number;
  uniqueLearnedWordsCount: number;
  masteredGrammarRulesCount: number;
  updatedAt: number;
}

/**
 * Saves or updates user profile document in Firestore.
 */
export async function syncUserProfileToFirestore(
  userId: string,
  profile: Partial<FirestoreUserProfile>
): Promise<void> {
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(
      userRef,
      {
        uid: userId,
        ...profile,
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  } catch (error) {
    throw handleFirestoreError(error, 'write', path);
  }
}

/**
 * Fetches user profile from Firestore.
 */
export async function fetchUserProfileFromFirestore(
  userId: string
): Promise<FirestoreUserProfile | null> {
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as FirestoreUserProfile;
    }
    return null;
  } catch (error) {
    throw handleFirestoreError(error, 'read', path);
  }
}

/**
 * Persists a single learned word under users/{userId}/learned_words/{wordId}.
 */
export async function syncLearnedWordToFirestore(
  userId: string,
  wordData: FirestoreLearnedWord
): Promise<void> {
  const path = `users/${userId}/learned_words/${wordData.wordId}`;
  try {
    const wordRef = doc(db, 'users', userId, 'learned_words', wordData.wordId);
    await setDoc(
      wordRef,
      {
        ...wordData,
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  } catch (error) {
    throw handleFirestoreError(error, 'write', path);
  }
}

/**
 * Persists a batch of learned words to Firestore.
 */
export async function batchSyncLearnedWordsToFirestore(
  userId: string,
  words: FirestoreLearnedWord[]
): Promise<void> {
  if (words.length === 0) return;
  const path = `users/${userId}/learned_words`;
  try {
    const batch = writeBatch(db);
    words.forEach((w) => {
      const wordRef = doc(db, 'users', userId, 'learned_words', w.wordId);
      batch.set(
        wordRef,
        {
          ...w,
          updatedAt: Date.now(),
        },
        { merge: true }
      );
    });
    await batch.commit();
  } catch (error) {
    throw handleFirestoreError(error, 'write', path);
  }
}

/**
 * Fetches all learned words for a user.
 */
export async function fetchUserLearnedWordsFromFirestore(
  userId: string
): Promise<FirestoreLearnedWord[]> {
  const path = `users/${userId}/learned_words`;
  try {
    const wordsCol = collection(db, 'users', userId, 'learned_words');
    const snap = await getDocs(wordsCol);
    return snap.docs.map((d) => d.data() as FirestoreLearnedWord);
  } catch (error) {
    throw handleFirestoreError(error, 'list', path);
  }
}

/**
 * Subscribes to real-time changes in user's learned words.
 */
export function subscribeToUserLearnedWords(
  userId: string,
  onUpdate: (words: FirestoreLearnedWord[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const path = `users/${userId}/learned_words`;
  const wordsCol = collection(db, 'users', userId, 'learned_words');
  return onSnapshot(
    wordsCol,
    (snapshot) => {
      const words = snapshot.docs.map((d) => d.data() as FirestoreLearnedWord);
      onUpdate(words);
    },
    (err) => {
      const handled = handleFirestoreError(err, 'read', path);
      if (onError) onError(handled);
    }
  );
}

/**
 * Persists a single mastered grammar rule under users/{userId}/mastered_rules/{ruleId}.
 */
export async function syncMasteredRuleToFirestore(
  userId: string,
  ruleData: FirestoreMasteredRule
): Promise<void> {
  const path = `users/${userId}/mastered_rules/${ruleData.ruleId}`;
  try {
    const ruleRef = doc(db, 'users', userId, 'mastered_rules', ruleData.ruleId);
    await setDoc(
      ruleRef,
      {
        ...ruleData,
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  } catch (error) {
    throw handleFirestoreError(error, 'write', path);
  }
}

/**
 * Fetches all mastered grammar rules for a user.
 */
export async function fetchUserMasteredRulesFromFirestore(
  userId: string
): Promise<FirestoreMasteredRule[]> {
  const path = `users/${userId}/mastered_rules`;
  try {
    const rulesCol = collection(db, 'users', userId, 'mastered_rules');
    const snap = await getDocs(rulesCol);
    return snap.docs.map((d) => d.data() as FirestoreMasteredRule);
  } catch (error) {
    throw handleFirestoreError(error, 'list', path);
  }
}

/**
 * Subscribes to real-time changes in user's mastered grammar rules.
 */
export function subscribeToUserMasteredRules(
  userId: string,
  onUpdate: (rules: FirestoreMasteredRule[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const path = `users/${userId}/mastered_rules`;
  const rulesCol = collection(db, 'users', userId, 'mastered_rules');
  return onSnapshot(
    rulesCol,
    (snapshot) => {
      const rules = snapshot.docs.map((d) => d.data() as FirestoreMasteredRule);
      onUpdate(rules);
    },
    (err) => {
      const handled = handleFirestoreError(err, 'read', path);
      if (onError) onError(handled);
    }
  );
}
