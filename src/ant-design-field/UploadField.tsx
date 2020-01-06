import React from 'react';
import { Upload, Button } from 'antd';
import { FieldProps } from './FieldProps';
import { AbstractField } from './AbstractField';
import { UploadProps } from 'antd/lib/upload';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';

export class UploadField extends AbstractField<UploadProps & FieldProps> {
  getField() {
    return (
      <Upload {...this.getInputProps()}>
        <Button icon="upload">选择文件</Button>
      </Upload>
    );
  }
  get defaultDecorator(): GetFieldDecoratorOptions {
    return {
      valuePropName: 'fileList',
    };
  }
}
