import React, { Component, FormEvent, ReactNode } from 'react';
import { Form, Icon, Input, Button, Checkbox, Spin, Dropdown, Menu } from 'antd';
import { observer } from 'mobx-react';
import { FormComponentProps } from 'antd/lib/form';
import { AdminServices } from '../AdminServices';
import { LoginPage, LoginBox, LoginBoxTitle, LoginBoxItem } from './LoginStyled';
import { RouteComponentProps } from 'react-router';
import { ClickParam } from 'antd/lib/menu';
import { ReactUtil } from '../../../utils/ReactUtil';

export interface LoginFormProps {
  adminServices: AdminServices;
  title: ReactNode;
  introRender: ReactNode;
  backgroundImage?: any;
  demoUsers?: any[];
}

@observer
class LoginForm extends Component<LoginFormProps & FormComponentProps & RouteComponentProps> {
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

  handleSubmit(e?: FormEvent) {
    e && e.preventDefault();
    const {
      form: { validateFields },
      adminServices: { loginService },
    } = this.props;
    validateFields((err, values) => err || loginService.login(values.username, values.password, values.remember));
  }

  demoUserClick = ({ key }: ClickParam) => {
    const {
      adminServices: { loginService },
      demoUsers,
    } = this.props;
    const item = demoUsers!.find(user => user.username === key);
    loginService.login(item.username, item.password);
  };
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
      backgroundImage,
      demoUsers,
    } = this.props;

    if (loginInfo.success) return null;

    if (casConfig.clientEnabled) return <Spin />;

    return (
      <LoginPage style={{ backgroundImage: backgroundImage }}>
        <LoginBox>
          <LoginBoxItem>
            <LoginBoxTitle>{title}</LoginBoxTitle>
            {introRender}
          </LoginBoxItem>
          <LoginBoxItem>
            <Form onSubmit={this.handleSubmit.bind(this)} style={{ maxWidth: '300px' }}>
              <Form.Item label="用户名">
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: '用户名不能为空!' }],
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    size="large"
                    autoComplete="username"
                  />,
                )}
              </Form.Item>
              <Form.Item label="密码">
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '密码不能为空!' }],
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    size="large"
                    autoComplete="password"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: true,
                  })(<Checkbox>自动登录</Checkbox>)}
                  {demoUsers && <DemoUserDropdown demoUsers={demoUsers} demoUserClick={this.demoUserClick} />}
                </div>
                <Button type="primary" htmlType="submit" style={{ width: '100%', marginTop: 10 }}>
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

export const Login = ReactUtil.formWrapper(LoginForm);
interface DemoUserDropdownProps {
  demoUsers: any[];
  demoUserClick: (param: ClickParam) => void;
}

const DemoUserDropdown = (props: DemoUserDropdownProps) => {
  const { demoUsers, demoUserClick } = props;
  return (
    <Dropdown
      trigger={['click']}
      overlay={
        <Menu onClick={demoUserClick}>
          {demoUsers.map(user => (
            <Menu.Item key={user.username}>
              {user.name}({user.username})
            </Menu.Item>
          ))}
        </Menu>
      }
    >
      <Button size="small">
        演示登录 <Icon type="down" />
      </Button>
    </Dropdown>
  );
};
