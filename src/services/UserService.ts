import { sha256 } from 'js-sha256';
import { message } from 'antd';
import { UserStore } from '../stores';
import { AbstractClient, DomainService, Entity } from './index';
import { observable } from 'mobx';

export interface UserEntity extends Entity {
  account: string;
  name?: string;
  dept?: any;
}

/**
 * 如果是系统自己认证：user 有 ， account 有
 * 如果接入了cas认证：account 有， user 不一定有
 */
export interface LoginInfo {
  success: boolean;
  token?: string;
  user?: UserEntity;
  account?: string;
  error?: string;
  roles?: string;
}

export interface CasConfig {
  clientEnabled: boolean;
  casServerRoot?: string;
  defaultRoles?: string;
}

export interface AfterLogin {
  (loginInfo: LoginInfo): void;
}

const USERNAME_KEY = 'loginUsername';
const PASSWORD_KEY = 'loginPassword';
export interface UserFormService {
  saveUserRoles(user: Entity, roleIds: string[]);
}
export class UserService extends DomainService<UserStore> implements UserFormService {
  constructor(restClient: AbstractClient, private afterLogins?: AfterLogin[]) {
    super({ domain: 'user', storeClass: UserStore, restClient });
    //cas默认为true，初始化时去获取服务端的配置信息，如果为false，再显示登录界面
    this.getCasConfig();
  }

  login(username: string, password: string, remember = false): Promise<LoginInfo> {
    return this.loginHash(username, sha256(password), remember);
  }

  loginHash(username: string, passwordHash: string, remember = false): Promise<LoginInfo> {
    return this.restClient.post(this.getApiUri('login'), { username, passwordHash }).then(data => {
      const loginInfo = data;
      this.store.loginInfo = loginInfo;
      if (loginInfo.success) {
        this.doAfterLogin(loginInfo);
        this.changeCurrentItem(loginInfo.user as Entity);
        if (remember) this.saveLoginInfoLocal(username, passwordHash);
      } else {
        message.info(loginInfo.error);
        this.clearLoginInfoLocal();
      }
      return loginInfo;
    });
  }

  tryLocalLogin() {
    const info = this.getLoginInfoLocal();
    if (info.username && info.password) this.loginHash(info.username, info.password);
  }

  saveLoginInfoLocal(username: string, password: string) {
    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(PASSWORD_KEY, password);
  }

  clearLoginInfoLocal() {
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(PASSWORD_KEY);
    this.store.loginInfo = { success: false };
    this.store.lastRoutePath = '/';
  }

  getLoginInfoLocal() {
    return {
      username: localStorage.getItem(USERNAME_KEY),
      password: localStorage.getItem(PASSWORD_KEY),
    };
  }

  trySessionLogin(): Promise<LoginInfo> {
    return this.restClient.post(this.getApiUri('sessionLogin')).then(data => {
      const loginInfo = data;
      this.store.loginInfo = loginInfo;
      if (loginInfo.success) {
        loginInfo.user = loginInfo.user || { account: loginInfo.account || '' };
        this.doAfterLogin(loginInfo);
        this.changeCurrentItem(loginInfo.user);
      } else {
        console.debug(loginInfo.error);
      }
      return loginInfo;
    });
  }

  logout() {
    return this.restClient.post(this.getApiUri('logout'));
  }

  getCasConfig(): Promise<CasConfig> {
    return this.restClient.post(this.getApiUri('getCasConfig')).then(data => {
      this.store.casConfig = data;
      return data;
    });
  }

  devLogin(account: string, token: string) {
    this.changeCurrentItem({ account, token });
    this.doAfterLogin({ user: { account }, account, token, success: true, roles: 'Public' });
  }

  doAfterLogin(loginInfo: LoginInfo) {
    this.afterLogins && this.afterLogins.forEach(afterLogin => afterLogin(loginInfo));
  }

  saveUserRoles(user: Entity, roleIds: string[]) {
    return this.restClient.post(this.getApiUri('saveWithRoles'), { user, roleIds });
  }
  resetPassword(user: Entity, passwordHash: string) {
    return this.restClient.post(this.getApiUri('resetPassword'), { userId: user.id, passwordHash });
  }
}
