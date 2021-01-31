import { AbstractClient } from './rest';
import { MobxDomainStore } from '../stores';
import { DomainService } from './DomainService';
import { Entity, LoginInfo } from './index';
import { EntityColumnProps } from '../components/layout';
import { DictView } from '../components/common';

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

export class DictService extends DomainService {
  typeMap: { [key: string]: Dict[] } = {};
  constructor(restClient: AbstractClient) {
    super({ domain: 'dict', storeClass: MobxDomainStore, restClient });
  }

  getDict(typeId: string): Dict[] {
    const dictList = this.store.allList as Dict[];
    //如果结果还未返回，不要对map做赋值
    if (!dictList || dictList.length === 0) return [];
    if (!this.typeMap[typeId]) this.typeMap[typeId] = dictList.filter((dict) => dict.type.id === typeId);
    return this.typeMap[typeId];
  }
  dictRender = (typeId: string, code: string) => {
    const dict = this.getDict(typeId).find((dict) => dict.code === code);
    return dict ? dict.name : code;
  };
  dictColumn(title: string, dataIndex: string, typeId: string): EntityColumnProps {
    return { title, dataIndex, render: this.dictRender.bind(null, typeId) };
  }
  multiDictColumn(title: string, dataIndex: string, typeId: string): EntityColumnProps {
    return {
      title,
      dataIndex,
      render: (text) => DictView.build(this)({ dictType: typeId, dictCode: text, multipleMode: true }),
      renderExport: (text) => {
        if (!text) return null;
        const codes = text.split(',');
        return codes.map((code) => this.dictRender(typeId, code)).join(',');
      },
    };
  }
  afterLogin = (loginInfo: LoginInfo) => {
    return this.listAll({ orders: ['type', 'seq'] });
  };
}
