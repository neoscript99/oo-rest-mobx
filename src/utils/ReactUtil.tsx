import React from 'react';
import { StyleUtil } from './StyleUtil';
import { Form } from 'antd';
import { FormInstance } from 'antd/lib/form';

export interface FormComponentProps {
  form: FormInstance;
}
export class ReactUtil {
  static formWrapper<PP>(comp: React.ComponentType<PP>, mapPropName = 'inputItem'): React.FC<Omit<PP, 'form'>> {
    const formWrapper = (props) => {
      const [form] = Form.useForm();
      const inputItem = props[mapPropName];
      React.useEffect(() => {
        form.setFieldsValue(inputItem);
      }, [inputItem]);

      const pp = ({ ...props, form } as unknown) as PP;
      return React.createElement(comp, pp);
    };
    return formWrapper;
  }
  /*
   * antd4的form不再使用包装，改用Form.useForm获得实例
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
  }*/

  static hiddenTextRender(maxSize: number, value: React.ReactNode) {
    const HiddenText = StyleUtil.hiddenText(maxSize);
    return <HiddenText>{value}</HiddenText>;
  }

  static wordBreakTextRender(maxSize: number, value: React.ReactNode) {
    const BreakText = StyleUtil.wordBreakText(maxSize);
    return <BreakText>{value}</BreakText>;
  }
}
