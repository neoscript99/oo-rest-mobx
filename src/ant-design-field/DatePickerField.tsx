import React from 'react';
import { DatePicker } from 'antd';
import { FieldProps } from './FieldProps';
import { AbstractField } from './AbstractField';
import { DatePickerProps } from 'antd/lib/date-picker/interface';
import { genRules } from '../utils';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import moment from 'moment';
export interface DatePickerFieldProps extends DatePickerProps, FieldProps {
  required?: boolean;
  defaultDiffDays?: number;
}
export class DatePickerField extends AbstractField<DatePickerFieldProps> {
  getField() {
    const { required, ...pureProps } = this.getInputProps();
    return <DatePicker {...pureProps} />;
  }
  getFieldProps(): FieldProps {
    const { formUtils, fieldId, decorator, defaultDiffDays, formItemProps, required } = this.props;
    const newDecorator: GetFieldDecoratorOptions = { ...decorator };
    if (!newDecorator.rules) newDecorator.rules = [genRules.momentDay(required)];
    if (defaultDiffDays != undefined) {
      newDecorator.initialValue = moment().add(defaultDiffDays, 'day');
    }
    return {
      formUtils,
      fieldId,
      decorator: newDecorator,
      formItemProps,
    };
  }
}
