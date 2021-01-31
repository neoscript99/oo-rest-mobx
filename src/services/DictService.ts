import { AbstractClient } from './rest';
import { DomainStore } from './DomainStore';
import { DomainService } from './DomainService';
import { Entity, LoginInfo } from './index';

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

export class DictService extends DomainService<Dict> {
  typeMap: { [key: string]: Dict[] } = {};
  constructor(restClient: AbstractClient) {
    super({ domain: 'dict', storeClass: DomainStore, restClient });
  }

  getDict(typeId: string): Dict[] {
    const dictList = this.store.allList as Dict[];
    //如果结果还未返回，不要对map做赋值
    if (!dictList || dictList.length === 0) return [];
    if (!this.typeMap[typeId]) this.typeMap[typeId] = dictList.filter((dict) => dict.type.id === typeId);
    return this.typeMap[typeId];
  }
  getName = (typeId: string, code: string) => {
    const dict = this.getDict(typeId).find((dict) => dict.code === code);
    return dict ? dict.name : code;
  };
  afterLogin = (loginInfo: LoginInfo) => {
    return this.listAll({ orders: ['type', 'seq'] });
  };
}
