import React, { ReactNode } from 'react';
import { EntityForm, EntityFormProps } from '../../layout';
import { commonRules, genRules, StringUtil, StyleUtil } from '../../../utils';
import { DeptEntity } from '../../../services/DeptService';
import { Entity, UserService } from '../../../services';
import { Form } from 'antd';
import { CheckboxOptionType } from 'antd/lib/checkbox/Group';
import { AdminServices } from '../AdminServices';
import { SelectField, InputField, CheckboxField, FieldProps } from '../../../ant-design-field';
import { CheckboxGroupField } from '../../../ant-design-field/CheckboxGroupField';
import { DeptSelectField } from '../../common';
import { Rule } from 'antd/lib/form';
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
const { flexFormCss, oneSpanFormItemCss, twoSpanFormItemCss } = StyleUtil.commonStyle;
export class UserForm extends EntityForm<UserFormProps, S> {
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
    const deptList = this.justSameDept ? [loginService.dept] : (deptService.store.enabledList as DeptEntity[]);
    const allRoles =
      this.hideRoles ||
      roleService.store.allList
        .filter((role) => role.enabled)
        .map((role) => ({ label: role.roleName as string, value: role.id as string }));
    const state: any = {
      allRoles,
      deptList,
    };
    if (inputItem && inputItem.id && !this.hideRoles) {
      const userRoleIds: string[] = await userRoleService
        .list({ criteria: { eq: [['user.id', inputItem.id]] } })
        .then((res) => {
          return res.results.map((ur) => ur.role.id);
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
    const [min4, min2, req] = [[genRules.minString(4)], [genRules.minString(2, false)], [commonRules.required]];
    const make = (fieldId: string, label: string, rules: Rule[] = []): FieldProps => ({
      fieldId,
      formItemProps: { label, style: oneSpanFormItemCss, rules },
      formUtils: form,
    });
    return (
      <Form form={form} layout="vertical" style={flexFormCss}>
        {!autoGenerateAccount && (
          <InputField
            {...make('account', '帐号', min4)}
            style={{ imeMode: 'disabled' }}
            maxLength={16}
            readonly={readonly}
          />
        )}
        <InputField {...make('name', '姓名', min2)} maxLength={16} readonly={readonly} />
        <DeptSelectField
          formItemProps={{ name: ['dept', 'id'], label: '机构', style: oneSpanFormItemCss, rules: req }}
          formUtils={form}
          dataSource={deptList}
          defaultSelectFirst={this.justSameDept}
          readonly={readonly}
        />
        {!hideEnabled && (
          <CheckboxField
            formItemProps={{ name: 'enabled', label: '启用', style: oneSpanFormItemCss, initialValue: true }}
            formUtils={form}
            readonly={readonly}
          />
        )}{' '}
        <InputField
          {...make('cellPhone', '手机号码', [...(this.justSameDept ? req : []), commonRules.cellPhone])}
          minLength={11}
          maxLength={11}
          readonly={readonly}
        />
        <InputField {...make('email', '电子邮箱', [{ type: 'email' }])} maxLength={32} readonly={readonly} />
        {(!this.autoGenerateSex || readonly) && (
          <SelectField
            formItemProps={{
              name: 'sexCode',
              label: '性别',
              style: oneSpanFormItemCss,
              initialValue: 'male',
              rules: req,
            }}
            formUtils={form}
            dataSource={dictService.getDict('pub_sex')}
            valueProp="code"
            labelProp="name"
            readonly={readonly}
          />
        )}
        {this.getExtraFormItem()}
        {this.hideRoles || (
          <CheckboxGroupField
            fieldId="roleIds"
            options={allRoles}
            formItemProps={{ label: '角色', style: twoSpanFormItemCss, initialValue: userRoleIds }}
            formUtils={form}
            readonly={readonly}
          />
        )}
      </Form>
    );
  }

  saveEntity(saveItem: Entity) {
    const { inputItem } = this.props;
    //第一次保存时生成account
    if (this.autoGenerateAccount && !inputItem?.id) {
      const { deptList } = this.state;
      const dept = deptList.find((d) => d.id === saveItem.dept.id);
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
