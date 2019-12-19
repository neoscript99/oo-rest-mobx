import { ValidationRule } from 'antd/lib/form';
import moment, { unitOfTime } from 'moment';

/** built-in validation type, available options: https://github.com/yiminghe/async-validator#type */
export const commonRules: { [key: string]: ValidationRule } = {
  required: { required: true, whitespace: true, message: '不能为空!' },
  json: { pattern: /^\{(\".+\":.+\,?)*\}$/, message: '请输入Json格式的字符串，例如：{"user":"one","on":true}' },
  email: { type: 'email', message: '邮箱格式错误' },
  numberRule: { type: 'number', message: '数字格式错误' },
};

export const genRules = {
  minString(min: number) {
    return { required: true, whitespace: true, min, message: `长度不能小于${min}!` };
  },
  momentDate(required = true, unit: unitOfTime.StartOf = 'millisecond') {
    return {
      ...(required && commonRules.required),
      type: 'date',
      transform: transforms.momentToDate.bind(undefined, unit),
    };
  },
};

export const transforms = {
  momentToDate(unit: unitOfTime.StartOf, value: moment.Moment) {
    return value && value.startOf(unit).date();
  },
};
