import React from 'react';
import {Select as _Select} from 'antd';

export interface IInputProps {
  name: string;
  placeholder?: string;
  updateAndValidate: (name: string, value: any) => void;
  value?: any;
  options: Array<{ value: any, label: string }>
}

const _Option = _Select.Option;

const Select = React.forwardRef(({name, placeholder, updateAndValidate, value, options}: IInputProps, ref: React.Ref<any>) => {
  return (
    <_Select
      ref={ref}
      style={{width: "100%"}}
      value={value}
      onChange={(v) => updateAndValidate(name, v)}
    >
      {(options || []).map((option) => (
        <_Option value={option.value} key={option.value}>{option.label || option.value}</_Option>
      ))}
    </_Select>
  );
})

export default Select;