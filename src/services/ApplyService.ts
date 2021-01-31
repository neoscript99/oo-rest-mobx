import { AbstractClient } from './rest';
import { DomainStore } from './DomainStore';
import { DomainService } from './DomainService';
import { Entity } from './index';

export interface ApplyEntity extends Entity {
  //申请人
  applier: any;
  statusCode: string;
  passTime: Date;
  ownerId: string;
  ownerType: string;
  ownerName: string;
}

export class ApplyService extends DomainService<ApplyEntity> {
  constructor(restClient: AbstractClient) {
    super({ domain: 'apply', storeClass: DomainStore, restClient });
  }
}
