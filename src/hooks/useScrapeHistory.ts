import { useState, useEffect, useCallback } from 'react';
import { ScrapeResponse } from '@/types/scrape';

export interface HistoryItem {
  id: string;
  url: string;
  scrapedAt: string;
  response: ScrapeResponse;
}

const STORAGE_KEY = 'scrape-history';
const MAX_HISTORY_ITEMS = 20;

export function useScrapeHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load scrape history:', error);
    }
  }, []);

  // Save to localStorage whenever history changes
  const saveToStorage = useCallback((items: HistoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save scrape history:', error);
    }
  }, []);

  const addToHistory = useCallback((response: ScrapeResponse) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      url: response.result.url,
      scrapedAt: response.result.scrapedAt,
      response,
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}
