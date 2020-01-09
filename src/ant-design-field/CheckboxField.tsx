import React from 'react';
import { Checkbox } from 'antd';
import { FieldProps } from './FieldProps';
import { AbstractField } from './AbstractField';
import { CheckboxProps } from 'antd/lib/checkbox';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';

export class CheckboxField extends AbstractField<CheckboxProps & FieldProps> {
  getField() {
    return <Checkbox {...this.getInputProps()} />;
  }
  get defaultDecorator(): GetFieldDecoratorOptions | null {
    return { valuePropName: 'checked', initialValue: true };
  }
}
