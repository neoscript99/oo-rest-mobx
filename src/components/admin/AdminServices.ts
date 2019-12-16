import {
  AfterLogin,
  DeptService,
  MenuService,
  ParamService,
  RoleService,
  UserService,
  AbstractClient,
} from '../../services/';
import { DomainService } from '../../services';
import { MobxDomainStore } from '../../stores';
import { EntityListProps } from '../layout';

export class AdminServices {
  userService: UserService;
  roleService: RoleService;
  paramService: ParamService;
  noteService: DomainService<MobxDomainStore>;
  menuService: MenuService;
  deptService: DeptService;
  userRoleService: DomainService<MobxDomainStore>;

  constructor(restClient: AbstractClient, afterLogin: AfterLogin, initServices: Partial<AdminServices> = {}) {
    this.paramService = new ParamService(restClient);
    this.noteService = new DomainService({ domain: 'note', storeClass: MobxDomainStore, restClient });
    this.userRoleService = new DomainService({ domain: 'userRole', storeClass: MobxDomainStore, restClient });
    this.roleService = new RoleService(restClient);
    this.menuService = new MenuService(restClient);
    this.userService =
      initServices.userService || new UserService(restClient, [this.afterLogin.bind(this), afterLogin]);
    this.deptService = new DeptService(restClient);
  }

  afterLogin() {
    this.paramService.initDictList();
    this.deptService.initDictList();
    this.roleService.initDictList();
    this.menuService.getMenuTree();
  }
}

export interface AdminPageProps extends EntityListProps {
  services: AdminServices;
}
