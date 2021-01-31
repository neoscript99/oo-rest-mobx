import React from 'react';
import { Button, Collapse, Form, Radio, Input } from 'antd';
import { AdminServices, ApplyEntity } from '../../../services';
import { ApplyLogList } from './ApplyLogList';

const { TextArea } = Input;

const { Panel } = Collapse;
export interface ApplyFormResult {
  info: string;
  action: 'abort' | 'pass' | 'return';
}
const actions = [
  { label: 'return', value: '退回修改' },
  { label: 'abort', value: '驳回（作废）' },
  { label: 'pass', value: '通过' },
];
export interface ApplyFormProps {
  apply: ApplyEntity;
  applyDictType: string;
  adminServices: AdminServices;
  ownerRender: React.ReactNode;
  ownerHeader: React.ReactNode;
  onSubmit: (res: ApplyFormResult) => void;
}
export function ApplyForm(props: ApplyFormProps) {
  const { apply, ownerRender, ownerHeader, adminServices, applyDictType, onSubmit } = props;
  const { applyLogService, dictService } = adminServices;
  return (
    <Collapse defaultActiveKey={['1']}>
      <Panel header={ownerHeader} key="1">
        {ownerRender}
      </Panel>
      <Panel header="审批记录" key="2">
        <ApplyLogList
          dictService={dictService}
          applyId={apply.id}
          applyLogService={applyLogService}
          applyDictType={applyDictType}
        />
      </Panel>
      <Panel header="审批" key="3">
        <Form onFinish={onSubmit}>
          <Form.Item name="info">
            <TextArea maxLength={255} />
          </Form.Item>
          <Form.Item name="action">
            <Radio.Group options={actions} />
          </Form.Item>
          <Form.Item>
            <Button>提交</Button>
          </Form.Item>
        </Form>
      </Panel>
    </Collapse>
  );
}
