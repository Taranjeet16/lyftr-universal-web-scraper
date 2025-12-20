import { useState, useEffect } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { LandingPage } from '@/components/LandingPage';
import { ScrapeForm } from '@/components/ScrapeForm';
import { SectionAccordion } from '@/components/SectionAccordion';
import { JsonViewer } from '@/components/JsonViewer';
import { ErrorBanner } from '@/components/ErrorBanner';
import { DownloadButton } from '@/components/DownloadButton';
import { DownloadTextButton } from '@/components/DownloadTextButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ScrapeHistory } from '@/components/ScrapeHistory';
import { ScrapeSkeleton } from '@/components/ScrapeSkeleton';
import { ApiUrlPrompt } from '@/components/ApiUrlPrompt';
import { useScrape } from '@/hooks/useScrape';
import { useScrapeHistory, HistoryItem } from '@/hooks/useScrapeHistory';
import { ScrapeResponse } from '@/types/scrape';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Code, Layers, History, ArrowLeft } from 'lucide-react';

type View = 'loading' | 'landing' | 'scraper';

const Index = () => {
  const [view, setView] = useState<View>('loading');
  const [showHistory, setShowHistory] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ScrapeResponse | null>(null);
  
  const { data, error, isLoading, scrape, reset } = useScrape();
  const { history, addToHistory, removeFromHistory, clearHistory } = useScrapeHistory();

  // When scrape succeeds, add to history
  useEffect(() => {
    if (data) {
      addToHistory(data);
      setSelectedResult(null); // Clear any previously selected history item
    }
  }, [data, addToHistory]);

  // Current result to display (either from scrape or from history selection)
  const currentResult = selectedResult || data;
  const hasResults = currentResult?.result;

  const handleHistorySelect = (item: HistoryItem) => {
    setSelectedResult(item.response);
    setShowHistory(false);
  };

  const handleNewScrape = () => {
    reset();
    setSelectedResult(null);
  };

  if (view === 'loading') {
    return <LoadingScreen onComplete={() => setView('landing')} />;
  }

  if (view === 'landing') {
    return <LandingPage onGetStarted={() => setView('scraper')} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setView('landing')}
                className="h-9 w-9"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Globe className="h-7 w-7 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Universal Scraper</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="gap-2"
              >
                <History className="h-4 w-4" />
                History
                {history.length > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                    {history.length}
                  </span>
                )}
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* History Panel */}
          {showHistory && (
            <div className="flex justify-center">
              <ScrapeHistory
                history={history}
                onSelect={handleHistorySelect}
                onRemove={removeFromHistory}
                onClear={clearHistory}
                onClose={() => setShowHistory(false)}
              />
            </div>
          )}

          {!showHistory && (
            <>
              {/* Intro Section */}
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold text-foreground">
                  Extract Structured Data
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Enter a URL to scrape and analyze its content. Get organized sections, 
                  metadata, links, images, and more in clean JSON format.
                </p>
              </div>

              {/* Scrape Form */}
              <div className="flex justify-center">
                <ScrapeForm onSubmit={scrape} isLoading={isLoading} />
              </div>

              {/* Loading Skeleton */}
              {isLoading && (
                <div className="flex justify-center">
                  <ScrapeSkeleton />
                </div>
              )}

              {/* Error / API URL Prompt */}
              {error && !isLoading && (
                <div className="flex justify-center">
                  {error.includes('API URL not configured') ? (
                    <ApiUrlPrompt />
                  ) : (
                    <ErrorBanner message={error} onDismiss={reset} />
                  )}
                </div>
              )}

              {/* Viewing History Item Notice */}
              {selectedResult && (
                <div className="flex justify-center">
                  <div className="bg-muted text-muted-foreground text-sm px-4 py-2 rounded-lg flex items-center gap-3">
                    <span>Viewing saved result</span>
                    <Button variant="outline" size="sm" onClick={handleNewScrape}>
                      Clear
                    </Button>
                  </div>
                </div>
              )}

              {/* Results */}
              {hasResults && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Layers className="h-5 w-5" />
                          Scrape Results
                        </CardTitle>
                        <CardDescription className="truncate max-w-md">
                          {currentResult.result.url} — {new Date(currentResult.result.scrapedAt).toLocaleString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <DownloadTextButton result={currentResult} />
                        <DownloadButton data={currentResult} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="sections" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="sections" className="gap-2">
                          <Layers className="h-4 w-4" />
                          Sections ({currentResult.result.sections?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="json" className="gap-2">
                          <Code className="h-4 w-4" />
                          Raw JSON
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="sections" className="mt-4">
                        <SectionAccordion sections={currentResult.result.sections || []} />
                      </TabsContent>
                      <TabsContent value="json" className="mt-4">
                        <JsonViewer data={currentResult} />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}

              {/* API Errors from Result */}
              {hasResults && currentResult.result.errors && currentResult.result.errors.length > 0 && (
                <Card className="border-destructive/50">
                  <CardHeader>
                    <CardTitle className="text-destructive">Scraping Warnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {currentResult.result.errors.map((err, index) => (
                        <li key={index} className="text-sm text-muted-foreground">• {err}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          Universal Scraper — Extract structured data from any website
        </div>
      </footer>
    </div>
  );
};

export default Index;
