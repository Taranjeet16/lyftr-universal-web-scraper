import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';

interface ScrapeFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

function isValidUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

export function ScrapeForm({ onSubmit, isLoading }: ScrapeFormProps) {
  const [url, setUrl] = useState('');
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isEmpty = url.trim() === '';
  const isValid = isValidUrl(url.trim());
  const showError = touched && !isEmpty && !isValid;
  const isDisabled = isEmpty || !isValid || isLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDisabled) {
      onSubmit(url.trim());
    }
  };

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isDisabled) {
        e.preventDefault();
        onSubmit(url.trim());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [url, isDisabled, onSubmit]);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-3">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="https://example.com"
            className="h-12 text-base pr-24"
            disabled={isLoading}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hidden md:block">
            {isLoading ? '' : '⌘/Ctrl+Enter'}
          </span>
        </div>
        <Button 
          type="submit" 
          disabled={isDisabled}
          className="h-12 px-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scraping...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Scrape
            </>
          )}
        </Button>
      </div>
      {showError && (
        <p className="text-sm text-destructive">
          URL must start with http:// or https://
        </p>
      )}
    </form>
  );
}
