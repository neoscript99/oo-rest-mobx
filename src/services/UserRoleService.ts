import { MenuStore, MobxDomainStore } from '../stores';
import { DomainService } from './DomainService';
import { AbstractClient } from './rest';
import { Entity } from './index';

export class UserRoleService extends DomainService<MobxDomainStore> {
  constructor(restClient: AbstractClient) {
    super({ domain: 'userRole', storeClass: MenuStore, restClient });
  }

  saveUserRoles(user: Entity, roleIds: string[]) {
    return this.restClient.post('/api/user/saveWithRoles', { user, roleIds });
  }
}
