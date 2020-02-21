import { OperatorSwitch } from '../components/layout';
import { ButtonProps } from 'antd/lib/button';
import { ModalProps } from 'antd/lib/modal';
export interface CommonProps {
  tdButtonProps: Partial<ButtonProps>;
  twoColModalProps: ModalProps;
}
export class Consts {
  static allOperator: OperatorSwitch = { create: true, update: true, delete: true, view: true };

  static commonProps: CommonProps = {
    tdButtonProps: {
      type: 'primary',
      size: 'small',
      style: { margin: 2 },
    },
    twoColModalProps: { width: '48em' },
  };
}
