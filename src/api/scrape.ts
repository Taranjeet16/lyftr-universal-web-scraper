import { ScrapeRequest, ScrapeResponse } from '@/types/scrape';

const STORAGE_KEY = 'api_base_url';

export function getApiBaseUrl(): string {
  const envUrl = (import.meta.env.VITE_API_URL as string | undefined) || '';
  if (envUrl) return envUrl.replace(/\/$/, '');

  try {
    const stored = localStorage.getItem(STORAGE_KEY) || '';
    return stored.replace(/\/$/, '');
  } catch {
    return '';
  }
}

export function setApiBaseUrl(url: string) {
  try {
    localStorage.setItem(STORAGE_KEY, url.replace(/\/$/, ''));
  } catch {
    // ignore
  }
}

export async function scrapeUrl(request: ScrapeRequest): Promise<ScrapeResponse> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error('API URL not configured. Please set VITE_API_URL environment variable.');
  }

  const response = await fetch(`${baseUrl}/scrape`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Scrape failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response format');
  }

  return data as ScrapeResponse;
}

