'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from '@/routes/hooks';

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setQueryError(null);
    try {
      await axios.post(
        'http://localhost:5206/api/accounts/register?role=User',
        form
      );
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      setQueryError(
        err?.response?.data?.message ||
          'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 p-4">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="bg-clip-text text-3xl font-bold text-black">
            Đăng ký
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Tạo tài khoản mới để tiếp tục
          </p>
        </div>
        {success ? (
          <div className="rounded-lg border border-green-200 bg-green-50 py-3 text-center font-semibold text-green-600">
            ✅ Đăng ký thành công! Đang chuyển hướng...
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="font-medium text-gray-700">
                Họ và tên
              </Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={onChange}
                disabled={loading}
                placeholder="Nhập họ và tên"
                required
                className="border-gray-300 bg-white text-gray-900"
              />
            </div>
            <div>
              <Label htmlFor="email" className="font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                disabled={loading}
                placeholder="Nhập email"
                required
                className="border-gray-300 bg-white text-gray-900"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="font-medium text-gray-700">
                Số điện thoại
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={onChange}
                disabled={loading}
                placeholder="Nhập số điện thoại"
                required
                className="border-gray-300 bg-white text-gray-900"
              />
            </div>
            <div>
              <Label htmlFor="password" className="font-medium text-gray-700">
                Mật khẩu
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                disabled={loading}
                placeholder="Nhập mật khẩu"
                required
                className="border-gray-300 bg-white text-gray-900"
              />
            </div>
            {queryError && (
              <p className="rounded-lg border border-red-200 bg-red-50 py-2 text-center text-sm text-red-600">
                {queryError}
              </p>
            )}
            <Button
              disabled={loading}
              className="w-full rounded-lg border-0 bg-gradient-to-r from-purple-600 to-pink-600 py-2.5 font-bold text-white transition-all duration-300 hover:from-purple-700 hover:to-pink-700 hover:shadow-lg"
              type="submit"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                'Đăng ký'
              )}
            </Button>
          </form>
        )}
        <div className="mt-6 text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <button
            onClick={() => router.push('/login')}
            className="font-semibold text-purple-600 underline underline-offset-4 transition-colors duration-200 hover:text-purple-700"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
