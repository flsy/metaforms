import { InList, IsNumber, Max, MaxLength, Min, MinLength, MustBeEqual, MustMatch, MustMatchCaseInsensitive, MustNotContain, NotPattern, Pattern, Required } from './interfaces';

export const required = (message: string): Required => ({
  type: 'required',
  message,
});

export const min = (message: string, value: number): Min => ({
  type: 'min',
  message,
  value,
});

export const max = (message: string, value: number): Max => ({
  type: 'max',
  message,
  value,
});

export const isNumber = (message: string): IsNumber => ({
  type: 'isNumber',
  message,
});

export const minlength = (message: string, value: number): MinLength => ({
  type: 'minlength',
  message,
  value,
});

export const maxlength = (message: string, value: number): MaxLength => ({
  type: 'maxlength',
  message,
  value,
});

export const pattern = (message: string, value: string): Pattern => ({
  type: 'pattern',
  message,
  value,
});

export const notpattern = (message: string, value: string): NotPattern => ({
  type: 'notpattern',
  message,
  value,
});

export const mustnotcontain = (message: string, value: string): MustNotContain => ({
  type: 'mustnotcontain',
  message,
  value,
});

export const mustmatch = (message: string, value: string): MustMatch => ({
  type: 'mustmatch',
  message,
  value,
});

export const mustmatchcaseinsensitive = (message: string, value: string): MustMatchCaseInsensitive => ({
  type: 'mustmatchcaseinsensitive',
  message,
  value,
});

export const mustbeequal = (message: string, value: number | string | boolean): MustBeEqual => ({
  type: 'mustbeequal',
  message,
  value,
});

export const inList = (message: string, value: string[]): InList => ({
  type: 'inlist',
  message,
  value,
});
