import React, { Component, FormEvent, ReactNode } from 'react';
import { Form, Icon, Input, Button, Checkbox, Spin } from 'antd';
import { observer } from 'mobx-react';
import { FormComponentProps } from 'antd/lib/form';
import { AdminServices } from '../AdminServices';
import { LoginPage, LoginBox, LoginBoxTitle, LoginBoxItem } from './LoginStyled';
import { RouteComponentProps } from 'react-router';

export interface LoginFormProps extends FormComponentProps, RouteComponentProps {
  adminServices: AdminServices;
  title: ReactNode;
  introRender: ReactNode;
}

@observer
class LoginForm extends Component<LoginFormProps> {
  componentDidUpdate() {
    const {
      adminServices: {
        loginService: {
          store: { lastRoutePath, loginInfo },
        },
      },
      history,
    } = this.props;
    if (loginInfo.success) history.push(lastRoutePath);
  }

  handleSubmit(e: FormEvent) {
    e.preventDefault();
    const {
      form: { validateFields },
      adminServices: { loginService },
    } = this.props;
    validateFields((err, values) => err || loginService.login(values.username, values.password, values.remember));
  }

  render() {
    const {
      form: { getFieldDecorator },
      adminServices: {
        loginService: {
          store: { casConfig, loginInfo },
        },
      },
      title,
      introRender,
    } = this.props;

    if (loginInfo.success) return null;

    if (casConfig.clientEnabled) return <Spin />;

    return (
      <LoginPage>
        <LoginBox>
          <LoginBoxItem>
            <LoginBoxTitle>{title}</LoginBoxTitle>
            {introRender}
          </LoginBoxItem>
          <LoginBoxItem>
            <Form onSubmit={this.handleSubmit.bind(this)} style={{ maxWidth: '300px' }}>
              <Form.Item>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: '用户名不能为空!' }],
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="用户名"
                    size="large"
                    autoComplete="username"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '密码不能为空!' }],
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    size="large"
                    autoComplete="password"
                    placeholder="密码"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(<Checkbox>自动登录</Checkbox>)}
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                  登录
                </Button>
              </Form.Item>
            </Form>
          </LoginBoxItem>
        </LoginBox>
      </LoginPage>
    );
  }
}

export const Login = Form.create({ name: 'normal_login' })(LoginForm);
