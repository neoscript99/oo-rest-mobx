import { AbstractClient } from './rest';
import { DeptStore } from '../stores';
import { DomainService } from './DomainService';
import { Entity, LoginInfo } from './index';

export interface DeptEntity extends Entity {
  name: string;
  seq: number;
  enabled: boolean;
}

export class DeptService extends DomainService<DeptStore> {
  constructor(restClient: AbstractClient, domain = 'department') {
    super({ domain, storeClass: DeptStore, restClient });
  }
  get packageName() {
    return 'sys';
  }
  afterLogin = (loginInfo: LoginInfo) => {
    if (this.readAuthorize(loginInfo.authorities))
      return this.list({ orders: ['seq'] }).then((res) => {
        this.store.completeList = res.results;
        this.store.enabledList = res.results.filter((dept) => dept.enabled);
      });
    return Promise.resolve();
  };
}
