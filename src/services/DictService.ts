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
  typeMap: { [key: string]: Dict[] } = {};
  constructor(restClient: AbstractClient) {
    super({ domain: 'dict', storeClass: MobxDomainStore, restClient });
  }

  getDict(typeId: string): Dict[] {
    if (!this.typeMap[typeId])
      this.typeMap[typeId] = (this.store.allList as Dict[]).filter(dict => dict.type.id === typeId);
    return this.typeMap[typeId];
  }
  dictRender = (typeId: string, code: string) => {
    return this.getDict(typeId).find(dict => dict.code === code)?.name;
  };
  initDictList() {
    this.listAll({ orders: ['type', 'seq'] });
  }
}
