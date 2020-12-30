import { FormInstance } from 'antd/lib/form/Form';
import { FormItemProps } from 'antd/lib/form';
import { NamePath, Rule } from 'rc-field-form/lib/interface';
export interface GetFieldDecoratorOptions {
  /** 子节点的值的属性，如 Checkbox 的是 'checked' */
  valuePropName?: string;
  /** 子节点的初始值，类型、可选值均由子节点决定 */
  initialValue?: any;
  /** 收集子节点的值的时机 */
  trigger?: string;
  /** 可以把 onChange 的参数转化为控件的值，例如 DatePicker 可设为：(date, dateString) => dateString */
  getValueFromEvent?: (...args: any[]) => any;
  /** Get the component props according to field value. */
  getValueProps?: (value: any) => any;
  /** 校验子节点值的时机 */
  validateTrigger?: string | string[];
  /** 校验规则，参见 [async-validator](https://github.com/yiminghe/async-validator) */
  rules?: Rule[];
  /** 是否和其他控件互斥，特别用于 Radio 单选控件 */
  exclusive?: boolean;
  /** Normalize value to form component */
  normalize?: (value: any, prevValue: any, allValues: any) => any;
  /** Whether stop validate on first rule of error for this field.  */
  validateFirst?: boolean;
  /** 是否一直保留子节点的信息 */
  preserve?: boolean;
}
export interface FieldProps {
  //antd4可改用formItemProps.name
  fieldId?: NamePath;
  //antd4可改用formItemProps
  decorator?: Readonly<GetFieldDecoratorOptions>;
  /**
   * 如果未传入初步表现会导致校验规则无效，比如不会显示必输项的红色星号
   */
  formUtils?: Readonly<FormInstance>;
  formItemProps?: Readonly<FormItemProps>;
  readonly?: boolean;
  hideFormItem?: boolean;
}
