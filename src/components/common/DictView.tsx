import React from 'react';
import { DictService } from '../../services';
import { Tag } from 'antd';
import { StringUtil } from '../../utils';
import { EntityColumnProps } from '../layout';

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
    if (!multipleMode) return dictService.getName(dictType, dictCode);
    const codes = dictCode.split(',');
    return (
      <div>
        {codes.map((code) => (
          <Tag key={code}>{dictService.getName(dictType, code)}</Tag>
        ))}
      </div>
    );
  }

  static build = (dictService: DictService) => (props: Omit<DictViewProps, 'dictService'>) => (
    <DictView dictService={dictService} {...props} />
  );

  static dictColumn(dictService: DictService, title: string, dataIndex: string, typeId: string): EntityColumnProps {
    return { title, dataIndex, render: dictService.getName.bind(null, typeId) };
  }
  static multiDictColumn(
    dictService: DictService,
    title: string,
    dataIndex: string,
    typeId: string,
  ): EntityColumnProps {
    return {
      title,
      dataIndex,
      render: (text) => <DictView dictService={dictService} dictType={typeId} dictCode={text} multipleMode={true} />,
      renderExport: (text) => {
        if (!text) return null;
        const codes = text.split(',');
        return codes.map((code) => dictService.getName(typeId, code)).join(',');
      },
    };
  }
}
