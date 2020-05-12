export type Optional<T> = T | undefined;
export type Value = string | boolean | number | Date | undefined;

export interface FormData {
  [name: string]: Optional<Value>;
}

export interface Required {
  type: 'required';
  message: string;
}

export interface MinLength {
  type: 'minlength';
  value: number;
  message: string;
}

export interface MaxLength {
  type: 'maxlength';
  value: number;
  message: string;
}

export interface MustBeEqual {
  type: 'mustbeequal';
  value: Value;
  message: string;
}

export interface InList {
  type: 'inlist';
  value: Value[];
  message: string;
}

export interface Pattern {
  type: 'pattern';
  value: string;
  message: string;
}

export interface NotPattern {
  type: 'notpattern';
  value: string;
  message: string;
}

export interface Mustnotcontain {
  type: 'mustnotcontain';
  value: string;
  message: string;
}

export interface MustMatch {
  type: 'mustmatch';
  value: string;
  message: string;
}

export interface MustMatchCaseInsensitive {
  type: 'mustmatchcaseinsensitive';
  value: string;
  message: string;
}

export type Validation = InList | MustBeEqual | Required | MinLength | MaxLength | Pattern | NotPattern | Mustnotcontain | MustMatch | MustMatchCaseInsensitive;
