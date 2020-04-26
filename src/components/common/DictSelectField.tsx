import React from 'react';
import { DictService } from '../../services';
import { SelectField, SelectFieldProps } from '../../ant-design-field';

export interface DictSelectFieldProps extends Omit<SelectFieldProps, 'dataSource' | 'valueProp' | 'labelProp'> {
  dictService: DictService;
  dictType: string;
  parentDictCode?: string;
  showAll?: boolean;
}

export class DictSelectField extends React.Component<DictSelectFieldProps> {
  render() {
    const { dictService, dictType, parentDictCode, showAll, ...fieldProps } = this.props;
    //作为选择框展示时，只显示生效的字典项
    let dictList = dictService.getDict(dictType);
    if (parentDictCode) dictList = dictList.filter(dict => dict.parentCode === parentDictCode);
    if (!showAll) dictList = dictList.filter(dict => !!dict.enabled);
    return <SelectField dataSource={dictList} valueProp="code" labelProp="name" {...fieldProps} />;
  }
}
