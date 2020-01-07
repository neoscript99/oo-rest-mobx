import React from 'react';
import { DatePicker } from 'antd';
import { FieldProps } from './FieldProps';
import { AbstractField } from './AbstractField';
import { DatePickerProps } from 'antd/lib/date-picker/interface';
import { commonRules } from '../utils';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import moment from 'moment';
import isArray from 'lodash/isArray';

export interface DatePickerFieldProps extends DatePickerProps, FieldProps {
  //DatePicker的required可能根据返回值不同而变化
  required?: boolean;
  defaultDiffDays?: number;
  originValue?: moment.MomentInput;
}

/**
 * 输入为moment.MomentInput
 * 输出为string，可重载decorator.getValueFromEvent
 */
export class DatePickerField extends AbstractField<DatePickerFieldProps> {
  getField() {
    const { required, defaultDiffDays, originValue, ...pureProps } = this.getInputProps();
    return <DatePickerWrapper {...pureProps} />;
  }
  get defaultDecorator() {
    const { defaultDiffDays, required, format } = this.props;
    const dateFormat = format ? (isArray(format) ? format[0] : format) : 'YYYY-MM-DD';
    return {
      rules: required ? [commonRules.required] : undefined,
      valuePropName: 'originValue',
      getValueFromEvent: (date, dateString) => dateString,
      initialValue:
        defaultDiffDays !== undefined
          ? moment()
              .add(defaultDiffDays, 'day')
              .format(dateFormat)
          : undefined,
    };
  }
}

export interface DatePickerWrapperProps extends DatePickerProps {
  originValue?: moment.MomentInput;
  onChangeForString?: (dateString: string) => void;
}
export class DatePickerWrapper extends React.Component<DatePickerWrapperProps> {
  render() {
    const { originValue, value, ...pureProps } = this.props;
    return <DatePicker {...pureProps} value={originValue ? moment(originValue) : value} />;
  }
}
