import { Validation } from './validate/interfaces';

export type Form<T extends { [name: string]: { type: string } }> = T;

export interface FieldBody {
  type: string;
  fields?: Field;
  value?: unknown;
  errorMessage?: string;
  validation?: Validation[];
}

export interface Field {
  [name: string]: FieldBody;
}

export type FormData<T extends Field> = { [key in keyof T]: T[key]['fields'] extends object ? FormData<T[key]['fields']> : T[key]['value'] };
