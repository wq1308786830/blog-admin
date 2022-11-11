import React, { useState } from 'react';
import { Breadcrumb, Layout, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import {
  DesktopOutlined,
  FileOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import './index.scss';

const { Header, Content, Footer, Sider } = Layout;

function Index() {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => {
    setCollapsed((prev) => !prev);
  };
  return (
    <Layout className="AdminMain" style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Menu
          items={[
            {
              key: '1',
              label: (
                <Link to="articleListManage">
                  <PieChartOutlined />
                  <span>首页</span>
                </Link>
              ),
            },
            {
              key: '2',
              label: (
                <Link to="articleEdit">
                  <DesktopOutlined />
                  <span>资源管理</span>
                </Link>
              ),
            },
            {
              key: '3',
              label: (
                <Link to="categoryManage">
                  <FileOutlined />
                  <span>类目管理</span>
                </Link>
              ),
            },
          ]}
          theme="light"
          defaultSelectedKeys={['1']}
          mode="inline"
          style={{ height: '100%' }}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }}>
          {collapsed ? (
            <MenuUnfoldOutlined className="trigger" onClick={toggle} />
          ) : (
            <MenuFoldOutlined className="trigger" onClick={toggle} />
          )}
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} />
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Russell ©2018</Footer>
      </Layout>
    </Layout>
  );
}

export default Index;
