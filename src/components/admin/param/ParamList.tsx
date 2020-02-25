import React from 'react';
import { AdminPageProps } from '../AdminServices';
import { TableUtil } from '../../../utils';
import { EntityColumnProps, EntityPageList } from '../../layout';

const { commonColumns } = TableUtil;
const columns: EntityColumnProps[] = [
  { title: '参数代码', dataIndex: 'code' },
  { title: '参数名称', dataIndex: 'name' },
  { title: '参数类型', dataIndex: 'type.name' },
  { title: '参数值', dataIndex: 'value' },
  { title: '修改人', dataIndex: 'lastUser.name' },
  commonColumns.lastUpdated,
];

export class ParamList extends EntityPageList<AdminPageProps> {
  get columns(): EntityColumnProps[] {
    return columns;
  }

  get domainService() {
    return this.props.services.paramService;
  }
}
