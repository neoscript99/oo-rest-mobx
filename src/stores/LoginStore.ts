import { observable } from 'mobx';
import { CasConfig, LoginInfo } from '../services';

export class LoginStore {
  @observable
  lastRoutePath = '/';
  @observable
  //clientEnabled默认为true，不显示登录框，后台查询如果为false，再显示出来
  casConfig: CasConfig = { clientEnabled: true };
  @observable
  loginInfo: LoginInfo = { success: false };
  @observable
  forcePasswordChange = false;
}
