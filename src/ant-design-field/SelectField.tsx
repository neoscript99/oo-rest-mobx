import React from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { FieldProps } from './FieldProps';
import { AbstractField } from './AbstractField';

export interface SelectFieldProps extends SelectProps, FieldProps {
  dataSource: any[];
  keyProp?: string;
  valueProp: string;
  labelProp: string;
}

export class SelectField extends AbstractField<SelectFieldProps> {
  getField() {
    const { dataSource, keyProp, valueProp, labelProp, ...selectProps } = this.getInputProps();
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
