import { LangUtil } from './langUtil';
import { Form } from 'antd';
import React from 'react';

export class ReactUtil {
  static formWrapper<PP>(
    component: React.ComponentType<PP>,
    mapPropName = 'inputItem',
  ): React.ComponentType<Omit<PP, 'form'>> {
    const mapPropsToFields = ReactUtil.mapPropsToFields.bind(undefined, mapPropName);
    return Form.create({
      name: `ReactUtilForm_${new Date().toISOString()}`,
      mapPropsToFields,
    })(component as any);
  }

  static mapPropsToFields(mapPropName: string, props: any) {
    const inputItem = props[mapPropName];
    if (inputItem) {
      const flat = LangUtil.flattenObject(inputItem);
      for (const key in flat) {
        flat[key] = Form.createFormField({ value: flat[key] });
      }
      return flat;
    } else return;
  }
}
