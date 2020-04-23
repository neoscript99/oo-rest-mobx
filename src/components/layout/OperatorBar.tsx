import React, { Component, CSSProperties } from 'react';
import { Button, Popconfirm } from 'antd';
import { OperatorSwitch } from './EntityList';
import { ButtonProps } from 'antd/lib/button';

export interface OperatorBarProps {
  onCreate?: () => void;
  onUpdate?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onExportSelected?: () => void;
  onExportAll?: () => void;
  operatorVisible?: OperatorSwitch;
  operatorEnable: OperatorSwitch;
  extraOperators?: React.ReactNode;
  deleteConfirm?: React.ReactNode;
}

const buttonCss: CSSProperties = {
  marginRight: '0.5rem',
};

export class OperatorBar extends Component<OperatorBarProps> {
  static defaultProps = { deleteConfirm: '确定删除所选记录吗?' };
  render() {
    const {
      onCreate,
      onUpdate,
      onView,
      onDelete,
      operatorVisible,
      operatorEnable,
      onExportSelected,
      onExportAll,
      extraOperators,
      deleteConfirm,
    } = this.props;
    if (!operatorVisible) return null;
    const btProps: ButtonProps = { type: 'primary', style: buttonCss };
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {operatorVisible.create && (
          <Button {...btProps} icon="plus-circle" onClick={onCreate}>
            新增
          </Button>
        )}
        {operatorVisible.update && (
          <Button {...btProps} disabled={!operatorEnable.update} icon="edit" onClick={onUpdate}>
            修改
          </Button>
        )}
        {operatorVisible.view && (
          <Button {...btProps} disabled={!operatorEnable.view} icon="read" onClick={onView}>
            查看
          </Button>
        )}
        {operatorVisible.delete && (
          <Popconfirm
            title={deleteConfirm}
            onConfirm={onDelete}
            okText="确定"
            cancelText="取消"
            disabled={!operatorEnable.delete}
          >
            <Button {...btProps} disabled={!operatorEnable.delete} icon="delete">
              删除
            </Button>
          </Popconfirm>
        )}
        {operatorVisible.exportSelected && (
          <Button {...btProps} disabled={!operatorEnable.exportSelected} icon="download" onClick={onExportSelected}>
            导出选择项
          </Button>
        )}
        {operatorVisible.exportAll && (
          <Button {...btProps} disabled={!operatorEnable.exportAll} icon="download" onClick={onExportAll}>
            导出所有
          </Button>
        )}
        {extraOperators}
      </div>
    );
  }
}
