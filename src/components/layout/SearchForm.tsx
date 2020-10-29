import React, { Component, KeyboardEvent } from 'react';
import { Form } from 'antd';

import { InputField } from '../../ant-design-field';
import { FormComponentProps } from '../../utils';

export interface SearchFormProps extends FormComponentProps {
  onChange: (values) => void;
}

/**
 * 接收一个form属性
 */
export abstract class SearchForm<P extends SearchFormProps = SearchFormProps, S = any> extends Component<P, S> {
  searchOnEnter(e: KeyboardEvent<any>) {
    const { onChange } = this.props;
    if (e.keyCode === 13) {
      e.stopPropagation();
      onChange();
    }
  }
}

export class SimpleSearchForm extends SearchForm {
  placeholder = '查询关键字';
  width = '16em';

  render() {
    const { form } = this.props;
    return (
      <Form layout="inline" form={form}>
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
