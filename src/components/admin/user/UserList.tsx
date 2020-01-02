import React from 'react';
import { AdminPageProps } from '../AdminServices';
import { commonColumns, StringUtil } from '../../../utils';
import { EntityPageList, EntityColumnProps, SimpleSearchForm, EntityListState, EntityFormProps } from '../../layout';
import { ListOptions, UserService } from '../../../services';
import { UserForm, UserFormProps } from './UserForm';
import { Entity } from '../../../services';
import { Button, message, Popconfirm } from 'antd';

const INIT_PASSWORD = 'abc000';
export interface UserListProps extends AdminPageProps {
  initPassword?: string;
}

export class UserList<
  P extends UserListProps = UserListProps,
  S extends EntityListState = EntityListState
> extends EntityPageList<P, S> {
  get domainService(): UserService {
    return this.props.services.userService;
  }

  get columns(): EntityColumnProps[] {
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
    const password = this.getInitPasswordHash();
    return { editable: true, password };
  }
  getInitPasswordHash() {
    const pass = this.props.initPassword || INIT_PASSWORD;
    return StringUtil.sha256(pass as string);
  }
  resetPassword(user: Entity) {
    this.domainService.resetPassword(user, this.getInitPasswordHash()).then(() => message.success('重置成功'));
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
