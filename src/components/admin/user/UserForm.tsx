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
  formItemCss: React.CSSProperties = { width: '22em', marginBottom: '10px' };
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
      hideEnabled,
      autoGenerateAccount,
      services: { dictService },
      readonly,
    } = this.props;
    const { allRoles, userRoleIds, deptList } = this.state;
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
        {!autoGenerateAccount && (
          <InputField
            {...make('account', '帐号')}
            maxLength={16}
            decorator={min4}
            readonly={readonly || this.accountReadonly}
          />
        )}
        <InputField {...make('name', '姓名')} maxLength={16} decorator={min2} readonly={readonly} />
        <SelectField
          {...make('dept.id', '机构')}
          dataSource={deptList}
          valueProp="id"
          labelProp="name"
          decorator={req}
          defaultSelectFirst
          readonly={readonly}
        />
        {!hideEnabled && (
          <CheckboxField {...make('enabled', '启用')} decorator={{ initialValue: true }} readonly={readonly} />
        )}{' '}
        <InputField {...make('phoneNumber', '联系电话')} maxLength={16} readonly={readonly} />
        <InputField
          {...make('email', '电子邮箱')}
          maxLength={32}
          decorator={{
            rules: [{ type: 'email' }],
          }}
          readonly={readonly}
        />
        <SelectField
          {...make('sexCode', '性别')}
          dataSource={dictService.getDict('pub-sex')}
          valueProp="code"
          labelProp="name"
          decorator={{
            rules: [required],
            initialValue: 'male',
          }}
          readonly={readonly}
        />
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
    const { inputItem, autoGenerateAccount } = this.props;
    if (autoGenerateAccount) {
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
    const { hideRoles } = this.props;
    return hideRoles;
  }

  get justSameDept() {
    const { justSameDept } = this.props;
    return justSameDept;
  }
  get accountReadonly() {
    return false;
  }
}
