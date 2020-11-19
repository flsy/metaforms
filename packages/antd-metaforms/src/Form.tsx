import React from 'react';
import MetaForm, {Field, FormProps} from 'react-metaforms';
import Input from "./components/Input";

import 'antd/dist/antd.css';
import {Button, Select} from "./components";

interface IProps<F extends Field> {
  form?: F;
  onSubmit: FormProps<F>['onSubmit'];
  onFormChange: FormProps<F>['onFormChange'];
}

const Form = <Form extends Field>({form, onSubmit, onFormChange}: IProps<Form>) => {
  return (
    <MetaForm<Form>
      onSubmit={onSubmit}
      form={form || ({} as Form)}
      onFormChange={onFormChange}
      components={({component, ref, actions, name}) => {

        // @ts-ignore
        switch (component.type) {
          case 'input':
            // @ts-ignore
            return <Input {...actions} key={name} name={name} label={component.label}
                          placeholder={component.placeholder} value={component.value} ref={ref}/>;
          case 'submit':
            // @ts-ignore
            return <Button htmlType="submit" key={name} name={name} label={component.label} ref={ref}/>
          case 'select':
            // @ts-ignore
            return <Select {...actions} key={name} name={name} label={component.label}
                           placeholder={component.placeholder} options={component.options} value={component.value} ref={ref}/>
          default:
            return;
        }
      }}
    />
  );
};

export default Form;
