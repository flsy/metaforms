import { Validation } from './validate/interfaces';

export type Optional<T> = T | undefined;
export type ValueOf<T> = T[keyof T];

export interface FieldBody {
  type: string;
  fields?: Field;
  value?: unknown;
  errorMessage?: string;
  validation?: Validation[];
}

export interface Field {
  [name: string]: Optional<FieldBody>;
}
export type IForm<T extends Field> = T;

type FieldValue<T extends FieldBody> = T['fields'] extends object ? FormData<T['fields']> : T['value'];

export type FormData<T extends Field> = {
  [key in keyof T]: T[key] extends object ? FieldValue<T[key]> : undefined;
};
