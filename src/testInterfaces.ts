import { FieldBody, Optional } from './interfaces';

export interface GroupField<T extends { [name: string]: Optional<{ type: string }> }> {
  type: 'group';
  legend?: string;
  fields: T;
}

export interface NumberField extends FieldBody {
  type: 'number';
  value?: number;
  min?: number;
  max?: number;
}

export interface TextField extends FieldBody {
  type: 'text';
  value?: string;
}

export interface SubmitField {
  type: 'submit';
  label?: string;
  disabled?: boolean;
}
