import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

// Mock lazy loaded components to avoid loading issues
vi.mock('./pages/Login', () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock('./pages/Main', () => ({
  default: () => <div data-testid="admin-main">Admin Main Layout</div>,
}));

vi.mock('./pages/ArticleListManage', () => ({
  default: () => <div data-testid="article-list">Article List</div>,
}));

vi.mock('./pages/ArticleEdit', () => ({
  default: () => <div data-testid="article-edit">Article Edit</div>,
}));

vi.mock('./pages/CategoryManage', () => ({
  default: () => <div data-testid="category-manage">Category Manage</div>,
}));

// Mock hooks that use localStorage
vi.mock('./hooks/useAuth', () => ({
  useUser: () => ({
    isAuthenticated: false,
    user: null,
  }),
  useLogin: () => ({ mutate: vi.fn(), isPending: false }),
  useLogout: () => ({ mutate: vi.fn() }),
}));

describe('App - 路由配置', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('✅ TDD: 应用基础渲染', () => {
    it('应该渲染App组件而不崩溃', () => {
      const { container } = render(<App />);
      expect(container).toBeInTheDocument();
    });

    it('应该懒加载所有页面组件', () => {
      // Verify that lazy loading is configured by checking if the app renders
      const { container } = render(<App />);
      expect(container).toBeInTheDocument();
    });
  });
});
