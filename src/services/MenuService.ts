import { MenuStore, MenuNode, MobxDomainStore } from '../stores';
import { DomainService } from './DomainService';
import { AbstractClient } from './rest';

export class MenuService extends DomainService<MenuStore> {
  constructor(restClient: AbstractClient) {
    super({ domain: 'menu', storeClass: MenuStore, restClient });
  }

  getMenuTree(): void {
    this.restClient.post(this.getApiUri('menuTree')).then(data => (this.store.menuTree = data));
  }
}
