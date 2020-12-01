import React from 'react';
import {storiesOf} from "@storybook/react";
import FormTemplate from "./FormTemplate";
import {build, input, submit} from "@metaforms/builder";


const form = build(
  input('name'),
  submit('submit', { label: 'Save' })
)

storiesOf('antd-metaforms', module).add('input', () => <FormTemplate defaultForm={form}/>);

