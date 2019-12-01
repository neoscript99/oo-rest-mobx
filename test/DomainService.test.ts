import nodeFetch from 'node-fetch';
import { SpringBootClient, UserService, DeptService } from '../src';

const rootUrl = 'http://localhost:8080';
//@ts-ignore
const restClient = new SpringBootClient({ rootUrl, fetch: nodeFetch });
const userService = new UserService(restClient);
const deptService = new DeptService(restClient);

describe('Domain CURD', () => {
  it('user list and get', async () => {
    //嵌套属性排序，目前gorm不支持，可能是用了DetachedCriteria的原因，原来做客户经理考核的时候好像是支持的
    const data = await userService.listAll({
      criteria: { dept: { like: [['name', '%']] } },
      pageInfo: { currentPage: 1, pageSize: 2 },
      orders: ['dept.seq', 'name'],
    });

    expect(data).not.toBeNull();
    expect(data.totalCount).toBeGreaterThan(0);
    console.log(data.results[0].id);
    //expect(await userService.get(data.results[0].id)).toHaveProperty('name');
  });

  it('department create and update and delete', async () => {
    let department = await deptService.save({ name: 'GraphqlStoreTest', seq: 999, enabled: false });
    const id = department.id;
    expect(department.seq).toEqual(999);
    department = await deptService.save({ id, seq: 888 });
    expect(department.seq).toEqual(888);

    expect(await deptService.delete(department.id).then(data => data === 1)).toEqual(true);
  });
});
