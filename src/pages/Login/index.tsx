import React from 'react';
import { Card, Col, Form, Layout, Row } from 'antd';
import NormalLoginForm from './NormalLoginForm';

import './index.scss';


function Login() {
  const [form] = Form.useForm();
  return (
    <Layout className="Login gradient-bg">
      <div className="back-img">
        <Row className="form-container">
          <Col span={6} offset={18}>
            <Card style={{ width: 350 }} className="Card">
              <NormalLoginForm form={form} />
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
}

export default Login;
