import React, { ReactNode } from 'react';
import { Form } from 'antd';
import { EntityForm, EntityFormProps } from '../../layout';
import { commonRules, genRules, StringUtil, StyleUtil } from '../../../utils';
import { DeptEntity } from '../../../services/DeptService';
import { Entity, UserService } from '../../../services';
import { CheckboxOptionType } from 'antd/lib/checkbox/Group';
import { AdminServices } from '../AdminServices';
import { SelectField, InputField, CheckboxField } from '../../../ant-design-field';
import { CheckboxGroupField } from '../../../ant-design-field/CheckboxGroupField';
import { DeptSelectField } from '../../common';
const { required } = commonRules;
interface S {
  allRoles?: CheckboxOptionType[];
  userRoleIds: string[];
  deptList: DeptEntity[];
}
export interface UserFormProps extends EntityFormProps {
  services: AdminServices;
  hideRoles?: boolean;
  hideEnabled?: boolean;
  justSameDept?: boolean;
  autoGenerateAccount?: boolean;
}
export class UserForm extends EntityForm<UserFormProps, S> {
  formItemCss: React.CSSProperties = { width: '22em' };
  get userService(): UserService {
    return this.props.services.userService;
  }
  roleIds: string[] = [];
  async componentDidMount() {
    console.log('UserForm.componentDidMount');
    const {
      inputItem,
      services: { userRoleService, roleService, deptService, loginService },
    } = this.props;
    const deptList = this.justSameDept
      ? [loginService.dept]
      : (deptService.store.allList.filter(dept => dept.enabled) as DeptEntity[]);
    const allRoles =
      this.hideRoles ||
      roleService.store.allList
        .filter(role => role.enabled)
        .map(role => ({ label: role.roleName as string, value: role.id as string }));
    const state: any = {
      allRoles,
      deptList,
    };
    if (inputItem && inputItem.id && !this.hideRoles) {
      const userRoleIds: string[] = await userRoleService
        .list({ criteria: { eq: [['user.id', inputItem.id]] } })
        .then(res => {
          return res.results.map(ur => ur.role.id);
        });
      this.roleIds = userRoleIds;
      state.userRoleIds = userRoleIds;
    }
    this.setState(state);
  }

  getForm() {
    if (!this.state) return null;
    const {
      form,
      services: { dictService },
      readonly,
    } = this.props;
    const { allRoles, userRoleIds, deptList } = this.state;
    const { hideEnabled, autoGenerateAccount } = this;
    const [min4, min2, req] = [
      { rules: [genRules.minString(4)] },
      { rules: [genRules.minString(2)] },
      { rules: [required] },
    ];
    const make = (fieldId: string, label: string) => ({
      fieldId,
      formItemProps: { label, style: this.formItemCss },
      formUtils: form,
    });
    return (
      <Form style={StyleUtil.flexForm()}>
        {(!autoGenerateAccount || readonly) && (
          <InputField {...make('account', '帐号')} maxLength={16} decorator={min4} readonly={readonly} />
        )}
        <InputField {...make('name', '姓名')} maxLength={16} decorator={min2} readonly={readonly} />
        <DeptSelectField
          {...make('dept.id', '机构')}
          dataSource={deptList}
          decorator={req}
          defaultSelectFirst={this.justSameDept}
          readonly={readonly}
        />
        {!hideEnabled && (
          <CheckboxField {...make('enabled', '启用')} decorator={{ initialValue: true }} readonly={readonly} />
        )}{' '}
        <InputField {...make('phoneNumber', '手机号码')} minLength={11} maxLength={13} readonly={readonly} />
        <InputField
          {...make('email', '电子邮箱')}
          maxLength={32}
          decorator={{
            rules: [{ type: 'email' }],
          }}
          readonly={readonly}
        />
        {(!this.autoGenerateSex || readonly) && (
          <SelectField
            {...make('sexCode', '性别')}
            dataSource={dictService.getDict('pub_sex')}
            valueProp="code"
            labelProp="name"
            decorator={{
              rules: [required],
              initialValue: 'male',
            }}
            readonly={readonly}
          />
        )}
        {this.getExtraFormItem()}
        {this.hideRoles || (
          <CheckboxGroupField
            fieldId="roleIds"
            options={allRoles}
            formItemProps={{ label: '角色', style: { ...this.formItemCss, width: '46em' } }}
            formUtils={form}
            decorator={{ initialValue: userRoleIds }}
            readonly={readonly}
          />
        )}
      </Form>
    );
  }

  saveEntity(saveItem: Entity) {
    const { inputItem } = this.props;
    if (this.autoGenerateAccount) {
      const { deptList } = this.state;
      const dept = deptList.find(d => d.id === saveItem.dept.id);
      saveItem.account = `${dept!.name}-${saveItem.name}-${StringUtil.randomString()}`;
    }
    if (this.hideRoles) return super.saveEntity(saveItem);
    else return this.userService.saveUserRoles({ ...inputItem, ...saveItem }, saveItem.roleIds);
  }

  getExtraFormItem(): ReactNode {
    return null;
  }

  get hideRoles() {
    return this.props.hideRoles;
  }

  get justSameDept() {
    return this.props.justSameDept;
  }
  get hideEnabled() {
    return this.props.hideEnabled;
  }
  get autoGenerateAccount() {
    return this.props.autoGenerateAccount;
  }
  get autoGenerateSex() {
    return false;
  }
}
