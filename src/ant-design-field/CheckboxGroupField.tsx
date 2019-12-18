import React from 'react';
import { Checkbox } from 'antd';
import { FieldProps } from './FieldProps';
import { AbstractField } from './AbstractField';
import { CheckboxGroupProps } from 'antd/lib/checkbox';

export class CheckboxGroupField extends AbstractField<CheckboxGroupProps & FieldProps> {
  getField() {
    return <Checkbox.Group {...this.getInputProps()} />;
  }
}
