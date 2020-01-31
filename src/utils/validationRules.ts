import { ValidationRule } from 'antd/lib/form';
import moment, { unitOfTime } from 'moment';
import { DatePickerField } from '../ant-design-field';

/** built-in validation type, available options: https://github.com/yiminghe/async-validator#type */
export const commonRules: Readonly<{ [key: string]: ValidationRule }> = {
  required: { required: true, whitespace: true, message: '不能为空!' },
  json: { pattern: /^\{(\".+\":.+\,?)*\}$/, message: '请输入Json格式的字符串，例如：{"user":"one","on":true}' },
  email: { type: 'email', message: '邮箱格式错误' },
  numberRule: { required: true, type: 'number', message: '数字格式错误' },
  idCard: {
    validator: async (rule: ValidationRule, value: string) => {
      //空值校验有required处理
      if (!value) return;
      let result;
      try {
        result = CommonValidators.idCard(value);
      } catch (e) {
        console.error(e);
        throw new Error('身份证格式错误');
      }
      if (result && !result.success) {
        console.error(result);
        throw new Error(result.message);
      }
    },
  },
  idCardSimple: { pattern: /^\d{15,17}[\dX]$/, message: '身份证格式错误' },
};

export const genRules = {
  minString(min: number) {
    return { required: true, whitespace: true, min, message: `长度不能小于${min}!` };
  },
  momentDay(required = true) {
    return {
      ...(required && commonRules.required),
      type: 'object',
    };
  },
};

export const transforms = {
  momentToDateUnit(unit: unitOfTime.StartOf, value: moment.Moment) {
    return value && value.startOf(unit).date();
  },
  momentToDate(value: moment.Moment) {
    return value && value.date();
  },
  momentToDayString(value: moment.Moment) {
    return value && value.format('YYYY-MM-DD');
  },
  dateToMoment(value: any) {
    return value && moment(value);
  },
};

interface ValidatorResult {
  success: boolean;
  message?: string;
  info?: any;
}
export class CommonValidators {
  static idCard = (value: string): ValidatorResult => {
    if (typeof value !== 'string') return { success: false, message: '非法字符串' };
    const birthDayStr = value.substr(6, 4) + '-' + value.substr(10, 2) + '-' + value.substr(12, 2);
    const birthDay = moment(birthDayStr);
    const currentTime = new Date().getTime();
    const time = birthDay.toDate().getTime();
    const arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    if (!/^\d{17}(\d|x)$/i.test(value)) return { success: false, message: '格式错误' };
    if (idCardCity[value.substr(0, 2)] === undefined) return { success: false, message: '地区编码错误' };
    if (time >= currentTime || !birthDay.isValid()) return { success: false, message: '生日信息错误' };
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += parseInt(value.substr(i, 1)) * arrInt[i];
    }
    const residue = arrCh[sum % 11];
    if (residue !== value.substr(17, 1)) return { success: false, message: '不是有效的身份证' };

    return {
      success: true,
      info: {
        area: idCardCity[value.substr(0, 2)],
        birthDay: birthDayStr,
        sex: parseInt(value.substr(16, 1)) % 2 ? '男' : '女',
      },
    };
  };
}

// eslint-disable-next-line prettier/prettier
const idCardCity = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
