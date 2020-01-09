import { MenuStore } from '../stores';
import { DomainService } from './DomainService';
import { AbstractClient } from './rest';

export class MenuService extends DomainService<MenuStore> {
  constructor(restClient: AbstractClient) {
    super({ domain: 'menu', storeClass: MenuStore, restClient });
  }

  getMenuTree(): void {
    this.postApi('menuTree').then(data => (this.store.menuTree = data));
  }
}
