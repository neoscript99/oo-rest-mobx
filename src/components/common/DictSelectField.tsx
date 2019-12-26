import React from 'react';
import { DictService } from '../../services';
import { SelectField, SelectFieldProps } from '../../ant-design-field';

export interface DictSelectFieldProps extends Omit<SelectFieldProps, 'dataSource' | 'valueProp' | 'labelProp'> {
  dictService: DictService;
  dictType: string;
}

export class DictSelectField extends React.Component<DictSelectFieldProps> {
  render() {
    const { dictService, dictType, ...fieldProps } = this.props;
    const dataSource = dictService.getDict(dictType);
    return <SelectField dataSource={dataSource} valueProp="code" labelProp="name" {...fieldProps} />;
  }
}
