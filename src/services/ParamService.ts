import { AbstractClient } from './rest';
import { MobxDomainStore } from '../stores';
import { DomainService } from './DomainService';
import { Entity } from './index';

export interface ParamEntity extends Entity {
  //后台定义的菜单对应功能代码
  code: string;
  name: string;
  value: string;
  type: any;
}

export class ParamService extends DomainService<MobxDomainStore> {
  constructor(restClient: AbstractClient) {
    super({ domain: 'param', storeClass: MobxDomainStore, restClient });
    //系统参数系统启动后就获取，不需要登录
    this.initStore();
  }

  async initStore() {
    const list = await this.list({});
    const exList = await this.listExtra();
    this.store.allList = list.results.concat(exList);
  }

  listExtra() {
    return this.postApi('listExtra');
  }

  getByCode(code: string): ParamEntity | undefined {
    const p = this.store.allList.find((param) => param.code === code);
    return p && (p as ParamEntity);
  }
}
