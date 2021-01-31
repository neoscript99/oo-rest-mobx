import React, { Component } from 'react';
import { AdminPageProps } from '../AdminServices';
import { Form } from 'antd';
import { Button, Card, Checkbox, message } from 'antd';
import { commonRules, FormComponentProps, StringUtil } from '../../../utils';
import { EntityForm } from '../../layout';
import { CheckboxChangeEvent, CheckboxProps } from 'antd/lib/checkbox';
import { Entity, UserEntity } from '../../../services';
import { InputField } from '../../../ant-design-field';
import { observer } from 'mobx-react';

const { required, email, cellPhone, password } = commonRules;

interface S {
  showPassword: boolean;
}

@observer
export class UserProfile extends Component<AdminPageProps, S> {
  handleCheckboxChange(e: CheckboxChangeEvent) {
    this.setState({ showPassword: e.target.checked });
  }

  handleSave(item: Entity) {
    const { services } = this.props;
    if (item.password === services.loginService.initPasswordHash) message.error('新密码不能和初始密码相同');
    else
      services.userService.save(item).then((item) => {
        services.loginService.store.forcePasswordChange = false;
        services.loginService.store.loginInfo.user = item as UserEntity;
        message.success('保存成功');
      });
  }

  render() {
    const { services } = this.props;
    const {
      loginInfo: { user },
      forcePasswordChange,
    } = services.loginService.store;
    const showPassword = this.state ? this.state.showPassword : forcePasswordChange;
    return (
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Card title={`${user?.name} 个人信息设置`} style={{ width: '40rem' }}>
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

interface ProfileFromState {
  firstPassword?: string;
}

class ProfileFrom extends Component<ProfileFormProps, ProfileFromState> {
  handleSubmit(saveItem) {
    const { onSave, showPassword, inputItem } = this.props;
    if (showPassword) {
      if (saveItem.password === saveItem.passwordAgain)
        onSave({ id: inputItem.id, ...saveItem, password: StringUtil.sha256(saveItem.password) });
      else message.error('两次输入的密码不一致');
    } else onSave({ id: inputItem.id, ...saveItem });
  }

  render() {
    const { form, showPassword, onCheckboxChange, inputItem } = this.props;
    return (
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onFinish={this.handleSubmit.bind(this)}>
        <InputField formItemProps={{ label: '单位' }} value={inputItem?.dept.name} readonly />
        <InputField
          fieldId="name"
          formItemProps={{ label: '姓名', rules: [required] }}
          formUtils={form}
          maxLength={10}
          minLength={2}
        />
        <InputField
          fieldId="cellPhone"
          formItemProps={{ label: '手机号码', rules: [required, cellPhone] }}
          formUtils={form}
          maxLength={11}
        />
        <InputField
          fieldId="email"
          formItemProps={{ label: '电子邮箱', rules: [email] }}
          formUtils={form}
          maxLength={32}
        />
        <Form.Item label="修改密码">
          <Checkbox checked={showPassword} onChange={onCheckboxChange} />
        </Form.Item>
        {showPassword && (
          <InputField
            fieldId="password"
            allowClear={true}
            type="password"
            formUtils={form}
            formItemProps={{ label: '密码', rules: [required, password] }}
            maxLength={16}
            onChange={(e) => this.setState({ firstPassword: e.target.value })}
          />
        )}
        {showPassword && (
          <InputField
            fieldId="passwordAgain"
            allowClear={true}
            type="password"
            formUtils={form}
            formItemProps={{
              label: '密码确认',
              rules: [required, { type: 'enum', enum: [this.state?.firstPassword], message: '密码不一致' }],
            }}
            maxLength={16}
          />
        )}
        <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const ProfileFromWrapper = EntityForm.formWrapper(ProfileFrom);
