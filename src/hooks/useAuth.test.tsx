/**
 * TDD Test Suite for useAuth Hook
 * 测试认证相关钩子：useLogin, useLogout, useUser
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogin, useLogout, useUser } from './useAuth';
import AdminServices from '@/services/AdminServices';
import * as toast from '@/lib/toast';

// Mock all dependencies
vi.mock('@/services/AdminServices');
vi.mock('@/lib/toast');
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ state: null }),
}));

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

// Global setup
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.clearAllMocks();
});

describe('useLogin - Authentication', () => {
  test('✅ TDD: should call AdminServices.login with correct params', async () => {
    const loginData = {
      username: 'admin',
      password: 'password123',
      remember: true,
    };

    vi.mocked(AdminServices.login).mockResolvedValue({
      success: true,
      data: { id: 1, username: 'admin' },
    } as any);

    const { result } = renderWithProviders(() => useLogin());

    await act(async () => {
      await result.current.mutate(loginData);
    });

    expect(AdminServices.login).toHaveBeenCalledWith(loginData);
  });

  test('✅ TDD: should show success toast on login', async () => {
    const loginData = { username: 'admin', password: 'password' };

    vi.mocked(AdminServices.login).mockResolvedValue({
      success: true,
      data: { id: 1 },
    } as any);

    const { result } = renderWithProviders(() => useLogin());

    await act(async () => {
      await result.current.mutate(loginData);
    });

    expect(toast.showSuccess).toHaveBeenCalledWith('登录成功');
  });

  test('✅ TDD: should show error toast on API error', async () => {
    const loginData = { username: 'admin', password: 'wrong' };

    vi.mocked(AdminServices.login).mockResolvedValue({
      success: false,
      msg: 'Invalid credentials',
    } as any);

    const { result } = renderWithProviders(() => useLogin());

    await act(async () => {
      await result.current.mutate(loginData);
    });

    expect(toast.showError).toHaveBeenCalledWith('Invalid credentials');
  });

  test('✅ TDD: should show error toast on failure', async () => {
    const loginData = { username: 'admin', password: 'password' };

    vi.mocked(AdminServices.login).mockRejectedValue(new Error('Network error'));

    const { result } = renderWithProviders(() => useLogin());

    await act(async () => {
      try {
        await result.current.mutate(loginData);
      } catch (e) {
        // Expected to throw
      }
    });

    expect(toast.showError).toHaveBeenCalledWith('错误：Network error');
  });
});

describe('useLogout - Session Management', () => {
  test('✅ TDD: should clear localStorage', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1 }));

    const { result } = renderWithProviders(() => useLogout());

    await act(async () => {
      await result.current.mutate();
    });

    expect(localStorage.getItem('user')).toBeNull();
  });

  test('✅ TDD: should clear sessionStorage on logout', async () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 1 }));

    const { result } = renderWithProviders(() => useLogout());

    await act(async () => {
      await result.current.mutate();
    });

    expect(sessionStorage.getItem('user')).toBeNull();
  });

  test('✅ TDD: should show success toast', async () => {
    const { result } = renderWithProviders(() => useLogout());

    await act(async () => {
      await result.current.mutate();
    });

    expect(toast.showSuccess).toHaveBeenCalledWith('已退出登录');
  });
});

describe('useUser - User State', () => {
  test('✅ TDD: should return user from localStorage when available', () => {
    const userData = { id: 1, username: 'admin' };
    localStorage.setItem('user', JSON.stringify(userData));

    const { result } = renderWithProviders(() => useUser());

    expect(result.current.user).toEqual(userData);
    expect(result.current.isAuthenticated).toBe(true);
  });

  test('✅ TDD: should return null when no user in storage', () => {
    const { result } = renderWithProviders(() => useUser());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  test('✅ TDD: should set isAuthenticated=true when user exists', () => {
    localStorage.setItem('user', JSON.stringify({ id: 1 }));

    const { result } = renderWithProviders(() => useUser());

    expect(result.current.isAuthenticated).toBe(true);
  });

  test('✅ TDD: should set isAuthenticated=false when user is null', () => {
    const { result } = renderWithProviders(() => useUser());

    expect(result.current.isAuthenticated).toBe(false);
  });

  test('✅ TDD: should handle invalid JSON in storage', () => {
    localStorage.setItem('user', 'invalid json');

    const { result } = renderWithProviders(() => useUser());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
