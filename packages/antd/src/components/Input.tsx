import React from 'react';
import {Input as _Input} from 'antd';

export interface IInputProps {
  name: string;
  placeholder?: string;
  updateAndValidate: (name: string, value: any) => void;
  value?: any;
}

const Input = React.forwardRef(({name, placeholder, value, updateAndValidate}: IInputProps, ref: React.Ref<any>) => {
  return <_Input
    value={value}
    onChange={(event) => updateAndValidate(name, event.target.value)}
    name={name}
    placeholder={placeholder}
    ref={ref}
  />
})

export default Input;