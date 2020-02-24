import get from 'lodash/get';

export class ObjectUtil {
  static get(item: any, path: string) {
    return get(item, path);
  }
}
