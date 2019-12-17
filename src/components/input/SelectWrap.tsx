import React from 'react';
import { Select } from 'antd';

export interface SelectWrapProps {
  dataSource: any[];
  keyProp?: string;
  valueProp: string;
  labelProp: string;
  value?: any;
  onChange?: (value: any) => void;
}

export class SelectWrap extends React.Component<SelectWrapProps> {
  handleChange(value: any) {
    const { onChange } = this.props;
    onChange && onChange(value);
  }
  render() {
    const { dataSource, keyProp, valueProp, labelProp, value } = this.props;
    return (
      <Select value={value} onChange={this.handleChange.bind(this)}>
        {dataSource.map(item => (
          <Select.Option key={item[keyProp || valueProp]} value={item[valueProp]}>
            {item[labelProp]}
          </Select.Option>
        ))}
      </Select>
    );
  }
}
