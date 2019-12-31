import { MobxDomainStore } from '../stores';
import { AbstractClient, DeptEntity, DomainService, Entity } from './index';

export interface UserEntity extends Entity {
  account: string;
  name?: string;
  dept: DeptEntity;
}

export class UserService extends DomainService {
  constructor(restClient: AbstractClient, domain = 'user') {
    super({ domain, storeClass: MobxDomainStore, restClient });
  }

  saveUserRoles(user: Entity, roleIds: string[]) {
    return this.restClient.post(this.getApiUri('saveWithRoles'), { user, roleIds });
  }
  resetPassword(user: Entity, passwordHash: string) {
    return this.restClient.post(this.getApiUri('resetPassword'), { userId: user.id, passwordHash });
  }
}
