import { AbstractClient } from './rest';
import { DomainStore } from './DomainStore';
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
  maxSizeMB = 20;
  constructor(restClient: AbstractClient) {
    super({ domain: 'attachment', storeClass: DomainStore, restClient });
    this.getMaxSizeMB().then((mb) => (this.maxSizeMB = mb));
  }
  get uploadUrl() {
    return `${this.restClient.fetchOptions.rootUrl}/upload`;
  }
  get downloadUrl() {
    return `${this.restClient.fetchOptions.rootUrl}/download`;
  }
  getMaxSizeMB(): Promise<number> {
    return this.postApi('getMaxSizeMB');
  }
}
