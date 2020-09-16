import { Validation } from './validate/interfaces';

interface CommonProps {
  type: string;
  validation?: Validation[];
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  errorMessage?: string;
  placeholder?: string;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
}

export interface CheckboxInput extends CommonProps {
  type: 'checkbox';
  value?: boolean;
}

// export interface SelectInput extends CommonProps {
//   type: 'select';
//   value?: string | number;
//   options?: { value: string | number; label?: string }[];
// }

export interface InputProps extends CommonProps {
  type: 'text' | 'password' | 'email' | 'hidden' | 'date' | 'datetime-local';
  value?: string;
}

export interface TextField extends CommonProps {
  type: 'text';
  value?: string;
}

export interface PasswordField extends CommonProps {
  type: 'password';
  value?: string;
}

export interface NumberField extends CommonProps {
  type: 'number';
  value?: number;
  min?: number;
  max?: number;
}

export interface TextAreaField extends CommonProps {
  type: 'textarea';
  value?: string;
}

export interface GroupField<T extends { [name: string]: { type: string } }> {
  type: 'group';
  legend?: string;
  fields: T;
}

export interface ButtonField {
  type: 'button';
  label?: string;
  disabled?: boolean;
}

export interface SubmitField {
  type: 'submit';
  label?: string;
  disabled?: boolean;
}

export type Form<T extends { [name: string]: { type: string } }> = T;

export interface FieldBody<Value = unknown> {
  type: string;
  fields?: Field;
  value?: Value;
  errorMessage?: string;
  validation?: Validation[];
}

export interface Field {
  [name: string]: FieldBody<unknown>;
}

export type FormData<T extends Field> = { [key in keyof T]: T[key]['fields'] extends object ? FormData<T[key]['fields']> : T[key]['value'] };
