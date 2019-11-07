export type Optional<T> = T | undefined;
export type Value = Optional<string | boolean>;

export interface FormData {
  [name: string]: Optional<Value>;
}

export interface Required {
  type: 'required';
  rules: Array<{ message: string }>;
}

export interface MinLength {
  type: 'minlength';
  rules: Array<{ value: number; message: string }>;
}

export interface MaxLength {
  type: 'maxlength';
  rules: Array<{ value: number; message: string }>;
}

export interface MustBeEqual {
  type: 'mustbeequal';
  rules: Array<{ value: boolean; message: string }>;
}

export interface InList {
  type: 'inlist';
  rules: Array<{ value: Value[]; message: string }>;
}

export interface Pattern {
  type: 'pattern';
  rules: Array<{ value: string; message: string }>;
}

export interface NotPattern {
  type: 'notpattern';
  rules: Array<{ value: string; message: string }>;
}

export interface MustMatch {
  type: 'mustmatch';
  rules: Array<{ value: string; message: string }>;
}

export interface MustMatchCaseInsensitive {
  type: 'mustmatchcaseinsensitive';
  rules: Array<{ value: string; message: string }>;
}

export type Validation = InList | MustBeEqual | Required | MinLength | MaxLength | Pattern | NotPattern | MustMatch | MustMatchCaseInsensitive;
