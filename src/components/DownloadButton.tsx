import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DownloadButtonProps {
  data: unknown;
  filename?: string;
}

export function DownloadButton({ data, filename = 'scrape-result.json' }: DownloadButtonProps) {
  const handleDownload = () => {
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
  };

  return (
    <Button onClick={handleDownload} variant="outline" className="gap-2">
      <Download className="h-4 w-4" />
      Download JSON
    </Button>
  );
}
