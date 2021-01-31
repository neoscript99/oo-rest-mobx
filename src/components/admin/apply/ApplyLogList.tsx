import React, { useEffect, useMemo } from 'react';
import { Table } from 'antd';
import { useServiceStore } from '../../../utils';
import { ApplyLogService, DictService } from '../../../services';
import { DictView } from '../../common';

export interface ApplyLogListProps {
  applyId: string;
  applyLogService: ApplyLogService;
  dictService: DictService;
  applyDictType: string;
}

export function ApplyLogList({ applyId, applyDictType, applyLogService, dictService }: ApplyLogListProps) {
  const store = useServiceStore(applyLogService);
  useEffect(() => {
    applyLogService.listAll({ criteria: { eq: [['apply.id', applyId]] } });
  }, [applyId]);
  const columns = useMemo(
    () => [
      { title: '审批人', dataIndex: ['operator', 'name'] },
      { title: '审批时间', dataIndex: 'dateCreated' },
      DictView.dictColumn(dictService, '审批前状态', 'fromStatusCode', applyDictType),
      DictView.dictColumn(dictService, '审批后状态', 'toStatusCode', applyDictType),
      { title: '备注', dataIndex: 'info' },
    ],
    [applyDictType],
  );
  return <Table pagination={false} columns={columns} dataSource={store.allList} />;
}
