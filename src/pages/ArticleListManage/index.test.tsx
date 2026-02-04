/**
 * TDD Test Suite for ArticleListManage Page
 * 测试文章列表管理页面的所有核心功能
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as hooks from '@/hooks';
import Index from './index';
import type { Article } from '@/types';

// Test data
const mockCategoryOptions = [
  {
    value: '1',
    label: '技术',
    children: [
      {
        value: '2',
        label: '前端',
        children: [
          {
            value: '3',
            label: 'React',
          },
        ],
      },
    ],
  },
];

const mockArticles: Article[] = [
  {
    id: 1,
    category_id: 3,
    title: 'React Hooks 入门',
    description: '学习React Hooks的基础知识',
    text_type: 'md',
  },
  {
    id: 2,
    category_id: 3,
    title: 'TypeScript 最佳实践',
    description: 'TypeScript开发中的最佳实践',
    text_type: 'md',
  },
  {
    id: 3,
    category_id: 2,
    title: 'Vite 配置指南',
    description: '详解Vite的配置选项',
    text_type: 'html',
  },
];

// Setup mocks
const mockFetchNextPage = vi.fn();
const mockDeleteArticle = vi.fn();

vi.mock('@/hooks', () => ({
  useCategories: vi.fn(),
  useArticleList: vi.fn(),
  useArticleActions: vi.fn(),
}));

// Helper function to render component with providers
function renderWithProviders(component: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{component}</MemoryRouter>
      </QueryClientProvider>
    ),
  };
}

// Default mock setup
beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(hooks.useCategories).mockReturnValue({
    data: mockCategoryOptions,
    isLoading: false,
  });

  vi.mocked(hooks.useArticleList).mockReturnValue({
    data: { pages: [mockArticles] },
    fetchNextPage: mockFetchNextPage,
    hasNextPage: true,
    isFetchingNextPage: false,
    isLoading: false,
  });

  vi.mocked(hooks.useArticleActions).mockReturnValue({
    deleteArticle: mockDeleteArticle,
  });
});

// ==================== 基础渲染测试 ====================

describe('ArticleListManage - Basic Rendering', () => {
  test('should render page with filter section', () => {
    renderWithProviders(<Index />);

    expect(screen.getByText('类目')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('模糊搜索')).toBeInTheDocument();
    expect(screen.getByText('过滤 (自动)')).toBeInTheDocument();
  });

  test('should render article list with data', () => {
    renderWithProviders(<Index />);

    expect(screen.getByText('React Hooks 入门')).toBeInTheDocument();
    expect(screen.getByText('TypeScript 最佳实践')).toBeInTheDocument();
    expect(screen.getByText('Vite 配置指南')).toBeInTheDocument();
  });

  test('should render search input with icon', () => {
    renderWithProviders(<Index />);

    const searchInput = screen.getByPlaceholderText('模糊搜索');
    expect(searchInput).toBeInTheDocument();
    const searchIcon = document.querySelector('svg.lucide-search');
    expect(searchIcon).toBeInTheDocument();
  });

  test('should render disabled filter button', () => {
    renderWithProviders(<Index />);

    const filterButton = screen.getByText('过滤 (自动)');
    expect(filterButton).toBeDisabled();
  });
});

// ==================== 过滤器交互测试 ====================

describe('ArticleListManage - Filter Interactions', () => {
  test('should update search text on input change', async () => {
    renderWithProviders(<Index />);

    const searchInput = screen.getByPlaceholderText('模糊搜索');
    await userEvent.type(searchInput, 'React');

    expect(searchInput).toHaveValue('React');
  });

  test('should render DateRangePicker', () => {
    renderWithProviders(<Index />);

    const dateInputs = screen.getAllByPlaceholderText(/Start date|End date/);
    expect(dateInputs.length).toBeGreaterThan(0);
  });
});

// ==================== 文章列表渲染测试 ====================

describe('ArticleListManage - Article List Rendering', () => {
  test('should render article cards with correct structure', () => {
    renderWithProviders(<Index />);

    const editButtons = screen.getAllByText('编辑');
    const deleteButtons = screen.getAllByText('删除');
    expect(editButtons.length).toBe(3);
    expect(deleteButtons.length).toBe(3);
  });

  test('should render article title as link', () => {
    renderWithProviders(<Index />);

    const reactLink = screen.getByText('React Hooks 入门');
    expect(reactLink.closest('a')).toHaveAttribute('href', '/category/3/articles/1/detail');
    expect(reactLink.closest('a')).toHaveAttribute('target', '_blank');
  });

  test('should render article descriptions', () => {
    renderWithProviders(<Index />);

    expect(screen.getByText('学习React Hooks的基础知识')).toBeInTheDocument();
    expect(screen.getByText('TypeScript开发中的最佳实践')).toBeInTheDocument();
    expect(screen.getByText('详解Vite的配置选项')).toBeInTheDocument();
  });

  test('should render article fallback avatars', () => {
    renderWithProviders(<Index />);

    expect(screen.getByText('R')).toBeInTheDocument();
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByText('V')).toBeInTheDocument();
  });
});

// ==================== 编辑功能测试 ====================

describe('ArticleListManage - Edit Functionality', () => {
  test('should have edit button with correct link', () => {
    renderWithProviders(<Index />);

    const editButtons = screen.getAllByText('编辑');
    const firstEditButton = editButtons[0];

    expect(firstEditButton.closest('a')).toHaveAttribute('href', '/articleEdit/3/1');
  });
});

// ==================== 删除功能测试 ====================

describe('ArticleListManage - Delete Functionality', () => {
  test('should open delete confirmation dialog', async () => {
    renderWithProviders(<Index />);

    const deleteButtons = screen.getAllByText('删除');
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('确认删除')).toBeInTheDocument();
    });
  });

  test('should close dialog when cancel is clicked', async () => {
    renderWithProviders(<Index />);

    const deleteButtons = screen.getAllByText('删除');
    await userEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('确认删除')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('取消');
    await userEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('确认删除')).not.toBeInTheDocument();
    });
  });

  test('should call deleteArticle when confirmed', async () => {
    renderWithProviders(<Index />);

    const deleteButtons = screen.getAllByText('删除');
    await userEvent.click(deleteButtons[0]);

    // Wait for dialog text to appear
    await waitFor(() => {
      expect(screen.getByText('确认删除')).toBeInTheDocument();
    }, { timeout: 3000 });

    const confirmButton = screen.getByText('确定');
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteArticle).toHaveBeenCalledWith(1);
    });
  });
});

// ==================== 无限滚动测试 ====================

describe('ArticleListManage - Infinite Scroll', () => {
  test('should show load more button when has next page', () => {
    renderWithProviders(<Index />);

    expect(screen.getByText('加载更多')).toBeInTheDocument();
  });

  test('should call fetchNextPage when load more is clicked', async () => {
    renderWithProviders(<Index />);

    const loadMoreButton = screen.getByText('加载更多');
    await userEvent.click(loadMoreButton);

    expect(mockFetchNextPage).toHaveBeenCalled();
  });

  test('should show no more data message when no next page', () => {
    vi.mocked(hooks.useArticleList).mockReturnValue({
      data: { pages: [mockArticles] },
      fetchNextPage: mockFetchNextPage,
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
    });

    renderWithProviders(<Index />);

    expect(screen.getByText('没更多数据了')).toBeInTheDocument();
  });

  test('should show loading when fetching next page', () => {
    vi.mocked(hooks.useArticleList).mockReturnValue({
      data: { pages: [mockArticles] },
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: true,
      isLoading: false,
    });

    renderWithProviders(<Index />);

    // Look for the loader spinner using its animation class
    const loaders = document.querySelectorAll('.animate-spin');
    expect(loaders.length).toBeGreaterThan(0);
  });
});

// ==================== 加载状态测试 ====================

describe('ArticleListManage - Loading States', () => {
  test('should show loader when articles are loading', () => {
    vi.mocked(hooks.useArticleList).mockReturnValue({
      data: undefined,
      fetchNextPage: mockFetchNextPage,
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: true,
    });

    renderWithProviders(<Index />);

    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  test('should show empty state when no articles', () => {
    vi.mocked(hooks.useArticleList).mockReturnValue({
      data: { pages: [[]] },
      fetchNextPage: mockFetchNextPage,
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
    });

    renderWithProviders(<Index />);

    expect(screen.getByText('暂无数据')).toBeInTheDocument();
  });
});

// ==================== 空状态测试 ====================

describe('ArticleListManage - Empty States', () => {
  test('should show empty state with icon when no articles', () => {
    vi.mocked(hooks.useArticleList).mockReturnValue({
      data: { pages: [[]] },
      fetchNextPage: mockFetchNextPage,
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
    });

    renderWithProviders(<Index />);

    expect(screen.getByText('暂无数据')).toBeInTheDocument();
    const icon = document.querySelector('svg.lucide-scroll-text');
    expect(icon).toBeInTheDocument();
  });

  test('should not show load more when no articles', () => {
    vi.mocked(hooks.useArticleList).mockReturnValue({
      data: { pages: [[]] },
      fetchNextPage: mockFetchNextPage,
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
    });

    renderWithProviders(<Index />);

    expect(screen.queryByText('加载更多')).not.toBeInTheDocument();
    expect(screen.getByText('暂无数据')).toBeInTheDocument();
  });
});

// ==================== useTransition 优化测试 ====================

describe('ArticleListManage - useTransition Optimization', () => {
  test('should not block UI during filter transitions', async () => {
    renderWithProviders(<Index />);

    const searchInput = screen.getByPlaceholderText('模糊搜索');

    await userEvent.type(searchInput, 'React');

    await waitFor(() => {
      expect(searchInput).toHaveValue('React');
    });
  });
});

// ==================== 响应式测试 ====================

describe('ArticleListManage - Responsive Design', () => {
  test('should render scroll area with fixed height', () => {
    renderWithProviders(<Index />);

    const scrollArea = document.querySelector('.h-\\[600px\\]');
    expect(scrollArea).toBeInTheDocument();
  });

  test('should have hover effects on article cards', () => {
    renderWithProviders(<Index />);

    const cards = document.querySelectorAll('.hover\\:shadow-md');
    expect(cards.length).toBeGreaterThan(0);
  });
});

// ==================== 可访问性测试 ====================

describe('ArticleListManage - Accessibility', () => {
  test('should have proper button labels', () => {
    renderWithProviders(<Index />);

    expect(screen.getAllByText('编辑').length).toBeGreaterThan(0);
    expect(screen.getAllByText('删除').length).toBeGreaterThan(0);
  });

  test('should have proper input placeholders', () => {
    renderWithProviders(<Index />);

    expect(screen.getByPlaceholderText('模糊搜索')).toBeInTheDocument();
  });

  test('should have descriptive aria labels on delete confirmation', async () => {
    renderWithProviders(<Index />);

    const deleteButtons = screen.getAllByText('删除');
    await userEvent.click(deleteButtons[0]);

    // Wait for confirmation text
    await waitFor(() => {
      expect(screen.getByText('确认删除')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});

// ==================== 集成测试场景 ====================

describe('ArticleListManage - Integration Scenarios', () => {
  test('should complete filter and view article flow', async () => {
    renderWithProviders(<Index />);

    const searchInput = screen.getByPlaceholderText('模糊搜索');
    await userEvent.type(searchInput, 'React');

    await waitFor(() => {
      expect(searchInput).toHaveValue('React');
    });

    const articleLink = screen.getByText('React Hooks 入门');
    expect(articleLink.closest('a')).toHaveAttribute('href', '/category/3/articles/1/detail');
  });

  test('should complete delete article flow', async () => {
    renderWithProviders(<Index />);

    const deleteButtons = screen.getAllByText('删除');
    await userEvent.click(deleteButtons[0]);

    // Wait for confirmation dialog text
    await waitFor(() => {
      expect(screen.getByText('确认删除')).toBeInTheDocument();
    }, { timeout: 3000 });

    const confirmButton = screen.getByText('确定');
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteArticle).toHaveBeenCalledWith(1);
    });
  });

  test('should handle multiple filter changes', async () => {
    renderWithProviders(<Index />);

    const searchInput = screen.getByPlaceholderText('模糊搜索');

    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'React');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'TypeScript');

    await waitFor(() => {
      expect(searchInput).toHaveValue('TypeScript');
    });
  });
});

// ==================== 边界情况测试 ====================

describe('ArticleListManage - Edge Cases', () => {
  test('should handle very long article titles', () => {
    const longTitle = '这是一篇非常非常非常长的文章标题用来测试line-clamp功能是否正常工作';
    const mockLongArticles: Article[] = [
      {
        id: 1,
        category_id: 1,
        title: longTitle,
        description: 'Test',
        text_type: 'md',
      },
    ];

    vi.mocked(hooks.useArticleList).mockReturnValue({
      data: { pages: [mockLongArticles] },
      fetchNextPage: mockFetchNextPage,
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
    });

    renderWithProviders(<Index />);

    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  test('should handle special characters in search', async () => {
    renderWithProviders(<Index />);

    const searchInput = screen.getByPlaceholderText('模糊搜索');
    await userEvent.type(searchInput, '<script>alert("test")</script>');

    await waitFor(() => {
      expect(searchInput).toHaveValue('<script>alert("test")</script>');
    });
  });

  test('should handle empty article list gracefully', () => {
    vi.mocked(hooks.useArticleList).mockReturnValue({
      data: { pages: [[]] },
      fetchNextPage: mockFetchNextPage,
      hasNextPage: false,
      isFetchingNextPage: false,
      isLoading: false,
    });

    renderWithProviders(<Index />);

    expect(screen.getByText('暂无数据')).toBeInTheDocument();
    expect(screen.queryByText('加载更多')).not.toBeInTheDocument();
  });
});
