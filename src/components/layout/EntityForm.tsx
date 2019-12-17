import React, { Component, ReactNode } from 'react';

import { Card, Form, message, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { DomainService, Entity } from '../../services';
import { EntityColumnProps } from './EntityList';
import { MobxDomainStore } from '../../stores';

export interface EntityFormProps extends FormComponentProps {
  title: string;
  okText: string;
  domainService: DomainService<MobxDomainStore>;
  columns?: EntityColumnProps[];
  inputItem?: Entity;
  onSuccess?: (item: Entity) => void;
  onCancel?: () => void;
  containerType?: 'Modal' | 'Card';
  width?: string | number;
  [key: string]: any;
}

export class EntityForm<P extends EntityFormProps = EntityFormProps, S = any> extends Component<P, S> {
  render() {
    const { title, okText, containerType, width } = this.props;
    const formBody = this.getForm();
    switch (containerType) {
      case 'Card':
        return <Card title={title}>{formBody}</Card>;
      default:
        return (
          <Modal
            width={width || 520}
            visible={true}
            title={title}
            okText={okText}
            onCancel={this.handleCancel.bind(this)}
            onOk={this.handleOK.bind(this)}
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
      const { inputItem, columns } = props;
      if (inputItem)
        return Object.keys(inputItem).reduce((fieldMap, key) => {
          fieldMap[key] = Form.createFormField({
            value: inputItem[key],
          });
          return fieldMap;
        }, {});
      else if (columns)
        return columns.reduce((fieldMap, col) => {
          if (col.dataIndex && col.initValue !== undefined)
            fieldMap[col.dataIndex] = Form.createFormField({
              value: col.initValue,
            });
          return fieldMap;
        }, {});
      else return;
    },
  });
}
