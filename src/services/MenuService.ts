import { observable } from 'mobx';
import { Entity } from './index';
import { DomainStore } from './DomainStore';
import { DomainService } from './DomainService';
import { AbstractClient } from './rest';

export interface MenuEntity extends Entity {
  //后台定义的菜单对应功能代码
  app?: string;
  label: string;
  seq: number;
}

export interface MenuNode {
  menu: MenuEntity;
  subMenus: MenuNode[];
}

export class MenuStore extends DomainStore<MenuEntity> {
  @observable
  menuTree: MenuNode = { menu: { label: 'none', seq: 0 }, subMenus: [] };
}

export class MenuService extends DomainService<MenuEntity, MenuStore> {
  constructor(restClient: AbstractClient) {
    super({ domain: 'menu', storeClass: MenuStore, restClient });
  }

  getMenuTree() {
    return this.postApi('menuTree').then((data) => (this.store.menuTree = data));
  }
}
