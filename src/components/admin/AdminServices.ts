import {
  AfterLogin,
  DeptService,
  MenuService,
  ParamService,
  RoleService,
  UserService,
  DictService,
  DomainService,
  LoginService,
  AttachmentService,
  LoginInfo,
  SpringBootClient,
} from '../../services/';
import { MobxDomainStore } from '../../stores';
import { EntityListProps } from '../layout';

export class AdminServices {
  userService: UserService;
  roleService: RoleService;
  paramService: ParamService;
  noteService: DomainService;
  menuService: MenuService;
  deptService: DeptService;
  userRoleService: DomainService;
  dictService: DictService;
  loginService: LoginService;
  attachmentService: AttachmentService;

  constructor(restClient: SpringBootClient, afterLogin: AfterLogin, initServices: Partial<AdminServices> = {}) {
    this.paramService = new ParamService(restClient);
    this.noteService = new DomainService({ domain: 'note', storeClass: MobxDomainStore, restClient });
    this.userRoleService = new DomainService({ domain: 'userRole', storeClass: MobxDomainStore, restClient });
    this.roleService = new RoleService(restClient);
    this.menuService = new MenuService(restClient);
    //userService支持替换
    this.userService = initServices.userService || new UserService(restClient);
    //deptService支持替换
    this.deptService = initServices.deptService || new DeptService(restClient);
    this.dictService = new DictService(restClient);
    //外部设置的afterLogin必须首先执行，需要设置安全认证header
    this.loginService = new LoginService(restClient, [afterLogin, this.afterLogin.bind(this)]);
    this.attachmentService = new AttachmentService(restClient);
  }

  afterLogin(loginInfo: LoginInfo) {
    const funs: Promise<any>[] = [];
    for (const s of Object.values(this)) {
      if (s instanceof DomainService && s.afterLogin) funs.push(s.afterLogin(loginInfo));
    }
    funs.push(this.menuService.getMenuTree());
    return Promise.all(funs);
  }
}

export interface AdminPageProps extends EntityListProps {
  services: AdminServices;
}
