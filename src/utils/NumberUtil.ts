import _round from 'lodash/round';
export class NumberUtil {
  static round(n: number, precision?: number): number {
    return _round(n, precision);
  }
}
