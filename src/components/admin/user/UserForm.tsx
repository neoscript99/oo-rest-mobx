import React, { ReactNode } from 'react';
import { Form, Input, Checkbox, Select } from 'antd';
import { EntityForm, EntityFormProps } from '../../layout';
import { SelectWrap } from '../../input';
import { commonRules, genRules, flexForm } from '../../../utils';
import { DeptEntity } from '../../../services/DeptService';
import { Entity, UserFormService } from '../../../services';
import { CheckboxOptionType, CheckboxValueType } from 'antd/lib/checkbox/Group';
import { AdminServices } from '../AdminServices';
import { WrappedFormUtils } from 'antd/lib/form/Form';
const { required } = commonRules;
const formItemCss: React.CSSProperties = { width: '22em', marginBottom: '10px' };
interface S {
  allRoles: CheckboxOptionType[];
  userRoleIds: string[];
  deptList: DeptEntity[];
}
export class UserForm extends EntityForm<UserFormProps, S> {
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
      form: { getFieldDecorator },
    } = this.props;
    const { allRoles, userRoleIds, deptList } = this.state;
    return (
      <Form style={flexForm()}>
        <Form.Item label="帐号" style={formItemCss}>
          {getFieldDecorator('account', {
            rules: [genRules.minString(4)],
          })(<Input maxLength={16} />)}
        </Form.Item>
        <Form.Item label="称呼" style={formItemCss}>
          {getFieldDecorator('name', {
            rules: [genRules.minString(2)],
          })(<Input maxLength={16} />)}
        </Form.Item>
        <Form.Item label="机构" style={formItemCss}>
          {getFieldDecorator('deptId', {
            rules: [required],
          })(<SelectWrap dataSource={deptList} valueProp="id" labelProp="name" />)}
        </Form.Item>
        <Form.Item label="启用" style={formItemCss}>
          {getFieldDecorator('enabled', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox />)}
        </Form.Item>
        <Form.Item label="联系电话" style={formItemCss}>
          {getFieldDecorator('phoneNumber', {
            rules: [{ type: 'number' }],
          })(<Input maxLength={16} />)}
        </Form.Item>
        <Form.Item label="电子邮箱" style={formItemCss}>
          {getFieldDecorator('email', {
            rules: [{ type: 'email' }],
          })(<Input maxLength={16} />)}
        </Form.Item>
        <Form.Item label="性别" style={formItemCss}>
          {getFieldDecorator('sexCode', {
            rules: [required],
          })(<Input maxLength={16} />)}
        </Form.Item>
        {this.getExtraFormItem(getFieldDecorator, formItemCss)}
        <Form.Item label="角色" style={{ ...formItemCss, width: '46em' }}>
          <Checkbox.Group options={allRoles} defaultValue={userRoleIds} onChange={this.onChangeRoles.bind(this)} />
        </Form.Item>
      </Form>
    );
  }

  saveEntity(saveItem: Entity) {
    saveItem.dept = { id: saveItem.deptId };
    const { inputItem } = this.props;
    return this.userService.saveUserRoles({ ...inputItem, ...saveItem }, this.roleIds);
  }

  onChangeRoles(roleIds: CheckboxValueType[]) {
    this.roleIds = roleIds as string[];
  }

  getExtraFormItem(
    getFieldDecorator: WrappedFormUtils['getFieldDecorator'],
    formItemCss: React.CSSProperties,
  ): ReactNode {
    return null;
  }
}

export interface UserFormProps extends EntityFormProps {
  services: AdminServices;
}
