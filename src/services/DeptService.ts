import { AbstractClient } from './rest';
import { DeptStore } from '../stores';
import { DictInitService, DomainService } from './DomainService';
import { Entity } from './index';

export interface DeptEntity extends Entity {
  name: string;
  seq: number;
  enabled: boolean;
}

export class DeptService extends DomainService<DeptStore> implements DictInitService {
  constructor(restClient: AbstractClient, domain = 'department') {
    super({ domain, storeClass: DeptStore, restClient });
  }

  initDictList() {
    this.listAll({ orders: ['seq'] }).then(res => (this.store.enabledList = res.results.filter(dept => dept.enabled)));
  }
}
