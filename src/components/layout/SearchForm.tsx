import React, { Component, KeyboardEvent } from 'react';
import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { InputField } from '../../ant-design-field';

export interface SearchFormProps extends FormComponentProps {
  onChange: () => void;
}

/**
 * 接收一个form属性
 */
export abstract class SearchForm<P extends SearchFormProps = SearchFormProps> extends Component<P> {
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
      <Form layout="inline">
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
