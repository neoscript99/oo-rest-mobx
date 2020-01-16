import React from 'react';
import { Upload, Button } from 'antd';
import { FieldProps } from './FieldProps';
import { AbstractField } from './AbstractField';
import { UploadProps } from 'antd/lib/upload';

export class UploadField extends AbstractField<UploadProps & FieldProps> {
  getField() {
    return (
      <UploadWrap {...this.getInputProps()}>
        <Button icon="upload">选择文件</Button>
      </UploadWrap>
    );
  }
}
interface UploadWrapProps extends UploadProps {
  value?: any;
  maxNumber?: number;
}
class UploadWrap extends React.Component<UploadWrapProps> {
  render() {
    const { value, maxNumber, ...uploadProps } = this.props;
    //单一附件
    const fileList = value && maxNumber === 1 ? [value] : value;
    return <Upload {...uploadProps} fileList={fileList} />;
  }
}
