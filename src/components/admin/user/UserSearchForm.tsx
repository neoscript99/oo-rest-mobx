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
    const { deptList, ...formProps } = this.props;
    const { form } = this.props;
    const searchOnEnter = this.searchOnEnter.bind(this);
    return (
      <Form {...formProps} layout="inline" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        {deptList && deptList.length > 0 && (
          <DeptSelectField
            fieldId="deptId"
            dataSource={deptList}
            formItemProps={{ label: '' }}
            formUtils={form}
            style={{ width: '15em' }}
            placeholder="选择单位"
            allowClear
          />
        )}
        <InputField
          fieldId="account"
          style={{ width: '8em' }}
          placeholder="帐号(..*)"
          onPressEnter={searchOnEnter}
          formUtils={form}
        />
        <InputField
          fieldId="name"
          style={{ width: '8em' }}
          placeholder="姓名(*..*)"
          onPressEnter={searchOnEnter}
          formUtils={form}
        />
      </Form>
    );
  }
}
