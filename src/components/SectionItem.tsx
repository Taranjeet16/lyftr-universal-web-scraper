import { Section } from '@/types/scrape';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Image as ImageIcon, Link as LinkIcon, Type } from 'lucide-react';

interface SectionItemProps {
  section: Section;
}

export function SectionItem({ section }: SectionItemProps) {
  const { content, rawHtml } = section;
  const truncatedHtml = rawHtml ? (rawHtml.length > 500 ? rawHtml.slice(0, 500) + '...' : rawHtml) : null;

  return (
    <div className="space-y-4 py-2">
      {/* Text Content */}
      {content.text && (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Type className="h-4 w-4" />
            Text Content
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {content.text}
          </p>
        </div>
      )}

      {/* Headings */}
      {content.headings && content.headings.length > 0 && (
        <div className="space-y-1">
          <div className="text-sm font-medium text-muted-foreground">Headings</div>
          <ul className="space-y-1">
            {content.headings.map((heading, index) => (
              <li key={index} className="text-sm text-foreground">
                • {heading}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Links */}
      {content.links && content.links.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <LinkIcon className="h-4 w-4" />
            Links ({content.links.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {content.links.slice(0, 10).map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md hover:bg-accent transition-colors"
              >
                {link.text || link.href}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
            {content.links.length > 10 && (
              <Badge variant="outline">+{content.links.length - 10} more</Badge>
            )}
          </div>
        </div>
      )}

      {/* Images */}
      {content.images && content.images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ImageIcon className="h-4 w-4" />
            Images ({content.images.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {content.images.slice(0, 5).map((image, index) => (
              <a
                key={index}
                href={image.src}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md hover:bg-accent transition-colors truncate max-w-[200px]"
              >
                {image.alt || image.src}
              </a>
            ))}
            {content.images.length > 5 && (
              <Badge variant="outline">+{content.images.length - 5} more</Badge>
            )}
          </div>
        </div>
      )}

      {/* Raw HTML */}
      {truncatedHtml && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Raw HTML (truncated)</div>
          <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto max-h-32 overflow-y-auto">
            <code className="text-muted-foreground">{truncatedHtml}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
