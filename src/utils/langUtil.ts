import { Form } from 'antd';
import isPlainObject from 'lodash/isPlainObject';

const IGNORE_CLASS = ['ObserverComponent', 'Connect', 'Injector'];

export class LangUtil {
  static getClassName(instance: any) {
    let _this = instance;
    while (IGNORE_CLASS.indexOf(_this.constructor.name) > -1) _this = _this['__proto__'];
    return _this.constructor.name;
  }

  /**
   * Input: { user: { map: { a: '123424', b: { b1: 'XYZ' } } } }
   * Output: { 'user.map.a': '123424', 'user.map.b.b1': 'XYZ' }
   * @param object
   */
  static flattenObject(object: any, parentKey?: string): any {
    let flatten = {};
    for (const key in object) {
      const flattenKey = parentKey ? `${parentKey}.${key}` : key;
      const value = object[key];
      if (isPlainObject(value)) flatten = { ...flatten, ...LangUtil.flattenObject(value, flattenKey) };
      else flatten[flattenKey] = value;
    }
    return flatten;
  }
}
