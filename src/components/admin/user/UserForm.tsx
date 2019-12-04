import React from 'react';
import { Form, Input, Modal, Checkbox, Select } from 'antd';
import { EntityForm, EntityFormProps } from '../../layout';
import { commonRules } from '../../../utils';
import { DeptEntity } from '../../../services/DeptService';
import { Entity } from '../../../services';
import { CheckboxOptionType, CheckboxValueType } from 'antd/lib/checkbox/Group';
import { AdminServices } from '../AdminServices';
const { required } = commonRules;

interface S {
  allRoles: CheckboxOptionType[];
  userRoleIds: string[];
  deptList: DeptEntity[];
}
export class UserForm extends EntityForm<UserFormProps, S> {
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
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        <Form.Item label="帐号">
          {getFieldDecorator('account', {
            rules: [required],
          })(<Input maxLength={16} />)}
        </Form.Item>
        <Form.Item label="称呼">
          {getFieldDecorator('name', {
            rules: [required],
          })(<Input maxLength={16} />)}
        </Form.Item>
        <Form.Item label="机构">
          {getFieldDecorator('deptId', {
            rules: [required],
          })(
            <Select>
              {deptList.map(dept => (
                <Select.Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="启用">
          {getFieldDecorator('enabled', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox />)}
        </Form.Item>
        <Form.Item label="角色">
          <Checkbox.Group options={allRoles} defaultValue={userRoleIds} onChange={this.onChangeRoles.bind(this)} />
        </Form.Item>
      </Form>
    );
  }

  saveEntity(saveItem: Entity) {
    saveItem.dept = { id: saveItem.deptId };
    const { inputItem } = this.props;
    const { userService } = this.props.services;
    return userService.saveUserRoles({ ...inputItem, ...saveItem }, this.roleIds);
  }

  onChangeRoles(roleIds: CheckboxValueType[]) {
    this.roleIds = roleIds as string[];
  }
}

export interface UserFormProps extends EntityFormProps {
  services: AdminServices;
}
