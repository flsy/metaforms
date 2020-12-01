import {Form} from "@metaforms/antd";
import React, {useState} from "react";


const FormTemplate = ({ defaultForm }) => {
  const [form, setForm] = useState(defaultForm);

  return <Form onSubmit={console.log} form={form} onFormChange={setForm} />
}

export default FormTemplate;