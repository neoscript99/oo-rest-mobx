import { AbstractClient } from '../rest';
import { MobxDomainStore } from '../stores';
import { DomainService, Entity, LoginInfo } from './index';

export interface RoleEntity extends Entity {
  roleName: string;
  roleCode: string;
  description: string;
  enabled: boolean;
  editable: boolean;
  lastUpdated: Date;
}

export class RoleService extends DomainService {
  constructor(restClient: AbstractClient) {
    super({ domain: 'role', storeClass: MobxDomainStore, restClient });
  }
  afterLogin = (loginInfo: LoginInfo) => {
    return this.readAuthorize(loginInfo.authorities)
      ? this.listAll({ orders: [['lastUpdated', 'desc']] })
      : Promise.resolve();
  };
  get packageName() {
    return 'sys';
  }
}
