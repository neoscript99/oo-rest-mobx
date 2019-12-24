import { Criteria, CriteriaOrder, Entity, ListOptions, ListResult, PageInfo } from './';
import { MobxDomainStore } from '../stores';
import { AbstractClient } from './rest/AbstractClient';
import { ServiceUtil } from '../utils';

export interface DomainServiceOptions<D extends MobxDomainStore> {
  domain: string;
  initStore?: D;
  storeClass?: new () => D;
  restClient: AbstractClient;
}

export interface DictInitService {
  initDictList();
}

/**
 * Mobx Store基类
 * 内部的属性会被JSON.stringify序列化，如果是嵌套结构或大对象，可以用Promise包装，规避序列化
 */
export class DomainService<D extends MobxDomainStore = MobxDomainStore> {
  public store: D;
  domain: string;
  restClient: AbstractClient;

  /**
   *
   * @param domain
   * @param graphqlClient
   * @param dependStoreMap 依赖的其它store，格式如下：{aaStore:aa,bbStore:bb}
   */
  constructor(options: DomainServiceOptions<D>) {
    if (options.initStore) this.store = options.initStore;
    else if (options.storeClass) this.store = new options.storeClass();
    else throw 'DomainService.constructor need initStore or storeClass';

    this.domain = options.domain;
    this.restClient = options.restClient;
  }

  getApiUri(operator: string) {
    return `/api/${this.domain}/${operator}`;
  }

  findFirst(criteria?: Criteria) {
    const pageInfo = { pageSize: 1, currentPage: 1 };
    return this.list({ criteria, pageInfo }).then(
      data => data.totalCount > 0 && this.changeCurrentItem(data.results[0]),
    );
  }

  /**
   * 返回后设置 allList
   * @param criteria
   * @returns {Promise<{client: *, fields?: *}>}
   */

  listAll(options: ListOptions): Promise<ListResult> {
    return this.list(options).then(data => {
      this.store.allList = data.results;
      return data;
    });
  }

  /**
   * 不改变类成员变量
   * @param criteria
   * @param pageInfo
   * @param orders
   * @returns {Promise<{client: *, fields?: *}>}
   */

  list({ criteria = {}, pageInfo, orders }: ListOptions): Promise<ListResult> {
    const { maxResults, firstResult, order, ...countCriteria } = criteria;
    if (orders && orders.length > 0) ServiceUtil.processCriteriaOrder(criteria, orders);
    if (pageInfo) ServiceUtil.processCriteriaPage(criteria, pageInfo);
    const listPromise = this.restClient.post(this.getApiUri('list'), criteria) as Promise<Entity[]>;
    if (pageInfo) {
      const countPromise = this.restClient.post(this.getApiUri('count'), countCriteria) as Promise<number>;
      return Promise.all([listPromise, countPromise]).then(([results, totalCount]) => ({
        results,
        totalCount,
      }));
    } else {
      return listPromise.then(results => ({ results, totalCount: results.length }));
    }
  }

  /**
   * 返回后设置 pageInfo pageList allList
   *
   *
   * @param {boolean} isAppend
   * @param {PageInfo} pageInfo 此处传入pageInfo优先，以store.pageInfo为准
   * @param {{criteria?: Criteria; orders?: CriteriaOrder[]}} rest
   * @returns {Promise<ListResult>}
   */
  listPage({ isAppend = false, pageInfo, ...rest }: ListOptions): Promise<ListResult> {
    //查询第一页的时候，清空allList
    if (pageInfo) this.store.pageInfo = pageInfo;
    if (this.store.pageInfo.currentPage === 1) this.store.allList = [];
    return this.list({ pageInfo: this.store.pageInfo, ...rest }).then(data => {
      const { results, totalCount } = data;
      this.store.pageList = results;
      this.store.pageInfo.totalCount = totalCount;
      this.store.pageInfo.isLastPage =
        results.length < this.store.pageInfo.pageSize ||
        this.store.pageInfo.pageSize * this.store.pageInfo.currentPage >= totalCount;
      if (isAppend === true) this.store.allList = this.store.allList.concat(results);
      else this.store.allList = results;
      return data;
    });
  }

  listNextPage(param: ListOptions): string | Promise<ListResult> {
    if (this.store.pageInfo.isLastPage) return '已经到底了';
    else {
      this.store.pageInfo.currentPage++;
      return this.listPage(param);
    }
  }

  listFirstPage(param: ListOptions): Promise<ListResult> {
    this.store.pageInfo.currentPage = 1;
    return this.listPage(param);
  }

  clearList() {
    this.store.pageList = [];
    this.store.allList = [];
  }

  changeCurrentItem(currentItem: Entity): Entity {
    this.store.currentItem = currentItem;
    return currentItem;
  }

  /**
   * create or update,根据item.id是否存在判断
   * @param newItem
   */
  save(item: Entity): Promise<Entity> {
    return this.restClient.post(this.getApiUri('save'), item).then(data => this.changeCurrentItem(data as Entity));
  }

  get(id: any): Promise<Entity> {
    return this.restClient.post(this.getApiUri('get'), { id }).then(data => this.changeCurrentItem(data as Entity));
  }

  delete(id: any): Promise<number> {
    return this.restClient.post(this.getApiUri('delete'), { id });
  }

  deleteByIds(ids: any[]): Promise<any> {
    return this.restClient.post(this.getApiUri('deleteByIds'), { ids });
  }

  syncPageInfo(newPageInfo: PageInfo) {
    Object.assign(this.store.pageInfo, newPageInfo);
  }
}
