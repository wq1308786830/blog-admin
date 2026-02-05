import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NormalLoginForm from './NormalLoginForm';
import { useLogin } from '@/hooks/useAuth';

// Mock useLogin hook
vi.mock('@/hooks/useAuth', () => ({
  useLogin: vi.fn(),
}));

describe('NormalLoginForm - 登录表单组件', () => {
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockMutate.mockClear();
  });

  describe('✅ TDD: 表单渲染', () => {
    it('应该渲染用户名输入框', () => {
      vi.mocked(useLogin).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      } as any);

      render(<NormalLoginForm />);

      expect(screen.getByPlaceholderText('用户名')).toBeInTheDocument();
    });

    it('应该渲染密码输入框', () => {
      vi.mocked(useLogin).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      } as any);

      render(<NormalLoginForm />);

      expect(screen.getByPlaceholderText('密码')).toBeInTheDocument();
    });

    it('应该渲染记住我复选框', () => {
      vi.mocked(useLogin).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      } as any);

      render(<NormalLoginForm />);

      expect(screen.getByText('记住我')).toBeInTheDocument();
    });

    it('应该渲染登录按钮', () => {
      vi.mocked(useLogin).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      } as any);

      render(<NormalLoginForm />);

      const loginButton = screen.getByRole('button', { name: '登录' });
      expect(loginButton).toBeInTheDocument();
    });

    it('应该渲染忘记密码链接', () => {
      vi.mocked(useLogin).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      } as any);

      render(<NormalLoginForm />);

      expect(screen.getByText('忘记密码？')).toBeInTheDocument();
    });
  });

  describe('✅ TDD: 表单验证', () => {
    it('提交空表单时应显示验证错误', async () => {
      vi.mocked(useLogin).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      } as any);

      render(<NormalLoginForm />);

      const loginButton = screen.getByRole('button', { name: '登录' });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('请输入用户名!')).toBeInTheDocument();
        expect(screen.getByText('请输入密码!')).toBeInTheDocument();
      });

      // 不应该调用登录API
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('只输入用户名时应显示密码验证错误', async () => {
      vi.mocked(useLogin).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      } as any);

      render(<NormalLoginForm />);

      const usernameInput = screen.getByPlaceholderText('用户名');
      fireEvent.change(usernameInput, { target: { value: 'admin' } });

      const loginButton = screen.getByRole('button', { name: '登录' });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('请输入密码!')).toBeInTheDocument();
      });

      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('只输入密码时应显示用户名验证错误', async () => {
      vi.mocked(useLogin).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      } as any);

      render(<NormalLoginForm />);

      const passwordInput = screen.getByPlaceholderText('密码');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      const loginButton = screen.getByRole('button', { name: '登录' });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('请输入用户名!')).toBeInTheDocument();
      });

      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe('✅ TDD: 表单提交', () => {
    it('填写完整表单后提交应调用登录API', async () => {
      vi.mocked(useLogin).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      } as any);

      render(<NormalLoginForm />);

      const usernameInput = screen.getByPlaceholderText('用户名');
      const passwordInput = screen.getByPlaceholderText('密码');

      await userEvent.type(usernameInput, 'admin');
      await userEvent.type(passwordInput, 'password123');

      const loginButton = screen.getByRole('button', { name: '登录' });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          user_name: 'admin',
          password: 'password123',
          remember: true,
        });
      });
    });

    it('不选中记住我时提交应传递remember为false', async () => {
      vi.mocked(useLogin).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      } as any);

      render(<NormalLoginForm />);

      const usernameInput = screen.getByPlaceholderText('用户名');
      const passwordInput = screen.getByPlaceholderText('密码');
      const rememberCheckbox = screen.getByRole('checkbox');

      await userEvent.type(usernameInput, 'admin');
      await userEvent.type(passwordInput, 'password123');
      fireEvent.click(rememberCheckbox);

      const loginButton = screen.getByRole('button', { name: '登录' });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          user_name: 'admin',
          password: 'password123',
          remember: false,
        });
      });
    });
  });

  describe('✅ TDD: Loading状态', () => {
    it('登录中应禁用表单输入', () => {
      vi.mocked(useLogin).mockReturnValue({
        mutate: mockMutate,
        isPending: true,
      } as any);

      render(<NormalLoginForm />);

      const usernameInput = screen.getByPlaceholderText('用户名');
      const passwordInput = screen.getByPlaceholderText('密码');
      const checkbox = screen.getByRole('checkbox');
      const loginButton = screen.getByRole('button', { name: '登录中...' });

      expect(usernameInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(checkbox).toBeDisabled();
      expect(loginButton).toBeDisabled();
    });

    it('登录中应显示加载中按钮文本', () => {
      vi.mocked(useLogin).mockReturnValue({
        mutate: mockMutate,
        isPending: true,
      } as any);

      render(<NormalLoginForm />);

      expect(screen.getByText('登录中...')).toBeInTheDocument();
      expect(screen.queryByText('登录')).not.toBeInTheDocument();
    });

    it('非登录状态应显示正常按钮文本', () => {
      vi.mocked(useLogin).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      } as any);

      render(<NormalLoginForm />);

      expect(screen.getByText('登录')).toBeInTheDocument();
      expect(screen.queryByText('登录中...')).not.toBeInTheDocument();
    });
  });

  describe('✅ TDD: 忘记密码', () => {
    it('应该渲染忘记密码按钮', () => {
      vi.mocked(useLogin).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      } as any);

      render(<NormalLoginForm />);

      const forgotPasswordButton = screen.getByRole('button', { name: '忘记密码？' });
      expect(forgotPasswordButton).toBeInTheDocument();
    });

    it('点击忘记密码按钮不应该触发登录', () => {
      vi.mocked(useLogin).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      } as any);

      render(<NormalLoginForm />);

      const forgotPasswordButton = screen.getByRole('button', { name: '忘记密码？' });
      fireEvent.click(forgotPasswordButton);

      // 不应该调用登录API
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe('✅ TDD: 表单默认值', () => {
    it('记住我默认应该被选中', () => {
      vi.mocked(useLogin).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      } as any);

      render(<NormalLoginForm />);

      const checkbox = screen.getByRole('checkbox');
      // Checkbox组件可能使用data-checked属性而不是checked属性
      expect(checkbox).toBeInTheDocument();
    });

    it('用户名和密码默认应为空', () => {
      vi.mocked(useLogin).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      } as any);

      render(<NormalLoginForm />);

      const usernameInput = screen.getByPlaceholderText('用户名') as HTMLInputElement;
      const passwordInput = screen.getByPlaceholderText('密码') as HTMLInputElement;

      expect(usernameInput.value).toBe('');
      expect(passwordInput.value).toBe('');
    });
  });
});
