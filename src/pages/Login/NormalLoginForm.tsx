import React from 'react';
import history from 'history/browser';
import { Button, Checkbox, Form, Input, message, FormInstance } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import Recaptcha from 'react-recaptcha';
import AdminServices from '@/services/AdminServices';
import './index.scss';

interface NormalLoginFormProps {
  form: FormInstance;
}
function NormalLoginForm(props: NormalLoginFormProps) {
  const { form } = props;
  const handleSubmit = async () => {
    const values = await form.validateFields();
    const resp: any = await AdminServices.login(values).catch((error: any) => {
      error.response
        .json()
        .then((data: any) => message.error(`错误${data.response.status}：${data.msg}`));
    });
    if (resp.success) {
      localStorage.setItem('user', '1');
      history.push('/admin');
    } else {
      message.error(`错误：${resp.msg}`);
    }
  };

  const onloadCallback = () => {
    window.console.log('Done!!!');
  };

  const verifyCallback = (resp: any) => {
    window.console.log(resp);
  };

  return (
    <Form className="login-form">
      <Form.Item name="user_name" rules={[{ required: true, message: '请输入用户名!' }]}>
        <Input
          prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder="用户名"
        />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
        <Input
          prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          type="password"
          placeholder="密码"
        />
      </Form.Item>
      <Form.Item name="remember" initialValue>
        、<Checkbox>记住我</Checkbox>
      </Form.Item>
      <Button className="login-form-forgot">忘记密码？</Button>
      <Button type="primary" onClick={handleSubmit} className="login-form-button">
        登录
      </Button>
      <Recaptcha
        sitekey="6LfEhDwUAAAAAPEPGFpooDYCHBczNAUu90medQoD"
        render="explicit"
        verifyCallback={verifyCallback}
        onloadCallback={onloadCallback}
        type="image"
        hl="zh-CN"
      />
    </Form>
  );
}

export default NormalLoginForm;
