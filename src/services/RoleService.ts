import { AbstractClient } from './rest';
import { MenuStore, MobxDomainStore } from '../stores';
import { DictInitService, DomainService, Entity } from './index';

export interface RoleEntity extends Entity {
  roleName: string;
  roleCode: string;
  description: string;
  enabled: boolean;
  editable: boolean;
  lastUpdated: Date;
}

export class RoleService extends DomainService<MobxDomainStore> implements DictInitService {
  constructor(restClient: AbstractClient) {
    super({ domain: 'role', storeClass: MenuStore, restClient });
  }
  initDictList() {
    this.listAll({ orders: [['lastUpdated', 'desc']] });
  }
}
