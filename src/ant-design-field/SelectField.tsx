import React from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { FieldProps } from './FieldProps';
import { AbstractField } from './AbstractField';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import { ObjectUtil, StringUtil } from '../utils';

export interface SelectFieldProps extends SelectWrapProps, FieldProps {}

export class SelectField extends AbstractField<SelectFieldProps> {
  get defaultDecorator() {
    const { mode, multiValueType } = this.props;
    const newDecorator: GetFieldDecoratorOptions = {};
    newDecorator.initialValue = getFirstValue(this.props);
    //如果是多值方式，将选择项的value转为为逗号分隔的字符串
    if (isMultipleMode(mode)) {
      newDecorator.getValueFromEvent = array => (multiValueType === 'array' ? array : (array as string[]).join(','));

      newDecorator.valuePropName = 'multiValue';
    }

    return newDecorator;
  }

  getField() {
    return <SelectWrap {...this.getInputProps()} />;
  }
}
export interface SelectWrapProps extends SelectProps {
  dataSource?: any[];
  keyProp?: string;
  valueProp: string;
  labelProp?: string;
  labelRender?: (item) => React.ReactNode;
  defaultSelectFirst?: boolean;
  multiValue?: string | any[];
  //string 逗号分隔value
  //array 原始功能
  //默认为string
  multiValueType?: 'string' | 'array';
}

/**
 * valuePropName： 多值方式：multiValue 普通：value
 */
export class SelectWrap extends React.Component<SelectWrapProps> {
  render() {
    const {
      dataSource,
      keyProp,
      valueProp,
      labelProp,
      labelRender,
      defaultSelectFirst,
      multiValue,
      multiValueType,
      value,
      mode,
      ...selectProps
    } = this.props;
    let v = value;
    if (isMultipleMode(mode)) {
      if (typeof multiValue === 'string') v = StringUtil.isBlank(multiValue) ? [] : multiValue.split(',');
      else if (multiValue === null) v = [];
      else if (multiValue) v = multiValue;
    }
    // value: undefined如果传入，defaultValue不起作用，3.26.15版本无此问题
    // undefined不传入，allowClear出现问题，要点击2次
    // const values = v !== undefined ? { value: v } : { defaultValue: getFirstValue(this.props) };
    const values = { value: v, defaultValue: getFirstValue(this.props) };
    return (
      <Select mode={mode} {...values} placeholder="---请选择---" optionFilterProp="children" {...selectProps}>
        {dataSource &&
          dataSource.map(item => (
            <Select.Option key={ObjectUtil.get(item, keyProp || valueProp)} value={ObjectUtil.get(item, valueProp)}>
              {labelRender
                ? labelRender(item)
                : labelProp
                ? ObjectUtil.get(item, labelProp)
                : ObjectUtil.get(item, valueProp)}
            </Select.Option>
          ))}
      </Select>
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

function getFirstValue(props: SelectWrapProps): any[] | string | undefined {
  const { defaultSelectFirst, dataSource, valueProp, mode, multiValueType } = props;
  if (!(defaultSelectFirst && dataSource && dataSource.length > 0)) return undefined;

  const defaultValue = ObjectUtil.get(dataSource[0], valueProp);
  return isMultipleMode(mode) && multiValueType === 'array' ? [defaultValue] : defaultValue;
}
