import React from 'react';
import { FieldProps, GetFieldDecoratorOptions } from './FieldProps';
import { Form } from 'antd';

/**
 * FormItem目前必须耦合在一起，否则FormItem.getControls拿不到下级组件，
 * 这也应该是官方demo都是需要耦合在一起的原因
 */
export abstract class AbstractField<P extends FieldProps = FieldProps, S = any> extends React.Component<P, S> {
  render() {
    const { formUtils, fieldId, decorator, formItemProps, hideFormItem } = this.getFieldProps();
    const field = this.getField();
    /**
     * 如果fieldDecorator直接作为根控件返回
     * props中不存在Form.Item需要的FIELD_META_PROP（实际是存在的，typescript代码中被隐藏）
     * 导致结果是校验规则相关提示无法显示（如果不需要，直接作为根控件也没关系）
     * */
    if (hideFormItem) return field;
    else {
      //被设置了 name 属性的 Form.Item 包装的控件，表单控件会自动添加 value, 你不能用控件的 value 或 defaultValue 等属性来设置表单域的值，默认值可以用 Form 里的 initialValues 来设置
      //因此，不需设置name的地方，千万不要设置
      let itemName = fieldId;
      //如果包含'.'，按照antd4要求拆分为输入
      if (typeof fieldId === 'string' && fieldId.indexOf('.') > -1) itemName = fieldId.split('.');
      return (
        <Form.Item name={itemName} {...formItemProps} {...decorator}>
          {field}
        </Form.Item>
      );
    }
  }

  abstract getField(): React.ReactNode;
  getInputProps() {
    const { formUtils, fieldId, decorator, formItemProps, hideFormItem, readonly, ...pureProps } = this.props;
    return { ...pureProps, disabled: readonly };
  }
  getFieldProps(): FieldProps {
    const { formUtils, fieldId, decorator, formItemProps, hideFormItem } = this.props;
    return { formUtils, fieldId, formItemProps, hideFormItem, decorator: { ...this.defaultDecorator, ...decorator } };
  }

  get defaultDecorator(): GetFieldDecoratorOptions | null {
    return null;
  }
}
