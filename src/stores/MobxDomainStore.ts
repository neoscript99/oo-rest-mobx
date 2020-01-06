import { decorate, observable } from 'mobx';
import { DEFAULT_PAGE_INFO, Entity, PageInfo } from '../services';

/**
 * Mobx Store基类
 * 内部的属性会被JSON.stringify序列化，如果是嵌套结构或大对象，可以用Promise包装，规避序列化
 */
export class MobxDomainStore {
  pageInfo: PageInfo = DEFAULT_PAGE_INFO;
  currentItem: Entity = {};
  allList: Entity[] = [];
  pageList: Entity[] = [];
  needRefresh = true;
  searchParam: any = {};
}

decorate(MobxDomainStore, {
  currentItem: observable,
  allList: observable,
  pageList: observable,
  pageInfo: observable,
  needRefresh: observable,
  searchParam: observable,
});
