import { GetFieldDecoratorOptions, WrappedFormUtils } from 'antd/lib/form/Form';
import { FormItemProps } from 'antd/lib/form';

export interface FieldProps {
  fieldId: string;
  decorator?: Readonly<GetFieldDecoratorOptions>;
  formUtils?: Readonly<WrappedFormUtils>;
  formItemProps?: Readonly<FormItemProps>;
}
