import React from 'react';
import { DictService } from '../../services';
import { Tag } from 'antd';
import { StringUtil } from '../../utils';

export interface DictViewProps {
  dictService: DictService;
  dictType: string;
  dictCode: string;
  multipleMode?: boolean;
}

export class DictView extends React.Component<DictViewProps> {
  render() {
    const { dictService, dictType, dictCode, multipleMode } = this.props;
    if (StringUtil.isBlank(dictCode)) return null;
    if (!multipleMode) return dictService.dictRender(dictType, dictCode);
    const codes = dictCode.split(',');
    return (
      <div>
        {codes.map((code) => (
          <Tag key={code}>{dictService.dictRender(dictType, code)}</Tag>
        ))}
      </div>
    );
  }

  static build = (dictService: DictService) => (props: Omit<DictViewProps, 'dictService'>) => (
    <DictView dictService={dictService} {...props} />
  );
}
