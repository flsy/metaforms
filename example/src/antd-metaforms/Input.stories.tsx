import React from 'react';
import {storiesOf} from "@storybook/react";
import FormTemplate from "./FormTemplate";

const defaultForm = {
  name: {
    type: 'input',
    placeholder: 'Write something',
    label: 'Text input'
  },
  submit: {
    type: 'submit',
    label: 'Submit'
  }
}

storiesOf('antd-metaforms', module).add('input', () => <FormTemplate defaultForm={defaultForm}/>);

