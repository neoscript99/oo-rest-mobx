import React, { Component, ComponentType, ReactNode } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Layout, Popover } from 'antd';
import { observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import { MenuEntity, AdminServices } from '../../services';
import { MenuTree } from '../layout';

const { Header, Content, Footer, Sider } = Layout;

export interface HomeProps extends RouteComponentProps {
  serverLogout: boolean;
  serverRoot: string;
  adminServices: AdminServices;
  logoRender: ReactNode;
  footRender: ReactNode;
  PageSwitch: ComponentType<PageSwitchProps>;
  loginPath: string;
  profilePath?: string;
  headerCss?: React.CSSProperties;
  contentCss?: React.CSSProperties;
  siderCss?: React.CSSProperties;
}

export interface PageSwitchProps {
  pathPrefix: string;
}

@observer
export class Home extends Component<HomeProps, { collapsed: boolean }> {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed: boolean) => {
    this.setState({ collapsed });
  };

  onMenuClick = (menu: MenuEntity) => {
    const { match, history } = this.props;
    history.push(`${match.path}${menu.app}`);
  };

  logout() {
    const {
      serverLogout,
      serverRoot,
      adminServices: { loginService },
    } = this.props;
    loginService.clearLoginInfoLocal();
    if (serverLogout) window.location.href = `${serverRoot}/logout`;
    else {
      loginService.logout();
      //清除store缓存信息,例如needRefresh等
      window.location.reload();
    }
  }

  goProfile(): boolean {
    const { location, history, profilePath } = this.props;
    const pathname = profilePath || '/Profile';
    if (location.pathname !== pathname) {
      console.debug('Home.goProfile: ', location.pathname, pathname);
      history.push(pathname);
      return true;
    }
    return false;
  }
  render() {
    const { adminServices, location, match, PageSwitch, loginPath, history } = this.props;
    const { logoRender, footRender, headerCss, contentCss, siderCss } = this.props;
    const { menuService, loginService, paramService } = adminServices;
    const pathPrefix = match.path;
    const { store: menuStore } = menuService;
    const { loginInfo } = loginService.store;
    if (!loginInfo.success) {
      loginService.store.lastRoutePath = location.pathname;
      history.push(loginPath);
      return null;
    } else if (
      loginService.store.forcePasswordChange &&
      paramService.getByCode('ChangeInitPassword')?.value === 'true' &&
      this.goProfile()
    ) {
      return null;
    }
    const buttonCss: React.CSSProperties = { padding: '3px' };
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fff',
            boxShadow: '0 2px 8px #f0f1f2',
            fontWeight: 'bolder',
            padding: '0 16px',
            ...headerCss,
          }}
        >
          {logoRender}
          <div>
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#f56a00' }} />
            <div style={{ display: 'inline-block' }}>
              <span style={{ marginLeft: '0.5rem', lineHeight: '1.2rem' }}>{loginInfo.account}(</span>
              <Button type="link" onClick={this.goProfile.bind(this)} style={buttonCss}>
                个人设置
              </Button>
              <span>/</span>
              <Button type="link" onClick={this.logout.bind(this)} style={buttonCss}>
                退出系统
              </Button>
              <span>)</span>
            </div>
          </div>
        </Header>
        <Layout hasSider>
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
            theme="light"
            style={{ borderTop: 'solid thin #f3f3f3', borderBottom: 'solid thin #f3f3f3', ...siderCss }}
          >
            <MenuTree rootMenu={menuStore.menuTree} menuClick={this.onMenuClick} />
          </Sider>
          <Layout>
            <Content
              style={{
                margin: '0.8rem',
                padding: '1rem',
                background: '#fff',
                height: '100%',
                minHeight: 360,
                ...contentCss,
              }}
            >
              <PageSwitch pathPrefix={pathPrefix} />
            </Content>
            <Footer style={{ textAlign: 'center' }}>{footRender}</Footer>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}
