import { OperatorSwitch } from '../components/layout';
import { ButtonProps } from 'antd/lib/button';
export interface CommonProps {
  tdButtonProps: Partial<ButtonProps>;
}
export class Consts {
  static allOperator: OperatorSwitch = { create: true, update: true, delete: true, view: true };

  static commonProps: CommonProps = {
    tdButtonProps: {
      type: 'primary',
      size: 'small',
      style: { margin: 2 },
    },
  };
}
