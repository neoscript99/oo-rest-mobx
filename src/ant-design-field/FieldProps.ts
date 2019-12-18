import { GetFieldDecoratorOptions, WrappedFormUtils } from 'antd/lib/form/Form';
import { FormItemProps } from 'antd/lib/form';

export interface FieldProps {
  fieldId: string;
  decorator?: GetFieldDecoratorOptions;
  formUtils?: WrappedFormUtils;
  formItemProps?: FormItemProps;
}
