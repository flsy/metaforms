import React from 'react';
import {storiesOf} from "@storybook/react";
import FormTemplate from "./FormTemplate";
import {AntBuilder} from "build-metaforms";

const form = new AntBuilder()
  .addInput('name')
  .addSubmit('submit', { label: 'Save' })
  .build()

storiesOf('antd-metaforms', module).add('input', () => <FormTemplate defaultForm={form}/>);

