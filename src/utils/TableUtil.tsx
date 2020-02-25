import React, { ReactNode } from 'react';
import moment from 'moment';
import numeral from 'numeral';
import { PaginationConfig } from 'antd/lib/table';
import { EntityColumnProps } from '../components/layout';
import { PageInfo } from '../services';
export class TableUtil {
  static commonColumnRenders = {
    booleanLabel: TableUtil.booleanLabel,
    timeFormatter: TableUtil.timeFormatter,
    numberLabel: TableUtil.numberLabel,
    numberColorLabel: TableUtil.numberColorLabel,
  };

  static commonColumns: { [key: string]: EntityColumnProps } = {
    index: { title: '排序', key: 'index_col', render: (text, record, index) => index + 1 },
    enabled: { title: '是否启用', dataIndex: 'enabled', render: TableUtil.booleanLabel },
    editable: { title: '可编辑', dataIndex: 'editable', render: TableUtil.booleanLabel },
    lastUser: { title: '修改人', dataIndex: 'lastUser.name' },
    lastUpdated: { title: '修改时间', dataIndex: 'lastUpdated', render: TableUtil.timeFormatter },
  };

  static commonSortFunctions = { numberSort: TableUtil.numberSort };

  static timeFormatter(date: Date): string {
    return moment(date).format('YYYY-MM-DD hh:mm');
  }

  static booleanLabel(value: boolean): string {
    return value ? '是' : '否';
  }

  static numberLabel(value?: number): ReactNode {
    return value ? numeral(value).format('0,0') : null;
  }

  static numberColorLabel(value?: number): ReactNode {
    if (value) {
      const color = value >= 0 ? 'red' : 'green';
      return (
        <span style={{ color, whiteSpace: 'nowrap' }}>
          {value < 0 && '↓'}
          {value > 0 && '↑'} {numeral(value).format('0,0')}
        </span>
      );
    } else return null;
  }

  static toPageInfo(pagination: PaginationConfig): PageInfo {
    return {
      currentPage: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
      totalCount: pagination.total,
    };
  }

  static fromPageInfo(pageInfo: PageInfo): PaginationConfig {
    return {
      current: pageInfo.currentPage || 1,
      pageSize: pageInfo.pageSize || 10,
      total: pageInfo.totalCount,
    };
  }

  static numberSort(dataIndex: string, a: any, b: any) {
    return a[dataIndex] - b[dataIndex];
  }
}
