import React, { Component, KeyboardEvent } from 'react';
import { Form } from 'antd';

import { InputField } from '../../ant-design-field';
import { FormProps } from 'antd/lib/form';

export type SearchFormProps = Partial<FormProps>;

/**
 * 接收一个form属性
 */
export abstract class SearchForm<P extends SearchFormProps = SearchFormProps, S = any> extends Component<P, S> {
  searchOnEnter(e: KeyboardEvent<any>) {
    const { form } = this.props;
    if (form && e.keyCode === 13) {
      e.stopPropagation();
      form.submit;
    }
  }
}

export class SimpleSearchForm extends SearchForm {
  placeholder = '查询关键字';
  width = '16em';

  render() {
    const { form } = this.props;
    return (
      <Form layout="inline" {...this.props}>
        <InputField
          fieldId="searchKey"
          style={{ width: this.width }}
          placeholder={this.placeholder}
          onKeyDown={this.searchOnEnter.bind(this)}
          formUtils={form}
        />
      </Form>
    );
  }
}
