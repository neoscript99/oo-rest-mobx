import { decorate, observable } from 'mobx';
import { DEFAULT_PAGE_INFO, Entity, PageInfo } from './index';

/**
 * Mobx Store基类
 * 未来去除Mobx依赖，改用react hooks
 * 内部的属性会被JSON.stringify序列化，如果是嵌套结构或大对象，可以用Promise包装，规避序列化
 */
export class DomainStore<T extends Entity = Entity> {
  pageInfo: PageInfo = DEFAULT_PAGE_INFO;
  currentItem: T = {} as T;
  allList: T[] = [];
  pageList: T[] = [];
  needRefresh = true;
  searchParam: any = {};
  [key: string]: any;
}

decorate(DomainStore, {
  currentItem: observable,
  allList: observable,
  pageList: observable,
  pageInfo: observable,
  needRefresh: observable,
  searchParam: observable,
});
