import React from 'react';
import {storiesOf} from "@storybook/react";
import FormTemplate from "./FormTemplate";
// import {Select} from "antd-metaforms";

const defaultForm = {
  name: {
    type: 'select',
    placeholder: 'Select something',
    label: 'Select',
    value: "a",
    options: [
      {
        label: 'Option one',
        value: "a",
      },
      {
        label: 'Option two',
        value: "b",
      },
      {
        label: 'Option three',
        value: "c",
      }
    ]
  },
  submit: {
    type: 'submit',
    label: 'Submit'
  }
}

storiesOf('antd-metaforms', module).add('select', () => <FormTemplate defaultForm={defaultForm}/>);

