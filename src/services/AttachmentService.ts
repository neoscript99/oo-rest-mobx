import { AbstractClient } from './rest';
import { MobxDomainStore } from '../stores';
import { DomainService, Entity } from './index';

export interface AttachmentEntity extends Entity {
  id: string;
  name: string;
  fileSize: number;
  fileId: string;
  ownerId?: string;
  ownerName?: string;
  dateCreated: Date;
}

export class AttachmentService extends DomainService {
  constructor(restClient: AbstractClient) {
    super({ domain: 'attachment', storeClass: MobxDomainStore, restClient });
  }
  get uploadUrl() {
    return `${this.restClient.fetchOptions.rootUrl}/upload`;
  }
  get downloadUrl() {
    return `${this.restClient.fetchOptions.rootUrl}/download`;
  }
}
