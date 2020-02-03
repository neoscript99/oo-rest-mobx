import React from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { FieldProps } from './FieldProps';
import { AbstractField } from './AbstractField';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import { StringUtil } from '../utils';

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
    //如果是以上多值方式，将选择项的value转为为逗号分隔的字符串
    if (isMultipleMode(mode)) {
      newDecorator.getValueFromEvent = array => (array as string[]).join(',');

      newDecorator.valuePropName = 'originValue';
    }

    return newDecorator;
  }

  getField() {
    const { dataSource, keyProp, valueProp, labelProp, defaultSelectFirst, ...selectProps } = this.getInputProps();
    return (
      <SelectWrap {...selectProps}>
        {dataSource &&
          dataSource.map(item => (
            <Select.Option key={item[keyProp || valueProp]} value={item[valueProp]}>
              {item[labelProp]}
            </Select.Option>
          ))}
      </SelectWrap>
    );
  }
}
interface SelectWrapProps extends SelectProps {
  originValue?: string;
}

class SelectWrap extends React.Component<SelectWrapProps> {
  render() {
    const { originValue, value, mode, ...selectProps } = this.props;
    let v = value;
    if (isMultipleMode(mode)) {
      v = StringUtil.isNotBlank(originValue) ? originValue!.split(',') : undefined;
    }
    return <Select mode={mode} value={v} placeholder="---请选择---" {...selectProps}></Select>;
  }
}

/**
 * 'multiple', 'tags'的区别是tags可以增加新的
 * @param mode
 */
function isMultipleMode(mode?: string) {
  return mode && ['multiple', 'tags'].includes(mode);
}
