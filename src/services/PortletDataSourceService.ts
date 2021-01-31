import { LivebosObject, transLivebosData } from './LivebosServerService';
import { DomainService } from './DomainService';
import { Entity } from './index';

export interface DataResult {
  //列表结果
  dataList?: any[];
  //单个对象结果
  dataItem?: any;
}

export class PortletDataSourceService extends DomainService {
  getData(portletDataSource: Entity): Promise<DataResult> {
    return this.restClient
      .post(this.getApiUri('getPortletData'), { dataSourceId: portletDataSource.id })
      .then((jsonData) => {
        if (portletDataSource.type === 'LivebosQuery') return transLivebosData(jsonData as LivebosObject);
        return { dataList: jsonData };
      });
  }
}
