import React from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { FieldProps } from './FieldProps';
import { AbstractField } from './AbstractField';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';

export interface SelectFieldProps extends SelectWrapProps, FieldProps {
  dataSource?: any[];
  keyProp?: string;
  valueProp: string;
  labelProp?: string;
  labelRender?: (item) => React.ReactNode;
  defaultSelectFirst?: boolean;
}

export class SelectField extends AbstractField<SelectFieldProps> {
  get defaultDecorator() {
    const { defaultSelectFirst, dataSource, valueProp, mode, originValueType } = this.props;
    const newDecorator: GetFieldDecoratorOptions = {};
    if (defaultSelectFirst && dataSource && dataSource.length > 0) {
      const defaultVaule = dataSource[0][valueProp];
      newDecorator.initialValue = originValueType === 'array' ? [defaultVaule] : defaultVaule;
    }
    //如果是以上多值方式，将选择项的value转为为逗号分隔的字符串
    if (isMultipleMode(mode)) {
      newDecorator.getValueFromEvent = array => (originValueType === 'array' ? array : (array as string[]).join(','));

      newDecorator.valuePropName = 'originValue';
    }

    return newDecorator;
  }

  getField() {
    const {
      dataSource,
      keyProp,
      valueProp,
      labelProp,
      labelRender,
      defaultSelectFirst,
      ...selectProps
    } = this.getInputProps();
    return (
      <SelectWrap {...selectProps}>
        {dataSource &&
          dataSource.map(item => (
            <Select.Option key={item[keyProp || valueProp]} value={item[valueProp]}>
              {labelRender ? labelRender(item) : labelProp ? item[labelProp] : item[valueProp]}
            </Select.Option>
          ))}
      </SelectWrap>
    );
  }
}
interface SelectWrapProps extends SelectProps {
  originValue?: string | any[];
  //string 逗号分隔value
  //array 原始功能
  //默认为string
  originValueType?: 'string' | 'array';
}

/**
 * valuePropName： 多值方式：originValue 普通：value
 */
class SelectWrap extends React.Component<SelectWrapProps> {
  render() {
    const { originValue, originValueType, value, mode, ...selectProps } = this.props;
    let v = value;
    if (isMultipleMode(mode)) {
      v = originValue;
      if (originValueType !== 'array' && typeof originValue === 'string') v = originValue.split(',');
    }
    return (
      <Select mode={mode} value={v} placeholder="---请选择---" optionFilterProp="children" {...selectProps}></Select>
    );
  }
}

/**
 * 'multiple', 'tags'的区别是tags可以增加新的
 * @param mode
 */
function isMultipleMode(mode?: string) {
  return mode && ['multiple', 'tags'].includes(mode);
}
