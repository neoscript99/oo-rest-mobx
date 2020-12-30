import React from 'react';
import ReactExport from 'react-data-export';
import { EntityColumnProps } from './EntityList';
import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ObjectUtil } from '../../utils';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
export interface EntityExporterProps {
  dataSource?: any[];
  columns: EntityColumnProps[];
  name?: string;
  actionText?: string;
  filename?: string;
}

/**
 * react-data-export依赖xlsx，下级项目自行安装
 * react-data-export/types/index.d.ts类型有问题，以文档为准
 * https://www.npmjs.com/package/react-data-export
 */
export class EntityExporter extends React.Component<EntityExporterProps> {
  static defaultProps = { actionText: '保存', name: '列表' };

  render() {
    const { dataSource, columns, name, actionText, filename } = this.props;
    const element = (
      <Button icon={<DownloadOutlined />} type="primary">
        {actionText}
      </Button>
    );
    /**
     * https://github.com/securedeveloper/react-data-export/blob/HEAD/examples/styled_excel_sheet.md
     */
    const bs = { style: 'thin', color: { rgb: 'black' } };
    const excelStyle = { border: { top: bs, bottom: bs, left: bs, right: bs } };
    const dataSet = {
      columns: columns.map((col) => ({
        title: col.title,
        width: { wch: col.cellWidth || 12 },
      })),
      data: (dataSource || []).map((item, itemIdx) =>
        columns.map((col) => {
          let value = col.dataIndex && ObjectUtil.get(item, col.dataIndex);
          if (col.renderExport) value = col.renderExport(value, item, itemIdx);
          else if (col.render) value = col.render(value, item, itemIdx);
          return { value: value || '', style: { ...excelStyle, ...col.cellStyle } };
        }),
      ),
    };
    return (
      <ExcelFile element={element} filename={filename || `${name}导出`}>
        <ExcelSheet dataSet={[dataSet]} name={name} />
      </ExcelFile>
    );
  }
}
