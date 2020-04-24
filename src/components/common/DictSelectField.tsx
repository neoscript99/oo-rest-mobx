import React from 'react';
import { DictService } from '../../services';
import { SelectField, SelectFieldProps } from '../../ant-design-field';

export interface DictSelectFieldProps extends Omit<SelectFieldProps, 'dataSource' | 'valueProp' | 'labelProp'> {
  dictService: DictService;
  dictType: string;
  parentDictCode?: string;
}

export class DictSelectField extends React.Component<DictSelectFieldProps> {
  render() {
    const { dictService, dictType, parentDictCode, ...fieldProps } = this.props;
    //作为选择框展示时，只显示生效的字典项
    const dictList = dictService.getDict(dictType).filter(dict => !!dict.enabled);
    const dataSource = parentDictCode ? dictList.filter(dict => dict.parentCode === parentDictCode) : dictList;
    return <SelectField dataSource={dataSource} valueProp="code" labelProp="name" {...fieldProps} />;
  }
}
