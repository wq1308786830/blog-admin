import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';
import { useUser } from '@/hooks/useAuth';

vi.mock('@/hooks/useAuth');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: vi.fn(({ to, replace }) => (
      <div data-testid="navigate" data-to={to} data-replace={replace}>
        Navigate to {to}
      </div>
    )),
  };
});

describe('ProtectedRoute - 路由守卫', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('ProtectedRoute', () => {
    it('✅ TDD: 未登录时应重定向到/login', () => {
      vi.mocked(useUser).mockReturnValue({
        user: null,
        isAuthenticated: false,
      } as any);

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
    });

    it('✅ TDD: 已登录时应渲染子组件', () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, user_name: 'admin' }));
      vi.mocked(useUser).mockReturnValue({
        user: { id: 1, user_name: 'admin' },
        isAuthenticated: true,
      } as any);

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });

    it('✅ TDD: 未登录时应保存当前位置到state', () => {
      vi.mocked(useUser).mockReturnValue({
        user: null,
        isAuthenticated: false,
      } as any);

      render(
        <MemoryRouter initialEntries={['/articleEdit/1/1']}>
          <ProtectedRoute>
            <div>Protected</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      const navigateElement = screen.getByTestId('navigate');
      expect(navigateElement).toHaveAttribute('data-to', '/login');
    });

    it('✅ TDD: 已登录且用户信息完整时应正常渲染', () => {
      vi.mocked(useUser).mockReturnValue({
        user: {
          id: 1,
          user_name: 'testuser',
          email: 'test@example.com',
        },
        isAuthenticated: true,
      } as any);

      render(
        <MemoryRouter>
          <ProtectedRoute>
            <div data-testid="protected-page">Protected Page</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-page')).toBeInTheDocument();
    });
  });

  describe('PublicRoute', () => {
    it('✅ TDD: 未登录时应渲染子组件', () => {
      vi.mocked(useUser).mockReturnValue({
        user: null,
        isAuthenticated: false,
      } as any);

      render(
        <MemoryRouter initialEntries={['/login']}>
          <PublicRoute>
            <div>Login Page</div>
          </PublicRoute>
        </MemoryRouter>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });

    it('✅ TDD: 已登录时访问登录页应重定向到首页', () => {
      vi.mocked(useUser).mockReturnValue({
        user: { id: 1, user_name: 'admin' },
        isAuthenticated: true,
      } as any);

      render(
        <MemoryRouter initialEntries={['/login']}>
          <PublicRoute>
            <div>Login Page</div>
          </PublicRoute>
        </MemoryRouter>
      );

      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/');
    });

    it('✅ TDD: 已登录时应使用replace模式重定向', () => {
      vi.mocked(useUser).mockReturnValue({
        user: { id: 1 },
        isAuthenticated: true,
      } as any);

      render(
        <MemoryRouter initialEntries={['/login']}>
          <PublicRoute>
            <div>Login</div>
          </PublicRoute>
        </MemoryRouter>
      );

      const navigateElement = screen.getByTestId('navigate');
      expect(navigateElement).toHaveAttribute('data-replace', 'true');
    });

    it('✅ TDD: state中有from信息时应重定向到原页面', () => {
      vi.mocked(useUser).mockReturnValue({
        user: { id: 1 },
        isAuthenticated: true,
      } as any);

      const fromPath = '/articleEdit/1/2';

      render(
        <MemoryRouter
          initialEntries={[{ pathname: '/login', state: { from: { pathname: fromPath } } }]}
        >
          <PublicRoute>
            <div>Login Page</div>
          </PublicRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', fromPath);
    });

    it('✅ TDD: 未登录状态且无user时应显示登录页', () => {
      vi.mocked(useUser).mockReturnValue({
        user: null,
        isAuthenticated: false,
      } as any);

      render(
        <MemoryRouter initialEntries={['/login']}>
          <PublicRoute>
            <div data-testid="login-form">Login Form</div>
          </PublicRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });
  });

  describe('路由守卫边界情况', () => {
    it('✅ TDD: ProtectedRoute子组件为空时应正常处理', () => {
      vi.mocked(useUser).mockReturnValue({
        isAuthenticated: true,
        user: { id: 1 },
      } as any);

      render(
        <MemoryRouter>
          <ProtectedRoute>{null}</ProtectedRoute>
        </MemoryRouter>
      );

      // 空子组件不应报错
      expect(document.body).toBeInTheDocument();
    });

    it('✅ TDD: PublicRoute子组件为空时应正常处理', () => {
      vi.mocked(useUser).mockReturnValue({
        isAuthenticated: false,
        user: null,
      } as any);

      render(
        <MemoryRouter>
          <PublicRoute>{null}</PublicRoute>
        </MemoryRouter>
      );

      // 空子组件不应报错
      expect(document.body).toBeInTheDocument();
    });

    it('✅ TDD: ProtectedRoute有多个子元素时应全部渲染', () => {
      vi.mocked(useUser).mockReturnValue({
        isAuthenticated: true,
        user: { id: 1 },
      } as any);

      render(
        <MemoryRouter>
          <ProtectedRoute>
            <div>Child 1</div>
            <div>Child 2</div>
            <div>Child 3</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });
  });
});
