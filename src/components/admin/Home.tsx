import React, { Component, ComponentType, ReactNode } from 'react';
import { Avatar, Button, Layout, Popover } from 'antd';
import { observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import { MenuEntity } from '../../stores';
import { AdminServices } from './AdminServices';
import { MenuTree } from '../layout';

const { Header, Content, Footer, Sider } = Layout;

const headCss: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: '#fff',
  boxShadow: '0 2px 8px #f0f1f2',
  fontWeight: 'bolder',
};
const contentCss: React.CSSProperties = {
  margin: '0.8rem',
  padding: '1rem',
  background: '#fff',
  height: '100%',
  minHeight: 360,
};
export interface HomeProps extends RouteComponentProps {
  serverLogout: boolean;
  serverRoot: string;
  adminServices: AdminServices;
  logoRender: ReactNode;
  footRender: ReactNode;
  PageSwitch: ComponentType<PageSwitchProps>;
  loginPath: string;
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

  render() {
    const {
      adminServices: { menuService, loginService },
      location,
      match,
      logoRender,
      PageSwitch,
      loginPath,
      history,
      footRender,
    } = this.props;
    const pathPrefix = match.path;
    const { store: menuStore } = menuService;
    const { loginInfo } = loginService.store;
    if (!loginInfo.success) {
      loginService.store.lastRoutePath = location.pathname;
      history.push(loginPath);
      return null;
    }
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={headCss}>
          {logoRender}
          <div>
            <Avatar icon="user" style={{ backgroundColor: '#f56a00' }} />
            <Popover
              content={
                <Button type="link" onClick={this.logout.bind(this)}>
                  退出系统
                </Button>
              }
              placement="bottom"
              trigger="hover"
            >
              <span style={{ margin: '0 0.5rem', lineHeight: '1.2rem' }}>{loginInfo.account}</span>
            </Popover>
          </div>
        </Header>
        <Layout hasSider>
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
            theme="light"
            style={{ borderTop: 'solid thin #f3f3f3', borderBottom: 'solid thin #f3f3f3' }}
          >
            <MenuTree rootMenu={menuStore.menuTree} menuClick={this.onMenuClick} />
          </Sider>
          <Layout>
            <Content style={contentCss}>
              <PageSwitch pathPrefix={pathPrefix} />
            </Content>
            <Footer style={{ textAlign: 'center' }}>{footRender}</Footer>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}
