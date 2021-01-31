import { AbstractClient } from './rest';
import { DomainStore } from './DomainStore';
import { DomainService } from './DomainService';
import { ApplyEntity, Entity, UserEntity } from './index';

export interface ApplyLogEntity extends Entity {
  //申请人
  apply: ApplyEntity;
  operator: UserEntity;
  fromStatusCode: string;
  toStatusCode: string;
  info: string;
}

export class ApplyLogService extends DomainService {
  constructor(restClient: AbstractClient) {
    super({ domain: 'applyLog', storeClass: DomainStore, restClient });
  }
}
