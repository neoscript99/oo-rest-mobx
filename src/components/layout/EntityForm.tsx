import React, { Component, ReactNode } from 'react';

import { Card, Form, message, Modal, Collapse } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { DomainService, Entity } from '../../services';
import { EntityColumnProps } from './EntityList';
import { MobxDomainStore } from '../../stores';
import { ModalProps } from 'antd/lib/modal';
import { CardProps } from 'antd/lib/card';
import { CollapsePanelProps } from 'antd/lib/collapse';
import { WrappedFormUtils } from 'antd/lib/form/Form';

export interface EntityFormProps {
  domainService: DomainService<MobxDomainStore>;
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
    const { containerType, modalProps, cardProps, collapseProps } = this.props;
    const formBody = this.getForm();
    switch (containerType) {
      case 'Card':
        return <Card {...cardProps}>{formBody}</Card>;
      case 'Collapse':
        return (
          <Collapse defaultActiveKey="1">
            <Collapse.Panel key="1" {...collapseProps}>
              {formBody}
            </Collapse.Panel>
          </Collapse>
        );
      default:
        return (
          <Modal
            width={520}
            visible={true}
            okText="提交"
            onCancel={this.handleCancel.bind(this)}
            onOk={this.handleOK.bind(this)}
            maskClosable={false}
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

  static formWrapper<PP extends FormWrapperProps>(component: React.ComponentType<PP>) {
    return Form.create<PP & FormComponentProps>({
      name: `EntityForm_${new Date().toISOString()}`,
      mapPropsToFields(props) {
        const { inputItem } = props;
        if (inputItem)
          return Object.keys(inputItem).reduce((fieldMap, key) => {
            fieldMap[key] = Form.createFormField({
              value: inputItem[key],
            });
            return fieldMap;
          }, {});
        else return;
      },
    })(component);
  }
}
interface FormWrapperProps {
  inputItem?: Entity;
}
