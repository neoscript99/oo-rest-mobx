import React, { Component, ReactNode } from 'react';

import { Card, message, Modal, Collapse } from 'antd';
import { DomainService, Entity } from '../../services';
import { EntityColumnProps } from './EntityList';
import { ModalProps } from 'antd/lib/modal';
import { CardProps } from 'antd/lib/card';
import { CollapsePanelProps } from 'antd/lib/collapse';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ReactUtil } from '../../utils/ReactUtil';

export interface EntityFormProps {
  domainService: DomainService;
  title?: string;
  columns?: EntityColumnProps[];
  inputItem?: Entity;
  onSuccess?: (item: Entity) => void;
  onCancel?: () => void;
  containerType?: 'Modal' | 'Card' | 'Collapse';
  modalProps?: ModalProps;
  cardProps?: CardProps;
  collapseProps?: CollapsePanelProps;
  readonly?: boolean;
  form?: WrappedFormUtils;
}

export class EntityForm<P extends EntityFormProps = EntityFormProps, S = any> extends Component<P, S> {
  render() {
    const { containerType, title, modalProps, cardProps, collapseProps, readonly } = this.getContainerProps();
    const formBody = this.getForm();
    switch (containerType) {
      case 'Card':
        return (
          <Card title={title} {...cardProps}>
            {formBody}
          </Card>
        );
      case 'Collapse':
        return (
          <Collapse defaultActiveKey="1">
            <Collapse.Panel header={title} key="1" {...collapseProps}>
              {formBody}
            </Collapse.Panel>
          </Collapse>
        );
      default:
        return (
          <Modal
            width={520}
            title={title}
            visible={true}
            okText="提交"
            cancelText="取消"
            bodyStyle={{ padding: '12px 24px' }}
            onCancel={this.handleCancel.bind(this)}
            onOk={this.handleOK.bind(this)}
            maskClosable={!!readonly}
            footer={readonly && null}
            {...modalProps}
          >
            {formBody}
          </Modal>
        );
    }
  }
  getForm(): ReactNode {
    return null;
  }
  handleCancel() {
    const { onCancel } = this.props;
    if (onCancel) onCancel();
  }

  handleOK() {
    const { form } = this.props;
    if (form) form.validateFields((err, saveItem) => (err ? console.error(err) : this.handleSave(saveItem)));
    else console.error('未通过Form.create进行包装，没有form属性');
  }

  handleSave(saveItem: Entity) {
    this.saveEntity(saveItem)
      .then(v => {
        message.success('保存成功');
        const { onSuccess } = this.props;
        if (onSuccess) onSuccess(v);
        return v;
      })
      .catch(reason => {
        console.error(reason);
        message.error(`保存失败：${reason}`);
      });
  }

  saveEntity(saveItem: Entity) {
    const { domainService, inputItem } = this.props;
    return domainService.save({ ...inputItem, ...saveItem });
  }

  /**
   * 子类可以重载，做对应控制
   */
  getContainerProps() {
    const { containerType, title, modalProps, cardProps, collapseProps, readonly } = this.props;
    return { containerType, title, modalProps, cardProps, collapseProps, readonly };
  }
  static formWrapper = ReactUtil.formWrapper;
}
