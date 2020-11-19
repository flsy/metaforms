import React from 'react';
import {storiesOf} from "@storybook/react";
import {Form} from "antd-metaforms";

const FormExample = () => {
  return <Form onSubmit={console.log} onFormChange={console.log} form={
    {
      name: {
        type: 'text',
        placeholder: 'Write text'
      }
    }
  }
  />
}

storiesOf('antd-metaforms', module).add('_form', FormExample);

