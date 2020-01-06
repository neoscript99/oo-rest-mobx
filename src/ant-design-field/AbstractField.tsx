import React from 'react';
import { FieldProps } from './FieldProps';
import { Form } from 'antd';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';

/**
 * FormItem目前必须耦合在一起，否则FormItem.getControls拿不到下级组件，
 * 这也应该是官方demo都是需要耦合在一起的原因
 */
export abstract class AbstractField<P extends FieldProps = FieldProps, S = any> extends React.Component<P, S> {
  render() {
    const { formUtils, fieldId, decorator, formItemProps } = this.getFieldProps();
    const field = this.getField();
    //直接作为根控件返回，props中不存在Form.Item需要的FIELD_META_PROP（实际是存在的，typescript代码中被隐藏）
    return (
      <Form.Item {...formItemProps}>
        {formUtils ? formUtils.getFieldDecorator<any>(fieldId, decorator)(field) : field}
      </Form.Item>
    );
  }

  abstract getField(): React.ReactNode;
  getInputProps() {
    const { formUtils, fieldId, decorator, formItemProps, readonly, ...pureProps } = this.props;
    return { ...pureProps, disabled: readonly };
  }
  getFieldProps(): FieldProps {
    const { formUtils, fieldId, decorator, formItemProps } = this.props;
    return { formUtils, fieldId, decorator: { ...this.defaultDecorator, ...decorator }, formItemProps };
  }

  get defaultDecorator(): GetFieldDecoratorOptions | null {
    return null;
  }
}
