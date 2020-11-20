import React from 'react';
import {storiesOf} from "@storybook/react";
import FormTemplate from "./FormTemplate";
import {AntBuilder} from "build-metaforms";

const builder = new AntBuilder()
  .addInput({ name: 'name', label: 'Text input', placeholder: "Write something" })
  .addSubmit({ name: 'submit', label: 'Submit' })

storiesOf('antd-metaforms', module).add('input', () => <FormTemplate defaultForm={builder.build()}/>);

