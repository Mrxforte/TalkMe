import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Google Auth Provider configured for popups
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Initialize Cloud Firestore using the designated databaseId
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export type { User };

export class FirestorePermissionError extends Error {
  constructor(public originalError: unknown, public path?: string) {
    super(`Firestore permission denied at path: ${path || 'unknown'}. Ensure user is authenticated.`);
    this.name = 'FirestorePermissionError';
  }
}

/**
 * Standardized Firestore error handler providing contextual debugging output.
 */
export function handleFirestoreError(
  error: unknown,
  operationType: 'read' | 'write' | 'delete' | 'list',
  path?: string
): Error {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[Firestore ${operationType.toUpperCase()} Error] at ${path || 'document'}:`, error);

  if (message.includes('permission-denied') || message.includes('Missing or insufficient permissions')) {
    return new FirestorePermissionError(error, path);
  }

  return error instanceof Error ? error : new Error(`Firestore ${operationType} failed: ${message}`);
}

/**
 * Trigger Google OAuth popup sign in.
 */
export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

/**
 * Sign out current user.
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign-Out Error:', error);
    throw error;
  }
}
