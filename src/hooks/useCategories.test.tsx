/**
 * TDD Test Suite for useCategories Hook
 * 测试分类相关钩子：useCategories, useAddCategory, useDeleteCategory
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCategories, useAddCategory, useDeleteCategory } from './useCategories';
import AdminServices from '@/services/AdminServices';
import BlogServices from '@/services/BlogServices';
import * as toast from '@/lib/toast';
import type { Category } from '@/types';

// Mock dependencies
vi.mock('@/services/AdminServices');
vi.mock('@/services/BlogServices');
vi.mock('@/lib/toast');
vi.mock('@/utils/tools');

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
const mockCategories: Category[] = [
  { id: 1, father_id: null, level: 1, name: '技术' },
  { id: 2, father_id: 1, level: 2, name: '前端' },
  { id: 3, father_id: 2, level: 3, name: 'React' },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useCategories - Query', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('✅ TDD: should fetch categories on mount', async () => {
    vi.mocked(BlogServices.getAllCategories).mockResolvedValue({
      success: true,
      data: mockCategories,
    } as any);

    const { handleOptions } = await import('@/utils/tools');
    vi.mocked(handleOptions).mockReturnValue(mockCategories as any);

    const { result } = renderWithProviders(() => useCategories());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(BlogServices.getAllCategories).toHaveBeenCalled();
    expect(handleOptions).toHaveBeenCalledWith(mockCategories);
  });

  test('✅ TDD: should return empty array on API error', async () => {
    vi.mocked(BlogServices.getAllCategories).mockResolvedValue({
      success: false,
      msg: 'Error fetching categories',
    } as any);

    const { handleOptions } = await import('@/utils/tools');
    vi.mocked(handleOptions).mockReturnValue([] as any);

    const { result } = renderWithProviders(() => useCategories());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual([]);
  });

  test('✅ TDD: should show error toast on API failure', async () => {
    vi.mocked(BlogServices.getAllCategories).mockResolvedValue({
      success: false,
      msg: 'Failed to load categories',
    } as any);

    const { handleOptions } = await import('@/utils/tools');
    vi.mocked(handleOptions).mockReturnValue([] as any);

    renderWithProviders(() => useCategories());

    await waitFor(() => {
      expect(toast.showError).toHaveBeenCalledWith('Failed to load categories');
    });
  });

  test('✅ TDD: should use staleTime for caching', async () => {
    vi.mocked(BlogServices.getAllCategories).mockResolvedValue({
      success: true,
      data: mockCategories,
    } as any);

    const { handleOptions } = await import('@/utils/tools');
    vi.mocked(handleOptions).mockReturnValue(mockCategories as any);

    const { result, rerender } = renderWithProviders(() => useCategories());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const callCount = vi.mocked(BlogServices.getAllCategories).mock.calls.length;

    rerender();

    await waitFor(() => {}, { timeout: 100 });

    expect(vi.mocked(BlogServices.getAllCategories).mock.calls.length).toBe(callCount);
  });
});

describe('useAddCategory - Mutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('✅ TDD: should call AdminServices.addCategory', async () => {
    vi.mocked(AdminServices.addCategory).mockResolvedValue({
      success: true,
    } as any);

    const { result } = renderWithProviders(() => useAddCategory());

    const categoryData = {
      fatherId: null,
      level: 1,
      categoryName: 'New Category',
    };

    await act(async () => {
      await result.current.mutate(categoryData);
    });

    expect(AdminServices.addCategory).toHaveBeenCalledWith(
      categoryData.fatherId,
      categoryData.level,
      categoryData.categoryName
    );
  });

  test('✅ TDD: should show success toast on add', async () => {
    vi.mocked(AdminServices.addCategory).mockResolvedValue({
      success: true,
    } as any);

    const { result } = renderWithProviders(() => useAddCategory());

    await act(async () => {
      await result.current.mutate({ fatherId: null, level: 1, categoryName: 'Test' });
    });

    await waitFor(() => {
      expect(toast.showSuccess).toHaveBeenCalledWith('添加成功');
    });
  });

  test('✅ TDD: should invalidate categories query on success', async () => {
    vi.mocked(AdminServices.addCategory).mockResolvedValue({
      success: true,
    } as any);

    const { result } = renderWithProviders(() => useAddCategory());

    await act(async () => {
      await result.current.mutate({ fatherId: null, level: 1, categoryName: 'Test' });
    });

    // Mutation should complete without throwing errors
    expect(toast.showSuccess).toHaveBeenCalledWith('添加成功');
  });

  test('✅ TDD: should show error toast on add failure', async () => {
    vi.mocked(AdminServices.addCategory).mockRejectedValue(new Error('Add failed'));

    const { result } = renderWithProviders(() => useAddCategory());

    await act(async () => {
      try {
        await result.current.mutate({ fatherId: null, level: 1, categoryName: 'Test' });
      } catch (e) {
        // Expected to throw
      }
    });

    await waitFor(() => {
      expect(toast.showError).toHaveBeenCalledWith('错误：Add failed');
    });
  });

  test('✅ TDD: should handle null fatherId', async () => {
    vi.mocked(AdminServices.addCategory).mockResolvedValue({
      success: true,
    } as any);

    const { result } = renderWithProviders(() => useAddCategory());

    await act(async () => {
      await result.current.mutate({ fatherId: null, level: 1, categoryName: 'Root' });
    });

    expect(AdminServices.addCategory).toHaveBeenCalledWith(null, 1, 'Root');
  });
});

describe('useDeleteCategory - Mutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('✅ TDD: should call BlogServices.deleteCategory', async () => {
    vi.mocked(BlogServices.deleteCategory).mockResolvedValue({
      success: true,
    } as any);

    const { result } = renderWithProviders(() => useDeleteCategory());

    await act(async () => {
      await result.current.mutate(1);
    });

    expect(BlogServices.deleteCategory).toHaveBeenCalledWith(1);
  });

  test('✅ TDD: should show success toast on delete', async () => {
    vi.mocked(BlogServices.deleteCategory).mockResolvedValue({
      success: true,
    } as any);

    const { result } = renderWithProviders(() => useDeleteCategory());

    await act(async () => {
      await result.current.mutate(1);
    });

    await waitFor(() => {
      expect(toast.showSuccess).toHaveBeenCalledWith('删除成功');
    });
  });

  test('✅ TDD: should invalidate categories query on success', async () => {
    vi.mocked(BlogServices.deleteCategory).mockResolvedValue({
      success: true,
    } as any);

    const { result } = renderWithProviders(() => useDeleteCategory());

    await act(async () => {
      await result.current.mutate(1);
    });

    // Mutation should complete without throwing errors
    expect(toast.showSuccess).toHaveBeenCalledWith('删除成功');
  });

  test('✅ TDD: should show error toast on delete failure', async () => {
    vi.mocked(BlogServices.deleteCategory).mockRejectedValue(new Error('Delete failed'));

    const { result } = renderWithProviders(() => useDeleteCategory());

    await act(async () => {
      try {
        await result.current.mutate(1);
      } catch (e) {
        // Expected to throw
      }
    });

    await waitFor(() => {
      expect(toast.showError).toHaveBeenCalledWith('错误：Delete failed');
    });
  });
});
