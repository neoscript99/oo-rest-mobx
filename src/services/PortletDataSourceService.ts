import { LivebosObject, transLivebosData } from './LivebosServerService';
import { DomainService } from './DomainService';
import { MobxDomainStore } from '../stores';
import { Entity } from './index';

export interface DataResult {
  //列表结果
  dataList?: any[];
  //单个对象结果
  dataItem?: any;
}

export class PortletDataSourceService extends DomainService<MobxDomainStore> {
  getData(portletDataSource: Entity): Promise<DataResult> {
    return this.restClient
      .post(`${this.apiPrefix()}/getPortletData`, { dataSourceId: portletDataSource.id })
      .then(jsonData => {
        if (portletDataSource.type === 'LivebosQuery') return transLivebosData(jsonData as LivebosObject);
        return { dataList: jsonData };
      });
  }
}
