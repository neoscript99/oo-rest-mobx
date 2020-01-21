import {
  AfterLogin,
  DeptService,
  MenuService,
  ParamService,
  RoleService,
  UserService,
  DictService,
  DomainService,
  AbstractClient,
  LoginService,
  AttachmentService,
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

  constructor(restClient: AbstractClient, afterLogin: AfterLogin, initServices: Partial<AdminServices> = {}) {
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
    this.loginService = new LoginService(restClient, [this.afterLogin.bind(this), afterLogin]);
    this.attachmentService = new AttachmentService(restClient);
  }

  afterLogin() {
    this.paramService.initDictList();
    this.deptService.initDictList();
    this.roleService.initDictList();
    this.dictService.initDictList();
    this.menuService.getMenuTree();
  }
}

export interface AdminPageProps extends EntityListProps {
  services: AdminServices;
}
