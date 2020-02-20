import React from 'react';
import { AdminPageProps } from '../AdminServices';
import { commonColumns, StringUtil } from '../../../utils';
import { EntityPageList, EntityColumnProps, SimpleSearchForm, EntityListState, EntityFormProps } from '../../layout';
import { Criteria, ListOptions, UserService } from '../../../services';
import { UserForm, UserFormProps } from './UserForm';
import { Entity } from '../../../services';
import { Button, message, Popconfirm } from 'antd';
import { UserSearchForm } from './UserSearchForm';

export class UserList<
  P extends AdminPageProps = AdminPageProps,
  S extends EntityListState = EntityListState
> extends EntityPageList<P, S> {
  get domainService(): UserService {
    return this.props.services.userService;
  }

  get columns(): EntityColumnProps[] {
    const { initPassword } = this.props.services.loginService;
    const opCol = (text: string, record: any) => {
      return (
        <Popconfirm
          title={`确定重置? (${initPassword})`}
          onConfirm={this.resetPassword.bind(this, record)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link">重置密码</Button>
        </Popconfirm>
      );
    };
    const columns: EntityColumnProps[] = [
      { title: '姓名', dataIndex: 'name' },
      { title: '帐号', dataIndex: 'account' },
      { title: '所属机构', dataIndex: 'dept.name' },
      ...this.getExtraColumns(),
      commonColumns.lastUpdated,
      { title: '操作', render: opCol },
    ];

    return columns;
  }

  getExtraColumns(): EntityColumnProps[] {
    return [commonColumns.enabled, commonColumns.editable];
  }

  genFormProps(action: string, item?: Entity, exProps?: Partial<EntityFormProps>): UserFormProps {
    const props = super.genFormProps(action, item, exProps);
    const { services } = this.props;
    return { ...props, modalProps: { width: '50em' }, services };
  }
  getInitItem(): Entity {
    const password = this.props.services.loginService.initPasswordHash;
    return { editable: true, password };
  }
  resetPassword(user: Entity) {
    const password = this.props.services.loginService.initPasswordHash;
    this.domainService.resetPassword(user, password).then(() => message.success('重置成功'));
  }
  getOperatorEnable() {
    const base = super.getOperatorEnable();
    return {
      ...base,
      update: base.update && this.getSelectItem()!.editable,
      delete: base.delete && this.getSelectItems().every(item => item.editable),
    };
  }
  getEntityForm() {
    return UserForm;
  }
  getSearchForm() {
    return UserSearchForm;
  }
  getQueryParam(): ListOptions {
    const param = super.getQueryParam();
    const criteria: Criteria = {};
    const {
      searchParam: { account, name, deptId },
    } = this.domainService.store;
    if (StringUtil.isNotBlank(account)) criteria.ilike = [['account', account + '%']];
    if (StringUtil.isNotBlank(name)) criteria.like = [['name', '%' + name + '%']];
    if (deptId) criteria.dept = { eq: [['id', deptId]] };
    return { ...param, criteria };
  }
}
