import React, { ReactNode } from 'react';
import { Form, InputNumber } from 'antd';
import { EntityForm, EntityFormProps } from '../../layout';
import { commonRules, genRules, flexForm } from '../../../utils';
import { DeptEntity } from '../../../services/DeptService';
import { Entity, UserFormService } from '../../../services';
import { CheckboxOptionType, CheckboxValueType } from 'antd/lib/checkbox/Group';
import { AdminServices } from '../AdminServices';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { SelectField, InputField, CheckboxField } from '../../../ant-design-field';
import { CheckboxGroupField } from '../../../ant-design-field/CheckboxGroupField';
const { required } = commonRules;
interface S {
  allRoles: CheckboxOptionType[];
  userRoleIds: string[];
  deptList: DeptEntity[];
}
export class UserForm extends EntityForm<UserFormProps, S> {
  formItemCss: React.CSSProperties = { width: '22em', marginBottom: '10px' };
  get userService(): UserFormService {
    return this.props.services.userService;
  }
  roleIds: string[] = [];
  async componentDidMount() {
    console.log('UserForm.componentDidMount');
    const {
      inputItem,
      services: { userRoleService, roleService, deptService },
    } = this.props;
    const deptList = deptService.store.allList.filter(dept => dept.enabled) as DeptEntity[];
    const allRoles: CheckboxOptionType[] = roleService.store.allList
      .filter(role => role.enabled)
      .map(role => ({ label: role.roleName as string, value: role.id as string }));
    const state: any = {
      allRoles,
      deptList,
    };
    if (inputItem && inputItem.id) {
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
    } = this.props;
    const { getFieldDecorator } = form;
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
      <Form style={flexForm()}>
        <InputField {...make('account', '帐号')} maxLength={16} decorator={min4} />
        <InputField {...make('name', '姓名')} maxLength={16} decorator={min2} />
        <SelectField
          {...make('deptId', '机构')}
          dataSource={deptList}
          valueProp="id"
          labelProp="name"
          decorator={req}
        />
        <CheckboxField {...make('enabled', '启用')} decorator={{ initialValue: true }} />
        <InputField {...make('phoneNumber', '联系电话')} maxLength={16} />
        <InputField
          {...make('email', '电子邮箱')}
          maxLength={32}
          decorator={{
            rules: [{ type: 'email' }],
          }}
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
        />
        {this.getExtraFormItem()}
        <CheckboxGroupField
          fieldId="roleIds"
          options={allRoles}
          formItemProps={{ label: '角色', style: { ...this.formItemCss, width: '46em' } }}
          formUtils={form}
          decorator={{ initialValue: userRoleIds }}
        />
      </Form>
    );
  }

  saveEntity(saveItem: Entity) {
    saveItem.dept = { id: saveItem.deptId };
    const { inputItem } = this.props;
    return this.userService.saveUserRoles({ ...inputItem, ...saveItem }, saveItem.roleIds);
  }

  getExtraFormItem(): ReactNode {
    return null;
  }
}

export interface UserFormProps extends EntityFormProps {
  services: AdminServices;
}
