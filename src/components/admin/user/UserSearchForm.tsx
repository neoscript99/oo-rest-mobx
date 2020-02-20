import React from 'react';
import { SearchForm, SearchFormProps } from '../../layout';
import { Form } from 'antd';
import { DeptSelectField } from '../../common';
import { InputField } from '../../../ant-design-field';
export interface UserSearchFormProps extends SearchFormProps {
  deptList?: any[];
}
export class UserSearchForm extends SearchForm<UserSearchFormProps> {
  render() {
    const { form, deptList } = this.props;
    return (
      <Form layout="inline" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        {deptList && deptList.length > 0 && (
          <DeptSelectField
            fieldId="deptId"
            dataSource={deptList}
            formItemProps={{ label: '' }}
            formUtils={form}
            style={{ width: '15em' }}
            placeholder="选择单位"
          />
        )}
        <InputField
          fieldId="account"
          style={{ width: '8em' }}
          placeholder="帐号(..*)"
          onKeyDown={this.searchOnEnter.bind(this)}
          formUtils={form}
        />
        <InputField
          fieldId="name"
          style={{ width: '8em' }}
          placeholder="姓名(*..*)"
          onKeyDown={this.searchOnEnter.bind(this)}
          formUtils={form}
        />
      </Form>
    );
  }
}
