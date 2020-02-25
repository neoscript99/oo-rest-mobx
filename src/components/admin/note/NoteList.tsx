import React from 'react';
import { AdminPageProps } from '../AdminServices';
import { TableUtil } from '../../../utils';
import { EntityColumnProps, EntityPageList } from '../../layout';

const { commonColumns } = TableUtil;
const columns: EntityColumnProps[] = [
  { title: '标题', dataIndex: 'title' },
  { title: '内容', dataIndex: 'content' },
  { title: '附件数', dataIndex: 'attachNum' },
  commonColumns.lastUser,
  commonColumns.lastUpdated,
];

export class NoteList extends EntityPageList<AdminPageProps> {
  get columns(): EntityColumnProps[] {
    return columns;
  }

  get domainService() {
    return this.props.services.noteService;
  }
}
