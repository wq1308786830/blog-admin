import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { queryClient } from '@/lib/query-client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ error, resetErrorBoundary }) => (
              <div style={{ padding: '50px', textAlign: 'center' }}>
                <div>
                  <h2>出错了</h2>
                  <pre>{error instanceof Error ? error.message : '应用遇到了一些问题'}</pre>
                  <button
                    onClick={() => resetErrorBoundary()}
                    style={{
                      padding: '8px 16px',
                      background: '#00b96b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginTop: '16px',
                    }}
                  >
                    重试
                  </button>
                </div>
              </div>
            )}
          >
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: '#00b96b',
                },
              }}
            >
              <App />
            </ConfigProvider>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
