import { Validation, Value } from './validate/interfaces';

export type FieldType = InputProps | TextAreaProps | CheckboxProps | SelectProps | ButtonProps | SubmitProps | GroupProps | NumberProps;

export interface UpdateActionType {
  name: string;
  value: Value;
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
  type: string;
  validation?: Validation[];
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  errorMessage?: string;
  groupName?: string;
  placeholder?: string;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  fields?: FieldType[];
}

export interface CheckboxProps extends CommonProps {
  type: 'checkbox';
  value?: boolean;
}

export interface SelectProps extends CommonProps {
  type: 'select';
  value?: string | number;
  options?: { value: string | number; label?: string }[];
}

export interface InputProps extends CommonProps {
  type: 'text' | 'password' | 'email' | 'hidden' | 'date' | 'datetime-local';
  value?: string | number | Date;
}

export interface NumberProps extends CommonProps {
  type: 'number';
  value?: number;
  min?: number;
  max?: number;
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
