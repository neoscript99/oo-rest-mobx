import React from 'react';
import { Checkbox } from 'antd';
import { FieldProps } from './FieldProps';
import { AbstractField } from './AbstractField';
import { CheckboxProps } from 'antd/lib/checkbox';

export class CheckboxField extends AbstractField<CheckboxProps & FieldProps> {
  getField() {
    return <Checkbox {...this.getInputProps()} />;
  }
  getFieldProps(): FieldProps {
    const { formUtils, fieldId, decorator, formItemProps } = this.props;
    return { formUtils, fieldId, decorator: { valuePropName: 'checked', ...decorator }, formItemProps };
  }
}
