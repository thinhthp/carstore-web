import { useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const success = (searchParams.get('success') || '').toLowerCase() === 'true';
  const email = searchParams.get('email') || '';

  useEffect(() => {
    const t = setTimeout(() => navigate('/login'), 3000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded border p-6 text-center">
        {success ? (
          <>
            <h1 className="mb-2 text-xl font-semibold">Email confirmed</h1>
            {email && (
              <p className="mb-4 text-sm text-muted-foreground">{email}</p>
            )}
            <p className="mb-6">Bạn có thể đăng nhập ngay bây giờ.</p>
            <Link
              to="/login"
              className="inline-block rounded bg-primary px-4 py-2 text-white"
            >
              Đến trang đăng nhập
            </Link>
          </>
        ) : (
          <>
            <h1 className="mb-4 text-xl font-semibold">
              Liên kết không hợp lệ
            </h1>
            <p className="mb-6">
              Liên kết xác nhận không hợp lệ hoặc đã hết hạn.
            </p>
            <Link
              to="/login"
              className="inline-block rounded bg-primary px-4 py-2 text-white"
            >
              Quay lại đăng nhập
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
