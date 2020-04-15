export type Optional<T> = T | undefined;
export type Value = string | boolean | number | Date | undefined;

export interface FormData {
  [name: string]: Optional<Value>;
}

export interface Required {
  type: 'required';
  rules: { message: string }[];
}

export interface MinLength {
  type: 'minlength';
  rules: { value: number; message: string }[];
}

export interface MaxLength {
  type: 'maxlength';
  rules: { value: number; message: string }[];
}

export interface MustBeEqual {
  type: 'mustbeequal';
  rules: { value: Value; message: string }[];
}

export interface InList {
  type: 'inlist';
  rules: { value: Value[]; message: string }[];
}

export interface Pattern {
  type: 'pattern';
  rules: { value: string; message: string }[];
}

export interface NotPattern {
  type: 'notpattern';
  rules: { value: string; message: string }[];
}

export interface Mustnotcontain {
  type: 'mustnotcontain';
  rules: { value: string; message: string }[];
}

export interface MustMatch {
  type: 'mustmatch';
  rules: { value: string; message: string }[];
}

export interface MustMatchCaseInsensitive {
  type: 'mustmatchcaseinsensitive';
  rules: { value: string; message: string }[];
}

export type Validation = InList | MustBeEqual | Required | MinLength | MaxLength | Pattern | NotPattern | Mustnotcontain | MustMatch | MustMatchCaseInsensitive;
