import React, {useState} from 'react';
import {Breadcrumb, Layout, Menu} from "antd";
import {Link, Route, Routes} from "react-router-dom";
import ArticleListManage from "../ArticleListManage";
import ArticleEdit from "../ArticleEdit";
import CategoryManage from "../CategoryManage";
import {DesktopOutlined, DownOutlined, FileOutlined, PieChartOutlined, UpOutlined} from "@ant-design/icons";
const { Header, Content, Footer, Sider } = Layout;

function Index() {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => {
    setCollapsed(prev => !prev);
  };
  return (
    <Layout className="AdminMain" style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Menu theme="light" defaultSelectedKeys={['1']} mode="inline" style={{ height: '100%' }}>
          <Menu.Item key="1">
            <Link to="./admin/articleListManage">
              <PieChartOutlined />
              <span>首页</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="./admin/articleEdit">
              <DesktopOutlined />
              <span>资源管理</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="9">
            <Link to="./admin/categoryManage">
              <FileOutlined />
              <span>类目管理</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }}>
          {collapsed ? <UpOutlined className="trigger" onClick={toggle} /> : <DownOutlined className="trigger" onClick={toggle} />}
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} />
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Routes>
              <Route path="/admin/articleListManage" element={<ArticleListManage />} />
              <Route
                path="/admin/articleEdit/:categoryId/:articleId"
                element={<ArticleEdit />}
              />
              <Route path="/admin/articleEdit" element={<ArticleEdit />} />
              <Route path="/admin/categoryManage" element={<CategoryManage />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Russell ©2018</Footer>
      </Layout>
    </Layout>
  );
}

export default Index;
