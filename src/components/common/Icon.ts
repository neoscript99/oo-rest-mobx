import React from 'react';
import * as Icons from '@ant-design/icons';
import { StringUtil } from '../../utils';
export interface IconProps {
  type: string;
  theme: 'Outlined' | 'TwoTone';
}
export function Icon(props: IconProps) {
  const { type, theme } = props;
  const ant4Type = StringUtil.upperFirst(StringUtil.camelCase(type));
  const icon = ant4Type + theme;
  if (Icons[icon]) return React.createElement(Icons[icon]);
  else throw `Icon不存在：${icon}`;
}

Icon.defaultProps = {
  theme: 'Outlined',
};
