import React from 'react';
import { EntityListState, EntityList, EntityListProps } from './EntityList';
import { TableUtil } from '../../utils';
import { ListResult } from '../../services';

export abstract class EntityPageList<
  P extends EntityListProps = EntityListProps,
  S extends EntityListState = EntityListState
> extends EntityList<P, S> {
  pageChange(page: number): void {
    super.pageChange(page);
    this.query();
  }

  pageSizeChange(current: number, size: number): void {
    super.pageSizeChange(current, size);
    this.query();
  }

  query(): Promise<ListResult> {
    console.debug(`${this.className}(${this.toString()}).query`);
    const promise = this.domainService.listPage({
      ...this.getQueryParam(),
    });
    this.updateTableProps(promise);
    return promise;
  }

  /**
   * EntityList切换页面到第一页时不会触发查询，所以需要手工调用query
   * EntityPageList切换页面后会触发查询
   */
  refresh() {
    this.pageChange(1);
  }

  restoreState() {
    const { pageInfo, pageList } = this.domainService.store;
    Object.assign(this.tableProps.pagination, TableUtil.fromPageInfo(pageInfo));
    this.setState({ dataList: pageList });
  }

  handleExportAll() {
    //剔除排序和分页参数，查询所有数据
    const { criteria } = this.getQueryParam();
    //用list方法，不改变store中的变量
    this.domainService.list({ criteria }).then(res => {
      this.setState({ exportList: res.results, showExportPop: true });
    });
  }
}
