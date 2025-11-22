import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import __helpers from '@/helpers';
import { useLogin } from '@/queries/auth.query';
import { useAppDispatch } from '@/redux/store';
import { login as loginAction, setInfoUser } from '@/redux/auth.slice';
import { useRouter } from '@/routes/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Tên đăng nhập phải có ít nhất 2 ký tự' }),
  password: z.string().min(2, { message: 'Mật khẩu phải có ít nhất 2 ký tự' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { mutateAsync: login } = useLogin();
  const [queryError, setQueryError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const defaultValues = {
    username: '',
    password: ''
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    if (error) {
      setQueryError(decodeURIComponent(error));
    }
  }, []);

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    setQueryError(null);
    try {
      const model = { email: data.username, password: data.password };
      const res = await login(model);
      if (!res) {
        setQueryError('Đăng nhập thất bại. Vui lòng thử lại.');
        return;
      }

      // Flexible token extraction across possible response shapes
      const tokenCandidate: any =
        (typeof res === 'string' ? res : null) ||
        res?.token ||
        res?.tokenString ||
        res?.data?.token ||
        res?.data?.tokenString ||
        res?.data;

      const token = typeof tokenCandidate === 'string' ? tokenCandidate : '';
      if (!token) {
        setQueryError('Đăng nhập thất bại. Không nhận được token.');
        return;
      }

      // Optional user payload to persist
      const user = res?.user || res?.data?.user || res?.response || null;
      if (user?.id) __helpers.localStorage_set('user_id', user.id);
      if (user?.name) __helpers.localStorage_set('user_name', user.name);

      // Store token in cookie (required for axios Authorization header & ProtectedRoute)
      // Derive expiration (days) from JWT exp if available
      try {
        const decoded: any = jwtDecode(token);
        if (decoded?.exp) {
          const secondsUntilExpiry = decoded.exp * 1000 - Date.now();
          const days =
            secondsUntilExpiry > 0
              ? secondsUntilExpiry / (1000 * 60 * 60 * 24)
              : undefined;
          __helpers.cookie_set('AT', token, days ? Math.ceil(days) : undefined);
        } else {
          __helpers.cookie_set('AT', token); // session cookie fallback
        }
      } catch {
        __helpers.cookie_set('AT', token);
      }

      // Update redux auth state
      dispatch(loginAction());
      if (user) dispatch(setInfoUser(user));

      // Decode token safely (optional)
      // Optional: could branch navigation per role later if needed

      router.push('/dashboard');
    } catch (err: any) {
      form.setError('password', {
        type: 'manual',
        message: err?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        {/* Username Field */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Tên đăng nhập</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Nhập tên đăng nhập..."
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Mật khẩu</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Nhập mật khẩu của bạn..."
                  disabled={loading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {queryError && (
          <p className="text-center text-sm text-red-500">{queryError}</p>
        )}

        <Button
          disabled={loading}
          className="ml-auto w-full bg-slate-600"
          type="submit"
        >
          Đăng nhập
        </Button>
      </form>
    </Form>
  );
}
