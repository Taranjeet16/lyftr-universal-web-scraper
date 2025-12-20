import { Button } from '@/components/ui/button';
import { Globe, Zap, Code, Download } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: Globe,
      title: 'Any Website',
      description: 'Extract structured data from any publicly accessible URL',
    },
    {
      icon: Zap,
      title: 'Fast & Reliable',
      description: 'Optimized scraping engine delivers results in seconds',
    },
    {
      icon: Code,
      title: 'Structured JSON',
      description: 'Get organized sections, metadata, links, and images',
    },
    {
      icon: Download,
      title: 'Export Ready',
      description: 'Download results as JSON for further processing',
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Main Heading */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                <Globe className="h-16 w-16" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight">
              Universal Scraper
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Extract structured data from any website with a single click. 
              Get organized sections, metadata, links, images, and more in clean JSON format.
            </p>
          </div>

          {/* CTA Button */}
          <div>
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="h-14 px-10 text-lg"
            >
              Start Scraping
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
            {features.map((feature) => (
              <div 
                key={feature.title}
                className="flex flex-col items-center text-center space-y-2 p-4"
              >
                <div className="p-3 rounded-lg bg-muted">
                  <feature.icon className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="font-medium text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          Universal Scraper — Extract structured data from any website
        </div>
      </footer>
    </div>
  );
}
