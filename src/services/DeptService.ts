import { AbstractClient } from './rest';
import { MobxDomainStore } from '../stores';
import { DictInitService, DomainService } from './DomainService';
import { Entity } from './index';

export interface DeptEntity extends Entity {
  name: string;
  seq: number;
  enabled: boolean;
}

export class DeptService extends DomainService implements DictInitService {
  constructor(restClient: AbstractClient, domain = 'department') {
    super({ domain, storeClass: MobxDomainStore, restClient });
  }

  initDictList() {
    this.listAll({ orders: ['seq'] });
  }
}
