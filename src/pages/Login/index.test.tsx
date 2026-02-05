import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './index';
import { useLogin } from '@/hooks/useAuth';

// Mock useLogin hook
vi.mock('@/hooks/useAuth', () => ({
  useLogin: vi.fn(),
}));

// Mock子组件以简化测试
vi.mock('./NormalLoginForm', () => ({
  default: () => <div data-testid="login-form">Login Form</div>,
}));

describe('Login Page - 登录页面', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('✅ TDD: 页面渲染', () => {
    it('应该渲染登录表单', () => {
      vi.mocked(useLogin).mockReturnValue({
        mutate: vi.fn(),
        isPending: false,
      } as any);

      render(<Login />);

      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    it('应该有正确的CSS类名', () => {
      vi.mocked(useLogin).mockReturnValue({
        mutate: vi.fn(),
        isPending: false,
      } as any);

      const { container } = render(<Login />);

      expect(container.querySelector('.gradient-bg')).toBeInTheDocument();
      expect(container.querySelector('.back-img')).toBeInTheDocument();
    });
  });

  describe('✅ TDD: 布局结构', () => {
    it('应该包含背景和卡片容器', () => {
      vi.mocked(useLogin).mockReturnValue({
        mutate: vi.fn(),
        isPending: false,
      } as any);

      const { container } = render(<Login />);

      const card = container.querySelector('.bg-white\\/80');
      expect(card).toBeInTheDocument();
    });

    it('应该有正确的卡片样式', () => {
      vi.mocked(useLogin).mockReturnValue({
        mutate: vi.fn(),
        isPending: false,
      } as any);

      const { container } = render(<Login />);

      const card = container.querySelector('.back-img .w-\\[350px\\]');
      expect(card).toBeInTheDocument();
    });
  });

  describe('✅ TDD: 组件集成', () => {
    it('应该渲染NormalLoginForm组件', () => {
      vi.mocked(useLogin).mockReturnValue({
        mutate: vi.fn(),
        isPending: false,
      } as any);

      render(<Login />);

      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });
  });
});
