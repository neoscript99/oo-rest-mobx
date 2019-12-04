import React, { Component } from 'react';
import { AdminPageProps } from '../AdminServices';
import { Button, Card, Checkbox, Form, Input, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { commonRules } from '../../../utils';
import { EntityForm } from '../../layout';
import { CheckboxChangeEvent, CheckboxProps } from 'antd/lib/checkbox';
import { Entity, UserEntity } from '../../../services';
import { sha256 } from 'js-sha256';

const { required } = commonRules;
interface S {
  showPassword: boolean;
}
export class UserProfile extends Component<AdminPageProps, S> {
  handleCheckboxChange(e: CheckboxChangeEvent) {
    this.setState({ showPassword: e.target.checked });
  }
  handleSave(item: Entity) {
    const { services } = this.props;
    services.userService.save(item).then(item => {
      services.userService.store.loginInfo.user = item as UserEntity;
      message.success('保存成功');
    });
  }
  render() {
    const { services } = this.props;
    const { user } = services.userService.store.loginInfo;
    const showPassword = this.state && this.state.showPassword;
    return (
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Card title="个人信息设置" style={{ width: '40rem' }}>
          <ProfileFromWrapper
            inputItem={user}
            showPassword={showPassword}
            onCheckboxChange={this.handleCheckboxChange.bind(this)}
            onSave={this.handleSave.bind(this)}
          />
        </Card>
      </div>
    );
  }
}

interface ProfileFormProps extends FormComponentProps {
  inputItem: any;
  showPassword: boolean;
  onCheckboxChange: CheckboxProps['onChange'];
  onSave: (item: Entity) => void;
}

class ProfileFrom extends Component<ProfileFormProps> {
  handleSubmit() {
    const { form, onSave, showPassword, inputItem } = this.props;
    form.validateFields((err, saveItem) => {
      if (!err) {
        if (showPassword && saveItem.password !== saveItem.passwordAgain) message.error('两次输入的密码不一致');
        else onSave({ id: inputItem.id, ...saveItem, password: sha256(saveItem.password) });
      }
    });
  }
  render() {
    const {
      form: { getFieldDecorator },
      showPassword,
      onCheckboxChange,
    } = this.props;

    return (
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        <Form.Item label="姓名">
          {getFieldDecorator('name', {
            rules: [required],
          })(<Input maxLength={16} />)}
        </Form.Item>
        <Form.Item label="修改密码">
          <Checkbox checked={showPassword} onChange={onCheckboxChange} />
        </Form.Item>
        {showPassword && (
          <Form.Item label="密码">
            {getFieldDecorator('password', {
              rules: [required],
            })(<Input maxLength={16} type="password" allowClear={true} />)}
          </Form.Item>
        )}
        {showPassword && (
          <Form.Item label="密码确认">
            {getFieldDecorator('passwordAgain', {
              rules: [required],
            })(<Input maxLength={16} type="password" allowClear={true} />)}
          </Form.Item>
        )}
        <Form.Item
          wrapperCol={{
            span: 16,
            offset: 8,
          }}
        >
          <Button type="primary" onClick={this.handleSubmit.bind(this)}>
            提交
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const ProfileFromWrapper = EntityForm.formWrapper(ProfileFrom);
