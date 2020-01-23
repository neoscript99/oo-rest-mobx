import React from 'react';
import { Upload, Button, message } from 'antd';
import { FieldProps } from './FieldProps';
import { AbstractField } from './AbstractField';
import { RcFile, UploadChangeParam, UploadProps } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { AttachmentEntity, AttachmentService } from '../services';

export class UploadField extends AbstractField<UploadWrapProps & FieldProps> {
  getField() {
    const { readonly } = this.props;
    return <UploadWrap {...this.getInputProps()}>{!readonly && <Button icon="upload">选择文件</Button>}</UploadWrap>;
  }
  get defaultDecorator() {
    const { maxNumber, required } = this.props;
    const single = maxNumber === 1;
    return {
      rules: required ? [{ required: true, type: single ? 'object' : 'array', message: '不能为空' }] : undefined,
      getValueFromEvent: (info: UploadChangeParam) => {
        console.debug('UploadField.getValueFromEvent: ', info);
        const all = info.fileList.filter(file => file.status === 'done').map(file => file.response);
        return single && all.length > 0 ? all[0] : all;
      },
    };
  }
}
export interface UploadWrapProps extends UploadProps {
  value?: AttachmentEntity | AttachmentEntity[];
  /**
   * 当为1时，返回值传入值都是UploadResponse
   */
  maxNumber?: number;
  required?: boolean;
  attachmentService: AttachmentService;
  maxSizeMB?: number;
}
interface UploadWrapState {
  fileList?: Array<UploadFile>;
}
class UploadWrap extends React.Component<UploadWrapProps, UploadWrapState> {
  constructor(props: UploadWrapProps) {
    super(props);
    const { value, maxNumber, attachmentService } = props;
    //在初始化的时候，后台AttachmentInfo转为fileList
    //fileList如果出现在props中，就算是undefined，defaultFileList将不起作用
    if (!this.state?.fileList && value) {
      //服务端domain转换为文件列表
      this.state = {
        fileList: (maxNumber === 1 ? [value] : value).map(res => ({
          uid: res.id,
          name: res.name,
          status: 'done',
          response: res,
          url: `${attachmentService.downloadUrl}/${res.id}`,
        })),
      };
    }
  }
  handleChange(info: UploadChangeParam) {
    const { onChange, attachmentService } = this.props;
    onChange && onChange(info);
    console.debug('UploadWrap.handleChange: ', info);
    //去除beforeUpload校验不通过的附件，目前观察status为空
    const fileList = info.fileList.filter(file => {
      if (file.response) file.url = `${attachmentService.downloadUrl}/${file.response.id}`;
      return !!file.status;
    });
    this.setState({ fileList });
  }

  //props中传入的优先
  handleRemove(file: UploadFile) {
    //被主表关联，不能直接删除，先把owner值为空，由定时任务删除
    //return this.props.attachmentService.delete(file.response.id).then(count => count === 1);
    return this.props.attachmentService.save({ id: file.response.id, ownerId: null, ownerName: null }).then(v => true);
  }
  beforeUpload(file: RcFile, fileList: RcFile[]) {
    const { maxNumber, maxSizeMB, beforeUpload } = this.props;
    if (beforeUpload) {
      if (!beforeUpload(file, fileList)) return false;
    }
    const num = maxNumber || 10;
    if ((this.state?.fileList?.length || 0) >= num) {
      message.error(`最多只能选择个${num}附件`);
      return false;
    }
    const size = maxSizeMB || 20;
    if (file.size / 1024 / 1024 > size) {
      message.error(`文件太大，不能超过${size}MB`);
      return false;
    }
    return true;
  }
  render() {
    const { disabled, attachmentService, required, ...uploadProps } = this.props;

    return (
      <Upload
        fileList={this.state?.fileList}
        action={attachmentService.uploadUrl}
        data={({ uid, name, lastModified, size, type }) => ({ uid, name, lastModified, size, type })}
        showUploadList={{ showRemoveIcon: !disabled }}
        onRemove={this.handleRemove.bind(this)}
        {...uploadProps}
        onChange={this.handleChange.bind(this)}
        beforeUpload={this.beforeUpload.bind(this)}
      />
    );
  }
}
