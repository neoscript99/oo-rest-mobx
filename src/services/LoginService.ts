import { message } from 'antd';
import { DeptEntity, ResBean, SpringBootClient, SpringErrorHandler, UserEntity } from './index';
import { StringUtil } from '../utils';
import { LoginStore } from '../stores/LoginStore';
import { RestService } from './RestService';

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
  roles?: string[];
  authorities?: string[];
  kaptchaFree?: boolean;
}

export interface CasConfig {
  clientEnabled: boolean;
  casServerRoot?: string;
  defaultRoles?: string;
}

/**
 * 如果返回promise，在登录后将被await顺序执行
 * 如不依赖其它数据，可不将promise返回
 */
export interface AfterLogin {
  (loginInfo: LoginInfo): Promise<any>;
}

export interface LoginEntity {
  username: string;
  password: string;
  passwordHash?: string;
  kaptchaCode?: string;
  remember?: boolean;
}
const USERNAME_KEY = 'loginUsername';
const PASSWORD_KEY = 'loginPassword';
const LOGOUT_ERRORS = ['NoUser', 'NoToken'];
export class LoginService extends RestService {
  store = new LoginStore();
  //用户的初始化密码，可在new LoginService的时候修改
  //如果用户密码登录初始密码，跳转到密码修改页面
  initPassword = 'abc000';

  constructor(restClient: SpringBootClient, private afterLogins: AfterLogin[]) {
    super(restClient);
    restClient.registerErrorHandler(this.springErrorHandler);
    //cas默认为true，初始化时去获取服务端的配置信息，如果为false，再显示登录界面
    this.getCasConfig();
  }
  springErrorHandler: SpringErrorHandler = (e) => {
    if (e.errorCode && LOGOUT_ERRORS.includes(e.errorCode)) this.store.loginInfo = { success: false };
  };
  getApiUri(operator: string) {
    return `/api/login/${operator}`;
  }

  get kaptchaRenderURL() {
    return this.restClient.fetchOptions.rootUrl + this.getApiUri('kaptcha');
  }
  kaptchaFree(username: string): Promise<ResBean> {
    return this.postApi('kaptchaFree', { username });
  }
  login(loginEntity: LoginEntity): Promise<LoginInfo> {
    return this.loginHash({ ...loginEntity, passwordHash: StringUtil.sha256(loginEntity.password) });
  }

  loginHash({ username, passwordHash, kaptchaCode, remember }: LoginEntity): Promise<LoginInfo> {
    this.clearLoginInfoLocal();
    return this.postApi('login', { username, passwordHash, kaptchaCode }).then((loginInfo) => {
      if (loginInfo.success) {
        //如果密码等于初始密码，强制修改
        if (passwordHash === this.initPasswordHash) {
          this.store.forcePasswordChange = true;
          message.warn('请修改初始密码');
        }
        if (remember) this.saveLoginInfoLocal(username, passwordHash!);
      } else message.error(loginInfo.error);
      this.doAfterLogin(loginInfo);
      return loginInfo;
    });
  }

  tryLocalLogin() {
    const { username, password } = this.getLoginInfoLocal();
    if (username && password) this.loginHash({ username, password, passwordHash: password, remember: true });
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
    return this.postApi('sessionLogin').then((data) => {
      this.doAfterLogin(data);
      return data;
    });
  }

  logout() {
    return this.postApi('logout');
  }

  getCasConfig(): Promise<CasConfig> {
    return this.postApi('getCasConfig').then((data) => {
      this.store.casConfig = data;
      return data;
    });
  }

  devLogin(account: string, token: string) {
    const dept: DeptEntity = { name: 'not important', seq: 1, enabled: true };
    this.doAfterLogin({ user: { account, dept }, account, token, success: true, roles: ['Public'] });
  }

  async doAfterLogin(loginInfo: LoginInfo) {
    if (loginInfo.success) {
      //cas登录，可以不要求必须存在数据库user
      if (!loginInfo.user)
        loginInfo.user = { account: loginInfo.account || '', dept: { name: '外部临时用户', seq: 0, enabled: true } };
      for (const fun of this.afterLogins) await fun(loginInfo);
    } else {
      console.debug('LoginService.doAfterLogin: ', loginInfo.error);
    }
    //等待上面的初始化操作全部执行后
    //store信息最后更新，触发界面刷新，保证初始化已完成
    this.store.loginInfo = loginInfo;
    return loginInfo;
  }

  hasRole(role: string): boolean {
    const { loginInfo } = this.store;
    if (loginInfo.roles) return loginInfo.roles.includes(role);
    else return false;
  }

  get user() {
    return this.store.loginInfo?.user;
  }

  get dept() {
    return this.store.loginInfo?.user?.dept;
  }

  get initPasswordHash() {
    return StringUtil.sha256(this.initPassword);
  }
}
