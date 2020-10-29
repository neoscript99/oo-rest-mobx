import React from 'react';
import { DatePicker } from 'antd';
import { FieldProps } from './FieldProps';
import { AbstractField } from './AbstractField';
import { commonRules } from '../utils';
import moment from 'moment';
import isString from 'lodash/isString';
import { DatePickerProps } from 'antd/lib/date-picker';
interface P extends FieldProps {
  //DatePicker的required可能根据返回值不同而变化
  required?: boolean;
  defaultDiffDays?: number;
  originValue?: moment.MomentInput;
}
export type DatePickerFieldProps = DatePickerProps & P;

/**
 * 输入为moment.MomentInput
 * 输出为string，可重载decorator.getValueFromEvent
 */
export class DatePickerField extends AbstractField<DatePickerFieldProps> {
  static DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
  getField() {
    const { required, defaultDiffDays, originValue, ...pureProps } = this.getInputProps();
    return <DatePickerWrap {...pureProps} />;
  }
  get defaultDecorator() {
    const { defaultDiffDays, required, format } = this.props;
    const dateFormat = isString(format) ? format : DatePickerField.DEFAULT_DATE_FORMAT;
    return {
      rules: required ? [commonRules.required] : undefined,
      valuePropName: 'originValue',
      getValueFromEvent: (date, dateString) => dateString,
      initialValue: defaultDiffDays !== undefined ? moment().add(defaultDiffDays, 'day').format(dateFormat) : undefined,
    };
  }
}

export type DatePickerWrapProps = DatePickerProps & {
  originValue?: moment.MomentInput;
  onChangeForString?: (dateString: string) => void;
};
export class DatePickerWrap extends React.Component<DatePickerWrapProps> {
  render() {
    const { originValue, value, ...pureProps } = this.props;
    return <DatePicker {...pureProps} value={originValue ? moment(originValue) : value} />;
  }
}
