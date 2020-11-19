import React from 'react';
import { Input as _Input } from 'antd';
import 'antd/lib/input/style/index.css';

export interface IInputProps {
  name: string;
  placeholder?: string;
}

const Input = React.forwardRef(({ name, placeholder }: IInputProps, ref: React.Ref<any>) => {
  return <_Input name={name} placeholder={placeholder} ref={ref} />
})

export default Input;