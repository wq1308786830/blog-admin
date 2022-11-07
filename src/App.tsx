import React from 'react';
import loadable from 'react-loadable';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import { Spin } from 'antd';
import './App.scss';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

const Loading = () => (
  <div className="loading">
    <Spin size="large" />
  </div>
);

const AdminMain = loadable({
  loader: () => import('./pages/Main'),
  loading: Loading
});

const Login = loadable({
  loader: () => import('./pages/Login'),
  loading: Loading
});

export const PrivateRoute = () => {
  if (localStorage.getItem('user')) {
    return <AdminMain />;
  }

  return <Login />;
};

const routers = createBrowserRouter([
  { path: '/', element: <AdminMain />},
  { path: '/admin', element: <PrivateRoute /> },
  { path: '/loginAdmin', element: <Login /> },
]);

function App() {
  return (
    <RouterProvider router={routers} />
  );
}

export default App;
