import React from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { FieldProps } from './FieldProps';
import { AbstractField } from './AbstractField';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';

export interface SelectFieldProps extends SelectProps, FieldProps {
  dataSource: any[];
  keyProp?: string;
  valueProp: string;
  labelProp: string;
  defaultSelectFirst?: boolean;
}

export class SelectField extends AbstractField<SelectFieldProps> {
  getFieldProps(): FieldProps {
    const { decorator, defaultSelectFirst, dataSource } = this.props;
    const newDecorator: GetFieldDecoratorOptions = { ...decorator };
    if (defaultSelectFirst && dataSource && dataSource.length > 0) {
      newDecorator.initialValue = dataSource[0].code;
    }
    return { ...super.getFieldProps(), decorator: newDecorator };
  }

  getField() {
    const { dataSource, keyProp, valueProp, labelProp, defaultSelectFirst, ...selectProps } = this.getInputProps();

    return (
      <Select {...selectProps}>
        {dataSource.map(item => (
          <Select.Option key={item[keyProp || valueProp]} value={item[valueProp]}>
            {item[labelProp]}
          </Select.Option>
        ))}
      </Select>
    );
  }
}
