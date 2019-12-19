import React, { ReactNode } from 'react';
import { Form, Input, Modal, Checkbox, InputNumber } from 'antd';
import { EntityForm } from '../../layout';
import { commonRules } from '../../../utils';
const { required } = commonRules;
export class DeptForm extends EntityForm {
  getForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        <Form.Item label="序号">
          {getFieldDecorator('seq', {
            initialValue: 1,
          })(<InputNumber max={999999} />)}
        </Form.Item>
        <Form.Item label="机构名">
          {getFieldDecorator('name', {
            rules: [required],
          })(<Input maxLength={16} />)}
        </Form.Item>
        <Form.Item label="启用">
          {getFieldDecorator('enabled', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox />)}
        </Form.Item>
        {this.getExtraFormItem()}
      </Form>
    );
  }
  getExtraFormItem(): ReactNode {
    return null;
  }
}
