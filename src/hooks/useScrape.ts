import { useState, useCallback } from 'react';
import { scrapeUrl } from '@/api/scrape';
import { ScrapeResponse, ScrapeStatus } from '@/types/scrape';

interface UseScrapeReturn {
  data: ScrapeResponse | null;
  error: string | null;
  status: ScrapeStatus;
  isLoading: boolean;
  scrape: (url: string) => Promise<void>;
  reset: () => void;
}

export function useScrape(): UseScrapeReturn {
  const [data, setData] = useState<ScrapeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ScrapeStatus>('idle');

  const scrape = useCallback(async (url: string) => {
    setStatus('loading');
    setError(null);
    setData(null);

    try {
      const response = await scrapeUrl({ url });
      setData(response);
      setStatus('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setStatus('idle');
  }, []);

  return {
    data,
    error,
    status,
    isLoading: status === 'loading',
    scrape,
    reset,
  };
}
