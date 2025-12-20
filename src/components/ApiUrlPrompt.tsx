import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { getApiBaseUrl, setApiBaseUrl } from '@/api/scrape';

function isValidBaseUrl(url: string) {
  return url.startsWith('http://') || url.startsWith('https://');
}

export function ApiUrlPrompt() {
  const current = useMemo(() => getApiBaseUrl(), []);
  const [value, setValue] = useState(current);
  const [touched, setTouched] = useState(false);

  const trimmed = value.trim().replace(/\/$/, '');
  const isEmpty = trimmed.length === 0;
  const isValid = !isEmpty && isValidBaseUrl(trimmed);
  const showError = touched && !isEmpty && !isValid;

  useEffect(() => {
    // keep in sync if the module had a value already
    setValue(current);
  }, [current]);

  const handleSave = () => {
    setTouched(true);
    if (!isValid) return;

    setApiBaseUrl(trimmed);
    toast({
      title: 'API URL saved',
      description: 'You can now retry scraping.',
    });
  };

  return (
    <Card className="w-full max-w-2xl border-destructive/50">
      <CardHeader>
        <CardTitle>Backend API URL required</CardTitle>
        <CardDescription>
          Set your backend base URL (example: https://api.yoursite.com). This is saved locally in your browser.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-3">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="https://your-api.com"
            className="h-11"
          />
          <Button onClick={handleSave} disabled={!isValid} className="h-11">
            Save
          </Button>
        </div>
        {showError && (
          <p className="text-sm text-destructive">Must start with http:// or https://</p>
        )}
        <p className="text-xs text-muted-foreground">
          Tip: after updating env secrets, you may need to refresh the preview.
        </p>
      </CardContent>
    </Card>
  );
}
