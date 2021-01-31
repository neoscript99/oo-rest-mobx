import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Upload, Button, message } from 'antd';
import { FieldProps } from './FieldProps';
import { AbstractField } from './AbstractField';
import { RcFile, UploadChangeParam, UploadProps } from 'antd/lib/upload';
import { ShowUploadListInterface, UploadFile } from 'antd/lib/upload/interface';
import { AttachmentEntity, AttachmentService } from '../services';
import isObject from 'lodash/isObject';
import { FormItemProps } from 'antd/lib/form';

export class UploadField extends AbstractField<UploadWrapProps & FieldProps> {
  static defaultProps = { valueType: 'array', maxSizeMB: 20, maxNumber: 10 };
  getField() {
    return <UploadWrap {...this.getInputProps()} />;
  }
  get defaultFormItemProps(): FormItemProps {
    const { maxNumber, required, valueType } = this.props;
    const single = maxNumber === 1;
    return {
      rules: required ? [{ required: true, type: single ? 'object' : 'array', message: '不能为空' }] : undefined,
      getValueFromEvent: (info: UploadChangeParam) => {
        console.debug('UploadField.getValueFromEvent: ', info);

        //发送到后台的数据只需要id属性，而且UploadWrap的fileList通过state管理，不需要这里的value回传
        const all = info.fileList
          .filter((file) => file.status === 'done')
          .map((file) => ({ id: file.response.id, name: file.response.name }));
        if (valueType === 'string') return all.map((f) => f.id).join(',');
        if (valueType === 'json') return JSON.stringify(all);
        else return single ? (all.length > 0 ? all[0] : undefined) : all;
      },
      trigger: 'onValueChange',
      validateTrigger: 'onValueChange',
    };
  }
}
export interface UploadWrapProps extends UploadProps {
  value?: AttachmentEntity | AttachmentEntity[] | string;
  /**
   * array 默认模式
   * string 逗号分隔的id字符串，通过查询获得附件详情
   * json 加入name信息
   */
  valueType: 'array' | 'string' | 'json';
  /**
   * 当为1时，返回值传入值都是UploadResponse
   */
  maxNumber: number;
  required?: boolean;
  attachmentService: AttachmentService;
  onValueChange?: (info: UploadChangeParam) => void;
  maxSizeMB: number;
}
interface UploadWrapState {
  fileList?: Array<UploadFile>;
}
export class UploadWrap extends React.Component<UploadWrapProps, UploadWrapState> {
  static defaultProps = { valueType: 'array', maxSizeMB: 20, maxNumber: 10 };

  async componentDidUpdate(prevProps: Readonly<UploadWrapProps>) {
    const { value, valueType, maxNumber, attachmentService } = this.props;
    //在初始化的时候，后台AttachmentInfo转为fileList
    //fileList如果出现在props中，就算是undefined，defaultFileList将不起作用
    if (value && value !== prevProps.value) {
      let attList;
      if (valueType === 'string' && typeof value === 'string') {
        const param = { criteria: { inList: [['id', value.split(',')]] }, order: ['dateCreated'] };
        attList = (await attachmentService.list(param)).results;
      }
      if (valueType === 'json' && typeof value === 'string') {
        attList = JSON.parse(value);
      } else attList = maxNumber === 1 ? [value] : value;
      //服务端domain转换为文件列表
      this.setState({
        fileList: attList.map((res) => ({
          uid: res.id,
          name: res.name,
          status: 'done',
          response: res,
          url: `${attachmentService.downloadUrl}/${res.id}`,
        })),
      });
    }
  }

  handleChange(info: UploadChangeParam) {
    const { onChange, onValueChange, attachmentService } = this.props;
    onChange && onChange(info);
    //中间步骤的状态，不用通知外部form
    onValueChange && ['done', 'removed'].includes(info.file.status || '') && onValueChange(info);
    console.debug('UploadWrap.handleChange: ', info);
    //去除beforeUpload校验不通过的附件，目前观察status为空
    const fileList = info.fileList.filter((file) => {
      if (file.response) file.url = `${attachmentService.downloadUrl}/${file.response.id}`;
      return !!file.status;
    });
    this.setState({ fileList });
  }

  //props中传入的优先
  handleRemove(file: UploadFile) {
    //return this.props.attachmentService.delete(file.response.id).then(count => count === 1);
    // 被主表关联，不能删除，可以先把owner值为空，由定时任务删除，
    // 但界面点了删除之后可能没有保存，所以这一步操作也不能做，
    // 如果要正确处理，需要先把删除信息保存下来，等界面点击提交后再做删除动作
    // 比如可在EntityForm.saveEntity中判断，saveItem和inputItem的附件是否相同，如果不同删除原附件，
    // 但这个操作只能手工征对性处理
    //return this.props.attachmentService.save({ id: file.response.id, ownerId: null, ownerName: null }).then(v => true);
    return true;
  }
  beforeUpload(file: RcFile, fileList: RcFile[]) {
    const { maxSizeMB, beforeUpload, attachmentService } = this.props;
    if (beforeUpload) {
      if (!beforeUpload(file, fileList)) return false;
    }
    let size = maxSizeMB || UploadWrap.defaultProps.maxSizeMB;
    //不能超过服务端最大文件限制
    if (size > attachmentService.maxSizeMB) size = attachmentService.maxSizeMB;
    if (file.size / 1024 / 1024 > size) {
      message.error(`文件太大，不能超过${size}MB`);
      return false;
    }
    return true;
  }
  render() {
    const { disabled, maxNumber, attachmentService, showUploadList, ...uploadProps } = this.props;

    const underLimit = (this.state?.fileList?.length || 0) < maxNumber;
    let listSwitch: boolean | ShowUploadListInterface = { showRemoveIcon: !disabled };
    if (isObject(showUploadList)) listSwitch = { ...(showUploadList as ShowUploadListInterface), ...listSwitch };
    else if (showUploadList === false) listSwitch = false;
    return (
      <Upload
        fileList={this.state?.fileList}
        action={attachmentService.uploadUrl}
        data={({ uid, name, lastModified, size, type }) => ({ uid, name, lastModified, size, type })}
        showUploadList={listSwitch}
        onRemove={this.handleRemove.bind(this)}
        {...uploadProps}
        onChange={this.handleChange.bind(this)}
        beforeUpload={this.beforeUpload.bind(this)}
      >
        {!disabled && underLimit && <Button icon={<UploadOutlined />}>选择文件</Button>}
      </Upload>
    );
  }
}
