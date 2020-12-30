import get from 'lodash/get';
import set from 'lodash/set';

export type NamePath = string | number | (string | number)[];

export class ObjectUtil {
  static get(item: any, path: NamePath) {
    return get(item, path);
  }
  static set(item: any, path: NamePath, value: any) {
    return set(item, path, value);
  }
}
