import NotFound from '@/pages/not-found';
import { Suspense, lazy } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
// import ProtectedRoute from './ProtectedRoute';

const DashboardLayout = lazy(
  () => import('@/components/layout/dashboard-layout')
);

const SignInPage = lazy(() => import('@/pages/auth/signin'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/reset-password'));
const ConfirmEmailPage = lazy(() => import('@/pages/auth/confirm-email'));
const HomePage = lazy(() => import('@/pages/HomePage/index'));
const RegisterPage = lazy(() => import('@/pages/auth/register'));
// ----------------------------------------------------------------------

export default function AppRouter() {
  const dashboardRoutes = [
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          path: '/',
          element: <HomePage />,
          index: true
        }
      ]
    }
  ];

  const publicRoutes = [
    {
      path: '/login',
      element: <SignInPage />,
      index: true
    },
    {
      path: '/register',
      element: <RegisterPage />
    },
    {
      path: '/reset-password',
      element: <ResetPasswordPage />
    },
    {
      path: '/forgot-password',
      element: <ResetPasswordPage />
    },
    {
      path: '/auth/confirm-email',
      element: <ConfirmEmailPage />
    },
    {
      path: '/confirm-email', // optional alias
      element: <ConfirmEmailPage />
    },
    {
      path: '/404',
      element: <NotFound />
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />
    }
  ];

  const routes = useRoutes([...dashboardRoutes, ...publicRoutes]);

  return routes;
}
