import React, { Component, ReactNode } from 'react';

import { Card, Form, message, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { DomainService, Entity } from '../../services';
import { EntityColumnProps } from './EntityList';
import { MobxDomainStore } from '../../stores';
import { ModalProps } from 'antd/lib/modal';
import { CardProps } from 'antd/lib/card';

export interface EntityFormProps extends FormComponentProps {
  title: string;
  okText: string;
  domainService: DomainService<MobxDomainStore>;
  columns?: EntityColumnProps[];
  inputItem?: Entity;
  onSuccess?: (item: Entity) => void;
  onCancel?: () => void;
  containerType?: 'Modal' | 'Card';
  containerProps?: ModalProps | CardProps;
  readonly?: boolean;
  [key: string]: any;
}

export class EntityForm<P extends EntityFormProps = EntityFormProps, S = any> extends Component<P, S> {
  render() {
    const { title, okText, containerType, containerProps } = this.props;
    const formBody = this.getForm();
    switch (containerType) {
      case 'Card':
        return (
          <Card title={title} {...(containerProps as CardProps)}>
            {formBody}
          </Card>
        );
      default:
        return (
          <Modal
            width={520}
            visible={true}
            title={title}
            okText={okText}
            onCancel={this.handleCancel.bind(this)}
            onOk={this.handleOK.bind(this)}
            maskClosable={false}
            {...(containerProps as ModalProps)}
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
    form.validateFields((err, saveItem) => (err ? console.error(err) : this.handleSave(saveItem)));
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

  static formWrapper = Form.create({
    name: `EntityForm_${new Date().toISOString()}`,
    mapPropsToFields(props: EntityFormProps) {
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
  });
}
