import { AbstractClient } from './rest';
import { MobxDomainStore } from '../stores';
import { DictInitService, DomainService } from './DomainService';
import { Entity } from './index';

export interface DictType extends Entity {
  name: string;
}
export interface Dict extends Entity {
  name: string;
  type: DictType;
  enabled: boolean;
  code: string;
  seq: number;
}

export class DictService extends DomainService implements DictInitService {
  constructor(restClient: AbstractClient) {
    super({ domain: 'dict', storeClass: MobxDomainStore, restClient });
  }

  initDictList() {
    this.listAll({ orders: ['type', 'seq'] });
  }
}
