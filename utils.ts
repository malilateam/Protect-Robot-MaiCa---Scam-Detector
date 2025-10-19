import { HistoryEntry } from './types';

const HISTORY_KEY = 'scam-detector-history';
const MAX_HISTORY_ITEMS = 5;

export const generateAnonymousUser = (): string => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `ผู้ใช้นิรนาม ${randomNumber}`;
};

export const getHistory = (): HistoryEntry[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error("Failed to parse history from localStorage", error);
    return [];
  }
};

export const addHistoryEntry = (newEntryData: Omit<HistoryEntry, 'id' | 'date' | 'user'>): HistoryEntry[] => {
  const currentHistory = getHistory();
  const newEntry: HistoryEntry = {
    ...newEntryData,
    id: new Date().toISOString() + Math.random(),
    date: new Date().toISOString(),
    user: generateAnonymousUser(),
  };

  const newHistory = [newEntry, ...currentHistory].slice(0, MAX_HISTORY_ITEMS);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Failed to save history to localStorage", error);
  }
  return newHistory;
};
