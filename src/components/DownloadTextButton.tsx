import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrapeResponse } from '@/types/scrape';

interface DownloadTextButtonProps {
  result: ScrapeResponse;
}

function buildText(result: ScrapeResponse) {
  const { url, scrapedAt, sections } = result.result;
  const lines: string[] = [];

  lines.push(`URL: ${url}`);
  lines.push(`Scraped At: ${scrapedAt}`);
  lines.push('');

  (sections || []).forEach((s, idx) => {
    lines.push(`== Section ${idx + 1}: ${s.label || 'Untitled'} [${s.type}] ==`);
    if (s.content?.headings?.length) {
      lines.push('Headings:');
      s.content.headings.forEach((h) => lines.push(`- ${h}`));
      lines.push('');
    }

    if (s.content?.text) {
      lines.push('Text:');
      lines.push(s.content.text);
      lines.push('');
    }

    if (s.content?.links?.length) {
      lines.push('Links:');
      s.content.links.forEach((l) => lines.push(`- ${l.text || l.href}: ${l.href}`));
      lines.push('');
    }

    if (s.content?.images?.length) {
      lines.push('Images:');
      s.content.images.forEach((img) => lines.push(`- ${img.alt || img.src}: ${img.src}`));
      lines.push('');
    }

    lines.push('');
  });

  return lines.join('\n');
}

export function DownloadTextButton({ result }: DownloadTextButtonProps) {
  const handleDownload = () => {
    const text = buildText(result);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const hostname = (() => {
      try {
        return new URL(result.result.url).hostname.replace('www.', '');
      } catch {
        return 'result';
      }
    })();

    const link = document.createElement('a');
    link.href = url;
    link.download = `scrape-${hostname}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleDownload} variant="outline" className="gap-2">
      <Download className="h-4 w-4" />
      Download Text
    </Button>
  );
}
