const STORAGE_KEY = 'roomEditorState';
const EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

interface StorageItem<T> {
  value: T;
  expiration: number;
}

export function saveToStorage<T>(value: T): void {
  const item: StorageItem<T> = {
    value,
    expiration: Date.now() + EXPIRATION_TIME,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(item));
  localStorage.setItem(`${STORAGE_KEY}_lastSaved`, Date.now().toString());
}

export function getFromStorage<T>(): T | null {
  const itemStr = localStorage.getItem(STORAGE_KEY);
  if (!itemStr) return null;

  const item: StorageItem<T> = JSON.parse(itemStr);
  if (Date.now() > item.expiration) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }

  return item.value;
}

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(`${STORAGE_KEY}_lastSaved`);
}

export function isStorageExpired(): boolean {
  const itemStr = localStorage.getItem(STORAGE_KEY);
  if (!itemStr) return true;

  const item: StorageItem<any> = JSON.parse(itemStr);
  return Date.now() > item.expiration;
}

export function getLastSavedTime(): number | null {
  const lastSaved = localStorage.getItem(`${STORAGE_KEY}_lastSaved`);
  return lastSaved ? parseInt(lastSaved, 10) : null;
}