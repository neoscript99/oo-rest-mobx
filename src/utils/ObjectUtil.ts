import get from 'lodash/get';
import set from 'lodash/set';

export class ObjectUtil {
  static get(item: any, path: string) {
    return get(item, path);
  }
  static set(item: any, path: string, value: any) {
    return set(item, path, value);
  }
}
