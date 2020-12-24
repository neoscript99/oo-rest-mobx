import React, { Component, KeyboardEvent } from 'react';
import { Form } from 'antd';

import { InputField } from '../../ant-design-field';
import { FormProps } from 'antd/lib/form';

export interface SearchFormProps extends Partial<FormProps> {
  onSearch: (searchParam: any) => void;
}

/**
 * 接收一个form属性
 */
export abstract class SearchForm<P extends SearchFormProps = SearchFormProps, S = any> extends Component<P, S> {
  /**
   * 如果只有一个input本身就支持回车提交
   * 如果有多个，需要绑定本方法
   * @param e
   */
  searchOnEnter(e: KeyboardEvent<any>) {
    const { form, onSearch } = this.props;
    e.stopPropagation();
    //submit不会触发onFinish，还需改造
    //form.submit();
    form.validateFields().then((searchParam) => onSearch(searchParam));
  }
}

export class SimpleSearchForm extends SearchForm {
  placeholder = '查询关键字';
  width = '16em';

  render() {
    const { form, onFinish } = this.props;
    return (
      <Form layout="inline" form={form} onFinish={onFinish}>
        <InputField fieldId="searchKey" style={{ width: this.width }} placeholder={this.placeholder} formUtils={form} />
      </Form>
    );
  }
}
