import React from 'react';
import loadable from 'react-loadable';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Spin } from 'antd';
import moment from 'moment';
// import AdminMain from "./pages/Main";
// import ArticleListManage from "./pages/ArticleListManage";
// import ArticleEdit from "./pages/ArticleEdit";
// import CategoryManage from "./pages/CategoryManage";
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

const Login = loadable({
  loader: () => import('./pages/Login'),
  loading: Loading,
});

const AdminMain = loadable({
  loader: () => import('./pages/Main'),
  loading: Loading,
});

const ArticleListManage = loadable({
  loader: () => import('./pages/ArticleListManage'),
  loading: Loading,
});

const ArticleEdit = loadable({
  loader: () => import('./pages/ArticleEdit'),
  loading: Loading,
});

const CategoryManage = loadable({
  loader: () => import('./pages/CategoryManage'),
  loading: Loading,
});

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
  return <RouterProvider router={routers} />;
}

export default App;
