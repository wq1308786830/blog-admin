/**
 * TDD Test Suite for useArticleList Hook
 * 测试文章列表相关钩子：useArticleList, useArticleActions, useArticle, usePrefetchArticle
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useArticleList,
  useArticleActions,
  useArticle,
  usePrefetchArticle,
} from './useArticleList';
import AdminServices from '@/services/AdminServices';
import * as toast from '@/lib/toast';
import type { Article, ArticleFilters, CreateArticleDto } from '@/types';

// Mock dependencies
vi.mock('@/services/AdminServices');
vi.mock('@/lib/toast');

// Helper to render with providers
function renderWithProviders(component: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });

  return renderHook(component, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
}

// Mock data
const mockArticles: Article[] = [
  { id: 1, category_id: 1, title: 'Article 1', description: 'Desc 1', text_type: 'md' },
  { id: 2, category_id: 2, title: 'Article 2', description: 'Desc 2', text_type: 'md' },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useArticleList - Infinite Query', () => {
  test('✅ TDD: should fetch articles on mount', async () => {
    const filters: ArticleFilters = { categoryId: '', dateRange: [], text: '' };

    vi.mocked(AdminServices.getArticles).mockResolvedValue({
      success: true,
      data: mockArticles,
    } as any);

    const { result } = renderWithProviders(() => useArticleList(filters));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(AdminServices.getArticles).toHaveBeenCalledWith(filters, 0);
  });

  test('✅ TDD: should handle API error', async () => {
    const filters: ArticleFilters = { categoryId: '', dateRange: [], text: '' };

    vi.mocked(AdminServices.getArticles).mockResolvedValue({
      success: false,
      msg: 'Error fetching articles',
    } as any);

    const { result } = renderWithProviders(() => useArticleList(filters));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  test('✅ TDD: should call fetchNextPage for pagination', async () => {
    const filters: ArticleFilters = { categoryId: '', dateRange: [], text: '' };

    vi.mocked(AdminServices.getArticles).mockResolvedValue({
      success: true,
      data: mockArticles,
    } as any);

    const { result } = renderWithProviders(() => useArticleList(filters));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    await act(async () => {
      await result.current.fetchNextPage();
    });

    expect(AdminServices.getArticles).toHaveBeenCalledWith(filters, 1);
  });

  test('✅ TDD: should determine hasNextPage correctly', async () => {
    const filters: ArticleFilters = { categoryId: '', dateRange: [], text: '' };

    vi.mocked(AdminServices.getArticles).mockResolvedValue({
      success: true,
      data: [],
    } as any);

    const { result } = renderWithProviders(() => useArticleList(filters));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.hasNextPage).toBe(false);
  });
});
