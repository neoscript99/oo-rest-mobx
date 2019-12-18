import React from 'react';
import { Input } from 'antd';
import { FieldProps } from './FieldProps';
import { InputProps } from 'antd/lib/input';
import { AbstractField } from './AbstractField';

export class InputField extends AbstractField<InputProps & FieldProps> {
  getField() {
    return <Input {...this.getInputProps()} />;
  }
}
