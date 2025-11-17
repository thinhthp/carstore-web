import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  useResetPassword,
  useValidateResetPassword
} from '@/queries/auth.query';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId') || '';
  const rawToken = searchParams.get('token') || '';
  // Handle possible double encoding (%252B etc.)
  const decodeMaybeTwice = (v: string) => {
    try {
      const once = decodeURIComponent(v);
      // If still contains encoded sequences, decode again
      if (/%25[0-9a-fA-F]{2}/.test(v)) {
        return decodeURIComponent(once);
      }
      // If the once-decoded still has %XX patterns, decode again
      if (/%[0-9a-fA-F]{2}/.test(once) && once !== v) {
        try {
          return decodeURIComponent(once);
        } catch {
          return once;
        }
      }
      return once;
    } catch {
      return v;
    }
  };
  const token = decodeMaybeTwice(rawToken);

  const { isLoading, isError } = useValidateResetPassword(userId, token, true);
  const { mutateAsync: resetPassword, isPending } = useResetPassword();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [password, confirm]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password !== confirm) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    // Backend performs one UrlDecode; send a single-encoded token here
    const encodedOnce = encodeURIComponent(token);
    const [err] = await resetPassword({
      userId,
      token: encodedOnce,
      newPassword: password
    });
    if (!err) {
      alert('Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.');
      navigate('/login');
    } else {
      setError('Không thể đặt lại mật khẩu. Vui lòng thử lại.');
    }
  };

  if (!userId || !token) {
    return <div className="p-6">Liên kết không hợp lệ.</div>;
  }

  if (isLoading) {
    return <div className="p-6">Đang xác minh liên kết…</div>;
  }

  if (isError) {
    return (
      <div className="p-6">
        Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Đặt lại mật khẩu</h1>
        <div className="space-y-2">
          <label className="block text-sm">Mật khẩu mới</label>
          <input
            type="password"
            className="w-full rounded border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm">Xác nhận mật khẩu</label>
          <input
            type="password"
            className="w-full rounded border px-3 py-2"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded bg-primary px-4 py-2 text-white disabled:opacity-50"
        >
          {isPending ? 'Đang lưu…' : 'Đặt lại mật khẩu'}
        </button>
      </form>
    </div>
  );
}
