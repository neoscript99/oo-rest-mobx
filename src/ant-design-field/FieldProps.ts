import { FormInstance } from 'antd/lib/form/Form';
import { FormItemProps } from 'antd/lib/form';
import { NamePath } from 'rc-field-form/lib/interface';
export interface FieldProps {
  //antd4可改用formItemProps.name
  fieldId?: NamePath;
  //antd4合并到formItemProps
  //decorator?: Readonly<FormItemProps>;
  /**
   * 如果未传入初步表现会导致校验规则无效，比如不会显示必输项的红色星号
   */
  formUtils?: Readonly<FormInstance>;
  formItemProps?: Readonly<FormItemProps>;
  readonly?: boolean;
  hideFormItem?: boolean;
}
