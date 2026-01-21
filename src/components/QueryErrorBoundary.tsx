import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from 'antd';

interface QueryErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

function ErrorFallback({ error, resetErrorBoundary }: { error: unknown; resetErrorBoundary: () => void }) {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>出错了</h2>
      <pre>{error instanceof Error ? error.message : '应用遇到了一些问题'}</pre>
      <Button type="primary" onClick={resetErrorBoundary}>
        重试
      </Button>
    </div>
  );
}

export function QueryErrorBoundary({ children }: QueryErrorBoundaryProps) {
  return <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>;
}

export default QueryErrorBoundary;
