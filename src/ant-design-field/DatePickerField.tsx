import React from 'react';
import { DatePicker } from 'antd';
import { FieldProps } from './FieldProps';
import { AbstractField } from './AbstractField';
import { DatePickerProps } from 'antd/lib/date-picker/interface';
import { genRules } from '../utils';
export interface DatePickerFieldProps extends DatePickerProps, FieldProps {
  required?: boolean;
}
export class DatePickerField extends AbstractField<DatePickerFieldProps> {
  getField() {
    const { required, ...pureProps } = this.getInputProps();
    return <DatePicker {...pureProps} />;
  }
  getFieldProps(): FieldProps {
    const { formUtils, fieldId, decorator, formItemProps, required } = this.props;
    return {
      formUtils,
      fieldId,
      decorator: decorator || {
        rules: [genRules.momentDate(required, 'day')],
      },
      formItemProps,
    };
  }
}
