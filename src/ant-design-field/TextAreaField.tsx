import React from 'react';
import { Input } from 'antd';
import { FieldProps } from './FieldProps';
import { AbstractField } from './AbstractField';
import { TextAreaProps } from 'antd/lib/input/TextArea';

export class TextAreaField extends AbstractField<TextAreaProps & FieldProps> {
  getField() {
    return <Input.TextArea {...this.getInputProps()} />;
  }
}
