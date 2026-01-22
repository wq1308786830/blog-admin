import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';

interface QueryErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

function ErrorFallback({ error, resetErrorBoundary }: { error: unknown; resetErrorBoundary: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-[50px] text-center">
      <h2 className="text-2xl font-semibold mb-4">出错了</h2>
      <pre className="text-muted-foreground mb-4">{error instanceof Error ? error.message : '应用遇到了一些问题'}</pre>
      <Button onClick={resetErrorBoundary}>
        重试
      </Button>
    </div>
  );
}

export function QueryErrorBoundary({ children }: QueryErrorBoundaryProps) {
  return <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>;
}

export default QueryErrorBoundary;
