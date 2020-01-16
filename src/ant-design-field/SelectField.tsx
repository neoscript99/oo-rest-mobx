import React from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { FieldProps } from './FieldProps';
import { AbstractField } from './AbstractField';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';

export interface SelectFieldProps extends SelectProps, FieldProps {
  dataSource?: any[];
  keyProp?: string;
  valueProp: string;
  labelProp: string;
  defaultSelectFirst?: boolean;
}

export class SelectField extends AbstractField<SelectFieldProps> {
  get defaultDecorator() {
    const { defaultSelectFirst, dataSource, valueProp, mode } = this.props;
    const newDecorator: GetFieldDecoratorOptions = {};
    if (defaultSelectFirst && dataSource && dataSource.length > 0) {
      newDecorator.initialValue = dataSource[0][valueProp];
    }
    //'multiple', 'tags'的区别是tags可以增加新的
    //todo
    if (mode && ['multiple', 'tags'].includes(mode)) console.log(mode);

    return newDecorator;
  }

  getField() {
    const {
      dataSource,
      keyProp,
      valueProp,
      labelProp,
      defaultSelectFirst,
      mode,
      ...selectProps
    } = this.getInputProps();
    let tokenSeparators;
    if (mode && ['multiple', 'tags'].includes(mode)) tokenSeparators = [','];
    return (
      <Select tokenSeparators={tokenSeparators} mode={mode} {...selectProps}>
        {dataSource &&
          dataSource.map(item => (
            <Select.Option key={item[keyProp || valueProp]} value={item[valueProp]}>
              {item[labelProp]}
            </Select.Option>
          ))}
      </Select>
    );
  }
}
