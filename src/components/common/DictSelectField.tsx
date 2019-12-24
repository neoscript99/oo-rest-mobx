import React from 'react';
import { DictService } from '../../services';
import { FieldProps, SelectField } from '../../ant-design-field';
import { SelectProps } from 'antd/lib/select';

export interface DictSelectFieldProps extends SelectProps, FieldProps {
  dictService: DictService;
  dictType: string;
  defaultSelectFirst?: boolean;
}

export class DictSelectField extends React.Component<DictSelectFieldProps> {
  getField() {
    const { dictService, dictType, ...fieldProps } = this.props;
    return <SelectField dataSource={dictService.getDict(dictType)} valueProp="code" labelProp="name" {...fieldProps} />;
  }
}
