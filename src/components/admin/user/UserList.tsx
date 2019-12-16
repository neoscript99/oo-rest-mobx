import React from 'react';
import { AdminPageProps } from '../AdminServices';
import { commonColumns, StringUtil } from '../../../utils';
import { EntityPageList, EntityColumnProps, SimpleSearchForm, EntityFormProps } from '../../layout';
import { DomainService, ListOptions } from '../../../services';
import { UserForm } from './UserForm';
import { Entity } from '../../../services';
import { sha256 } from 'js-sha256';
import { Button, message, Popconfirm } from 'antd';
import { MobxDomainStore } from '../../../stores';

const INIT_PASSWORD = 'abc000';
export interface UserListProps extends AdminPageProps {
  initPassword?: string;
}

export class UserList extends EntityPageList<UserListProps> {
  constructor(props: AdminPageProps) {
    super(props);
  }

  get domainService(): DomainService<MobxDomainStore> {
    return this.props.services.userService;
  }

  get columns(): EntityColumnProps[] {
    return this.getUserColumns();
  }
  getUserColumns(): EntityColumnProps[] {
    const pass = this.props.initPassword || INIT_PASSWORD;
    const opCol = (text: string, record: any) => {
      return (
        <Popconfirm
          title={`确定重置? (${pass})`}
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
      commonColumns.enabled,
      commonColumns.editable,
      commonColumns.lastUpdated,
      { title: '操作', render: opCol },
    ];

    return columns;
  }

  getSelectItem() {
    const item = super.getSelectItem();
    if (item) item.deptId = item.dept.id;
    return item;
  }
  getFormProps(action: string, item?: Entity): Partial<EntityFormProps> {
    const props = super.getFormProps(action, item);
    const { services } = this.props;
    return { ...props, services };
  }
  getInitItem() {
    const password = this.getInitPasswordHash();
    return { editable: true, password };
  }
  getInitPasswordHash() {
    return sha256(this.props.initPassword || INIT_PASSWORD);
  }
  resetPassword(user: Entity) {
    const { userService } = this.props.services;
    userService.resetPassword(user, this.getInitPasswordHash()).then(() => message.success('重置成功'));
  }
  getOperatorEnable() {
    const base = super.getOperatorEnable();
    return {
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
    const { searchParam } = this.domainService.store;
    if (searchParam && StringUtil.isNotBlank(searchParam.searchKey)) {
      const key = `${searchParam.searchKey}%`;
      param.criteria = {
        or: {
          ilike: [
            ['name', key],
            ['account', key],
          ],
        },
      };
    }
    return param;
  }
}

export class UserSearchForm extends SimpleSearchForm {
  placeholder = '名称、帐号';
}
