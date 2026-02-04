import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Loader } from '@/components/ui/loader';
import { ProtectedRoute, PublicRoute } from '@/components/ProtectedRoute';
import './App.scss';

function Loading() {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      role="status"
      aria-label="Loading application"
    >
      <Loader size="lg" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

const Login = lazy(() => import('./pages/Login'));
const AdminMain = lazy(() => import('./pages/Main'));
const ArticleListManage = lazy(() => import('./pages/ArticleListManage'));
const ArticleEdit = lazy(() => import('./pages/ArticleEdit'));
const CategoryManage = lazy(() => import('./pages/CategoryManage'));

const routers = createBrowserRouter([
  {
    path: 'login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '',
    element: (
      <ProtectedRoute>
        <AdminMain />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/articleListManage" replace /> },
      { path: 'articleListManage', element: <ArticleListManage /> },
      { path: 'articleEdit/:categoryId/:articleId', element: <ArticleEdit /> },
      { path: 'articleEdit', element: <ArticleEdit /> },
      { path: 'categoryManage', element: <CategoryManage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={routers} />
    </Suspense>
  );
}

export default App;
