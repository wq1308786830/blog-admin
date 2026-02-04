import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminServices from '@/services/AdminServices';
import { showSuccess, showError } from '@/lib/toast';
import type { ApiResponse } from '@/types';

export interface LoginFormData {
  user_name: string;
  password: string;
  remember?: boolean;
}

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  return useMutation({
    mutationFn: (formData: LoginFormData) => AdminServices.login(formData),
    onSuccess: async (resp: ApiResponse<Record<string, unknown>>) => {
      if (resp.success) {
        // 根据是否选中"记住我"来决定存储方式
          // 使用localStorage持久化存储
          localStorage.setItem('user', JSON.stringify(resp.data));
          // 使用sessionStorage，关闭浏览器后失效
          sessionStorage.setItem('user', JSON.stringify(resp.data));

        showSuccess('登录成功');
        // Clear any cached data from previous session
        queryClient.clear();

        // 重定向到来自的页面或首页
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        showError(resp.msg || 'Login failed');
      }
    },
    onError: (err: Error) => {
      showError(`错误：${err.message}`);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem('user');
      sessionStorage.removeItem('user'); // Clear sessionStorage as well
      // Clear all cached queries on logout
      queryClient.clear();
    },
    onSuccess: () => {
      showSuccess('已退出登录');
      window.location.href = '/login';
    },
    onError: (err: Error) => {
      showError(`错误：${err.message}`);
    },
  });
}

// New hook for getting current user from localStorage or sessionStorage
export function useUser() {
  const getUser = (): Record<string, unknown> | null => {
    // 先从 localStorage 读取（记住我）
    let userStr = localStorage.getItem('user');
    // 如果 localStorage 没有，尝试从 sessionStorage 读取
    if (!userStr) {
      userStr = sessionStorage.getItem('user');
    }

    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  };

  const user = getUser();

  return {
    user,
    isAuthenticated: !!user,
  };
}
