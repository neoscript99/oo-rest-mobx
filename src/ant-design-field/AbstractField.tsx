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
    const { formUtils, fieldId, decorator, formItemProps, hideFormItem } = this.getFieldProps();
    const field = formUtils ? formUtils.getFieldDecorator<any>(fieldId, decorator)(this.getField()) : this.getField();
    /**
     * 如果fieldDecorator直接作为根控件返回
     * props中不存在Form.Item需要的FIELD_META_PROP（实际是存在的，typescript代码中被隐藏）
     * 导致结果是校验规则相关提示无法显示（如果不需要，直接作为根控件也没关系）
     * */
    return hideFormItem ? field : <Form.Item {...formItemProps}>{field}</Form.Item>;
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
