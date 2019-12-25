import React from 'react';
import { DictService } from '../../services';
import { FieldProps, SelectField } from '../../ant-design-field';
import { SelectProps } from 'antd/lib/select';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';

export interface DictSelectFieldProps extends SelectProps, FieldProps {
  dictService: DictService;
  dictType: string;
  defaultSelectFirst?: boolean;
}

export class DictSelectField extends React.Component<DictSelectFieldProps> {
  render() {
    const { dictService, dictType, defaultSelectFirst, decorator, ...fieldProps } = this.props;
    const dataSource = dictService.getDict(dictType);
    const newDecorator: GetFieldDecoratorOptions = { ...decorator };
    if (defaultSelectFirst && dataSource && dataSource.length > 0) {
      newDecorator.initialValue = dataSource[0].code;
    }
    return (
      <SelectField dataSource={dataSource} valueProp="code" labelProp="name" {...fieldProps} decorator={newDecorator} />
    );
  }
}
