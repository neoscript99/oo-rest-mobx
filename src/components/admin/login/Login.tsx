import React, { Component, FormEvent, ReactNode } from 'react';
import { Form, Icon, Input, Button, Checkbox, Spin, Dropdown, Menu } from 'antd';
import { observer } from 'mobx-react';
import { FormComponentProps } from 'antd/lib/form';
import { AdminServices } from '../AdminServices';
import { LoginPage, LoginBox, LoginBoxTitle, LoginBoxItem } from './LoginStyled';
import { RouteComponentProps } from 'react-router';
import { ClickParam } from 'antd/lib/menu';
import { ReactUtil } from '../../../utils/ReactUtil';
import { commonRules, StringUtil } from '../../../utils';

export interface LoginFormProps {
  adminServices: AdminServices;
  title: ReactNode;
  introRender: ReactNode;
  backgroundImage?: any;
  demoUsers?: any[];
}
interface S {
  kaptchaId: string;
  kaptchaFree: boolean;
}

/**
 * 通过kaptchaFree方法检查当前用户名、客户端IP是否需要验证码
 * 如果需要，客户端要展示验证码，输入后传给后台
 */
@observer
class LoginForm extends Component<LoginFormProps & FormComponentProps & RouteComponentProps, S> {
  state = { kaptchaId: 'none', kaptchaFree: true };
  componentDidMount(): void {
    this.checkKaptchaFree();
  }

  componentDidUpdate() {
    const { history } = this.props;
    const { lastRoutePath, loginInfo } = this.store;
    if (loginInfo.success) history.push(lastRoutePath);
  }

  handleSubmit(e?: FormEvent) {
    e && e.preventDefault();
    const { form, adminServices } = this.props;
    //登录前再检查是否需要验证码
    form.validateFields(async (err, values) => {
      if (err) return;
      const loginInfo = await adminServices.loginService.login(values);
      if (!loginInfo.success) {
        this.setState({ kaptchaFree: !!loginInfo.kaptchaFree });
        this.refreshKaptchaId();
      }
    });
  }

  demoUserClick = ({ key }: ClickParam) => {
    const { adminServices, demoUsers } = this.props;
    const item = demoUsers!.find(user => user.username === key);
    adminServices.loginService.loginHash(item);
  };

  refreshKaptchaId() {
    this.setState({ kaptchaId: StringUtil.randomString() });
  }

  /**
   * 检查当前状态是否需要验证码
   */
  async checkKaptchaFree() {
    const { form, adminServices } = this.props;
    const res = await adminServices.loginService.kaptchaFree(form.getFieldValue('username'));
    if (!this.store.loginInfo.success) this.setState({ kaptchaFree: res.success });
  }
  get store() {
    return this.props.adminServices.loginService.store;
  }
  render() {
    const {
      form: { getFieldDecorator },
      adminServices: {
        loginService: { kaptchaRenderURL },
      },
    } = this.props;
    const { casConfig, loginInfo } = this.store;
    const { title, introRender, backgroundImage, demoUsers } = this.props;

    if (loginInfo.success) return null;

    if (casConfig.clientEnabled) return <Spin />;
    const css = { color: 'rgba(0,0,0,.25)' };
    const { kaptchaId, kaptchaFree } = this.state;
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
                    prefix={<Icon type="user" style={css} />}
                    size="large"
                    autoComplete="username"
                    onBlur={this.checkKaptchaFree.bind(this)}
                  />,
                )}
              </Form.Item>
              <Form.Item label="密码">
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '密码不能为空!' }],
                })(
                  <Input
                    prefix={<Icon type="lock" style={css} />}
                    type="password"
                    size="large"
                    autoComplete="password"
                  />,
                )}
              </Form.Item>
              {!kaptchaFree && (
                <Form.Item label="验证码">
                  {getFieldDecorator('kaptchaCode', {
                    rules: [commonRules.required],
                  })(
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Input prefix={<Icon type="code" style={css} />} maxLength={4} size="large" />
                      <img
                        src={`${kaptchaRenderURL}/${kaptchaId}`}
                        height={36}
                        style={{ marginLeft: 5 }}
                        onClick={this.refreshKaptchaId.bind(this)}
                      />
                    </div>,
                  )}
                </Form.Item>
              )}
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
