import React from 'react';
import { InputNumber } from 'antd';
import { FieldProps } from './FieldProps';
import { AbstractField } from './AbstractField';
import { InputNumberProps } from 'antd/lib/input-number';

export class InputNumberField extends AbstractField<InputNumberProps & FieldProps> {
  getField() {
    return <InputNumber style={{ width: '100%' }} {...this.getInputProps()} />;
  }
}
