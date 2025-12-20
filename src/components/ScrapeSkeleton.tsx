import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ScrapeSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <Skeleton className="h-9 w-full" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[92%]" />
        <Skeleton className="h-4 w-[85%]" />
        <Skeleton className="h-4 w-[78%]" />
        <Skeleton className="h-4 w-[90%]" />
      </CardContent>
    </Card>
  );
}
