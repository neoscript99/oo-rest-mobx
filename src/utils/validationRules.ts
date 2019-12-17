import { ValidationRule } from 'antd/lib/form';
import moment from 'moment';

/** built-in validation type, available options: https://github.com/yiminghe/async-validator#type */
export const commonRules: { [key: string]: ValidationRule } = {
  required: { required: true, whitespace: true, message: '不能为空!' },
  json: { pattern: /^\{(\".+\":.+\,?)*\}$/, message: '请输入Json格式的字符串，例如：{"user":"one","on":true}' },
};

export const genRules = {
  minString(min: number) {
    return { required: true, whitespace: true, min, message: `长度不能小于${min}!` };
  },
};

export const transforms = {
  momentToDay(value: moment.Moment) {
    return value && value.startOf('day').date();
  },
};
