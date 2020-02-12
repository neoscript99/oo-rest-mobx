import React, { Component } from 'react';
import { Tooltip } from 'antd';
import { InfoIcon } from './InfoIcon';

export interface TooltipLabelProps {
  tooltip?: React.ReactNode;
  label?: React.ReactNode;
}
export class TooltipLabel extends Component<TooltipLabelProps> {
  render() {
    const { tooltip, label } = this.props;
    return (
      <Tooltip title={tooltip}>
        <span>{label}</span>
        <InfoIcon />
      </Tooltip>
    );
  }
}
