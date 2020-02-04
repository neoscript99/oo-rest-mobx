import React from 'react';
import { SelectFieldProps, SelectField } from '../../ant-design-field';
import { PickPartial } from '../../utils';

export class DeptSelectField extends React.Component<PickPartial<SelectFieldProps, 'valueProp'>> {
  render() {
    const { formItemProps, ...props } = this.props;
    const fiProps = { label: '单位', ...formItemProps };
    return (
      <SelectField
        fieldId="dept.id"
        formItemProps={fiProps}
        valueProp="id"
        labelProp="name"
        placeholder="---选择单位---"
        showSearch={true}
        {...props}
      />
    );
  }
}
