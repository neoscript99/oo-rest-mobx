import React from 'react';
import { DatePicker } from 'antd';
import { FieldProps } from './FieldProps';
import { AbstractField } from './AbstractField';
import { commonRules } from '../utils';
import moment from 'moment';
import { DatePickerProps } from 'antd/lib/date-picker';
interface P extends FieldProps {
  //DatePicker的required Rule可能根据返回值是string还是date变化，参考Uploader，有需要加回去
  //required?: boolean;
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
    const { defaultDiffDays, originValue, ...pureProps } = this.getInputProps();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <DatePickerWrap {...pureProps} />;
  }
  get defaultFormItemProps() {
    const { defaultDiffDays, format } = this.props;
    const dateFormat = typeof format == 'string' ? format : DatePickerField.DEFAULT_DATE_FORMAT;
    return {
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
