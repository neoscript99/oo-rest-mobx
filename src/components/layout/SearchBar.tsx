import React, { Component, CSSProperties } from 'react';
import { Button } from 'antd';
import { SearchForm } from './SearchForm';
import { FormComponentProps } from 'antd/lib/form';
import { ReactUtil } from '../../utils/ReactUtil';

export interface SearchFromBarProps extends FormComponentProps {
  onSearch: (searchParam: any) => void;
  SearchForm: typeof SearchForm;
  searchParam: any;
}

const buttonCss: CSSProperties = {
  marginLeft: '0.5rem',
};

class SearchFromBar extends Component<SearchFromBarProps> {
  render() {
    const { SearchForm, form } = this.props;
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <SearchForm form={form} onChange={this.handleSearch.bind(this)} />
        <Button icon="search" type="primary" style={buttonCss} title="查询" onClick={this.handleSearch.bind(this)} />
        <Button icon="reload" style={buttonCss} title="重置" onClick={this.handleReset.bind(this)} />
      </div>
    );
  }

  handleSearch() {
    const { form, onSearch } = this.props;
    form.validateFields((err, searchParam) => err || onSearch(searchParam));
  }

  handleReset() {
    const { form, onSearch } = this.props;
    form.resetFields();
    onSearch({});
  }
}

export const SearchBar = ReactUtil.formWrapper(SearchFromBar, 'searchParam');
