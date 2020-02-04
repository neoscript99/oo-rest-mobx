import { GetFieldDecoratorOptions, WrappedFormUtils } from 'antd/lib/form/Form';
import { FormItemProps } from 'antd/lib/form';

export interface FieldProps {
  fieldId: string;
  decorator?: Readonly<GetFieldDecoratorOptions>;
  /**
   * 如果未传入初步表现会导致校验规则无效，比如不会显示必输项的红色星号
   */
  formUtils?: Readonly<WrappedFormUtils>;
  formItemProps?: Readonly<FormItemProps>;
  readonly?: boolean;
  hideFormItem?: boolean;
}
