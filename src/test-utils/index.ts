import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement } from 'react';

/**
 * 测试数据工厂
 * 用于生成标准化的测试数据
 */
export const mockFactories = {
  user: (overrides = {}) => ({
    id: 1,
    user_name: 'admin',
    ...overrides,
  }),

  article: (overrides = {}) => ({
    id: 1,
    title: 'Test Article',
    content: 'Test content',
    categoryId: 1,
    createTime: '2024-01-01',
    ...overrides,
  }),

  category: (overrides = {}) => ({
    id: 1,
    name: 'Tech',
    fatherId: null,
    level: 1,
    subCategory: [],
    ...overrides,
  }),
};

/**
 * API Mock响应工厂
 * 模拟标准API响应格式
 */
export const mockApiResponse = <T>(data: T, success = true, msg?: string) => ({
  success,
  data,
  msg,
});

/**
 * 创建测试用QueryClient
 * 配置为避免重试和缓存影响测试结果
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * 渲染包装器
 * 提供QueryClient上下文的渲染函数
 */
export function renderWithQueryClient(ui: ReactElement) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

/**
 * 等待待处理的异步操作
 * 用于处理异步状态更新
 */
export const waitFor = (callback: () => void, timeout = 1000) => {
  return new Promise<void>((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      try {
        callback();
        resolve();
      } catch (error) {
        if (Date.now() - startTime > timeout) {
          reject(error);
        } else {
          setTimeout(check, 10);
        }
      }
    };
    check();
  });
};
