import { useState, useMemo } from 'react';
import { HistoryItem } from '@/hooks/useScrapeHistory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, ExternalLink, Trash2, X, Search, Download } from 'lucide-react';

interface ScrapeHistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onClose: () => void;
}

function downloadJson(data: unknown, filename: string) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function ScrapeHistory({ history, onSelect, onRemove, onClear, onClose }: ScrapeHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    const query = searchQuery.toLowerCase();
    return history.filter((item) => 
      item.url.toLowerCase().includes(query) ||
      new Date(item.scrapedAt).toLocaleString().toLowerCase().includes(query)
    );
  }, [history, searchQuery]);

  if (history.length === 0) {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Scrape History
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-8">
            No scrape history yet. Results will appear here after your first scrape.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Scrape History
            </CardTitle>
            <CardDescription>{history.length} saved results</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClear}>
              Clear All
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by URL or date..."
            className="pl-9 h-9"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No results match "{searchQuery}"
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors gap-2"
                >
                  <button
                    onClick={() => onSelect(item)}
                    className="flex-1 text-left space-y-1 min-w-0"
                  >
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm font-medium truncate">
                        {item.url}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.scrapedAt).toLocaleString()}
                    </p>
                  </button>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        const hostname = new URL(item.url).hostname.replace('www.', '');
                        downloadJson(item.response, `scrape-${hostname}.json`);
                      }}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      title="Download JSON"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(item.id);
                      }}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
