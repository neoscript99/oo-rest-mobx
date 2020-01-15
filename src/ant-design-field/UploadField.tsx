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
}
class UploadWrap extends React.Component<UploadWrapProps> {
  render() {
    const { value, ...uploadProps } = this.props;
    const fileList = value && (Array.isArray(value) ? value : [value]);
    return <Upload {...uploadProps} fileList={fileList} />;
  }
}
