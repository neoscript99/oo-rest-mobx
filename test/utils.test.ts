import { Criteria, CriteriaOrder } from '../src/services';
import moment = require('moment');
import { LangUtil, StringUtil, ServiceUtil } from '../src/utils';

describe('pureGraphqlObject', () => {
  it('string util', () => {
    for (let i = 0; i < 10; i++) console.log(StringUtil.randomString(128));
  });

  it('processCriteriaOrder test', () => {
    const criteria: Criteria = {};
    const orders: CriteriaOrder[] = ['aa', ['bb', 'desc'], ['cc.name', 'asc']];
    ServiceUtil.processCriteriaOrder(criteria, orders);
    console.debug(criteria);
    expect(criteria).toEqual({
      order: [
        ['aa', 'asc'],
        ['bb', 'desc'],
      ],
      cc: { order: [['name', 'asc']] },
    });

    const criteria2: Criteria = {};
    ServiceUtil.processCriteriaOrder(criteria2, ['portal.seq', 'rowOrder']);
    console.debug(criteria2);
    expect(criteria2).toEqual({ order: [['rowOrder', 'asc']], portal: { order: [['seq', 'asc']] } });
  });

  it('moment test', () => {
    console.log(moment.isMoment(null));
    console.log(moment.isMoment(undefined));
    const m = moment();
    console.log(m.format());
    console.log(m.format('MMDDHHmmssSSS'));
    console.log(m.format().substr(0, 10));
    console.log(typeof m);
    console.log(typeof m.date());
    console.log(LangUtil.getClassName(m));
  });
});
