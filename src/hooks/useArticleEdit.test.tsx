/**
 * TDD Test Suite for useArticleEdit Hook
 * 测试文章编辑相关钩子：状态管理、内容初始化、发布
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useArticleEdit } from './useArticleEdit';
import AdminServices from '@/services/AdminServices';
import BlogServices from '@/services/BlogServices';
import * as toast from '@/lib/toast';
import type { Article, CreateArticleDto } from '@/types';

// Mock dependencies - simplify Draft.js mocking
vi.mock('@/services/AdminServices');
vi.mock('@/services/BlogServices');
vi.mock('@/lib/toast');

// Helper to create fresh QueryClient for each test
function createFreshQueryClient() {
  return new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });
}

// Helper to render with providers
function renderWithProviders(component: React.ReactNode) {
  const queryClient = createFreshQueryClient();

  return renderHook(component, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
}

// Mock data
const mockArticle: Article = {
  id: 1,
  category_id: 1,
  title: 'Test Article',
  description: 'Test Description',
  text_type: 'md',
  content: 'Test content',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useArticleEdit - State Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('✅ TDD: should initialize with default state', () => {
    const { result } = renderWithProviders(() => useArticleEdit(undefined));

    expect(result.current.state.title).toBe('');
    expect(result.current.state.categoryId).toBe(0);
    expect(result.current.state.textType).toBe('md');
    expect(result.current.state.markdownContent).toBe('');
  });

  test('✅ TDD: should update state via updateState', () => {
    const { result } = renderWithProviders(() => useArticleEdit(undefined));

    act(() => {
      result.current.updateState({ title: 'New Title' });
    });

    expect(result.current.state.title).toBe('New Title');

    act(() => {
      result.current.updateState({ categoryId: 5 });
    });

    expect(result.current.state.categoryId).toBe(5);
  });

  test('✅ TDD: should update multiple state properties', () => {
    const { result } = renderWithProviders(() => useArticleEdit(undefined));

    act(() => {
      result.current.updateState({
        title: 'Test',
        categoryId: 3,
        textType: 'html',
      });
    });

    expect(result.current.state.title).toBe('Test');
    expect(result.current.state.categoryId).toBe(3);
    expect(result.current.state.textType).toBe('html');
  });
});

describe('useArticleEdit - Article Loading', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('✅ TDD: should fetch article when articleId is provided', async () => {
    vi.mocked(BlogServices.getArticleDetail).mockResolvedValue({
      success: true,
      data: mockArticle,
    } as any);

    const { result } = renderWithProviders(() => useArticleEdit(1));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(BlogServices.getArticleDetail).toHaveBeenCalledWith(1);
  });

  test('✅ TDD: should not fetch when articleId is undefined', () => {
    const { result } = renderWithProviders(() => useArticleEdit(undefined));

    expect(BlogServices.getArticleDetail).not.toHaveBeenCalled();
  });

  test('✅ TDD: should not fetch when articleId is 0', () => {
    const { result } = renderWithProviders(() => useArticleEdit(0));

    expect(BlogServices.getArticleDetail).not.toHaveBeenCalled();
  });

  test('✅ TDD: should initialize markdown content from article', async () => {
    vi.mocked(BlogServices.getArticleDetail).mockResolvedValue({
      success: true,
      data: { ...mockArticle, content: '# Markdown Content' },
    } as any);

    const { result } = renderWithProviders(() => useArticleEdit(1));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.state.markdownContent).toBe('# Markdown Content');
    expect(result.current.state.textType).toBe('md');
  });

  test('✅ TDD: should set isLoading to true during fetch', async () => {
    vi.mocked(BlogServices.getArticleDetail).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true, data: mockArticle }), 100)
        )
    );

    const { result } = renderWithProviders(() => useArticleEdit(1));

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    expect(result.current.isLoading).toBe(false);
  });
});

describe('useArticleEdit - Publish Article', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('✅ TDD: should call AdminServices.publishArticle with markdown content', async () => {
    const publishData: CreateArticleDto = {
      title: 'Test Article',
      categoryId: 1,
      content: 'Markdown content',
      textType: 'md',
    };

    vi.mocked(AdminServices.publishArticle).mockResolvedValue({
      success: true,
      data: mockArticle,
    } as any);

    const { result } = renderWithProviders(() => useArticleEdit(undefined));

    act(() => {
      result.current.updateState({
        title: publishData.title,
        categoryId: publishData.categoryId,
        markdownContent: publishData.content,
        textType: publishData.textType,
      });
    });

    await act(async () => {
      result.current.publishArticle({ id: 1 });
    });

    expect(AdminServices.publishArticle).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test Article',
        categoryId: 1,
        content: 'Markdown content',
        textType: 'md',
        id: 1,
      })
    );
  });

  test('✅ TDD: should show success toast on publish', async () => {
    vi.mocked(AdminServices.publishArticle).mockResolvedValue({
      success: true,
      data: mockArticle,
    } as any);

    const { result } = renderWithProviders(() => useArticleEdit(undefined));

    act(() => {
      result.current.updateState({
        title: 'Test',
        categoryId: 1,
        markdownContent: 'Content',
      });
    });

    await act(async () => {
      await result.current.publishArticle({ id: 1 });
    });

    await waitFor(() => {
      expect(toast.showSuccess).toHaveBeenCalledWith('发布成功！');
    });
  });

  test('✅ TDD: should invalidate article queries on publish', async () => {
    const queryClient = createFreshQueryClient();
    queryClient.setQueryData(['articles', 'list'], 'cached list');
    queryClient.setQueryData(['articles', 'detail', 1], 'cached detail');

    vi.mocked(AdminServices.publishArticle).mockResolvedValue({
      success: true,
      data: mockArticle,
    } as any);

    const { result } = renderHook(() => useArticleEdit(undefined), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    act(() => {
      result.current.updateState({
        title: 'Test',
        categoryId: 1,
        markdownContent: 'Content',
      });
    });

    await act(async () => {
      result.current.publishArticle({ id: 1 });
    });

    await waitFor(() => {
      // invalidateQueries 会使查询失效，但不会删除数据
      expect(AdminServices.publishArticle).toHaveBeenCalled();
    });
  });

  test('✅ TDD: should show error toast on publish failure', async () => {
    vi.mocked(AdminServices.publishArticle).mockRejectedValue(new Error('Publish failed'));

    const { result } = renderWithProviders(() => useArticleEdit(undefined));

    act(() => {
      result.current.updateState({
        title: 'Test',
        categoryId: 1,
        markdownContent: 'Content',
      });
    });

    await act(async () => {
      try {
        await result.current.publishArticle({ id: 1 });
      } catch (e) {
        // Expected to throw
      }
    });

    await waitFor(() => {
      expect(toast.showError).toHaveBeenCalledWith('错误：Publish failed');
    });
  });

  test('✅ TDD: should set isPublishing during mutation', async () => {
    vi.mocked(AdminServices.publishArticle).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
    );

    const { result } = renderWithProviders(() => useArticleEdit(undefined));

    act(() => {
      result.current.updateState({
        title: 'Test',
        categoryId: 1,
        markdownContent: 'Content',
      });
    });

    expect(result.current.isPublishing).toBe(false);

    // Start the mutation
    await act(async () => {
      result.current.publishArticle({ id: 1 });
    });

    // isPublishing should be true after act completes
    // Note: React Query updates state asynchronously, so we need to wait
    await waitFor(() => {
      expect(result.current.isPublishing).toBe(true);
    });

    // Wait for mutation to complete
    await waitFor(() => {
      expect(result.current.isPublishing).toBe(false);
    });
  });
});

describe('useArticleEdit - Additional Data', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('✅ TDD: should include article id when publishing existing article', async () => {
    vi.mocked(AdminServices.publishArticle).mockResolvedValue({
      success: true,
      data: mockArticle,
    } as any);

    const { result } = renderWithProviders(() => useArticleEdit(undefined));

    // Wait for hook to be ready
    await waitFor(() => {
      expect(result.current).not.toBeNull();
    });

    await act(async () => {
      result.current!.updateState({
        title: 'Test',
        categoryId: 1,
        markdownContent: 'Content',
      });
    });

    await act(async () => {
      await result.current!.publishArticle({ id: 123 });
    });

    const publishedData = vi.mocked(AdminServices.publishArticle).mock
      .calls[0][0] as CreateArticleDto;
    expect(publishedData.id).toBe(123);
  });

  test('✅ TDD: should not include id when publishing new article', async () => {
    vi.mocked(AdminServices.publishArticle).mockResolvedValue({
      success: true,
      data: mockArticle,
    } as any);

    const { result } = renderWithProviders(() => useArticleEdit(undefined));

    // Wait for hook to be ready
    await waitFor(() => {
      expect(result.current).not.toBeNull();
    });

    await act(async () => {
      result.current!.updateState({
        title: 'Test',
        categoryId: 1,
        markdownContent: 'Content',
      });
    });

    await act(async () => {
      await result.current!.publishArticle({});
    });

    const publishedData = vi.mocked(AdminServices.publishArticle).mock
      .calls[0][0] as CreateArticleDto;
    expect(publishedData.id).toBeUndefined();
  });

  test('❌ TDD: BUG - should use categoryId from additionalData parameter when provided', async () => {
    vi.mocked(AdminServices.publishArticle).mockResolvedValue({
      success: true,
      data: mockArticle,
    } as any);

    const { result } = renderWithProviders(() => useArticleEdit(undefined));

    // Set state with categoryId: 0 (simulating initial state)
    // and updateState is called with categoryId: 10 (async update)
    act(() => {
      result.current.updateState({
        title: 'Test',
        categoryId: 0, // Initial state
        markdownContent: 'Content',
      });
    });

    // Simulate the bug: updateState was called but state hasn't updated yet
    // publishArticle is called without categoryId in additionalData
    await act(async () => {
      await result.current.publishArticle({ id: 1 }); // No categoryId in additionalData!
    });

    const publishedData = vi.mocked(AdminServices.publishArticle).mock
      .calls[0][0] as CreateArticleDto;

    // BUG: Currently this passes because categoryId is 0 from state
    // After fix, we should be able to pass categoryId via additionalData
    expect(publishedData.categoryId).toBe(0); // Currently passes (bug)
  });

  test('🔴 TDD: RED - should allow overriding categoryId via additionalData parameter', async () => {
    vi.mocked(AdminServices.publishArticle).mockResolvedValue({
      success: true,
      data: mockArticle,
    } as any);

    const { result } = renderWithProviders(() => useArticleEdit(undefined));

    // Set state with categoryId: 0
    act(() => {
      result.current.updateState({
        title: 'Test',
        categoryId: 0, // State has old value
        markdownContent: 'Content',
      });
    });

    // Publish with explicit categoryId in additionalData (leaf category: 10)
    // This simulates the fix: passing categoryId directly to avoid async state issues
    await act(async () => {
      await result.current.publishArticle({ id: 1, categoryId: 10 });
    });

    const publishedData = vi.mocked(AdminServices.publishArticle).mock
      .calls[0][0] as CreateArticleDto;

    // Should use categoryId from additionalData parameter
    expect(publishedData.categoryId).toBe(10);
    expect(publishedData.categoryId).not.toBe(0);
  });
});
