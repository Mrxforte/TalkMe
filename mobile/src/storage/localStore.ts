import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Thin AsyncStorage wrapper replacing the web app's synchronous
 * `localStorage`/Dexie (IndexedDB) persistence. All reads are async,
 * so callers must hydrate state in an effect after first mount.
 */
export async function getItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    // Best-effort persistence; ignore storage failures.
  }
}

export async function getJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function setJson(key: string, value: unknown): Promise<void> {
  await setItem(key, JSON.stringify(value));
}
