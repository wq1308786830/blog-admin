import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Loader } from '@/components/ui/loader';
import './App.scss';

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader size="lg" />
    </div>
  );
}

const Login = lazy(() => import('./pages/Login'));
const AdminMain = lazy(() => import('./pages/Main'));
const ArticleListManage = lazy(() => import('./pages/ArticleListManage'));
const ArticleEdit = lazy(() => import('./pages/ArticleEdit'));
const CategoryManage = lazy(() => import('./pages/CategoryManage'));

export function PrivateRoute() {
  if (localStorage.getItem('user')) {
    return <AdminMain />;
  }

  return <Login />;
}

const routers = createBrowserRouter([
  {
    path: '',
    element: <AdminMain />,
    children: [
      { path: 'articleListManage', element: <ArticleListManage /> },
      { path: 'articleEdit/:categoryId/:articleId', element: <ArticleEdit /> },
      { path: 'articleEdit', element: <ArticleEdit /> },
      { path: 'categoryManage', element: <CategoryManage /> },
    ],
  },
  { path: 'login', element: <Login /> },
]);

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={routers} />
    </Suspense>
  );
}

export default App;
