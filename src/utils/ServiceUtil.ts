import { Criteria, CriteriaOrder, PageInfo } from '../services';

export class ServiceUtil {
  /**
   * 转换为gorm的分页模式
   *
   * @param criteria
   * @param currentPage
   * @param pageSize
   * @see org.grails.datastore.gorm.query.criteria.AbstractDetachedCriteria
   */
  static processCriteriaPage(criteria: Criteria, pageInfo: PageInfo): Criteria {
    //AbstractDetachedCriteria中的分页函数为max和offset
    criteria.maxResults = pageInfo.pageSize;
    criteria.firstResult = (pageInfo.currentPage - 1) * pageInfo.pageSize;
    return criteria;
  }

  /**
   * 将字符串嵌套排序字段转化为gorm可处理的格式
   * @param param 传入是为了在原参数上做增量修改，如:
   *  processOrderParam({user:{eq:[['name','admin']]}},[['user.age','desc']])=>{user:{eq:[['name','admin']],order:[['age','desc']]}}
   * @param orders
   */
  static processCriteriaOrder(criteria: Criteria, orders: CriteriaOrder[]) {
    //嵌套字段的排序criteria
    const orderList = orders.reduce((notNestOrders, order) => {
      if (typeof order === 'string') order = [order, 'asc'];
      if (order[0].indexOf('.') === -1) notNestOrders.push(order);
      else {
        //['user.age','desc']=>['user','age']
        const nestFields: string[] = order[0].split('.');
        //order = ['age','desc']
        order[0] = nestFields[nestFields.length - 1];

        let parentParam = criteria;
        nestFields.slice(0, -1).forEach(field => {
          if (!parentParam[field]) parentParam[field] = {};
          parentParam = parentParam[field] as Criteria;
        });

        if (parentParam.order) parentParam.order.push(order);
        else parentParam.order = [order];
      }
      return notNestOrders;
    }, [] as CriteriaOrder[]);
    if (orderList.length > 0) criteria.order = orderList;
  }

  static clearEntity(entity: any, ...deleteProps: string[]) {
    const { id, lastUpdated, dateCreated, version, errors, ...rest } = entity;
    deleteProps.every(prop => delete rest[prop]);
    return rest;
  }
}
