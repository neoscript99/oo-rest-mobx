import React from 'react';
import { Badge, Tooltip } from 'antd';
import { BadgeProps } from 'antd/lib/badge';

export interface RunStatusProps {
  status: BadgeProps['status'];
  textMap: { [key: string]: string };
  tooltip: React.ReactNode;
}
export class RunStatus extends React.Component<RunStatusProps> {
  static defaultProps = {
    textMap: {
      success: '成功',
      error: '出错',
      default: '初始化',
      processing: '处理中',
      warning: '存在警告',
    },
  };
  render() {
    const { status, textMap, tooltip } = this.props;
    const badge = <Badge status={status} text={textMap[status || 'default']} />;
    return tooltip ? <Tooltip title={tooltip}>{badge}</Tooltip> : badge;
  }
}
