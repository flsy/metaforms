import React from 'react';
import MetaForm, {Field, FormProps} from 'react-metaforms';
import Input from "./components/Input";

interface IProps<F extends Field> {
  form?: F;
  onSubmit: FormProps<F>['onSubmit'];
  onFormChange: FormProps<F>['onFormChange'];
}

const Form = <Form extends Field>({ form, onSubmit, onFormChange }: IProps<Form>) => {
  return (
    <MetaForm<Form>
      onSubmit={onSubmit}
      form={form || ({} as Form)}
      onFormChange={onFormChange}
      components={({ component, ref }) => {

        // @ts-ignore
        switch (component.type) {
          case 'text':
            return <Input key={component.name} name={component.name} placeholder={component.placeholder} ref={ref} />;
          default:
            return;
        }
      }}
    />
  );
};

export default Form;
