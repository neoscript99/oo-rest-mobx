import React from 'react';
import { Upload, Button, message } from 'antd';
import { FieldProps } from './FieldProps';
import { AbstractField } from './AbstractField';
import { RcFile, UploadChangeParam, UploadProps } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { AttachmentEntity, AttachmentService } from '../services';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';

export class UploadField extends AbstractField<UploadWrapProps & FieldProps> {
  getField() {
    return <UploadWrap {...this.getInputProps()} />;
  }
  get defaultDecorator(): GetFieldDecoratorOptions {
    const { maxNumber, required } = this.props;
    const single = maxNumber === 1;
    return {
      rules: required ? [{ required: true, type: single ? 'object' : 'array', message: '不能为空' }] : undefined,
      getValueFromEvent: (info: UploadChangeParam) => {
        console.debug('UploadField.getValueFromEvent: ', info);
        const all = info.fileList.filter(file => file.status === 'done').map(file => file.response);
        return single ? (all.length > 0 ? all[0] : undefined) : all;
      },
      trigger: 'onValueChange',
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
  onValueChange?: (info: UploadChangeParam) => void;
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
    const { onChange, onValueChange, attachmentService } = this.props;
    onChange && onChange(info);
    //中间步骤的状态，不用通知外部form
    onValueChange && ['done', 'removed'].includes(info.file.status || '') && onValueChange(info);
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
    //return this.props.attachmentService.save({ id: file.response.id, ownerId: null, ownerName: null }).then(v => true);
    //附件不能直接删除，界面还未提交，统一由后台定时任务处理
    return true;
  }
  beforeUpload(file: RcFile, fileList: RcFile[]) {
    const { maxSizeMB, beforeUpload, attachmentService } = this.props;
    if (beforeUpload) {
      if (!beforeUpload(file, fileList)) return false;
    }
    let size = maxSizeMB || 20; //默认20M
    //不能超过服务端最大文件限制
    if (size > attachmentService.maxSizeMB) size = attachmentService.maxSizeMB;
    if (file.size / 1024 / 1024 > size) {
      message.error(`文件太大，不能超过${size}MB`);
      return false;
    }
    return true;
  }
  render() {
    const { disabled, maxNumber, attachmentService, required, ...uploadProps } = this.props;

    const underLimit = (this.state?.fileList?.length || 0) < (maxNumber || 10);
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
      >
        {!disabled && underLimit && <Button icon="upload">选择文件</Button>}
      </Upload>
    );
  }
}
