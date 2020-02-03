import React from 'react';
import { SelectFieldProps, SelectField } from '../../ant-design-field';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export class DeptSelectField extends React.Component<PartialBy<SelectFieldProps, 'valueProp' | 'labelProp'>> {
  render() {
    const { formItemProps, ...props } = this.props;
    const fiProps = { label: '机构', ...formItemProps };
    return (
      <SelectField
        fieldId="dept.id"
        formItemProps={fiProps}
        valueProp="id"
        labelProp="name"
        {...props}
      />
    );
  }
}
