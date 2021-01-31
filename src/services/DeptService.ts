import { observable } from 'mobx';
import { AbstractClient } from './rest';
import { DomainStore } from './DomainStore';
import { DomainService } from './DomainService';
import { Entity, LoginInfo } from './index';

export interface DeptEntity extends Entity {
  name: string;
  seq: number;
  enabled: boolean;
}

export class DeptStore extends DomainStore<DeptEntity> {
  @observable
  completeList: Entity[] = [];
  @observable
  enabledList: Entity[] = [];
}

export class DeptService extends DomainService<DeptEntity, DeptStore> {
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
