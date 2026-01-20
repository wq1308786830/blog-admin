import { useMutation } from '@tanstack/react-query';
import AdminServices from '@/services/AdminServices';
import { message } from 'antd';

export interface LoginFormData {
  username: string;
  password: string;
}

export function useLogin() {
  return useMutation({
    mutationFn: (formData: LoginFormData) => AdminServices.login(formData),
    onSuccess: (resp: any) => {
      if (resp.success) {
        localStorage.setItem('user', JSON.stringify(resp.data));
        message.success('登录成功');
        window.location.href = '/';
      } else {
        message.error(resp.msg || 'Login failed');
      }
    },
    onError: (err: Error) => {
      message.error(`错误：${err.message}`);
    },
  });
}

export function useLogout() {
  return () => {
    localStorage.removeItem('user');
    message.success('已退出登录');
    window.location.href = '/login';
  };
}
