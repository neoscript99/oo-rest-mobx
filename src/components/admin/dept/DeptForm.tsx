import React, { ReactNode } from 'react';
import { Form } from 'antd';

import { EntityForm } from '../../layout';
import { commonRules } from '../../../utils';
import { CheckboxField, InputField, InputNumberField } from '../../../ant-design-field';
export class DeptForm extends EntityForm {
  getForm() {
    const { form, readonly } = this.props;
    const rules = [commonRules.required];
    return (
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <InputNumberField
          fieldId="seq"
          formItemProps={{ label: '序号', initialValue: 100, rules }}
          formUtils={form}
          readonly={readonly}
          max={999999}
        />
        <InputField
          fieldId="name"
          formItemProps={{ label: '机构名', rules }}
          formUtils={form}
          maxLength={18}
          readonly={readonly}
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
