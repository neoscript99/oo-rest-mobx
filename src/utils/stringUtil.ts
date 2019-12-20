import moment from 'moment';

export class StringUtil {
  static dateStringConvert(fromDateFormat: string, toDateFormat: string, text: string) {
    if (text && fromDateFormat && toDateFormat) return moment(text, fromDateFormat).format(toDateFormat);
    else return text;
  }

  static isNotBlank(value: string | null | undefined): boolean {
    return value && value.trim().length > 0 ? true : false;
  }

  static isBlank(value: string | null | undefined): boolean {
    return !StringUtil.isNotBlank(value);
  }
}
