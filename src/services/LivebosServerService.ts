//{"id":0,"loginId":"admin","name":"管理员","lastLogin":"2019-06-13 17:46:54","grade":0,"status":1,"orgId":0}
import { DomainService } from './DomainService';
import { MobxDomainStore } from '../stores';

export interface LiveUserInfo {
  id: number;
  loginId: string;
  name: string;
  lastLogin: string;
  grade: number;
  status: number;
  orgId: number;
}

//{"workflowCount":4,"result":1,"message":"成功"}
export interface LivebosNotice {
  workflowCount: number;
  result: number;
  message: string;
}

export interface LivebosObject {
  //最终数据转化到这里
  dataList: any[];
  queryId: string;
  hasMore: boolean;
  count: number;
  metaData: LivebosObjectMetaData;
  result: number;
  message: string;
  records: any[][];
}

export interface LivebosObjectMetaData {
  colCount: number;
  colInfo: {
    name: string;
    label: string;
    type: number;
    length: number;
    scale: number;
  }[];
}

export class LivebosServerService extends DomainService<MobxDomainStore> {
  getUserInfo(livebosServerId: string, userId: string): Promise<LiveUserInfo> {
    return this.postApi('livebosGetUserInfo', { livebosServerId, userId });
  }

  queryNotices(livebosServerId: string, userId: string, type = '0'): Promise<LivebosNotice> {
    return this.postApi('livebosQueryNotices', { livebosServerId, userId, type });
  }
}

export function transLivebosData(lb: LivebosObject) {
  if (!lb.metaData) console.error(lb);
  else {
    const {
      records,
      metaData: { colInfo },
    } = lb;
    if (records && records.length > 0) {
      lb.dataList = records.map(record =>
        record.reduce((acc, value, idx) => ((acc[colInfo[idx].name] = value), acc), {}),
      );
    }
  }
  return lb;
}
