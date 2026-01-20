import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Spin } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './App.scss';

moment.locale('zh-cn');

function Loading() {
  return (
    <div className="loading">
      <Spin size="large" />
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
