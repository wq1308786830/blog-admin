import { useMutation, useQueryClient } from '@tanstack/react-query';
import AdminServices from '@/services/AdminServices';
import { showSuccess, showError } from '@/lib/toast';

export interface LoginFormData {
  username: string;
  password: string;
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: LoginFormData) => AdminServices.login(formData),
    onSuccess: async (resp: any) => {
      if (resp.success) {
        localStorage.setItem('user', JSON.stringify(resp.data));
        showSuccess('登录成功');
        // Clear any cached data from previous session
        queryClient.clear();
        window.location.href = '/';
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

// New hook for getting current user from localStorage
export function useUser() {
  const getUser = (): any | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  };

  return {
    user: getUser(),
    isAuthenticated: !!localStorage.getItem('user'),
  };
}
