import { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JsonViewerProps {
  data: unknown;
}

interface JsonNodeProps {
  data: unknown;
  depth?: number;
  isLast?: boolean;
}

function JsonNode({ data, depth = 0, isLast = true }: JsonNodeProps) {
  const [isExpanded, setIsExpanded] = useState(depth < 2);

  if (data === null) return <span className="text-muted-foreground">null</span>;
  if (typeof data === 'boolean') return <span className="text-primary">{String(data)}</span>;
  if (typeof data === 'number') return <span className="text-primary">{data}</span>;
  if (typeof data === 'string') {
    const displayValue = data.length > 100 ? data.slice(0, 100) + '...' : data;
    return <span className="text-green-600 dark:text-green-400">"{displayValue}"</span>;
  }

  const isArray = Array.isArray(data);
  const entries = isArray ? data.map((v, i) => [i, v] as const) : Object.entries(data);
  const bracket = isArray ? ['[', ']'] : ['{', '}'];

  if (entries.length === 0) {
    return <span className="text-muted-foreground">{bracket[0]}{bracket[1]}</span>;
  }

  return (
    <span>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center hover:text-primary transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
        <span className="text-muted-foreground">{bracket[0]}</span>
        {!isExpanded && (
          <span className="text-muted-foreground ml-1">
            {entries.length} {isArray ? 'items' : 'keys'}
          </span>
        )}
      </button>
      {isExpanded && (
        <div className="ml-4 border-l border-border pl-2">
          {entries.map(([key, value], index) => (
            <div key={key} className="leading-relaxed">
              {!isArray && (
                <span className="text-blue-600 dark:text-blue-400">"{key}"</span>
              )}
              {!isArray && <span className="text-muted-foreground">: </span>}
              <JsonNode data={value} depth={depth + 1} isLast={index === entries.length - 1} />
              {index < entries.length - 1 && <span className="text-muted-foreground">,</span>}
            </div>
          ))}
        </div>
      )}
      {isExpanded && <span className="text-muted-foreground">{bracket[1]}</span>}
      {!isExpanded && <span className="text-muted-foreground">{bracket[1]}</span>}
      {!isLast && <span className="text-muted-foreground">,</span>}
    </span>
  );
}

export function JsonViewer({ data }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 gap-2">
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </Button>
      </div>
      <div className="bg-muted p-4 rounded-lg overflow-auto max-h-[500px] font-mono text-sm">
        <JsonNode data={data} />
      </div>
    </div>
  );
}
