import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, User } from 'lucide-react';
import Recaptcha from 'react-recaptcha';
import AdminServices from '@/services/AdminServices';
import { showError, showSuccess } from '@/lib/toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import history from 'history/browser';

const loginSchema = z.object({
  user_name: z.string().min(1, { message: '请输入用户名!' }),
  password: z.string().min(1, { message: '请输入密码!' }),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function NormalLoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      user_name: '',
      password: '',
      remember: true,
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const resp = await AdminServices.login({
        username: values.user_name,
        password: values.password,
      });
      if (resp.success) {
        localStorage.setItem('user', '1');
        showSuccess('登录成功');
        history.push('/admin');
      } else {
        showError(`错误：${resp.msg}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showError(`错误：${error.message}`);
      } else {
        showError('未知错误');
      }
    }
  };

  const onloadCallback = () => {
    // eslint-disable-next-line no-console
    console.log('Done!!!');
  };

  const verifyCallback = (resp: string) => {
    // eslint-disable-next-line no-console
    console.log(resp);
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
        <Button type="submit" className="w-full">
          登录
        </Button>
        <Recaptcha
          sitekey="6LfEhDwUAAAAAPEPGFpooDYCHBczNAUu90medQoD"
          render="explicit"
          verifyCallback={verifyCallback}
          onloadCallback={onloadCallback}
          type="image"
          hl="zh-CN"
        />
      </form>
    </Form>
  );
}

export default NormalLoginForm;
