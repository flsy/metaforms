import { Validation, Value } from './types';

export type FieldType = InputProps | TextAreaProps | CheckboxProps | SelectProps | ButtonProps | SubmitProps | GroupProps;

export interface UpdateActionType {
  name: string;
  value: string;
  groupName?: string;
}

export interface ValidateActionType {
  name: string;
}

export interface UpdateAndValidateActionType {
  name: string;
  value: Value;
  groupName?: string;
}

export interface CommonProps {
  name: string;

  validation?: Validation[];
  label?: string;
  disabled?: boolean;
  errorMessage?: string;
  groupName?: string;
  placeholder?: string;
  fields?: FieldType[];
}

export interface CheckboxProps extends CommonProps {
  type: 'checkbox';
  value?: boolean;
}

export interface SelectProps extends CommonProps {
  type: 'select';
  value?: string;
  options: string[];
}

export interface InputProps extends CommonProps {
  type: 'text' | 'password' | 'email';
  value?: string;
}

export interface TextAreaProps extends CommonProps {
  type: 'textarea';
  value?: string;
}

export interface ButtonProps extends CommonProps {
  type: 'button';
  value?: string;
  label: string;
}

export interface SubmitProps extends CommonProps {
  type: 'submit';
  value?: string;
}

export interface GroupProps extends CommonProps {
  type: 'group';
  name: string;
  value?: string;
  legend?: string;
  fields: FieldType[];
}
