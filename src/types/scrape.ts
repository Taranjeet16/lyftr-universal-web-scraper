export interface ScrapeRequest {
  url: string;
}

export interface SectionContent {
  text?: string;
  headings?: string[];
  links?: Array<{ href: string; text: string }>;
  images?: Array<{ src: string; alt?: string }>;
}

export interface Section {
  label: string;
  type: string;
  content: SectionContent;
  rawHtml?: string;
}

export interface ScrapeMeta {
  title?: string;
  description?: string;
  [key: string]: unknown;
}

export interface ScrapeInteractions {
  [key: string]: unknown;
}

export interface ScrapeResult {
  url: string;
  scrapedAt: string;
  meta: ScrapeMeta;
  sections: Section[];
  interactions: ScrapeInteractions;
  errors: string[];
}

export interface ScrapeResponse {
  result: ScrapeResult;
}

export type ScrapeStatus = 'idle' | 'loading' | 'success' | 'error';
