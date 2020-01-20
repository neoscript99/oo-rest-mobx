import React from 'react';
import { Upload, Button } from 'antd';
import { FieldProps } from './FieldProps';
import { AbstractField } from './AbstractField';
import { UploadChangeParam, UploadProps } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';

export class UploadField extends AbstractField<UploadWrapProps & FieldProps> {
  getField() {
    return (
      <UploadWrap {...this.getInputProps()}>
        <Button icon="upload">选择文件</Button>
      </UploadWrap>
    );
  }
  get defaultDecorator() {
    const { maxNumber, required } = this.props;
    const single = maxNumber === 1;
    return {
      rules: required ? [{ required: true, type: single ? 'object' : 'array', message: '不能为空' }] : undefined,
      getValueFromEvent: (info: UploadChangeParam) => {
        if (single) {
          return info.file.status === 'done' && info.file.response;
        } else return info.fileList.filter(file => file.status === 'done').map(file => file.response);
      },
    };
  }
}
export interface UploadWrapProps extends UploadProps {
  value?: any;
  /**
   * 当为1时，返回值传入值都是UploadResponse
   */
  maxNumber?: number;
  required?: boolean;
  serverRoot: string;
}
class UploadWrap extends React.Component<UploadWrapProps> {
  handleChange(info: UploadChangeParam) {
    const { onChange } = this.props;
    onChange && info.file.status === 'done' && onChange(info);
    console.log('UploadWrap.handleChange: ', info);
  }
  render() {
    const { value, maxNumber, serverRoot, required, ...uploadProps } = this.props;
    //单一附件
    const fileList = value && (maxNumber === 1 ? [value] : value).map(responseToFile.bind(undefined, serverRoot));
    console.log('UploadWrap.render: ', value, fileList);
    return (
      <Upload
        fileList={fileList}
        action={`${serverRoot}/upload`}
        data={({ uid, name, lastModified, size, type }) => ({ uid, name, lastModified, size, type })}
        {...uploadProps}
        onChange={this.handleChange.bind(this)}
      />
    );
  }
}
/**
 * 本地文件展示和服务端domain转换
 */
export interface UploadResponse {
  id: string;
  name: string;
  fileSize: number;
  fileId: string;
  ownerId?: string;
  ownerName?: string;
  dateCreated: Date;
}

const responseToFile = (serverRoot: string, res: UploadResponse) =>
  ({
    uid: res.id,
    name: res.name,
    status: 'done',
    url: `${serverRoot}/download/${res.id}`,
    response: res,
  } as UploadFile);
