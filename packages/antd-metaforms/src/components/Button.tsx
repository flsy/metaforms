import React from 'react';
import {Button as _Button} from 'antd';

export interface IButtonProps {
  name: string;
  label: string;
  htmlType?: "button" | "submit" | "reset";
}

const Button = React.forwardRef(({name, label, htmlType}: IButtonProps, ref: React.Ref<any>) => {
  return <_Button name={name} htmlType={htmlType} ref={ref}>{label}</_Button>
})

export default Button;