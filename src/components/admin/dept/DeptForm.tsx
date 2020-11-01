import React, { ReactNode } from 'react';
import { Form } from 'antd';

import { EntityForm } from '../../layout';
import { commonRules } from '../../../utils';
import { CheckboxField, InputField, InputNumberField } from '../../../ant-design-field';
export class DeptForm extends EntityForm {
  getForm() {
    const { form, readonly } = this.props;
    const req = { rules: [commonRules.required] };
    return (
      <Form form={form} layout="vertical" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <InputNumberField
          fieldId="seq"
          formItemProps={{ label: '序号' }}
          formUtils={form}
          readonly={readonly}
          max={999999}
          decorator={{ initialValue: 1 }}
        />
        <InputField
          fieldId="name"
          formItemProps={{ label: '机构名' }}
          formUtils={form}
          maxLength={18}
          readonly={readonly}
          decorator={req}
        />
        <CheckboxField fieldId="enabled" formUtils={form} formItemProps={{ label: '启用' }} readonly={readonly} />
        {this.getExtraFormItem()}
      </Form>
    );
  }
  getExtraFormItem(): ReactNode {
    return null;
  }
}
