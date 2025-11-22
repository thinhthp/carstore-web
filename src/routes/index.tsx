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
// Dashboard entity pages (Carstore CRUD)
const DashboardMainPage = lazy(() => import('@/pages/dashboard/main'));
const BrandsPage = lazy(() => import('@/pages/dashboard/brands'));
const ModelsPage = lazy(() => import('@/pages/dashboard/models'));
const VariantsPage = lazy(() => import('@/pages/dashboard/variants'));
const DealersPage = lazy(() => import('@/pages/dashboard/dealers'));
const InventoriesPage = lazy(() => import('@/pages/dashboard/inventories'));
const CustomersPage = lazy(() => import('@/pages/dashboard/customers'));
const OrdersPage = lazy(() => import('@/pages/dashboard/orders'));
const PaymentsPage = lazy(() => import('@/pages/dashboard/payments'));
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
        { path: '/dashboard', element: <DashboardMainPage /> },
        { path: '/dashboard/brands', element: <BrandsPage /> },
        { path: '/dashboard/models', element: <ModelsPage /> },
        { path: '/dashboard/variants', element: <VariantsPage /> },
        { path: '/dashboard/dealers', element: <DealersPage /> },
        { path: '/dashboard/inventories', element: <InventoriesPage /> },
        { path: '/dashboard/customers', element: <CustomersPage /> },
        { path: '/dashboard/orders', element: <OrdersPage /> },
        { path: '/dashboard/payments', element: <PaymentsPage /> }
      ]
    }
  ];

  const publicRoutes = [
    {
      path: '/',
      element: <Navigate to="/dashboard" replace />
    },
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
