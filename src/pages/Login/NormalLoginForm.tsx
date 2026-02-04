import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const loginSchema = z.object({
  user_name: z.string().min(1, { message: '请输入用户名!' }),
  password: z.string().min(1, { message: '请输入密码!' }),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function NormalLoginForm() {
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      user_name: '',
      password: '',
      remember: true,
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    login.mutate({
      user_name: values.user_name,
      password: values.password,
      remember: values.remember,
    });
  };

  const handleForgotPassword = () => {
    // 这里可以添加实际的忘记密码功能
    // 目前显示一个提示消息
    alert('请联系管理员重置密码');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="user_name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="用户名"
                    className="pl-9"
                    {...field}
                    disabled={login.isPending}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="密码"
                    className="pl-9"
                    {...field}
                    disabled={login.isPending}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="remember"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={login.isPending}
                />
              </FormControl>
              <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                记住我
              </div>
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="button" variant="link" className="px-0">
            忘记密码？
          </Button>
        </div>
        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {login.isPending ? '登录中...' : '登录'}
        </Button>
      </form>
    </Form>
  );
}

export default NormalLoginForm;
