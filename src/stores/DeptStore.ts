import { MobxDomainStore } from './MobxDomainStore';
import { observable } from 'mobx';
import { Entity } from '../services';

export class DeptStore extends MobxDomainStore {
  @observable
  enabledList: Entity[] = [];
}
